import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
    ChartMetadataForm,
    MusicMetadataForm,
} from "@/features/music/components/admin/music-metadata-forms";
import MusicJacketForm from "@/features/music/components/admin/music-jacket-form";
import MusicTranslationForm from "@/features/music/components/admin/music-translation-form";
import { getAdminMusicDetail } from "@/features/music/server/music-admin-service";

export default async function AdminMusicDetailPage({
    params,
}: {
    params: Promise<{ index: string }>;
}) {
    const { index } = await params;
    const music = await getAdminMusicDetail(decodeURIComponent(index));
    if (!music) notFound();

    return (
        <div className="flex flex-col gap-4 py-5">
            <section className="flex items-start gap-3">
                <Link
                    href="/admin/music"
                    aria-label="악곡 목록으로 이동"
                    className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border"
                >
                    <ArrowLeft className="size-4" />
                </Link>
                <div className="min-w-0">
                    <h1 className="truncate text-title">{music.title}</h1>
                    <p className="truncate text-caption">
                        {music.artist ?? "아티스트 미상"} ·{" "}
                        {music.categoryShort}
                    </p>
                </div>
            </section>

            <MusicJacketForm
                musicIndex={music.index}
                background={music.background}
            />

            <MusicMetadataForm
                defaultValues={{
                    musicIndex: music.index,
                    description: music.description,
                    bpmMin: music.bpmMin,
                    bpmMax: music.bpmMax,
                    durationSeconds: music.durationSeconds,
                }}
            />

            <section className="flex flex-col gap-3 rounded-card bg-surface p-3">
                <div>
                    <h2 className="text-section font-bold">번역 제목</h2>
                    <p className="mt-1 text-caption">
                        승인 상태인 제목만 사용자 화면에 표시됩니다. 제목을
                        비우고 저장하면 삭제됩니다.
                    </p>
                </div>
                {(
                    [
                        { locale: "ko", label: "한국어" },
                        { locale: "en", label: "영어" },
                    ] as const
                ).map((language) => {
                    const translation = music.translations.find(
                        (item) => item.locale === language.locale
                    );

                    return (
                        <MusicTranslationForm
                            key={language.locale}
                            musicIndex={music.index}
                            locale={language.locale}
                            label={language.label}
                            title={translation?.title ?? ""}
                            status={translation?.status ?? "draft"}
                        />
                    );
                })}
            </section>

            {music.charts.map((chart) => (
                <ChartMetadataForm
                    key={chart.id}
                    chart={chart}
                    musicIndex={music.index}
                />
            ))}
        </div>
    );
}
