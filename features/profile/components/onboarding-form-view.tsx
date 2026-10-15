"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import type {
    checkNickname,
    completeOnboarding,
} from "@/app/(auth)/onboarding/actions";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import ActionButton from "@/components/ui/action-button";
import Avatar from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { fieldDescription, FormField, Input } from "@/components/ui/form-field";
import type {
    OnboardingFormValues,
    OnboardingValues,
} from "@/features/profile/schemas/profile-settings-schema";
import {
    createOnboardingFormData,
    createOnboardingSchema,
    ONBOARDING_PRIVACY_DEFAULTS,
    ONBOARDING_PRIVACY_KEYS,
    PROFILE_COUNTRIES,
} from "@/features/profile/schemas/profile-settings-schema";
import { PRIVACY_HELP } from "@/features/settings/schemas/settings-schema";
import { applyFormFieldErrors, applyFormRootError } from "@/lib/forms/errors";
import type { MessageKey } from "@/lib/i18n/messages";

/**
 * 가입 온보딩 — 두 단계(2026-10-01 C, e-amusement(KONAMI) 식): 1 프로필(닉네임 · 국가) → 2 공개 설정(항목별).
 * 닉네임은 칸을 떠날 때 쓸 수 있는지 미리 알려 준다(Discord 식). 국가는 미리 고르지 않는다.
 * 저장은 2단계 「계정 설정 완료」 한 번 — 1단계 칸 오류가 돌아오면 1단계로 되돌아가 그 칸에 포커스
 */
export interface OnboardingFormViewProps {
    /** 이미 인증된 계정의 표시 정보. 인증 여부를 판단하거나 로그인하지 않는다. */
    account: { avatar: string | null; displayName: string };
    /** 안전한 원래 이동 목적지를 설명하는 문구. 없으면 설명을 표시하지 않는다. */
    destination?: string | null;
    /** 검증된 FormData를 저장한다. 성공 시 실제 어댑터가 redirect하고, 실패는 입력을 보존한다. */
    submitAction: typeof completeOnboarding;
    /** 정규화 전 닉네임과 현재 언어를 확인한다. 최종 고유성 검사는 저장 서버의 책임이다. */
    checkAction: typeof checkNickname;
}

