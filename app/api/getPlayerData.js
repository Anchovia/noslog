async function getPlayerData() {
    try {
        console.info("Bemani 데이터 전송 시작...");

        console.info("플레이어 데이터 가져오는 중...");
        // 플레이어 기본 정보
        const playerRes = await fetch(
            "https://p.eagate.573.jp/game/nostalgia/op3/json/pdata_getdata.html?service_kind=player_info&pdata_kind=player_info",
            { credentials: "include" }
        );
        const playerData = await playerRes.json();
        console.info("플레이어 데이터 가져오기 성공");

        console.info("최근 플레이 기록 가져오는 중...");
        // 최근 플레이 기록
        const recentRes = await fetch(
            "https://p.eagate.573.jp/game/nostalgia/op3/json/pdata_getdata.html?service_kind=play_history&pdata_kind=play_history",
            { credentials: "include" }
        );
        const recentData = await recentRes.json();
        console.info("최근 플레이 데이터 가져오기 성공");

        console.info("전체 플레이 기록 가져오는 중...");
        // 전체 플레이 기록
        const totalRes = await fetch(
            "https://p.eagate.573.jp/game/nostalgia/op3/json/pdata_getdata.html?service_kind=music_data&pdata_kind=music_data",
            {
                credentials: "include",
            }
        );
        const totalData = await totalRes.json();
        console.info("전체 플레이 데이터 가져오기 성공");

        console.info("NosLog 서버로 전송 시작...");
        // 서버로 데이터 전송
        await fetch("http://localhost:3000/api/receivePlayerData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerData, recentData, totalData }),
        });
        console.info("NosLog 서버로 데이터 전송 완료");
    } catch {
        console.error("데이터 전송 중 오류 발생");
    }
}

getPlayerData();
