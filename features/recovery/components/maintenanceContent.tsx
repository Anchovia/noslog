import { getServerI18n } from "@/lib/i18n/server";
import { getMaintenanceConfig } from "@/features/recovery/server/maintenanceConfig";
import RecoveryAction from "./recoveryAction";

export default async function MaintenanceContent() {
    const { locale, t } = await getServerI18n();
    const { expectedEnd, updatedAt } = getMaintenanceConfig();
    const formatTime = (date: string) =>
        `${new Intl.DateTimeFormat(locale, {
            timeZone: "Asia/Seoul",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
        }).format(new Date(date))} KST`;
    return (
        <div className="noslog-ui nl-recovery-minimal">
            <main id="main-content">
                <div className="nl-recovery-minimal__content">
                    <p className="nl-page-title">NosLog</p>
                    <h1 className="nl-page-title">
                        {t("maintenance.heading")}
                    </h1>
                    <p className="nl-body nl-muted">
                        {t("maintenance.description")}
                    </p>
                    {expectedEnd || updatedAt ? (
                        <dl className="nl-recovery__timing">
                            {expectedEnd ? (
                                <div className="nl-body-secondary">
                                    <dt>{t("recovery.expectedEnd")}</dt>
                                    <dd>
                                        <time dateTime={expectedEnd}>
                                            {formatTime(expectedEnd)}
                                        </time>
                                    </dd>
                                </div>
                            ) : null}
                            {updatedAt ? (
                                <div className="nl-metadata nl-muted">
                                    <dt>{t("recovery.lastUpdated")}</dt>
                                    <dd>
                                        <time dateTime={updatedAt}>
                                            {formatTime(updatedAt)}
                                        </time>
                                    </dd>
                                </div>
                            ) : null}
                        </dl>
                    ) : null}
                    <div className="nl-recovery__actions">
                        <RecoveryAction
                            label={t("recovery.checkAgain")}
                            busyLabel={t("recovery.retrying")}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
