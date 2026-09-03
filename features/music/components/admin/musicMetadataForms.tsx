"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PencilRuler, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
    saveChartMetadata,
    saveMusicMetadata,
} from "@/app/admin/music/actions";
import {
    chartMetadataSchema,
    createChartMetadataFormData,
    createMusicMetadataFormData,
    musicMetadataSchema,
    type ChartMetadataFormValues,
    type ChartMetadataValues,
    type MusicMetadataFormValues,
    type MusicMetadataValues,
} from "@/features/music/schemas/musicAdminSchema";
import type { AdminMusicChart } from "@/features/music/types/musicAdmin";
import { applyFormFieldErrors } from "@/lib/forms/errors";

const inputClass =
    "border-border bg-bg text-input h-11 w-full rounded-md border px-3";

const difficultyColor: Record<string, string> = {
    normal: "text-normal",
    hard: "text-hard",
    expert: "text-expert",
    real: "text-real",
};

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="text-danger text-xs" role="alert">
            {message}
        </p>
    ) : null;
}

function SubmitButton({
    idleLabel,
    isSubmitting,
}: {
    idleLabel: string;
    isSubmitting: boolean;
}) {
    return (
        <button
            type="submit"
            disabled={isSubmitting}
            className="bg-text-primary text-bg ml-auto flex h-10 cursor-pointer items-center gap-1 rounded-md px-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
        >
            <Save className="size-4" aria-hidden />
            {isSubmitting ? "저장 중..." : idleLabel}
        </button>
    );
}

interface MusicMetadataFormProps {
    defaultValues: MusicMetadataFormValues;
}

function musicMetadataFormValues(
    values: MusicMetadataValues
): MusicMetadataFormValues {
    return {
        musicIndex: values.musicIndex,
        description: values.description ?? "",
        bpmMin: values.bpmMin?.toString() ?? "",
        bpmMax: values.bpmMax?.toString() ?? "",
        durationSeconds: values.durationSeconds?.toString() ?? "",
    };
}

export function MusicMetadataForm({ defaultValues }: MusicMetadataFormProps) {
    const router = useRouter();
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        register,
        reset,
        setError,
    } = useForm<MusicMetadataFormValues, unknown, MusicMetadataValues>({
        resolver: zodResolver(musicMetadataSchema),
        defaultValues,
        shouldFocusError: false,
    });

    async function handleMusicMetadataSubmit(values: MusicMetadataValues) {
        clearErrors();

        try {
            const result = await saveMusicMetadata(
                createMusicMetadataFormData(values)
            );
            if (!result.success) {
                applyFormFieldErrors(setError, result.fieldErrors);
                setError("root.server", {
                    type: "server",
                    message: result.message,
                });
                toast.error(result.message);
                return;
            }

            reset(musicMetadataFormValues(values));
            toast.success(result.message);
            router.refresh();
        } catch {
            const message = "악곡 공통 정보를 저장하지 못했습니다.";
            setError("root.server", { type: "server", message });
            toast.error(message);
        }
    }

    return (
        <form
            noValidate
            onSubmit={handleSubmit(handleMusicMetadataSubmit, () =>
                toast.error("악곡 공통 정보 입력을 확인해주세요.")
            )}
            className="bg-surface rounded-card flex flex-col gap-2 p-3"
        >
            <input type="hidden" {...register("musicIndex")} />
            <h2 className="text-section font-bold">공통 정보</h2>
            <label className="text-caption" htmlFor="description">
                악곡 설명
            </label>
            <textarea
                id="description"
                rows={3}
                className="border-border bg-bg text-input w-full resize-none rounded-md border px-3 py-2"
                {...register("description")}
            />
            <FieldError message={errors.description?.message} />
            <div className="grid grid-cols-2 gap-2">
                <label className="text-caption flex flex-col gap-1">
                    최소 BPM
                    <input
                        type="number"
                        min="1"
                        step="1"
                        aria-invalid={Boolean(errors.bpmMin)}
                        className={inputClass}
                        {...register("bpmMin")}
                    />
                    <FieldError message={errors.bpmMin?.message} />
                </label>
                <label className="text-caption flex flex-col gap-1">
                    최대 BPM
                    <input
                        type="number"
                        min="1"
                        step="1"
                        aria-invalid={Boolean(errors.bpmMax)}
                        className={inputClass}
                        {...register("bpmMax")}
                    />
                    <FieldError message={errors.bpmMax?.message} />
                </label>
                <label className="text-caption col-span-2 flex flex-col gap-1">
                    길이(초)
                    <input
                        type="number"
                        min="0"
                        step="1"
                        aria-invalid={Boolean(errors.durationSeconds)}
                        className={inputClass}
                        {...register("durationSeconds")}
                    />
                    <FieldError message={errors.durationSeconds?.message} />
                </label>
            </div>
            {errors.root?.server?.message ? (
                <p className="text-danger text-xs" role="alert">
                    {errors.root.server.message}
                </p>
            ) : null}
            <SubmitButton
                idleLabel="공통 정보 저장"
                isSubmitting={isSubmitting}
            />
        </form>
    );
}

interface ChartMetadataFormProps {
    chart: AdminMusicChart;
    musicIndex: string;
}

function chartMetadataDefaultValues(
    chart: AdminMusicChart,
    musicIndex: string
): ChartMetadataFormValues {
    return {
        chartId: chart.id,
        musicIndex,
        levelConstant: chart.levelConstant?.toString() ?? "",
        noteCount: chart.noteCount?.toString() ?? "",
        releasedAt: chart.releasedAt,
        unlockCondition: chart.unlockCondition,
        playVideoUrl: chart.playVideoUrl,
        chartPreviewUrl: chart.chartPreviewUrl,
    };
}

