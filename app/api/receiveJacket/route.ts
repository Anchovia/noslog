import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
    JACKET_INDEX_PATTERN,
    MAX_COLLECTED_JACKET_BYTES,
    saveCollectedJacket,
} from "@/features/music/server/jacketCollectionService";
import { verifySyncToken } from "@/lib/bookmarklet";
import db from "@/lib/db";

// 관리자 동기화 중 북마클릿이 공식 사이트(로그인 필요)에서 받은 자켓 한 장을 저장한다
const EAGATE_ORIGIN = "https://p.eagate.573.jp";
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

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": EAGATE_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        "Cache-Control": "no-store",
        Vary: "Origin",
    };
}

function json(status: number, data: Record<string, unknown>) {
    return NextResponse.json(data, { status, headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
    if (request.headers.get("origin") !== EAGATE_ORIGIN) {
        return json(403, { saved: false });
    }
    if (!request.headers.get("content-type")?.startsWith("application/json")) {
        return json(415, { saved: false });
    }
    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
        return json(413, { saved: false });
    }

    const parsed = jacketRequestSchema.safeParse(
        await request.json().catch(() => null)
    );
    if (!parsed.success) return json(400, { saved: false });

    const tokenPayload = verifySyncToken(parsed.data.token);
    if (!tokenPayload) return json(401, { saved: false });
    const user = await db.user.findUnique({
        where: { id: tokenPayload.userId },
        select: { sync_token_version: true, role: true },
    });
    if (
        !user ||
        user.sync_token_version !== tokenPayload.version ||
        user.role !== "admin"
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
    if (request.headers.get("origin") !== EAGATE_ORIGIN) {
        return new NextResponse(null, { status: 403 });
    }

    return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
