"use client";

import Link from "next/link";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import FilterChips from "@/components/ui/filterChips";
import type { FilterChipOption } from "@/components/ui/filterChips";
import FilterGroup from "@/components/ui/filterGroup";
import { FormField, Input } from "@/components/ui/formField";
import RangeSlider from "@/components/ui/rangeSlider";
import SelectionList from "@/components/ui/selectionList";
import SortMenu, { SortMenuSection } from "@/components/ui/sortMenu";
import { MUSIC_CATEGORY_VALUES } from "@/lib/musicCategories";
import {
    discoveryDifficulties,
    discoveryLevelBounds,
    discoveryQuerySchema,
    getDiscoverySort,
    getDiscoveryOrder,
} from "@/features/music/schemas/discoverySchema";
import type {
    DiscoveryQuery,
    DiscoverySort,
} from "@/features/music/schemas/discoverySchema";

type Difficulty = (typeof discoveryDifficulties)[number];
const difficultyTone = (
    difficulty: Difficulty
): FilterChipOption<Difficulty>["tone"] =>
    difficulty.toLowerCase() as FilterChipOption<Difficulty>["tone"];

/** 정렬 메뉴 — 전 폭 공통 · 즉시 적용. 레벨 순이면 난이도, 정렬을 고르면 방향이 종속 섹션으로 붙는다 */
export function DiscoverySortMenu({
    query,
    onChange,
    signedIn,
}: {
    query: DiscoveryQuery;
    onChange: (query: DiscoveryQuery) => void;
    signedIn: boolean;
}) {
    const t = useTranslations();
    const sorts: DiscoverySort[] = [
        ...(query.q ? ["relevance" as const] : []),
        ...(query.scope === "chart" ? ["published" as const] : []),
        "name",
        "level",
        ...(signedIn ? ["recent" as const] : []),
    ];
    const sort = getDiscoverySort(query);
    const unplayed = query.records.includes("unplayed");
    const change = (next: DiscoveryQuery) => {
        if (discoveryQuerySchema.safeParse(next).success) onChange(next);
    };
    return (
        <SortMenu
            label={t("discovery.sortLabel")}
            value={sort}
            options={sorts.map((value) => ({
                value,
                label: t(`discovery.sort.${value}`),
                disabled: value === "recent" && unplayed,
                description:
                    value === "recent" && unplayed
                        ? t("discovery.unplayedReason")
                        : undefined,
            }))}
            onValueChange={(sort) =>
                change({ ...query, sort, order: undefined })
            }
        >
            {sort === "level" ? (
                <SortMenuSection label={t("discovery.sortDifficulty")}>
                    <FilterChips
                        label={t("discovery.sortDifficulty")}
                        multiple={false}
                        value={
                            query.sortDifficulty ? [query.sortDifficulty] : []
                        }
                        onValueChange={([sortDifficulty]) =>
                            change({ ...query, sortDifficulty })
                        }
                        options={discoveryDifficulties.map((difficulty) => ({
                            value: difficulty,
                            label: difficulty,
                            tone: difficultyTone(difficulty),
                        }))}
                    />
                </SortMenuSection>
            ) : null}
            {query.sort ? (
                <SortMenuSection label={t("discovery.direction")}>
                    <FilterChips
                        label={t("discovery.direction")}
                        multiple={false}
                        value={[getDiscoveryOrder(query)]}
                        onValueChange={([order]) => change({ ...query, order })}
                        options={[
                            { value: "asc", label: t("discovery.ascending") },
                            { value: "desc", label: t("discovery.descending") },
                        ]}
                    />
                </SortMenuSection>
            ) : null}
        </SortMenu>
    );
}

/**
 * 필터 본문 — variant="layer" 는 전체 레이어(칩 · 배치 적용), variant="rail" 은 Wide 레일
 * (세로 체크박스 목록 · 즉시 적용). 두 변이는 같은 FilterGroup 문법을 쓰고 선택지 그림만 다르다.
 */
