"use server";

import { reviewChartFieldProposals as reviewChartFieldProposalsService } from "@/features/contributions/server/chartFieldProposalService";

export async function reviewChartFieldProposals(input: unknown) {
    return reviewChartFieldProposalsService(input);
}
