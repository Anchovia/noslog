"use client";
import {
    useMemo,
    useRef,
    useState,
    type BaseSyntheticEvent,
    type ReactNode,
} from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare } from "lucide-react";
import { put } from "@vercel/blob/client";
import Link from "next/link";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import FullScreenDialog from "@/components/ui/fullScreenDialog";
import ModalDialog from "@/components/ui/modalDialog";
import ActionButton from "@/components/ui/actionButton";
import Button, { foundationButtonClass } from "@/components/ui/Button";
import RadioGroup from "@/components/ui/radioGroup";
import {
    fieldDescription,
    FormField,
    TextArea,
} from "@/components/ui/formField";
import { StatusMessage } from "@/components/ui/statusMessage";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { requestFeedbackImageUpload } from "@/app/(nevigation)/(home)/feedbackActions";
import { submitArcadeReport } from "@/app/(nevigation)/gamecenter/actions";
import {
    ARCADE_REPORT_TYPES,
    createArcadeReportSchema,
} from "@/features/arcades/schemas/arcadeReportSchema";
import type {
    ArcadeReportFormValues,
    ArcadeReportValues,
} from "@/features/arcades/schemas/arcadeReportSchema";
import type { PublicArcade } from "@/features/arcades/schemas/publicArcadeSchema";
import { applyFormFieldErrors } from "@/lib/forms/errors";

