"use server";

import { completeOnboarding as completeOnboardingService } from "@/features/profile/server/onboardingService";

export async function completeOnboarding(formData: FormData) {
    return completeOnboardingService(formData);
}
