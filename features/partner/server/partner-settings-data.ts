import "server-only";

import { getMusecatConnection } from "@/features/musecat/server/musecat-connection-service";
import { getMusecatMode } from "@/features/musecat/server/musecat-mode";
import { findActiveGrant } from "@/features/partner/server/oauth-service";
import { getPendingPartnerKinds } from "@/features/partner/server/partner-outbox";

/** NosLog 가 뮤즈캣에 발급한 OAuth 클라이언트 id(B 방향) — 운영자가 등록한다 */
export const MUSECAT_OAUTH_CLIENT_ID = "musecat";

export interface MusecatSettings {
    /** 뮤즈캣 줄을 보일지 — MUSECAT_MODE 가 켜졌거나 실제 연결이 있을 때만(운영 설정 화면은 그대로) */
    visible: boolean;
    /** A — NosLog 가 쓰는 내 뮤즈캣 계정 */
    account:
        | { status: "none" }
        | {
              status: "active" | "needs_reconnect";
              username: string | null;
              connectedAt: string;
              familyExpiresAt: string | null;
          };
    /** A 연결을 다시 해야 하기까지 남은 날(뮤즈캣 refresh 절대 수명 30일) — 렌더 중 시계를 읽지 않게 서버에서 센다 */
    reconnectDays: number | null;
    /** B — 뮤즈캣이 읽는 내 NosLog 기록 */
    records: {
        sharedItems: string[];
        connectedAt: string;
        lastUsedAt: string | null;
        pending: ("records_invalidation" | "revocation")[];
    } | null;
}

export async function getMusecatSettings(
    userId: number
): Promise<MusecatSettings> {
    const [account, grant] = await Promise.all([
        getMusecatConnection(userId),
        findActiveGrant(userId, MUSECAT_OAUTH_CLIENT_ID),
    ]);
    const pending = grant
        ? ((await getPendingPartnerKinds([grant.id])).get(grant.id) ?? [])
        : [];
    return {
        visible:
            getMusecatMode() !== "off" ||
            account.status !== "none" ||
            grant !== null,
        account,
        reconnectDays:
            account.status === "active" && account.familyExpiresAt
                ? Math.max(
                      0,
                      Math.ceil(
                          (new Date(account.familyExpiresAt).getTime() -
                              Date.now()) /
                              86_400_000
                      )
                  )
                : null,
        records: grant
            ? {
                  sharedItems: grant.sharedItems,
                  connectedAt: grant.createdAt.toISOString(),
                  lastUsedAt: grant.lastUsedAt?.toISOString() ?? null,
                  pending,
              }
            : null,
    };
}
