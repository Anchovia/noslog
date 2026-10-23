import "server-only";

import type { Prisma } from "@prisma/client";

import { arcadeDistance } from "@/features/arcades/arcade-discovery";
import {
    getPublicArcade,
    getPublicArcades,
} from "@/features/arcades/server/public-arcade-service";
import type {
    MusecatArcade,
    MusecatDisruption,
    MusecatPrice,
} from "@/features/musecat/musecat-arcade";
import {
    getMusecatAccessToken,
    getMusecatConnection,
} from "@/features/musecat/server/musecat-connection-service";
import {
    checkMusecatCampaign,
    fromMusecatArcade,
    getMusecatArcadeLive,
    reactMusecatFlag,
    reportMusecatFault,
    setMusecatFavorite,
} from "@/features/musecat/server/musecat-live-client";
import {
    mockCampaignCheck,
    mockEditGame,
    mockIsFavorite,
    mockReportFault,
    mockSetFavorite,
    mockWithdrawFault,
    toMockMusecatArcade,
} from "@/features/musecat/server/musecat-mock";
import { getMusecatMode } from "@/features/musecat/server/musecat-mode";
import db from "@/lib/db";
import getSession from "@/lib/session";

export const MUSECAT_PAGE_SIZE = 15;

export interface MusecatViewer {
    userId: number | null;
    connected: boolean;
    needsReconnect: boolean;
    username: string | null;
}

export async function getMusecatViewer(): Promise<MusecatViewer> {
    const session = await getSession();
    if (!session.id) {
        return {
            userId: null,
            connected: false,
            needsReconnect: false,
            username: null,
        };
    }
    const connection = await getMusecatConnection(session.id);
    return {
        userId: session.id,
        connected: connection.status === "active",
        needsReconnect: connection.status === "needs_reconnect",
        username: connection.status === "none" ? null : connection.username,
    };
}

/** 연결 안 한 사람에게는 뮤즈캣 공개 범위와 같게 — 고장은 건수만, 요금은 대표 2개까지 */
function redactForGuest(arcade: MusecatArcade): MusecatArcade {
    return {
        ...arcade,
        games: arcade.games.map((game) => ({
            ...game,
            location: null,
            prices: game.prices.slice(0, 2),
            flags: game.flags.map((flag) => ({
                ...flag,
                disruption: null,
                message: null,
                author: null,
                photoCount: 0,
                resolution: null,
            })),
        })),
    };
}

async function resolveMusecatId(slug: string) {
    const mapped = await db.arcadeExternalId.findFirst({
        where: {
            provider: "musecat",
            arcade: { publicDetails: { slug } },
        },
        select: { externalId: true },
    });
    return mapped?.externalId ?? slug;
}

export async function getMusecatArcadePage(slug: string) {
    const mode = getMusecatMode();
    const viewer = await getMusecatViewer();
    if (mode === "mock") {
        const base = await getPublicArcade(slug);
        if (!base) return null;
        const arcade = toMockMusecatArcade(base);
        return {
            arcade: viewer.connected ? arcade : redactForGuest(arcade),
            viewer,
            favorite: viewer.connected && mockIsFavorite(arcade.musecatId),
        };
    }
    if (mode !== "live" || !viewer.userId || !viewer.connected) return null;
    const token = await getMusecatAccessToken(viewer.userId);
    if (!token.ok) return null;
    const musecatId = await resolveMusecatId(slug);
    const [detail, notices] = await getMusecatArcadeLive(
        musecatId,
        token.token
    );
    if (!detail.ok) return null;
    const arcade = fromMusecatArcade(
        detail.data,
        notices.ok ? notices.data : [],
        slug
    );
    return arcade ? { arcade, viewer, favorite: false } : null;
}

export interface MusecatListQuery {
    lat: number | null;
    lon: number | null;
    country: string | null;
    region: string | null;
    page: number;
}

