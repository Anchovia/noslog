import AdminTabs from "@/components/admin/adminTabs";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { requireAdmin } from "@/lib/admin";

export default async function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    await requireAdmin();

    return (
        <div className="bg-bg min-h-screen">
            <div className="bg-bg mx-auto flex min-h-screen w-full max-w-97.5 flex-col">
                <Header />
                <AdminTabs />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </div>
    );
}
