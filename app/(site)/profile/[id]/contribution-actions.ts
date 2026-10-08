"use server";

import { listMyChartDrafts as listMyChartDraftsService } from "@/features/contributions/server/chart-draft-service";
import {
    countMyChartFieldProposals as countMyChartFieldProposalsService,
    countUnseenContributionResults as countUnseenContributionResultsService,
    listMyChartFieldProposals as listMyChartFieldProposalsService,
    markContributionResultsSeen as markContributionResultsSeenService,
} from "@/features/contributions/server/chart-field-proposal-service";

export async function listMyChartFieldProposals(limit: number) {
    return listMyChartFieldProposalsService(limit);
}

export async function listMyChartDrafts(limit: number) {
    return listMyChartDraftsService(limit);
}

export async function countMyChartFieldProposals() {
    return countMyChartFieldProposalsService();
}

export async function countUnseenContributionResults() {
    return countUnseenContributionResultsService();
}

export async function markContributionResultsSeen() {
    return markContributionResultsSeenService();
}
