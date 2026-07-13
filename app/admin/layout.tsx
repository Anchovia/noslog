import { ExternalLink, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import AdminTabs from "@/components/admin/adminTabs";
import { requireAdmin } from "@/lib/admin";

export default async function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const admin = await requireAdmin();

    return (
        <div className="bg-bg min-h-screen">
            <div className="bg-bg mx-auto min-h-screen w-full max-w-97.5">
                <header className="border-divider bg-surface sticky top-0 z-40 flex h-14 items-center border-b px-4">
                    <Link
                        href="/admin"
                        className="flex min-w-0 items-center gap-2"
                    >
                        <ShieldCheck className="text-basic size-5 shrink-0" />
                        <span className="text-section truncate font-bold">
                            NosLog 관리자
                        </span>
                    </Link>
                    <div className="ml-auto flex items-center gap-2">
                        <Link
                            href="/"
                            aria-label="서비스 화면으로 이동"
                            title="서비스 화면으로 이동"
                            className="border-border text-text-secondary hover:text-text-primary flex size-9 items-center justify-center rounded-md border"
                        >
                            <ExternalLink className="size-4" />
                        </Link>
                        <div className="border-border bg-surface-muted relative size-9 overflow-hidden rounded-full border">
                            {admin.avatar ? (
                                <Image
                                    src={admin.avatar}
                                    alt=""
                                    fill
                                    sizes="36px"
                                    className="object-cover"
                                />
                            ) : (
                                <span className="flex size-full items-center justify-center text-xs font-bold">
                                    {
                                        (admin.username ??
                                            admin.nostalgia_name ??
                                            "A")[0]
                                    }
                                </span>
                            )}
                        </div>
                    </div>
                </header>
                <div className="bg-bg sticky top-14 z-30">
                    <AdminTabs />
                </div>
                <main>{children}</main>
            </div>
        </div>
    );
}
