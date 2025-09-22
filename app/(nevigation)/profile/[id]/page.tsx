import ProfileDetail from "@/components/profile/profile";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import {
    getInitialBasicBestPlays,
    getInitialRecentPlays,
    getInitialRecitalBestPlays,
    getUserData,
} from "./actions";

export default async function Profile({ params }: { params: { id: string } }) {
    // params에 id가 아닌 값 들어왔을 때 예외 처리
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
                <ProfileDetail
                    userData={userData}
                    initialRecentPlays={initialRecentPlays}
                    initialBasicBestPlays={initialBasicBestPlays}
                    initialRecitalBestPlays={initialRecitalBestPlays}
                    userBestGrades={userBestGrades}
                />
            )}
        </>
    );
}
