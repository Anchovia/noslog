"use client";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import { foundationButtonClass } from "@/components/ui/button";
import IntentLink from "@/components/ui/intent-link";

export default function NotFound() {
    const href = useLocalizedHref();
    const t = useTranslations();

    return (
        <div className="noslog-ui flex flex-col items-center justify-center gap-nl-16 px-nl-24 py-nl-64 text-center">
            <div>
                <h1 className="nl-section-title">
                    {t("common.notFoundTitle")}
                </h1>
                <p className="nl-body-secondary mt-nl-8 text-nl-subdued">
                    {t("common.notFoundDescription")}
                </p>
            </div>
            <IntentLink
                href={href("/")}
                className={foundationButtonClass({ variant: "secondary" })}
            >
                {t("common.goHome")}
            </IntentLink>
        </div>
    );
}
