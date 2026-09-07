import Link from "next/link";
import type { ReactNode } from "react";
import Avatar from "@/components/ui/avatar";
import OnboardingForm from "@/features/profile/components/onboardingForm";
import { logout } from "@/app/(nevigation)/profile/[id]/actions";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { getOnboardingPageData } from "@/features/auth/server/onboardingPageService";
import { getAuthDestinationKey } from "@/features/auth/destination";
import AuthShell from "./authShell";

export default async function OnboardingPage() {
    return <OnboardingContent data={await getOnboardingPageData()} />;
}

export async function OnboardingContent({
    data,
    children,
}: {
    data: Awaited<ReturnType<typeof getOnboardingPageData>>;
    children?: ReactNode;
}) {
    const { t, locale } = await getServerI18n();
    const destination = getAuthDestinationKey(data.returnTo);
    return (
        <AuthShell onboarding>
            <div className="nl-auth-head">
                <Link
                    prefetch={false}
                    className="nl-page-title"
                    href={localizePath("/", locale)}
                    aria-label={t("auth.home")}
                >
                    NosLog
                </Link>
                <h1 className="nl-section-title">{t("onboarding.title")}</h1>
            </div>
            {destination ? (
                <p className="nl-body-secondary nl-muted nl-auth-reason">
                    {t("onboarding.destination", {
                        destination: t(destination),
                    })}
                </p>
            ) : null}
            <section
                className="nl-auth-account"
                aria-label={t("onboarding.connectedAccount")}
            >
                <p className="nl-control nl-muted">
                    {t("onboarding.connectedAccount")}
                </p>
                <div className="nl-auth-account-row">
                    <Avatar src={data.avatar} size={40} />
                    <p className="nl-body">{data.displayName}</p>
                </div>
            </section>
            {children ?? <OnboardingForm />}
            <form action={logout.bind(null, locale)} className="nl-auth-logout">
                <button type="submit" className="nl-control">
                    {t("onboarding.logoutBrowse")}
                </button>
            </form>
        </AuthShell>
    );
}
