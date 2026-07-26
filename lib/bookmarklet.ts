import { createHmac, timingSafeEqual } from "node:crypto";

interface SyncTokenPayload {
    userId: number;
    version: number;
}

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
    protectionBypassSecret?: string
) {
    const receiveUrl = new URL("/api/receivePlayerData", `${appOrigin}/`);
    if (protectionBypassSecret) {
        receiveUrl.searchParams.set(
            "x-vercel-protection-bypass",
            protectionBypassSecret
        );
    }

    const receiveUrlString = receiveUrl.toString();
    const nostalgiaUrl = "https://p.eagate.573.jp/";
    const code = `
        (async()=>{
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
            overlay.innerHTML='<strong style="display:block;margin-bottom:8px">NosLog 데이터 동기화</strong><span id="noslog-sync-status" style="color:#a0a0aa">준비 중...</span>';
            document.body.appendChild(overlay);

            const status=overlay.querySelector("#noslog-sync-status");
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
                close.textContent="닫기";
                Object.assign(close.style,{marginTop:"12px",marginLeft:"8px",padding:"6px 10px",border:"1px solid #2a2a35",borderRadius:"6px",background:"#1a1a22",color:"#f2f2f5",cursor:"pointer"});
                close.onclick=()=>overlay.remove();
                overlay.appendChild(close);
            };

            if(location.hostname!=="p.eagate.573.jp"){
                setStatus("NOSTALGIA 페이지에서 실행해주세요.","#ef4444");
                addLink("Bemani 페이지로 이동",${JSON.stringify(nostalgiaUrl)});
                addCloseButton();
                return;
            }

            try{
                const endpoint="https://p.eagate.573.jp/game/nostalgia/op3/json/pdata_getdata.html";
                const load=async(service,label,optional=false)=>{
                    setStatus(label+" 가져오는 중...");
                    const response=await fetch(endpoint+"?service_kind="+service+"&pdata_kind="+service,{credentials:"include"});
                    if(!response.ok){
                        if(optional&&response.status===403)return null;
                        throw new Error(label+" 요청에 실패했습니다.");
                    }
                    const data=await response.json();
                    if(data.status!==0){
                        if(optional)return null;
                        throw new Error(label+" 응답을 확인할 수 없습니다.");
                    }
                    return data;
                };

                const playerData=await load("player_info","플레이어 정보");
                const recentData=await load("play_history","최근 플레이");
                const totalData=await load("music_data","전체 기록",true);
                setStatus(totalData?"NosLog로 전체 기록을 전송하는 중...":"Basic Pass 미가입: 최근 기록만 전송하는 중...");

                const response=await fetch(${JSON.stringify(receiveUrlString)}, {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({token:${JSON.stringify(token)},playerData,recentData,totalData})
                });
                const result=await response.json().catch(()=>({}));
                if(!response.ok)throw new Error(result.message||"데이터 처리에 실패했습니다.");

                setStatus(result.message||"동기화가 완료됐습니다.","#22c55e",true);
                addLink("동기화 결과 보기",${JSON.stringify(`${appOrigin}/bookmarklet`)});
                addCloseButton();
            }catch(error){
                setStatus(error instanceof Error?error.message:"동기화 중 오류가 발생했습니다.","#ef4444");
                addCloseButton();
            }
        })();
    `
        .replace(/\s+/g, " ")
        .trim();

    return `javascript:${code}`;
}
