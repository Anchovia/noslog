"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
    createOnboardingSchema,
    onboardingInputFromFormData,
    type OnboardingFormValues,
} from "@/features/profile/schemas/profileSettingsSchema";
import type { ActionFailure } from "@/lib/actions/result";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import {
    DEFAULT_LOCALE,
    isLocale,
    localeFromCountry,
    localizePath,
} from "@/lib/i18n/routing";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";

type OnboardingFieldName = Extract<keyof OnboardingFormValues, string>;
type OnboardingActionResult = ActionFailure<OnboardingFieldName>;

export async function completeOnboarding(
    formData: FormData
): Promise<OnboardingActionResult | never> {
    const requestedLocale = String(formData.get("locale") ?? "");
    const formLocale = isLocale(requestedLocale)
        ? requestedLocale
        : DEFAULT_LOCALE;
    const t = createTranslator(getMessages(formLocale));
    const session = await getSession();
    if (!session.id) {
        return {
            success: false,
            message: t("onboarding.error.loginRequired"),
        };
    }

    const result = createOnboardingSchema(t).safeParse(
        onboardingInputFromFormData(formData)
    );
    if (!result.success) {
        return {
            success: false,
            message: t("onboarding.error.invalid"),
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }

    const locale = localeFromCountry(result.data.country);

    try {
        await db.user.update({
            where: { id: session.id },
            data: {
                username: result.data.username,
                country: result.data.country,
                locale,
                profile_completed_at: new Date(),
            },
        });
    } catch (error) {
        const code =
            typeof error === "object" && error !== null && "code" in error
                ? String(error.code)
                : null;

        if (code !== "P2002") {
            logServerError(error, {
                event: "profile.onboarding.save.failed",
                routePath: "/onboarding",
                routeType: "action",
            });
        }

        return {
            success: false,
            message:
                code === "P2002"
                    ? t("onboarding.error.nicknameTaken")
                    : t("onboarding.error.generic"),
        };
    }

    session.profileCompleted = true;
    session.locale = locale;
    await session.save();
    updateTag(CACHE_TAGS.userRankings);
    updateTag(getUserProfileTag(session.id));
    redirect(localizePath("/", locale));
}