export default function DiscoveryFilters({
    query,
    onChange,
    onRangeChange,
    onRangeCommit,
    signedIn,
    variant,
}: {
    query: DiscoveryQuery;
    onChange: (query: DiscoveryQuery) => void;
    onRangeChange?: (query: DiscoveryQuery) => void;
    onRangeCommit?: (query: DiscoveryQuery) => void;
    signedIn: boolean;
    variant: "layer" | "rail";
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const rail = variant === "rail";
    function changeRecords(records: DiscoveryQuery["records"]) {
        const addedUnplayed =
            records.includes("unplayed") && !query.records.includes("unplayed");
        const nextRecords = addedUnplayed
            ? ["unplayed" as const]
            : records.filter(
                  (value) => value !== "unplayed" || records.length === 1
              );
        onChange({
            ...query,
            records: nextRecords,
            missMin: addedUnplayed ? undefined : query.missMin,
            missMax: addedUnplayed ? undefined : query.missMax,
            sort:
                addedUnplayed && query.sort === "recent"
                    ? undefined
                    : query.sort,
            order:
                addedUnplayed && query.sort === "recent"
                    ? undefined
                    : query.order,
        });
    }
    function changeDifficulties(difficulties: Difficulty[]) {
        onChange({
            ...query,
            difficulties: discoveryDifficulties
                .filter((difficulty) => difficulties.includes(difficulty))
                .map(
                    (difficulty) =>
                        query.difficulties.find(
                            (range) => range.difficulty === difficulty
                        ) ?? {
                            difficulty,
                            min: 1,
                            max: discoveryLevelBounds[difficulty],
                        }
                ),
        });
    }
    function changeRange(
        difficulty: Difficulty,
        values: number[],
        commit: boolean
    ) {
        const next = {
            ...query,
            difficulties: query.difficulties.map((range) =>
                range.difficulty === difficulty
                    ? { difficulty, min: values[0], max: values[1] }
                    : range
            ),
        };
        if (commit && onRangeCommit) onRangeCommit(next);
        else if (onRangeChange) onRangeChange(next);
        else onChange(next);
    }
    // 그룹 오른쪽 슬롯: 레이어(배치)는 선택 수, 레일(즉시)은 지우기
    const aside = (count: number, clear: () => void) =>
        !count ? null : rail ? (
            <button type="button" onClick={clear}>
                {t("discovery.clearGroup")}
            </button>
        ) : (
            <span className="nl-metadata">
                {t("discovery.selectedCount", { count })}
            </span>
        );
    const categoryOptions = MUSIC_CATEGORY_VALUES.map((category) => ({
        value: category,
        label: category,
    }));
    const difficultyOptions = discoveryDifficulties.map((difficulty) => ({
        value: difficulty,
        label: difficulty,
        tone: difficultyTone(difficulty),
    }));
    const recordOptions = [
        { value: "unplayed" as const, label: t("music.filter.unplayed") },
        { value: "s" as const, label: "S" },
        { value: "fc" as const, label: "FC" },
        { value: "pianist" as const, label: "Pianist" },
    ].map((option) => ({ ...option, disabled: !signedIn }));
    const selectedDifficulties = query.difficulties.map(
        (range) => range.difficulty
    );
    const Choice = rail ? SelectionList : FilterChips;
    return (
        <>
            <FilterGroup
                label={t("music.category")}
                aside={aside(query.categories.length, () =>
                    onChange({ ...query, categories: [] })
                )}
            >
                <Choice
                    hideLabel
                    label={t("music.category")}
                    options={categoryOptions}
                    multiple
                    value={query.categories}
                    onValueChange={(categories) =>
                        onChange({ ...query, categories })
                    }
                />
            </FilterGroup>
            <FilterGroup
                label={t("music.difficulty")}
                aside={aside(selectedDifficulties.length, () =>
                    onChange({ ...query, difficulties: [] })
                )}
            >
                <Choice
                    hideLabel
                    label={t("music.difficulty")}
                    options={difficultyOptions}
                    multiple
                    value={selectedDifficulties}
                    onValueChange={changeDifficulties}
                />
                {query.difficulties.map((range) => (
                    <RangeSlider
                        key={range.difficulty}
                        label={t("discovery.levelLabel", {
                            difficulty: range.difficulty,
                        })}
                        minimumLabel={t("music.minimumLevel", {
                            difficulty: range.difficulty,
                        })}
                        maximumLabel={t("music.maximumLevel", {
                            difficulty: range.difficulty,
                        })}
                        max={discoveryLevelBounds[range.difficulty]}
                        value={[range.min, range.max]}
                        accent={`var(--nl-difficulty-${range.difficulty.toLowerCase()})`}
                        onValueChange={(values) =>
                            changeRange(range.difficulty, values, false)
                        }
                        onValueCommit={(values) =>
                            changeRange(range.difficulty, values, true)
                        }
                    />
                ))}
            </FilterGroup>
            <FilterGroup
                label={t("discovery.personalRecords")}
                aside={
                    signedIn ? (
                        aside(
                            query.records.length +
                                (query.missMin !== undefined ||
                                query.missMax !== undefined
                                    ? 1
                                    : 0),
                            () =>
                                onChange({
                                    ...query,
                                    records: [],
                                    missMin: undefined,
                                    missMax: undefined,
                                })
                        )
                    ) : (
                        <Link href={href("/login")}>{t("common.login")}</Link>
                    )
                }
            >
                <Choice
                    hideLabel
                    label={t("music.filter.status")}
                    multiple
                    value={query.records}
                    onValueChange={changeRecords}
                    options={recordOptions}
                />
                {signedIn && !query.records.includes("unplayed") ? (
                    <div className="nl-filter-miss">
                        <p className="nl-control">{t("discovery.missCount")}</p>
                        {(["missMin", "missMax"] as const).map((key) => (
                            <FormField
                                key={key}
                                label={t(`discovery.${key}`)}
                                id={`discovery-${variant}-${key}`}
                            >
                                <Input
                                    id={`discovery-${variant}-${key}`}
                                    type="number"
                                    min={0}
                                    max={99999}
                                    inputMode="numeric"
                                    placeholder={t("discovery.unbounded")}
                                    value={query[key] ?? ""}
                                    onChange={(event) =>
                                        onChange({
                                            ...query,
                                            [key]:
                                                event.target.value === ""
                                                    ? undefined
                                                    : Math.max(
                                                          0,
                                                          Math.min(
                                                              99999,
                                                              Number(
                                                                  event.target
                                                                      .value
                                                              )
                                                          )
                                                      ),
                                        })
                                    }
                                />
                            </FormField>
                        ))}
                    </div>
                ) : null}
            </FilterGroup>
        </>
    );
}
