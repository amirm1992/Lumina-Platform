# Lumina Mortgage — Pricing & Offers Plan (ARIVE Now → Polly Later)

**Status:** Launch phase uses **ARIVE-assisted pricing** with Lumina-native offer cards.  
**Future:** Migrate pricing engine to **Polly** (or Optimal Blue) without rewriting the UI by using a vendor-agnostic Pricing Service.

---

## 0) What this document is (and is not)

### This document IS
- A build plan for **Lumina Offer Cards** shown in the borrower dashboard.
- A design for **vendor-agnostic pricing** so we can swap ARIVE → Polly cleanly.
- A pragmatic integration approach that works even if ARIVE does **not** expose a public API.

### This document is NOT
- A claim that ARIVE offers a public API/webhook for third-party POS → ARIVE file creation or ARIVE → POS pricing exports.
  - **Reality:** ARIVE capabilities vary by partner channel. Some teams have integrations via lender/investor networks or LOS/POS connectors; some do not.
  - We implement **an adapter-based architecture** with multiple integration paths:
    - **Path A (Preferred):** Official ARIVE API / partner integration (if available to our account)
    - **Path B:** ARIVE export + Lumina import automation (CSV/PDF/email ingestion)
    - **Path C (Last resort):** RPA/headless browser automation

> Decision rule: Start with Path B immediately (guaranteed), then upgrade to Path A if/when ARIVE grants API/partner access.

---

## 1) Objectives

### Launch Objectives (ARIVE phase)
1. Borrower completes Lumina 12-step flow.
2. Lumina creates a **Scenario** and opens a **Loan File** (internal).
3. Pricing results are obtained from ARIVE and surfaced as **Offer Cards** in Lumina.
4. Borrower selects an offer → Lumina transitions to next workflow (disclosures, document collection, broker ops).

### Scale Objectives (Polly phase)
1. Replace ARIVE adapter with Polly adapter.
2. Maintain identical UI and Offer schema.
3. Enable automation: eligibility, optimal product matching, lock requests, and pipeline scale.

---

## 2) Core Architecture (Vendor-Agnostic)

### Components
- **Lumina POS** (borrower-facing app)
- **Pricing Service** (Lumina internal service, vendor-agnostic)
- **Pricing Adapters**
  - `Manual/ARIVE Adapter` (launch)
  - `Polly Adapter` (future)
- **Offer Store** (DB tables for scenarios + offers)
- **Borrower Dashboard** (renders offers)
- **Ops Console** (admin UI to manage pricing and offers)

### High-level data flow
```
Borrower Flow (12 steps)
   ↓
Scenario Normalization (Lumina)
   ↓
Pricing Service → ARIVE Adapter (Path A/B/C)
   ↓
Offer Normalization
   ↓
Offer Store
   ↓
Borrower Dashboard (cards)
```

---

## 3) Data Model (Canonical Schema)

### 3.1 Scenario (canonical input)
A single normalized object used by every pricing engine.

**Scenario fields (minimum viable):**
- `scenario_id` (UUID)
- `borrower_id` (UUID)
- `state` (2-letter)
- `purpose` (`purchase` | `refi` | `heloc`)
- `occupancy` (`primary` | `second_home` | `investment`)
- `property_type` (`sfh` | `condo` | `townhome` | `multi_unit`)
- `purchase_price` (number, optional for refi)
- `estimated_value` (number, required for refi)
- `loan_amount` (number)
- `down_payment` (number, purchase only)
- `ltv` (computed)
- `fico` (range or representative score; store as integer)
- `dti` (number; may be estimated early)
- `income_monthly` (optional)
- `debts_monthly` (optional)
- `product_intent` (`conv` | `fha` | `va` | `jumbo` | `nonqm` | `unknown`)
- `lock_days` (15/30/45/60 default 30)
- `created_at`, `updated_at`

> Note: If credit is soft-pull and returns multiple score models, store all raw scores in a `credit_report` table and map a single `fico` for pricing (document mapping logic).

### 3.2 Offer (canonical output)
An offer is a normalized card displayed to the borrower.

**Offer fields:**
- `offer_id` (UUID)
- `scenario_id` (UUID)
- `lender_name` (string; e.g., "UWM", "Rocket", "Pennymac")
- `product_name` (string; e.g., "30Y Fixed", "5/6 ARM")
- `rate` (decimal)
- `apr` (decimal)
- `points` (decimal; positive = borrower pays points; negative = lender credit)
- `est_monthly_payment` (decimal; P&I only or include taxes/ins per config)
- `est_cash_to_close` (decimal; optional until we have full fees)
- `lock_days` (int)
- `fees_summary` (json)
- `eligibility_flags` (json)
- `badge` (`best_rate` | `lowest_cost` | `fast_close` | null)
- `rank_score` (float)
- `source` (`arive` | `manual` | `polly`)
- `source_reference` (string; file id / export id / lock id)
- `as_of` (timestamp)
- `published` (bool)

