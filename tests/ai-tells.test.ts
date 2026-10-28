import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

import { enMessages } from "@/lib/i18n/message-catalogs/en";
import { jaMessages } from "@/lib/i18n/message-catalogs/ja";
import { koMessages } from "@/lib/i18n/message-catalogs/ko";

// docs/ai-check.md 의 기계로 잴 수 있는 줄(1 · 5 · 9 · 13 · 14 · 16 · 18)을 막는다.
// 허용 목록은 가이드에 적힌 의도된 효과만 — 새 항목은 가이드를 먼저 고친 뒤에 더한다.

const catalogs = { ko: koMessages, ja: jaMessages, en: enMessages };

const bannedWords: Record<keyof typeof catalogs, RegExp[]> = {
    ko: [
        /완벽(하게|한)/,
        /획기적/,
        /혁신적/,
        /손쉽게/,
        /알아보겠습니다/,
        /결론적으로/,
    ],
    ja: [/させていただ/, /いかがでしたか/],
    en: [
        /\bseamless(ly)?\b/i,
        /\beffortless(ly)?\b/i,
        /\bsupercharge/i,
        /\bdelve/i,
        /\belevate/i,
        /\btapestry\b/i,
        /\boops\b/i,
        /\brevolutionary\b/i,
        /\bgame-chang/i,
    ],
};

describe("메시지 카탈로그의 AI 티", () => {
    for (const [locale, messages] of Object.entries(catalogs)) {
        const entries = Object.entries(messages as Record<string, string>);

        it(`${locale}: 이모지 · 느낌표 · 줄표(—)가 없다`, () => {
            const found = entries
                .filter(([, value]) =>
                    /(?![©®™])\p{Extended_Pictographic}|[!！]|—/u.test(value)
                )
                .map(([key, value]) => `${key}: ${value}`);
            expect(found).toEqual([]);
        });

        it(`${locale}: 과장어 · 상투어가 없다`, () => {
            const words = bannedWords[locale as keyof typeof catalogs];
            const found = entries
                .filter(([, value]) => words.some((word) => word.test(value)))
                .map(([key, value]) => `${key}: ${value}`);
            expect(found).toEqual([]);
        });
    }
});

const styleDirectory = resolve("app/styles");
const styleFiles = readdirSync(styleDirectory).filter(
    (name) => name.endsWith(".css") && name !== "pretendard-jp.css"
);

type Allowed = { file: string; selector: string; reason: string };

// 그라데이션 — 단색 겹침(같은 토큰 둘) · 마스크 칠(#000 0 0)은 장식이 아니라 칠하는 방법이라 따로 허용한다
const allowedGradients: Allowed[] = [
    { file: "foundation.css", selector: ".nl-fade-end", reason: "끝 페이드" },
    {
        file: "home.css",
        selector: ".nl-home-event__caption",
        reason: "홈 이벤트 배너 글자 층",
    },
    {
        file: "music-detail.css",
        selector: ".nl-grade-progress__fill",
        reason: "그레이드 진행 막대 등급 색",
    },
    {
        file: "chartViewer.css",
        selector: ".nl-chart-stage__overlay",
        reason: "채보 뷰어 조작 줄 판",
    },
    {
        file: "player-identity.css",
        selector: ".nl-exam-badge__arc",
        reason: "Recital 명판 파인 모서리",
    },
    {
        file: "tiers.css",
        selector: '.nl-tier-card__outline[data-achievement="goal-fc"]',
        reason: "서열표 달성 + FC 테두리",
    },
];

// 흐림 · 글자 그림자 · 그림자 필터
const allowedEffects: Allowed[] = [
    {
        file: "community.css",
        selector: ".nl-pattern-lock",
        reason: "패턴 투표 잠금 흐림",
    },
    {
        file: "arcades.css",
        selector: ".nl-arcade-marker__pin",
        reason: "지도 핀 그림자",
    },
];

