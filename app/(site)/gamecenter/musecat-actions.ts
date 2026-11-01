"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
    MUSECAT_DISRUPTIONS,
    type MusecatDisruption,
} from "@/features/musecat/musecat-arcade";
import {
    checkCampaign,
    editNostalgiaGame,
    listMusecatArcades,
    reactToFault,
    reportFault,
    setFavorite,
    withdrawFault,
} from "@/features/musecat/server/musecat-arcade-service";
import { IMAGE_CONTENT_TYPES } from "@/lib/image-upload-rules";

/** 뮤즈캣 오락실 동작(A 방향) — 쓰기는 한 번만 보내고 자동 재시도하지 않는다(뮤즈캣 예제 규칙) */
const MAX_MESSAGE = 2000;

const remoteId = z.string().min(1).max(128);
// revalidatePath 에 들어가므로 경로를 벗어나는 글자를 받지 않는다
const slugInput = z.string().regex(/^[^/?#\s]{1,128}$/);
const invalid = { ok: false as const, error: "invalid" as const };

function refresh(slug: string) {
    revalidatePath(`/gamecenter/${slug}`);
}

export async function reportMusecatFault(formData: FormData) {
    const ids = z
        .object({ slug: slugInput, arcade: remoteId, gameId: remoteId })
        .safeParse({
            slug: formData.get("slug"),
            arcade: formData.get("arcade"),
            gameId: formData.get("gameId"),
        });
    if (!ids.success) return invalid;
    const { slug, arcade, gameId } = ids.data;
    const disruption = String(formData.get("disruption") ?? "");
    const message = String(formData.get("message") ?? "").trim();
    const photos = formData
        .getAll("photos")
        .filter(
            (value): value is File => value instanceof File && value.size > 0
        )
        .slice(0, 3);
    if (
        !MUSECAT_DISRUPTIONS.includes(disruption as MusecatDisruption) ||
        !message ||
        message.length > MAX_MESSAGE ||
        photos.some(
            (photo) =>
                photo.size > 15 * 1024 * 1024 ||
                !(IMAGE_CONTENT_TYPES as readonly string[]).includes(photo.type)
        )
    ) {
        return { ok: false as const, error: "invalid" as const };
    }
    const result = await reportFault({
        musecatArcadeId: arcade,
        gameId,
        disruption: disruption as MusecatDisruption,
        message,
        photos,
    });
    if (result.ok) refresh(slug);
    return result;
}

export async function reactMusecatFault(input: {
    slug: string;
    arcade: string;
    flagId: string;
    reaction: "fixed" | "issue_persist";
}) {
    const parsed = z
        .object({
            slug: slugInput,
            arcade: remoteId,
            flagId: remoteId,
            reaction: z.enum(["fixed", "issue_persist"]),
        })
        .safeParse(input);
    if (!parsed.success) return invalid;
    const result = await reactToFault({
        musecatArcadeId: input.arcade,
        flagId: input.flagId,
        reaction: input.reaction,
    });
    if (result.ok) refresh(input.slug);
    return result;
}

export async function withdrawMusecatFault(input: {
    slug: string;
    gameId: string;
    flagId: string;
}) {
    const parsed = z
        .object({ slug: slugInput, gameId: remoteId, flagId: remoteId })
        .safeParse(input);
    if (!parsed.success) return invalid;
    const result = await withdrawFault(input);
    if (result.ok) refresh(input.slug);
    return result;
}

export async function setMusecatFavorite(input: {
    slug: string;
    arcade: string;
    favorited: boolean;
}) {
    const parsed = z
        .object({
            slug: slugInput,
            arcade: remoteId,
            favorited: z.boolean(),
        })
        .safeParse(input);
    if (!parsed.success) return invalid;
    const result = await setFavorite({
        musecatArcadeId: input.arcade,
        favorited: input.favorited,
    });
    if (result.ok) refresh(input.slug);
    return result;
}

export async function checkMusecatCampaign(input: {
    slug: string;
    arcade: string;
    gameId: string;
    campaignId: string;
    result: "still_old" | "updated";
}) {
    const parsed = z
        .object({
            slug: slugInput,
            arcade: remoteId,
            gameId: remoteId,
            campaignId: remoteId,
            result: z.enum(["still_old", "updated"]),
        })
        .safeParse(input);
    if (!parsed.success) return invalid;
    const result = await checkCampaign({
        musecatArcadeId: input.arcade,
        gameId: input.gameId,
        campaignId: input.campaignId,
        result: input.result,
    });
    if (result.ok) refresh(input.slug);
    return result;
}

export async function editMusecatNostalgiaGame(input: {
    slug: string;
    gameId: string;
    quantity: number;
    location: string;
    prices: { label: string; amount: number }[];
    currency: string;
}) {
    const ids = z
        .object({
            slug: slugInput,
            gameId: remoteId,
            currency: z.string().max(8),
            quantity: z.number().int().min(0).max(50),
            location: z.string().max(100),
            prices: z
                .array(
                    z.object({
                        label: z.string().max(20),
                        amount: z.number().min(0),
                    })
                )
                .max(4),
        })
        .safeParse(input);
    if (!ids.success) return invalid;
    const result = await editNostalgiaGame({
        gameId: input.gameId,
        quantity: input.quantity,
        location: input.location.trim() || null,
        prices: input.prices.map((price) => ({
            label: price.label.trim() || null,
            amount: price.amount,
            currency: input.currency,
            text: `${price.label.trim() ? `${price.label.trim()} ` : ""}${price.amount.toLocaleString("ko-KR")}${input.currency === "KRW" ? "원" : ` ${input.currency}`}`,
        })),
    });
    if (result.ok) refresh(input.slug);
    return result;
}

/** 목록 — 위치(이 기기에만 저장)를 주소에 싣지 않으려고 액션으로 받는다 */
export async function listMusecatArcadesAction(input: {
    lat: number | null;
    lon: number | null;
    country: string | null;
    region: string | null;
    page: number;
}) {
    const valid = (value: number | null, limit: number) =>
        value !== null && Number.isFinite(value) && Math.abs(value) <= limit
            ? value
            : null;
    const lat = valid(input.lat, 90);
    const lon = valid(input.lon, 180);
    return listMusecatArcades({
        lat: lat !== null && lon !== null ? lat : null,
        lon: lat !== null && lon !== null ? lon : null,
        country:
            input.country && /^[A-Z]{2}$/.test(input.country)
                ? input.country
                : null,
        region:
            input.region && input.region.length <= 100 ? input.region : null,
        page: Number.isInteger(input.page) ? input.page : 1,
    });
}
