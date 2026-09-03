import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { saveMusicTranslation } from "@/app/admin/music/actions";
import AdminSaveButton from "@/components/admin/adminSaveButton";
import {
    ChartMetadataForm,
    MusicMetadataForm,
} from "@/features/music/components/admin/musicMetadataForms";
import { getAdminMusicDetail } from "@/features/music/server/musicAdminService";

export default async function AdminMusicDetailPage({
    params,
}: {
    params: Promise<{ index: string }>;
}) {
    const { index } = await params;
    const music = await getAdminMusicDetail(decodeURIComponent(index));
    if (!music) notFound();

    const inputClass =
        "border-border bg-bg text-input h-11 w-full rounded-md border px-3";

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section className="flex items-start gap-3">
                <Link
                    href="/admin/music"
                    aria-label="악곡 목록으로 이동"
                    className="border-border flex size-9 shrink-0 items-center justify-center rounded-md border"
                >
                    <ArrowLeft className="size-4" />
                </Link>
                <div className="min-w-0">
                    <h1 className="text-title truncate">{music.title}</h1>
                    <p className="text-caption truncate">
                        {music.artist ?? "아티스트 미상"} ·{" "}
                        {music.categoryShort}
                    </p>
                </div>
            </section>

            <MusicMetadataForm
                defaultValues={{
                    musicIndex: music.index,
                    description: music.description,
                    bpmMin: music.bpmMin,
                    bpmMax: music.bpmMax,
                    durationSeconds: music.durationSeconds,
                }}
            />

            <section className="bg-surface rounded-card flex flex-col gap-3 p-3">
                <div>
                    <h2 className="text-section font-bold">번역 제목</h2>
                    <p className="text-caption mt-1">
                        승인 상태인 제목만 사용자 화면에 표시됩니다. 제목을
                        비우고 저장하면 삭제됩니다.
                    </p>
                </div>
                {[
                    { locale: "ko", label: "한국어" },
                    { locale: "en", label: "영어" },
                ].map((language) => {
                    const translation = music.translations.find(
                        (item) => item.locale === language.locale
                    );

                    return (
                        <form
                            key={language.locale}
                            action={saveMusicTranslation}
                            className="border-divider flex flex-col gap-2 border-t pt-3 first:border-t-0 first:pt-0"
                        >
                            <input
                                type="hidden"
                                name="musicIndex"
                                value={music.index}
                            />
                            <input
                                type="hidden"
                                name="locale"
                                value={language.locale}
                            />
                            <label className="text-caption flex flex-col gap-1">
                                {language.label} 제목
                                <input
                                    name="title"
                                    maxLength={300}
                                    defaultValue={translation?.title ?? ""}
                                    className={inputClass}
                                />
                            </label>
                            <label className="text-caption flex flex-col gap-1">
                                검수 상태
                                <select
                                    name="status"
                                    defaultValue={
                                        translation?.status ?? "draft"
                                    }
                                    className={inputClass}
                                >
                                    <option value="draft">초안</option>
                                    <option value="approved">승인</option>
                                </select>
                            </label>
                            <AdminSaveButton
                                label={`${language.label} 번역 저장`}
                            />
                        </form>
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
