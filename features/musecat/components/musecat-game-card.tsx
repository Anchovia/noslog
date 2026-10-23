"use client";

import { ChevronDown, ExternalLink, Flag } from "lucide-react";
import { useId, useState, useTransition } from "react";
import { toast } from "sonner";

import {
    checkMusecatCampaign,
    reactMusecatFault,
    withdrawMusecatFault,
} from "@/app/(site)/gamecenter/musecat-actions";
import { useLocale, useTranslations } from "@/components/i18n/locale-provider";
import ActionButton from "@/components/ui/action-button";
import Button from "@/components/ui/button";
import ButtonLink from "@/components/ui/button-link";
import StatusDot from "@/components/ui/status-dot";
import { daysAgo } from "@/features/arcades/arcade-discovery";
import { CabinetFeatures } from "@/features/arcades/components/arcade-traits";
import {
    MUSECAT_DISRUPTIONS,
    type MusecatArcade,
    type MusecatFlag,
    type MusecatGame,
} from "@/features/musecat/musecat-arcade";

import {
    type MusecatAction,
    musecatErrorKey,
    MusecatFaultDialog,
} from "./musecat-dialogs";

/** 쓰는 사람이 연결 · 로그인 상태를 알려 준다 — 연결 안 했으면 동작 대신 연결 안내를 띄운다 */
export interface MusecatGameViewer {
    connected: boolean;
    username: string | null;
    requireConnection: (action: MusecatAction) => boolean;
}

function worstDisruption(flags: MusecatFlag[]) {
    return flags
        .map((flag) => flag.disruption)
        .filter((value): value is NonNullable<typeof value> => value !== null)
        .sort(
            (a, b) =>
                MUSECAT_DISRUPTIONS.indexOf(a) - MUSECAT_DISRUPTIONS.indexOf(b)
        )[0];
}

/**
 * NOSTALGIA 게임 카드(뮤즈캣 시안 PAGE 2 · 3, 2026-10-21 전면 대조 ①) — 면 카드 하나 안에
 * 이름 → 대수 · 요금 · 위치 메타 → 고장 상태(색 점) → 새 버전 확인 → NosLog 기체 특징 판 → 「고장 내용 보기 · 고장 신고」(보조 버튼).
 * 고장 내용은 같은 카드 안에서 펼친다(정도 · 내용 · 처음 신고 · 해결 투표, 내 신고는 거두기)
 */
