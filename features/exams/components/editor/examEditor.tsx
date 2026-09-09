"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
    deleteExam,
    saveExam,
    searchAdminMusic,
} from "@/app/admin/exams/actions";
import {
    examEditorSchema,
    type ExamEditorFormValues,
    type ExamEditorValues,
    type ExamMode,
    type ExamStatus,
} from "@/features/exams/schemas/examEditorSchema";
import { applyFormFieldErrors } from "@/lib/forms/errors";

import ExamBasicFields from "./examBasicFields";
import {
    cloneExamValues,
    EMPTY_EXAM,
    getExamModeLabel,
    type MusicSearchResult,
    type SearchPurpose,
} from "./examEditorTypes";
import ExamMusicSearchDialog from "./examMusicSearchDialog";
import ExamPublicationSection from "./examPublicationSection";
import ExamRewardSection from "./examRewardSection";
import ExamStageSection from "./examStageSection";

export type { ExamEditorFormValues as ExamEditorData } from "@/features/exams/schemas/examEditorSchema";

function getErrorMessage(error: unknown): string | undefined {
    if (!error || typeof error !== "object") {
        return undefined;
    }

    if ("message" in error && typeof error.message === "string") {
        return error.message;
    }

    return "root" in error ? getErrorMessage(error.root) : undefined;
}

