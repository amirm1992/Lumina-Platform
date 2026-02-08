# Admin Backend & Consumer Dashboard — Technical Analysis & Refinement Plan

**Purpose:** Analyze the current admin/offer backend and consumer dashboard, then outline a technical plan to refine it into a top-tier flow: admin chooses applications, feeds complete offer data (e.g. from Arive PPE), and consumers see a consistent 6-lender card experience with real offers or “Calculating savings…” placeholders.

---

## 1. Current State Analysis

### 1.1 Data Model (Prisma)

| Model | Purpose | Notes |
|-------|---------|--------|
| **Application** | One per consumer submission | Has `userId` / `newUserId`, loan details, credit (admin-filled), `status`, `offersPublishedAt`. No link to “expected lenders.” |
| **LenderOffer** | One row per lender offer per application | `applicationId`, `lenderName`, `lenderLogo`, `productName` (used for loan_type), `interestRate`, `apr`, `monthlyPayment`, `closingCosts`, `loanTerm`, `isRecommended`, `isBestMatch`, `isVisible`. **Missing in DB:** `loan_type` (separate column), `points`, `origination_fee`, `rate_lock_days`, `rate_lock_expires`. |
| **Profile** | User/admin identity | Linked by `userId` on Application. |
| **AdminActivityLog** | Audit trail | Logs create/update/delete on applications and offers. |

**Gaps:**
- `LenderOffer` stores loan type in `productName`; types use `loan_type`. No `points` or rate lock in schema.
- No “offer slot” or “expected lender” entity—consumer view is driven by a **constant list of 6 lenders** in code.

### 1.2 Fixed Lender List (Consumer Experience)

- **Location:** `constants/lenders.ts` — `CONSTANT_LENDERS` (6 lenders: UWM, Rocket Mortgage, Freedom Mortgage, Better, Pennymac, New American Funding).
- **Consumer dashboard:** Always shows **6 cards**. For each constant lender:
  - If an offer exists for that application with a **matching lender name** → show real rate/APR/monthly/closing.
  - Else → show **placeholder** card: “Calculating your savings…” / “Negotiating the best rates…” (see `LenderCard.tsx` + `DashboardClient.tsx`).
- **Matching:** By name (trim, lowercase); special case for UWM (e.g. “United Wholesale Mortgage” → UWM). Any offer whose lender isn’t in the constant list is appended after the 6.

So: **6 cards with real or placeholder is already implemented.** Refinements are about making the backend and admin flow support this model cleanly and completely.

### 1.3 Admin Flow (Current)

1. **Entry:** Admin goes to `/admin` → Dashboard (stats) or `/admin/applications` → list of applications.
2. **Choose application:** Click an application → `/admin/applications/[id]` (application detail).
3. **Per-application actions:**
   - **Credit:** Enter/update credit score, source, date, notes.
   - **Lender offers:** “Add Offer” opens a modal; admin selects lender from **same 6** (or “Other”), enters rate, APR, monthly payment, term, loan type, points, closing costs, optional logo URL; can mark “Recommended.” Data is manually keyed (e.g. from Arive PPE).
   - **Status:** Pending → In Review → Offers Ready → Completed (and optional “Notify client” email).
4. **APIs used:**
   - `GET/POST /api/applications` — client-facing (list/create for current user).
   - `GET /admin/applications` — server-rendered via `getApplications()`.
   - `POST /api/admin/applications/[id]/credit` — update credit.
   - `POST /api/admin/applications/[id]/status` — update status.
   - `POST /api/admin/applications/[id]/offers` — create offer.
   - `PUT/DELETE /api/admin/offers/[id]` — update/delete offer.

**Gaps:**
- No “application picker” or “focus mode” beyond list + click (could add filters, search, “Continue where you left off”).
- No bulk or file-based import from Arive PPE; every offer is single-form.
- Lender name must match consumer constants (or “Other”); typos/aliases can break matching.
- Admin doesn’t see the **6 slots** explicitly (which of 6 have offers vs “in progress”); they only see a table of existing offers.

### 1.4 Client Dashboard (Consumer) Flow

