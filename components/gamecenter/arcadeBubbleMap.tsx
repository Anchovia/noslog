"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { type KakaoOverlay, loadKakaoMaps } from "@/lib/kakaoMaps";

import type {
    GamecenterArcade,
    GamecenterMapScope,
} from "./gamecenterExplorer";

interface ArcadeBubbleMapProps {
    appKey: string;
    arcades: GamecenterArcade[];
    scope: GamecenterMapScope;
    selectedId: number | null;
    onSelect: (arcadeId: number) => void;
}

function bubbleSize(count: number, maxCount: number) {
    if (maxCount <= 0) return 22;
    return 22 + Math.round(14 * Math.sqrt(count / maxCount));
}

const MAP_SCOPE_BOUNDS: Record<
    GamecenterMapScope,
    { southWest: [number, number]; northEast: [number, number] }
> = {
    seoul: {
        southWest: [37.413, 126.734],
        northEast: [37.715, 127.269],
    },
    gyeonggi: {
        southWest: [36.85, 126.35],
        northEast: [38.3, 127.85],
    },
    daejeon: {
        southWest: [36.18, 127.2],
        northEast: [36.5, 127.55],
    },
    gwangju: {
        southWest: [35.02, 126.65],
        northEast: [35.32, 127.05],
    },
    daegu: {
        southWest: [35.65, 128.35],
        northEast: [36.05, 128.85],
    },
    nationwide: {
        southWest: [33.0, 124.5],
        northEast: [38.8, 130.0],
    },
};

const MAP_SCOPE_LEVELS: Partial<Record<GamecenterMapScope, number>> = {
    seoul: 10,
    gyeonggi: 11,
    daejeon: 9,
    gwangju: 9,
    daegu: 9,
};

export default function ArcadeBubbleMap({
    appKey,
    arcades,
    scope,
    selectedId,
    onSelect,
}: ArcadeBubbleMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const bubblesRef = useRef(new Map<number, HTMLButtonElement>());
    const onSelectRef = useRef(onSelect);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const mappedArcades = useMemo(
        () =>
            arcades.filter(
                (arcade) =>
                    arcade.latitude !== null && arcade.longitude !== null
            ),
        [arcades]
    );

    useEffect(() => {
        onSelectRef.current = onSelect;
    }, [onSelect]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let isCancelled = false;
        const overlays: KakaoOverlay[] = [];
        const cleanupListeners: (() => void)[] = [];
        const bubbles = bubblesRef.current;

        setIsLoading(true);
        setHasError(false);
        loadKakaoMaps(appKey)
            .then((kakao) => {
                if (isCancelled) return;
                const scopeBounds = MAP_SCOPE_BOUNDS[scope];
                const center = new kakao.maps.LatLng(
                    (scopeBounds.southWest[0] + scopeBounds.northEast[0]) / 2,
                    (scopeBounds.southWest[1] + scopeBounds.northEast[1]) / 2
                );
                const map = new kakao.maps.Map(container, {
                    center,
                    level: 12,
                    scrollwheel: false,
                });
                const bounds = new kakao.maps.LatLngBounds();
                bounds.extend(new kakao.maps.LatLng(...scopeBounds.southWest));
                bounds.extend(new kakao.maps.LatLng(...scopeBounds.northEast));
                const maxCount = Math.max(
                    ...mappedArcades.map((arcade) => arcade.preferredCount),
                    0
                );

                mappedArcades.forEach((arcade) => {
                    const position = new kakao.maps.LatLng(
                        arcade.latitude!,
                        arcade.longitude!
                    );
                    bounds.extend(position);

                    const size = bubbleSize(arcade.preferredCount, maxCount);
                    const bubble = document.createElement("button");
                    bubble.type = "button";
                    bubble.className =
                        "text-caption focus-visible:ring-focus rounded-full border-2 font-bold shadow-lg transition-transform focus-visible:ring-2 focus-visible:outline-none";
                    bubble.setAttribute(
                        "aria-label",
                        `${arcade.name}, 선호 ${arcade.preferredCount}명`
                    );
                    bubble.title = `${arcade.name} · 선호 ${arcade.preferredCount}명`;
                    bubble.textContent = String(arcade.preferredCount);
                    bubble.style.width = `${size}px`;
                    bubble.style.height = `${size}px`;
                    bubble.style.borderColor = "var(--color-surface)";
                    bubble.style.background = "var(--color-chart)";
                    bubble.style.color = "var(--color-on-interactive)";
                    bubble.style.opacity =
                        arcade.preferredCount > 0 ? "0.9" : "0.7";
                    const handleClick = () => onSelectRef.current(arcade.id);
                    bubble.addEventListener("click", handleClick);
                    cleanupListeners.push(() =>
                        bubble.removeEventListener("click", handleClick)
                    );
                    bubbles.set(arcade.id, bubble);

                    const overlay = new kakao.maps.CustomOverlay({
                        map,
                        position,
                        content: bubble,
                        xAnchor: 0.5,
                        yAnchor: 0.5,
                        zIndex: 2,
                    });
                    overlays.push(overlay);
                });

                map.setBounds(bounds);
                const scopeLevel = MAP_SCOPE_LEVELS[scope];
                if (scopeLevel !== undefined) map.setLevel(scopeLevel);
                setIsLoading(false);
            })
            .catch(() => {
                if (!isCancelled) {
                    setIsLoading(false);
                    setHasError(true);
                }
            });

        return () => {
            isCancelled = true;
            overlays.forEach((overlay) => overlay.setMap(null));
            cleanupListeners.forEach((cleanup) => cleanup());
            bubbles.clear();
        };
    }, [appKey, mappedArcades, scope]);

    useEffect(() => {
        bubblesRef.current.forEach((bubble, arcadeId) => {
            const isSelected = arcadeId === selectedId;
            bubble.style.transform = isSelected ? "scale(1.12)" : "scale(1)";
            bubble.style.boxShadow = isSelected
                ? "0 0 0 3px var(--color-focus), 0 8px 18px rgba(0, 0, 0, 0.28)"
                : "0 6px 14px rgba(0, 0, 0, 0.24)";
        });
    }, [selectedId, isLoading]);

    return (
        <div className="relative h-72 w-full">
            <div
                ref={containerRef}
                className="bg-surface-muted size-full"
                aria-label="NOSTALGIA 오락실 분포 지도"
            />
            {isLoading ? (
                <div className="bg-surface-muted text-body-muted absolute inset-0 flex items-center justify-center">
                    지도를 불러오는 중입니다.
                </div>
            ) : null}
            {hasError ? (
                <div className="bg-surface-muted text-body-muted absolute inset-0 flex items-center justify-center px-6 text-center">
                    지도를 불러오지 못했습니다. 오락실 목록은 계속 확인할 수
                    있습니다.
                </div>
            ) : null}
            {!isLoading && !hasError && mappedArcades.length === 0 ? (
                <p className="bg-surface/90 text-caption absolute top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1.5 whitespace-nowrap">
                    해당 지역에 등록된 위치가 없습니다.
                </p>
            ) : null}
        </div>
    );
}
