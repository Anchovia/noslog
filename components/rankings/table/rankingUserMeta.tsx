import Badge from "@/components/ui/Badge";
import { useTranslations } from "@/components/i18n/localeProvider";
import ProfileAvatar from "@/components/profile/profileAvatar";
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
    return <ProfileAvatar avatar={avatar} username={username} size={size} />;
}

export function CountryMark({ country }: { country: string }) {
    const t = useTranslations();
    if (country === "ko-KR") {
        return (
            <Image
                src="/flag/ko-KR.svg"
                alt={t("country.korea")}
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
                aria-label={t("country.japan")}
            >
                <span className="bg-danger absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            </span>
        );
    }

    return <Globe2 size={14} aria-label={t("country.global")} />;
}

export function ExamBadge({
    mode,
    exam,
}: {
    mode: UserRankingMode;
    exam: number | null;
}) {
    const t = useTranslations();
    if (!exam) return null;

    return (
        <Badge variant={mode} className="h-5 shrink-0 px-1.5">
            {t("rankings.examBadge", {
                mode: mode === "basic" ? "Basic" : "Recital",
                exam,
            })}
        </Badge>
    );
}
