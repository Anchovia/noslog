import { notFound } from "next/navigation";

import ExamEditor from "@/features/exams/components/editor/exam-editor";
import { getExamEditorData } from "@/features/exams/server/exam-admin-service";
import { requireAdmin } from "@/lib/admin";

export default async function EditExamPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAdmin();
    const { id } = await params;
    const examId = Number(id);
    if (!Number.isInteger(examId)) notFound();

    const exam = await getExamEditorData(examId);
    if (!exam) notFound();

    return <ExamEditor initialExam={exam} />;
}
