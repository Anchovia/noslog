"use client";

import {
    discardFeedbackImage,
    requestFeedbackImageUpload,
    submitFeedbackReport,
} from "@/app/(site)/(home)/feedback-actions";
import { useLocale } from "@/components/i18n/locale-provider";
import { createFeedbackReportFormData } from "@/features/feedback/schemas/feedback-report-schema";
import { uploadGrantedImage } from "@/lib/uploads/client-image-upload";

import type { FeedbackDialogViewProps } from "./feedback-dialog-view";
import FeedbackDialogView from "./feedback-dialog-view";
import { useFeedbackUnread } from "./feedback-unread";
import MyFeedbackList from "./my-feedback-list";

export type FeedbackDialogProps = Omit<
    FeedbackDialogViewProps,
    "submitReport" | "unreadCount" | "feedbackList"
>;

/** 실제 데이터와 연결하고, 폼 표시는 Storybook과 같은 View를 쓴다. */
export default function FeedbackDialog(props: FeedbackDialogProps) {
    const locale = useLocale();
    const { count, markSeen } = useFeedbackUnread();
    const submitReport: FeedbackDialogViewProps["submitReport"] = async (
        values,
        file
    ) => {
        let uploadedUrl = "";
        try {
            if (file) {
                const upload = await requestFeedbackImageUpload(
                    file.type,
                    locale
                );
                if (!upload.success) return upload;
                uploadedUrl = await uploadGrantedImage(file, upload, "private");
            }
            const result = await submitFeedbackReport(
                createFeedbackReportFormData(
                    { ...values, imageUrl: uploadedUrl || null },
                    locale
                )
            );
            if (!result.success && uploadedUrl)
                await discardFeedbackImage(uploadedUrl).catch(() => null);
            return result;
        } catch (error) {
            if (uploadedUrl)
                await discardFeedbackImage(uploadedUrl).catch(() => null);
            throw error;
        }
    };
    return (
        <FeedbackDialogView
            {...props}
            submitReport={submitReport}
            unreadCount={count}
            feedbackList={<MyFeedbackList onLoaded={markSeen} />}
        />
    );
}
