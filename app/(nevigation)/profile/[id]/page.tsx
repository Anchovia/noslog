import ProfileDashboard from "@/components/profile/profile";
import { createPageMetadata } from "@/lib/metadata/site";
import getSession from "@/lib/session";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCachedProfileData, getProfileOwnerAnalytics } from "./data";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id: rawId } = await params;
    const id = Number(rawId);
    const profile = Number.isInteger(id)
        ? await getCachedProfileData(id)
        : null;

    return createPageMetadata({
        title: profile?.user.username
            ? `${profile.user.username} 프로필`
            : "유저 프로필",
        description: "NosLog 유저의 노스텔지어 플레이 기록과 성과입니다.",
        path: Number.isInteger(id) ? `/profile/${id}` : "/profile",
        noIndex: true,
    });
}

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (!Number.isInteger(id) || id < 1) notFound();

    const [profileData, session] = await Promise.all([
        getCachedProfileData(id),
        getSession(),
    ]);

    if (!profileData) notFound();

    const isOwner = session.id === profileData.user.id;
    const ownerAnalytics = isOwner
        ? await getProfileOwnerAnalytics(profileData.user.id)
        : null;

    return (
        <ProfileDashboard
            {...profileData}
            isOwner={isOwner}
            ownerAnalytics={ownerAnalytics}
        />
    );
}
