-- 프로필 고정 기록(2026-09-26 S2) — 최대 3칸 · 한 줄 소감. 채보 기준으로 고정
-- CreateTable
CREATE TABLE "UserPinnedRecord" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "chart_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "comment" VARCHAR(80),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPinnedRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPinnedRecord_user_id_position_key" ON "UserPinnedRecord"("user_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "UserPinnedRecord_user_id_chart_id_key" ON "UserPinnedRecord"("user_id", "chart_id");

-- AddForeignKey
ALTER TABLE "UserPinnedRecord" ADD CONSTRAINT "UserPinnedRecord_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPinnedRecord" ADD CONSTRAINT "UserPinnedRecord_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
