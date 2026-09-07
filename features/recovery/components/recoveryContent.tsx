"use client";

import Link from "next/link";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import PageContainer from "@/components/layout/pageContainer";
import { foundationButtonClass } from "@/components/ui/Button";
import RecoveryAction from "./recoveryAction";

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
                <Link
                    href={href("/")}
                    className={foundationButtonClass({
                        variant: reset ? "secondary" : "primary",
                    })}
                >
                    {t("common.goHome")}
                </Link>
            </div>
        </PageContainer>
    );
}
