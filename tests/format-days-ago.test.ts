import { describe, expect, it } from "vitest";

import { formatDaysAgo } from "@/lib/music/scoreTrend";

describe("formatDaysAgo", () => {
    const now = new Date(2026, 8, 17, 23, 30);
    it("counts calendar days in the device's local date", () => {
        expect(formatDaysAgo("2026-09-17 00:10", "ko", now)).toBe("오늘");
        expect(formatDaysAgo("2026-09-16", "ko", now)).toBe("어제");
        expect(formatDaysAgo("2026/07/26 12:00", "ko", now)).toBe("53일 전");
        expect(formatDaysAgo("2026-09-14", "en", now)).toBe("3 days ago");
        expect(formatDaysAgo("2026-09-14", "ja", now)).toBe("3 日前");
    });
    it("never shows a future date", () => {
        expect(formatDaysAgo("2026-09-18", "ko", now)).toBe("오늘");
    });
});
