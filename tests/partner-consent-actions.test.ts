import { beforeEach, describe, expect, it, vi } from "vitest";

class RedirectSignal extends Error {
    constructor(readonly url: string) {
        super(`redirect ${url}`);
    }
}

const mocks = vi.hoisted(() => ({
    session: {} as Record<string, unknown> & { save: () => Promise<void> },
    save: vi.fn(),
    approve: vi.fn(),
    after: vi.fn(),
    redirect: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ default: async () => mocks.session }));
vi.mock("@/lib/db", () => ({ default: {} }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("next/server", () => ({ after: mocks.after }));
vi.mock("@/lib/i18n/server", () => ({
    getServerI18n: async () => ({ locale: "ko", t: (key: string) => key }),
}));
vi.mock("@/features/partner/server/oauth-service", () => ({
    approveAuthorization: mocks.approve,
    getClientName: vi.fn(),
}));
vi.mock("@/features/partner/server/oauth-issuer", () => ({
    getRequestOAuthIssuer: async () => "https://noslog.test",
}));
vi.mock("@/features/partner/server/partner-outbox", () => ({
    dispatchPartnerOutbox: vi.fn(),
    PARTNER_SHARE_ITEMS: ["summary", "ranks", "song_records", "recent_plays"],
}));

import {
    approvePartnerConsent,
    denyPartnerConsent,
} from "@/app/(auth)/authorize/actions";

const pending = {
    clientId: "musecat",
    redirectUri: "https://partner.example/callback",
    scopes: ["profile", "nostalgia:read"],
    state: "partner-state",
    codeChallenge: "challenge",
    requestId: "request-shown-on-screen",
};

function consentForm(requestId?: string) {
    const formData = new FormData();
    if (requestId !== undefined) formData.set("requestId", requestId);
    formData.append("item", "summary");
    return formData;
}

async function redirectOf(run: () => Promise<unknown>) {
    try {
        await run();
    } catch (error) {
        if (error instanceof RedirectSignal)
            return new URL(error.url, "https://noslog.test");
        throw error;
    }
    throw new Error("redirect expected");
}

describe("파트너 동의 action 은 화면에 보인 요청에만 답한다", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.redirect.mockImplementation((url: string) => {
            throw new RedirectSignal(url);
        });
        mocks.approve.mockResolvedValue("nlc_code");
        mocks.session = {
            id: 9,
            profileCompleted: true,
            oauthAuthorize: { ...pending, createdAt: Date.now() },
            save: mocks.save,
        };
    });

    it("requestId 가 다르거나 없으면 code 를 내지 않고 지금 기다리는 동의 화면으로", async () => {
        for (const sent of ["request-from-another-tab", ""]) {
            const url = await redirectOf(() =>
                approvePartnerConsent(consentForm(sent))
            );
            expect(url.pathname).toBe("/ko/authorize");
            expect(url.search).toBe("");
        }
        await redirectOf(() => approvePartnerConsent(consentForm()));
        expect(mocks.approve).not.toHaveBeenCalled();
        expect(mocks.save).not.toHaveBeenCalled();
        expect(mocks.session.oauthAuthorize).toBeDefined();
    });

    it("requestId 를 넣기 전에 시작한 대기 요청에도 동의하지 않는다", async () => {
        mocks.session.oauthAuthorize = {
            ...pending,
            requestId: undefined,
            createdAt: Date.now(),
        };
        const url = await redirectOf(() =>
            approvePartnerConsent(consentForm(""))
        );
        expect(url.pathname).toBe("/ko/authorize");
        expect(mocks.approve).not.toHaveBeenCalled();
    });

    it("requestId 가 같으면 code 를 붙여 파트너로", async () => {
        const url = await redirectOf(() =>
            approvePartnerConsent(consentForm(pending.requestId))
        );
        expect(url.origin + url.pathname).toBe(pending.redirectUri);
        expect(url.searchParams.get("code")).toBe("nlc_code");
        expect(url.searchParams.get("state")).toBe(pending.state);
        expect(mocks.approve).toHaveBeenCalledWith(
            expect.objectContaining({
                userId: 9,
                clientId: pending.clientId,
                sharedItems: ["summary"],
            })
        );
        expect(mocks.session.oauthAuthorize).toBeUndefined();
    });

    it("취소도 requestId 가 다르면 돌려보내지 않고, 같을 때만 access_denied", async () => {
        const mismatch = await redirectOf(() =>
            denyPartnerConsent(consentForm("request-from-another-tab"))
        );
        expect(mismatch.pathname).toBe("/ko/authorize");
        expect(mocks.session.oauthAuthorize).toBeDefined();

        const denied = await redirectOf(() =>
            denyPartnerConsent(consentForm(pending.requestId))
        );
        expect(denied.origin + denied.pathname).toBe(pending.redirectUri);
        expect(denied.searchParams.get("error")).toBe("access_denied");
        expect(mocks.session.oauthAuthorize).toBeUndefined();
    });
});
