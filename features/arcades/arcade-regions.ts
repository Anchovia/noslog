export const ARCADE_REGIONS = [
    "서울",
    "경기",
    "대전",
    "충남",
    "광주",
    "대구",
    "기타",
] as const;

export type ArcadeRegion = (typeof ARCADE_REGIONS)[number];

// 주소에 줄임말이 아니라 정식 이름으로 적힌 지역 — 「충청남도 천안시 …」 는 「충남」 을 포함하지 않는다
const REGION_ALIASES: Partial<Record<ArcadeRegion, readonly string[]>> = {
    충남: ["충청남도"],
};

export function isArcadeRegion(value: string): value is ArcadeRegion {
    return ARCADE_REGIONS.includes(value as ArcadeRegion);
}

export function getStoredArcadeRegion(value: string | null | undefined) {
    const region = value?.trim() ?? "";
    return isArcadeRegion(region) ? region : "기타";
}

// 기존 자유 입력 데이터는 관리자 편집 화면에서 저장할 고정 지역을 제안함
export function inferLegacyArcadeRegion(
    region: string | null | undefined,
    address: string | null | undefined
): ArcadeRegion {
    const storedRegion = region?.trim() ?? "";
    if (isArcadeRegion(storedRegion)) return storedRegion;

    const location = `${storedRegion} ${address ?? ""}`;
    return (
        ARCADE_REGIONS.find(
            (candidate) =>
                candidate !== "기타" &&
                [candidate, ...(REGION_ALIASES[candidate] ?? [])].some((name) =>
                    location.includes(name)
                )
        ) ?? "기타"
    );
}
