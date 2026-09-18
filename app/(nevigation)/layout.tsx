import AppShell from "@/components/layout/appShell";
import AppFooter from "@/components/layout/appFooter";
import { countUnreadFeedbackReplies } from "@/features/feedback/server/myFeedbackService";
import { getUser } from "@/lib/user";

export default async function NeviationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getUser();
    // 피드백 새 답변 점 — 실패해도 셸은 그대로
    const feedbackUnread = user
        ? await countUnreadFeedbackReplies(user.id).catch(() => 0)
        : 0;
    return (
        <AppShell
            account={
                user
                    ? {
                          id: user.id,
                          username: user.username,
                          avatar: user.avatar,
                          role: user.role,
                          feedbackUnread,
                      }
                    : null
            }
            footer={<AppFooter />}
        >
            {children}
        </AppShell>
    );
}
