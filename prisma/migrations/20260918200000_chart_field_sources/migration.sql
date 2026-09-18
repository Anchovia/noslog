-- CreateTable
CREATE TABLE "chart_field_sources" (
    "id" SERIAL NOT NULL,
    "chart_id" INTEGER,
    "music_index" TEXT,
    "field" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "source_url" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chart_field_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unlock_condition_translations" (
    "id" SERIAL NOT NULL,
    "source_text" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unlock_condition_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chart_field_sources_chart_id_field_idx" ON "chart_field_sources"("chart_id", "field");

-- CreateIndex
CREATE INDEX "chart_field_sources_music_index_field_idx" ON "chart_field_sources"("music_index", "field");

-- CreateIndex
CREATE UNIQUE INDEX "unlock_condition_translations_source_text_locale_key" ON "unlock_condition_translations"("source_text", "locale");

-- AddForeignKey
ALTER TABLE "chart_field_sources" ADD CONSTRAINT "chart_field_sources_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_field_sources" ADD CONSTRAINT "chart_field_sources_music_index_fkey" FOREIGN KEY ("music_index") REFERENCES "Music"("index") ON DELETE CASCADE ON UPDATE CASCADE;

