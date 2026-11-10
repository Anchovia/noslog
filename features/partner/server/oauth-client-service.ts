import "server-only";

import type { OAuthClientRegistration } from "@/features/partner/server/oauth-authorize";
import { parseBasicClientCredentials } from "@/features/partner/server/oauth-client-auth";
import { fromDbScopes } from "@/features/partner/server/oauth-grant-service";
import { oauthSecretMatches } from "@/features/partner/server/oauth-tokens";
import db from "@/lib/db";

export async function getAuthorizeClient(
    clientId: string | null
): Promise<OAuthClientRegistration | null> {
    if (!clientId) return null;
    const client = await db.oAuthClient.findFirst({
        where: { id: clientId, disabledAt: null },
        select: { id: true, redirectUris: true, allowedScopes: true },
    });
    if (!client) return null;
    return {
        clientId: client.id,
        redirectUris: client.redirectUris,
        allowedScopes: fromDbScopes(client.allowedScopes),
    };
}

export async function getClientName(clientId: string) {
    const client = await db.oAuthClient.findUnique({
        where: { id: clientId },
        select: { name: true },
    });
    return client?.name ?? null;
}

/** client_secret_basic — 교체 기간에는 옛 비밀도 받는다. 실패하면 null(→ 401) */
export async function authenticateOAuthClient(authorization: string | null) {
    const credentials = parseBasicClientCredentials(authorization);
    if (!credentials) return null;
    const client = await db.oAuthClient.findFirst({
        where: { id: credentials.clientId, disabledAt: null },
        select: {
            id: true,
            secretHash: true,
            previousSecretHash: true,
            previousSecretExpiresAt: true,
        },
    });
    if (!client) return null;
    const current = oauthSecretMatches(
        credentials.clientSecret,
        client.secretHash
    );
    const previous =
        client.previousSecretHash &&
        client.previousSecretExpiresAt &&
        client.previousSecretExpiresAt > new Date() &&
        oauthSecretMatches(credentials.clientSecret, client.previousSecretHash);
    return current || previous ? { id: client.id } : null;
}
