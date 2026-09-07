import { redirect } from "next/navigation";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";

export default async function LegacyProfileSettings({
    searchParams,
}: {
    searchParams: Promise<{ discordError?: string }>;
}) {
    const { locale } = await getServerI18n();
    const { discordError } = await searchParams;
    const query = new URLSearchParams({
        category: discordError ? "connections" : "profile",
    });
    if (discordError) query.set("discordError", discordError);
    redirect(`${localizePath("/settings", locale)}?${query}`);
}
