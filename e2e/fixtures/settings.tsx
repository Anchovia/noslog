import { setTimeout as pause } from "node:timers/promises";
import { Suspense } from "react";
import SettingsLoading from "@/features/settings/components/settingsLoading";
import SettingsLayout from "@/features/settings/components/settingsLayout";
import ProfileSettings from "@/features/settings/components/profileSettings";
import PrivacySettings from "@/features/settings/components/privacySettings";
import ConnectionSettings from "@/features/settings/components/connectionSettings";
import { getServerI18n } from "@/lib/i18n/server";

async function LoadedSettingsFixture() {
    await pause(3000);
    return <p role="status">P10 fixture loaded</p>;
}

// Synthetic presentation states only. No session fabrication or database writes.
export default async function SettingsFixture({
    category,
}: {
    category?: string;
}) {
    if (category === "loading") {
        return (
            <SettingsLayout authenticated category="profile">
                <Suspense fallback={<SettingsLoading profile />}>
                    <LoadedSettingsFixture />
                </Suspense>
            </SettingsLayout>
        );
    }
    async function fail() {
        "use server";
        const { t } = await getServerI18n();
        await pause(600);
        return { success: false as const, message: t("settings.saveError") };
    }
    const privacy = {
        showNostalgiaName: true,
        showDiscordIdentity: false,
        showPreferredArcade: true,
        showPlayCount: true,
        showPlayActivity: true,
    };
    const arcades = [
        {
            id: 3,
            name: "NosLog arcade fixture · 長いオラクシルの名前",
            region: "서울",
        },
    ];
    return (
        <SettingsLayout
            authenticated
            category={
                category === "connections"
                    ? "connections"
                    : category === "privacy"
                      ? "privacy"
                      : "profile"
            }
        >
            {category === "connections" ? (
                <ConnectionSettings displayName="NosLog fixture · 長い表示名の Discord ログインアカウント" />
            ) : category === "privacy" ? (
                <PrivacySettings initialValues={privacy} submitAction={fail} />
            ) : (
                <ProfileSettings
                    user={{
                        id: 9,
                        profile: {
                            username: "Ｎos 한글カナ",
                            avatar: "",
                            country: "ko-KR",
                            preferredArcadeId: "3",
                        },
                        nostalgiaName: "CAROL",
                        preferredArcade: { ...arcades[0], is_active: true },
                        discordName: "NosLog fixture",
                        privacy,
                    }}
                    arcades={arcades}
                    submitAction={fail}
                />
            )}
        </SettingsLayout>
    );
}
