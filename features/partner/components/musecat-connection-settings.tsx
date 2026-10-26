"use client";

import { ChevronRight } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
    disconnectMusecatAll,
    updateMusecatSharedItems,
} from "@/app/(site)/settings/partner-actions";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import ActionButton from "@/components/ui/action-button";
import Button from "@/components/ui/button";
import ButtonLink from "@/components/ui/button-link";
import { Checkbox } from "@/components/ui/checkbox";
import IntentLink from "@/components/ui/intent-link";
import ModalDialog from "@/components/ui/modal-dialog";
import ResponsiveDialog from "@/components/ui/responsive-dialog";
import type { MusecatSettings } from "@/features/partner/server/partner-settings-data";

const ITEMS = ["summary", "ranks", "song_records", "recent_plays"] as const;
/** 상세 줄 목록에 보이는 항목(곡별 기록은 형식 합의 전이라 창에서만 잠금으로) */
const LISTED = ["summary", "ranks", "recent_plays"] as const;
const UNAVAILABLE: readonly string[] = ["song_records"];
const DETAIL_QUERY = "?category=connections&partner=musecat";

/** 「3일 전」 같은 상대 시각 — 분 · 시간 · 일 */
function useAgo() {
    const locale = useLocale();
    const [now] = useState(() => Date.now());
    return (iso: string) => {
        const minutes = Math.max(
            1,
            Math.round((now - new Date(iso).getTime()) / 60_000)
        );
        const format = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
        return minutes < 60
            ? format.format(-minutes, "minute")
            : minutes < 1440
              ? format.format(-Math.round(minutes / 60), "hour")
              : format.format(-Math.round(minutes / 1440), "day");
    };
}

/** 메타 줄(2026-10-21 전면 대조 ⑫) — 「연결됨(양방향) · 뮤즈캣 계정 이름 · 마지막 사용 …」 */
function useMetaLine(settings: MusecatSettings) {
    const t = useTranslations();
    const ago = useAgo();
    const username =
        settings.account.status === "none" ? null : settings.account.username;
    const account = settings.account.status !== "none";
    const records = settings.records !== null;
    if (!account && !records) return t("partner.settings.rowNone");
    const lastUsed = settings.records?.lastUsedAt;
    return [
        t(
            account && records
                ? "partner.settings.rowBoth"
                : "partner.status.connected"
        ),
        username,
        lastUsed
            ? t("partner.settings.lastUsed", { when: ago(lastUsed) })
            : null,
    ]
        .filter(Boolean)
        .join(" · ");
}

/** 뮤즈캣 로고 원 — 설정 연결 로고 원 40 에 글자 「M」(시안 ① · ②) */
function MusecatMark() {
    return (
        <span
            className="nl-settings__logo nl-settings__logo--mark nl-emphasis-label"
            aria-hidden
        >
            M
        </span>
    );
}

