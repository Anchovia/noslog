import ExamPage from "@/features/exams/components/examPage";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata/site";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();
    return createPageMetadata({
        title: t("exams.title"),
        path: localizePath("/exams", locale),
    });
}

export default function ExamsPage() {
    return <ExamPage />;
}
