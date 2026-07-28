CREATE TABLE "MusicTranslation" (
    "id" SERIAL NOT NULL,
    "music_index" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicTranslation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MusicTranslation_music_index_locale_key"
ON "MusicTranslation"("music_index", "locale");

CREATE INDEX "MusicTranslation_locale_status_title_idx"
ON "MusicTranslation"("locale", "status", "title");

ALTER TABLE "MusicTranslation"
ADD CONSTRAINT "MusicTranslation_music_index_fkey"
FOREIGN KEY ("music_index") REFERENCES "Music"("index")
ON DELETE CASCADE ON UPDATE CASCADE;
