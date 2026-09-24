"use server";

import { reviewChartDraft as reviewChartDraftService } from "@/features/contributions/server/chartDraftService";
import { reviewChartFieldProposals as reviewChartFieldProposalsService } from "@/features/contributions/server/chartFieldProposalService";

export async function reviewChartFieldProposals(input: unknown) {
    return reviewChartFieldProposalsService(input);
}

/** 채보 초안 검토 — 「수정 요청」 · 「공개」(2026-09-24 C1). 서비스가 운영자 권한을 확인한다 */
export async function reviewChartDraft(input: unknown) {
    return reviewChartDraftService(input);
}
