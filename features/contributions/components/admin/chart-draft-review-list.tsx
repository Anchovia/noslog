import Link from "next/link";

import { AdminTable } from "@/components/admin/admin-card";
import AdminLinkRow from "@/components/admin/admin-link-row";
import type { AdminChartDraft } from "@/features/contributions/server/chart-draft-review-service";

/**
 * 채보 초안 검토 표 — 채보 이름을 누르면 에디터 검토 모드로(2026-09-24 C1).
 * 공개본이 있으면 「공개본 대비 바뀐 노트 수」 로 검토 분량을 가늠한다
 */
export default function ChartDraftReviewList({
    drafts,
}: {
    drafts: AdminChartDraft[];
}) {
    return (
        <AdminTable>
            <thead>
                <tr>
                    <th>채보</th>
                    <th>기여자</th>
                    <th>노트</th>
                    <th>공개본 대비</th>
                    <th>남은 댓글</th>
                    <th>날짜</th>
                </tr>
            </thead>
            <tbody>
                {drafts.map((draft) => {
                    const reviewHref = `/admin/music/${encodeURIComponent(draft.chart.musicIndex)}/${draft.chart.difficulty.toLowerCase()}/pattern/review/${draft.id}`;
                    const at = draft.submittedAt ?? draft.reviewedAt;
                    return (
                        <AdminLinkRow key={draft.id} href={reviewHref}>
                            <td>
                                <Link href={reviewHref}>
                                    {draft.chart.title} ·{" "}
                                    {draft.chart.difficulty} {draft.chart.level}
                                </Link>
                            </td>
                            <td>
                                {draft.user.username ?? "이름 없음"}
                                {draft.user.label?.kind === "level"
                                    ? ` · 기여 Lv.${draft.user.label.level}`
                                    : ""}
                            </td>
                            <td>{draft.noteCount.toLocaleString("ko-KR")}개</td>
                            <td>
                                {draft.changedNotes === null
                                    ? "새 채보"
                                    : `바뀐 노트 ${draft.changedNotes.toLocaleString("ko-KR")}`}
                            </td>
                            <td>{draft.openComments || ""}</td>
                            <td>{at ? at.toLocaleString("ko-KR") : ""}</td>
                        </AdminLinkRow>
                    );
                })}
            </tbody>
        </AdminTable>
    );
}
