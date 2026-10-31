import { redirect } from "next/navigation";
import { Suspense } from "react";

import { MusecatConnectionDetail } from "@/features/partner/components/musecat-connection-settings";
import { getMusecatSettings } from "@/features/partner/server/partner-settings-data";
import { settingsCategorySchema } from "@/features/settings/schemas/settings-schema";
import { getAccountSettingsData } from "@/features/settings/server/account-settings-service";
import { getSettingsPageData } from "@/features/settings/server/settings-page-service";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { getUser } from "@/lib/user";

import AccountSettings from "./account-settings";
import ConnectionSettings, {
    DiscordConnectionDetail,
} from "./connection-settings";
import ExperienceSettings from "./experience-settings";
import PrivacySettings from "./privacy-settings";
import ProfileSettings from "./profile-settings";
import SettingsLayout from "./settings-layout";
import SettingsLoading from "./settings-loading";

async function AccountSettingsContent({
    category,
    loginHref,
    connectionsHref,
    error,
    result,
    partner,
}: {
    category: "profile" | "privacy" | "connections" | "account";
    loginHref: string;
    connectionsHref: string;
    error?: string;
    result?: string;
    partner?: string;
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
    if (partner === "discord")
        return (
            <DiscordConnectionDetail
                displayName={user.discordName}
                error={error}
                result={result}
            />
        );
    const musecat = await getMusecatSettings(user.id);
    if (partner === "musecat") {
        if (!musecat.visible) redirect(connectionsHref);
        return <MusecatConnectionDetail settings={musecat} />;
    }
    return (
        <ConnectionSettings displayName={user.discordName} musecat={musecat} />
    );
}

export default async function SettingsPage({
    searchParams,
}: {
    searchParams: Promise<{
        category?: string;
        discordError?: string;
        discordResult?: string;
        partner?: string;
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
        <SettingsLayout
            category={category}
            authenticated={Boolean(user)}
            // 뮤즈캣 상세는 모드가 꺼져도 연결 기록이 있으면 보이고(없으면 아래에서 연결로 돌려보낸다), 제목 · 뒤로는 상세가 그린다
            subpage={
                category === "connections" &&
                (params.partner === "musecat" || params.partner === "discord")
            }
        >
            {category && category !== "experience" ? (
                <Suspense
                    key={`${category}-${params.partner ?? ""}`}
                    fallback={<SettingsLoading category={category} />}
                >
                    <AccountSettingsContent
                        category={category}
                        loginHref={loginHref}
                        connectionsHref={`${root}?category=connections`}
                        error={params.discordError}
                        result={params.discordResult}
                        partner={params.partner}
                    />
                </Suspense>
            ) : (
                <ExperienceSettings />
            )}
        </SettingsLayout>
    );
}
