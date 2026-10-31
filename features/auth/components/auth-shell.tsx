import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";

import AuthLanguage from "./auth-language";

export default async function AuthShell({
    children,
    onboarding = false,
}: {
    children: ReactNode;
    onboarding?: boolean;
}) {
    const { t, locale } = await getServerI18n();
    const [beforeTerms, rest] = t("auth.reviewBeforeLogin").split("{terms}");
    const [beforePrivacy, afterPrivacy] = rest.split("{privacy}");
    return (
        <div
            className={cn(
                "noslog-ui nl-auth",
                onboarding && "nl-auth--onboarding"
            )}
        >
            <main id="main-content" tabIndex={-1} className="nl-auth-main">
                <div className="nl-auth-column">{children}</div>
            </main>
            <div className="nl-auth-bottom">
                {!onboarding ? (
                    <p className="nl-metadata nl-muted">
                        {beforeTerms}
                        <Link
                            prefetch={false}
                            className="nl-link nl-text-link--underlined"
                            href={localizePath("/terms", locale)}
                        >
                            {t("auth.terms")}
                        </Link>
                        {beforePrivacy}
                        <Link
                            prefetch={false}
                            className="nl-link nl-text-link--underlined"
                            href={localizePath("/privacy", locale)}
                        >
                            {t("auth.privacy")}
                        </Link>
                        {afterPrivacy}
                    </p>
                ) : null}
                <AuthLanguage />
            </div>
        </div>
    );
}
