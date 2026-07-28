import { createHmac, timingSafeEqual } from "node:crypto";

import { localizePath, type Locale } from "@/lib/i18n/routing";

interface SyncTokenPayload {
    userId: number;
    version: number;
}

const bookmarkletCopy = {
    ko: {
        title: "NosLog 데이터 동기화",
        preparing: "준비 중...",
        close: "닫기",
        wrongPage: "NOSTALGIA 페이지에서 실행해주세요.",
        goToBemani: "BEMANI 페이지로 이동",
        loadingSuffix: " 가져오는 중...",
        requestFailedSuffix: " 요청에 실패했습니다.",
        responseFailedSuffix: " 응답을 확인할 수 없습니다.",
        player: "플레이어 정보",
        recent: "최근 플레이",
        total: "전체 기록",
        sendingFull: "NosLog로 전체 기록을 전송하는 중...",
        sendingRecent: "Basic Pass 미가입: 최근 기록만 전송하는 중...",
        processFailed: "데이터 처리에 실패했습니다.",
        completed: "동기화가 완료됐습니다.",
        viewResult: "동기화 결과 보기",
        syncFailed: "동기화 중 오류가 발생했습니다.",
    },
    ja: {
        title: "NosLog データ同期",
        preparing: "準備中...",
        close: "閉じる",
        wrongPage: "NOSTALGIAページで実行してください。",
        goToBemani: "BEMANIページへ移動",
        loadingSuffix: "を取得中...",
        requestFailedSuffix: "の取得に失敗しました。",
        responseFailedSuffix: "の応答を確認できませんでした。",
        player: "プレーヤー情報",
        recent: "最近のプレー",
        total: "全記録",
        sendingFull: "NosLogへ全記録を送信中...",
        sendingRecent: "Basic Pass未加入：最近の記録のみ送信中...",
        processFailed: "データ処理に失敗しました。",
        completed: "同期が完了しました。",
        viewResult: "同期結果を見る",
        syncFailed: "同期中にエラーが発生しました。",
    },
    en: {
        title: "NosLog data sync",
        preparing: "Preparing...",
        close: "Close",
        wrongPage: "Run this bookmarklet on a NOSTALGIA page.",
        goToBemani: "Go to the BEMANI page",
        loadingSuffix: " is loading...",
        requestFailedSuffix: " request failed.",
        responseFailedSuffix: " response could not be verified.",
        player: "Player information",
        recent: "Recent plays",
        total: "Full records",
        sendingFull: "Sending all records to NosLog...",
        sendingRecent: "Basic Pass not active: sending recent records only...",
        processFailed: "The data could not be processed.",
        completed: "Sync completed.",
        viewResult: "View sync results",
        syncFailed: "An error occurred during sync.",
    },
} as const satisfies Record<Locale, Record<string, string>>;

function syncSecret() {
    const secret =
        process.env.BOOKMARKLET_SECRET ?? process.env.COOKIE_PASSWORD;

    if (!secret) {
        throw new Error("BOOKMARKLET_SECRET is not configured");
    }

    return secret;
}

function sign(value: string) {
    return createHmac("sha256", syncSecret()).update(value).digest("base64url");
}

export function createSyncToken(payload: SyncTokenPayload) {
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
        "base64url"
    );

    return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifySyncToken(token: string): SyncTokenPayload | null {
    const [encodedPayload, signature, ...rest] = token.split(".");
    if (!encodedPayload || !signature || rest.length > 0) return null;

    const expectedSignature = sign(encodedPayload);
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
        signatureBuffer.length !== expectedBuffer.length ||
        !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
        return null;
    }

    try {
        const payload = JSON.parse(
            Buffer.from(encodedPayload, "base64url").toString("utf8")
        ) as Partial<SyncTokenPayload>;

        if (
            !Number.isSafeInteger(payload.userId) ||
            !Number.isSafeInteger(payload.version) ||
            (payload.userId ?? 0) <= 0 ||
            (payload.version ?? -1) < 0
        ) {
            return null;
        }

        return payload as SyncTokenPayload;
    } catch {
        return null;
    }
}

