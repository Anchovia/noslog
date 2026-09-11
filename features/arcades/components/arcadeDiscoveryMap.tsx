"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { CircleAlert, Minus, Plus } from "lucide-react";
import { useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import { loadKakaoMaps } from "@/lib/kakaoMaps";
import type { KakaoMapInstance, KakaoOverlay } from "@/lib/kakaoMaps";

type KakaoApi = Awaited<ReturnType<typeof loadKakaoMaps>>;

// 목록 카드를 눌렀을 때 옮겨 갈 확대 단계 — 동네 골목이 보이고 이웃 핀이 따로 갈라지는 단계
const FOCUS_CARD_LEVEL = 4;
import type { PublicArcade } from "@/features/arcades/schemas/publicArcadeSchema";
import type { ArcadeBounds } from "@/features/arcades/types/arcadeGeography";
import {
    clusterDiameter,
    groupMapPoints,
} from "@/features/arcades/arcadeMapSymbols";

// 핀 하나의 SVG — lucide map-pin 기하(24 상자). 채움 핀이라 아이콘 스트로크 규칙 밖
const PIN_PATH =
    "M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z";

/**
 * 오락실 지도 — 축소하면 범위 안 개수를 든 원(버블), 확대하면 오락실마다 핀.
 * 핀을 누르면 그 오락실이 선택되고(목록 카드와 같은 집합), 버블을 누르면 그 범위로 확대한다.
 * 지도를 움직이면 「이 지역에서 검색」 이 떠서 목록을 그 범위로 좁힌다.
 */
export default function ArcadeDiscoveryMap({
    appKey,
    arcades,
    selectedId,
    onSelect,
    onSearchArea,
    onExpand,
    inlineError = false,
    focusLevel = 5,
    focusRequest = null,
    wheelZoom = false,
}: {
    appKey: string;
    arcades: PublicArcade[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    onSearchArea?: (bounds: ArcadeBounds) => void;
    onExpand?: () => void;
    inlineError?: boolean;
    /** 오락실이 하나일 때 쓰는 확대 단계(상세 위치 지도는 더 가깝게) */
    focusLevel?: number;
    /** 이 오락실로 옮겨 가 확대 — seq 가 바뀔 때마다 한 번(같은 카드를 다시 눌러도 다시 옮긴다) */
    focusRequest?: { id: number; seq: number } | null;
    /** 마우스 휠 확대·축소 — 지도 전용 영역(목록 페이지)에서만. 페이지 흐름에 끼인 지도는 스크롤이 걸려 끈다 */
    wheelZoom?: boolean;
}) {
    const t = useTranslations();
    const container = useRef<HTMLDivElement>(null);
    const mapRef = useRef<KakaoMapInstance | null>(null);
    const apiRef = useRef<KakaoApi | null>(null);
    // 코드가 옮긴 이동(카드 → 핀)은 「이 지역에서 검색」 을 띄우지 않는다 — 이용자가 움직였을 때만
    const programmaticMove = useRef(false);
    // 마지막으로 옮겨 간 좌표 — 지도 크기가 바뀌면(전체 지도 모드 전환) 다시 가운데로. 이용자가 끌면 잊는다
    const focusedPoint = useRef<{ latitude: number; longitude: number } | null>(
        null
    );
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
                apiRef.current = api;
                const map = new api.maps.Map(container.current, {
                    center: new api.maps.LatLng(36.2, 127.5),
                    level: 12,
                    scrollwheel: wheelZoom,
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
                    if (mapped.length === 1) map.setLevel(focusLevel);
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
                        const selected =
                            !cluster && arcade.id === currentSelected();
                        const button = document.createElement("button");
                        button.type = "button";
                        button.className = cluster
                            ? "nl-arcade-marker nl-arcade-marker--bubble"
                            : "nl-arcade-marker nl-arcade-marker--pin";
                        button.dataset.markerKey = group.points
                            .map((point) => point.arcade.id)
                            .sort((a, b) => a - b)
                            .join("-");
                        button.setAttribute(
                            "aria-label",
                            cluster
                                ? t("arcades.cluster", {
                                      count: group.points.length,
                                  })
                                : arcade.name
                        );
                        if (cluster) {
                            const face = document.createElement("span");
                            face.className =
                                "nl-arcade-marker__bubble nl-control";
                            const diameter = clusterDiameter(
                                group.points.length
                            );
                            face.style.width = `${diameter}px`;
                            face.style.height = `${diameter}px`;
                            face.textContent = String(group.points.length);
                            button.append(face);
                        } else {
                            button.setAttribute(
                                "aria-pressed",
                                String(selected)
                            );
                            const svg = document.createElementNS(
                                "http://www.w3.org/2000/svg",
                                "svg"
                            );
                            svg.setAttribute("viewBox", "0 0 24 24");
                            svg.setAttribute("aria-hidden", "true");
                            svg.classList.add("nl-arcade-marker__pin");
                            const path = document.createElementNS(
                                "http://www.w3.org/2000/svg",
                                "path"
                            );
                            path.setAttribute("d", PIN_PATH);
                            svg.append(path);
                            button.append(svg);
                        }
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
                                // 핀은 끝이 좌표를 가리키고, 버블은 중심이 좌표
                                yAnchor: cluster ? 0.5 : 1,
                                zIndex: selected ? 3 : cluster ? 1 : 2,
                            })
                        );
                        if (focused === button.dataset.markerKey)
                            button.focus({ preventScroll: true });
                    }
                };
                renderRef.current = render;
                const markBounds = () => {
                    if (programmaticMove.current) return;
                    focusedPoint.current = null;
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
                const settle = () => {
                    programmaticMove.current = false;
                };
                api.maps.event.addListener(map, "idle", render);
                api.maps.event.addListener(map, "idle", settle);
                api.maps.event.addListener(map, "dragend", markBounds);
                api.maps.event.addListener(map, "zoom_changed", markBounds);
                const observer = new ResizeObserver(() => {
                    map.relayout();
                    const point = focusedPoint.current;
                    // 크기가 바뀌는 순간에는 애니메이션 없이 제자리로
                    if (point) {
                        programmaticMove.current = true;
                        map.setCenter(
                            new api.maps.LatLng(point.latitude, point.longitude)
                        );
                    }
                    render();
                });
                observer.observe(container.current);
                cleanup = () => {
                    observer.disconnect();
                    api.maps.event.removeListener(map, "idle", render);
                    api.maps.event.removeListener(map, "idle", settle);
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
            apiRef.current = null;
            canvas.replaceChildren();
        };
    }, [appKey, attempt, focusLevel, t, wheelZoom]);

    useEffect(() => {
        renderRef.current?.();
    }, [arcades, selectedId]);

    // 카드를 누르면 그 핀으로 — 이미 더 가까이 보고 있으면 확대 단계는 그대로 두고 옮기기만 한다
    const focusArcade = useEffectEvent((id: number) => {
        const map = mapRef.current;
        const api = apiRef.current;
        const arcade = arcades.find((item) => item.id === id);
        if (
            !map ||
            !api ||
            !arcade ||
            arcade.latitude === null ||
            arcade.longitude === null
        )
            return;
        programmaticMove.current = true;
        focusedPoint.current = {
            latitude: arcade.latitude,
            longitude: arcade.longitude,
        };
        // 모드 전환으로 크기가 막 바뀐 경우를 위해 먼저 크기를 다시 읽는다(ResizeObserver 보다 먼저 올 수 있다)
        map.relayout();
        if (map.getLevel() > FOCUS_CARD_LEVEL) map.setLevel(FOCUS_CARD_LEVEL);
        map.panTo(new api.maps.LatLng(arcade.latitude, arcade.longitude));
    });
    useEffect(() => {
        if (focusRequest && state === "ready") focusArcade(focusRequest.id);
    }, [focusRequest, state]);

    return (
        <div
            className="nl-arcade-map"
            data-state={state}
            data-inline-error={(inlineError && state === "error") || undefined}
            aria-label={t("arcades.distributionMap")}
        >
            <div className="nl-arcade-map__canvas" ref={container} />
            {state !== "ready" ? (
                <div
                    className="nl-arcade-map__status nl-body-secondary"
                    role="status"
                >
                    {inlineError && state === "error" ? (
                        <CircleAlert className="nl-icon" aria-hidden />
                    ) : null}
                    <p>
                        {t(
                            state === "loading"
                                ? "arcades.mapLoading"
                                : inlineError
                                  ? "arcades.mapLoadError"
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
            {onSearchArea ? (
                <details
                    hidden={inlineError && state === "error"}
                    className="nl-arcade-map__legend nl-metadata"
                >
                    <summary>{t("arcades.legend")}</summary>
                    <ul>
                        {(
                            [
                                "arcades.legendPin",
                                "arcades.legendBubble",
                                "arcades.legendSelected",
                            ] as const
                        ).map((key) => (
                            <li key={key}>{t(key)}</li>
                        ))}
                    </ul>
                </details>
            ) : null}
        </div>
    );
}
