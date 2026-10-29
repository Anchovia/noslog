import "server-only";

import { timingSafeEqual } from "node:crypto";

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
          requestId: string;
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

/** 동의 폼이 보낸 requestId 가 지금 기다리는 요청의 것인지(같은 시간 비교) */
export function consentRequestMatches(
    sent: FormDataEntryValue | null,
    pending: { requestId?: string }
) {
    if (typeof sent !== "string" || !pending.requestId) return false;
    const actual = Buffer.from(sent);
    const expected = Buffer.from(pending.requestId);
    return (
        actual.length === expected.length && timingSafeEqual(actual, expected)
    );
}

export async function getConsentPageData(
    error: string | undefined
): Promise<ConsentPageData> {
    if (error === "invalid_client" || error === "invalid_redirect_uri") {
        return { kind: "error", code: error };
    }
    const { session, pending } = await readPendingConsent();
    // requestId 를 싣기 전에 시작한 요청은 폼이 동의할 수 없으니 다시 시작하게 한다
    if (!pending?.requestId) return { kind: "error", code: "expired" };
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
        requestId: pending.requestId,
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
