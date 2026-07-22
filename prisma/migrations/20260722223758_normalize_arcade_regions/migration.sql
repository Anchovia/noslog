-- 기존 자유 입력 지역을 관리자 선택용 고정 지역값으로 정규화함
UPDATE "Arcade"
SET "region" = CASE
    WHEN CONCAT_WS(' ', "region", "address") LIKE '%서울%' THEN '서울'
    WHEN CONCAT_WS(' ', "region", "address") LIKE '%경기%' THEN '경기'
    WHEN CONCAT_WS(' ', "region", "address") LIKE '%대전%' THEN '대전'
    WHEN CONCAT_WS(' ', "region", "address") LIKE '%광주%' THEN '광주'
    WHEN CONCAT_WS(' ', "region", "address") LIKE '%대구%' THEN '대구'
    ELSE '기타'
END
WHERE "region" IS NULL
   OR "region" NOT IN ('서울', '경기', '대전', '광주', '대구', '기타');
