import Link from "next/link";

import { foundationButtonClass } from "@/components/ui/button";
import type { AdminChartDraft } from "@/features/contributions/server/chart-draft-service";
import { cn } from "@/lib/cn";

const STATUS_LABELS: Record<string, string> = {
    pending: "검토 대기",
    changes_requested: "수정 요청",
    approved: "공개",
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
        <section className="flex flex-col gap-nl-12">
            {drafts.map((draft) => {
                const reviewHref = `/admin/music/${encodeURIComponent(draft.chart.musicIndex)}/${draft.chart.difficulty.toLowerCase()}/pattern/review/${draft.id}`;
                const level =
                    draft.user.label?.kind === "level"
                        ? ` · 기여 Lv.${draft.user.label.level}`
                        : "";
                const at = draft.submittedAt ?? draft.reviewedAt;
                return (
                    <article
                        key={draft.id}
                        className="flex items-center gap-nl-12 rounded-nl-control bg-nl-surface p-nl-16"
                    >
                        <div className="flex min-w-0 flex-1 flex-col gap-nl-4">
                            <Link
                                href={reviewHref}
                                className="nl-component-title min-w-0 truncate text-nl-content hover:underline"
                            >
                                {draft.chart.title} · {draft.chart.difficulty}{" "}
                                {draft.chart.level}
                            </Link>
                            <p className="nl-metadata text-nl-subdued">
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
                        <span className="nl-tag shrink-0">
                            {STATUS_LABELS[draft.status] ?? draft.status}
                        </span>
                        <Link
                            href={reviewHref}
                            className={cn(
                                foundationButtonClass({ variant: "secondary" }),
                                "shrink-0"
                            )}
                        >
                            검토
                        </Link>
                    </article>
                );
            })}
        </section>
    );
}
