import TierBrowserPage from "@/features/tiers/components/tierBrowserPage";
import { parseTierBrowserQuery } from "@/features/tiers/schemas/tierBrowserSchema";
import {
    getTierBrowserBand,
    getTierBrowserOverview,
} from "@/features/tiers/server/tierBrowserData";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";
import { logServerError } from "@/lib/observability/server";
import { getUser } from "@/lib/user";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();
    return createPageMetadata({
        title: t("tiers.title"),
        path: `/${locale}/tiers`,
    });
}

export default async function TiersPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const [{ locale }, user, values] = await Promise.all([
        getServerI18n(),
        getUser(),
        searchParams,
    ]);
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
        const first = Array.isArray(value) ? value[0] : value;
        if (first !== undefined) params.set(key, first);
    }
    const query = parseTierBrowserQuery(params);
    const overview = await getTierBrowserOverview(
        query,
        user?.id ?? null
    ).catch((error) => {
        logServerError(error, {
            event: "tiers.initial.load.failed",
            routePath: "/tiers",
            routeType: "page",
        });
        return null;
    });
    const first = overview?.list?.bands.find(
        (band) =>
            band.totalCount > 0 &&
            (!query.bands.length || query.bands.includes(band.value))
    );
    const initialBand = first
        ? await getTierBrowserBand(
              query,
              first.id,
              user?.id ?? null,
              locale
          ).catch((error) => {
              logServerError(error, {
                  event: "tiers.initial.band.failed",
                  routePath: "/tiers",
                  routeType: "page",
              });
              return null;
          })
        : null;
    return (
        <TierBrowserPage
            initialQuery={query}
            initialOverview={overview}
            initialBand={initialBand}
            viewerId={user?.id ?? null}
        />
    );
}
