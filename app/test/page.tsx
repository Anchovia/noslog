import db from "@/lib/db";

export default async function Test() {
    // 데이터 검증 테스트
    const { id, name, play_count }: any = await db.user.findUnique({
        where: { name: "CAROL" },
        select: { id: true, name: true, play_count: true },
    });

    const history = await db.playHistory.findMany({
        where: { user_id: id },
    });

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <section>
                <h1 className="text-4xl">Test Page</h1>
                <p className="mt-4 text-2xl">Name: {name}</p>
                <p className="mt-2 text-2xl">Play Count: {play_count}</p>
            </section>
            <section>
                {history.map((data, index) => (
                    <div
                        className="p-4 mb-4 bg-neutral-300 flex flex-col items-center justify-center"
                        key={index}
                    >
                        <p>{data.artist}</p>
                        <p>{data.title}</p>
                        <p>{data.score}</p>
                        <p>{data.difficulty}</p>
                        <p>{data.level}</p>
                        <p>{data.max_combo}</p>
                        <p>{data.play_time}</p>
                        <p>{data.rank}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}