/** 설정 › 연결 목록의 뮤즈캣 줄(시안 ①) — 줄 전체가 상세로 가는 링크, 로고 「M」 · 이름 · 상태 · 꺾쇠 */
export function MusecatConnectionRow({
    settings,
}: {
    settings: MusecatSettings;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const meta = useMetaLine(settings);
    return (
        <IntentLink
            className="nl-settings__row nl-hover-layer"
            href={`${href("/settings")}${DETAIL_QUERY}`}
        >
            <span className="nl-settings__row-lead">
                <MusecatMark />
                <span className="nl-settings__row-copy">
                    <span className="nl-control">
                        {t("partner.settings.musecat")}
                    </span>
                    <span className="nl-metadata nl-muted">{meta}</span>
                </span>
            </span>
            <ChevronRight className="nl-settings__row-chevron" aria-hidden />
        </IntentLink>
    );
}

/** 상태 줄 — 정상(연결됨)이면 그리지 않고 메타 줄이 말한다. 다시 연결 필요 · 해제 중 · 반영 중만 색 점 태그 + 한 줄 설명(2026-10-21 전면 대조 ⑫) */
function StatusLine({ settings }: { settings: MusecatSettings }) {
    const t = useTranslations();
    const pending = settings.records?.pending ?? [];
    const [tone, label, body] = (
        pending.includes("revocation")
            ? ([
                  "info",
                  "partner.status.revoking",
                  "partner.status.revokingBody",
              ] as const)
            : settings.account.status === "needs_reconnect"
              ? ([
                    "warning",
                    "partner.status.reconnect",
                    "partner.status.reconnectBody",
                ] as const)
              : pending.includes("records_invalidation")
                ? ([
                      "info",
                      "partner.status.syncing",
                      "partner.status.syncingBody",
                  ] as const)
                : [null, null, null]
    ) as readonly [
        "info" | "warning" | null,
        Parameters<typeof t>[0],
        Parameters<typeof t>[0],
    ];
    if (!tone) return null;
    return (
        <>
            <span className="nl-tag nl-tag--status" data-tone={tone}>
                {t(label)}
            </span>
            <p className="nl-body-secondary nl-muted">{t(body)}</p>
        </>
    );
}

/**
 * 뮤즈캣 연결 상세(시안 ②) — 로고 「M」 · 이름 · 「날짜 연결 · 뮤즈캣 계정 이름」 → 상태 줄 →
 * 「뮤즈캣이 볼 수 있는 내 기록」(줄 목록 · 공개 범위 · 「보낼 항목 바꾸기」) ─ 「NosLog 가 쓰는 내 뮤즈캣 계정」 ─ 채운 빨강 「연결 끊기」.
 * 뒤로 「‹ 연결」 은 설정 틀이 그린다. 값은 모두 토큰 · 공용 부품
 */
export function MusecatConnectionDetail({
    settings,
}: {
    settings: MusecatSettings;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const meta = useMetaLine(settings);
    const [editOpen, setEditOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [items, setItems] = useState<string[]>(
        settings.records?.sharedItems ?? []
    );
    const [busy, startTransition] = useTransition();
    const cancelRef = useRef<HTMLButtonElement>(null);
    const connectHref = `/api/musecat/connect?returnTo=${encodeURIComponent(
        `${href("/settings")}${DETAIL_QUERY}`
    )}`;
    const account = settings.account;
    const records = settings.records;
    const connected = account.status !== "none" || records !== null;
    const daysLeft = settings.reconnectDays;

    function saveItems() {
        startTransition(async () => {
            const result = await updateMusecatSharedItems(items).catch(() => ({
                ok: false as const,
            }));
            if (!result.ok) {
                toast.error(t("partner.settings.saveFailed"));
                return;
            }
            setEditOpen(false);
        });
    }
    function disconnect() {
        startTransition(async () => {
            const result = await disconnectMusecatAll().catch(() => ({
                ok: false as const,
            }));
            if (!result.ok) {
                toast.error(t("partner.settings.disconnectFailed"));
                return;
            }
            setConfirmOpen(false);
        });
    }
    const saveButton = (
        <ActionButton busy={busy} onClick={saveItems}>
            {t("partner.settings.save")}
        </ActionButton>
    );

    return (
        <div className="nl-settings__form">
            <div className="nl-settings__row-lead">
                <MusecatMark />
                <div className="nl-settings__row-copy">
                    <h1 className="nl-section-title">
                        {t("partner.settings.musecat")}
                    </h1>
                    <span className="nl-metadata nl-muted">{meta}</span>
                </div>
            </div>

            {!connected ? (
                <div className="nl-settings__zone nl-settings__zone--compact">
                    <p className="nl-body-secondary nl-muted">
                        {t("partner.settings.connectBody")}
                    </p>
                    <div className="nl-button-row">
                        <ButtonLink plain href={connectHref}>
                            {t("partner.settings.connect")}
                        </ButtonLink>
                    </div>
                </div>
            ) : (
                <>
                    <StatusLine settings={settings} />
                    {records ? (
                        <section className="nl-settings__zone nl-settings__zone--compact">
                            <h2 className="nl-component-title">
                                {t("partner.settings.sharedTitle")}
                            </h2>
                            <ul className="nl-musecat-lines">
                                {LISTED.map((item) => {
                                    const sent =
                                        records.sharedItems.includes(item);
                                    // 줄 = 항목 이름 · 오른쪽 「보냄」 / 「안 보냄」(대기 글자색)
                                    return (
                                        <li
                                            key={item}
                                            className="nl-musecat-line"
                                        >
                                            <span className="nl-body nl-musecat-line__copy">
                                                {t(
                                                    `partner.consent.item.${item}`
                                                )}
                                            </span>
                                            <span
                                                className={
                                                    sent
                                                        ? "nl-metadata nl-muted"
                                                        : "nl-metadata nl-musecat-pending"
                                                }
                                            >
                                                {t(
                                                    sent
                                                        ? "partner.settings.sent"
                                                        : "partner.settings.notSent"
                                                )}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                            <p className="nl-metadata nl-muted">
                                {t("partner.settings.followsPrivacy")}
                            </p>
                            <div className="nl-button-row">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setItems(records.sharedItems);
                                        setEditOpen(true);
                                    }}
                                >
                                    {t("partner.settings.editShared")}
                                </Button>
                            </div>
                        </section>
                    ) : null}
                    {records ? <hr className="nl-musecat-rule" /> : null}
                    <section className="nl-settings__zone nl-settings__zone--compact">
                        <h2 className="nl-component-title">
                            {t("partner.settings.musecatAccountTitle")}
                        </h2>
                        {account.status === "none" ? (
                            <div className="nl-button-row">
                                <ButtonLink
                                    plain
                                    variant="secondary"
                                    href={connectHref}
                                >
                                    {t("partner.settings.connect")}
                                </ButtonLink>
                            </div>
                        ) : (
                            <>
                                {/* 쓰는 것 줄 — 무엇을 · 어떻게(보기 / 내 이름으로 올림) */}
                                <ul className="nl-musecat-lines">
                                    {(
                                        [
                                            ["arcades", "read"],
                                            ["reports", "write"],
                                            ["favorites", "write"],
                                        ] as const
                                    ).map(([scope, mode]) => (
                                        <li
                                            key={scope}
                                            className="nl-musecat-line"
                                        >
                                            <span className="nl-body nl-musecat-line__copy">
                                                {t(
                                                    `partner.settings.scope.${scope}`
                                                )}
                                            </span>
                                            <span className="nl-metadata nl-muted">
                                                {t(
                                                    `partner.settings.scope.${mode}`
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                {account.status === "needs_reconnect" ? (
                                    <div className="nl-button-row">
                                        <ButtonLink plain href={connectHref}>
                                            {t("partner.status.reconnect")}
                                        </ButtonLink>
                                    </div>
                                ) : daysLeft !== null ? (
                                    <p className="nl-metadata nl-muted">
                                        {t("partner.settings.reconnectIn", {
                                            days: daysLeft,
                                        })}
                                    </p>
                                ) : null}
                            </>
                        )}
                    </section>
                    <hr className="nl-musecat-rule" />
                    <div className="nl-button-row">
                        <Button
                            variant="secondary"
                            onClick={() => setConfirmOpen(true)}
                        >
                            {t("partner.settings.disconnect")}
                        </Button>
                    </div>
                    <ModalDialog
                        open={confirmOpen}
                        onOpenChange={(next) => {
                            if (!busy) setConfirmOpen(next);
                        }}
                        size="small"
                        variant="confirm"
                        title={t("partner.settings.disconnectTitle")}
                        description={t("partner.settings.disconnectBody")}
                        onOpenAutoFocus={(event) => {
                            event.preventDefault();
                            cancelRef.current?.focus();
                        }}
                        footer={
                            <>
                                <Button
                                    ref={cancelRef}
                                    variant="secondary"
                                    disabled={busy}
                                    onClick={() => setConfirmOpen(false)}
                                >
                                    {t("settings.cancel")}
                                </Button>
                                <ActionButton
                                    variant="danger"
                                    busy={busy}
                                    onClick={disconnect}
                                >
                                    {t("partner.settings.disconnectConfirm")}
                                </ActionButton>
                            </>
                        }
                    />
                    <ResponsiveDialog
                        open={editOpen}
                        onOpenChange={(next) => {
                            if (!busy) setEditOpen(next);
                        }}
                        title={t("partner.settings.sharedDialogTitle")}
                        size="small"
                        fullScreenFooter={saveButton}
                        modalFooter={
                            <>
                                <Button
                                    variant="secondary"
                                    disabled={busy}
                                    onClick={() => setEditOpen(false)}
                                >
                                    {t("settings.cancel")}
                                </Button>
                                {saveButton}
                            </>
                        }
                    >
                        <ul className="nl-musecat-lines nl-musecat-lines--framed">
                            <li className="nl-musecat-line">
                                <Checkbox
                                    label={t("partner.consent.item.profile")}
                                    checked
                                    disabled
                                />
                            </li>
                            {ITEMS.map((item) => (
                                <li key={item} className="nl-musecat-line">
                                    <span className="nl-musecat-line__copy">
                                        <Checkbox
                                            label={t(
                                                `partner.consent.item.${item}`
                                            )}
                                            checked={items.includes(item)}
                                            disabled={UNAVAILABLE.includes(
                                                item
                                            )}
                                            onChange={(event) => {
                                                const checked =
                                                    event.currentTarget.checked;
                                                setItems((current) =>
                                                    checked
                                                        ? [...current, item]
                                                        : current.filter(
                                                              (value) =>
                                                                  value !== item
                                                          )
                                                );
                                            }}
                                        />
                                        {UNAVAILABLE.includes(item) ? (
                                            <span className="nl-metadata nl-muted nl-settings__control-help">
                                                {t(
                                                    `partner.consent.item.${item}.help`
                                                )}
                                            </span>
                                        ) : null}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <p className="nl-metadata nl-muted">
                            {t("partner.settings.sharedDialogNote")}
                        </p>
                    </ResponsiveDialog>
                </>
            )}
        </div>
    );
}
