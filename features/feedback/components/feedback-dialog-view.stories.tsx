import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useState } from "react";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";

import { useTranslations } from "@/components/i18n/locale-provider";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale } from "@/lib/i18n/routing";

import type { FeedbackDialogViewProps } from "./feedback-dialog-view";
import FeedbackDialogView from "./feedback-dialog-view";

function Example(args: FeedbackDialogViewProps) {
    const [open, setOpen] = useState(args.open ?? true);
    const t = useTranslations();
    return (
        <FeedbackDialogView
            {...args}
            open={open}
            onOpenChange={(next) => {
                args.onOpenChange?.(next);
                setOpen(next);
            }}
            feedbackList={
                <p className="nl-body-secondary nl-muted">
                    {t("feedback.mine.empty")}
                </p>
            }
        />
    );
}
const meta = {
    title: "Features/Feedback/FeedbackDialog",
    component: FeedbackDialogView,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "실제 제보 창. 제출 콜백과 내 제보 목록은 로컬 mock이며 실제 업로드·DB·읽음 처리를 하지 않습니다.",
            },
        },
    },
    args: {
        isAuthenticated: true,
        open: true,
        onOpenChange: fn(),
        submitReport: fn<FeedbackDialogViewProps["submitReport"]>(async () => ({
            success: true as const,
            message: "",
        })),
        feedbackList: null,
    },
    render: (args) => <Example {...args} />,
} satisfies Meta<typeof FeedbackDialogView>;
export default meta;
type Story = StoryObj<typeof meta>;
function messages(globals: Record<string, unknown>) {
    return getMessages(
        typeof globals.locale === "string" && isLocale(globals.locale)
            ? globals.locale
            : "ko"
    );
}
export const Open: Story = {};
export const LoggedOut: Story = { args: { isAuthenticated: false } };
export const EmptyValidation: Story = {
    play: async ({ globals, args }) => {
        const t = messages(globals);
        const dialog = await screen.findByRole("dialog");
        const c = within(dialog);
        await userEvent.click(
            c.getByRole("button", { name: t["feedback.send"] })
        );
        const input = c.getByRole("textbox", {
            name: t["feedback.contentLabel"],
        });
        await expect(input).toHaveAttribute("aria-invalid", "true");
        await expect(input).toHaveFocus();
        await expect(args.submitReport).not.toHaveBeenCalled();
    },
};
export const Success: Story = {
    play: async ({ globals, args }) => {
        const t = messages(globals);
        const c = within(await screen.findByRole("dialog"));
        await userEvent.type(
            c.getByRole("textbox", {
                name: t["feedback.contentLabel"],
            }),
            "화면에 오류가 보여요."
        );
        await userEvent.click(
            c.getByRole("button", { name: t["feedback.send"] })
        );
        await expect(await c.findByText(t["feedback.doneTitle"])).toBeVisible();
        await expect(args.submitReport).toHaveBeenCalledWith(
            {
                category: "bug",
                content: "화면에 오류가 보여요.",
                imageUrl: null,
            },
            null
        );
    },
};
export const FailureAndRetry: Story = {
    play: async ({ globals, args }) => {
        const t = messages(globals);
        args.submitReport.mockResolvedValueOnce({
            success: false,
            message: t["feedback.error"],
        });
        const c = within(await screen.findByRole("dialog"));
        const input = c.getByRole("textbox", {
            name: t["feedback.contentLabel"],
        });
        await userEvent.type(input, "제보 내용을 그대로 유지해 주세요.");
        const file = new File(
            [
                Uint8Array.from(
                    atob(
                        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aG0YAAAAASUVORK5CYII="
                    ),
                    (value) => value.charCodeAt(0)
                ),
            ],
            "report.png",
            { type: "image/png" }
        );
        await userEvent.upload(c.getByLabelText(t["feedback.addImage"]), file);
        await userEvent.click(
            c.getByRole("button", { name: t["feedback.send"] })
        );
        await expect(await c.findByRole("alert")).toHaveTextContent(
            t["feedback.error"]
        );
        await expect(input).toHaveValue("제보 내용을 그대로 유지해 주세요.");
        await expect(c.getByText("report.png")).toBeVisible();
        await userEvent.click(
            c.getByRole("button", { name: t["feedback.send"] })
        );
        await expect(await c.findByText(t["feedback.doneTitle"])).toBeVisible();
        await expect(args.submitReport).toHaveBeenCalledTimes(2);
        await expect(args.submitReport).toHaveBeenLastCalledWith(
            expect.objectContaining({
                content: "제보 내용을 그대로 유지해 주세요.",
            }),
            file
        );
    },
};
export const NetworkFailure: Story = {
    args: {
        submitReport: fn<FeedbackDialogViewProps["submitReport"]>(async () => {
            throw new Error("local mock unavailable");
        }),
    },
    play: async ({ globals }) => {
        const t = messages(globals);
        const c = within(await screen.findByRole("dialog"));
        const input = c.getByRole("textbox", {
            name: t["feedback.contentLabel"],
        });
        await userEvent.type(input, "다시 보내야 할 제보");
        await userEvent.click(
            c.getByRole("button", { name: t["feedback.send"] })
        );
        await expect(await c.findByRole("alert")).toHaveTextContent(
            t["feedback.error"]
        );
        await expect(input).toHaveValue("다시 보내야 할 제보");
    },
};
export const DuplicateSubmitAndClose: Story = {
    play: async ({ globals, args }) => {
        const t = messages(globals);
        let resolve!: (value: { success: true; message: string }) => void;
        const pending = new Promise<{ success: true; message: string }>(
            (done) => {
                resolve = done;
            }
        );
        args.submitReport.mockImplementationOnce(() => pending);
        const dialog = await screen.findByRole("dialog");
        const c = within(dialog);
        await userEvent.type(
            c.getByRole("textbox", {
                name: t["feedback.contentLabel"],
            }),
            "중복되지 않을 제보"
        );
        const form = dialog.querySelector("form")!;
        form.requestSubmit();
        form.requestSubmit();
        await waitFor(() => expect(args.submitReport).toHaveBeenCalledTimes(1));
        await userEvent.keyboard("{Enter}{Enter}{Escape}");
        await expect(dialog).toBeVisible();
        await expect(args.onOpenChange).not.toHaveBeenCalled();
        resolve({ success: true, message: "" });
        await expect(await c.findByText(t["feedback.doneTitle"])).toBeVisible();
        await expect(args.submitReport).toHaveBeenCalledTimes(1);
    },
};
export const CloseAndReopen: Story = {
    play: async ({ globals }) => {
        const t = messages(globals);
        let c = within(await screen.findByRole("dialog"));
        await userEvent.type(
            c.getByRole("textbox", {
                name: t["feedback.contentLabel"],
            }),
            "작성하던 내용"
        );
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
        );
        await userEvent.click(
            screen.getByRole("button", {
                name: t["shell.feedback"],
            })
        );
        c = within(await screen.findByRole("dialog"));
        await expect(
            c.getByRole("textbox", {
                name: t["feedback.contentLabel"],
            })
        ).toHaveValue("작성하던 내용");
    },
};
export const MyReports: Story = {
    args: { unreadCount: 2 },
    play: async ({ globals, args }) => {
        const t = messages(globals);
        const c = within(await screen.findByRole("dialog"));
        await userEvent.click(
            c.getByRole("tab", { name: new RegExp(t["feedback.tab.mine"]) })
        );
        await waitFor(async () => {
            await expect(
                await c.findByText(t["feedback.mine.empty"])
            ).toBeVisible();
        });
        await expect(args.submitReport).not.toHaveBeenCalled();
    },
};
export const ServerContentError: Story = {
    play: async ({ globals, args }) => {
        const t = messages(globals);
        args.submitReport.mockResolvedValueOnce({
            success: false,
            message: t["feedback.error"],
            fieldErrors: { content: [t["feedback.contentRequired"]] },
        });
        const c = within(await screen.findByRole("dialog"));
        const input = c.getByRole("textbox", {
            name: t["feedback.contentLabel"],
        });
        await userEvent.type(input, "サーバーの入力エラーを確認する");
        await userEvent.click(
            c.getByRole("button", { name: t["feedback.send"] })
        );
        await expect(input).toHaveAttribute("aria-invalid", "true");
        await expect(input).toHaveValue("サーバーの入力エラーを確認する");
    },
};

