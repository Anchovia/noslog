"use server";

import {
    checkOnboardingNickname,
    completeOnboarding as completeOnboardingService,
} from "@/features/profile/server/onboarding-service";

export async function completeOnboarding(formData: FormData) {
    return completeOnboardingService(formData);
}

export async function checkNickname(username: string, locale: string) {
    return checkOnboardingNickname(username, locale);
}
