"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    LoaderCircle,
    Plus,
    Save,
    Search,
    Trash2,
    X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import {
    deleteExam,
    saveExam,
    searchAdminMusic,
} from "@/app/admin/exams/actions";
import { cn } from "@/lib/utils";

type ExamMode = "basic" | "recital" | "event";
type ScoringType = "score" | "recital_point";
type ExamStatus = "draft" | "published";
type RequirementType = "single" | "cumulative";

interface ChartOption {
    chartId: number;
    difficulty: string;
    level: number;
}

interface ExamStageEditor {
    id?: number;
    musicIndex: string;
    title: string;
    artist: string | null;
    charts: ChartOption[];
    allowedChartIds: number[];
    label: string;
    requirementType: RequirementType;
    requiredValue: number;
}

interface ExamRewardEditor {
    id?: number;
    type: "grade" | "music_unlock";
    label: string;
    musicIndex: string | null;
}

export interface ExamEditorData {
    id?: number;
    slug: string;
    mode: ExamMode;
    scoringType: ScoringType;
    grade: number | null;
    shortLabel: string;
    title: string;
    description: string;
    feeNos: number;
    requiredGrade: number;
    status: ExamStatus;
    stages: ExamStageEditor[];
    rewards: ExamRewardEditor[];
}

type MusicSearchResult = Awaited<ReturnType<typeof searchAdminMusic>>[number];
type SearchPurpose = "stage" | "reward";

const emptyExam: ExamEditorData = {
    slug: "basic-10",
    mode: "basic",
    scoringType: "score",
    grade: 10,
    shortLabel: "10급",
    title: "Basic 10급",
    description: "",
    feeNos: 1000,
    requiredGrade: 800,
    status: "draft",
    stages: [],
    rewards: [{ type: "grade", label: "Basic 10급", musicIndex: null }],
};

const inputClass =
    "border-border bg-surface text-input placeholder:text-text-disabled h-11 w-full rounded-md border px-3 outline-none focus:border-text-secondary";
const labelClass = "text-caption mb-1.5 block font-semibold";

function getModeLabel(mode: ExamMode) {
    if (mode === "basic") return "Basic";
    if (mode === "recital") return "Recital";
    return "Event";
}

function getDifficultyColor(difficulty: string) {
    const normalizedDifficulty = difficulty.toLowerCase();

    if (normalizedDifficulty === "normal") return "text-normal";
    if (normalizedDifficulty === "hard") return "text-hard";
    if (normalizedDifficulty === "expert") return "text-expert";
    return "text-real";
}