---

## 4) Operational Flows

### 4.1 Borrower flow → Scenario creation
1. Borrower completes 12 steps.
2. Lumina persists:
   - borrower profile
   - property + loan inputs
   - soft credit pull results
3. Lumina computes scenario:
   - `ltv`
   - representative `fico`
   - rough `dti` (if enough data)
4. Lumina calls Pricing Service:
   - `POST /pricing/request` with `scenario_id`

### 4.2 Pricing Service behavior
- Validates scenario completeness.
- Routes request to active adapter:
  - `ARIVE Adapter` (launch)
  - `Polly Adapter` (future)
- Stores request state:
  - `status = pending | priced | needs_info | error`
- Emits events to analytics/logging.

---

## 5) ARIVE Integration — How to “auto-send” and “auto-return” results

### Important constraint
ARIVE may not provide a direct “create loan file” API or “get pricing results” API to all customers.  
Therefore we implement **three integration paths**, prioritized.

---

## 5.A Path A (Preferred): ARIVE Official API / Partner Integration (if available)

### What we need from ARIVE
Ask ARIVE support/BD for:
- API documentation (OpenAPI/Swagger)
- OAuth/client credentials or SSO integration details
- Endpoints for:
  - Create borrower/loan file
  - Update scenario fields
  - Trigger pricing/product search
  - Fetch results (products, rates, pricing)
  - Webhooks for status updates (optional)

### Lumina implementation (Path A)
1. **Credentials**
   - Store in secrets manager:
     - `ARIVE_CLIENT_ID`
     - `ARIVE_CLIENT_SECRET`
     - `ARIVE_BASE_URL`
2. **Adapter endpoints**
   - `createLoanFile(scenario)` → returns `arive_loan_id`
   - `runPricing(arive_loan_id)` → returns `pricing_job_id`
   - `fetchPricing(pricing_job_id)` → returns raw offers
3. **Normalization**
   - Map raw offers into Lumina `Offer` schema
4. **Publish**
   - Store offers → mark `published=true` → dashboard renders

### Pseudocode
```ts
// PricingService
const scenario = await ScenarioRepo.get(scenarioId)
const ariveLoanId = await AriveAdapter.createLoanFile(scenario)
const jobId = await AriveAdapter.runPricing(ariveLoanId)
const raw = await AriveAdapter.fetchPricing(jobId)
const offers = normalizeOffers(raw)
await OfferRepo.upsertMany(offers)
```

### If ARIVE supports webhooks
- Register webhook: `POST /webhooks/arive`
- On pricing completion event:
  - fetch results
  - normalize + publish
  - notify borrower

---

## 5.B Path B (Guaranteed): ARIVE Export → Lumina Import Automation (Recommended for launch)

This path works **without** ARIVE APIs.

### Overview
1. Ops prices the scenario in ARIVE.
2. ARIVE produces an export (CSV/PDF) or shareable summary.
3. Lumina ingests that export automatically and publishes Offer Cards.

### Two common ingestion methods

#### Method B1 — File upload into Ops Console (fastest)
- Add a button: **“Upload ARIVE Pricing Export”**
- Accept CSV/PDF.
- Parse on server.
- Map to Offer schema.
- Publish.

**Pros:** fastest, robust, no external dependencies.  
**Cons:** requires ops click.

#### Method B2 — Email ingestion (fully automated-ish)
- Create an inbox: `pricing-ingest@golumina.net`
- Ops forwards/export-sends ARIVE results to that inbox (or ARIVE auto-sends if supported).
- Lumina service reads attachments via email provider webhook.
- Parses attachments → creates offers.

**Pros:** minimal ops steps; can be near-automatic.  
**Cons:** depends on ARIVE export/email formats; needs parsing reliability.

### Parsing approach
- Prefer **CSV** if ARIVE provides it.
- If only PDF:
  - Use structured PDF tables if possible
  - Keep parsing deterministic (avoid OCR unless unavoidable)

### Deliverable for launch
- Implement B1 now
- Add B2 later if exports are consistent

---

## 5.C Path C (Last resort): RPA / Headless browser automation

Only if ARIVE has no export format we can use reliably and no API access.

### How it would work
- A bot logs into ARIVE with service credentials (high risk)
- Fills scenario fields
- Captures pricing results
- Pushes to Lumina

