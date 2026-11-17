"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
    saveChartMetadata,
    saveMusicMetadata,
} from "@/app/admin/music/actions";
import {
    AdminCard,
    AdminCardHead,
    AdminReadRow,
    AdminReadRows,
    AdminTable,
} from "@/components/admin/admin-card";
import AdminDrawer from "@/components/admin/admin-drawer";
import {
    AdminFieldError,
    adminInputClass as inputClass,
    adminTextareaClass,
} from "@/components/admin/admin-form";
import ActionButton from "@/components/ui/action-button";
import ActionMenu from "@/components/ui/action-menu";
import Button from "@/components/ui/button";
import {
    type ChartMetadataFormValues,
    chartMetadataSchema,
    type ChartMetadataValues,
    createChartMetadataFormData,
    createMusicMetadataFormData,
    type MusicMetadataFormValues,
    musicMetadataSchema,
    type MusicMetadataValues,
} from "@/features/music/schemas/music-admin-schema";
import type { AdminMusicChart } from "@/features/music/types/music-admin";
import { applyFormActionFailure, applyFormRootError } from "@/lib/forms/errors";

const difficultyColor: Record<string, string> = {
    normal: "text-nl-difficulty-normal",
    hard: "text-nl-difficulty-hard",
    expert: "text-nl-difficulty-expert",
    real: "text-nl-difficulty-real",
};

function FieldError({ message }: { message?: string }) {
    return (
        <AdminFieldError
            message={message}
            className="nl-metadata text-nl-error"
        />
    );
}

// 읽기 줄 · 표의 빈 값
function readValue(value: string | null | undefined) {
    return value ? value : "-";
}

// 서랍 바닥 — 「취소 · 저장」 오른쪽. 저장은 서랍 본문의 폼을 form 속성으로 제출한다
export function DrawerFooter({
    formId,
    isSubmitting,
    submitLabel,
    onCancel,
}: {
    formId: string;
    isSubmitting: boolean;
    submitLabel: string;
    onCancel: () => void;
}) {
    return (
        <>
            <Button variant="secondary" onClick={onCancel}>
                취소
            </Button>
            <ActionButton
                type="submit"
                form={formId}
                busy={isSubmitting}
                busyLabel="저장 중"
            >
                {submitLabel}
            </ActionButton>
        </>
    );
}

