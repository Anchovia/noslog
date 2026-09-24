import Link from "next/link";

import type { AdminChartDraft } from "@/features/contributions/server/chartDraftService";

const STATUS_LABELS: Record<string, string> = {
    submitted: "검토 대기",
    changes_requested: "수정 요청",
    published: "공개",
    draft: "작성 중",
};

/**
 * 채보 초안 검토 목록 — 관리자 화면 기존 모양(카드 목록). 누르면 에디터 검토 모드로(2026-09-24 C1).
 * 공개본이 있으면 「공개본 대비 바뀐 노트 수」 로 검토 분량을 가늠한다
 */
export default function ChartDraftReviewList({
    drafts,
}: {
    drafts: AdminChartDraft[];
}) {
    return (
        <section className="flex flex-col gap-3">
            {drafts.map((draft) => {
                const reviewHref = `/admin/music/${encodeURIComponent(draft.chart.musicIndex)}/${draft.chart.difficulty.toLowerCase()}/pattern/review/${draft.id}`;
                const level =
                    draft.user.label?.kind === "level"
                        ? ` · 기여 Lv.${draft.user.label.level}`
                        : draft.user.label?.kind === "operator"
                          ? " · 운영자"
                          : "";
                const at = draft.submittedAt ?? draft.reviewedAt;
                return (
                    <article
                        key={draft.id}
                        className="bg-surface rounded-card flex items-center gap-3 p-4"
                    >
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <Link
                                href={reviewHref}
                                className="text-section min-w-0 truncate hover:underline"
                            >
                                {draft.chart.title} · {draft.chart.difficulty}{" "}
                                {draft.chart.level}
                            </Link>
                            <p className="text-caption">
                                {draft.user.username ?? "이름 없음"}
                                {level} · 노트{" "}
                                {draft.noteCount.toLocaleString("ko-KR")}개
                                {draft.changedNotes === null
                                    ? " · 새 채보"
                                    : ` · 공개본 대비 바뀐 노트 ${draft.changedNotes.toLocaleString("ko-KR")}`}
                                {draft.openComments
                                    ? ` · 남은 댓글 ${draft.openComments}`
                                    : ""}
                                {at ? ` · ${at.toLocaleString("ko-KR")}` : ""}
                            </p>
                        </div>
                        <span className="bg-surface-muted text-caption shrink-0 rounded px-2 py-1">
                            {STATUS_LABELS[draft.status] ?? draft.status}
                        </span>
                        <Link
                            href={reviewHref}
                            className="border-border text-text-primary flex h-10 shrink-0 items-center rounded-md border px-3 text-sm font-bold"
                        >
                            검토
                        </Link>
                    </article>
                );
            })}
        </section>
    );
}
