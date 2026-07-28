ALTER TABLE "User"
ADD COLUMN "locale" TEXT,
ADD COLUMN "show_localized_music_title" BOOLEAN NOT NULL DEFAULT true;

UPDATE "User"
SET "locale" = CASE
    WHEN "country" = 'ja-JP' THEN 'ja'
    WHEN "country" = 'global' THEN 'en'
    ELSE 'ko'
END;

ALTER TABLE "User"
ALTER COLUMN "locale" SET NOT NULL,
ALTER COLUMN "locale" SET DEFAULT 'ko';
