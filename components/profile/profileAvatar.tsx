import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
    avatar: string | null;
    username: string | null;
    size?: number;
    className?: string;
}

// 등록된 이미지가 없으면 NosLog의 원형 N 로고를 공통 기본 아바타로 사용함
export default function ProfileAvatar({
    avatar,
    username,
    size = 32,
    className,
}: ProfileAvatarProps) {
    return (
        <span
            className={cn(
                "flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-cover bg-center font-bold",
                avatar
                    ? "border-border bg-surface-muted"
                    : "border-text-primary bg-bg text-text-primary",
                className
            )}
            style={{
                width: size,
                height: size,
                backgroundImage: avatar ? `url(${avatar})` : undefined,
                fontSize: Math.max(9, Math.round(size * 0.38)),
            }}
            aria-label={`${username || "이름 없는 유저"} 프로필 이미지`}
        >
            {!avatar ? "N" : null}
        </span>
    );
}
