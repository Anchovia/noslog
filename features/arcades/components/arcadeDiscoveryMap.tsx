"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import { loadKakaoMaps } from "@/lib/kakaoMaps";
import type { KakaoMapInstance, KakaoOverlay } from "@/lib/kakaoMaps";
import type { PublicArcade } from "@/features/arcades/schemas/publicArcadeSchema";
import type { ArcadeBounds } from "@/features/arcades/types/arcadeGeography";
import {
    groupMapPoints,
    preferenceDiameter,
} from "@/features/arcades/arcadeMapSymbols";

export default function ArcadeDiscoveryMap({
    appKey,
    arcades,
    selectedId,
    onSelect,
    onSearchArea,
    onExpand,
}: {
    appKey: string;
    arcades: PublicArcade[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    onSearchArea?: (bounds: ArcadeBounds) => void;
    onExpand?: () => void;
}) {
    const t = useTranslations();
    const container = useRef<HTMLDivElement>(null);
    const mapRef = useRef<KakaoMapInstance | null>(null);
    const renderRef = useRef<(() => void) | null>(null);
    const [state, setState] = useState<"loading" | "ready" | "error">(
        "loading"
    );
    const [pendingBounds, setPendingBounds] = useState<ArcadeBounds | null>(
        null
    );
    const [attempt, setAttempt] = useState(0);
    const select = useEffectEvent(onSelect);
    const currentArcades = useEffectEvent(() => arcades);
    const currentSelected = useEffectEvent(() => selectedId);

    useEffect(() => {
        if (!container.current) return;
        const canvas = container.current;
        let disposed = false;
        let overlays: KakaoOverlay[] = [];
        let cleanup = () => {};
        setState("loading");
        loadKakaoMaps(appKey)
            .then((api) => {
                if (disposed || !container.current) return;
                const map = new api.maps.Map(container.current, {
                    center: new api.maps.LatLng(36.2, 127.5),
                    level: 12,
                    scrollwheel: false,
                });
                mapRef.current = map;
                const mapped = currentArcades().filter(
                    (item) => item.latitude !== null && item.longitude !== null
                );
                if (mapped.length) {
                    const bounds = new api.maps.LatLngBounds();
                    mapped.forEach((item) =>
                        bounds.extend(
                            new api.maps.LatLng(item.latitude!, item.longitude!)
                        )
                    );
                    map.setBounds(bounds);
                    if (mapped.length === 1) map.setLevel(5);
                }
                const render = () => {
                    const focused =
                        document.activeElement instanceof HTMLElement &&
                        canvas.contains(document.activeElement)
                            ? document.activeElement.dataset.markerKey
                            : undefined;
                    overlays.forEach((overlay) => overlay.setMap(null));
                    overlays = [];
                    const projection = map.getProjection();
                    const points = currentArcades()
                        .filter(
                            (item) =>
                                item.latitude !== null &&
                                item.longitude !== null
                        )
                        .map((arcade) => ({
                            ...projection.containerPointFromCoords(
                                new api.maps.LatLng(
                                    arcade.latitude!,
                                    arcade.longitude!
                                )
                            ),
                            arcade,
                        }));
                    for (const group of groupMapPoints(points)) {
                        const cluster = group.points.length > 1;
                        const arcade = group.points[0].arcade;
                        const button = document.createElement("button");
                        button.type = "button";
                        button.className = "nl-arcade-marker";
                        button.dataset.markerKey = group.points
                            .map((point) => point.arcade.id)
                            .sort((a, b) => a - b)
                            .join("-");
                        const label = cluster
                            ? t("arcades.cluster", {
                                  count: group.points.length,
                              })
                            : arcade.preferredCount === null
                              ? arcade.name
                              : t("arcades.bubbleAria", {
                                    name: arcade.name,
                                    count: arcade.preferredCount,
                                });
                        button.setAttribute("aria-label", label);
                        const face = document.createElement("span");
                        face.className = cluster
                            ? "nl-arcade-marker__cluster nl-control"
                            : "nl-arcade-marker__bubble nl-control";
                        face.textContent = cluster
                            ? label
                            : arcade.preferredCount === null
                              ? ""
                              : String(arcade.preferredCount);
                        if (!cluster) {
                            const diameter = preferenceDiameter(
                                arcade.preferredCount
                            );
                            face.style.width = `${diameter}px`;
                            face.style.height = `${diameter}px`;
                            if (arcade.preferredCount === null)
                                face.classList.add(
                                    "nl-arcade-marker__bubble--small"
                                );
                            button.setAttribute(
                                "aria-pressed",
                                String(arcade.id === currentSelected())
                            );
                        }
                        button.append(face);
                        button.addEventListener("click", () => {
                            if (cluster) {
                                const bounds = new api.maps.LatLngBounds();
                                group.points.forEach((point) =>
                                    bounds.extend(
                                        new api.maps.LatLng(
                                            point.arcade.latitude!,
                                            point.arcade.longitude!
                                        )
                                    )
                                );
                                map.setBounds(bounds);
                            } else select(arcade.id);
                        });
                        const latitude =
                            group.points.reduce(
                                (sum, point) => sum + point.arcade.latitude!,
                                0
                            ) / group.points.length;
                        const longitude =
                            group.points.reduce(
                                (sum, point) => sum + point.arcade.longitude!,
                                0
                            ) / group.points.length;
                        overlays.push(
                            new api.maps.CustomOverlay({
                                map,
                                position: new api.maps.LatLng(
                                    latitude,
                                    longitude
                                ),
                                content: button,
                                xAnchor: 0.5,
                                yAnchor: 0.5,
                                zIndex: arcade.id === currentSelected() ? 3 : 2,
                            })
                        );
                        if (focused === button.dataset.markerKey)
                            button.focus({ preventScroll: true });
                    }
                };
                renderRef.current = render;
                const markBounds = () => {
                    const bounds = map.getBounds();
                    const southWest = bounds.getSouthWest();
                    const northEast = bounds.getNorthEast();
                    setPendingBounds({
                        south: southWest.getLat(),
                        west: southWest.getLng(),
                        north: northEast.getLat(),
                        east: northEast.getLng(),
                    });
                };
                api.maps.event.addListener(map, "idle", render);
                api.maps.event.addListener(map, "dragend", markBounds);
                api.maps.event.addListener(map, "zoom_changed", markBounds);
                const observer = new ResizeObserver(() => {
                    map.relayout();
                    render();
                });
                observer.observe(container.current);
                cleanup = () => {
                    observer.disconnect();
                    api.maps.event.removeListener(map, "idle", render);
                    api.maps.event.removeListener(map, "dragend", markBounds);
                    api.maps.event.removeListener(
                        map,
                        "zoom_changed",
                        markBounds
                    );
                };
                render();
                setState("ready");
            })
            .catch(() => {
                if (!disposed) setState("error");
            });
        return () => {
            disposed = true;
            cleanup();
            overlays.forEach((overlay) => overlay.setMap(null));
            renderRef.current = null;
            mapRef.current = null;
            canvas.replaceChildren();
        };
    }, [appKey, attempt, t]);

    useEffect(() => {
        renderRef.current?.();
    }, [arcades, selectedId]);

    return (
        <div
            className="nl-arcade-map"
            data-state={state}
            aria-label={t("arcades.distributionMap")}
        >
            <div className="nl-arcade-map__canvas" ref={container} />
            {state !== "ready" ? (
                <div
                    className="nl-arcade-map__status nl-body-secondary"
                    role="status"
                >
                    <p>
                        {t(
                            state === "loading"
                                ? "arcades.mapLoading"
                                : "arcades.mapListFallback"
                        )}
                    </p>
                    {state === "error" ? (
                        <Button
                            variant="secondary"
                            appearance="foundation"
                            size="sm"
                            onClick={() => setAttempt((value) => value + 1)}
                        >
                            {t("common.retry")}
                        </Button>
                    ) : null}
                </div>
            ) : (
                <>
                    <div className="nl-arcade-map__zoom">
                        <button
                            type="button"
                            className="nl-icon-button"
                            aria-label={t("arcades.zoomIn")}
                            onClick={() =>
                                mapRef.current?.setLevel(
                                    Math.max(1, mapRef.current.getLevel() - 1)
                                )
                            }
                        >
                            <Plus className="nl-icon" aria-hidden />
                        </button>
                        <button
                            type="button"
                            className="nl-icon-button"
                            aria-label={t("arcades.zoomOut")}
                            onClick={() =>
                                mapRef.current?.setLevel(
                                    Math.min(14, mapRef.current.getLevel() + 1)
                                )
                            }
                        >
                            <Minus className="nl-icon" aria-hidden />
                        </button>
                    </div>
                    {pendingBounds && onSearchArea ? (
                        <button
                            className="nl-arcade-map__area nl-control"
                            type="button"
                            onClick={() => {
                                onSearchArea(pendingBounds);
                                setPendingBounds(null);
                            }}
                        >
                            {t("arcades.searchArea")}
                        </button>
                    ) : null}
                </>
            )}
            {onExpand && state === "ready" ? (
                <button
                    type="button"
                    className="nl-arcade-map__expand nl-control"
                    onClick={onExpand}
                >
                    {t("arcades.mapView")}
                </button>
            ) : null}
            <details className="nl-arcade-map__legend nl-metadata">
                <summary>{t("arcades.legend")}</summary>
                <ul>
                    {(
                        [
                            "arcades.legendCluster",
                            "arcades.legendPreference",
                            "arcades.legendSmall",
                            "arcades.legendSelected",
                        ] as const
                    ).map((key) => (
                        <li key={key}>{t(key)}</li>
                    ))}
                </ul>
            </details>
        </div>
    );
}
