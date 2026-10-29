import "server-only";

import type {
    PartnerOutboxKind,
    PartnerShareItem,
    Prisma,
} from "@prisma/client";

import db from "@/lib/db";
import { serverEnv } from "@/lib/env/server";
import { logServerError } from "@/lib/observability/server";

/** 동의 화면 항목 순서(2026-10-20 결정) — enum 값과 같다 */
export const PARTNER_SHARE_ITEMS = [
    "summary",
    "ranks",
    "song_records",
    "recent_plays",
] as const satisfies readonly PartnerShareItem[];
export type PartnerShareItemName = (typeof PARTNER_SHARE_ITEMS)[number];

/** 해제 알림은 24시간 넘게 다시 보낸다(뮤즈캣 spec) */
const GIVE_UP_AFTER_MS = 26 * 60 * 60 * 1000;
const BACKOFF_BASE_MS = 5_000;
const BACKOFF_CAP_MS = 5 * 60 * 1000;
const LOCK_SECONDS = 60;

export async function enqueuePartnerMessage(
    tx: Prisma.TransactionClient,
    message: {
        clientId: string;
        grantId: number | null;
        kind: PartnerOutboxKind;
        generation: number | null;
        payload: Prisma.InputJsonValue;
    }
) {
    await tx.partnerOutboxMessage.create({
        data: {
            ...message,
            giveUpAt: new Date(Date.now() + GIVE_UP_AFTER_MS),
        },
    });
}

/** AWS Full Jitter — 0 부터 min(상한, 기본 × 2^시도) 사이 무작위 */
export function nextPartnerAttemptDelay(
    attempts: number,
    random = Math.random
) {
    const ceiling = Math.min(BACKOFF_CAP_MS, BACKOFF_BASE_MS * 2 ** attempts);
    return Math.round(random() * ceiling);
}

export type PartnerDeliveryResult =
    | { kind: "delivered"; status: number }
    | { kind: "retry"; status: number | null; error: string }
    /** 아직 받을 곳이 정해지지 않음(뮤즈캣 공동 연결 문서 대기) — 실패로 세지 않고 미룬다 */
    | { kind: "unsupported"; error: string };

export interface PartnerOutboxMessageView {
    id: string;
    kind: PartnerOutboxKind;
    payload: Prisma.JsonValue;
}

export type PartnerSender = (
    message: PartnerOutboxMessageView
) => Promise<PartnerDeliveryResult>;

/**
 * 보낼지는 화면 모드(MUSECAT_MODE)가 아니라 파트너 설정으로 정한다 — 설정이 없으면 보낸 것으로 치지 않고 미뤄 둔다.
 * 「보냄」 은 뮤즈캣이 2xx 로 받았을 때만 남긴다
 */
export const sendToMusecat: PartnerSender = async (message) => {
    const origin = serverEnv.MUSECAT_API_ORIGIN;
    const key = serverEnv.MUSECAT_PARTNER_KEY;
    if (!origin || !key) {
        return { kind: "unsupported", error: "musecat_not_configured" };
    }
    if (message.kind === "revocation") {
        return {
            kind: "unsupported",
            error: "joint_revocation_endpoint_pending",
        };
    }
    try {
        const response = await fetch(
            `${origin}/partner/v1/records/invalidate`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${key}`,
                    "Content-Type": "application/json",
                    "X-Request-Id": message.id,
                },
                body: JSON.stringify(message.payload),
                signal: AbortSignal.timeout(10_000),
                cache: "no-store",
            }
        );
        if (response.ok) return { kind: "delivered", status: response.status };
        return {
            kind: "retry",
            status: response.status,
            error: `http_${response.status}`,
        };
    } catch (error) {
        return {
            kind: "retry",
            status: null,
            error: error instanceof Error ? error.name : "network_error",
        };
    }
};

/** 보낼 때가 된 줄을 잠그고 가져온다(FOR UPDATE SKIP LOCKED — 여러 실행이 같은 줄을 집지 않게) */
async function claimDueMessages(limit: number) {
    const rows = await db.$queryRaw<{ id: string }[]>`
        UPDATE partner_outbox_messages
        SET locked_until = now() + make_interval(secs => ${LOCK_SECONDS})
        WHERE id IN (
            SELECT id FROM partner_outbox_messages
            WHERE status = 'pending'
              AND next_attempt_at <= now()
              AND (locked_until IS NULL OR locked_until < now())
            ORDER BY next_attempt_at
            LIMIT ${limit}
            FOR UPDATE SKIP LOCKED
        )
        RETURNING id`;
    if (rows.length === 0) return [];
    return db.partnerOutboxMessage.findMany({
        where: { id: { in: rows.map((row) => row.id) } },
        select: {
            id: true,
            kind: true,
            payload: true,
            attempts: true,
            giveUpAt: true,
        },
    });
}

export async function dispatchPartnerOutbox({
    limit = 20,
    sender = sendToMusecat,
}: { limit?: number; sender?: PartnerSender } = {}) {
    const messages = await claimDueMessages(limit);
    let delivered = 0;
    for (const message of messages) {
        const now = new Date();
        let result: PartnerDeliveryResult;
        try {
            result = await sender(message);
        } catch (error) {
            logServerError(error, { event: "partner_outbox_send" });
            result = { kind: "retry", status: null, error: "sender_error" };
        }
        if (result.kind === "delivered") {
            delivered += 1;
            await db.partnerOutboxMessage.update({
                where: { id: message.id },
                data: {
                    status: "delivered",
                    deliveredAt: now,
                    lastHttpStatus: result.status,
                    lastError: null,
                    lockedUntil: null,
                },
            });
            continue;
        }
        const attempts =
            result.kind === "retry" ? message.attempts + 1 : message.attempts;
        const giveUp = result.kind === "retry" && message.giveUpAt <= now;
        await db.partnerOutboxMessage.update({
            where: { id: message.id },
            data: {
                attempts,
                status: giveUp ? "dead" : "pending",
                lastHttpStatus: result.kind === "retry" ? result.status : null,
                lastError: result.error,
                lockedUntil: null,
                nextAttemptAt: new Date(
                    now.getTime() +
                        (result.kind === "unsupported"
                            ? 60 * 60 * 1000
                            : nextPartnerAttemptDelay(attempts))
                ),
            },
        });
    }
    return { claimed: messages.length, delivered };
}

/** 설정 화면용 — 이 연결에 아직 못 보낸 알림이 있는지(「해제 중 · 반영 중」) */
export async function getPendingPartnerKinds(grantIds: number[]) {
    if (grantIds.length === 0) return new Map<number, PartnerOutboxKind[]>();
    const rows = await db.partnerOutboxMessage.findMany({
        where: { grantId: { in: grantIds }, status: "pending" },
        select: { grantId: true, kind: true },
    });
    const map = new Map<number, PartnerOutboxKind[]>();
    for (const row of rows) {
        if (row.grantId === null) continue;
        map.set(row.grantId, [...(map.get(row.grantId) ?? []), row.kind]);
    }
    return map;
}
