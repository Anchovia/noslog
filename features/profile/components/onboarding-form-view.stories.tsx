import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { getMessages } from "@/lib/i18n/messages";
import { isLocale } from "@/lib/i18n/routing";

import type { OnboardingFormViewProps } from "./onboarding-form-view";
import OnboardingFormView from "./onboarding-form-view";

const meta = {
    title: "Features/Profile/OnboardingForm",
    component: OnboardingFormView,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "실제 두 단계 온보딩. 저장·닉네임 확인 콜백만 로컬 mock으로 바꾸며 인증·DB·redirect는 실행하지 않습니다.",
            },
        },
    },
    args: {
        account: { avatar: null, displayName: "NosLog fixture" },
        checkAction: fn<OnboardingFormViewProps["checkAction"]>(async () => ({
            available: true,
            message: "",
        })),
        submitAction: fn<OnboardingFormViewProps["submitAction"]>(async () => ({
            success: false as const,
            message: getMessages("ko")["onboarding.error.generic"],
        })),
    },
    render: (args) => (
        <section className="noslog-ui nl-auth nl-auth--onboarding">
            <div className="nl-auth-main">
                <div className="nl-auth-column">
                    <OnboardingFormView {...args} />
                </div>
            </div>
        </section>
    ),
} satisfies Meta<typeof OnboardingFormView>;
export default meta;
type Story = StoryObj<typeof meta>;
function messages(globals: Record<string, unknown>) {
    return getMessages(
        typeof globals.locale === "string" && isLocale(globals.locale)
            ? globals.locale
            : "ko"
    );
}
async function profile(canvas: HTMLElement, globals: Record<string, unknown>) {
    const c = within(canvas);
    const t = messages(globals);
    await userEvent.type(
        c.getByRole("textbox", { name: t["onboarding.nickname"] }),
        "Noslog Tester"
    );
    await userEvent.click(
        c.getByRole("radio", { name: t["onboarding.country.jp"] })
    );
    await userEvent.click(
        c.getByRole("button", { name: t["onboarding.next"] })
    );
    await waitFor(() =>
        expect(c.getByRole("heading", { level: 1 })).toHaveTextContent(
            t["settings.privacy"]
        )
    );
    return { c, t };
}
export const Default: Story = {};
export const LongAccount: Story = {
    args: {
        account: {
            avatar: null,
            displayName:
                "NosLog fixture · 한글 日本語 English 표시 이름이 긴 계정",
        },
    },
};
export const RequiredErrors: Story = {
    play: async ({ canvasElement, globals, args }) => {
        const c = within(canvasElement);
        const t = messages(globals);
        await userEvent.click(
            c.getByRole("button", { name: t["onboarding.next"] })
        );
        const input = c.getByRole("textbox", {
            name: t["onboarding.nickname"],
        });
        await expect(input).toHaveAttribute("aria-invalid", "true");
        await expect(input).toHaveFocus();
        await expect(args.submitAction).not.toHaveBeenCalled();
    },
};
export const Privacy: Story = {
    play: async ({ canvasElement, globals, args }) => {
        const { c, t } = await profile(canvasElement, globals);
        await expect(c.getByRole("heading", { level: 1 })).toHaveFocus();
        await expect(
            c.getByRole("checkbox", {
                name: t["settings.showPlayScores"],
            })
        ).toBeChecked();
        await expect(
            c.getByRole("checkbox", {
                name: t["settings.showPlayCount"],
            })
        ).not.toBeChecked();
        await expect(args.submitAction).not.toHaveBeenCalled();
        await userEvent.click(
            c.getByRole("button", { name: t["onboarding.back"] })
        );
        await expect(
            c.getByRole("textbox", {
                name: t["onboarding.nickname"],
            })
        ).toHaveValue("Noslog Tester");
        await expect(
            c.getByRole("radio", {
                name: t["onboarding.country.jp"],
            })
        ).toBeChecked();
    },
};
export const NicknameTaken: Story = {
    args: {
        checkAction: fn<OnboardingFormViewProps["checkAction"]>(async () => ({
            available: false,
            message: getMessages("ko")["onboarding.error.nicknameTaken"],
        })),
    },
    play: async ({ canvasElement, globals, args }) => {
        const c = within(canvasElement);
        const t = messages(globals);
        await userEvent.type(
            c.getByRole("textbox", {
                name: t["onboarding.nickname"],
            }),
            "Taken"
        );
        await userEvent.click(
            c.getByRole("radio", {
                name: t["onboarding.country.kr"],
            })
        );
        await userEvent.click(
            c.getByRole("button", { name: t["onboarding.next"] })
        );
        await expect(
            c.getByRole("textbox", {
                name: t["onboarding.nickname"],
            })
        ).toHaveAttribute("aria-invalid", "true");
        await expect(args.submitAction).not.toHaveBeenCalled();
    },
};
export const SaveFailureAndRetry: Story = {
    play: async ({ canvasElement, globals, args }) => {
        const { c, t } = await profile(canvasElement, globals);
        await userEvent.click(
            c.getByRole("button", { name: t["onboarding.start"] })
        );
        await expect(await c.findByRole("alert")).toBeVisible();
        await userEvent.click(
            c.getByRole("button", { name: t["onboarding.start"] })
        );
        await expect(args.submitAction).toHaveBeenCalledTimes(2);
        const sent = args.submitAction.mock.calls[0][0];
        await expect(sent.get("username")).toBe("Noslog Tester");
        await expect(sent.get("country")).toBe("ja-JP");
        await expect(sent.get("showPlayScores")).toBe("true");
    },
};
export const ServerFieldError: Story = {
    args: {
        submitAction: fn<OnboardingFormViewProps["submitAction"]>(async () => ({
            success: false as const,
            message: "",
            fieldErrors: {
                username: [getMessages("ko")["onboarding.error.nicknameTaken"]],
            },
        })),
    },
    play: async ({ canvasElement, globals }) => {
        const { c, t } = await profile(canvasElement, globals);
        await userEvent.click(
            c.getByRole("button", { name: t["onboarding.start"] })
        );
        const input = await c.findByRole("textbox", {
            name: t["onboarding.nickname"],
        });
        await expect(input).toHaveValue("Noslog Tester");
        await expect(input).toHaveFocus();
        await expect(input).toHaveAttribute("aria-invalid", "true");
    },
};
export const DuplicateSubmit: Story = {
    play: async ({ canvasElement, globals, args }) => {
        let resolve!: (value: { success: false; message: string }) => void;
        const pending = new Promise<{ success: false; message: string }>(
            (done) => {
                resolve = done;
            }
        );
        args.submitAction.mockImplementationOnce(() => pending);
        const { c, t } = await profile(canvasElement, globals);
        const button = c.getByRole("button", {
            name: t["onboarding.start"],
        });
        // 같은 이벤트 루프의 중복 submit과 busy 중 키보드 제출을 검사한다.
        const form = canvasElement.querySelector("form")!;
        form.requestSubmit();
        form.requestSubmit();
        await waitFor(() => expect(args.submitAction).toHaveBeenCalledTimes(1));
        await userEvent.keyboard("{Enter}{Enter}");
        await expect(args.submitAction).toHaveBeenCalledTimes(1);
        resolve({ success: false, message: t["onboarding.error.generic"] });
        await expect(await c.findByRole("alert")).toBeVisible();
        await expect(button).toBeEnabled();
    },
};
export const StaleNicknameResponse: Story = {
    play: async ({ canvasElement, globals, args }) => {
        let resolve!: (value: { available: boolean; message: string }) => void;
        const pending = new Promise<{ available: boolean; message: string }>(
            (done) => {
                resolve = done;
            }
        );
        args.checkAction.mockImplementationOnce(() => pending);
        const c = within(canvasElement);
        const t = messages(globals);
        const input = c.getByRole("textbox", {
            name: t["onboarding.nickname"],
        });
        await userEvent.type(input, "Alpha");
        await userEvent.tab();
        await waitFor(() => expect(args.checkAction).toHaveBeenCalledTimes(1));
        await userEvent.clear(input);
        await userEvent.type(input, "Beta");
        await userEvent.clear(input);
        await userEvent.type(input, "Alpha");
        resolve({
            available: false,
            message: t["onboarding.error.nicknameTaken"],
        });
        await pending;
        await userEvent.click(
            c.getByRole("radio", {
                name: t["onboarding.country.kr"],
            })
        );
        await waitFor(() => expect(args.checkAction).toHaveBeenCalledTimes(2));
        await waitFor(() =>
            expect(input).toHaveAttribute("aria-invalid", "false")
        );
        await expect(c.queryByRole("alert")).not.toBeInTheDocument();
    },
};
export const NicknameCheckUnavailable: Story = {
    args: {
        checkAction: fn<OnboardingFormViewProps["checkAction"]>(async () => {
            throw new Error("local mock unavailable");
        }),
    },
    play: async ({ canvasElement, globals, args }) => {
        await profile(canvasElement, globals);
        await expect(args.submitAction).not.toHaveBeenCalled();
    },
};