/** NOSTALGIA 가 있는 오락실 · 가까운 순 15곳씩(뮤즈캣 주변 검색과 같은 흐름) — mock 만, live 는 연결 사용자 토큰이 있어야 한다 */
export async function listMusecatArcades(query: MusecatListQuery) {
    if (getMusecatMode() !== "mock") return null;
    const arcades = (await getPublicArcades()).map(toMockMusecatArcade);
    const located = query.lat !== null && query.lon !== null;
    const withDistance = arcades.map((item) => ({
        item,
        distanceKm: located
            ? arcadeDistance(item.arcade, {
                  latitude: query.lat!,
                  longitude: query.lon!,
              })
            : null,
    }));
    const countryTotals = withDistance.reduce<Record<string, number>>(
        (totals, { item }) => {
            totals[item.arcade.countryCode] =
                (totals[item.arcade.countryCode] ?? 0) + 1;
            return totals;
        },
        {}
    );
    const inCountry = withDistance.filter(
        ({ item }) =>
            !query.country || item.arcade.countryCode === query.country
    );
    // 지역 칩(시안 「서울 · 부산 …」) — 고른 국가(전체면 모두) 안 지역별 수
    const regionTotals = inCountry.reduce<Record<string, number>>(
        (totals, { item }) => {
            if (item.arcade.region)
                totals[item.arcade.region] =
                    (totals[item.arcade.region] ?? 0) + 1;
            return totals;
        },
        {}
    );
    const filtered = inCountry
        .filter(
            ({ item }) => !query.region || item.arcade.region === query.region
        )
        .sort(
            (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)
        );
    const lastPage = Math.max(
        1,
        Math.ceil(filtered.length / MUSECAT_PAGE_SIZE)
    );
    const page = Math.min(Math.max(1, query.page), lastPage);
    return {
        total: arcades.length,
        countryTotals,
        regionTotals,
        page,
        lastPage,
        items: filtered
            .slice((page - 1) * MUSECAT_PAGE_SIZE, page * MUSECAT_PAGE_SIZE)
            .map(({ item, distanceKm }) => {
                const nostalgia = item.games.filter((game) => game.nostalgia);
                return {
                    arcade: item.arcade,
                    distanceKm,
                    nostalgiaCount: nostalgia.reduce(
                        (sum, game) => sum + game.quantity,
                        0
                    ),
                    openFlags: nostalgia.reduce(
                        (sum, game) => sum + game.flags.length,
                        0
                    ),
                    closed: item.closed,
                };
            }),
    };
}

export type MusecatActionResult =
    | { ok: true; xp?: number }
    | {
          ok: false;
          error:
              | "login"
              | "not_connected"
              | "needs_reconnect"
              | "rate_limited"
              | "visit_required"
              | "conflict"
              | "unsupported"
              | "failed";
      };

async function liveToken() {
    const session = await getSession();
    if (!session.id) return { ok: false as const, error: "login" as const };
    const token = await getMusecatAccessToken(session.id);
    if (!token.ok) {
        return {
            ok: false as const,
            error:
                token.error === "needs_reconnect"
                    ? ("needs_reconnect" as const)
                    : token.error === "rate_limited"
                      ? ("rate_limited" as const)
                      : ("not_connected" as const),
        };
    }
    return { ...token, userId: session.id };
}

async function recordAction(input: {
    userId: number;
    connectionId: number;
    generation: number;
    musecatArcadeId: string;
    kind: Prisma.MusecatActionCreateInput["kind"];
    payload: Prisma.InputJsonValue;
    status: "accepted" | "rejected" | "uncertain";
    httpStatus: number | null;
}) {
    await db.musecatAction.create({
        data: {
            userId: input.userId,
            connectionId: input.connectionId,
            generation: input.generation,
            musecatArcadeId: input.musecatArcadeId,
            kind: input.kind,
            payload: input.payload,
            status: input.status,
            httpStatus: input.httpStatus,
        },
    });
}

function failureFrom(status: number | null): MusecatActionResult {
    if (status === 401) return { ok: false, error: "needs_reconnect" };
    if (status === 403) return { ok: false, error: "visit_required" };
    if (status === 409) return { ok: false, error: "conflict" };
    if (status === 429) return { ok: false, error: "rate_limited" };
    return { ok: false, error: "failed" };
}

async function mockViewer() {
    const viewer = await getMusecatViewer();
    if (!viewer.userId) return { ok: false as const, error: "login" as const };
    if (!viewer.connected)
        return { ok: false as const, error: "not_connected" as const };
    return { ok: true as const, viewer };
}