1. **Data:** `GET /api/applications` (Clerk `userId`) → applications with `lender_offers`.
2. **Logic:** Takes first application; maps `lender_offers` to `Lender[]`; merges with `CONSTANT_LENDERS` to produce exactly 6 cards (real or placeholder); sorts real first by rate, then placeholders.
3. **UI:** `LenderCard` — if `lender.isPlaceholder` → “Calculating your savings…” message; else rate, APR, monthly P&I, closing, points, “Select Offer” / “Pre-Approve Now.”
4. **Small bug:** `offerToLender()` does not set `bestMatch` from `offer.is_best_match`; only `isRecommended` is used.

**Gaps:**
- Placeholder copy could be tuned (“In progress” vs “Calculating savings”).
- No explicit “offer status” (e.g. “Requested”, “In progress”, “Ready”) per lender—only presence/absence of a row.
- No guarantee that “6 lenders” is configurable without code change (currently hardcoded).

---

## 2. Goals (Summary)

- **Admin:** Choose which application to work on quickly; feed **all** information needed for each of the 6 (or N) lenders (from Arive PPE or manual); see at a glance which slots are filled vs pending.
- **Consumer:** Always see **6 lender cards**; filled = real rate/APR/monthly/closing; unfilled = “Calculating savings” / “In progress” (or similar). One clear, comparable set of offers.
- **Backend:** Single source of truth for “which lenders we show” and “what data we need per offer”; support optional bulk/import from Arive PPE later.

---

## 3. Technical Refinement Plan

### Phase 1 — Schema & Data Consistency (Backend Foundation)

**Objectives:** Align Prisma schema with types and consumer needs; make “expected lenders” explicit.

1. **LenderOffer schema (Prisma)**  
   - Add optional columns if you want full parity with types and future PPE import:  
     `points` (Decimal), `originationFee` (Decimal), `rateLockDays` (Int), `rateLockExpires` (DateTime).  
   - Consider adding `loanType` (String) and keep `productName` for display name, or standardize on one.
   - Add `source` (e.g. `'manual' | 'arive_ppe'`) and `externalId` (optional) for future import idempotency.

2. **LenderOffer ↔ types**  
   - In `utils/admin/api.ts`, ensure `mapLenderOffer` and create/update use the same fields (loan_type, points, etc.) so admin and consumer see the same data.
   - In `app/api/applications/route.ts`, include any new fields in the response so the dashboard can show them.

3. **Expected lenders as first-class concept (optional but recommended)**  
   - Add a small table or config: `ExpectedLender` (e.g. `id`, `name`, `displayOrder`, `logoUrl`, `isActive`). Seed from current `CONSTANT_LENDERS`.  
   - Consumer dashboard and admin “slots” both derive from this list so adding/removing/reordering lenders is data-driven, not code-only.

4. **Application ↔ Expected Lenders**  
   - No need to store “6 slots” per application in DB if you keep “merge by lender name” as today. Alternatively, add `ApplicationLenderSlot` (applicationId, expectedLenderId, status: `pending` | `entered` | `not_applicable`, lenderOfferId nullable). That gives explicit “this slot is filled / in progress / N/A” for admin and consumer.

**Deliverables:** Migration for new columns; `mapLenderOffer` and API response updated; optional ExpectedLender + Slot models and seed.

---

### Phase 2 — Admin Dashboard UX (Choose Application & Feed Info)

**Objectives:** Make it easy to “choose which application to work on” and to “feed all information needed” for each lender.

1. **Application list improvements**  
   - Filters: status, date range, “has no offers” / “incomplete offers” (e.g. &lt; 6).  
   - Search: by client name, email, or application id.  
   - Sort: last updated, created, status.  
   - Quick stats per row: e.g. “3/6 offers,” “Credit pending,” “Offers ready.”

2. **Application detail — “6 slots” view**  
   - Beside or above the current “Lender Offers” table, show **6 cards (or rows)** aligned to the 6 expected lenders.  
   - Each slot: lender name, logo; if offer exists → show rate, APR, monthly, link to edit; if not → “Add offer” (or “In progress” if you add slot status).  
   - Clicking “Add offer” pre-fills lender (and logo) from the slot so admin only enters pricing/costs from Arive PPE.

3. **Add/Edit offer form**  
   - Pre-fill lender from slot when adding.  
   - Ensure all consumer-visible fields are present: rate, APR, monthly payment, term, loan type, points, closing costs (and optionally rate lock).  
   - Optional: “Duplicate from another application” for the same lender to speed data entry.

