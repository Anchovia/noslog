-- 2026-09-12 서열표 재구성으로 Basic 목표가 fc → 990k 로 바뀌었지만 투표 검사 제약은 옛 목표만 허용했다.
-- 그래서 Basic 990k 투표 저장이 DB 에서 거절됐다(2026-10-15 DB 통합 테스트로 발견). 990k 를 더한다.
-- 옛 fc 행(Recital S · FC 표 보관분)이 남아 있을 수 있어 fc 도 그대로 허용한다.
-- 운영 DB 에는 2026-10-15 같은 제약을 손으로 먼저 적용했다. 다시 실행해도 결과가 같다.
ALTER TABLE "ChartGoalVote" DROP CONSTRAINT IF EXISTS "ChartGoalVote_scope_value";
ALTER TABLE "ChartGoalVote" ADD CONSTRAINT "ChartGoalVote_scope_value" CHECK (
    "mode" IN ('basic', 'recital') AND "goal" IN ('s', 'fc', '990k', 'pianist') AND
    "value" BETWEEN 1 AND 14.5 AND abs("value" * 10 - round("value" * 10)) < 0.00000001
);
