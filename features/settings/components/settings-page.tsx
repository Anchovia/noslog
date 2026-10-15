import { redirect } from "next/navigation";
import { Suspense } from "react";

import { settingsCategorySchema } from "@/features/settings/schemas/settings-schema";
import { getAccountSettingsData } from "@/features/settings/server/account-settings-service";
import { getSettingsPageData } from "@/features/settings/server/settings-page-service";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { getUser } from "@/lib/user";

import AccountSettings from "./account-settings";
import ConnectionSettings from "./connection-settings";
import ExperienceSettings from "./experience-settings";
import PrivacySettings from "./privacy-settings";
import ProfileSettings from "./profile-settings";
import SettingsLayout from "./settings-layout";
import SettingsLoading from "./settings-loading";

async function AccountSettingsContent({
    category,
    loginHref,
    error,
    result,
}: {
    category: "profile" | "privacy" | "connections" | "account";
    loginHref: string;
    error?: string;
    result?: string;
}) {
    if (category === "account") {
        const account = await getAccountSettingsData();
        if (!account) redirect(loginHref);
        return <AccountSettings {...account} error={error} result={result} />;
    }
    const { user, arcades } = await getSettingsPageData();
    if (!user) redirect(loginHref);
    if (category === "profile")
        return <ProfileSettings user={user} arcades={arcades} />;
    if (category === "privacy")
        return <PrivacySettings initialValues={user.privacy} />;
    return (
        <ConnectionSettings
            displayName={user.discordName}
            error={error}
            result={result}
        />
    );
}

export default async function SettingsPage({
    searchParams,
}: {
    searchParams: Promise<{
        category?: string;
        discordError?: string;
        discordResult?: string;
    }>;
}) {
    const [{ locale }, user, params] = await Promise.all([
        getServerI18n(),
        getUser(),
        searchParams,
    ]);
    const parsed = settingsCategorySchema.safeParse(params.category);
    const category = parsed.success ? parsed.data : undefined;
    const root = localizePath("/settings", locale);
    const query = new URLSearchParams({
        returnTo: category ? `${root}?category=${category}` : root,
    });
    const loginHref = `${localizePath("/login", locale)}?${query}`;
    if (category && category !== "experience" && !user) redirect(loginHref);
    return (
        <SettingsLayout category={category} authenticated={Boolean(user)}>
            {category && category !== "experience" ? (
                <Suspense
                    key={category}
                    fallback={<SettingsLoading category={category} />}
                >
                    <AccountSettingsContent
                        category={category}
                        loginHref={loginHref}
                        error={params.discordError}
                        result={params.discordResult}
                    />
                </Suspense>
            ) : (
                <ExperienceSettings />
            )}
        </SettingsLayout>
    );
}
