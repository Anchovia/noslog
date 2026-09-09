import Link from "next/link";
import PageContainer from "@/components/layout/pageContainer";
import { foundationButtonClass } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/statusMessage";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";

export default async function ProfileNotFound() {
    const { locale, t } = await getServerI18n();
    return (
        <PageContainer className="nl-profile">
            <StatusMessage
                title={t("common.notFoundTitle")}
                description={t("common.notFoundDescription")}
            />
            <div>
                <Link
                    className={foundationButtonClass({ variant: "secondary" })}
                    href={localizePath("/", locale)}
                >
                    {t("common.goHome")}
                </Link>
            </div>
        </PageContainer>
    );
}
