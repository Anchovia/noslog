"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { type KakaoOverlay, loadKakaoMaps } from "@/lib/kakaoMaps";

import type { GamecenterArcade } from "./gamecenterExplorer";

interface ArcadeBubbleMapProps {
    appKey: string;
    arcades: GamecenterArcade[];
    selectedId: number | null;
    onSelect: (arcadeId: number) => void;
}

function bubbleSize(count: number, maxCount: number) {
    if (maxCount <= 0) return 34;
    return 34 + Math.round(28 * Math.sqrt(count / maxCount));
}

export default function ArcadeBubbleMap({
    appKey,
    arcades,
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
        if (!container || mappedArcades.length === 0) {
            setIsLoading(false);
            return;
        }

        let isCancelled = false;
        const overlays: KakaoOverlay[] = [];
        const cleanupListeners: (() => void)[] = [];
        const bubbles = bubblesRef.current;

        setIsLoading(true);
        setHasError(false);
        loadKakaoMaps(appKey)
            .then((kakao) => {
                if (isCancelled) return;
                const first = mappedArcades[0];
                const center = new kakao.maps.LatLng(
                    first.latitude!,
                    first.longitude!
                );
                const map = new kakao.maps.Map(container, {
                    center,
                    level: 12,
                    scrollwheel: false,
                });
                const bounds = new kakao.maps.LatLngBounds();
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

                if (mappedArcades.length > 1) map.setBounds(bounds);
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
    }, [appKey, mappedArcades]);

    useEffect(() => {
        bubblesRef.current.forEach((bubble, arcadeId) => {
            const isSelected = arcadeId === selectedId;
            bubble.style.transform = isSelected ? "scale(1.12)" : "scale(1)";
            bubble.style.boxShadow = isSelected
                ? "0 0 0 3px var(--color-focus), 0 8px 18px rgba(0, 0, 0, 0.28)"
                : "0 6px 14px rgba(0, 0, 0, 0.24)";
        });
    }, [selectedId, isLoading]);

    if (mappedArcades.length === 0) {
        return (
            <div className="bg-surface-muted text-body-muted flex h-72 items-center justify-center px-6 text-center">
                지도에 표시할 오락실 위치를 준비하고 있습니다.
            </div>
        );
    }

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
        </div>
    );
}
