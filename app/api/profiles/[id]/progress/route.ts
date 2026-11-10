import { profileProgressQuerySchema } from "@/features/profile/schemas/public-profile-schema";
import { createProfileListRoute } from "@/features/profile/server/profile-list-route";
import { getPublicProfileProgress } from "@/features/profile/server/profile-progress-service";

export const GET = createProfileListRoute({
    querySchema: profileProgressQuerySchema,
    load: getPublicProfileProgress,
    event: "profile.progress.fetch.failed",
    routePath: "/api/profiles/[id]/progress",
    failureCode: "PROFILE_PROGRESS_FAILED",
    failureMessage: "Unable to load profile progress.",
});
