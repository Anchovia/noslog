"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import {
    requestExamProofUpload,
    submitExamProof,
} from "@/app/(site)/exams/actions";
import type {
    ExamDashboardItem,
    ExamMode,
} from "@/components/exams/dashboard/exam-dashboard-types";
import {
    canEnterExam,
    getDefaultExam,
} from "@/components/exams/dashboard/exam-dashboard-utils";
import { useLocale, useTranslations } from "@/components/i18n/locale-provider";
import ExamBadge, { isExamGrade } from "@/components/ui/exam-badge";
import StatStrip from "@/components/ui/stat-strip";
import ExamNavigation from "@/features/exams/components/exam-navigation";
import ExamPractice from "@/features/exams/components/exam-practice";
import ExamProofUpload from "@/features/exams/components/exam-proof-upload";
import ExamStages from "@/features/exams/components/exam-stages";
import ExamStatus, {
    getExamStatus,
} from "@/features/exams/components/exam-status";
import { getExamIdentity } from "@/features/exams/exam-identity";
import { createExamProofSubmissionFormData } from "@/features/exams/schemas/exam-proof-schema";
import { localizePath } from "@/lib/i18n/routing";
import { uploadGrantedImage } from "@/lib/uploads/client-image-upload";

export type { ExamDashboardItem } from "@/components/exams/dashboard/exam-dashboard-types";

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

    const gradeMet = Boolean(
        selected &&
        isAuthenticated &&
        selected.mode !== "event" &&
        selected.requiredGrade &&
        selected.playerGrade !== null &&
        selected.playerGrade >= selected.requiredGrade
    );
    const rewardIsTitle = Boolean(
        selected &&
        selected.grade !== null &&
        selected.rewards.length > 0 &&
        selected.rewards.every(
            (reward) => reward.type === "title" || reward.type === "grade"
        )
    );

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
                                        label: t("exams.requiredGrade"),
                                        value: selected.requiredGrade
                                            ? selected.requiredGrade.toLocaleString(
                                                  locale
                                              )
                                            : t("exams.none"),
                                        // 넘었으면 합격 체크와 같은 성공색(2026-09-25 R1) — 모자란 양은 머리 태그가 말한다
                                        color: gradeMet
                                            ? "var(--nl-feedback-success-marker)"
                                            : undefined,
                                    },
                                    {
                                        key: "fee",
                                        label: t("exams.fee"),
                                        value: `${selected.feeNos.toLocaleString(locale)} nos`,
                                    },
                                    // 칭호 보상만 띠 칸에 — 곡 해금 같은 긴 보상은 띠 아래 한 줄(칸을 넘치지 않게)
                                    rewardIsTitle && {
                                        key: "reward",
                                        label: t("exams.reward"),
                                        // 칭호 = 랭킹 · 프로필의 검정 명판, 칸이 넉넉해 풀 이름형(2026-09-25 B2)
                                        value:
                                            (selected.mode === "basic" ||
                                                selected.mode === "recital") &&
                                            isExamGrade(selected.grade) ? (
                                                <span data-exam-label="full">
                                                    <ExamBadge
                                                        mode={
                                                            selected.mode ===
                                                            "recital"
                                                                ? "recital"
                                                                : "basic"
                                                        }
                                                        exam={selected.grade}
                                                    />
                                                </span>
                                            ) : (
                                                examTitle(selected)
                                            ),
                                    },
                                ]}
                            />
                            {!rewardIsTitle ? (
                                <p className="nl-body-secondary nl-muted">
                                    {t("exams.reward")} ·{" "}
                                    {selected.rewards.length
                                        ? selected.rewards
                                              .map((reward) => reward.label)
                                              .join(" · ")
                                        : t("exams.none")}
                                </p>
                            ) : null}
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
                            {/* 합격한 급은 인증 구역을 두지 않는다(상태는 머리 태그 「합격」, 2026-09-22 사용자) */}
                            {selected.mode !== "event" &&
                            !selected.isAchieved ? (
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
                    <p className="nl-body-secondary nl-muted" role="status">
                        {t("exams.empty")}
                    </p>
                )}
            </div>
        </div>
    );
}
