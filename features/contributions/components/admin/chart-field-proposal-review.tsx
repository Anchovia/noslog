"use client";

import { Check, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { reviewChartFieldProposals } from "@/app/admin/contributions/actions";
import {
    type ChartFieldProposalField,
    formatProposalValue,
    PROPOSAL_REJECT_REASON_MAX,
    PROPOSAL_REJECT_REASONS,
    type ProposalRejectReason,
} from "@/features/contributions/schemas/chart-field-proposal-schema";
import type { AdminChartFieldProposal } from "@/features/contributions/server/chart-field-proposal-service";

const FIELD_LABELS: Record<ChartFieldProposalField, string> = {
    bpm: "BPM",
    note_count: "노트 수",
    duration: "길이",
    released_at: "수록일",
};
/** 정해 둔 반려 사유(2026-10-01 D2) — 고르면 기여자 화면에 그대로 보인다 */
const REJECT_REASON_LABELS: Record<ProposalRejectReason, string> = {
    evidence: "근거가 값을 뒷받침하지 않음",
    url: "주소를 열 수 없음 · 영상이 아님",
    duplicate: "이미 다른 제안이 반영됨",
    format: "값 형식이 규칙과 다름",
    other: "그 밖(덧붙일 말 필요)",
};
const EVIDENCE_LABELS: Record<string, string> = {
    video: "영상",
    official: "공식",
    direct: "직접 확인",
};

function shown(field: ChartFieldProposalField, value: string | null) {
    return value === null ? "—" : formatProposalValue(field, value);
}

/**
 * 기여 검토 목록 — 관리자 화면 기존 모양(악곡 업데이트와 같은 카드 목록).
 * 여러 건 골라 한 번에 반영 · 반려(사유 필수). 제안 뒤 값이 바뀌었으면 경고를 보인다.
 */
export default function ChartFieldProposalReview({
    proposals,
    reviewable,
}: {
    proposals: AdminChartFieldProposal[];
    reviewable: boolean;
}) {
    const router = useRouter();
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [rejecting, setRejecting] = useState(false);
    const [reason, setReason] = useState("");
    const [reasonCode, setReasonCode] =
        useState<ProposalRejectReason>("evidence");
    // 고쳐서 반영 — 지금 고치고 있는 제안과 그 값
    const [editing, setEditing] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");
    const [isPending, startTransition] = useTransition();

    function toggle(id: number) {
        setSelected((current) => {
            const next = new Set(current);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function review(
        decision: "apply" | "reject",
        only?: number,
        value?: string
    ) {
        const ids = only === undefined ? [...selected] : [only];
        if (!ids.length) return;
        startTransition(async () => {
            try {
                const result = await reviewChartFieldProposals(
                    decision === "apply"
                        ? { decision, ids, value }
                        : { decision, ids, reasonCode, reason }
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }
                toast.success(result.message);
                setSelected(new Set());
                setRejecting(false);
                setReason("");
                setEditing(null);
                setEditValue("");
                router.refresh();
            } catch {
                toast.error("제안을 처리하지 못했습니다.");
            }
        });
    }

    const allSelected =
        proposals.length > 0 && selected.size === proposals.length;

    return (
        <section className="flex flex-col gap-3">
            {reviewable ? (
                <div className="flex flex-col gap-3 rounded-card bg-surface p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="flex items-center gap-2 text-caption">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={() =>
                                    setSelected(
                                        allSelected
                                            ? new Set()
                                            : new Set(
                                                  proposals.map(
                                                      (item) => item.id
                                                  )
                                              )
                                    )
                                }
                            />
                            전체 선택 · {selected.size}건 선택
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={isPending || !selected.size}
                                onClick={() => setRejecting((value) => !value)}
                                className="flex h-10 cursor-pointer items-center gap-2 rounded-md bg-danger-surface px-3 text-sm font-bold text-on-danger disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X className="size-4" aria-hidden />
                                반려
                            </button>
                            <button
                                type="button"
                                disabled={isPending || !selected.size}
                                onClick={() => review("apply")}
                                className="flex h-10 cursor-pointer items-center gap-2 rounded-md bg-text-primary px-3 text-sm font-bold text-bg disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Check className="size-4" aria-hidden />
                                {isPending
                                    ? "처리 중"
                                    : `선택 ${selected.size}건 반영`}
                            </button>
                        </div>
                    </div>
                    {rejecting ? (
                        <div className="flex flex-col gap-2">
                            {/* 정해 둔 사유(2026-10-01 D2) — 고른 사유가 기여자 화면에 그대로 보인다 */}
                            <div className="flex flex-col gap-1">
                                {PROPOSAL_REJECT_REASONS.map((code) => (
                                    <label
                                        key={code}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <input
                                            type="radio"
                                            name="reject-reason"
                                            value={code}
                                            checked={reasonCode === code}
                                            onChange={() => setReasonCode(code)}
                                        />
                                        {REJECT_REASON_LABELS[code]}
                                    </label>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <input
                                    value={reason}
                                    maxLength={PROPOSAL_REJECT_REASON_MAX}
                                    onChange={(event) =>
                                        setReason(event.target.value)
                                    }
                                    placeholder={
                                        reasonCode === "other"
                                            ? "반려 사유(제안한 사람에게 보입니다)"
                                            : "덧붙일 말(선택)"
                                    }
                                    aria-label="덧붙일 말"
                                    className="h-10 min-w-0 flex-1 rounded-md border border-border bg-bg px-3 text-sm"
                                />
                                <button
                                    type="button"
                                    disabled={
                                        isPending ||
                                        (reasonCode === "other" &&
                                            !reason.trim())
                                    }
                                    onClick={() => review("reject")}
                                    className="h-10 cursor-pointer rounded-md bg-danger-surface px-3 text-sm font-bold text-on-danger disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {`선택 ${selected.size}건 반려`}
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}

            {proposals.map((item) => {
                // 대기 중이면 지금 값 → 제안 값(그 사이 바뀌었으면 경고), 처리된 건은 제안 당시 값 → 제안 값
                const changed =
                    reviewable && item.currentValue !== item.previousValue;
                const before = reviewable
                    ? item.currentValue
                    : item.previousValue;
                return (
                    <article
                        key={item.id}
                        className="flex items-start gap-3 rounded-card bg-surface p-4"
                    >
                        {reviewable ? (
                            <input
                                type="checkbox"
                                className="mt-1 shrink-0"
                                checked={selected.has(item.id)}
                                onChange={() => toggle(item.id)}
                                aria-label={`${item.chart.title} ${item.chart.difficulty} ${FIELD_LABELS[item.field]} 선택`}
                            />
                        ) : null}
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <div className="flex items-start justify-between gap-3">
                                <Link
                                    href={`/music/${encodeURIComponent(item.chart.musicIndex)}/${item.chart.difficulty.toLowerCase()}`}
                                    className="min-w-0 truncate text-section hover:underline"
                                >
                                    {item.chart.title} · {item.chart.difficulty}{" "}
                                    {item.chart.level} ·{" "}
                                    {FIELD_LABELS[item.field]}
                                </Link>
                                <span className="shrink-0 text-caption">
                                    {item.createdAt.toLocaleString("ko-KR")}
                                </span>
                            </div>
                            <p className="text-sm tabular-nums">
                                <span className="text-text-secondary">
                                    {shown(item.field, before)}
                                </span>
                                {" → "}
                                <strong>{shown(item.field, item.value)}</strong>
                                {changed ? (
                                    <span className="ml-2 text-xs font-semibold text-danger">
                                        제안 뒤 값이 바뀜(제안 당시{" "}
                                        {shown(item.field, item.previousValue)})
                                    </span>
                                ) : null}
                            </p>
                            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption break-all">
                                <span>
                                    {EVIDENCE_LABELS[item.evidenceKind] ??
                                        item.evidenceKind}
                                </span>
                                {item.evidenceUrl ? (
                                    <a
                                        href={item.evidenceUrl}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="inline-flex items-center gap-1 text-text-primary underline"
                                    >
                                        {item.evidenceUrl}
                                        <ExternalLink
                                            className="size-3"
                                            aria-hidden
                                        />
                                    </a>
                                ) : null}
                                {item.evidenceNote ? (
                                    <span className="text-text-primary">
                                        「{item.evidenceNote}」
                                    </span>
                                ) : null}
                            </p>
                            <p className="text-caption">
                                {item.user.username ?? "이름 없음"} · 반영{" "}
                                {item.authorApplied} · 반려{" "}
                                {item.authorRejected}
                                {item.rejectReason
                                    ? ` · 반려 사유: ${item.rejectReason}`
                                    : ""}
                            </p>
                            {/* 고쳐서 반영(2026-10-01 C2) — 값이 살짝 틀렸을 때 반려 → 재제출 왕복을 없앤다 */}
                            {reviewable && editing === item.id ? (
                                <div className="flex flex-wrap gap-2">
                                    <input
                                        value={editValue}
                                        onChange={(event) =>
                                            setEditValue(event.target.value)
                                        }
                                        aria-label="고쳐서 반영할 값"
                                        className="h-10 min-w-0 flex-1 rounded-md border border-border bg-bg px-3 text-sm"
                                    />
                                    <button
                                        type="button"
                                        disabled={
                                            isPending || !editValue.trim()
                                        }
                                        onClick={() =>
                                            review("apply", item.id, editValue)
                                        }
                                        className="h-10 cursor-pointer rounded-md bg-text-primary px-3 text-sm font-bold text-bg disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        이 값으로 반영
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditing(null)}
                                        className="h-10 cursor-pointer rounded-md border border-border px-3 text-sm font-bold text-text-secondary"
                                    >
                                        취소
                                    </button>
                                </div>
                            ) : null}
                            {/* 건별 처리(2026-10-01 C2) — 한 건만 볼 때 고르기 → 위쪽 버튼 두 단계를 없앤다 */}
                            {reviewable ? (
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={() => review("apply", item.id)}
                                        className="flex h-10 cursor-pointer items-center gap-2 rounded-md bg-text-primary px-3 text-sm font-bold text-bg disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Check className="size-4" aria-hidden />
                                        반영
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={() => {
                                            setEditing(item.id);
                                            setEditValue(
                                                formatProposalValue(
                                                    item.field,
                                                    item.value
                                                )
                                            );
                                        }}
                                        className="h-10 cursor-pointer rounded-md border border-border px-3 text-sm font-bold text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        고쳐서 반영
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={() => {
                                            setSelected(new Set([item.id]));
                                            setRejecting(true);
                                        }}
                                        className="flex h-10 cursor-pointer items-center gap-2 rounded-md bg-danger-surface px-3 text-sm font-bold text-on-danger disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <X className="size-4" aria-hidden />
                                        반려
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </article>
                );
            })}
        </section>
    );
}
