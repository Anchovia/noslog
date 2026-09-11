import { notFound, permanentRedirect } from "next/navigation";
import ArcadeDetailPage from "@/features/arcades/components/arcadeDetailPage";
import { getPublicArcade } from "@/features/arcades/server/publicArcadeService";
import {
    getRecentCabinetChecks,
    getUserCheckedCabinetIds,
} from "@/features/arcades/server/cabinetCheckService";
import { clientEnv } from "@/lib/env/client";
import { getServerI18n } from "@/lib/i18n/server";
import { getLocalizedHref } from "@/lib/i18n/routing";
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
    return (
        <ArcadeDetailPage
            key={arcade.id}
            arcade={arcade}
            appKey={clientEnv.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? ""}
            isAuthenticated={Boolean(user)}
            preferredArcadeId={user?.preferred_arcade_id ?? null}
            checkedCabinetIds={checkedCabinetIds}
            recentChecks={recentChecks}
        />
    );
}
