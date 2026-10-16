-- 2026-10-16 DB 재설계 D6 — 오락실 지역 · 주소의 정본을 공개 정보(ArcadePublicDetails)로 옮긴다.
-- 지금까지 관리자는 옛 칸(Arcade.region · address)에만 쓰고 공개 화면은 새 칸 → 옛 칸 순서로 읽었다.
-- 옛 칸 값을 비어 있는 새 칸에 옮기고(다시 돌려도 결과가 같다), 이 배포부터 코드는 새 칸만 쓴다. 옛 칸은 P5-3 에서 지운다.
-- 영업시간(business_hours)은 옛 형식의 메모 · 요일 대체가 화면에 쓰여 이번에 옮기지 않는다.
SET lock_timeout = '5s';

-- 공개 정보 줄이 없는 오락실 — 관리자 저장이 만들 때와 같은 기본값(slug = id, KR · Asia/Seoul · KRW)
INSERT INTO "ArcadePublicDetails" ("arcadeId", "slug", "countryCode", "timeZone", "currencyCode")
SELECT a."id", a."id"::text, 'KR', 'Asia/Seoul', 'KRW'
FROM "Arcade" a
WHERE NOT EXISTS (SELECT 1 FROM "ArcadePublicDetails" d WHERE d."arcadeId" = a."id")
ON CONFLICT DO NOTHING;

UPDATE "ArcadePublicDetails" d SET "administrativeArea" = a."region"
FROM "Arcade" a
WHERE d."arcadeId" = a."id" AND d."administrativeArea" IS NULL AND a."region" IS NOT NULL;

UPDATE "ArcadePublicDetails" d SET "addressLines" = string_to_array(a."address", E'\n')
FROM "Arcade" a
WHERE d."arcadeId" = a."id" AND cardinality(d."addressLines") = 0 AND COALESCE(a."address", '') <> '';

-- 옮기지 못한 값이 있으면 멈춘다(공개 정보 줄을 만들지 못한 오락실 — slug 충돌 등)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM "Arcade" a
        LEFT JOIN "ArcadePublicDetails" d ON d."arcadeId" = a."id"
        WHERE (a."region" IS NOT NULL AND d."administrativeArea" IS NULL)
           OR (COALESCE(a."address", '') <> '' AND COALESCE(cardinality(d."addressLines"), 0) = 0)
    ) THEN
        RAISE EXCEPTION 'arcade region/address backfill incomplete';
    END IF;
END $$;
