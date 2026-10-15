import db from "@/lib/db";

/** 「곡 index:난이도」 → 채보 id. 동기화 한 번에 여러 단계가 같이 쓴다(2026-10-16 DB 재설계 Q2) */
export type ChartIdMap = Map<string, number>;

export async function loadChartIds(): Promise<ChartIdMap> {
    const charts = await db.musicChart.findMany({
        select: { id: true, music_idx: true, difficulty: true },
    });
    return new Map(
        charts.map((chart) => [
            `${chart.music_idx}:${chart.difficulty}`,
            chart.id,
        ])
    );
}
