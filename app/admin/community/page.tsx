import ChartEvaluationAdminCard from "@/features/music/components/admin/chart-evaluation-admin-card";
import { listAdminChartEvaluations } from "@/features/music/server/chart-evaluation-admin-service";

export default async function AdminCommunityPage() {
    const evaluations = await listAdminChartEvaluations();

    return (
        <div className="flex flex-col gap-nl-16 py-nl-24">
            <section>
                <h1 className="nl-section-title text-nl-content">의견 관리</h1>
                <p className="nl-metadata mt-nl-4 text-nl-subdued">
                    체감 난이도, 패턴 평가와 짧은 의견을 관리합니다.
                </p>
            </section>
            <section className="flex flex-col gap-nl-8">
                {evaluations.map((evaluation) => (
                    <ChartEvaluationAdminCard
                        key={evaluation.id}
                        evaluation={evaluation}
                    />
                ))}
                {evaluations.length === 0 ? (
                    <p className="nl-body-secondary rounded-nl-container bg-nl-surface py-nl-48 text-center text-nl-subdued">
                        등록된 평가가 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
