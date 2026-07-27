-- CreateTable
CREATE TABLE "ChartPattern" (
    "id" SERIAL NOT NULL,
    "chart_id" INTEGER NOT NULL,
    "format_version" INTEGER NOT NULL DEFAULT 1,
    "draft_content" JSONB NOT NULL,
    "published_content" JSONB,
    "draft_version" INTEGER NOT NULL DEFAULT 0,
    "saved_revision" INTEGER NOT NULL DEFAULT 0,
    "published_revision" INTEGER,
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "published_by_id" INTEGER,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChartPattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartPatternRevision" (
    "id" SERIAL NOT NULL,
    "pattern_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'manual',
    "message" TEXT,
    "content" JSONB NOT NULL,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChartPatternRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChartPattern_chart_id_key" ON "ChartPattern"("chart_id");

-- CreateIndex
CREATE INDEX "ChartPattern_published_at_idx" ON "ChartPattern"("published_at");

-- CreateIndex
CREATE INDEX "ChartPattern_created_by_id_idx" ON "ChartPattern"("created_by_id");

-- CreateIndex
CREATE INDEX "ChartPattern_updated_by_id_idx" ON "ChartPattern"("updated_by_id");

-- CreateIndex
CREATE INDEX "ChartPattern_published_by_id_idx" ON "ChartPattern"("published_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "ChartPatternRevision_pattern_id_number_key"
ON "ChartPatternRevision"("pattern_id", "number");

-- CreateIndex
CREATE INDEX "ChartPatternRevision_pattern_id_created_at_idx"
ON "ChartPatternRevision"("pattern_id", "created_at");

-- CreateIndex
CREATE INDEX "ChartPatternRevision_created_by_id_idx"
ON "ChartPatternRevision"("created_by_id");

-- AddForeignKey
ALTER TABLE "ChartPattern"
ADD CONSTRAINT "ChartPattern_chart_id_fkey"
FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartPattern"
ADD CONSTRAINT "ChartPattern_created_by_id_fkey"
FOREIGN KEY ("created_by_id") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartPattern"
ADD CONSTRAINT "ChartPattern_updated_by_id_fkey"
FOREIGN KEY ("updated_by_id") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartPattern"
ADD CONSTRAINT "ChartPattern_published_by_id_fkey"
FOREIGN KEY ("published_by_id") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartPatternRevision"
ADD CONSTRAINT "ChartPatternRevision_pattern_id_fkey"
FOREIGN KEY ("pattern_id") REFERENCES "ChartPattern"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartPatternRevision"
ADD CONSTRAINT "ChartPatternRevision_created_by_id_fkey"
FOREIGN KEY ("created_by_id") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
