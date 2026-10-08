import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

const meta = {
    title: "Foundations/Tokens",
    parameters: {
        docs: {
            description: {
                component:
                    "기존 --nl-* 값에 연결한 Tailwind 별칭입니다. noslog-ui 안에서만 사용합니다. 글자 조합은 기존 nl-body·nl-control 등 승인된 클래스를 사용합니다.",
            },
        },
    },
    render: () => (
        <section
            className="flex flex-col gap-nl-section-title"
            aria-label="토큰 연결"
        >
            <h2 className="nl-section-title">기존 토큰과 Tailwind 연결</h2>
            <div
                className="flex flex-col gap-nl-16 rounded-nl-container bg-nl-surface p-nl-16"
                data-testid="token-sample"
            >
                <p className="nl-body text-nl-content">기본 글자</p>
                <p className="nl-body-secondary text-nl-subdued">보조 글자</p>
                <div
                    className="h-nl-control"
                    data-testid="control-size"
                    aria-hidden
                />
            </div>
            <p className="nl-metadata">
                별칭은 기존 색상·간격·반응형 컨트롤 높이를 그대로 참조합니다.
            </p>
        </section>
    ),
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const sample = canvas.getByTestId("token-sample");
        await expect(getComputedStyle(sample).gap).toBe("16px");
        await expect(getComputedStyle(sample).paddingTop).toBe("16px");
        await expect(getComputedStyle(sample).borderRadius).toBe("8px");
        const control = canvas.getByTestId("control-size");
        const expectedHeight = window.matchMedia("(min-width: 1056px)").matches
            ? "40px"
            : "44px";
        await expect(getComputedStyle(control).height).toBe(expectedHeight);
    },
};
