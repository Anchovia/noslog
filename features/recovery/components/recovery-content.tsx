"use client";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import PageContainer from "@/components/layout/page-container";
import ButtonLink from "@/components/ui/button-link";

import RecoveryAction from "./recovery-action";

export default function RecoveryContent({ reset }: { reset?: () => void }) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const title = t(reset ? "common.pageError" : "common.notFoundTitle");
    return (
        <PageContainer width="reading" className="nl-recovery">
            {reset ? <title>{`${title} | NosLog`}</title> : null}
            <meta name="robots" content="noindex" />
            <h1 className="nl-page-title">{title}</h1>
            <p className="nl-body nl-muted">
                {t(reset ? "common.retryLater" : "common.notFoundDescription")}
            </p>
            <div className="nl-recovery__actions">
                {reset ? (
                    <RecoveryAction
                        label={t("common.retry")}
                        busyLabel={t("recovery.retrying")}
                        reset={reset}
                    />
                ) : null}
                <ButtonLink
                    href={href("/")}
                    variant={reset ? "secondary" : "primary"}
                >
                    {t("common.goHome")}
                </ButtonLink>
            </div>
        </PageContainer>
    );
}
