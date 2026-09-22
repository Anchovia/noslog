"use client";

import { Check, Lock } from "lucide-react";
import type { ExamDashboardItem } from "@/components/exams/dashboard/examDashboardTypes";
import { canEnterExam } from "@/components/exams/dashboard/examDashboardUtils";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";

export type ExamStatusKind =
    "passed" | "pending" | "rejected" | "available" | "insufficient" | "sync";

/** 급 상태(2026-09-22 G1-a) — 이벤트 · 로그아웃은 상태 없음 */
export function getExamStatus(
    exam: ExamDashboardItem,
    isAuthenticated: boolean
): ExamStatusKind | null {
    if (exam.mode === "event" || !isAuthenticated) return null;
    if (exam.isAchieved) return "passed";
    if (exam.submissionStatus === "pending") return "pending";
    if (exam.playerGrade === null || !exam.hasSyncedIdentity) return "sync";
    if (!canEnterExam(exam)) return "insufficient";
    if (exam.submissionStatus === "rejected") return "rejected";
    return "available";
}

const DOT_TONE = {
    available: "success",
    pending: "warning",
    rejected: "danger",
} as const;

/**
 * 셀렉트 목록 · 레일 · 급 머리 태그가 같이 쓰는 상태 글자.
 * 합격 = 체크(성공 표시색) · Grd. 부족 = 자물쇠 — 흐린 글자, 응시 가능 · 심사 중 · 반려 = 상태 점 + 기본 글자
 */
export default function ExamStatus({
    exam,
    kind,
    detailed = false,
}: {
    exam: ExamDashboardItem;
    kind: ExamStatusKind;
    /** 급 머리 태그 — Grd. 부족에 모자란 값까지 */
    detailed?: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const label =
        kind === "passed"
            ? t("exams.status.completed")
            : kind === "pending"
              ? t("exams.status.pending")
              : kind === "rejected"
                ? t("exams.status.rejected")
                : kind === "available"
                  ? t("exams.status.available")
                  : kind === "sync"
                    ? t("sync.title")
                    : detailed && exam.playerGrade !== null
                      ? t("exams.status.insufficientBy", {
                            value: Math.ceil(
                                exam.requiredGrade - exam.playerGrade
                            ).toLocaleString(locale),
                        })
                      : t("exams.insufficient");
    return (
        <span className="nl-exam-status nl-metadata" data-kind={kind}>
            {kind === "passed" ? (
                <Check className="nl-icon-small" aria-hidden />
            ) : kind === "insufficient" ? (
                <Lock className="nl-icon-small" aria-hidden />
            ) : kind === "sync" ? null : (
                <span
                    className="nl-exam-status__dot"
                    data-tone={DOT_TONE[kind]}
                />
            )}
            {label}
        </span>
    );
}
