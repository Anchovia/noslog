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
    invalidateRecords: vi.fn(),
    clearOpinionTranslations: vi.fn(),
    clearReplyTranslations: vi.fn(),
}));
vi.mock("@/lib/session", () => ({ default: async () => mocks.session }));
vi.mock("@/lib/db", () => {
    const db = {
        user: { findUnique: mocks.findUser, update: mocks.updateUser },
        arcade: { findFirst: mocks.findArcade },
        communityChartEvaluation: {
            updateMany: mocks.clearOpinionTranslations,
        },
        communityOpinionReply: { updateMany: mocks.clearReplyTranslations },
        $transaction: (run: (tx: unknown) => Promise<unknown>) => run(db),
    };
    return { default: db };
});
vi.mock("@/features/partner/server/oauth-service", () => ({
    enqueueRecordsInvalidationForUser: mocks.invalidateRecords,
}));
vi.mock("next/cache", () => ({ updateTag: mocks.updateTag }));
vi.mock("@/lib/blob", () => ({
    isValidImageBlob: mocks.validateBlob,
    deleteBlobIfOwned: mocks.deleteBlob,
}));
vi.mock("@/lib/observability/server", () => ({ logServerError: mocks.log }));
vi.mock("@/features/achievements/server/achievement-service", () => ({
    setAchievementShowcase: mocks.setShowcase,
}));
vi.mock("@/features/profile/server/profile-pinned-service", () => ({
    setPinnedRecords: mocks.setPinned,
}));
vi.mock("@/lib/i18n/server", () => ({
    getServerI18n: async () => ({ t: (key: string) => key }),
}));

import {
    saveSettingsProfile,
    saveSettingsPrivacy,
} from "@/features/settings/server/settings-save-service";
import { settingsFormData } from "@/features/settings/schemas/settings-schema";

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
    allowTranslation: false,
};

