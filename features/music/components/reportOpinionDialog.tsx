"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useId } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import { foundationButtonClass } from "@/components/ui/Button";
import { FormField, TextArea } from "@/components/ui/formField";
import LoginPrompt from "@/components/ui/loginPrompt";
import ModalDialog from "@/components/ui/modalDialog";
import RadioGroup from "@/components/ui/radioGroup";
import { StatusMessage } from "@/components/ui/statusMessage";
import useCommunityMutation from "@/features/music/hooks/useCommunityMutation";
import { opinionReportSchema } from "@/features/music/schemas/communitySchema";

type ReportFormValues = z.infer<typeof opinionReportSchema>;
/** 의견 · 답글 신고 — 사유 4개는 라디오로 모두 보이게(2026-09-26 F1 · Carbon · Material 3), 「기타」 일 때만 설명 칸 */
export default function ReportOpinionDialog({
    chartId,
    evaluationId,
    replyId,
    accountId,
    returnTo,
    onClose,
    onReported,
}: {
    chartId: number;
    /** 의견 신고면 의견 번호, 답글 신고면 replyId(2026-09-22) — 둘 중 하나 */
    evaluationId?: number;
    replyId?: number;
    accountId?: number;
    returnTo: string;
    onClose: () => void;
    onReported: () => void;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const id = useId();
    const mutation = useCommunityMutation(chartId);
    const form = useForm<ReportFormValues>({
        resolver: zodResolver(opinionReportSchema),
        defaultValues: { evaluationId, replyId, explanation: "" },
    });
    const reason = useWatch({ control: form.control, name: "reason" });
    const handleSubmit = async (input: ReportFormValues) => {
        try {
            await mutation.mutateAsync({ action: "report", input });
            onReported();
            onClose();
        } catch (error) {
            form.setError("root", {
                message:
                    error instanceof Error
                        ? error.message
                        : t("community.action.failed"),
            });
        }
    };
    return (
        <ModalDialog
            open
            onOpenChange={(next) => {
                if (!next && !mutation.isPending) onClose();
            }}
            title={t("community.report")}
            // 로그아웃이면 로그인 안내 한 덩이 — small(2026-09-26 점검 D1, 시안 F1)
            size={accountId ? undefined : "small"}
            footer={
                accountId ? (
                    <>
                        <ActionButton
                            variant="secondary"
                            disabled={mutation.isPending}
                            onClick={onClose}
                        >
                            {t("community.cancel")}
                        </ActionButton>
                        <ActionButton
                            variant="primary"
                            type="submit"
                            form={id}
                            busy={mutation.isPending}
                            busyLabel={t("community.reporting")}
                        >
                            {t("community.report")}
                        </ActionButton>
                    </>
                ) : (
                    // 로그아웃 — 본문은 로그인 안내, 발은 취소 · 로그인(2026-09-26 F1)
                    <>
                        <ActionButton variant="secondary" onClick={onClose}>
                            {t("community.cancel")}
                        </ActionButton>
                        <Link
                            href={href(
                                `/login?returnTo=${encodeURIComponent(returnTo)}`
                            )}
                            className={foundationButtonClass({
                                variant: "primary",
                            })}
                        >
                            {t("common.login")}
                        </Link>
                    </>
                )
            }
        >
            {!accountId ? (
                <LoginPrompt
                    title={t("community.loginPromptTitle")}
                    description={t("community.loginPromptBody")}
                />
            ) : (
                <form
                    id={id}
                    className="nl-stack"
                    noValidate
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <Controller
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                            <RadioGroup
                                label={t("community.reportReason")}
                                labelStyle="field"
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={mutation.isPending}
                                error={
                                    form.formState.errors.reason
                                        ? t("community.action.invalid")
                                        : undefined
                                }
                                options={opinionReportSchema.shape.reason.options.map(
                                    (reason) => ({
                                        value: reason,
                                        label: t(`community.report.${reason}`),
                                    })
                                )}
                            />
                        )}
                    />
                    {reason === "other" ? (
                        <FormField
                            id={`${id}-explanation`}
                            label={t("community.reportExplanation")}
                            error={
                                form.formState.errors.explanation
                                    ? t("community.action.invalid")
                                    : undefined
                            }
                        >
                            <TextArea
                                id={`${id}-explanation`}
                                {...form.register("explanation")}
                                disabled={mutation.isPending}
                                aria-invalid={Boolean(
                                    form.formState.errors.explanation
                                )}
                            />
                        </FormField>
                    ) : null}
                    {form.formState.errors.root?.message ? (
                        <StatusMessage
                            severity="danger"
                            role="alert"
                            title={form.formState.errors.root.message}
                        />
                    ) : null}
                </form>
            )}
        </ModalDialog>
    );
}
