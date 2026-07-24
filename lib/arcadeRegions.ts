export const ARCADE_REGIONS = [
    "서울",
    "경기",
    "대전",
    "광주",
    "대구",
    "기타",
] as const;

export type ArcadeRegion = (typeof ARCADE_REGIONS)[number];

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
            (candidate) => candidate !== "기타" && location.includes(candidate)
        ) ?? "기타"
    );
}
