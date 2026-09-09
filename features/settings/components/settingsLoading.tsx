import RecordListSkeleton from "@/components/ui/recordListSkeleton";
import { getServerI18n } from "@/lib/i18n/server";

export default async function SettingsLoading({
    profile = false,
}: {
    profile?: boolean;
}) {
    const { t } = await getServerI18n();
    return (
        <div className="nl-settings__loading">
            <p className="nl-body" role="status">
                {t(profile ? "profile.loading" : "common.loading")}
            </p>
            {profile ? <RecordListSkeleton count={4} /> : null}
        </div>
    );
}
