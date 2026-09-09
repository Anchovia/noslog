import "server-only";

import db from "@/lib/db";
import { getProfileRating } from "@/features/profile/server/profilePlaysService";

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
                      user_id: userId,
                      sync_id: syncId,
                      mode: modes[index],
                      rating: result.rating,
                      observed_at: observedAt,
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
