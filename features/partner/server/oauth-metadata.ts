import { OAUTH_SCOPES } from "@/features/partner/server/oauth-authorize";

/**
 * issuer 는 https origin 하나 — 경로 · query · fragment 없음(RFC 8414 §2).
 * 뮤즈캣 spec 도 B 방향은 공개 HTTPS 만 받는다.
 */
export function normalizeOAuthIssuer(
    value: string,
    { allowLoopbackHttp = false }: { allowLoopbackHttp?: boolean } = {}
) {
    const url = new URL(value);
    const loopback =
        allowLoopbackHttp &&
        url.protocol === "http:" &&
        ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (
        (url.protocol !== "https:" && !loopback) ||
        url.pathname !== "/" ||
        url.search ||
        url.hash ||
        url.username ||
        url.password
    ) {
        throw new Error("OAuth issuer must be a bare https origin");
    }
    return url.origin;
}

/** GET /.well-known/oauth-authorization-server (RFC 8414) */
export function buildAuthorizationServerMetadata(issuer: string) {
    return {
        issuer,
        authorization_endpoint: `${issuer}/oauth/authorize`,
        token_endpoint: `${issuer}/oauth/token`,
        userinfo_endpoint: `${issuer}/oauth/userinfo`,
        revocation_endpoint: `${issuer}/oauth/revoke`,
        scopes_supported: [...OAUTH_SCOPES],
        response_types_supported: ["code"],
        response_modes_supported: ["query"],
        grant_types_supported: ["authorization_code", "refresh_token"],
        token_endpoint_auth_methods_supported: ["client_secret_basic"],
        revocation_endpoint_auth_methods_supported: ["client_secret_basic"],
        code_challenge_methods_supported: ["S256"],
        authorization_response_iss_parameter_supported: true,
    };
}
