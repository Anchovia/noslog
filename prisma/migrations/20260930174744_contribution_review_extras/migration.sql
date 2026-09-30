-- 기여 검토 확장(2026-10-01) — 결과 알림(A2) · 고쳐서 반영(C2) · 정형 반려 사유(D2) · 채보 의견 종류(H2)

-- AlterTable: 채보 의견 종류 — problem | suggestion | praise
ALTER TABLE "chart_comments" ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'problem';

-- AlterTable: 작성자가 검토 결과를 본 시각
ALTER TABLE "chart_drafts" ADD COLUMN     "seen_at" TIMESTAMP(3);

-- AlterTable: 고쳐서 반영한 값 · 정형 반려 사유 코드 · 결과를 본 시각
ALTER TABLE "chart_field_proposals" ADD COLUMN     "applied_value" TEXT,
ADD COLUMN     "reject_reason_code" TEXT,
ADD COLUMN     "seen_at" TIMESTAMP(3);
