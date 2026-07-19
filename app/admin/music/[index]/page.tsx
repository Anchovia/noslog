import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
    saveChartMetadata,
    saveMusicMetadata,
} from "@/app/admin/music/actions";
import AdminSaveButton from "@/components/admin/adminSaveButton";
import db from "@/lib/db";
import { formatDateInput } from "@/lib/utils";

const difficultyColor: Record<string, string> = {
    normal: "text-normal",
    hard: "text-hard",
    expert: "text-expert",
    real: "text-real",
};

const difficultyOrder: Record<string, number> = {
    normal: 0,
    hard: 1,
    expert: 2,
    real: 3,
};

export default async function AdminMusicDetailPage({
    params,
}: {
    params: Promise<{ index: string }>;
}) {
    const { index } = await params;
    const music = await db.music.findUnique({
        where: { index: decodeURIComponent(index) },
        include: {
            charts: {
                include: {
                    levelConstantHistory: {
                        orderBy: { effective_at: "desc" },
                        take: 5,
                    },
                },
            },
        },
    });
    if (!music) notFound();

    const charts = [...music.charts].sort(
        (a, b) =>
            (difficultyOrder[a.difficulty.toLowerCase()] ?? 99) -
            (difficultyOrder[b.difficulty.toLowerCase()] ?? 99)
    );
    const commonBpmMin = charts.find(
        (chart) => chart.bpm_min !== null
    )?.bpm_min;
    const commonBpmMax = charts.find(
        (chart) => chart.bpm_max !== null
    )?.bpm_max;
    const commonDuration = charts.find(
        (chart) => chart.duration_seconds !== null
    )?.duration_seconds;

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
                        {music.category_short}
                    </p>
                </div>
            </section>

            <form
                action={saveMusicMetadata}
                className="bg-surface rounded-card flex flex-col gap-2 p-3"
            >
                <input type="hidden" name="musicIndex" value={music.index} />
                <h2 className="text-section font-bold">공통 정보</h2>
                <label className="text-caption" htmlFor="description">
                    악곡 설명
                </label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={music.description ?? ""}
                    rows={3}
                    className="border-border bg-bg text-input w-full resize-none rounded-md border px-3 py-2"
                />
                <div className="grid grid-cols-2 gap-2">
                    <label className="text-caption flex flex-col gap-1">
                        최소 BPM
                        <input
                            name="bpmMin"
                            type="number"
                            min="1"
                            step="1"
                            defaultValue={commonBpmMin ?? ""}
                            className={inputClass}
                        />
                    </label>
                    <label className="text-caption flex flex-col gap-1">
                        최대 BPM
                        <input
                            name="bpmMax"
                            type="number"
                            min="1"
                            step="1"
                            defaultValue={commonBpmMax ?? ""}
                            className={inputClass}
                        />
                    </label>
                    <label className="text-caption col-span-2 flex flex-col gap-1">
                        길이(초)
                        <input
                            name="durationSeconds"
                            type="number"
                            min="0"
                            step="1"
                            defaultValue={commonDuration ?? ""}
                            className={inputClass}
                        />
                    </label>
                </div>
                <AdminSaveButton label="공통 정보 저장" />
            </form>

            {charts.map((chart) => (
                <form
                    key={chart.id}
                    action={saveChartMetadata}
                    className="bg-surface rounded-card flex flex-col gap-3 p-3"
                >
                    <input type="hidden" name="chartId" value={chart.id} />
                    <input
                        type="hidden"
                        name="musicIndex"
                        value={music.index}
                    />
                    <header className="flex items-center justify-between">
                        <h2
                            className={`text-section font-bold capitalize ${difficultyColor[chart.difficulty.toLowerCase()] ?? ""}`}
                        >
                            {chart.difficulty}
                        </h2>
                        <span className="text-caption">Lv {chart.level}</span>
                    </header>
                    <div className="grid grid-cols-2 gap-2">
                        <label className="text-caption flex flex-col gap-1">
                            공식 레벨 상수
                            <input
                                name="levelConstant"
                                type="number"
                                min="1"
                                max="14"
                                step="0.01"
                                defaultValue={chart.level_constant ?? ""}
                                className={inputClass}
                            />
                        </label>
                        <label className="text-caption flex flex-col gap-1">
                            노트 수
                            <input
                                name="noteCount"
                                type="number"
                                min="0"
                                step="1"
                                defaultValue={chart.note_count ?? ""}
                                className={inputClass}
                            />
                        </label>
                        <label className="text-caption flex flex-col gap-1">
                            수록일
                            <input
                                name="releasedAt"
                                type="date"
                                defaultValue={formatDateInput(
                                    chart.released_at
                                )}
                                className={inputClass}
                            />
                        </label>
                    </div>
                    <label className="text-caption flex flex-col gap-1">
                        해금 조건
                        <input
                            name="unlockCondition"
                            defaultValue={chart.unlock_condition ?? ""}
                            className={inputClass}
                        />
                    </label>
                    <label className="text-caption flex flex-col gap-1">
                        플레이 영상 URL
                        <input
                            name="playVideoUrl"
                            type="url"
                            defaultValue={chart.play_video_url ?? ""}
                            className={inputClass}
                        />
                    </label>
                    <label className="text-caption flex flex-col gap-1">
                        채보 미리보기 URL
                        <input
                            name="chartPreviewUrl"
                            type="url"
                            defaultValue={chart.chart_preview_url ?? ""}
                            className={inputClass}
                        />
                    </label>
                    {chart.levelConstantHistory.length > 0 ? (
                        <p className="text-caption">
                            최근 공식 상수:{" "}
                            {chart.levelConstantHistory
                                .map((history) => history.value.toFixed(2))
                                .join(" · ")}
                        </p>
                    ) : null}
                    <AdminSaveButton label="채보 저장" />
                </form>
            ))}
        </div>
    );
}
