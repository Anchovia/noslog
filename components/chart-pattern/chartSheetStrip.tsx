"use client";

import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import type { ChartDocument } from "@/lib/chart-pattern/schema";
import {
    formatBpm,
    formatEditorTime,
    type MeasureMarker,
} from "@/lib/chart-pattern/timing";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

import {
    PADDING_BOTTOM,
    PADDING_TOP,
    PANEL_HEIGHT,
    PANEL_MEASURE_EDGE_INSET,
    PANEL_WIDTH,
    drawPanel,
    type SheetPanel,
} from "./chartSheetViewer";

/**
 * 전체 악보 = 열을 아래→위로 이어 붙인 세로 띠 하나 + 같은 띠의 축소판(미니맵).
 * 가로 스크롤을 없애고, 열 안 읽기 방향(아래→위)과 열 사이 이동 방향을 같게 한다.
 * 열 그리기(drawPanel)는 문서 07에 따라 손대지 않고 배치·스크롤·탐색만 담당한다.
 *
 * - 본문: 보이는 열 ±1만 캔버스로 그린다(가상화). 배율은 폭에서 유도(안쪽 폭 / 276, 상한 2.0) — 전 폭 공통.
 *   프레임 높이는 Compact 560, 672+ 는 뷰포트에서 유도(CSS).
 * - 이음새: 열 그림의 위 30·아래 34 여백(시각 라벨 자리)은 안쪽 이음새에서 잘라 마디선이 이어지게 한다.
 *   첫 열 아래(BPM·박자 띠)와 마지막 열 위(끝 시각 띠)도 자른다 — 전체 길이는 읽기 줄에 있고,
 *   시작 BPM·박자는 뷰어가 첫 마디선 아래에 라벨로 얹는다. 경계 시각도 같은 방식.
 * - 미니맵: 열마다 저해상도 썸네일 하나. Compact 는 오버레이(평상시 높이 40%·썸네일 30%, 탭하면 전체·100%,
 *   바깥 탭으로 닫힘),
 *   672+ 는 옆 레일 96. 뷰포트 사각형을 끌거나 아무 데나 누르면 본문이 이동한다.
 * - 읽기 한 줄: 「현재 시각 / 전체 길이」(보이는 영역 아래 끝 = 가장 이른 지점, osu! 재생 헤드 기준) aria-live.
 *   열 단위는 4마디라는 구현 사정이라 밖으로 내지 않는다. PageUp/Down 은 화면 높이, Home/End 는 양 끝.
 */

const MINI_SCALE_COMPACT = 0.16;
const MINI_WIDTH_COMPACT = 64;
const MINI_WIDTH_WIDE = 96;
const FRAME_HEIGHT_COMPACT = 560;
const MAIN_SCALE_MAX = 2;

