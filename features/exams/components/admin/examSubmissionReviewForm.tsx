"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { reviewExamSubmission } from "@/app/admin/submissions/actions";
import {
    createExamSubmissionReviewFormData,
    examSubmissionReviewSchema,
    type ExamSubmissionReviewFormValues,
    type ExamSubmissionReviewValues,
} from "@/features/exams/schemas/examSubmissionAdminSchema";
import { applyFormFieldErrors } from "@/lib/forms/errors";

interface ExamSubmissionReviewFormProps {
    reviewerNote: string;
    submissionId: number;
}

export default function ExamSubmissionReviewForm({
    reviewerNote,
    submissionId,
}: ExamSubmissionReviewFormProps) {
    const router = useRouter();
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        register,
        setError,
        setValue,
    } = useForm<
        ExamSubmissionReviewFormValues,
        unknown,
        ExamSubmissionReviewValues
    >({
        resolver: zodResolver(examSubmissionReviewSchema),
        defaultValues: {
            submissionId,
            status: "approved",
            reviewerNote,
        },
        shouldFocusError: false,
    });

    async function handleReviewSubmit(values: ExamSubmissionReviewValues) {
        clearErrors();

        try {
            const result = await reviewExamSubmission(
                createExamSubmissionReviewFormData(values)
            );
            if (!result.success) {
                applyFormFieldErrors(setError, result.fieldErrors);
                setError("root.server", {
                    type: "server",
                    message: result.message,
                });
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            router.refresh();
        } catch {
            const message = "검정 인증을 심사하지 못했습니다.";
            setError("root.server", { type: "server", message });
            toast.error(message);
        }
    }

    function submitReview(status: "approved" | "rejected") {
        setValue("status", status, { shouldValidate: true });
        void handleSubmit(handleReviewSubmit, () =>
            toast.error("검정 인증 심사 입력을 확인해주세요.")
        )();
    }

    return (
        <form noValidate className="flex flex-col gap-2">
            <input type="hidden" {...register("submissionId")} />
            <input type="hidden" {...register("status")} />
            <textarea
                rows={2}
                placeholder="심사 메모 또는 반려 사유"
                aria-label="심사 메모 또는 반려 사유"
                aria-invalid={Boolean(errors.reviewerNote)}
                className="border-border bg-bg text-input w-full resize-none rounded-md border px-3 py-2"
                {...register("reviewerNote")}
            />
            {errors.reviewerNote?.message ? (
                <p className="text-danger text-xs" role="alert">
                    {errors.reviewerNote.message}
                </p>
            ) : null}
            {errors.root?.server?.message ? (
                <p className="text-danger text-xs" role="alert">
                    {errors.root.server.message}
                </p>
            ) : null}
            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => submitReview("rejected")}
                    className="border-danger/40 text-danger flex h-10 cursor-pointer items-center justify-center gap-1 rounded-md border text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <X className="size-4" /> 반려
                </button>
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => submitReview("approved")}
                    className="bg-success text-bg flex h-10 cursor-pointer items-center justify-center gap-1 rounded-md text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Check className="size-4" /> 승인
                </button>
            </div>
        </form>
    );
}