4. **Bulk / import (later)**  
   - If Arive PPE can export CSV or expose an API: “Import from Arive” on application detail that maps columns to lenders and creates/updates `LenderOffer` rows.  
   - Use `source: 'arive_ppe'` and `externalId` to avoid duplicates and support re-import.

**Deliverables:** Enhanced applications list (filters, search, sort, quick stats); 6-slot view on application detail; improved add/edit offer flow; optional import endpoint + UI.

---

### Phase 3 — Consumer Dashboard (6 Cards, Placeholders, Copy)

**Objectives:** Consumers always see 6 lender cards; filled = full numbers; unfilled = clear “in progress” messaging.

1. **Single source for “expected lenders”**  
   - If Phase 1 added `ExpectedLender`, dashboard loads that list (or fallback to `CONSTANT_LENDERS`) and builds the 6 cards.  
   - Merge logic remains: for each expected lender, find matching `LenderOffer` by name (and aliases); else placeholder.

2. **Placeholder copy and behavior**  
   - Standardize placeholder text: e.g. “Calculating your savings…” and “We’re still gathering offers from [Lender Name].” (or “In progress” if you prefer).  
   - Ensure placeholders are not clickable for “Select Offer” in a way that implies an actual offer (e.g. disable or show “Coming soon”).

3. **Data completeness**  
   - Ensure `offerToLender()` (or equivalent) passes through: `is_best_match` → `bestMatch`, `is_recommended` → `isRecommended`, and all numeric/term fields so “Best match” badge and numbers are correct.  
   - Fix: set `bestMatch: offer.is_best_match ?? false` when mapping DB offer to `Lender`.

4. **Empty state**  
   - If application has zero offers, show all 6 as placeholders (current behavior) with the same copy.  
   - Optional: short line under the cards like “We’re comparing offers from 6 lenders. You’ll see your personalized rates here as they’re ready.”

**Deliverables:** Dashboard uses expected-lender list (or constant); consistent placeholder copy and disabled CTA; `bestMatch` and all fields wired; optional empty-state line.

---

### Phase 4 — API & Security Consistency

**Objectives:** Clear, consistent APIs for admin and consumer; audit and permissions.

1. **Admin APIs**  
   - All under `/api/admin/*`; require `isUserAdmin()`.  
   - Validate `applicationId` and `offerId` (ownership / existence) and return 404 when appropriate.  
   - Use a shared shape for “application with offers” so admin UI and any future tools stay in sync.

2. **Consumer API**  
   - `GET /api/applications` remains the source for “my applications with offers.”  
   - Ensure response includes all fields needed for the 6 cards (including any new LenderOffer fields).  
   - Optionally add `GET /api/applications/[id]/offers` that returns only offers for that application (for clarity or future use).

3. **Activity log**  
   - Keep logging create/update/delete for offers and status changes.  
   - Optionally log “import” actions when bulk/Arive import is added.

**Deliverables:** Documented admin vs consumer API boundaries; validation and error codes; optional new read-only endpoint for offers.

---

### Phase 5 — Optional: Arive PPE Integration

**Objectives:** Reduce manual keying; support “feed all information” at scale.

1. **Define integration shape**  
   - Document: Does Arive expose API (REST/GraphQL) or only export (CSV/Excel)?  
   - Map Arive “lender” or product to your expected lenders (name or id).  
   - Map Arive fields → your `LenderOffer` (rate, APR, term, loan type, points, closing, etc.).

2. **Import flow**  
   - Admin selects application, then “Import from Arive” (file upload or “Sync” if API).  
   - Backend: parse file or call API; match rows to expected lenders; create or update `LenderOffer` with `source: 'arive_ppe'` and optional `externalId`.  
   - Show success/conflict summary (e.g. “4 offers imported, 2 skipped (already exist)”).

3. **Idempotency**  
   - Use `externalId` or (applicationId + lenderId) to avoid duplicate offers on re-import.

**Deliverables:** Integration spec; import endpoint + admin UI; idempotency and conflict handling.

---

## 4. Implementation Order (for Claude Opus or Team)

