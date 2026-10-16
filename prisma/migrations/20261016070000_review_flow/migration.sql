-- 2026-10-16 DB 재설계 D5-B — 검토 흐름 표의 공통 규칙.
-- 상태 값 이름을 한 벌(draft · pending · changes_requested · approved · rejected)로: 값 이름만 바꾸고(RENAME VALUE) 행은 다시 쓰지 않는다.
-- 배포 몇 분 동안 옛 서버가 옛 이름을 쓰면 실패한다(초안 · 이벤트 제출, 운영자 검토) — 다시 누르면 된다.
SET lock_timeout = '5s';
SET statement_timeout = '60s';

ALTER TYPE "ProposalStatus" RENAME VALUE 'applied' TO 'approved';

ALTER TYPE "ChartDraftStatus" RENAME VALUE 'submitted' TO 'pending';
ALTER TYPE "ChartDraftStatus" RENAME VALUE 'published' TO 'approved';

ALTER TYPE "CommunityEventStatus" RENAME VALUE 'DRAFT' TO 'draft';
ALTER TYPE "CommunityEventStatus" RENAME VALUE 'PENDING' TO 'pending';
ALTER TYPE "CommunityEventStatus" RENAME VALUE 'CHANGES_REQUESTED' TO 'changes_requested';
ALTER TYPE "CommunityEventStatus" RENAME VALUE 'PUBLISHED' TO 'approved';
ALTER TYPE "CommunityEventStatus" RENAME VALUE 'REJECTED' TO 'rejected';

-- 검정 인증을 승인 · 반려한 운영자. 이전 기록은 비어 있다. User.id 가 int 라 같은 타입
-- squawk-ignore prefer-bigint-over-int
ALTER TABLE "ExamSubmission" ADD COLUMN "reviewed_by_id" INTEGER;
-- 작은 표(운영 수십 줄)라 잠금이 순간이다
-- squawk-ignore adding-foreign-key-constraint, constraint-missing-not-valid
ALTER TABLE "ExamSubmission" ADD CONSTRAINT "ExamSubmission_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- 작은 표(운영 수십 줄)라 잠금이 순간이다
-- squawk-ignore require-concurrent-index-creation
CREATE INDEX "ExamSubmission_reviewed_by_id_idx" ON "ExamSubmission"("reviewed_by_id");

-- 한 사람이 한 검정에 심사 대기 인증은 하나 — 앱이 막던 것을 DB 도 지킨다. 겹친 줄이 있으면 실패해 배포가 멈춘다(배포 전 확인 SQL)
-- 작은 표(운영 수십 줄)라 잠금이 순간이다
-- squawk-ignore require-concurrent-index-creation
CREATE UNIQUE INDEX "ExamSubmission_one_pending" ON "ExamSubmission"("user_id", "exam_id") WHERE "status" = 'pending';
