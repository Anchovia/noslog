"use client";

import Button from "@/components/button/formButton";
import Input from "@/components/input/formInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getImageUploadUrl, uploadUserSetting } from "./actions";
import { SettingType, settingSchema } from "./schema";

export default function ProfileSettings() {
    const [preview, setPreview] = useState("");
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
        if (!file) {
            return;
        }
        const cloudflareForm = new FormData();
        cloudflareForm.append("file", file);
        const response = await fetch(uploadUrl, {
            method: "POST",
            body: cloudflareForm,
        });
        if (response.status !== 200) {
            return;
        }
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("discord_name", data.discord_name);
        formData.append("discord_tag", data.discord_tag);
        formData.append("avatar", data.avatar);

        await uploadUserSetting(formData);
    });
    const onValid = async () => {
        await onSubmit();
    };
    return (
        <main className="w-screen flex items-center justify-center py-14 min-h-screen">
            <form
                action={onValid}
                className="p-8 flex flex-col items-center justify-center max-w-sm bg-dark-secondary/40 rounded-2xl gap-2"
            >
                {/* 아바타 업로드 */}
                <label
                    className="size-24 border border-dark-tertiary rounded-full"
                    htmlFor="avatar"
                    style={{
                        backgroundImage: `url(${preview})`,
                    }}
                >
                    {preview === "" ? (
                        <>
                            <div className="size-24 border border-dark-tertiary rounded-full" />
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
                        required
                        {...register("discord_name")}
                        errors={[errors.discord_name?.message ?? ""]}
                    />
                    <label className="text-sm" htmlFor="discord_tag">
                        디스코드 태그
                    </label>
                    <Input
                        placeholder="디스코드 태그"
                        type="text"
                        required
                        {...register("discord_tag")}
                        errors={[errors.discord_tag?.message ?? ""]}
                    />
                </div>
                <Button text="업데이트" />
            </form>
        </main>
    );
}
