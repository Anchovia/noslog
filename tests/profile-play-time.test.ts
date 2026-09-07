import { describe, expect, it } from "vitest";
import { formatProfilePlayTime } from "@/lib/profile/profilePlayTime";

describe("profile play time", () => {
    it("uses stable localized literals and an explicit Korean game timezone", () => {
        const source = "2026-08-11 21:04:00";
        expect(formatProfilePlayTime(source, "ko")).toEqual({
            label: "8월 11일 21:04",
            dateTime: "2026-08-11T12:04:00.000Z",
        });
        expect(formatProfilePlayTime(source, "ja")?.label).toBe(
            "8月11日 21:04"
        );
        expect(formatProfilePlayTime(source, "en")?.label).toBe(
            "Aug 11, 21:04"
        );
        expect(formatProfilePlayTime("2026-08-11T12:04:00Z", "en")).toEqual(
            formatProfilePlayTime(source, "en")
        );
    });
    it("handles midnight, missing values and invalid source data without invented timestamps", () => {
        expect(formatProfilePlayTime("2026-08-11 00:04:00", "en")?.label).toBe(
            "Aug 11, 00:04"
        );
        expect(formatProfilePlayTime(null, "ko")).toBeNull();
        expect(formatProfilePlayTime("unavailable", "ko")).toEqual({
            label: "unavailable",
            dateTime: undefined,
        });
    });
});