export async function reportFault(input: {
    musecatArcadeId: string;
    gameId: string;
    disruption: MusecatDisruption;
    message: string;
    photos: File[];
}): Promise<MusecatActionResult> {
    if (getMusecatMode() === "mock") {
        const viewer = await mockViewer();
        if (!viewer.ok) return viewer;
        const result = mockReportFault({
            gameId: input.gameId,
            disruption: input.disruption,
            message: input.message,
            photoCount: input.photos.length,
            author: viewer.viewer.username ?? "me",
        });
        return { ok: true, xp: result.xp };
    }
    const token = await liveToken();
    if (!token.ok) return token;
    const result = await reportMusecatFault(token.token, {
        arcade: input.musecatArcadeId,
        gameId: input.gameId,
        disruption: input.disruption,
        message: input.message,
        photos: input.photos,
    });
    await recordAction({
        userId: token.userId,
        connectionId: token.connectionId,
        generation: token.generation,
        musecatArcadeId: input.musecatArcadeId,
        kind: "fault_report",
        payload: { gameId: input.gameId, disruption: input.disruption },
        status: result.ok
            ? "accepted"
            : result.status === null
              ? "uncertain"
              : "rejected",
        httpStatus: result.ok ? 200 : result.status,
    });
    return result.ok
        ? { ok: true, xp: result.data.xp_feedback?.xp }
        : failureFrom(result.status);
}

export async function reactToFault(input: {
    musecatArcadeId: string;
    flagId: string;
    reaction: "fixed" | "issue_persist";
}): Promise<MusecatActionResult> {
    if (getMusecatMode() === "mock") {
        const viewer = await mockViewer();
        return viewer.ok ? { ok: true } : viewer;
    }
    const token = await liveToken();
    if (!token.ok) return token;
    const result = await reactMusecatFlag(token.token, {
        flag: input.flagId,
        reaction: input.reaction,
    });
    await recordAction({
        userId: token.userId,
        connectionId: token.connectionId,
        generation: token.generation,
        musecatArcadeId: input.musecatArcadeId,
        kind: "flag_reaction",
        payload: { flagId: input.flagId, reaction: input.reaction },
        status: result.ok
            ? "accepted"
            : result.status === null
              ? "uncertain"
              : "rejected",
        httpStatus: result.ok ? 200 : result.status,
    });
    return result.ok ? { ok: true } : failureFrom(result.status);
}

/** 본인 신고 거두기 — 뮤즈캣 요청 본문 문서가 비어 live 는 아직 막아 둔다 */
export async function withdrawFault(input: {
    gameId: string;
    flagId: string;
}): Promise<MusecatActionResult> {
    if (getMusecatMode() !== "mock") return { ok: false, error: "unsupported" };
    const viewer = await mockViewer();
    if (!viewer.ok) return viewer;
    mockWithdrawFault(input.gameId, input.flagId);
    return { ok: true };
}

export async function setFavorite(input: {
    musecatArcadeId: string;
    favorited: boolean;
}): Promise<MusecatActionResult> {
    if (getMusecatMode() === "mock") {
        const viewer = await mockViewer();
        if (!viewer.ok) return viewer;
        mockSetFavorite(input.musecatArcadeId, input.favorited);
        return { ok: true };
    }
    const token = await liveToken();
    if (!token.ok) return token;
    const result = await setMusecatFavorite(token.token, {
        arcade: input.musecatArcadeId,
        favorited: input.favorited,
    });
    return result.ok ? { ok: true } : failureFrom(result.status);
}

/** 버전 업데이트 확인 — 뮤즈캣에서 오늘 방문 인증을 했어야 한다(캠페인 안 B). 없으면 403 → visit_required */
export async function checkCampaign(input: {
    musecatArcadeId: string;
    gameId: string;
    campaignId: string;
    result: "still_old" | "updated";
}): Promise<MusecatActionResult> {
    if (getMusecatMode() === "mock") {
        const viewer = await mockViewer();
        if (!viewer.ok) return viewer;
        mockCampaignCheck(input.gameId);
        return { ok: true, xp: 3 };
    }
    const token = await liveToken();
    if (!token.ok) return token;
    const result = await checkMusecatCampaign(token.token, {
        campaign: input.campaignId,
        arcade: input.musecatArcadeId,
        gameId: input.gameId,
        result: input.result,
    });
    return result.ok ? { ok: true } : failureFrom(result.status);
}

/** NOSTALGIA 기체 정보 고치기(정보 수정 안 b) — 뮤즈캣 게임 편집 델타 문서가 비어 live 는 아직 막아 둔다 */
export async function editNostalgiaGame(input: {
    gameId: string;
    quantity: number;
    location: string | null;
    prices: MusecatPrice[];
}): Promise<MusecatActionResult> {
    if (getMusecatMode() !== "mock") return { ok: false, error: "unsupported" };
    const viewer = await mockViewer();
    if (!viewer.ok) return viewer;
    mockEditGame(input.gameId, {
        quantity: input.quantity,
        location: input.location,
        prices: input.prices,
    });
    return { ok: true };
}
