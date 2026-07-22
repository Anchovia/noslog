export interface KakaoLatLng {
    getLat(): number;
    getLng(): number;
}

export interface KakaoMapInstance {
    setBounds(bounds: KakaoLatLngBounds): void;
    panTo(position: KakaoLatLng): void;
    relayout(): void;
}

export interface KakaoLatLngBounds {
    extend(position: KakaoLatLng): void;
}

export interface KakaoOverlay {
    setMap(map: KakaoMapInstance | null): void;
}

interface GeocoderResult {
    x: string;
    y: string;
}

interface KakaoGeocoder {
    addressSearch(
        address: string,
        callback: (result: GeocoderResult[], status: string) => void
    ): void;
}

export interface KakaoMapsApi {
    maps: {
        load(callback: () => void): void;
        LatLng: new (latitude: number, longitude: number) => KakaoLatLng;
        LatLngBounds: new () => KakaoLatLngBounds;
        Map: new (
            container: HTMLElement,
            options: {
                center: KakaoLatLng;
                level: number;
                scrollwheel?: boolean;
            }
        ) => KakaoMapInstance;
        Marker: new (options: {
            map?: KakaoMapInstance;
            position: KakaoLatLng;
        }) => KakaoOverlay;
        CustomOverlay: new (options: {
            map?: KakaoMapInstance;
            position: KakaoLatLng;
            content: HTMLElement;
            xAnchor?: number;
            yAnchor?: number;
            zIndex?: number;
        }) => KakaoOverlay;
        services: {
            Geocoder: new () => KakaoGeocoder;
            Status: { OK: string };
        };
    };
}

declare global {
    interface Window {
        kakao?: KakaoMapsApi;
        __noslogKakaoMapsPromise?: Promise<KakaoMapsApi>;
    }
}

export function loadKakaoMaps(appKey: string) {
    if (typeof window === "undefined") {
        return Promise.reject(
            new Error("Kakao Maps는 브라우저에서만 사용할 수 있습니다.")
        );
    }
    if (!appKey) {
        return Promise.reject(
            new Error("Kakao Maps JavaScript 키가 없습니다.")
        );
    }
    if (window.__noslogKakaoMapsPromise) {
        return window.__noslogKakaoMapsPromise;
    }

    window.__noslogKakaoMapsPromise = new Promise<KakaoMapsApi>(
        (resolve, reject) => {
            const rejectLoading = (message: string) => {
                document.getElementById("kakao-maps-sdk")?.remove();
                reject(new Error(message));
            };
            const finishLoading = () => {
                if (!window.kakao?.maps) {
                    rejectLoading("Kakao Maps SDK를 불러오지 못했습니다.");
                    return;
                }
                window.kakao.maps.load(() => resolve(window.kakao!));
            };

            const existingScript = document.getElementById(
                "kakao-maps-sdk"
            ) as HTMLScriptElement | null;
            if (existingScript) {
                if (window.kakao) finishLoading();
                else
                    existingScript.addEventListener("load", finishLoading, {
                        once: true,
                    });
                return;
            }

            const script = document.createElement("script");
            script.id = "kakao-maps-sdk";
            script.async = true;
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&libraries=services&autoload=false`;
            script.addEventListener("load", finishLoading, { once: true });
            script.addEventListener(
                "error",
                () => rejectLoading("Kakao Maps SDK 요청에 실패했습니다."),
                { once: true }
            );
            document.head.appendChild(script);
        }
    ).catch((error) => {
        window.__noslogKakaoMapsPromise = undefined;
        throw error;
    });

    return window.__noslogKakaoMapsPromise;
}
