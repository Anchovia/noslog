import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";

import db from "@/lib/db";
import MusicTranslationCsvImport from "@/components/admin/musicTranslationCsvImport";

export default async function AdminMusicPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; missing?: string }>;
}) {
    const { q = "", missing } = await searchParams;
    const keyword = q.trim();
    const musics = await db.music.findMany({
        where: {
            ...(missing === "1"
                ? { charts: { some: { level_constant: null } } }
                : {}),
            ...(keyword
                ? {
                      OR: [
                          { title: { contains: keyword } },
                          { artist: { contains: keyword } },
                          { index: { contains: keyword } },
                      ],
                  }
                : {}),
        },
        select: {
            index: true,
            title: true,
            artist: true,
            category_short: true,
            charts: { select: { id: true, level_constant: true } },
        },
        orderBy: { title: "asc" },
        take: 100,
    });

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">악곡 정보</h1>
                <p className="text-caption mt-1">
                    채보별 상세 정보와 공식 레벨 상수를 관리합니다.
                </p>
            </section>
            <MusicTranslationCsvImport />
            <form className="relative">
                <Search className="text-text-disabled pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <input
                    name="q"
                    defaultValue={q}
                    placeholder="곡 제목 · 아티스트 · 식별자 검색"
                    className="border-border bg-surface text-input h-11 w-full rounded-md border pr-3 pl-10"
                />
                {missing === "1" ? (
                    <input type="hidden" name="missing" value="1" />
                ) : null}
            </form>
            <section className="bg-surface rounded-card overflow-hidden">
                {musics.map((music, index) => {
                    const configured = music.charts.filter(
                        (chart) => chart.level_constant !== null
                    ).length;
                    return (
                        <Link
                            key={music.index}
                            href={`/admin/music/${encodeURIComponent(music.index)}`}
                            className={`hover:bg-surface-muted flex min-h-16 items-center gap-3 px-3 ${index > 0 ? "border-divider border-t" : ""}`}
                        >
                            <span className="bg-surface-muted text-text-secondary flex size-9 shrink-0 items-center justify-center rounded-md text-xs font-bold">
                                {music.category_short}
                            </span>
                            <span className="min-w-0 flex-1">
                                <strong className="text-body block truncate font-bold">
                                    {music.title}
                                </strong>
                                <span className="text-caption block truncate">
                                    {music.artist ?? "아티스트 미상"} · 상수{" "}
                                    {configured}/{music.charts.length}
                                </span>
                            </span>
                            <ChevronRight className="text-text-disabled size-4 shrink-0" />
                        </Link>
                    );
                })}
                {musics.length === 0 ? (
                    <p className="text-body-muted py-12 text-center">
                        검색 결과가 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
