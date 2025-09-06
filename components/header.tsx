import { getUser } from "@/lib/user";
import Image from "next/image";
import Link from "next/link";

export default async function Header() {
    const user = await getUser();

    return (
        <header className="w-full h-20 flex bg-black text-white items-center px-4 *:text-neutral-500">
            <div className="flex flex-1 gap-3">
                <Link href="/">Home</Link>
                <Link href="/song">Song</Link>
                <Link href="/ranking">Ranking</Link>
                <Link href="/bingo">Bingo</Link>
            </div>
            {user ? (
                <Link
                    href="/profile"
                    className="size-10 rounded-full overflow-hidden relative"
                >
                    <Image src={user!.avatar!} alt="avatar" fill />
                </Link>
            ) : (
                <Link href="/login" className="size-10 bg-slate-600" />
            )}
        </header>
    );
}
