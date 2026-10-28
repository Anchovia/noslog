import { createHash } from "node:crypto";

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
    buildAuthorizationResponseUrl,
    formatOAuthScope,
    type OAuthClientRegistration,
    validateAuthorizeRequest,
} from "@/features/partner/server/oauth-authorize";
import { parseBasicClientCredentials } from "@/features/partner/server/oauth-client-auth";
import {
    buildAuthorizationServerMetadata,
    normalizeOAuthIssuer,
} from "@/features/partner/server/oauth-metadata";
import {
    createOAuthSubject,
    createOAuthToken,
    hashOAuthSecret,
    oauthSecretMatches,
    verifyPkceS256,
} from "@/features/partner/server/oauth-tokens";

const verifier = "dBjftJeZ4CVP-mJ92K1o3Fq8xH7rQ0sLnUwYzAbCdEf";
const challenge = createHash("sha256").update(verifier).digest("base64url");
const client: OAuthClientRegistration = {
    clientId: "musecat",
    redirectUris: [
        "https://preview.musecat.app/api/user/connections/callback/noslog",
    ],
    allowedScopes: ["profile", "nostalgia:read"],
};

function authorizeParams(overrides: Record<string, string | null> = {}) {
    const values: Record<string, string | null> = {
        response_type: "code",
        client_id: client.clientId,
        redirect_uri: client.redirectUris[0],
        scope: "profile nostalgia:read",
        state: "state-123",
        code_challenge: challenge,
        code_challenge_method: "S256",
        ...overrides,
    };
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
        if (value !== null) params.set(key, value);
    }
    return params;
}

describe("partner OAuth tokens", () => {
    it("issues prefixed random tokens and stores only their hash", () => {
        const first = createOAuthToken("access");
        const second = createOAuthToken("access");
        expect(first.token).toMatch(/^nla_[A-Za-z0-9_-]{43}$/);
        expect(createOAuthToken("refresh").token.startsWith("nlr_")).toBe(true);
        expect(createOAuthToken("code").token.startsWith("nlc_")).toBe(true);
        expect(first.token).not.toBe(second.token);
        expect(first.hash).toBe(hashOAuthSecret(first.token));
        expect(first.hash).not.toContain(first.token);
        expect(oauthSecretMatches(first.token, first.hash)).toBe(true);
        expect(oauthSecretMatches(second.token, first.hash)).toBe(false);
        expect(oauthSecretMatches(first.token, "abcd")).toBe(false);
    });

    it("creates non-numeric, non-email subjects", () => {
        const subject = createOAuthSubject();
        expect(subject).toMatch(/^nl_[A-Za-z0-9_-]{24}$/);
        expect(subject).not.toBe(createOAuthSubject());
    });

    it("verifies only S256 PKCE with a well-formed verifier", () => {
        expect(verifyPkceS256(verifier, challenge)).toBe(true);
        expect(verifyPkceS256(`${verifier}x`, challenge)).toBe(false);
        expect(verifyPkceS256(verifier, verifier.slice(0, 43))).toBe(false);
        expect(verifyPkceS256("short", challenge)).toBe(false);
    });
});

describe("partner OAuth client authentication", () => {
    const basic = (value: string) =>
        `Basic ${Buffer.from(value).toString("base64")}`;

    it("form-decodes client_secret_basic credentials", () => {
        expect(
            parseBasicClientCredentials(basic("musecat:s%3Acret+1"))
        ).toEqual({ clientId: "musecat", clientSecret: "s:cret 1" });
        expect(
            parseBasicClientCredentials(`basic ${basic("a:b").slice(6)}`)
        ).toEqual({ clientId: "a", clientSecret: "b" });
    });

    it("rejects missing, malformed and empty credentials", () => {
        expect(parseBasicClientCredentials(null)).toBeNull();
        expect(parseBasicClientCredentials("Bearer token")).toBeNull();
        expect(parseBasicClientCredentials(basic("no-separator"))).toBeNull();
        expect(parseBasicClientCredentials(basic(":secret"))).toBeNull();
        expect(parseBasicClientCredentials(basic("id:%E0%A4%A"))).toBeNull();
    });
});

