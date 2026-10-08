"use client";

import {
    discardFeedbackImage,
    requestFeedbackImageUpload,
    submitFeedbackReport,
} from "@/app/(nevigation)/(home)/feedbackActions";
import { useLocale } from "@/components/i18n/localeProvider";
import { createFeedbackReportFormData } from "@/features/feedback/schemas/feedbackReportSchema";
import { uploadGrantedImage } from "@/lib/uploads/clientImageUpload";
import FeedbackDialogView from "./feedbackDialogView";
import type { FeedbackDialogViewProps } from "./feedbackDialogView";
import { useFeedbackUnread } from "./feedbackUnread";
import MyFeedbackList from "./myFeedbackList";

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
