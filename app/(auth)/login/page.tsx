import Link from "next/link";
import { redirect } from "next/navigation";

import DiscordIcon from "@/components/ui/DiscordIcon";
import type { MessageKey } from "@/lib/i18n/messages";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { getUser } from "@/lib/user";

const errorMessageKeys: Record<string, MessageKey> = {
    invalid_state: "auth.error.invalidState",
    oauth_config: "auth.error.oauthConfig",
    token_exchange: "auth.error.tokenExchange",
    profile_fetch: "auth.error.profileFetch",
    already_linked: "auth.error.alreadyLinked",
    user_missing: "auth.error.userMissing",
    account_update: "auth.error.accountUpdate",
};

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const { locale, t } = await getServerI18n();
    const user = await getUser();
    if (user) redirect(localizePath("/", locale));
    const { error } = await searchParams;
    const homeHref = localizePath("/", locale);
    const privacyHref = localizePath("/privacy", locale);
    const loginNotice = t("auth.reviewBeforeLogin").split("{privacy}");
    const errorMessageKey = error ? errorMessageKeys[error] : null;

    return (
        <main className="mx-auto flex min-h-dvh w-full max-w-97.5 flex-col px-6 py-8">
            <section className="flex flex-1 flex-col items-center justify-center pb-12 text-center">
                <Link
                    href={homeHref}
                    aria-label={t("auth.home")}
                    className="border-text-primary flex size-15 items-center justify-center rounded-full border-2 text-2xl font-extrabold"
                >
                    N
                </Link>

                <h1 className="text-display mt-5">NosLog</h1>
                <p className="text-caption mt-3">{t("auth.tagline")}</p>

                <div className="mt-10 flex w-full flex-col items-center">
                    <a
                        href={`/discord/start?returnTo=${encodeURIComponent(homeHref)}`}
                        className="bg-discord text-text-primary rounded-card flex h-12 w-full items-center justify-center gap-2 text-sm font-bold transition-opacity hover:opacity-90 active:opacity-80"
                    >
                        <DiscordIcon className="size-5" />
                        {t("auth.continueDiscord")}
                    </a>

                    {error ? (
                        <p className="border-danger/40 bg-danger/10 text-danger rounded-card mt-3 w-full border px-3 py-2 text-xs">
                            {errorMessageKey
                                ? t(errorMessageKey)
                                : t("auth.error.generic")}
                        </p>
                    ) : null}

                    <p className="text-text-disabled mt-4 text-xs leading-relaxed">
                        {loginNotice[0]}
                        <Link
                            href={privacyHref}
                            className="text-text-secondary underline underline-offset-4"
                        >
                            {t("auth.privacy")}
                        </Link>
                        {loginNotice[1]}
                    </p>

                    <Link
                        href={homeHref}
                        className="text-text-secondary hover:text-text-primary mt-6 text-xs underline underline-offset-4 transition-colors"
                    >
                        {t("auth.browseWithoutLogin")}
                    </Link>
                </div>
            </section>
        </main>
    );
}