export default function MusecatGameCard({
    data,
    game,
    viewer,
}: {
    data: MusecatArcade;
    game: MusecatGame;
    viewer: MusecatGameViewer;
}) {
    const t = useTranslations();
    const { arcade } = data;
    const [open, setOpen] = useState(false);
    const [visitRequired, setVisitRequired] = useState(false);
    const [busy, startTransition] = useTransition();
    const worst = worstDisruption(game.flags);
    const featured = arcade.cabinets.find(
        (cabinet) =>
            cabinet.featureNote || Object.values(cabinet.features).some(Boolean)
    );
    function answerCampaign(result: "still_old" | "updated") {
        if (!game.campaign) return;
        if (!viewer.requireConnection("campaign")) return;
        const campaign = game.campaign;
        startTransition(async () => {
            const response = await checkMusecatCampaign({
                slug: arcade.slug,
                arcade: data.musecatId,
                gameId: game.id,
                campaignId: campaign.id,
                result,
            }).catch(() => ({ ok: false as const, error: "failed" as const }));
            if (!response.ok) {
                // 오늘 뮤즈캣 방문 인증이 없으면 두 버튼 대신 방문 인증 링크(캠페인 안 B)
                if (response.error === "visit_required") setVisitRequired(true);
                else toast.error(t(musecatErrorKey(response.error)));
                return;
            }
            toast.success(
                response.xp
                    ? t("musecat.campaign.thanksXp", { xp: response.xp })
                    : t("musecat.campaign.thanks")
            );
        });
    }
    const reportButton = viewer.connected ? (
        <MusecatFaultDialog
            slug={arcade.slug}
            musecatId={data.musecatId}
            arcadeName={arcade.name}
            game={game}
            username={viewer.username}
            trigger={
                <Button size="sm" variant="secondary">
                    <Flag className="nl-icon-small" aria-hidden />
                    {t("musecat.fault.title")}
                </Button>
            }
        />
    ) : (
        <Button
            size="sm"
            variant="secondary"
            onClick={() => viewer.requireConnection("fault")}
        >
            <Flag className="nl-icon-small" aria-hidden />
            {t("musecat.fault.title")}
        </Button>
    );
    const detailsId = useId();
    const sub = [...game.prices.map((price) => price.text), game.location]
        .filter(Boolean)
        .join(" · ");
    const traits = game.nostalgia ? featured : undefined;
    return (
        <li className="nl-musecat-game">
            {/* 줄 = 이름(왼쪽) · 대수(오른쪽) → 요금 · 위치 → 고장 상태 색 글자 → 「자세히」 펼침(2026-10-23 게임 목록 시안 안 A —
                장소 상세 안 항목 목록 21곳 실측: 구분선 줄 · 수량은 오른쪽 · 상태는 이름 아래 · 줄에는 버튼 없음 · Pinball Map 「Machine details」) */}
            <div className="nl-musecat-game__top">
                <h3 className="nl-entity-title">{game.title}</h3>
                <span className="nl-body-secondary nl-muted">
                    {t("arcades.machineCountValue", { count: game.quantity })}
                </span>
            </div>
            {sub ? <p className="nl-body-secondary nl-muted">{sub}</p> : null}
            {data.closed ? null : (
                <p
                    className="nl-musecat-game__status nl-emphasis-label"
                    data-state={game.flags.length ? "fault" : "ok"}
                >
                    {game.flags.length
                        ? `${t("musecat.fault.count", { count: game.flags.length })}${
                              worst
                                  ? ` · ${t(`musecat.disruption.${worst}`)}`
                                  : ""
                          }`
                        : t("musecat.fault.none")}
                </p>
            )}
            {open ? (
                <div id={detailsId} className="nl-musecat-game__details">
                    {viewer.connected
                        ? game.flags.map((flag) => (
                              <FlagDetail
                                  key={flag.id}
                                  data={data}
                                  game={game}
                                  flag={flag}
                              />
                          ))
                        : null}
                    {game.campaign && !data.closed ? (
                        <>
                            <p className="nl-emphasis-label">
                                {t("musecat.campaign.title")}
                            </p>
                            <p className="nl-body-secondary nl-muted">
                                {t("musecat.campaign.question", {
                                    version: game.campaign.targetVersion,
                                })}
                            </p>
                            {visitRequired ? (
                                <div className="nl-button-row">
                                    <ButtonLink
                                        plain
                                        size="sm"
                                        variant="secondary"
                                        href={data.musecatUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {t("musecat.campaign.visit")}
                                        <ExternalLink
                                            className="nl-icon-small"
                                            aria-hidden
                                        />
                                    </ButtonLink>
                                </div>
                            ) : (
                                <div className="nl-button-row">
                                    <ActionButton
                                        size="sm"
                                        variant="secondary"
                                        disabled={busy}
                                        onClick={() =>
                                            answerCampaign("still_old")
                                        }
                                    >
                                        {t("musecat.campaign.stillOld")}
                                    </ActionButton>
                                    <ActionButton
                                        size="sm"
                                        variant="secondary"
                                        disabled={busy}
                                        onClick={() =>
                                            answerCampaign("updated")
                                        }
                                    >
                                        {t("musecat.campaign.updated")}
                                    </ActionButton>
                                </div>
                            )}
                        </>
                    ) : null}
                    {traits ? (
                        <>
                            <CabinetFeatures
                                features={traits.features}
                                note={traits.featureNote}
                            />
                            <p className="nl-metadata nl-muted">
                                {t("musecat.noslogTraits")}
                            </p>
                        </>
                    ) : null}
                    {data.closed ? null : (
                        <div className="nl-button-row">{reportButton}</div>
                    )}
                </div>
            ) : null}
            <button
                type="button"
                className="nl-musecat-game__toggle nl-control"
                aria-expanded={open}
                aria-controls={detailsId}
                onClick={() => setOpen((value) => !value)}
            >
                {t(open ? "musecat.game.hide" : "musecat.game.details")}
                <ChevronDown
                    className="nl-icon-small nl-disclosure__chevron"
                    aria-hidden
                />
            </button>
        </li>
    );
}

/** 고장 한 건(시안 PAGE 3 ③ · ④) — 정도(점) · 내용 · 처음 신고, 남의 신고는 해결 투표 두 버튼 + 투표 현황, 내 신고는 거두기 */
function FlagDetail({
    data,
    game,
    flag,
}: {
    data: MusecatArcade;
    game: MusecatGame;
    flag: MusecatFlag;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const [busy, startTransition] = useTransition();
    const [voted, setVoted] = useState(flag.resolution?.myVote ?? null);
    const [now] = useState(() => new Date());
    const days = daysAgo(flag.createdAt, now) ?? 0;
    const when =
        days === 0
            ? t("musecat.fault.justNow")
            : new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
                  -days,
                  "day"
              );
    function run(action: () => Promise<{ ok: boolean; error?: string }>) {
        startTransition(async () => {
            const result = await action().catch(() => ({
                ok: false,
                error: "failed",
            }));
            if (!result.ok) toast.error(t(musecatErrorKey(result.error ?? "")));
        });
    }
    const resolveIn = flag.resolution?.resolveAt
        ? Math.max(
              0,
              Math.round(
                  (new Date(flag.resolution.resolveAt).getTime() -
                      now.getTime()) /
                      60_000
              )
          )
        : null;
    return (
        <>
            <div className="nl-musecat-flag">
                {flag.disruption ? (
                    <p className="nl-musecat-status nl-control">
                        <StatusDot tone="danger" />
                        {t(`musecat.disruption.${flag.disruption}`)}
                    </p>
                ) : null}
                {flag.message ? (
                    <p className="nl-body-secondary nl-musecat-pre">
                        {flag.message}
                    </p>
                ) : null}
                <p className="nl-metadata nl-muted">
                    {flag.mine
                        ? t(
                              flag.canWithdraw
                                  ? "musecat.fault.mineWithdrawable"
                                  : "musecat.fault.mineMeta",
                              { when }
                          )
                        : t("musecat.fault.firstReport", {
                              author: flag.author ?? "",
                              when,
                          })}
                    {flag.photoCount
                        ? ` · ${t("musecat.fault.photos", { count: flag.photoCount })}`
                        : null}
                </p>
            </div>
            {flag.mine ? (
                flag.canWithdraw ? (
                    <div className="nl-button-row">
                        <ActionButton
                            size="sm"
                            variant="secondary"
                            busy={busy}
                            onClick={() =>
                                run(() =>
                                    withdrawMusecatFault({
                                        slug: data.arcade.slug,
                                        gameId: game.id,
                                        flagId: flag.id,
                                    })
                                )
                            }
                        >
                            {t("musecat.fault.withdraw")}
                        </ActionButton>
                    </div>
                ) : null
            ) : (
                <>
                    <div className="nl-button-row">
                        {(["fixed", "issue_persist"] as const).map(
                            (reaction) => (
                                <ActionButton
                                    key={reaction}
                                    size="sm"
                                    variant="secondary"
                                    disabled={busy}
                                    aria-pressed={
                                        voted ===
                                        (reaction === "fixed"
                                            ? "fixed"
                                            : "wrong")
                                    }
                                    onClick={() =>
                                        run(async () => {
                                            const result =
                                                await reactMusecatFault({
                                                    slug: data.arcade.slug,
                                                    arcade: data.musecatId,
                                                    flagId: flag.id,
                                                    reaction,
                                                });
                                            if (result.ok)
                                                setVoted(
                                                    reaction === "fixed"
                                                        ? "fixed"
                                                        : "wrong"
                                                );
                                            return result;
                                        })
                                    }
                                >
                                    {t(
                                        reaction === "fixed"
                                            ? "musecat.fault.fixed"
                                            : "musecat.fault.persist"
                                    )}
                                </ActionButton>
                            )
                        )}
                    </div>
                    {flag.resolution ? (
                        <>
                            <hr className="nl-musecat-rule" />
                            <div className="nl-heading-row">
                                <span className="nl-metadata nl-muted">
                                    {t("musecat.fault.votes", {
                                        fixed: flag.resolution.fixedVoters,
                                        wrong: flag.resolution.wrongVoters,
                                    })}
                                </span>
                                {resolveIn !== null ? (
                                    <span className="nl-metadata nl-muted nl-heading-row__end">
                                        {t("musecat.fault.resolveIn", {
                                            time: new Intl.NumberFormat(
                                                locale,
                                                {
                                                    style: "unit",
                                                    unit:
                                                        resolveIn >= 60
                                                            ? "hour"
                                                            : "minute",
                                                    unitDisplay: "long",
                                                    maximumFractionDigits: 0,
                                                }
                                            ).format(
                                                resolveIn >= 60
                                                    ? Math.floor(resolveIn / 60)
                                                    : resolveIn
                                            ),
                                        })}
                                    </span>
                                ) : null}
                            </div>
                            <p className="nl-metadata nl-muted">
                                {t("musecat.fault.resolveNote")}
                            </p>
                        </>
                    ) : null}
                </>
            )}
        </>
    );
}
