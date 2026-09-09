import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryObserver } from "@tanstack/react-query";
import type { PublicTierBandPayload } from "@/lib/tiers";

const mocks = vi.hoisted(() => ({
    band: vi.fn(),
    user: vi.fn(),
    preference: vi.fn(),
    log: vi.fn(),
}));
vi.mock("@/app/(nevigation)/tiers/data", () => ({
    getTierBandForUser: mocks.band,
}));
vi.mock("@/lib/user", () => ({ getUser: mocks.user }));
vi.mock("@/lib/i18n/musicTitle", () => ({
    getMusicTitleDisplayPreference: mocks.preference,
}));
vi.mock("@/lib/observability/server", () => ({ logServerError: mocks.log }));

import { GET } from "@/app/api/tiers/[slug]/bands/[bandId]/route";
import {
    fetchTierBand,
    tierBandQueryKey,
    tierBandQueryOptions,
} from "@/features/tiers/api/tierBands";
import type { TierBandQuery } from "@/features/tiers/api/tierBands";
import { createApiFailure, createApiSuccess } from "@/lib/api/response";

const band: PublicTierBandPayload = {
    id: 4,
    value: 12,
    position: 0,
    entries: [],
};
const query: TierBandQuery = {
    slug: "pianist",
    bandId: 4,
    difficulties: ["Expert"],
    levels: ["12"],
    locale: "en",
    viewerId: 7,
    showLocalizedTitle: false,
};
const request = (id = "4", search = "") =>
    GET(
        new Request(`http://localhost/api/tiers/pianist/bands/${id}${search}`),
        { params: Promise.resolve({ slug: "pianist", bandId: id }) }
    );

describe("tier-band paired API contract", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mocks.user.mockResolvedValue({ id: 7 });
        mocks.preference.mockResolvedValue(false);
        mocks.band.mockResolvedValue(band);
    });
    afterEach(() => vi.unstubAllGlobals());
    it("keeps lazy queries idle, reports failure, then recovers only on explicit retry", async () => {
        const fetch = vi
            .fn()
            .mockRejectedValueOnce(new Error("offline"))
            .mockResolvedValueOnce(Response.json(createApiSuccess({ band })));
        vi.stubGlobal("fetch", fetch);
        const client = new QueryClient();
        const options = tierBandQueryOptions(query);
        const observer = new QueryObserver(client, {
            ...options,
            enabled: false,
        });
        const unsubscribe = observer.subscribe(() => {});
        try {
            expect(observer.getCurrentResult().fetchStatus).toBe("idle");
            expect(fetch).not.toHaveBeenCalled();
            observer.setOptions({ ...options, enabled: true });
            await vi.waitFor(() =>
                expect(observer.getCurrentResult().isError).toBe(true)
            );
            expect(fetch).toHaveBeenCalledOnce();
            const result = await observer.refetch();
            expect(result.isSuccess).toBe(true);
            expect(result.data).toEqual(band);
            expect(fetch).toHaveBeenCalledTimes(2);
        } finally {
            unsubscribe();
            client.clear();
        }
    });
    it.each(["0", "-1", "1.5", "abc", "9007199254740992"])(
        "rejects malformed band %s",
        async (id) => {
            const response = await request(id);
            expect(response.status).toBe(400);
            expect(await response.json()).toMatchObject({
                isSuccess: false,
                code: "INVALID_TIER_BAND",
                result: null,
            });
            expect(mocks.user).not.toHaveBeenCalled();
            expect(mocks.band).not.toHaveBeenCalled();
        }
    );
    it.each(["ko", "ja", "en"])(
        "keeps %s locale, filter sanitation, and session-owned personalization",
        async (locale) => {
            const response = await request(
                "4",
                `?difficulty=Expert,invalid&level=12,invalid&locale=${locale}&userId=99`
            );
            expect(response.headers.get("cache-control")).toBe(
                "private, no-store"
            );
            expect(await response.json()).toEqual({
                ...createApiSuccess({ band }),
                band,
            });
            expect(mocks.band).toHaveBeenCalledWith(
                "pianist",
                4,
                7,
                ["Expert"],
                ["12"],
                locale,
                false
            );
            expect(mocks.preference).toHaveBeenCalledWith(7);
        }
    );
    it("supports anonymous requests and the existing invalid-locale fallback", async () => {
        mocks.user.mockResolvedValue(null);
        await request("4", "?locale=bad");
        expect(mocks.band).toHaveBeenCalledWith(
            "pianist",
            4,
            undefined,
            [],
            [],
            "ko",
            false
        );
    });
    it.each([404, 500])(
        "normalizes %s failures without public caching",
        async (status) => {
            if (status === 404) mocks.band.mockResolvedValue(null);
            else
                mocks.band.mockRejectedValue(
                    new Error("private database detail")
                );
            const response = await request();
            expect(response.status).toBe(status);
            expect(response.headers.get("cache-control")).toBe(
                "private, no-store"
            );
            expect(await response.json()).toMatchObject({
                isSuccess: false,
                result: null,
            });
        }
    );
    it("unwraps only domain data and forwards cancellation without sending cache identity", async () => {
        const fetch = vi
            .fn()
            .mockResolvedValue(Response.json(createApiSuccess({ band })));
        vi.stubGlobal("fetch", fetch);
        const signal = new AbortController().signal;
        expect(
            await fetchTierBand({ ...query, slug: "name/space" }, signal)
        ).toEqual(band);
        const [url, options] = fetch.mock.calls[0];
        expect(url).toBe(
            "/api/tiers/name%2Fspace/bands/4?locale=en&difficulty=Expert&level=12"
        );
        expect(options).toEqual({ cache: "no-store", signal });
    });
    it.each([
        Response.json(createApiFailure({ code: "FAIL", message: "failure" }), {
            status: 500,
        }),
        new Response("invalid"),
        Response.json({ band }),
    ])("rejects failed or malformed envelopes", async (response) => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));
        await expect(fetchTierBand(query)).rejects.toMatchObject({
            name: "ApiError",
        });
    });
    it("isolates every request dimension including viewer and title preference", () => {
        for (const change of [
            { slug: "s" },
            { bandId: 5 },
            { difficulties: [] },
            { levels: [] },
            { locale: "ja" as const },
            { viewerId: null },
            { showLocalizedTitle: true },
        ]) {
            expect(tierBandQueryKey({ ...query, ...change })).not.toEqual(
                tierBandQueryKey(query)
            );
        }
        expect(tierBandQueryOptions(query)).toMatchObject({
            staleTime: Infinity,
            gcTime: 0,
            retry: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        });
    });
    it("reuses initial data without a request and does not automatically retry a failure", async () => {
        const fetch = vi.fn().mockRejectedValue(new Error("offline"));
        vi.stubGlobal("fetch", fetch);
        const client = new QueryClient();
        try {
            expect(
                await client.fetchQuery({
                    ...tierBandQueryOptions(query),
                    initialData: band,
                })
            ).toEqual(band);
            expect(fetch).not.toHaveBeenCalled();
            await expect(
                client.fetchQuery(tierBandQueryOptions({ ...query, bandId: 5 }))
            ).rejects.toThrow("offline");
            expect(fetch).toHaveBeenCalledOnce();
        } finally {
            client.clear();
        }
    });
});
