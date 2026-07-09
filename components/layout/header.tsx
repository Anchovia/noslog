import { getUser } from "@/lib/user";
import Image from "next/image";
import Link from "next/link";

export default async function Header() {
    const user = await getUser();

    return (
        <header className="bg-dark-secondary/50 flex h-20 w-full items-center px-6 text-white *:text-neutral-500">
            <div className="flex flex-1 gap-4 *:relative *:size-8">
                <Link href="/">
                    <Image src={"/icon/home.png"} alt={"홈"} fill />
                </Link>
                <Link href="/music">
                    <Image src={"/icon/music.png"} alt={"악곡"} fill />
                </Link>
                <Link href="/rankings">
                    <Image src={"/icon/leaderBoard.png"} alt={"랭킹"} fill />
                </Link>
                <Link href="/bingo">
                    <Image src={"/icon/bingo.png"} alt={"빙고"} fill />
                </Link>
                <Link href="/tier">
                    <Image src={"/icon/crown.png"} alt={"서열표"} fill />
                </Link>
            </div>
            {user ? (
                <Link
                    href={`/profile/${user.id}`}
                    className="relative size-11 overflow-hidden rounded-full"
                >
                    <Image src={user!.avatar!} alt="avatar" fill />
                </Link>
            ) : (
                <Link
                    href="/login"
                    className="size-11 rounded-full bg-slate-600"
                />
            )}
        </header>
    );
}
