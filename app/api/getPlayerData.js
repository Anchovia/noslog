async function getPlayerData() {
    try {
        // 플레이어 기본 정보
        const playerRes = await fetch(
            "https://p.eagate.573.jp/game/nostalgia/op3/json/pdata_getdata.html?service_kind=player_info&pdata_kind=player_info",
            { credentials: "include" }
        );
        const playerData = await playerRes.json();

        // 최근 플레이 기록
        const recentRes = await fetch(
            "https://p.eagate.573.jp/game/nostalgia/op3/json/pdata_getdata.html?service_kind=play_history&pdata_kind=play_history",
            { credentials: "include" }
        );
        const recentData = await recentRes.json();

        // 전체 플레이 기록
        const totalRes = await fetch(
            "https://p.eagate.573.jp/game/nostalgia/op3/json/pdata_getdata.html?service_kind=music_data&pdata_kind=music_data",
            {
                credentials: "include",
            }
        );
        const totalData = await totalRes.json();

        // 서버로 데이터 전송
        await fetch("http://localhost:3000/api/receivePlayerData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerData, recentData, totalData }),
        });

        console.log("데이터 전송 완료");
    } catch (err) {
        console.log("데이터 전송 중 오류 발생");
        console.log("error state:", err);
    }
}

getPlayerData();
