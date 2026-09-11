-- 1.0 에서 옮겨 온 검정 급수 칸. 2.0 은 승인된 합격 기록(ExamAchievement)만 출처로 쓴다.
-- 운영·개발 모두 값이 있는 사용자 0명 확인 후 삭제 (2026-09-12)
-- AlterTable
ALTER TABLE "User" DROP COLUMN "exam_basic",
DROP COLUMN "exam_recital";
