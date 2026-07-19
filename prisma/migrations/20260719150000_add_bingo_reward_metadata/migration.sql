ALTER TABLE "Bingo"
ADD COLUMN "source_version" TEXT,
ADD COLUMN "line_reward_nos" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "completion_reward_nos" INTEGER NOT NULL DEFAULT 0;
