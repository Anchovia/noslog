import Badge from "@/components/ui/Badge";
import type { UserRankingMode } from "@/lib/rankings";
import { Globe2 } from "lucide-react";
import Image from "next/image";

export function UserAvatar({
    avatar,
    username,
    size = 32,
}: {
    avatar: string | null;
    username: string | null;
    size?: number;
}) {
    return (
        <span
            className="border-border bg-surface-muted flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-cover bg-center text-xs font-bold"
            style={{
                width: size,
                height: size,
                backgroundImage: avatar ? `url(${avatar})` : undefined,
            }}
            aria-label={`${username || "이름 없는 유저"} 프로필 이미지`}
        >
            {!avatar ? (username?.charAt(0).toUpperCase() ?? "?") : null}
        </span>
    );
}

export function CountryMark({ country }: { country: string }) {
    if (country === "ko-KR") {
        return (
            <Image
                src="/flag/ko-KR.svg"
                alt="대한민국"
                width={16}
                height={12}
                className="h-3 w-4 shrink-0 rounded-[2px]"
            />
        );
    }

    if (country === "ja-JP") {
        return (
            <span
                className="relative h-3 w-4 rounded-[2px] bg-white"
                aria-label="일본"
            >
                <span className="bg-danger absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            </span>
        );
    }

    return <Globe2 size={14} aria-label="글로벌" />;
}

export function ExamBadge({
    mode,
    exam,
}: {
    mode: UserRankingMode;
    exam: number | null;
}) {
    if (!exam) return null;

    return (
        <Badge variant={mode} className="h-5 shrink-0 px-1.5">
            {mode === "basic" ? "Basic" : "Recital"} {exam}급
        </Badge>
    );
}
