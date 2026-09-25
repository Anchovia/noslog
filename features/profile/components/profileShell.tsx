import { formatDistanceToNow } from "date-fns";
import { enUS, ja, ko } from "date-fns/locale";
import { notFound } from "next/navigation";

import { getCachedProfileData } from "@/app/(nevigation)/profile/[id]/data";
import { summarizeAchievements } from "@/features/achievements/achievementDefinitions";
import { getProfileHeaderContext } from "@/features/profile/server/profileOverviewService";
import { getOwnerPrivateFields } from "@/features/profile/server/ownerPrivateService";
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
    const [header, ownerPrivate] = await Promise.all([
        scoresHidden
            ? null
            : getProfileHeaderContext(id, isOwner, profileData.user.country),
        // 본인에게는 숨긴 항목도 자물쇠와 함께 보인다(2026-09-26 P1)
        isOwner ? getOwnerPrivateFields(id) : null,
    ]);
    const syncState = header?.sync;
    // 본인에게만 — 끝난 동기화는 「N일 전」 값, 나머지 상태는 문장(2026-09-26 H1 활동 줄)
    const sync = !isOwner
        ? undefined
        : !syncState
          ? { message: t("sync.none") }
          : syncState.status === "failed"
            ? { message: t("sync.failed") }
            : syncState.status === "partial"
              ? { message: t("profile.syncPartial") }
              : syncState.status !== "completed"
                ? { message: t("sync.processing") }
                : {
                      distance: formatDistanceToNow(
                          new Date(
                              syncState.completedAt ?? syncState.startedAt
                          ),
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
                  };
    const achievements = user.achievements
        ? summarizeAchievements(user.achievements, scoresHidden)
        : null;
    return (
        <>
            <ProfileIdentity
                user={user}
                isOwner={isOwner}
                sync={sync}
                achievements={achievements}
                header={header}
                privateFields={ownerPrivate}
                showSyncAction={
                    isOwner &&
                    Boolean(
                        syncState &&
                        ["failed", "partial"].includes(syncState.status)
                    )
                }
            />
            <ProfileTabs
                userId={id}
                scoresHidden={scoresHidden}
                activityHidden={!isOwner && profileData.user.hide_play_activity}
            />
        </>
    );
}
