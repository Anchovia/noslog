"use client";

import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import type { MusicDetailProps } from "@/components/music/musicDetailTypes";
import ActionButton from "@/components/ui/actionButton";
import { StatusMessage } from "@/components/ui/statusMessage";
import { communityOptions } from "@/features/music/api/community";
import CommunityOpinions from "./communityOpinions";
import CommunityTierVotes from "./communityTierVotes";
import PatternEvaluationForm from "./patternEvaluationForm";
import TierPlacementGrid from "./tierPlacementGrid";

export default function MusicCommunityPanel({
    music,
}: {
    music: MusicDetailProps;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const params = useSearchParams();
    const form = useRef<HTMLDivElement>(null);
    const query = useQuery({
        ...communityOptions(music.chartDetail.id, music.accountId),
        initialData: music.community,
    });
    const data = query.data;
    const returnTo = href(
        `/music/${music.music.index}/${music.difficulty.toLowerCase()}?${new URLSearchParams({ ...Object.fromEntries(params), tab: "tier" })}`
    );
    return (
        <div className="nl-community-panel">
            <TierPlacementGrid data={data} busy={query.isFetching} />
            {query.isError ? (
                <StatusMessage
                    severity="danger"
                    role="alert"
                    title={t("community.loadError")}
                    action={
                        <ActionButton
                            variant="secondary"
                            onClick={() => void query.refetch()}
                        >
                            {t("common.retry")}
                        </ActionButton>
                    }
                />
            ) : null}
            {data ? (
                <div className="nl-community-columns">
                    <div className="nl-community-contribute">
                        <CommunityTierVotes
                            chartId={music.chartDetail.id}
                            data={data}
                            accountId={music.accountId}
                            returnTo={returnTo}
                        />
                        <div ref={form}>
                            <PatternEvaluationForm
                                chartId={music.chartDetail.id}
                                data={data}
                                accountId={music.accountId}
                                returnTo={returnTo}
                            />
                        </div>
                    </div>
                    <CommunityOpinions
                        chartId={music.chartDetail.id}
                        initialData={data.opinions}
                        accountId={music.accountId}
                        returnTo={returnTo}
                        onEdit={() => {
                            const input =
                                form.current?.querySelector("textarea");
                            input?.focus();
                            input?.scrollIntoView({
                                block: "center",
                                behavior: "instant",
                            });
                        }}
                    />
                </div>
            ) : null}
        </div>
    );
}
