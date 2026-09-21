import AdminDashboard from "@/features/admin/components/adminDashboard";
import { getAdminDashboard } from "@/features/admin/server/adminDashboardService";
import { parseDashboardParams } from "@/features/admin/dashboardParams";

// 관리자 첫 화면 = 대시보드(2026-09-13). 기간·그래프 지표는 주소로 바꾼다(기본 7일 · 방문자)
export default async function AdminPage({
    searchParams,
}: {
    searchParams: Promise<{ range?: string; metric?: string }>;
}) {
    const data = await getAdminDashboard(
        parseDashboardParams(await searchParams)
    );
    return <AdminDashboard data={data} />;
}
