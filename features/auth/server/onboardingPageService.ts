import "server-only";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { getAuthReturnPath } from "@/lib/authReturnPath";

export async function getOnboardingPageData() {
    const { locale } = await getServerI18n();
    const session = await getSession();
    if (!session.id) redirect(localizePath("/login", locale));
    const user = await db.user.findUnique({
        where: { id: session.id },
        select: {
            avatar: true,
            discord_name: true,
            discord_username: true,
            profile_completed_at: true,
        },
    });
    if (!user) redirect(localizePath("/onboarding/complete", locale));
    if (user.profile_completed_at)
        redirect(localizePath("/onboarding/complete", locale));
    return {
        avatar: user.avatar,
        displayName: user.discord_name ?? user.discord_username ?? "Discord",
        returnTo: getAuthReturnPath(session.onboardingReturnTo, locale),
    };
}
