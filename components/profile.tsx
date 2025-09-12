import { formatToComma, formatToGrade } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ProfileProps {
    discord_name: string | null;
    discord_tag: string | null;
    isRecital: boolean;
    id: number;
    username: string;
    avatar: string | null;
    country: string;
    rank: number | null;
    rank_country: number | null;
    grade: number | null;
    play_count: number | null;
    score_p: number | null;
    score_s: number | null;
    score_a2: number | null;
    score_a: number | null;
    score_b2: number | null;
}

export default async function Profile({
    discord_name,
    discord_tag,
    isRecital,
    id,
    username,
    avatar,
    country,
    rank,
    rank_country,
    grade,
    play_count,
    score_p,
    score_s,
    score_a2,
    score_a,
    score_b2,
}: ProfileProps) {
    return (
        <div className="px-8 py-4 max-w-screen-sm mx-auto flex flex-col gap-4">
            <section className="flex flex-col gap-4">
                {/* 타이틀, 리사이틀 버튼 */}
                <article className="flex items-center justify-between">
                    <h1 className="text-xl text-white-secondary font-light">
                        <span className="text-white font-normal">
                            {username}
                        </span>
                        의 프로필
                    </h1>
                    {isRecital ? (
                        <Link
                            href={`/profile/${id}/basic`}
                            className="flex gap-2"
                        >
                            <span>Recital</span>
                            <div className="flex w-10 h-6 rounded-full bg-blue-500 items-center justify-end px-1">
                                <div className="size-4 bg-white-secondary rounded-full" />
                            </div>
                        </Link>
                    ) : (
                        <Link
                            href={`/profile/${id}/recital`}
                            className="flex gap-2"
                        >
                            <span>Recital</span>
                            <div className="flex w-10 h-6 rounded-full bg-dark-tertiary items-center justify-start px-1">
                                <div className="size-4 bg-white-secondary rounded-full" />
                            </div>
                        </Link>
                    )}
                </article>
                {/* 프로필, 설정 버튼*/}
                <article className="flex bg-dark-tertiary rounded-t-xl p-4 gap-4">
                    <div className="size-24 rounded-3xl relative overflow-hidden">
                        {avatar ? (
                            <Image src={avatar} alt={username} fill />
                        ) : (
                            <div className="bg-neutral-500" />
                        )}
                    </div>
                    <div className="flex flex-col justify-center gap-1 flex-1">
                        <div className="flex gap-1 items-center">
                            <div className="relative w-8 h-6 rounded-full overflow-hidden">
                                <Image
                                    src={`/flag/${country}.svg`}
                                    alt={country}
                                    fill
                                />
                            </div>
                            <span className="font-medium text-xl">
                                {username}
                            </span>
                        </div>
                        <span className="text-sm text-neutral-300">{`NosLog #${formatToComma(
                            rank
                        )}`}</span>
                    </div>
                    <div>
                        <Link href={`/profile/${id}/settings`}>
                            <Image
                                className="fle"
                                src="/icon/gear.png"
                                width={28}
                                height={28}
                                alt="setting"
                            />
                        </Link>
                    </div>
                </article>
                {/* 소셜(디스코드) */}
                <article className="-mt-4 flex flex-col text-sm gap-2 bg-dark-secondary p-4 rounded-b-xl">
                    <h2 className="text-xl font-medium">소셜</h2>
                    <div className="border border-neutral-700" />
                    <div className="flex gap-2">
                        <Image
                            src={"/icon/discord.png"}
                            alt={"discord"}
                            width={24}
                            height={20}
                        />
                        <span>
                            {discord_name} #{discord_tag}
                        </span>
                    </div>
                </article>
            </section>
            {/* 통계 */}
            <section className="flex flex-col">
                <article className="p-4 text-center bg-dark-tertiary text-md rounded-t-xl">
                    통계
                </article>
                <article className="flex p-4 justify-between *:flex *:flex-col bg-dark-secondary *:text-center">
                    <div className="w-1/3">
                        <span>세계 순위</span>
                        <span className="font-semibold">{`#${formatToComma(
                            rank
                        )}`}</span>
                    </div>
                    <div className="w-1/3">
                        <span>국가 순위</span>
                        <span className="font-semibold">{`#${formatToComma(
                            rank_country
                        )}`}</span>
                    </div>
                    <div className="w-1/3">
                        <span>Grd</span>
                        <span className="font-semibold">
                            {formatToGrade(grade)}
                        </span>
                    </div>
                </article>
                <article className="flex flex-col p-4 bg-dark-secondary/50 rounded-b-xl gap-4">
                    <span className="p-4 bg-dark-primary rounded-xl">
                        플레이 횟수{" "}
                        <span className="font-semibold">
                            {formatToComma(play_count)}
                        </span>
                    </span>
                    <span className="p-4 flex bg-dark-primary rounded-xl justify-between text-sm">
                        <div className="flex gap-2 items-center">
                            <div className="flex size-6 rounded-full bg-neutral-500 items-center justify-center">
                                P
                            </div>
                            <span>{formatToComma(score_p)}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="flex size-6 rounded-full bg-neutral-500 items-center justify-center">
                                S
                            </div>
                            <span>{formatToComma(score_s)}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="flex size-6 rounded-full bg-neutral-500 items-center justify-center">
                                A+
                            </div>
                            <span>{formatToComma(score_a2)}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="flex size-6 rounded-full bg-neutral-500 items-center justify-center">
                                A
                            </div>
                            <span>{formatToComma(score_a)}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="flex size-6 rounded-full bg-neutral-500 items-center justify-center">
                                B+
                            </div>
                            <span>{formatToComma(score_b2)}</span>
                        </div>
                    </span>
                </article>
            </section>
        </div>
    );
}
