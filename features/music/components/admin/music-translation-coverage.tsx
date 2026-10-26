import { Download } from "lucide-react";
import Link from "next/link";

import { foundationButtonClass } from "@/components/ui/button";
import type {
    MusicTranslationLocale,
    MusicTranslationStatus,
} from "@/features/music/schemas/music-translation-admin-schema";
import type { AdminMusicTranslationCoverage } from "@/features/music/types/music-admin";
import { cn } from "@/lib/cn";

function filterHref(
    locale: MusicTranslationLocale,
    status: MusicTranslationStatus | "missing"
) {
    const params = new URLSearchParams({
        translationLocale: locale,
        translationStatus: status,
    });
    return "/admin/music?" + params.toString();
}

export default function MusicTranslationCoverage({
    coverage,
    activeLocale,
    activeStatus,
}: {
    coverage: AdminMusicTranslationCoverage[];
    activeLocale?: MusicTranslationLocale;
    activeStatus?: MusicTranslationStatus | "missing";
}) {
    return (
        <section className="flex flex-col gap-nl-12 rounded-nl-control bg-nl-surface p-nl-16">
            <div className="flex items-start justify-between gap-nl-12">
                <div>
                    <h2 className="nl-component-title text-nl-content">
                        번역 현황
                    </h2>
                    <p className="nl-metadata mt-nl-4 text-nl-subdued">
                        언어별 승인·초안·미번역 악곡을 확인합니다.
                    </p>
                </div>
                <Link
                    href="/admin/music/translations.csv"
                    className={cn(
                        foundationButtonClass({
                            variant: "secondary",
                            size: "sm",
                        }),
                        "shrink-0"
                    )}
                >
                    <Download className="nl-icon-small" aria-hidden />
                    전체 CSV
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-nl-8 sm:grid-cols-2">
                {coverage.map((item) => {
                    const completion =
                        item.total > 0
                            ? Math.round((item.approved / item.total) * 100)
                            : 0;

                    return (
                        <article
                            key={item.locale}
                            className="rounded-nl-control border-nl-stroke border-nl-divider bg-nl-canvas p-nl-12"
                        >
                            <div className="flex items-center justify-between gap-nl-8">
                                <strong className="nl-emphasis-label text-nl-content">
                                    {item.label}
                                </strong>
                                <span className="nl-metadata text-nl-subdued">
                                    승인 {completion}%
                                </span>
                            </div>
                            <div className="mt-nl-8 h-nl-4 overflow-hidden rounded-nl-full bg-nl-surface">
                                <div
                                    className="h-full rounded-nl-full bg-nl-chart"
                                    style={{ width: completion + "%" }}
                                />
                            </div>
                            <div className="mt-nl-12 grid grid-cols-3 gap-nl-8">
                                {(
                                    [
                                        ["approved", "승인", item.approved],
                                        ["draft", "초안", item.draft],
                                        ["missing", "미번역", item.missing],
                                    ] as const
                                ).map(([status, label, count]) => {
                                    const active =
                                        activeLocale === item.locale &&
                                        activeStatus === status;

                                    return (
                                        <Link
                                            key={status}
                                            href={filterHref(
                                                item.locale,
                                                status
                                            )}
                                            aria-current={
                                                active ? "page" : undefined
                                            }
                                            className={
                                                "nl-metadata rounded-nl-control px-nl-8 py-nl-8 text-center " +
                                                (active
                                                    ? "bg-nl-primary text-nl-on-primary"
                                                    : "bg-nl-surface text-nl-subdued hover:text-nl-content")
                                            }
                                        >
                                            <span className="nl-emphasis-label block">
                                                {count}
                                            </span>
                                            <span>{label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                            <Link
                                href={
                                    "/admin/music/translations.csv?locale=" +
                                    item.locale
                                }
                                className="nl-metadata mt-nl-8 block text-right hover:text-nl-content"
                            >
                                {item.label} CSV 내보내기
                            </Link>
                        </article>
                    );
                })}
            </div>
            {activeLocale && activeStatus ? (
                <Link
                    href="/admin/music"
                    className="nl-metadata self-start hover:text-nl-content"
                >
                    번역 필터 해제
                </Link>
            ) : null}
        </section>
    );
}
