import Link from "next/link";

import ChartDraftReviewList from "@/features/contributions/components/admin/chartDraftReviewList";
import ChartFieldProposalReview from "@/features/contributions/components/admin/chartFieldProposalReview";
import {
    CHART_FIELD_PROPOSAL_STATUSES,
    type ChartFieldProposalStatus,
} from "@/features/contributions/schemas/chartFieldProposalSchema";
import { listChartDraftsForReview } from "@/features/contributions/server/chartDraftService";
import { listChartFieldProposals } from "@/features/contributions/server/chartFieldProposalService";

const DRAFT_STATUSES = ["submitted", "changes_requested", "published"] as const;
type DraftStatus = (typeof DRAFT_STATUSES)[number];

function fieldStatusLabel(status: ChartFieldProposalStatus) {
    if (status === "pending") return "검토 대기";
    if (status === "applied") return "반영";
    return "반려";
}

function draftStatusLabel(status: DraftStatus) {
    if (status === "submitted") return "검토 대기";
    if (status === "changes_requested") return "수정 요청";
    return "공개";
}

function tabClass(active: boolean) {
    return (
        "rounded-md px-3 py-2 text-sm font-semibold transition-colors " +
        (active
            ? "bg-text-primary text-bg"
            : "bg-surface text-text-secondary hover:bg-surface-muted")
    );
}

/**
 * 유저 기여 검토 — 「곡 정보」 (BPM · 노트 수 · 길이 · 수록일 제안, 2026-09-23)와
 * 「채보」 (유저 채보 초안, 2026-09-24 3단계). 운영자만 반영 · 공개한다
 */
export default async function AdminContributionsPage({
    searchParams,
}: {
    searchParams: Promise<{ kind?: string; status?: string }>;
}) {
    const params = await searchParams;
    const kind = params.kind === "chart" ? "chart" : "field";

    return (
        <div className="flex flex-col gap-4 py-5">
            <section>
                <h1 className="text-title">기여</h1>
                <p className="text-caption mt-1">
                    {kind === "field"
                        ? "유저가 제안한 채보 정보를 확인하고 반영하거나 반려합니다. 반영하면 곡 상세에 바로 보이고 출처가 제안으로 남습니다."
                        : "유저가 만든 채보 초안을 검토합니다. 에디터 검토 모드에서 시각 댓글을 달고 수정을 요청하거나 공개합니다."}
                </p>
            </section>

            <nav className="flex gap-2" aria-label="기여 종류">
                <Link
                    href="/admin/contributions"
                    className={tabClass(kind === "field")}
                >
                    곡 정보
                </Link>
                <Link
                    href="/admin/contributions?kind=chart"
                    className={tabClass(kind === "chart")}
                >
                    채보
                </Link>
            </nav>

            {kind === "field" ? (
                <FieldProposals status={params.status} />
            ) : (
                <ChartDrafts status={params.status} />
            )}
        </div>
    );
}

async function FieldProposals({ status: raw }: { status?: string }) {
    const status =
        CHART_FIELD_PROPOSAL_STATUSES.find((item) => item === raw) ?? "pending";
    const proposals = await listChartFieldProposals(status);
    return (
        <>
            <nav className="flex gap-2" aria-label="처리 상태">
                {CHART_FIELD_PROPOSAL_STATUSES.map((item) => (
                    <Link
                        key={item}
                        href={"/admin/contributions?status=" + item}
                        className={tabClass(status === item)}
                    >
                        {fieldStatusLabel(item)}
                    </Link>
                ))}
            </nav>
            {proposals.length ? (
                <ChartFieldProposalReview
                    proposals={proposals}
                    reviewable={status === "pending"}
                />
            ) : (
                <p className="bg-surface text-body-muted rounded-card py-12 text-center">
                    해당하는 제안이 없습니다.
                </p>
            )}
        </>
    );
}

async function ChartDrafts({ status: raw }: { status?: string }) {
    const status = DRAFT_STATUSES.find((item) => item === raw) ?? "submitted";
    const drafts = await listChartDraftsForReview(status);
    return (
        <>
            <nav className="flex gap-2" aria-label="처리 상태">
                {DRAFT_STATUSES.map((item) => (
                    <Link
                        key={item}
                        href={`/admin/contributions?kind=chart&status=${item}`}
                        className={tabClass(status === item)}
                    >
                        {draftStatusLabel(item)}
                    </Link>
                ))}
            </nav>
            {drafts.length ? (
                <ChartDraftReviewList drafts={drafts} />
            ) : (
                <p className="bg-surface text-body-muted rounded-card py-12 text-center">
                    해당하는 채보 초안이 없습니다.
                </p>
            )}
        </>
    );
}
