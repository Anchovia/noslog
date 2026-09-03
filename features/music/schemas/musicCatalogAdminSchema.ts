import { z } from "zod";

export const MUSIC_CATALOG_STATUSES = [
    "pending",
    "applied",
    "rejected",
] as const;

export const musicCatalogStatusSchema = z.enum(MUSIC_CATALOG_STATUSES, {
    error: "악곡 업데이트 상태를 확인해주세요.",
});

export const musicCatalogReviewSchema = z.object({
    candidateId: z.coerce
        .number({ error: "잘못된 악곡 업데이트입니다." })
        .int("잘못된 악곡 업데이트입니다.")
        .positive("잘못된 악곡 업데이트입니다."),
    decision: z.enum(["approve", "reject"], {
        error: "검토 결과를 확인해주세요.",
    }),
});

export type MusicCatalogStatus = z.infer<typeof musicCatalogStatusSchema>;
export type MusicCatalogDecision = z.output<
    typeof musicCatalogReviewSchema
>["decision"];

export function normalizeMusicCatalogStatus(value: string | undefined) {
    const result = musicCatalogStatusSchema.safeParse(value);
    return result.success ? result.data : "pending";
}

export function musicCatalogReviewInputFromFormData(formData: FormData) {
    return {
        candidateId: formData.get("candidateId"),
        decision: String(formData.get("decision") ?? ""),
    };
}

export function createMusicCatalogReviewFormData(
    candidateId: number,
    decision: MusicCatalogDecision
) {
    const formData = new FormData();
    formData.set("candidateId", String(candidateId));
    formData.set("decision", decision);
    return formData;
}
