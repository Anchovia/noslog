import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-divider bg-surface text-text-secondary flex min-h-9 items-center gap-3 border-t px-4 py-2 text-xs">
            <span>&copy; 2026 NosLog</span>
            <Link
                href="/privacy"
                className="hover:text-text-primary transition-colors"
            >
                개인정보처리방침
            </Link>
            <Link
                href="https://github.com/Anchovia/noslog"
                className="text-text-primary font-medium"
            >
                GitHub
            </Link>
        </footer>
    );
}
