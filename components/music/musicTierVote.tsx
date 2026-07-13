"use client";

import {
    submitChartEvaluation,
    toggleChartEvaluationReaction,
} from "@/app/(nevigation)/music/[index]/[difficulty]/action";
import { cn } from "@/lib/utils";
import { Check, Minus, Plus, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const patternItems = [
    { key: "stairs", label: "계단" },
    { key: "chord", label: "동치" },
    { key: "trill", label: "트릴" },
    { key: "glissando", label: "글리산도" },
    { key: "repetition", label: "연타" },
] as const;
const patternLevels = ["없음", "낮음", "보통", "높음", "매우높음"];

type PatternKey = (typeof patternItems)[number]["key"];
type PatternValues = Record<PatternKey, number | null>;

interface MusicTierVoteProps {
    chartId: number;
    level: number;
    officialConstant: number | null;
    constantHistory: {
        id: number;
        value: number;
        effectiveAt: string;
    }[];
    community: {
        average: number | null;
        count: number;
        distribution: { value: number; count: number }[];
    };
    currentEvaluation: {
        perceived_constant: number;
        stairs: number;
        chord: number;
        trill: number;
        glissando: number;
        repetition: number;
        comment: string | null;
    } | null;
    opinionCount: number;
    opinions: {
        id: number;
        perceivedConstant: number;
        comment: string;
        updatedAt: string;
        user: { id: number; username: string | null };
        positiveCount: number;
        negativeCount: number;
        viewerReaction: number | null;
    }[];
}

function formatMonth(value: string) {
    return value.slice(0, 7).replace("-", ".");
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("ko-KR", {
        month: "2-digit",
        day: "2-digit",
    })
        .format(new Date(value))
        .replaceAll(". ", ".")
        .replace(/\.$/, "")
        .trim();
}

// 악곡별 서열 추이와 사용자 투표 UI를 한곳에서 관리함
export default function MusicTierVote({
    chartId,
    level,
    officialConstant,
    constantHistory,
    community,
    currentEvaluation,
    opinionCount,
    opinions,
}: MusicTierVoteProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const initialConstant = Math.min(
        14,
        Math.max(
            1,
            currentEvaluation?.perceived_constant ?? officialConstant ?? level
        )
    );
    const [perceivedInput, setPerceivedInput] = useState(
        initialConstant.toFixed(1)
    );
    const [comment, setComment] = useState(currentEvaluation?.comment ?? "");
    const [patterns, setPatterns] = useState<PatternValues>({
        stairs: currentEvaluation?.stairs ?? null,
        chord: currentEvaluation?.chord ?? null,
        trill: currentEvaluation?.trill ?? null,
        glissando: currentEvaluation?.glissando ?? null,
        repetition: currentEvaluation?.repetition ?? null,
    });

    const histogram = useMemo(() => {
        const center = Math.round(
            (community.average ?? officialConstant ?? level) * 10
        );

        return [-2, -1, 0, 1, 2].map((offset) => {
            const value = (center + offset) / 10;
            const item = community.distribution.find(
                (entry) => Math.round(entry.value * 10) === center + offset
            );

            return { value, count: item?.count ?? 0 };
        });
    }, [community, level, officialConstant]);
    const maximumHistogramCount = Math.max(
        1,
        ...histogram.map((item) => item.count)
    );
    const constantDelta =
        constantHistory.length > 1
            ? constantHistory.at(-1)!.value - constantHistory[0].value
            : 0;
    const allPatternsSelected = patternItems.every(
        ({ key }) => patterns[key] !== null
    );
    const parsedPerceivedConstant = Number(perceivedInput);
    const isPerceivedConstantValid =
        Number.isFinite(parsedPerceivedConstant) &&
        parsedPerceivedConstant >= 1 &&
        parsedPerceivedConstant <= 14 &&
        Number.isInteger(parsedPerceivedConstant * 10);

    const changeConstant = (amount: number) => {
        const current = isPerceivedConstantValid
            ? parsedPerceivedConstant
            : initialConstant;
        const next = Math.min(
            14,
            Math.max(1, Math.round((current + amount) * 10) / 10)
        );

        setPerceivedInput(next.toFixed(1));
    };

    const normalizeConstantInput = () => {
        if (!Number.isFinite(parsedPerceivedConstant)) {
            setPerceivedInput(initialConstant.toFixed(1));
            return;
        }

        const normalized = Math.min(
            14,
            Math.max(1, Math.round(parsedPerceivedConstant * 10) / 10)
        );
        setPerceivedInput(normalized.toFixed(1));
    };

    const submitVote = () => {
        if (!isPerceivedConstantValid) {
            setMessage(
                "체감 난이도는 1.0부터 14.0까지 0.1 단위로 입력해 주세요."
            );
            return;
        }

        if (!allPatternsSelected) {
            setMessage("다섯 패턴 항목을 모두 선택해 주세요.");
            return;
        }

        startTransition(async () => {
            const result = await submitChartEvaluation({
                chartId,
                perceivedConstant: parsedPerceivedConstant,
                stairs: patterns.stairs!,
                chord: patterns.chord!,
                trill: patterns.trill!,
                glissando: patterns.glissando!,
                repetition: patterns.repetition!,
                comment,
            });

            setMessage(result.message);
            if (result.success) router.refresh();
        });
    };

    const reactToOpinion = (evaluationId: number, value: 1 | -1) => {
        startTransition(async () => {
            const result = await toggleChartEvaluationReaction({
                evaluationId,
                value,
            });

            setMessage(result.message);
            if (result.success) router.refresh();
        });
    };

    return (
        <div className="flex flex-col gap-3">
            <section className="bg-surface rounded-card p-4">
                <header className="flex items-center gap-2">
                    <h2 className="text-section">서열 상수 변동</h2>
                    {officialConstant !== null ? (
                        <strong className="text-text-primary text-base tabular-nums">
                            {officialConstant.toFixed(1)}
                        </strong>
                    ) : null}
                    {constantDelta !== 0 ? (
                        <span
                            className={cn(
                                "rounded px-1.5 py-1 text-xs font-bold tabular-nums",
                                constantDelta > 0
                                    ? "bg-danger/15 text-danger"
                                    : "bg-chart/15 text-chart"
                            )}
                        >
                            {constantDelta > 0 ? "+" : ""}
                            {constantDelta.toFixed(1)}
                        </span>
                    ) : null}
                </header>

                {constantHistory.length > 0 ? (
                    <div className="mt-2 h-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={constantHistory}
                                margin={{
                                    top: 12,
                                    right: 8,
                                    bottom: 14,
                                    left: 8,
                                }}
                            >
                                <XAxis dataKey="effectiveAt" hide />
                                <YAxis
                                    domain={["dataMin - 0.1", "dataMax + 0.1"]}
                                    hide
                                />
                                <Tooltip
                                    contentStyle={{
                                        background:
                                            "var(--color-surface-muted)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: 6,
                                        fontSize: 12,
                                    }}
                                    formatter={(value) => [
                                        Number(value).toFixed(1),
                                        "서열 상수",
                                    ]}
                                    labelFormatter={(value) =>
                                        formatMonth(String(value))
                                    }
                                />
                                <Line
                                    type="linear"
                                    dataKey="value"
                                    stroke="var(--color-text-secondary)"
                                    strokeWidth={3}
                                    dot={{
                                        r: 3,
                                        fill: "var(--color-text-disabled)",
                                        strokeWidth: 0,
                                    }}
                                    activeDot={{
                                        r: 5,
                                        fill: "var(--color-text-primary)",
                                        stroke: "var(--color-border)",
                                        strokeWidth: 3,
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="text-text-disabled -mt-4 flex justify-between text-xs">
                            <span>
                                {formatMonth(constantHistory[0].effectiveAt)}{" "}
                                등재
                            </span>
                            <span>
                                {formatMonth(
                                    constantHistory.at(-1)!.effectiveAt
                                )}{" "}
                                현재
                            </span>
                        </div>
                    </div>
                ) : (
                    <p className="text-body-muted flex h-20 items-center justify-center">
                        등록된 서열 상수 이력이 없습니다.
                    </p>
                )}
            </section>

            <section className="bg-surface rounded-card p-4">
                <header className="flex items-baseline gap-2">
                    <h2 className="text-section">커뮤니티 체감</h2>
                    <strong className="text-real text-xl font-extrabold tabular-nums">
                        {community.average?.toFixed(2) ?? "-"}
                    </strong>
                    <span className="text-caption ml-auto">
                        투표 {community.count.toLocaleString("ko-KR")}
                    </span>
                </header>
                <div className="mt-3 grid h-14 grid-cols-5 items-end gap-1">
                    {histogram.map((item) => (
                        <div
                            key={item.value}
                            className="flex h-full flex-col items-center justify-end gap-1"
                        >
                            <span
                                className={cn(
                                    "min-h-1 w-full rounded-t-sm",
                                    community.average !== null &&
                                        Math.round(item.value * 10) ===
                                            Math.round(community.average * 10)
                                        ? "bg-real"
                                        : "bg-border"
                                )}
                                style={{
                                    height: `${Math.max(
                                        item.count > 0 ? 10 : 4,
                                        (item.count / maximumHistogramCount) *
                                            34
                                    )}px`,
                                }}
                            />
                            <span className="text-text-disabled text-xs tabular-nums">
                                {item.value.toFixed(1)}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-surface rounded-card p-4">
                <h2 className="text-section">체감 난이도 투표</h2>
                <div className="mt-3 flex gap-2">
                    <div className="border-border flex h-10 shrink-0 overflow-hidden rounded-lg border">
                        <button
                            type="button"
                            aria-label="체감 난이도 0.1 낮추기"
                            className="text-text-secondary hover:bg-surface-muted flex w-10 items-center justify-center"
                            onClick={() => changeConstant(-0.1)}
                        >
                            <Minus size={16} aria-hidden />
                        </button>
                        <input
                            type="number"
                            min="1"
                            max="14"
                            step="0.1"
                            inputMode="decimal"
                            value={perceivedInput}
                            onChange={(event) =>
                                setPerceivedInput(event.target.value)
                            }
                            onBlur={normalizeConstantInput}
                            aria-label="체감 난이도 직접 입력"
                            className="bg-surface-muted text-text-primary h-full w-16 appearance-none px-1 text-center text-base font-extrabold tabular-nums outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                            type="button"
                            aria-label="체감 난이도 0.1 높이기"
                            className="text-text-secondary hover:bg-surface-muted flex w-10 items-center justify-center"
                            onClick={() => changeConstant(0.1)}
                        >
                            <Plus size={16} aria-hidden />
                        </button>
                    </div>
                    <input
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        maxLength={120}
                        placeholder="짧은 코멘트"
                        aria-label="체감 난이도 코멘트"
                        className="border-border bg-bg text-input placeholder:text-text-disabled focus:border-text-secondary min-w-0 flex-1 rounded-lg border border-dashed px-3 outline-none"
                    />
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={submitVote}
                        className="bg-text-primary text-bg flex h-10 shrink-0 items-center gap-1 rounded-lg px-3 text-sm font-bold disabled:opacity-50"
                    >
                        {currentEvaluation ? (
                            <Check size={14} aria-hidden />
                        ) : null}
                        {isPending
                            ? "처리 중"
                            : currentEvaluation
                              ? "수정"
                              : "제출"}
                    </button>
                </div>

                <div className="border-divider mt-4 border-t pt-3">
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-text-primary text-sm font-bold">
                            패턴 투표
                        </h3>
                        <span className="text-caption">
                            필수 · 제출 시 함께 반영
                        </span>
                    </div>
                    <div className="mt-3 grid grid-cols-[4rem_repeat(5,minmax(0,1fr))] items-center">
                        <span />
                        {patternLevels.map((label) => (
                            <span
                                key={label}
                                className="text-text-disabled text-center text-xs"
                            >
                                {label}
                            </span>
                        ))}
                        {patternItems.map(({ key, label }) => (
                            <div key={key} className="contents">
                                <span className="text-text-secondary text-sm">
                                    {label}
                                </span>
                                {patternLevels.map((option, value) => (
                                    <label
                                        key={option}
                                        className="flex h-9 cursor-pointer items-center justify-center"
                                        title={`${label} ${option}`}
                                    >
                                        <input
                                            type="radio"
                                            name={key}
                                            value={value}
                                            checked={patterns[key] === value}
                                            onChange={() =>
                                                setPatterns((current) => ({
                                                    ...current,
                                                    [key]: value,
                                                }))
                                            }
                                            className="sr-only"
                                        />
                                        <span
                                            className={cn(
                                                "size-4 rounded-full border transition-colors",
                                                patterns[key] === value
                                                    ? "border-chart bg-chart"
                                                    : "border-border"
                                            )}
                                        />
                                    </label>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                {message ? (
                    <p
                        className="text-caption mt-3"
                        role="status"
                        aria-live="polite"
                    >
                        {message}
                    </p>
                ) : null}
            </section>

            <section className="bg-surface rounded-card overflow-hidden">
                <header className="bg-surface-muted flex h-10 items-center px-4">
                    <h2 className="text-section">
                        의견 {opinionCount.toLocaleString("ko-KR")}
                    </h2>
                </header>
                {opinions.length > 0 ? (
                    <ol>
                        {opinions.map((opinion) => (
                            <li
                                key={opinion.id}
                                className="border-divider border-t px-4 py-3 first:border-t-0"
                            >
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/profile/${opinion.user.id}`}
                                        className="text-text-primary text-sm font-bold"
                                    >
                                        {opinion.user.username ||
                                            "이름 없는 유저"}
                                    </Link>
                                    <span className="text-caption tabular-nums">
                                        체감{" "}
                                        {opinion.perceivedConstant.toFixed(1)}
                                    </span>
                                    <time
                                        className="text-caption"
                                        dateTime={opinion.updatedAt}
                                    >
                                        {formatDate(opinion.updatedAt)}
                                    </time>
                                </div>
                                <p className="text-body mt-1">
                                    {opinion.comment}
                                </p>
                                <div className="mt-2 flex gap-1">
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={() =>
                                            reactToOpinion(opinion.id, 1)
                                        }
                                        aria-label="의견 추천"
                                        className={cn(
                                            "flex h-8 items-center gap-1 rounded-md px-2 text-xs",
                                            opinion.viewerReaction === 1
                                                ? "bg-chart/15 text-chart"
                                                : "text-text-secondary hover:bg-surface-muted"
                                        )}
                                    >
                                        <ThumbsUp size={14} aria-hidden />
                                        {opinion.positiveCount}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={() =>
                                            reactToOpinion(opinion.id, -1)
                                        }
                                        aria-label="의견 비추천"
                                        className={cn(
                                            "flex h-8 items-center gap-1 rounded-md px-2 text-xs",
                                            opinion.viewerReaction === -1
                                                ? "bg-danger/15 text-danger"
                                                : "text-text-secondary hover:bg-surface-muted"
                                        )}
                                    >
                                        <ThumbsDown size={14} aria-hidden />
                                        {opinion.negativeCount}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-body-muted flex h-24 items-center justify-center">
                        아직 등록된 의견이 없습니다.
                    </p>
                )}
            </section>
        </div>
    );
}
