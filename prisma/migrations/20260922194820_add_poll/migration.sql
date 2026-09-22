-- CreateEnum
CREATE TYPE "PollResultsVisibility" AS ENUM ('ALWAYS', 'AFTER_VOTE', 'AFTER_CLOSE');

-- CreateTable
CREATE TABLE "Poll" (
    "id" SERIAL NOT NULL,
    "announcement_id" INTEGER,
    "event_id" INTEGER,
    "multiple" BOOLEAN NOT NULL DEFAULT false,
    "max_choices" INTEGER,
    "closes_at" TIMESTAMP(3),
    "results" "PollResultsVisibility" NOT NULL DEFAULT 'ALWAYS',
    "show_voters" BOOLEAN NOT NULL DEFAULT false,
    "allow_add_options" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollTranslation" (
    "id" SERIAL NOT NULL,
    "poll_id" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "question" TEXT NOT NULL,

    CONSTRAINT "PollTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollOption" (
    "id" SERIAL NOT NULL,
    "poll_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PollOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollOptionTranslation" (
    "id" SERIAL NOT NULL,
    "option_id" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "PollOptionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollVote" (
    "poll_id" INTEGER NOT NULL,
    "option_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PollVote_pkey" PRIMARY KEY ("option_id","user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Poll_announcement_id_key" ON "Poll"("announcement_id");

-- CreateIndex
CREATE UNIQUE INDEX "Poll_event_id_key" ON "Poll"("event_id");

-- CreateIndex
CREATE INDEX "Poll_closes_at_idx" ON "Poll"("closes_at");

-- CreateIndex
CREATE UNIQUE INDEX "PollTranslation_poll_id_locale_key" ON "PollTranslation"("poll_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "PollOption_poll_id_position_key" ON "PollOption"("poll_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "PollOptionTranslation_option_id_locale_key" ON "PollOptionTranslation"("option_id", "locale");

-- CreateIndex
CREATE INDEX "PollVote_poll_id_user_id_idx" ON "PollVote"("poll_id", "user_id");

-- CreateIndex
CREATE INDEX "PollVote_user_id_idx" ON "PollVote"("user_id");

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "CommunityEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollTranslation" ADD CONSTRAINT "PollTranslation_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollOption" ADD CONSTRAINT "PollOption_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollOptionTranslation" ADD CONSTRAINT "PollOptionTranslation_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "PollOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollVote" ADD CONSTRAINT "PollVote_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollVote" ADD CONSTRAINT "PollVote_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "PollOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollVote" ADD CONSTRAINT "PollVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
