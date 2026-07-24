import { getUser } from "@/lib/user";
import Link from "next/link";
import ProfileAvatar from "@/components/profile/profileAvatar";

import HeaderMenu, { HeaderPrimaryNavigation } from "./headerNavigation";

export default async function Header() {
    const user = await getUser();

    return (
        <header className="border-divider bg-surface sticky top-0 z-50 flex h-14 items-center border-b px-3 min-[390px]:px-4">
            <Link href="/" className="flex shrink-0 items-center gap-2">
                <span className="text-wordmark tracking-normal">NosLog</span>
            </Link>
            <div className="ml-auto flex min-w-0 items-center">
                <HeaderPrimaryNavigation />

                <div className="flex shrink-0 items-center">
                    {user ? (
                        <Link
                            href={`/profile/${user.id}`}
                            className="mx-1.5 shrink-0"
                            aria-label={`${user.username ?? "사용자"} 프로필`}
                        >
                            <ProfileAvatar
                                avatar={user.avatar}
                                username={user.username}
                                size={32}
                            />
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-card border-border text-text-primary hover:bg-surface-muted mx-1 flex h-10 shrink-0 items-center border px-3 text-sm font-bold transition-colors"
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
