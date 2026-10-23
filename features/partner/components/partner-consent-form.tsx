"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { useTranslations } from "@/components/i18n/locale-provider";
import ActionButton from "@/components/ui/action-button";
import Button from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { MessageKey } from "@/lib/i18n/messages";

/** 동의 화면 항목 순서(2026-10-20 결정) — 서버의 PARTNER_SHARE_ITEMS 와 같다 */
const ITEMS = ["summary", "ranks", "song_records", "recent_plays"] as const;
type Item = (typeof ITEMS)[number];
/** 뮤즈캣과 형식을 맞추기 전이라 고를 수 없는 항목 */
const UNAVAILABLE: readonly Item[] = ["song_records"];

function SubmitButtons({ deny }: { deny: () => Promise<void> }) {
    const t = useTranslations();
    const { pending } = useFormStatus();
    return (
        <div className="nl-auth-steps">
            <ActionButton
                type="submit"
                className="nl-auth-submit"
                busy={pending}
                busyLabel={t("partner.consent.approving")}
            >
                {t("partner.consent.approve")}
            </ActionButton>
            <Button
                type="submit"
                variant="secondary"
                formAction={deny}
                formNoValidate
                disabled={pending}
            >
                {t("partner.consent.deny")}
            </Button>
        </div>
    );
}

/**
 * 파트너 동의 폼 — 항목은 하나씩 고르고 기본은 모두 해제, 기본 프로필은 필수라 잠긴 체크(2026-10-20 동의 화면 안 B).
 * 고른 항목은 Server Action 이 다시 걸러 저장한다.
 */
export default function PartnerConsentForm({
    clientName,
    host,
    wantsRecords,
    initialItems,
    scoresPrivate,
    activityPrivate,
    approve,
    deny,
}: {
    clientName: string;
    host: string;
    wantsRecords: boolean;
    initialItems: string[];
    scoresPrivate: boolean;
    activityPrivate: boolean;
    approve: (formData: FormData) => Promise<void>;
    deny: () => Promise<void>;
}) {
    const t = useTranslations();
    const available = ITEMS.filter((item) => !UNAVAILABLE.includes(item));
    const [selected, setSelected] = useState<Item[]>(() =>
        available.filter((item) => initialItems.includes(item))
    );
    const allSelected = available.every((item) => selected.includes(item));
    const toggle = (item: Item, checked: boolean) =>
        setSelected((current) =>
            checked
                ? [...current, item]
                : current.filter((value) => value !== item)
        );
    const note = (item: Item) => {
        if (item === "recent_plays" && activityPrivate)
            return t("partner.consent.privateActivity");
        if (scoresPrivate) return t("partner.consent.privateScores");
        return null;
    };
    const legal: [MessageKey, string][] = [
        ["partner.consent.legal.recipient", clientName],
        [
            "partner.consent.legal.purpose",
            t("partner.consent.legal.purposeValue", { client: clientName }),
        ],
        ["partner.consent.legal.items", t("partner.consent.legal.itemsValue")],
        [
            "partner.consent.legal.retention",
            t("partner.consent.legal.retentionValue"),
        ],
        [
            "partner.consent.legal.refusal",
            t("partner.consent.legal.refusalValue"),
        ],
    ];

    // 항목 두 묶음(2026-10-21 전면 대조 ⑪) — 「항상 보내요」 = 필수 프로필 글, 「골라서 보내요」 = 모두 선택(아래 구분선) + 체크.
    // 못 보내는 항목은 목록에서 빼고 맨 아래 한 줄. 공개 범위 경고는 도움말 아래 따로
    return (
        <form action={approve} className="nl-auth-form">
            <section
                className="nl-consent-group"
                aria-labelledby="consent-always"
            >
                <h2 id="consent-always" className="nl-metadata nl-muted">
                    {t("partner.consent.always")}
                </h2>
                <div>
                    <p className="nl-body">
                        {t("partner.consent.item.profile")}
                    </p>
                    <p className="nl-metadata nl-muted">
                        {t("partner.consent.item.profile.help")}
                    </p>
                </div>
            </section>
            {wantsRecords ? (
                <section
                    className="nl-consent-group"
                    aria-labelledby="consent-optional"
                >
                    <h2 id="consent-optional" className="nl-metadata nl-muted">
                        {t("partner.consent.optional")}
                    </h2>
                    <div className="nl-auth-privacy">
                        <div className="nl-consent-select-all">
                            <Checkbox
                                label={
                                    <span className="nl-emphasis-label">
                                        {t("partner.consent.selectAll")}
                                    </span>
                                }
                                checked={allSelected}
                                onChange={(event) =>
                                    setSelected(
                                        event.currentTarget.checked
                                            ? available
                                            : []
                                    )
                                }
                            />
                        </div>
                        {available.map((item) => {
                            const privacy = note(item);
                            return (
                                <div key={item}>
                                    <Checkbox
                                        name="item"
                                        value={item}
                                        label={t(
                                            `partner.consent.item.${item}`
                                        )}
                                        checked={selected.includes(item)}
                                        onChange={(event) =>
                                            toggle(
                                                item,
                                                event.currentTarget.checked
                                            )
                                        }
                                        aria-describedby={`consent-${item}-help`}
                                    />
                                    <div
                                        id={`consent-${item}-help`}
                                        className="nl-settings__control-help"
                                    >
                                        <p className="nl-metadata nl-muted">
                                            {t(
                                                `partner.consent.item.${item}.help`
                                            )}
                                        </p>
                                        {privacy ? (
                                            <p className="nl-metadata nl-muted">
                                                {privacy}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {UNAVAILABLE.length ? (
                        <p className="nl-metadata nl-muted">
                            {t("partner.consent.unavailable", {
                                items: UNAVAILABLE.map((item) =>
                                    t(`partner.consent.item.${item}`)
                                ).join(" · "),
                            })}
                        </p>
                    ) : null}
                </section>
            ) : null}
            <section
                className="nl-info-section"
                aria-labelledby="consent-legal"
            >
                <h2 id="consent-legal" className="nl-metadata nl-muted">
                    {t("partner.consent.legalTitle", { client: clientName })}
                </h2>
                <dl className="nl-info-rows">
                    {legal.map(([label, value]) => (
                        <div key={label}>
                            <dt className="nl-control">{t(label)}</dt>
                            <dd className="nl-body-secondary nl-muted">
                                {value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>
            <p className="nl-metadata nl-muted">
                {t("partner.consent.optionalNote")}
            </p>
            <SubmitButtons deny={deny} />
            {/* 믿을 곳 정보 — 버튼 아래 두 줄 */}
            <div className="nl-consent-trust">
                <p className="nl-metadata nl-muted">
                    {t("partner.consent.returnTo", { host })}
                </p>
                <p className="nl-metadata nl-muted">
                    {t("partner.consent.thirdParty", { client: clientName })}
                </p>
            </div>
        </form>
    );
}
