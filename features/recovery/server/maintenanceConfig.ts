import { z } from "zod";

const instantSchema = z.string().datetime({ offset: true });
const intervalSchema = z.coerce.number().int().min(1).max(86400);

// This configuration contains public operator-maintained timing only.
export function getMaintenanceConfig(
    env: Record<string, string | undefined> = process.env,
    now = new Date()
) {
    const end = instantSchema.safeParse(env.MAINTENANCE_EXPECTED_END_AT);
    const updated = instantSchema.safeParse(env.MAINTENANCE_UPDATED_AT);
    const interval = intervalSchema.safeParse(
        env.MAINTENANCE_RETRY_AFTER_SECONDS
    );
    const expectedEnd =
        end.success && Date.parse(end.data) > now.getTime() ? end.data : null;
    const updatedAt =
        updated.success && Date.parse(updated.data) <= now.getTime()
            ? updated.data
            : null;
    return {
        expectedEnd,
        updatedAt,
        retryAfter: expectedEnd
            ? new Date(expectedEnd).toUTCString()
            : interval.success
              ? String(interval.data)
              : null,
    };
}
