import {
    AdminCard,
    AdminCardEmpty,
    AdminCardHead,
    AdminCountTabs,
    AdminPager,
    AdminTable,
} from "@/components/admin/admin-card";
import FeedbackReportRow from "@/features/feedback/components/admin/feedback-report-row";
import OpinionReportRow from "@/features/feedback/components/admin/opinion-report-row";
import { normalizeFeedbackStatus } from "@/features/feedback/schemas/feedback-admin-schema";
import {
    countFeedbackReportsByStatus,
    listFeedbackReports,
} from "@/features/feedback/server/feedback-admin-service";
import {
    countOpinionReportsByStatus,
    listOpinionReports,
} from "@/features/feedback/server/opinion-report-admin-service";
import { requireAdmin } from "@/lib/admin";
import {
    ADMIN_PAGE_SIZE,
    adminPageArgs,
    adminPageHref,
    parseAdminPage,
} from "@/lib/admin/page";

// 피드백 두 탭 + 채보 커뮤니티 의견 · 답글 신고 두 탭(2026-10-17)
export default async function AdminFeedbackPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; page?: string }>;
}) {
    await requireAdmin();
    const params = await searchParams;
    const page = parseAdminPage(params.page);
    const opinionStatus =
        params.status === "reports"
            ? "pending"
            : params.status === "reports-resolved"
              ? "resolved"
              : null;
    const status = opinionStatus
        ? null
        : normalizeFeedbackStatus(params.status);
    const active = status ?? params.status;
    const [feedbackCounts, opinionCounts, reports, opinionReports] =
        await Promise.all([
            countFeedbackReportsByStatus(),
            countOpinionReportsByStatus(),
            status ? listFeedbackReports(status, adminPageArgs(page)) : [],
            opinionStatus
                ? listOpinionReports(opinionStatus, adminPageArgs(page))
                : [],
        ]);
    const tabs = [
        { key: "open", label: "접수", count: feedbackCounts.open },
        { key: "resolved", label: "처리 완료", count: feedbackCounts.resolved },
        { key: "reports", label: "의견 신고", count: opinionCounts.pending },
        {
            key: "reports-resolved",
            label: "신고 처리 완료",
            count: opinionCounts.resolved,
        },
    ];
    const total = tabs.find((item) => item.key === active)?.count ?? 0;
    const hrefFor = (next: number) =>
        adminPageHref("/admin/feedback", { status: params.status }, next);

    return (
        <div className="nl-admin-stack">
            <AdminCountTabs
                label="처리 상태"
                options={tabs.map((item) => ({
                    ...item,
                    href: `/admin/feedback?status=${item.key}`,
                    selected: active === item.key,
                }))}
            />
            <AdminCard>
                <AdminCardHead title="피드백" />
                {status && reports.length ? (
                    <AdminTable>
                        <thead>
                            <tr>
                                <th>내용</th>
                                <th>보낸 사람</th>
                                <th>종류</th>
                                <th>받은 날</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <FeedbackReportRow
                                    key={report.id}
                                    report={report}
                                />
                            ))}
                        </tbody>
                    </AdminTable>
                ) : null}
                {opinionStatus && opinionReports.length ? (
                    <AdminTable>
                        <thead>
                            <tr>
                                <th>신고된 글</th>
                                <th>종류</th>
                                <th>사유</th>
                                <th>작성자</th>
                                <th>신고한 사람</th>
                                <th>받은 날</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {opinionReports.map((report) => (
                                <OpinionReportRow
                                    key={report.id}
                                    report={report}
                                />
                            ))}
                        </tbody>
                    </AdminTable>
                ) : null}
                {reports.length === 0 && opinionReports.length === 0 ? (
                    <AdminCardEmpty>
                        {opinionStatus
                            ? "해당하는 신고가 없습니다."
                            : "해당하는 피드백이 없습니다."}
                    </AdminCardEmpty>
                ) : (
                    <AdminPager
                        page={page}
                        pageSize={ADMIN_PAGE_SIZE}
                        total={total}
                        unit="건"
                        hrefFor={hrefFor}
                    />
                )}
            </AdminCard>
        </div>
    );
}
