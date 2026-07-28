import RankingBrowser from "@/components/rankings/rankingBrowser";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata/site";
import { getUser } from "@/lib/user";
import {
    getCachedUserRankingPage,
    getCurrentUserRankingRow,
    normalizeRankingMetric,
    normalizeRankingMode,
    normalizeRankingRegion,
} from "@/lib/rankings";
import { redirect } from "next/navigation";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();

    return createPageMetadata({
        title: t("rankings.title"),
        path: localizePath("/rankings", locale),
    });
}

interface RankingsPageProps {
    searchParams: Promise<{
        mode?: string;
        metric?: string;
        region?: string;
        page?: string;
    }>;
}

const PAGE_SIZE = 7;
export default async function Rankings({ searchParams }: RankingsPageProps) {
    const { locale, t } = await getServerI18n();
    const params = await searchParams;
    const mode = normalizeRankingMode(params.mode);
    const metric = normalizeRankingMetric(params.metric, mode);
    const region = normalizeRankingRegion(params.region);
    const requestedPage = Number.parseInt(params.page || "1", 10);
    const page = Number.isFinite(requestedPage)
        ? Math.max(1, requestedPage)
        : 1;
    const [{ totalCount, rows }, user] = await Promise.all([
        getCachedUserRankingPage(mode, region, page, PAGE_SIZE, metric),
        getUser(),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    if (page > totalPages) {
        const metricParam = metric === "rating" ? "&metric=rating" : "";
        redirect(
            `${localizePath("/rankings", locale)}?mode=${mode}${metricParam}&region=${region}&page=${totalPages}`
        );
    }

    const currentUser = await getCurrentUserRankingRow(
        user,
        mode,
        region,
        metric
    );

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <h1 className="text-title">{t("rankings.title")}</h1>

            <RankingBrowser
                initialMode={mode}
                initialMetric={metric}
                initialRegion={region}
                initialData={{ page, totalCount, rows, currentUser }}
            />
        </div>
    );
}
