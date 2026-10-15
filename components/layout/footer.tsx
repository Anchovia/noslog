import Link from "next/link";

import { getLocalizedHref } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";

export default async function Footer() {
    const { locale, t } = await getServerI18n();

    return (
        <footer className="nl-metadata flex min-h-nl-control-compact items-center gap-nl-12 border-t-nl-stroke border-nl-divider bg-nl-surface px-nl-16 py-nl-8 text-nl-subdued">
            <span>&copy; 2026 NosLog</span>
            <Link
                href={getLocalizedHref("/privacy", locale)}
                className="transition-colors duration-nl-state hover:text-nl-content"
            >
                {t("footer.privacy")}
            </Link>
            <Link
                href="https://github.com/Anchovia/noslog"
                className="nl-control text-nl-content"
            >
                GitHub
            </Link>
        </footer>
    );
}
