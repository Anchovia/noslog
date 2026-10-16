-- 2026-10-16 DB 재설계 P5-2(줄이기) — P5-1 배포부터 코드가 읽지도 쓰지도 않는 옛 열 · 옛 유일 키 · 브로치 표를 지운다.
-- 옛 코드(P5-1)의 클라이언트는 이 열들을 @ignore 로 읽지 않으므로 배포 순간에도 깨지지 않는다.
-- DROP COLUMN 은 메타데이터만 바꿔 표를 다시 쓰지 않는다. 되돌리기는 Neon 시점 복원.
SET lock_timeout = '5s';

-- 브로치 · NOS — 동기화가 모으기만 하고 읽는 곳이 없었다(K5)
ALTER TABLE "User" DROP CONSTRAINT "User_equipped_brooch_index_fkey";
DROP TABLE "UserBrooch";
DROP TABLE "Brooch";

-- User 의 옛 파생 값(player_stats 로 옮김) · 쓰지 않던 순위 4열
ALTER TABLE "User" DROP COLUMN "equipped_brooch_index",
DROP COLUMN "grade_basic",
DROP COLUMN "grade_recital",
DROP COLUMN "last_full_record_at",
DROP COLUMN "nostalgia_last_playtime",
DROP COLUMN "nostalgia_nos",
DROP COLUMN "play_count",
DROP COLUMN "rank_basic",
DROP COLUMN "rank_basic_country",
DROP COLUMN "rank_recital",
DROP COLUMN "rank_recital_country",
DROP COLUMN "score_a",
DROP COLUMN "score_a2",
DROP COLUMN "score_b",
DROP COLUMN "score_b2",
DROP COLUMN "score_c",
DROP COLUMN "score_d",
DROP COLUMN "score_f",
DROP COLUMN "score_p",
DROP COLUMN "score_s";

-- PlayData 의 곡 사본 · 문자열 시각(채보 연결 · best_at 으로 옮김)
ALTER TABLE "PlayData" DROP CONSTRAINT "PlayData_music_idx_fkey";
ALTER TABLE "PlayData" DROP COLUMN "besttime",
DROP COLUMN "difficulty",
DROP COLUMN "music_idx";

-- 문자열 시각과 그 유일 키(played_at · best_at · day 로 옮김)
DROP INDEX "ChartPlayHistory_user_id_chart_id_source_play_time_score_ma_key";
ALTER TABLE "ChartPlayHistory" DROP COLUMN "source_play_time";
ALTER TABLE "ChartRecordSnapshot" DROP COLUMN "besttime";
DROP INDEX "UserBestGrade_user_id_besttime_key";
ALTER TABLE "UserBestGrade" DROP COLUMN "besttime";

-- D6 다음 단계 준비 — 공지 본문 사본은 번역 표가 정본이라 쓰지 않는다(P5-3 에서 지움)
ALTER TABLE "Announcement" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "content" DROP NOT NULL;
