"use client";

import { put } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import {
    requestExamProofUpload,
    submitExamProof,
} from "@/app/(nevigation)/exams/actions";
import ExamModeTabs, {
    EXAM_MODES,
} from "@/components/exams/dashboard/examModeTabs";
import ExamOverview from "@/components/exams/dashboard/examOverview";
import ExamProofUpload from "@/components/exams/dashboard/examProofUpload";
import ExamSelector from "@/components/exams/dashboard/examSelector";
import ExamSimulation from "@/components/exams/dashboard/examSimulation";
import ExamStageTable from "@/components/exams/dashboard/examStageTable";
import {
    type ExamDashboardItem,
    type ExamMode,
} from "@/components/exams/dashboard/examDashboardTypes";
import {
    calculateExamSimulation,
    canEnterExam,
    getDefaultExam,
} from "@/components/exams/dashboard/examDashboardUtils";

export type { ExamDashboardItem } from "@/components/exams/dashboard/examDashboardTypes";

// Figma 기준 검정 선택 상태와 합격 인증 흐름을 하위 영역에 연결함
export default function ExamDashboard({
    exams,
    isAuthenticated,
}: {
    exams: ExamDashboardItem[];
    isAuthenticated: boolean;
}) {
    const router = useRouter();
    const initialMode =
        EXAM_MODES.find((item) =>
            exams.some((exam) => exam.mode === item.value)
        )?.value ?? "basic";
    const initialModeExams = exams.filter((exam) => exam.mode === initialMode);
    const [mode, setMode] = useState<ExamMode>(initialMode);
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
    const simulation = useMemo(
        () => (selectedExam ? calculateExamSimulation(selectedExam) : null),
        [selectedExam]
    );
    const uploadDisabled =
        !isAuthenticated ||
        isUploading ||
        !selectedExam ||
        !canEnterExam(selectedExam) ||
        selectedExam.isAchieved ||
        selectedExam.submissionStatus === "pending";

    function changeMode(nextMode: ExamMode) {
        const nextExams = exams.filter((exam) => exam.mode === nextMode);
        setMode(nextMode);
        setSelectedExamId(getDefaultExam(nextExams)?.id ?? null);
        setUploadMessage(null);
    }

    function selectExam(examId: number) {
        setSelectedExamId(examId);
        setUploadMessage(null);
    }

    async function handleProofUpload(file: File | undefined) {
        if (!file || !selectedExam) return;
        if (
            !(["image/jpeg", "image/png", "image/webp"] as string[]).includes(
                file.type
            )
        ) {
            setUploadMessage("JPG, PNG, WebP 이미지만 업로드할 수 있습니다.");
            return;
        }
        if (file.size > 4 * 1024 * 1024) {
            setUploadMessage("이미지는 4MB 이하로 선택해주세요.");
            return;
        }

        setIsUploading(true);
        setUploadMessage(null);
        try {
            const upload = await requestExamProofUpload(
                selectedExam.id,
                file.type
            );
            if (!upload.success) {
                setUploadMessage(upload.message);
                return;
            }

            const blob = await put(upload.pathname, file, {
                access: "public",
                token: upload.token,
                contentType: file.type,
            });

            const submit = await submitExamProof(selectedExam.id, blob.url);
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

    return (
        <div className="flex flex-col gap-3 px-4 py-3">
            <ExamModeTabs mode={mode} onChange={changeMode} />

            {modeExams.length === 0 ? (
                <section className="bg-surface rounded-card text-caption flex min-h-52 items-center justify-center px-6 text-center">
                    등록된 검정이 없습니다.
                </section>
            ) : (
                <>
                    <ExamSelector
                        exams={modeExams}
                        selectedExamId={selectedExam?.id}
                        onChange={selectExam}
                    />

                    {selectedExam && simulation ? (
                        <>
                            <ExamOverview exam={selectedExam} />
                            <ExamStageTable
                                stages={simulation.stages}
                                scoringType={selectedExam.scoringType}
                            />
                            <ExamSimulation
                                exam={selectedExam}
                                simulation={simulation}
                            />
                            <ExamProofUpload
                                exam={selectedExam}
                                isAuthenticated={isAuthenticated}
                                isUploading={isUploading}
                                disabled={uploadDisabled}
                                message={uploadMessage}
                                onUpload={(file) =>
                                    void handleProofUpload(file)
                                }
                            />
                        </>
                    ) : null}
                </>
            )}
        </div>
    );
}
