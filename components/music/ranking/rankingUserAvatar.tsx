import type { RankingUser } from "./musicRankingTypes";

interface RankingUserAvatarProps {
    user: RankingUser;
    size?: number;
}

// 랭킹 목록에서 사용하는 유저 아바타를 표시함
export default function RankingUserAvatar({
    user,
    size = 28,
}: RankingUserAvatarProps) {
    return (
        <span
            className="border-border bg-surface-muted shrink-0 rounded-full border bg-cover bg-center"
            style={{
                width: size,
                height: size,
                backgroundImage: user.avatar
                    ? `url(${user.avatar})`
                    : undefined,
            }}
            aria-label={`${user.username || "이름 없는 유저"} 프로필 이미지`}
        />
    );
}
