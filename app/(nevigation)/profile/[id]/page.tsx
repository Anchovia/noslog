import PublicProfilePage from "@/features/profile/components/publicProfilePage";
import { getProfileOverviewContext } from "@/features/profile/server/profileOverviewService";
import { getPublicProfilePlays } from "@/features/profile/server/profilePlaysService";
import { getPublicProfileProgress } from "@/features/profile/server/profileProgressService";
import { profileIdSchema } from "@/features/profile/schemas/publicProfileSchema";
import { formatDistanceToNow } from "date-fns";
import { enUS, ja, ko } from "date-fns/locale";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";
import getSession from "@/lib/session";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCachedProfileData } from "./data";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const [{ id: rawId }, { locale, t }] = await Promise.all([
        params,
        getServerI18n(),
    ]);
    const id = profileIdSchema.safeParse(rawId);
    const profile = id.success ? await getCachedProfileData(id.data) : null;

    return createPageMetadata({
        title: profile?.user.username
            ? t("profile.metaTitle", { name: profile.user.username })
            : t("profile.fallbackTitle"),
        description: t("profile.metaDescription"),
        path: localizePath(
            id.success ? `/profile/${id.data}` : "/profile",
            locale
        ),
        noIndex: true,
    });
}

export default async function ProfilePage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const { id: rawId } = await params;
    const parsedId = profileIdSchema.safeParse(rawId);
    if (!parsedId.success) notFound();
    const id = parsedId.data;

    const [{ locale, t }, profileData, session, query] = await Promise.all([
        getServerI18n(),
        getCachedProfileData(id),
        getSession(),
        searchParams,
    ]);

    if (!profileData) notFound();

    const isOwner = session.id === profileData.user.id;
    const mode = query.mode === "recital" ? "recital" : "basic";
    const [overview, initialBest, initialRecent, initialProgress] =
        await Promise.all([
            getProfileOverviewContext(id, isOwner),
            getPublicProfilePlays(id, {
                kind: "best",
                mode,
                metric: "grade",
                offset: 0,
            }),
            getPublicProfilePlays(id, {
                kind: "recent",
                mode: "basic",
                metric: "grade",
                offset: 0,
            }),
            getPublicProfileProgress(id, {
                mode,
                metric: "grade",
                range: "90",
            }),
        ]);
    const sync = overview.sync;
    const syncLabel = !isOwner
        ? undefined
        : !sync
          ? t("sync.none")
          : sync.status === "failed"
            ? t("sync.failed")
            : sync.status === "partial"
              ? t("profile.syncPartial")
              : sync.status !== "completed"
                ? t("sync.processing")
                : t("sync.last", {
                      distance: formatDistanceToNow(
                          new Date(sync.completedAt ?? sync.startedAt),
                          {
                              addSuffix: true,
                              locale:
                                  locale === "ja"
                                      ? ja
                                      : locale === "en"
                                        ? enUS
                                        : ko,
                          }
                      ),
                  });

    return (
        <PublicProfilePage
            user={profileData.user}
            initialProgress={initialProgress}
            isOwner={isOwner}
            overview={overview}
            initialBest={initialBest}
            initialRecent={initialRecent}
            syncLabel={syncLabel}
        />
    );
}
