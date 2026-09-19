import { LoadingStatus, SkeletonText } from "@/components/ui/skeleton";
import { getServerI18n } from "@/lib/i18n/server";

/**
 * 설정 분류 불러오기(2026-09-19 로딩 시안 S1) — 설정 폼과 같은 칸 틀(`nl-field` = 라벨 →8→ 입력칸 L)을 네 줄,
 * 칸 사이 24. 안내 문장은 화면 읽기에만
 */
export default async function SettingsLoading({
    profile = false,
}: {
    profile?: boolean;
}) {
    const { t } = await getServerI18n();
    return (
        <div className="nl-settings__loading" aria-busy="true">
            <LoadingStatus
                label={t(profile ? "profile.loading" : "common.loading")}
            />
            {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="nl-field" aria-hidden="true">
                    <SkeletonText className="nl-field__label" width="s" />
                    <span className="nl-skeleton nl-skeleton-control" />
                </div>
            ))}
        </div>
    );
}
