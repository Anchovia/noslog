import Link from "next/link";

import FeedbackReportCard from "@/features/feedback/components/admin/feedbackReportCard";
import {
    feedbackStatusSchema,
    normalizeFeedbackStatus,
} from "@/features/feedback/schemas/feedbackAdminSchema";
import { listFeedbackReports } from "@/features/feedback/server/feedbackAdminService";

const statuses = feedbackStatusSchema.options;

export default async function AdminFeedbackPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const params = await searchParams;
    const status = normalizeFeedbackStatus(params.status);
    const reports = await listFeedbackReports(status);

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">피드백 관리</h1>
                <p className="text-caption mt-1">
                    사용자가 제출한 피드백과 오류 제보를 확인합니다.
                </p>
            </section>

            <nav className="flex gap-2">
                {statuses.map((item) => (
                    <Link
                        key={item}
                        href={`/admin/feedback?status=${item}`}
                        className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${status === item ? "bg-text-primary text-bg" : "bg-surface text-text-secondary hover:bg-surface-muted"}`}
                    >
                        {item === "open" ? "접수" : "처리 완료"}
                    </Link>
                ))}
            </nav>

            <section className="flex flex-col gap-3">
                {reports.map((report) => (
                    <FeedbackReportCard key={report.id} report={report} />
                ))}
                {reports.length === 0 ? (
                    <p className="bg-surface text-body-muted rounded-card py-12 text-center">
                        해당하는 피드백이 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
