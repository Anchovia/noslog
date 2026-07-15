ALTER TABLE "User" ADD COLUMN "discord_id" TEXT;

CREATE UNIQUE INDEX "User_discord_id_key" ON "User"("discord_id");