export default function ExamEditor({
    initialExam,
}: {
    initialExam?: ExamEditorFormValues;
}) {
    const router = useRouter();
    const [purpose, setPurpose] = useState<SearchPurpose>("stage");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<MusicSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isDeleting, startDeleteTransition] = useTransition();
    const {
        clearErrors,
        control,
        formState: { errors, isSubmitting },
        getValues,
        handleSubmit,
        register,
        setError,
        setValue,
    } = useForm<ExamEditorFormValues, unknown, ExamEditorValues>({
        resolver: zodResolver(examEditorSchema),
        defaultValues: cloneExamValues(initialExam ?? EMPTY_EXAM),
        shouldFocusError: false,
    });
    const {
        append: appendStage,
        move: moveStage,
        remove: removeStage,
    } = useFieldArray({ control, name: "stages" });
    const {
        append: appendReward,
        remove: removeReward,
        replace: replaceRewards,
    } = useFieldArray({ control, name: "rewards" });
    const examId = useWatch({ control, name: "id" });
    const title = useWatch({ control, name: "title" });
    const mode = useWatch({ control, name: "mode" });
    const scoringType = useWatch({ control, name: "scoringType" });
    const status = useWatch({ control, name: "status" });
    const stages = useWatch({ control, name: "stages" });
    const rewards = useWatch({ control, name: "rewards" });

    function changeMode(nextMode: ExamMode) {
        const grade = getValues("grade") ?? 10;
        setValue("mode", nextMode, {
            shouldDirty: true,
            shouldValidate: true,
        });
        setValue(
            "scoringType",
            nextMode === "recital" ? "recital_point" : "score",
            { shouldDirty: true, shouldValidate: true }
        );
        setValue("grade", nextMode === "event" ? null : grade, {
            shouldDirty: true,
            shouldValidate: true,
        });

        if (initialExam) return;
        setValue(
            "slug",
            nextMode === "event" ? "event-name" : `${nextMode}-${grade}`,
            { shouldDirty: true, shouldValidate: true }
        );
        setValue(
            "shortLabel",
            nextMode === "event" ? "이벤트명" : `${grade}급`,
            { shouldDirty: true, shouldValidate: true }
        );
        setValue(
            "title",
            nextMode === "event"
                ? "이벤트 검정명"
                : `${getExamModeLabel(nextMode)} ${grade}급`,
            { shouldDirty: true, shouldValidate: true }
        );
        if (nextMode === "event") {
            setValue("requiredGrade", 0, {
                shouldDirty: true,
                shouldValidate: true,
            });
            replaceRewards([]);
        } else {
            replaceRewards([
                {
                    type: "grade",
                    label: `${getExamModeLabel(nextMode)} ${grade}급`,
                    musicIndex: null,
                },
            ]);
        }
    }

    function changeGrade(grade: number) {
        if (!Number.isFinite(grade)) return;

        setValue("grade", grade, {
            shouldDirty: true,
            shouldValidate: true,
        });
        if (initialExam) return;

        const currentMode = getValues("mode");
        setValue("slug", `${currentMode}-${grade}`, {
            shouldDirty: true,
            shouldValidate: true,
        });
        setValue("shortLabel", `${grade}급`, {
            shouldDirty: true,
            shouldValidate: true,
        });
        setValue("title", `${getExamModeLabel(currentMode)} ${grade}급`, {
            shouldDirty: true,
            shouldValidate: true,
        });
        replaceRewards([
            {
                type: "grade",
                label: `${getExamModeLabel(currentMode)} ${grade}급`,
                musicIndex: null,
            },
        ]);
    }

    function openSearch(nextPurpose: SearchPurpose) {
        setPurpose(nextPurpose);
        setSearchQuery("");
        setSearchResults([]);
        setIsSearchOpen(true);
    }

    async function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            setSearchResults(await searchAdminMusic(searchQuery));
        } catch {
            toast.error("악곡을 검색하지 못했습니다.");
        } finally {
            setIsSearching(false);
        }
    }

    function chooseMusic(music: MusicSearchResult) {
        if (purpose === "reward") {
            if (
                getValues("rewards").some(
                    (reward) => reward.musicIndex === music.musicIndex
                )
            ) {
                toast.error("이미 추가된 보상 악곡입니다.");
                return;
            }

            appendReward({
                type: "music_unlock",
                label: music.title,
                musicIndex: music.musicIndex,
            });
        } else {
            const currentStages = getValues("stages");
            if (
                currentStages.some(
                    (stage) => stage.musicIndex === music.musicIndex
                )
            ) {
                toast.error("이미 추가된 과제곡입니다.");
                return;
            }

            const preferredChart =
                music.charts.find((chart) => chart.difficulty === "expert") ??
                music.charts[0];
            appendStage({
                musicIndex: music.musicIndex,
                title: music.title,
                artist: music.artist,
                charts: music.charts,
                allowedChartIds:
                    getValues("mode") === "event"
                        ? music.charts.map((chart) => chart.chartId)
                        : preferredChart
                          ? [preferredChart.chartId]
                          : [],
                label: "",
                requirementType:
                    currentStages.length === 0 ? "single" : "cumulative",
                requiredValue:
                    getValues("scoringType") === "score" ? 900000 : 24,
            });
        }

        clearErrors(purpose === "reward" ? "rewards" : "stages");
        setIsSearchOpen(false);
    }

    function toggleChart(stageIndex: number, chartId: number) {
        const selectedChartIds =
            getValues(`stages.${stageIndex}.allowedChartIds`) ?? [];
        setValue(
            `stages.${stageIndex}.allowedChartIds`,
            selectedChartIds.includes(chartId)
                ? selectedChartIds.filter((id) => id !== chartId)
                : [...selectedChartIds, chartId],
            { shouldDirty: true, shouldValidate: true }
        );
    }

    function moveStageInDirection(index: number, direction: -1 | 1) {
        const nextIndex = index + direction;
        if (nextIndex < 0 || nextIndex >= stages.length) return;
        moveStage(index, nextIndex);
    }

    async function handleExamSubmit(values: ExamEditorValues) {
        clearErrors();

        try {
            const result = await saveExam(values);
            if (!result.success) {
                applyFormFieldErrors(setError, result.fieldErrors);
                setError("root.server", {
                    type: "server",
                    message: result.message,
                });
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            if (examId === undefined) {
                router.replace(`/admin/exams/${result.id}`);
            } else {
                router.refresh();
            }
        } catch {
            const message = "검정을 저장하지 못했습니다.";
            setError("root.server", { type: "server", message });
            toast.error(message);
        }
    }

    function handleDelete() {
        if (!examId || !window.confirm("이 검정을 삭제할까요?")) return;

        startDeleteTransition(async () => {
            const result = await deleteExam(examId);
            if (!result.success) {
                setError("root.server", {
                    type: "server",
                    message: result.message,
                });
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            router.replace("/admin/exams");
            router.refresh();
        });
    }

    return (
        <>
            <form
                noValidate
                onSubmit={handleSubmit(handleExamSubmit, () =>
                    toast.error("검정 입력을 확인해주세요.")
                )}
                className="pb-24"
            >
                <div className="flex flex-col gap-6 px-4 py-5">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/exams"
                            aria-label="검정 목록으로 이동"
                            className="border-border flex size-10 items-center justify-center rounded-md border"
                        >
                            <ArrowLeft className="size-4" />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-title">
                                {examId ? "검정 수정" : "검정 추가"}
                            </h1>
                            <p className="text-caption mt-0.5 truncate">
                                {title}
                            </p>
                        </div>
                    </div>

                    <ExamBasicFields
                        errors={errors}
                        mode={mode}
                        onModeChange={changeMode}
                        onGradeChange={changeGrade}
                        register={register}
                    />
                    <ExamStageSection
                        error={getErrorMessage(errors.stages)}
                        errors={errors}
                        stages={stages}
                        scoringType={scoringType}
                        onAdd={() => openSearch("stage")}
                        onToggleChart={toggleChart}
                        onMove={moveStageInDirection}
                        onRemove={removeStage}
                        register={register}
                    />
                    <ExamRewardSection
                        error={getErrorMessage(errors.rewards)}
                        errors={errors}
                        rewards={rewards}
                        onAddMusic={() => openSearch("reward")}
                        onRemove={removeReward}
                        register={register}
                    />
                    <ExamPublicationSection
                        status={status}
                        error={errors.status?.message}
                        onChange={(nextStatus: ExamStatus) =>
                            setValue("status", nextStatus, {
                                shouldDirty: true,
                                shouldValidate: true,
                            })
                        }
                    />

                    {errors.root?.server?.message ? (
                        <p className="text-danger text-sm" role="alert">
                            {errors.root.server.message}
                        </p>
                    ) : null}
                    {examId ? (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting || isSubmitting}
                            className="border-danger/50 text-danger h-11 rounded-md border text-sm font-semibold disabled:opacity-50"
                        >
                            검정 삭제
                        </button>
                    ) : null}
                </div>

                <div className="border-divider bg-bg fixed inset-x-0 bottom-0 z-20 mx-auto max-w-97.5 border-t p-3">
                    <button
                        type="submit"
                        disabled={isSubmitting || isDeleting}
                        className="bg-text-primary text-bg flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-bold disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                            <Save className="size-4" />
                        )}
                        저장
                    </button>
                </div>
            </form>

            <ExamMusicSearchDialog
                open={isSearchOpen}
                purpose={purpose}
                query={searchQuery}
                results={searchResults}
                isSearching={isSearching}
                onOpenChange={setIsSearchOpen}
                onQueryChange={setSearchQuery}
                onSearch={handleSearch}
                onChoose={chooseMusic}
            />
        </>
    );
}
