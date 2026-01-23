-- ============================================
-- ADMIN PORTAL MVP - DATABASE MIGRATION
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- ============================================

-- 1. PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Client-submitted data (from application flow)
    product_type TEXT, -- purchase, refinance, heloc
    property_type TEXT, -- single_family, condo, etc.
    property_usage TEXT, -- primary, secondary, investment
    property_value NUMERIC,
    loan_amount NUMERIC,
    zip_code TEXT,
    employment_status TEXT,
    annual_income NUMERIC,
    liquid_assets NUMERIC,
    
    -- Admin-entered data
    credit_score INTEGER,
    credit_score_source TEXT, -- experian, equifax, transunion
    credit_score_date DATE,
    credit_notes TEXT,
    dti_ratio NUMERIC,
    
    -- Status & workflow
    status TEXT DEFAULT 'pending', -- pending, in_review, offers_ready, completed, cancelled
    admin_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    offers_published_at TIMESTAMPTZ
);

-- Enable RLS on applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Applications policies
CREATE POLICY "Users can view own applications" ON public.applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON public.applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications" ON public.applications
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can update all applications" ON public.applications
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );


-- 3. LENDER OFFERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.lender_offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    
    -- Lender info
    lender_name TEXT NOT NULL,
    lender_nmls TEXT,
    
    -- Loan terms
    interest_rate NUMERIC NOT NULL,
    apr NUMERIC,
    monthly_payment NUMERIC,
    loan_term INTEGER, -- 15, 20, 30 years
    loan_type TEXT, -- conventional, fha, va, jumbo
    
    -- Costs
    points NUMERIC DEFAULT 0,
    origination_fee NUMERIC,
    closing_costs NUMERIC,
    
    -- Rate lock
    rate_lock_days INTEGER,
    rate_lock_expires DATE,
    
    -- Admin flags
    is_recommended BOOLEAN DEFAULT FALSE,
    admin_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on lender_offers
ALTER TABLE public.lender_offers ENABLE ROW LEVEL SECURITY;

-- Lender offers policies
CREATE POLICY "Users can view offers for own applications" ON public.lender_offers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.applications 
            WHERE applications.id = lender_offers.application_id 
            AND applications.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all offers" ON public.lender_offers
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );


-- 4. ADMIN ACTIVITY LOG (Audit Trail)
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL, -- created_offer, updated_credit, changed_status, etc.
    target_type TEXT, -- application, offer
    target_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on activity log
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view/insert activity logs
CREATE POLICY "Admins can view activity log" ON public.admin_activity_log
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can insert activity log" ON public.admin_activity_log
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );


-- 5. HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to applications
DROP TRIGGER IF EXISTS update_applications_updated_at ON public.applications;
CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON public.applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to lender_offers
DROP TRIGGER IF EXISTS update_lender_offers_updated_at ON public.lender_offers;
CREATE TRIGGER update_lender_offers_updated_at
    BEFORE UPDATE ON public.lender_offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- 6. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_lender_offers_application_id ON public.lender_offers(application_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_id ON public.admin_activity_log(admin_id);


-- ============================================
-- IMPORTANT: After running this migration,
-- manually set your account as admin:
-- 
-- UPDATE public.profiles 
-- SET is_admin = TRUE 
-- WHERE email = 'your-email@example.com';
-- ============================================
