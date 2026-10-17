import type { OpinionReportStatus } from "@/features/feedback/schemas/opinion-report-admin-schema";

export interface AdminOpinionReport {
    id: number;
    // 「의견」 · 「답글」
    target: "opinion" | "reply";
    // 「욕설·괴롭힘·혐오」 등
    reason: string;
    explanation: string | null;
    // 신고할 때의 본문 — 작성자가 고치거나 지워도 남는다
    snapshot: string;
    createdAt: string;
    status: OpinionReportStatus;
    reporter: { id: number; name: string };
    author: { id: number; name: string };
    // 의견이 있는 채보 상세 — 의견 · 답글이 지워졌으면 null
    chart: { title: string; difficulty: string; href: string } | null;
}
