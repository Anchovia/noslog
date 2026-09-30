import type { ReactNode } from "react";
import OnboardingForm from "@/features/profile/components/onboardingForm";
import { logout } from "@/app/(nevigation)/profile/[id]/actions";
import { getServerI18n } from "@/lib/i18n/server";
import { getOnboardingPageData } from "@/features/auth/server/onboardingPageService";
import { getAuthDestinationKey } from "@/features/auth/destination";
import AuthShell from "./authShell";

export default async function OnboardingPage() {
    return <OnboardingContent data={await getOnboardingPageData()} />;
}

async function OnboardingContent({
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
            {/* 머리 · 연결된 계정은 단계마다 바뀌어 폼이 그린다(2026-10-01 C) */}
            {children ?? (
                <OnboardingForm
                    account={{
                        avatar: data.avatar,
                        displayName: data.displayName,
                    }}
                    destination={
                        destination
                            ? t("onboarding.destination", {
                                  destination: t(destination),
                              })
                            : null
                    }
                />
            )}
            <form action={logout.bind(null, locale)} className="nl-auth-logout">
                <button type="submit" className="nl-control">
                    {t("onboarding.logoutBrowse")}
                </button>
            </form>
        </AuthShell>
    );
}
