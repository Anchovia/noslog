import db from "@/lib/db";
import { isTierGoal } from "@/lib/tiers";
import { redirect } from "next/navigation";

// 이전 서열표 상세 링크는 목표별 통합 서열표 화면으로 연결함
export default async function LegacyTierDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const tierList = await db.tierList.findUnique({
        where: { slug },
        select: { mode: true, goal: true },
    });
    const mode = tierList?.mode === "recital" ? "recital" : "basic";
    const goal =
        tierList?.goal && isTierGoal(tierList.goal) ? tierList.goal : "s";

    redirect(`/tiers?mode=${mode}&goal=${goal}`);
}