**Risks**
- brittle to UI changes
- compliance/security concerns
- often violates ToS

**Policy:** Use only with explicit approval and robust controls.

---

## 6) How Lumina Automatically Publishes Offer Cards

### 6.1 Offer publication rules
- Offers are not visible to borrower until:
  - `pricing_status = priced`
  - AND `published=true` on at least 1 offer

### 6.2 Ranking logic (MVP)
Compute `rank_score` based on:
- lowest APR
- lowest total cost (points/credits)
- optionally, lender SLA tags (fast close)

Default badges:
- `best_rate` → lowest rate
- `lowest_cost` → lowest APR or lowest total cost proxy

### 6.3 Dashboard rendering
Dashboard calls:
- `GET /offers?scenario_id=...&published=true`

UI shows cards:
- lender
- product
- rate, APR, points
- lock days
- payment estimate
- CTA: “Select & Continue”

### 6.4 Borrower selection event
When borrower selects an offer:
- `POST /offers/{offer_id}/select`
- Persist:
  - `selected_offer_id`
  - `selected_at`
- Trigger next workflow:
  - disclosures / document upload / call scheduling

---

## 7) Security & Compliance (baseline)

- Do **not** expose raw credit report details in the borrower UI.
- Store credit data encrypted at rest.
- Use audit logs for:
  - who uploaded pricing exports
  - who published offers
  - offer changes history
- Rate cards must include disclaimers:
  - “Rates are estimates and subject to change based on full underwriting.”
  - “APR includes certain fees; final terms may vary.”

---

## 8) Migration Plan — ARIVE → Polly (no UI rewrite)

### 8.1 Migration principle
Only the adapter changes. Everything else stays stable:
- Scenario schema
- Offer schema
- Dashboard UI
- Offer Store
- Analytics

### 8.2 Implementation steps
1. Keep Pricing Service interface stable:
   - `requestPricing(scenario_id)`
   - `getOffers(scenario_id)`
2. Create `PollyAdapter`:
   - `priceScenario(scenario)` returns raw offers
3. Normalize to Offer schema (same normalizer contract)
4. Feature-flag routing:
   - `PRICING_ENGINE=arive|polly`
5. Run in parallel for testing:
   - price with both
   - compare diffs
6. Switch production to Polly

### 8.3 “Traction” gates to start Polly
- ≥ 20 funded loans/month **or**
- pricing ops load > 10 hrs/week **or**
- need lock automation / eligibility precision **or**
- lender expansion demands it

---

## 9) Implementation Checklist

### Week 1–2 (MVP)
- [ ] Create `Scenario` table + generator from 12-step flow
- [ ] Build Pricing Service skeleton
- [ ] Build Ops Console:
  - [ ] Create offers manually OR upload export (Path B1)
- [ ] Offer schema + dashboard card UI
- [ ] Borrower selection flow + tracking

### Week 3–4 (Automation hardening)
- [ ] Add email ingestion (Path B2) if feasible
- [ ] Add ranking + badges
- [ ] Add audit logs
- [ ] Add versioning for offers

### Later (ARIVE Path A upgrade)
- [ ] Confirm ARIVE API availability
- [ ] Implement OAuth/credentials
- [ ] Replace export ingestion with API fetch

### Polly readiness
- [ ] Maintain clean adapter interface
- [ ] Implement Polly adapter in sandbox
- [ ] Parallel run and compare
- [ ] Flip feature flag

---

## 10) Open Questions (to resolve with ARIVE)
1. Does our ARIVE account include API access or partner integrations?
2. Does ARIVE support automatic export emails or webhooks?
3. What export formats are available (CSV preferred)?
4. Can ARIVE include per-lender breakdown fields needed for normalization (APR, points, lock)?
5. Are there compliance requirements or ToS limitations on automation?

---

## Appendix A — API Contracts (Lumina internal)

### POST /pricing/request
Request pricing for a scenario.
```json
{ "scenario_id": "uuid" }
```

### GET /pricing/status?scenario_id=...
Returns pricing status and timestamps.

### GET /offers?scenario_id=...&published=true
Returns offer cards to display.

### POST /offers/{offer_id}/select
Select an offer and proceed.
```json
{ "accepted_disclaimer": true }
```

---

## Appendix B — “Normalization” rules (MVP)
- Convert rate to decimal with 3–4 precision
- Points:
  - positive = borrower pays points
  - negative = lender credit
- APR required; if absent, compute placeholder and label “Estimated”
- Lock days default 30 if missing
- Payment estimate uses:
  - P&I only in MVP
  - Add taxes/insurance later when we have full inputs

---

**Owner:** Lumina Engineering  
**Last updated:** 2026-02-07
