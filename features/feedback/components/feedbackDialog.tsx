"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, MessageSquare, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
    discardFeedbackImage,
    requestFeedbackImageUpload,
    submitFeedbackReport,
} from "@/app/(nevigation)/(home)/feedbackActions";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import {
    FEEDBACK_CATEGORIES,
    createFeedbackReportFormData,
    createFeedbackReportSchema,
    type FeedbackCategory,
    type FeedbackReportFormValues,
    type FeedbackReportValues,
} from "@/features/feedback/schemas/feedbackReportSchema";
import { applyFormActionFailure, applyFormRootError } from "@/lib/forms/errors";
import useObjectUrl from "@/lib/hooks/useObjectUrl";
import { IMAGE_ACCEPT, imageFileValidationError } from "@/lib/imageUploadRules";
import { uploadGrantedImage } from "@/lib/uploads/clientImageUpload";
import ActionButton from "@/components/ui/actionButton";
import { foundationButtonClass } from "@/components/ui/Button";
import {
    FormField,
    TextArea,
    fieldDescription,
} from "@/components/ui/formField";
import FullScreenDialog from "@/components/ui/fullScreenDialog";
import IconButton from "@/components/ui/iconButton";
import ModalDialog from "@/components/ui/modalDialog";
import AreaTabs from "@/components/ui/areaTabs";
import { Select } from "@/components/ui/select";
import { StatusMessage } from "@/components/ui/statusMessage";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { useFeedbackUnread } from "./feedbackUnread";
import MyFeedbackList from "./myFeedbackList";

