import Profile from "@/components/profile";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";

export default async function RecitalProfile({
    params,
}: {
    params: { id: string };
}) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return notFound();
    }

    const userData = await db.user.findUnique({
        where: {
            id,
        },
        select: {
            discord_name: true,
            discord_tag: true,
            username: true,
            avatar: true,
            country: true,
            rank_recital: true,
            rank_recital_country: true,
            grade_recital: true,
            play_count: true,
            score_p: true,
            score_s: true,
            score_a2: true,
            score_a: true,
            score_b2: true,
        },
    });

    const session = await getSession();
    return (
        <>
            {userData && userData.username ? (
                <Profile
                    id={id}
                    username={userData.username}
                    avatar={userData.avatar}
                    country={userData.country}
                    rank={userData.rank_recital}
                    rank_country={userData.rank_recital_country}
                    grade={userData.grade_recital}
                    play_count={userData.play_count}
                    score_p={userData.score_p}
                    score_s={userData.score_s}
                    score_a2={userData.score_a2}
                    score_a={userData.score_a}
                    score_b2={userData.score_b2}
                    isRecital={true}
                    discord_name={userData.discord_name}
                    discord_tag={userData.discord_tag}
                />
            ) : session.id === id ? (
                redirect(`/profile/${id}/settings`)
            ) : (
                redirect("/")
            )}
        </>
    );
}
