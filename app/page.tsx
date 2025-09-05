import db from "@/lib/db";

export default async function Home() {
    // 데이터 검증 테스트
    const data = await db.user.findUnique({
        where: { name: "CAROL" },
        include: { PlayData: true },
    });

    const { name, PlayData } = data as any;
    const { play_count } = PlayData[0];

    return (
        <div className="flex flex-col items-center text-black">
            <h1 className="text-4xl">UserData</h1>
            <span className="text-lg">Player Name: {name}</span>
            <span className="text-lg">Play Count: {play_count}</span>
        </div>
    );
}
