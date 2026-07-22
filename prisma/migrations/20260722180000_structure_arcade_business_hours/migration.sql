-- 기존 자유 텍스트 영업시간이 있다면 legacyNote로 보존하면서 JSON 구조로 전환함
ALTER TABLE "Arcade"
ALTER COLUMN "business_hours" TYPE JSONB
USING CASE
    WHEN "business_hours" IS NULL OR BTRIM("business_hours") = '' THEN NULL
    ELSE JSONB_BUILD_OBJECT('legacyNote', "business_hours")
END;
