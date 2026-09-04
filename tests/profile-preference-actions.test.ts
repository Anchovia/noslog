import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    session: vi.fn(),
    arcade: vi.fn(),
    update: vi.fn(),
    revalidate: vi.fn(),
    tag: vi.fn(),
    log: vi.fn(),
}));
vi.mock("@/lib/session", () => ({ default: mocks.session }));
vi.mock("@/lib/db", () => ({
    default: {
        arcade: { findFirst: mocks.arcade },
        user: { update: mocks.update },
    },
}));
vi.mock("next/cache", () => ({
    revalidatePath: mocks.revalidate,
    updateTag: mocks.tag,
}));
vi.mock("@/lib/observability/server", () => ({ logServerError: mocks.log }));

import { setPreferredArcade } from "@/app/(nevigation)/gamecenter/actions";
import { regenerateSyncToken } from "@/app/(nevigation)/bookmarklet/action";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import type { Locale } from "@/lib/i18n/routing";

describe("profile preference action boundaries", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mocks.session.mockResolvedValue({ id: 7 });
        mocks.arcade.mockResolvedValue({ id: 4, name: "Arcade" });
        mocks.update.mockResolvedValue({});
    });
    it.each(["ko", "ja", "en"] as const)(
        "requires login with %s copy",
        async (locale) => {
            mocks.session.mockResolvedValue({});
            const t = createTranslator(getMessages(locale));
            expect(await setPreferredArcade(4, locale)).toEqual({
                success: false,
                message: t("onboarding.error.loginRequired"),
            });
            expect(await regenerateSyncToken(locale)).toEqual({
                success: false,
                message: t("sync.loginRequired"),
            });
            expect(mocks.arcade).not.toHaveBeenCalled();
            expect(mocks.update).not.toHaveBeenCalled();
        }
    );
    it.each([NaN, Infinity, 1.5, "4", null])(
        "rejects malformed arcade %s before persistence",
        async (input) => {
            expect((await setPreferredArcade(input as number)).success).toBe(
                false
            );
            expect(mocks.arcade).not.toHaveBeenCalled();
            expect(mocks.update).not.toHaveBeenCalled();
        }
    );
    it("requires an existing active arcade", async () => {
        mocks.arcade.mockResolvedValue(null);
        expect((await setPreferredArcade(4)).success).toBe(false);
        expect(mocks.arcade).toHaveBeenCalledWith({
            where: { id: 4, is_active: true },
            select: { id: true, name: true },
        });
        expect(mocks.update).not.toHaveBeenCalled();
        expect(mocks.tag).not.toHaveBeenCalled();
    });
    it("saves only the session user's preference and retains cache targets", async () => {
        expect((await setPreferredArcade(4, "ja")).success).toBe(true);
        expect(mocks.update).toHaveBeenCalledWith({
            where: { id: 7 },
            data: { preferred_arcade_id: 4 },
        });
        expect(mocks.tag.mock.calls).toEqual([
            [CACHE_TAGS.arcades],
            [CACHE_TAGS.userProfiles],
            [getUserProfileTag(7)],
        ]);
        expect(mocks.revalidate.mock.calls).toEqual([
            ["/gamecenter"],
            ["/ja/gamecenter"],
            ["/profile/7"],
            ["/profile/settings"],
        ]);
    });
    it.each(["ko", "ja", "en"] as const)(
        "normalizes persistence errors in %s without invalidation",
        async (locale) => {
            mocks.update.mockRejectedValue(new Error("database unavailable"));
            const t = createTranslator(getMessages(locale));
            expect(await setPreferredArcade(4, locale)).toEqual({
                success: false,
                message: t("settings.saveError"),
            });
            expect(await regenerateSyncToken(locale)).toEqual({
                success: false,
                message: t("sync.regenerateError"),
            });
            expect(mocks.revalidate).not.toHaveBeenCalled();
            expect(mocks.tag).not.toHaveBeenCalled();
            expect(mocks.log).toHaveBeenCalledTimes(2);
        }
    );
    it.each(["ko", "ja", "en"] as const)(
        "increments the session token version once for %s",
        async (locale) => {
            expect((await regenerateSyncToken(locale)).success).toBe(true);
            expect(mocks.update).toHaveBeenCalledExactlyOnceWith({
                where: { id: 7 },
                data: { sync_token_version: { increment: 1 } },
            });
            expect(mocks.revalidate).toHaveBeenCalledWith(
                `/${locale}/bookmarklet`
            );
        }
    );
    it("retains Korean fallback for an invalid token locale", async () => {
        await regenerateSyncToken("invalid" as Locale);
        expect(mocks.revalidate).toHaveBeenCalledWith("/ko/bookmarklet");
    });
});