describe("P10 settings save boundaries", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.session.id = 9;
        mocks.session.profileCompleted = true;
        mocks.findUser.mockResolvedValue({
            username: profile.username,
            country: "ja-JP",
            avatar: null,
            preferredArcadeId: null,
            hidePlayScores: true,
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
            hideDiscordName: "false",
            discordId: "another",
        });
        expect((await saveSettingsProfile(data)).success).toBe(true);
        expect(mocks.updateUser).toHaveBeenCalledWith({
            where: { id: 9, avatar: null },
            data: {
                username: profile.username,
                country: "ja-JP",
                preferredArcadeId: null,
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
            preferredArcadeId: 3,
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
            preferredArcadeId: null,
        });
        expect(
            (await saveSettingsProfile(settingsFormData(profile))).success
        ).toBe(true);
        expect(mocks.updateUser).toHaveBeenCalledWith({
            where: { id: 9, avatar: "https://example.com/old.png" },
            data: {
                username: profile.username,
                country: "ja-JP",
                preferredArcadeId: null,
                avatar: null,
                avatarUserManaged: true,
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
            preferredArcadeId: null,
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
    describe("바뀐 값이 들어 있는 캐시만 비운다(2026-10-15 S4)", () => {
        it("닉네임 · 국가 · 아바타가 그대로면 본인 프로필만", async () => {
            await saveSettingsProfile(settingsFormData(profile));
            expect(mocks.updateTag.mock.calls).toEqual([["user-profile-9"]]);
        });
        it("닉네임이 바뀌면 랭킹 · 악곡 랭킹도", async () => {
            await saveSettingsProfile(
                settingsFormData({ ...profile, username: "새이름" })
            );
            expect(mocks.updateTag.mock.calls).toEqual([
                ["user-profile-9"],
                ["user-rankings"],
                ["chart-rankings"],
            ]);
        });
        it("국가가 바뀌면 남의 국가 순위 숫자도(D8 · B6)", async () => {
            await saveSettingsProfile(
                settingsFormData({ ...profile, country: "ko-KR" })
            );
            expect(mocks.updateTag.mock.calls).toEqual([
                ["user-profile-9"],
                ["user-rankings"],
                ["chart-rankings"],
                ["user-profiles"],
            ]);
        });
        it("선호 오락실이 바뀌면 오락실 정보도", async () => {
            await saveSettingsProfile(
                settingsFormData({ ...profile, preferredArcadeId: "3" })
            );
            expect(mocks.updateTag.mock.calls).toEqual([
                ["user-profile-9"],
                ["arcades"],
            ]);
        });
        it("점수 비공개를 그대로 두고 다른 스위치만 바꾸면 본인 프로필만", async () => {
            await saveSettingsPrivacy(settingsFormData(privacy));
            expect(mocks.updateTag.mock.calls).toEqual([["user-profile-9"]]);
        });
        it("점수 비공개를 바꾸면 랭킹 · 악곡 랭킹 · 남의 순위 숫자도", async () => {
            await saveSettingsPrivacy(
                settingsFormData({ ...privacy, showPlayScores: true })
            );
            expect(mocks.updateTag.mock.calls).toEqual([
                ["user-profile-9"],
                ["user-rankings"],
                ["chart-rankings"],
                ["user-profiles"],
            ]);
        });
    });
    it("requires every privacy choice instead of treating omitted fields as private", async () => {
        const data = settingsFormData(privacy);
        data.delete("showDiscordIdentity");
        expect((await saveSettingsPrivacy(data)).success).toBe(false);
        data.set("showDiscordIdentity", "on");
        expect((await saveSettingsPrivacy(data)).success).toBe(false);
        expect(mocks.updateUser).not.toHaveBeenCalled();
    });
    it("updates only the privacy fields on the authenticated account", async () => {
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
                hideNostalgiaName: false,
                hideDiscordName: true,
                hidePreferredArcade: false,
                hidePlayCount: true,
                hidePlayActivity: true,
                hidePlayScores: true,
                translationConsentAt: null,
            },
        });
        expect(mocks.deleteBlob).not.toHaveBeenCalled();
    });
    it("번역 동의는 처음 켠 시각을 지키고, 거두면 만들어 둔 번역을 지운다", async () => {
        const consentedAt = new Date("2026-10-01T00:00:00Z");
        const dataOf = () => mocks.updateUser.mock.calls.at(-1)?.[0].data;

        mocks.findUser.mockResolvedValue({ translationConsentAt: null });
        await saveSettingsPrivacy(
            settingsFormData({ ...privacy, allowTranslation: true })
        );
        expect(dataOf().translationConsentAt).toBeInstanceOf(Date);

        mocks.findUser.mockResolvedValue({ translationConsentAt: consentedAt });
        await saveSettingsPrivacy(
            settingsFormData({ ...privacy, allowTranslation: true })
        );
        expect(dataOf().translationConsentAt).toBe(consentedAt);
        expect(mocks.clearOpinionTranslations).not.toHaveBeenCalled();

        await saveSettingsPrivacy(settingsFormData(privacy));
        expect(dataOf().translationConsentAt).toBeNull();
        expect(mocks.clearOpinionTranslations).toHaveBeenCalledWith(
            expect.objectContaining({ where: { userId: 9 } })
        );
        expect(mocks.clearReplyTranslations).toHaveBeenCalledWith(
            expect.objectContaining({ where: { userId: 9 } })
        );
    });
    it("점수나 활동을 공개에서 비공개로 바꿀 때만 파트너 기록 무효화를 같은 트랜잭션에 넣는다", async () => {
        const open = { hidePlayScores: false, hidePlayActivity: false };
        const save = (values: Partial<typeof privacy>) =>
            saveSettingsPrivacy(settingsFormData({ ...privacy, ...values }));

        mocks.findUser.mockResolvedValue(open);
        await save({ showPlayScores: false, showPlayActivity: true });
        expect(mocks.invalidateRecords).toHaveBeenCalledTimes(1);
        expect(mocks.invalidateRecords.mock.calls[0]?.[1]).toBe(9);

        mocks.invalidateRecords.mockClear();
        await save({ showPlayScores: true, showPlayActivity: false });
        expect(mocks.invalidateRecords).toHaveBeenCalledTimes(1);

        mocks.invalidateRecords.mockClear();
        await save({ showPlayScores: true, showPlayActivity: true });
        mocks.findUser.mockResolvedValue({
            hidePlayScores: true,
            hidePlayActivity: true,
        });
        await save({ showPlayScores: false, showPlayActivity: false });
        await save({ showPlayScores: true, showPlayActivity: true });
        expect(mocks.invalidateRecords).not.toHaveBeenCalled();
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
