"use server";

import {
    getChartFieldQueueStatus as getChartFieldQueueStatusService,
    listMyPendingChartFields as listMyPendingChartFieldsService,
    submitChartFieldProposal as submitChartFieldProposalService,
} from "@/features/contributions/server/chart-field-proposal-service";

export async function submitChartFieldProposal(
    input: unknown,
    requestedLocale: string
) {
    return submitChartFieldProposalService(input, requestedLocale);
}

export async function listMyPendingChartFields(chartId: number) {
    return listMyPendingChartFieldsService(chartId);
}

export async function getChartFieldQueueStatus() {
    return getChartFieldQueueStatusService();
}
