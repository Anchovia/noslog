import "server-only";

import type { PublicArcade } from "@/features/arcades/schemas/public-arcade-schema";
import type {
    MusecatArcade,
    MusecatDisruption,
    MusecatFacility,
    MusecatFlag,
    MusecatGame,
} from "@/features/musecat/musecat-arcade";

/**
 * MUSECAT_MODE=mock — 뮤즈캣 응답을 흉내 낸다(2026-10-20 「뮤즈캣 답 전에 mock 으로 끝까지」).
 * 바탕은 NosLog 자체 오락실 데이터이고, 뮤즈캣에만 있는 구역(공지 · 고장 · 캠페인 · 시설 등)은 오락실 id 로 정해지는 예시다.
 * 뮤즈캣 실제 데이터는 쓰지 않는다. 사용자 동작(신고 · 반응 · 즐겨찾기 …)은 이 프로세스 메모리에만 남는다.
 */
const store = {
    flags: new Map<string, MusecatFlag[]>(),
    favorites: new Set<string>(),
    campaignChecks: new Set<string>(),
    gameEdits: new Map<
        string,
        Partial<Pick<MusecatGame, "quantity" | "location" | "prices">>
    >(),
};

export function mockGameId(arcade: PublicArcade) {
    return `mock-${arcade.slug}-nostalgia`;
}

function seed(arcade: PublicArcade) {
    return arcade.id % 7;
}

function nostalgiaGame(arcade: PublicArcade): MusecatGame {
    const id = mockGameId(arcade);
    const active = arcade.cabinets.filter(
        (cabinet) => cabinet.availability !== "unavailable"
    );
    const amount = arcade.playPrice;
    const unit = arcade.creditLabel ?? "1코인";
    const seeded: MusecatFlag[] =
        seed(arcade) % 2 === 0 && arcade.cabinets.length
            ? [
                  {
                      id: `${id}-flag-1`,
                      disruption: "major",
                      message: "5번 건반이 가끔 입력되지 않아요.",
                      photoCount: 1,
                      author: "demo-author",
                      createdAt: new Date(
                          Date.now() - 14 * 24 * 60 * 60 * 1000
                      ).toISOString(),
                      mine: false,
                      canWithdraw: false,
                      resolution: {
                          fixedVoters: 3,
                          wrongVoters: 1,
                          resolveAt: new Date(
                              Date.now() + 160 * 60 * 1000
                          ).toISOString(),
                          myVote: null,
                      },
                  },
              ]
            : [];
    const edit = store.gameEdits.get(id) ?? {};
    return {
        id,
        title: "노스텔지어 Op.3",
        nostalgia: true,
        quantity: edit.quantity ?? Math.max(active.length, 1),
        location: edit.location ?? arcade.cabinets[0]?.note ?? null,
        prices:
            edit.prices ??
            (amount !== null
                ? [
                      {
                          label: null,
                          amount,
                          currency: arcade.currencyCode,
                          text: `${unit} ${amount.toLocaleString("ko-KR")}${arcade.currencyCode === "KRW" ? "원" : ` ${arcade.currencyCode}`}`,
                      },
                  ]
                : []),
        flags: [...seeded, ...(store.flags.get(id) ?? [])],
        campaign:
            seed(arcade) % 3 === 0 && !store.campaignChecks.has(id)
                ? { id: `${id}-campaign`, targetVersion: "Op.4" }
                : null,
        stateId: `${id}-state`,
    };
}

function otherGames(arcade: PublicArcade): MusecatGame[] {
    const titles = [
        ["사운드 볼텍스 발키리 ∇", 4, "라이트 1000원"],
        ["maimai DX PRiSM", 2, "1000원"],
        ["태고의 달인", 1, "1000원"],
    ] as const;
    return titles
        .slice(0, 1 + (seed(arcade) % 3))
        .map(([title, count, price], index) => ({
            id: `mock-${arcade.slug}-other-${index}`,
            title,
            nostalgia: false,
            quantity: count,
            location: null,
            prices: [
                { label: null, amount: null, currency: "KRW", text: price },
            ],
            flags: [],
            campaign: null,
            stateId: null,
        }));
}

