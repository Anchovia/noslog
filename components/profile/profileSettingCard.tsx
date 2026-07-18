"use client";

import { Camera, MessageCircle, Save } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { put } from "@vercel/blob/client";

import {
    requestProfileAvatarUpload,
    uploadUserSetting,
} from "@/app/(nevigation)/profile/settings/actions";
import {
    SettingType,
    settingSchema,
} from "@/app/(nevigation)/profile/settings/schema";
import { zodResolver } from "@hookform/resolvers/zod";

interface ProfileSettingCardProps {
    user: {
        id: number;
        avatar: string | null;
        username: string | null;
        discord_id: string | null;
        discord_name: string | null;
    };
}

const inputClass =
    "border-border bg-bg text-input placeholder:text-text-disabled focus:border-text-secondary focus:ring-text-secondary/20 h-11 w-full rounded-card border px-3 outline-none transition focus:ring-2";

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="text-danger mt-1 text-xs">{message}</p>
    ) : null;
}

// 프로필 이미지와 공개 정보를 한 화면에서 수정함
export default function ProfileSettingCard({ user }: ProfileSettingCardProps) {
    const [preview, setPreview] = useState(user.avatar ?? "");
    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SettingType>({
        resolver: zodResolver(settingSchema),
        defaultValues: {
            avatar: user.avatar ?? "",
            username: user.username ?? "",
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
                <span
                    className="border-border bg-surface-muted flex size-18 shrink-0 items-center justify-center rounded-full border bg-cover bg-center text-xl font-bold"
                    style={{
                        backgroundImage: preview
                            ? `url(${preview})`
                            : undefined,
                    }}
                    aria-label="프로필 이미지 미리보기"
                >
                    {!preview ? (user.username?.charAt(0) ?? "N") : null}
                </span>
                <div className="min-w-0 flex-1">
                    <h2 className="text-section">프로필 이미지</h2>
                    <p className="text-caption mt-1">
                        JPG, PNG, WebP · 최대 4MB
                    </p>
                    <label className="border-border text-text-primary rounded-card mt-3 inline-flex h-9 cursor-pointer items-center gap-2 border px-3 text-xs font-semibold">
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
            </section>

            <section className="bg-surface rounded-card flex flex-col gap-4 p-4">
                <div>
                    <h2 className="text-section">Discord</h2>
                    <p className="text-caption mt-1">
                        로그인에 사용할 Discord 계정을 연결합니다.
                    </p>
                </div>
                <div className="border-border bg-bg rounded-card flex items-center gap-3 border p-3">
                    <span className="bg-discord/15 text-discord flex size-9 shrink-0 items-center justify-center rounded-full">
                        <MessageCircle className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-body truncate text-sm font-semibold">
                            {user.discord_id
                                ? (user.discord_name ?? "Discord 연결됨")
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
                        className="border-border text-text-primary rounded-card flex h-9 shrink-0 items-center border px-3 text-xs font-bold"
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
                    className="border-border text-text-secondary rounded-card flex h-11 items-center justify-center border text-sm font-semibold"
                >
                    취소
                </Link>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-text-primary text-bg rounded-card flex h-11 cursor-pointer items-center justify-center gap-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save className="size-4" aria-hidden />
                    {isSubmitting ? "저장 중" : "저장"}
                </button>
            </div>
        </form>
    );
}
