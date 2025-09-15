import Profile from "@/components/profile/profile";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import {
    getInitialBasicBestPlays,
    getInitialRecentPlays,
    getInitialRecitalBestPlays,
    getUserData,
} from "./actions";

export default async function BasicProfile({
    params,
}: {
    params: { id: string };
}) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return notFound();
    }
    const userData = await getUserData(id);
    const initialRecentPlays = await getInitialRecentPlays(id);
    const initialBasicBestPlays = await getInitialBasicBestPlays(id);
    const initialRecitalBestPlays = await getInitialRecitalBestPlays(id);
    const userBestGrades: any = await db.userBestGrade.findMany({
        where: { user_id: id },
        select: {
            besttime: true,
            grade_basic: true,
            grade_recital: true,
        },
        orderBy: { besttime: "asc" },
    });

    return (
        <>
            {userData && (
                <Profile
                    id={id}
                    username={userData.username}
                    avatar={userData.avatar}
                    country={userData.country}
                    rank_basic={userData.rank_basic}
                    rank_basic_country={userData.rank_basic_country}
                    rank_recital={userData.rank_recital}
                    rank_recital_country={userData.rank_recital_country}
                    grade_basic={userData.grade_basic}
                    grade_recital={userData.grade_recital}
                    play_count={userData.play_count}
                    score_p={userData.score_p}
                    score_s={userData.score_s}
                    score_a2={userData.score_a2}
                    score_a={userData.score_a}
                    score_b2={userData.score_b2}
                    score_f={userData.score_f}
                    discord_name={userData.discord_name}
                    discord_tag={userData.discord_tag}
                    initialRecentPlays={initialRecentPlays}
                    initialBasicBestPlays={initialBasicBestPlays}
                    initialRecitalBestPlays={initialRecitalBestPlays}
                    userBestGrades={userBestGrades}
                />
            )}
        </>
    );
}
