"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { toast } from "sonner";

import {
    discardEventBanner,
    requestEventBannerUpload,
    requestEventImageUpload,
    saveEvent,
} from "@/app/(nevigation)/events/actions";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import { foundationButtonClass } from "@/components/ui/Button";
import { FormField, Input, fieldDescription } from "@/components/ui/formField";
import IconButton from "@/components/ui/iconButton";
import MarkdownEditor from "@/components/ui/markdownEditor";
import ResponsiveDialog from "@/components/ui/responsiveDialog";
import AnnouncementBody from "@/features/announcements/components/announcementBody";
import {
    EVENT_CONTENT_MAX_LENGTH,
    EVENT_TITLE_MAX_LENGTH,
    createEventFormSchema,
    eventFormData,
    type EventFormValues,
} from "@/features/events/schemas/eventSchema";
import { applyFormActionFailure, applyFormRootError } from "@/lib/forms/errors";
import useObjectUrl from "@/lib/hooks/useObjectUrl";
import { IMAGE_ACCEPT, imageFileValidationError } from "@/lib/imageUploadRules";
import { uploadGrantedImage } from "@/lib/uploads/clientImageUpload";
import EventDeleteButton from "./eventDeleteButton";

type SaveMode = "draft" | "submit";
const DIALOG_FIELDS = ["startDate", "endDate", "bannerUrl"] as const;

