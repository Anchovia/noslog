import { getLocalizedHref } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import FooterLinks from "./footerLinks";

export default async function AppFooter() {
    const { locale, t } = await getServerI18n();

    return (
        <footer className="nl-footer">
            <div className="nl-footer__content">
                <FooterLinks
                    privacyHref={getLocalizedHref("/privacy", locale)}
                    privacyLabel={t("footer.privacy")}
                    externalLabel={t("shell.externalLink")}
                    notice={t("shell.serviceNotice")}
                />
            </div>
        </footer>
    );
}
