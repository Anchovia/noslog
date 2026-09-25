import { formatDistanceToNow } from "date-fns";
import { enUS, ja, ko } from "date-fns/locale";
import { notFound } from "next/navigation";

import { getCachedProfileData } from "@/app/(nevigation)/profile/[id]/data";
import { summarizeAchievements } from "@/features/achievements/achievementDefinitions";
import { getProfileHeaderContext } from "@/features/profile/server/profileOverviewService";
import { hideProfileScores } from "@/features/profile/server/scoreVisibility";
import { getServerI18n } from "@/lib/i18n/server";
import getSession from "@/lib/session";
import ProfileIdentity from "./profileIdentity";
import ProfileTabs from "./profileTabs";

/**
 * 프로필 머리 + 구역 탭(2026-09-25 D2 · H3) — `profile/[id]/layout` 이 한 번 그리고, 탭을 옮겨도 다시 불러오지 않는다.
 * 모드(Basic · Recital)는 주소 `?mode=` 라 머리 · 탭 · 각 탭 내용이 같은 값을 읽는다
 */
export default async function ProfileShell({ id }: { id: number }) {
    const [{ locale, t }, profileData, session] = await Promise.all([
        getServerI18n(),
        getCachedProfileData(id),
        getSession(),
    ]);
    if (!profileData) notFound();
    const isOwner = session.id === profileData.user.id;
    const scoresHidden = !isOwner && profileData.user.hide_play_scores;
    const user = scoresHidden
        ? hideProfileScores(profileData.user)
        : profileData.user;
    const header = scoresHidden
        ? null
        : await getProfileHeaderContext(id, isOwner);
    const sync = header?.sync;
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
    const achievements = user.achievements
        ? summarizeAchievements(user.achievements, scoresHidden)
        : null;
    return (
        <>
            <ProfileIdentity
                user={user}
                isOwner={isOwner}
                syncLabel={syncLabel}
                achievements={achievements}
                header={header}
                showSyncAction={
                    isOwner &&
                    Boolean(sync && ["failed", "partial"].includes(sync.status))
                }
            />
            <ProfileTabs userId={id} scoresHidden={scoresHidden} />
        </>
    );
}
