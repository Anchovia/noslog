import MaintenanceContent from "@/features/recovery/components/maintenanceContent";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";
import { localizePath } from "@/lib/i18n/routing";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();
    return createPageMetadata({
        title: t("maintenance.title"),
        path: localizePath("/maintenance", locale),
        noIndex: true,
    });
}

export default async function MaintenancePage() {
    return <MaintenanceContent />;
}
