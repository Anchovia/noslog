import { getUser } from "@/lib/user";
import Link from "next/link";

export default async function Home() {
    const user = await getUser();

    return (
        <main className="flex flex-col gap-4 px-4 py-4">
            {/* 상단 로그인/프로필 카드 */}
            <section className="bg-surface rounded-card flex items-center justify-between p-4">
                <p className="text-section">내 NOSTALGIA 기록 모아보기</p>
                {user ? (
                    <span className="text-caption">{user.username}</span>
                ) : (
                    <Link
                        href="/login"
                        className="bg-discord rounded-card text-text-primary px-3 py-2 text-xs font-bold"
                    >
                        로그인
                    </Link>
                )}
            </section>
            {/* 히어로 + 검색 */}
            <section className="flex flex-col items-center gap-4 pt-8 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="border-text-primary text-text-primary flex size-11 items-center justify-center rounded-full border-2 text-lg font-bold">
                        N
                    </div>
                    <div>
                        <h1 className="text-title">NosLog</h1>
                        <p className="text-caption mt-2">
                            NOSTALGIA 기록 · 랭킹 · 서열 아카이브
                        </p>
                    </div>
                </div>

                <form action="/music" className="w-full">
                    <input
                        name="q"
                        placeholder="곡 제목 · 아티스트 검색"
                        className="border-border bg-surface text-input placeholder:text-text-disabled h-11 w-full rounded-full border px-4"
                    />
                </form>
            </section>
            {/* 퀵 메뉴 */}
            <section className="grid grid-cols-3 gap-2">
                <Link
                    href="/music"
                    className="bg-surface rounded-card flex h-20 flex-col items-center justify-center gap-2"
                >
                    <span className="border-border size-6 rounded-md border" />
                    <span className="text-caption text-text-primary font-semibold">
                        악곡
                    </span>
                </Link>
                <Link
                    href="/rankings"
                    className="bg-surface rounded-card flex h-20 flex-col items-center justify-center gap-2"
                >
                    <span className="border-border size-6 rounded-md border" />
                    <span className="text-caption text-text-primary font-semibold">
                        랭킹
                    </span>
                </Link>
                <Link
                    href="/bingo"
                    className="bg-surface rounded-card flex h-20 flex-col items-center justify-center gap-2"
                >
                    <span className="border-border size-6 rounded-md border" />
                    <span className="text-caption text-text-primary font-semibold">
                        빙고
                    </span>
                </Link>
                <Link
                    href="/tiers"
                    className="bg-surface rounded-card flex h-20 flex-col items-center justify-center gap-2"
                >
                    <span className="border-border size-6 rounded-md border" />
                    <span className="text-caption text-text-primary font-semibold">
                        서열표
                    </span>
                </Link>
                <Link
                    href="/exams"
                    className="bg-surface rounded-card flex h-20 flex-col items-center justify-center gap-2"
                >
                    <span className="border-border size-6 rounded-md border" />
                    <span className="text-caption text-text-primary font-semibold">
                        검정
                    </span>
                </Link>
                <div className="bg-surface-muted rounded-card relative flex h-20 flex-col items-center justify-center gap-2 opacity-50">
                    <span className="border-border size-6 rounded-md border" />
                    <span className="text-caption text-text-secondary font-semibold">
                        준비중
                    </span>
                    <span className="bg-real/15 text-real absolute top-1 right-1 rounded px-1 text-[10px] font-bold">
                        SOON
                    </span>
                </div>
            </section>
            {/* 데이터 연동 가이드 */}
            <Link
                href="/bookmarklet"
                className="bg-surface rounded-card flex h-10 items-center justify-between px-4"
            >
                <div className="flex items-center gap-2">
                    <span className="border-border size-4 rounded border" />
                    <span className="text-caption">데이터 연동 가이드</span>
                </div>
                <span className="text-text-disabled text-base">›</span>
            </Link>
        </main>
    );
}
