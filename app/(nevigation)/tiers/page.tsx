import { Plus } from "lucide-react";
import Link from "next/link";

import TierListBrowser from "@/components/tiers/tierListBrowser";
import { createPageMetadata } from "@/lib/metadata/site";
import { getUser } from "@/lib/user";
import {
    getCachedTierLists,
    getUserTierListProgress,
    type PublicTierMode,
} from "./data";

export const metadata = createPageMetadata({
    title: "악곡 서열표",
    description:
        "노스텔지어 Basic·Recital의 Expert·Real 채보 서열표와 추천 난이도 구간을 확인합니다.",
    path: "/tiers",
});

interface TiersPageProps {
    searchParams: Promise<{ mode?: string; sort?: string }>;
}

type TierListSort = "default" | "recent";

function normalizeMode(value?: string): PublicTierMode {
    return value === "basic" || value === "recital" ? value : "all";
}

function normalizeSort(value?: string): TierListSort {
    return value === "recent" ? "recent" : "default";
}

export default async function TiersPage({ searchParams }: TiersPageProps) {
    const { mode: requestedMode, sort: requestedSort } = await searchParams;
    const mode = normalizeMode(requestedMode);
    const sort = normalizeSort(requestedSort);
    const [user, tierLists] = await Promise.all([
        getUser(),
        getCachedTierLists("all"),
    ]);

    const progress = user
        ? await getUserTierListProgress(
              user.id,
              tierLists.map((tierList) => tierList.id)
          )
        : [];

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <h1 className="text-title">서열표</h1>

            <TierListBrowser
                initialMode={mode}
                initialSort={sort}
                tierLists={tierLists}
                progress={progress}
                isAuthenticated={Boolean(user)}
            />

            {user?.role === "admin" ? (
                <Link
                    href="/admin/tiers/new"
                    className="border-border text-text-secondary hover:text-text-primary flex h-12 items-center justify-center gap-2 rounded-md border border-dashed text-sm font-semibold transition-colors"
                >
                    <Plus size={16} aria-hidden />새 서열표 만들기
                </Link>
            ) : null}
        </div>
    );
}
