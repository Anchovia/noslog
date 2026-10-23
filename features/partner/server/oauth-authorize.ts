import { isPkceS256Challenge } from "@/features/partner/server/oauth-tokens";

/** 뮤즈캣 spec: `profile` 은 모든 연결에 필수, 기록은 `<service>:read` */
export const OAUTH_SCOPES = ["profile", "nostalgia:read"] as const;
export type OAuthScope = (typeof OAUTH_SCOPES)[number];

export interface OAuthClientRegistration {
    clientId: string;
    redirectUris: readonly string[];
    allowedScopes: readonly OAuthScope[];
}

export type AuthorizeRequestResult =
    /** client · redirect 를 믿을 수 없으면 돌려보내지 않고 NosLog 화면에서 멈춘다(RFC 9700 §4.11.2) */
    | { kind: "stop"; error: "invalid_client" | "invalid_redirect_uri" }
    | {
          kind: "redirect-error";
          redirectUri: string;
          state: string | null;
          error:
              "invalid_request" | "unsupported_response_type" | "invalid_scope";
          description: string;
      }
    | {
          kind: "ok";
          clientId: string;
          redirectUri: string;
          scopes: OAuthScope[];
          state: string | null;
          codeChallenge: string;
      };

const SINGLE_PARAMS = [
    "response_type",
    "client_id",
    "redirect_uri",
    "scope",
    "state",
    "code_challenge",
    "code_challenge_method",
] as const;

export function parseOAuthScope(value: string | null) {
    if (value === null) return null;
    const scopes = value.split(" ").filter(Boolean);
    return [...new Set(scopes)];
}

/** 응답용 scope 문자열 — 순서를 고정해 같은 권한이면 같은 문자열 */
export function formatOAuthScope(scopes: readonly string[]) {
    return OAUTH_SCOPES.filter((scope) => scopes.includes(scope)).join(" ");
}

function isOAuthScope(value: string): value is OAuthScope {
    return (OAUTH_SCOPES as readonly string[]).includes(value);
}

/**
 * GET /oauth/authorize 검사. 조회한 클라이언트(없으면 null)를 받아 순수하게 판단한다.
 * redirect_uri 는 등록값과 문자열로 정확히 같아야 한다(RFC 9700 §2.1). PKCE 는 S256 만(뮤즈캣 spec).
 */
export function validateAuthorizeRequest(
    params: URLSearchParams,
    client: OAuthClientRegistration | null
): AuthorizeRequestResult {
    const clientId = params.getAll("client_id");
    if (!client || clientId.length !== 1 || clientId[0] !== client.clientId) {
        return { kind: "stop", error: "invalid_client" };
    }
    const redirectUri = params.getAll("redirect_uri");
    if (
        redirectUri.length !== 1 ||
        !client.redirectUris.includes(redirectUri[0])
    ) {
        return { kind: "stop", error: "invalid_redirect_uri" };
    }
    const states = params.getAll("state");
    const state = states.length === 1 ? states[0] : null;
    const fail = (
        error:
            "invalid_request" | "unsupported_response_type" | "invalid_scope",
        description: string
    ): AuthorizeRequestResult => ({
        kind: "redirect-error",
        redirectUri: redirectUri[0],
        state,
        error,
        description,
    });

    // RFC 6749 §3.1 — 같은 파라미터를 두 번 보내면 거절
    const repeated = SINGLE_PARAMS.find(
        (name) => params.getAll(name).length > 1
    );
    if (repeated) return fail("invalid_request", `Repeated ${repeated}`);
    if (params.get("response_type") !== "code") {
        return fail("unsupported_response_type", "Only code is supported");
    }
    const challenge = params.get("code_challenge");
    if (
        params.get("code_challenge_method") !== "S256" ||
        !challenge ||
        !isPkceS256Challenge(challenge)
    ) {
        return fail("invalid_request", "PKCE S256 is required");
    }
    const scopes = parseOAuthScope(params.get("scope"));
    if (!scopes || !scopes.includes("profile")) {
        return fail("invalid_scope", "The profile scope is required");
    }
    if (
        scopes.some(
            (scope) =>
                !isOAuthScope(scope) || !client.allowedScopes.includes(scope)
        )
    ) {
        return fail("invalid_scope", "Unknown or unregistered scope");
    }
    return {
        kind: "ok",
        clientId: client.clientId,
        redirectUri: redirectUri[0],
        scopes: scopes as OAuthScope[],
        state,
        codeChallenge: challenge,
    };
}

/**
 * 인가 응답 주소. 성공(code) · 오류 모두 iss 를 붙인다(RFC 9207 §2).
 * 등록된 redirect_uri 의 기존 query 는 그대로 둔다. 리다이렉트 자체는 303 으로(RFC 9700 §4.12).
 */
export function buildAuthorizationResponseUrl(
    redirectUri: string,
    issuer: string,
    params: Record<string, string | null | undefined>
) {
    const url = new URL(redirectUri);
    for (const [key, value] of Object.entries(params)) {
        if (value !== null && value !== undefined) {
            url.searchParams.set(key, value);
        }
    }
    url.searchParams.set("iss", issuer);
    return url;
}
