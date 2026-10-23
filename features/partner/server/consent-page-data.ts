import "server-only";

import type { OAuthScope } from "@/features/partner/server/oauth-authorize";
import {
    findActiveGrant,
    getClientName,
} from "@/features/partner/server/oauth-service";
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
    const [clientName, user, grant] = await Promise.all([
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
        findActiveGrant(session.id, pending.clientId),
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
        // 다시 묻는 경우에는 지금 보내는 항목을 미리 고른다. 처음은 모두 해제(법 · GDPR 기준)
        initialItems: grant?.sharedItems ?? [],
        scoresPrivate: user.hidePlayScores,
        activityPrivate: user.hidePlayActivity,
    };
}
