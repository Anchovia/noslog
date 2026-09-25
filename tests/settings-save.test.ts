import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    session: { id: 9 as number | undefined, profileCompleted: true },
    findUser: vi.fn(),
    updateUser: vi.fn(),
    findArcade: vi.fn(),
    validateBlob: vi.fn(),
    deleteBlob: vi.fn(),
    updateTag: vi.fn(),
    log: vi.fn(),
    setShowcase: vi.fn(),
    setPinned: vi.fn(),
}));
vi.mock("@/lib/session", () => ({ default: async () => mocks.session }));
vi.mock("@/lib/db", () => ({
    default: {
        user: { findUnique: mocks.findUser, update: mocks.updateUser },
        arcade: { findFirst: mocks.findArcade },
    },
}));
vi.mock("next/cache", () => ({ updateTag: mocks.updateTag }));
vi.mock("@/lib/blob", () => ({
    isValidImageBlob: mocks.validateBlob,
    deleteBlobIfOwned: mocks.deleteBlob,
}));
vi.mock("@/lib/observability/server", () => ({ logServerError: mocks.log }));
vi.mock("@/features/achievements/server/achievementService", () => ({
    setAchievementShowcase: mocks.setShowcase,
}));
vi.mock("@/features/profile/server/profilePinnedService", () => ({
    setPinnedRecords: mocks.setPinned,
}));
vi.mock("@/lib/i18n/server", () => ({
    getServerI18n: async () => ({ t: (key: string) => key }),
}));

import {
    saveSettingsProfile,
    saveSettingsPrivacy,
} from "@/features/settings/server/settingsSaveService";
import { settingsFormData } from "@/features/settings/schemas/settingsSchema";

const profile = {
    username: "Ｎos 한글カナ",
    country: "ja-JP",
    avatar: "",
    preferredArcadeId: "",
};
const privacy = {
    showNostalgiaName: true,
    showDiscordIdentity: false,
    showPreferredArcade: true,
    showPlayCount: false,
    showPlayActivity: false,
    showPlayScores: false,
};

