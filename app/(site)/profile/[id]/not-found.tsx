import PageContainer from "@/components/layout/page-container";
import ButtonLink from "@/components/ui/button-link";
import { StatusMessage } from "@/components/ui/status-message";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";

export default async function ProfileNotFound() {
    const { locale, t } = await getServerI18n();
    return (
        <PageContainer className="nl-profile">
            <StatusMessage
                title={t("common.notFoundTitle")}
                description={t("common.notFoundDescription")}
            />
            <div>
                <ButtonLink
                    variant="secondary"
                    href={localizePath("/", locale)}
                >
                    {t("common.goHome")}
                </ButtonLink>
            </div>
        </PageContainer>
    );
}
