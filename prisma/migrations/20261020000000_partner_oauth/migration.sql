-- 2026-10-20 뮤즈캣 연동 B 방향 — 파트너 OAuth 인가 서버 표(새 enum 5개 · 표 8개, 기존 표는 바꾸지 않음).
-- 개발 DB 의 마이그레이션 기록이 파일과 어긋나 migrate dev --create-only 가 reset 을 요구해, 커밋된 스키마와의 오프라인 비교(prisma migrate diff)로 만들었다.

-- CreateEnum
CREATE TYPE "oauth_scope" AS ENUM ('nostalgia:read', 'profile');

-- CreateEnum
CREATE TYPE "partner_share_item" AS ENUM ('ranks', 'recent_plays', 'song_records', 'summary');

-- CreateEnum
CREATE TYPE "oauth_grant_revoke_reason" AS ENUM ('partner', 'replay', 'security', 'user');

-- CreateEnum
CREATE TYPE "partner_outbox_kind" AS ENUM ('records_invalidation', 'revocation');

-- CreateEnum
CREATE TYPE "partner_outbox_status" AS ENUM ('dead', 'delivered', 'pending');

-- CreateTable
CREATE TABLE "oauth_clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "secret_hash" TEXT NOT NULL,
    "previous_secret_hash" TEXT,
    "previous_secret_expires_at" TIMESTAMP(3),
    "redirect_uris" TEXT[],
    "allowed_scopes" "oauth_scope"[],
    "disabled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_subjects" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "client_id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_grants" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "client_id" TEXT NOT NULL,
    "scopes" "oauth_scope"[],
    "shared_items" "partner_share_item"[],
    "generation" INTEGER NOT NULL DEFAULT 1,
    "family_expires_at" TIMESTAMP(3) NOT NULL,
    "last_used_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "revoked_reason" "oauth_grant_revoke_reason",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_grants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_authorization_codes" (
    "id" SERIAL NOT NULL,
    "code_hash" TEXT NOT NULL,
    "grant_id" INTEGER NOT NULL,
    "redirect_uri" TEXT NOT NULL,
    "code_challenge" TEXT NOT NULL,
    "scopes" "oauth_scope"[],
    "expires_at" TIMESTAMP(3) NOT NULL,
    "consumed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_authorization_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_refresh_tokens" (
    "id" SERIAL NOT NULL,
    "token_hash" TEXT NOT NULL,
    "grant_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "rotated_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_access_tokens" (
    "id" SERIAL NOT NULL,
    "token_hash" TEXT NOT NULL,
    "grant_id" INTEGER NOT NULL,
    "refresh_token_id" INTEGER,
    "scopes" "oauth_scope"[],
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_request_receipts" (
    "id" SERIAL NOT NULL,
    "client_id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "request_hash" TEXT NOT NULL,
    "response_status" INTEGER,
    "response_body" JSONB,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_request_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_outbox_messages" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "grant_id" INTEGER,
    "kind" "partner_outbox_kind" NOT NULL,
    "generation" INTEGER,
    "payload" JSONB NOT NULL,
    "status" "partner_outbox_status" NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "next_attempt_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locked_until" TIMESTAMP(3),
    "last_http_status" INTEGER,
    "last_error" TEXT,
    "give_up_at" TIMESTAMP(3) NOT NULL,
    "delivered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_outbox_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "oauth_subjects_subject_key" ON "oauth_subjects"("subject");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_subjects_user_id_client_id_key" ON "oauth_subjects"("user_id", "client_id");

-- CreateIndex
CREATE INDEX "oauth_grants_user_id_client_id_idx" ON "oauth_grants"("user_id", "client_id");

-- CreateIndex
CREATE INDEX "oauth_grants_client_id_idx" ON "oauth_grants"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_authorization_codes_code_hash_key" ON "oauth_authorization_codes"("code_hash");

-- CreateIndex
CREATE INDEX "oauth_authorization_codes_grant_id_idx" ON "oauth_authorization_codes"("grant_id");

-- CreateIndex
CREATE INDEX "oauth_authorization_codes_expires_at_idx" ON "oauth_authorization_codes"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_refresh_tokens_token_hash_key" ON "oauth_refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "oauth_refresh_tokens_grant_id_idx" ON "oauth_refresh_tokens"("grant_id");

-- CreateIndex
CREATE INDEX "oauth_refresh_tokens_parent_id_idx" ON "oauth_refresh_tokens"("parent_id");

-- CreateIndex
CREATE INDEX "oauth_refresh_tokens_expires_at_idx" ON "oauth_refresh_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_access_tokens_token_hash_key" ON "oauth_access_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "oauth_access_tokens_grant_id_idx" ON "oauth_access_tokens"("grant_id");

-- CreateIndex
CREATE INDEX "oauth_access_tokens_refresh_token_id_idx" ON "oauth_access_tokens"("refresh_token_id");

-- CreateIndex
CREATE INDEX "oauth_access_tokens_expires_at_idx" ON "oauth_access_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "partner_request_receipts_expires_at_idx" ON "partner_request_receipts"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "partner_request_receipts_client_id_request_id_key" ON "partner_request_receipts"("client_id", "request_id");

-- CreateIndex
CREATE INDEX "partner_outbox_messages_status_next_attempt_at_idx" ON "partner_outbox_messages"("status", "next_attempt_at");

-- CreateIndex
CREATE INDEX "partner_outbox_messages_grant_id_idx" ON "partner_outbox_messages"("grant_id");

-- AddForeignKey
ALTER TABLE "oauth_subjects" ADD CONSTRAINT "oauth_subjects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_subjects" ADD CONSTRAINT "oauth_subjects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "oauth_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_grants" ADD CONSTRAINT "oauth_grants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_grants" ADD CONSTRAINT "oauth_grants_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "oauth_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_authorization_codes" ADD CONSTRAINT "oauth_authorization_codes_grant_id_fkey" FOREIGN KEY ("grant_id") REFERENCES "oauth_grants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_refresh_tokens" ADD CONSTRAINT "oauth_refresh_tokens_grant_id_fkey" FOREIGN KEY ("grant_id") REFERENCES "oauth_grants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_refresh_tokens" ADD CONSTRAINT "oauth_refresh_tokens_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "oauth_refresh_tokens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_access_tokens" ADD CONSTRAINT "oauth_access_tokens_grant_id_fkey" FOREIGN KEY ("grant_id") REFERENCES "oauth_grants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_access_tokens" ADD CONSTRAINT "oauth_access_tokens_refresh_token_id_fkey" FOREIGN KEY ("refresh_token_id") REFERENCES "oauth_refresh_tokens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_request_receipts" ADD CONSTRAINT "partner_request_receipts_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "oauth_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_outbox_messages" ADD CONSTRAINT "partner_outbox_messages_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "oauth_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_outbox_messages" ADD CONSTRAINT "partner_outbox_messages_grant_id_fkey" FOREIGN KEY ("grant_id") REFERENCES "oauth_grants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

