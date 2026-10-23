import { notFound, permanentRedirect } from "next/navigation";

import ArcadeDetailPage from "@/features/arcades/components/arcade-detail-page";
import {
    getRecentCabinetChecks,
    getUserCheckedCabinetIds,
} from "@/features/arcades/server/cabinet-check-service";
import { getPublicArcade } from "@/features/arcades/server/public-arcade-service";
import MusecatArcadeDetailPage from "@/features/musecat/components/musecat-arcade-detail-page";
import { getMusecatArcadePage } from "@/features/musecat/server/musecat-arcade-service";
import { getMusecatMode } from "@/features/musecat/server/musecat-mode";
import { clientEnv } from "@/lib/env/client";
import { getLocalizedHref } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";
import { getUser } from "@/lib/user";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const { locale, t } = await getServerI18n();
    const arcade = await getPublicArcade(slug);
    return createPageMetadata({
        title: arcade?.name ?? t("arcades.title"),
        path: getLocalizedHref(`/gamecenter/${arcade?.slug ?? slug}`, locale),
    });
}

export default async function ArcadeDetailRoute({ params }: Props) {
    const { slug } = await params;
    const [arcade, user, { locale }] = await Promise.all([
        getPublicArcade(slug),
        getUser(),
        getServerI18n(),
    ]);
    if (!arcade) notFound();
    if (slug !== arcade.slug)
        permanentRedirect(
            getLocalizedHref(`/gamecenter/${arcade.slug}`, locale)
        );
    const cabinetIds = arcade.cabinets.map((cabinet) => cabinet.id);
    const [checkedCabinetIds, recentChecks] = await Promise.all([
        user ? getUserCheckedCabinetIds(user.id, cabinetIds) : [],
        getRecentCabinetChecks(arcade.id),
    ]);
    // 뮤즈캣 연동(2026-10-20 안 1) — MUSECAT_MODE 가 켜져 있고 뮤즈캣 문서를 받았을 때만 새 상세. 못 받으면 지금 상세 그대로
    const musecat =
        getMusecatMode() === "off"
            ? null
            : await getMusecatArcadePage(arcade.slug).catch(() => null);
    if (musecat)
        return (
            <MusecatArcadeDetailPage
                key={arcade.id}
                data={musecat.arcade}
                viewer={{
                    loggedIn: Boolean(user),
                    connected: musecat.viewer.connected,
                    needsReconnect: musecat.viewer.needsReconnect,
                    username: musecat.viewer.username,
                }}
                favorite={musecat.favorite}
                appKey={clientEnv.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? ""}
            />
        );
    return (
        <ArcadeDetailPage
            key={arcade.id}
            arcade={arcade}
            appKey={clientEnv.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? ""}
            isAuthenticated={Boolean(user)}
            preferredArcadeId={user?.preferredArcadeId ?? null}
            checkedCabinetIds={checkedCabinetIds}
            recentChecks={recentChecks}
        />
    );
}
