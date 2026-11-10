import { profileRecordsQuerySchema } from "@/features/profile/schemas/public-profile-schema";
import { createProfileListRoute } from "@/features/profile/server/profile-list-route";
import { getPublicProfileRecords } from "@/features/profile/server/profile-records-service";

/** 프로필 「기록」 탭 목록(2026-09-25) — 점수 비공개면 본인 말고는 403(기록 API 와 같은 규칙), 플레이 활동 비공개면 남에게 달성일 없이 */
export const GET = createProfileListRoute({
    querySchema: profileRecordsQuerySchema,
    load: getPublicProfileRecords,
    event: "profile.records.fetch.failed",
    routePath: "/api/profiles/[id]/records",
    failureCode: "PROFILE_RECORDS_FAILED",
    failureMessage: "Unable to load profile records.",
});
