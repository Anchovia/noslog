"use client";

import { useEffect, useRef, useState } from "react";

import { loadKakaoMaps } from "@/lib/kakaoMaps";

interface ArcadeMiniMapProps {
    appKey: string;
    name: string;
    latitude: number;
    longitude: number;
}

export default function ArcadeMiniMap({
    appKey,
    name,
    latitude,
    longitude,
}: ArcadeMiniMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let marker: { setMap(map: null): void } | null = null;
        let frame = 0;
        let isCancelled = false;

        loadKakaoMaps(appKey)
            .then((kakao) => {
                if (isCancelled) return;
                const center = new kakao.maps.LatLng(latitude, longitude);
                const map = new kakao.maps.Map(container, {
                    center,
                    level: 3,
                    scrollwheel: false,
                });
                marker = new kakao.maps.Marker({ map, position: center });
                frame = requestAnimationFrame(() => map.relayout());
            })
            .catch(() => {
                if (!isCancelled) setHasError(true);
            });

        return () => {
            isCancelled = true;
            cancelAnimationFrame(frame);
            marker?.setMap(null);
        };
    }, [appKey, latitude, longitude]);

    if (hasError) {
        return (
            <div className="bg-surface-muted text-body-muted flex h-44 items-center justify-center">
                지도를 불러오지 못했습니다.
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="bg-surface-muted h-44 w-full"
            role="img"
            aria-label={`${name} 위치 지도`}
        />
    );
}
