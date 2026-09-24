-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "achieved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievementShowcase" (
    "user_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "UserAchievementShowcase_pkey" PRIMARY KEY ("user_id","position")
);

-- CreateIndex
CREATE INDEX "UserAchievement_key_tier_idx" ON "UserAchievement"("key", "tier");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_user_id_key_tier_key" ON "UserAchievement"("user_id", "key", "tier");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievementShowcase_user_id_key_key" ON "UserAchievementShowcase"("user_id", "key");

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievementShowcase" ADD CONSTRAINT "UserAchievementShowcase_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
