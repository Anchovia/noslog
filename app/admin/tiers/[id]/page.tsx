import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import TierBoard from "@/features/tiers/components/tier-board";
import TierListDeleteButton from "@/features/tiers/components/tier-list-delete-button";
import TierListForm from "@/features/tiers/components/tier-list-form";
import TierPlacementEditor from "@/features/tiers/components/tier-placement-editor";
import db from "@/lib/db";
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
} from "@/lib/tiers";
import type { Prisma } from "@prisma/client";

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

    const tierList = await db.tierList.findUnique({
        where: { id: tierListId },
        include: {
            bands: {
                orderBy: { position: "asc" },
                include: { _count: { select: { entries: true } } },
            },
        },
    });
    if (!tierList) notFound();
    // 지금 쓰는 서열표만 편집. 모드별 목록에서 빠진 목표 표(Recital S·FC 등)는 보관 서열표로 다룬다
    const current = isCurrentTierScope(tierList.mode, tierList.goal);

    const keyword = (query.q ?? "").trim().slice(0, 100);
    const difficulty = isTierDifficulty(query.difficulty ?? "")
        ? query.difficulty
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
                      ...(category ? { category_short: category } : {}),
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
              db.tierEntry.findMany({
                  where: { tierListId, chart: chartWhere },
                  select: {
                      id: true,
                      tierBandId: true,
                      chart: {
                          select: {
                              difficulty: true,
                              level: true,
                              music: {
                                  select: {
                                      index: true,
                                      title: true,
                                      artist: true,
                                      background: true,
                                  },
                              },
                          },
                      },
                  },
                  orderBy: [
                      { chart: { music: { title: "asc" } } },
                      { chart: { difficulty: "asc" } },
                  ],
                  skip: (page - 1) * pageSize,
                  take: pageSize,
              }),
              db.tierEntry.count({
                  where: { tierListId, chart: chartWhere },
              }),
              Promise.resolve(null),
          ])
        : await Promise.all([
              Promise.resolve([]),
              Promise.resolve(0),
              tierList.goal
                  ? Promise.resolve(null)
                  : db.tierList.findUnique({
                        where: { id: tierListId },
                        include: {
                            bands: {
                                include: {
                                    entries: {
                                        include: {
                                            chart: {
                                                include: {
                                                    music: {
                                                        select: {
                                                            index: true,
                                                            title: true,
                                                            artist: true,
                                                            background: true,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        orderBy: { position: "asc" },
                                    },
                                },
                                orderBy: { position: "asc" },
                            },
                        },
                    }),
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
        <div className="flex flex-col gap-5 py-5">
            <section className="flex items-start gap-3">
                {/* 관리자 악곡 상세와 같은 뒤로가기 */}
                <Link
                    href="/admin/tiers"
                    aria-label="서열표 목록으로 이동"
                    className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border"
                >
                    <ArrowLeft className="size-4" />
                </Link>
                <div className="min-w-0">
                    <h1 className="text-title">{tierList.title}</h1>
                    <p className="mt-1 text-caption">
                        {current
                            ? "채보를 검색하고 목표별 서열 상수를 변경합니다."
                            : tierList.goal
                              ? "지금 서열표 화면에서 쓰지 않는 보관 서열표입니다."
                              : "보관된 기존 서열표의 배치를 확인합니다."}
                    </p>
                </div>
            </section>

            {current ? (
                <details className="group rounded-card bg-surface p-3">
                    <summary className="cursor-pointer list-none text-body font-bold">
                        서열표 정보
                    </summary>
                    <div className="mt-3 border-t border-divider pt-3">
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
                        className="grid grid-cols-2 gap-2 rounded-card bg-surface p-3"
                    >
                        <input
                            name="q"
                            defaultValue={keyword}
                            placeholder="곡 제목 · 아티스트 · 식별자"
                            className="col-span-2 h-11 rounded-md border border-border bg-bg px-3 text-input"
                        />
                        <div className="col-span-2 grid grid-cols-1 gap-2 md:grid-cols-3">
                            <select
                                name="difficulty"
                                defaultValue={difficulty}
                                aria-label="난이도 필터"
                                className="h-11 rounded-md border border-border bg-bg px-3 text-input"
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
                                className="h-11 rounded-md border border-border bg-bg px-3 text-input"
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
                                className="h-11 rounded-md border border-border bg-bg px-3 text-input"
                            >
                                <option value="">전체 카테고리</option>
                                {MUSIC_CATEGORY_VALUES.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="h-10 rounded-md bg-text-primary text-sm font-bold text-bg">
                            검색
                        </button>
                        <Link
                            href={`/admin/tiers/${tierListId}`}
                            className="flex h-10 items-center justify-center rounded-md border border-border text-sm font-semibold text-text-secondary"
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
                            className="flex items-center justify-between gap-3"
                            aria-label="채보 페이지"
                        >
                            {page > 1 ? (
                                <Link
                                    href={pageHref(page - 1)}
                                    className="flex h-10 items-center rounded-md border border-border px-3 text-sm font-semibold text-text-secondary"
                                >
                                    이전
                                </Link>
                            ) : (
                                <span />
                            )}
                            <span className="text-caption tabular-nums">
                                {page}/{pageCount}
                            </span>
                            {page < pageCount ? (
                                <Link
                                    href={pageHref(page + 1)}
                                    className="flex h-10 items-center rounded-md border border-border px-3 text-sm font-semibold text-text-secondary"
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
                <div className="border-t border-divider pt-5">
                    <TierListDeleteButton tierListId={tierList.id} />
                </div>
            ) : null}
        </div>
    );
}
