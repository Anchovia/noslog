import Image from "next/image";

export default function MusicRankTable({
    basicPlayDatas,
    recitalPlayDatas,
    isRecital,
}: any) {
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
                    {isRecital
                        ? recitalPlayDatas &&
                          recitalPlayDatas.map((data: any, index: number) => (
                              <tr key={index} className="*:text-center">
                                  <td>{index + 1}</td>
                                  <td>{data.rank}</td>
                                  <td>{data.score.toLocaleString()}</td>
                                  <td>{data.user.username}</td>
                                  <td>{data.max_combo.toLocaleString()}</td>
                                  <td>{data.grade_recital}</td>
                                  <td>{data.besttime}</td>
                              </tr>
                          ))
                        : basicPlayDatas &&
                          basicPlayDatas.map(
                              (data: any, index: number) =>
                                  data.rank.toLowerCase() !== "-" && (
                                      <tr key={index} className="*:text-center">
                                          <td>{index + 1}</td>
                                          <td className="relative size-6">
                                              <Image
                                                  fill
                                                  src={`https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_${data.rank.toLowerCase()}.png`}
                                                  alt={data.rank.toLowerCase()}
                                              />
                                          </td>
                                          <td>{data.score.toLocaleString()}</td>
                                          <td>{data.user.username}</td>
                                          <td>
                                              {data.max_combo.toLocaleString()}
                                          </td>
                                          <td>{data.grade_basic}</td>
                                          <td>{data.besttime}</td>
                                      </tr>
                                  )
                          )}
                </tbody>
            </table>
        </section>
    );
}