const flatFill = /^linear-gradient\(\s*(var\([^()]+\))\s*,\s*\1\s*\)$/;
const maskFill = /^linear-gradient\(#000 0 0\)/;

function collect(test: (prop: string, value: string) => boolean) {
    const found: { file: string; selector: string; text: string }[] = [];
    for (const file of styleFiles) {
        postcss
            .parse(readFileSync(join(styleDirectory, file), "utf8"))
            .walkDecls((decl) => {
                const value = decl.value.replace(/\s+/g, " ").trim();
                if (!test(decl.prop, value)) return;
                const selector =
                    decl.parent?.type === "rule"
                        ? (decl.parent as postcss.Rule).selector
                        : "";
                found.push({ file, selector, text: `${decl.prop}: ${value}` });
            });
    }
    return found;
}

function outside(found: ReturnType<typeof collect>, allowed: Allowed[]) {
    return found
        .filter(
            ({ file, selector }) =>
                !allowed.some(
                    (entry) =>
                        entry.file === file && selector.includes(entry.selector)
                )
        )
        .map(({ file, selector, text }) => `${file} ${selector} — ${text}`);
}

describe("CSS 의 AI 티", () => {
    const gradients = collect(
        (_prop, value) =>
            /gradient\(/.test(value) &&
            !flatFill.test(value) &&
            !maskFill.test(value)
    );
    const effects = collect(
        (prop, value) =>
            prop === "text-shadow" ||
            /^(-webkit-)?backdrop-filter$/.test(prop) ||
            (/^(-webkit-)?filter$/.test(prop) && /blur|drop-shadow/.test(value))
    );

    it("그라데이션은 가이드에 적힌 자리에만 쓴다", () => {
        expect(outside(gradients, allowedGradients)).toEqual([]);
    });

    it("흐림 · 글자 그림자 · 그림자 필터는 가이드에 적힌 자리에만 쓴다", () => {
        expect(outside(effects, allowedEffects)).toEqual([]);
    });

    it("허용 목록에 쓰지 않는 항목이 남아 있지 않다", () => {
        const stale = [
            ...allowedGradients.filter(
                (entry) =>
                    !gradients.some(
                        (item) =>
                            item.file === entry.file &&
                            item.selector.includes(entry.selector)
                    )
            ),
            ...allowedEffects.filter(
                (entry) =>
                    !effects.some(
                        (item) =>
                            item.file === entry.file &&
                            item.selector.includes(entry.selector)
                    )
            ),
        ].map((entry) => `${entry.file} ${entry.selector}`);
        expect(stale).toEqual([]);
    });

    it("transition: all 을 쓰지 않는다", () => {
        const found = collect(
            (prop, value) =>
                /^transition(-property)?$/.test(prop) && /\ball\b/.test(value)
        );
        expect(
            found.map(({ file, selector }) => `${file} ${selector}`)
        ).toEqual([]);
    });

    it("그림자 색은 토큰으로만 쓴다", () => {
        const found = collect(
            (prop, value) =>
                prop === "box-shadow" &&
                /#[0-9a-f]{3,8}\b|\b(rgb|hsl|oklch)a?\(/i.test(value)
        );
        expect(
            found.map(({ file, selector }) => `${file} ${selector}`)
        ).toEqual([]);
    });
});

// 데이터 표시로 쓰는 아이콘(합격 체크 · 업적 그림)은 상태 메시지가 아니라 허용한다
const allowedIcons: { file: string; icon: string; reason: string }[] = [
    {
        file: "/features/exams/components/exam-stages.tsx",
        icon: "CircleCheck",
        reason: "검정 합격 체크 · 통과선 표시",
    },
    {
        file: "/features/achievements/components/achievement-hex.tsx",
        icon: "Sparkles",
        reason: "업적 배지 그림",
    },
];

const bannedIcons = [
    "AlertCircle",
    "AlertTriangle",
    "CheckCircle",
    "CheckCircle2",
    "CircleAlert",
    "CircleCheck",
    "CircleCheckBig",
    "PartyPopper",
    "Rocket",
    "Sparkle",
    "Sparkles",
    "TriangleAlert",
];

function publicSourceFiles(directory: string): string[] {
    return readdirSync(directory).flatMap((name) => {
        const path = join(directory, name);
        if (statSync(path).isDirectory()) {
            if (name === "admin" || name === "node_modules") return [];
            return publicSourceFiles(path);
        }
        return /\.tsx$/.test(name) && !/\.(stories|test)\.tsx$/.test(name)
            ? [path]
            : [];
    });
}

describe("공개 화면 아이콘", () => {
    it("상태 아이콘(빨간 ! · 초록 체크 · 반짝이)을 가져오지 않는다", () => {
        const files = ["app", "features", "components"].flatMap((root) =>
            publicSourceFiles(resolve(root))
        );
        const found: string[] = [];
        for (const file of files) {
            const source = readFileSync(file, "utf8");
            for (const match of source.matchAll(
                /import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*["']lucide-react["']/g
            )) {
                const names = match[1]
                    .split(",")
                    .map((name) => name.trim().split(/\s+as\s+/)[0])
                    .filter(Boolean);
                for (const name of names) {
                    const relative = file.replace(resolve("."), "");
                    const allowed = allowedIcons.some(
                        (entry) =>
                            entry.file === relative && entry.icon === name
                    );
                    if (bannedIcons.includes(name) && !allowed)
                        found.push(`${relative}: ${name}`);
                }
            }
        }
        expect(found).toEqual([]);
    });
});
