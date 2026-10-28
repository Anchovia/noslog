import "server-only";

import type { OAuthScope } from "@/features/partner/server/oauth-authorize";
import { getClientName } from "@/features/partner/server/oauth-service";
import type { PartnerShareItemName } from "@/features/partner/server/partner-outbox";
import db from "@/lib/db";
import getSession from "@/lib/session";

/** /oauth/authorize 가 세션에 남긴 동의 대기 요청의 수명 */
export const CONSENT_REQUEST_TTL_MS = 10 * 60 * 1000;

export type ConsentPageData =
    | {
          kind: "error";
          code: "invalid_client" | "invalid_redirect_uri" | "expired";
      }
    | { kind: "login" }
    | {
          kind: "ready";
          clientName: string;
          host: string;
          userName: string;
          userAvatar: string | null;
          wantsRecords: boolean;
          initialItems: PartnerShareItemName[];
          scoresPrivate: boolean;
          activityPrivate: boolean;
      };

export async function readPendingConsent() {
    const session = await getSession();
    const pending = session.oauthAuthorize;
    if (!pending || Date.now() - pending.createdAt > CONSENT_REQUEST_TTL_MS) {
        return { session, pending: null };
    }
    return { session, pending };
}

export async function getConsentPageData(
    error: string | undefined
): Promise<ConsentPageData> {
    if (error === "invalid_client" || error === "invalid_redirect_uri") {
        return { kind: "error", code: error };
    }
    const { session, pending } = await readPendingConsent();
    if (!pending) return { kind: "error", code: "expired" };
    if (!session.id) return { kind: "login" };
    const [clientName, user] = await Promise.all([
        getClientName(pending.clientId),
        db.user.findUnique({
            where: { id: session.id },
            select: {
                username: true,
                avatar: true,
                hidePlayScores: true,
                hidePlayActivity: true,
            },
        }),
    ]);
    if (!clientName || !user) return { kind: "error", code: "invalid_client" };
    return {
        kind: "ready",
        clientName,
        host: new URL(pending.redirectUri).host,
        userName: user.username ?? "",
        userAvatar: user.avatar,
        wantsRecords: (pending.scopes as OAuthScope[]).includes(
            "nostalgia:read"
        ),
        // 처음이든 다시 묻든 모두 해제 — 동의는 매번 직접 고른 것만(법 · GDPR 기준)
        initialItems: [],
        scoresPrivate: user.hidePlayScores,
        activityPrivate: user.hidePlayActivity,
    };
}
