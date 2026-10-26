import { expect, waitFor } from "storybook/test";

// 폼의 폭 계약(옛 visual 잡의 「responsive forms」를 옮김, 2026-10-15 CI 정비 D4).
// Vitest 애드온이 스토리의 globals.viewport 로 브라우저 폭을 바꾼다. 경계 폭만 잰다.
const contractWidths = [320, 671, 672, 1055, 1056] as const;
export type ContractWidth = (typeof contractWidths)[number];

export const contractViewports = Object.fromEntries(
    contractWidths.map((width) => [
        `contract${width}`,
        {
            name: `계약 ${width}px`,
            styles: { width: `${width}px`, height: "900px" },
            type: "desktop",
        },
    ])
);

// 사이드바 · 문서에는 숨기고 테스트에서만 돈다.
export function contractStory(width: ContractWidth, locale = "ko") {
    return {
        tags: ["!dev", "!autodocs"],
        globals: { viewport: { value: `contract${width}` }, locale },
    };
}

export async function expectFormContract(
    input: HTMLElement,
    expectations: { height?: string } = {}
) {
    await waitFor(() => expect(getComputedStyle(input).fontSize).toBe("14px"));
    if (expectations.height)
        expect(getComputedStyle(input).height).toBe(expectations.height);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
        window.innerWidth
    );
}
