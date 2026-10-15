"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
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
import Button, { foundationButtonClass } from "@/components/ui/button";
import {
    type ExamEditorFormValues,
    examEditorSchema,
    type ExamEditorValues,
    type ExamMode,
    type ExamStatus,
} from "@/features/exams/schemas/exam-editor-schema";
import { cn } from "@/lib/cn";
import { applyFormActionFailure, applyFormRootError } from "@/lib/forms/errors";

import ExamBasicFields from "./exam-basic-fields";
import {
    cloneExamValues,
    EMPTY_EXAM,
    getExamModeLabel,
    type MusicSearchResult,
    type SearchPurpose,
} from "./exam-editor-types";
import ExamMusicSearchDialog from "./exam-music-search-dialog";
import ExamPublicationSection from "./exam-publication-section";
import ExamRewardSection from "./exam-reward-section";
import ExamStageSection from "./exam-stage-section";

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
                applyFormActionFailure(setError, result, toast.error);
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
            applyFormRootError(setError, message, toast.error);
        }
    }

    function handleDelete() {
        if (!examId || !window.confirm("이 검정을 삭제할까요?")) return;

        startDeleteTransition(async () => {
            const result = await deleteExam(examId);
            if (!result.success) {
                applyFormRootError(setError, result.message, toast.error);
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
            >
                <div className="flex flex-col gap-nl-24 px-nl-16 py-nl-24">
                    <div className="flex items-center gap-nl-12">
                        <Link
                            href="/admin/exams"
                            aria-label="검정 목록으로 이동"
                            className={foundationButtonClass({
                                variant: "secondary",
                                size: "icon",
                            })}
                        >
                            <ArrowLeft className="nl-icon-small" />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="nl-section-title text-nl-content">
                                {examId ? "검정 수정" : "검정 추가"}
                            </h1>
                            <p className="nl-metadata mt-nl-4 truncate text-nl-subdued">
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
                        <p
                            className="nl-body-secondary text-nl-error"
                            role="alert"
                        >
                            {errors.root.server.message}
                        </p>
                    ) : null}
                    {examId ? (
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            disabled={isDeleting || isSubmitting}
                        >
                            검정 삭제
                        </Button>
                    ) : null}
                </div>

                <div className="sticky bottom-0 z-nl-sticky border-t-nl-stroke border-nl-divider bg-nl-canvas p-nl-12">
                    <button
                        type="submit"
                        disabled={isSubmitting || isDeleting}
                        className={cn(foundationButtonClass(), "w-full")}
                    >
                        {isSubmitting ? (
                            <span className="nl-spinner" aria-hidden />
                        ) : (
                            <Save className="nl-icon-small" />
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
