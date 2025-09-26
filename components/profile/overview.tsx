import { formatToComma } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface OverViewProps {
    userData: {
        discord_name: string | null;
        discord_tag: string | null;
        id: number;
        username: string | null;
        avatar: string | null;
        country: string;
        rank_basic: number | null;
        rank_recital: number | null;
    };
    isRecital: boolean;
    sessionId: number | undefined;
}

export default function OverView({
    userData,
    isRecital,
    sessionId,
}: OverViewProps) {
    return (
        <section className="flex flex-col gap-4">
            {/* 프로필, 설정 버튼*/}
            <article className="flex bg-dark-quinary rounded-t-xl p-4 gap-4">
                <div className="size-24 rounded-3xl relative overflow-hidden">
                    {userData.avatar ? (
                        <Image src={userData.avatar} alt="avatar" fill />
                    ) : (
                        <div className="bg-neutral-500" />
                    )}
                </div>
                <div className="flex flex-col justify-center gap-1 flex-1">
                    <div className="flex gap-1 items-center">
                        <div className="relative w-8 h-6 rounded-full  overflow-hidden">
                            <Image
                                src={`/flag/${userData.country}.svg`}
                                alt={userData.country}
                                fill
                            />
                        </div>
                        <span className="text-primary">
                            {userData.username ? userData.username : "-"}
                        </span>
                    </div>
                    {isRecital ? (
                        <span className="text-quaternary">{`NosLog #${formatToComma(
                            userData.rank_recital
                        )}`}</span>
                    ) : (
                        <span className="text-quaternary">{`NosLog #${formatToComma(
                            userData.rank_basic
                        )}`}</span>
                    )}
                </div>
                <div className="flex flex-col justify-between items-end">
                    <Link href={`/profile/settings`}>
                        <Image
                            src="/icon/gear.png"
                            width={28}
                            height={28}
                            alt="setting"
                        />
                    </Link>
                    {sessionId && (
                        <button>
                            <Image
                                src="/icon/logout.png"
                                width={28}
                                height={28}
                                alt="logout"
                            />
                        </button>
                    )}
                </div>
            </article>
            {/* 소셜(디스코드) */}
            <article className="-mt-4 flex flex-col text-sm gap-2 bg-dark-tertiary p-4">
                <h2 className="text-secondary">소셜</h2>
                <div className="border border-neutral-700" />
                <div className="flex gap-2">
                    <Image
                        src={"/icon/discord.png"}
                        alt={"discord"}
                        width={30}
                        height={20}
                    />
                    <span className="flex items-center gap-1 *:flex *:items-center">
                        <span className="text-quaternary">
                            {userData.discord_name
                                ? userData.discord_name
                                : "-"}
                        </span>
                        <span className="text-quinary">
                            #{userData.discord_tag ? userData.discord_tag : "-"}
                        </span>
                    </span>
                </div>
            </article>
            <article className="-mt-4 flex gap-3 bg-dark-secondary p-4 rounded-b-xl text-quinary">
                <span>
                    <span className="font-semibold ">2025년 09월</span> 시작
                </span>
                <span>
                    <span className="font-semibold ">7일전</span> 마지막 플레이
                </span>
            </article>
        </section>
    );
}
