import { queryOptions } from "@tanstack/react-query";

import { listMyPendingChartFields } from "@/app/(nevigation)/music/[index]/[difficulty]/proposalActions";

/** 이 채보에서 내가 낸 대기 중 제안 — 로그인했을 때만 묻는다 */
export function myPendingChartFieldsOptions(
    chartId: number,
    accountId?: number
) {
    return queryOptions({
        queryKey: ["chart-field-proposals", "mine", chartId, accountId ?? 0],
        enabled: Boolean(accountId),
        staleTime: 60_000,
        retry: false,
        queryFn: () => listMyPendingChartFields(chartId),
    });
}
