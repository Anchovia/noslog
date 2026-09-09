"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { useLocale } from "@/components/i18n/localeProvider";
import { saveChartContribution } from "@/app/(nevigation)/music/communityActions";
import type {
    CommunityMutation,
    OpinionPage,
} from "@/features/music/schemas/communitySchema";

export default function useCommunityMutation(chartId: number) {
    const locale = useLocale();
    const client = useQueryClient();
    return useMutation({
        mutationFn: async (input: CommunityMutation) => {
            const result = await saveChartContribution(input, locale);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: async (result, input) => {
            if (input.action === "report") return;
            if (input.action === "helpful") {
                client.setQueriesData<InfiniteData<OpinionPage>>(
                    { queryKey: ["music-community", chartId, "opinions"] },
                    (data) =>
                        data
                            ? {
                                  ...data,
                                  pages: data.pages.map((page) => ({
                                      ...page,
                                      items: page.items.map((item) =>
                                          item.id === input.evaluationId
                                              ? {
                                                    ...item,
                                                    helpfulCount:
                                                        result.helpfulCount ??
                                                        item.helpfulCount,
                                                    viewerHelpful:
                                                        result.selected ??
                                                        item.viewerHelpful,
                                                }
                                              : item
                                      ),
                                  })),
                              }
                            : data
                );
                return;
            }
            await client.invalidateQueries({
                queryKey: ["music-community", chartId],
            });
        },
    });
}
