"use client";

import { Check, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { reviewChartFieldProposals } from "@/app/admin/contributions/actions";
import {
    PROPOSAL_REJECT_REASON_MAX,
    formatProposalValue,
    type ChartFieldProposalField,
} from "@/features/contributions/schemas/chartFieldProposalSchema";
import type { AdminChartFieldProposal } from "@/features/contributions/server/chartFieldProposalService";

const FIELD_LABELS: Record<ChartFieldProposalField, string> = {
    bpm: "BPM",
    note_count: "노트 수",
    duration: "길이",
    released_at: "수록일",
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
    const [isPending, startTransition] = useTransition();

    function toggle(id: number) {
        setSelected((current) => {
            const next = new Set(current);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function review(decision: "apply" | "reject") {
        const ids = [...selected];
        if (!ids.length) return;
        startTransition(async () => {
            try {
                const result = await reviewChartFieldProposals(
                    decision === "apply"
                        ? { decision, ids }
                        : { decision, ids, reason }
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }
                toast.success(result.message);
                setSelected(new Set());
                setRejecting(false);
                setReason("");
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
                <div className="bg-surface rounded-card flex flex-col gap-3 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="text-caption flex items-center gap-2">
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
                                className="border-border text-text-secondary hover:bg-surface-muted flex h-10 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X className="size-4" aria-hidden />
                                반려
                            </button>
                            <button
                                type="button"
                                disabled={isPending || !selected.size}
                                onClick={() => review("apply")}
                                className="bg-text-primary text-bg flex h-10 cursor-pointer items-center gap-2 rounded-md px-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Check className="size-4" aria-hidden />
                                {isPending
                                    ? "처리 중"
                                    : `선택 ${selected.size}건 반영`}
                            </button>
                        </div>
                    </div>
                    {rejecting ? (
                        <div className="flex flex-wrap gap-2">
                            <input
                                value={reason}
                                maxLength={PROPOSAL_REJECT_REASON_MAX}
                                onChange={(event) =>
                                    setReason(event.target.value)
                                }
                                placeholder="반려 사유(제안한 사람에게 보입니다)"
                                aria-label="반려 사유"
                                className="border-border bg-bg h-10 min-w-0 flex-1 rounded-md border px-3 text-sm"
                            />
                            <button
                                type="button"
                                disabled={isPending || !reason.trim()}
                                onClick={() => review("reject")}
                                className="border-border text-text-primary h-10 cursor-pointer rounded-md border px-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {`선택 ${selected.size}건 반려`}
                            </button>
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
                        className="bg-surface rounded-card flex items-start gap-3 p-4"
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
                                    className="text-section min-w-0 truncate hover:underline"
                                >
                                    {item.chart.title} · {item.chart.difficulty}{" "}
                                    {item.chart.level} ·{" "}
                                    {FIELD_LABELS[item.field]}
                                </Link>
                                <span className="text-caption shrink-0">
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
                                    <span className="text-danger ml-2 text-xs font-semibold">
                                        제안 뒤 값이 바뀜(제안 당시{" "}
                                        {shown(item.field, item.previousValue)})
                                    </span>
                                ) : null}
                            </p>
                            <p className="text-caption flex flex-wrap items-center gap-x-2 gap-y-1 break-all">
                                <span>
                                    {EVIDENCE_LABELS[item.evidenceKind] ??
                                        item.evidenceKind}
                                </span>
                                {item.evidenceUrl ? (
                                    <a
                                        href={item.evidenceUrl}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="text-text-primary inline-flex items-center gap-1 underline"
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
                        </div>
                    </article>
                );
            })}
        </section>
    );
}
