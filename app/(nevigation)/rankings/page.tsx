import { redirect } from "next/navigation";
import GlobalRankingPage from "@/features/rankings/components/globalRankingPage";
import { getGlobalRankingPage } from "@/features/rankings/server/globalRankingData";
import {
    parseGlobalRankingQuery,
    serializeGlobalRankingQuery,
} from "@/features/rankings/schemas/globalRankingSchema";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata/site";
import { logServerError } from "@/lib/observability/server";
import { getUser } from "@/lib/user";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();
    return createPageMetadata({
        title: t("rankings.title"),
        path: localizePath("/rankings", locale),
    });
}

export default async function Rankings({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const [params, user, { locale }] = await Promise.all([
        searchParams,
        getUser(),
        getServerI18n(),
    ]);
    const supplied = new URLSearchParams();
    for (const [key, value] of Object.entries(params))
        if (value !== undefined)
            supplied.set(key, Array.isArray(value) ? value[0] : value);
    const query = parseGlobalRankingQuery(supplied);
    const data = await getGlobalRankingPage(query, user?.id ?? null).catch(
        (error) => {
            logServerError(error, {
                event: "rankings.page.failed",
                routePath: "/rankings",
                routeType: "page",
            });
            return null;
        }
    );
    const canonical = serializeGlobalRankingQuery(
        data?.query ?? query
    ).toString();
    if (supplied.size && supplied.toString() !== canonical)
        redirect(`${localizePath("/rankings", locale)}?${canonical}`);
    return (
        <GlobalRankingPage
            initialQuery={data?.query ?? query}
            initialData={data}
            viewerId={user?.id ?? null}
        />
    );
}
