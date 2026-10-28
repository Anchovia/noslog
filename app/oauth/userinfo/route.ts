import { bearerError, oauthJson } from "@/features/partner/server/oauth-http";
import {
    authenticateBearer,
    getPartnerUserName,
} from "@/features/partner/server/oauth-service";

export const dynamic = "force-dynamic";

/** 파트너가 받는 기본 프로필 — sub(클라이언트마다 다른 고정 값) · 닉네임. Discord · 공식 이름은 내보내지 않는다 */
async function userinfo(request: Request) {
    const auth = await authenticateBearer(
        request.headers.get("authorization"),
        "profile"
    );
    if (!auth.ok) return bearerError(auth.error);
    const name = await getPartnerUserName(auth.userId);
    return oauthJson({
        sub: auth.subject,
        ...(name ? { name } : {}),
        services: auth.scopes.includes("nostalgia:read") ? ["nostalgia"] : [],
    });
}

export const GET = userinfo;
export const POST = userinfo;
