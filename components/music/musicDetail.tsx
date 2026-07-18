import MusicDetailHeader from "./musicDetailHeader";
import MusicDetailNavigation from "./musicDetailNavigation";
import type { MusicDetailProps as Props } from "./musicDetailTypes";
import MusicInfoTab from "./musicInfoTab";
import MusicRankTable from "./musicRankTable";
import MusicRecordTab from "./musicRecordTab";
import MusicTierVote from "./musicTierVote";

export type { DetailTab, MusicDetailProps } from "./musicDetailTypes";

export default function MusicDetail({
    music,
    difficulty,
    activeTab,
    isLoggedIn,
    userPlayData,
    recentChartPlays,
    scoreTrend,
    chartDetail,
    ranking,
    tier,
}: Props) {
    return (
        <div className="mx-auto flex min-h-screen max-w-(--breakpoint-sm) flex-col gap-3 px-4 py-4">
            <MusicDetailHeader
                music={music}
                difficulty={difficulty}
                levelConstant={chartDetail.level_constant}
            />

            <MusicDetailNavigation
                music={music}
                difficulty={difficulty}
                activeTab={activeTab}
            />

            {activeTab === "record" ? (
                <MusicRecordTab
                    isLoggedIn={isLoggedIn}
                    userPlayData={userPlayData}
                    recentChartPlays={recentChartPlays}
                    scoreTrend={scoreTrend}
                />
            ) : null}

            {activeTab === "detail" ? (
                <MusicInfoTab
                    musicIndex={music.index}
                    difficulty={difficulty}
                    chartDetail={chartDetail}
                />
            ) : null}

            {activeTab === "ranking" ? (
                <MusicRankTable
                    musicIndex={music.index}
                    difficulty={difficulty}
                    rows={ranking.rows}
                    page={ranking.page}
                    pageSize={ranking.pageSize}
                    totalCount={ranking.totalCount}
                    isLoggedIn={isLoggedIn}
                    currentUser={
                        userPlayData && userPlayData.score > 0
                            ? {
                                  rank: ranking.userRank,
                                  score: userPlayData.score,
                                  clearRank: userPlayData.rank,
                                  fcType: userPlayData.fc_type,
                                  user: userPlayData.user,
                              }
                            : null
                    }
                />
            ) : null}

            {activeTab === "tier" ? (
                <MusicTierVote
                    key={chartDetail.id}
                    chartId={chartDetail.id}
                    canVote={Boolean(userPlayData)}
                    difficulty={difficulty}
                    level={chartDetail.level}
                    officialConstant={chartDetail.level_constant}
                    tierConstant={tier.currentConstant}
                    constantHistory={tier.constantHistory}
                    community={tier.community}
                    currentEvaluation={tier.currentEvaluation}
                    opinionCount={tier.opinionCount}
                    opinions={tier.opinions}
                />
            ) : null}
        </div>
    );
}
