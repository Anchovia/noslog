import { loadKakaoMaps, type KakaoMapsApi } from "@/lib/kakaoMaps";

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
