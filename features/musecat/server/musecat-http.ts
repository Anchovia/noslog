import "server-only";

import { randomUUID } from "node:crypto";

import { serverEnv } from "@/lib/env/server";

export type MusecatCallResult<T> =
    | { ok: true; data: T }
    | {
          ok: false;
          status: number | null;
          error: string;
          retryAfter: number | null;
      };

export type Json = Record<string, unknown>;

export function musecatOrigin() {
    const value = serverEnv.MUSECAT_API_ORIGIN;
    if (!value) throw new Error("MUSECAT_API_ORIGIN is not configured");
    return value.replace(/\/$/, "");
}

function clientBasic() {
    const id = serverEnv.MUSECAT_CLIENT_ID;
    const secret = serverEnv.MUSECAT_CLIENT_SECRET;
    if (!id || !secret) throw new Error("Musecat client is not configured");
    const encode = (value: string) =>
        encodeURIComponent(value).replace(/%20/g, "+");
    return `Basic ${Buffer.from(`${encode(id)}:${encode(secret)}`).toString("base64")}`;
}

export function musecatOAuthPost(path: string, body: URLSearchParams) {
    return fetch(`${musecatOrigin()}${path}`, {
        method: "POST",
        headers: {
            Authorization: clientBasic(),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
    });
}

export async function musecatFetch<T = Json>(
    path: string,
    {
        token,
        method = "GET",
        body,
    }: { token: string; method?: string; body?: Json | FormData }
): Promise<MusecatCallResult<T>> {
    try {
        const isForm = body instanceof FormData;
        const response = await fetch(`${musecatOrigin()}${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                ...(body && !isForm
                    ? { "Content-Type": "application/json" }
                    : {}),
                ...(method === "GET" ? {} : { "X-Request-Id": randomUUID() }),
            },
            body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
            cache: "no-store",
            signal: AbortSignal.timeout(10_000),
        });
        const text = await response.text();
        const json = text ? (JSON.parse(text) as unknown) : null;
        if (!response.ok) {
            const retry = Number(response.headers.get("retry-after"));
            return {
                ok: false,
                status: response.status,
                error:
                    json && typeof json === "object" && "error" in json
                        ? String((json as Json).error)
                        : `http_${response.status}`,
                retryAfter: Number.isFinite(retry) && retry > 0 ? retry : null,
            };
        }
        return { ok: true, data: json as T };
    } catch (error) {
        return {
            ok: false,
            status: null,
            error: error instanceof Error ? error.name : "network_error",
            retryAfter: null,
        };
    }
}
