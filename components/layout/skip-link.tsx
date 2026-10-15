import { getServerI18n } from "@/lib/i18n/server";

export default async function SkipLink() {
    const { t } = await getServerI18n();

    return (
        <a
            href="#main-content"
            className="nl-control fixed top-nl-8 left-nl-8 z-nl-header -translate-y-nl-64 rounded-nl-field bg-nl-primary px-nl-12 py-nl-8 text-nl-on-primary focus:translate-y-0"
        >
            {t("skip.main")}
        </a>
    );
}
