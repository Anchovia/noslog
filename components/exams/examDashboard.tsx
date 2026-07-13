"use client";

import { Check, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import {
    requestExamProofUpload,
    submitExamProof,
} from "@/app/(nevigation)/exams/actions";
import { cn, formatToComma } from "@/lib/utils";

type ExamMode = "basic" | "recital" | "event";

interface ExamStageItem {
    id: number;
    position: number;
    label: string | null;
    requirementType: string;
    requiredValue: number;
    bestValue: number | null;
    musicIndex: string;
    title: string;
    artist: string | null;
    charts: { chartId: number; difficulty: string; level: number }[];
}

export interface ExamDashboardItem {
    id: number;
    slug: string;
    mode: string;
    scoringType: string;
    grade: number | null;
    shortLabel: string;
    title: string;
    description: string | null;
    feeNos: number;
    requiredGrade: number;
    rewards: {
        id: number;
        type: string;
        label: string;
        musicIndex: string | null;
    }[];
    isAchieved: boolean;
    submissionStatus: string | null;
    playerGrade: number | null;
    stages: ExamStageItem[];
}

const modes: { value: ExamMode; label: string }[] = [
    { value: "basic", label: "Basic" },
    { value: "recital", label: "Recital" },
    { value: "event", label: "Event" },
];

function canEnterExam(exam: ExamDashboardItem) {
    return (
        exam.requiredGrade === 0 ||
        (exam.playerGrade !== null && exam.playerGrade >= exam.requiredGrade)
    );
}

function getDefaultExam(exams: ExamDashboardItem[]) {
    return (
        exams.find((exam) => !exam.isAchieved && canEnterExam(exam)) ??
        exams.find((exam) => !exam.isAchieved) ??
        exams.at(-1) ??
        null
    );
}

function getModeText(mode: string) {
    if (mode === "recital") return "text-recital";
    if (mode === "basic") return "text-basic";
    return "text-text-primary";
}

function getModeBadge(mode: string) {
    if (mode === "recital")
        return "border-recital/35 bg-recital/10 text-recital";
    if (mode === "basic") return "border-basic/35 bg-basic/10 text-basic";
    return "border-text-secondary/40 bg-surface text-text-primary";
}

function getDifficultyBadge(difficulty: string) {
    const normalizedDifficulty = difficulty.toLowerCase();

    if (normalizedDifficulty === "normal") return "bg-normal/15 text-normal";
    if (normalizedDifficulty === "hard") return "bg-hard/15 text-hard";
    if (normalizedDifficulty === "expert") return "bg-expert/15 text-expert";
    return "bg-real/15 text-real";
}

function getStageLabel(stage: ExamStageItem, index: number, length: number) {
    if (stage.label) return stage.label;
    if (index === length - 1) return "Fin";
    return index === 0 ? "1st" : index === 1 ? "2nd" : "3rd";
}

function formatValue(value: number, scoringType: string) {
    return scoringType === "recital_point"
        ? `${Number.isInteger(value) ? value : value.toFixed(1)}점`
        : formatToComma(value);
}

// Figma 기준 검정 선택, 과제곡 조건과 합격 인증 흐름을 관리함
export default function ExamDashboard({
    exams,
    isAuthenticated,
}: {
    exams: ExamDashboardItem[];
    isAuthenticated: boolean;
}) {
    const router = useRouter();
    const initialMode =
        modes.find((item) => exams.some((exam) => exam.mode === item.value))
            ?.value ?? "basic";
    const [mode, setMode] = useState<ExamMode>(initialMode);
    const initialModeExams = exams.filter((exam) => exam.mode === initialMode);
    const [selectedExamId, setSelectedExamId] = useState<number | null>(
        getDefaultExam(initialModeExams)?.id ?? null
    );
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);

    const modeExams = useMemo(
        () =>
            exams
                .filter((exam) => exam.mode === mode)
                .sort(
                    (a, b) =>
                        (b.grade ?? Number.NEGATIVE_INFINITY) -
                            (a.grade ?? Number.NEGATIVE_INFINITY) || a.id - b.id
                ),
        [exams, mode]
    );
    const selectedExam =
        modeExams.find((exam) => exam.id === selectedExamId) ??
        getDefaultExam(modeExams);

    function changeMode(nextMode: ExamMode) {
        const nextExams = exams.filter((exam) => exam.mode === nextMode);
        setMode(nextMode);
        setSelectedExamId(getDefaultExam(nextExams)?.id ?? null);
        setUploadMessage(null);
    }

    async function handleProofUpload(file: File | undefined) {
        if (!file || !selectedExam) return;
        if (!file.type.startsWith("image/")) {
            setUploadMessage("이미지 파일만 업로드할 수 있습니다.");
            return;
        }
        setIsUploading(true);
        setUploadMessage(null);
        try {
            const upload = await requestExamProofUpload(selectedExam.id);
            if (!upload.success) {
                setUploadMessage(upload.message);
                return;
            }
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch(upload.uploadUrl, {
                method: "POST",
                body: formData,
            });
            const responseData = (await response.json()) as {
                success?: boolean;
            };
            if (!response.ok || !responseData.success) {
                setUploadMessage("이미지를 업로드하지 못했습니다.");
                return;
            }
            const submit = await submitExamProof(
                selectedExam.id,
                upload.imageUrl
            );
            setUploadMessage(
                submit.success ? "합격 인증을 제출했습니다." : submit.message
            );
            if (submit.success) router.refresh();
        } catch {
            setUploadMessage("업로드 중 오류가 발생했습니다.");
        } finally {
            setIsUploading(false);
        }
    }

    const stageResults = selectedExam
        ? selectedExam.stages.map((stage, index) => {
              const accumulatedValue = selectedExam.stages
                  .slice(0, index + 1)
                  .reduce((total, item) => total + (item.bestValue ?? 0), 0);
              const comparisonValue =
                  stage.requirementType === "cumulative"
                      ? accumulatedValue
                      : (stage.bestValue ?? 0);
              return {
                  ...stage,
                  comparisonValue,
                  isPassed:
                      stage.bestValue === null
                          ? null
                          : comparisonValue >= stage.requiredValue,
              };
          })
        : [];
    const finalStage = stageResults.at(-1);
    const totalValue = stageResults.reduce(
        (total, stage) => total + (stage.bestValue ?? 0),
        0
    );
    const targetValue = finalStage
        ? finalStage.requirementType === "cumulative"
            ? finalStage.requiredValue
            : stageResults.reduce(
                  (total, stage) => total + stage.requiredValue,
                  0
              )
        : 0;
    const progress =
        targetValue > 0 ? Math.min((totalValue / targetValue) * 100, 100) : 0;
    const firstFailedStage = stageResults.find(
        (stage) => stage.isPassed === false
    );
    const uploadDisabled =
        !isAuthenticated ||
        isUploading ||
        !selectedExam ||
        !canEnterExam(selectedExam) ||
        selectedExam.isAchieved ||
        selectedExam.submissionStatus === "pending";

    return (
        <div className="flex flex-col gap-3 px-4 py-3">
            <div className="flex gap-2">
                {modes.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => changeMode(item.value)}
                        className={cn(
                            "bg-surface text-text-secondary h-8 rounded-lg px-3.5 text-xs font-semibold",
                            mode === item.value && "bg-text-primary text-bg"
                        )}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {modeExams.length === 0 ? (
                <section className="bg-surface rounded-card text-caption flex min-h-52 items-center justify-center px-6 text-center">
                    등록된 검정이 없습니다.
                </section>
            ) : (
                <>
                    <div className="flex h-14 items-center gap-1.5 overflow-x-auto">
                        {modeExams.map((exam) => {
                            const selected = selectedExam?.id === exam.id;
                            const locked =
                                !exam.isAchieved && !canEnterExam(exam);
                            return (
                                <button
                                    key={exam.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedExamId(exam.id);
                                        setUploadMessage(null);
                                    }}
                                    className={cn(
                                        "bg-surface flex h-12 max-w-24 min-w-11 shrink-0 flex-col items-center justify-center rounded-lg px-2 font-bold",
                                        selected && "ring-text-primary ring-2",
                                        !selected && getModeText(exam.mode),
                                        !selected && locked && "opacity-35"
                                    )}
                                >
                                    <span className="max-w-full truncate text-xs">
                                        {exam.shortLabel}
                                    </span>
                                    <span
                                        className={cn(
                                            "mt-0.5 flex items-center gap-0.5 text-[10px] leading-none font-normal",
                                            exam.isAchieved && "text-success",
                                            locked && "text-danger",
                                            !exam.isAchieved &&
                                                !locked &&
                                                "text-text-secondary"
                                        )}
                                    >
                                        {exam.isAchieved ? (
                                            <>
                                                <Check className="size-3" />{" "}
                                                완료
                                            </>
                                        ) : locked ? (
                                            "잠김"
                                        ) : (
                                            "가능"
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {selectedExam ? (
                        <>
                            <section>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1
                                        className={cn(
                                            "rounded-md border px-2 py-0.5 text-xs font-extrabold",
                                            getModeBadge(selectedExam.mode)
                                        )}
                                    >
                                        {selectedExam.title}
                                    </h1>
                                    <p className="text-text-secondary text-xs tabular-nums">
                                        요구 Grd.{" "}
                                        {formatToComma(
                                            selectedExam.requiredGrade
                                        )}
                                        {selectedExam.playerGrade !== null ? (
                                            <span
                                                className={cn(
                                                    "ml-1",
                                                    selectedExam.playerGrade >=
                                                        selectedExam.requiredGrade
                                                        ? "text-success"
                                                        : "text-danger"
                                                )}
                                            >
                                                {selectedExam.playerGrade >=
                                                selectedExam.requiredGrade
                                                    ? "✓"
                                                    : "✕"}{" "}
                                                {formatToComma(
                                                    selectedExam.playerGrade
                                                )}
                                            </span>
                                        ) : null}
                                    </p>
                                </div>
                                <div className="text-text-secondary mt-1 flex min-w-0 items-center gap-2 text-xs">
                                    <p className="shrink-0">
                                        검정료{" "}
                                        <strong className="text-text-primary">
                                            {formatToComma(selectedExam.feeNos)}{" "}
                                            nos
                                        </strong>
                                    </p>
                                    <span className="text-divider">·</span>
                                    {selectedExam.rewards.length > 0 ? (
                                        <div className="flex min-w-0 items-center gap-x-1 overflow-hidden whitespace-nowrap">
                                            <span className="shrink-0">
                                                합격 보상
                                            </span>
                                            {selectedExam.rewards.map(
                                                (reward, index) => (
                                                    <span
                                                        key={reward.id}
                                                        className="text-text-primary truncate font-semibold"
                                                    >
                                                        {reward.musicIndex ? (
                                                            <Link
                                                                href={`/music?q=${encodeURIComponent(reward.label)}`}
                                                                className="decoration-divider underline underline-offset-2"
                                                            >
                                                                {reward.label}
                                                            </Link>
                                                        ) : (
                                                            reward.label
                                                        )}
                                                        {index <
                                                        selectedExam.rewards
                                                            .length -
                                                            1
                                                            ? ","
                                                            : ""}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <span className="truncate">
                                            합격 보상 미등록
                                        </span>
                                    )}
                                </div>
                            </section>

                            <section className="bg-surface rounded-card overflow-hidden">
                                <div className="bg-surface-muted text-text-secondary grid h-7 grid-cols-[2.25rem_minmax(0,1fr)_5.5rem_5.5rem] items-center gap-1 px-3 text-xs font-semibold">
                                    <span />
                                    <span>과제곡</span>
                                    <span className="text-right">
                                        통과 조건
                                    </span>
                                    <span className="text-right">
                                        내 베스트
                                    </span>
                                </div>
                                {stageResults.map((stage, index) => {
                                    const firstChart = stage.charts[0];
                                    const content = (
                                        <>
                                            <span className="text-text-disabled text-xs">
                                                {getStageLabel(
                                                    stage,
                                                    index,
                                                    stageResults.length
                                                )}
                                            </span>
                                            <span className="min-w-0">
                                                <strong className="block truncate text-sm leading-4 font-semibold">
                                                    {stage.title}
                                                </strong>
                                                <span className="mt-1 flex min-w-0 items-center gap-1">
                                                    {stage.charts.map(
                                                        (chart) => (
                                                            <span
                                                                key={
                                                                    chart.chartId
                                                                }
                                                                className={cn(
                                                                    "flex h-5 min-w-5 shrink-0 items-center justify-center rounded px-1 text-[10px] leading-none font-bold",
                                                                    getDifficultyBadge(
                                                                        chart.difficulty
                                                                    )
                                                                )}
                                                                title={`${chart.difficulty} ${chart.level}`}
                                                            >
                                                                {chart.level}
                                                            </span>
                                                        )
                                                    )}
                                                </span>
                                            </span>
                                            <span className="text-text-secondary text-right text-xs leading-3 tabular-nums">
                                                {stage.requirementType ===
                                                    "cumulative" && index > 0
                                                    ? index ===
                                                      stageResults.length - 1
                                                        ? "총합 "
                                                        : "합계 "
                                                    : ""}
                                                {formatValue(
                                                    stage.requiredValue,
                                                    selectedExam.scoringType
                                                )}
                                            </span>
                                            <span
                                                className={cn(
                                                    "text-right text-xs tabular-nums",
                                                    stage.bestValue === null ||
                                                        stage.bestValue === 0
                                                        ? "text-text-disabled"
                                                        : stage.isPassed
                                                          ? "text-success"
                                                          : "text-danger"
                                                )}
                                            >
                                                {stage.bestValue === null
                                                    ? "연동 미지원"
                                                    : stage.bestValue > 0
                                                      ? `${formatValue(stage.bestValue, selectedExam.scoringType)} ${stage.isPassed ? "✓" : "✕"}`
                                                      : "기록 없음"}
                                            </span>
                                        </>
                                    );
                                    const rowClass =
                                        "border-divider grid h-13 grid-cols-[2.25rem_minmax(0,1fr)_5.5rem_5.5rem] items-center gap-1 border-t px-3";
                                    return firstChart ? (
                                        <Link
                                            key={stage.id}
                                            href={`/music/${stage.musicIndex}/${firstChart.difficulty.toLowerCase()}`}
                                            className={rowClass}
                                        >
                                            {content}
                                        </Link>
                                    ) : (
                                        <div
                                            key={stage.id}
                                            className={rowClass}
                                        >
                                            {content}
                                        </div>
                                    );
                                })}
                            </section>

                            <section className="bg-surface rounded-card px-3 py-2.5">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="text-sm font-semibold">
                                        합격 시뮬레이션
                                    </h2>
                                    {selectedExam.scoringType === "score" ? (
                                        <p className="text-text-secondary text-right text-xs tabular-nums">
                                            누적{" "}
                                            {formatValue(
                                                totalValue,
                                                selectedExam.scoringType
                                            )}{" "}
                                            /{" "}
                                            {formatValue(
                                                targetValue,
                                                selectedExam.scoringType
                                            )}
                                        </p>
                                    ) : null}
                                </div>
                                {selectedExam.scoringType === "score" ? (
                                    <>
                                        <div className="bg-surface-muted relative mt-2 h-2 rounded-full">
                                            <div
                                                className="bg-chart h-full rounded-full"
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            />
                                            {stageResults.map(
                                                (stage, index) => (
                                                    <span
                                                        key={stage.id}
                                                        className="bg-text-primary absolute top-1/2 h-3 w-0.5 -translate-y-1/2"
                                                        style={{
                                                            left: `${((index + 1) / stageResults.length) * 100}%`,
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>
                                        <p className="text-text-secondary mt-1.5 text-xs">
                                            {firstFailedStage ? (
                                                <>
                                                    {getStageLabel(
                                                        firstFailedStage,
                                                        stageResults.indexOf(
                                                            firstFailedStage
                                                        ),
                                                        stageResults.length
                                                    )}{" "}
                                                    조건까지{" "}
                                                    <span className="text-danger">
                                                        {formatToComma(
                                                            Math.max(
                                                                firstFailedStage.requiredValue -
                                                                    firstFailedStage.comparisonValue,
                                                                0
                                                            )
                                                        )}
                                                        점
                                                    </span>{" "}
                                                    더 필요
                                                </>
                                            ) : (
                                                <span className="text-success">
                                                    현재 기록 기준 합격 조건을
                                                    충족합니다.
                                                </span>
                                            )}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-body-muted mt-3">
                                        리사이틀 판정 포인트는 현재 동기화
                                        데이터에서 제공되지 않아 자동 계산할 수
                                        없습니다.
                                    </p>
                                )}
                            </section>

                            <section>
                                <input
                                    id={`exam-proof-${selectedExam.id}`}
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    disabled={uploadDisabled}
                                    onChange={(event) => {
                                        const file =
                                            event.currentTarget.files?.[0];
                                        event.currentTarget.value = "";
                                        void handleProofUpload(file);
                                    }}
                                />
                                <label
                                    htmlFor={`exam-proof-${selectedExam.id}`}
                                    aria-disabled={uploadDisabled}
                                    className={cn(
                                        "border-text-disabled flex h-10 items-center justify-center gap-2 rounded-lg border border-dashed text-xs font-semibold",
                                        uploadDisabled
                                            ? "cursor-not-allowed opacity-50"
                                            : "hover:bg-surface cursor-pointer"
                                    )}
                                >
                                    <Upload className="size-4" />
                                    {isUploading
                                        ? "업로드 중..."
                                        : selectedExam.isAchieved
                                          ? "합격 인증 완료"
                                          : selectedExam.submissionStatus ===
                                              "pending"
                                            ? "인증 심사 중"
                                            : isAuthenticated
                                              ? "합격 스크린샷 업로드"
                                              : "로그인 후 인증 가능"}
                                </label>
                                {uploadMessage ? (
                                    <p
                                        className={cn(
                                            "mt-2 text-xs",
                                            uploadMessage.includes("제출")
                                                ? "text-success"
                                                : "text-danger"
                                        )}
                                    >
                                        {uploadMessage}
                                    </p>
                                ) : null}
                            </section>
                        </>
                    ) : null}
                </>
            )}
        </div>
    );
}
