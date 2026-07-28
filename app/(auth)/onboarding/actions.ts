"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { onboardingSchema } from "@/app/(nevigation)/profile/settings/schema";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import {
    DEFAULT_LOCALE,
    isLocale,
    localeFromCountry,
    localizePath,
} from "@/lib/i18n/routing";
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
    const requestedLocale = String(formData.get("locale") ?? "");
    const formLocale = isLocale(requestedLocale)
        ? requestedLocale
        : DEFAULT_LOCALE;
    const t = createTranslator(getMessages(formLocale));
    const session = await getSession();
    if (!session.id) {
        return { message: t("onboarding.error.loginRequired") };
    }

    const result = onboardingSchema.safeParse({
        username: String(formData.get("username") ?? ""),
        country: String(formData.get("country") ?? ""),
    });
    if (!result.success) {
        const usernameIssue = result.error.issues.find(
            (issue) => issue.path[0] === "username"
        );
        const countryIssue = result.error.issues.find(
            (issue) => issue.path[0] === "country"
        );

        return {
            message: t("onboarding.error.invalid"),
            fieldErrors: {
                username: usernameIssue
                    ? [
                          t(
                              usernameIssue.code === "too_big"
                                  ? "onboarding.error.nicknameMax"
                                  : "onboarding.error.nicknameRequired"
                          ),
                      ]
                    : undefined,
                country: countryIssue
                    ? [t("onboarding.error.countryRequired")]
                    : undefined,
            },
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

        return {
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
