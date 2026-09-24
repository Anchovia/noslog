"use server";

import { listMyChartDrafts as listMyChartDraftsService } from "@/features/contributions/server/chartDraftService";
import { listMyChartFieldProposals as listMyChartFieldProposalsService } from "@/features/contributions/server/chartFieldProposalService";

export async function listMyChartFieldProposals(limit: number) {
    return listMyChartFieldProposalsService(limit);
}

export async function listMyChartDrafts(limit: number) {
    return listMyChartDraftsService(limit);
}
