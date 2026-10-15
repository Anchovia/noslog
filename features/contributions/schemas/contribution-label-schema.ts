import { z } from "zod";

/** 이름 옆 기여 라벨 — 운영자는 역할, 그 밖에는 기준 등급 이상의 「기여 Lv.N」(점수는 작은 창에 쓴다) */
export const nameLabelSchema = z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("operator") }),
    z.object({
        kind: z.literal("level"),
        level: z.number().int().min(1).max(6),
        points: z.number().int().nonnegative(),
    }),
]);
