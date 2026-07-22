import type { ComponentProps } from "react";

import AdminSaveButton from "@/components/admin/adminSaveButton";

export interface TierListFormData {
    id?: number;
    slug: string;
    title: string;
    mode: string;
    goal: string;
    description: string;
    status: string;
}

const inputClass =
    "border-border bg-bg text-input h-11 w-full rounded-md border px-3";

export default function TierListForm({
    action,
    tierList,
}: {
    action: ComponentProps<"form">["action"];
    tierList: TierListFormData;
}) {
    return (
        <form action={action} className="flex flex-col gap-4">
            {tierList.id ? (
                <input type="hidden" name="id" value={tierList.id} />
            ) : null}
            <section className="bg-surface rounded-card grid grid-cols-2 gap-3 p-3">
                <label className="text-caption col-span-2 flex flex-col gap-1">
                    서열표 이름
                    <input
                        name="title"
                        required
                        defaultValue={tierList.title}
                        placeholder="Basic Lv12+ 서열표"
                        className={inputClass}
                    />
                </label>
                <label className="text-caption col-span-2 flex flex-col gap-1">
                    식별자
                    <input
                        name="slug"
                        required
                        pattern="[a-z0-9-]+"
                        defaultValue={tierList.slug}
                        placeholder="basic-lv12-plus"
                        className={inputClass}
                    />
                </label>
                <label className="text-caption col-span-2 flex flex-col gap-1">
                    모드
                    <select
                        name="mode"
                        defaultValue={tierList.mode}
                        className={inputClass}
                    >
                        <option value="basic">Basic</option>
                        <option value="recital">Recital</option>
                    </select>
                </label>
                <label className="text-caption col-span-2 flex flex-col gap-1">
                    목표
                    <select
                        name="goal"
                        defaultValue={tierList.goal}
                        className={inputClass}
                    >
                        <option value="s">S</option>
                        <option value="fc">Full Combo</option>
                        <option value="pianist">Pianist</option>
                    </select>
                </label>
                <label className="text-caption col-span-2 flex flex-col gap-1">
                    설명
                    <textarea
                        name="description"
                        rows={3}
                        defaultValue={tierList.description}
                        className="border-border bg-bg text-input w-full resize-y rounded-md border p-3"
                    />
                </label>
                <label className="text-caption col-span-2 flex flex-col gap-1">
                    상태
                    <select
                        name="status"
                        defaultValue={tierList.status}
                        className={inputClass}
                    >
                        <option value="draft">임시 저장</option>
                        <option value="published">공개</option>
                        <option value="archived">보관</option>
                    </select>
                </label>
            </section>
            <AdminSaveButton
                label={tierList.id ? "정보 저장" : "서열표 생성"}
            />
        </form>
    );
}
