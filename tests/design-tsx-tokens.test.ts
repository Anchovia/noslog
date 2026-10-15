import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
    inspectTsxTokens,
    reachableTsxFiles,
} from "../tooling/design/tsx-tokens.mjs";

const tokens = new Set([
    "--nl-spacing-4",
    "--nl-content-primary",
    "--nl-difficulty-hard",
]);
const inspect = (source: string) =>
    inspectTsxTokens("fixture.tsx", source, tokens);

describe("TSX design token checks", () => {
    it("rejects misspelled token references, including fallbacks", () => {
        expect(
            inspect(
                '<div style={{ color: "var(--nl-contnet-primary, red)" }} />'
            )
        ).toEqual(["fixture.tsx:1: unknown token --nl-contnet-primary"]);
    });
    it("accepts known tokens and declared dynamic token families", () => {
        expect(
            inspect(
                '<div style={{ padding: "var(--nl-spacing-4)", color: `var(--nl-difficulty-${difficulty})` }} />'
            )
        ).toEqual([]);
        expect(
            inspect(
                "<div style={{ color: `var(--nl-unknown-${level})` }} />"
            )[0]
        ).toContain("unknown token --nl-unknown-");
    });
    it("rejects literal appearance values through local constants and spreads", () => {
        const violations = inspect(
            'const spacing = { padding: 8 }; const style = { ...spacing, fontSize: "14px", color: "#ffffff" }; <div style={style} />'
        );
        expect(violations).toHaveLength(3);
        expect(violations.join("\n")).toContain(
            "padding must use a shared token"
        );
    });
    it("checks both conditional branches and arbitrary utility values", () => {
        expect(
            inspect(
                '<div style={open ? { gap: 8 } : { margin: "1rem" }} className="bg-[#fff] rounded-[6px]" />'
            )
        ).toHaveLength(4);
    });
    it("checks literal values inside property branches and negative lengths", () => {
        expect(
            inspect("<div style={{ marginTop: -4, gap: open ? 8 : 0 }} />")
        ).toHaveLength(2);
    });

    it("allows zero, computed geometry, data colors and caller-provided styles", () => {
        expect(
            inspect(
                '<div style={{ margin: 0, width: `${progress}%`, height: pixels, left: point.x, backgroundPosition: "center", borderStyle: "solid", clipPath: "url(#abc)", color: item.color, gap: computedGap, padding: "calc(var(--nl-spacing-4) * 2)", ...style }} />'
            )
        ).toEqual([]);
    });

    // Tailwind 은 nl 별칭만 — 기본 스케일 · 임의값 금지, 0 · 키워드 값은 허용(2026-10-15 사용자, 가이드 1절)
    it("rejects Tailwind default scales and arbitrary values in class names", () => {
        expect(
            inspect(
                '<div className="p-3 md:gap-2 -mt-4 rounded-md text-sm font-bold z-10 shadow-lg opacity-50 size-4 border w-[13px]" />'
            )
        ).toHaveLength(12);
        expect(
            inspect(
                'const iconClass = "size-4"; <Icon className={cn("h-11", open && "leading-tight")} />'
            )
        ).toHaveLength(3);
    });
    it("takes floating overlay offsets from the shared constant", () => {
        expect(
            inspect(
                "<Content sideOffset={8} collisionPadding={16} alignOffset={overlayPosition.sideOffset} />"
            )
        ).toHaveLength(2);
    });
    it("allows nl aliases, zero, keywords, fractions and non-class strings", () => {
        expect(
            inspect(
                '<div className={cn("gap-nl-16 p-0 m-0 w-full min-w-0 size-full left-1/2 rounded-nl-field opacity-0 z-auto shrink-0 flex-1 grid-cols-2 nl-body md:px-nl-24", open && "rounded-none")} data-rank="top-10" />'
            )
        ).toEqual([]);
    });

    it("keeps public TSX token references and literal appearance values consistent", () => {
        // 공개 TSX = 관리자 밖 라우트(app/, /admin 제외)가 import 로 닿는 모든 TSX. 관리자만 쓰는 부품은 저절로 빠진다.
        // 관리자 · 채보 에디터(admin · editor 경로)는 tests/admin-tsx-tokens.test.ts 가 같은 검사로 본다(B5 2단계). 공개 채보 뷰어(chart-pattern)는 여기서 본다.
        // 고정 크기 이미지(Satori — 프로필 카드 · 공유 미리보기)는 CSS 토큰을 못 읽는 별도 계약이다.
        const files = reachableTsxFiles(resolve("."), {
            excludedRoutes: /^app\/admin(?:\/|$)/,
        }).filter(
            (path) =>
                !/(?:^|\/)(?:admin|editor)(?:\/|$)/.test(path) &&
                path !== "features/profile/components/profile-card-image.tsx" &&
                path !== "lib/metadata/brand-image.tsx"
        );
        // 예전 폴더 목록에서 빠졌던 공개 부품 폴더도 들어오는지(components/profile 의 아바타는 관리자 헤더만 써서 빠진다)
        for (const folder of [
            "components/ui/",
            "components/layout/",
            "components/music/",
            "components/i18n/",
            "components/providers/",
            "components/bingo/",
            "components/chart-pattern/",
        ])
            expect(files.some((path) => path.startsWith(folder))).toBe(true);
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
        // Chart sizing and other component-owned custom properties can be declared in style objects.
        for (const { source } of sources)
            for (const match of source.matchAll(/["'](--nl-[\w-]+)["']\s*:/g))
                declared.add(match[1]);
        expect(
            sources.flatMap(({ file, source }) =>
                inspectTsxTokens(file, source, declared)
            )
        ).toEqual([]);
        // 300개 남짓을 import 로 따라가며 파싱한다 — 전체 테스트와 함께 돌면 5초를 넘길 때가 있다
    }, 30_000);

    // 올림 면은 제 면 위 6% 겹침 — 면 색을 바꾸는 hover:bg-* 대신 공용 nl-hover-layer(2026-10-15 hover 점검).
    // 관리자 · 에디터 · 채보 뷰어까지 모든 TSX 를 본다
    it("paints hover surfaces with the shared state layer, not a swapped background", () => {
        const offenders: string[] = [];
        function walk(directory: string) {
            for (const entry of readdirSync(directory, {
                withFileTypes: true,
            })) {
                const path = join(directory, entry.name);
                if (entry.isDirectory()) walk(path);
                else if (path.endsWith(".tsx"))
                    readFileSync(path, "utf8")
                        .split("\n")
                        .forEach((line, index) => {
                            if (/(?:^|[\s"'`:])hover:bg-/.test(line))
                                offenders.push(`${path}:${index + 1}`);
                        });
            }
        }
        ["app", "features", "components", "lib"].forEach(walk);
        expect(offenders).toEqual([]);
    });
});
