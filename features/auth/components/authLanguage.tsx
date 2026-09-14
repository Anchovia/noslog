"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import { changeLocale } from "@/app/(nevigation)/settings/actions";
import { PROFILE_LANGUAGES } from "@/features/profile/schemas/profileSettingsSchema";
import { getLocalizedHref, isLocale } from "@/lib/i18n/routing";
import "@/lib/inputModality";

export default function AuthLanguage() {
    const locale = useLocale();
    const t = useTranslations();
    const pathname = usePathname();
    const search = useSearchParams();
    const [pending, startTransition] = useTransition();
    const [failed, setFailed] = useState(false);
    return (
        <>
            <Select.Root
                value={locale}
                disabled={pending}
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
            >
                <Select.Trigger
                    className="nl-auth-language nl-control"
                    aria-label={t("header.language")}
                    aria-busy={pending}
                >
                    <Globe className="nl-icon nl-icon--small" aria-hidden />
                    <Select.Value>
                        {
                            PROFILE_LANGUAGES.find(
                                (option) => option.value === locale
                            )?.label
                        }
                    </Select.Value>
                    <Select.Icon>
                        <ChevronDown
                            className="nl-icon nl-icon--small"
                            aria-hidden
                        />
                    </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                    <div className="noslog-ui">
                        <Select.Content
                            className="nl-select-menu"
                            position="popper"
                            side="top"
                            sideOffset={8}
                            collisionPadding={16}
                        >
                            <Select.Viewport>
                                {PROFILE_LANGUAGES.map((option) => (
                                    <Select.Item
                                        key={option.value}
                                        value={option.value}
                                        lang={option.value}
                                        className="nl-select-option nl-body-secondary"
                                    >
                                        <Select.ItemText>
                                            {option.label}
                                        </Select.ItemText>
                                        <Select.ItemIndicator>
                                            <Check
                                                className="nl-icon-small"
                                                aria-hidden
                                            />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                ))}
                            </Select.Viewport>
                        </Select.Content>
                    </div>
                </Select.Portal>
            </Select.Root>
            {failed ? (
                <p role="alert" className="nl-metadata nl-field__error">
                    {t("settings.preferenceFailed")}
                </p>
            ) : null}
        </>
    );
}
