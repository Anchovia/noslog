import ProfileGradeChart, { type GradeHistoryPoint } from "../chart";
import { useTranslations } from "@/components/i18n/localeProvider";
import type { ProfileMode } from "./profileTypes";

// 프로필 그레이드 변화 차트를 한곳에서 표시함
export default function ProfileGradeTrend({
    data,
    mode,
}: {
    data: GradeHistoryPoint[];
    mode: ProfileMode;
}) {
    const t = useTranslations();

    return (
        <section className="bg-surface rounded-card p-4">
            <div className="mb-2">
                <h2 className="text-section font-bold">
                    {t("profile.gradeTrend")}
                </h2>
            </div>
            <ProfileGradeChart data={data} mode={mode} />
            {data.length > 1 ? (
                <div className="text-caption text-text-disabled flex justify-between">
                    <span>
                        {data[0].besttime.slice(0, 10).replaceAll("-", ".")}
                    </span>
                    <span>
                        {data
                            .at(-1)
                            ?.besttime.slice(0, 10)
                            .replaceAll("-", ".")}
                    </span>
                </div>
            ) : null}
        </section>
    );
}
