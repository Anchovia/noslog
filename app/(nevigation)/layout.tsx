import AppShell from "@/components/layout/appShell";
import AppFooter from "@/components/layout/appFooter";
import { getUser } from "@/lib/user";

export default async function NeviationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getUser();
    return (
        <AppShell
            account={
                user
                    ? {
                          id: user.id,
                          username: user.username,
                          avatar: user.avatar,
                          role: user.role,
                      }
                    : null
            }
            footer={<AppFooter />}
        >
            {children}
        </AppShell>
    );
}
