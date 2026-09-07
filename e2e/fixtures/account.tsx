import AccountSettings from "@/features/settings/components/accountSettings";
import SettingsLayout from "@/features/settings/components/settingsLayout";
import { getServerI18n } from "@/lib/i18n/server";

async function getFixtureTime() {
    return Date.now();
}

export default async function AccountFixture({ state }: { state?: string }) {
    const { t } = await getServerI18n();
    const now = await getFixtureTime();
    const failureMessage = t("settings.deleteError");
    async function failDeletion() {
        "use server";
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { success: false as const, message: failureMessage };
    }
    async function failLogout(): Promise<{ success: true }> {
        "use server";
        throw new Error("Fixture logout failure");
    }
    return (
        <SettingsLayout authenticated category="account">
            <AccountSettings
                summary={{
                    plays: 1204,
                    growth: 312,
                    community: 87,
                    progress: 5,
                    uploads: 3,
                }}
                expiresAt={
                    state === "unverified"
                        ? null
                        : now + (state === "expiry" ? 4000 : 600_000)
                }
                deleteAction={failDeletion}
                logoutAction={failLogout}
            />
            <p className="sr-only" role="status">
                Account presentation fixture — no account mutation
            </p>
        </SettingsLayout>
    );
}
