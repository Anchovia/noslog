"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import ProfilePerformanceAnalysis from "@/components/profile/dashboard/profilePerformanceAnalysis";
import { formatMetricPercentage } from "@/lib/music/judgementStats";
import type { ProfilePerformanceAnalytics } from "@/lib/profile/profileAnalytics";

interface ProfileAnalysisSummaryProps {
    analytics: ProfilePerformanceAnalytics;
}

function getTimingSummary(analytics: ProfilePerformanceAnalytics) {
    const fastRate = analytics.timing.fastRate;
    if (fastRate === null) return "-";

    if (analytics.timing.fastCount === analytics.timing.slowCount) {
        return "균형";
    }

    const isFast = analytics.timing.fastCount > analytics.timing.slowCount;
    const rate = isFast ? fastRate : 100 - fastRate;

    return `${isFast ? "FAST" : "SLOW"} ${formatMetricPercentage(rate)}`;
}

export default function ProfileAnalysisSummary({
    analytics,
}: ProfileAnalysisSummaryProps) {
    const [expanded, setExpanded] = useState(false);
    const weakestNote = analytics.noteRates.find(
        (note) => note.label === analytics.weakestNoteType
    );

    return (
        <section className="bg-surface rounded-card p-4">
            <h2>
                <button
                    aria-controls="profile-performance-details"
                    aria-expanded={expanded}
                    className="focus-visible:ring-focus -my-2 flex min-h-11 w-full items-center justify-between gap-3 rounded-sm text-left focus-visible:ring-2 focus-visible:outline-none"
                    onClick={() => setExpanded((value) => !value)}
                    type="button"
                >
                    <span className="text-section">플레이 분석</span>
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

            <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="bg-surface-muted rounded-card min-w-0 p-3">
                    <p className="text-caption">최근 타이밍</p>
                    <p className="text-label mt-1 truncate tabular-nums">
                        {getTimingSummary(analytics)}
                    </p>
                </div>
                <div className="bg-surface-muted rounded-card min-w-0 p-3">
                    <p className="text-caption">취약 음표</p>
                    <p className="text-label mt-1 truncate">
                        {weakestNote
                            ? `${weakestNote.label} ${formatMetricPercentage(
                                  weakestNote.value
                              )}`
                            : "-"}
                    </p>
                </div>
            </div>

            <p className="text-micro mt-2">
                최근 판정 {analytics.timing.playCount}플레이와 베스트 기록 기준
            </p>

            {expanded ? (
                <div id="profile-performance-details">
                    <ProfilePerformanceAnalysis analytics={analytics} />
                </div>
            ) : null}
        </section>
    );
}
