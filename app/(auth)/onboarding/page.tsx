import { redirect } from "next/navigation";

import OnboardingForm from "@/components/onboarding/onboardingForm";
import db from "@/lib/db";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import getSession from "@/lib/session";

export default async function OnboardingPage() {
    const { locale, t } = await getServerI18n();
    const session = await getSession();
    if (!session.id) redirect(localizePath("/login", locale));

    const user = await db.user.findUnique({
        where: { id: session.id },
        select: { profile_completed_at: true },
    });
    if (!user) redirect(localizePath("/login", locale));

    if (user.profile_completed_at) {
        redirect(localizePath("/onboarding/complete", locale));
    }

    return (
        <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto flex min-h-dvh w-full max-w-97.5 flex-col px-6 py-8"
        >
            <section className="flex flex-1 flex-col items-center justify-center pb-12">
                <span className="border-text-primary flex size-15 items-center justify-center rounded-full border-2 text-2xl font-extrabold">
                    N
                </span>
                <div className="mt-5 w-full text-center">
                    <h1 className="text-display">{t("onboarding.title")}</h1>
                    <p className="text-caption mt-2">
                        {t("onboarding.description")}
                    </p>
                </div>
                <OnboardingForm />
            </section>
        </main>
    );
}