describe("P10 settings save boundaries", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.session.id = 9;
        mocks.session.profileCompleted = true;
        mocks.findUser.mockResolvedValue({
            avatar: null,
            preferred_arcade_id: null,
        });
        mocks.updateUser.mockResolvedValue({ id: 9 });
        mocks.findArcade.mockResolvedValue({ id: 3 });
        mocks.validateBlob.mockResolvedValue(true);
        mocks.setShowcase.mockResolvedValue({ status: "ok", keys: [] });
        mocks.setPinned.mockResolvedValue({ status: "ok" });
    });
    it("requires a completed authenticated account before accessing data", async () => {
        mocks.session.id = undefined;
        expect(
            (await saveSettingsProfile(settingsFormData(profile))).success
        ).toBe(false);
        expect(
            (await saveSettingsPrivacy(settingsFormData(privacy))).success
        ).toBe(false);
        expect(mocks.findUser).not.toHaveBeenCalled();
        expect(mocks.updateUser).not.toHaveBeenCalled();
        mocks.session.id = 9;
        mocks.session.profileCompleted = false;
        expect(
            (await saveSettingsPrivacy(settingsFormData(privacy))).success
        ).toBe(false);
        expect(mocks.updateUser).not.toHaveBeenCalled();
    });
    it("preserves nickname spelling and only updates profile-owned fields", async () => {
        const data = settingsFormData({
            ...profile,
            locale: "ko",
            hide_discord_name: "false",
            discord_id: "another",
        });
        expect((await saveSettingsProfile(data)).success).toBe(true);
        expect(mocks.updateUser).toHaveBeenCalledWith({
            where: { id: 9, avatar: null },
            data: {
                username: profile.username,
                country: "ja-JP",
                preferred_arcade_id: null,
            },
        });
    });
    it("rejects unavailable new arcades but retains an unchanged inactive selection", async () => {
        mocks.findArcade.mockResolvedValue(null);
        expect(
            (
                await saveSettingsProfile(
                    settingsFormData({ ...profile, preferredArcadeId: "3" })
                )
            ).success
        ).toBe(false);
        expect(mocks.updateUser).not.toHaveBeenCalled();
        mocks.findUser.mockResolvedValue({
            avatar: null,
            preferred_arcade_id: 3,
        });
        expect(
            (
                await saveSettingsProfile(
                    settingsFormData({ ...profile, preferredArcadeId: "3" })
                )
            ).success
        ).toBe(true);
        expect(mocks.findArcade).toHaveBeenCalledTimes(1);
    });
    it("rejects imprecise numeric IDs before database access", async () => {
        expect(
            (
                await saveSettingsProfile(
                    settingsFormData({
                        ...profile,
                        preferredArcadeId: "9007199254740993",
                    })
                )
            ).success
        ).toBe(false);
        expect(mocks.findUser).not.toHaveBeenCalled();
    });
    it("validates uploaded image ownership before updating the avatar", async () => {
        mocks.validateBlob.mockResolvedValue(false);
        expect(
            (
                await saveSettingsProfile(
                    settingsFormData({
                        ...profile,
                        avatar: "https://example.com/other.png",
                    })
                )
            ).success
        ).toBe(false);
        expect(mocks.validateBlob).toHaveBeenCalledWith(
            "https://example.com/other.png",
            "avatars/9/profile"
        );
        expect(mocks.updateUser).not.toHaveBeenCalled();
        expect(mocks.deleteBlob).not.toHaveBeenCalled();
    });
    it("records explicit removal and deletes the old upload only after the database accepts it", async () => {
        mocks.findUser.mockResolvedValue({
            avatar: "https://example.com/old.png",
            preferred_arcade_id: null,
        });
        expect(
            (await saveSettingsProfile(settingsFormData(profile))).success
        ).toBe(true);
        expect(mocks.updateUser).toHaveBeenCalledWith({
            where: { id: 9, avatar: "https://example.com/old.png" },
            data: {
                username: profile.username,
                country: "ja-JP",
                preferred_arcade_id: null,
                avatar: null,
                avatar_user_managed: true,
            },
        });
        expect(mocks.deleteBlob).toHaveBeenCalledWith(
            "https://example.com/old.png"
        );
        expect(mocks.updateUser.mock.invocationCallOrder[0]).toBeLessThan(
            mocks.deleteBlob.mock.invocationCallOrder[0]
        );
    });
    it("keeps existing and staged images after a rejected save for safe retry", async () => {
        mocks.findUser.mockResolvedValue({
            avatar: "https://example.com/old.png",
            preferred_arcade_id: null,
        });
        mocks.updateUser.mockRejectedValue({ code: "P2002" });
        const result = await saveSettingsProfile(
            settingsFormData({
                ...profile,
                avatar: "https://example.com/new.png",
            })
        );
        expect(result).toMatchObject({
            success: false,
            fieldErrors: { username: ["settings.nicknameTaken"] },
        });
        expect(mocks.deleteBlob).not.toHaveBeenCalled();
        expect(mocks.updateTag).not.toHaveBeenCalled();
    });
    it("requires every privacy choice instead of treating omitted fields as private", async () => {
        const data = settingsFormData(privacy);
        data.delete("showDiscordIdentity");
        expect((await saveSettingsPrivacy(data)).success).toBe(false);
        data.set("showDiscordIdentity", "on");
        expect((await saveSettingsPrivacy(data)).success).toBe(false);
        expect(mocks.updateUser).not.toHaveBeenCalled();
    });
    it("updates only the six privacy fields on the authenticated account", async () => {
        expect(
            (
                await saveSettingsPrivacy(
                    settingsFormData({
                        ...privacy,
                        userId: "500",
                        username: "changed",
                    })
                )
            ).success
        ).toBe(true);
        expect(mocks.updateUser).toHaveBeenCalledWith({
            where: { id: 9 },
            data: {
                hide_nostalgia_name: false,
                hide_discord_name: true,
                hide_preferred_arcade: false,
                hide_play_count: true,
                hide_play_activity: true,
                hide_play_scores: true,
            },
        });
        expect(mocks.deleteBlob).not.toHaveBeenCalled();
    });

    describe("프로필 업적 진열(2026-09-25 D1)", () => {
        it("폼에 칸이 없으면 진열은 건드리지 않는다", async () => {
            expect(
                (await saveSettingsProfile(settingsFormData(profile))).success
            ).toBe(true);
            expect(mocks.setShowcase).not.toHaveBeenCalled();
        });
        it("고른 키를 순서대로, 빈 값이면 자동(빈 목록)으로 저장한다", async () => {
            await saveSettingsProfile(
                settingsFormData({
                    ...profile,
                    achievementShowcase: "pianist,s-rank",
                })
            );
            expect(mocks.setShowcase).toHaveBeenLastCalledWith(9, [
                "pianist",
                "s-rank",
            ]);
            await saveSettingsProfile(
                settingsFormData({ ...profile, achievementShowcase: "" })
            );
            expect(mocks.setShowcase).toHaveBeenLastCalledWith(9, []);
        });
        it("4개 이상 · 형식이 틀리면 저장 전에 막는다", async () => {
            for (const value of ["a,b,c,d", "S-RANK", "a,,b"]) {
                const result = await saveSettingsProfile(
                    settingsFormData({ ...profile, achievementShowcase: value })
                );
                expect(result.success).toBe(false);
            }
            expect(mocks.setShowcase).not.toHaveBeenCalled();
            expect(mocks.updateUser).not.toHaveBeenCalled();
        });
        it("얻지 않은 업적이면 프로필도 저장하지 않는다", async () => {
            mocks.setShowcase.mockResolvedValueOnce({ status: "not-earned" });
            const result = await saveSettingsProfile(
                settingsFormData({ ...profile, achievementShowcase: "pianist" })
            );
            expect(result).toMatchObject({
                success: false,
                fieldErrors: {
                    achievementShowcase: ["achievement.pin.failed"],
                },
            });
            expect(mocks.updateUser).not.toHaveBeenCalled();
        });
    });
    describe("고정 기록(2026-09-26 S2)", () => {
        it("폼에 칸이 없으면 건드리지 않고, 있으면 고른 순서대로 · 빈 값은 자동으로 저장한다", async () => {
            await saveSettingsProfile(settingsFormData(profile));
            expect(mocks.setPinned).not.toHaveBeenCalled();
            await saveSettingsProfile(
                settingsFormData({
                    ...profile,
                    pinnedRecords: JSON.stringify([
                        { chartId: 5, comment: "첫 S" },
                        { chartId: 2, comment: null },
                    ]),
                })
            );
            expect(mocks.setPinned).toHaveBeenLastCalledWith(9, [
                { chartId: 5, comment: "첫 S" },
                { chartId: 2, comment: null },
            ]);
            await saveSettingsProfile(
                settingsFormData({ ...profile, pinnedRecords: "" })
            );
            expect(mocks.setPinned).toHaveBeenLastCalledWith(9, []);
        });
        it("형식이 틀리거나 점수가 없는 채보면 프로필도 저장하지 않는다", async () => {
            const bad = await saveSettingsProfile(
                settingsFormData({ ...profile, pinnedRecords: "[1,2" })
            );
            expect(bad.success).toBe(false);
            expect(mocks.setPinned).not.toHaveBeenCalled();
            mocks.setPinned.mockResolvedValueOnce({ status: "not-played" });
            const result = await saveSettingsProfile(
                settingsFormData({
                    ...profile,
                    pinnedRecords: JSON.stringify([
                        { chartId: 5, comment: null },
                    ]),
                })
            );
            expect(result).toMatchObject({
                success: false,
                fieldErrors: { pinnedRecords: ["profile.pinned.failed"] },
            });
            expect(mocks.updateUser).not.toHaveBeenCalled();
        });
    });
});
