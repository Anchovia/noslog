import AdminTabs from "@/components/admin/adminTabs";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import SkipLink from "@/components/layout/skipLink";
import { requireAdmin } from "@/lib/admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "관리자",
    robots: { index: false, follow: false, noarchive: true },
};

export default async function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    await requireAdmin();

    return (
        <div className="bg-bg min-h-screen">
            <div className="bg-bg mx-auto flex min-h-screen w-full max-w-97.5 flex-col">
                <SkipLink />
                <Header />
                <AdminTabs />
                <main id="main-content" className="flex-1" tabIndex={-1}>
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
