-- 기여 점수 기록(2026-09-24) — 반영 · 처리된 기여마다 한 줄. 원본이 보관 기간으로 지워져도 점수는 남는다.
-- 새 테이블을 만들고 지금까지의 기여를 한 번 채운다(기존 테이블은 읽기만, 바꾸지 않음).

-- CreateTable
CREATE TABLE "contribution_points" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "source_key" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contribution_points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contribution_points_user_id_idx" ON "contribution_points"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "contribution_points_user_id_kind_source_key_key" ON "contribution_points"("user_id", "kind", "source_key");

-- AddForeignKey
ALTER TABLE "contribution_points" ADD CONSTRAINT "contribution_points_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- 지금까지의 기여 채우기
-- 곡 정보 제안: 반영된 제안 1건 = 1점
INSERT INTO "contribution_points" ("user_id", "kind", "source_key", "points", "created_at")
SELECT "user_id", 'chart_field', "id"::text, 1, COALESCE("reviewed_at", "created_at")
FROM "chart_field_proposals"
WHERE "status" = 'applied'
ON CONFLICT DO NOTHING;

-- 오락실 제보: 처리 완료된 제보 1건 = 1점
INSERT INTO "contribution_points" ("user_id", "kind", "source_key", "points", "created_at")
SELECT "user_id", 'arcade_report', "id"::text, 1, COALESCE("resolved_at", "created_at")
FROM "FeedbackReport"
WHERE "arcadeId" IS NOT NULL AND "status" = 'resolved'
ON CONFLICT DO NOTHING;

-- 기체 확인: 사람마다 서울 날짜 하루 1점
INSERT INTO "contribution_points" ("user_id", "kind", "source_key", "points", "created_at")
SELECT "user_id",
       'cabinet_check',
       to_char(("checked_at" AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD'),
       1,
       MIN("checked_at")
FROM "ArcadeCabinetCheck"
GROUP BY "user_id", to_char(("checked_at" AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD')
ON CONFLICT DO NOTHING;
