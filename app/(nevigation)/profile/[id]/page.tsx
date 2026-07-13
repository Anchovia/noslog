import ProfileDashboard from "@/components/profile/profile";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import { getProfileData } from "./actions";

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (!Number.isInteger(id) || id < 1) notFound();

    const [profileData, session] = await Promise.all([
        getProfileData(id),
        getSession(),
    ]);

    if (!profileData) notFound();

    return (
        <ProfileDashboard
            {...profileData}
            isOwner={session.id === profileData.user.id}
        />
    );
}
