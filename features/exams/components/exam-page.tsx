import { notFound } from "next/navigation";

import ExamDashboard from "@/features/exams/components/exam-dashboard";
import { getPublicExamData } from "@/features/exams/server/public-exam-service";

export default async function ExamPage({ slug }: { slug?: string }) {
    const { items, isAuthenticated } = await getPublicExamData();
    if (slug && !items.some((exam) => exam.slug === slug)) notFound();
    return (
        <ExamDashboard
            exams={items}
            isAuthenticated={isAuthenticated}
            initialSlug={slug}
        />
    );
}
