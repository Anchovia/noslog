import ProfileSettingCard from "@/components/profile/profileSettingCard";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";

export default async function ProfileSettings() {
    const session = await getSession();
    const user = await db.user.findUnique({
        where: {
            id: session.id,
        },
        select: { avatar: true },
    });
    if (!user) {
        return notFound();
    }
    return (
        <main>
            <ProfileSettingCard avatar={user.avatar} />
        </main>
    );
}
