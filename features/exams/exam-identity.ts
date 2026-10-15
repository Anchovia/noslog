import type { createTranslator } from "@/lib/i18n/messages";

// Stable seeded identities use catalog copy; other published exams keep their data title.
export function getExamIdentity(
    exam: {
        mode: string;
        grade: number | null;
        slug: string;
        shortLabel: string;
        title: string;
    },
    t: ReturnType<typeof createTranslator>
) {
    if (
        exam.grade !== null &&
        (exam.mode === "basic" || exam.mode === "recital")
    ) {
        return {
            label: t("rankings.examGrade", { exam: exam.grade }),
            title: t("rankings.examBadge", {
                mode: exam.mode === "basic" ? "Basic" : "Recital",
                exam: exam.grade,
            }),
        };
    }
    const kac = /^event-(7th|8th|9th|10th)-kac$/.exec(exam.slug);
    if (kac)
        return {
            label: `${kac[1]} KAC`,
            title: t("exams.event.kac", { edition: kac[1] }),
        };
    const virtuosity = /^event-virtuosity-(2024-)?(basic|recital)$/.exec(
        exam.slug
    );
    if (virtuosity) {
        const parameters = {
            year: virtuosity[1] ? "2024 " : "",
            mode: virtuosity[2].toUpperCase(),
        };
        return {
            label: t("exams.event.virtuosityShort", parameters),
            title: t("exams.event.virtuosity", parameters),
        };
    }
    return { label: exam.shortLabel, title: exam.title };
}