export default function OnboardingFormView({
    account,
    destination,
    submitAction,
    checkAction,
}: OnboardingFormViewProps) {
    const locale = useLocale();
    const t = useTranslations();
    const href = useLocalizedHref();
    const schema = useMemo(() => createOnboardingSchema(t), [t]);
    const [step, setStep] = useState<1 | 2>(1);
    const heading = useRef<HTMLHeadingElement>(null);
    const moved = useRef(false);
    // 1단계로 되돌아갈 때 포커스할 칸(저장 때 돌아온 오류)
    const refocus = useRef<"username" | "country" | null>(null);
    // 닉네임 미리 확인 — 확인한 값과 결과. 값이 바뀌면 지운다
    const [nickname, setNickname] = useState<{
        value: string;
        available: boolean;
    } | null>(null);
    // 값이 A → B → A로 돌아와도 이전 A 요청은 최신 요청이 아니다.
    const nicknameRevision = useRef(0);
    const submitLock = useRef(false);
    useEffect(
        () => () => {
            nicknameRevision.current += 1;
        },
        []
    );
    const checking = useRef<{
        value: string;
        revision: number;
        promise: Promise<boolean>;
    } | null>(null);
    const {
        register,
        handleSubmit,
        setError,
        setFocus,
        clearErrors,
        trigger,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<OnboardingFormValues, unknown, OnboardingValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            username: "",
            country: undefined,
            ...ONBOARDING_PRIVACY_DEFAULTS,
        },
    });
    const labels: Record<
        (typeof PROFILE_COUNTRIES)[number]["value"],
        MessageKey
    > = {
        "ko-KR": "onboarding.country.kr",
        "ja-JP": "onboarding.country.jp",
        global: "onboarding.country.global",
    };
    // 단계를 옮기면 새 단계 제목으로 포커스(첫 화면은 그대로), 오류로 돌아왔으면 그 칸으로
    useEffect(() => {
        if (!moved.current) return;
        if (refocus.current) {
            setFocus(refocus.current);
            refocus.current = null;
            return;
        }
        heading.current?.focus();
    }, [step, setFocus]);

    async function checkNicknameNow(): Promise<boolean> {
        const value = getValues("username").trim();
        if (!value || !(await trigger("username"))) return false;
        if (nickname?.value === value) {
            // 칸 검사(trigger)가 앞서 붙인 「이미 사용 중」 오류를 지웠으므로 다시 붙인다
            if (!nickname.available)
                setError("username", {
                    message: t("onboarding.error.nicknameTaken"),
                });
            return nickname.available;
        }
        const revision = nicknameRevision.current;
        if (
            checking.current?.value === value &&
            checking.current.revision === revision
        )
            return checking.current.promise;
        const promise = (async () => {
            try {
                const result = await checkAction(value, locale);
                if (
                    nicknameRevision.current !== revision ||
                    getValues("username").trim() !== value
                )
                    return false;
                setNickname({ value, available: result.available });
                if (!result.available)
                    setError("username", { message: result.message });
                return result.available;
            } catch {
                // 현재 값의 확인 실패만 저장 단계로 넘긴다. 오래된 실패는 무시한다.
                return (
                    nicknameRevision.current === revision &&
                    getValues("username").trim() === value
                );
            } finally {
                if (
                    checking.current?.revision === revision &&
                    checking.current.value === value
                )
                    checking.current = null;
            }
        })();
        checking.current = { value, revision, promise };
        return promise;
    }

    async function next() {
        clearErrors("root");
        const valid = await trigger(["username", "country"]);
        if (!valid) {
            setFocus(getValues("username").trim() ? "country" : "username");
            return;
        }
        if (!(await checkNicknameNow())) {
            setFocus("username");
            return;
        }
        moved.current = true;
        setStep(2);
    }
    async function submit(values: OnboardingValues) {
        clearErrors("root");
        try {
            const result = await submitAction(
                createOnboardingFormData(values, locale)
            );
            applyFormFieldErrors(setError, result.fieldErrors);
            if (result.fieldErrors?.username || result.fieldErrors?.country) {
                moved.current = true;
                refocus.current = result.fieldErrors?.username
                    ? "username"
                    : "country";
                setStep(1);
                return;
            }
            applyFormRootError(setError, result.message);
        } catch {
            applyFormRootError(setError, t("onboarding.error.generic"));
        }
    }
    const nicknameField = register("username");
    const nicknameOk =
        nickname?.available &&
        !errors.username &&
        nickname.value === getValues("username").trim();

    return (
        <>
            <div className="nl-auth-head">
                <Link
                    prefetch={false}
                    className="nl-page-title"
                    href={href("/")}
                    aria-label={t("auth.home")}
                >
                    NosLog
                </Link>
                <h1 ref={heading} tabIndex={-1} className="nl-section-title">
                    {t(step === 1 ? "onboarding.title" : "settings.privacy")}
                </h1>
                <p className="nl-metadata nl-muted">
                    {t("onboarding.step", {
                        current: String(step),
                        total: "2",
                        name: t(
                            step === 1
                                ? "onboarding.stepProfile"
                                : "settings.privacy"
                        ),
                    })}
                </p>
            </div>
            {step === 1 && destination ? (
                <p className="nl-body-secondary nl-muted nl-auth-reason">
                    {destination}
                </p>
            ) : null}
            {step === 1 ? (
                <section
                    className="nl-auth-account"
                    aria-label={t("onboarding.connectedAccount")}
                >
                    <p className="nl-control nl-muted">
                        {t("onboarding.connectedAccount")}
                    </p>
                    <div className="nl-auth-account-row">
                        <Avatar src={account.avatar} size={40} />
                        <p className="nl-body">{account.displayName}</p>
                    </div>
                </section>
            ) : null}
            <form
                className="nl-auth-form"
                onSubmit={async (event) => {
                    event.preventDefault();
                    // RHF 상태가 렌더되기 전의 연속 Enter/클릭도 같은 요청으로 묶는다.
                    if (submitLock.current) return;
                    submitLock.current = true;
                    try {
                        if (step === 1) await next();
                        else await handleSubmit(submit)(event);
                    } finally {
                        submitLock.current = false;
                    }
                }}
                noValidate
                aria-busy={isSubmitting}
            >
                {step === 1 ? (
                    <>
                        <div>
                            <FormField
                                id="onboarding-nickname"
                                label={t("onboarding.nickname")}
                                help={t("onboarding.nicknameHelp")}
                                error={errors.username?.message}
                                success={
                                    nicknameOk
                                        ? t("onboarding.nicknameAvailable")
                                        : null
                                }
                            >
                                <Input
                                    id="onboarding-nickname"
                                    autoComplete="nickname"
                                    maxLength={20}
                                    placeholder={t(
                                        "onboarding.nicknamePlaceholder"
                                    )}
                                    aria-invalid={Boolean(errors.username)}
                                    aria-describedby={[
                                        fieldDescription(
                                            "onboarding-nickname",
                                            {
                                                help: true,
                                                error: Boolean(errors.username),
                                            }
                                        ),
                                        nicknameOk
                                            ? "onboarding-nickname-success"
                                            : null,
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                    readOnly={isSubmitting}
                                    {...nicknameField}
                                    onChange={(event) => {
                                        nicknameRevision.current += 1;
                                        setNickname(null);
                                        void nicknameField.onChange(event);
                                    }}
                                    onBlur={(event) => {
                                        void nicknameField.onBlur(event);
                                        void checkNicknameNow();
                                    }}
                                />
                            </FormField>
                            <p className="nl-body-secondary nl-muted nl-auth-field-description">
                                {t("onboarding.nicknameDescription")}
                            </p>
                        </div>
                        {/* 묶음 제목 = 칸 라벨 모양 →8→(닉네임 라벨과 같게, 2026-10-01) */}
                        <fieldset
                            className="nl-radio-group nl-radio-group--field"
                            disabled={isSubmitting}
                        >
                            <legend className="nl-field__label">
                                {t("onboarding.country")}
                            </legend>
                            <p
                                id="onboarding-region-help"
                                className="nl-body-secondary nl-muted"
                            >
                                {t("onboarding.regionDescription")}
                            </p>
                            <div>
                                {PROFILE_COUNTRIES.map((country) => (
                                    <label
                                        key={country.value}
                                        className="nl-radio-group__option nl-control"
                                    >
                                        <input
                                            type="radio"
                                            value={country.value}
                                            aria-describedby={`onboarding-region-help${errors.country ? " onboarding-region-error" : ""}`}
                                            {...register("country")}
                                        />
                                        <span>{t(labels[country.value])}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.country ? (
                                <p
                                    id="onboarding-region-error"
                                    className="nl-field__help nl-field__error"
                                    role="alert"
                                >
                                    {errors.country.message}
                                </p>
                            ) : null}
                        </fieldset>
                    </>
                ) : (
                    <fieldset
                        className="nl-radio-group"
                        disabled={isSubmitting}
                    >
                        <legend className="sr-only">
                            {t("settings.privacy")}
                        </legend>
                        <p
                            id="onboarding-privacy-help"
                            className="nl-body-secondary nl-muted"
                        >
                            {t("onboarding.privacyDescription")}
                        </p>
                        {/* 줄 간격은 지역 라디오와 같게(간격 0 · 행 높이만) — 2026-09-12 사용자 결정 */}
                        <div className="nl-auth-privacy">
                            {ONBOARDING_PRIVACY_KEYS.map((key) => (
                                <div key={key}>
                                    <Checkbox
                                        label={t(`settings.${key}`)}
                                        aria-describedby={
                                            PRIVACY_HELP[key]
                                                ? `onboarding-privacy-help onboarding-${key}-help`
                                                : "onboarding-privacy-help"
                                        }
                                        {...register(key)}
                                    />
                                    {PRIVACY_HELP[key] ? (
                                        <p
                                            id={`onboarding-${key}-help`}
                                            className="nl-metadata nl-muted nl-settings__control-help"
                                        >
                                            {t(PRIVACY_HELP[key])}
                                        </p>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </fieldset>
                )}
                {errors.root?.server ? (
                    <p
                        className="nl-body-secondary nl-field__error"
                        role="alert"
                    >
                        {errors.root.server.message}
                    </p>
                ) : null}
                <div className="nl-auth-steps">
                    <ActionButton
                        type="submit"
                        busy={step === 2 && isSubmitting}
                        busyLabel={t("onboarding.setting")}
                        className="nl-auth-submit"
                    >
                        {t(step === 1 ? "onboarding.next" : "onboarding.start")}
                    </ActionButton>
                    {step === 2 ? (
                        <Button
                            variant="secondary"
                            disabled={isSubmitting}
                            className="nl-auth-submit"
                            onClick={() => {
                                moved.current = true;
                                setStep(1);
                            }}
                        >
                            {t("onboarding.back")}
                        </Button>
                    ) : null}
                </div>
                <span className="sr-only" role="status">
                    {isSubmitting ? t("onboarding.setting") : ""}
                </span>
            </form>
        </>
    );
}
