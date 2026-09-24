"use server";

import { listMyChartFieldProposals as listMyChartFieldProposalsService } from "@/features/contributions/server/chartFieldProposalService";

export async function listMyChartFieldProposals(limit: number) {
    return listMyChartFieldProposalsService(limit);
}
