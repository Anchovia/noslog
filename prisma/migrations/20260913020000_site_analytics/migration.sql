-- 방문·API 통계(자체 집계). 날짜별 합계는 90일, 방문자 해시와 그날의 무작위 값은 다음 날 정리 작업이 지운다

-- CreateTable
CREATE TABLE "analytics_daily_counts" (
    "date" DATE NOT NULL,
    "kind" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT '',
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "analytics_daily_counts_pkey" PRIMARY KEY ("date","kind","key")
);

-- CreateTable
CREATE TABLE "analytics_visitors" (
    "date" DATE NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "analytics_visitors_pkey" PRIMARY KEY ("date","hash")
);

-- CreateTable
CREATE TABLE "analytics_salts" (
    "date" DATE NOT NULL,
    "salt" TEXT NOT NULL,

    CONSTRAINT "analytics_salts_pkey" PRIMARY KEY ("date")
);

-- CreateIndex
CREATE INDEX "analytics_daily_counts_kind_date_idx" ON "analytics_daily_counts"("kind", "date");
