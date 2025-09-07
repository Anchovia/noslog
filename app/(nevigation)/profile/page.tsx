import { getUser } from "@/lib/user";
import { formatToComma, formatToGrade } from "@/lib/utils";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Profile() {
    // 쿠키 확인해 유저 데이터 가져오기
    const user = await getUser();

    // todo: 유저 닉네임 미설정시 유저 닉네임 설정 무조건 필요
    // todo2: BIO 편집 및 저장 기능 개발 필요
    // todo3: basic - recital 탭 개발 필요(use client)
    return (
        <>
            {user?.username ? (
                <div className="px-8 py-4 flex flex-col gap-4">
                    <section className="flex flex-col gap-4">
                        <article className="flex items-center">
                            <h1 className="text-xl text-neutral-400 font-light">
                                <span className="text-white font-normal">
                                    {user.username}
                                </span>
                                의 프로필
                            </h1>
                        </article>
                        <article className="flex gap-4 *:px-5 *:py-1 *:bg-neutral-700 *:rounded-2xl">
                            <button>Basic</button>
                            <button>Recital</button>
                        </article>
                        <article className="flex bg-neutral-700 rounded-t-xl p-4 gap-4">
                            <div className="size-24 rounded-3xl relative overflow-hidden">
                                {user.avatar ? (
                                    <Image
                                        src={user.avatar!}
                                        alt={user.username}
                                        fill
                                    />
                                ) : (
                                    <div className="bg-neutral-500" />
                                )}
                            </div>
                            <div className="flex flex-col justify-center gap-1">
                                <div className="flex gap-1 items-center">
                                    <div className="relative w-8 h-6 rounded-full overflow-hidden">
                                        <Image
                                            src={`/flag/${user.country}.svg`}
                                            alt={user.country!}
                                            fill
                                        />
                                    </div>
                                    <span className="font-medium text-xl">
                                        {user.username}
                                    </span>
                                </div>
                                <span className="text-sm text-neutral-300">{`NosLog #${formatToComma(
                                    user.rank_basic
                                )}`}</span>
                            </div>
                        </article>
                        <article className="-mt-4 flex flex-col gap-2 bg-neutral-800 p-4 rounded-b-xl">
                            <h2 className="text-xl font-medium">ME</h2>
                            <hr className="border border-neutral-700" />
                            <p>hello, everyone</p>
                            <p>I'm a NosLog developer.</p>
                            <p>Nice to meet you!</p>
                        </article>
                    </section>
                    <section className="flex flex-col">
                        <article className="p-4 text-center bg-neutral-800 text-md rounded-t-xl">
                            통계
                        </article>
                        <article className="flex p-4 justify-between *:flex *:flex-col bg-neutral-900 *:text-center">
                            <div>
                                <span>세계 순위</span>
                                <span className="font-semibold">{`#${formatToComma(
                                    user.rank_basic
                                )}`}</span>
                            </div>
                            <div>
                                <span>국가 순위</span>
                                <span className="font-semibold">{`#${formatToComma(
                                    user.rank_basic_country
                                )}`}</span>
                            </div>
                            <div>
                                <span>Grd.</span>
                                <span className="font-semibold">
                                    {formatToGrade(user.grade_basic)}
                                </span>
                            </div>
                        </article>
                        <article className="flex flex-col p-4 bg-neutral-900/50 rounded-b-xl gap-4">
                            <span className="p-4 bg-neutral-950 rounded-xl">
                                플레이 횟수{" "}
                                <span className="font-semibold">
                                    {formatToComma(user.play_count)}
                                </span>
                            </span>
                            <span className="p-4 flex bg-neutral-950 rounded-xl justify-between text-sm">
                                <div className="flex gap-2 items-center">
                                    <div className="flex size-6 rounded-full bg-neutral-500 items-center justify-center">
                                        P
                                    </div>
                                    <span>{formatToComma(user.score_p)}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div className="flex size-6 rounded-full bg-neutral-500 items-center justify-center">
                                        S
                                    </div>
                                    <span>{formatToComma(user.score_s)}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div className="flex size-6 rounded-full bg-neutral-500 items-center justify-center">
                                        A+
                                    </div>
                                    <span>{formatToComma(user.score_a2)}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div className="flex size-6 rounded-full bg-neutral-500 items-center justify-center">
                                        A
                                    </div>
                                    <span>{formatToComma(user.score_a)}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div className="flex size-6 rounded-full bg-neutral-500 items-center justify-center">
                                        B+
                                    </div>
                                    <span>{formatToComma(user.score_b2)}</span>
                                </div>
                            </span>
                        </article>
                    </section>
                </div>
            ) : (
                redirect("/profile/settings")
            )}
        </>
    );
}
