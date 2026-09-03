import Link from "next/link";
import { notFound } from "next/navigation";

import TierBoard from "@/features/tiers/components/tierBoard";
import TierListDeleteButton from "@/features/tiers/components/tierListDeleteButton";
import TierListForm from "@/features/tiers/components/tierListForm";
import TierPlacementEditor from "@/features/tiers/components/tierPlacementEditor";
import db from "@/lib/db";
import {
    TIER_REAL_LEVELS,
    TIER_REGULAR_LEVELS,
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

    const keyword = (query.q ?? "").trim().slice(0, 100);
    const difficulty = isTierDifficulty(query.difficulty ?? "")
        ? query.difficulty
        : "";
    const level = isTierLevelFilter(query.level ?? "") ? query.level! : "";
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
        ...(keyword
            ? {
                  music: {
                      OR: [
                          { title: { contains: keyword, mode: "insensitive" } },
                          {
                              artist: {
                                  contains: keyword,
                                  mode: "insensitive",
                              },
                          },
                          { index: { contains: keyword, mode: "insensitive" } },
                      ],
                  },
              }
            : {}),
    };

    const [goalEntries, goalEntryCount, legacyTierList] = tierList.goal
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
              db.tierList.findUnique({
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
    });
    const pageHref = (nextPage: number) => {
        const next = new URLSearchParams(filterParams);
        if (nextPage > 1) next.set("page", String(nextPage));
        return `/admin/tiers/${tierListId}${next.size > 0 ? `?${next}` : ""}`;
    };
    const pageCount = Math.max(1, Math.ceil(goalEntryCount / pageSize));

    return (
        <div className="flex flex-col gap-5 px-4 py-5">
            <section>
                <h1 className="text-title">{tierList.title}</h1>
                <p className="text-caption mt-1">
                    {tierList.goal
                        ? "채보를 검색하고 목표별 서열 상수를 변경합니다."
                        : "보관된 기존 서열표의 배치를 확인합니다."}
                </p>
            </section>

            {tierList.goal ? (
                <details className="bg-surface rounded-card group p-3">
                    <summary className="text-body cursor-pointer list-none font-bold">
                        서열표 정보
                    </summary>
                    <div className="border-divider mt-3 border-t pt-3">
                        <TierListForm
                            tierList={{
                                id: tierList.id,
                                slug: tierList.slug,
                                title: tierList.title,
                                mode: tierList.mode,
                                goal: tierList.goal,
                                description: tierList.description ?? "",
                                status: tierList.status,
                            }}
                        />
                    </div>
                </details>
            ) : null}

            {tierList.goal ? (
                <>
                    <form
                        method="get"
                        className="bg-surface rounded-card grid grid-cols-2 gap-2 p-3"
                    >
                        <input
                            name="q"
                            defaultValue={keyword}
                            placeholder="곡 제목 · 아티스트 · 식별자"
                            className="border-border bg-bg text-input col-span-2 h-11 rounded-md border px-3"
                        />
                        <select
                            name="difficulty"
                            defaultValue={difficulty}
                            aria-label="난이도 필터"
                            className="border-border bg-bg text-input h-11 rounded-md border px-3"
                        >
                            <option value="">전체 난이도</option>
                            {(
                                ["Normal", "Hard", "Expert", "Real"] as const
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
                            className="border-border bg-bg text-input h-11 rounded-md border px-3"
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
                        <button className="bg-text-primary text-bg h-10 rounded-md text-sm font-bold">
                            검색
                        </button>
                        <Link
                            href={`/admin/tiers/${tierListId}`}
                            className="border-border text-text-secondary flex h-10 items-center justify-center rounded-md border text-sm font-semibold"
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
                                    className="border-border text-text-secondary flex h-10 items-center rounded-md border px-3 text-sm font-semibold"
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
                                    className="border-border text-text-secondary flex h-10 items-center rounded-md border px-3 text-sm font-semibold"
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

            {!tierList.goal ? (
                <div className="border-divider border-t pt-5">
                    <TierListDeleteButton tierListId={tierList.id} />
                </div>
            ) : null}
        </div>
    );
}
