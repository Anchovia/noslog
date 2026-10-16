-- 2026-10-16 DB 재설계 D4-C 2차 — 남은 닫힌 값 목록을 enum 으로. 값 이름은 DB 에 쓰던 문자열 그대로, 알파벳 순.
-- 게임에서 오는 rank 는 열린 값이라 문자열, 서열표 목표는 990k 때문에 문자열 + CHECK(1차 결정).
-- 표가 작아(가장 큰 MusicChart 약 2천 줄) 열 타입 변경의 표 재작성은 순간이다. 목록 밖 값이 있으면 캐스트가 실패해 배포가 멈춘다.
SET lock_timeout = '5s';
SET statement_timeout = '60s';

CREATE TYPE "ChartDifficulty" AS ENUM ('Expert', 'Hard', 'Normal', 'Real');
CREATE TYPE "BingoDifficulty" AS ENUM ('expert', 'hard', 'normal', 'real');
CREATE TYPE "AnalyticsKind" AS ENUM ('api', 'audience', 'audienceVisitor', 'external', 'hour', 'page', 'pageviews', 'visitors');
CREATE TYPE "ChartPatternRevisionKind" AS ENUM ('contribution', 'manual', 'publish', 'vid2bmap');

-- 작은 표(가장 큰 것 약 2천 줄)라 다시 쓰기가 순간이다
-- squawk-ignore changing-column-type
ALTER TABLE "MusicChart" ALTER COLUMN "difficulty" TYPE "ChartDifficulty" USING "difficulty"::"ChartDifficulty";

-- 빙고 편집기는 「없음」 을 NULL 로 쓴다 — 혹시 남은 빈 글자도 NULL 로
-- 작은 표(가장 큰 것 약 2천 줄)라 다시 쓰기가 순간이다
-- squawk-ignore changing-column-type
ALTER TABLE "BingoCell" ALTER COLUMN "target_difficulty" TYPE "BingoDifficulty" USING NULLIF("target_difficulty", '')::"BingoDifficulty";

-- 작은 표(가장 큰 것 약 2천 줄)라 다시 쓰기가 순간이다
-- squawk-ignore changing-column-type
ALTER TABLE "analytics_daily_counts" ALTER COLUMN "kind" TYPE "AnalyticsKind" USING "kind"::"AnalyticsKind";

ALTER TABLE "ChartPatternRevision" ALTER COLUMN "kind" DROP DEFAULT;
-- 작은 표(가장 큰 것 약 2천 줄)라 다시 쓰기가 순간이다
-- squawk-ignore changing-column-type
ALTER TABLE "ChartPatternRevision" ALTER COLUMN "kind" TYPE "ChartPatternRevisionKind" USING "kind"::"ChartPatternRevisionKind";
ALTER TABLE "ChartPatternRevision" ALTER COLUMN "kind" SET DEFAULT 'manual'::"ChartPatternRevisionKind";
