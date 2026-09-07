"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { put } from "@vercel/blob/client";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/avatar";
import { FormField, Input, fieldDescription } from "@/components/ui/formField";
import RadioGroup from "@/components/ui/radioGroup";
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
import { applyFormFieldErrors } from "@/lib/forms/errors";
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
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        reset,
        setFocus,
        formState: { errors, isDirty, isValid, isSubmitting },
    } = useForm<SettingsProfileFormValues, unknown, SettingsProfileValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: user.profile,
    });
    const avatar = useWatch({ control, name: "avatar" });
    const arcadeId = useWatch({ control, name: "preferredArcadeId" });
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
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setError("avatar", { message: t("settings.invalidImage") });
            return;
        }
        if (file.size > 4 * 1024 * 1024) {
            setError("avatar", { message: t("settings.imageTooLarge") });
            return;
        }
        setCrop(file);
    }
    async function submit(values: SettingsProfileValues) {
        setSaved("");
        clearErrors("root");
        if (!navigator.onLine) {
            setError("root.server", {
                message: `${t("settings.offline")} ${t("settings.offlineRetained")}`,
            });
            return;
        }
        try {
            let nextAvatar = values.avatar;
            if (staged && nextAvatar === staged.url) {
                if (uploaded.current?.file !== staged.file) {
                    const grant = await requestProfileAvatarUpload(
                        staged.file.type,
                        locale
                    );
                    if (!grant.success) {
                        setError("avatar", { message: grant.message });
                        return;
                    }
                    const blob = await put(grant.pathname, staged.file, {
                        access: "public",
                        token: grant.token,
                        contentType: staged.file.type,
                    });
                    uploaded.current = { file: staged.file, url: blob.url };
                }
                nextAvatar = uploaded.current.url;
            }
            const result = await submitAction(
                settingsFormData({ ...values, avatar: nextAvatar })
            );
            if (!result.success) {
                applyFormFieldErrors(setError, result.fieldErrors);
                if (result.fieldErrors?.username) setFocus("username");
                setError("root.server", { message: result.message });
                return;
            }
            reset(result.values);
            setStaged(null);
            uploaded.current = null;
            setSaved(result.message);
        } catch {
            setError("root.server", { message: t("settings.saveError") });
        }
    }
    return (
        <>
            <form
                className="nl-settings__form"
                onSubmit={(event) => void handleSubmit(submit)(event)}
                noValidate
                aria-busy={isSubmitting}
            >
                <div className="nl-settings__zone">
                    <p className="nl-control">{t("settings.avatar")}</p>
                    <div className="nl-settings__identity-row">
                        <Avatar
                            src={avatar || null}
                            alt={t("settings.avatar")}
                            size={64}
                        />
                        <div className="nl-settings__actions">
                            <Button
                                ref={photoButton}
                                appearance="foundation"
                                size="sm"
                                variant="secondary"
                                disabled={isSubmitting}
                                onClick={() => fileInput.current?.click()}
                            >
                                {t("settings.changePhoto")}
                            </Button>
                            {avatar ? (
                                <Button
                                    appearance="foundation"
                                    size="sm"
                                    variant="ghost"
                                    disabled={isSubmitting}
                                    onClick={() => {
                                        setValue("avatar", "", {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        });
                                        setStaged(null);
                                        uploaded.current = null;
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
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(event) => {
                                chooseFile(event.target.files?.[0]);
                                event.target.value = "";
                            }}
                        />
                    </div>
                    <p className="nl-metadata nl-muted">
                        {t("settings.avatarFormat")}
                    </p>
                    {errors.avatar ? (
                        <p role="alert" className="nl-metadata nl-field__error">
                            {errors.avatar.message}
                        </p>
                    ) : null}
                </div>
                <FormField
                    id="settings-nickname"
                    label={t("onboarding.nickname")}
                    help={t("settings.nicknameHelp")}
                    error={errors.username?.message}
                >
                    <Input
                        id="settings-nickname"
                        autoComplete="nickname"
                        readOnly={isSubmitting}
                        aria-invalid={Boolean(errors.username)}
                        aria-describedby={fieldDescription(
                            "settings-nickname",
                            { help: true, error: Boolean(errors.username) }
                        )}
                        {...register("username")}
                    />
                </FormField>
                <div className="nl-settings__read-only">
                    <p className="nl-control nl-muted">
                        {t("settings.nostalgiaName")}
                    </p>
                    <p className="nl-body">{user.nostalgiaName || "—"}</p>
                </div>
                <Controller
                    control={control}
                    name="country"
                    render={({ field }) => (
                        <RadioGroup
                            label={t("onboarding.country")}
                            value={field.value}
                            disabled={isSubmitting}
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
                                    label: t("onboarding.country.global"),
                                },
                            ]}
                            onValueChange={(value) => {
                                if (value !== field.value) {
                                    countryOrigin.current =
                                        document.activeElement instanceof
                                        HTMLElement
                                            ? document.activeElement
                                            : null;
                                    setCountry(value);
                                }
                            }}
                        />
                    )}
                />
                <div className="nl-settings__zone">
                    <p className="nl-control">
                        {t("settings.preferredArcade")}
                    </p>
                    <div className="nl-settings__arcade-row">
                        <p className="nl-body">
                            {selectedArcade
                                ? `${selectedArcade.name}${selectedArcade.region ? ` · ${selectedArcade.region}` : ""}`
                                : t("settings.none")}
                        </p>
                        <div className="nl-settings__actions">
                            <Button
                                ref={arcadeButton}
                                appearance="foundation"
                                size="sm"
                                variant="secondary"
                                disabled={isSubmitting}
                                onClick={() => setArcadeOpen(true)}
                            >
                                {t("settings.changeArcade")}
                            </Button>
                            {arcadeId ? (
                                <Button
                                    appearance="foundation"
                                    size="sm"
                                    variant="ghost"
                                    disabled={isSubmitting}
                                    onClick={() =>
                                        setValue("preferredArcadeId", "", {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        })
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
                        <p role="alert" className="nl-metadata nl-field__error">
                            {errors.preferredArcadeId.message}
                        </p>
                    ) : null}
                </div>
                <div className="nl-settings__save">
                    <a
                        href={href(`/profile/${user.id}`)}
                        className="nl-control nl-settings__view-profile"
                    >
                        {t("settings.viewProfile")}
                    </a>
                    {isDirty ? (
                        <p className="nl-body-secondary nl-muted">
                            {t("settings.unsaved")}
                        </p>
                    ) : null}
                    {errors.root?.server ? (
                        <p
                            role="alert"
                            className="nl-body-secondary nl-field__error"
                        >
                            {errors.root.server.message}
                        </p>
                    ) : null}
                    <p
                        role="status"
                        className={saved ? "nl-body-secondary" : "sr-only"}
                    >
                        {saved}
                    </p>
                    <Button
                        appearance="foundation"
                        size="sm"
                        type="submit"
                        disabled={!isDirty || !isValid || isSubmitting}
                    >
                        {t(isSubmitting ? "settings.saving" : "settings.save")}
                    </Button>
                </div>
            </form>
            <ArcadePicker
                open={arcadeOpen}
                onOpenChange={setArcadeOpen}
                arcades={arcades}
                selectedId={arcadeId}
                onSelect={(id) =>
                    setValue("preferredArcadeId", id, {
                        shouldDirty: true,
                        shouldValidate: true,
                    })
                }
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
                        const url = URL.createObjectURL(file);
                        setStaged({ file, url });
                        uploaded.current = null;
                        setValue("avatar", url, {
                            shouldDirty: true,
                            shouldValidate: true,
                        });
                        setCrop(null);
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
                showClose={false}
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
                            appearance="foundation"
                            size="sm"
                            variant="secondary"
                            onClick={() => setCountry(null)}
                        >
                            {t("settings.cancel")}
                        </Button>
                        <Button
                            appearance="foundation"
                            size="sm"
                            onClick={() => {
                                if (country)
                                    setValue("country", country, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    });
                                setCountry(null);
                            }}
                        >
                            {t("settings.changeArcade")}
                        </Button>
                    </>
                }
            />
            <UnsavedChangesGuard dirty={isDirty} busy={isSubmitting} />
        </>
    );
}
