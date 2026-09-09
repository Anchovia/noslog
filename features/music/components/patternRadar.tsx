"use client";

import { Info } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "@/components/i18n/localeProvider";
import useElementWidth from "@/lib/hooks/useElementWidth";
import { PATTERN_AXES } from "@/features/music/schemas/communitySchema";
import type { PatternSummary } from "@/features/music/schemas/communitySchema";
import ModalDialog from "@/components/ui/modalDialog";

const angles = PATTERN_AXES.map(
    (_, index) => -Math.PI / 2 + (index * Math.PI * 2) / 5
);

export default function PatternRadar({ data }: { data: PatternSummary }) {
    const t = useTranslations();
    const titleId = useId();
    const [helpOpen, setHelpOpen] = useState(false);
    const { ref, width } = useElementWidth<HTMLDivElement>();
    const labels = useRef<(HTMLSpanElement | null)[]>([]);
    const [labelWidths, setLabelWidths] = useState<number[]>([]);
    useEffect(() => {
        const measure = () =>
            setLabelWidths(
                labels.current.map(
                    (label) => label?.getBoundingClientRect().width ?? 0
                )
            );
        measure();
        void document.fonts.ready.then(measure);
    }, [t]);
    const scale = width < 304 ? 0.8 : 1;
    const radius = 96 * scale;
    const centerY = 112 + 8 * scale;
    const positions = angles.map((angle) => ({
        x: Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
    }));
    const extentLeft = Math.min(
        ...positions.map(
            (point, index) =>
                point.x -
                (index > 2
                    ? 8 * scale + (labelWidths[index] ?? 0)
                    : index === 0
                      ? (labelWidths[index] ?? 0) / 2
                      : 0)
        )
    );
    const extentRight = Math.max(
        ...positions.map(
            (point, index) =>
                point.x +
                (index > 0 && index < 3
                    ? 8 * scale + (labelWidths[index] ?? 0)
                    : index === 0
                      ? (labelWidths[index] ?? 0) / 2
                      : 0)
        )
    );
    const centerX = width
        ? Math.max(-extentLeft, Math.min(width / 2, width - extentRight))
        : 167;
    const point = (index: number, value: number) =>
        `${centerX + (Math.cos(angles[index]) * radius * value) / 4},${centerY + (Math.sin(angles[index]) * radius * value) / 4}`;
    const complete = PATTERN_AXES.every((axis) => data[axis].average !== null);
    return (
        <figure className="nl-pattern-radar" aria-labelledby={titleId}>
            <figcaption className="nl-pattern-radar__header">
                <span id={titleId} className="nl-control">
                    {t("pattern.title")}
                </span>
                <ModalDialog
                    open={helpOpen}
                    onOpenChange={setHelpOpen}
                    title={t("pattern.criteria")}
                    trigger={
                        <button
                            type="button"
                            className="nl-pattern-radar__help nl-control"
                        >
                            <Info className="nl-icon-small" aria-hidden />
                            {t("pattern.criteria")}
                        </button>
                    }
                >
                    <p className="nl-body-secondary nl-muted">
                        {t("pattern.scale")}
                    </p>
                    <dl className="nl-pattern-help">
                        {PATTERN_AXES.map((axis) => (
                            <div key={axis}>
                                <dt className="nl-control">
                                    {t(`pattern.axis.${axis}`)}
                                </dt>
                                <dd className="nl-body-secondary nl-muted">
                                    {t(`pattern.definition.${axis}`)}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </ModalDialog>
            </figcaption>
            <div
                ref={ref}
                className="nl-pattern-radar__plot"
                aria-hidden="true"
            >
                <svg
                    width="100%"
                    height="224"
                    className="nl-pattern-radar__svg"
                >
                    {[1, 2, 3, 4].map((ring) => (
                        <polygon
                            key={ring}
                            points={PATTERN_AXES.map((_, index) =>
                                point(index, ring)
                            ).join(" ")}
                            className="nl-pattern-radar__grid"
                        />
                    ))}
                    {positions.map((position, index) => (
                        <line
                            key={index}
                            x1={centerX}
                            y1={centerY}
                            x2={centerX + position.x}
                            y2={position.y}
                            className="nl-pattern-radar__grid"
                        />
                    ))}
                    {complete ? (
                        <>
                            <polygon
                                points={PATTERN_AXES.map((axis, index) =>
                                    point(index, data[axis].average!)
                                ).join(" ")}
                                className="nl-pattern-radar__series"
                            />
                            {PATTERN_AXES.map((axis, index) => (
                                <circle
                                    key={axis}
                                    cx={
                                        centerX +
                                        (Math.cos(angles[index]) *
                                            radius *
                                            data[axis].average!) /
                                            4
                                    }
                                    cy={
                                        centerY +
                                        (Math.sin(angles[index]) *
                                            radius *
                                            data[axis].average!) /
                                            4
                                    }
                                    r={4 * scale}
                                    className="nl-pattern-radar__point"
                                />
                            ))}
                        </>
                    ) : null}
                </svg>
                {PATTERN_AXES.map((axis, index) => (
                    <span
                        key={axis}
                        ref={(element) => {
                            labels.current[index] = element;
                        }}
                        className="nl-pattern-radar__label nl-metadata nl-muted"
                        style={{
                            left:
                                centerX +
                                positions[index].x +
                                (index === 0
                                    ? 0
                                    : (index < 3 ? 8 : -8) * scale),
                            top:
                                positions[index].y -
                                (index === 0 ? 24 * scale : 8),
                            transform: `translateX(${index === 0 ? "-50%" : index > 2 ? "-100%" : "0"})`,
                        }}
                    >
                        {t(`pattern.axis.${axis}`)}
                    </span>
                ))}
            </div>
            <dl className="nl-pattern-radar__values">
                {PATTERN_AXES.map((axis) => (
                    <div key={axis}>
                        <dt className="nl-control">
                            {t(`pattern.axis.${axis}`)}
                        </dt>
                        <dd>
                            <span className="nl-metric-value">
                                {data[axis].average === null
                                    ? t("pattern.aggregating")
                                    : data[axis].average.toFixed(1)}
                            </span>
                            <span className="nl-metadata nl-muted">
                                {t("pattern.count", {
                                    count: data[axis].count,
                                })}
                            </span>
                        </dd>
                    </div>
                ))}
            </dl>
        </figure>
    );
}
