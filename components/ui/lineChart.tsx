"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import useElementWidth from "@/lib/hooks/useElementWidth";

export interface LineChartPoint {
    id: string | number;
    dimension: string;
    shortDimension: string;
    value: number;
    secondaryValue?: number;
    coordinate?: number;
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
    plotSurface = false,
}: {
    points: LineChartPoint[];
    label: string;
    dimensionLabel: string;
    valueLabel: string;
    formatValue: (value: number) => string;
    formatAxis: (value: number) => string;
    domain: [number, number];
    emptyMessage: string;
    singleMessage: string;
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
    /** 플롯을 surface/surface 패널(radius 8 · inset 16) 위에 그린다 — 패턴 레이더·서열 가중치 차트와 같은 언어 */
    plotSurface?: boolean;
}) {
    const { ref, width, height } = useElementWidth<HTMLDivElement>();
    const { ref: tooltipRef, width: tooltipWidth } =
        useElementWidth<HTMLDivElement>();
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
    const fraction = (index: number) =>
        firstCoordinate !== undefined && coordinateRange > 0
            ? ((points[index].coordinate ?? firstCoordinate) -
                  firstCoordinate) /
              coordinateRange
            : index / Math.max(1, points.length - 1);
    const position = (index: number, secondary = false) => ({
        x: 4 + fraction(index) * Math.max(0, width - 8),
        y:
            plotHeight +
            verticalInset -
            (((secondary
                ? points[index].secondaryValue!
                : points[index].value) -
                domain[0]) /
                range) *
                plotHeight,
    });
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
        <figure className="nl-line-chart" aria-label={label}>
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
            {points.length < 2 && keepPlotGeometry ? (
                <div
                    className={cn(
                        "nl-line-chart__plot",
                        plotSurface && "nl-line-chart__plot--panel"
                    )}
                >
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
                                    <>
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
                                    </>
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
            ) : points.length === 1 ? (
                <>
                    <p className="nl-metric-value">
                        {secondaryLabel
                            ? pointLabel(points[0])
                            : formatValue(points[0].value)}
                    </p>
                    <p className="nl-body-secondary nl-muted">
                        {singleMessage}
                    </p>
                </>
            ) : (
                <div
                    className={cn(
                        "nl-line-chart__plot",
                        plotSurface && "nl-line-chart__plot--panel"
                    )}
                >
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
                                          .map((y, index) => (
                                              <line
                                                  key={index}
                                                  x1="0"
                                                  x2={width}
                                                  y1={y}
                                                  y2={y}
                                                  className="nl-line-chart__grid"
                                              />
                                          ))
                                    : null}
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
                                                const p = position(index, true);
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
                                    <span className="nl-metadata nl-muted">
                                        {points[active].dimension}
                                    </span>
                                    <span className="nl-control">
                                        {valueLabel} ·{" "}
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
                                </div>
                            ) : null}
                        </div>
                        <div
                            className="nl-line-chart__x nl-metadata nl-muted"
                            style={
                                dimensionTickIndices
                                    ? { position: "relative", height: 16 }
                                    : undefined
                            }
                            aria-hidden
                        >
                            {labelIndices.map((index) => (
                                <span
                                    key={points[index].id}
                                    style={
                                        dimensionTickIndices
                                            ? index === points.length - 1
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
