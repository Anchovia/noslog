import { profileListQuerySchema } from "@/features/profile/schemas/public-profile-schema";
import { createProfileListRoute } from "@/features/profile/server/profile-list-route";
import { getPublicProfilePlays } from "@/features/profile/server/profile-plays-service";

export const GET = createProfileListRoute({
    querySchema: profileListQuerySchema,
    load: getPublicProfilePlays,
    event: "profile.plays.fetch.failed",
    routePath: "/api/profiles/[id]/plays",
    failureCode: "PROFILE_PLAYS_FAILED",
    failureMessage: "Unable to load profile records.",
});
