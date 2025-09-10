import Profile from "@/components/profile";
import db from "@/lib/db";
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

    const user = await db.user.findUnique({
        where: {
            id,
        },
        select: {
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
    return (
        <>
            {user && user.username ? (
                <Profile
                    id={id}
                    username={user.username}
                    avatar={user.avatar}
                    country={user.country}
                    rank={user.rank_recital}
                    rank_country={user.rank_recital_country}
                    grade={user.grade_recital}
                    play_count={user.play_count}
                    score_p={user.score_p}
                    score_s={user.score_s}
                    score_a2={user.score_a2}
                    score_a={user.score_a}
                    score_b2={user.score_b2}
                    isRecital={true}
                />
            ) : (
                redirect(`/profile/${id}/setting`)
            )}
        </>
    );
}
