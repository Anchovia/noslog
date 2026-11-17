import { notFound } from "next/navigation";

import { AdminDetail } from "@/components/admin/admin-card";
import { AdminCrumb } from "@/components/admin/admin-nav";
import {
    ChartMetadataForm,
    MusicMetadataForm,
} from "@/features/music/components/admin/music-metadata-forms";
import MusicJacketForm from "@/features/music/components/admin/music-jacket-form";
import MusicTranslationForm from "@/features/music/components/admin/music-translation-form";
import { getAdminMusicDetail } from "@/features/music/server/music-admin-service";
import { requireAdmin } from "@/lib/admin";

export default async function AdminMusicDetailPage({
    params,
}: {
    params: Promise<{ index: string }>;
}) {
    await requireAdmin();
    const { index } = await params;
    const music = await getAdminMusicDetail(decodeURIComponent(index));
    if (!music) notFound();

    return (
        <>
            <AdminCrumb>{music.title}</AdminCrumb>
            <AdminDetail
                main={
                    <>
                        <MusicMetadataForm
                            title={music.title}
                            artist={
                                (music.artist ?? "아티스트 미상") +
                                " · " +
                                music.categoryShort
                            }
                            defaultValues={{
                                musicIndex: music.index,
                                description: music.description,
                                bpmMin: music.bpmMin,
                                bpmMax: music.bpmMax,
                                durationSeconds: music.durationSeconds,
                            }}
                        />
                        <ChartMetadataForm
                            charts={music.charts}
                            musicIndex={music.index}
                        />
                    </>
                }
                side={
                    <>
                        <MusicJacketForm
                            musicIndex={music.index}
                            background={music.background}
                        />
                        <MusicTranslationForm
                            musicIndex={music.index}
                            translations={music.translations}
                        />
                    </>
                }
            />
        </>
    );
}
