import AppFooter from "@/components/layout/app-footer";
import AppShell from "@/components/layout/app-shell";
import { countUnreadFeedbackReplies } from "@/features/feedback/server/my-feedback-service";
import getSession from "@/lib/session";
import { getUser } from "@/lib/user";

export default async function SiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // 피드백 새 답변 점 — 실패해도 셸은 그대로. 세션 id 로 User 조회와 함께 시작한다(2026-10-15 S6)
    const session = await getSession();
    const [user, unread] = await Promise.all([
        getUser(),
        session.id ? countUnreadFeedbackReplies(session.id).catch(() => 0) : 0,
    ]);
    const feedbackUnread = user ? unread : 0;
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
