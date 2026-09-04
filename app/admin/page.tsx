import {
    ChevronRight,
    ClipboardCheck,
    DatabaseZap,
    Grid3X3,
    ListMusic,
    MessageSquareText,
    MessageSquareWarning,
    Megaphone,
    Music2,
    MapPin,
    RefreshCw,
    Rows3,
    Users,
} from "lucide-react";
import Link from "next/link";

import AdminActivityChart from "@/components/admin/adminActivityChart";
import { getAdminDashboard } from "@/features/admin/server/adminDashboardService";

export default async function AdminPage() {
    const {
        pendingSubmissionCount,
        failedSyncCount,
        missingConstantCount,
        pendingCatalogCount,
        draftBingoCount,
        openFeedbackCount,
        userCount,
        musicCount,
        completedSyncCount,
        staleSyncCount,
        attentionUserCount,
        activity,
    } = await getAdminDashboard();

    const tasks = [
        {
            href: "/admin/submissions?status=pending",
            label: "심사 대기",
            count: pendingSubmissionCount,
            color: "text-score",
        },
        {
            href: "/admin/syncs?status=failed",
            label: "24시간 동기화 실패",
            count: failedSyncCount,
            color: "text-danger",
        },
        {
            href: "/admin/syncs?status=processing",
            label: "동기화 처리 지연",
            count: staleSyncCount,
            color: "text-score",
        },
        {
            href: "/admin/users?state=attention",
            label: "연동 데이터 점검",
            count: attentionUserCount,
            color: "text-recital",
        },
        {
            href: "/admin/music?missing=1",
            label: "공식 상수 미입력",
            count: missingConstantCount,
            color: "text-hard",
        },
        {
            href: "/admin/catalog?status=pending",
            label: "악곡 업데이트",
            count: pendingCatalogCount,
            color: "text-success",
        },
        {
            href: "/admin/bingos",
            label: "빙고 초안",
            count: draftBingoCount,
            color: "text-chart",
        },
        {
            href: "/admin/feedback?status=open",
            label: "새 피드백",
            count: openFeedbackCount,
            color: "text-basic",
        },
    ];

    const summaries = [
        { label: "전체 유저", value: userCount, color: "text-basic" },
        { label: "등록 악곡", value: musicCount, color: "text-normal" },
        {
            label: "24시간 동기화",
            value: completedSyncCount,
            color: "text-chart",
        },
        {
            label: "24시간 실패",
            value: failedSyncCount,
            color: "text-danger",
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
            href: "/admin/catalog",
            label: "악곡 업데이트",
            icon: RefreshCw,
            color: "bg-success/10 text-success",
        },
        {
            href: "/admin/bingos",
            label: "빙고 관리",
            icon: Grid3X3,
            color: "bg-chart/10 text-chart",
        },
        {
            href: "/admin/arcades",
            label: "오락실 관리",
            icon: MapPin,
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
            href: "/admin/feedback",
            label: "피드백 관리",
            icon: MessageSquareWarning,
            color: "bg-score/10 text-score",
        },
        {
            href: "/admin/announcements",
            label: "공지사항 관리",
            icon: Megaphone,
            color: "bg-basic/10 text-basic",
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
                <h2 className="text-section mb-2 font-bold">서비스 현황</h2>
                <div className="grid grid-cols-2 gap-2">
                    {summaries.map((summary) => (
                        <div
                            key={summary.label}
                            className="bg-surface rounded-card flex h-18 flex-col justify-center px-3"
                        >
                            <span className="text-caption">
                                {summary.label}
                            </span>
                            <strong
                                className={`${summary.color} mt-1 text-xl font-bold tabular-nums`}
                            >
                                {summary.value.toLocaleString("ko-KR")}
                            </strong>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-surface rounded-card p-3">
                <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-section font-bold">최근 7일 활동</h2>
                    <span className="text-caption">유저 · 동기화 · 피드백</span>
                </div>
                <AdminActivityChart
                    data={activity.map((row) => ({
                        date: row.date,
                        users: row.users,
                        syncs: row.syncs,
                        feedback: row.feedback,
                    }))}
                />
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
