-- 이용자 기체 가동 확인 기록 (2026-09-12)
-- CreateTable
CREATE TABLE "ArcadeCabinetCheck" (
    "id" SERIAL NOT NULL,
    "cabinet_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArcadeCabinetCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ArcadeCabinetCheck_cabinet_id_checked_at_idx" ON "ArcadeCabinetCheck"("cabinet_id", "checked_at");

-- CreateIndex
CREATE INDEX "ArcadeCabinetCheck_user_id_checked_at_idx" ON "ArcadeCabinetCheck"("user_id", "checked_at");

-- AddForeignKey
ALTER TABLE "ArcadeCabinetCheck" ADD CONSTRAINT "ArcadeCabinetCheck_cabinet_id_fkey" FOREIGN KEY ("cabinet_id") REFERENCES "ArcadeCabinet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArcadeCabinetCheck" ADD CONSTRAINT "ArcadeCabinetCheck_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
