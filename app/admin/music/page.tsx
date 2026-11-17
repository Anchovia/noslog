import AdminMusicList from "@/features/music/components/admin/admin-music-list";
import MusicTranslationCoverage from "@/features/music/components/admin/music-translation-coverage";
import MusicTranslationCsvImport from "@/features/music/components/admin/music-translation-csv-import";
import { getAdminMusicList } from "@/features/music/server/admin-music-list-service";
import { requireAdmin } from "@/lib/admin";
import { parseAdminPage } from "@/lib/admin/page";

export default async function AdminMusicPage({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
        missing?: string;
        translationLocale?: string;
        translationStatus?: string;
        page?: string;
    }>;
}) {
    await requireAdmin();
    const params = await searchParams;
    const data = await getAdminMusicList(params, parseAdminPage(params.page));

    return (
        <div className="nl-admin-stack">
            <MusicTranslationCoverage
                coverage={data.coverage}
                activeLocale={data.activeLocale}
                activeStatus={data.activeStatus}
            />
            <MusicTranslationCsvImport />
            <AdminMusicList
                key={[
                    data.missingLevelConstant ? "1" : "",
                    data.activeLocale ?? "",
                    data.activeStatus ?? "",
                ].join("|")}
                data={data}
                filters={{
                    missing: data.missingLevelConstant ? "1" : undefined,
                    translationLocale: data.activeLocale,
                    translationStatus: data.activeStatus,
                }}
            />
        </div>
    );
}
