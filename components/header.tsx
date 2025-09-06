import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full h-20 flex bg-black text-white items-center px-4 *:text-neutral-500">
            <div className="flex flex-1 gap-3">
                <span>home</span>
                <span>song</span>
                <span>ranking</span>
                <span>bingo</span>
            </div>
            <Link
                href={"/login"}
                className="bg-slate-600 rounded-full size-10"
            />
        </header>
    );
}
