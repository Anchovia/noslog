import ArcadeDiscoveryPage from "@/features/arcades/components/arcadeDiscoveryPage";
import ArcadeDetailPage from "@/features/arcades/components/arcadeDetailPage";
import type { PublicArcade } from "@/features/arcades/schemas/publicArcadeSchema";

// Synthetic presentation data only. No authentication or database mutation.
export const arcadeFixture: PublicArcade = {
    id: 900001,
    slug: "presentation-only",
    name: "노스로그 검증 오락실",
    nativeLanguage: "ko",
    identities: [
        {
            locale: "ja",
            name: "NosLog 検証ゲームセンター",
            aliases: ["テスト"],
        },
        { locale: "en", name: "NosLog verification arcade", aliases: ["TEST"] },
    ],
    region: "서울",
    locality: "마포구",
    countryCode: "KR",
    timeZone: "Asia/Seoul",
    currencyCode: "KRW",
    address: "서울특별시 마포구 검증용 주소 123",
    latitude: null,
    longitude: null,
    phone: "02-1234-5678",
    website: "https://example.com/",
    playPrice: 1000,
    coinCount: 2,
    creditLabel: null,
    notes: "검증용 정보 · Test data · 検証用情報",
    preferredCount: 12,
    cabinets: [
        {
            id: 900001,
            label: null,
            position: 0,
            availability: "available",
            condition: "good",
            note: null,
            verifiedAt: "2026-09-01T00:00:00.000Z",
            stale: false,
            lastCheckedAt: null,
            checkCount: 0,
            openReports: 0,
            latestReportAt: null,
        },
        {
            id: 900002,
            label: null,
            position: 1,
            availability: "available",
            condition: "caution",
            note: "왼쪽 건반 입력 확인 필요 · Check left keys · 左側の鍵盤を確認",
            verifiedAt: "2026-09-01T00:00:00.000Z",
            stale: false,
            lastCheckedAt: null,
            checkCount: 0,
            openReports: 0,
            latestReportAt: null,
        },
    ],
    cabinetVerifiedAt: "2026-09-01T00:00:00.000Z",
    lastCheckedAt: null,
    checkCount: 0,
    hours: {
        weekly: {
            "0": { open: 600, close: 1440 },
            "1": { open: 600, close: 1440 },
            "2": { open: 600, close: 1440 },
            "3": { open: 600, close: 1440 },
            "4": { open: 600, close: 1440 },
            "5": { open: 600, close: 1440 },
            "6": null,
        },
        exceptions: {},
    },
    hoursVerifiedAt: "2026-09-01T00:00:00.000Z",
    hoursValidUntil: "2026-10-01T00:00:00.000Z",
    legacyHours: null,
    photos: [],
};
export default function ArcadesFixture({ state }: { state?: string }) {
    if (state === "figma-detail") {
        // Figma 2804:1036 / 2804:2339 specimen copy, not verified venue facts.
        // Gallery assets and unavailable map are excluded from pixel comparison.
        const arcade: PublicArcade = {
            ...arcadeFixture,
            name: "라운드원 강남",
            identities: [],
            address: "서울 강남구 강남대로 442 지하 1층",
            latitude: 37.5,
            longitude: 127.02,
            phone: "02-000-0000",
            website: "https://roundone.co.kr/gangnam",
            playPrice: 500,
            coinCount: 1,
            notes: "지하 1층 안쪽 리듬게임 코너. 심야에는 카드 리더만 사용 가능합니다.",
            cabinets: [
                arcadeFixture.cabinets[0],
                {
                    ...arcadeFixture.cabinets[1],
                    note: "왼쪽 건반 일부 입력이 씹히는 증상",
                },
                {
                    ...arcadeFixture.cabinets[0],
                    id: 900004,
                    position: 2,
                    availability: "unavailable",
                    condition: "unknown",
                    note: "점검 중",
                },
            ],
            hours: {
                weekly: {
                    "0": { open: 600, close: 1440 },
                    "1": { open: 600, close: 1440 },
                    "2": { open: 600, close: 1440 },
                    "3": { open: 600, close: 1440 },
                    "4": { open: 600, close: 1560 },
                    "5": { open: 600, close: 1560 },
                    "6": null,
                },
                exceptions: {},
            },
            photos: ["/logo.png", "/flags/jp.png", "/flags/kr.png"].map(
                (url, index) => ({
                    id: index + 1,
                    slot: index,
                    url,
                    alt: `Synthetic gallery test image ${index + 1}`,
                    capturedAt: null,
                })
            ),
        };
        return (
            <ArcadeDetailPage
                arcade={arcade}
                appKey=""
                isAuthenticated={false}
                preferredArcadeId={null}
            />
        );
    }
    if (state === "detail" || state === "unknown" || state === "photos") {
        const arcade =
            state === "unknown"
                ? {
                      ...arcadeFixture,
                      preferredCount: null,
                      cabinets: [],
                      cabinetVerifiedAt: null,
                      lastCheckedAt: null,
                      checkCount: 0,
                      hours: null,
                      hoursVerifiedAt: null,
                      hoursValidUntil: null,
                      address: null,
                      phone: null,
                      website: null,
                      playPrice: null,
                      notes: null,
                  }
                : { ...arcadeFixture };
        if (state === "photos")
            arcade.photos = ["/logo.png", "/flags/jp.png", "/flags/kr.png"].map(
                (url, index) => ({
                    id: index + 1,
                    slot: index,
                    url,
                    alt: `Synthetic gallery test image ${index + 1}`,
                    capturedAt: null,
                })
            );
        return (
            <ArcadeDetailPage
                arcade={arcade}
                appKey=""
                isAuthenticated={false}
                preferredArcadeId={null}
            />
        );
    }
    return (
        <ArcadeDiscoveryPage
            appKey=""
            arcades={
                state === "empty"
                    ? []
                    : [
                          arcadeFixture,
                          {
                              ...arcadeFixture,
                              id: 900003,
                              slug: "presentation-unknown",
                              name: "未確認 · Unknown arcade",
                              region: "부산",
                              preferredCount: null,
                              cabinets: [],
                              hours: null,
                          },
                      ]
            }
        />
    );
}
