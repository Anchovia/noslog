"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { Fragment, useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "@/components/i18n/localeProvider";
import type { CommunityData } from "@/features/music/schemas/communitySchema";
import { TIER_MODES } from "@/lib/tiers";
import TierVoteDistribution from "./tierVoteDistribution";
import TierVoteContribution from "./tierVoteContribution";

export default function CommunityTierVotes({
    chartId,
    data,
    accountId,
    returnTo,
}: {
    chartId: number;
    data: CommunityData;
    accountId?: number;
    returnTo: string;
}) {
    const t = useTranslations();
    const id = useId();
    const params = useSearchParams();
    const [selected, setSelected] = useState<string | null>(() => {
        if (params.get("source") !== "tiers") return null;
        const requested = `${params.get("mode")}-${params.get("goal")}`;
        return data.scopes.some(
            (scope) =>
                `${scope.mode}-${scope.goal}` === requested &&
                scope.average !== null
        )
            ? requested
            : null;
    });
    const active = data.scopes.find(
        (scope) => `${scope.mode}-${scope.goal}` === selected
    );
    return (
        <section
            className="nl-community-votes"
            aria-label={t("community.votes")}
        >
            {TIER_MODES.map((mode) => (
                <section
                    className="nl-tier-mode"
                    key={mode}
                    aria-labelledby={`${id}-${mode}`}
                >
                    <h2
                        id={`${id}-${mode}`}
                        className="nl-component-title"
                        lang="en"
                    >
                        {mode === "basic" ? "Basic" : "Recital"}
                    </h2>
                    {data.scopes
                        .filter((scope) => scope.mode === mode)
                        .map((scope) => {
                            const key = `${mode}-${scope.goal}`;
                            const expanded = key === selected;
                            const contents = (
                                <>
                                    <span>
                                        <span className="nl-control">
                                            {t(`community.goal.${scope.goal}`)}
                                        </span>
                                        <span className="nl-metadata nl-muted">
                                            {t("community.voteCount", {
                                                count: scope.count,
                                            })}
                                        </span>
                                    </span>
                                    <span>
                                        {scope.average === null ? (
                                            <span className="nl-body-secondary nl-muted">
                                                {t("pattern.aggregating")}
                                            </span>
                                        ) : (
                                            <>
                                                <span className="nl-metadata nl-muted">
                                                    {t("community.mean")}
                                                </span>
                                                <span className="nl-metric-value">
                                                    {scope.average.toFixed(1)}
                                                </span>
                                                {expanded ? (
                                                    <ChevronDown aria-hidden />
                                                ) : (
                                                    <ChevronRight aria-hidden />
                                                )}
                                            </>
                                        )}
                                    </span>
                                </>
                            );
                            return (
                                <Fragment key={key}>
                                    {scope.average === null ? (
                                        <div className="nl-vote-row">
                                            {contents}
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            className="nl-vote-row"
                                            aria-expanded={expanded}
                                            aria-controls={`${id}-${key}-distribution`}
                                            onClick={() =>
                                                setSelected(
                                                    expanded ? null : key
                                                )
                                            }
                                        >
                                            {contents}
                                        </button>
                                    )}
                                    {expanded ? (
                                        <div id={`${id}-${key}-distribution`}>
                                            <TierVoteDistribution
                                                key={key}
                                                scope={scope}
                                            />
                                        </div>
                                    ) : null}
                                </Fragment>
                            );
                        })}
                </section>
            ))}
            {active ? (
                <TierVoteContribution
                    key={selected}
                    chartId={chartId}
                    scope={active}
                    accountId={accountId}
                    hasRecord={data.canEvaluate}
                    returnTo={returnTo}
                />
            ) : null}
        </section>
    );
}
