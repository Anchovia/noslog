import Link from "next/link";
import { redirect } from "next/navigation";
import type { MessageKey } from "@/lib/i18n/messages";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath, stripLocaleFromPath } from "@/lib/i18n/routing";
import { getUser } from "@/lib/user";
import { getAuthReturnPath, getSafeAuthReturnPath } from "@/lib/authReturnPath";
import AuthShell from "./authShell";
import DiscordAction from "./discordAction";
import { getAuthDestinationKey } from "@/features/auth/destination";

const errors: Record<string, MessageKey> = {
    cancelled: "auth.error.cancelled",
    invalid_state: "auth.error.invalidState",
    oauth_config: "auth.error.oauthConfig",
    token_exchange: "auth.error.tokenExchange",
    profile_fetch: "auth.error.profileFetch",
    already_linked: "auth.error.alreadyLinked",
    user_missing: "auth.error.userMissing",
    account_update: "auth.error.accountUpdate",
    session_expired: "auth.error.sessionExpired",
    destination_rejected: "auth.error.destinationRejected",
};

export default async function LoginPage({
    error,
    returnTo,
}: {
    error?: string;
    returnTo?: string;
}) {
    const { locale, t } = await getServerI18n();
    const returnPath = getAuthReturnPath(returnTo, locale);
    const user = await getUser();
    if (user) redirect(returnPath);
    const home = localizePath("/", locale);
    const rejected = Boolean(returnTo && !getSafeAuthReturnPath(returnTo));
    const errorKey = rejected
        ? "auth.error.destinationRejected"
        : error
          ? (errors[error] ?? "auth.error.generic")
          : null;
    const root = stripLocaleFromPath(returnPath).split(/[/?#]/)[1];
    const destination = getAuthDestinationKey(returnPath);
    const publicContext =
        destination &&
        root !== "settings" &&
        (root !== "profile" ||
            /^\/profile\/\d+(?:\?|#|$)/.test(stripLocaleFromPath(returnPath)));
    return (
        <AuthShell>
            <div className="nl-auth-head">
                <h1 className="nl-display">
                    <Link
                        href={home}
                        prefetch={false}
                        aria-label={t("auth.home")}
                    >
                        NosLog
                    </Link>
                </h1>
                <p className="nl-body nl-muted">{t("home.tagline")}</p>
            </div>
            <div className="nl-auth-actions">
                {errorKey ? (
                    <p
                        className="nl-body-secondary nl-field__error"
                        role="alert"
                    >
                        {t(errorKey)}
                    </p>
                ) : destination ? (
                    <p className="nl-body-secondary nl-muted">
                        {t("auth.destination", { destination: t(destination) })}
                    </p>
                ) : null}
                <DiscordAction returnPath={returnPath} />
            </div>
            <Link
                prefetch={false}
                className="nl-auth-browse nl-control"
                href={publicContext ? returnPath : home}
            >
                {t("auth.browseWithoutLogin")}
            </Link>
        </AuthShell>
    );
}