describe("partner OAuth authorize request", () => {
    it("accepts an exact registered request", () => {
        expect(validateAuthorizeRequest(authorizeParams(), client)).toEqual({
            kind: "ok",
            clientId: "musecat",
            redirectUri: client.redirectUris[0],
            scopes: ["profile", "nostalgia:read"],
            state: "state-123",
            codeChallenge: challenge,
        });
    });

    it("stops without redirecting when the client or redirect is untrusted", () => {
        expect(validateAuthorizeRequest(authorizeParams(), null)).toEqual({
            kind: "stop",
            error: "invalid_client",
        });
        for (const redirectUri of [
            `${client.redirectUris[0]}/`,
            `${client.redirectUris[0]}?x=1`,
            "https://evil.example/callback",
        ]) {
            expect(
                validateAuthorizeRequest(
                    authorizeParams({ redirect_uri: redirectUri }),
                    client
                )
            ).toEqual({ kind: "stop", error: "invalid_redirect_uri" });
        }
        const repeated = authorizeParams();
        repeated.append("redirect_uri", client.redirectUris[0]);
        expect(validateAuthorizeRequest(repeated, client).kind).toBe("stop");
    });

    it("redirects protocol errors back with state", () => {
        const cases: [Record<string, string | null>, string][] = [
            [{ response_type: "token" }, "unsupported_response_type"],
            [{ code_challenge_method: "plain" }, "invalid_request"],
            [{ code_challenge: null }, "invalid_request"],
            [{ code_challenge: "too-short" }, "invalid_request"],
            [{ scope: "nostalgia:read" }, "invalid_scope"],
            [{ scope: null }, "invalid_scope"],
            [{ scope: "profile admin" }, "invalid_scope"],
        ];
        for (const [overrides, error] of cases) {
            expect(
                validateAuthorizeRequest(authorizeParams(overrides), client)
            ).toMatchObject({
                kind: "redirect-error",
                error,
                state: "state-123",
                redirectUri: client.redirectUris[0],
            });
        }
        const repeatedScope = authorizeParams();
        repeatedScope.append("scope", "profile");
        expect(validateAuthorizeRequest(repeatedScope, client)).toMatchObject({
            kind: "redirect-error",
            error: "invalid_request",
        });
    });

    it("rejects scopes the client was not registered for", () => {
        expect(
            validateAuthorizeRequest(authorizeParams(), {
                ...client,
                allowedScopes: ["profile"],
            })
        ).toMatchObject({ kind: "redirect-error", error: "invalid_scope" });
    });

    it("formats scopes in a stable order", () => {
        expect(formatOAuthScope(["nostalgia:read", "profile"])).toBe(
            "profile nostalgia:read"
        );
        expect(formatOAuthScope(["profile", "unknown"])).toBe("profile");
    });

    it("adds iss to success and error responses without dropping registered query", () => {
        const success = buildAuthorizationResponseUrl(
            "https://partner.example/cb?tenant=1",
            "https://noslog.app",
            { code: "nlc_x", state: "s" }
        );
        expect(success.searchParams.get("tenant")).toBe("1");
        expect(success.searchParams.get("code")).toBe("nlc_x");
        expect(success.searchParams.get("state")).toBe("s");
        expect(success.searchParams.get("iss")).toBe("https://noslog.app");
        const error = buildAuthorizationResponseUrl(
            "https://partner.example/cb",
            "https://noslog.app",
            { error: "access_denied", state: null }
        );
        expect(error.searchParams.has("state")).toBe(false);
        expect(error.searchParams.get("iss")).toBe("https://noslog.app");
    });
});

describe("partner OAuth metadata", () => {
    it("publishes an RFC 8414 document for a bare https issuer", () => {
        const metadata = buildAuthorizationServerMetadata(
            normalizeOAuthIssuer("https://noslog.app/")
        );
        expect(metadata).toMatchObject({
            issuer: "https://noslog.app",
            authorization_endpoint: "https://noslog.app/oauth/authorize",
            token_endpoint: "https://noslog.app/oauth/token",
            revocation_endpoint: "https://noslog.app/oauth/revoke",
            code_challenge_methods_supported: ["S256"],
            token_endpoint_auth_methods_supported: ["client_secret_basic"],
            authorization_response_iss_parameter_supported: true,
        });
    });

    it("rejects issuers that are not a bare https origin", () => {
        for (const issuer of [
            "http://noslog.app",
            "https://noslog.app/ko",
            "https://noslog.app/?x=1",
            "https://user@noslog.app",
        ]) {
            expect(() => normalizeOAuthIssuer(issuer)).toThrow();
        }
        expect(
            normalizeOAuthIssuer("http://localhost:3000", {
                allowLoopbackHttp: true,
            })
        ).toBe("http://localhost:3000");
        expect(() =>
            normalizeOAuthIssuer("http://evil.example", {
                allowLoopbackHttp: true,
            })
        ).toThrow();
    });
});
