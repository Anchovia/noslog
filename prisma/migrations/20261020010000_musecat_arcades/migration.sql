-- 2026-10-20 뮤즈캣 연동 A 방향 — 뮤즈캣 연결 · 오락실 대응표 · NosLog 기체 특징 · 보낸 요청 기록(새 enum 5개 · 표 4개, 기존 표는 바꾸지 않음).
-- 앞 마이그레이션과 같은 이유로 오프라인 비교(prisma migrate diff)로 만들었다.

-- CreateEnum
CREATE TYPE "musecat_connection_status" AS ENUM ('active', 'needs_reconnect', 'revoked');

-- CreateEnum
CREATE TYPE "arcade_external_provider" AS ENUM ('musecat');

-- CreateEnum
CREATE TYPE "arcade_external_match" AS ENUM ('admin_verified', 'user_pick');

-- CreateEnum
CREATE TYPE "musecat_action_kind" AS ENUM ('campaign_check', 'fault_report', 'fault_withdraw', 'favorite', 'flag_reaction', 'game_edit');

-- CreateEnum
CREATE TYPE "musecat_action_status" AS ENUM ('accepted', 'pending', 'rejected', 'uncertain');

-- CreateTable
CREATE TABLE "musecat_connections" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "musecat_subject" TEXT NOT NULL,
    "musecat_username" TEXT,
    "generation" INTEGER NOT NULL DEFAULT 1,
    "status" "musecat_connection_status" NOT NULL DEFAULT 'active',
    "scopes" TEXT[],
    "access_token_enc" TEXT,
    "access_expires_at" TIMESTAMP(3),
    "refresh_token_enc" TEXT,
    "family_expires_at" TIMESTAMP(3),
    "enc_key_id" TEXT NOT NULL,
    "refresh_lease_until" TIMESTAMP(3),
    "refresh_attempt_id" TEXT,
    "refresh_sent_at" TIMESTAMP(3),
    "last_error_code" TEXT,
    "blocked_until" TIMESTAMP(3),
    "connected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "musecat_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arcade_external_ids" (
    "id" SERIAL NOT NULL,
    "arcade_id" INTEGER NOT NULL,
    "provider" "arcade_external_provider" NOT NULL,
    "external_id" TEXT NOT NULL,
    "match_method" "arcade_external_match" NOT NULL,
    "verified_by_id" INTEGER,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arcade_external_ids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "musecat_cabinet_notes" (
    "id" SERIAL NOT NULL,
    "musecat_arcade_id" TEXT NOT NULL,
    "musecat_game_item_id" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "key_weight" TEXT,
    "screen_lag" TEXT,
    "sound_volume" TEXT,
    "feature_note" TEXT,
    "updated_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "musecat_cabinet_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "musecat_actions" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "connection_id" INTEGER NOT NULL,
    "generation" INTEGER NOT NULL,
    "musecat_arcade_id" TEXT NOT NULL,
    "kind" "musecat_action_kind" NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "musecat_action_status" NOT NULL DEFAULT 'pending',
    "http_status" INTEGER,
    "musecat_resource_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "musecat_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "musecat_connections_user_id_key" ON "musecat_connections"("user_id");

-- CreateIndex
CREATE INDEX "musecat_connections_musecat_subject_idx" ON "musecat_connections"("musecat_subject");

-- CreateIndex
CREATE UNIQUE INDEX "arcade_external_ids_provider_external_id_key" ON "arcade_external_ids"("provider", "external_id");

-- CreateIndex
CREATE UNIQUE INDEX "arcade_external_ids_arcade_id_provider_key" ON "arcade_external_ids"("arcade_id", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "musecat_cabinet_notes_musecat_game_item_id_key" ON "musecat_cabinet_notes"("musecat_game_item_id");

-- CreateIndex
CREATE INDEX "musecat_cabinet_notes_musecat_arcade_id_idx" ON "musecat_cabinet_notes"("musecat_arcade_id");

-- CreateIndex
CREATE INDEX "musecat_actions_user_id_created_at_idx" ON "musecat_actions"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "musecat_actions_connection_id_idx" ON "musecat_actions"("connection_id");

-- AddForeignKey
ALTER TABLE "musecat_connections" ADD CONSTRAINT "musecat_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arcade_external_ids" ADD CONSTRAINT "arcade_external_ids_arcade_id_fkey" FOREIGN KEY ("arcade_id") REFERENCES "arcades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arcade_external_ids" ADD CONSTRAINT "arcade_external_ids_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musecat_cabinet_notes" ADD CONSTRAINT "musecat_cabinet_notes_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musecat_actions" ADD CONSTRAINT "musecat_actions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musecat_actions" ADD CONSTRAINT "musecat_actions_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "musecat_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

