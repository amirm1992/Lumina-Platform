# ENTERPRISE REFACTOR PLAN - Lumina Platform

## 🎯 Executive Summary
This document outlines the strategic refactoring plan to elevate the Lumina Platform to FAANG-level quality. The focus is on Scalability, SEO, Performance, and Maintainability.

**Current State Audit:**
- ✅ Modern Stack (Next.js 14, Tailwind, Clerk, Prisma)
- ✅ Basic Metadata present
- ⚠️ Structure is generic (`components/` buckets) rather than Feature-First
- ⚠️ Missing centralized `services/` layer (API logic likely scattered)
- ⚠️ SEO validation and Structured Data missing

---

## 🏗 Phase 1: Architecture Restructuring (Feature-Slice Design)
We will move from Layer-based grouping (all components together) to Feature-based grouping.

### 1.1 Directory Structure Evolution
```diff
src/
  app/            # Routing & Layouts ONLY
+ features/       # Business Logic & UI Domains
+   landing/      # Landing Page Feature
+     components/
+     hooks/
+   dashboard/    # Dashboard Feature
+   auth/         # Auth Feature
+   mortgage/     # Mortgage Logic
+ lib/            # Shared Utilities (Zod, utils, constants)
+ services/       # External API Interfaces (FRED, RapidAPI, DB)
+ hooks/          # Global Shared Hooks
  components/     # GENERIC UI (Buttons, Inputs - Design System)
```

### 1.2 Action Items
1.  **Create Directory Structure**: Initialize `features`, `services`, `hooks`.
2.  **Migrate Components**: Move `components/landing` → `features/landing`.
3.  **Centralize Services**: Create `services/fred-api.ts`, `services/property-api.ts`.
4.  **Design System**: Ensure `components/ui` contains *only* dumb, reusable components.

---

## 🚀 Phase 2: Next.js Performance & Rendering
Optimize the Rendering Strategy for maximum speed and Core Web Vitals.

### 2.1 Server Components First
1.  Audit all `use client` directives.
2.  **Action**: Move interactive logic (state, effects) to "Leaf Components".
3.  **Action**: Keep Page and Layout files as Server Components.

### 2.2 Optimization Techniques
1.  **Images**: Enforce `next/image` with proper sizes/formats for Hero/Lottie.
2.  **Streaming**: Implement `loading.tsx` and `<Suspense>` for dashboard data fetching.
3.  **Fonts**: Optimize `next/font` loading strategies.

---

## 🔍 Phase 3: Enterprise SEO Architecture
Build SEO into the DNA of the application.

### 3.1 Metadata Engine
1.  **Dynamic Metadata**: Implement `generateMetadata()` for all dynamic routes.
2.  **Canonical URLs**: Enforce canonical tags on all pages.
3.  **Robots & Sitemap**: Ensure `robots.txt` and `sitemap.xml` are dynamic and accurate.

### 3.2 Structured Data (JSON-LD)
Implement Schema.org definitions for:
-   **Organization**: Lumina Financial
-   **FinancialProduct**: Mortgage offerings
-   **FAQ**: For landing page
-   **Breadcrumbs**: For navigation depth

### 3.3 Semantic HTML
Audit `Hero.tsx` and Landing pages for:
-   Single `<h1>` per page.
-   Proper heading hierarchy (`h2` -> `h3`).
-   Semantic landmarks (`<nav>`, `<main>`, `<footer>`, `<article>`).

---

## 🛡️ Phase 4: Data Layer & Security
Hardening the backend and data flow.

### 4.1 Type-Safe API Layer
1.  **Zod Validation**: specific schemas for all API inputs.
2.  **Typed Responses**: Generic `ApiResponse<T>` interfaces.
3.  **Centralized Fetcher**: A wrapper around `fetch` for error handling and standard headers.

### 4.2 Security Best Practices
1.  **Headers**: Implement `security-headers.ts` middleware (CSP, X-Frame-Options).
2.  **Rate Limiting**: Add basic rate limiting for public APIs.
3.  **Env Validation**: Ensure `process.env` validation at startup.

---

## 🧪 Phase 5: Reliability & Polish
The "Fintech" level of trust and finish.

### 5.1 UX States
1.  **Loading**: Skeleton loaders for dashboard widgets.
2.  **Error**: Graceful `error.tsx` boundaries.
3.  **Empty**: "No properties found" empty states.

### 5.2 Accessibility (a11y)
1.  **Keyboard Nav**: Ensure focus management.
2.  **ARIA**: Valid attributes for interactive elements (sliders, toggles).

---

## 📅 Implementation Roadmap

1.  **Step 1**: Reorganize file structure to Feature-First (`features/`, `services/`).
2.  **Step 2**: Refactor `Hero.tsx` and Landing to be the "Gold Standard" implementation (Server Components, SEO, Feature folder).
3.  **Step 3**: Implement SEO Overlay (JSON-LD, Metadata).
4.  **Step 4**: Harden Styles & Components (Design System cleanup).
5.  **Step 5**: Final Security & Performance Audit.

**Ready to proceed with Step 1?**
