import "server-only";

import { randomUUID } from "node:crypto";

import type { PublicArcade } from "@/features/arcades/schemas/public-arcade-schema";
import {
    fromMusecatHours,
    type MusecatArcade,
    type MusecatDisruption,
    type MusecatFacility,
    type MusecatFlag,
    type MusecatGame,
    type MusecatNotice,
} from "@/features/musecat/musecat-arcade";
import { serverEnv } from "@/lib/env/server";

/**
 * 실제 뮤즈캣 개발자 API(account:access) — MUSECAT_MODE=live.
 * 응답은 모르는 필드를 무시하고(Tolerant Reader) 한 곳에서 NosLog 모양으로 바꾼다.
 * 문서가 비어 있는 동작(신고 철회 본문 · 게임 편집 델타)은 추측하지 않고 unsupported 로 둔다.
 */
export type MusecatCallResult<T> =
    | { ok: true; data: T }
    | {
          ok: false;
          status: number | null;
          error: string;
          retryAfter: number | null;
      };

type Json = Record<string, unknown>;

function origin() {
    const value = serverEnv.MUSECAT_API_ORIGIN;
    if (!value) throw new Error("MUSECAT_API_ORIGIN is not configured");
    return value.replace(/\/$/, "");
}

export async function musecatFetch<T = Json>(
    path: string,
    {
        token,
        method = "GET",
        body,
    }: { token: string; method?: string; body?: Json | FormData }
): Promise<MusecatCallResult<T>> {
    try {
        const isForm = body instanceof FormData;
        const response = await fetch(`${origin()}${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                ...(body && !isForm
                    ? { "Content-Type": "application/json" }
                    : {}),
                ...(method === "GET" ? {} : { "X-Request-Id": randomUUID() }),
            },
            body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
            cache: "no-store",
            signal: AbortSignal.timeout(10_000),
        });
        const text = await response.text();
        const json = text ? (JSON.parse(text) as unknown) : null;
        if (!response.ok) {
            const retry = Number(response.headers.get("retry-after"));
            return {
                ok: false,
                status: response.status,
                error:
                    json && typeof json === "object" && "error" in json
                        ? String((json as Json).error)
                        : `http_${response.status}`,
                retryAfter: Number.isFinite(retry) && retry > 0 ? retry : null,
            };
        }
        return { ok: true, data: json as T };
    } catch (error) {
        return {
            ok: false,
            status: null,
            error: error instanceof Error ? error.name : "network_error",
            retryAfter: null,
        };
    }
}

const record = (value: unknown): Json =>
    value && typeof value === "object" && !Array.isArray(value)
        ? (value as Json)
        : {};
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const text = (value: unknown) =>
    typeof value === "string" && value.trim() ? value : null;
/** 뮤즈캣 다국어 칸은 en/kr/jp — NosLog 는 ko 를 먼저 */
const localized = (value: unknown) => {
    const item = record(value);
    return text(item.kr) ?? text(item.en) ?? text(item.jp);
};

const DISRUPTIONS: readonly MusecatDisruption[] = [
    "unplayable",
    "major",
    "bearable",
    "minor",
];

function toFlag(value: unknown): MusecatFlag | null {
    const flag = record(value);
    if (flag.solved === true || typeof flag.id !== "string") return null;
    const resolution = record(flag.resolution);
    const disruption = DISRUPTIONS.find((item) => item === flag.disruption);
    return {
        id: flag.id,
        disruption: disruption ?? null,
        message: text(flag.message),
        photoCount: list(flag.photos).length,
        author: null,
        createdAt: text(flag.created) ?? new Date(0).toISOString(),
        mine: flag.canWithdraw === true,
        canWithdraw: flag.canWithdraw === true,
        resolution:
            resolution.state === "active"
                ? {
                      fixedVoters: Number(resolution.fixedVoterCount ?? 0),
                      wrongVoters: Number(resolution.wrongVoterCount ?? 0),
                      resolveAt: text(resolution.resolveAt),
                      myVote:
                          resolution.myVote === "fixed" ||
                          resolution.myVote === "wrong"
                              ? resolution.myVote
                              : null,
                  }
                : null,
    };
}

function priceText(value: unknown, currency: string) {
    if (typeof value === "number")
        return currency === "KRW"
            ? `${value.toLocaleString("ko-KR")}원`
            : `${value} ${currency}`;
    return text(value);
}

function toGame(value: unknown, currency: string): MusecatGame | null {
    const item = record(value);
    if (typeof item.id !== "string") return null;
    const version = record(item.version);
    const series = text(version.series) ?? text(item.series) ?? "";
    const cabinet =
        typeof item.cabinet === "string"
            ? item.cabinet
            : localized(item.cabinet);
    const title = [localized(version), cabinet].filter(Boolean).join(" ");
    const rawPrice = item.price ?? version.price_default;
    const price = priceText(rawPrice, currency);
    return {
        id: item.id,
        title: title || localized(item.game) || series || "?",
        nostalgia: /nostalgia/i.test(series),
        quantity: Number(item.quantity ?? 1),
        location: text(item.location),
        prices: price
            ? [
                  {
                      label: null,
                      amount: typeof rawPrice === "number" ? rawPrice : null,
                      currency,
                      text: price,
                  },
              ]
            : [],
        flags: list(item.flags)
            .map(toFlag)
            .filter((flag): flag is MusecatFlag => flag !== null),
        campaign: null,
        stateId: null,
    };
}

/** GTK 종류 → NosLog 시설 키. 내부 시설 / 카드 · 장비로 나눈다 */
const GTK_KEYS: Record<
    string,
    { key: string; group: "interior" | "equipment" }
> = {
    Basket: { key: "basket", group: "interior" },
    Toilet: { key: "restroom", group: "interior" },
    AC: { key: "air_conditioner", group: "interior" },
    Fan: { key: "fan", group: "interior" },
    FreeWifi: { key: "free_wifi", group: "interior" },
    Locker: { key: "locker", group: "interior" },
    SmokingRoom: { key: "smoking_room", group: "interior" },
    FreeWater: { key: "water", group: "interior" },
    FreeGloves: { key: "gloves", group: "equipment" },
    FreeDrumStick: { key: "drum_stick", group: "equipment" },
    FreeBachi: { key: "bachi", group: "equipment" },
    FreeSlipper: { key: "slippers", group: "equipment" },
};

/** Tiptap JSON 공지 본문 → 글자만 */
function tiptapText(value: unknown): string {
    const node = record(value);
    if (typeof node.text === "string") return node.text;
    const children = list(node.content).map(tiptapText);
    return children.join(node.type === "doc" ? "\n" : "");
}

/** 뮤즈캣 id 를 지도 부품용 양의 정수로(같은 id 는 늘 같은 수) */
export function musecatNumericId(id: string) {
    let hash = 0;
    for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) | 0;
    return (Math.abs(hash) % 2_000_000_000) + 1;
}

export function fromMusecatArcade(
    detailValue: unknown,
    noticesValue: unknown,
    slug: string
): MusecatArcade | null {
    const detail = record(detailValue);
    const admin = record(detail.admin);
    const basic = record(detail.basic);
    if (typeof admin.id !== "string" || !text(basic.name)) return null;
    const country = text(admin.country)?.toUpperCase() ?? "KR";
    const currency =
        country === "JP" ? "JPY" : country === "KR" ? "KRW" : "USD";
    const location = record(basic.location);
    const games = list(record(detail.game).items)
        .map((item) => toGame(item, currency))
        .filter((game): game is MusecatGame => game !== null);
    const facilities: {
        interior: MusecatFacility[];
        equipment: MusecatFacility[];
    } = { interior: [], equipment: [] };
    for (const item of list(record(detail.gtk).items)) {
        const value = record(item);
        const mapped = GTK_KEYS[String(value.type)];
        if (!mapped) continue;
        facilities[mapped.group].push({
            key: mapped.key,
            state:
                value.bool === true
                    ? "yes"
                    : value.bool === false
                      ? "no"
                      : "unknown",
            note: text(value.note),
        });
    }
    const arcade: PublicArcade = {
        id: musecatNumericId(admin.id),
        slug,
        name: String(basic.name),
        nativeLanguage: null,
        region: null,
        locality: null,
        countryCode: country,
        timeZone: text(admin.timezone) ?? "Asia/Seoul",
        currencyCode: currency,
        address: text(basic.address),
        latitude: typeof location.lat === "number" ? location.lat : null,
        longitude: typeof location.lon === "number" ? location.lon : null,
        phone: null,
        website: null,
        playPrice: null,
        coinCount: null,
        creditLabel: null,
        facilities: [],
        notes: null,
        preferredCount: null,
        cabinets: [],
        cabinetVerifiedAt: null,
        lastCheckedAt: null,
        checkCount: 0,
        hours: fromMusecatHours(
            record(detail.hour) as Parameters<typeof fromMusecatHours>[0]
        ),
        hoursVerifiedAt: null,
        hoursValidUntil: null,
        legacyHours: null,
        photos: [],
    };
    const notices: MusecatNotice[] = list(
        record(noticesValue).items ?? noticesValue
    )
        .map((value): MusecatNotice | null => {
            const notice = record(value);
            const kinds: Record<string, MusecatNotice["kind"]> = {
                alert: "notice",
                close: "closure",
                issue: "issue",
                event: "event",
            };
            const kind = kinds[String(notice.type)];
            return typeof notice.id === "string"
                ? {
                      id: notice.id,
                      kind: kind ?? "notice",
                      body: tiptapText(notice.content).trim(),
                      author: null,
                      createdAt:
                          text(notice.created) ?? new Date(0).toISOString(),
                      until: text(notice.until),
                      link: null,
                  }
                : null;
        })
        .filter((notice): notice is MusecatNotice => notice !== null);
    const web =
        serverEnv.MUSECAT_WEB_ORIGIN?.replace(/\/$/, "") ??
        "https://musecat.app";
    return {
        musecatId: admin.id,
        arcade,
        closed: admin.closed === true,
        updatedAt: text(admin.updated),
        direction: text(basic.direction),
        subwayLines: list(basic.subway_line).map(String),
        nicknames: list(basic.nickname).map(String),
        notices,
        memo: null,
        games,
        social: list(record(detail.sns).items).map((value) => {
            const item = record(value);
            return {
                type: String(item.type ?? "link"),
                name: String(item.name ?? item.link ?? ""),
                link: text(item.link),
            };
        }),
        facilities,
        photoCredits: [],
        musecatUrl: `${web}/kr/arcade/${admin.id}`,
    };
}

export function getMusecatArcadeLive(musecatId: string, token: string) {
    const id = encodeURIComponent(musecatId);
    return Promise.all([
        musecatFetch(`/developer/v1/account/arcade?id=${id}&expand=all`, {
            token,
        }),
        musecatFetch(`/developer/v1/account/arcade/notice?arcade=${id}`, {
            token,
        }),
    ]);
}

export function reportMusecatFault(
    token: string,
    input: {
        arcade: string;
        gameId: string;
        disruption: MusecatDisruption;
        message: string;
        photos: File[];
    }
) {
    const form = new FormData();
    form.set("arcade", input.arcade);
    form.set("game_id", input.gameId);
    form.set("disruption", input.disruption);
    form.set("message", input.message);
    input.photos.slice(0, 3).forEach((photo) => form.append("photos", photo));
    return musecatFetch<{ xp_feedback?: { xp?: number } }>(
        "/developer/v1/account/arcade/flag",
        { token, method: "POST", body: form }
    );
}

export function reactMusecatFlag(
    token: string,
    input: { flag: string; reaction: "fixed" | "issue_persist" | "wrong" }
) {
    return musecatFetch("/developer/v1/account/arcade/flag/reaction", {
        token,
        method: "POST",
        body: { flag: input.flag, reaction: input.reaction, action: "add" },
    });
}

export function setMusecatFavorite(
    token: string,
    input: { arcade: string; favorited: boolean }
) {
    return musecatFetch("/developer/v1/account/arcade/favorite", {
        token,
        method: "PUT",
        body: input,
    });
}

export function checkMusecatCampaign(
    token: string,
    input: {
        campaign: string;
        arcade: string;
        gameId: string;
        result: "still_old" | "updated";
    }
) {
    return musecatFetch("/developer/v1/account/campaign/check", {
        token,
        method: "POST",
        body: {
            campaign: input.campaign,
            arcade: input.arcade,
            game_id: input.gameId,
            result: input.result,
        },
    });
}
