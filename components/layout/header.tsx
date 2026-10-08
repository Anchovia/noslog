import Link from "next/link";

import ProfileAvatar from "@/components/profile/profile-avatar";
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
            <Link
                href={getLocalizedHref("/", locale)}
                className="flex shrink-0 items-center gap-2"
            >
                <span className="text-wordmark tracking-normal">NosLog</span>
            </Link>
            <div className="ml-auto flex min-w-0 items-center">
                <HeaderPrimaryNavigation />

                <div className="flex shrink-0 items-center">
                    {user ? (
                        <Link
                            href={getLocalizedHref(
                                `/profile/${user.id}`,
                                locale
                            )}
                            className="mx-1.5 shrink-0"
                            aria-label={t("header.profileLabel", {
                                name: user.username ?? t("common.unknownUser"),
                            })}
                        >
                            <ProfileAvatar
                                avatar={user.avatar}
                                username={user.username}
                                size={32}
                            />
                        </Link>
                    ) : (
                        <Link
                            href={getLocalizedHref("/login", locale)}
                            className="mx-1 flex h-10 shrink-0 items-center rounded-card border border-border px-3 text-sm font-bold text-text-primary transition-colors hover:bg-surface-muted"
                        >
                            {t("common.login")}
                        </Link>
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
