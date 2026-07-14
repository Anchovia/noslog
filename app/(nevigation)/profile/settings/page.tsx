import { redirect } from "next/navigation";

import ProfileSettingCard from "@/components/profile/profileSettingCard";
import db from "@/lib/db";
import getSession from "@/lib/session";

export default async function ProfileSettingsPage() {
    const session = await getSession();
    if (!session.id) redirect("/login");

    const user = await db.user.findUnique({
        where: { id: session.id },
        select: {
            id: true,
            avatar: true,
            username: true,
            discord_name: true,
            discord_tag: true,
        },
    });
    if (!user) redirect("/login");

    return (
        <div className="flex flex-col gap-5 px-4 py-5">
            <header>
                <h1 className="text-title">프로필 설정</h1>
                <p className="text-caption mt-1">
                    프로필에 표시할 정보와 이미지를 관리합니다.
                </p>
            </header>

            <ProfileSettingCard user={user} />
        </div>
    );
}