interface MusicMetadataFormProps {
    title: string;
    artist: string;
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

export function MusicMetadataForm({
    title,
    artist,
    defaultValues,
}: MusicMetadataFormProps) {
    const router = useRouter();
    const formId = useId();
    const [open, setOpen] = useState(false);
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

    // 서랍을 열 때마다 저장된 값에서 시작한다 — 취소한 입력이 다음에 남지 않게
    function openEditor() {
        reset(defaultValues);
        setOpen(true);
    }

    async function handleMusicMetadataSubmit(values: MusicMetadataValues) {
        clearErrors();

        try {
            const result = await saveMusicMetadata(
                createMusicMetadataFormData(values)
            );
            if (!result.success) {
                applyFormActionFailure(setError, result, toast.error);
                return;
            }

            reset(musicMetadataFormValues(values));
            toast.success(result.message);
            setOpen(false);
            router.refresh();
        } catch {
            const message = "악곡 공통 정보를 저장하지 못했습니다.";
            applyFormRootError(setError, message, toast.error);
        }
    }

    return (
        <AdminCard>
            <AdminCardHead
                title={title}
                actions={
                    <ActionMenu
                        label="공통 정보 메뉴"
                        items={[{ label: "고치기", onSelect: openEditor }]}
                    />
                }
            />
            <AdminReadRows>
                <AdminReadRow label="아티스트">{artist}</AdminReadRow>
                <AdminReadRow label="악곡 설명">
                    {readValue(defaultValues.description)}
                </AdminReadRow>
                <AdminReadRow label="최소 BPM">
                    {readValue(defaultValues.bpmMin)}
                </AdminReadRow>
                <AdminReadRow label="최대 BPM">
                    {readValue(defaultValues.bpmMax)}
                </AdminReadRow>
                <AdminReadRow label="길이(초)">
                    {readValue(defaultValues.durationSeconds)}
                </AdminReadRow>
            </AdminReadRows>
            <AdminDrawer
                open={open}
                onOpenChange={setOpen}
                title="공통 정보 고치기"
                footer={
                    <DrawerFooter
                        formId={formId}
                        isSubmitting={isSubmitting}
                        submitLabel="공통 정보 저장"
                        onCancel={() => setOpen(false)}
                    />
                }
            >
                <form
                    id={formId}
                    noValidate
                    onSubmit={handleSubmit(handleMusicMetadataSubmit, () =>
                        toast.error("악곡 공통 정보 입력을 확인해주세요.")
                    )}
                    className="flex flex-col gap-nl-16"
                >
                    <input type="hidden" {...register("musicIndex")} />
                    <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
                        악곡 설명
                        <textarea
                            rows={3}
                            className={adminTextareaClass}
                            {...register("description")}
                        />
                        <FieldError message={errors.description?.message} />
                    </label>
                    <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
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
                    <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
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
                    <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
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
                    <AdminFieldError
                        message={errors.root?.server?.message}
                        className="nl-metadata text-nl-error"
                    />
                </form>
            </AdminDrawer>
        </AdminCard>
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
    charts,
    musicIndex,
}: {
    charts: AdminMusicChart[];
    musicIndex: string;
}) {
    return (
        <AdminCard>
            <AdminCardHead title="채보" level="h2" />
            <AdminTable>
                <thead>
                    <tr>
                        <th scope="col">난이도</th>
                        <th scope="col">레벨</th>
                        <th scope="col">공식 레벨 상수</th>
                        <th scope="col">노트 수</th>
                        <th scope="col">수록일</th>
                        <th scope="col">
                            <span className="sr-only">메뉴</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {charts.map((chart) => (
                        <ChartMetadataRow
                            key={chart.id}
                            chart={chart}
                            musicIndex={musicIndex}
                        />
                    ))}
                </tbody>
            </AdminTable>
        </AdminCard>
    );
}

function ChartMetadataRow({ chart, musicIndex }: ChartMetadataFormProps) {
    const router = useRouter();
    const formId = useId();
    const [open, setOpen] = useState(false);
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

    // 서랍을 열 때마다 저장된 값에서 시작한다 — 취소한 입력이 다음에 남지 않게
    function openEditor() {
        reset(chartMetadataDefaultValues(chart, musicIndex));
        setOpen(true);
    }

    async function handleChartMetadataSubmit(values: ChartMetadataValues) {
        clearErrors();

        try {
            const result = await saveChartMetadata(
                createChartMetadataFormData(values)
            );
            if (!result.success) {
                applyFormActionFailure(setError, result, toast.error);
                return;
            }

            reset(parsedChartMetadataFormValues(values));
            toast.success(result.message);
            setOpen(false);
            router.refresh();
        } catch {
            const message = "채보 정보를 저장하지 못했습니다.";
            applyFormRootError(setError, message, toast.error);
        }
    }

    const difficulty = chart.difficulty.toLowerCase();
    const patternHref =
        "/admin/music/" +
        encodeURIComponent(musicIndex) +
        "/" +
        difficulty +
        "/pattern";

    return (
        <tr>
            <td>
                <span
                    className={
                        "capitalize " + (difficultyColor[difficulty] ?? "")
                    }
                >
                    {chart.difficulty}
                </span>
            </td>
            <td>{chart.level}</td>
            <td>{readValue(chart.levelConstant?.toString())}</td>
            <td>{readValue(chart.noteCount?.toString())}</td>
            <td>{readValue(chart.releasedAt)}</td>
            <td className="nl-admin-table__menu">
                <ActionMenu
                    label={chart.difficulty + " 채보 메뉴"}
                    items={[
                        { label: "고치기", onSelect: openEditor },
                        {
                            label: "채보 편집",
                            onSelect: () => router.push(patternHref),
                        },
                    ]}
                />
                <AdminDrawer
                    open={open}
                    onOpenChange={setOpen}
                    title={chart.difficulty + " 채보 고치기"}
                    footer={
                        <DrawerFooter
                            formId={formId}
                            isSubmitting={isSubmitting}
                            submitLabel="채보 저장"
                            onCancel={() => setOpen(false)}
                        />
                    }
                >
                    <form
                        id={formId}
                        noValidate
                        onSubmit={handleSubmit(handleChartMetadataSubmit, () =>
                            toast.error("채보 정보 입력을 확인해주세요.")
                        )}
                        className="flex flex-col gap-nl-16"
                    >
                        <input type="hidden" {...register("chartId")} />
                        <input type="hidden" {...register("musicIndex")} />
                        <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
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
                            <FieldError
                                message={errors.levelConstant?.message}
                            />
                        </label>
                        <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
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
                        <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
                            수록일
                            <input
                                type="date"
                                aria-invalid={Boolean(errors.releasedAt)}
                                className={inputClass}
                                {...register("releasedAt")}
                            />
                            <FieldError message={errors.releasedAt?.message} />
                        </label>
                        <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
                            해금 조건
                            <input
                                aria-invalid={Boolean(errors.unlockCondition)}
                                className={inputClass}
                                {...register("unlockCondition")}
                            />
                            <FieldError
                                message={errors.unlockCondition?.message}
                            />
                        </label>
                        <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
                            플레이 영상 URL
                            <input
                                type="url"
                                aria-invalid={Boolean(errors.playVideoUrl)}
                                className={inputClass}
                                {...register("playVideoUrl")}
                            />
                            <FieldError
                                message={errors.playVideoUrl?.message}
                            />
                        </label>
                        <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
                            채보 미리보기 URL
                            <input
                                type="url"
                                aria-invalid={Boolean(errors.chartPreviewUrl)}
                                className={inputClass}
                                {...register("chartPreviewUrl")}
                            />
                            <FieldError
                                message={errors.chartPreviewUrl?.message}
                            />
                        </label>
                        {chart.history.length > 0 ? (
                            <p className="nl-metadata text-nl-subdued">
                                최근 공식 상수:{" "}
                                {chart.history
                                    .map((history) => history.toFixed(2))
                                    .join(" · ")}
                            </p>
                        ) : null}
                        <AdminFieldError
                            message={errors.root?.server?.message}
                            className="nl-metadata text-nl-error"
                        />
                    </form>
                </AdminDrawer>
            </td>
        </tr>
    );
}
