import Link from "next/link";
import { getServerI18n } from "@/lib/i18n/server";
import { getLocalizedHref } from "@/lib/i18n/routing";

export default async function Footer() {
    const { locale, t } = await getServerI18n();

    return (
        <footer className="border-divider bg-surface text-text-secondary flex min-h-9 items-center gap-3 border-t px-4 py-2 text-xs">
            <span>&copy; 2026 NosLog</span>
            <Link
                href={getLocalizedHref("/privacy", locale)}
                className="hover:text-text-primary transition-colors"
            >
                {t("footer.privacy")}
            </Link>
            <Link
                href="https://github.com/Anchovia/noslog"
                className="text-text-primary font-medium"
            >
                GitHub
            </Link>
        </footer>
    );
}
