# Lumina Deployment Guide - Digital Ocean

## Infrastructure Overview

| Service | Provider | Details |
|---------|----------|---------|
| **Hosting** | Digital Ocean App Platform | Next.js application |
| **Database** | Digital Ocean PostgreSQL | Managed PostgreSQL cluster |
| **Authentication** | Clerk | User authentication |
| **Domain** | Your registrar | Custom domain |

---

## Pre-Deployment Checklist

### 1. Assets to Add (Manual)

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

Set these environment variables in Digital Ocean App Platform:

```bash
# Database (Digital Ocean PostgreSQL)
DATABASE_URL=postgresql://doadmin:PASSWORD@your-db.db.ondigitalocean.com:25060/defaultdb?sslmode=require

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# External APIs
FRED_API_KEY=your_fred_api_key
RENTCAST_API_KEY=your_rentcast_api_key
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=real-estate101.p.rapidapi.com
```

---

## Step 3: Deploy to Digital Ocean App Platform

### Option A: Deploy via GitHub Integration (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Connect to Digital Ocean:**
   - Go to [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Select "GitHub" as source
   - Choose your repository and branch (main)

3. **Configure Build Settings:**
   - **Build Command:** `npm run build`
   - **Run Command:** `npm run start`
   - **HTTP Port:** `3000`

4. **Add Environment Variables:**
   - Go to App Settings → App-Level Environment Variables
   - Add all variables from the list above
   - Mark sensitive values (API keys, secrets) as encrypted

5. **Click "Deploy"**

### Option B: Deploy via doctl CLI

1. **Install doctl:**
   ```bash
   brew install doctl
   ```

2. **Authenticate:**
   ```bash
   doctl auth init
   ```

3. **Create App Spec:**
   Create `app.yaml` in your project root:
   ```yaml
   name: lumina
   region: nyc
   services:
     - name: web
       github:
         repo: yourusername/Lumina-Platform
         branch: main
       build_command: npm run build
       run_command: npm run start
       http_port: 3000
       instance_size_slug: basic-xxs
       instance_count: 1
       routes:
         - path: /
   databases:
     - engine: PG
       name: lumina-db
       production: true
   ```

4. **Deploy:**
   ```bash
   doctl apps create --spec app.yaml
   ```

---

## Step 4: Database Configuration

Your Digital Ocean PostgreSQL database is already configured:

- **Host:** `db-postgresql-nyc3-xxxxx-do-user-xxxxx-0.f.db.ondigitalocean.com`
- **Port:** `25060`
- **Database:** `defaultdb`
- **SSL Mode:** `require` (mandatory)

### Run Migrations (if using Prisma)
```bash
npx prisma migrate deploy
```

### Verify Connection
```bash
npx prisma db pull
```

---

## Step 5: Post-Deployment

### Custom Domain Setup
1. Go to Digital Ocean App Platform → Your App → Settings → Domains
2. Add your custom domain (e.g., `lumina.finance`)
3. Update DNS records at your domain registrar:
   - Add a CNAME record pointing to your DO app URL

### SSL Certificate
- Digital Ocean automatically provisions SSL certificates via Let's Encrypt
- No additional configuration needed

### Update Metadata URLs
After deployment, update these files with your production URL:

**`app/layout.tsx`** - Update metadataBase:
```typescript
url: 'https://your-domain.com', // Update this
```

**`app/robots.ts`**:
```typescript
sitemap: 'https://your-domain.com/sitemap.xml',
```

**`app/sitemap.ts`**:
```typescript
const baseUrl = 'https://your-domain.com'
```

---

## Step 6: Verify Deployment

After deployment, verify these URLs work:
- ✅ `https://your-domain.com` (Landing page)
- ✅ `https://your-domain.com/robots.txt`
- ✅ `https://your-domain.com/sitemap.xml`
- ✅ `https://your-domain.com/apply`
- ✅ `https://your-domain.com/login`
- ✅ `https://your-domain.com/dashboard` (after auth)

### SEO Verification
- Test OpenGraph tags: [opengraph.xyz](https://www.opengraph.xyz)
- Test Twitter Cards: [cards-dev.twitter.com](https://cards-dev.twitter.com/validator)
- Run Lighthouse audit in Chrome DevTools

---

## Troubleshooting

### Build Fails
- Check environment variables are set correctly in DO App Settings
- Verify all dependencies are in `package.json`
- Run `npm run build` locally first
- Check build logs in DO App Platform

### Database Connection Issues
- Ensure `DATABASE_URL` includes `?sslmode=require`
- Verify your app is in the same region as the database
- Check that the database cluster is running
- Add your app to the database's trusted sources

### 404 on Routes
- Ensure Next.js is configured for Node.js runtime
- Verify `output: 'standalone'` is set in `next.config.js` for DO

### API Routes Not Working
- Check environment variables are accessible
- Verify API keys are valid
- Check CORS settings if calling from external domains

---

## Performance Optimization

After deployment, consider:
1. **Enable Auto-Scaling** in DO App Platform for high traffic
2. **Add Monitoring** - Enable DO Insights or integrate Sentry
3. **Database Optimization** - Add read replicas if needed
4. **CDN** - Consider Cloudflare in front of DO for caching

---

## Security Checklist

- ✅ Environment variables are set in DO App Platform (not in code)
- ✅ `.env.local` is in `.gitignore`
- ✅ Database uses SSL (`sslmode=require`)
- ✅ HTTPS is enabled (automatic with DO)
- ✅ API keys are encrypted in DO settings
- ✅ Database is in private VPC (DO managed)

---

## Digital Ocean Resources

- **App Platform Dashboard:** https://cloud.digitalocean.com/apps
- **Database Dashboard:** https://cloud.digitalocean.com/databases
- **Monitoring:** https://cloud.digitalocean.com/monitoring
- **Documentation:** https://docs.digitalocean.com/products/app-platform/

---

**You're ready to deploy to Digital Ocean!** 🚀🌊
