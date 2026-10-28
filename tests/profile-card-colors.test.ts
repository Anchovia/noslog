import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { PROFILE_CARD_DARK_HEX } from "@/features/profile/profile-card-colors";
import { profileCardGlobe } from "@/features/profile/profile-card-globe";

describe("프로필 공유 카드 색", () => {
    const css = readFileSync(resolve("app/styles/tokens.css"), "utf8");
    // 첫 블록(.noslog-ui) = 다크 값
    const dark = css.slice(0, css.indexOf("}"));
    const token = (name: string) =>
        dark.match(new RegExp(`--nl-${name}:\\s*(#[0-9a-f]{6})`, "i"))?.[1];
    // 반투명 토큰(rgb(255 255 255 / 10%))은 이미지가 읽는 rgba(255, 255, 255, 0.1) 꼴로 맞춰 비교한다. 불투명 hex 토큰은 그대로
    const rgba = (name: string) => {
        const solid = token(name);
        if (solid) return solid;
        const [r, g, b, a] =
            dark
                .match(new RegExp(`--nl-${name}:\\s*rgb\\(([^)]+)\\)`))?.[1]
                .split(/[\s/]+/) ?? [];
        return `rgba(${r}, ${g}, ${b}, ${parseFloat(a) / 100})`;
    };

    it("카드 색이 tokens.css 의 다크 토큰과 같다(2026-10-01 D9)", () => {
        expect(PROFILE_CARD_DARK_HEX).toEqual({
            ink: token("content-default"),
            flagBorder: token("content-default"),
            subdued: token("content-subdued"),
            divider: rgba("border-divider"),
            emptySurface: token("surface-surface"),
            gold: token("exam-tier-top"),
            pianist: token("judgement-s-just"),
            fullCombo: token("achievement-full-combo"),
            s: token("judgement-just"),
        });
    });

    it("지구본 아이콘 선 색도 흐린 글자색이다", () => {
        const svg = Buffer.from(
            profileCardGlobe.replace("data:image/svg+xml;base64,", ""),
            "base64"
        ).toString();
        expect(svg).toContain(`stroke="${token("content-subdued")}"`);
    });
});
