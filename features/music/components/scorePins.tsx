"use client";

import * as Popover from "@radix-ui/react-popover";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import Avatar from "@/components/ui/avatar";
import CountryMarker from "@/components/ui/countryMarker";
import type { ChartScorePlayer } from "@/features/music/schemas/chartRankingSchema";
import { scoreTone } from "@/lib/music/scoreTone";
import { ScoreGrade } from "./chartLeaderboard";

/** 이 거리(px)보다 가까운 핀은 대표 한 명 + 「+N」 으로 묶는다 — 핀 폭 */
const CLUSTER_DISTANCE = 28;

interface PinGroup {
    key: string;
    x: number;
    y: number;
    me: boolean;
    /** 오른쪽 끝에 가까우면 「+N」 을 왼쪽에 */
    end: boolean;
    players: ChartScorePlayer[];
}

const gradeOf = (player: ChartScorePlayer) =>
    player.fc_type === 3 || player.score >= 1_000_000 ? "P" : player.rank;

/** 점수가 높은 순으로 훑으며 가까운 핀을 묶는다. 나는 늘 따로 */
export function groupPins(
    players: ChartScorePlayer[],
    meId: number | null,
    x: (score: number) => number
) {
    const groups: Omit<PinGroup, "y" | "end">[] = [];
    for (const player of [...players].sort((a, b) => b.score - a.score)) {
        const me = player.user_id === meId;
        const at = x(player.score);
        const group = me
            ? undefined
            : groups.find(
                  (candidate) =>
                      !candidate.me &&
                      Math.abs(candidate.x - at) < CLUSTER_DISTANCE
              );
        if (group) group.players.push(player);
        else
            groups.push({
                key: String(player.user_id),
                x: at,
                me,
                players: [player],
            });
    }
    return groups;
}

function PlayerName({ player }: { player: ChartScorePlayer }) {
    const t = useTranslations();
    return (
        <span className="nl-score-popover__name">
            <CountryMarker country={player.user.country ?? ""} />
            <span className="nl-score-popover__name-text">
                {player.user.username ?? t("ranking.unknownPlayer")}
            </span>
        </span>
    );
}

function PlayerScore({ player }: { player: ChartScorePlayer }) {
    const locale = useLocale();
    return (
        <span
            className="nl-control nl-score-popover__score"
            data-tone={scoreTone(player.score)}
        >
            {player.score.toLocaleString(locale)}
        </span>
    );
}

