import ProfileAvatar from "@/components/profile/profile-avatar";
import { foundationButtonClass } from "@/components/ui/button";
import IntentLink from "@/components/ui/intent-link";
import { cn } from "@/lib/cn";
import { getLocalizedHref } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { getUser } from "@/lib/user";

import HeaderMenu, { HeaderPrimaryNavigation } from "./header-navigation";
import ScrollAwareHeader from "./scroll-aware-header";

export default async function Header() {
    const [user, { locale, t }] = await Promise.all([
        getUser(),
        getServerI18n(),
    ]);

    return (
        <ScrollAwareHeader>
            <IntentLink
                href={getLocalizedHref("/", locale)}
                className="flex shrink-0 items-center gap-nl-8"
            >
                <span className="nl-section-title text-nl-content">NosLog</span>
            </IntentLink>
            <div className="ml-auto flex min-w-0 items-center">
                <HeaderPrimaryNavigation />

                <div className="flex shrink-0 items-center">
                    {user ? (
                        <IntentLink
                            href={getLocalizedHref(
                                `/profile/${user.id}`,
                                locale
                            )}
                            className="mx-nl-8 shrink-0"
                            aria-label={t("header.profileLabel", {
                                name: user.username ?? t("common.unknownUser"),
                            })}
                        >
                            <ProfileAvatar
                                avatar={user.avatar}
                                username={user.username}
                                size={32}
                            />
                        </IntentLink>
                    ) : (
                        <IntentLink
                            href={getLocalizedHref("/login", locale)}
                            className={cn(
                                foundationButtonClass({ variant: "secondary" }),
                                "mx-nl-4 shrink-0"
                            )}
                        >
                            {t("common.login")}
                        </IntentLink>
                    )}
                    <HeaderMenu
                        isAdmin={user?.role === "admin"}
                        showLocaleSwitcher={!user}
                    />
                </div>
            </div>
        </ScrollAwareHeader>
    );
}
