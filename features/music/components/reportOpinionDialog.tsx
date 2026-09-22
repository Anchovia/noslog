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
import ModalDialog from "@/components/ui/modalDialog";
import { Select } from "@/components/ui/select";
import { StatusMessage } from "@/components/ui/statusMessage";
import useCommunityMutation from "@/features/music/hooks/useCommunityMutation";
import { opinionReportSchema } from "@/features/music/schemas/communitySchema";

type ReportFormValues = z.infer<typeof opinionReportSchema>;
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
                    // 로그아웃 — 로그인도 창 액션 줄에(창 규격: 오른쪽 정렬 · 좁으면 폭 채움)
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
            {!accountId ? null : (
                <form
                    id={id}
                    className="nl-stack"
                    noValidate
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <FormField
                        id={`${id}-reason`}
                        label={t("community.reportReason")}
                        error={
                            form.formState.errors.reason
                                ? t("community.action.invalid")
                                : undefined
                        }
                    >
                        <Controller
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <Select
                                    id={`${id}-reason`}
                                    value={field.value ?? ""}
                                    onValueChange={field.onChange}
                                    onBlur={field.onBlur}
                                    triggerRef={field.ref}
                                    invalid={Boolean(
                                        form.formState.errors.reason
                                    )}
                                    disabled={mutation.isPending}
                                    options={[
                                        { value: "", label: "—" },
                                        ...opinionReportSchema.shape.reason.options.map(
                                            (reason) => ({
                                                value: reason,
                                                label: t(
                                                    `community.report.${reason}`
                                                ),
                                            })
                                        ),
                                    ]}
                                />
                            )}
                        />
                    </FormField>
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
