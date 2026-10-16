import { redirect } from "next/navigation";

import { getTierListScope } from "@/features/tiers/server/tier-browser-data";
import { localizePath } from "@/lib/i18n/routing";
import { getRequestLocale } from "@/lib/i18n/server";
import { isTierGoal } from "@/lib/tiers";

// 이전 서열표 상세 링크는 목표별 통합 서열표 화면으로 연결함
export default async function LegacyTierDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const locale = await getRequestLocale();
    const { slug } = await params;
    const tierList = await getTierListScope(slug);
    const mode = tierList?.mode === "recital" ? "recital" : "basic";
    const goal =
        tierList?.goal && isTierGoal(tierList.goal) ? tierList.goal : "s";

    redirect(`${localizePath("/tiers", locale)}?mode=${mode}&goal=${goal}`);
}
