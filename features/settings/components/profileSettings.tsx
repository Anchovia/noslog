"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/avatar";
import { FormField, Input, fieldDescription } from "@/components/ui/formField";
import CompactSelect from "@/components/ui/compactSelect";
import ModalDialog from "@/components/ui/modalDialog";
import { saveProfile } from "@/app/(nevigation)/settings/actions";
import { requestProfileAvatarUpload } from "@/app/(nevigation)/profile/settings/actions";
import {
    createSettingsProfileSchema,
    settingsFormData,
} from "@/features/settings/schemas/settingsSchema";
import type {
    SettingsProfileFormValues,
    SettingsProfileValues,
} from "@/features/settings/schemas/settingsSchema";
import type {
    SettingsPageData,
    SettingsUser,
} from "@/features/settings/server/settingsPageService";
import { applyFormFieldErrors, applyFormRootError } from "@/lib/forms/errors";
import { IMAGE_ACCEPT, imageFileValidationError } from "@/lib/imageUploadRules";
import { uploadGrantedImage } from "@/lib/uploads/clientImageUpload";
import AchievementShowcasePicker from "@/features/achievements/components/achievementShowcasePicker";
import PinnedRecordsPicker from "@/features/profile/components/pinnedRecordsPicker";
import ArcadePicker from "./arcadePicker";
import AvatarCropDialog from "./avatarCropDialog";
import UnsavedChangesGuard from "./unsavedChangesGuard";

