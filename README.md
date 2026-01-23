# Lumina - AI-Powered Mortgage Platform

> Simplifying Home Financing

A modern, AI-powered mortgage platform built with Next.js 14, featuring instant pre-approvals, intelligent rate comparison, and a 100% digital workflow.

## 🚀 Features

- **AI-Driven Rate Comparison**: Real-time mortgage rates from FRED API
- **Smart Property Search**: Integrated property lookup with RapidAPI
- **Secure Authentication**: Powered by Supabase
- **Interactive Dashboard**: Lender comparison, payment breakdown, market trends
- **Document Management**: Centralized DocHub for all mortgage documents
- **Responsive Design**: Optimized for desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase
- **State Management**: Zustand
- **Charts**: Recharts
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/lumina.git
   cd lumina
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Then fill in your API keys in `.env.local`

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick deploy:**
```bash
./deploy.sh
```

## 📁 Project Structure

```
lumina/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── apply/             # Mortgage application wizard
│   ├── dashboard/         # User dashboard
│   ├── properties/        # Property management
│   ├── messages/          # Messaging system
│   └── dochub/            # Document hub
├── components/            # React components
│   ├── landing/          # Landing page components
│   ├── dashboard/        # Dashboard widgets
│   ├── apply/            # Application flow components
│   └── layout/           # Layout components
├── utils/                # Utility functions
├── public/               # Static assets
└── .env.example          # Environment variables template
```

## 🔑 Required API Keys

1. **Supabase** - Authentication & Database
   - Sign up at [supabase.com](https://supabase.com)
   
2. **FRED API** - Mortgage Rate Data
   - Get key at [fred.stlouisfed.org](https://fred.stlouisfed.org/docs/api/api_key.html)
   
3. **RapidAPI** - Property Data
   - Subscribe at [rapidapi.com](https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-estate101)

## 🎨 Design System

- **Primary Colors**: Purple (#9333EA), Blue (#3B82F6)
- **Background**: White (#FFFFFF), Light Gray (#F9FAFB)
- **Text**: Black (#000000), Gray (#6B7280)
- **Buttons**: Black primary, Gray secondary
- **Accents**: Purple/Blue gradients

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Security

- Environment variables are never committed
- API keys are server-side only
- Supabase Row Level Security (RLS) enabled
- HTTPS enforced in production

## 📄 License

Private - All Rights Reserved

## 🤝 Contributing

This is a private project. Contact the maintainer for contribution guidelines.

---

Built with ❤️ by the Lumina team
