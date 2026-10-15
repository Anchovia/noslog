export { default } from "@/features/bingos/components/bingo-page";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();
    return createPageMetadata({
        title: t("bingo.title"),
        description: t("bingo.metaDescription"),
        path: localizePath("/bingo", locale),
    });
}
