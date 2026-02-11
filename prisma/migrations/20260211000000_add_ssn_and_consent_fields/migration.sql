-- AlterTable
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "ssn_encrypted" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "consent_soft_pull" BOOLEAN NOT NULL DEFAULT false;
