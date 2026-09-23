import Link from "next/link";

import ChartFieldProposalReview from "@/features/contributions/components/admin/chartFieldProposalReview";
import {
    CHART_FIELD_PROPOSAL_STATUSES,
    type ChartFieldProposalStatus,
} from "@/features/contributions/schemas/chartFieldProposalSchema";
import { listChartFieldProposals } from "@/features/contributions/server/chartFieldProposalService";

function statusLabel(status: ChartFieldProposalStatus) {
    if (status === "pending") return "검토 대기";
    if (status === "applied") return "반영";
    return "반려";
}

function normalizeStatus(value: string | undefined): ChartFieldProposalStatus {
    return (
        CHART_FIELD_PROPOSAL_STATUSES.find((item) => item === value) ??
        "pending"
    );
}

/** 유저 기여 검토 — 채보 정보 제안(BPM · 노트 수 · 길이 · 수록일)을 운영자가 반영하거나 반려한다(2026-09-23) */
export default async function AdminContributionsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const params = await searchParams;
    const status = normalizeStatus(params.status);
    const proposals = await listChartFieldProposals(status);

    return (
        <div className="flex flex-col gap-4 py-5">
            <section>
                <h1 className="text-title">기여</h1>
                <p className="text-caption mt-1">
                    유저가 제안한 채보 정보를 확인하고 반영하거나 반려합니다.
                    반영하면 곡 상세에 바로 보이고 출처가 제안으로 남습니다.
                </p>
            </section>

            <nav className="flex gap-2">
                {CHART_FIELD_PROPOSAL_STATUSES.map((item) => (
                    <Link
                        key={item}
                        href={"/admin/contributions?status=" + item}
                        className={
                            "rounded-md px-3 py-2 text-sm font-semibold transition-colors " +
                            (status === item
                                ? "bg-text-primary text-bg"
                                : "bg-surface text-text-secondary hover:bg-surface-muted")
                        }
                    >
                        {statusLabel(item)}
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
        </div>
    );
}
