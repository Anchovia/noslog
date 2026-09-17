"use client";

import { useTranslations } from "@/components/i18n/localeProvider";
import { useLocale } from "@/components/i18n/localeProvider";
import Avatar from "@/components/ui/avatar";
import type { ChartScorePlayer } from "@/features/music/schemas/chartRankingSchema";

/** 이 거리(px)보다 가까운 핀은 대표 한 명 + 「+N」 으로 묶는다 — 핀 폭 28 + 사진 사이 간격 */
const CLUSTER_DISTANCE = 52;

interface PinGroup {
    key: string;
    x: number;
    y: number;
    me: boolean;
    players: ChartScorePlayer[];
}

/**
 * 점수가 높은 순으로 훑으며 가까운 핀을 묶는다 — 사진끼리 겹치지 않게 나도 같은 거리 규칙을 따른다.
 * 내가 이웃과 묶이면 그 핀의 대표가 나가 되고 나머지는 「+N」 으로 접힌다(내 자리는 늘 보인다) (2026-09-18 사용자 지적)
 */
export function groupPins(
    players: ChartScorePlayer[],
    meId: number | null,
    x: (score: number) => number
) {
    const groups: Omit<PinGroup, "y">[] = [];
    for (const player of [...players].sort((a, b) => b.score - a.score)) {
        const me = player.user_id === meId;
        const at = x(player.score);
        const group = groups.find(
            (candidate) => Math.abs(candidate.x - at) < CLUSTER_DISTANCE
        );
        if (!group) {
            groups.push({
                key: String(player.user_id),
                x: at,
                me,
                players: [player],
            });
            continue;
        }
        if (me) {
            // 내가 낀 핀은 내 사진 · 내 자리로 — 같이 묶인 사람은 「+N」 안에 남는다
            group.key = String(player.user_id);
            group.x = at;
            group.me = true;
            group.players.unshift(player);
        } else group.players.push(player);
    }
    return groups;
}

/**
 * 점수 자 위 사진 핀(E · 2026-09-18) — 핀 끝이 자 위 점수 자리를 가리킨다. 핀 줄은 한 줄 고정(높이에 뜻이 없다).
 * 가까운 사람은 가장 높은 점수의 대표 + 「+N」, 내가 끼면 대표가 나(크게 · 노랑). 누르면 창을 열지 않고 바로 그 사람 순위 줄로
 * (사람이 많아지면 창이 오히려 불편하다 — 사용자 결정)
 */
export default function ScorePins({
    players,
    meId,
    x,
    y,
    onShowPlayer,
}: {
    players: ChartScorePlayer[];
    meId: number | null;
    x: (score: number) => number;
    /** 핀 줄은 점수 자 한 줄에 고정 — 높이에는 뜻이 없다 (2026-09-18) */
    y: number;
    onShowPlayer: (player: ChartScorePlayer) => void;
}) {
    const t = useTranslations();
    const locale = useLocale();
    // 자리를 당기면 끝에서 사진이 다시 뭉치므로 점수 자리를 그대로 쓴다 — 좌우로 조금 넘치는 편이 낫다 (2026-09-18)
    const groups = groupPins(players, meId, x).map((group) => ({
        ...group,
        y,
    }));
    return (
        <div className="nl-score-pins">
            {/* 나를 맨 앞에 — DOM 순서 = 겹칠 때 위 */}
            {[...groups]
                .sort((a, b) => Number(a.me) - Number(b.me))
                .map((group) => {
                    const [lead] = group.players;
                    const name =
                        lead.user.username ?? t("ranking.unknownPlayer");
                    const single = group.players.length === 1;
                    return (
                        <button
                            key={group.key}
                            type="button"
                            className="nl-score-pin"
                            data-me={group.me || undefined}
                            style={{ left: group.x, top: group.y }}
                            aria-label={
                                single
                                    ? t("ranking.pin.player", {
                                          name,
                                          rank: lead.position.toLocaleString(
                                              locale
                                          ),
                                      })
                                    : t("ranking.pin.group", {
                                          name,
                                          count: group.players.length - 1,
                                      })
                            }
                            onClick={() => onShowPlayer(lead)}
                        >
                            <span className="nl-score-pin__shape" aria-hidden />
                            <Avatar
                                src={lead.user.avatar}
                                fallbackName={lead.user.username}
                                size={group.me ? 28 : 24}
                                className="nl-score-pin__photo"
                            />
                            {single ? null : (
                                <span
                                    className="nl-filter-count nl-metadata nl-score-pin__count"
                                    aria-hidden
                                >
                                    +{group.players.length - 1}
                                </span>
                            )}
                        </button>
                    );
                })}
        </div>
    );
}
