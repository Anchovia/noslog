-- CreateTable
CREATE TABLE "Arcade" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT,
    "address" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Arcade_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "User" ADD COLUMN "preferred_arcade_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Arcade_name_key" ON "Arcade"("name");
CREATE INDEX "Arcade_is_active_name_idx" ON "Arcade"("is_active", "name");
CREATE INDEX "User_preferred_arcade_id_idx" ON "User"("preferred_arcade_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_preferred_arcade_id_fkey" FOREIGN KEY ("preferred_arcade_id") REFERENCES "Arcade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
