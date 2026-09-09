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
}
