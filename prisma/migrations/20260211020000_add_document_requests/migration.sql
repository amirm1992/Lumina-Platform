-- CreateTable
CREATE TABLE "document_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "application_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "instructions" TEXT,
    "status" TEXT NOT NULL DEFAULT 'requested',
    "created_by" TEXT NOT NULL,
    "fulfilled_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_document_requests_application_id" ON "document_requests"("application_id");

-- CreateIndex
CREATE INDEX "idx_document_requests_status" ON "document_requests"("status");
