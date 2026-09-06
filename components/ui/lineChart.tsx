"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import useElementWidth from "@/lib/hooks/useElementWidth";

export interface LineChartPoint {
    id: string | number;
    dimension: string;
    shortDimension: string;
    value: number;
    secondaryValue?: number;
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
}) {
    const { ref, width } = useElementWidth<HTMLDivElement>();
    const { ref: tooltipRef, width: tooltipWidth } =
        useElementWidth<HTMLDivElement>();
    const [active, setActive] = useState<number | null>(null);
    const buttons = useRef<(HTMLButtonElement | null)[]>([]);
    const tooltipId = useId();
    const range = domain[1] - domain[0] || 1;
    const position = (index: number, secondary = false) => ({
        x:
            4 +
            (index / Math.max(1, points.length - 1)) * Math.max(0, width - 8),
        y:
            120 +
            verticalInset -
            (((secondary
                ? points[index].secondaryValue!
                : points[index].value) -
                domain[0]) /
                range) *
                120,
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
            {points.length === 0 ? (
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
                <div className="nl-line-chart__plot">
                    <div
                        className="nl-line-chart__y nl-metadata nl-muted"
                        aria-hidden
                    >
                        {ticks.map((tick, index) => (
                            <span key={index}>{formatAxis(tick)}</span>
                        ))}
                    </div>
                    <div className="nl-line-chart__area">
                        <div
                            ref={ref}
                            className="nl-line-chart__series"
                            style={{ height: 120 + verticalInset * 2 }}
                            onPointerMove={(event) => {
                                const x =
                                    event.clientX -
                                    event.currentTarget.getBoundingClientRect()
                                        .left;
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
                                height={120 + verticalInset * 2}
                                aria-hidden="true"
                            >
                                {ticks
                                    .map(
                                        (_, index) =>
                                            verticalInset +
                                            (index /
                                                Math.max(1, ticks.length - 1)) *
                                                120 -
                                            (!verticalInset &&
                                            index === ticks.length - 1
                                                ? 1
                                                : 0)
                                    )
                                    .map((y) => (
                                        <line
                                            key={y}
                                            x1="0"
                                            x2={width}
                                            y1={y}
                                            y2={y}
                                            className="nl-line-chart__grid"
                                        />
                                    ))}
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
                                            ? {
                                                  position: "absolute",
                                                  left: `${(index / Math.max(1, points.length - 1)) * 100}%`,
                                                  transform:
                                                      index === 0
                                                          ? undefined
                                                          : index ===
                                                              points.length - 1
                                                            ? "translateX(-100%)"
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
