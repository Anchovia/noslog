import ExamPage from "@/features/exams/components/exam-page";
import { getExamIdentity } from "@/features/exams/exam-identity";
import { getCachedPublishedExams } from "@/features/exams/server/exam-data";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
    const [{ slug }, items, { locale, t }] = await Promise.all([
        params,
        getCachedPublishedExams(),
        getServerI18n(),
    ]);
    const exam = items.find((item) => item.slug === slug);
    return createPageMetadata({
        title: exam ? getExamIdentity(exam, t).title : t("exams.title"),
        path: localizePath(`/exams/${slug}`, locale),
    });
}

export default async function ExamDetail({ params }: Props) {
    return <ExamPage slug={(await params).slug} />;
}
