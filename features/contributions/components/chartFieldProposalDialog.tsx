"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId, useState } from "react";
import { toast } from "sonner";

import { submitChartFieldProposal } from "@/app/(nevigation)/music/[index]/[difficulty]/proposalActions";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import { FormField, Input, fieldDescription } from "@/components/ui/formField";
import ModalDialog from "@/components/ui/modalDialog";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import {
    PROPOSAL_EVIDENCE_KINDS,
    PROPOSAL_EVIDENCE_NOTE_MAX,
    PROPOSAL_EVIDENCE_URL_MAX,
    formatProposalValue,
    type ChartFieldProposalField,
    type ProposalEvidenceKind,
} from "@/features/contributions/schemas/chartFieldProposalSchema";

type FieldName = "value" | "evidenceUrl" | "evidenceNote";

/** 입력 칸의 처음 글자 — 지금 값을 고치기 쉬운 모양으로(길이는 m:ss) */
function initialInput(field: ChartFieldProposalField, value: string | null) {
    if (value === null) return "";
    return field === "duration" ? formatProposalValue(field, value) : value;
}

/**
 * 채보 정보 제안 창(Compact, 2026-09-23 S2) — 값 + 근거(영상 · 공식 사이트 · 직접 확인).
 * 누구의 제안이든 운영자가 확인한 뒤 반영한다. 대기 중인 내 제안이 있으면 다시 내면 바뀐다고 알린다.
 */
export default function ChartFieldProposalDialog({
    open,
    onOpenChange,
    chartId,
    field,
    fieldLabel,
    currentValue,
    pendingValue,
    onCloseAutoFocus,
    queryKey,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    chartId: number;
    field: ChartFieldProposalField;
    fieldLabel: string;
    currentValue: string | null;
    pendingValue?: string;
    onCloseAutoFocus?: (event: Event) => void;
    queryKey: readonly unknown[];
}) {
    const t = useTranslations();
    const locale = useLocale();
    const id = useId();
    const client = useQueryClient();
    const [value, setValue] = useState(() =>
        initialInput(field, pendingValue ?? currentValue)
    );
    const [evidenceKind, setEvidenceKind] =
        useState<ProposalEvidenceKind>("video");
    const [evidenceUrl, setEvidenceUrl] = useState("");
    const [evidenceNote, setEvidenceNote] = useState("");
    const [errors, setErrors] = useState<Partial<Record<FieldName, string[]>>>(
        {}
    );

    const mutation = useMutation({
        mutationFn: () =>
            submitChartFieldProposal(
                {
                    chartId,
                    field,
                    value,
                    evidenceKind,
                    evidenceUrl,
                    evidenceNote,
                },
                locale
            ),
        onSuccess: (result) => {
            if (!result.success) {
                setErrors(result.fieldErrors ?? {});
                if (!result.fieldErrors) toast.error(result.message);
                return;
            }
            toast.success(result.message);
            void client.invalidateQueries({ queryKey });
            onOpenChange(false);
        },
        onError: () => toast.error(t("contribution.submitError")),
    });

    const title = t(
        currentValue === null
            ? "contribution.proposal.titleAdd"
            : "contribution.proposal.titleEdit",
        { field: fieldLabel }
    );
    const shownCurrent =
        currentValue === null
            ? "—"
            : formatProposalValue(field, currentValue, locale);
    const valueId = `${id}-value`;
    const urlId = `${id}-url`;
    const noteId = `${id}-note`;
    const errorOf = (name: FieldName) => errors[name]?.[0];

    return (
        <ModalDialog
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            onCloseAutoFocus={onCloseAutoFocus}
            footer={
                <Button
                    type="submit"
                    form={`${id}-form`}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending
                        ? t("contribution.proposal.submitting")
                        : t("contribution.proposal.submit")}
                </Button>
            }
        >
            <form
                id={`${id}-form`}
                className="nl-stack"
                noValidate
                onSubmit={(event) => {
                    event.preventDefault();
                    setErrors({});
                    mutation.mutate();
                }}
            >
                <p className="nl-body-secondary nl-muted">
                    {t("contribution.proposal.current", {
                        value: shownCurrent,
                    })}
                </p>
                {pendingValue !== undefined ? (
                    <p className="nl-body-secondary nl-muted">
                        {t("contribution.proposal.pendingNotice", {
                            value: formatProposalValue(
                                field,
                                pendingValue,
                                locale
                            ),
                        })}
                    </p>
                ) : null}
                <FormField
                    id={valueId}
                    label={fieldLabel}
                    // 수록일은 브라우저 날짜 고르기라 형식 안내를 두지 않는다
                    help={
                        field === "released_at"
                            ? undefined
                            : t(`contribution.proposal.help.${field}`)
                    }
                    error={errorOf("value")}
                >
                    <Input
                        id={valueId}
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        type={field === "released_at" ? "date" : "text"}
                        inputMode={
                            field === "note_count" ? "numeric" : undefined
                        }
                        autoComplete="off"
                        maxLength={20}
                        aria-invalid={Boolean(errorOf("value")) || undefined}
                        aria-describedby={fieldDescription(valueId, {
                            help: field !== "released_at",
                            error: Boolean(errorOf("value")),
                        })}
                    />
                </FormField>
                <div className="nl-field">
                    <span className="nl-field__label" id={`${id}-evidence`}>
                        {t("contribution.proposal.evidence")}
                    </span>
                    <SegmentedControl
                        label={t("contribution.proposal.evidence")}
                        value={evidenceKind}
                        onValueChange={setEvidenceKind}
                        options={PROPOSAL_EVIDENCE_KINDS.map((kind) => ({
                            value: kind,
                            label: t(`contribution.proposal.evidence.${kind}`),
                        }))}
                    />
                </div>
                <FormField
                    id={urlId}
                    label={t("contribution.proposal.url")}
                    error={errorOf("evidenceUrl")}
                >
                    <Input
                        id={urlId}
                        type="url"
                        inputMode="url"
                        value={evidenceUrl}
                        onChange={(event) => setEvidenceUrl(event.target.value)}
                        placeholder={t("contribution.proposal.urlPlaceholder")}
                        maxLength={PROPOSAL_EVIDENCE_URL_MAX}
                        autoComplete="off"
                        aria-invalid={
                            Boolean(errorOf("evidenceUrl")) || undefined
                        }
                        aria-describedby={fieldDescription(urlId, {
                            error: Boolean(errorOf("evidenceUrl")),
                        })}
                    />
                </FormField>
                <FormField
                    id={noteId}
                    label={t("contribution.proposal.note")}
                    error={errorOf("evidenceNote")}
                >
                    <Input
                        id={noteId}
                        value={evidenceNote}
                        onChange={(event) =>
                            setEvidenceNote(event.target.value)
                        }
                        placeholder={t(
                            `contribution.proposal.notePlaceholder.${evidenceKind}`
                        )}
                        maxLength={PROPOSAL_EVIDENCE_NOTE_MAX}
                        autoComplete="off"
                        aria-invalid={
                            Boolean(errorOf("evidenceNote")) || undefined
                        }
                        aria-describedby={fieldDescription(noteId, {
                            error: Boolean(errorOf("evidenceNote")),
                        })}
                    />
                </FormField>
                <p className="nl-metadata nl-muted">
                    {t("contribution.proposal.notice")}
                </p>
            </form>
        </ModalDialog>
    );
}
