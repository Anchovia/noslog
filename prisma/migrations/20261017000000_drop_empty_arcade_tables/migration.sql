-- 2026-10-17 DB 정리 2단계(줄이기) — 1단계 배포(dbf258d9)부터 코드가 읽지도 쓰지도 않는 오락실 표 2개 · 칸 2개를 지운다.
-- 넣는 곳이 없어 운영도 비어 있었다(2026-10-17 확인 SQL: 두 표 0줄 · 두 칸 값 0줄). 혹시 그 뒤에 값이 생겼으면 지우지 않고 멈춘다.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "arcade_localized_identities")
        OR EXISTS (SELECT 1 FROM "arcade_slug_aliases")
        OR EXISTS (
            SELECT 1 FROM "arcade_public_details"
            WHERE "price_verified_at" IS NOT NULL OR "location_verified_at" IS NOT NULL
        ) THEN
        RAISE EXCEPTION '지울 오락실 표 · 칸에 값이 있습니다 — 확인 뒤 다시 배포하세요';
    END IF;
END $$;

-- 오락실 다른 언어 이름 · 옛 주소(넣는 곳이 없던 표)
-- 줄이기: 앞 배포(dbf258d9)부터 코드가 쓰지 않는다
-- squawk-ignore ban-drop-table
DROP TABLE "arcade_localized_identities";
-- squawk-ignore ban-drop-table
DROP TABLE "arcade_slug_aliases";

-- 가격 · 위치 확인 시각(만든 뒤로 읽고 쓰는 곳이 없던 칸)
-- squawk-ignore ban-drop-column
ALTER TABLE "arcade_public_details" DROP COLUMN "price_verified_at";
-- squawk-ignore ban-drop-column
ALTER TABLE "arcade_public_details" DROP COLUMN "location_verified_at";

COMMIT;
