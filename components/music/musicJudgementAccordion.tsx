"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import type {
    PeerJudgementComparison,
    PeerNoteRateComparison,
} from "@/lib/music/peerScoreComparison";
import JudgementBreakdown from "./judgementBreakdown";
import type {
    PerformanceTrendPoint,
    ScoreTrendPoint,
    UserPlayData,
} from "./musicDetailTypes";
import ScoreTrend from "./scoreTrend";

interface MusicJudgementAccordionProps {
    userPlayData: UserPlayData | null;
    scoreTrend: ScoreTrendPoint[];
    performanceTrend: PerformanceTrendPoint[];
    peerComparison: PeerJudgementComparison | null;
    peerNoteRates: PeerNoteRateComparison | null;
}

export default function MusicJudgementAccordion({
    userPlayData,
    scoreTrend,
    performanceTrend,
    peerComparison,
    peerNoteRates,
}: MusicJudgementAccordionProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <section className="bg-surface rounded-card p-4">
            <h2>
                <button
                    aria-controls="music-judgement-details"
                    aria-expanded={expanded}
                    className="focus-visible:ring-focus -my-2 flex min-h-11 w-full items-center justify-between gap-3 rounded-sm text-left focus-visible:ring-2 focus-visible:outline-none"
                    onClick={() => setExpanded((value) => !value)}
                    type="button"
                >
                    <span className="text-section">판정 상세</span>
                    <span className="text-caption flex items-center gap-1">
                        {expanded ? "접기" : "상세 보기"}
                        <ChevronDown
                            aria-hidden
                            className={`size-4 transition-transform ${
                                expanded ? "rotate-180" : ""
                            }`}
                        />
                    </span>
                </button>
            </h2>

            {expanded ? (
                <div id="music-judgement-details">
                    <JudgementBreakdown
                        counts={{
                            judge_sjust: userPlayData?.judge_sjust ?? null,
                            judge_just: userPlayData?.judge_just ?? null,
                            judge_good: userPlayData?.judge_good ?? null,
                            judge_miss: userPlayData?.judge_miss ?? null,
                            judge_near: userPlayData?.judge_near ?? null,
                        }}
                        noteRates={{
                            note_rate_standard:
                                userPlayData?.note_rate_standard ?? null,
                            note_rate_tenuto:
                                userPlayData?.note_rate_tenuto ?? null,
                            note_rate_glissando:
                                userPlayData?.note_rate_glissando ?? null,
                            note_rate_trill:
                                userPlayData?.note_rate_trill ?? null,
                        }}
                        peerComparison={peerComparison}
                        peerNoteRates={peerNoteRates}
                    />

                    <div className="border-divider mt-4 border-t pt-4">
                        <header className="flex items-center justify-between gap-3">
                            <h3 className="text-section">최근 판정 추이</h3>
                            <span className="text-micro">
                                {performanceTrend.length}플레이 기준
                            </span>
                        </header>
                        <ScoreTrend
                            points={scoreTrend}
                            performancePoints={performanceTrend}
                            variant="judgement"
                        />
                    </div>
                </div>
            ) : null}
        </section>
    );
}
