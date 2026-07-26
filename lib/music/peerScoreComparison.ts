export const PEER_GRADE_RANGE = 200;
export const PEER_STORED_GRADE_RANGE = PEER_GRADE_RANGE * 100;
export const MIN_PEER_SCORE_SAMPLE = 5;

export const peerJudgementKeys = [
    "judge_sjust",
    "judge_just",
    "judge_good",
    "judge_miss",
    "judge_near",
] as const;

export type PeerJudgementKey = (typeof peerJudgementKeys)[number];

export const peerNoteRateKeys = [
    "note_rate_standard",
    "note_rate_tenuto",
    "note_rate_glissando",
    "note_rate_trill",
] as const;

export type PeerNoteRateKey = (typeof peerNoteRateKeys)[number];

export interface PeerScoreRecord {
    score: number;
    judge_sjust: number | null;
    judge_just: number | null;
    judge_good: number | null;
    judge_miss: number | null;
    judge_near: number | null;
    note_rate_standard: number | null;
    note_rate_tenuto: number | null;
    note_rate_glissando: number | null;
    note_rate_trill: number | null;
}

export interface PeerJudgementComparison {
    averages: Record<PeerJudgementKey, number>;
    sampleCount: number;
}

export interface PeerNoteRateComparison {
    averages: Record<PeerNoteRateKey, number | null>;
    sampleCounts: Record<PeerNoteRateKey, number>;
}

export interface PeerScoreComparison {
    averageScore: number;
    sampleCount: number;
    gradeRange: number;
    judgement: PeerJudgementComparison | null;
    noteRates: PeerNoteRateComparison;
}

export function buildPeerScoreComparison(
    records: PeerScoreRecord[]
): PeerScoreComparison | null {
    if (records.length < MIN_PEER_SCORE_SAMPLE) {
        return null;
    }

    const judgementRecords = records.filter((record) => {
        const counts = peerJudgementKeys.map((key) => record[key]);

        return (
            counts.every(
                (count) =>
                    count !== null && Number.isFinite(count) && count >= 0
            ) &&
            counts.reduce<number>((sum, count) => sum + (count ?? 0), 0) > 0
        );
    });

    const judgement =
        judgementRecords.length >= MIN_PEER_SCORE_SAMPLE
            ? {
                  averages: Object.fromEntries(
                      peerJudgementKeys.map((key) => [
                          key,
                          judgementRecords.reduce((sum, record) => {
                              const total = peerJudgementKeys.reduce(
                                  (recordTotal, judgementKey) =>
                                      recordTotal + (record[judgementKey] ?? 0),
                                  0
                              );

                              return sum + ((record[key] ?? 0) / total) * 100;
                          }, 0) / judgementRecords.length,
                      ])
                  ) as Record<PeerJudgementKey, number>,
                  sampleCount: judgementRecords.length,
              }
            : null;

    const noteRates = Object.fromEntries(
        peerNoteRateKeys.map((key) => {
            const values = records
                .map((record) => record[key])
                .filter(
                    (value): value is number =>
                        value !== null && Number.isFinite(value) && value >= 0
                );

            return [
                key,
                {
                    average:
                        values.length >= MIN_PEER_SCORE_SAMPLE
                            ? values.reduce((sum, value) => sum + value, 0) /
                              values.length
                            : null,
                    sampleCount: values.length,
                },
            ];
        })
    ) as Record<
        PeerNoteRateKey,
        { average: number | null; sampleCount: number }
    >;

    return {
        averageScore: Math.round(
            records.reduce((sum, record) => sum + record.score, 0) /
                records.length
        ),
        sampleCount: records.length,
        gradeRange: PEER_GRADE_RANGE,
        judgement,
        noteRates: {
            averages: Object.fromEntries(
                peerNoteRateKeys.map((key) => [key, noteRates[key].average])
            ) as Record<PeerNoteRateKey, number | null>,
            sampleCounts: Object.fromEntries(
                peerNoteRateKeys.map((key) => [key, noteRates[key].sampleCount])
            ) as Record<PeerNoteRateKey, number>,
        },
    };
}
