import { redirect } from "next/navigation";

// 관리자 대시보드는 제거됨 — 첫 관리 화면으로 바로 이동함
export default function AdminPage() {
    redirect("/admin/announcements");
}
