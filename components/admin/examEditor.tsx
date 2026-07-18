"use client";

import { ArrowLeft, LoaderCircle, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import {
    deleteExam,
    saveExam,
    searchAdminMusic,
} from "@/app/admin/exams/actions";
import ExamBasicFields from "@/components/admin/exam/examBasicFields";
import {
    EMPTY_EXAM,
    type ExamEditorData,
    type ExamMode,
    type ExamStageEditor,
    getExamModeLabel,
    type MusicSearchResult,
    type SearchPurpose,
} from "@/components/admin/exam/examEditorTypes";
import ExamMusicSearchDialog from "@/components/admin/exam/examMusicSearchDialog";
import ExamPublicationSection from "@/components/admin/exam/examPublicationSection";
import ExamRewardSection from "@/components/admin/exam/examRewardSection";
import ExamStageSection from "@/components/admin/exam/examStageSection";

export type { ExamEditorData } from "@/components/admin/exam/examEditorTypes";

// 검정 편집 상태와 저장 액션을 하위 편집 영역에 연결함
export default function ExamEditor({
    initialExam,
}: {
    initialExam?: ExamEditorData;
}) {
    const router = useRouter();
    const [exam, setExam] = useState(initialExam ?? EMPTY_EXAM);
    const [purpose, setPurpose] = useState<SearchPurpose>("stage");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<MusicSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function updateExam(changes: Partial<ExamEditorData>) {
        setExam((current) => ({ ...current, ...changes }));
    }

    function changeMode(mode: ExamMode) {
        const grade = mode === "event" ? null : (exam.grade ?? 10);
        setExam((current) => ({
            ...current,
            mode,
            grade,
            scoringType: mode === "recital" ? "recital_point" : "score",
            ...(!initialExam
                ? {
                      slug:
                          mode === "event" ? "event-name" : `${mode}-${grade}`,
                      shortLabel: mode === "event" ? "이벤트명" : `${grade}급`,
                      title:
                          mode === "event"
                              ? "이벤트 검정명"
                              : `${getExamModeLabel(mode)} ${grade}급`,
                      requiredGrade:
                          mode === "event" ? 0 : current.requiredGrade,
                      rewards:
                          mode === "event"
                              ? []
                              : [
                                    {
                                        type: "grade" as const,
                                        label: `${getExamModeLabel(mode)} ${grade}급`,
                                        musicIndex: null,
                                    },
                                ],
                  }
                : {}),
        }));
    }

    function changeGrade(grade: number) {
        setExam((current) => ({
            ...current,
            grade,
            ...(!initialExam
                ? {
                      slug: `${current.mode}-${grade}`,
                      shortLabel: `${grade}급`,
                      title: `${getExamModeLabel(current.mode)} ${grade}급`,
                      rewards: [
                          {
                              type: "grade" as const,
                              label: `${getExamModeLabel(current.mode)} ${grade}급`,
                              musicIndex: null,
                          },
                      ],
                  }
                : {}),
        }));
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
        } finally {
            setIsSearching(false);
        }
    }

    function chooseMusic(music: MusicSearchResult) {
        if (purpose === "reward") {
            if (
                exam.rewards.some(
                    (reward) => reward.musicIndex === music.musicIndex
                )
            ) {
                setMessage("이미 추가된 보상 악곡입니다.");
                return;
            }

            setExam((current) => ({
                ...current,
                rewards: [
                    ...current.rewards,
                    {
                        type: "music_unlock",
                        label: music.title,
                        musicIndex: music.musicIndex,
                    },
                ],
            }));
        } else {
            if (
                exam.stages.some(
                    (stage) => stage.musicIndex === music.musicIndex
                )
            ) {
                setMessage("이미 추가된 과제곡입니다.");
                return;
            }

            const preferredChart =
                music.charts.find((chart) => chart.difficulty === "expert") ??
                music.charts[0];
            setExam((current) => ({
                ...current,
                stages: [
                    ...current.stages,
                    {
                        musicIndex: music.musicIndex,
                        title: music.title,
                        artist: music.artist,
                        charts: music.charts,
                        allowedChartIds:
                            current.mode === "event"
                                ? music.charts.map((chart) => chart.chartId)
                                : preferredChart
                                  ? [preferredChart.chartId]
                                  : [],
                        label: "",
                        requirementType:
                            current.stages.length === 0
                                ? "single"
                                : "cumulative",
                        requiredValue:
                            current.scoringType === "score" ? 900000 : 24,
                    },
                ],
            }));
        }

        setMessage(null);
        setIsSearchOpen(false);
    }

    function updateStage(index: number, changes: Partial<ExamStageEditor>) {
        setExam((current) => ({
            ...current,
            stages: current.stages.map((stage, stageIndex) =>
                stageIndex === index ? { ...stage, ...changes } : stage
            ),
        }));
    }

    function toggleChart(stageIndex: number, chartId: number) {
        const stage = exam.stages[stageIndex];
        const selected = stage.allowedChartIds.includes(chartId);
        updateStage(stageIndex, {
            allowedChartIds: selected
                ? stage.allowedChartIds.filter((id) => id !== chartId)
                : [...stage.allowedChartIds, chartId],
        });
    }

    function moveStage(index: number, direction: -1 | 1) {
        const nextIndex = index + direction;
        if (nextIndex < 0 || nextIndex >= exam.stages.length) return;

        setExam((current) => {
            const stages = [...current.stages];
            [stages[index], stages[nextIndex]] = [
                stages[nextIndex],
                stages[index],
            ];
            return { ...current, stages };
        });
    }

    function removeStage(index: number) {
        setExam((current) => ({
            ...current,
            stages: current.stages.filter(
                (_, stageIndex) => stageIndex !== index
            ),
        }));
    }

    function updateRewardLabel(index: number, label: string) {
        setExam((current) => ({
            ...current,
            rewards: current.rewards.map((reward, rewardIndex) =>
                rewardIndex === index ? { ...reward, label } : reward
            ),
        }));
    }

    function removeReward(index: number) {
        setExam((current) => ({
            ...current,
            rewards: current.rewards.filter(
                (_, rewardIndex) => rewardIndex !== index
            ),
        }));
    }

    function handleSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage(null);
        startTransition(async () => {
            const result = await saveExam({
                ...exam,
                description: exam.description || null,
                stages: exam.stages.map((stage, index) => ({
                    musicIndex: stage.musicIndex,
                    position: index + 1,
                    label: stage.label || null,
                    requirementType: stage.requirementType,
                    requiredValue: stage.requiredValue,
                    allowedChartIds: stage.allowedChartIds,
                })),
            });
            if (!result.success) {
                setMessage(result.message);
                return;
            }

            router.push(`/admin/exams/${result.id}`);
            router.refresh();
        });
    }

    function handleDelete() {
        if (!exam.id || !window.confirm("이 검정을 삭제할까요?")) return;

        startTransition(async () => {
            const result = await deleteExam(exam.id!);
            if (!result.success) {
                setMessage(result.message);
                return;
            }

            router.push("/admin/exams");
            router.refresh();
        });
    }

    return (
        <>
            <form onSubmit={handleSave} className="pb-24">
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
                                {exam.id ? "검정 수정" : "검정 추가"}
                            </h1>
                            <p className="text-caption mt-0.5 truncate">
                                {exam.title}
                            </p>
                        </div>
                    </div>

                    <ExamBasicFields
                        exam={exam}
                        onChange={updateExam}
                        onModeChange={changeMode}
                        onGradeChange={changeGrade}
                    />
                    <ExamStageSection
                        stages={exam.stages}
                        scoringType={exam.scoringType}
                        onAdd={() => openSearch("stage")}
                        onUpdate={updateStage}
                        onToggleChart={toggleChart}
                        onMove={moveStage}
                        onRemove={removeStage}
                    />
                    <ExamRewardSection
                        rewards={exam.rewards}
                        onAddMusic={() => openSearch("reward")}
                        onLabelChange={updateRewardLabel}
                        onRemove={removeReward}
                    />
                    <ExamPublicationSection
                        status={exam.status}
                        onChange={(status) => updateExam({ status })}
                    />

                    {message ? (
                        <p className="text-danger text-sm">{message}</p>
                    ) : null}
                    {exam.id ? (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isPending}
                            className="border-danger/50 text-danger h-11 rounded-md border text-sm font-semibold"
                        >
                            검정 삭제
                        </button>
                    ) : null}
                </div>

                <div className="border-divider bg-bg fixed inset-x-0 bottom-0 z-20 mx-auto max-w-97.5 border-t p-3">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-text-primary text-bg flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-bold disabled:opacity-50"
                    >
                        {isPending ? (
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
