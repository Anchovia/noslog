export const contributionKeys = {
    chartComments: (chartId: number) => ["chart-comments", chartId] as const,
    chartDraftComments: (chartId: number, draftId: number | null) =>
        ["chart-comments", chartId, draftId] as const,
    myChartDraft: (chartId: number) =>
        ["chart-draft", "mine", chartId] as const,
    chartFieldQueue: () => ["chart-field-proposal", "queue"] as const,
    myPendingChartFields: (chartId: number, accountId: number) =>
        ["chart-field-proposals", "mine", chartId, accountId] as const,
    mine: () => ["contribution", "mine"] as const,
    mineCounts: () => ["contribution", "mine", "counts"] as const,
    mineRecent: () => ["contribution", "mine", "recent"] as const,
    mineAll: () => ["contribution", "mine", "all"] as const,
    mineUnseen: () => ["contribution", "mine", "unseen"] as const,
};
