import SyncPage from "@/features/sync/components/syncPage";
import { getSyncStatus } from "@/features/sync/server/syncStatusService";
import { createBookmarkletHref, createSyncToken } from "@/lib/bookmarklet";
import { serverEnv } from "@/lib/env/server";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";
import { getUser } from "@/lib/user";
import { headers } from "next/headers";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();
    return createPageMetadata({
        title: t("sync.title"),
        description: t("sync.metaDescription"),
        path: localizePath("/bookmarklet", locale),
    });
}

async function requestOrigin() {
    const requestHeaders = await headers();
    const host =
        requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol =
        requestHeaders.get("x-forwarded-proto") ??
        (host?.startsWith("localhost") || host?.startsWith("192.168.")
            ? "http"
            : "https");

    if (host) return `${protocol}://${host}`;
    if (serverEnv.APP_URL) return serverEnv.APP_URL.replace(/\/$/, "");

    throw new Error("Application origin could not be resolved");
}

export default async function BookmarkletPage() {
    const [{ locale }, user] = await Promise.all([getServerI18n(), getUser()]);
    if (!user)
        return <SyncPage bookmarklet={null} initialData={null} userId={null} />;
    const [origin, initialData] = await Promise.all([
        requestOrigin(),
        getSyncStatus(user.id),
    ]);
    const bookmarklet = createBookmarkletHref(
        origin,
        createSyncToken({ userId: user.id, version: user.sync_token_version }),
        serverEnv.VERCEL_ENV === "preview"
            ? serverEnv.VERCEL_AUTOMATION_BYPASS_SECRET
            : undefined,
        locale
    );
    return (
        <SyncPage
            bookmarklet={bookmarklet}
            initialData={initialData}
            userId={user.id}
        />
    );
}
