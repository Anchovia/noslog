import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    query: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/admin", () => ({ requireAdmin: mocks.requireAdmin }));
// 어떤 표 · 메서드를 불러도 같은 가짜를 돌려준다 — 권한 확인 전에 DB 에 닿는지만 본다
vi.mock("@/lib/db", () => ({
    default: new Proxy(
        {},
        { get: () => new Proxy({}, { get: () => mocks.query }) }
    ),
}));

import {
    getAdminAnnouncement,
    listAdminAnnouncements,
} from "@/features/announcements/server/announcement-admin-data";
import { listAdminArcades } from "@/features/arcades/server/arcade-admin-data";
import {
    getAdminBingo,
    listAdminBingos,
    listBingoMusicOptions,
} from "@/features/bingos/server/bingo-admin-data";
import { listAdminExams } from "@/features/exams/server/exam-admin-data";
import {
    getAdminChartPatternEditor,
    getAdminChartPatternPreview,
} from "@/features/music/server/chart-pattern-data";
import { getPollInput } from "@/features/polls/server/poll-service";
import {
    countAdminTierEntries,
    getAdminTierList,
    getLegacyTierListWithEntries,
    listAdminTierEntries,
    listAdminTierLists,
} from "@/features/tiers/server/tier-admin-data";

function adminPages(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return adminPages(path);
        return entry.name === "page.tsx" ? [path] : [];
    });
}

// 레이아웃의 requireAdmin 은 307 을 내도 페이지 RSC 데이터가 같은 응답에 실린다. 페이지마다 먼저 확인한다
describe("관리자 페이지 권한 확인", () => {
    it("app/admin 의 모든 page 가 맨 처음 requireAdmin 을 기다린다", () => {
        const pages = adminPages("app/admin");
        expect(pages.length).toBeGreaterThan(20);
        const missing = pages.filter((file) => {
            const source = readFileSync(file, "utf8");
            const body = source.match(
                /export default async function \w+\([\s\S]*?\)\s*\{\n\s*(.+)/
            );
            return body?.[1].trim() !== "await requireAdmin();";
        });
        expect(missing).toEqual([]);
    });
});

describe("관리자 데이터 함수 권한 확인", () => {
    beforeEach(() => {
        mocks.requireAdmin.mockRejectedValue(new Error("NEXT_REDIRECT"));
        mocks.query.mockResolvedValue(null);
    });

    const calls: [string, () => Promise<unknown>][] = [
        ["listAdminTierLists", () => listAdminTierLists()],
        ["getAdminTierList", () => getAdminTierList(1)],
        ["listAdminTierEntries", () => listAdminTierEntries(1, {}, 1, 20)],
        ["countAdminTierEntries", () => countAdminTierEntries(1, {})],
        ["getLegacyTierListWithEntries", () => getLegacyTierListWithEntries(1)],
        ["listAdminAnnouncements", () => listAdminAnnouncements()],
        ["getAdminAnnouncement", () => getAdminAnnouncement(1)],
        ["listAdminArcades", () => listAdminArcades()],
        ["listAdminBingos", () => listAdminBingos()],
        ["listBingoMusicOptions", () => listBingoMusicOptions()],
        ["getAdminBingo", () => getAdminBingo(1)],
        ["listAdminExams", () => listAdminExams({})],
        [
            "getAdminChartPatternEditor",
            () => getAdminChartPatternEditor("1", "Normal"),
        ],
        [
            "getAdminChartPatternPreview",
            () => getAdminChartPatternPreview("1", "Normal"),
        ],
        ["getPollInput(공지)", () => getPollInput({ announcementId: 1 })],
    ];

    it.each(calls)(
        "%s 는 관리자가 아니면 DB 를 읽지 않는다",
        async (_, call) => {
            await expect(call()).rejects.toThrow("NEXT_REDIRECT");
            expect(mocks.query).not.toHaveBeenCalled();
        }
    );

    it("이벤트 투표 조회는 작성자 화면이 쓰므로 관리자 확인을 하지 않는다", async () => {
        await expect(getPollInput({ eventId: 1 })).resolves.toBeNull();
        expect(mocks.requireAdmin).not.toHaveBeenCalled();
    });
});
