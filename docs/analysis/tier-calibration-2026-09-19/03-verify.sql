-- 읽기 전용. 차이 0이면 반영 직후 저장한 배치와 일치합니다.
SELECT COUNT(*) AS differences_from_applied_snapshot
FROM (SELECT id,payload FROM "_TierCalibration_20260919_v1" WHERE kind='after_entry') b
FULL JOIN (SELECT id,to_jsonb(e) payload FROM "TierEntry" e WHERE tier_list_id IN (1,2,3,6)) e USING(id)
WHERE b.payload IS DISTINCT FROM e.payload;
SELECT t.slug,c.difficulty,COUNT(*) AS chart_count,MIN(b.value) AS minimum,MAX(b.value) AS maximum
FROM "TierEntry" e JOIN "TierList" t ON t.id=e.tier_list_id JOIN "TierBand" b ON b.id=e.tier_band_id
JOIN "MusicChart" c ON c.id=e.chart_id WHERE t.id IN (1,2,3,6) GROUP BY t.slug,c.difficulty ORDER BY t.slug,c.difficulty;
