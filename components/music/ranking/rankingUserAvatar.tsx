import type { RankingUser } from "./musicRankingTypes";
import ProfileAvatar from "@/components/profile/profileAvatar";

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
        <ProfileAvatar
            avatar={user.avatar}
            username={user.username}
            size={size}
        />
    );
}
