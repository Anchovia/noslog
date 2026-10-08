import DiscoveryPage from "@/features/music/components/discovery-page";
import {
    getDiscoveryPage,
    publicDiscoveryQuery,
} from "@/features/music/server/discovery-service";
import { parseDiscoverySearchParams } from "@/features/music/schemas/discovery-schema";
import { createPageMetadata } from "@/lib/metadata/site";
import getSession from "@/lib/session";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();
    return createPageMetadata({
        title: t("music.title"),
        description: t("music.metaDescription"),
        path: localizePath("/music", locale),
    });
}

export default async function Music(props: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const [searchParams, session] = await Promise.all([
        props.searchParams,
        getSession(),
    ]);
    const accountId = session.id ?? null;
    const query = publicDiscoveryQuery(
        parseDiscoverySearchParams(searchParams),
        accountId
    );
    const initialPage = await getDiscoveryPage(query, 0, accountId);

    return (
        <DiscoveryPage
            initialPage={initialPage}
            initialQuery={query}
            accountId={accountId}
        />
    );
}
