"use client";

import {
    getImageUploadUrl,
    uploadUserSetting,
} from "@/app/(nevigation)/profile/settings/actions";
import {
    SettingType,
    settingSchema,
} from "@/app/(nevigation)/profile/settings/schema";
import Button from "@/components/button/formButton";
import Input from "@/components/input/formInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface ProfileSettingCardProps {
    avatar: string | null | undefined;
}

export default function ProfileSettingCard({
    avatar,
}: ProfileSettingCardProps) {
    const [preview, setPreview] = useState(avatar);
    const [uploadUrl, setUploadUrl] = useState("");

    const [file, setFile] = useState<File | null>(null);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<SettingType>({
        resolver: zodResolver(settingSchema),
    });

    // 이미지만 업로드 했는지 확인 필요
    // 파일 최대 사이즈 제한 필요(3 ~ 4mb)
    const onImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const {
            target: { files },
        } = event;
        if (!files) {
            return;
        }
        const file = files[0];
        const url = URL.createObjectURL(file);
        setPreview(url);
        setFile(file);
        const { success, result } = await getImageUploadUrl();
        if (success) {
            const { id, uploadURL } = result;
            setUploadUrl(uploadURL);
            setValue(
                "avatar",
                `https://imagedelivery.net/zAwkQO6bEReNpmM7QzHHXA/${id}`
            );
        }
    };
    const onSubmit = handleSubmit(async (data: SettingType) => {
        const formData = new FormData();

        if (file) {
            const cloudflareForm = new FormData();
            cloudflareForm.append("file", file);
            const response = await fetch(uploadUrl, {
                method: "POST",
                body: cloudflareForm,
            });
            if (response.status !== 200) {
                return;
            }
            formData.append("avatar", data.avatar);
        } else if (preview) {
            formData.append("avatar", preview);
        }
        formData.append("username", data.username);
        if (data.discord_name) {
            formData.append("discord_name", data.discord_name);
        }
        if (data.discord_tag) {
            formData.append("discord_tag", data.discord_tag);
        }
        await uploadUserSetting(formData);
    });
    const onValid = async () => {
        await onSubmit();
    };

    useEffect(() => {
        setValue("avatar", avatar ? avatar : "");
    }, []);

    return (
        <main className="flex min-h-screen w-screen items-center justify-center py-14">
            <form
                action={onValid}
                className="bg-dark-secondary/40 flex max-w-sm flex-col items-center justify-center gap-2 rounded-2xl p-8"
            >
                {/* 아바타 업로드 */}
                <label
                    className="border-dark-tertiary size-24 rounded-full border"
                    htmlFor="avatar"
                    style={{
                        backgroundImage: `url(${preview})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    {preview === "" ? (
                        <>
                            <div className="border-dark-tertiary size-24 rounded-full border" />
                        </>
                    ) : null}
                </label>
                <input
                    onChange={onImageChange}
                    type="file"
                    id="avatar"
                    name="avatar"
                    className="hidden"
                />
                {/* 닉네임 */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm" htmlFor="username">
                        닉네임
                    </label>
                    <Input
                        placeholder="닉네임"
                        type="text"
                        required
                        {...register("username")}
                        errors={[errors.username?.message ?? ""]}
                    />
                </div>
                {/* 디스코드 이름, 태그 */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm" htmlFor="discord_name">
                        디스코드 이름
                    </label>
                    <Input
                        placeholder="디스코드 이름"
                        type="text"
                        {...register("discord_name")}
                        errors={[errors.discord_name?.message ?? ""]}
                    />
                    <label className="text-sm" htmlFor="discord_tag">
                        디스코드 태그
                    </label>
                    <Input
                        placeholder="디스코드 태그"
                        type="text"
                        {...register("discord_tag")}
                        errors={[errors.discord_tag?.message ?? ""]}
                    />
                </div>
                <Button text="업데이트" />
            </form>
        </main>
    );
}