export default function ChartSheetStrip({
    panels,
    document,
    measureMarkers,
    durationMs,
}: {
    panels: SheetPanel[];
    document: ChartDocument;
    measureMarkers: MeasureMarker[];
    durationMs: number;
}) {
    const t = useTranslations();
    // 레일 배치는 Intermediate(672+)부터 — 본문 414 + 레일 96 + 여백이 624 안에 들어온다
    const wide = useMediaQuery("(min-width: 672px)");
    const mainRef = useRef<HTMLDivElement | null>(null);
    const miniRef = useRef<HTMLDivElement | null>(null);
    const [mainWidth, setMainWidth] = useState(PANEL_WIDTH);
    const [viewportHeight, setViewportHeight] = useState(FRAME_HEIGHT_COMPACT);
    const [scrollTop, setScrollTop] = useState<number | null>(null);
    // Compact 오버레이 열림 — 탭으로 열고, 바깥을 탭하면 닫힌다(누르는 동안만 열리던 방식은 손가락이 노트를 가려 사용자 기각)
    const [miniOpen, setMiniOpen] = useState(false);
    const dragging = useRef(false);
    const gesture = useRef({ startY: 0, moved: false, wasOpen: false });

    // 본문 배율 — 프레임 안쪽 폭에서 유도, 상한 2.0(그 위는 한 화면에 1.5마디뿐이라 사용자 기각)
    const mainScale = Math.min(MAIN_SCALE_MAX, mainWidth / PANEL_WIDTH);
    // 열의 마디 영역 높이(위아래 여백을 뺀 값)
    // 순환 import(viewer ↔ strip)라 모듈 수준에서 viewer 상수를 계산하면 TDZ 오류 — 렌더 시점에 계산
    const contentHeight = PANEL_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
    const columnHeight = Math.round(contentHeight * mainScale);
    const padTop = Math.round(PADDING_TOP * mainScale);
    const columnWidth = Math.round(PANEL_WIDTH * mainScale);
    const miniWidth = wide ? MINI_WIDTH_WIDE : MINI_WIDTH_COMPACT;
    const miniScale = wide ? miniWidth / PANEL_WIDTH : MINI_SCALE_COMPACT;
    const miniColumnHeight = Math.round(PANEL_HEIGHT * miniScale);
    // 첫 열은 마디선 아래 inset(5) 만큼 더 잘라 그 밑의 BPM 글자 윗부분이 비치지 않게 한다
    const firstColumnCrop = Math.round(PANEL_MEASURE_EDGE_INSET * mainScale);
    const totalHeight = columnHeight * panels.length - firstColumnCrop;
    const miniTotalHeight = miniColumnHeight * panels.length;

    const startMarker = measureMarkers[0];
    // 띠는 위가 곡의 끝, 아래가 시작 — DOM 순서는 마지막 열부터
    const reversed = useMemo(() => [...panels].reverse(), [panels]);

    // 폭은 첫 레이아웃에서 동기로 읽고, 이후 변화는 ResizeObserver 로 따라간다
    useLayoutEffect(() => {
        const main = mainRef.current;
        if (!main) return;
        setMainWidth(Math.max(1, main.clientWidth));
        setViewportHeight(Math.max(1, main.clientHeight));
        const observer = new ResizeObserver(([entry]) => {
            setMainWidth(Math.max(1, Math.round(entry.contentRect.width)));
            setViewportHeight(
                Math.max(1, Math.round(entry.contentRect.height))
            );
        });
        observer.observe(main);
        return () => observer.disconnect();
    }, []);

    // 열 높이가 바뀌면(배율 변경) 곡 기준 위치를 유지한다 — 뷰포트 아래 끝이 가리키던 지점을 같은 비율로 옮긴다
    const previousTotal = useRef(totalHeight);
    useLayoutEffect(() => {
        const main = mainRef.current;
        const before = previousTotal.current;
        previousTotal.current = totalHeight;
        if (!main || before === totalHeight || before === 0) return;
        const bottomFromStart = before - (main.scrollTop + main.clientHeight);
        main.scrollTop =
            totalHeight -
            main.clientHeight -
            bottomFromStart * (totalHeight / before);
        setScrollTop(main.scrollTop);
    }, [totalHeight]);

    // 첫 진입은 곡의 시작(맨 아래)
    useLayoutEffect(() => {
        const main = mainRef.current;
        if (!main || scrollTop !== null) return;
        main.scrollTop = main.scrollHeight;
        setScrollTop(main.scrollTop);
    }, [scrollTop, totalHeight]);

    const top = scrollTop ?? Math.max(0, totalHeight - viewportHeight);
    const viewportBottomFromStart = totalHeight - (top + viewportHeight);
    // 보이는 영역 아래 끝의 시각 — 열 안에서 선형 보간(첫 열 아래 여백은 0초)
    const bottomFromStart = Math.max(
        0,
        viewportBottomFromStart + firstColumnCrop
    );
    const bottomIndex = Math.min(
        panels.length - 1,
        Math.floor(bottomFromStart / columnHeight)
    );
    const bottomPanel = panels[bottomIndex];
    const currentMs = bottomPanel
        ? Math.min(
              durationMs,
              bottomPanel.startMs +
                  ((bottomFromStart - bottomIndex * columnHeight) /
                      columnHeight) *
                      (bottomPanel.endMs - bottomPanel.startMs)
          )
        : 0;

    // 가상화: 보이는 열 ±1
    const firstVisible = Math.max(
        0,
        Math.floor(bottomFromStart / columnHeight) - 1
    );
    const lastVisible = Math.min(
        panels.length - 1,
        Math.floor((bottomFromStart + viewportHeight) / columnHeight) + 1
    );

    // 스크롤 이벤트를 기다리지 않고 상태를 바로 맞춘다
    function scrollMainTo(top: number) {
        const main = mainRef.current;
        if (!main) return;
        main.scrollTop = top;
        setScrollTop(main.scrollTop);
    }

    // 미니맵 — 뷰포트 사각형 위치와 자동 추종
    const miniViewportTop = (top / totalHeight) * miniTotalHeight;
    const miniViewportHeight = Math.max(
        12,
        (viewportHeight / totalHeight) * miniTotalHeight
    );
    useEffect(() => {
        const mini = miniRef.current;
        if (!mini || dragging.current) return;
        const visibleTop = mini.scrollTop;
        const visibleBottom = visibleTop + mini.clientHeight;
        if (miniViewportTop < visibleTop) mini.scrollTop = miniViewportTop - 8;
        else if (miniViewportTop + miniViewportHeight > visibleBottom)
            mini.scrollTop =
                miniViewportTop + miniViewportHeight - mini.clientHeight + 8;
    }, [miniViewportTop, miniViewportHeight]);

    // 바깥 탭(포인터 다운)이면 닫는다 — 본문 스크롤은 닫지 않는다(옮긴 뒤 계속 볼 수 있어야 한다)
    useEffect(() => {
        if (!miniOpen) return;
        const close = (event: PointerEvent) => {
            const mini = miniRef.current;
            if (
                mini &&
                event.target instanceof Node &&
                mini.contains(event.target)
            )
                return;
            setMiniOpen(false);
        };
        window.document.addEventListener("pointerdown", close, true);
        return () =>
            window.document.removeEventListener("pointerdown", close, true);
    }, [miniOpen]);

    const seekFromMini = useCallback(
        (clientY: number) => {
            const mini = miniRef.current;
            const main = mainRef.current;
            if (!mini || !main) return;
            const rect = mini.getBoundingClientRect();
            const y = clientY - rect.top + mini.scrollTop;
            const fraction = Math.min(1, Math.max(0, y / miniTotalHeight));
            main.scrollTop = fraction * totalHeight - viewportHeight / 2;
            setScrollTop(main.scrollTop);
        },
        [viewportHeight, miniTotalHeight, totalHeight]
    );
    // 제스처: 닫힌 상태의 탭 = 열기만 · 열린 상태의 탭 = 그 지점으로 이동 · 끌기 = 열고 이동(끝나도 열림 유지)
    function onMiniPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
        if (event.button !== 0) return;
        dragging.current = true;
        gesture.current = {
            startY: event.clientY,
            moved: false,
            wasOpen: miniOpen || wide,
        };
        try {
            event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
            // 합성 이벤트·이미 끝난 포인터는 캡처 불가 — 끌기는 이동 이벤트로 계속된다
        }
        if (gesture.current.wasOpen) seekFromMini(event.clientY);
    }
    function onMiniPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
        if (!dragging.current) return;
        const g = gesture.current;
        if (!g.moved && Math.abs(event.clientY - g.startY) < 4) return;
        if (!g.moved) {
            g.moved = true;
            setMiniOpen(true);
        }
        seekFromMini(event.clientY);
    }
    function onMiniPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
        if (!dragging.current) return;
        dragging.current = false;
        if (!gesture.current.moved && !gesture.current.wasOpen)
            setMiniOpen(true);
        if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
    }

    function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        const main = mainRef.current;
        if (!main) return;
        const map: Record<string, number> = {
            PageUp: main.scrollTop - main.clientHeight,
            PageDown: main.scrollTop + main.clientHeight,
            Home: totalHeight,
            End: 0,
        };
        const target = map[event.key];
        if (target === undefined) return;
        event.preventDefault();
        scrollMainTo(target);
    }

    return (
        <div className="nl-chart-strip" data-layout={wide ? "wide" : "compact"}>
            <p
                className="nl-metric-value nl-chart-strip__position"
                aria-live="polite"
                aria-label={t("chart.position")}
            >
                {formatEditorTime(currentMs)}
                <span className="nl-muted">
                    {" / "}
                    {formatEditorTime(durationMs)}
                </span>
            </p>
            <div className="nl-chart-strip__frame">
                <div
                    ref={mainRef}
                    tabIndex={0}
                    role="region"
                    aria-label={t("chart.sheetScroll")}
                    className="nl-chart-strip__main"
                    onScroll={(event) =>
                        setScrollTop(event.currentTarget.scrollTop)
                    }
                    onKeyDown={onKeyDown}
                >
                    <div
                        className="nl-chart-strip__columns"
                        style={{ width: columnWidth }}
                    >
                        {reversed.map((panel) => {
                            const mounted =
                                panel.index >= firstVisible &&
                                panel.index <= lastVisible;
                            return (
                                <div
                                    key={panel.index}
                                    className="nl-chart-strip__column"
                                    style={{
                                        height:
                                            columnHeight -
                                            (panel.index === 0
                                                ? firstColumnCrop
                                                : 0),
                                    }}
                                >
                                    {mounted ? (
                                        <SheetCanvas
                                            panel={panel}
                                            document={document}
                                            measureMarkers={measureMarkers}
                                            scale={mainScale}
                                            offsetTop={-padTop}
                                            label={t("chart.columnAria", {
                                                count: panel.index + 1,
                                                start: formatEditorTime(
                                                    panel.startMs
                                                ),
                                                end: formatEditorTime(
                                                    panel.endMs
                                                ),
                                            })}
                                        />
                                    ) : null}
                                    {panel.index ===
                                    panels.length - 1 ? null : (
                                        <span
                                            className="nl-metadata nl-chart-strip__seam"
                                            aria-hidden
                                        >
                                            {formatEditorTime(panel.endMs)}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                        {startMarker ? (
                            <span
                                className="nl-metadata nl-chart-strip__seam nl-chart-strip__seam--start"
                                aria-hidden
                            >
                                BPM {formatBpm(startMarker.bpm)} ·{" "}
                                {startMarker.numerator}/
                                {startMarker.denominator}
                            </span>
                        ) : null}
                    </div>
                </div>
                <div
                    ref={miniRef}
                    className={cn(
                        "nl-chart-strip__mini",
                        miniOpen && "nl-chart-strip__mini--active"
                    )}
                    style={{ width: miniWidth }}
                    aria-hidden
                    onPointerDown={onMiniPointerDown}
                    onPointerMove={onMiniPointerMove}
                    onPointerUp={onMiniPointerUp}
                    onPointerCancel={onMiniPointerUp}
                >
                    <div
                        className="nl-chart-strip__mini-columns"
                        style={{ height: miniTotalHeight }}
                    >
                        {reversed.map((panel) => (
                            <div
                                key={panel.index}
                                className="nl-chart-strip__mini-column"
                                style={{ height: miniColumnHeight }}
                            >
                                <SheetCanvas
                                    panel={panel}
                                    document={document}
                                    measureMarkers={measureMarkers}
                                    scale={miniScale}
                                />
                            </div>
                        ))}
                        <div
                            className="nl-chart-strip__viewport"
                            style={{
                                top: miniViewportTop,
                                height: miniViewportHeight,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

/** 열 캔버스 — drawPanel 을 주어진 배율로 그린다(CSS 확대가 아니라 재렌더) */
function SheetCanvas({
    panel,
    document,
    measureMarkers,
    scale,
    offsetTop = 0,
    label,
}: {
    panel: SheetPanel;
    document: ChartDocument;
    measureMarkers: MeasureMarker[];
    scale: number;
    /** 이음새 여백을 감추기 위한 위쪽 오프셋(음수) — 그림은 그대로, 보여줄 범위만 바뀐다 */
    offsetTop?: number;
    label?: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const width = Math.round(PANEL_WIDTH * scale);
    const height = Math.round(PANEL_HEIGHT * scale);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        const context = canvas.getContext("2d");
        if (!context) return;
        context.setTransform(scale * ratio, 0, 0, scale * ratio, 0, 0);
        drawPanel(context, {
            startMs: panel.startMs,
            endMs: panel.endMs,
            document,
            measureMarkers,
        });
    }, [
        document,
        height,
        measureMarkers,
        panel.endMs,
        panel.startMs,
        scale,
        width,
    ]);
    return (
        <canvas
            ref={canvasRef}
            role={label ? "img" : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : true}
            className="nl-chart-strip__canvas"
            style={{ width, height, marginTop: offsetTop }}
        />
    );
}