function parsedChartMetadataFormValues(
    values: ChartMetadataValues
): ChartMetadataFormValues {
    return {
        chartId: values.chartId,
        musicIndex: values.musicIndex,
        levelConstant: values.levelConstant?.toString() ?? "",
        noteCount: values.noteCount?.toString() ?? "",
        releasedAt: values.releasedAt?.toISOString().slice(0, 10) ?? "",
        unlockCondition: values.unlockCondition ?? "",
        playVideoUrl: values.playVideoUrl ?? "",
        chartPreviewUrl: values.chartPreviewUrl ?? "",
    };
}

export function ChartMetadataForm({
    chart,
    musicIndex,
}: ChartMetadataFormProps) {
    const router = useRouter();
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        register,
        reset,
        setError,
    } = useForm<ChartMetadataFormValues, unknown, ChartMetadataValues>({
        resolver: zodResolver(chartMetadataSchema),
        defaultValues: chartMetadataDefaultValues(chart, musicIndex),
        shouldFocusError: false,
    });

    async function handleChartMetadataSubmit(values: ChartMetadataValues) {
        clearErrors();

        try {
            const result = await saveChartMetadata(
                createChartMetadataFormData(values)
            );
            if (!result.success) {
                applyFormFieldErrors(setError, result.fieldErrors);
                setError("root.server", {
                    type: "server",
                    message: result.message,
                });
                toast.error(result.message);
                return;
            }

            reset(parsedChartMetadataFormValues(values));
            toast.success(result.message);
            router.refresh();
        } catch {
            const message = "채보 정보를 저장하지 못했습니다.";
            setError("root.server", { type: "server", message });
            toast.error(message);
        }
    }

    const difficulty = chart.difficulty.toLowerCase();

    return (
        <form
            noValidate
            onSubmit={handleSubmit(handleChartMetadataSubmit, () =>
                toast.error("채보 정보 입력을 확인해주세요.")
            )}
            className="bg-surface rounded-card flex flex-col gap-3 p-3"
        >
            <input type="hidden" {...register("chartId")} />
            <input type="hidden" {...register("musicIndex")} />
            <header className="flex items-center justify-between">
                <h2
                    className={
                        "text-section font-bold capitalize " +
                        (difficultyColor[difficulty] ?? "")
                    }
                >
                    {chart.difficulty}
                </h2>
                <div className="flex items-center gap-2">
                    <span className="text-caption">Lv {chart.level}</span>
                    <Link
                        href={
                            "/admin/music/" +
                            encodeURIComponent(musicIndex) +
                            "/" +
                            difficulty +
                            "/pattern"
                        }
                        className="border-border hover:bg-surface-muted flex h-8 items-center gap-1 rounded-md border px-2 text-xs font-semibold"
                    >
                        <PencilRuler className="size-3.5" aria-hidden />
                        채보 편집
                    </Link>
                </div>
            </header>
            <div className="grid grid-cols-2 gap-2">
                <label className="text-caption flex flex-col gap-1">
                    공식 레벨 상수
                    <input
                        type="number"
                        min="1"
                        max="14"
                        step="0.01"
                        aria-invalid={Boolean(errors.levelConstant)}
                        className={inputClass}
                        {...register("levelConstant")}
                    />
                    <FieldError message={errors.levelConstant?.message} />
                </label>
                <label className="text-caption flex flex-col gap-1">
                    노트 수
                    <input
                        type="number"
                        min="0"
                        step="1"
                        aria-invalid={Boolean(errors.noteCount)}
                        className={inputClass}
                        {...register("noteCount")}
                    />
                    <FieldError message={errors.noteCount?.message} />
                </label>
                <label className="text-caption flex flex-col gap-1">
                    수록일
                    <input
                        type="date"
                        aria-invalid={Boolean(errors.releasedAt)}
                        className={inputClass}
                        {...register("releasedAt")}
                    />
                    <FieldError message={errors.releasedAt?.message} />
                </label>
            </div>
            <label className="text-caption flex flex-col gap-1">
                해금 조건
                <input
                    aria-invalid={Boolean(errors.unlockCondition)}
                    className={inputClass}
                    {...register("unlockCondition")}
                />
                <FieldError message={errors.unlockCondition?.message} />
            </label>
            <label className="text-caption flex flex-col gap-1">
                플레이 영상 URL
                <input
                    type="url"
                    aria-invalid={Boolean(errors.playVideoUrl)}
                    className={inputClass}
                    {...register("playVideoUrl")}
                />
                <FieldError message={errors.playVideoUrl?.message} />
            </label>
            <label className="text-caption flex flex-col gap-1">
                채보 미리보기 URL
                <input
                    type="url"
                    aria-invalid={Boolean(errors.chartPreviewUrl)}
                    className={inputClass}
                    {...register("chartPreviewUrl")}
                />
                <FieldError message={errors.chartPreviewUrl?.message} />
            </label>
            {chart.history.length > 0 ? (
                <p className="text-caption">
                    최근 공식 상수:{" "}
                    {chart.history
                        .map((history) => history.toFixed(2))
                        .join(" · ")}
                </p>
            ) : null}
            {errors.root?.server?.message ? (
                <p className="text-danger text-xs" role="alert">
                    {errors.root.server.message}
                </p>
            ) : null}
            <SubmitButton idleLabel="채보 저장" isSubmitting={isSubmitting} />
        </form>
    );
}
