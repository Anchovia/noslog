import ExamPage from "@/features/exams/components/examPage";
import { getCachedPublishedExams } from "@/features/exams/server/examData";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata/site";
import { getExamIdentity } from "@/features/exams/examIdentity";

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
