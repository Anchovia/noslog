export default function MusicRankTable() {
    const datas = [
        {
            rank: 1,
            score: 1000000,
            nickname: "Player1",
            combo: 500,
            grade: "A",
            date: "2023-01-01",
        },
        {
            rank: 2,
            score: 950000,
            nickname: "Player2",
            combo: 480,
            grade: "B",
            date: "2023-01-02",
        },
        {
            rank: 3,
            score: 900000,
            nickname: "Player3",
            combo: 450,
            grade: "C",
            date: "2023-01-03",
        },
    ];
    return (
        <section className="flex flex-col items-center gap-6">
            <h1 className="text-2xl">랭킹</h1>
            <table className="w-full">
                <thead>
                    <tr className="*:text-center">
                        <td>순위</td>
                        <td>랭크</td>
                        <td>점수</td>
                        <td>닉네임</td>
                        <td>콤보</td>
                        <td>그레이드</td>
                        <td className="text-center">날짜</td>
                    </tr>
                </thead>
                <tbody>
                    {datas.map((data, index) => (
                        <tr key={index} className="*:text-center">
                            <td>{index + 1}</td>
                            <td>{data.rank}</td>
                            <td>{data.score.toLocaleString()}</td>
                            <td>{data.nickname}</td>
                            <td>{data.combo.toLocaleString()}</td>
                            <td>{data.grade}</td>
                            <td>{data.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
