import { loadNostalgiaRecords } from "@/features/partner/server/nostalgia-records-data";
import {
    bearerError,
    oauthError,
    oauthJson,
} from "@/features/partner/server/oauth-http";
import { getOAuthIssuer } from "@/features/partner/server/oauth-issuer";
import { authenticateBearer } from "@/features/partner/server/oauth-service";

export const dynamic = "force-dynamic";

/**
 * 뮤즈캣 기록 API(musecat-records/v1). 사용자가 고른 항목과 NosLog 공개 설정을 적용한 봉투만 돌려준다.
 * 「플레이 점수」 비공개면 visibility=private — 뮤즈캣은 남에게 보여 주지 않는다.
 */
export async function GET(request: Request) {
    const auth = await authenticateBearer(
        request.headers.get("authorization"),
        "nostalgia:read"
    );
    if (!auth.ok) return bearerError(auth.error);
    const records = await loadNostalgiaRecords({
        userId: auth.userId,
        subject: auth.subject,
        sharedItems: auth.sharedItems,
        origin: getOAuthIssuer(request.url),
    });
    if (!records) return oauthError("not_found", 404);
    return oauthJson(records);
}
