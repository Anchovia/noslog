import ChartEvaluationAdminCard from "@/features/music/components/admin/chartEvaluationAdminCard";
import { listAdminChartEvaluations } from "@/features/music/server/chartEvaluationAdminService";

export default async function AdminCommunityPage() {
    const evaluations = await listAdminChartEvaluations();

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">의견 관리</h1>
                <p className="text-caption mt-1">
                    체감 난이도, 패턴 평가와 짧은 의견을 관리합니다.
                </p>
            </section>
            <section className="flex flex-col gap-2">
                {evaluations.map((evaluation) => (
                    <ChartEvaluationAdminCard
                        key={evaluation.id}
                        evaluation={evaluation}
                    />
                ))}
                {evaluations.length === 0 ? (
                    <p className="text-body-muted bg-surface rounded-card py-12 text-center">
                        등록된 평가가 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
