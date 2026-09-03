import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";

import MusicTranslationApproveButton from "@/features/music/components/admin/musicTranslationApproveButton";
import MusicTranslationCoverage from "@/features/music/components/admin/musicTranslationCoverage";
import MusicTranslationCsvImport from "@/features/music/components/admin/musicTranslationCsvImport";
import { getAdminMusicList } from "@/features/music/server/musicTranslationAdminService";

export default async function AdminMusicPage({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
        missing?: string;
        translationLocale?: string;
        translationStatus?: string;
    }>;
}) {
    const data = await getAdminMusicList(await searchParams);

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">악곡 정보</h1>
                <p className="text-caption mt-1">
                    채보별 상세 정보와 공식 레벨 상수를 관리합니다.
                </p>
            </section>
            <MusicTranslationCoverage
                coverage={data.coverage}
                activeLocale={data.activeLocale}
                activeStatus={data.activeStatus}
            />
            <MusicTranslationCsvImport />
            <form className="relative">
                <Search className="text-text-disabled pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <input
                    name="q"
                    defaultValue={data.query}
                    placeholder="곡 제목 · 아티스트 · 식별자 검색"
                    className="border-border bg-surface text-input h-11 w-full rounded-md border pr-3 pl-10"
                />
                {data.missingLevelConstant ? (
                    <input type="hidden" name="missing" value="1" />
                ) : null}
                {data.activeLocale ? (
                    <input
                        type="hidden"
                        name="translationLocale"
                        value={data.activeLocale}
                    />
                ) : null}
                {data.activeStatus ? (
                    <input
                        type="hidden"
                        name="translationStatus"
                        value={data.activeStatus}
                    />
                ) : null}
            </form>
            <section className="bg-surface rounded-card overflow-hidden">
                {data.musics.map((music, index) => (
                    <div
                        key={music.index}
                        className={
                            "flex min-h-16 items-center gap-2 px-3 " +
                            (index > 0 ? "border-divider border-t" : "")
                        }
                    >
                        <Link
                            href={
                                "/admin/music/" +
                                encodeURIComponent(music.index)
                            }
                            className="hover:bg-surface-muted -mx-1 flex min-w-0 flex-1 items-center gap-3 rounded-md px-1 py-2"
                        >
                            <span className="bg-surface-muted text-text-secondary flex size-9 shrink-0 items-center justify-center rounded-md text-xs font-bold">
                                {music.categoryShort}
                            </span>
                            <span className="min-w-0 flex-1">
                                <strong className="text-body block truncate font-bold">
                                    {music.title}
                                </strong>
                                {data.activeLocale ? (
                                    <span className="text-caption block truncate">
                                        {music.translation
                                            ? music.translation.title +
                                              " · " +
                                              (music.translation.status ===
                                              "approved"
                                                  ? "승인"
                                                  : "초안")
                                            : data.activeLocale.toUpperCase() +
                                              " 번역 없음"}
                                    </span>
                                ) : (
                                    <span className="text-caption block truncate">
                                        {music.artist ?? "아티스트 미상"} · 상수{" "}
                                        {music.configuredChartCount}/
                                        {music.chartCount}
                                    </span>
                                )}
                            </span>
                            <ChevronRight className="text-text-disabled size-4 shrink-0" />
                        </Link>
                        {data.activeLocale &&
                        music.translation?.status === "draft" ? (
                            <MusicTranslationApproveButton
                                musicIndex={music.index}
                                locale={data.activeLocale}
                            />
                        ) : null}
                    </div>
                ))}
                {data.musics.length === 0 ? (
                    <p className="text-body-muted py-12 text-center">
                        검색 결과가 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
