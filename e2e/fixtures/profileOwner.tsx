import PublicProfilePage from "@/features/profile/components/publicProfilePage";
import type { ProfileUser } from "@/components/profile/dashboard/profileTypes";
import { getServerI18n } from "@/lib/i18n/server";

// UI-only fixture mounted by the disposable local verification route. It creates
// no account, session or permission and never changes the real card endpoint.
export default async function ProfileOwnerFixture({
    privacy = "",
    sync = "none",
}: {
    privacy?: string;
    sync?: string;
}) {
    const hidden = (field: string) => privacy === field || privacy === "all";
    const { t } = await getServerI18n();
    const user: ProfileUser = {
        id: 2147483646,
        username: "PROFILE_OWNER_FIXTURE",
        nostalgia_name: hidden("nostalgia") ? null : "FIXTURE_NOSTALGIA",
        discord_name: hidden("discord") ? null : "FIXTURE_DISCORD",
        discord_username: hidden("discord") ? null : "fixture_handle",
        avatar: null,
        country: "ko-KR",
        rank_basic: null,
        rank_basic_country: null,
        rank_recital: null,
        rank_recital_country: null,
        grade_basic: 0,
        grade_recital: 0,
        exam_basic: null,
        exam_recital: null,
        play_count: hidden("count") ? null : 0,
        hide_nostalgia_name: hidden("nostalgia"),
        hide_discord_name: hidden("discord"),
        hide_play_count: hidden("count"),
        hide_preferred_arcade: hidden("arcade"),
        hide_play_activity: hidden("activity"),
        score_p: 0,
        score_f: 0,
        score_s: 0,
        score_a2: 0,
        score_a: 0,
        score_b2: 0,
        score_b: 0,
        score_c: 0,
        score_d: 0,
        created_at: "2026-08-01T00:00:00Z",
        last_played_at: null,
        preferredArcade: hidden("arcade") ? null : { name: "FIXTURE_ARCADE" },
    };
    const syncLabel =
        sync === "partial"
            ? t("profile.syncPartial")
            : sync === "failed"
              ? t("sync.failed")
              : sync === "processing"
                ? t("sync.processing")
                : sync === "none"
                  ? t("sync.none")
                  : t("sync.last", { distance: "2026-08-01" });
    return (
        <PublicProfilePage
            user={user}
            isOwner
            overview={{
                ratings: { basic: null, recital: null },
                judgement: {
                    counts: { sjust: 0, just: 0, good: 0, near: 0, miss: 0 },
                    chartCount: 0,
                },
                hasRecords: false,
                sync:
                    sync === "none"
                        ? null
                        : {
                              status: sync,
                              startedAt: "2026-08-01T00:00:00Z",
                              completedAt:
                                  sync === "completed"
                                      ? "2026-08-01T00:01:00Z"
                                      : null,
                          },
            }}
            initialBest={null}
            initialRecent={null}
            initialProgress={null}
            syncLabel={syncLabel}
        />
    );
}
