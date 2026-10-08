import Link from "next/link";

import { getLocalizedHref } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";

export default async function Footer() {
    const { locale, t } = await getServerI18n();

    return (
        <footer className="flex min-h-9 items-center gap-3 border-t border-divider bg-surface px-4 py-2 text-xs text-text-secondary">
            <span>&copy; 2026 NosLog</span>
            <Link
                href={getLocalizedHref("/privacy", locale)}
                className="transition-colors hover:text-text-primary"
            >
                {t("footer.privacy")}
            </Link>
            <Link
                href="https://github.com/Anchovia/noslog"
                className="font-medium text-text-primary"
            >
                GitHub
            </Link>
        </footer>
    );
}
