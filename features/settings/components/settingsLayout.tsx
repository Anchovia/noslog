import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageContainer, { PageHeading } from "@/components/layout/pageContainer";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import { settingsCategorySchema } from "@/features/settings/schemas/settingsSchema";
import type { SettingsCategory } from "@/features/settings/schemas/settingsSchema";
import type { MessageKey } from "@/lib/i18n/messages";

const titles: Record<SettingsCategory, MessageKey> = {
    experience: "settings.appearance",
    profile: "settings.profileTitle",
    privacy: "settings.privacy",
    connections: "settings.connections",
    account: "settings.account",
};
const summaries: Record<SettingsCategory, MessageKey> = {
    experience: "settings.experienceSummary",
    profile: "settings.profileSummary",
    privacy: "settings.privacySummary",
    connections: "settings.connectionsSummary",
    account: "settings.accountSummary",
};

export default async function SettingsLayout({
    category,
    authenticated,
    accountHref,
    children,
}: {
    category?: SettingsCategory;
    authenticated: boolean;
    accountHref?: string;
    children: ReactNode;
}) {
    const { locale, t } = await getServerI18n();
    const root = localizePath("/settings", locale);
    const current = category ?? "experience";
    const categories = authenticated
        ? settingsCategorySchema.options
        : (["experience"] as const);
    return (
        <PageContainer
            className={cn(
                "nl-settings",
                category ? "nl-settings--detail" : "nl-settings--overview"
            )}
        >
            <div className="nl-settings__overview-heading">
                <PageHeading title={t("settings.overview")} />
            </div>
            <div className="nl-settings__layout">
                <div className="nl-settings__navigation">
                    <nav aria-label={t("settings.overview")}>
                        {categories.map((item) => (
                            <a
                                key={item}
                                href={
                                    item === "account" && accountHref
                                        ? accountHref
                                        : `${root}?category=${item}`
                                }
                                className={cn(
                                    "nl-settings__category",
                                    current === item &&
                                        "nl-settings__category--current"
                                )}
                                aria-current={
                                    category === item ? "page" : undefined
                                }
                            >
                                <span>
                                    <span className="nl-entity-title">
                                        {t(titles[item])}
                                    </span>
                                    <span className="nl-body-secondary nl-muted nl-settings__summary">
                                        {t(summaries[item])}
                                    </span>
                                </span>
                                <ChevronRight aria-hidden />
                            </a>
                        ))}
                    </nav>
                    {!authenticated ? (
                        <p className="nl-body-secondary nl-muted nl-settings__guest-note">
                            {t("settings.guestSummary")}
                        </p>
                    ) : null}
                </div>
                <div className="nl-settings__detail">
                    <a
                        href={root}
                        className="nl-settings__back nl-control nl-muted"
                    >
                        <ChevronLeft aria-hidden />
                        {t("settings.overview")}
                    </a>
                    <PageHeading title={t(titles[current])} />
                    {children}
                </div>
            </div>
        </PageContainer>
    );
}
