import "server-only";

import { type NextRequest, NextResponse } from "next/server";

import { readJsonBody } from "@/lib/api/read-json-body";

const EAGATE_ORIGIN = "https://p.eagate.573.jp";

export function eagateCorsHeaders() {
    return {
        "Access-Control-Allow-Origin": EAGATE_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        "Cache-Control": "no-store",
        Vary: "Origin",
    };
}

export async function readEagateJson(request: NextRequest, maxBytes: number) {
    if (request.headers.get("origin") !== EAGATE_ORIGIN) {
        return { ok: false, reason: "forbidden", status: 403 } as const;
    }

    if (!request.headers.get("content-type")?.startsWith("application/json")) {
        return { ok: false, reason: "jsonOnly", status: 415 } as const;
    }

    const read = await readJsonBody(request, maxBytes);
    if (read.tooLarge) {
        return { ok: false, reason: "tooLarge", status: 413 } as const;
    }

    return { ok: true, body: read.body } as const;
}

export function eagateOptions(request: NextRequest) {
    if (request.headers.get("origin") !== EAGATE_ORIGIN) {
        return new NextResponse(null, { status: 403 });
    }

    return new NextResponse(null, {
        status: 204,
        headers: eagateCorsHeaders(),
    });
}
