import { describe, expect, it } from "vitest";

import {
    contributionLevel,
    contributionProgress,
    nameLabelFor,
    seoulDateKey,
} from "@/features/contributions/contributionLevel";

describe("contributionLevel", () => {
    it("점수 기준 1 · 10 · 30 · 100 · 300 · 1,000 으로 Lv.1–6", () => {
        expect(contributionLevel(0)).toEqual({
            level: 0,
            points: 0,
            next: 1,
            floor: 0,
        });
        expect(contributionLevel(1).level).toBe(1);
        expect(contributionLevel(9).level).toBe(1);
        expect(contributionLevel(10).level).toBe(2);
        expect(contributionLevel(42)).toEqual({
            level: 3,
            points: 42,
            next: 100,
            floor: 30,
        });
        expect(contributionLevel(1000)).toMatchObject({ level: 6, next: null });
        expect(contributionLevel(-5).level).toBe(0);
    });

    it("진행도는 지금 등급 시작에서 다음 등급까지", () => {
        expect(contributionProgress(contributionLevel(30))).toBe(0);
        expect(contributionProgress(contributionLevel(65))).toBe(0.5);
        expect(contributionProgress(contributionLevel(5000))).toBe(1);
    });
});

describe("nameLabelFor", () => {
    it("운영자는 점수와 상관없이 역할 라벨", () => {
        expect(nameLabelFor("admin", 0)).toEqual({ kind: "operator" });
    });

    it("이름 옆은 Lv.3 부터, 프로필은 Lv.1 부터", () => {
        expect(nameLabelFor("user", 29)).toBeNull();
        expect(nameLabelFor("user", 30)).toEqual({
            kind: "level",
            level: 3,
            points: 30,
        });
        expect(nameLabelFor("user", 1, 1)).toEqual({
            kind: "level",
            level: 1,
            points: 1,
        });
        expect(nameLabelFor("user", 0, 1)).toBeNull();
    });
});

describe("seoulDateKey", () => {
    it("기체 확인 하루 1점은 서울 날짜로 나눈다", () => {
        expect(seoulDateKey(new Date("2026-09-23T14:59:59Z"))).toBe(
            "2026-09-23"
        );
        expect(seoulDateKey(new Date("2026-09-23T15:00:00Z"))).toBe(
            "2026-09-24"
        );
    });
});
