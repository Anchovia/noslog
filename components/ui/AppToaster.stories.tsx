import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import AppToaster from "./AppToaster";
import Button from "./Button";
const meta = {
    title: "UI/AppToaster",
    component: AppToaster,
    args: {},
    parameters: {
        docs: {
            description: {
                component:
                    "실제 계정 작업 없이 로컬 토스트만 표시합니다. 스토리를 떠날 때 예제 알림을 정리합니다.",
            },
        },
    },
    beforeEach: () => {
        toast.dismiss();
        return () => toast.dismiss();
    },
    render: () => (
        <>
            <AppToaster />
            <Button onClick={() => toast.success("로컬 알림 예제")}>
                알림 표시
            </Button>
        </>
    ),
} satisfies Meta<typeof AppToaster>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        await userEvent.click(
            within(canvasElement).getByRole("button", { name: "알림 표시" })
        );
        await waitFor(() =>
            expect(screen.getByText("로컬 알림 예제")).toBeVisible()
        );
    },
};
