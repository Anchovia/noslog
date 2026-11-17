"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { reviewChartFieldProposals } from "@/app/admin/contributions/actions";
import {
    AdminCardTools,
    AdminReadRow,
    AdminReadRows,
    AdminTable,
} from "@/components/admin/admin-card";
import AdminDrawer from "@/components/admin/admin-drawer";
import ActionMenu from "@/components/ui/action-menu";
import Button, { foundationButtonClass } from "@/components/ui/button";
import {
    type ChartFieldProposalField,
    formatProposalValue,
    PROPOSAL_REJECT_REASON_MAX,
    PROPOSAL_REJECT_REASONS,
    type ProposalRejectReason,
} from "@/features/contributions/schemas/chart-field-proposal-schema";
import type { AdminChartFieldProposal } from "@/features/contributions/server/chart-field-proposal-service";
import useActionToast from "@/lib/hooks/use-action-toast";

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
 * 기여 검토 표 — 여러 건 골라 한 번에 반영 · 반려(사유 필수), 줄마다 ⋯ 메뉴로 반영 · 고쳐서 반영 · 반려.
 * 제안 뒤 값이 바뀌었으면 경고를 보인다.
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
    const { isPending, run } = useActionToast();

    function toggle(id: number) {
        setSelected((current) => {
            const next = new Set(current);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    const applySelected = useRef(() => {});
    function review(decision: "apply" | "reject") {
        const ids = [...selected];
        if (!ids.length) return;
        run(
            () =>
                reviewChartFieldProposals(
                    decision === "apply"
                        ? {
                              decision,
                              versions: proposals
                                  .filter((row) => ids.includes(row.id))
                                  .map(({ id, updatedAt }) => ({
                                      id,
                                      updatedAt,
                                  })),
                          }
                        : { decision, ids, reasonCode, reason }
                ),
            {
                errorMessage: "제안을 처리하지 못했습니다.",
                onSuccess: () => {
                    setSelected(new Set());
                    setRejecting(false);
                    setReason("");
                    router.refresh();
                },
            }
        );
    }

    useEffect(() => {
        applySelected.current = () => review("apply");
    });

    const allSelected =
        proposals.length > 0 && selected.size === proposals.length;

    // 막대가 떠 있는 동안 R 은 반려 사유 펼침, A 는 반영(판 8 Medusa CommandBar). 글을 쓰는 칸에서는 받지 않는다
    useEffect(() => {
        if (!reviewable || !selected.size || isPending) return;
        function onKeyDown(event: KeyboardEvent) {
            if (event.metaKey || event.ctrlKey || event.altKey) return;
            const target = event.target as HTMLElement | null;
            if (target?.closest("input, textarea, select, [contenteditable]"))
                return;
            const key = event.key.toLowerCase();
            if (key === "r") {
                event.preventDefault();
                setRejecting((value) => !value);
            } else if (key === "a") {
                event.preventDefault();
                applySelected.current();
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [reviewable, selected.size, isPending]);

    return (
        <>
            {reviewable && rejecting && selected.size ? (
                <AdminCardTools>
                    <div className="flex w-full flex-col gap-nl-8">
                        {/* 정해 둔 사유(2026-10-01 D2) — 고른 사유가 기여자 화면에 그대로 보인다 */}
                        <div className="flex flex-col gap-nl-4">
                            {PROPOSAL_REJECT_REASONS.map((code) => (
                                <label
                                    key={code}
                                    className="nl-body-secondary flex items-center gap-nl-8"
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
                        <div className="flex flex-wrap gap-nl-8">
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
                                className="nl-input min-w-0 flex-1"
                            />
                            <button
                                type="button"
                                disabled={
                                    isPending ||
                                    (reasonCode === "other" && !reason.trim())
                                }
                                onClick={() => review("reject")}
                                className={foundationButtonClass({
                                    variant: "danger",
                                })}
                            >
                                {`선택 ${selected.size}건 반려`}
                            </button>
                        </div>
                    </div>
                </AdminCardTools>
            ) : null}
            {reviewable && selected.size ? (
                <div
                    role="toolbar"
                    aria-label="선택한 제안"
                    className="nl-admin-command-bar nl-control"
                >
                    <span className="nl-admin-command-bar__count">
                        {selected.size}건 선택
                    </span>
                    <button
                        type="button"
                        disabled={isPending}
                        aria-keyshortcuts="R"
                        onClick={() => setRejecting((value) => !value)}
                        className="nl-admin-command-bar__action nl-focus-inset"
                    >
                        반려
                        <kbd className="nl-admin-command-bar__key">R</kbd>
                    </button>
                    <button
                        type="button"
                        disabled={isPending}
                        aria-keyshortcuts="A"
                        onClick={() => review("apply")}
                        className="nl-admin-command-bar__action nl-focus-inset"
                    >
                        {isPending ? "처리 중" : "반영"}
                        <kbd className="nl-admin-command-bar__key">A</kbd>
                    </button>
                </div>
            ) : null}
            <AdminTable>
                <thead>
                    <tr>
                        {reviewable ? (
                            <th>
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    aria-label="전체 선택"
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
                            </th>
                        ) : null}
                        <th>채보</th>
                        <th>항목</th>
                        <th>값</th>
                        <th>근거</th>
                        <th>제안한 사람</th>
                        <th>제안한 날</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {proposals.map((item) => (
                        <ProposalRow
                            key={item.id}
                            item={item}
                            reviewable={reviewable}
                            checked={selected.has(item.id)}
                            onToggle={() => toggle(item.id)}
                        />
                    ))}
                </tbody>
            </AdminTable>
        </>
    );
}

function ProposalRow({
    item,
    reviewable,
    checked,
    onToggle,
}: {
    item: AdminChartFieldProposal;
    reviewable: boolean;
    checked: boolean;
    onToggle: () => void;
}) {
    const router = useRouter();
    const { isPending, run } = useActionToast();
    const [open, setOpen] = useState(false);
    // 서랍 안에서 하는 일 — 읽기 · 고쳐서 반영 · 반려 사유 고르기
    const [mode, setMode] = useState<"view" | "edit" | "reject">("view");
    const [editValue, setEditValue] = useState("");
    const [reason, setReason] = useState("");
    const [reasonCode, setReasonCode] =
        useState<ProposalRejectReason>("evidence");

    // 대기 중이면 지금 값 → 제안 값(그 사이 바뀌었으면 경고), 처리된 건은 제안 당시 값 → 제안 값
    const changed = reviewable && item.currentValue !== item.previousValue;
    const before = reviewable ? item.currentValue : item.previousValue;
    const chartLabel = `${item.chart.title} · ${item.chart.difficulty} ${item.chart.level}`;
    const chartHref = `/music/${encodeURIComponent(item.chart.musicIndex)}/${item.chart.difficulty.toLowerCase()}`;

    function openDrawer(next: "view" | "edit" | "reject") {
        setMode(next);
        if (next === "edit")
            setEditValue(formatProposalValue(item.field, item.value));
        setOpen(true);
    }

    function review(decision: "apply" | "reject", value?: string) {
        run(
            () =>
                reviewChartFieldProposals(
                    decision === "apply"
                        ? {
                              decision,
                              versions: [
                                  { id: item.id, updatedAt: item.updatedAt },
                              ],
                              value,
                          }
                        : { decision, ids: [item.id], reasonCode, reason }
                ),
            {
                errorMessage: "제안을 처리하지 못했습니다.",
                onSuccess: () => {
                    setOpen(false);
                    setMode("view");
                    setReason("");
                    setEditValue("");
                    router.refresh();
                },
            }
        );
    }

    const value = (
        <>
            <span className="text-nl-subdued">{shown(item.field, before)}</span>
            {" → "}
            <strong className="text-nl-content">
                {shown(item.field, item.value)}
            </strong>
            {changed ? (
                <span className="ml-nl-8 text-nl-error">
                    제안 뒤 값이 바뀜(제안 당시{" "}
                    {shown(item.field, item.previousValue)})
                </span>
            ) : null}
        </>
    );

    const footer = !reviewable ? undefined : mode === "edit" ? (
        <>
            <Button variant="secondary" onClick={() => setMode("view")}>
                취소
            </Button>
            <Button
                disabled={isPending || !editValue.trim()}
                onClick={() => review("apply", editValue)}
            >
                이 값으로 반영
            </Button>
        </>
    ) : mode === "reject" ? (
        <>
            <Button variant="secondary" onClick={() => setMode("view")}>
                취소
            </Button>
            <Button
                variant="danger"
                disabled={
                    isPending || (reasonCode === "other" && !reason.trim())
                }
                onClick={() => review("reject")}
            >
                반려
            </Button>
        </>
    ) : (
        <>
            <Button
                variant="danger"
                disabled={isPending}
                onClick={() => setMode("reject")}
            >
                반려
            </Button>
            <Button
                variant="secondary"
                disabled={isPending}
                onClick={() => openDrawer("edit")}
            >
                고쳐서 반영
            </Button>
            <Button disabled={isPending} onClick={() => review("apply")}>
                {isPending ? "처리 중" : "반영"}
            </Button>
        </>
    );

    return (
        <tr>
            {reviewable ? (
                <td>
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={onToggle}
                        aria-label={`${item.chart.title} ${item.chart.difficulty} ${FIELD_LABELS[item.field]} 선택`}
                    />
                </td>
            ) : null}
            <td>
                <Link href={chartHref}>{chartLabel}</Link>
            </td>
            <td>{FIELD_LABELS[item.field]}</td>
            <td>{value}</td>
            <td>{EVIDENCE_LABELS[item.evidenceKind] ?? item.evidenceKind}</td>
            <td>{item.user.username ?? "이름 없음"}</td>
            <td>{item.createdAt.toLocaleString("ko-KR")}</td>
            <td className="nl-admin-table__menu">
                <ActionMenu
                    label="제안 메뉴"
                    disabled={isPending}
                    items={[
                        {
                            label: "자세히 보기",
                            onSelect: () => openDrawer("view"),
                        },
                        ...(reviewable
                            ? [
                                  {
                                      label: "반영",
                                      onSelect: () => review("apply"),
                                  },
                                  {
                                      label: "고쳐서 반영",
                                      onSelect: () => openDrawer("edit"),
                                  },
                                  {
                                      label: "반려",
                                      onSelect: () => openDrawer("reject"),
                                      destructive: true,
                                  },
                              ]
                            : []),
                    ]}
                />
                <AdminDrawer
                    open={open}
                    onOpenChange={setOpen}
                    title="곡 정보 제안"
                    footer={footer}
                >
                    <AdminReadRows>
                        <AdminReadRow label="채보">
                            <Link href={chartHref} className="nl-link">
                                {chartLabel}
                            </Link>
                        </AdminReadRow>
                        <AdminReadRow label="항목">
                            {FIELD_LABELS[item.field]}
                        </AdminReadRow>
                        <AdminReadRow label="값">{value}</AdminReadRow>
                        <AdminReadRow label="근거">
                            {EVIDENCE_LABELS[item.evidenceKind] ??
                                item.evidenceKind}
                        </AdminReadRow>
                        {item.evidenceUrl ? (
                            <AdminReadRow label="근거 주소">
                                <a
                                    href={item.evidenceUrl}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="inline-flex items-center gap-nl-4 break-all text-nl-content underline"
                                >
                                    {item.evidenceUrl}
                                    <ExternalLink
                                        className="nl-icon-small"
                                        aria-hidden
                                    />
                                </a>
                            </AdminReadRow>
                        ) : null}
                        {item.evidenceNote ? (
                            <AdminReadRow label="근거 메모">
                                <span className="text-nl-content">
                                    「{item.evidenceNote}」
                                </span>
                            </AdminReadRow>
                        ) : null}
                        <AdminReadRow label="제안한 사람">
                            {item.user.username ?? "이름 없음"} · 반영{" "}
                            {item.authorApplied} · 반려 {item.authorRejected}
                        </AdminReadRow>
                        {item.rejectReason ? (
                            <AdminReadRow label="반려 사유">
                                {item.rejectReason}
                            </AdminReadRow>
                        ) : null}
                        <AdminReadRow label="제안한 날">
                            {item.createdAt.toLocaleString("ko-KR")}
                        </AdminReadRow>
                    </AdminReadRows>
                    {/* 고쳐서 반영(2026-10-01 C2) — 값이 살짝 틀렸을 때 반려 → 재제출 왕복을 없앤다 */}
                    {reviewable && mode === "edit" ? (
                        <input
                            value={editValue}
                            onChange={(event) =>
                                setEditValue(event.target.value)
                            }
                            aria-label="고쳐서 반영할 값"
                            className="nl-input"
                        />
                    ) : null}
                    {/* 정해 둔 사유(2026-10-01 D2) — 고른 사유가 기여자 화면에 그대로 보인다 */}
                    {reviewable && mode === "reject" ? (
                        <div className="flex flex-col gap-nl-8">
                            <div className="flex flex-col gap-nl-4">
                                {PROPOSAL_REJECT_REASONS.map((code) => (
                                    <label
                                        key={code}
                                        className="nl-body-secondary flex items-center gap-nl-8"
                                    >
                                        <input
                                            type="radio"
                                            name={`reject-reason-${item.id}`}
                                            value={code}
                                            checked={reasonCode === code}
                                            onChange={() => setReasonCode(code)}
                                        />
                                        {REJECT_REASON_LABELS[code]}
                                    </label>
                                ))}
                            </div>
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
                                className="nl-input"
                            />
                        </div>
                    ) : null}
                </AdminDrawer>
            </td>
        </tr>
    );
}
