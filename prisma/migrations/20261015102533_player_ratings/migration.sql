-- 레이팅 랭킹용 저장 값(2026-10-15 L2-A2) — 사람 · 모드(basic · recital)마다 한 줄. 표만 만들고, 값은 앱이 채운다
-- CreateTable
CREATE TABLE "PlayerRating" (
    "user_id" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "filled_slots" INTEGER NOT NULL,
    "basis_version" TEXT NOT NULL,
    "computed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerRating_pkey" PRIMARY KEY ("user_id","mode")
);

-- CreateIndex
CREATE INDEX "PlayerRating_mode_rating_idx" ON "PlayerRating"("mode", "rating" DESC);

-- AddForeignKey
ALTER TABLE "PlayerRating" ADD CONSTRAINT "PlayerRating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
