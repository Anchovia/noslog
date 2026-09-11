import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

interface OfficialTierDefinition {
    slug: string;
    legacySlugs: string[];
    title: string;
    mode: "basic" | "recital";
    goal: "s" | "990k" | "pianist";
    description: string;
}

const definitions = JSON.parse(
    fs.readFileSync(
        path.join(process.cwd(), "prisma/data/official-tier-lists.json"),
        "utf8"
    )
) as OfficialTierDefinition[];

describe("공식 상수 서열표 가져오기 데이터", () => {
    it("Basic 3개(S·990k·Pianist)와 Recital 1개를 정의한다", () => {
        expect(definitions.map(({ mode, goal }) => `${mode}:${goal}`)).toEqual([
            "basic:s",
            "basic:990k",
            "basic:pianist",
            "recital:pianist",
        ]);
    });

    it("slug와 제목이 중복되지 않는다", () => {
        expect(new Set(definitions.map(({ slug }) => slug)).size).toBe(4);
        expect(new Set(definitions.map(({ title }) => title)).size).toBe(4);
    });

    it("990k 서열표만 이전 Full Combo 서열표 slug를 이어받는다", () => {
        expect(definitions.flatMap(({ legacySlugs }) => legacySlugs)).toEqual([
            "basic-fc",
        ]);
        expect(
            definitions.find(({ slug }) => slug === "basic-990k")?.legacySlugs
        ).toEqual(["basic-fc"]);
    });
});
