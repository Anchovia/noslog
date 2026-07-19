import { redirect } from "next/navigation";

import ProfileSettingCard from "@/components/profile/profileSettingCard";
import db from "@/lib/db";
import getSession from "@/lib/session";

const discordErrorMessages: Record<string, string> = {
    invalid_state: "Discord 연결 요청이 만료되었습니다. 다시 시도해주세요.",
    oauth_config: "Discord 로그인 설정을 확인해주세요.",
    token_exchange: "Discord 인증 처리에 실패했습니다.",
    profile_fetch: "Discord 사용자 정보를 가져오지 못했습니다.",
    already_linked: "이미 다른 NosLog 계정에 연결된 Discord 계정입니다.",
    user_missing: "연결할 NosLog 계정을 찾지 못했습니다.",
    account_update: "Discord 계정 연결에 실패했습니다.",
};

export default async function ProfileSettingsPage({
    searchParams,
}: {
    searchParams: Promise<{ discordError?: string }>;
}) {
    const session = await getSession();
    if (!session.id) redirect("/login");
    const { discordError } = await searchParams;

    const user = await db.user.findUnique({
        where: { id: session.id },
        select: {
            id: true,
            avatar: true,
            username: true,
            country: true,
            discord_id: true,
            discord_name: true,
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

            {discordError ? (
                <p className="border-danger/40 bg-danger/10 text-danger rounded-card border px-3 py-2 text-sm">
                    {discordErrorMessages[discordError] ??
                        "Discord 계정 연결 중 오류가 발생했습니다."}
                </p>
            ) : null}

            <ProfileSettingCard user={user} />
        </div>
    );
}
