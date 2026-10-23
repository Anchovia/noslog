import ArcadeDiscoveryPage from "@/features/arcades/components/arcade-discovery-page";
import { getPublicArcades } from "@/features/arcades/server/public-arcade-service";
import MusecatArcadeListPage from "@/features/musecat/components/musecat-arcade-list-page";
import { getMusecatMode } from "@/features/musecat/server/musecat-mode";
import { getRequestOrigin } from "@/features/musecat/server/request-origin";
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
    // 뮤즈캣 연동(2026-10-20) — MUSECAT_MODE=mock 일 때만 새 목록. live 목록은 연결 사용자 토큰 · 주변 검색 확정 뒤에 붙인다
    if (getMusecatMode() === "mock")
        return (
            <MusecatArcadeListPage
                appKey={clientEnv.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? ""}
                initialOrigin={await getRequestOrigin()}
            />
        );
    const arcades = await getPublicArcades();
    return (
        <ArcadeDiscoveryPage
            appKey={clientEnv.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? ""}
            arcades={arcades}
        />
    );
}
