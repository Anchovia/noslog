import { formatMetricPercentage } from "@/lib/music/judgementStats";
import type { ProfileSJustAnalytics } from "@/lib/profile/profileAnalytics";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";

interface ProfileJudgementSummaryProps {
    analytics: ProfileSJustAnalytics;
}

export default function ProfileJudgementSummary({
    analytics,
}: ProfileJudgementSummaryProps) {
    const locale = useLocale();
    const t = useTranslations();
    const numberLocale =
        locale === "ja" ? "ja-JP" : locale === "en" ? "en-US" : "ko-KR";

    return (
        <section className="bg-surface rounded-card p-4">
            <h2 className="text-section">{t("profile.judgementDetails")}</h2>
            <div className="bg-surface-muted rounded-card mt-3 flex items-center justify-between gap-3 p-3">
                <span className="text-caption">S-Just</span>
                <strong className="text-label tabular-nums">
                    {formatMetricPercentage(analytics.sjustRate) ?? "-"}
                </strong>
            </div>
            <p className="text-micro mt-2">
                {analytics.chartCount > 0
                    ? t("profile.judgementBasis", {
                          count: analytics.chartCount.toLocaleString(
                              numberLocale
                          ),
                      })
                    : t("profile.judgementEmpty")}
            </p>
        </section>
    );
}
