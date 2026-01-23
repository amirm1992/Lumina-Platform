# Lumina Deployment Guide

## Pre-Deployment Checklist

### 1. Assets to Add (Manual)
Since image generation is unavailable, you'll need to create these assets:

#### **favicon.ico** (32x32px or 16x16px)
- Location: `/public/favicon.ico`
- Design: Simple "L" lettermark in purple/blue gradient
- Tool: Use [favicon.io](https://favicon.io) or [realfavicongenerator.net](https://realfavicongenerator.net)

#### **og-image.png** (1200x630px)
- Location: `/public/og-image.png`
- Content: "Lumina - AI-Powered Mortgage Platform" with brand colors
- Tool: Use Canva, Figma, or [og-image.xyz](https://og-image.xyz)

#### **apple-touch-icon.png** (180x180px)
- Location: `/public/apple-touch-icon.png`
- Same design as favicon but larger

---

## Step 2: Environment Variables

Create a `.env.production` file with these variables:

```bash
# Supabase (Authentication)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# FRED API (Mortgage Rates)
FRED_API_KEY=your_fred_api_key

# RapidAPI (Property Data)
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=real-estate101.p.rapidapi.com

# Google Places (Optional - if using autocomplete)
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_api_key
```

---

## Step 3: Deploy to Vercel (Recommended)

### Option A: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Add Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from `.env.production`

### Option B: Deploy via GitHub Integration

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Production ready"
   git branch -M main
   git remote add origin https://github.com/yourusername/lumina.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Add environment variables in the deployment settings
   - Click "Deploy"

---

## Step 4: Deploy to Netlify (Alternative)

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variables in Netlify Dashboard

---

## Step 5: Post-Deployment

### Custom Domain Setup
1. Go to your hosting dashboard (Vercel/Netlify)
2. Navigate to Domains
3. Add your custom domain (e.g., `lumina.finance`)
4. Update DNS records as instructed

### SSL Certificate
- Both Vercel and Netlify provide automatic SSL certificates
- No additional configuration needed

### Update Metadata URLs
After deployment, update these files with your production URL:

**`app/layout.tsx`** - Line 22:
```typescript
url: 'https://your-domain.com', // Update this
```

**`app/robots.ts`** - Line 9:
```typescript
sitemap: 'https://your-domain.com/sitemap.xml', // Update this
```

**`app/sitemap.ts`** - Line 4:
```typescript
const baseUrl = 'https://your-domain.com' // Update this
```

---

## Step 6: Verify Deployment

After deployment, verify these URLs work:
- ✅ `https://your-domain.com` (Landing page)
- ✅ `https://your-domain.com/robots.txt`
- ✅ `https://your-domain.com/sitemap.xml`
- ✅ `https://your-domain.com/apply`
- ✅ `https://your-domain.com/login`

### SEO Verification
- Test OpenGraph tags: [opengraph.xyz](https://www.opengraph.xyz)
- Test Twitter Cards: [cards-dev.twitter.com](https://cards-dev.twitter.com/validator)
- Run Lighthouse audit in Chrome DevTools

---

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Verify all dependencies are in `package.json`
- Run `npm run build` locally first

### 404 on Routes
- Ensure you're using Next.js 14+ compatible hosting
- Verify `output: 'standalone'` is NOT set in `next.config.js`

### API Routes Not Working
- Check environment variables are accessible
- Verify API keys are valid
- Check CORS settings if calling from external domains

---

## Performance Optimization (Optional)

After deployment, consider:
1. **Enable Edge Functions** (Vercel) for faster API responses
2. **Add Analytics** (Vercel Analytics or Google Analytics)
3. **Set up Monitoring** (Sentry for error tracking)
4. **Configure CDN** (Already handled by Vercel/Netlify)

---

## Security Checklist

- ✅ Environment variables are set on hosting platform (not in code)
- ✅ `.env.local` is in `.gitignore`
- ✅ API keys are restricted to your domain
- ✅ HTTPS is enabled (automatic with Vercel/Netlify)
- ✅ Supabase RLS policies are configured

---

**You're ready to deploy!** 🚀
