"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
import OpinionComposer from "./opinionComposer";
import PatternEvaluationForm from "./patternEvaluationForm";

export default function MusicCommunityPanel({
    music,
}: {
    music: MusicDetailProps;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const params = useSearchParams();
    const [editing, setEditing] = useState(false);
    const query = useQuery({
        ...communityOptions(music.chartDetail.id, music.accountId),
        initialData: music.community,
    });
    const data = query.data;
    const returnTo = href(
        `/music/${music.music.index}/${music.difficulty.toLowerCase()}?${new URLSearchParams({ ...Object.fromEntries(params), tab: "tier" })}`
    );
    return (
        <div className="nl-community-panel" aria-busy={query.isFetching}>
            {query.isError ? (
                <StatusMessage
                    severity="danger"
                    role="alert"
                    title={t("community.loadError")}
                    action={
                        <ActionButton
                            variant="secondary"
                            size="sm"
                            onClick={() => void query.refetch()}
                        >
                            {t("common.retry")}
                        </ActionButton>
                    }
                />
            ) : null}
            {data ? (
                <div className="nl-community-columns">
                    {/* 평가 탭 = 패턴 투표 → 서열 투표 → 의견. 집계 결과(패턴 경향 · 서열 배치)는 개요 · 머리에 (2026-09-16) */}
                    <div className="nl-community-contribute">
                        <PatternEvaluationForm
                            chartId={music.chartDetail.id}
                            data={data}
                            accountId={music.accountId}
                            returnTo={returnTo}
                        />
                        <CommunityTierVotes
                            chartId={music.chartDetail.id}
                            data={data}
                            accountId={music.accountId}
                            returnTo={returnTo}
                        />
                    </div>
                    {/* 의견 = 구역 제목 → 작성 칸(새 의견) → 목록. 내 의견이 있으면 작성 칸 대신 내 줄의 「수정」 이 그 자리에서 펼친다 (2026-09-16) */}
                    <CommunityOpinions
                        chartId={music.chartDetail.id}
                        initialData={data.opinions}
                        accountId={music.accountId}
                        returnTo={returnTo}
                        onEdit={() => setEditing(true)}
                        // 로그아웃이면 작성 칸 대신 제목 줄 오른쪽 끝 제목 링크(가이드 2절)
                        headerAction={
                            music.accountId ? null : (
                                <Link
                                    className="nl-heading-link nl-control"
                                    href={href(
                                        `/login?returnTo=${encodeURIComponent(returnTo)}`
                                    )}
                                >
                                    {t("community.opinionLoginAction")}
                                    <ChevronRight aria-hidden />
                                </Link>
                            )
                        }
                        composer={
                            !music.accountId ||
                            data.currentEvaluation?.opinion ? null : (
                                <OpinionComposer
                                    chartId={music.chartDetail.id}
                                    data={data}
                                    accountId={music.accountId}
                                    avatar={music.userPlayData?.user.avatar}
                                    returnTo={returnTo}
                                    first={!data.opinions.total}
                                />
                            )
                        }
                        editor={
                            editing ? (
                                <OpinionComposer
                                    inline
                                    chartId={music.chartDetail.id}
                                    data={data}
                                    accountId={music.accountId}
                                    returnTo={returnTo}
                                    onDone={() => setEditing(false)}
                                />
                            ) : undefined
                        }
                    />
                </div>
            ) : null}
        </div>
    );
}
