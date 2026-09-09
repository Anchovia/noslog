import ArcadeDiscoveryPage from "@/features/arcades/components/arcadeDiscoveryPage";
import { getPublicArcades } from "@/features/arcades/server/publicArcadeService";
import { clientEnv } from "@/lib/env/client";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata/site";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();

    return createPageMetadata({
        title: t("arcades.title"),
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
