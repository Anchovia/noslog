"use client";

import { Camera, Languages, MapPin, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { put } from "@vercel/blob/client";

import {
    requestProfileAvatarUpload,
    uploadUserSetting,
} from "@/app/(nevigation)/profile/settings/actions";
import {
    PROFILE_COUNTRIES,
    PROFILE_LANGUAGES,
    settingSchema,
    type SettingType,
} from "@/app/(nevigation)/profile/settings/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import DiscordIcon from "@/components/ui/DiscordIcon";
import ProfileAvatar from "@/components/profile/profileAvatar";
import { Switch } from "@/components/ui/Switch";
import { ThemeSetting } from "@/components/theme/themeToggle";
import { applyFormFieldErrors } from "@/lib/forms/errors";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";

interface ProfileSettingCardProps {
    user: {
        id: number;
        avatar: string | null;
        username: string | null;
        country: string;
        locale: string;
        show_localized_music_title: boolean;
        discord_id: string | null;
        discord_name: string | null;
        discord_username: string | null;
        preferred_arcade_id: number | null;
        hide_nostalgia_name: boolean;
        hide_discord_name: boolean;
        hide_play_count: boolean;
    };
    arcades: { id: number; name: string; region: string | null }[];
}

const inputClass =
    "border-border bg-bg text-input placeholder:text-text-disabled focus:border-focus focus:ring-focus/20 h-11 w-full rounded-card border px-3 outline-none transition focus:ring-2";

function FieldError({ message }: { message?: string }) {
    const locale = useLocale();
    const t = useTranslations();
    const visibleMessage =
        message && locale !== "ko" && /[가-힣]/.test(message)
            ? t("settings.checkInput")
            : message;

    return visibleMessage ? (
        <p className="text-danger mt-1 text-xs">{visibleMessage}</p>
    ) : null;
}

// 프로필 이미지와 공개 정보를 한 화면에서 수정함
export default function ProfileSettingCard({
    user,
    arcades,
}: ProfileSettingCardProps) {
    const locale = useLocale();
    const href = useLocalizedHref();
    const t = useTranslations();
    const countryLabels = {
        "ko-KR": t("settings.countryKorea"),
        "ja-JP": t("settings.countryJapan"),
        global: t("settings.countryGlobal"),
    };
    const [preview, setPreview] = useState(user.avatar ?? "");
    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SettingType>({
        resolver: zodResolver(settingSchema),
        defaultValues: {
            avatar: user.avatar ?? "",
            username: user.username ?? "",
            country:
                user.country === "ko-KR" || user.country === "ja-JP"
                    ? user.country
                    : "global",
            locale:
                user.locale === "ja" || user.locale === "en"
                    ? user.locale
                    : "ko",
            showLocalizedMusicTitle: user.show_localized_music_title,
            discordName: user.discord_name ?? "",
            discordUsername: user.discord_username ?? "",
            preferredArcadeId: user.preferred_arcade_id?.toString() ?? "",
            hideNostalgiaName: user.hide_nostalgia_name,
            hideDiscordName: user.hide_discord_name,
            hidePlayCount: user.hide_play_count,
        },
    });

    useEffect(() => {
        return () => {
            if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        if (
            !(["image/jpeg", "image/png", "image/webp"] as string[]).includes(
                selectedFile.type
            )
        ) {
            setFileError(t("settings.invalidImage"));
            event.target.value = "";
            return;
        }
        if (selectedFile.size > 4 * 1024 * 1024) {
            setFileError(t("settings.imageTooLarge"));
            event.target.value = "";
            return;
        }

        setFileError("");
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const submit = handleSubmit(async (data) => {
        setSubmitError("");
        let avatar = data.avatar;

        if (file) {
            const upload = await requestProfileAvatarUpload(file.type, locale);
            if (!upload.success) {
                setSubmitError(upload.message);
                return;
            }

            try {
                const blob = await put(upload.pathname, file, {
                    access: "public",
                    token: upload.token,
                    contentType: file.type,
                });
                avatar = blob.url;
            } catch {
                setSubmitError(t("settings.imageUploadError"));
                return;
            }
        }

        const formData = new FormData();
        formData.set("avatar", avatar);
        formData.set("username", data.username);
        formData.set("country", data.country);
        formData.set("locale", data.locale);
        formData.set(
            "showLocalizedMusicTitle",
            String(data.showLocalizedMusicTitle)
        );
        formData.set("discordName", data.discordName);
        formData.set("discordUsername", data.discordUsername);
        formData.set("preferredArcadeId", data.preferredArcadeId);
        formData.set("hideNostalgiaName", String(data.hideNostalgiaName));
        formData.set("hideDiscordName", String(data.hideDiscordName));
        formData.set("hidePlayCount", String(data.hidePlayCount));

        const result = await uploadUserSetting(formData);
        applyFormFieldErrors(setError, result?.fieldErrors);
        if (result) setSubmitError(result.message);
    });

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <section className="bg-surface rounded-card flex items-center gap-4 p-4">
                <ProfileAvatar
                    avatar={preview || null}
                    username={user.username}
                    size={72}
                />
                <div className="min-w-0 flex-1">
                    <h2 className="text-section">{t("settings.avatar")}</h2>
                    <p className="text-caption mt-1">
                        {t("settings.avatarFormat")}
                    </p>
                    <label className="border-border text-text-primary hover:bg-surface-muted focus-within:ring-focus/40 rounded-card mt-3 inline-flex h-10 cursor-pointer items-center gap-2 border px-3 text-sm font-semibold transition-colors focus-within:ring-2">
                        <Camera className="size-4" aria-hidden />
                        {t("settings.changePhoto")}
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="sr-only"
                        />
                    </label>
                    <FieldError message={fileError} />
                </div>
            </section>

            <ThemeSetting />

            <section className="bg-surface rounded-card flex flex-col gap-4 p-4">
                <div>
                    <h2 className="text-section flex items-center gap-2">
                        <Languages className="text-chart size-4" />{" "}
                        {t("settings.languageTitle")}
                    </h2>
                    <p className="text-caption mt-1">
                        {t("settings.languageDescription")}
                    </p>
                </div>
                <label className="text-text-secondary text-xs font-semibold">
                    {t("settings.displayLanguage")}
                    <select
                        className={`${inputClass} mt-1.5`}
                        {...register("locale")}
                    >
                        {PROFILE_LANGUAGES.map((language) => (
                            <option key={language.value} value={language.value}>
                                {language.label}
                            </option>
                        ))}
                    </select>
                    <FieldError message={errors.locale?.message} />
                </label>
                <Controller
                    name="showLocalizedMusicTitle"
                    control={control}
                    render={({ field }) => (
                        <label className="border-border bg-bg rounded-card flex cursor-pointer items-center justify-between gap-4 border p-3">
                            <span className="min-w-0">
                                <span className="text-body block text-sm font-semibold">
                                    {t("settings.localizedTitle")}
                                </span>
                                <span className="text-caption mt-0.5 block">
                                    {t("settings.localizedTitleDescription")}
                                </span>
                            </span>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-label={t("settings.localizedTitle")}
                            />
                        </label>
                    )}
                />
            </section>

            <section className="bg-surface rounded-card flex flex-col gap-4 p-4">
                <div>
                    <h2 className="text-section flex items-center gap-2">
                        <MapPin className="text-chart size-4" />{" "}
                        {t("settings.preferredArcade")}
                    </h2>
                    <p className="text-caption mt-1">
                        {t("settings.preferredArcadeDescription")}
                    </p>
                </div>
                <label className="text-text-secondary text-xs font-semibold">
                    {t("settings.arcade")}
                    <select
                        className={`${inputClass} mt-1.5`}
                        {...register("preferredArcadeId")}
                    >
                        <option value="">{t("settings.none")}</option>
                        {arcades.map((arcade) => (
                            <option key={arcade.id} value={arcade.id}>
                                {arcade.region
                                    ? `${arcade.name} · ${arcade.region}`
                                    : arcade.name}
                            </option>
                        ))}
                    </select>
                    <FieldError message={errors.preferredArcadeId?.message} />
                </label>
            </section>

            <section className="bg-surface rounded-card flex flex-col gap-4 p-4">
                <div>
                    <h2 className="text-section">{t("settings.basicInfo")}</h2>
                    <p className="text-caption mt-1">
                        {t("settings.basicInfoDescription")}
                    </p>
                </div>
                <label className="text-text-secondary text-xs font-semibold">
                    {t("settings.nickname")}
                    <input
                        type="text"
                        autoComplete="nickname"
                        placeholder={t("settings.nickname")}
                        className={`${inputClass} mt-1.5`}
                        {...register("username")}
                    />
                    <FieldError message={errors.username?.message} />
                </label>
                <fieldset>
                    <legend className="text-text-secondary text-xs font-semibold">
                        {t("settings.country")}
                    </legend>
                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                        {PROFILE_COUNTRIES.map((country) => (
                            <label
                                key={country.value}
                                className="has-checked:border-interactive has-checked:bg-interactive has-checked:text-on-interactive border-border bg-bg text-text-secondary hover:bg-surface-muted rounded-card flex h-11 cursor-pointer items-center justify-center gap-1.5 border text-sm font-semibold transition-colors"
                            >
                                <input
                                    type="radio"
                                    value={country.value}
                                    className="sr-only"
                                    {...register("country")}
                                />
                                <span>{country.code}</span>
                                <span className="sr-only">
                                    {countryLabels[country.value]}
                                </span>
                            </label>
                        ))}
                    </div>
                    <FieldError message={errors.country?.message} />
                </fieldset>
            </section>

            <section className="bg-surface rounded-card flex flex-col gap-4 p-4">
                <div>
                    <h2 className="text-section">{t("settings.privacy")}</h2>
                    <p className="text-caption mt-1">
                        {t("settings.privacyDescription")}
                    </p>
                </div>
                <Controller
                    name="hideNostalgiaName"
                    control={control}
                    render={({ field }) => (
                        <label className="border-border bg-bg rounded-card flex cursor-pointer items-center justify-between gap-4 border p-3">
                            <span className="min-w-0">
                                <span className="text-body block text-sm font-semibold">
                                    {t("settings.hideNostalgia")}
                                </span>
                                <span className="text-caption mt-0.5 block">
                                    {t("settings.hideNostalgiaDescription")}
                                </span>
                            </span>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-label={t("settings.hideNostalgia")}
                            />
                        </label>
                    )}
                />
                <Controller
                    name="hideDiscordName"
                    control={control}
                    render={({ field }) => (
                        <label className="border-border bg-bg rounded-card flex cursor-pointer items-center justify-between gap-4 border p-3">
                            <span className="min-w-0">
                                <span className="text-body block text-sm font-semibold">
                                    {t("settings.hideDiscord")}
                                </span>
                                <span className="text-caption mt-0.5 block">
                                    {t("settings.hideDiscordDescription")}
                                </span>
                            </span>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-label={t("settings.hideDiscord")}
                            />
                        </label>
                    )}
                />
                <Controller
                    name="hidePlayCount"
                    control={control}
                    render={({ field }) => (
                        <label className="border-border bg-bg rounded-card flex cursor-pointer items-center justify-between gap-4 border p-3">
                            <span className="min-w-0">
                                <span className="text-body block text-sm font-semibold">
                                    {t("settings.hidePlayCount")}
                                </span>
                                <span className="text-caption mt-0.5 block">
                                    {t("settings.hidePlayCountDescription")}
                                </span>
                            </span>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-label={t("settings.hidePlayCount")}
                            />
                        </label>
                    )}
                />
            </section>

            <section className="bg-surface rounded-card flex flex-col gap-4 p-4">
                <div>
                    <h2 className="text-section">Discord</h2>
                    <p className="text-caption mt-1">
                        {t("settings.discordDescription")}
                    </p>
                </div>
                {user.discord_id ? (
                    <div className="grid gap-3">
                        <label className="text-text-secondary text-xs font-semibold">
                            {t("settings.discordName")}
                            <input
                                type="text"
                                autoComplete="off"
                                placeholder={t("settings.discordDisplayName")}
                                className={`${inputClass} mt-1.5`}
                                {...register("discordName")}
                            />
                            <FieldError message={errors.discordName?.message} />
                        </label>
                        <label className="text-text-secondary text-xs font-semibold">
                            {t("settings.discordTag")}
                            <input
                                type="text"
                                autoComplete="off"
                                placeholder="hoonie71"
                                className={`${inputClass} mt-1.5`}
                                {...register("discordUsername")}
                            />
                            <FieldError
                                message={errors.discordUsername?.message}
                            />
                        </label>
                    </div>
                ) : null}
                <div className="border-border bg-bg rounded-card flex items-center gap-3 border p-3">
                    <span className="bg-discord/15 text-discord flex size-9 shrink-0 items-center justify-center rounded-full">
                        <DiscordIcon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-body truncate text-sm font-semibold">
                            {user.discord_id
                                ? [
                                      user.discord_name,
                                      user.discord_username
                                          ? `@${user.discord_username}`
                                          : null,
                                  ]
                                      .filter(Boolean)
                                      .join(" ") ||
                                  t("settings.discordConnected")
                                : t("settings.discordRequired")}
                        </p>
                        <p className="text-caption mt-0.5">
                            {user.discord_id
                                ? t("settings.discordAccountConnected")
                                : t("settings.discordAccountPreserved")}
                        </p>
                    </div>
                    <a
                        href={`/discord/start?returnTo=${encodeURIComponent(
                            href("/profile/settings")
                        )}`}
                        className="border-border text-text-primary hover:bg-surface-muted focus-visible:ring-focus/40 rounded-card flex h-10 shrink-0 items-center border px-3 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                        {user.discord_id
                            ? t("settings.reconnect")
                            : t("settings.connect")}
                    </a>
                </div>
            </section>

            {submitError ? (
                <p className="border-danger/40 bg-danger/10 text-danger rounded-card border px-3 py-2 text-sm">
                    {submitError}
                </p>
            ) : null}

            <div className="grid grid-cols-2 gap-2">
                <Link
                    href={href(`/profile/${user.id}`)}
                    className="border-border text-text-secondary hover:bg-surface-muted hover:text-text-primary focus-visible:ring-focus/40 rounded-card flex h-11 cursor-pointer items-center justify-center border text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                    {t("settings.cancel")}
                </Link>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-text-primary text-bg hover:bg-text-primary/90 focus-visible:ring-focus/40 rounded-card flex h-11 cursor-pointer items-center justify-center gap-2 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save className="size-4" aria-hidden />
                    {isSubmitting ? t("settings.saving") : t("settings.save")}
                </button>
            </div>
        </form>
    );
}
