import { getServerI18n } from "@/lib/i18n/server";

export default async function SkipLink() {
    const { t } = await getServerI18n();

    return (
        <a
            href="#main-content"
            className="fixed top-2 left-2 z-50 -translate-y-16 rounded-md bg-text-primary px-3 py-2 text-sm font-semibold text-bg transition-transform focus:translate-y-0"
        >
            {t("skip.main")}
        </a>
    );
}
