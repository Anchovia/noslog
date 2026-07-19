"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { onboardingSchema } from "@/app/(nevigation)/profile/settings/schema";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import db from "@/lib/db";
import getSession from "@/lib/session";

export interface OnboardingActionState {
    message: string;
    fieldErrors?: {
        username?: string[];
        country?: string[];
    };
}

export async function completeOnboarding(
    _previousState: OnboardingActionState | null,
    formData: FormData
): Promise<OnboardingActionState | never> {
    const session = await getSession();
    if (!session.id) {
        return { message: "로그인이 필요합니다." };
    }

    const result = onboardingSchema.safeParse({
        username: String(formData.get("username") ?? ""),
        country: String(formData.get("country") ?? ""),
    });
    if (!result.success) {
        return {
            message: "입력한 정보를 확인해주세요.",
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }

    try {
        await db.user.update({
            where: { id: session.id },
            data: {
                username: result.data.username,
                country: result.data.country,
                profile_completed_at: new Date(),
            },
        });
    } catch (error) {
        const code =
            typeof error === "object" && error !== null && "code" in error
                ? String(error.code)
                : null;

        return {
            message:
                code === "P2002"
                    ? "이미 사용 중인 닉네임입니다."
                    : "프로필 설정을 완료하지 못했습니다.",
        };
    }

    session.profileCompleted = true;
    await session.save();
    updateTag(CACHE_TAGS.userRankings);
    updateTag(getUserProfileTag(session.id));
    redirect("/");
}
