-- 2026-10-16 DB 재설계 P5-3(줄이기) — P5-2 배포부터 코드가 읽지도 쓰지도 않는 칸 · 표를 지운다(D6).
-- P5-2 클라이언트는 이 칸들을 @ignore 로 읽지 않으므로 배포 순간에도 깨지지 않는다. DROP 은 표를 다시 쓰지 않는다.
SET lock_timeout = '5s';
SET statement_timeout = '60s';

-- 옛 채보 평가(운영 0줄, 쓰는 코드는 P5-2 에서 지움)
-- 줄이기: 앞 배포(P5-2)부터 코드가 쓰지 않는다
-- squawk-ignore ban-drop-table
DROP TABLE "ChartEvaluationReaction";
-- 줄이기: 앞 배포(P5-2)부터 코드가 쓰지 않는다
-- squawk-ignore ban-drop-table
DROP TABLE "ChartEvaluation";

-- 쓰기만 하고 읽는 화면이 없던 목표 투표 검토 표(목표 CHECK 도 함께 사라진다)
-- 줄이기: 앞 배포(P5-2)부터 코드가 쓰지 않는다
-- squawk-ignore ban-drop-table
DROP TABLE "ChartGoalVoteReview";

-- 공지 본문 ko 사본 — 번역 표가 정본
-- 줄이기: 앞 배포(P5-2)부터 코드가 쓰지 않는다
-- squawk-ignore ban-drop-column
ALTER TABLE "Announcement" DROP COLUMN "content";
-- squawk-ignore ban-drop-column
ALTER TABLE "Announcement" DROP COLUMN "title";

-- 오락실 옛 칸 — 지역 · 주소는 공개 정보로 옮겼고(P5-2), 기기 상태 · 메모 · 대수는 쓰지 않았다
-- 줄이기: 앞 배포(P5-2)부터 코드가 쓰지 않는다
-- squawk-ignore ban-drop-column
ALTER TABLE "Arcade" DROP COLUMN "address";
-- squawk-ignore ban-drop-column
ALTER TABLE "Arcade" DROP COLUMN "machine_count";
-- squawk-ignore ban-drop-column
ALTER TABLE "Arcade" DROP COLUMN "machine_status";
-- squawk-ignore ban-drop-column
ALTER TABLE "Arcade" DROP COLUMN "region";
-- squawk-ignore ban-drop-column
ALTER TABLE "Arcade" DROP COLUMN "status_note";

-- 쓰지 않던 사유 칸 · 첫 확인 시각
-- 줄이기: 앞 배포(P5-2)부터 코드가 쓰지 않는다
-- squawk-ignore ban-drop-column
ALTER TABLE "ChartGoalVote" DROP COLUMN "auditReason";
-- 줄이기: 앞 배포(P5-2)부터 코드가 쓰지 않는다
-- squawk-ignore ban-drop-column
ALTER TABLE "CommunityChartEvaluation" DROP COLUMN "moderationReason";
-- 줄이기: 앞 배포(P5-2)부터 코드가 쓰지 않는다
-- squawk-ignore ban-drop-column
ALTER TABLE "CommunityOpinionReport" DROP COLUMN "reviewReason";
-- 줄이기: 앞 배포(P5-2)부터 코드가 쓰지 않는다
-- squawk-ignore ban-drop-column
ALTER TABLE "MusicCatalogCandidate" DROP COLUMN "first_seen_at";
