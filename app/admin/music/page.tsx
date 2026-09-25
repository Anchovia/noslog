import AdminMusicList from "@/features/music/components/admin/adminMusicList";
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
        <div className="flex flex-col gap-4 py-5">
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
            {/* 검색 · 목록(2026-09-25) — 사용자 악곡 검색처럼 자동 검색 · 대소문자 무시 · 40곡씩 무한 스크롤 */}
            <AdminMusicList
                key={[
                    data.missingLevelConstant ? "1" : "",
                    data.activeLocale ?? "",
                    data.activeStatus ?? "",
                ].join("|")}
                initial={data}
                filters={{
                    missing: data.missingLevelConstant ? "1" : undefined,
                    translationLocale: data.activeLocale,
                    translationStatus: data.activeStatus,
                }}
            />
        </div>
    );
}
