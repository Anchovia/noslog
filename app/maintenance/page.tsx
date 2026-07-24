import type { Metadata } from "next";
import { Wrench } from "lucide-react";

export const metadata: Metadata = {
    title: "점검 중",
    robots: { index: false, follow: false, noarchive: true },
};

export default function MaintenancePage() {
    return (
        <main className="bg-bg text-text-primary flex min-h-dvh items-center justify-center px-6 text-center">
            <section className="flex w-full max-w-97.5 flex-col items-center">
                <span className="border-text-primary flex size-15 items-center justify-center rounded-full border-2 text-2xl font-extrabold">
                    N
                </span>
                <span className="bg-surface text-text-secondary mt-8 flex size-12 items-center justify-center rounded-full">
                    <Wrench className="size-5" aria-hidden />
                </span>
                <h1 className="text-title mt-5">점검 중입니다.</h1>
                <p className="text-body-muted mt-2 leading-relaxed">
                    더 안정적인 서비스를 위해 잠시 점검하고 있습니다.
                    <br />
                    잠시 후 다시 이용해주세요.
                </p>
            </section>
        </main>
    );
}
