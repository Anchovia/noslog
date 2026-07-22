import { getUser } from "@/lib/user";
import Image from "next/image";
import Link from "next/link";

import HeaderMenu, { HeaderPrimaryNavigation } from "./headerNavigation";

export default async function Header() {
    const user = await getUser();

    return (
        <header className="border-divider bg-surface relative z-50 flex h-14 items-center border-b px-3 min-[390px]:px-4">
            <Link href="/" className="flex shrink-0 items-center gap-2">
                <span className="text-wordmark tracking-normal">NosLog</span>
            </Link>
            <div className="ml-auto flex min-w-0 items-center gap-2 min-[390px]:gap-3">
                <HeaderPrimaryNavigation />

                <div className="flex shrink-0 items-center gap-1">
                    {user ? (
                        <Link
                            href={`/profile/${user.id}`}
                            className="border-border bg-text-primary text-bg relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border text-sm font-bold"
                            aria-label={`${user.username ?? "사용자"} 프로필`}
                        >
                            {user.avatar ? (
                                <Image
                                    src={user.avatar}
                                    alt=""
                                    fill
                                    sizes="32px"
                                />
                            ) : (
                                (user.username?.charAt(0) ?? "N")
                            )}
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-card border-border text-text-primary hover:bg-surface-muted flex h-10 shrink-0 items-center border px-3 text-sm font-bold transition-colors"
                        >
                            로그인
                        </Link>
                    )}
                    <HeaderMenu />
                </div>
            </div>
        </header>
    );
}
