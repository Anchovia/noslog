import Link from "next/link";
import type { ReactNode } from "react";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import AuthLanguage from "./authLanguage";
import { cn } from "@/lib/utils";

export default async function AuthShell({
    children,
    onboarding = false,
}: {
    children: ReactNode;
    onboarding?: boolean;
}) {
    const { t, locale } = await getServerI18n();
    const privacy = t("auth.reviewBeforeLogin").split("{privacy}");
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
                        {privacy[0]}
                        <Link
                            prefetch={false}
                            className="nl-text-link"
                            href={localizePath("/privacy", locale)}
                        >
                            {t("auth.privacy")}
                        </Link>
                        {privacy[1]}
                    </p>
                ) : null}
                <AuthLanguage />
            </div>
        </div>
    );
}