// 검정 정보, 과제곡, 허용 난이도와 합격 보상을 한곳에서 관리함
export default function ExamEditor({
    initialExam,
}: {
    initialExam?: ExamEditorData;
}) {
    const router = useRouter();
    const [exam, setExam] = useState(initialExam ?? emptyExam);
    const [purpose, setPurpose] = useState<SearchPurpose>("stage");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<MusicSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

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
                              : `${getModeLabel(mode)} ${grade}급`,
                      requiredGrade:
                          mode === "event" ? 0 : current.requiredGrade,
                      rewards:
                          mode === "event"
                              ? []
                              : [
                                    {
                                        type: "grade" as const,
                                        label: `${getModeLabel(mode)} ${grade}급`,
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
                      title: `${getModeLabel(current.mode)} ${grade}급`,
                      rewards: [
                          {
                              type: "grade" as const,
                              label: `${getModeLabel(current.mode)} ${grade}급`,
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
        const allowedChartIds = selected
            ? stage.allowedChartIds.filter((id) => id !== chartId)
            : [...stage.allowedChartIds, chartId];
        updateStage(stageIndex, { allowedChartIds });
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

                <section>
                    <h2 className="text-section mb-3 font-bold">기본 정보</h2>
                    <div className="grid grid-cols-3 gap-2">
                        {(["basic", "recital", "event"] as const).map(
                            (mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => changeMode(mode)}
                                    className={cn(
                                        "bg-surface text-text-secondary h-10 rounded-md text-sm font-semibold",
                                        exam.mode === mode &&
                                            "bg-text-primary text-bg"
                                    )}
                                >
                                    {getModeLabel(mode)}
                                </button>
                            )
                        )}
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                        {exam.mode !== "event" ? (
                            <label>
                                <span className={labelClass}>급수</span>
                                <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={exam.grade ?? 10}
                                    onChange={(event) =>
                                        changeGrade(Number(event.target.value))
                                    }
                                    className={inputClass}
                                />
                            </label>
                        ) : (
                            <label>
                                <span className={labelClass}>채점 방식</span>
                                <select
                                    value={exam.scoringType}
                                    onChange={(event) =>
                                        setExam((current) => ({
                                            ...current,
                                            scoringType: event.target
                                                .value as ScoringType,
                                        }))
                                    }
                                    className={inputClass}
                                >
                                    <option value="score">스코어</option>
                                    <option value="recital_point">
                                        리사이틀 포인트
                                    </option>
                                </select>
                            </label>
                        )}
                        <label>
                            <span className={labelClass}>식별자</span>
                            <input
                                value={exam.slug}
                                onChange={(event) =>
                                    setExam({
                                        ...exam,
                                        slug: event.target.value,
                                    })
                                }
                                className={inputClass}
                            />
                        </label>
                    </div>
                    <label className="mt-3 block">
                        <span className={labelClass}>선택 라벨</span>
                        <input
                            value={exam.shortLabel}
                            onChange={(event) =>
                                setExam({
                                    ...exam,
                                    shortLabel: event.target.value,
                                })
                            }
                            placeholder="예: 7th KAC"
                            className={inputClass}
                        />
                    </label>
                    <label className="mt-3 block">
                        <span className={labelClass}>검정명</span>
                        <input
                            value={exam.title}
                            onChange={(event) =>
                                setExam({ ...exam, title: event.target.value })
                            }
                            placeholder="예: The 7th KAC 스페셜 검정"
                            className={inputClass}
                        />
                    </label>
                    <label className="mt-3 block">
                        <span className={labelClass}>설명</span>
                        <textarea
                            value={exam.description}
                            onChange={(event) =>
                                setExam({
                                    ...exam,
                                    description: event.target.value,
                                })
                            }
                            rows={3}
                            className="border-border bg-surface text-body w-full resize-none rounded-md border p-3 outline-none"
                        />
                    </label>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                        <label>
                            <span className={labelClass}>요구 Grd.</span>
                            <input
                                type="number"
                                min={0}
                                value={exam.requiredGrade}
                                onChange={(event) =>
                                    setExam({
                                        ...exam,
                                        requiredGrade: Number(
                                            event.target.value
                                        ),
                                    })
                                }
                                className={inputClass}
                            />
                        </label>
                        <label>
                            <span className={labelClass}>검정료 (nos)</span>
                            <input
                                type="number"
                                min={0}
                                value={exam.feeNos}
                                onChange={(event) =>
                                    setExam({
                                        ...exam,
                                        feeNos: Number(event.target.value),
                                    })
                                }
                                className={inputClass}
                            />
                        </label>
                    </div>
                </section>

                <section>
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h2 className="text-section font-bold">과제곡</h2>
                            <p className="text-caption mt-0.5">
                                곡별 허용 난이도와 통과 조건을 설정합니다.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => openSearch("stage")}
                            disabled={exam.stages.length >= 3}
                            className="bg-text-primary text-bg flex size-9 items-center justify-center rounded-md disabled:opacity-40"
                            aria-label="과제곡 추가"
                        >
                            <Plus className="size-4" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {exam.stages.map((stage, index) => (
                            <article
                                key={stage.musicIndex}
                                className="bg-surface rounded-card p-3"
                            >
                                <div className="flex items-start gap-2">
                                    <span className="text-caption mt-1 w-7 shrink-0">
                                        {index === 2
                                            ? "Fin"
                                            : `${index + 1}${index === 0 ? "st" : "nd"}`}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-body truncate font-bold">
                                            {stage.title}
                                        </p>
                                        <p className="text-caption truncate">
                                            {stage.artist ??
                                                "아티스트 정보 없음"}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => moveStage(index, -1)}
                                        disabled={index === 0}
                                        className="text-text-secondary p-1 disabled:opacity-25"
                                    >
                                        <ArrowUp className="size-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveStage(index, 1)}
                                        disabled={
                                            index === exam.stages.length - 1
                                        }
                                        className="text-text-secondary p-1 disabled:opacity-25"
                                    >
                                        <ArrowDown className="size-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExam((current) => ({
                                                ...current,
                                                stages: current.stages.filter(
                                                    (_, itemIndex) =>
                                                        itemIndex !== index
                                                ),
                                            }))
                                        }
                                        className="text-danger p-1"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {stage.charts.map((chart) => {
                                        const selected =
                                            stage.allowedChartIds.includes(
                                                chart.chartId
                                            );
                                        return (
                                            <button
                                                key={chart.chartId}
                                                type="button"
                                                onClick={() =>
                                                    toggleChart(
                                                        index,
                                                        chart.chartId
                                                    )
                                                }
                                                className={cn(
                                                    "border-border rounded-full border px-2.5 py-1 text-xs font-semibold capitalize opacity-45",
                                                    selected &&
                                                        "bg-surface-muted opacity-100 ring-1 ring-current",
                                                    getDifficultyColor(
                                                        chart.difficulty
                                                    )
                                                )}
                                            >
                                                {chart.difficulty} {chart.level}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="mt-3 grid grid-cols-[1fr_1fr] gap-2">
                                    <label>
                                        <span className={labelClass}>조건</span>
                                        <select
                                            value={stage.requirementType}
                                            onChange={(event) =>
                                                updateStage(index, {
                                                    requirementType: event
                                                        .target
                                                        .value as RequirementType,
                                                })
                                            }
                                            className={inputClass}
                                        >
                                            <option value="single">
                                                해당 곡
                                            </option>
                                            <option value="cumulative">
                                                누적 합계
                                            </option>
                                        </select>
                                    </label>
                                    <label>
                                        <span className={labelClass}>
                                            {exam.scoringType === "score"
                                                ? "목표 스코어"
                                                : "목표 포인트"}
                                        </span>
                                        <input
                                            type="number"
                                            min={
                                                exam.scoringType === "score"
                                                    ? 1
                                                    : 0.1
                                            }
                                            step={
                                                exam.scoringType === "score"
                                                    ? 1
                                                    : 0.1
                                            }
                                            value={stage.requiredValue}
                                            onChange={(event) =>
                                                updateStage(index, {
                                                    requiredValue: Number(
                                                        event.target.value
                                                    ),
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </label>
                                </div>
                            </article>
                        ))}
                        {exam.stages.length === 0 ? (
                            <div className="border-border text-caption flex min-h-24 items-center justify-center rounded-md border border-dashed">
                                과제곡을 추가해주세요.
                            </div>
                        ) : null}
                    </div>
                </section>

                <section>
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h2 className="text-section font-bold">
                                합격 보상
                            </h2>
                            <p className="text-caption mt-0.5">
                                악곡 보상은 실제 악곡과 연결합니다.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => openSearch("reward")}
                            className="border-border flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-semibold"
                        >
                            <Plus className="size-3.5" /> 악곡
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {exam.rewards.map((reward, index) => (
                            <div
                                key={`${reward.type}-${reward.musicIndex ?? index}`}
                                className="bg-surface flex min-h-12 items-center gap-3 rounded-md px-3 py-2"
                            >
                                <span className="text-caption shrink-0">
                                    {reward.type === "music_unlock"
                                        ? "악곡"
                                        : "급수"}
                                </span>
                                <input
                                    value={reward.label}
                                    onChange={(event) =>
                                        setExam((current) => ({
                                            ...current,
                                            rewards: current.rewards.map(
                                                (item, itemIndex) =>
                                                    itemIndex === index
                                                        ? {
                                                              ...item,
                                                              label: event
                                                                  .target.value,
                                                          }
                                                        : item
                                            ),
                                        }))
                                    }
                                    className="text-body min-w-0 flex-1 bg-transparent outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExam((current) => ({
                                            ...current,
                                            rewards: current.rewards.filter(
                                                (_, itemIndex) =>
                                                    itemIndex !== index
                                            ),
                                        }))
                                    }
                                    className="text-danger p-1"
                                    aria-label="보상 삭제"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        ))}
                        {exam.rewards.length === 0 ? (
                            <p className="text-caption">
                                등록된 합격 보상이 없습니다.
                            </p>
                        ) : null}
                    </div>
                </section>

                <section className="border-divider border-t pt-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-body font-bold">공개 상태</h2>
                            <p className="text-caption mt-0.5">
                                공개하려면 과제곡 세 곡과 필수 정보를 입력해야
                                합니다.
                            </p>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={exam.status === "published"}
                            onClick={() =>
                                setExam({
                                    ...exam,
                                    status:
                                        exam.status === "published"
                                            ? "draft"
                                            : "published",
                                })
                            }
                            className={cn(
                                "bg-surface-muted relative h-7 w-12 rounded-full",
                                exam.status === "published" && "bg-success"
                            )}
                        >
                            <span
                                className={cn(
                                    "bg-text-primary absolute top-1 left-1 size-5 rounded-full transition-transform",
                                    exam.status === "published" &&
                                        "translate-x-5"
                                )}
                            />
                        </button>
                    </div>
                </section>

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

            <Dialog.Root open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70" />
                    <Dialog.Content className="bg-bg fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[75vh] max-w-90 -translate-y-1/2 overflow-hidden rounded-lg p-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <Dialog.Title className="text-body font-bold">
                                {purpose === "stage"
                                    ? "과제곡 추가"
                                    : "보상 악곡 추가"}
                            </Dialog.Title>
                            <Dialog.Close
                                className="text-text-secondary p-1"
                                aria-label="닫기"
                            >
                                <X className="size-5" />
                            </Dialog.Close>
                        </div>
                        <form
                            onSubmit={handleSearch}
                            className="mt-3 flex gap-2"
                        >
                            <input
                                autoFocus
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                                placeholder="곡 제목 · 아티스트 검색"
                                className={inputClass}
                            />
                            <button
                                type="submit"
                                className="bg-text-primary text-bg flex size-11 shrink-0 items-center justify-center rounded-md"
                                aria-label="검색"
                            >
                                {isSearching ? (
                                    <LoaderCircle className="size-4 animate-spin" />
                                ) : (
                                    <Search className="size-4" />
                                )}
                            </button>
                        </form>
                        <div className="mt-3 max-h-96 overflow-y-auto">
                            {searchResults.map((music) => (
                                <button
                                    key={music.musicIndex}
                                    type="button"
                                    onClick={() => chooseMusic(music)}
                                    className="border-divider hover:bg-surface flex w-full flex-col border-b px-2 py-3 text-left"
                                >
                                    <span className="text-body font-semibold">
                                        {music.title}
                                    </span>
                                    <span className="text-caption mt-0.5">
                                        {music.artist ?? "아티스트 정보 없음"}
                                    </span>
                                    <span className="mt-1 flex flex-wrap gap-1">
                                        {music.charts.map((chart) => (
                                            <span
                                                key={chart.chartId}
                                                className={cn(
                                                    "text-xs capitalize",
                                                    getDifficultyColor(
                                                        chart.difficulty
                                                    )
                                                )}
                                            >
                                                {chart.difficulty} {chart.level}
                                            </span>
                                        ))}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </form>
    );
}