// 테스트 전용 외부 제어: 실제 창의 닫기 정책을 우회하는 부모 상태 변경만 재현한다.
let forceOpenForStory: ((open: boolean) => void) | undefined;
function ExternallyControlled(args: FeedbackDialogViewProps) {
    const [open, setOpen] = useState(true);
    useEffect(() => {
        forceOpenForStory = setOpen;
        return () => {
            forceOpenForStory = undefined;
        };
    }, []);
    return <FeedbackDialogView {...args} open={open} />;
}
export const ExternalReopenWhileSubmitting: Story = {
    render: (args) => <ExternallyControlled {...args} />,
    play: async ({ globals, args }) => {
        const t = messages(globals);
        let resolve!: (value: { success: true; message: string }) => void;
        const pending = new Promise<{ success: true; message: string }>(
            (done) => {
                resolve = done;
            }
        );
        args.submitReport.mockImplementationOnce(() => pending);
        const dialog = await screen.findByRole("dialog");
        const c = within(dialog);
        await userEvent.type(
            c.getByRole("textbox", { name: t["feedback.contentLabel"] }),
            "이전 요청의 응답"
        );
        await userEvent.click(
            c.getByRole("button", { name: t["feedback.send"] })
        );
        await waitFor(() => expect(args.submitReport).toHaveBeenCalledTimes(1));
        forceOpenForStory!(false);
        await waitFor(() =>
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
        );
        forceOpenForStory!(true);
        const reopened = await screen.findByRole("dialog");
        resolve({ success: true, message: "" });
        await pending;
        await waitFor(() =>
            expect(reopened.querySelector("form")).toHaveAttribute(
                "aria-busy",
                "false"
            )
        );
        await expect(
            within(reopened).queryByText(t["feedback.doneTitle"])
        ).not.toBeInTheDocument();
        await expect(
            within(reopened).getByRole("textbox", {
                name: t["feedback.contentLabel"],
            })
        ).toHaveValue("이전 요청의 응답");
    },
};
