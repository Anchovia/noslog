import { z } from "zod";

export const ADMIN_SYNC_STATUSES = [
    "all",
    "processing",
    "completed",
    "failed",
] as const;
export const adminSyncFilterSchema = z.object({
    status: z.enum(ADMIN_SYNC_STATUSES).catch("all"),
});