export default function ProfileSettings({
    user,
    arcades,
    submitAction = saveProfile,
}: {
    user: SettingsUser;
    arcades: SettingsPageData["arcades"];
    submitAction?: typeof saveProfile;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const schema = useMemo(() => createSettingsProfileSchema(t), [t]);
    const {
        register,
        control,
        setValue,
        getValues,
        setError,
        clearErrors,
        reset,
        resetField,
        trigger,
        setFocus,
        formState: { errors },
    } = useForm<SettingsProfileFormValues, unknown, SettingsProfileValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: user.profile,
    });
    const avatar = useWatch({ control, name: "avatar" });
    const arcadeId = useWatch({ control, name: "preferredArcadeId" });
    const achievementShowcase = useWatch({
        control,
        name: "achievementShowcase",
    });
    const pinnedRecords = useWatch({ control, name: "pinnedRecords" });
    const username = useWatch({ control, name: "username" });
    // 칸마다 바로 저장(2026-10-01 B — Misskey 식) — 마지막으로 저장된 값. 한 칸을 저장할 때 나머지는 이 값 그대로 보낸다
    const [savedProfile, setSavedProfile] = useState<SettingsProfileFormValues>(
        user.profile
    );
    const [busy, setBusy] = useState(false);
    // 닉네임만 명시 저장 — 바꿨을 때만 칸 옆 「저장」(Enter = 저장 · Esc = 되돌림)
    const usernameChanged = username !== savedProfile.username;
    const [saved, setSaved] = useState("");
    const [crop, setCrop] = useState<File | null>(null);
    const [staged, setStaged] = useState<{ file: File; url: string } | null>(
        null
    );
    const uploaded = useRef<{ file: File; url: string } | null>(null);
    const [arcadeOpen, setArcadeOpen] = useState(false);
    const [country, setCountry] = useState<
        SettingsProfileValues["country"] | null
    >(null);
    const fileInput = useRef<HTMLInputElement>(null);
    const photoButton = useRef<HTMLButtonElement>(null);
    const arcadeButton = useRef<HTMLButtonElement>(null);
    const countryCancel = useRef<HTMLButtonElement>(null);
    const countryOrigin = useRef<HTMLElement | null>(null);
    const selectedArcade =
        arcades.find((item) => String(item.id) === arcadeId) ??
        (String(user.preferredArcade?.id) === arcadeId
            ? user.preferredArcade
            : null);
    useEffect(
        () => () => {
            if (staged) URL.revokeObjectURL(staged.url);
        },
        [staged]
    );
    function chooseFile(file?: File) {
        clearErrors("avatar");
        if (!file) return;
        const validationError = imageFileValidationError(file);
        if (validationError === "type") {
            setError("avatar", { message: t("settings.invalidImage") });
            return;
        }
        if (validationError === "size") {
            setError("avatar", { message: t("settings.imageTooLarge") });
            return;
        }
        setCrop(file);
    }
    /**
     * 한 칸 저장 — 저장된 값에 이 칸만 바꿔 보낸다. 실패하면 그 칸을 되돌리고(닉네임은 쓴 글자를 남긴다) 알린다(공개 설정과 같은 규칙)
     */
    async function commit(
        field: keyof SettingsProfileFormValues,
        change: Partial<SettingsProfileFormValues>
    ) {
        setSaved("");
        clearErrors("root");
        clearErrors(field);
        const revert = () => {
            if (field !== "username")
                setValue(field, savedProfile[field] ?? "");
        };
        if (!navigator.onLine) {
            revert();
            applyFormRootError(
                setError,
                field === "username"
                    ? `${t("settings.offline")} ${t("settings.offlineRetained")}`
                    : t("settings.offline")
            );
            return false;
        }
        setBusy(true);
        try {
            const result = await submitAction(
                settingsFormData({
                    ...savedProfile,
                    ...change,
                } as SettingsProfileValues)
            );
            if (!result.success) {
                applyFormFieldErrors(setError, result.fieldErrors);
                if (field === "username") setFocus("username");
                else revert();
                applyFormRootError(setError, result.message);
                return false;
            }
            // 다른 칸을 저장해도 고치던 닉네임은 그대로 둔다
            const pendingName = getValues("username");
            setSavedProfile(result.values);
            reset(result.values);
            if (field !== "username" && pendingName !== result.values.username)
                setValue("username", pendingName);
            setSaved(result.message);
            return true;
        } catch {
            revert();
            applyFormRootError(setError, t("settings.saveError"));
            return false;
        } finally {
            setBusy(false);
        }
    }
    function change(
        field:
            | "avatar"
            | "preferredArcadeId"
            | "achievementShowcase"
            | "pinnedRecords",
        value: string
    ) {
        setValue(field, value);
        void commit(field, { [field]: value });
    }
    async function saveUsername() {
        if (!(await trigger("username"))) return;
        await commit("username", { username: getValues("username") });
    }
    // 사진 = 자르기 「적용」 에서 바로 올리고 저장(GitHub · Figma · osu! 식)
    async function saveAvatar(file: File) {
        clearErrors("root");
        clearErrors("avatar");
        if (!navigator.onLine) {
            applyFormRootError(setError, t("settings.offline"));
            return;
        }
        const preview = URL.createObjectURL(file);
        setStaged({ file, url: preview });
        setValue("avatar", preview);
        setBusy(true);
        try {
            if (uploaded.current?.file !== file) {
                const grant = await requestProfileAvatarUpload(
                    file.type,
                    locale
                );
                if (!grant.success) {
                    setValue("avatar", savedProfile.avatar);
                    setError("avatar", { message: grant.message });
                    return;
                }
                uploaded.current = {
                    file,
                    url: await uploadGrantedImage(file, grant, "public"),
                };
            }
            if (await commit("avatar", { avatar: uploaded.current.url }))
                uploaded.current = null;
        } catch {
            setValue("avatar", savedProfile.avatar);
            setError("avatar", { message: t("settings.saveError") });
        } finally {
            setStaged(null);
            setBusy(false);
        }
    }
    return (
        <>
            <form
                className="nl-settings__form"
                onSubmit={(event) => {
                    event.preventDefault();
                    if (usernameChanged && !busy) void saveUsername();
                }}
                noValidate
                aria-busy={busy}
            >
                {/* 줄 목록(2026-10-01 C1) — Canva · Discord · 넥슨 식. 라벨 · 값 왼쪽, 버튼 오른쪽, 입력칸만 라벨 위 */}
                <div className="nl-settings__rows">
                    <div className="nl-settings__row nl-settings__row--stack">
                        <div className="nl-settings__row-lead">
                            <Avatar
                                src={avatar || null}
                                alt={t("settings.avatar")}
                                size={64}
                            />
                            <div className="nl-settings__row-copy">
                                <p className="nl-control">
                                    {t("settings.avatar")}
                                </p>
                                <p className="nl-metadata nl-muted">
                                    {t("settings.avatarFormat")}
                                </p>
                                {errors.avatar ? (
                                    <p
                                        role="alert"
                                        className="nl-metadata nl-field__error"
                                    >
                                        {errors.avatar.message}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        <div className="nl-settings__actions">
                            <Button
                                ref={photoButton}
                                variant="secondary"
                                disabled={busy}
                                onClick={() => fileInput.current?.click()}
                            >
                                {t("settings.changePhoto")}
                            </Button>
                            {avatar ? (
                                <Button
                                    variant="ghost"
                                    disabled={busy}
                                    onClick={() => {
                                        setStaged(null);
                                        uploaded.current = null;
                                        change("avatar", "");
                                    }}
                                >
                                    {t("settings.removePhoto")}
                                </Button>
                            ) : null}
                        </div>
                        <input
                            ref={fileInput}
                            type="file"
                            hidden
                            accept={IMAGE_ACCEPT}
                            onChange={(event) => {
                                chooseFile(event.target.files?.[0]);
                                event.target.value = "";
                            }}
                        />
                    </div>
                    <FormField
                        id="settings-nickname"
                        label={t("onboarding.nickname")}
                        help={t("settings.nicknameHelp")}
                        error={errors.username?.message}
                    >
                        <div className="nl-settings__inline-save">
                            <Input
                                id="settings-nickname"
                                autoComplete="nickname"
                                readOnly={busy}
                                aria-invalid={Boolean(errors.username)}
                                aria-describedby={fieldDescription(
                                    "settings-nickname",
                                    {
                                        help: true,
                                        error: Boolean(errors.username),
                                    }
                                )}
                                {...register("username")}
                                onKeyDown={(event) => {
                                    if (
                                        event.key !== "Escape" ||
                                        !usernameChanged
                                    )
                                        return;
                                    event.preventDefault();
                                    resetField("username");
                                    clearErrors("username");
                                }}
                            />
                            {usernameChanged ? (
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    disabled={busy}
                                >
                                    {t(
                                        busy
                                            ? "settings.saving"
                                            : "settings.save"
                                    )}
                                </Button>
                            ) : null}
                        </div>
                    </FormField>
                    <div className="nl-settings__row">
                        <p className="nl-control">
                            {t("settings.nostalgiaName")}
                        </p>
                        <p className="nl-body">{user.nostalgiaName || "—"}</p>
                    </div>
                    <Controller
                        control={control}
                        name="country"
                        render={({ field }) => (
                            <div className="nl-settings__row">
                                <label
                                    htmlFor="settings-country"
                                    className="nl-control"
                                >
                                    {t("onboarding.country")}
                                </label>
                                <CompactSelect
                                    id="settings-country"
                                    outlined
                                    label={t("onboarding.country")}
                                    value={field.value}
                                    disabled={busy}
                                    options={[
                                        {
                                            value: "ko-KR",
                                            label: t("onboarding.country.kr"),
                                        },
                                        {
                                            value: "ja-JP",
                                            label: t("onboarding.country.jp"),
                                        },
                                        {
                                            value: "global",
                                            label: t(
                                                "onboarding.country.global"
                                            ),
                                        },
                                    ]}
                                    onValueChange={(value) => {
                                        if (value !== field.value) {
                                            // 확인 창을 닫으면 국가 드롭다운으로 돌아간다
                                            countryOrigin.current =
                                                document.getElementById(
                                                    "settings-country"
                                                );
                                            setCountry(value);
                                        }
                                    }}
                                />
                            </div>
                        )}
                    />
                    <div className="nl-settings__zone">
                        <p className="nl-control">
                            {t("settings.preferredArcade")}
                        </p>
                        <div className="nl-settings__arcade-row">
                            <p className="nl-body-secondary nl-muted">
                                {selectedArcade
                                    ? `${selectedArcade.name}${selectedArcade.region ? ` · ${selectedArcade.region}` : ""}`
                                    : t("settings.none")}
                            </p>
                            <div className="nl-settings__actions">
                                <Button
                                    ref={arcadeButton}
                                    variant="secondary"
                                    disabled={busy}
                                    onClick={() => setArcadeOpen(true)}
                                >
                                    {t("settings.changeArcade")}
                                </Button>
                                {arcadeId ? (
                                    <Button
                                        variant="ghost"
                                        disabled={busy}
                                        onClick={() =>
                                            change("preferredArcadeId", "")
                                        }
                                    >
                                        {t("settings.clearArcade")}
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                        {selectedArcade &&
                        "is_active" in selectedArcade &&
                        !selectedArcade.is_active ? (
                            <p className="nl-metadata nl-muted">
                                {t("settings.arcadeUnavailable")}
                            </p>
                        ) : null}
                        {errors.preferredArcadeId ? (
                            <p
                                role="alert"
                                className="nl-metadata nl-field__error"
                            >
                                {errors.preferredArcadeId.message}
                            </p>
                        ) : null}
                    </div>
                    {/* 프로필 업적(2026-09-25 D1) — 선호 오락실 칸과 같은 모양, 「저장」 때 함께 저장 */}
                    <AchievementShowcasePicker
                        records={user.achievements}
                        value={achievementShowcase ?? ""}
                        onChange={(value) =>
                            change("achievementShowcase", value)
                        }
                        disabled={busy}
                        error={errors.achievementShowcase?.message}
                    />
                    {/* 고정 기록(2026-09-26 S2) — 프로필 업적 칸과 같은 모양, 「저장」 때 함께 저장 */}
                    <PinnedRecordsPicker
                        records={user.pinnableRecords}
                        value={pinnedRecords ?? ""}
                        onChange={(value) => change("pinnedRecords", value)}
                        disabled={busy}
                        error={errors.pinnedRecords?.message}
                    />
                </div>
                {/* 맨 아래 「저장」 없음(2026-10-01 B) — 칸마다 바로 저장, 성공은 바뀐 값 자체로 보이고 화면 읽기에만 알린다 */}
                <div className="nl-settings__save">
                    {errors.root?.server ? (
                        <p
                            role="alert"
                            className="nl-body-secondary nl-field__error"
                        >
                            {errors.root.server.message}
                        </p>
                    ) : null}
                    <p role="status" className="sr-only">
                        {saved}
                    </p>
                    <div className="nl-settings__foot">
                        <a
                            href={href(`/profile/${user.id}`)}
                            className="nl-control"
                        >
                            {t("settings.viewProfile")}
                        </a>
                    </div>
                </div>
            </form>
            <ArcadePicker
                open={arcadeOpen}
                onOpenChange={setArcadeOpen}
                arcades={arcades}
                selectedId={arcadeId}
                onSelect={(id) => change("preferredArcadeId", id)}
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    arcadeButton.current?.focus();
                }}
            />
            {crop ? (
                <AvatarCropDialog
                    file={crop}
                    onCancel={() => setCrop(null)}
                    onConfirm={(file) => {
                        setCrop(null);
                        void saveAvatar(file);
                    }}
                    onCloseAutoFocus={(event) => {
                        event.preventDefault();
                        photoButton.current?.focus();
                    }}
                />
            ) : null}
            <ModalDialog
                className="nl-settings-dialog"
                open={country !== null}
                onOpenChange={(open) => {
                    if (!open) setCountry(null);
                }}
                title={t("settings.changeCountry")}
                description={t("settings.countryConsequence")}
                variant="confirm"
                onOpenAutoFocus={(event) => {
                    event.preventDefault();
                    countryCancel.current?.focus();
                }}
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    countryOrigin.current?.focus();
                }}
                footer={
                    <>
                        <Button
                            ref={countryCancel}
                            variant="secondary"
                            onClick={() => setCountry(null)}
                        >
                            {t("settings.cancel")}
                        </Button>
                        <Button
                            onClick={() => {
                                if (country) {
                                    setValue("country", country);
                                    void commit("country", { country });
                                }
                                setCountry(null);
                            }}
                        >
                            {t("settings.changeArcade")}
                        </Button>
                    </>
                }
            />
            <UnsavedChangesGuard dirty={usernameChanged} busy={busy} />
        </>
    );
}
