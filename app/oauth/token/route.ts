import {
    invalidClient,
    oauthError,
    oauthJson,
    readOAuthForm,
} from "@/features/partner/server/oauth-http";
import {
    authenticateOAuthClient,
    exchangeAuthorizationCode,
    refreshAccessToken,
} from "@/features/partner/server/oauth-service";

export const dynamic = "force-dynamic";

/** 토큰 엔드포인트 — client_secret_basic 만, 응답에는 늘 scope(뮤즈캣 spec) */
export async function POST(request: Request) {
    const client = await authenticateOAuthClient(
        request.headers.get("authorization")
    );
    if (!client) return invalidClient();
    const form = await readOAuthForm(request);
    if (!form) return oauthError("invalid_request");

    const grantType = form.get("grant_type");
    if (grantType === "authorization_code") {
        const code = form.get("code");
        if (!code) return oauthError("invalid_request");
        const result = await exchangeAuthorizationCode({
            clientId: client.id,
            code,
            redirectUri: form.get("redirect_uri"),
            codeVerifier: form.get("code_verifier"),
        });
        return result.ok ? oauthJson(result.body) : oauthError(result.error);
    }
    if (grantType === "refresh_token") {
        const refreshToken = form.get("refresh_token");
        if (!refreshToken) return oauthError("invalid_request");
        const result = await refreshAccessToken({
            clientId: client.id,
            refreshToken,
            scope: form.get("scope"),
        });
        return result.ok ? oauthJson(result.body) : oauthError(result.error);
    }
    return oauthError("unsupported_grant_type");
}
