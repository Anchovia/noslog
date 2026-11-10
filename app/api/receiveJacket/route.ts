import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
    JACKET_INDEX_PATTERN,
    MAX_COLLECTED_JACKET_BYTES,
    saveCollectedJacket,
} from "@/features/music/server/jacket-collection-service";
import {
    eagateCorsHeaders,
    eagateOptions,
    readEagateJson,
} from "@/features/sync/server/eagate-request";
import { getUserSyncAuth } from "@/features/users/server/user-data";
import { isSyncTokenExpired, verifySyncToken } from "@/lib/bookmarklet";

// 관리자 동기화 중 북마클릿이 공식 사이트(로그인 필요)에서 받은 자켓 한 장을 저장한다
const MAX_BASE64_LENGTH = Math.ceil(MAX_COLLECTED_JACKET_BYTES / 3) * 4;
const MAX_BODY_BYTES = MAX_BASE64_LENGTH + 4 * 1024;

const jacketRequestSchema = z.object({
    token: z.string().min(1).max(512),
    index: z.string().regex(JACKET_INDEX_PATTERN),
    data: z
        .string()
        .min(1)
        .max(MAX_BASE64_LENGTH)
        .regex(/^[A-Za-z0-9+/]+={0,2}$/),
});

function json(status: number, data: Record<string, unknown>) {
    return NextResponse.json(data, { status, headers: eagateCorsHeaders() });
}

export async function POST(request: NextRequest) {
    const read = await readEagateJson(request, MAX_BODY_BYTES);
    if (!read.ok) {
        return json(read.status, { saved: false });
    }

    const parsed = jacketRequestSchema.safeParse(read.body);
    if (!parsed.success) return json(400, { saved: false });

    const verifiedToken = verifySyncToken(parsed.data.token);
    if (verifiedToken.status !== "valid") return json(401, { saved: false });
    const tokenPayload = verifiedToken.payload;
    const user = await getUserSyncAuth(tokenPayload.userId);
    if (
        !user ||
        user.syncTokenVersion !== tokenPayload.version ||
        user.role !== "admin" ||
        tokenPayload.adminMfa !== true ||
        isSyncTokenExpired(tokenPayload, user.role)
    ) {
        return json(403, { saved: false });
    }

    try {
        const result = await saveCollectedJacket(
            parsed.data.index,
            new Uint8Array(Buffer.from(parsed.data.data, "base64"))
        );
        if (result === "invalid") return json(400, { saved: false });
        return json(200, { saved: result === "saved" });
    } catch (error) {
        console.error("Jacket collection failed", error);
        return json(500, { saved: false });
    }
}

export async function OPTIONS(request: NextRequest) {
    return eagateOptions(request);
}
