import { createHmac, timingSafeEqual } from "node:crypto";

import { serverEnv } from "@/lib/env/server";
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
    return serverEnv.BOOKMARKLET_SECRET;
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
    const fontUrl = new URL(
        "/fonts/pretendard-jp/1.3.9/PretendardJPVariable.woff2",
        appOrigin
    ).toString();
    const code = `
        (async()=>{
            const copy=${JSON.stringify(copy)};
            const overlayId="noslog-sync-overlay";
            if(document.getElementById(overlayId))return;

            const overlay=document.createElement("div");
            overlay.id=overlayId;
            Object.assign(overlay.style,{
                position:"fixed",top:"16px",right:"16px",zIndex:"2147483647",
                width:"334px",maxWidth:"calc(100vw - 32px)",padding:"24px",boxSizing:"border-box",border:"1px solid #444444",
                borderRadius:"10px",background:"#222222",color:"#DBDBDB",
                font:'14px/20px "NosLog Pretendard JP","Pretendard JP Variable","Pretendard JP",Pretendard,system-ui,sans-serif',boxShadow:"0 8px 24px rgba(0,0,0,.4)",
                display:"flex",flexDirection:"column",gap:"16px",maxHeight:"calc(100dvh - 32px)",overflowY:"auto"
            });
            overlay.innerHTML='<style>#noslog-sync-overlay *{box-sizing:border-box}#noslog-sync-overlay a:focus-visible,#noslog-sync-overlay button:focus-visible{outline:1px solid #FFFFFF;outline-offset:-1px}@keyframes noslog-sync-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){#noslog-sync-overlay #noslog-sync-marker{animation:none!important}}</style><strong id="noslog-sync-title" style="font-size:16px;line-height:24px;font-weight:600"></strong><div id="noslog-sync-status-row" role="status" aria-live="polite" style="display:flex;align-items:flex-start;gap:8px;padding:12px;border-radius:4px"><span aria-hidden="true" style="display:flex;align-items:center;justify-content:center;width:20px;height:20px;flex-shrink:0"><span id="noslog-sync-marker"></span></span><span id="noslog-sync-status" style="min-width:0;overflow-wrap:anywhere"></span></div><div id="noslog-sync-track" aria-hidden="true" style="height:2px;background:#444444"><div id="noslog-sync-progress" style="height:100%;width:0;background:#DBDBDB"></div></div><div id="noslog-sync-actions" style="display:none;gap:8px;width:100%"></div>';
            document.body.appendChild(overlay);

            overlay.querySelector("#noslog-sync-title").textContent=copy.title;
            const status=overlay.querySelector("#noslog-sync-status");
            const statusRow=overlay.querySelector("#noslog-sync-status-row");
            const marker=overlay.querySelector("#noslog-sync-marker");
            const track=overlay.querySelector("#noslog-sync-track");
            const progress=overlay.querySelector("#noslog-sync-progress");
            const actions=overlay.querySelector("#noslog-sync-actions");
            const setStatus=(message,state="busy")=>{
                status.textContent=message;
                overlay.dataset.state=state;
                statusRow.style.background=state==="success"?"#28311B":state==="failure"?"#42221F":"transparent";
                Object.assign(marker.style,{width:state==="busy"?"16px":"8px",height:state==="busy"?"16px":"8px",borderRadius:"50%",border:state==="busy"?"2px solid #444444":"none",borderTopColor:state==="busy"?"#AFAFAF":"transparent",background:state==="success"?"#82B536":state==="failure"?"#F15B50":"transparent",animation:state==="busy"?"noslog-sync-spin 1s linear infinite":"none"});
                track.style.display=state==="busy"?"block":"none";
            };
            setStatus(copy.preparing);
            const buttonStyle={display:"flex",alignItems:"center",justifyContent:"center",minHeight:"40px",padding:"8px 16px",borderRadius:"4px",font:"inherit",fontWeight:"500",textDecoration:"none",flex:"1 1 0",minWidth:"0",textAlign:"center",cursor:"pointer"};
            const fitActions=()=>{
                if(!actions.children.length)return;
                actions.style.display="flex";
                actions.style.flexDirection="row";
                for(const button of actions.children){
                    if(button.scrollWidth>button.clientWidth||button.getBoundingClientRect().height>42){actions.style.flexDirection="column";break;}
                }
            };
            const resizeObserver=new ResizeObserver(fitActions);
            resizeObserver.observe(overlay);
            const font=new FontFace("NosLog Pretendard JP",${JSON.stringify(`url("${fontUrl}")`)},{weight:"45 920"});
            font.load().then(loaded=>{if(overlay.isConnected){document.fonts.add(loaded);fitActions();}}).catch(()=>{});
            const addLink=(label,url)=>{
                const link=document.createElement("a");
                link.textContent=label;
                link.href=url;
                link.target="_blank";
                link.rel="noopener noreferrer";
                Object.assign(link.style,buttonStyle,{background:"#DBDBDB",color:"#111111",border:"1px solid transparent"});
                actions.appendChild(link);
            };
            const addCloseButton=()=>{
                const close=document.createElement("button");
                close.textContent=copy.close;
                close.type="button";
                Object.assign(close.style,buttonStyle,{border:"1px solid #8A8A8A",background:"transparent",color:"#DBDBDB"});
                close.onclick=()=>{resizeObserver.disconnect();overlay.remove();};
                actions.appendChild(close);
                fitActions();
            };

            if(location.hostname!=="p.eagate.573.jp"){
                setStatus(copy.wrongPage,"failure");
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
                progress.style.width="25%";
                const recentData=await load("play_history",copy.recent);
                progress.style.width="50%";
                const totalData=await load("music_data",copy.total,true);
                progress.style.width="75%";
                setStatus(totalData?copy.sendingFull:copy.sendingRecent);

                const response=await fetch(${JSON.stringify(receiveUrlString)}, {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({token:${JSON.stringify(token)},playerData,recentData,totalData})
                });
                const result=await response.json().catch(()=>({}));
                if(!response.ok)throw new Error(result.message||copy.processFailed);

                setStatus(result.message||copy.completed,"success");
                addLink(copy.viewResult,${JSON.stringify(resultUrl)});
                addCloseButton();
            }catch(error){
                setStatus(error instanceof Error?error.message:copy.syncFailed,"failure");
                addCloseButton();
            }
        })();
    `
        .replace(/\s+/g, " ")
        .trim();

    return `javascript:${encodeURIComponent(code)}`;
}
