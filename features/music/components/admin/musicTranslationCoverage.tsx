import { Download } from "lucide-react";
import Link from "next/link";

import type {
    MusicTranslationLocale,
    MusicTranslationStatus,
} from "@/features/music/schemas/musicTranslationAdminSchema";
import type { AdminMusicTranslationCoverage } from "@/features/music/types/musicAdmin";

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
        <section className="bg-surface rounded-card flex flex-col gap-3 p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-section">번역 현황</h2>
                    <p className="text-caption mt-1">
                        언어별 승인·초안·미번역 악곡을 확인합니다.
                    </p>
                </div>
                <Link
                    href="/admin/music/translations.csv"
                    className="border-border hover:bg-surface-muted flex h-9 shrink-0 items-center gap-1.5 rounded-md border px-3 text-xs font-semibold"
                >
                    <Download className="size-3.5" aria-hidden />
                    전체 CSV
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {coverage.map((item) => {
                    const completion =
                        item.total > 0
                            ? Math.round((item.approved / item.total) * 100)
                            : 0;

                    return (
                        <article
                            key={item.locale}
                            className="border-border bg-bg rounded-md border p-3"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <strong className="text-body font-bold">
                                    {item.label}
                                </strong>
                                <span className="text-caption">
                                    승인 {completion}%
                                </span>
                            </div>
                            <div className="bg-surface-muted mt-2 h-1.5 overflow-hidden rounded-full">
                                <div
                                    className="bg-chart h-full rounded-full"
                                    style={{ width: completion + "%" }}
                                />
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-1.5">
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
                                                "rounded-md px-2 py-2 text-center text-xs " +
                                                (active
                                                    ? "bg-text-primary text-bg"
                                                    : "bg-surface-muted text-text-secondary hover:text-text-primary")
                                            }
                                        >
                                            <span className="block font-bold">
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
                                className="text-caption hover:text-text-primary mt-2 block text-right"
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
                    className="text-caption hover:text-text-primary self-start"
                >
                    번역 필터 해제
                </Link>
            ) : null}
        </section>
    );
}
