"use client";
import { useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { put } from "@vercel/blob/client";
import Link from "next/link";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import FullScreenDialog from "@/components/ui/fullScreenDialog";
import Button, { foundationButtonClass } from "@/components/ui/Button";
import RadioGroup from "@/components/ui/radioGroup";
import {
    fieldDescription,
    FormField,
    TextArea,
} from "@/components/ui/formField";
import { StatusMessage } from "@/components/ui/statusMessage";
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
}: {
    arcade: PublicArcade;
    isAuthenticated: boolean;
}) {
    const locale = useLocale();
    const href = useLocalizedHref();
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const uploadRef = useRef<{ file: File; url: string } | null>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    const schema = useMemo(() => createArcadeReportSchema(t), [t]);
    const defaults: ArcadeReportFormValues = {
        arcadeId: arcade.id,
        cabinetId: null,
        reportType: "other",
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
    return (
        <FullScreenDialog
            open={open}
            onOpenChange={changeOpen}
            title={t("arcades.report")}
            trigger={
                <Button appearance="foundation" variant="secondary" size="sm">
                    {t("arcades.report")}
                </Button>
            }
            footer={
                isAuthenticated && !success ? (
                    <Button
                        appearance="foundation"
                        size="sm"
                        className="nl-arcades__apply"
                        disabled={busy}
                        onClick={(event) =>
                            void form.handleSubmit(submit)(event)
                        }
                    >
                        {t(busy ? "feedback.submitting" : "feedback.submit")}
                    </Button>
                ) : null
            }
        >
            {!isAuthenticated ? (
                <div className="nl-stack">
                    <p className="nl-body">{t("feedback.loginRequired")}</p>
                    <Link
                        className={foundationButtonClass({ size: "sm" })}
                        href={`${href("/login")}?returnTo=${encodeURIComponent(href(`/gamecenter/${arcade.slug}`))}`}
                    >
                        {t("common.login")}
                    </Link>
                </div>
            ) : success ? (
                <StatusMessage
                    severity="success"
                    title={t("feedback.success")}
                    role="status"
                />
            ) : (
                <form
                    className="nl-arcades__filters nl-arcade-report"
                    noValidate
                    onSubmit={(event) => void form.handleSubmit(submit)(event)}
                >
                    <div>
                        <p className="nl-control">
                            {t("arcades.reportTarget")}
                        </p>
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
                                    if (
                                        !["unavailable", "condition"].includes(
                                            value
                                        )
                                    )
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
                                        field.value === null
                                            ? ""
                                            : String(field.value)
                                    }
                                    disabled={busy}
                                    options={[
                                        {
                                            value: "",
                                            label: t(
                                                "arcades.unspecifiedCabinet"
                                            ),
                                        },
                                        ...arcade.cabinets.map(
                                            (cabinet, index) => ({
                                                value: String(cabinet.id),
                                                label:
                                                    cabinet.label ??
                                                    t("arcades.cabinetLabel", {
                                                        count: index + 1,
                                                    }),
                                            })
                                        ),
                                    ]}
                                    onValueChange={(value) =>
                                        field.onChange(
                                            value ? Number(value) : null
                                        )
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
                            rows={1}
                            aria-describedby={fieldDescription(
                                `arcade-report-${arcade.id}`,
                                {
                                    help: true,
                                    error: Boolean(
                                        form.formState.errors.content
                                    ),
                                }
                            )}
                            aria-invalid={Boolean(
                                form.formState.errors.content
                            )}
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
                                ![
                                    "image/jpeg",
                                    "image/png",
                                    "image/webp",
                                ].includes(next.type) ||
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
                    <Button
                        appearance="foundation"
                        size="sm"
                        variant="secondary"
                        className="nl-arcade-report__attach"
                        disabled={busy}
                        onClick={() => fileInput.current?.click()}
                    >
                        {t("feedback.attachImage")}
                    </Button>
                    {file ? <p className="nl-metadata">{file.name}</p> : null}
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
                </form>
            )}
        </FullScreenDialog>
    );
}
