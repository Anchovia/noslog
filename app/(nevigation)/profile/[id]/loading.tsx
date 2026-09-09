import PageContainer from "@/components/layout/pageContainer";
import RecordListSkeleton from "@/components/ui/recordListSkeleton";
import { getServerI18n } from "@/lib/i18n/server";

export default async function ProfileLoading() {
    const { t } = await getServerI18n();
    return (
        <PageContainer className="nl-profile" aria-busy="true">
            <p className="nl-body-secondary nl-muted" role="status">
                {t("profile.loading")}
            </p>
            <div className="nl-profile-loading__identity" aria-hidden="true" />
            <div className="nl-profile-loading__summary" aria-hidden="true" />
            <div className="nl-profile-body" aria-hidden="true">
                <section className="nl-profile-section">
                    <h2 className="nl-section-title">
                        {t("profile.progress")}
                    </h2>
                    <div className="nl-profile-loading__plot" />
                </section>
                <section className="nl-profile-section">
                    <h2 className="nl-section-title">
                        {t("profile.bestPlays")}
                    </h2>
                    <RecordListSkeleton />
                </section>
                <section className="nl-profile-section">
                    <h2 className="nl-section-title">
                        {t("profile.recordOverview")}
                    </h2>
                    <div className="nl-profile-loading__overview" />
                </section>
                <section className="nl-profile-section">
                    <h2 className="nl-section-title">
                        {t("profile.recentPlays")}
                    </h2>
                    <RecordListSkeleton />
                </section>
            </div>
        </PageContainer>
    );
}
