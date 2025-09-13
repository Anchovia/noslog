import { getUser } from "@/lib/user";
import Image from "next/image";
import Link from "next/link";

export default async function Header() {
    const user = await getUser();

    return (
        <header className="w-full h-20 flex bg-dark-secondary text-white items-center px-6 *:text-neutral-500">
            <div className="flex flex-1 gap-8 *:relative *:size-8">
                <Link href="/">
                    <Image src={"/icon/home.png"} alt={"home"} fill />
                </Link>
                <Link href="/music">
                    <Image src={"/icon/music.png"} alt={"music"} fill />
                </Link>
                <Link href="/ranking">
                    <Image
                        src={"/icon/leaderBoard.png"}
                        alt={"leaderBoard"}
                        fill
                    />
                </Link>
                <Link href="/bingo">
                    <Image src={"/icon/bingo.png"} alt={"bingo"} fill />
                </Link>
            </div>
            {user ? (
                <Link
                    href={`/profile/${user.id}`}
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
