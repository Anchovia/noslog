import "server-only";

import { getProfileRating } from "@/features/profile/server/profile-plays-service";
import db from "@/lib/db";

// The observation belongs to this import, never to an inferred past play date.
export async function recordProfileRatings(userId: number, syncId: number) {
    const observedAt = new Date();
    const modes = ["basic", "recital"] as const;
    const results = await Promise.all(
        modes.map((mode) => getProfileRating(userId, mode))
    );
    const rows = results.flatMap((result, index) =>
        result
            ? [
                  {
                      userId: userId,
                      syncId: syncId,
                      mode: modes[index],
                      rating: result.rating,
                      observedAt: observedAt,
                  },
              ]
            : []
    );
    if (rows.length)
        await db.userRatingHistory.createMany({
            data: rows,
            skipDuplicates: true,
        });
}
