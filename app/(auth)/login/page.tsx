import Link from "next/link";
import { redirect } from "next/navigation";

import DiscordIcon from "@/components/ui/DiscordIcon";
import { getUser } from "@/lib/user";

const errorMessages: Record<string, string> = {
    invalid_state: "로그인 요청이 만료되었습니다. 다시 시도해주세요.",
    oauth_config: "Discord 로그인 설정을 확인해주세요.",
    token_exchange: "Discord 인증 처리에 실패했습니다.",
    profile_fetch: "Discord 사용자 정보를 가져오지 못했습니다.",
    already_linked: "이미 다른 NosLog 계정에 연결된 Discord 계정입니다.",
    user_missing: "연결할 NosLog 계정을 찾지 못했습니다.",
    account_update: "Discord 계정 연결에 실패했습니다.",
};

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const user = await getUser();
    if (user) redirect("/");
    const { error } = await searchParams;

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
                    <a
                        href="/discord/start"
                        className="bg-discord text-text-primary rounded-card flex h-12 w-full items-center justify-center gap-2 text-sm font-bold transition-opacity hover:opacity-90 active:opacity-80"
                    >
                        <DiscordIcon className="size-5" />
                        Discord로 계속하기
                    </a>

                    {error ? (
                        <p className="border-danger/40 bg-danger/10 text-danger rounded-card mt-3 w-full border px-3 py-2 text-xs">
                            {errorMessages[error] ??
                                "로그인 중 오류가 발생했습니다."}
                        </p>
                    ) : null}

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
