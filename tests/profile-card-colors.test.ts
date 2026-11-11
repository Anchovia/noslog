import { describe, expect, it } from "vitest";

import { PROFILE_CARD_DARK_HEX } from "@/features/profile/profile-card-colors";
import { profileCardGlobe } from "@/features/profile/profile-card-globe";

import { darkToken } from "./helpers/design-tokens";

describe("프로필 공유 카드 색", () => {
    const token = (name: string) =>
        darkToken(name)?.match(/^#[0-9a-f]{6}$/i)?.[0];
    // 반투명 토큰(rgb(255 255 255 / 10%))은 이미지가 읽는 rgba(255, 255, 255, 0.1) 꼴로 맞춰 비교한다. 불투명 hex 토큰은 그대로
    const rgba = (name: string) => {
        const solid = token(name);
        if (solid) return solid;
        const [r, g, b, a] =
            darkToken(name)
                ?.match(/^rgb\(([^)]+)\)/)?.[1]
                .split(/[\s/]+/) ?? [];
        return `rgba(${r}, ${g}, ${b}, ${parseFloat(a) / 100})`;
    };

    it("카드 색이 tokens/colors.css 의 다크 토큰과 같다(2026-10-01 D9)", () => {
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
