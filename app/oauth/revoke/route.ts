import {
    invalidClient,
    oauthError,
    oauthJson,
    readOAuthForm,
} from "@/features/partner/server/oauth-http";
import {
    authenticateOAuthClient,
    revokeOAuthToken,
} from "@/features/partner/server/oauth-service";

export const dynamic = "force-dynamic";

/** RFC 7009 — 이 클라이언트의 토큰일 때만 효과가 있고, 모르는 토큰에도 200 */
export async function POST(request: Request) {
    const client = await authenticateOAuthClient(
        request.headers.get("authorization")
    );
    if (!client) return invalidClient();
    const form = await readOAuthForm(request);
    const token = form?.get("token");
    if (!token) return oauthError("invalid_request");
    await revokeOAuthToken(client.id, token);
    return oauthJson({});
}
