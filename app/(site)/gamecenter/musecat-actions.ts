"use server";

import { revalidatePath } from "next/cache";

import {
    MUSECAT_DISRUPTIONS,
    type MusecatDisruption,
} from "@/features/musecat/musecat-arcade";
import {
    MUSECAT_FAULT_MESSAGE_MAX,
    MUSECAT_FAULT_PHOTO_LIMIT,
    MUSECAT_FAULT_PHOTO_MAX_BYTES,
    musecatCampaignCheckSchema,
    musecatFaultReactionSchema,
    musecatFaultTargetSchema,
    musecatFaultWithdrawSchema,
    musecatFavoriteSchema,
    musecatGameEditSchema,
} from "@/features/musecat/schemas/musecat-action-schema";
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
const invalid = { ok: false as const, error: "invalid" as const };

function refresh(slug: string) {
    revalidatePath(`/gamecenter/${slug}`);
}

export async function reportMusecatFault(formData: FormData) {
    const ids = musecatFaultTargetSchema.safeParse({
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
        .slice(0, MUSECAT_FAULT_PHOTO_LIMIT);
    if (
        !MUSECAT_DISRUPTIONS.includes(disruption as MusecatDisruption) ||
        !message ||
        message.length > MUSECAT_FAULT_MESSAGE_MAX ||
        photos.some(
            (photo) =>
                photo.size > MUSECAT_FAULT_PHOTO_MAX_BYTES ||
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
    const parsed = musecatFaultReactionSchema.safeParse(input);
    if (!parsed.success) return invalid;
    const result = await reactToFault({
        musecatArcadeId: parsed.data.arcade,
        flagId: parsed.data.flagId,
        reaction: parsed.data.reaction,
    });
    if (result.ok) refresh(parsed.data.slug);
    return result;
}

export async function withdrawMusecatFault(input: {
    slug: string;
    gameId: string;
    flagId: string;
}) {
    const parsed = musecatFaultWithdrawSchema.safeParse(input);
    if (!parsed.success) return invalid;
    const result = await withdrawFault({
        gameId: parsed.data.gameId,
        flagId: parsed.data.flagId,
    });
    if (result.ok) refresh(parsed.data.slug);
    return result;
}

export async function setMusecatFavorite(input: {
    slug: string;
    arcade: string;
    favorited: boolean;
}) {
    const parsed = musecatFavoriteSchema.safeParse(input);
    if (!parsed.success) return invalid;
    const result = await setFavorite({
        musecatArcadeId: parsed.data.arcade,
        favorited: parsed.data.favorited,
    });
    if (result.ok) refresh(parsed.data.slug);
    return result;
}

export async function checkMusecatCampaign(input: {
    slug: string;
    arcade: string;
    gameId: string;
    campaignId: string;
    result: "still_old" | "updated";
}) {
    const parsed = musecatCampaignCheckSchema.safeParse(input);
    if (!parsed.success) return invalid;
    const result = await checkCampaign({
        musecatArcadeId: parsed.data.arcade,
        gameId: parsed.data.gameId,
        campaignId: parsed.data.campaignId,
        result: parsed.data.result,
    });
    if (result.ok) refresh(parsed.data.slug);
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
    const parsed = musecatGameEditSchema.safeParse(input);
    if (!parsed.success) return invalid;
    const { gameId, quantity, location, prices, currency } = parsed.data;
    const result = await editNostalgiaGame({
        gameId,
        quantity,
        location: location.trim() || null,
        prices: prices.map((price) => ({
            label: price.label.trim() || null,
            amount: price.amount,
            currency,
            text: `${price.label.trim() ? `${price.label.trim()} ` : ""}${price.amount.toLocaleString("ko-KR")}${currency === "KRW" ? "원" : ` ${currency}`}`,
        })),
    });
    if (result.ok) refresh(parsed.data.slug);
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
