import type { FeedbackStatus } from "@/features/feedback/schemas/feedbackAdminSchema";

export interface AdminFeedbackReport {
    content: string;
    createdAt: string;
    hasImage: boolean;
    id: number;
    status: FeedbackStatus;
    user: {
        id: number;
        name: string;
    };
    // 오락실 상세의 「고장 신고」·「오락실 제보」 로 들어온 제보 — 일반 피드백이면 null
    arcade: {
        name: string;
        href: string;
        // 「2번기」 또는 관리자가 붙인 기체 이름 · 오락실 전체 제보면 null
        cabinet: string | null;
        // 「기체 고장·이용 불가」 등
        type: string | null;
    } | null;
}
