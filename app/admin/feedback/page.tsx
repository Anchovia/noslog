import Link from "next/link";

import FeedbackReportCard from "@/features/feedback/components/admin/feedback-report-card";
import OpinionReportCard from "@/features/feedback/components/admin/opinion-report-card";
import {
    feedbackStatusSchema,
    normalizeFeedbackStatus,
} from "@/features/feedback/schemas/feedback-admin-schema";
import { listFeedbackReports } from "@/features/feedback/server/feedback-admin-service";
import { listOpinionReports } from "@/features/feedback/server/opinion-report-admin-service";

// 피드백 두 탭 + 채보 커뮤니티 의견 · 답글 신고 두 탭(2026-10-17)
const tabs = [
    ...feedbackStatusSchema.options.map((item) => ({
        key: item,
        label: item === "open" ? "접수" : "처리 완료",
    })),
    { key: "reports", label: "의견 신고" },
    { key: "reports-resolved", label: "신고 처리 완료" },
] as const;

export default async function AdminFeedbackPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const params = await searchParams;
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
    const reports = status ? await listFeedbackReports(status) : [];
    const opinionReports = opinionStatus
        ? await listOpinionReports(opinionStatus)
        : [];

    return (
        <div className="flex flex-col gap-nl-16 py-nl-24">
            <section>
                <h1 className="nl-section-title text-nl-content">
                    피드백 관리
                </h1>
                <p className="nl-metadata mt-nl-4 text-nl-subdued">
                    사용자가 제출한 피드백 · 오류 제보와 채보 커뮤니티 신고를
                    확인합니다.
                </p>
            </section>

            <nav className="flex flex-wrap gap-nl-8">
                {tabs.map((item) => (
                    <Link
                        key={item.key}
                        href={`/admin/feedback?status=${item.key}`}
                        className={`nl-emphasis-label rounded-nl-field px-nl-12 py-nl-8 transition-colors duration-nl-state ${active === item.key ? "bg-nl-primary text-nl-on-primary" : "nl-hover-layer bg-nl-surface text-nl-subdued"}`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <section className="flex flex-col gap-nl-12">
                {reports.map((report) => (
                    <FeedbackReportCard key={report.id} report={report} />
                ))}
                {opinionReports.map((report) => (
                    <OpinionReportCard key={report.id} report={report} />
                ))}
                {reports.length === 0 && opinionReports.length === 0 ? (
                    <p className="nl-body-secondary rounded-nl-container bg-nl-surface py-nl-48 text-center text-nl-subdued">
                        {opinionStatus
                            ? "해당하는 신고가 없습니다."
                            : "해당하는 피드백이 없습니다."}
                    </p>
                ) : null}
            </section>
        </div>
    );
}
