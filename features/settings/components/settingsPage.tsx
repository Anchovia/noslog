import { redirect } from "next/navigation";
import { Suspense } from "react";
import SettingsLayout from "./settingsLayout";
import ExperienceSettings from "./experienceSettings";
import ProfileSettings from "./profileSettings";
import PrivacySettings from "./privacySettings";
import ConnectionSettings from "./connectionSettings";
import SettingsLoading from "./settingsLoading";
import AccountSettings from "./accountSettings";
import { getAccountSettingsData } from "../server/accountSettingsService";
import { settingsCategorySchema } from "@/features/settings/schemas/settingsSchema";
import { getSettingsPageData } from "@/features/settings/server/settingsPageService";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { getUser } from "@/lib/user";

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
                    fallback={
                        <SettingsLoading profile={category === "profile"} />
                    }
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
