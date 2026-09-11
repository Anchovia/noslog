-- 서열표 재구성: Basic = S · 990k · Pianist, Recital = 표 하나(기존 Recital Pianist 표)

-- Basic Full Combo 서열표를 990k 서열표로 이름만 바꾼다. 곡 배치·변경 이력은 표에 붙어 그대로 남는다
UPDATE "TierList" SET "goal" = '990k' WHERE "mode" = 'basic' AND "goal" = 'fc';
UPDATE "TierList"
SET "slug" = 'basic-990k',
    "title" = 'Basic 990k 서열표',
    "description" = 'Basic 모드에서 990,000점 달성을 목표로 하는 통합 서열표'
WHERE "slug" = 'basic-fc';

-- 그 표에 쌓인 서열 투표도 같은 표를 따라간다
UPDATE "ChartGoalVote" SET "goal" = '990k' WHERE "mode" = 'basic' AND "goal" = 'fc';
UPDATE "ChartGoalVoteAudit" SET "goal" = '990k' WHERE "mode" = 'basic' AND "goal" = 'fc';
UPDATE "ChartGoalVoteReview" SET "goal" = '990k' WHERE "mode" = 'basic' AND "goal" = 'fc';

-- Recital 은 기존 Recital Pianist 표 하나만 남긴다. S · Full Combo 표는 지우지 않고 비공개로 보관
UPDATE "TierList"
SET "title" = 'Recital 서열표',
    "description" = 'Recital 모드 통합 서열표'
WHERE "slug" = 'recital-pianist';
UPDATE "TierList"
SET "status" = 'draft'
WHERE "mode" = 'recital' AND "goal" IN ('s', 'fc') AND "status" = 'published';
