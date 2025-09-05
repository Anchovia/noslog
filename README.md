## NosLog

# p.eagate.573.jp 콘솔 입력 데이터 요청 코드 !!

async function getPlayerData() {
try {
// 플레이어 기본 정보
let playerRes = await fetch(
"https://p.eagate.573.jp/game/nostalgia/op3/json/pdata_getdata.html?service_kind=player_info&pdata_kind=player_info",
{ credentials: "include" }
);
let playerData = await playerRes.json();

    // 최근 플레이 기록
    let recentRes = await fetch(
      "https://p.eagate.573.jp/game/nostalgia/op3/json/pdata_getdata.html?service_kind=play_history&pdata_kind=play_history",
      { credentials: "include" }
    );
    let recentData = await recentRes.json();

    // 서버로 데이터 전송
    await fetch("http://localhost:3000/api/receivePlayerData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerData, recentData }),
    });

    console.log("데이터 전송 완료");

} catch (err) {
console.error("데이터 전송 중 오류 발생:", err);
}
}

getPlayerData();
