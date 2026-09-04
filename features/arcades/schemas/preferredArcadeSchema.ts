import { z } from "zod";

// Preserve the existing integer check; existence/active status is checked on the server.
export const preferredArcadeSchema = z.object({
    arcadeId: z.number().refine(Number.isInteger),
});
