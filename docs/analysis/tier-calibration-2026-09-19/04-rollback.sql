-- 적용 직후 상태가 그대로일 때만 복구합니다. 후속 편집이 있으면 중단합니다.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='60s';
LOCK TABLE "TierList", "TierBand", "TierEntry", "TierPlacementHistory" IN SHARE ROW EXCLUSIVE MODE;
DO $guard$
BEGIN
 IF EXISTS(SELECT 1 FROM "_TierCalibration_20260919_v1" WHERE kind='rolled_back') THEN RAISE EXCEPTION '이미 복구한 작업입니다'; END IF;
 IF EXISTS(SELECT 1 FROM (SELECT id,payload FROM "_TierCalibration_20260919_v1" WHERE kind='after_entry') b
 FULL JOIN (SELECT id,to_jsonb(t) payload FROM "TierEntry" t WHERE tier_list_id IN (1,2,3,6)) c USING(id)
 WHERE b.payload IS DISTINCT FROM c.payload) THEN RAISE EXCEPTION 'TierEntry에 후속 변경이 있어 복구를 중단합니다'; END IF;
 IF EXISTS(SELECT 1 FROM (SELECT id,payload FROM "_TierCalibration_20260919_v1" WHERE kind='after_list') b
 FULL JOIN (SELECT id,to_jsonb(t) payload FROM "TierList" t WHERE id IN (1,2,3,6)) c USING(id)
 WHERE b.payload IS DISTINCT FROM c.payload) THEN RAISE EXCEPTION 'TierList에 후속 변경이 있어 복구를 중단합니다'; END IF;
 IF EXISTS(SELECT 1 FROM (SELECT id,payload FROM "_TierCalibration_20260919_v1" WHERE kind='after_history') b
 FULL JOIN (SELECT id,to_jsonb(t) payload FROM "TierPlacementHistory" t WHERE tier_list_id IN (1,2,3,6)) c USING(id)
 WHERE b.payload IS DISTINCT FROM c.payload) THEN RAISE EXCEPTION 'TierPlacementHistory에 후속 변경이 있어 복구를 중단합니다'; END IF;
END $guard$;
DELETE FROM "TierPlacementHistory" h WHERE tier_list_id IN (1,2,3,6) AND NOT EXISTS
 (SELECT 1 FROM "_TierCalibration_20260919_v1" b WHERE b.kind='before_history' AND b.id=h.id);
DELETE FROM "TierEntry" e WHERE tier_list_id IN (1,2,3,6) AND NOT EXISTS
 (SELECT 1 FROM "_TierCalibration_20260919_v1" b WHERE b.kind='before_entry' AND b.id=e.id);
UPDATE "TierEntry" SET position=-id WHERE tier_list_id IN (1,2,3,6);
UPDATE "TierEntry" e SET tier_band_id=(b.payload->>'tier_band_id')::integer,
 position=(b.payload->>'position')::integer,updated_at=(b.payload->>'updated_at')::timestamp
FROM "_TierCalibration_20260919_v1" b WHERE b.kind='before_entry' AND b.id=e.id;
UPDATE "TierList" t SET updated_at=(b.payload->>'updated_at')::timestamp
FROM "_TierCalibration_20260919_v1" b WHERE b.kind='before_list' AND b.id=t.id;
DO $check$ BEGIN
 IF EXISTS(SELECT 1 FROM (SELECT id,payload FROM "_TierCalibration_20260919_v1" WHERE kind='before_entry') b
 FULL JOIN (SELECT id,to_jsonb(t) payload FROM "TierEntry" t WHERE tier_list_id IN (1,2,3,6)) c USING(id)
 WHERE b.payload IS DISTINCT FROM c.payload) THEN RAISE EXCEPTION 'TierEntry 복구 검증 실패'; END IF;
END $check$;
DO $check$ BEGIN
 IF EXISTS(SELECT 1 FROM (SELECT id,payload FROM "_TierCalibration_20260919_v1" WHERE kind='before_list') b
 FULL JOIN (SELECT id,to_jsonb(t) payload FROM "TierList" t WHERE id IN (1,2,3,6)) c USING(id)
 WHERE b.payload IS DISTINCT FROM c.payload) THEN RAISE EXCEPTION 'TierList 복구 검증 실패'; END IF;
END $check$;
DO $check$ BEGIN
 IF EXISTS(SELECT 1 FROM (SELECT id,payload FROM "_TierCalibration_20260919_v1" WHERE kind='before_history') b
 FULL JOIN (SELECT id,to_jsonb(t) payload FROM "TierPlacementHistory" t WHERE tier_list_id IN (1,2,3,6)) c USING(id)
 WHERE b.payload IS DISTINCT FROM c.payload) THEN RAISE EXCEPTION 'TierPlacementHistory 복구 검증 실패'; END IF;
END $check$;
INSERT INTO "_TierCalibration_20260919_v1" VALUES ('rolled_back',0,jsonb_build_object('at',CURRENT_TIMESTAMP));
COMMIT;
SELECT '복구 완료' AS result;
