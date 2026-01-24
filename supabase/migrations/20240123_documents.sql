-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    category TEXT DEFAULT 'lender_doc', -- 'lender_doc', 'client_upload', 'disclosure'
    status TEXT DEFAULT 'pending', -- 'pending', 'verified'
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own documents"
    ON documents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents"
    ON documents FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can insert documents"
    ON documents FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update documents"
    ON documents FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete documents"
    ON documents FOR DELETE
    USING (public.is_admin());

-- Storage Bucket Setup (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Admins can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'documents' 
    AND public.is_admin()
);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'documents'
    AND (
        -- Admin can view all
        public.is_admin()
        OR 
        -- User can view files where the path starts with their user_id (common pattern)
        -- OR we check against the database table (more complex in storage policies)
        -- Simpler approach: Allow read if they are the owner of the folder
        (storage.foldername(name))[1] = auth.uid()::text
    )
);