export default function ArcadeReportDialog({
    arcade,
    isAuthenticated,
    initialCabinetId = null,
    initialReportType = "other",
    triggerLabel,
    triggerAriaLabel,
    triggerVariant = "secondary",
    triggerIcon,
}: {
    arcade: PublicArcade;
    isAuthenticated: boolean;
    /** 기체 줄에서 열 때 — 그 기체·고장 유형이 미리 골라져 있다 */
    initialCabinetId?: number | null;
    initialReportType?: (typeof ARCADE_REPORT_TYPES)[number];
    triggerLabel?: string;
    triggerAriaLabel?: string;
    /** 기체 행 「고장 신고」 는 빨간 테두리(중요 액션 강조) */
    triggerVariant?: "secondary" | "danger";
    /** 없으면 상세 액션 행 기본 트리거의 말풍선 아이콘 */
    triggerIcon?: ReactNode;
}) {
    const locale = useLocale();
    const href = useLocalizedHref();
    const t = useTranslations();
    // 필터와 같은 그릇 규칙 — 672 미만 전체 레이어, 672 이상 모달
    const wide = useMediaQuery("(min-width: 672px)");
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const uploadRef = useRef<{ file: File; url: string } | null>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    const schema = useMemo(() => createArcadeReportSchema(t), [t]);
    const defaults: ArcadeReportFormValues = {
        arcadeId: arcade.id,
        cabinetId: initialCabinetId,
        reportType: initialReportType,
        content: "",
        imageUrl: "",
        submissionId: "",
    };
    const form = useForm<ArcadeReportFormValues, unknown, ArcadeReportValues>({
        resolver: zodResolver(schema),
        defaultValues: defaults,
    });
    const busy = form.formState.isSubmitting;
    const reportType = useWatch({ control: form.control, name: "reportType" });
    function changeOpen(next: boolean) {
        if (busy) return;
        if (!next) setSuccess(false);
        if (next && !form.getValues("submissionId"))
            form.setValue("submissionId", crypto.randomUUID());
        setOpen(next);
    }
    async function submit(values: ArcadeReportValues) {
        form.clearErrors();
        try {
            let imageUrl =
                uploadRef.current?.file === file
                    ? (uploadRef.current?.url ?? "")
                    : "";
            if (file && !imageUrl) {
                const upload = await requestFeedbackImageUpload(
                    file.type,
                    locale
                );
                if (!upload.success) {
                    form.setError("root", { message: upload.message });
                    return;
                }
                const blob = await put(upload.pathname, file, {
                    access: "private",
                    token: upload.token,
                    contentType: file.type,
                });
                imageUrl = blob.url;
                uploadRef.current = { file, url: blob.url };
            }
            const data = new FormData();
            for (const [key, value] of Object.entries({
                ...values,
                imageUrl,
                locale,
            }))
                data.set(key, value === null ? "" : String(value));
            const result = await submitArcadeReport(data);
            if (!result.success) {
                applyFormFieldErrors(form.setError, result.fieldErrors);
                form.setError("root", { message: result.message });
                return;
            }
            setSuccess(true);
            setFile(null);
            uploadRef.current = null;
            form.reset(defaults);
        } catch {
            form.setError("root", { message: t("feedback.submitError") });
        }
    }
    const close = () => changeOpen(false);
    const submitForm = (event?: BaseSyntheticEvent) =>
        void form.handleSubmit(submit)(event);
    const title = triggerLabel ?? t("arcades.report");
    const loginHref = `${href("/login")}?returnTo=${encodeURIComponent(href(`/gamecenter/${arcade.slug}`))}`;
    const trigger = (
        <Button
            appearance="foundation"
            variant={triggerVariant}
            size="sm"
            aria-label={triggerAriaLabel}
        >
            {/* 상세 액션 행의 기본 트리거만 아이콘 — 형제(길찾기·선호·공유)와 같은 16. 기체 행 「고장 신고」 는 형제 「가동 확인」 처럼 글자만 */}
            {triggerIcon ??
                (triggerLabel ? null : (
                    <MessageSquare className="nl-icon-small" aria-hidden />
                ))}
            {title}
        </Button>
    );
    const loginRequired = <StatusMessage title={t("feedback.loginRequired")} />;
    const loginLink = (
        <Link className={foundationButtonClass()} href={loginHref}>
            {t("common.login")}
        </Link>
    );
    const successMessage = (
        <StatusMessage
            severity="success"
            title={t("feedback.success")}
            role="status"
        />
    );
    const fields = (
        <>
            <div>
                <p className="nl-control">{t("arcades.reportTarget")}</p>
                <p className="nl-body">
                    {arcade.name}
                    {arcade.region ? ` · ${arcade.region}` : ""}
                </p>
            </div>
            <Controller
                control={form.control}
                name="reportType"
                render={({ field }) => (
                    <RadioGroup
                        label={t("arcades.reportTypeLabel")}
                        value={field.value}
                        disabled={busy}
                        options={ARCADE_REPORT_TYPES.map((value) => ({
                            value,
                            label: t(`arcades.reportType.${value}`),
                        }))}
                        onValueChange={(value) => {
                            field.onChange(value);
                            if (!["unavailable", "condition"].includes(value))
                                form.setValue("cabinetId", null);
                        }}
                    />
                )}
            />
            {["unavailable", "condition"].includes(reportType) ? (
                <Controller
                    control={form.control}
                    name="cabinetId"
                    render={({ field }) => (
                        <RadioGroup
                            label={t("arcades.reportCabinet")}
                            value={
                                field.value === null ? "" : String(field.value)
                            }
                            disabled={busy}
                            options={[
                                {
                                    value: "",
                                    label: t("arcades.unspecifiedCabinet"),
                                },
                                // 기체 행과 같은 이름(「1번기」 · 관리자가 붙인 이름이 있으면 그것)
                                ...arcade.cabinets.map((cabinet) => ({
                                    value: String(cabinet.id),
                                    label:
                                        cabinet.label ??
                                        t("arcades.cabinetNumber", {
                                            count: cabinet.position + 1,
                                        }),
                                })),
                            ]}
                            onValueChange={(value) =>
                                field.onChange(value ? Number(value) : null)
                            }
                        />
                    )}
                />
            ) : null}
            <FormField
                id={`arcade-report-${arcade.id}`}
                label={t("arcades.reportContent")}
                error={form.formState.errors.content?.message}
                help={t("arcades.reportContentHelp")}
            >
                <TextArea
                    id={`arcade-report-${arcade.id}`}
                    {...form.register("content")}
                    disabled={busy}
                    placeholder={t("feedback.placeholder")}
                    maxLength={1000}
                    rows={3}
                    aria-describedby={fieldDescription(
                        `arcade-report-${arcade.id}`,
                        {
                            help: true,
                            error: Boolean(form.formState.errors.content),
                        }
                    )}
                    aria-invalid={Boolean(form.formState.errors.content)}
                />
            </FormField>
            <input
                ref={fileInput}
                hidden
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={busy}
                aria-label={t("feedback.attachImage")}
                onChange={(event) => {
                    const next = event.target.files?.[0];
                    if (!next) return;
                    if (
                        !["image/jpeg", "image/png", "image/webp"].includes(
                            next.type
                        ) ||
                        next.size > 4 * 1024 * 1024
                    ) {
                        form.setError("root", {
                            message: t(
                                next.size > 4 * 1024 * 1024
                                    ? "feedback.imageTooLarge"
                                    : "feedback.invalidImage"
                            ),
                        });
                        event.target.value = "";
                        return;
                    }
                    setFile(next);
                    form.clearErrors("root");
                }}
            />
            <ActionButton
                variant="secondary"
                disabled={busy}
                onClick={() => fileInput.current?.click()}
            >
                {file ? file.name : t("feedback.attachImage")}
            </ActionButton>
            <p className="nl-metadata nl-muted">
                {t("arcades.reportImageHelp")}
            </p>
            {form.formState.errors.root?.message ? (
                <StatusMessage
                    severity="danger"
                    title={form.formState.errors.root.message}
                    role="alert"
                />
            ) : null}
        </>
    );

    // Compact — 필터 레이어와 같은 전체 레이어: 머리 줄 제목·닫기, 하단 고정 줄에 제출
    if (!wide)
        return (
            <FullScreenDialog
                open={open}
                onOpenChange={changeOpen}
                title={title}
                trigger={trigger}
                footer={
                    isAuthenticated && !success ? (
                        <ActionButton
                            className="nl-arcades__apply"
                            busy={busy}
                            busyLabel={t("feedback.submitting")}
                            onClick={submitForm}
                        >
                            {t("feedback.submit")}
                        </ActionButton>
                    ) : null
                }
            >
                {!isAuthenticated ? (
                    <div className="nl-stack">
                        {loginRequired}
                        {loginLink}
                    </div>
                ) : success ? (
                    successMessage
                ) : (
                    <form
                        className="nl-stack"
                        noValidate
                        aria-busy={busy}
                        onSubmit={submitForm}
                    >
                        {fields}
                    </form>
                )}
            </FullScreenDialog>
        );

    // 672+ — 피드백 다이얼로그와 같은 768 모달(SHELL-37): 제보 대상 화면이 뒤에 남고 [닫기][제출] 이 오른쪽
    return (
        <ModalDialog
            open={open}
            onOpenChange={changeOpen}
            title={title}
            width="wide"
            className="nl-feedback-dialog"
            trigger={trigger}
        >
            {!isAuthenticated ? (
                <div className="nl-stack nl-feedback-dialog__body">
                    {loginRequired}
                    <div className="nl-dialog__actions">
                        <ActionButton variant="secondary" onClick={close}>
                            {t("common.close")}
                        </ActionButton>
                        {loginLink}
                    </div>
                </div>
            ) : success ? (
                <div className="nl-stack nl-feedback-dialog__body">
                    {successMessage}
                    <div className="nl-dialog__actions">
                        <ActionButton onClick={close}>
                            {t("common.close")}
                        </ActionButton>
                    </div>
                </div>
            ) : (
                <form
                    className="nl-stack nl-feedback-dialog__body"
                    noValidate
                    aria-busy={busy}
                    onSubmit={submitForm}
                >
                    {fields}
                    <div className="nl-dialog__actions">
                        <ActionButton
                            variant="secondary"
                            disabled={busy}
                            onClick={close}
                        >
                            {t("common.close")}
                        </ActionButton>
                        <ActionButton
                            type="submit"
                            busy={busy}
                            busyLabel={t("feedback.submitting")}
                        >
                            {t("feedback.submit")}
                        </ActionButton>
                    </div>
                </form>
            )}
        </ModalDialog>
    );
}