export default function FeedbackDialog({
    isAuthenticated,
    open: controlledOpen,
    onOpenChange,
    onCloseAutoFocus,
    trigger,
}: {
    isAuthenticated: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onCloseAutoFocus?: (event: Event) => void;
    trigger?: ReactNode;
}) {
    const localizedHref = useLocalizedHref();
    const locale = useLocale();
    const t = useTranslations();
    // 읽지 않은 답변 수 — 「내 제보」 탭의 점(2026-09-18 F1). 헤더 · 홈 칸이 같은 값을 쓴다
    const { count: unread, markSeen: onRepliesSeen } = useFeedbackUnread();
    const feedbackReportSchema = useMemo(
        () => createFeedbackReportSchema(t),
        [t]
    );
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen ?? internalOpen;
    const [file, setFile] = useState<File | null>(null);
    const [submitted, setSubmitted] = useState(false);
    // 창 안 두 탭 — 새로 쓰기 · 내 제보(2026-09-18 F1)
    const [view, setView] = useState<"write" | "mine">("write");
    const wide = useMediaQuery("(min-width: 672px)");
    // 붙인 이미지 미리보기 — 브라우저 안에서만 쓰는 임시 주소, 파일이 바뀌거나 창이 닫히면 풀어 준다
    const preview = useObjectUrl(file);
    const formId = useId();
    const {
        register,
        handleSubmit,
        setError,
        setValue,
        clearErrors,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<FeedbackReportFormValues, unknown, FeedbackReportValues>({
        resolver: zodResolver(feedbackReportSchema),
        defaultValues: {
            category: "bug",
            content: "",
            imageUrl: "",
        },
    });
    const content = useWatch({ control, name: "content" });
    const category =
        (useWatch({ control, name: "category" }) as FeedbackCategory) ?? "bug";
    // 내용 오류는 칸 아래에, 그 밖(첨부 · 서버)은 폼 끝 상태 메시지로
    const serverError =
        errors.imageUrl?.message ??
        errors.root?.file?.message ??
        errors.root?.server?.message;

    function changeFile(event: ChangeEvent<HTMLInputElement>) {
        const nextFile = event.target.files?.[0] ?? null;
        if (!nextFile) return;
        const validationError = imageFileValidationError(nextFile);
        if (validationError === "type") {
            setError("root.file", {
                type: "file",
                message: t("feedback.invalidImage"),
            });
            event.target.value = "";
            return;
        }
        if (validationError === "size") {
            setError("root.file", {
                type: "file",
                message: t("feedback.imageTooLarge"),
            });
            event.target.value = "";
            return;
        }
        setFile(nextFile);
        clearErrors("root");
    }

    async function handleFeedbackSubmit(values: FeedbackReportValues) {
        clearErrors();
        let uploadedUrl = "";

        try {
            if (file) {
                const upload = await requestFeedbackImageUpload(
                    file.type,
                    locale
                );
                if (!upload.success) {
                    applyFormRootError(setError, upload.message);
                    return;
                }
                uploadedUrl = await uploadGrantedImage(file, upload, "private");
            }

            const result = await submitFeedbackReport(
                createFeedbackReportFormData(
                    { ...values, imageUrl: uploadedUrl || null },
                    locale
                )
            );
            if (!result.success) {
                if (uploadedUrl) {
                    await discardFeedbackImage(uploadedUrl).catch(() => null);
                }
                applyFormActionFailure(setError, result);
                return;
            }

            setSubmitted(true);
            reset({ category, content: "", imageUrl: "" });
            setFile(null);
        } catch {
            if (uploadedUrl) {
                await discardFeedbackImage(uploadedUrl).catch(() => null);
            }
            applyFormRootError(setError, t("feedback.error"));
        }
    }

    const submit = handleSubmit(handleFeedbackSubmit);

    function changeOpen(nextOpen: boolean) {
        if (isSubmitting) return;
        setInternalOpen(nextOpen);
        onOpenChange?.(nextOpen);
        if (!nextOpen) {
            clearErrors();
            setSubmitted(false);
            setView("write");
        }
    }

    const triggerNode =
        trigger === null
            ? undefined
            : (trigger ?? (
                  <button
                      className={foundationButtonClass({
                          variant: "secondary",
                      })}
                  >
                      <MessageSquare className="nl-icon" aria-hidden />
                      {t("shell.feedback")}
                  </button>
              ));

    // 창 안 세 상태: 로그인 필요 · 보낸 뒤 · 작성 (2026-09-18 — 보낸 뒤는 창 안에 남긴다)
    // 창 안 두 탭(2026-09-19 C) — 창의 구역이라 1단 밑줄 탭. 종류는 입력이라 셀렉트
    const viewTabs = (panel: ReactNode) => (
        <AreaTabs<"write" | "mine">
            label={t("feedback.title")}
            value={view}
            onValueChange={setView}
            options={[
                { value: "write", label: t("feedback.tab.write") },
                {
                    value: "mine",
                    label: (
                        <>
                            {t("feedback.tab.mine")}
                            {unread ? (
                                <span
                                    className="nl-unread-dot"
                                    role="img"
                                    aria-label={t("feedback.newReply")}
                                />
                            ) : null}
                        </>
                    ),
                },
            ]}
        >
            {panel}
        </AreaTabs>
    );
    const body = !isAuthenticated ? (
        <StatusMessage title={t("feedback.loginRequired")} />
    ) : submitted ? (
        <div className="nl-feedback-done" role="status">
            <span className="nl-feedback-done__mark" aria-hidden>
                <Check className="nl-icon" />
            </span>
            <p className="nl-emphasis-label">{t("feedback.doneTitle")}</p>
            <p className="nl-body-secondary nl-muted">
                {t("feedback.doneBody")}
            </p>
        </div>
    ) : view === "mine" ? (
        viewTabs(<MyFeedbackList onLoaded={onRepliesSeen} />)
    ) : (
        viewTabs(
            <form
                id={formId}
                onSubmit={submit}
                noValidate
                className="nl-feedback-form"
                aria-busy={isSubmitting}
            >
                <div className="nl-field">
                    <label
                        htmlFor={`${formId}-category`}
                        className="nl-field__label"
                    >
                        {t("feedback.categoryLabel")}
                    </label>
                    <Select
                        id={`${formId}-category`}
                        value={category}
                        disabled={isSubmitting}
                        onValueChange={(next) =>
                            setValue("category", next as FeedbackCategory, {
                                shouldValidate: false,
                            })
                        }
                        options={FEEDBACK_CATEGORIES.map((value) => ({
                            value,
                            label: t(`feedback.category.${value}`),
                        }))}
                    />
                </div>
                {/* 오류는 안내 문구 자리를 대신하고 글자 수는 그대로 — 작은 글자가 두 줄로 쌓이지 않게 (시안 D2 · M3 · Carbon · Primer) */}
                <FormField
                    id="feedback-content"
                    label={t("feedback.contentLabel")}
                    help={
                        <>
                            {errors.content?.message ? (
                                <span className="nl-field__error" role="alert">
                                    {errors.content.message}
                                </span>
                            ) : (
                                <span>{t(`feedback.help.${category}`)}</span>
                            )}
                            <span className="nl-feedback-form__count">
                                {(content?.length ?? 0).toLocaleString(locale)}{" "}
                                / 1,000
                            </span>
                        </>
                    }
                >
                    <TextArea
                        id="feedback-content"
                        maxLength={1000}
                        // 5줄 = 글자 24 × 5 + 공용 여러 줄 입력칸 안쪽 11 × 2 + 경계 2 = 144 — 높이는 줄 수로만 정한다(부품 규격을 덮어쓰지 않는다)
                        rows={5}
                        readOnly={isSubmitting}
                        aria-invalid={Boolean(errors.content)}
                        aria-describedby={fieldDescription("feedback-content", {
                            help: true,
                        })}
                        {...register("content")}
                    />
                </FormField>
                <input type="hidden" {...register("imageUrl")} />
                <div className="nl-field">
                    <span className="nl-field__label">
                        {t("feedback.imageLabel")}{" "}
                        <span className="nl-muted">
                            {t("feedback.optional")}
                        </span>
                    </span>
                    {file ? (
                        // 붙인 파일 = 이름 · 크기 · 지우기 한 줄 (2026-09-18 A2 · Carbon 파일 목록 모양)
                        <div className="nl-feedback-file">
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt=""
                                    width={36}
                                    height={36}
                                    unoptimized
                                    className="nl-feedback-file__thumb"
                                />
                            ) : null}
                            <span className="nl-feedback-file__name nl-body-secondary">
                                {file.name}
                            </span>
                            <span className="nl-metadata nl-muted">
                                {formatBytes(file.size, locale)}
                            </span>
                            <IconButton
                                label={t("feedback.removeImage")}
                                disabled={isSubmitting}
                                onClick={() => setFile(null)}
                            >
                                <X className="nl-icon" aria-hidden />
                            </IconButton>
                        </div>
                    ) : (
                        <label
                            aria-disabled={isSubmitting}
                            // 첨부 = 입력 칸 역할이라 L — 붙인 뒤 파일 줄(L)과 높이가 같아 자리가 튀지 않는다 (2026-09-18 사용자 결정)
                            className={foundationButtonClass({
                                variant: "secondary",
                            })}
                        >
                            {t("feedback.addImage")}
                            <input
                                type="file"
                                accept={IMAGE_ACCEPT}
                                onChange={changeFile}
                                disabled={isSubmitting}
                                className="sr-only"
                            />
                        </label>
                    )}
                    <p className="nl-field__help">{t("feedback.imageHelp")}</p>
                </div>
                {serverError ? (
                    <StatusMessage
                        severity="danger"
                        title={serverError}
                        role="alert"
                    />
                ) : null}
            </form>
        )
    );

    // 버튼 — 폰(전체 화면)은 닫기가 머리 ×라 주 액션 하나, 창은 취소 · 주 액션. 보내기는 늘 켜 둔다(비면 칸 아래 오류, D2)
    const actions = !isAuthenticated ? (
        <>
            {wide ? (
                <ActionButton
                    variant="secondary"
                    onClick={() => changeOpen(false)}
                >
                    {t("common.close")}
                </ActionButton>
            ) : null}
            <Link
                href={localizedHref("/login")}
                className={foundationButtonClass()}
            >
                {t("common.login")}
            </Link>
        </>
    ) : submitted || view === "mine" ? (
        <ActionButton
            variant={view === "mine" ? "secondary" : "primary"}
            onClick={() => changeOpen(false)}
        >
            {t("common.close")}
        </ActionButton>
    ) : (
        <>
            {wide ? (
                <ActionButton
                    variant="secondary"
                    disabled={isSubmitting}
                    onClick={() => changeOpen(false)}
                >
                    {t("feedback.cancel")}
                </ActionButton>
            ) : null}
            <ActionButton
                type="submit"
                form={formId}
                busy={isSubmitting}
                busyLabel={t("feedback.sending")}
            >
                {t("feedback.send")}
            </ActionButton>
        </>
    );

    // 긴 창은 672 미만에서 전체 화면(가이드 대화상자 절 · 2026-09-18 구현)
    return wide ? (
        <ModalDialog
            open={open}
            onOpenChange={changeOpen}
            title={t("feedback.title")}
            width="wide"
            className="nl-feedback-dialog"
            onCloseAutoFocus={onCloseAutoFocus}
            trigger={triggerNode}
            footer={actions}
        >
            {body}
        </ModalDialog>
    ) : (
        <FullScreenDialog
            open={open}
            onOpenChange={changeOpen}
            title={t("feedback.title")}
            onCloseAutoFocus={onCloseAutoFocus}
            trigger={triggerNode}
            footer={actions}
        >
            {body}
        </FullScreenDialog>
    );
}

function formatBytes(bytes: number, locale: string) {
    const format = (value: number) =>
        value.toLocaleString(locale, { maximumFractionDigits: 1 });
    return bytes >= 1024 * 1024
        ? `${format(bytes / 1024 / 1024)}MB`
        : `${format(Math.max(1, Math.round(bytes / 1024)))}KB`;
}
