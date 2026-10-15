import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";

export { default } from "@/features/settings/components/settings-page";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();
    return createPageMetadata({
        title: t("settings.overview"),
        path: localizePath("/settings", locale),
        noIndex: true,
    });
}
