import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
    inspectTsxTokens,
    reachableTsxFiles,
} from "../tooling/design/tsx-tokens.mjs";

// 관리자 · 채보 에디터도 공개 화면과 같은 검사(2026-10-15 B5 2단계) — Tailwind 는 nl 별칭만, 기본 스케일 · 임의값 · 옛 이름 금지.
// 대상 = /admin 라우트가 import 로 닿는 모든 TSX(관리자 전용 부품 · 채보 에디터 · 에디터 옛 셸 포함). 공개 화면 검사는 design-tsx-tokens
describe("관리자 · 채보 에디터 TSX 토큰", () => {
    it("관리자 경로가 닿는 TSX 가 토큰 · nl 별칭만 쓴다", () => {
        const files = reachableTsxFiles(resolve("."), {
            routes: "app/admin",
            excludedRoutes: /^$/,
        }).filter(
            (path) =>
                !path.endsWith(".stories.tsx") &&
                // 공개 채보 뷰어(미리보기가 씀)는 공개 화면 검사 쪽 계약
                !path.startsWith("components/chart-pattern/")
        );
        // 관리자 화면 · 에디터 · 관리자 전용 기능 부품이 실제로 들어오는지
        for (const path of [
            "app/admin/syncs/page.tsx",
            "components/admin/chart-pattern/chartTimingEditor.tsx",
            "components/layout/header-navigation.tsx",
            "features/tiers/components/tier-board.tsx",
            "features/arcades/components/arcade-form.tsx",
        ])
            expect(files).toContain(path);
        const styles = readdirSync("app/styles")
            .filter((file) => file.endsWith(".css"))
            .map((file) => readFileSync(join("app/styles", file), "utf8"))
            .join("\n");
        const declared = new Set(
            [...styles.matchAll(/(--nl-[\w-]+)\s*:/g)].map((match) => match[1])
        );
        const sources = files.map((file) => ({
            file,
            source: readFileSync(file, "utf8"),
        }));
        for (const { source } of sources)
            for (const match of source.matchAll(/["'](--nl-[\w-]+)["']\s*:/g))
                declared.add(match[1]);
        expect(
            sources.flatMap(({ file, source }) =>
                inspectTsxTokens(file, source, declared)
            )
        ).toEqual([]);
    }, 30_000);
});
