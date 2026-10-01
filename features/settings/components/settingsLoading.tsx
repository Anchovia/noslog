import { ChevronRight } from "lucide-react";
import { foundationButtonClass } from "@/components/ui/Button";
import DiscordIcon from "@/components/ui/DiscordIcon";
import { LoadingStatus, SkeletonText } from "@/components/ui/skeleton";
import {
    PRIVACY_HELP,
    settingsPrivacySchema,
} from "@/features/settings/schemas/settingsSchema";
import type { SettingsPrivacyValues } from "@/features/settings/schemas/settingsSchema";
import { getServerI18n } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

type Translate = Awaited<ReturnType<typeof getServerI18n>>["t"];

/** 버튼 자리 — 실제 버튼 클래스 · 글자로 크기를 잡고 글자는 숨긴다(글자 길이에 따라 폭이 달라 줄이 튀지 않게) */
function ButtonSkeleton({ label }: { label: string }) {
    return (
        <span
            className={cn(
                foundationButtonClass({ variant: "secondary" }),
                "nl-skeleton nl-settings__skeleton-button"
            )}
        >
            {label}
        </span>
    );
}

function ProfileRows({ t }: { t: Translate }) {
    return (
        <div className="nl-settings__rows">
            <div className="nl-settings__row nl-settings__row--stack">
                <div className="nl-settings__row-lead">
                    <span className="nl-avatar nl-skeleton nl-settings__skeleton-avatar" />
                    <div className="nl-settings__row-copy">
                        <p className="nl-control">{t("settings.avatar")}</p>
                        <p className="nl-metadata nl-muted">
                            {t("settings.avatarFormat")}
                        </p>
                    </div>
                </div>
                <div className="nl-settings__actions">
                    <ButtonSkeleton label={t("settings.changePhoto")} />
                </div>
            </div>
            <div className="nl-field">
                <p className="nl-field__label">{t("onboarding.nickname")}</p>
                <span className="nl-skeleton nl-skeleton-control" />
                <p className="nl-field__help">{t("settings.nicknameHelp")}</p>
            </div>
        </div>
    );
}

function PrivacyRows({ t }: { t: Translate }) {
    const keys = Object.keys(
        settingsPrivacySchema.shape
    ) as (keyof SettingsPrivacyValues)[];
    return (
        <div className="nl-settings__rows">
            {keys.map((key) => {
                const help = PRIVACY_HELP[key];
                return (
                    <div key={key} className="nl-settings__row">
                        <div className="nl-settings__row-copy">
                            <p className="nl-control">{t(`settings.${key}`)}</p>
                            {help ? (
                                <p className="nl-metadata nl-muted">
                                    {t(help)}
                                </p>
                            ) : null}
                        </div>
                        <span className="nl-skeleton nl-settings__skeleton-switch" />
                    </div>
                );
            })}
        </div>
    );
}

function ConnectionRows({ t }: { t: Translate }) {
    return (
        <div className="nl-settings__rows">
            <div className="nl-settings__row nl-settings__row--stack">
                <div className="nl-settings__row-lead">
                    <span className="nl-settings__logo">
                        <DiscordIcon />
                    </span>
                    <div className="nl-settings__row-copy">
                        <SkeletonText className="nl-control" width="m" />
                        <p className="nl-metadata nl-muted">
                            Discord · {t("settings.loginAccount")}
                        </p>
                    </div>
                </div>
                <div className="nl-settings__actions">
                    <ButtonSkeleton label={t("settings.refreshDiscord")} />
                    <ButtonSkeleton label={t("settings.changeLoginAccount")} />
                </div>
            </div>
        </div>
    );
}

function AccountRows({ t }: { t: Translate }) {
    return (
        <>
            <div className="nl-settings__zone">
                <ButtonSkeleton label={t("profile.logout")} />
            </div>
            <div className="nl-settings__zone">
                <div className="nl-settings__rows">
                    <div className="nl-settings__row">
                        <span className="nl-settings__row-copy">
                            <span className="nl-control">
                                {t("settings.deleteTitle")}
                            </span>
                            <span className="nl-metadata nl-muted">
                                {t("settings.deleteDescription")}{" "}
                                {t("settings.deleteIrreversible")}
                            </span>
                        </span>
                        <ChevronRight className="nl-settings__row-chevron" />
                    </div>
                </div>
                <p className="nl-control">{t("footer.privacy")}</p>
            </div>
        </>
    );
}

/**
 * 설정 분류 불러오기(2026-10-01) — 상세와 같은 줄 목록 틀(`nl-settings__rows` · `nl-settings__row`)을 그대로 쓴다.
 * 고정된 라벨 · 설명 · 로고는 실제 글자, 값 · 사진 · 조작부 자리만 스켈레톤. 프로필은 닉네임 칸(라벨 위)까지.
 * 안내 문장은 화면 읽기에만
 */
export default async function SettingsLoading({
    category,
}: {
    category: "profile" | "privacy" | "connections" | "account";
}) {
    const { t } = await getServerI18n();
    return (
        <div
            className="nl-settings__form nl-settings__loading"
            aria-busy="true"
        >
            <LoadingStatus
                label={t(
                    category === "profile"
                        ? "profile.loading"
                        : "common.loading"
                )}
            />
            <div className="nl-settings__form" aria-hidden="true">
                {category === "profile" ? (
                    <ProfileRows t={t} />
                ) : category === "privacy" ? (
                    <PrivacyRows t={t} />
                ) : category === "connections" ? (
                    <ConnectionRows t={t} />
                ) : (
                    <AccountRows t={t} />
                )}
            </div>
        </div>
    );
}
