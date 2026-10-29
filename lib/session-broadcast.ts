const CHANNEL = "noslog-session";

// 한 탭에서 로그아웃 · 탈퇴하면 같은 브라우저의 다른 탭이 라우터 캐시에 남은 이전 사용자 화면을 보이지 않게 한다
export function announceSessionEnded() {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(CHANNEL);
    channel.postMessage("ended");
    channel.close();
}

export function onSessionEnded(handler: () => void) {
    if (typeof BroadcastChannel === "undefined") return () => {};
    const channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = (event) => {
        if (event.data === "ended") handler();
    };
    return () => channel.close();
}
