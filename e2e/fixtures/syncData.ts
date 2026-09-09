import type { SyncStatus } from "@/features/sync/schemas/syncStatusSchema";

export function syncFixtureData(state = "full"): SyncStatus {
    const now = new Date();
    const attempt = {
        id: 1,
        status: ([
            "processing",
            "delayed",
            "timedOut",
            "failed",
            "partial",
        ].includes(state)
            ? state
            : "completed") as SyncStatus["attempts"][number]["status"],
        scope: state === "recent" ? ("recent" as const) : ("full" as const),
        startedAt: new Date(now.getTime() - 120000).toISOString(),
        completedAt: ["processing", "delayed"].includes(state)
            ? null
            : new Date(now.getTime() - 108000).toISOString(),
        receivedPlays: 30,
        insertedPlays: state === "recent" ? 6 : 0,
        changedRecords: state === "large" ? 500 : 1,
        excludedCount: state === "partial" ? 3 : null,
    };
    return {
        observedAt: now.toISOString(),
        attempts:
            state === "none"
                ? []
                : [
                      attempt,
                      ...[2, 3, 4, 5].map((id) => ({
                          ...attempt,
                          id,
                          status: "completed" as const,
                      })),
                  ],
        coverage: { played: 1284, judgement: 946, timing: 812 },
        firstFullImport: state === "large",
        previews: ["full", "recent", "partial"].includes(state)
            ? [
                  {
                      musicId: "fixture-music",
                      title: "50th Memorial Songs -二人の時 ～under the cherry blossoms～",
                      difficulty: "EXPERT",
                      level: 12,
                      score: 976654,
                  },
              ]
            : [],
        retryAfter: state === "cooldown" ? 12 : 0,
    };
}
