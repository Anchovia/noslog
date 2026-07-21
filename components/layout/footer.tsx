import Link from "next/link";
import { ThemeIconToggle } from "@/components/theme/themeToggle";

export default function Footer() {
    return (
        <footer className="border-divider bg-surface text-text-secondary flex h-9 items-center gap-2 border-t px-4 text-xs">
            <span>&copy; 2026 NosLog</span>
            <span>
                <Link
                    href="https://github.com/Anchovia/noslog"
                    className="text-text-primary font-medium"
                >
                    GitHub
                </Link>
            </span>
            <span className="ml-auto">
                <ThemeIconToggle />
            </span>
        </footer>
    );
}
