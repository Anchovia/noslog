import { Wrench } from "lucide-react";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";
import { localizePath } from "@/lib/i18n/routing";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();
    return createPageMetadata({
        title: t("maintenance.title"),
        path: localizePath("/maintenance", locale),
        noIndex: true,
    });
}

export default async function MaintenancePage() {
    const { t } = await getServerI18n();
    return (
        <main className="bg-bg text-text-primary flex min-h-dvh items-center justify-center px-6 text-center">
            <section className="flex w-full max-w-97.5 flex-col items-center">
                <span className="border-text-primary flex size-15 items-center justify-center rounded-full border-2 text-2xl font-extrabold">
                    N
                </span>
                <span className="bg-surface text-text-secondary mt-8 flex size-12 items-center justify-center rounded-full">
                    <Wrench className="size-5" aria-hidden />
                </span>
                <h1 className="text-title mt-5">{t("maintenance.heading")}</h1>
                <p className="text-body-muted mt-2 leading-relaxed">
                    {t("maintenance.description")}
                </p>
            </section>
        </main>
    );
}
