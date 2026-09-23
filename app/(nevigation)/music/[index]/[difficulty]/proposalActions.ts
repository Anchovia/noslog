"use server";

import {
    listMyPendingChartFields as listMyPendingChartFieldsService,
    submitChartFieldProposal as submitChartFieldProposalService,
} from "@/features/contributions/server/chartFieldProposalService";

export async function submitChartFieldProposal(
    input: unknown,
    requestedLocale: string
) {
    return submitChartFieldProposalService(input, requestedLocale);
}

export async function listMyPendingChartFields(chartId: number) {
    return listMyPendingChartFieldsService(chartId);
}
