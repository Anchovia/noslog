import {
    ChevronRight,
    ClipboardCheck,
    DatabaseZap,
    Grid3X3,
    ListMusic,
    MessageSquareText,
    Music2,
    Rows3,
    Users,
} from "lucide-react";
import Link from "next/link";

import db from "@/lib/db";

export default async function AdminPage() {
    const [
        pendingSubmissionCount,
        failedSyncCount,
        missingConstantCount,
        draftBingoCount,
    ] = await Promise.all([
        db.examSubmission.count({ where: { status: "pending" } }),
        db.dataSync.count({ where: { status: "failed" } }),
        db.musicChart.count({ where: { level_constant: null } }),
        db.bingo.count({ where: { status: "draft" } }),
    ]);

    const tasks = [
        {
            href: "/admin/submissions?status=pending",
            label: "심사 대기",
            count: pendingSubmissionCount,
            color: "text-score",
        },
        {
            href: "/admin/syncs?status=failed",
            label: "동기화 실패",
            count: failedSyncCount,
            color: "text-danger",
        },
        {
            href: "/admin/music?missing=1",
            label: "공식 상수 미입력",
            count: missingConstantCount,
            color: "text-hard",
        },
        {
            href: "/admin/bingos",
            label: "빙고 초안",
            count: draftBingoCount,
            color: "text-chart",
        },
    ];

    const menus = [
        {
            href: "/admin/exams",
            label: "검정 관리",
            icon: ListMusic,
            color: "bg-basic/10 text-basic",
        },
        {
            href: "/admin/submissions",
            label: "인증 심사",
            icon: ClipboardCheck,
            color: "bg-score/10 text-score",
        },
        {
            href: "/admin/music",
            label: "악곡 정보",
            icon: Music2,
            color: "bg-normal/10 text-normal",
        },
        {
            href: "/admin/bingos",
            label: "빙고 관리",
            icon: Grid3X3,
            color: "bg-chart/10 text-chart",
        },
        {
            href: "/admin/tiers",
            label: "서열표 관리",
            icon: Rows3,
            color: "bg-hard/10 text-hard",
        },
        {
            href: "/admin/users",
            label: "유저 관리",
            icon: Users,
            color: "bg-recital/10 text-recital",
        },
        {
            href: "/admin/community",
            label: "의견 관리",
            icon: MessageSquareText,
            color: "bg-expert/10 text-expert",
        },
        {
            href: "/admin/syncs",
            label: "동기화 내역",
            icon: DatabaseZap,
            color: "bg-real/10 text-real",
        },
    ];

    return (
        <div className="flex flex-col gap-5 px-4 py-5">
            <section>
                <h1 className="text-title">관리 홈</h1>
                <p className="text-caption mt-1">
                    콘텐츠와 사용자 인증 상태를 관리합니다.
                </p>
            </section>

            <section>
                <h2 className="text-section mb-2 font-bold">처리 필요</h2>
                <div className="grid grid-cols-2 gap-2">
                    {tasks.map((task) => (
                        <Link
                            key={task.href}
                            href={task.href}
                            className="bg-surface hover:bg-surface-muted rounded-card flex h-18 items-center justify-between px-3 transition-colors"
                        >
                            <span className="text-sm font-semibold">
                                {task.label}
                            </span>
                            <strong
                                className={`${task.color} text-xl font-bold tabular-nums`}
                            >
                                {task.count}
                            </strong>
                        </Link>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-section mb-2 font-bold">콘텐츠 관리</h2>
                <div className="bg-surface rounded-card overflow-hidden">
                    {menus.map((menu, index) => {
                        const Icon = menu.icon;

                        return (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                className={`hover:bg-surface-muted flex h-14 items-center gap-3 px-3 transition-colors ${index > 0 ? "border-divider border-t" : ""}`}
                            >
                                <span
                                    className={`${menu.color} flex size-9 shrink-0 items-center justify-center rounded-md`}
                                >
                                    <Icon className="size-5" />
                                </span>
                                <strong className="text-body min-w-0 flex-1 truncate font-bold">
                                    {menu.label}
                                </strong>
                                <ChevronRight className="text-text-disabled size-4" />
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
