ALTER TABLE "Arcade"
ADD COLUMN "play_price" INTEGER,
ADD COLUMN "coin_count" INTEGER;

-- 기존 "500원 / 1코인" 형식의 문자열은 숫자 컬럼으로 가능한 범위에서 이관한다.
UPDATE "Arcade"
SET
    "play_price" = NULLIF(
        REGEXP_REPLACE(SPLIT_PART("price_info", '원', 1), '[^0-9]', '', 'g'),
        ''
    )::INTEGER,
    "coin_count" = NULLIF(
        REGEXP_REPLACE(
            SPLIT_PART(SPLIT_PART("price_info", '/', 2), '코인', 1),
            '[^0-9]',
            '',
            'g'
        ),
        ''
    )::INTEGER
WHERE "price_info" IS NOT NULL;

ALTER TABLE "Arcade" DROP COLUMN "price_info";
