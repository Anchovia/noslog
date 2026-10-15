import ArcadeDiscoveryPage from "@/features/arcades/components/arcade-discovery-page";
import { getPublicArcades } from "@/features/arcades/server/public-arcade-service";
import { clientEnv } from "@/lib/env/client";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();

    return createPageMetadata({
        title: t("arcades.title"),
        description: t("arcades.metaDescription"),
        path: localizePath("/gamecenter", locale),
    });
}

export default async function GamecenterPage() {
    const arcades = await getPublicArcades();
    return (
        <ArcadeDiscoveryPage
            appKey={clientEnv.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? ""}
            arcades={arcades}
        />
    );
}
