-- CreateTable
CREATE TABLE "message_threads" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_replies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "thread_id" UUID NOT NULL,
    "sender_id" TEXT NOT NULL,
    "sender_role" TEXT NOT NULL,
    "sender_name" TEXT,
    "body" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_replies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_message_threads_user_id" ON "message_threads"("user_id");
CREATE INDEX "idx_message_threads_status" ON "message_threads"("status");
CREATE INDEX "idx_message_threads_updated_at" ON "message_threads"("updated_at");

-- CreateIndex
CREATE INDEX "idx_message_replies_thread_id" ON "message_replies"("thread_id");
CREATE INDEX "idx_message_replies_sender_id" ON "message_replies"("sender_id");

-- AddForeignKey
ALTER TABLE "message_replies" ADD CONSTRAINT "message_replies_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "message_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
