-- AlterTable
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "consent_signed_at" TIMESTAMP(3);
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "consent_signed_name" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "consent_ip_address" TEXT;
