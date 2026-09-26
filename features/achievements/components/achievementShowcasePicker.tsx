"use client";

import { X } from "lucide-react";
import { useRef, useState } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import ModalDialog from "@/components/ui/modalDialog";
import {
    ACHIEVEMENT_DEFINITIONS,
    ACHIEVEMENT_SHOWCASE_SIZE,
    highestAchievementTiers,
    summarizeAchievements,
    type AchievementRecords,
} from "@/features/achievements/achievementDefinitions";
import AchievementHex from "@/features/achievements/components/achievementHex";
import { useAchievementText } from "@/features/achievements/components/useAchievementText";

function splitKeys(value: string) {
    return value.split(",").filter(Boolean);
}

/**
 * 설정 「프로필」 탭의 「프로필 업적」 칸(2026-09-25 D1) — 선호 오락실 칸과 같은 모양(값 + 「변경」 → 창).
 * 창에서 고른 값은 폼에 들어가고 「저장」 때 함께 저장된다. 빈 값 = 자동(높은 단계 → 달성 인원 적은 순).
 */
export default function AchievementShowcasePicker({
    records,
    value,
    onChange,
    disabled,
    error,
}: {
    records: AchievementRecords;
    /** 건 업적 키를 쉼표로 이은 값(폼 값) */
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
}) {
    const t = useTranslations();
    const text = useAchievementText();
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<string[]>([]);
    const changeButton = useRef<HTMLButtonElement>(null);
    const highest = highestAchievementTiers(records.earned);
    const earned = ACHIEVEMENT_DEFINITIONS.filter((definition) =>
        highest.has(definition.key)
    );
    const selected = splitKeys(value).filter((key) => highest.has(key));
    // 지금 머리에 보이는 것 — 고른 것이 없으면 자동 진열
    const shown = summarizeAchievements({
        ...records,
        pins: selected,
    }).showcase;

    function toggle(key: string) {
        setDraft((current) =>
            current.includes(key)
                ? current.filter((item) => item !== key)
                : current.length < ACHIEVEMENT_SHOWCASE_SIZE
                  ? [...current, key]
                  : current
        );
    }

    return (
        <div className="nl-settings__zone">
            <p className="nl-control">{t("achievement.settings.label")}</p>
            <div className="nl-settings__arcade-row">
                {earned.length ? (
                    <p className="nl-achievement-settings__value">
                        {shown.map((item) => (
                            <AchievementHex
                                key={item.key}
                                achievementKey={item.key}
                                tier={item.tier}
                                size="inline"
                                label={text.aria(item.key, item.tier)}
                            />
                        ))}
                        {selected.length ? null : (
                            <span className="nl-metadata nl-muted">
                                {t("achievement.settings.auto")}
                            </span>
                        )}
                    </p>
                ) : (
                    <p className="nl-body nl-muted">{t("achievement.empty")}</p>
                )}
                {earned.length ? (
                    <div className="nl-settings__actions">
                        <Button
                            ref={changeButton}
                            variant="secondary"
                            disabled={disabled}
                            onClick={() => {
                                setDraft(selected);
                                setOpen(true);
                            }}
                        >
                            {t("achievement.settings.change")}
                        </Button>
                    </div>
                ) : null}
            </div>
            <p className="nl-metadata nl-muted">
                {t("achievement.settings.help", {
                    max: ACHIEVEMENT_SHOWCASE_SIZE,
                })}
            </p>
            {error ? (
                <p role="alert" className="nl-metadata nl-field__error">
                    {error}
                </p>
            ) : null}
            <ModalDialog
                className="nl-settings-dialog"
                open={open}
                onOpenChange={setOpen}
                title={t("achievement.settings.label")}
                description={t("achievement.settings.dialogHelp", {
                    max: ACHIEVEMENT_SHOWCASE_SIZE,
                })}
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    changeButton.current?.focus();
                }}
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                onChange("");
                                setOpen(false);
                            }}
                        >
                            {t("achievement.settings.useAuto")}
                        </Button>
                        <Button
                            onClick={() => {
                                onChange(draft.join(","));
                                setOpen(false);
                            }}
                        >
                            {t("achievement.settings.apply")}
                        </Button>
                    </>
                }
            >
                <div className="nl-achievement-picker">
                    <ol className="nl-pick-slots">
                        {Array.from(
                            { length: ACHIEVEMENT_SHOWCASE_SIZE },
                            (_, index) => {
                                const key = draft[index];
                                if (!key)
                                    return (
                                        <li
                                            key={`empty-${index}`}
                                            className="nl-pick-slot nl-control"
                                            data-empty
                                        >
                                            {index + 1} ·{" "}
                                            {t(
                                                "achievement.settings.emptySlot"
                                            )}
                                        </li>
                                    );
                                const name = text.titled(
                                    key,
                                    highest.get(key) ?? 0
                                );
                                return (
                                    <li
                                        key={key}
                                        className="nl-pick-slot nl-control"
                                    >
                                        <span className="nl-pick-slot__label">
                                            <AchievementHex
                                                achievementKey={key}
                                                tier={highest.get(key) ?? 0}
                                                size="inline"
                                            />
                                            <span>
                                                {index + 1} · {name}
                                            </span>
                                        </span>
                                        <button
                                            type="button"
                                            className="nl-pick-slot__remove"
                                            aria-label={t(
                                                "achievement.settings.removeAria",
                                                { name }
                                            )}
                                            onClick={() =>
                                                setDraft((current) =>
                                                    current.filter(
                                                        (item) => item !== key
                                                    )
                                                )
                                            }
                                        >
                                            <X
                                                className="nl-icon-small"
                                                aria-hidden
                                            />
                                        </button>
                                    </li>
                                );
                            }
                        )}
                    </ol>
                    <p className="nl-metadata nl-muted">
                        {t("achievement.settings.earned")}
                    </p>
                    <div
                        className="nl-achievement-picker__choices"
                        role="group"
                        aria-label={t("achievement.settings.earned")}
                    >
                        {earned.map((definition) => {
                            const tier = highest.get(definition.key) ?? 0;
                            const picked = draft.includes(definition.key);
                            return (
                                <button
                                    key={definition.key}
                                    type="button"
                                    className="nl-achievement-picker__choice"
                                    aria-pressed={picked}
                                    disabled={
                                        !picked &&
                                        draft.length >=
                                            ACHIEVEMENT_SHOWCASE_SIZE
                                    }
                                    onClick={() => toggle(definition.key)}
                                >
                                    <AchievementHex
                                        achievementKey={definition.key}
                                        tier={tier}
                                    />
                                    <span className="nl-metadata">
                                        {text.titled(definition.key, tier)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </ModalDialog>
        </div>
    );
}
