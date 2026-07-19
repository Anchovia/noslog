import { redirect } from "next/navigation";

import OnboardingForm from "@/components/onboarding/onboardingForm";
import db from "@/lib/db";
import getSession from "@/lib/session";

export default async function OnboardingPage() {
    const session = await getSession();
    if (!session.id) redirect("/login");

    const user = await db.user.findUnique({
        where: { id: session.id },
        select: { profile_completed_at: true },
    });
    if (!user) redirect("/login");

    if (user.profile_completed_at) {
        redirect("/onboarding/complete");
    }

    return (
        <main className="mx-auto flex min-h-dvh w-full max-w-97.5 flex-col px-6 py-8">
            <section className="flex flex-1 flex-col items-center justify-center pb-12">
                <span className="border-text-primary flex size-15 items-center justify-center rounded-full border-2 text-2xl font-extrabold">
                    N
                </span>
                <div className="mt-5 w-full text-center">
                    <h1 className="text-display">프로필 설정</h1>
                    <p className="text-caption mt-2">
                        NosLog에서 사용할 닉네임과 국가를 선택해주세요.
                    </p>
                </div>
                <OnboardingForm />
            </section>
        </main>
    );
}
