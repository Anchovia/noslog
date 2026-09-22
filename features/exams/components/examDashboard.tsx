"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import {
    requestExamProofUpload,
    submitExamProof,
} from "@/app/(nevigation)/exams/actions";
import type {
    ExamDashboardItem,
    ExamMode,
} from "@/components/exams/dashboard/examDashboardTypes";
import {
    canEnterExam,
    getDefaultExam,
} from "@/components/exams/dashboard/examDashboardUtils";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import ExamNavigation from "@/features/exams/components/examNavigation";
import ExamStages from "@/features/exams/components/examStages";
import ExamPractice from "@/features/exams/components/examPractice";
import ExamProofUpload from "@/features/exams/components/examProofUpload";
import ExamStatus, {
    getExamStatus,
} from "@/features/exams/components/examStatus";
import StatStrip from "@/components/ui/statStrip";
import { createExamProofSubmissionFormData } from "@/features/exams/schemas/examProofSchema";
import { localizePath } from "@/lib/i18n/routing";
import { getExamIdentity } from "@/features/exams/examIdentity";
import { uploadGrantedImage } from "@/lib/uploads/clientImageUpload";

export type { ExamDashboardItem } from "@/components/exams/dashboard/examDashboardTypes";

export default function ExamDashboard({
    exams,
    isAuthenticated,
    initialSlug,
}: {
    exams: ExamDashboardItem[];
    isAuthenticated: boolean;
    initialSlug?: string;
}) {
    const locale = useLocale();
    const t = useTranslations();
    const router = useRouter();
    const pathname = usePathname();
    const query = useSearchParams();
    const slug = pathname.includes("/exams/")
        ? pathname.split("/exams/")[1]
        : initialSlug;
    const explicit = exams.find((exam) => exam.slug === slug);
    const requestedMode = query.get("mode");
    const mode = (explicit?.mode ??
        (requestedMode === "recital" || requestedMode === "event"
            ? requestedMode
            : "basic")) as ExamMode;
    const modeExams = exams
        .filter((exam) => exam.mode === mode)
        .sort((a, b) => (b.grade ?? 0) - (a.grade ?? 0) || a.id - b.id);
    const selected = explicit ?? getDefaultExam(modeExams);
    const [uploadFeedback, setUploadFeedback] = useState<{
        examId: number;
        message: string;
        requiresLogin?: boolean;
    } | null>(null);
    const uploaded = useRef<{ examId: number; file: File; url: string } | null>(
        null
    );
    const examLabel = (exam: ExamDashboardItem) =>
        getExamIdentity(exam, t).label;
    const examTitle = (exam: ExamDashboardItem) =>
        getExamIdentity(exam, t).title;
    const examState = (exam: ExamDashboardItem, detailed = false) => {
        const kind = getExamStatus(exam, isAuthenticated);
        return kind ? (
            <ExamStatus exam={exam} kind={kind} detailed={detailed} />
        ) : null;
    };

    function selectExam(exam: ExamDashboardItem) {
        window.history.pushState(
            {},
            "",
            localizePath(`/exams/${exam.slug}`, locale)
        );
    }
    function changeMode(nextMode: ExamMode) {
        const next = getDefaultExam(
            exams
                .filter((exam) => exam.mode === nextMode)
                .sort((a, b) => (b.grade ?? 0) - (a.grade ?? 0) || a.id - b.id)
        );
        if (next) selectExam(next);
        else
            window.history.pushState(
                {},
                "",
                localizePath(`/exams?mode=${nextMode}`, locale)
            );
    }
    async function handleProofUpload(file: File) {
        if (!selected) return false;
        const examId = selected.id;
        setUploadFeedback(null);
        try {
            let url =
                uploaded.current?.examId === examId &&
                uploaded.current.file === file
                    ? uploaded.current.url
                    : null;
            if (!url) {
                const upload = await requestExamProofUpload(
                    examId,
                    file.type,
                    locale
                );
                if (!upload.success) {
                    setUploadFeedback({
                        examId,
                        message: upload.message,
                        requiresLogin: upload.requiresLogin,
                    });
                    return false;
                }
                url = await uploadGrantedImage(file, upload, "private");
                uploaded.current = { examId, file, url };
            }
            const result = await submitExamProof(
                createExamProofSubmissionFormData(
                    { examId, proofImageUrl: url },
                    locale
                )
            );
            setUploadFeedback({
                examId,
                message: result.message,
                requiresLogin: result.requiresLogin,
            });
            if (result.success) {
                uploaded.current = null;
                router.refresh();
            }
            return result.success;
        } catch {
            setUploadFeedback({
                examId,
                message: t("exams.proof.uploadError"),
            });
            return false;
        }
    }

    return (
        <div className="nl-exams">
            <header className="nl-exams__identity">
                <h1 className="nl-page-title">{t("exams.title")}</h1>
                <p className="nl-body-secondary nl-muted">
                    {t("exams.description")}
                </p>
            </header>
            <ExamNavigation
                mode={mode}
                exams={modeExams}
                selected={selected}
                onModeChange={changeMode}
                onSelect={selectExam}
                getLabel={examLabel}
                getState={examState}
            />
            <div className="nl-exams__content">
                {selected ? (
                    <>
                        <section
                            className="nl-exam-head"
                            aria-labelledby="exam-title"
                        >
                            <div className="nl-exam-head__title">
                                <h2
                                    className="nl-section-title"
                                    id="exam-title"
                                >
                                    {examTitle(selected)}
                                </h2>
                                {getExamStatus(selected, isAuthenticated) ? (
                                    <span className="nl-tag">
                                        {examState(selected, true)}
                                    </span>
                                ) : null}
                            </div>
                            {/* 급 머리 H2(2026-09-22) — 상태는 제목 옆 태그, 사실은 수치 띠 세 칸 */}
                            <StatStrip
                                items={[
                                    {
                                        key: "required",
                                        label:
                                            selected.playerGrade !== null &&
                                            isAuthenticated &&
                                            selected.mode !== "event"
                                                ? t("exams.requiredGradeMine", {
                                                      value: selected.playerGrade.toLocaleString(
                                                          locale
                                                      ),
                                                  })
                                                : t("exams.requiredGrade"),
                                        value: selected.requiredGrade
                                            ? selected.requiredGrade.toLocaleString(
                                                  locale
                                              )
                                            : t("exams.none"),
                                    },
                                    {
                                        key: "fee",
                                        label: t("exams.fee"),
                                        value: `${selected.feeNos.toLocaleString(locale)} nos`,
                                    },
                                    {
                                        key: "reward",
                                        label: t("exams.reward"),
                                        value: selected.rewards.length
                                            ? selected.rewards
                                                  .map((reward) =>
                                                      (reward.type ===
                                                          "title" ||
                                                          reward.type ===
                                                              "grade") &&
                                                      selected.grade !== null
                                                          ? examTitle(selected)
                                                          : reward.label
                                                  )
                                                  .join(" · ")
                                            : t("exams.none"),
                                    },
                                ]}
                            />
                        </section>
                        {selected.scoringType === "recital_point" ? (
                            <p className="nl-body-secondary nl-muted">
                                {t("exams.recital.explanation")}
                            </p>
                        ) : null}
                        <ExamStages
                            exam={selected}
                            personal={
                                isAuthenticated &&
                                selected.scoringType === "score" &&
                                selected.mode !== "recital"
                            }
                        />
                        <div className="nl-exams__personal">
                            {isAuthenticated &&
                            selected.scoringType === "score" &&
                            selected.mode !== "recital" ? (
                                <ExamPractice
                                    key={`practice-${selected.id}`}
                                    exam={selected}
                                />
                            ) : null}
                            {selected.mode !== "event" ? (
                                <ExamProofUpload
                                    key={`proof-${selected.id}`}
                                    exam={selected}
                                    isAuthenticated={isAuthenticated}
                                    disabled={
                                        !canEnterExam(selected) ||
                                        selected.playerGrade === null ||
                                        !selected.hasSyncedIdentity
                                    }
                                    message={
                                        uploadFeedback?.examId === selected.id
                                            ? uploadFeedback.message
                                            : null
                                    }
                                    onUpload={handleProofUpload}
                                    requiresLogin={
                                        uploadFeedback?.examId ===
                                            selected.id &&
                                        uploadFeedback.requiresLogin
                                    }
                                    onClearMessage={() =>
                                        setUploadFeedback(null)
                                    }
                                />
                            ) : null}
                        </div>
                    </>
                ) : (
                    <p className="nl-body-secondary" role="status">
                        {t("exams.empty")}
                    </p>
                )}
            </div>
        </div>
    );
}
