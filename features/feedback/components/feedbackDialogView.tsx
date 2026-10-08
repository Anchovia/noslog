"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import {
    FEEDBACK_CATEGORIES,
    createFeedbackReportSchema,
    type FeedbackCategory,
    type FeedbackReportFormValues,
    type FeedbackReportValues,
} from "@/features/feedback/schemas/feedbackReportSchema";
import { applyFormActionFailure, applyFormRootError } from "@/lib/forms/errors";
import { IMAGE_ACCEPT, imageFileValidationError } from "@/lib/imageUploadRules";
import type { ActionResult } from "@/lib/actions/result";
import ActionButton from "@/components/ui/actionButton";
import { foundationButtonClass } from "@/components/ui/Button";
import {
    FormField,
    TextArea,
    fieldDescription,
} from "@/components/ui/formField";
import FileRow from "@/components/ui/fileRow";
import LoginPrompt from "@/components/ui/loginPrompt";
import ResponsiveDialog from "@/components/ui/responsiveDialog";
import AreaTabs from "@/components/ui/areaTabs";
import { Select } from "@/components/ui/select";
import { StatusMessage } from "@/components/ui/statusMessage";

export interface FeedbackDialogViewProps {
    /** 로그인 안내/작성 화면을 고른다. 저장 서버는 인증을 별도로 다시 검사한다. */
    isAuthenticated: boolean;
    /** 제공하면 외부에서 열림을 제어한다. 생략하면 내부 상태를 쓴다. */
    open?: boolean;
    /** 제출 중 닫기 요청은 무시한다. 실제 열림 변경 요청만 전달한다. */
    onOpenChange?: (open: boolean) => void;
    /** Dialog가 닫힐 때 트리거로 돌아갈 포커스를 조정한다. */
    onCloseAutoFocus?: (event: Event) => void;
    /** 생략하면 기본 버튼, null이면 트리거 없는 외부 제어 창이다. */
    trigger?: ReactNode;
    /** 검증된 값과 선택한 파일을 전달한다. 업로드·저장은 호출부 책임이다. */
    submitReport: (
        values: FeedbackReportValues,
        file: File | null
    ) => Promise<ActionResult>;
    /** 읽지 않은 답변이 하나라도 있으면 기존 점 표시를 한다. */
    unreadCount?: number;
    /** 내 제보 탭을 선택했을 때만 렌더한다. 조회/읽음 처리도 호출부 책임이다. */
    feedbackList: ReactNode;
}

export default function FeedbackDialogView({
    isAuthenticated,
    open: controlledOpen,
    onOpenChange,
    onCloseAutoFocus,
    trigger,
    submitReport,
    unreadCount: unread = 0,
    feedbackList,
}: FeedbackDialogViewProps) {
    const localizedHref = useLocalizedHref();
    const locale = useLocale();
    const t = useTranslations();
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
    const formId = useId();
    const submitLock = useRef(false);
    const requestEpoch = useRef(0);
    // 외부가 창을 강제로 닫거나 다시 열어도 이전 제출 결과를 새 창에 반영하지 않는다.
    useEffect(() => {
        requestEpoch.current += 1;
        return () => {
            requestEpoch.current += 1;
        };
    }, [open]);
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
        const epoch = requestEpoch.current;
        try {
            const result = await submitReport(values, file);
            if (requestEpoch.current !== epoch) return;
            if (!result.success) {
                applyFormActionFailure(setError, result);
                return;
            }
            setSubmitted(true);
            reset({ category, content: "", imageUrl: "" });
            setFile(null);
        } catch {
            if (requestEpoch.current === epoch)
                applyFormRootError(setError, t("feedback.error"));
        }
    }

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submitLock.current) return;
        submitLock.current = true;
        try {
            await handleSubmit(handleFeedbackSubmit)(event);
        } finally {
            submitLock.current = false;
        }
    }

    function changeOpen(nextOpen: boolean) {
        if (isSubmitting || submitLock.current) return;
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
        <LoginPrompt
            title={t("feedback.loginPromptTitle")}
            description={t("feedback.loginPromptBody")}
        />
    ) : submitted ? (
        <div className="nl-feedback-done" role="status">
            <p className="nl-emphasis-label">{t("feedback.doneTitle")}</p>
            <p className="nl-body-secondary nl-muted">
                {t("feedback.doneBody")}
            </p>
        </div>
    ) : view === "mine" ? (
        viewTabs(feedbackList)
    ) : (
        viewTabs(
            <form
                id={formId}
                onSubmit={submit}
                noValidate
                className="nl-feedback-form"
                aria-busy={isSubmitting}
            >
                <FormField
                    id={`${formId}-category`}
                    label={t("feedback.categoryLabel")}
                >
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
                </FormField>
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
                        // 붙인 파일 = 썸네일 · 이름 · 크기 · 지우기 한 줄(공용 파일 줄 — 오락실 제보와 같음)
                        <FileRow
                            file={file}
                            removeLabel={t("feedback.removeImage")}
                            disabled={isSubmitting}
                            onRemove={() => setFile(null)}
                        />
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
    const loginAction = (
        <Link
            href={localizedHref("/login")}
            className={foundationButtonClass()}
        >
            {t("common.login")}
        </Link>
    );
    const closeAction = (
        <ActionButton
            variant={view === "mine" ? "secondary" : "primary"}
            onClick={() => changeOpen(false)}
        >
            {t("common.close")}
        </ActionButton>
    );
    const submitAction = (
        <ActionButton
            type="submit"
            form={formId}
            busy={isSubmitting}
            busyLabel={t("feedback.sending")}
        >
            {t("feedback.send")}
        </ActionButton>
    );
    const fullScreenFooter = !isAuthenticated
        ? loginAction
        : submitted || view === "mine"
          ? closeAction
          : submitAction;
    const modalFooter = !isAuthenticated ? (
        <>
            <ActionButton variant="secondary" onClick={() => changeOpen(false)}>
                {t("feedback.cancel")}
            </ActionButton>
            {loginAction}
        </>
    ) : submitted || view === "mine" ? (
        closeAction
    ) : (
        <>
            <ActionButton
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => changeOpen(false)}
            >
                {t("feedback.cancel")}
            </ActionButton>
            {submitAction}
        </>
    );

    // 긴 창은 672 미만에서 전체 화면(가이드 대화상자 절 · 2026-09-18 구현)
    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={changeOpen}
            title={t("feedback.title")}
            // 로그아웃이면 로그인 안내 한 덩이라 기본 폭(2026-09-26 F1)
            size={isAuthenticated ? "large" : "small"}
            className="nl-feedback-dialog"
            onCloseAutoFocus={onCloseAutoFocus}
            trigger={triggerNode}
            footer={fullScreenFooter}
            modalFooter={modalFooter}
        >
            {body}
        </ResponsiveDialog>
    );
}
