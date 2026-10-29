import ExamEditor from "@/features/exams/components/editor/exam-editor";
import { requireAdmin } from "@/lib/admin";

export default async function NewExamPage() {
    await requireAdmin();
    return <ExamEditor />;
}
