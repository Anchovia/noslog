-- CreateTable
CREATE TABLE "ArcadePublicDetails" (
    "arcadeId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "nativeLanguage" TEXT,
    "administrativeArea" TEXT,
    "locality" TEXT,
    "addressLines" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "phone" TEXT,
    "website" TEXT,
    "creditLabel" TEXT,
    "hours" JSONB,
    "hoursVerifiedAt" TIMESTAMP(3),
    "hoursValidUntil" TIMESTAMP(3),
    "cabinetVerifiedAt" TIMESTAMP(3),
    "priceVerifiedAt" TIMESTAMP(3),
    "locationVerifiedAt" TIMESTAMP(3),
    "verificationSource" TEXT,

    CONSTRAINT "ArcadePublicDetails_pkey" PRIMARY KEY ("arcadeId")
);

-- CreateTable
CREATE TABLE "ArcadeCabinet" (
    "id" SERIAL NOT NULL,
    "arcadeId" INTEGER NOT NULL,
    "label" TEXT,
    "position" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "availability" TEXT NOT NULL DEFAULT 'unknown',
    "condition" TEXT NOT NULL DEFAULT 'unknown',
    "note" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "verificationSource" TEXT,

    CONSTRAINT "ArcadeCabinet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArcadePublicPhoto" (
    "id" SERIAL NOT NULL,
    "arcadeId" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3),
    "rightsConfirmedAt" TIMESTAMP(3) NOT NULL,
    "publicConsentAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArcadePublicPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArcadeLocalizedIdentity" (
    "id" SERIAL NOT NULL,
    "arcadeId" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reviewedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArcadeLocalizedIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArcadeSlugAlias" (
    "slug" TEXT NOT NULL,
    "arcadeId" INTEGER NOT NULL,

    CONSTRAINT "ArcadeSlugAlias_pkey" PRIMARY KEY ("slug")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArcadePublicDetails_slug_key" ON "ArcadePublicDetails"("slug");

-- CreateIndex
CREATE INDEX "ArcadeCabinet_arcadeId_isActive_idx" ON "ArcadeCabinet"("arcadeId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ArcadeCabinet_arcadeId_position_key" ON "ArcadeCabinet"("arcadeId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ArcadePublicPhoto_arcadeId_slot_key" ON "ArcadePublicPhoto"("arcadeId", "slot");

-- CreateIndex
CREATE UNIQUE INDEX "ArcadeLocalizedIdentity_arcadeId_locale_key" ON "ArcadeLocalizedIdentity"("arcadeId", "locale");

-- AddForeignKey
ALTER TABLE "ArcadePublicDetails" ADD CONSTRAINT "ArcadePublicDetails_arcadeId_fkey" FOREIGN KEY ("arcadeId") REFERENCES "Arcade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArcadeCabinet" ADD CONSTRAINT "ArcadeCabinet_arcadeId_fkey" FOREIGN KEY ("arcadeId") REFERENCES "Arcade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArcadePublicPhoto" ADD CONSTRAINT "ArcadePublicPhoto_arcadeId_fkey" FOREIGN KEY ("arcadeId") REFERENCES "Arcade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArcadeLocalizedIdentity" ADD CONSTRAINT "ArcadeLocalizedIdentity_arcadeId_fkey" FOREIGN KEY ("arcadeId") REFERENCES "Arcade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArcadeSlugAlias" ADD CONSTRAINT "ArcadeSlugAlias_arcadeId_fkey" FOREIGN KEY ("arcadeId") REFERENCES "Arcade"("id") ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE "ArcadeCabinet" ADD CONSTRAINT "ArcadeCabinet_state_check" CHECK (
  "availability" IN ('unknown', 'available', 'unavailable')
  AND "condition" IN ('unknown', 'good', 'normal', 'caution')
  AND ("availability" = 'available' OR "condition" = 'unknown')
  AND ("condition" NOT IN ('normal', 'caution') OR length(btrim(COALESCE("note", ''))) > 0)
  AND "position" >= 0
);
ALTER TABLE "ArcadePublicPhoto" ADD CONSTRAINT "ArcadePublicPhoto_slot_check" CHECK ("slot" BETWEEN 0 AND 2);
ALTER TABLE "ArcadeLocalizedIdentity" ADD CONSTRAINT "ArcadeLocalizedIdentity_locale_check" CHECK ("locale" IN ('ko', 'ja', 'en'));

