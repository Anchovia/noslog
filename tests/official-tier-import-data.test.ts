import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

interface OfficialTierDefinition {
    slug: string;
    legacySlugs: string[];
    title: string;
    mode: "basic" | "recital";
    difficulty: "Expert" | "Real";
    description: string;
}

const definitions = JSON.parse(
    fs.readFileSync(
        path.join(process.cwd(), "prisma/data/official-tier-lists.json"),
        "utf8"
    )
) as OfficialTierDefinition[];

describe("공식 상수 서열표 가져오기 데이터", () => {
    it("Basic과 Recital의 Real/Expert 서열표를 각각 정의한다", () => {
        expect(
            definitions.map(({ mode, difficulty }) => `${mode}:${difficulty}`)
        ).toEqual([
            "basic:Real",
            "recital:Real",
            "basic:Expert",
            "recital:Expert",
        ]);
    });

    it("slug와 제목이 중복되지 않는다", () => {
        expect(new Set(definitions.map(({ slug }) => slug)).size).toBe(4);
        expect(new Set(definitions.map(({ title }) => title)).size).toBe(4);
    });

    it("기존 전체 서열표 slug를 Real 서열표로 이전한다", () => {
        expect(
            definitions.find(({ slug }) => slug === "basic-real")?.legacySlugs
        ).toContain("basic-all");
        expect(
            definitions.find(({ slug }) => slug === "recital-real")?.legacySlugs
        ).toContain("recital-all");
    });
});
