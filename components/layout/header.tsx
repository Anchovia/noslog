import { getUser } from "@/lib/user";
import Link from "next/link";
import ProfileAvatar from "@/components/profile/profileAvatar";
import { getServerI18n } from "@/lib/i18n/server";
import { getLocalizedHref } from "@/lib/i18n/routing";

import HeaderMenu, { HeaderPrimaryNavigation } from "./headerNavigation";
import ScrollAwareHeader from "./scrollAwareHeader";

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
                            className="rounded-card border-border text-text-primary hover:bg-surface-muted mx-1 flex h-10 shrink-0 items-center border px-3 text-sm font-bold transition-colors"
                        >
                            {t("common.login")}
                        </Link>
                    )}
                    <HeaderMenu isAdmin={user?.role === "admin"} />
                </div>
            </div>
        </ScrollAwareHeader>
    );
}
