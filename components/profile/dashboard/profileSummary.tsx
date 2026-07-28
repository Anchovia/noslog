import { formatToComma } from "@/lib/utils";
import { useTranslations } from "@/components/i18n/localeProvider";

import type { ProfileUser } from "./profileTypes";
import { formatProfileGrade, getProfileCountryCode } from "./profileUtils";

interface ProfileSummaryProps {
    user: ProfileUser;
    grade: number | null;
    globalRank: number | null;
    countryRank: number | null;
}

// 선택한 모드의 그레이드와 순위를 한곳에서 표시함
export default function ProfileSummary({
    user,
    grade,
    globalRank,
    countryRank,
}: ProfileSummaryProps) {
    const t = useTranslations();

    return (
        <section className="grid grid-cols-2 gap-2">
            <article className="bg-surface rounded-card flex min-w-0 flex-col justify-center p-4">
                <p className="text-caption">{t("profile.grade")}</p>
                <p className="mt-1 flex items-baseline gap-1.5 tabular-nums">
                    <strong className="text-score-display text-score">
                        {formatProfileGrade(grade)}
                    </strong>
                    <span className="text-text-secondary text-xs font-semibold">
                        Grd
                    </span>
                </p>
            </article>
            <article className="bg-surface rounded-card flex min-w-0 flex-col justify-center p-4">
                <p className="text-caption">{t("profile.rank")}</p>
                <p className="text-text-primary mt-1 text-2xl leading-none font-black tabular-nums">
                    {globalRank ? `#${formatToComma(globalRank)}` : "-"}
                </p>
                <p className="text-caption mt-2 flex items-center gap-1.5 tabular-nums">
                    <span className="text-text-primary font-bold">
                        {getProfileCountryCode(user.country)}
                    </span>
                    <span>
                        {countryRank
                            ? `#${formatToComma(countryRank)}`
                            : t("profile.noRank")}
                    </span>
                </p>
            </article>
        </section>
    );
}
