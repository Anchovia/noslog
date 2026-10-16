-- 2026-10-16 DB 재설계 P5-1(줄이기 준비) — 코드가 더는 읽지도 쓰지도 않는 옛 열의 NOT NULL 을 풀고, 유일 키를 새 열로 더한다.
-- 옛 열 · 옛 유일 키 · 브로치 표는 배포 순간 옛 코드를 위해 남기고 P5-2 에서 지운다(스키마에서는 @ignore).
-- 표가 모두 작아(가장 큰 PlayData 4.4만 줄) 잠금은 순간이다.
SET lock_timeout = '5s';

-- 검정 보상 종류를 enum 으로(운영 값 grade · music_unlock 뿐 — 2026-10-16 확인)
CREATE TYPE "ExamRewardType" AS ENUM ('grade', 'music_unlock');
ALTER TABLE "ExamReward" ALTER COLUMN "type" TYPE "ExamRewardType" USING "type"::"ExamRewardType";

-- 서열표 목표 값 목록을 DB 가 지킨다(K2 — 990k 는 enum 이름이 될 수 없어 CHECK). fc 는 보관된 옛 Recital FC 표
ALTER TABLE "TierList" ADD CONSTRAINT "TierList_goal_check" CHECK ("goal" IS NULL OR "goal" IN ('s', 'fc', '990k', 'pianist'));
ALTER TABLE "ChartGoalVoteAudit" ADD CONSTRAINT "ChartGoalVoteAudit_goal_check" CHECK ("goal" IN ('s', 'fc', '990k', 'pianist'));
ALTER TABLE "ChartGoalVoteReview" ADD CONSTRAINT "ChartGoalVoteReview_goal_check" CHECK ("goal" IN ('s', 'fc', '990k', 'pianist'));

-- User 의 옛 파생 값 인덱스(Grd 랭킹은 player_stats 인덱스로 옮김) · 브로치 장착 인덱스
DROP INDEX "User_grade_basic_id_idx";
DROP INDEX "User_grade_recital_id_idx";
DROP INDEX "User_country_grade_basic_id_idx";
DROP INDEX "User_country_grade_recital_id_idx";
DROP INDEX "User_equipped_brooch_index_idx";

-- 기록은 채보에 묶인다(D2-B) — chart_id 없는 기록 0줄(2026-10-16 운영 확인). 앱에 채보 삭제 경로가 없어 Restrict
ALTER TABLE "PlayData" DROP CONSTRAINT "PlayData_chart_id_fkey";
ALTER TABLE "PlayData" DROP CONSTRAINT "PlayData_music_idx_fkey";
ALTER TABLE "PlayData" ALTER COLUMN "difficulty" DROP NOT NULL,
ALTER COLUMN "besttime" DROP NOT NULL,
ALTER COLUMN "music_idx" DROP NOT NULL,
ALTER COLUMN "chart_id" SET NOT NULL;
ALTER TABLE "PlayData" ADD CONSTRAINT "PlayData_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music"("index") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PlayData" ADD CONSTRAINT "PlayData_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ChartRecordSnapshot" ALTER COLUMN "besttime" DROP NOT NULL;

-- 최근 플레이 — 같은 플레이 하나를 played_at 으로 가른다. 문자열 시각 정렬 인덱스는 played_at 인덱스(P4)로 바뀌었다
DROP INDEX "ChartPlayHistory_user_id_source_play_time_id_idx";
ALTER TABLE "ChartPlayHistory" ALTER COLUMN "source_play_time" DROP NOT NULL,
ALTER COLUMN "played_at" SET NOT NULL;
CREATE UNIQUE INDEX "ChartPlayHistory_user_id_chart_id_played_at_score_max_combo_key" ON "ChartPlayHistory"("user_id", "chart_id", "played_at", "score", "max_combo", "rank");

-- 하루 Grd 한 줄 — day 로
ALTER TABLE "UserBestGrade" ALTER COLUMN "besttime" DROP NOT NULL,
ALTER COLUMN "day" SET NOT NULL;
CREATE UNIQUE INDEX "UserBestGrade_user_id_day_key" ON "UserBestGrade"("user_id", "day");
