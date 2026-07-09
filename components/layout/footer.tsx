import Link from "next/link";

export default function footer() {
    return (
        <footer className="text-white-secondary bg-dark-tertiary flex h-24 flex-col items-center justify-center gap-1 px-4 py-6 text-xs">
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