function Pin({
    group,
    open,
    onOpenChange,
    onShowPlayer,
}: {
    group: PinGroup;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onShowPlayer: (player: ChartScorePlayer) => void;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const pointer = useRef<string>("mouse");
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [lead] = group.players;
    const single = group.players.length === 1;
    const name = lead.user.username ?? t("ranking.unknownPlayer");
    useEffect(
        () => () => {
            if (closeTimer.current) clearTimeout(closeTimer.current);
        },
        []
    );
    const cancelClose = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    };
    const scheduleClose = () => {
        cancelClose();
        closeTimer.current = setTimeout(() => onOpenChange(false), 120);
    };
    const show = (player: ChartScorePlayer) => {
        onOpenChange(false);
        onShowPlayer(player);
    };
    return (
        <Popover.Root open={open} onOpenChange={onOpenChange}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    className="nl-score-pin"
                    data-me={group.me || undefined}
                    data-edge={group.end ? "end" : undefined}
                    style={{ left: group.x, top: group.y }}
                    aria-label={
                        single
                            ? t("ranking.pin.player", {
                                  name,
                                  rank: lead.position.toLocaleString(locale),
                              })
                            : t("ranking.pin.group", {
                                  name,
                                  count: group.players.length - 1,
                              })
                    }
                    onPointerDown={(event) => {
                        pointer.current = event.pointerType;
                    }}
                    onPointerEnter={(event) => {
                        pointer.current = event.pointerType;
                        if (event.pointerType !== "mouse") return;
                        cancelClose();
                        onOpenChange(true);
                    }}
                    onPointerLeave={(event) => {
                        if (event.pointerType === "mouse") scheduleClose();
                    }}
                    onClick={(event) => {
                        event.preventDefault();
                        // 데스크톱(마우스): 한 사람은 바로 순위로 · 폰(터치): 카드를 연다 (2026-09-17)
                        if (single && pointer.current === "mouse") show(lead);
                        else onOpenChange(true);
                    }}
                >
                    <span className="nl-score-pin__shape" aria-hidden />
                    <Avatar
                        src={lead.user.avatar}
                        fallbackName={lead.user.username}
                        size={group.me ? 28 : 24}
                        className="nl-score-pin__photo"
                    />
                    {single ? null : (
                        <span className="nl-score-pin__count" aria-hidden>
                            +{group.players.length - 1}
                        </span>
                    )}
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    side="bottom"
                    sideOffset={12}
                    collisionPadding={16}
                    onOpenAutoFocus={(event) => {
                        if (pointer.current === "mouse") event.preventDefault();
                    }}
                    onCloseAutoFocus={(event) => event.preventDefault()}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                    className="noslog-ui nl-score-popover"
                    data-kind={single ? "player" : "group"}
                >
                    {single ? (
                        // 한 사람 = 가로 카드, 카드 전체가 「순위에서 보기」 (2026-09-17 E · K1)
                        <button
                            type="button"
                            className="nl-score-card"
                            onClick={() => show(lead)}
                        >
                            <Avatar
                                src={lead.user.avatar}
                                fallbackName={lead.user.username}
                                size={44}
                            />
                            <span className="nl-score-card__body">
                                <PlayerName player={lead} />
                                <span className="nl-score-card__meta">
                                    <span className="nl-metadata nl-muted">
                                        #{lead.position.toLocaleString(locale)}
                                    </span>
                                    <ScoreGrade rank={gradeOf(lead)} />
                                    <PlayerScore player={lead} />
                                </span>
                            </span>
                            <ChevronRight
                                className="nl-score-popover__chevron"
                                aria-hidden
                            />
                            <span className="sr-only">
                                {t("ranking.pin.show")}
                            </span>
                        </button>
                    ) : (
                        // 묶음 = 목록 한 장, 줄 = 순위표와 같은 말투 · 줄을 누르면 그 사람 순위로 (2026-09-17 E · K3)
                        <div className="nl-score-list">
                            <p className="nl-metadata nl-muted nl-score-list__title">
                                {t("ranking.pin.nearby", {
                                    count: group.players.length,
                                })}
                            </p>
                            <ul>
                                {group.players.map((player) => (
                                    <li key={player.user_id}>
                                        <button
                                            type="button"
                                            className="nl-score-list__row"
                                            onClick={() => show(player)}
                                        >
                                            <span className="nl-metadata nl-muted nl-score-list__rank">
                                                {player.position.toLocaleString(
                                                    locale
                                                )}
                                            </span>
                                            <Avatar
                                                src={player.user.avatar}
                                                fallbackName={
                                                    player.user.username
                                                }
                                                size={28}
                                            />
                                            <PlayerName player={player} />
                                            <ScoreGrade
                                                rank={gradeOf(player)}
                                            />
                                            <PlayerScore player={player} />
                                            <ChevronRight
                                                className="nl-score-popover__chevron"
                                                aria-hidden
                                            />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}

/**
 * 점수 분포 곡선 위 사진 핀(E) — 핀 끝이 곡선 위 점수 자리를 가리킨다. 가까운 사람은 가장 높은 점수의 대표 + 「+N」, 나는 늘 따로(크게 · 흰 테두리).
 * 한 사람 핀 = 가로 카드, 묶음 = 목록. 폰은 탭으로 열고 카드 · 줄을 눌러야 순위로, 데스크톱은 마우스를 올리면 열리고 한 사람 핀을 누르면 바로 순위로 (2026-09-17)
 */
export default function ScorePins({
    players,
    meId,
    width,
    x,
    y,
    onShowPlayer,
}: {
    players: ChartScorePlayer[];
    meId: number | null;
    width: number;
    x: (score: number) => number;
    y: (score: number) => number;
    onShowPlayer: (player: ChartScorePlayer) => void;
}) {
    const [openKey, setOpenKey] = useState<string | null>(null);
    const groups = groupPins(players, meId, x).map((group) => ({
        ...group,
        y: y(group.players[0].score),
        end: group.x > width - 28,
    }));
    return (
        <div className="nl-score-pins">
            {groups.map((group) => (
                <span
                    key={`dot-${group.key}`}
                    className="nl-score-pins__dot"
                    data-me={group.me || undefined}
                    style={{ left: group.x, top: group.y }}
                    aria-hidden
                />
            ))}
            {/* 나를 맨 앞에 — DOM 순서 = 겹칠 때 위 */}
            {[...groups]
                .sort((a, b) => Number(a.me) - Number(b.me))
                .map((group) => (
                    <Pin
                        key={group.key}
                        group={group}
                        open={openKey === group.key}
                        onOpenChange={(open) =>
                            setOpenKey((current) =>
                                open
                                    ? group.key
                                    : current === group.key
                                      ? null
                                      : current
                            )
                        }
                        onShowPlayer={onShowPlayer}
                    />
                ))}
        </div>
    );
}
