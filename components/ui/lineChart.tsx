"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import useElementWidth from "@/lib/hooks/useElementWidth";
import { readMotion } from "@/lib/motion";

export interface LineChartPoint {
    id: string | number;
    dimension: string;
    shortDimension: string;
    value: number;
    secondaryValue?: number;
    coordinate?: number;
    /** 툴팁 아래 줄(예: 「3일 전」). 주면 툴팁 위 날짜 줄 대신 쓴다 (2026-09-17) */
    detail?: string;
}

export default function LineChart({
    points,
    label,
    dimensionLabel,
    valueLabel,
    formatValue,
    formatAxis,
    domain,
    emptyMessage,
    singleMessage,
    secondaryLabel,
    dimensionTickIndices,
    valueTickCount = 3,
    verticalInset = 0,
    showPoints = true,
    tableVisibility = "visible",
    responsivePlot = false,
    showValueAxis = true,
    showGrid = true,
    keepPlotGeometry = false,
    baselineOnly = false,
    tone,
    tooltipValueLabel = true,
}: {
    points: LineChartPoint[];
    label: string;
    dimensionLabel: string;
    valueLabel: string;
    formatValue: (value: number) => string;
    formatAxis: (value: number) => string;
    domain: [number, number];
    emptyMessage: string;
    /** 틀 유지(keepPlotGeometry) 때만 쓴다 — 기본 경로는 점 하나도 그래프로 그린다 */
    singleMessage?: string;
    secondaryLabel?: string;
    dimensionTickIndices?: number[];
    valueTickCount?: number;
    verticalInset?: number;
    showPoints?: boolean;
    tableVisibility?: "visible" | "screen-reader";
    responsivePlot?: boolean;
    showValueAxis?: boolean;
    showGrid?: boolean;
    /** 점이 2개 미만이어도 플롯 틀(높이·격자)을 그대로 두고 그 안에 상태 문구를 둔다 */
    keepPlotGeometry?: boolean;
    /** 가로선을 맨 밑 바닥선 하나만 — 기록 추이 그래프(성장 추이 · 최근 판정 추이, 2026-09-19 G1) */
    baselineOnly?: boolean;
    /** 선 색 — growth = 주황 local-data/categorical-2 (성장 추이, 2026-09-19 C1) */
    tone?: "growth";
    /** false 면 툴팁 값 앞 「라벨 ·」 을 뺀다 — 값 하나뿐인 그래프(성장 추이) */
    tooltipValueLabel?: boolean;
}) {
    const { ref, width, height } = useElementWidth<HTMLDivElement>();
    // 툴팁은 안쪽 여백까지 재야 오른쪽 끝에서 플롯 밖으로 삐져나가지 않는다 (2026-09-17)
    const { ref: tooltipRef, width: tooltipWidth } =
        useElementWidth<HTMLDivElement>("border-box");
    const [active, setActive] = useState<number | null>(null);
    const buttons = useRef<(HTMLButtonElement | null)[]>([]);
    const tooltipId = useId();
    const range = domain[1] - domain[0] || 1;
    // responsivePlot: 폭의 16:9(상한 344)를 최소 높이로 두고, 부모가 더 주는 높이(옆 구역과의 행 파리티)는 채운다
    const frameMin =
        (responsivePlot
            ? Math.min(344, (Math.max(0, width - 32) * 9) / 16)
            : 120) +
        verticalInset * 2;
    const frameHeight = responsivePlot && height > frameMin ? height : frameMin;
    const plotHeight = frameHeight - verticalInset * 2;
    const frameStyle = responsivePlot
        ? { minHeight: frameMin }
        : { height: frameMin };
    const firstCoordinate = points[0]?.coordinate;
    const coordinateRange =
        (points.at(-1)?.coordinate ?? 0) - (firstCoordinate ?? 0);
    // 점이 하나면 가운데 — AtCoder · Codeforces 처럼 틀 · 축 · 표는 그대로 두고 점만 찍는다 (2026-09-16)
    const fraction = (index: number) =>
        points.length === 1
            ? 0.5
            : firstCoordinate !== undefined && coordinateRange > 0
              ? ((points[index].coordinate ?? firstCoordinate) -
                    firstCoordinate) /
                coordinateRange
              : index / Math.max(1, points.length - 1);
    // 값의 높이 비율(0 = 바닥 · 1 = 위). 움직임 중이면 이전 비율에서 이 비율로 옮겨 간다
    const heights = (secondary: boolean) =>
        points.map(
            (point) =>
                ((secondary ? (point.secondaryValue ?? 0) : point.value) -
                    domain[0]) /
                range
        );
    const signature = points.map((point) => point.id).join("|");
    const heightKey = [...heights(false), ...heights(true)].join(",");
    const figure = useRef<HTMLElement>(null);
    const morph = useMorph(figure, signature, heightKey);
    const position = (index: number, secondary = false) => {
        const target = heights(secondary)[index];
        const from = morph.from?.[secondary ? 1 : 0][index];
        const height =
            from === undefined
                ? target
                : from + (target - from) * morph.progress;
        return {
            x: 4 + fraction(index) * Math.max(0, width - 8),
            y: plotHeight + verticalInset - height * plotHeight,
        };
    };
    const pointLabel = (point: LineChartPoint) =>
        `${point.dimension} · ${valueLabel} · ${formatValue(point.value)}${secondaryLabel && point.secondaryValue !== undefined ? ` · ${secondaryLabel} · ${formatValue(point.secondaryValue)}` : ""}`;
    const ticks = Array.from(
        { length: valueTickCount },
        (_, index) =>
            domain[1] - (index / Math.max(1, valueTickCount - 1)) * range
    );
    const labelIndices = dimensionTickIndices
        ? dimensionTickIndices.filter((index, order, candidates) => {
              if (order === 0 || order === candidates.length - 1) return true;
              const next = candidates[order + 1];
              const labelWidth = points[index].shortDimension.length * 8;
              const nextWidth = points[next].shortDimension.length * 8;
              return (
                  position(next).x - position(index).x >=
                  (labelWidth + nextWidth) / 2 + 8
              );
          })
        : points.length < 3
          ? points.map((_, index) => index)
          : [0, Math.floor((points.length - 1) / 2), points.length - 1];
    function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
        const next =
            event.key === "Home"
                ? 0
                : event.key === "End"
                  ? points.length - 1
                  : event.key === "ArrowRight" || event.key === "ArrowDown"
                    ? Math.min(points.length - 1, index + 1)
                    : event.key === "ArrowLeft" || event.key === "ArrowUp"
                      ? Math.max(0, index - 1)
                      : null;
        if (event.key === "Escape") {
            setActive(null);
            return;
        }
        if (next === null) return;
        event.preventDefault();
        setActive(next);
        buttons.current[next]?.focus();
    }
    return (
        <figure
            ref={figure}
            className="nl-line-chart"
            data-tone={tone}
            aria-label={label}
        >
            {secondaryLabel ? (
                <div className="nl-line-chart__legend nl-control">
                    <span>
                        <i data-series="fast" aria-hidden />
                        {valueLabel}
                    </span>
                    <span>
                        <i data-series="slow" aria-hidden />
                        {secondaryLabel}
                    </span>
                </div>
            ) : null}
            {keepPlotGeometry &&
            (points.length === 0 || (points.length === 1 && singleMessage)) ? (
                <div className={cn("nl-line-chart__plot")}>
                    <div className="nl-line-chart__area">
                        <div
                            ref={ref}
                            className="nl-line-chart__series nl-line-chart__series--placeholder"
                            style={frameStyle}
                        >
                            <svg
                                width="100%"
                                height={frameHeight}
                                aria-hidden="true"
                            >
                                {showGrid
                                    ? ticks.map((_, index) => {
                                          if (
                                              baselineOnly &&
                                              index !== ticks.length - 1
                                          )
                                              return null;
                                          // 비어 있으면 위 · 아래 선만 — 가운데 「기록 없음」 과 겹치지 않게
                                          if (
                                              points.length === 0 &&
                                              index !== 0 &&
                                              index !== ticks.length - 1
                                          )
                                              return null;
                                          const y =
                                              verticalInset +
                                              (index /
                                                  Math.max(
                                                      1,
                                                      ticks.length - 1
                                                  )) *
                                                  plotHeight;
                                          return (
                                              <line
                                                  key={index}
                                                  x1="0"
                                                  x2={width}
                                                  y1={y}
                                                  y2={y}
                                                  className="nl-line-chart__grid"
                                              />
                                          );
                                      })
                                    : null}
                                {points.length === 1 ? (
                                    // 값이 하나면 그 값의 평평한 선: 추이가 없다는 뜻을 선 자체가 말한다
                                    <g className="nl-line-chart__marks">
                                        <line
                                            x1="0"
                                            x2="100%"
                                            y1={verticalInset + plotHeight / 2}
                                            y2={verticalInset + plotHeight / 2}
                                            className="nl-line-chart__line"
                                            data-series="personal"
                                        />
                                        <circle
                                            cx="50%"
                                            cy={verticalInset + plotHeight / 2}
                                            r="4"
                                            className="nl-line-chart__point"
                                        />
                                    </g>
                                ) : null}
                            </svg>
                            <p
                                className="nl-line-chart__state nl-body-secondary nl-muted"
                                data-placement={
                                    points.length === 1 ? "below" : "center"
                                }
                            >
                                {points.length === 1
                                    ? singleMessage
                                    : emptyMessage}
                            </p>
                        </div>
                    </div>
                </div>
            ) : points.length === 0 ? (
                <p className="nl-body-secondary nl-muted">{emptyMessage}</p>
            ) : (
                <div className={cn("nl-line-chart__plot")}>
                    {showValueAxis ? (
                        <div
                            className="nl-line-chart__y nl-metadata nl-muted"
                            aria-hidden
                        >
                            {ticks.map((tick, index) => (
                                <span key={index}>{formatAxis(tick)}</span>
                            ))}
                        </div>
                    ) : null}
                    <div className="nl-line-chart__area">
                        <div
                            ref={ref}
                            className="nl-line-chart__series"
                            style={frameStyle}
                            onPointerMove={(event) => {
                                const x =
                                    event.clientX -
                                    event.currentTarget.getBoundingClientRect()
                                        .left;
                                if (firstCoordinate !== undefined) {
                                    let closest = 0;
                                    for (
                                        let index = 1;
                                        index < points.length;
                                        index++
                                    ) {
                                        if (
                                            Math.abs(position(index).x - x) <
                                            Math.abs(position(closest).x - x)
                                        )
                                            closest = index;
                                    }
                                    setActive(closest);
                                    return;
                                }
                                setActive(
                                    Math.max(
                                        0,
                                        Math.min(
                                            points.length - 1,
                                            Math.round(
                                                ((x - 4) /
                                                    Math.max(1, width - 8)) *
                                                    (points.length - 1)
                                            )
                                        )
                                    )
                                );
                            }}
                            onPointerLeave={() => {
                                if (
                                    !buttons.current.includes(
                                        document.activeElement as HTMLButtonElement
                                    )
                                )
                                    setActive(null);
                            }}
                        >
                            <svg
                                width="100%"
                                height={frameHeight}
                                aria-hidden="true"
                            >
                                {showGrid
                                    ? ticks
                                          .map(
                                              (_, index) =>
                                                  verticalInset +
                                                  (index /
                                                      Math.max(
                                                          1,
                                                          ticks.length - 1
                                                      )) *
                                                      plotHeight -
                                                  (!verticalInset &&
                                                  index === ticks.length - 1
                                                      ? 1
                                                      : 0)
                                          )
                                          .map((y, index) =>
                                              baselineOnly &&
                                              index !==
                                                  ticks.length - 1 ? null : (
                                                  <line
                                                      key={index}
                                                      x1="0"
                                                      x2={width}
                                                      y1={y}
                                                      y2={y}
                                                      className="nl-line-chart__grid"
                                                  />
                                              )
                                          )
                                    : null}
                                {/* 선 · 점 — 나타날 때 왼쪽부터 드러난다(점 구성이 바뀌면 다시) */}
                                <g
                                    key={signature}
                                    className="nl-line-chart__marks"
                                >
                                    <polyline
                                        points={points
                                            .map((_, index) => {
                                                const p = position(index);
                                                return `${p.x},${p.y}`;
                                            })
                                            .join(" ")}
                                        className="nl-line-chart__line"
                                        data-series={
                                            secondaryLabel ? "fast" : "personal"
                                        }
                                    />
                                    {secondaryLabel ? (
                                        <polyline
                                            points={points
                                                .map((_, index) => {
                                                    const p = position(
                                                        index,
                                                        true
                                                    );
                                                    return `${p.x},${p.y}`;
                                                })
                                                .join(" ")}
                                            className="nl-line-chart__line"
                                            data-series="slow"
                                        />
                                    ) : null}
                                    {showPoints
                                        ? points.map((point, index) => {
                                              const p = position(index);
                                              return (
                                                  <circle
                                                      key={point.id}
                                                      cx={p.x}
                                                      cy={p.y}
                                                      r="3"
                                                      className="nl-line-chart__point"
                                                      data-series={
                                                          secondaryLabel
                                                              ? "fast"
                                                              : "personal"
                                                      }
                                                  />
                                              );
                                          })
                                        : null}
                                    {/* 점을 끈 그래프도 가리킨 자리에는 선 색으로 채운 점 4 를 찍는다 — osu! 처럼 (2026-09-19 P1) */}
                                    {/* 점이 하나뿐이면 늘 그 점을 같은 모양으로 */}
                                    {!showPoints &&
                                    (points.length === 1 ||
                                        (active !== null && points[active])) ? (
                                        <circle
                                            cx={
                                                position(
                                                    points.length === 1
                                                        ? 0
                                                        : active!
                                                ).x
                                            }
                                            cy={
                                                position(
                                                    points.length === 1
                                                        ? 0
                                                        : active!
                                                ).y
                                            }
                                            r="4"
                                            className="nl-line-chart__point"
                                            data-series="personal"
                                            data-active=""
                                        />
                                    ) : null}
                                    {secondaryLabel
                                        ? points.map((point, index) => {
                                              const p = position(index, true);
                                              return (
                                                  <rect
                                                      key={point.id}
                                                      x={p.x - 4}
                                                      y={p.y - 4}
                                                      width="8"
                                                      height="8"
                                                      className="nl-line-chart__point"
                                                      data-series="slow"
                                                  />
                                              );
                                          })
                                        : null}
                                </g>
                            </svg>
                            {points.map((point, index) => {
                                const p = position(index);
                                return (
                                    <button
                                        key={point.id}
                                        ref={(element) => {
                                            buttons.current[index] = element;
                                        }}
                                        type="button"
                                        className="nl-line-chart__target"
                                        style={{ left: p.x, top: p.y }}
                                        tabIndex={
                                            index ===
                                            (active ?? points.length - 1)
                                                ? 0
                                                : -1
                                        }
                                        aria-label={pointLabel(point)}
                                        aria-describedby={
                                            active === index
                                                ? tooltipId
                                                : undefined
                                        }
                                        onFocus={() => setActive(index)}
                                        onBlur={() => setActive(null)}
                                        onClick={() => setActive(index)}
                                        onKeyDown={(event) =>
                                            onKeyDown(event, index)
                                        }
                                    />
                                );
                            })}
                            {active !== null && points[active] ? (
                                <div
                                    id={tooltipId}
                                    role="tooltip"
                                    ref={tooltipRef}
                                    className="nl-line-chart__tooltip"
                                    style={{
                                        left: Math.max(
                                            0,
                                            Math.min(
                                                width - tooltipWidth,
                                                position(active).x -
                                                    tooltipWidth / 2
                                            )
                                        ),
                                        top:
                                            position(active).y < 60
                                                ? position(active).y + 16
                                                : position(active).y - 64,
                                    }}
                                >
                                    {points[active].detail ? null : (
                                        <span className="nl-metadata nl-muted">
                                            {points[active].dimension}
                                        </span>
                                    )}
                                    <span className="nl-control">
                                        {tooltipValueLabel
                                            ? `${valueLabel} · `
                                            : null}
                                        {formatValue(points[active].value)}
                                    </span>
                                    {secondaryLabel ? (
                                        <span className="nl-control">
                                            {secondaryLabel} ·{" "}
                                            {formatValue(
                                                points[active].secondaryValue!
                                            )}
                                        </span>
                                    ) : null}
                                    {points[active].detail ? (
                                        <span className="nl-metadata nl-muted">
                                            {points[active].detail}
                                        </span>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                        <div
                            className="nl-line-chart__x nl-metadata nl-muted"
                            style={
                                dimensionTickIndices
                                    ? { position: "relative", height: 16 }
                                    : points.length === 1
                                      ? { justifyContent: "center" }
                                      : undefined
                            }
                            aria-hidden
                        >
                            {labelIndices.map((index) => (
                                <span
                                    key={points[index].id}
                                    style={
                                        dimensionTickIndices
                                            ? index === points.length - 1 &&
                                              points.length > 1
                                                ? // 끝 라벨은 right:0 — left:100% 는 가용 폭이 0 이라 글자가 세로로 접힌다
                                                  {
                                                      position: "absolute",
                                                      right: 0,
                                                  }
                                                : {
                                                      position: "absolute",
                                                      left: `${fraction(index) * 100}%`,
                                                      transform:
                                                          index === 0
                                                              ? undefined
                                                              : "translateX(-50%)",
                                                  }
                                            : undefined
                                    }
                                >
                                    {points[index].shortDimension}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {points.length > 0 ? (
                <div
                    className={
                        tableVisibility === "screen-reader"
                            ? "sr-only"
                            : undefined
                    }
                >
                    <table className="nl-chart-table nl-body-secondary">
                        <caption className="sr-only">{label}</caption>
                        <thead>
                            <tr>
                                <th scope="col" className="nl-control nl-muted">
                                    {dimensionLabel}
                                </th>
                                <th scope="col" className="nl-control">
                                    {valueLabel}
                                </th>
                                {secondaryLabel ? (
                                    <th scope="col" className="nl-control">
                                        {secondaryLabel}
                                    </th>
                                ) : null}
                            </tr>
                        </thead>
                        <tbody>
                            {points.map((point) => (
                                <tr key={point.id}>
                                    <th scope="row" className="nl-muted">
                                        {point.dimension}
                                    </th>
                                    <td className="nl-metric-value">
                                        {formatValue(point.value)}
                                    </td>
                                    {secondaryLabel ? (
                                        <td className="nl-metric-value">
                                            {formatValue(point.secondaryValue!)}
                                        </td>
                                    ) : null}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : null}
        </figure>
    );
}

/**
 * 그래프 움직임(2026-09-19 A) — 점 구성(id)이 바뀌면 선을 다시 드러내고(선 묶음의 key = 점 구성),
 * 같은 점의 값만 바뀌면 이전 높이에서 새 높이로 옮겨 간다. 바뀐 그 렌더에서 곧바로 시작해야
 * 새 선이 한 프레임 먼저 보였다 가려지는 잔상이 없다. 시간 · 곡선은 움직임 토큰에서 읽는다(동작 줄이기면 0 → 곧바로)
 */
function useMorph(
    figure: { current: HTMLElement | null },
    signature: string,
    heightKey: string
) {
    const [seen, setSeen] = useState({ signature, heightKey });
    const [from, setFrom] = useState<[number[], number[]] | null>(null);
    const [progress, setProgress] = useState(1);
    // 렌더 중에 바뀜을 알아채 같은 렌더에서 출발점을 정한다(React 의 「이전 값으로 상태 맞추기」 방식)
    if (seen.signature !== signature || seen.heightKey !== heightKey) {
        const sameSet = seen.signature === signature;
        setSeen({ signature, heightKey });
        if (sameSet) {
            const values = seen.heightKey.split(",").map(Number);
            const half = values.length / 2;
            setFrom([values.slice(0, half), values.slice(half)]);
            setProgress(0);
        } else {
            setFrom(null);
            setProgress(1);
        }
    }
    useEffect(() => {
        if (!from) return;
        const { duration, ease } = figure.current
            ? readMotion(
                  figure.current,
                  "--nl-motion-duration-chart-change",
                  "--nl-ease-enter"
              )
            : { duration: 0, ease: (value: number) => value };
        let frame = 0;
        const start = performance.now();
        const step = (now: number) => {
            const elapsed = duration ? (now - start) / duration : 1;
            const done = elapsed >= 1;
            setProgress(done ? 1 : ease(elapsed));
            if (done) setFrom(null);
            else frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [figure, from]);
    return { from, progress };
}
