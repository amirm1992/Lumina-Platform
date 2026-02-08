-- AlterTable: Add new columns to lender_offers for world-class offer data (Phase 1)
ALTER TABLE "lender_offers" ADD COLUMN IF NOT EXISTS "loan_type" TEXT;
ALTER TABLE "lender_offers" ADD COLUMN IF NOT EXISTS "points" DECIMAL(65,30);
ALTER TABLE "lender_offers" ADD COLUMN IF NOT EXISTS "origination_fee" DECIMAL(65,30);
ALTER TABLE "lender_offers" ADD COLUMN IF NOT EXISTS "rate_lock_days" INTEGER;
ALTER TABLE "lender_offers" ADD COLUMN IF NOT EXISTS "rate_lock_expires" DATE;
ALTER TABLE "lender_offers" ADD COLUMN IF NOT EXISTS "source" TEXT DEFAULT 'manual';
ALTER TABLE "lender_offers" ADD COLUMN IF NOT EXISTS "external_id" TEXT;
