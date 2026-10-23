import { type KakaoMapsApi, loadKakaoMaps } from "@/lib/kakao-maps";

export function createArcadeAddressQueries(address: string) {
    const roadAddress = address.match(
        /^(.+(?:대로|로|길)\s+\d+(?:-\d+)?)/
    )?.[1];
    const parcelAddress = address.match(
        /^(.+(?:동|읍|면|리)\s+\d+(?:-\d+)?)/
    )?.[1];

    return [
        ...new Set([address, roadAddress, parcelAddress].filter(Boolean)),
    ] as string[];
}

function geocode(kakao: KakaoMapsApi, address: string) {
    const geocoder = new kakao.maps.services.Geocoder();
    return new Promise<{ latitude: number; longitude: number } | null>(
        (resolve, reject) => {
            const queries = createArcadeAddressQueries(address);
            let isSettled = false;
            const timeout = window.setTimeout(() => {
                isSettled = true;
                reject(new Error("GEOCODING_TIMEOUT"));
            }, 10000);

            function finish(
                coordinates: { latitude: number; longitude: number } | null
            ) {
                if (isSettled) return;
                isSettled = true;
                window.clearTimeout(timeout);
                resolve(coordinates);
            }

            function search(index: number) {
                if (isSettled) return;
                const query = queries[index];
                if (!query) {
                    finish(null);
                    return;
                }
                geocoder.addressSearch(query, (result, status) => {
                    if (status === kakao.maps.services.Status.OK && result[0]) {
                        finish({
                            latitude: Number(result[0].y),
                            longitude: Number(result[0].x),
                        });
                        return;
                    }
                    search(index + 1);
                });
            }

            search(0);
        }
    );
}

export async function geocodeArcadeAddress(appKey: string, address: string) {
    const kakao = await loadKakaoMaps(appKey);
    return geocode(kakao, address);
}

/**
 * 검색칸 글 → 좌표(뮤즈캣 목록 「주소 · 역 · 오락실 이름」) — 주소로 먼저 찾고, 없으면 장소 이름(역 · 가게)으로.
 * 둘 다 없으면 null
 */
export async function findPlace(appKey: string, text: string) {
    const kakao = await loadKakaoMaps(appKey);
    const address = await geocode(kakao, text).catch(() => null);
    if (address) return address;
    const places = new kakao.maps.services.Places();
    return new Promise<{ latitude: number; longitude: number } | null>(
        (resolve) => {
            const timeout = window.setTimeout(() => resolve(null), 10000);
            places.keywordSearch(text, (result, status) => {
                window.clearTimeout(timeout);
                const first = result[0];
                resolve(
                    status === kakao.maps.services.Status.OK && first
                        ? {
                              latitude: Number(first.y),
                              longitude: Number(first.x),
                          }
                        : null
                );
            });
        }
    );
}

/** 좌표 → 동네 이름 「시 · 구 · 동」(카카오맵 목록 「위치」 줄과 같은 단계) — 뮤즈캣 목록 기준 위치. 못 찾으면 null */
export async function reverseGeocode(
    appKey: string,
    latitude: number,
    longitude: number
) {
    const kakao = await loadKakaoMaps(appKey);
    const geocoder = new kakao.maps.services.Geocoder();
    return new Promise<string | null>((resolve) => {
        geocoder.coord2Address(longitude, latitude, (result, status) => {
            const area = result[0]?.address;
            resolve(
                status === kakao.maps.services.Status.OK && area
                    ? [
                          area.region_1depth_name,
                          area.region_2depth_name,
                          area.region_3depth_name,
                      ]
                          .filter(Boolean)
                          .join(" ")
                    : null
            );
        });
    });
}
