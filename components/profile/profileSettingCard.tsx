"use client";

import { Camera, MapPin, Save } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { put } from "@vercel/blob/client";

import {
    requestProfileAvatarUpload,
    uploadUserSetting,
} from "@/app/(nevigation)/profile/settings/actions";
import {
    PROFILE_COUNTRIES,
    SettingType,
    settingSchema,
} from "@/app/(nevigation)/profile/settings/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import DiscordIcon from "@/components/ui/DiscordIcon";
import ProfileAvatar from "@/components/profile/profileAvatar";
import { Switch } from "@/components/ui/Switch";
import { ThemeSetting } from "@/components/theme/themeToggle";

interface ProfileSettingCardProps {
    user: {
        id: number;
        avatar: string | null;
        username: string | null;
        country: string;
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
    return message ? (
        <p className="text-danger mt-1 text-xs">{message}</p>
    ) : null;
}

// 프로필 이미지와 공개 정보를 한 화면에서 수정함
export default function ProfileSettingCard({
    user,
    arcades,
}: ProfileSettingCardProps) {
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
            setFileError("JPG, PNG, WebP 이미지만 사용할 수 있습니다.");
            event.target.value = "";
            return;
        }
        if (selectedFile.size > 4 * 1024 * 1024) {
            setFileError("이미지는 4MB 이하로 선택해주세요.");
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
            const upload = await requestProfileAvatarUpload(file.type);
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
                setSubmitError("프로필 이미지 업로드에 실패했습니다.");
                return;
            }
        }

        const formData = new FormData();
        formData.set("avatar", avatar);
        formData.set("username", data.username);
        formData.set("country", data.country);
        formData.set("discordName", data.discordName);
        formData.set("discordUsername", data.discordUsername);
        formData.set("preferredArcadeId", data.preferredArcadeId);
        formData.set("hideNostalgiaName", String(data.hideNostalgiaName));
        formData.set("hideDiscordName", String(data.hideDiscordName));
        formData.set("hidePlayCount", String(data.hidePlayCount));

        const result = await uploadUserSetting(formData);
        if (result?.fieldErrors) {
            for (const [field, messages] of Object.entries(
                result.fieldErrors
            )) {
                const message = messages?.[0];
                if (message && field in data) {
                    setError(field as keyof SettingType, { message });
                }
            }
        }
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
                    <h2 className="text-section">프로필 이미지</h2>
                    <p className="text-caption mt-1">
                        JPG, PNG, WebP · 최대 4MB
                    </p>
                    <label className="border-border text-text-primary hover:bg-surface-muted focus-within:ring-focus/40 rounded-card mt-3 inline-flex h-10 cursor-pointer items-center gap-2 border px-3 text-sm font-semibold transition-colors focus-within:ring-2">
                        <Camera className="size-4" aria-hidden />
                        사진 변경
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
                        <MapPin className="text-chart size-4" /> 선호 오락실
                    </h2>
                    <p className="text-caption mt-1">
                        프로필에 표시할 오락실을 선택합니다.
                    </p>
                </div>
                <label className="text-text-secondary text-xs font-semibold">
                    오락실
                    <select
                        className={`${inputClass} mt-1.5`}
                        {...register("preferredArcadeId")}
                    >
                        <option value="">설정 안 함</option>
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
                    <h2 className="text-section">기본 정보</h2>
                    <p className="text-caption mt-1">
                        닉네임은 프로필과 랭킹에 표시됩니다.
                    </p>
                </div>
                <label className="text-text-secondary text-xs font-semibold">
                    닉네임
                    <input
                        type="text"
                        autoComplete="nickname"
                        placeholder="닉네임"
                        className={`${inputClass} mt-1.5`}
                        {...register("username")}
                    />
                    <FieldError message={errors.username?.message} />
                </label>
                <fieldset>
                    <legend className="text-text-secondary text-xs font-semibold">
                        국가
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
                                <span className="sr-only">{country.label}</span>
                            </label>
                        ))}
                    </div>
                    <FieldError message={errors.country?.message} />
                </fieldset>
            </section>

            <section className="bg-surface rounded-card flex flex-col gap-4 p-4">
                <div>
                    <h2 className="text-section">공개 설정</h2>
                    <p className="text-caption mt-1">
                        다른 사용자에게 표시할 플레이 정보를 선택합니다.
                    </p>
                </div>
                <Controller
                    name="hideNostalgiaName"
                    control={control}
                    render={({ field }) => (
                        <label className="border-border bg-bg rounded-card flex cursor-pointer items-center justify-between gap-4 border p-3">
                            <span className="min-w-0">
                                <span className="text-body block text-sm font-semibold">
                                    인게임 닉네임 비공개
                                </span>
                                <span className="text-caption mt-0.5 block">
                                    프로필의 NOSTALGIA ID를 비공개로 표시합니다.
                                </span>
                            </span>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-label="인게임 닉네임 비공개"
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
                                    Discord 닉네임 비공개
                                </span>
                                <span className="text-caption mt-0.5 block">
                                    프로필의 Discord 닉네임을 비공개로
                                    표시합니다.
                                </span>
                            </span>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-label="Discord 닉네임 비공개"
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
                                    플레이 횟수 비공개
                                </span>
                                <span className="text-caption mt-0.5 block">
                                    프로필과 공유 카드의 플레이 횟수를 숨깁니다.
                                </span>
                            </span>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-label="플레이 횟수 비공개"
                            />
                        </label>
                    )}
                />
            </section>

            <section className="bg-surface rounded-card flex flex-col gap-4 p-4">
                <div>
                    <h2 className="text-section">Discord</h2>
                    <p className="text-caption mt-1">
                        로그인 계정과 프로필에 표시할 정보를 관리합니다.
                    </p>
                </div>
                {user.discord_id ? (
                    <div className="grid gap-3">
                        <label className="text-text-secondary text-xs font-semibold">
                            Discord 닉네임
                            <input
                                type="text"
                                autoComplete="off"
                                placeholder="Discord 표시 이름"
                                className={`${inputClass} mt-1.5`}
                                {...register("discordName")}
                            />
                            <FieldError message={errors.discordName?.message} />
                        </label>
                        <label className="text-text-secondary text-xs font-semibold">
                            Discord 태그
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
                                      .join(" ") || "Discord 연결됨"
                                : "Discord 연결 필요"}
                        </p>
                        <p className="text-caption mt-0.5">
                            {user.discord_id
                                ? "로그인 계정으로 연결되어 있습니다."
                                : "현재 NosLog 계정을 유지한 채 연결됩니다."}
                        </p>
                    </div>
                    <a
                        href="/discord/start?returnTo=/profile/settings"
                        className="border-border text-text-primary hover:bg-surface-muted focus-visible:ring-focus/40 rounded-card flex h-10 shrink-0 items-center border px-3 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                        {user.discord_id ? "다시 연결" : "연결"}
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
                    href={`/profile/${user.id}`}
                    className="border-border text-text-secondary hover:bg-surface-muted hover:text-text-primary focus-visible:ring-focus/40 rounded-card flex h-11 cursor-pointer items-center justify-center border text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                    취소
                </Link>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-text-primary text-bg hover:bg-text-primary/90 focus-visible:ring-focus/40 rounded-card flex h-11 cursor-pointer items-center justify-center gap-2 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save className="size-4" aria-hidden />
                    {isSubmitting ? "저장 중" : "저장"}
                </button>
            </div>
        </form>
    );
}
