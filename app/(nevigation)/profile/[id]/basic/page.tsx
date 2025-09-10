import Profile from "@/components/profile";
import db from "@/lib/db";
import { notFound, redirect } from "next/navigation";

// todo: 유저 닉네임 미설정시 유저 닉네임 설정 무조건 필요
// todo2: BIO 편집 및 저장 기능 개발 필요
// todo3: basic - recital 탭 개발 필요(use client)

export default async function BasicProfile({
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
            rank_basic: true,
            rank_basic_country: true,
            grade_basic: true,
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
                    rank={user.rank_basic}
                    rank_country={user.rank_basic_country}
                    grade={user.grade_basic}
                    play_count={user.play_count}
                    score_p={user.score_p}
                    score_s={user.score_s}
                    score_a2={user.score_a2}
                    score_a={user.score_a}
                    score_b2={user.score_b2}
                    isRecital={false}
                />
            ) : (
                redirect(`/profile/${id}/setting`)
            )}
        </>
    );
}
