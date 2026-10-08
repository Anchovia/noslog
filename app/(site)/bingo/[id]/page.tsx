import { notFound } from "next/navigation";

import BingoDetailPage from "@/features/bingos/components/bingo-detail-page";
import { getCachedBingoDetail } from "@/features/bingos/server/bingo-data";
import { getPublicBingoDetail } from "@/features/bingos/server/public-bingo-service";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { locale, t } = await getServerI18n();
    const id = Number((await params).id);
    const bingo =
        Number.isInteger(id) && id > 0 ? await getCachedBingoDetail(id) : null;
    if (!bingo)
        return createPageMetadata({
            title: t("bingo.title"),
            path: localizePath("/bingo", locale),
            noIndex: true,
        });
    return createPageMetadata({
        title: `${bingo.title || bingo.coverMusic.title} · ${t("bingo.title")}`,
        path: localizePath(`/bingo/${id}`, locale),
    });
}

export default async function BingoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) notFound();
    const bingo = await getPublicBingoDetail(id);
    if (!bingo) notFound();
    return <BingoDetailPage key={bingo.id} bingo={bingo} />;
}
