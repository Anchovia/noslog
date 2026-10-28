"use server";

import { revalidatePath } from "next/cache";

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

/** 뮤즈캣 오락실 동작(A 방향) — 쓰기는 한 번만 보내고 자동 재시도하지 않는다(뮤즈캣 예제 규칙) */
const MAX_MESSAGE = 2000;

function refresh(slug: string) {
    revalidatePath(`/gamecenter/${slug}`);
}

export async function reportMusecatFault(formData: FormData) {
    const slug = String(formData.get("slug") ?? "");
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
        photos.some((photo) => photo.size > 15 * 1024 * 1024)
    ) {
        return { ok: false as const, error: "invalid" as const };
    }
    const result = await reportFault({
        musecatArcadeId: String(formData.get("arcade") ?? ""),
        gameId: String(formData.get("gameId") ?? ""),
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
    const result = await withdrawFault(input);
    if (result.ok) refresh(input.slug);
    return result;
}

export async function setMusecatFavorite(input: {
    slug: string;
    arcade: string;
    favorited: boolean;
}) {
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
    if (
        !Number.isInteger(input.quantity) ||
        input.quantity < 0 ||
        input.quantity > 50 ||
        input.location.length > 100 ||
        input.prices.length > 4 ||
        input.prices.some(
            (price) =>
                !Number.isFinite(price.amount) ||
                price.amount < 0 ||
                price.label.length > 20
        )
    ) {
        return { ok: false as const, error: "invalid" as const };
    }
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
