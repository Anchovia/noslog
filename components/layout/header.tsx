import { getUser } from "@/lib/user";
import Image from "next/image";
import Link from "next/link";

const navItems = [
    { href: "/music", label: "악곡" },
    { href: "/rankings", label: "랭킹" },
    { href: "/tiers", label: "서열" },
    { href: "/bingo", label: "빙고" },
    { href: "/exams", label: "검정" },
];

export default async function Header() {
    const user = await getUser();

    return (
        <header className="border-divider bg-surface flex h-14 items-center border-b px-3 min-[390px]:px-4">
            <Link href="/" className="flex shrink-0 items-center gap-2">
                <span className="text-wordmark tracking-normal">NosLog</span>
            </Link>
            <div className="ml-auto flex min-w-0 items-center gap-2 min-[390px]:gap-3">
                <nav
                    className="flex min-w-0 items-center gap-1 min-[390px]:gap-2"
                    aria-label="주요 메뉴"
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-text-secondary hover:text-text-primary flex h-10 shrink-0 items-center text-sm font-semibold transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {user && user.avatar ? (
                    <Link
                        href={`/profile/${user.id}`}
                        className="border-border relative size-8 shrink-0 overflow-hidden rounded-full border"
                    >
                        <Image
                            src={user.avatar}
                            alt={`${user.username ?? "사용자"} 프로필`}
                            fill
                            sizes="32px"
                        />
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className="rounded-card border-border text-text-primary hover:bg-surface-muted flex h-10 shrink-0 items-center border px-3 text-sm font-bold transition-colors"
                    >
                        로그인
                    </Link>
                )}
            </div>
        </header>
    );
}
