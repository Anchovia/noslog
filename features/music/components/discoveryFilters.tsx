"use client";

import { useTranslations } from "@/components/i18n/localeProvider";
import Disclosure from "@/components/ui/disclosure";
import { FormField, Input } from "@/components/ui/formField";
import RangeSlider from "@/components/ui/rangeSlider";
import SelectionList from "@/components/ui/selectionList";
import { MUSIC_CATEGORY_VALUES } from "@/lib/musicCategories";
import {
    discoveryDifficulties,
    discoveryLevelBounds,
    getDiscoverySort,
    getDiscoveryOrder,
} from "@/features/music/schemas/discoverySchema";
import type {
    DiscoveryQuery,
    DiscoverySort,
} from "@/features/music/schemas/discoverySchema";

export function DiscoverySortFields({
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
    return (
        <>
            <SelectionList
                label={t("discovery.sortLabel")}
                value={[sort]}
                onValueChange={([sort]) =>
                    onChange({ ...query, sort, order: undefined })
                }
                options={sorts.map((sort) => ({
                    value: sort,
                    label: t(`discovery.sort.${sort}`),
                    disabled:
                        sort === "recent" && query.records.includes("unplayed"),
                    description:
                        sort === "recent" && query.records.includes("unplayed")
                            ? t("discovery.unplayedReason")
                            : undefined,
                }))}
            />
            {sort === "level" ? (
                <SelectionList
                    label={t("discovery.sortDifficulty")}
                    value={query.sortDifficulty ? [query.sortDifficulty] : []}
                    onValueChange={([sortDifficulty]) =>
                        onChange({ ...query, sortDifficulty })
                    }
                    options={discoveryDifficulties.map((difficulty) => ({
                        value: difficulty,
                        label: difficulty,
                    }))}
                />
            ) : null}
            {query.sort ? (
                <SelectionList
                    label={t("discovery.direction")}
                    value={[getDiscoveryOrder(query)]}
                    onValueChange={([order]) => onChange({ ...query, order })}
                    options={[
                        { value: "asc", label: t("discovery.ascending") },
                        { value: "desc", label: t("discovery.descending") },
                    ]}
                />
            ) : null}
        </>
    );
}

export default function DiscoveryFilters({
    query,
    onChange,
    onRangeChange,
    onRangeCommit,
    signedIn,
}: {
    query: DiscoveryQuery;
    onChange: (query: DiscoveryQuery) => void;
    onRangeChange?: (query: DiscoveryQuery) => void;
    onRangeCommit?: (query: DiscoveryQuery) => void;
    signedIn: boolean;
}) {
    const t = useTranslations();
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
    function changeRange(
        difficulty: (typeof discoveryDifficulties)[number],
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
    return (
        <>
            <SelectionList
                label={t("music.category")}
                options={MUSIC_CATEGORY_VALUES.map((category) => ({
                    value: category,
                    label: category,
                }))}
                multiple
                value={query.categories}
                onValueChange={(categories) =>
                    onChange({ ...query, categories })
                }
            />
            <SelectionList
                label={t("music.difficulty")}
                options={discoveryDifficulties.map((difficulty) => ({
                    value: difficulty,
                    label: difficulty,
                }))}
                multiple
                value={query.difficulties.map((range) => range.difficulty)}
                onValueChange={(difficulties) =>
                    onChange({
                        ...query,
                        difficulties: discoveryDifficulties
                            .filter((difficulty) =>
                                difficulties.includes(difficulty)
                            )
                            .map(
                                (difficulty) =>
                                    query.difficulties.find(
                                        (range) =>
                                            range.difficulty === difficulty
                                    ) ?? {
                                        difficulty,
                                        min: 1,
                                        max: discoveryLevelBounds[difficulty],
                                    }
                            ),
                    })
                }
            />
            {query.difficulties.length ? (
                <section className="nl-filter-ranges">
                    <h3 className="nl-component-title">
                        {t("discovery.levelRange")}
                    </h3>
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
                </section>
            ) : null}
            {signedIn ? (
                <Disclosure title={t("discovery.personalRecords")}>
                    <SelectionList
                        label={t("music.filter.status")}
                        multiple
                        value={query.records}
                        onValueChange={changeRecords}
                        options={[
                            {
                                value: "unplayed",
                                label: t("music.filter.unplayed"),
                            },
                            { value: "s", label: "S" },
                            { value: "fc", label: "FC" },
                            { value: "pianist", label: "Pianist" },
                        ]}
                    />
                    {!query.records.includes("unplayed") ? (
                        <div className="nl-filter-miss">
                            <h3 className="nl-component-title">
                                {t("discovery.missCount")}
                            </h3>
                            {(["missMin", "missMax"] as const).map((key) => (
                                <FormField
                                    key={key}
                                    label={t(`discovery.${key}`)}
                                    id={`discovery-${key}`}
                                >
                                    <Input
                                        id={`discovery-${key}`}
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
                                                                      event
                                                                          .target
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
                </Disclosure>
            ) : null}
        </>
    );
}