const INTERIOR = [
    "parking",
    "basket",
    "restroom",
    "air_conditioner",
    "free_wifi",
    "locker",
    "smoking_room",
] as const;
const EQUIPMENT = ["card_sales", "gloves"] as const;

function facilities(arcade: PublicArcade) {
    const has = new Set(arcade.facilities);
    const from = (key: string): MusecatFacility => {
        const nosLogKey =
            key === "free_wifi"
                ? "wifi"
                : key === "smoking_room"
                  ? "smoking"
                  : key;
        const known = [
            "parking",
            "restroom",
            "wifi",
            "smoking",
            "locker",
            "card_sales",
        ].includes(nosLogKey);
        return {
            key,
            state: known
                ? has.has(nosLogKey as PublicArcade["facilities"][number])
                    ? "yes"
                    : "no"
                : "unknown",
            note: null,
        };
    };
    return {
        interior: INTERIOR.map(from),
        equipment: EQUIPMENT.map(from),
    };
}

export function toMockMusecatArcade(arcade: PublicArcade): MusecatArcade {
    const s = seed(arcade);
    return {
        musecatId: `mock-${arcade.slug}`,
        arcade,
        closed: false,
        updatedAt: new Date(
            Date.now() - (s + 1) * 60 * 60 * 1000
        ).toISOString(),
        direction: arcade.notes,
        subwayLines: [],
        nicknames: [],
        notices:
            s % 3 === 1
                ? [
                      {
                          id: `mock-${arcade.slug}-notice`,
                          kind: "notice",
                          body: "영업시간 안내 — 주말에는 05시까지 영업합니다. (mock 예시 공지)",
                          author: "demo-owner",
                          createdAt: new Date(
                              Date.now() - 13 * 24 * 60 * 60 * 1000
                          ).toISOString(),
                          until: null,
                          link: arcade.website,
                      },
                  ]
                : [],
        memo: null,
        games: [nostalgiaGame(arcade), ...otherGames(arcade)],
        social: arcade.website
            ? [{ type: "website", name: arcade.website, link: arcade.website }]
            : [],
        facilities: facilities(arcade),
        photoCredits: arcade.photos.map(() => ({
            author: "NosLog",
            takenAt: null,
        })),
        musecatUrl: "https://musecat.app/kr",
    };
}

export function mockReportFault(input: {
    gameId: string;
    disruption: MusecatDisruption;
    message: string;
    photoCount: number;
    author: string;
}) {
    const flag: MusecatFlag = {
        id: `${input.gameId}-mine-${Date.now()}`,
        disruption: input.disruption,
        message: input.message,
        photoCount: input.photoCount,
        author: input.author,
        createdAt: new Date().toISOString(),
        mine: true,
        canWithdraw: true,
        resolution: null,
    };
    store.flags.set(input.gameId, [
        ...(store.flags.get(input.gameId) ?? []),
        flag,
    ]);
    return { flagId: flag.id, xp: 5 };
}

export function mockWithdrawFault(gameId: string, flagId: string) {
    store.flags.set(
        gameId,
        (store.flags.get(gameId) ?? []).filter((flag) => flag.id !== flagId)
    );
}

export function mockSetFavorite(arcadeId: string, favorited: boolean) {
    if (favorited) store.favorites.add(arcadeId);
    else store.favorites.delete(arcadeId);
}

export function mockIsFavorite(arcadeId: string) {
    return store.favorites.has(arcadeId);
}

export function mockFavoriteIds() {
    return [...store.favorites];
}

export function mockCampaignCheck(gameId: string) {
    store.campaignChecks.add(gameId);
}

export function mockEditGame(
    gameId: string,
    edit: Partial<Pick<MusecatGame, "quantity" | "location" | "prices">>
) {
    store.gameEdits.set(gameId, { ...store.gameEdits.get(gameId), ...edit });
}
