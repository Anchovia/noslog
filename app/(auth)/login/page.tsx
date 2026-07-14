import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/user";

export default async function LoginPage() {
    const user = await getUser();
    if (user) redirect("/");

    return (
        <main className="mx-auto flex min-h-dvh w-full max-w-97.5 flex-col px-6 py-8">
            <section className="flex flex-1 flex-col items-center justify-center pb-12 text-center">
                <Link
                    href="/"
                    aria-label="NosLog 홈"
                    className="border-text-primary flex size-15 items-center justify-center rounded-full border-2 text-2xl font-extrabold"
                >
                    N
                </Link>

                <h1 className="text-display mt-5">NosLog</h1>
                <p className="text-caption mt-3">
                    NOSTALGIA 기록 · 랭킹 · 서열표
                </p>

                <div className="mt-10 flex w-full flex-col items-center">
                    <Link
                        href="/kakao/start"
                        className="rounded-card flex h-12 w-full items-center justify-center bg-[#fee500] transition-opacity hover:opacity-90 active:opacity-80"
                    >
                        <Image
                            src="/kakao_login_large_narrow.png"
                            alt="카카오로 계속하기"
                            width={366}
                            height={90}
                            priority
                            className="h-10 w-auto"
                        />
                    </Link>

                    <p className="text-text-disabled mt-4 text-xs leading-relaxed">
                        로그인하면 서비스 약관 및 개인정보 처리방침에 동의하게
                        됩니다.
                    </p>

                    <Link
                        href="/"
                        className="text-text-secondary hover:text-text-primary mt-6 text-xs underline underline-offset-4 transition-colors"
                    >
                        로그인 없이 둘러보기
                    </Link>
                </div>
            </section>
        </main>
    );
}