| Order | Phase | Scope | Dependency |
|-------|--------|--------|------------|
| 1 | Phase 1 | Schema + mapLenderOffer + API response + fix bestMatch | None |
| 2 | Phase 3 (consumer) | Placeholder copy, bestMatch fix, optional ExpectedLender usage | Phase 1 |
| 3 | Phase 2 (admin) | Application list filters/search + 6-slot view + add/edit improvements | Phase 1 |
| 4 | Phase 4 | API docs, validation, optional GET offers endpoint | Phase 2–3 |
| 5 | Phase 5 | Arive import (if desired) | Phase 2 |

---

## 5. Quick Wins (Do First)

1. **Fix consumer dashboard:** In `DashboardClient.tsx` (or wherever `offerToLender` lives), set `bestMatch: offer.is_best_match ?? false` so “Best match” badge appears when admin marks it.
2. **Align LenderOffer form and API:** Ensure admin can enter (and API stores) `points` and, if you add them, rate lock fields; expose them in GET responses and in `mapLenderOffer`.
3. **Placeholder copy:** In `LenderCard.tsx` and/or `constants/lenders.ts`, use one clear line for placeholders: e.g. “Calculating your savings…” and “In progress” so the consumer knows the slot is not abandoned.
4. **Admin 6-slot summary:** On application detail, add a simple “Offers: 3/6” and a list of expected lender names with “Added” or “—” so admin sees at a glance what’s left to enter.

---

## 6. Success Criteria

- **Admin:** Can find any application quickly; sees which of the 6 lenders have offers; can add/edit full offer data (rate, APR, monthly, term, type, points, closing) per lender; optional bulk import from Arive.
- **Consumer:** Always sees 6 lender cards; real offers show complete numbers and “Recommended”/“Best match” where set; missing offers show clear “Calculating your savings” / “In progress” and feel intentional, not broken.
- **Backend:** Single source of truth for lenders and offer fields; schema and types aligned; APIs consistent and documented; ready for future PPE or other integrations.

This plan is intended to be used with Claude Opus (or similar) to implement phase-by-phase for a top-tier admin and consumer experience.

---

## 7. Migration: Apply Phase 1 schema changes

After pulling the Phase 1 code, run the database migration so new `lender_offers` columns exist:

```bash
cd /path/to/Lumina
npx prisma migrate deploy
```

If you use `prisma migrate dev` for local development:

```bash
npx prisma migrate dev --name add_lender_offer_fields
```

If the migration folder already exists at `prisma/migrations/20250207120000_add_lender_offer_fields/`, use `migrate deploy` so Prisma applies that migration. New columns: `loan_type`, `points`, `origination_fee`, `rate_lock_days`, `rate_lock_expires`, `source`, `external_id`.

---

## 8. Testing checklist (after implementation)

Use this to verify flows and catch bugs.

### Admin

- [ ] **Applications list** — Filters (All / Pending / In Review / Offers Ready / Completed) work.
- [ ] **Applications list** — Search by client name, email, or application ID returns correct rows.
- [ ] **Applications list** — Sort by Created, Updated, Status; toggling asc/desc works.
- [ ] **Applications list** — Offers filter (All / Incomplete / No offers) filters correctly.
- [ ] **Applications list** — "Offers" column shows X/6 (green when 6/6, amber when 1–5, gray when 0).
- [ ] **Application detail** — "Lender slots" shows 6 cards; "Offers: X/6" is correct.
- [ ] **Application detail** — "Add offer" on an empty slot opens modal with that lender pre-filled; URL param clears after open.
- [ ] **Application detail** — "Edit offer" on a filled slot opens edit modal; URL param clears.
- [ ] **Add/Edit offer** — Save creates or updates; table and slot view refresh and show new data.
- [ ] **Credit / Status** — Updating credit score and status saves and refreshes.
- [ ] **404 behavior** — Invalid application ID in URL for credit/status/offers returns 404 (or not-found). Invalid offer ID for PUT/DELETE returns 404.

### Consumer dashboard

- [ ] **Offers** — With 0 offers, all 6 cards show placeholders ("Calculating your savings…", "In progress" button).
- [ ] **Offers** — With 1–5 offers, real cards show rate/APR/monthly; rest are placeholders; empty-state line appears.
- [ ] **Offers** — With 6 offers, all cards show real data; no placeholder line.
- [ ] **Placeholders** — Placeholder cards are not clickable; button says "In progress" and is disabled.
- [ ] **Best match** — When an offer is marked "Best match" in admin, consumer card shows Recommended badge.
