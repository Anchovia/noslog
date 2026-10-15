import type { Metadata } from "next";

import AdminShell from "@/components/admin/admin-shell";
import AppFooter from "@/components/layout/app-footer";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import SkipLink from "@/components/layout/skip-link";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
    title: "관리자",
    robots: { index: false, follow: false, noarchive: true },
};

export default async function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const admin = await requireAdmin();

    return (
        <AdminShell
            account={{
                id: admin.id,
                username: admin.username,
                avatar: admin.avatar,
                role: admin.role,
            }}
            footer={<AppFooter />}
            legacyHeader={<Header />}
            legacyFooter={<Footer />}
            legacySkipLink={<SkipLink />}
        >
            {children}
        </AdminShell>
    );
}
