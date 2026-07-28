"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import { type KakaoMapInstance, loadKakaoMaps } from "@/lib/kakaoMaps";

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
    const t = useTranslations();
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<KakaoMapInstance | null>(null);
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
                    scrollwheel: true,
                });
                mapRef.current = map;
                marker = new kakao.maps.Marker({ map, position: center });
                frame = requestAnimationFrame(() => map.relayout());
            })
            .catch(() => {
                if (!isCancelled) setHasError(true);
            });

        return () => {
            isCancelled = true;
            mapRef.current = null;
            cancelAnimationFrame(frame);
            marker?.setMap(null);
        };
    }, [appKey, latitude, longitude]);

    if (hasError) {
        return (
            <div className="bg-surface-muted text-body-muted flex h-44 items-center justify-center">
                {t("arcades.mapLoadError")}
            </div>
        );
    }

    function changeZoom(change: number) {
        const map = mapRef.current;
        if (!map) return;
        map.setLevel(Math.min(14, Math.max(1, map.getLevel() + change)));
    }

    return (
        <div className="relative h-44 w-full">
            <div
                ref={containerRef}
                className="bg-surface-muted size-full"
                role="img"
                aria-label={t("arcades.locationMap", { name })}
            />
            <div
                className="border-border bg-surface absolute right-2 bottom-2 z-10 flex flex-col overflow-hidden rounded-md border shadow-md"
                role="group"
                aria-label={t("arcades.zoomControls")}
            >
                <button
                    type="button"
                    onClick={() => changeZoom(-1)}
                    className="hover:bg-surface-muted focus-visible:ring-focus/40 flex size-8 items-center justify-center focus-visible:ring-2 focus-visible:outline-none"
                    aria-label={t("arcades.zoomIn")}
                >
                    <Plus className="size-4" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    onClick={() => changeZoom(1)}
                    className="border-divider hover:bg-surface-muted focus-visible:ring-focus/40 flex size-8 items-center justify-center border-t focus-visible:ring-2 focus-visible:outline-none"
                    aria-label={t("arcades.zoomOut")}
                >
                    <Minus className="size-4" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}
