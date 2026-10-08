"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createTierList, updateTierList } from "@/app/admin/tiers/actions";
import {
    AdminFieldError,
    adminInputClass as inputClass,
} from "@/components/admin/admin-form";
import {
    createTierListFormData,
    normalizeTierGoal,
    normalizeTierMode,
    normalizeTierStatus,
    tierListFormSchema,
    type TierListFormValues,
    type TierListValues,
} from "@/features/tiers/schemas/tier-admin-schema";
import { applyFormActionFailure, applyFormRootError } from "@/lib/forms/errors";

export interface TierListFormData {
    id?: number;
    slug: string;
    title: string;
    mode: string;
    goal: string;
    description: string;
    status: string;
}

function FieldError({ message }: { message?: string }) {
    return (
        <AdminFieldError
            message={message}
            as="span"
            className="text-xs text-danger"
        />
    );
}

export default function TierListForm({
    tierList,
}: {
    tierList: TierListFormData;
}) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<TierListFormValues, unknown, TierListValues>({
        resolver: zodResolver(tierListFormSchema),
        defaultValues: {
            slug: tierList.slug,
            title: tierList.title,
            mode: normalizeTierMode(tierList.mode),
            goal: normalizeTierGoal(tierList.goal),
            description: tierList.description,
            status: normalizeTierStatus(tierList.status),
        },
    });

    async function handleTierListSubmit(values: TierListValues) {
        clearErrors();

        try {
            const formData = createTierListFormData(values, tierList.id);
            const result = tierList.id
                ? await updateTierList(formData)
                : await createTierList(formData);

            if (!result.success) {
                applyFormActionFailure(setError, result, toast.error);
                return;
            }

            toast.success(result.message);
            if (tierList.id === undefined) {
                router.replace(`/admin/tiers/${result.id}`);
            } else {
                router.refresh();
            }
        } catch {
            const message = "서열표 정보를 저장하지 못했습니다.";
            applyFormRootError(setError, message, toast.error);
        }
    }

    return (
        <form
            noValidate
            onSubmit={handleSubmit(handleTierListSubmit, () =>
                toast.error("서열표 입력을 확인해주세요.")
            )}
            className="flex flex-col gap-4"
        >
            <section className="grid grid-cols-2 gap-3 rounded-card bg-surface p-3">
                <label className="col-span-2 flex flex-col gap-1 text-caption">
                    서열표 이름
                    <input
                        {...register("title")}
                        placeholder="Basic Lv12+ 서열표"
                        className={inputClass}
                    />
                    <FieldError message={errors.title?.message} />
                </label>
                <label className="col-span-2 flex flex-col gap-1 text-caption">
                    식별자
                    <input
                        {...register("slug")}
                        placeholder="basic-lv12-plus"
                        className={inputClass}
                    />
                    <FieldError message={errors.slug?.message} />
                </label>
                <label className="col-span-2 flex flex-col gap-1 text-caption">
                    모드
                    <select {...register("mode")} className={inputClass}>
                        <option value="basic">Basic</option>
                        <option value="recital">Recital</option>
                    </select>
                    <FieldError message={errors.mode?.message} />
                </label>
                <label className="col-span-2 flex flex-col gap-1 text-caption">
                    목표
                    <select {...register("goal")} className={inputClass}>
                        <option value="s">S</option>
                        <option value="990k">990k</option>
                        <option value="pianist">Pianist</option>
                    </select>
                    <FieldError message={errors.goal?.message} />
                </label>
                <label className="col-span-2 flex flex-col gap-1 text-caption">
                    설명
                    <textarea
                        {...register("description")}
                        rows={3}
                        className="w-full resize-y rounded-md border border-border bg-bg p-3 text-input"
                    />
                    <FieldError message={errors.description?.message} />
                </label>
                <label className="col-span-2 flex flex-col gap-1 text-caption">
                    상태
                    <select {...register("status")} className={inputClass}>
                        <option value="draft">임시 저장</option>
                        <option value="published">공개</option>
                        <option value="archived">보관</option>
                    </select>
                    <FieldError message={errors.status?.message} />
                </label>
            </section>
            <AdminFieldError
                message={errors.root?.server?.message}
                className="text-xs text-danger"
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto flex h-10 items-center gap-1 rounded-md bg-text-primary px-3 text-sm font-bold text-bg disabled:cursor-wait disabled:opacity-60"
            >
                <Save className="size-4" aria-hidden />
                {isSubmitting
                    ? "저장 중..."
                    : tierList.id
                      ? "정보 저장"
                      : "서열표 생성"}
            </button>
        </form>
    );
}
