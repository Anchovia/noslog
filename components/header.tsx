import { getUser } from "@/lib/user";
import Image from "next/image";
import Link from "next/link";

export default async function Header() {
    const user = await getUser();

    return (
        <header className="w-full h-20 flex bg-black text-white items-center px-6 *:text-neutral-500">
            <div className="flex flex-1 gap-4">
                <Link href="/">메인</Link>
                <Link href="/music">악곡</Link>
                <Link href="/ranking">랭킹</Link>
                <Link href="/bingo">빙고</Link>
                <Link href="/event">이벤트</Link>
            </div>
            {user ? (
                <Link
                    href="/profile"
                    className="size-11 rounded-full overflow-hidden relative"
                >
                    <Image src={user!.avatar!} alt="avatar" fill />
                </Link>
            ) : (
                <Link
                    href="/login"
                    className="size-11 bg-slate-600 rounded-full"
                />
            )}
        </header>
    );
}
