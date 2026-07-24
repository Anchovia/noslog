import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

interface OfficialTierDefinition {
    slug: string;
    legacySlugs: string[];
    title: string;
    mode: "basic" | "recital";
    goal: "s" | "fc" | "pianist";
    description: string;
}

const definitions = JSON.parse(
    fs.readFileSync(
        path.join(process.cwd(), "prisma/data/official-tier-lists.json"),
        "utf8"
    )
) as OfficialTierDefinition[];

describe("공식 상수 서열표 가져오기 데이터", () => {
    it("Basic과 Recital의 목표별 서열표 6개를 정의한다", () => {
        expect(definitions.map(({ mode, goal }) => `${mode}:${goal}`)).toEqual([
            "basic:s",
            "basic:fc",
            "basic:pianist",
            "recital:s",
            "recital:fc",
            "recital:pianist",
        ]);
    });

    it("slug와 제목이 중복되지 않는다", () => {
        expect(new Set(definitions.map(({ slug }) => slug)).size).toBe(6);
        expect(new Set(definitions.map(({ title }) => title)).size).toBe(6);
    });

    it("새 목표별 서열표는 기존 난이도별 slug를 재사용하지 않는다", () => {
        expect(
            definitions.every(({ legacySlugs }) => legacySlugs.length === 0)
        ).toBe(true);
    });
});
