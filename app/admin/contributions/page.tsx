import Link from "next/link";

import {
    AdminCard,
    AdminCardEmpty,
    AdminCardHead,
    AdminCountTabs,
    AdminPager,
} from "@/components/admin/admin-card";
import ChartDraftReviewList from "@/features/contributions/components/admin/chart-draft-review-list";
import ChartFieldProposalReview from "@/features/contributions/components/admin/chart-field-proposal-review";
import {
    CHART_FIELD_PROPOSAL_STATUSES,
    type ChartFieldProposalStatus,
} from "@/features/contributions/schemas/chart-field-proposal-schema";
import {
    countChartDraftsForReview,
    listChartDraftsForReview,
} from "@/features/contributions/server/chart-draft-review-service";
import {
    countChartFieldProposalsByStatus,
    getChartFieldQueueStatus,
    listChartFieldProposals,
} from "@/features/contributions/server/chart-field-proposal-service";
import { requireAdmin } from "@/lib/admin";
import {
    ADMIN_PAGE_SIZE,
    adminPageArgs,
    adminPageHref,
    parseAdminPage,
} from "@/lib/admin/page";

const DRAFT_STATUSES = ["pending", "changes_requested", "approved"] as const;
type DraftStatus = (typeof DRAFT_STATUSES)[number];

function fieldStatusLabel(status: ChartFieldProposalStatus) {
    if (status === "pending") return "검토 대기";
    if (status === "approved") return "반영";
    return "반려";
}

function draftStatusLabel(status: DraftStatus) {
    if (status === "pending") return "검토 대기";
    if (status === "changes_requested") return "수정 요청";
    return "공개";
}

function tabClass(active: boolean) {
    return (
        "rounded-nl-control px-nl-12 py-nl-8 nl-emphasis-label  transition-colors duration-nl-state " +
        (active
            ? "bg-nl-primary text-nl-on-primary"
            : "bg-nl-surface text-nl-subdued nl-hover-layer")
    );
}

/**
 * 유저 기여 검토 — 「곡 정보」 (BPM · 노트 수 · 길이 · 수록일 제안, 2026-09-23)와
 * 「채보」 (유저 채보 초안, 2026-09-24 3단계). 운영자만 반영 · 공개한다
 */
export default async function AdminContributionsPage({
    searchParams,
}: {
    searchParams: Promise<{ kind?: string; status?: string; page?: string }>;
}) {
    await requireAdmin();
    const params = await searchParams;
    const kind = params.kind === "chart" ? "chart" : "field";
    const page = parseAdminPage(params.page);
    const hrefFor = (next: number) =>
        adminPageHref(
            "/admin/contributions",
            { kind: params.kind, status: params.status },
            next
        );

    return (
        <div className="nl-admin-stack">
            <nav className="flex gap-nl-8" aria-label="기여 종류">
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
                <FieldProposals
                    status={params.status}
                    page={page}
                    hrefFor={hrefFor}
                />
            ) : (
                <ChartDrafts
                    status={params.status}
                    page={page}
                    hrefFor={hrefFor}
                />
            )}
        </div>
    );
}

async function FieldProposals({
    status: raw,
    page,
    hrefFor,
}: {
    status?: string;
    page: number;
    hrefFor: (page: number) => string;
}) {
    const status =
        CHART_FIELD_PROPOSAL_STATUSES.find((item) => item === raw) ?? "pending";
    const [proposals, counts, queue] = await Promise.all([
        listChartFieldProposals(status, adminPageArgs(page)),
        countChartFieldProposalsByStatus(),
        getChartFieldQueueStatus(),
    ]);
    return (
        <>
            <AdminCountTabs
                label="처리 상태"
                options={CHART_FIELD_PROPOSAL_STATUSES.map((item) => ({
                    key: item,
                    label: fieldStatusLabel(item),
                    count: counts[item],
                    href: "/admin/contributions?status=" + item,
                    selected: status === item,
                }))}
            />
            <AdminCard>
                <AdminCardHead
                    title="기여"
                    actions={
                        // 대기 현황(2026-10-01 G1) — 기여자 쪽 제안 창과 같은 숫자를 운영자도 본다. 대기 건수는 탭에 있다
                        queue.pending ? (
                            <p className="nl-metadata text-nl-subdued">
                                {queue.oldestDays
                                    ? `가장 오래 기다린 제안 ${queue.oldestDays.toLocaleString("ko-KR")}일`
                                    : "모두 오늘 들어왔습니다"}
                            </p>
                        ) : null
                    }
                />
                {proposals.length ? (
                    <>
                        <ChartFieldProposalReview
                            proposals={proposals}
                            reviewable={status === "pending"}
                        />
                        <AdminPager
                            page={page}
                            pageSize={ADMIN_PAGE_SIZE}
                            total={counts[status]}
                            unit="건"
                            hrefFor={hrefFor}
                        />
                    </>
                ) : (
                    <AdminCardEmpty>해당하는 제안이 없습니다.</AdminCardEmpty>
                )}
            </AdminCard>
        </>
    );
}

async function ChartDrafts({
    status: raw,
    page,
    hrefFor,
}: {
    status?: string;
    page: number;
    hrefFor: (page: number) => string;
}) {
    const status = DRAFT_STATUSES.find((item) => item === raw) ?? "pending";
    const [drafts, counts] = await Promise.all([
        listChartDraftsForReview(status, adminPageArgs(page)),
        countChartDraftsForReview(),
    ]);
    return (
        <>
            <AdminCountTabs
                label="처리 상태"
                options={DRAFT_STATUSES.map((item) => ({
                    key: item,
                    label: draftStatusLabel(item),
                    count: counts[item],
                    href: `/admin/contributions?kind=chart&status=${item}`,
                    selected: status === item,
                }))}
            />
            <AdminCard>
                <AdminCardHead title="기여" />
                {drafts.length ? (
                    <>
                        <ChartDraftReviewList drafts={drafts} />
                        <AdminPager
                            page={page}
                            pageSize={ADMIN_PAGE_SIZE}
                            total={counts[status]}
                            unit="건"
                            hrefFor={hrefFor}
                        />
                    </>
                ) : (
                    <AdminCardEmpty>
                        해당하는 채보 초안이 없습니다.
                    </AdminCardEmpty>
                )}
            </AdminCard>
        </>
    );
}