export function createBookmarkletHref(
    appOrigin: string,
    token: string,
    protectionBypassSecret?: string,
    locale: Locale = "ko"
) {
    const receiveUrl = new URL("/api/receivePlayerData", `${appOrigin}/`);
    receiveUrl.searchParams.set("locale", locale);
    if (protectionBypassSecret) {
        receiveUrl.searchParams.set(
            "x-vercel-protection-bypass",
            protectionBypassSecret
        );
    }

    const copy = bookmarkletCopy[locale];
    const receiveUrlString = receiveUrl.toString();
    const resultUrl = new URL(
        localizePath("/bookmarklet", locale),
        `${appOrigin}/`
    ).toString();
    const nostalgiaUrl = "https://p.eagate.573.jp/";
    const code = `
        (async()=>{
            const copy=${JSON.stringify(copy)};
            const overlayId="noslog-sync-overlay";
            if(document.getElementById(overlayId))return;

            const overlay=document.createElement("div");
            overlay.id=overlayId;
            Object.assign(overlay.style,{
                position:"fixed",top:"16px",right:"16px",zIndex:"2147483647",
                width:"280px",padding:"16px",boxSizing:"border-box",border:"1px solid #2a2a35",
                borderRadius:"8px",background:"#121218",color:"#f2f2f5",
                font:"14px system-ui,sans-serif",boxShadow:"0 8px 24px rgba(0,0,0,.35)"
            });
            overlay.innerHTML='<strong id="noslog-sync-title" style="display:block;margin-bottom:8px"></strong><span id="noslog-sync-status" style="color:#a0a0aa"></span>';
            document.body.appendChild(overlay);

            overlay.querySelector("#noslog-sync-title").textContent=copy.title;
            const status=overlay.querySelector("#noslog-sync-status");
            status.textContent=copy.preparing;
            const setStatus=(message,color="#a0a0aa",nowrap=false)=>{
                status.textContent=message;
                status.style.color=color;
                status.style.whiteSpace=nowrap?"nowrap":"normal";
            };
            const addLink=(label,url)=>{
                const address=document.createElement("div");
                address.textContent=url;
                Object.assign(address.style,{marginTop:"8px",color:"#a0a0aa",fontSize:"12px",wordBreak:"break-all"});
                overlay.appendChild(address);

                const link=document.createElement("a");
                link.textContent=label;
                link.href=url;
                link.target="_blank";
                link.rel="noopener noreferrer";
                Object.assign(link.style,{display:"inline-block",marginTop:"12px",padding:"7px 10px",borderRadius:"6px",background:"#f2f2f5",color:"#0b0b10",fontWeight:"700",textDecoration:"none"});
                overlay.appendChild(link);
            };
            const addCloseButton=()=>{
                const close=document.createElement("button");
                close.textContent=copy.close;
                Object.assign(close.style,{display:"block",marginTop:"12px",padding:"6px 10px",border:"1px solid #2a2a35",borderRadius:"6px",background:"#1a1a22",color:"#f2f2f5",cursor:"pointer"});
                close.onclick=()=>overlay.remove();
                overlay.appendChild(close);
            };

            if(location.hostname!=="p.eagate.573.jp"){
                setStatus(copy.wrongPage,"#ef4444");
                addLink(copy.goToBemani,${JSON.stringify(nostalgiaUrl)});
                addCloseButton();
                return;
            }

            try{
                const endpoint="https://p.eagate.573.jp/game/nostalgia/op3/json/pdata_getdata.html";
                const load=async(service,label,optional=false)=>{
                    setStatus(label+copy.loadingSuffix);
                    const response=await fetch(endpoint+"?service_kind="+service+"&pdata_kind="+service,{credentials:"include"});
                    if(!response.ok){
                        if(optional&&response.status===403)return null;
                        throw new Error(label+copy.requestFailedSuffix);
                    }
                    const data=await response.json();
                    if(data.status!==0){
                        if(optional)return null;
                        throw new Error(label+copy.responseFailedSuffix);
                    }
                    return data;
                };

                const playerData=await load("player_info",copy.player);
                const recentData=await load("play_history",copy.recent);
                const totalData=await load("music_data",copy.total,true);
                setStatus(totalData?copy.sendingFull:copy.sendingRecent);

                const response=await fetch(${JSON.stringify(receiveUrlString)}, {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({token:${JSON.stringify(token)},playerData,recentData,totalData})
                });
                const result=await response.json().catch(()=>({}));
                if(!response.ok)throw new Error(result.message||copy.processFailed);

                setStatus(result.message||copy.completed,"#22c55e",true);
                addLink(copy.viewResult,${JSON.stringify(resultUrl)});
                addCloseButton();
            }catch(error){
                setStatus(error instanceof Error?error.message:copy.syncFailed,"#ef4444");
                addCloseButton();
            }
        })();
    `
        .replace(/\s+/g, " ")
        .trim();

    return `javascript:${code}`;
}
