#!/usr/bin/env python3
"""Build review/apply/verify/rollback SQL from offline exports; no DB access."""
import argparse,json
from pathlib import Path

BACKUP='"_TierCalibration_20260919_v1"'
SLUGS=['basic-s','basic-990k','basic-pianist','recital-pianist']
def quote(x): return "'"+str(x).replace("'","''")+"'"
def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--placements',required=True); ap.add_argument('--catalogue',required=True); ap.add_argument('--output',required=True)
    a=ap.parse_args(); out=Path(a.output)
    old=json.loads(Path(a.placements).read_text()); catalog=json.loads(Path(a.catalogue).read_text()); props=json.loads((out/'proposals.json').read_text())
    lists={r['slug']:r['tier_list_id'] for r in old if r['slug'] in SLUGS}
    assert len(lists)==4 and len(set(lists.values()))==4
    ids=','.join(str(lists[s]) for s in SLUGS)
    pvalues=',\n'.join(f"({lists[p['slug']]},{p['chart_id']},{p['proposed_tier']})" for p in props)
    pcte='WITH proposal(tier_list_id,chart_id,new_value) AS (VALUES\n'+pvalues+'\n)\n'
    preview=pcte+'''SELECT t.slug, COUNT(*) AS target_charts,
 COUNT(*) FILTER (WHERE e.id IS NULL) AS new_entries,
 COUNT(*) FILTER (WHERE e.id IS NOT NULL AND b.value IS DISTINCT FROM p.new_value::double precision) AS changed_entries,
 COUNT(*) FILTER (WHERE b.value = p.new_value::double precision) AS unchanged_entries
FROM proposal p JOIN "TierList" t ON t.id=p.tier_list_id
LEFT JOIN "TierEntry" e ON e.tier_list_id=p.tier_list_id AND e.chart_id=p.chart_id
LEFT JOIN "TierBand" b ON b.id=e.tier_band_id
GROUP BY t.slug ORDER BY t.slug;
'''
    (out/'01-preview.sql').write_text('-- 조회 전용: 변경/신규 건수를 확인합니다.\n'+preview)
    expected=','.join(f"({r['entry_id']},{r['tier_list_id']},{r['chart_id']},{r['current_tier']},{quote(r['entry_updated_at'])}::timestamp,{r['history_count']},{quote(r['last_history_at'])+'::timestamp' if r['last_history_at'] else 'NULL::timestamp'})" for r in old if r['slug'] in SLUGS)
    cvalues=','.join(f"({c['chart_id']},{quote(c['difficulty'])},{c['official_constant']},{c['note_count'] if c['note_count'] is not None else 'NULL'})" for c in catalog if c['difficulty'] in ['Hard','Expert','Real'])
    listvalues=','.join(f"({lists[s]},{quote(s)},{quote(s.split('-')[0])},{quote(s.split('-',1)[1])})" for s in SLUGS)
    apply=f'''-- 검토 후 사용자가 Neon에서 실행. 운영 DB에서 에이전트는 실행하지 않습니다.
-- 원본 백업 테이블 {BACKUP}을 만들며 재실행/자료 변경 시 전체 중단합니다.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='60s';
LOCK TABLE "TierList", "TierBand", "TierEntry", "TierPlacementHistory", "MusicChart" IN SHARE ROW EXCLUSIVE MODE;
CREATE TEMP TABLE _tc_proposal ON COMMIT DROP AS
{pcte}SELECT * FROM proposal;
CREATE TEMP TABLE _tc_expected ON COMMIT DROP AS
SELECT * FROM (VALUES {expected}) x(id,tier_list_id,chart_id,old_value,updated_at,history_count,last_history_at);
CREATE TEMP TABLE _tc_catalogue ON COMMIT DROP AS
SELECT * FROM (VALUES {cvalues}) x(chart_id,difficulty,official_constant,note_count);
CREATE TEMP TABLE _tc_lists ON COMMIT DROP AS
SELECT * FROM (VALUES {listvalues}) x(id,slug,mode,goal);
DO $guard$
BEGIN
 IF EXISTS (SELECT 1 FROM _tc_lists x LEFT JOIN "TierList" t ON t.id=x.id
   WHERE t.id IS NULL OR t.slug<>x.slug OR t.mode<>x.mode OR t.goal IS DISTINCT FROM x.goal OR t.status<>'published')
 THEN RAISE EXCEPTION '서열표 정보가 변경되었습니다. 재조회 필요'; END IF;
 IF EXISTS (SELECT 1 FROM _tc_catalogue x FULL JOIN
   (SELECT * FROM "MusicChart" WHERE difficulty IN ('Hard','Expert','Real')) c ON c.id=x.chart_id
   WHERE x.chart_id IS NULL OR c.id IS NULL OR x.difficulty<>c.difficulty
    OR x.official_constant::double precision IS DISTINCT FROM c.level_constant
    OR x.note_count IS DISTINCT FROM c.note_count)
 THEN RAISE EXCEPTION '전체 채보 목록/상수/노트 수가 변경되었습니다. 재분석 필요'; END IF;
 IF (SELECT COUNT(*) FROM _tc_proposal)<>{len(props)} OR
    EXISTS (SELECT 1 FROM _tc_proposal GROUP BY tier_list_id,chart_id HAVING COUNT(*)<>1) OR
    EXISTS (SELECT 1 FROM _tc_proposal WHERE new_value<1 OR new_value>14.5 OR new_value*10<>ROUND(new_value*10))
 THEN RAISE EXCEPTION '제안 데이터 검증 실패'; END IF;
 IF EXISTS (SELECT 1 FROM _tc_expected x FULL JOIN
   (SELECT * FROM "TierEntry" WHERE tier_list_id IN ({ids})) e ON e.id=x.id
   LEFT JOIN "TierBand" b ON b.id=e.tier_band_id
   WHERE x.id IS NULL OR e.id IS NULL OR x.tier_list_id<>e.tier_list_id OR x.chart_id<>e.chart_id
    OR x.old_value::double precision IS DISTINCT FROM b.value OR x.updated_at<>e.updated_at)
 THEN RAISE EXCEPTION '현재 배치가 제공한 자료와 다릅니다. 재조회 필요'; END IF;
 IF EXISTS (SELECT 1 FROM _tc_expected x LEFT JOIN LATERAL
   (SELECT COUNT(*) n,MAX(effective_at) last_at FROM "TierPlacementHistory" h
    WHERE h.tier_list_id=x.tier_list_id AND h.chart_id=x.chart_id) h ON true
   WHERE h.n<>x.history_count OR h.last_at IS DISTINCT FROM x.last_history_at)
 THEN RAISE EXCEPTION '변경 이력이 달라졌습니다. 재조회 필요'; END IF;
 IF EXISTS (SELECT 1 FROM _tc_proposal p LEFT JOIN "TierBand" b
   ON b.tier_list_id=p.tier_list_id AND b.value=p.new_value::double precision WHERE b.id IS NULL)
 THEN RAISE EXCEPTION '필요한 상수 구간이 없습니다. 구간 추가 후 재검토 필요'; END IF;
END $guard$;
CREATE TABLE {BACKUP} (kind text NOT NULL, id integer NOT NULL, payload jsonb NOT NULL, PRIMARY KEY(kind,id));
INSERT INTO {BACKUP} SELECT 'before_entry',id,to_jsonb(e) FROM "TierEntry" e WHERE tier_list_id IN ({ids});
INSERT INTO {BACKUP} SELECT 'before_list',id,to_jsonb(t) FROM "TierList" t WHERE id IN ({ids});
INSERT INTO {BACKUP} SELECT 'before_history',id,to_jsonb(h) FROM "TierPlacementHistory" h WHERE tier_list_id IN ({ids});
CREATE TEMP TABLE _tc_changes ON COMMIT DROP AS
SELECT p.*,b.id AS new_band_id,e.id AS old_entry_id
FROM _tc_proposal p JOIN "TierBand" b ON b.tier_list_id=p.tier_list_id AND b.value=p.new_value::double precision
LEFT JOIN "TierEntry" e ON e.tier_list_id=p.tier_list_id AND e.chart_id=p.chart_id
WHERE e.id IS NULL OR e.tier_band_id<>b.id;
-- 一意制約を避ける退避位置。最終位置は正の連番に戻す。
UPDATE "TierEntry" SET position=-id WHERE tier_list_id IN ({ids});
UPDATE "TierEntry" e SET tier_band_id=x.new_band_id,updated_at=CURRENT_TIMESTAMP
FROM _tc_changes x WHERE e.id=x.old_entry_id;
INSERT INTO "TierEntry" (tier_list_id,tier_band_id,chart_id,position,created_at,updated_at)
SELECT tier_list_id,new_band_id,chart_id,
 ROW_NUMBER() OVER(PARTITION BY new_band_id ORDER BY chart_id)::integer,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
FROM _tc_changes WHERE old_entry_id IS NULL;
UPDATE "TierEntry" SET position=-id WHERE tier_list_id IN ({ids});
WITH ordered AS (
 SELECT e.id,ROW_NUMBER() OVER(PARTITION BY e.tier_band_id ORDER BY
  CASE WHEN (b.payload->>'tier_band_id')::integer=e.tier_band_id THEN 0 ELSE 1 END,
  CASE WHEN (b.payload->>'tier_band_id')::integer=e.tier_band_id THEN (b.payload->>'position')::integer ELSE e.chart_id END,e.id)::integer pos
 FROM "TierEntry" e LEFT JOIN {BACKUP} b ON b.kind='before_entry' AND b.id=e.id
 WHERE e.tier_list_id IN ({ids})
)
UPDATE "TierEntry" e SET position=o.pos,
 updated_at=CASE WHEN b.id IS NOT NULL AND (b.payload->>'position')::integer=o.pos
 AND (b.payload->>'tier_band_id')::integer=e.tier_band_id THEN (b.payload->>'updated_at')::timestamp ELSE CURRENT_TIMESTAMP END
FROM ordered o LEFT JOIN {BACKUP} b ON b.kind='before_entry' AND b.id=o.id WHERE e.id=o.id;
INSERT INTO "TierPlacementHistory" (tier_list_id,chart_id,band_value,effective_at,created_at)
SELECT tier_list_id,chart_id,new_value,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM _tc_changes;
UPDATE "TierList" SET updated_at=CURRENT_TIMESTAMP WHERE id IN ({ids});
DO $check$
BEGIN
 IF EXISTS (SELECT 1 FROM _tc_proposal p LEFT JOIN "TierEntry" e ON e.tier_list_id=p.tier_list_id AND e.chart_id=p.chart_id
 LEFT JOIN "TierBand" b ON b.id=e.tier_band_id WHERE b.value IS DISTINCT FROM p.new_value::double precision)
 THEN RAISE EXCEPTION '반영 후 상수 검증 실패'; END IF;
 IF EXISTS (SELECT 1 FROM {BACKUP} b JOIN "MusicChart" c ON c.id=(b.payload->>'chart_id')::integer
 LEFT JOIN "TierEntry" e ON e.id=b.id WHERE b.kind='before_entry' AND c.difficulty='Normal'
 AND (e.id IS NULL OR e.tier_band_id<>(b.payload->>'tier_band_id')::integer))
 THEN RAISE EXCEPTION 'Normal 배치 변경 감지'; END IF;
 IF EXISTS (SELECT 1 FROM "TierEntry" WHERE tier_list_id IN ({ids}) AND position<=0)
 THEN RAISE EXCEPTION '위치 정리 실패'; END IF;
END $check$;
INSERT INTO {BACKUP} SELECT 'after_entry',id,to_jsonb(e) FROM "TierEntry" e WHERE tier_list_id IN ({ids});
INSERT INTO {BACKUP} SELECT 'after_list',id,to_jsonb(t) FROM "TierList" t WHERE id IN ({ids});
INSERT INTO {BACKUP} SELECT 'after_history',id,to_jsonb(h) FROM "TierPlacementHistory" h WHERE tier_list_id IN ({ids});
COMMIT;
SELECT t.slug,COUNT(*) FILTER(WHERE b.kind='after_entry') AS entries_after
FROM {BACKUP} b JOIN "TierList" t ON t.id=(b.payload->>'tier_list_id')::integer
WHERE b.kind='after_entry' GROUP BY t.slug ORDER BY t.slug;
'''
    apply=apply.replace('-- 一意制約を避ける退避位置。最終位置は正の連番に戻す。','-- 위치 고유 제약을 피하기 위해 임시 음수로 옮긴 뒤 양수 연번으로 복원합니다.')
    (out/'02-apply.sql').write_text(apply)
    rollback=f'''-- 적용 직후 상태가 그대로일 때만 복구합니다. 후속 편집이 있으면 중단합니다.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='60s';
LOCK TABLE "TierList", "TierBand", "TierEntry", "TierPlacementHistory" IN SHARE ROW EXCLUSIVE MODE;
DO $guard$
BEGIN
 IF EXISTS(SELECT 1 FROM {BACKUP} WHERE kind='rolled_back') THEN RAISE EXCEPTION '이미 복구한 작업입니다'; END IF;
'''
    for table,kind,filtercol in [('TierEntry','entry','tier_list_id'),('TierList','list','id'),('TierPlacementHistory','history','tier_list_id')]:
        rollback+=f''' IF EXISTS(SELECT 1 FROM (SELECT id,payload FROM {BACKUP} WHERE kind='after_{kind}') b
 FULL JOIN (SELECT id,to_jsonb(t) payload FROM "{table}" t WHERE {filtercol} IN ({ids})) c USING(id)
 WHERE b.payload IS DISTINCT FROM c.payload) THEN RAISE EXCEPTION '{table}에 후속 변경이 있어 복구를 중단합니다'; END IF;
'''
    rollback+=f'''END $guard$;
DELETE FROM "TierPlacementHistory" h WHERE tier_list_id IN ({ids}) AND NOT EXISTS
 (SELECT 1 FROM {BACKUP} b WHERE b.kind='before_history' AND b.id=h.id);
DELETE FROM "TierEntry" e WHERE tier_list_id IN ({ids}) AND NOT EXISTS
 (SELECT 1 FROM {BACKUP} b WHERE b.kind='before_entry' AND b.id=e.id);
UPDATE "TierEntry" SET position=-id WHERE tier_list_id IN ({ids});
UPDATE "TierEntry" e SET tier_band_id=(b.payload->>'tier_band_id')::integer,
 position=(b.payload->>'position')::integer,updated_at=(b.payload->>'updated_at')::timestamp
FROM {BACKUP} b WHERE b.kind='before_entry' AND b.id=e.id;
UPDATE "TierList" t SET updated_at=(b.payload->>'updated_at')::timestamp
FROM {BACKUP} b WHERE b.kind='before_list' AND b.id=t.id;
'''
    for table,kind,filtercol in [('TierEntry','entry','tier_list_id'),('TierList','list','id'),('TierPlacementHistory','history','tier_list_id')]:
        rollback+=f'''DO $check$ BEGIN
 IF EXISTS(SELECT 1 FROM (SELECT id,payload FROM {BACKUP} WHERE kind='before_{kind}') b
 FULL JOIN (SELECT id,to_jsonb(t) payload FROM "{table}" t WHERE {filtercol} IN ({ids})) c USING(id)
 WHERE b.payload IS DISTINCT FROM c.payload) THEN RAISE EXCEPTION '{table} 복구 검증 실패'; END IF;
END $check$;
'''
    rollback+=f'''INSERT INTO {BACKUP} VALUES ('rolled_back',0,jsonb_build_object('at',CURRENT_TIMESTAMP));
COMMIT;
SELECT '복구 완료' AS result;
'''
    (out/'04-rollback.sql').write_text(rollback)
    verify=f'''-- 읽기 전용. 차이 0이면 반영 직후 저장한 배치와 일치합니다.
SELECT COUNT(*) AS differences_from_applied_snapshot
FROM (SELECT id,payload FROM {BACKUP} WHERE kind='after_entry') b
FULL JOIN (SELECT id,to_jsonb(e) payload FROM "TierEntry" e WHERE tier_list_id IN ({ids})) e USING(id)
WHERE b.payload IS DISTINCT FROM e.payload;
SELECT t.slug,c.difficulty,COUNT(*) AS chart_count,MIN(b.value) AS minimum,MAX(b.value) AS maximum
FROM "TierEntry" e JOIN "TierList" t ON t.id=e.tier_list_id JOIN "TierBand" b ON b.id=e.tier_band_id
JOIN "MusicChart" c ON c.id=e.chart_id WHERE t.id IN ({ids}) GROUP BY t.slug,c.difficulty ORDER BY t.slug,c.difficulty;
'''
    (out/'03-verify.sql').write_text(verify)
    print('SQL generated',len(props),'proposals')
if __name__=='__main__':main()
