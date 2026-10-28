"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { changeLocale } from "@/app/(site)/settings/actions";
import { useLocale, useTranslations } from "@/components/i18n/locale-provider";
import CompactSelect from "@/components/ui/compact-select";
import { StatusMessage } from "@/components/ui/status-message";
import { PROFILE_LANGUAGES } from "@/features/profile/schemas/profile-settings-schema";
import { getLocalizedHref, isLocale, type Locale } from "@/lib/i18n/routing";

export default function AuthLanguage() {
    const locale = useLocale();
    const t = useTranslations();
    const pathname = usePathname();
    const search = useSearchParams();
    const [pending, startTransition] = useTransition();
    const [failed, setFailed] = useState(false);
    return (
        <>
            <CompactSelect<Locale>
                label={t("header.language")}
                value={locale}
                disabled={pending}
                options={PROFILE_LANGUAGES.map((option) => ({
                    value: option.value,
                    label: option.label,
                }))}
                onValueChange={(value) => {
                    if (!isLocale(value) || value === locale) return;
                    startTransition(async () => {
                        setFailed(false);
                        try {
                            const result = await changeLocale(value);
                            if (!result.success) {
                                setFailed(true);
                                return;
                            }
                            const query = search.toString();
                            // Refresh the root locale provider and document language.
                            window.location.assign(
                                getLocalizedHref(
                                    `${pathname}${query ? `?${query}` : ""}`,
                                    value
                                )
                            );
                        } catch {
                            setFailed(true);
                        }
                    });
                }}
            />
            {failed ? (
                <StatusMessage
                    severity="danger"
                    role="alert"
                    title={t("settings.preferenceFailed")}
                />
            ) : null}
        </>
    );
}
