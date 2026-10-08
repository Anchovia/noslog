"use client";

import {
    checkNickname,
    completeOnboarding,
} from "@/app/(auth)/onboarding/actions";
import OnboardingFormView from "./onboardingFormView";
import type { OnboardingFormViewProps } from "./onboardingFormView";

export type OnboardingFormProps = Omit<
    OnboardingFormViewProps,
    "submitAction" | "checkAction"
> & {
    submitAction?: OnboardingFormViewProps["submitAction"];
    checkAction?: OnboardingFormViewProps["checkAction"];
};

/** 실제 Server Action을 연결하는 입구. 화면·검증은 View와 Storybook에서 같은 부품을 쓴다. */
export default function OnboardingForm({
    submitAction = completeOnboarding,
    checkAction = checkNickname,
    ...props
}: OnboardingFormProps) {
    return (
        <OnboardingFormView
            {...props}
            submitAction={submitAction}
            checkAction={checkAction}
        />
    );
}
