import {
    countAdminTierEntries,
    getAdminTierList,
    getLegacyTierListWithEntries,
    listAdminTierEntries,
} from "@/features/tiers/server/tier-admin-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import TierBoard from "@/features/tiers/components/tier-board";
import TierListDeleteButton from "@/features/tiers/components/tier-list-delete-button";
import TierListForm from "@/features/tiers/components/tier-list-form";
import TierPlacementEditor from "@/features/tiers/components/tier-placement-editor";
import {
    MUSIC_CATEGORY_VALUES,
    normalizeMusicCategory,
} from "@/lib/music-categories";
import {
    TIER_REAL_LEVELS,
    TIER_REGULAR_LEVELS,
    isCurrentTierScope,
    isTierDifficulty,
    isTierLevelFilter,
    type TierDifficulty,
} from "@/lib/tiers";
import type { Prisma } from "@prisma/client";
import { foundationButtonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface EditTierListPageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{
        q?: string;
        difficulty?: string;
        level?: string;
        category?: string;
        page?: string;
    }>;
}

export default async function EditTierListPage({
    params,
    searchParams,
}: EditTierListPageProps) {
    const [{ id }, query] = await Promise.all([params, searchParams]);
    const tierListId = Number(id);
    if (!Number.isInteger(tierListId)) notFound();

    const tierList = await getAdminTierList(tierListId);
    if (!tierList) notFound();
    // 지금 쓰는 서열표만 편집. 모드별 목록에서 빠진 목표 표(Recital S·FC 등)는 보관 서열표로 다룬다
    const current = isCurrentTierScope(tierList.mode, tierList.goal);

    const keyword = (query.q ?? "").trim().slice(0, 100);
    const difficulty = isTierDifficulty(query.difficulty ?? "")
        ? (query.difficulty as TierDifficulty)
        : "";
    const level = isTierLevelFilter(query.level ?? "") ? query.level! : "";
    // 공개 악곡 필터와 같은 6개 카테고리(pops·anime·BM·Org·Var·Cl/Jz). DB 값과 표기가 같다
    const category = normalizeMusicCategory(query.category ?? "") ?? "";
    const requestedPage = Number(query.page);
    const page =
        Number.isInteger(requestedPage) && requestedPage > 0
            ? requestedPage
            : 1;
    const pageSize = 100;
    const chartWhere: Prisma.MusicChartWhereInput = {
        ...(difficulty ? { difficulty } : {}),
        ...(level.startsWith("real-")
            ? { difficulty: "Real", level: Number(level.slice(5)) }
            : level
              ? { difficulty: { not: "Real" }, level: Number(level) }
              : {}),
        ...(keyword || category
            ? {
                  music: {
                      ...(category ? { categoryShort: category } : {}),
                      ...(keyword
                          ? {
                                OR: [
                                    {
                                        title: {
                                            contains: keyword,
                                            mode: "insensitive",
                                        },
                                    },
                                    {
                                        artist: {
                                            contains: keyword,
                                            mode: "insensitive",
                                        },
                                    },
                                    {
                                        index: {
                                            contains: keyword,
                                            mode: "insensitive",
                                        },
                                    },
                                ],
                            }
                          : {}),
                  },
              }
            : {}),
    };

    const [goalEntries, goalEntryCount, legacyTierList] = current
        ? await Promise.all([
              listAdminTierEntries(tierListId, chartWhere, page, pageSize),
              countAdminTierEntries(tierListId, chartWhere),
              Promise.resolve(null),
          ])
        : await Promise.all([
              Promise.resolve([]),
              Promise.resolve(0),
              tierList.goal
                  ? Promise.resolve(null)
                  : getLegacyTierListWithEntries(tierListId),
          ]);

    const filterParams = new URLSearchParams({
        ...(keyword ? { q: keyword } : {}),
        ...(difficulty ? { difficulty } : {}),
        ...(level ? { level } : {}),
        ...(category ? { category } : {}),
    });
    const pageHref = (nextPage: number) => {
        const next = new URLSearchParams(filterParams);
        if (nextPage > 1) next.set("page", String(nextPage));
        return `/admin/tiers/${tierListId}${next.size > 0 ? `?${next}` : ""}`;
    };
    const pageCount = Math.max(1, Math.ceil(goalEntryCount / pageSize));

    return (
        <div className="flex flex-col gap-nl-24 py-nl-24">
            <section className="flex items-start gap-nl-12">
                {/* 관리자 악곡 상세와 같은 뒤로가기 */}
                <Link
                    href="/admin/tiers"
                    aria-label="서열표 목록으로 이동"
                    className={cn(
                        foundationButtonClass({
                            variant: "secondary",
                            size: "icon-sm",
                        }),
                        "shrink-0"
                    )}
                >
                    <ArrowLeft className="nl-icon-small" />
                </Link>
                <div className="min-w-0">
                    <h1 className="nl-section-title text-nl-content">
                        {tierList.title}
                    </h1>
                    <p className="nl-metadata mt-nl-4 text-nl-subdued">
                        {current
                            ? "채보를 검색하고 목표별 서열 상수를 변경합니다."
                            : tierList.goal
                              ? "지금 서열표 화면에서 쓰지 않는 보관 서열표입니다."
                              : "보관된 기존 서열표의 배치를 확인합니다."}
                    </p>
                </div>
            </section>

            {current ? (
                <details className="group rounded-nl-control bg-nl-surface p-nl-12">
                    <summary className="nl-emphasis-label cursor-pointer list-none text-nl-content">
                        서열표 정보
                    </summary>
                    <div className="mt-nl-12 border-t-nl-stroke border-nl-divider pt-nl-12">
                        <TierListForm
                            tierList={{
                                id: tierList.id,
                                slug: tierList.slug,
                                title: tierList.title,
                                mode: tierList.mode,
                                goal: tierList.goal ?? "",
                                description: tierList.description ?? "",
                                status: tierList.status,
                            }}
                        />
                    </div>
                </details>
            ) : null}

            {current ? (
                <>
                    <form
                        method="get"
                        className="grid grid-cols-2 gap-nl-8 rounded-nl-control bg-nl-surface p-nl-12"
                    >
                        <input
                            name="q"
                            defaultValue={keyword}
                            placeholder="곡 제목 · 아티스트 · 식별자"
                            className="nl-input col-span-2"
                        />
                        <div className="col-span-2 grid grid-cols-1 gap-nl-8 md:grid-cols-3">
                            <select
                                name="difficulty"
                                defaultValue={difficulty}
                                aria-label="난이도 필터"
                                className="nl-input"
                            >
                                <option value="">전체 난이도</option>
                                {(
                                    [
                                        "Normal",
                                        "Hard",
                                        "Expert",
                                        "Real",
                                    ] as const
                                ).map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="level"
                                defaultValue={level}
                                aria-label="공식 레벨 필터"
                                className="nl-input"
                            >
                                <option value="">전체 공식 레벨</option>
                                {TIER_REGULAR_LEVELS.map((item) => (
                                    <option key={item} value={item}>
                                        Lv.{item}
                                    </option>
                                ))}
                                {TIER_REAL_LEVELS.map((item) => (
                                    <option key={item} value={item}>
                                        Real {item.slice(5)}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="category"
                                defaultValue={category}
                                aria-label="카테고리 필터"
                                className="nl-input"
                            >
                                <option value="">전체 카테고리</option>
                                {MUSIC_CATEGORY_VALUES.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className={foundationButtonClass()}>
                            검색
                        </button>
                        <Link
                            href={`/admin/tiers/${tierListId}`}
                            className={foundationButtonClass({
                                variant: "secondary",
                            })}
                        >
                            초기화
                        </Link>
                    </form>

                    <TierPlacementEditor
                        tierListId={tierListId}
                        bands={tierList.bands.map((band) => ({
                            id: band.id,
                            value: band.value,
                        }))}
                        entries={goalEntries}
                        totalCount={goalEntryCount}
                    />

                    {pageCount > 1 ? (
                        <nav
                            className="flex items-center justify-between gap-nl-12"
                            aria-label="채보 페이지"
                        >
                            {page > 1 ? (
                                <Link
                                    href={pageHref(page - 1)}
                                    className={foundationButtonClass({
                                        variant: "secondary",
                                    })}
                                >
                                    이전
                                </Link>
                            ) : (
                                <span />
                            )}
                            <span className="nl-metadata text-nl-subdued">
                                {page}/{pageCount}
                            </span>
                            {page < pageCount ? (
                                <Link
                                    href={pageHref(page + 1)}
                                    className={foundationButtonClass({
                                        variant: "secondary",
                                    })}
                                >
                                    다음
                                </Link>
                            ) : (
                                <span />
                            )}
                        </nav>
                    ) : null}
                </>
            ) : legacyTierList ? (
                <TierBoard
                    tierListId={legacyTierList.id}
                    bands={legacyTierList.bands.map((band) => ({
                        id: band.id,
                        value: band.value,
                        entries: band.entries.map((entry) => ({
                            id: entry.id,
                            position: entry.position,
                            chart: {
                                id: entry.chart.id,
                                difficulty: entry.chart.difficulty,
                                level: entry.chart.level,
                                music: entry.chart.music,
                            },
                        })),
                    }))}
                />
            ) : null}

            {!current ? (
                <div className="border-t-nl-stroke border-nl-divider pt-nl-24">
                    <TierListDeleteButton tierListId={tierList.id} />
                </div>
            ) : null}
        </div>
    );
}
