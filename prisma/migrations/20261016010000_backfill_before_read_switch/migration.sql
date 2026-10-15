-- 2026-10-16 DB 재설계 P4(전환) — 읽기를 player_stats · best_at · played_at · day 로 옮기기 직전에 백필을 한 번 더 돌린다.
-- P3 배포 순간 옛 인스턴스가 새 열 없이 쓴 행을 채운다. 20261015180000 의 백필과 같은 문장이고, 다시 돌려도 결과가 같다.
-- 이 배포 뒤에도 동기화는 옛 열 · 새 열에 함께 쓴다(줄이기는 P5)
SET lock_timeout = '5s';

-- 백필 ------------------------------------------------------------------------------------------
-- 공식 사이트 시각은 KST, 분 단위(「YYYY-MM-DD HH:MM」 · 「YYYY/MM/DD HH:MM」). 잘못된 날짜는 NULL 로 두고 멈추지 않는다
CREATE OR REPLACE FUNCTION pg_temp.noslog_kst_time(value text) RETURNS timestamptz LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
    IF value IS NULL OR value LIKE '1970-01-01%'
       OR value !~ '^\d{4}[-/.]\d{2}[-/.]\d{2}[ T]\d{2}:\d{2}(:\d{2})?$' THEN
        RETURN NULL;
    END IF;
    RETURN (translate(replace(value, 'T', ' '), '/.', '--') || '+09')::timestamptz;
EXCEPTION WHEN others THEN
    RETURN NULL;
END $$;

CREATE OR REPLACE FUNCTION pg_temp.noslog_day(value text) RETURNS date LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
    IF value IS NULL OR value !~ '^\d{4}-\d{2}-\d{2}$' THEN
        RETURN NULL;
    END IF;
    RETURN value::date;
EXCEPTION WHEN others THEN
    RETURN NULL;
END $$;

UPDATE "PlayData" SET "best_at" = pg_temp.noslog_kst_time("besttime")
WHERE "best_at" IS NULL AND pg_temp.noslog_kst_time("besttime") IS NOT NULL;

UPDATE "ChartRecordSnapshot" SET "best_at" = pg_temp.noslog_kst_time("besttime")
WHERE "best_at" IS NULL AND pg_temp.noslog_kst_time("besttime") IS NOT NULL;

UPDATE "ChartPlayHistory" SET "played_at" = pg_temp.noslog_kst_time("source_play_time")
WHERE "played_at" IS NULL AND pg_temp.noslog_kst_time("source_play_time") IS NOT NULL;

UPDATE "UserBestGrade" SET "day" = pg_temp.noslog_day("besttime")
WHERE "day" IS NULL AND pg_temp.noslog_day("besttime") IS NOT NULL;

-- 동기화 기록이 하나라도 있는 사람만 줄을 만든다. 다시 돌리면 User 의 지금 값으로 맞춘다
-- last_full_record_at 은 tz 없는 timestamp 에 UTC 로 들어 있어 AT TIME ZONE 'UTC' 로 읽는다
INSERT INTO "player_stats" (
    "user_id", "grade_basic", "grade_recital",
    "score_p", "score_f", "score_s", "score_a2", "score_a", "score_b2", "score_b", "score_c", "score_d",
    "play_count", "last_played_at", "last_full_record_at", "updated_at"
)
SELECT "id", "grade_basic", "grade_recital",
    "score_p", "score_f", "score_s", "score_a2", "score_a", "score_b2", "score_b", "score_c", "score_d",
    "play_count", pg_temp.noslog_kst_time("nostalgia_last_playtime"),
    "last_full_record_at" AT TIME ZONE 'UTC', CURRENT_TIMESTAMP
FROM "User"
WHERE "grade_basic" IS NOT NULL OR "grade_recital" IS NOT NULL OR "play_count" IS NOT NULL
   OR "last_full_record_at" IS NOT NULL OR "score_p" IS NOT NULL OR "nostalgia_last_playtime" IS NOT NULL
ON CONFLICT ("user_id") DO UPDATE SET
    "grade_basic" = EXCLUDED."grade_basic",
    "grade_recital" = EXCLUDED."grade_recital",
    "score_p" = EXCLUDED."score_p",
    "score_f" = EXCLUDED."score_f",
    "score_s" = EXCLUDED."score_s",
    "score_a2" = EXCLUDED."score_a2",
    "score_a" = EXCLUDED."score_a",
    "score_b2" = EXCLUDED."score_b2",
    "score_b" = EXCLUDED."score_b",
    "score_c" = EXCLUDED."score_c",
    "score_d" = EXCLUDED."score_d",
    "play_count" = EXCLUDED."play_count",
    "last_played_at" = EXCLUDED."last_played_at",
    "last_full_record_at" = EXCLUDED."last_full_record_at",
    "updated_at" = EXCLUDED."updated_at";
