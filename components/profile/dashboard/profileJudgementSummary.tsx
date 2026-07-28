import { formatMetricPercentage } from "@/lib/music/judgementStats";
import type { ProfileSJustAnalytics } from "@/lib/profile/profileAnalytics";

interface ProfileJudgementSummaryProps {
    analytics: ProfileSJustAnalytics;
}

export default function ProfileJudgementSummary({
    analytics,
}: ProfileJudgementSummaryProps) {
    return (
        <section className="bg-surface rounded-card p-4">
            <h2 className="text-section">판정 상세</h2>
            <div className="bg-surface-muted rounded-card mt-3 flex items-center justify-between gap-3 p-3">
                <span className="text-caption">S-Just</span>
                <strong className="text-label tabular-nums">
                    {formatMetricPercentage(analytics.sjustRate) ?? "-"}
                </strong>
            </div>
            <p className="text-micro mt-2">
                {analytics.chartCount > 0
                    ? `${analytics.chartCount.toLocaleString("ko-KR")}개 채보의 베스트 기록 기준`
                    : "연동된 판정 기록이 없습니다."}
            </p>
        </section>
    );
}
