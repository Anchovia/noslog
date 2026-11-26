import { getServerI18n } from "@/lib/i18n/server";

export default async function SkipLink() {
    const { t } = await getServerI18n();

    return (
        <a href="#main-content" className="nl-skip-link nl-control">
            {t("skip.main")}
        </a>
    );
}
