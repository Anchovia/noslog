"use client";

import { put } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import {
    discardExamProofUpload,
    requestExamProofUpload,
    submitExamProof,
} from "@/app/(nevigation)/exams/actions";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import ExamModeTabs from "@/components/exams/dashboard/examModeTabs";
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
import { Switch } from "@/components/ui/Switch";

export type { ExamDashboardItem } from "@/components/exams/dashboard/examDashboardTypes";

// Figma 기준 검정 선택 상태와 합격 인증 흐름을 하위 영역에 연결함
export default function ExamDashboard({
    exams,
    isAuthenticated,
}: {
    exams: ExamDashboardItem[];
    isAuthenticated: boolean;
}) {
    const locale = useLocale();
    const t = useTranslations();
    const router = useRouter();
    const initialMode: ExamMode = "basic";
    const [mode, setMode] = useState<ExamMode>(initialMode);
    const [selectedExamId, setSelectedExamId] = useState<number | null>(
        () =>
            getDefaultExam(exams.filter((exam) => exam.mode === initialMode))
                ?.id ?? null
    );
    const [showAdvice, setShowAdvice] = useState(false);
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
        selectedExamId === null
            ? null
            : (modeExams.find((exam) => exam.id === selectedExamId) ?? null);
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
        setMode(nextMode);
        setSelectedExamId(
            getDefaultExam(exams.filter((exam) => exam.mode === nextMode))
                ?.id ?? null
        );
        setShowAdvice(false);
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
            setUploadMessage(t("exams.proof.invalidImage"));
            return;
        }
        if (file.size > 4 * 1024 * 1024) {
            setUploadMessage(t("exams.proof.imageTooLarge"));
            return;
        }

        setIsUploading(true);
        setUploadMessage(null);
        let uploadedBlobUrl: string | null = null;
        try {
            const upload = await requestExamProofUpload(
                selectedExam.id,
                file.type,
                locale
            );
            if (!upload.success) {
                setUploadMessage(upload.message);
                return;
            }

            const blob = await put(upload.pathname, file, {
                access: "private",
                token: upload.token,
                contentType: file.type,
            });
            uploadedBlobUrl = blob.url;

            const submit = await submitExamProof(
                selectedExam.id,
                blob.url,
                locale
            );
            setUploadMessage(
                submit.success ? t("exams.proof.submitted") : submit.message
            );
            if (submit.success) router.refresh();
        } catch {
            if (uploadedBlobUrl) {
                await discardExamProofUpload(
                    selectedExam.id,
                    uploadedBlobUrl
                ).catch(() => null);
            }
            setUploadMessage(t("exams.proof.uploadError"));
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <ExamModeTabs mode={mode} onChange={changeMode} />

            {modeExams.length === 0 ? (
                <section className="bg-surface rounded-card text-caption flex min-h-52 items-center justify-center px-6 text-center">
                    {t("exams.empty")}
                </section>
            ) : (
                <>
                    {mode === "basic" ? (
                        <section className="bg-surface rounded-card flex items-center justify-between gap-4 p-3">
                            <div className="min-w-0">
                                <label
                                    htmlFor="exam-advice-switch"
                                    className="text-label font-semibold"
                                >
                                    {t("exams.advice")}
                                </label>
                                <p className="text-caption mt-0.5">
                                    {isAuthenticated
                                        ? t("exams.advice.auth")
                                        : t("exams.advice.guest")}
                                </p>
                            </div>
                            <Switch
                                id="exam-advice-switch"
                                aria-label={t("exams.advice")}
                                checked={showAdvice}
                                onCheckedChange={setShowAdvice}
                                disabled={!isAuthenticated}
                            />
                        </section>
                    ) : null}
                    <ExamSelector
                        exams={modeExams}
                        selectedExamId={selectedExam?.id ?? null}
                        onChange={selectExam}
                    >
                        {selectedExam && simulation ? (
                            <>
                                <ExamOverview exam={selectedExam} />
                                {selectedExam.mode === "basic" && showAdvice ? (
                                    <ExamSimulation
                                        exam={selectedExam}
                                        simulation={simulation}
                                    />
                                ) : null}
                                <ExamStageTable
                                    stages={simulation.stages}
                                    scoringType={selectedExam.scoringType}
                                    showBest={
                                        selectedExam.mode === "basic" &&
                                        showAdvice
                                    }
                                />
                                {selectedExam.mode !== "event" ? (
                                    <>
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
                        ) : null}
                    </ExamSelector>
                </>
            )}
        </div>
    );
}
