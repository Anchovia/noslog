import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { getLocalizedHref } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";

export default async function AppFooter() {
    const { locale, t } = await getServerI18n();

    return (
        <footer className="nl-footer">
            <div className="nl-footer__links nl-control">
                <Link href={getLocalizedHref("/privacy", locale)}>
                    {t("footer.privacy")}
                </Link>
                <a
                    href="https://github.com/Anchovia/noslog"
                    aria-label={`GitHub · ${t("shell.externalLink")}`}
                >
                    <span lang="en">GitHub</span>
                    <ExternalLink aria-hidden />
                </a>
            </div>
            <p className="nl-footer__notice nl-body-secondary nl-muted">
                {t("shell.serviceNotice")}
            </p>
        </footer>
    );
}
