import Link from "next/link";

export default function footer() {
    return (
        <footer className="flex flex-col items-center justify-center h-24 px-4 py-6 text-xs text-white-secondary bg-dark-tertiary gap-1">
            <span>&copy; 2025 NosLog. All rights reserved.</span>
            <span>
                Git:{" "}
                <Link href="https://github.com/Anchovia/noslog">
                    Repository
                </Link>
            </span>
        </footer>
    );
}