// 이벤트 글쓰기 (2026-09-18 E2) — 쓰는 화면엔 제목 · 본문만, 기간 · 대표 이미지는 「게시 요청」 창.
// 관리자 공지 작성과 같은 편집기 · 같은 흐름. 유저 버튼은 「게시」 대신 「게시 요청」
export default function EventEditor({
    event,
    siteUrl,
}: {
    event: {
        id?: number;
        values: EventFormValues;
        submittedBefore: boolean;
        /** 저장된 글이면 아래 줄 왼쪽에 「삭제」(2026-09-18 D1) */
        isPublic?: boolean;
    };
    siteUrl: string;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const router = useRouter();
    const [dialog, setDialog] = useState<SaveMode | null>(null);
    const [pending, setPending] = useState<SaveMode | null>(null);
    // 저장 상태(2026-09-23 L2)
    const [saveState, setSaveState] = useState<"saved" | "failed" | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const schema = useMemo(() => createEventFormSchema(t), [t]);
    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        setError,
        clearErrors,
        formState: { errors, isDirty },
    } = useForm<EventFormValues>({
        resolver: zodResolver(schema),
        mode: "onTouched",
        defaultValues: event.values,
    });
    const content = useWatch({ control, name: "content" }) ?? "";
    const title = useWatch({ control, name: "title" }) ?? "";
    const bannerUrl = useWatch({ control, name: "bannerUrl" }) ?? "";
    const preview = useObjectUrl(file);
    const bannerSrc = preview ?? (bannerUrl || null);

    function changeFile(input: ChangeEvent<HTMLInputElement>) {
        const next = input.target.files?.[0] ?? null;
        input.target.value = "";
        if (!next) return;
        if (imageFileValidationError(next)) {
            setError("bannerUrl", { message: t("events.invalidImage") });
            return;
        }
        clearErrors("bannerUrl");
        setFile(next);
    }

    function reveal(fieldErrors: FieldErrors<EventFormValues>, mode: SaveMode) {
        if (fieldErrors.title || fieldErrors.content) setDialog(null);
        else if (DIALOG_FIELDS.some((field) => fieldErrors[field]))
            setDialog(mode);
    }

    function save(mode: SaveMode) {
        clearErrors("root");
        return handleSubmit(
            async (values) => {
                setPending(mode);
                let uploaded = "";
                try {
                    if (file) {
                        const upload = await requestEventBannerUpload(
                            file.type,
                            locale
                        );
                        if (!upload.success) {
                            setError("bannerUrl", { message: upload.message });
                            setDialog(mode);
                            return;
                        }
                        uploaded = await uploadGrantedImage(
                            file,
                            upload,
                            "public"
                        );
                    }
                    const result = await saveEvent(
                        eventFormData(
                            {
                                ...values,
                                bannerUrl: uploaded || values.bannerUrl,
                            },
                            { id: event.id, submit: mode === "submit", locale }
                        )
                    );
                    if (!result.success) {
                        setSaveState("failed");
                        if (uploaded) await discardEventBanner(uploaded);
                        applyFormActionFailure(setError, result, toast.error);
                        if (result.fieldErrors)
                            reveal(
                                result.fieldErrors as FieldErrors<EventFormValues>,
                                mode
                            );
                        return;
                    }
                    if (uploaded) {
                        setValue("bannerUrl", uploaded);
                        setFile(null);
                    }
                    setSaveState("saved");
                    reset(values, { keepDefaultValues: false });
                    setDialog(null);
                    toast.success(result.message);
                    if (mode === "submit") router.replace(href("/events/mine"));
                    else if (event.id === undefined)
                        router.replace(href(`/events/${result.id}/edit`));
                    else router.refresh();
                } catch {
                    if (uploaded)
                        await discardEventBanner(uploaded).catch(() => null);
                    applyFormRootError(
                        setError,
                        t("events.saveFailed"),
                        toast.error
                    );
                } finally {
                    setPending(null);
                }
            },
            (fieldErrors) => {
                reveal(fieldErrors, mode);
                toast.error(t("events.checkInput"));
            }
        )();
    }

    const submitLabel = event.submittedBefore
        ? t("events.actions.resubmit")
        : t("events.actions.submit");
    const confirmLabel =
        dialog === "draft" ? t("events.actions.saveDraft") : submitLabel;
    const closeDialog = (next: boolean) => {
        if (!next && pending === null) setDialog(null);
    };

    const settings = (
        <div className="nl-events__form">
            {/* 시작일 · 종료일은 한 줄에 두지 않는다 — 좁은 창(334)에서 날짜가 잘린다 */}
            <FormField
                id="event-start"
                label={t("events.form.start")}
                error={errors.startDate?.message}
            >
                <Input
                    id="event-start"
                    type="date"
                    aria-invalid={Boolean(errors.startDate)}
                    aria-describedby={fieldDescription("event-start", {
                        error: Boolean(errors.startDate),
                    })}
                    {...register("startDate")}
                />
            </FormField>
            <FormField
                id="event-end"
                label={t("events.form.end")}
                error={errors.endDate?.message}
            >
                <Input
                    id="event-end"
                    type="date"
                    aria-invalid={Boolean(errors.endDate)}
                    aria-describedby={fieldDescription("event-end", {
                        error: Boolean(errors.endDate),
                    })}
                    {...register("endDate")}
                />
            </FormField>
            <div className="nl-field">
                <span className="nl-field__label">
                    {t("events.form.banner")}{" "}
                    <span className="nl-muted">
                        {t("events.form.optional")}
                    </span>
                </span>
                {bannerSrc ? (
                    <div className="nl-events__banner-field">
                        {/* 목록 카드와 같은 2.4 : 1 로 미리 보인다 */}
                        <div className="nl-event-banner">
                            {/* eslint-disable-next-line @next/next/no-img-element -- 올리기 전 blob: 미리보기 */}
                            <img src={bannerSrc} alt="" />
                        </div>
                        <IconButton
                            label={t("events.form.removeBanner")}
                            variant="secondary"
                            disabled={pending !== null}
                            onClick={() => {
                                setFile(null);
                                setValue("bannerUrl", "");
                            }}
                        >
                            <X className="nl-icon" aria-hidden />
                        </IconButton>
                    </div>
                ) : (
                    <label
                        className={foundationButtonClass({
                            variant: "secondary",
                        })}
                    >
                        {t("events.form.attachBanner")}
                        <input
                            type="file"
                            accept={IMAGE_ACCEPT}
                            className="sr-only"
                            onChange={changeFile}
                        />
                    </label>
                )}
                {errors.bannerUrl?.message ? (
                    <p className="nl-field__help nl-field__error" role="alert">
                        {errors.bannerUrl.message}
                    </p>
                ) : (
                    <p className="nl-field__help">
                        {t("events.form.bannerHelp")}
                    </p>
                )}
            </div>
            {dialog === "submit" ? (
                <p className="nl-field__help">
                    {t("events.form.reviewNotice")}
                </p>
            ) : null}
            {errors.root?.server?.message ? (
                <p className="nl-body-secondary nl-field__error" role="alert">
                    {errors.root.server.message}
                </p>
            ) : null}
        </div>
    );
    const confirm = (
        <ActionButton
            busy={pending !== null}
            busyLabel={t("events.actions.saving")}
            onClick={() => save(dialog ?? "submit")}
        >
            {confirmLabel}
        </ActionButton>
    );

    return (
        <form
            className="nl-events__form"
            noValidate
            onSubmit={(formEvent) => formEvent.preventDefault()}
        >
            <FormField
                id="event-title"
                label={t("events.form.title")}
                error={errors.title?.message}
            >
                <Input
                    id="event-title"
                    maxLength={EVENT_TITLE_MAX_LENGTH}
                    aria-invalid={Boolean(errors.title)}
                    aria-describedby={fieldDescription("event-title", {
                        error: Boolean(errors.title),
                    })}
                    {...register("title")}
                />
            </FormField>
            <FormField
                id="event-content"
                label={t("events.form.content")}
                help={
                    <span className="nl-events__help-row">
                        {errors.content?.message ? (
                            <span className="nl-field__error" role="alert">
                                {errors.content.message}
                            </span>
                        ) : (
                            <span>{t("events.form.contentHelp")}</span>
                        )}
                        {/* 글자 수는 한도의 75% 를 넘을 때만(2026-09-23 C) */}
                        {content.length >= EVENT_CONTENT_MAX_LENGTH * 0.75 ? (
                            <span>
                                {content.length.toLocaleString(locale)} /{" "}
                                {EVENT_CONTENT_MAX_LENGTH.toLocaleString(
                                    locale
                                )}
                            </span>
                        ) : null}
                    </span>
                }
            >
                <Controller
                    control={control}
                    name="content"
                    render={({ field }) => (
                        <MarkdownEditor
                            id="event-content"
                            name={field.name}
                            inputRef={field.ref}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            maxLength={EVENT_CONTENT_MAX_LENGTH}
                            invalid={Boolean(errors.content)}
                            describedBy={fieldDescription("event-content", {
                                help: true,
                            })}
                            labels={{
                                write: t("events.editor.write"),
                                preview: t("events.editor.preview"),
                                tabs: t("events.editor.tabs"),
                                tools: t("events.editor.tools"),
                                empty: t("events.editor.empty"),
                                back: t("events.editor.back"),
                                headings: t("events.editor.headings"),
                                heading: t("events.editor.heading"),
                                subheading: t("events.editor.subheading"),
                                bold: t("events.editor.bold"),
                                italic: t("events.editor.italic"),
                                strike: t("events.editor.strike"),
                                quote: t("events.editor.quote"),
                                code: t("events.editor.code"),
                                table: t("events.editor.table"),
                                tableBlock: t("events.editor.tableBlock"),
                                rule: t("events.editor.rule"),
                                list: t("events.editor.list"),
                                ordered: t("events.editor.ordered"),
                                link: t("events.editor.link"),
                                image: t("events.editor.image"),
                                uploading: t("events.editor.uploading"),
                                invalidImage: t("events.invalidImage"),
                                uploadFailed: t("events.uploadFailed"),
                            }}
                            onUploadImage={async (file) => {
                                const upload = await requestEventImageUpload(
                                    file.type,
                                    locale
                                );
                                if (!upload.success)
                                    throw new Error(upload.message);
                                return uploadGrantedImage(
                                    file,
                                    upload,
                                    "public"
                                );
                            }}
                            // 미리보기는 공개 글과 같은 틀 — 제목 · 본문(2026-09-23 P2)
                            onPrimaryAction={() => {
                                clearErrors("root");
                                setDialog("submit");
                            }}
                            renderPreview={(value) => (
                                <article className="nl-announcements__detail">
                                    <header className="nl-announcements__heading">
                                        <h1 className="nl-page-title">
                                            {title || t("events.form.title")}
                                        </h1>
                                    </header>
                                    <AnnouncementBody
                                        content={value}
                                        locale={locale}
                                        siteUrl={siteUrl}
                                        externalLabel={t("shell.externalLink")}
                                    />
                                </article>
                            )}
                        />
                    )}
                />
            </FormField>
            {!dialog && errors.root?.server?.message ? (
                <p className="nl-body-secondary nl-field__error" role="alert">
                    {errors.root.server.message}
                </p>
            ) : null}
            <div className="nl-form-bar nl-events__form-actions">
                <div>
                    {event.id !== undefined ? (
                        <EventDeleteButton
                            id={event.id}
                            title={event.values.title}
                            isPublic={Boolean(event.isPublic)}
                        />
                    ) : null}
                </div>
                <div>
                    {/* 저장 상태 — 오른쪽 묶음 맨 앞(2026-09-23 L2) */}
                    {pending !== null || saveState || isDirty ? (
                        <span
                            className="nl-form-bar__state nl-metadata"
                            data-state={
                                pending !== null
                                    ? "saving"
                                    : isDirty
                                      ? "dirty"
                                      : (saveState ?? undefined)
                            }
                            role="status"
                        >
                            {pending !== null
                                ? t("events.save.saving")
                                : isDirty
                                  ? t("events.save.unsaved")
                                  : saveState === "failed"
                                    ? t("events.save.failed")
                                    : t("events.save.saved")}
                        </span>
                    ) : null}
                    <ActionButton
                        variant="secondary"
                        busy={pending === "draft" && dialog === null}
                        busyLabel={t("events.actions.saving")}
                        onClick={() => save("draft")}
                    >
                        {t("events.actions.saveDraft")}
                    </ActionButton>
                    <ActionButton
                        onClick={() => {
                            clearErrors("root");
                            setDialog("submit");
                        }}
                    >
                        {submitLabel}
                    </ActionButton>
                </div>
            </div>

            <ResponsiveDialog
                open={dialog !== null}
                onOpenChange={closeDialog}
                title={t("events.dialog.title")}
                footer={confirm}
                modalFooter={
                    <>
                        <button
                            type="button"
                            className={foundationButtonClass({
                                variant: "secondary",
                            })}
                            onClick={() => closeDialog(false)}
                        >
                            {t("events.actions.cancel")}
                        </button>
                        {confirm}
                    </>
                }
            >
                {settings}
            </ResponsiveDialog>
        </form>
    );
}
