"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { toast } from "sonner";

import {
    createAnnouncement,
    requestAnnouncementImageUpload,
    updateAnnouncement,
} from "@/app/admin/announcements/actions";
import AnnouncementBody from "@/features/announcements/components/announcementBody";
import AnnouncementDeleteButton from "@/features/announcements/components/announcementDeleteButton";
import {
    ANNOUNCEMENT_CATEGORY_LABELS,
    ANNOUNCEMENT_CONTENT_MAX_LENGTH,
    ANNOUNCEMENT_LOCALES,
    ANNOUNCEMENT_LOCALE_LABELS,
    ANNOUNCEMENT_PLACEMENT_LABELS,
    ANNOUNCEMENT_PLACEMENTS,
    ANNOUNCEMENT_SLUG_MAX_LENGTH,
    ANNOUNCEMENT_TITLE_MAX_LENGTH,
    announcementFormSchema,
    createAnnouncementFormData,
    suggestAnnouncementSlug,
    type AnnouncementFormValues,
    type AnnouncementValues,
} from "@/features/announcements/schemas/announcementSchema";
import {
    ANNOUNCEMENT_CATEGORIES,
    type AnnouncementCategory,
} from "@/features/announcements/schemas/publicAnnouncementSchema";
import ActionButton from "@/components/ui/actionButton";
import { FormField, Input, fieldDescription } from "@/components/ui/formField";
import FullScreenDialog from "@/components/ui/fullScreenDialog";
import MarkdownEditor from "@/components/ui/markdownEditor";
import type { MarkdownEditorLabels } from "@/components/ui/markdownEditor";
import ModalDialog from "@/components/ui/modalDialog";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import { Select } from "@/components/ui/select";
import { foundationButtonClass } from "@/components/ui/Button";
import { applyFormActionFailure, applyFormRootError } from "@/lib/forms/errors";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import type { Locale } from "@/lib/i18n/routing";
import { uploadGrantedImage } from "@/lib/uploads/clientImageUpload";

export interface AnnouncementEditorData {
    id?: number;
    publicSlug: string;
    placement: AnnouncementFormValues["placement"];
    category: AnnouncementCategory;
    priority: number;
    activeFrom: string;
    expiresAt: string;
    isPublished: boolean;
    translations: Record<Locale, { title: string; content: string }>;
}

export const emptyAnnouncementEditorData: AnnouncementEditorData = {
    publicSlug: "",
    placement: "ROUTINE",
    category: "NOTICE",
    priority: 0,
    activeFrom: "",
    expiresAt: "",
    isPublished: false,
    translations: {
        ko: { title: "", content: "" },
        ja: { title: "", content: "" },
        en: { title: "", content: "" },
    },
};

// 게시 창에 있는 칸 — 이 칸에 오류가 나면 창을 열어 보여 준다
const DIALOG_FIELDS = [
    "publicSlug",
    "placement",
    "category",
    "priority",
    "activeFrom",
    "expiresAt",
] as const;

const EDITOR_LABELS: MarkdownEditorLabels = {
    write: "쓰기",
    preview: "미리보기",
    tabs: "본문 보기",
    tools: "서식",
    empty: "미리 볼 내용이 없습니다.",
    heading: "소제목",
    bold: "굵게",
    list: "목록",
    ordered: "번호 목록",
    link: "링크",
    image: "이미지",
    uploading: "이미지 올리는 중…",
    invalidImage: "JPG · PNG · WebP · 4MB 까지 올릴 수 있습니다.",
    uploadFailed: "이미지를 올리지 못했습니다.",
};

// 본문 이미지 한 장 — 한 장 전용 토큰으로 공개 저장소에 바로 올리고 주소를 돌려준다
async function uploadAnnouncementImage(file: File) {
    const upload = await requestAnnouncementImageUpload(file.type);
    if (!upload.success) throw new Error(upload.message);
    return uploadGrantedImage(file, upload, "public");
}

type SaveMode = "draft" | "publish";

// 공지 등록·수정 (2026-09-18 E2). 쓰는 화면엔 언어 탭 · 제목 · 본문만 두고, 분류 · 종류 · 기간 · 주소는
// 「게시」 를 누르면 뜨는 창으로. 번역 세 벌은 탭으로 오가되 입력은 모두 마운트해 값을 유지한다
export default function AnnouncementEditor({
    announcement,
    siteUrl,
}: {
    announcement: AnnouncementEditorData;
    siteUrl: string;
}) {
    const router = useRouter();
    const isCreate = announcement.id === undefined;
    const wasPublished = announcement.isPublished;
    const [locale, setLocale] = useState<Locale>("ko");
    const [dialog, setDialog] = useState<SaveMode | null>(null);
    const [pending, setPending] = useState<SaveMode | null>(null);
    const wide = useMediaQuery("(min-width: 672px)");
    const {
        register,
        control,
        handleSubmit,
        getValues,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<AnnouncementFormValues, unknown, AnnouncementValues>({
        resolver: zodResolver(announcementFormSchema),
        defaultValues: {
            publicSlug: announcement.publicSlug,
            placement: announcement.placement,
            category: announcement.category,
            priority: announcement.priority,
            activeFrom: announcement.activeFrom,
            expiresAt: announcement.expiresAt,
            isPublished: announcement.isPublished,
            translations: announcement.translations,
        },
    });
    const placement = useWatch({ control, name: "placement" });
    const translations = useWatch({ control, name: "translations" });

    // 오류가 난 곳으로 데려간다 — 번역이면 창을 닫고 그 언어 탭, 게시 창 칸이면 창을 연다
    function reveal(
        fieldErrors: FieldErrors<AnnouncementFormValues>,
        mode: SaveMode
    ) {
        const failed = ANNOUNCEMENT_LOCALES.find(
            (item) => fieldErrors.translations?.[item]
        );
        if (failed) {
            setDialog(null);
            setLocale(failed);
            return;
        }
        if (DIALOG_FIELDS.some((field) => fieldErrors[field])) setDialog(mode);
    }

    function suggestSlug() {
        const { en, ko } = getValues("translations");
        return (
            suggestAnnouncementSlug(en.title) ||
            suggestAnnouncementSlug(ko.title)
        );
    }

    function save(mode: SaveMode, publish: boolean) {
        clearErrors();
        // 주소를 비워 뒀으면 제목에서 만든다 — 임시저장도 주소가 필요하다(저장 규칙은 그대로)
        if (!getValues("publicSlug").trim()) {
            const suggestion = suggestSlug();
            if (suggestion) setValue("publicSlug", suggestion);
        }
        setValue("isPublished", publish);
        return handleSubmit(
            async (values) => {
                setPending(mode);
                try {
                    const formData = createAnnouncementFormData(
                        values,
                        announcement.id
                    );
                    const result = isCreate
                        ? await createAnnouncement(formData)
                        : await updateAnnouncement(formData);
                    if (!result.success) {
                        applyFormActionFailure(setError, result, toast.error);
                        return;
                    }
                    setDialog(null);
                    toast.success(result.message);
                    if (isCreate)
                        router.replace(`/admin/announcements/${result.id}`);
                    else router.refresh();
                } catch {
                    const message = isCreate
                        ? "공지사항을 등록하지 못했습니다."
                        : "공지사항을 저장하지 못했습니다.";
                    applyFormRootError(setError, message, toast.error);
                } finally {
                    setPending(null);
                }
            },
            (fieldErrors) => {
                reveal(fieldErrors, mode);
                toast.error("공지 입력을 확인해주세요.");
            }
        )();
    }

    function fillSlugFromTitle() {
        const suggestion = suggestSlug();
        if (!suggestion) {
            toast.error("영문 제목에서 공개 주소를 만들 수 없습니다.");
            return;
        }
        setValue("publicSlug", suggestion, {
            shouldDirty: true,
            shouldValidate: true,
        });
    }

    const localeHasError = (item: Locale) =>
        Boolean(errors.translations?.[item]);
    // 「게시」 = 아직 비공개인 글을 공개 · 「업데이트」 = 공개 중인 글을 고침 (WordPress 방식)
    const publishLabel = wasPublished ? "업데이트" : "게시";
    const dialogTitle =
        dialog === "draft"
            ? "게시 설정"
            : wasPublished
              ? "공지 업데이트"
              : "공지 게시";
    const draftLabel = wasPublished ? "비공개로 전환" : "임시저장";
    const confirmLabel = dialog === "draft" ? draftLabel : publishLabel;

    const settings = (
        <div className="nl-admin-form__section">
            <FormField
                id="announcement-category"
                label="분류"
                help="제목 앞에 붙는 분류 태그. 홈 · 목록 · 상세에 함께 표시됩니다."
                error={errors.category?.message}
            >
                <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                        <Select
                            id="announcement-category"
                            invalid={Boolean(errors.category)}
                            aria-describedby={fieldDescription(
                                "announcement-category",
                                { help: true, error: Boolean(errors.category) }
                            )}
                            value={field.value ?? ""}
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                            triggerRef={field.ref}
                            options={ANNOUNCEMENT_CATEGORIES.map((value) => ({
                                value,
                                label: ANNOUNCEMENT_CATEGORY_LABELS[value],
                            }))}
                        />
                    )}
                />
            </FormField>
            <FormField
                id="announcement-placement"
                label="공지 종류"
                help="중대 공지는 홈 맨 위 배너와 목록 맨 위에 고정되며 노출 기간이 필요합니다."
                error={errors.placement?.message}
            >
                <Controller
                    control={control}
                    name="placement"
                    render={({ field }) => (
                        <SegmentedControl
                            label="공지 종류"
                            value={field.value}
                            onValueChange={field.onChange}
                            options={ANNOUNCEMENT_PLACEMENTS.map((value) => ({
                                value,
                                label: ANNOUNCEMENT_PLACEMENT_LABELS[value],
                            }))}
                        />
                    )}
                />
            </FormField>
            {placement === "SERVICE_CRITICAL" ? (
                <>
                    <FormField
                        id="announcement-active-from"
                        label="노출 시작 (한국 시간)"
                        help="공개 시각보다 이르면 공개 시각으로 맞춥니다."
                        error={errors.activeFrom?.message}
                    >
                        <Input
                            id="announcement-active-from"
                            type="datetime-local"
                            aria-invalid={Boolean(errors.activeFrom)}
                            aria-describedby={fieldDescription(
                                "announcement-active-from",
                                {
                                    help: true,
                                    error: Boolean(errors.activeFrom),
                                }
                            )}
                            {...register("activeFrom")}
                        />
                    </FormField>
                    <FormField
                        id="announcement-expires-at"
                        label="노출 종료 (한국 시간)"
                        help="비워 두면 비공개로 바꿀 때까지 유지됩니다."
                        error={errors.expiresAt?.message}
                    >
                        <Input
                            id="announcement-expires-at"
                            type="datetime-local"
                            aria-invalid={Boolean(errors.expiresAt)}
                            aria-describedby={fieldDescription(
                                "announcement-expires-at",
                                { help: true, error: Boolean(errors.expiresAt) }
                            )}
                            {...register("expiresAt")}
                        />
                    </FormField>
                    <FormField
                        id="announcement-priority"
                        label="우선순위"
                        help="여러 중대 공지가 겹치면 숫자가 큰 쪽을 먼저 보여줍니다."
                        error={errors.priority?.message}
                    >
                        <Input
                            id="announcement-priority"
                            type="number"
                            inputMode="numeric"
                            min={0}
                            max={999}
                            step={1}
                            aria-invalid={Boolean(errors.priority)}
                            aria-describedby={fieldDescription(
                                "announcement-priority",
                                { help: true, error: Boolean(errors.priority) }
                            )}
                            {...register("priority")}
                        />
                    </FormField>
                </>
            ) : null}
            <FormField
                id="announcement-slug"
                label="공개 주소"
                help={
                    <>
                        <code>/announcements/</code> 뒤에 붙는 주소. 영문 소문자
                        · 숫자 · 하이픈만.
                    </>
                }
                error={errors.publicSlug?.message}
            >
                <Input
                    id="announcement-slug"
                    lang="en"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    maxLength={ANNOUNCEMENT_SLUG_MAX_LENGTH}
                    aria-invalid={Boolean(errors.publicSlug)}
                    aria-describedby={fieldDescription("announcement-slug", {
                        help: true,
                        error: Boolean(errors.publicSlug),
                    })}
                    {...register("publicSlug")}
                />
                <button
                    type="button"
                    className={foundationButtonClass({ variant: "secondary" })}
                    onClick={fillSlugFromTitle}
                >
                    제목에서 만들기
                </button>
            </FormField>
            {dialog === "publish" && !wasPublished ? (
                <p className="nl-field__help">
                    세 언어 번역이 모두 있어야 공개됩니다. 처음 공개한 시각이
                    공개일로 남습니다.
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
            busyLabel="저장 중"
            onClick={() =>
                save(dialog ?? "publish", dialog === "draft" ? false : true)
            }
        >
            {confirmLabel}
        </ActionButton>
    );
    const closeDialog = (next: boolean) => {
        if (!next && pending === null) setDialog(null);
    };

    return (
        <form
            className="nl-admin-form"
            noValidate
            onSubmit={(event) => event.preventDefault()}
        >
            <div
                role="tablist"
                aria-label="언어"
                className="nl-tabs nl-tabs--primary"
            >
                {ANNOUNCEMENT_LOCALES.map((item) => (
                    <button
                        key={item}
                        type="button"
                        role="tab"
                        id={`announcement-tab-${item}`}
                        aria-selected={locale === item}
                        aria-controls={`announcement-panel-${item}`}
                        data-state={locale === item ? "active" : "inactive"}
                        className="nl-tabs__item nl-control"
                        onClick={() => setLocale(item)}
                    >
                        {ANNOUNCEMENT_LOCALE_LABELS[item]}
                        {localeHasError(item) ? (
                            <span
                                className="nl-admin-form__error-dot"
                                aria-label="입력 오류"
                            />
                        ) : null}
                    </button>
                ))}
            </div>
            {ANNOUNCEMENT_LOCALES.map((item) => {
                const titleId = `announcement-title-${item}`;
                const contentId = `announcement-content-${item}`;
                const titleError = errors.translations?.[item]?.title?.message;
                const contentError =
                    errors.translations?.[item]?.content?.message;
                const length = translations?.[item]?.content?.length ?? 0;
                return (
                    <div
                        key={item}
                        role="tabpanel"
                        id={`announcement-panel-${item}`}
                        aria-labelledby={`announcement-tab-${item}`}
                        hidden={locale !== item}
                        className="nl-admin-form__section"
                    >
                        <FormField id={titleId} label="제목" error={titleError}>
                            <Input
                                id={titleId}
                                lang={item}
                                maxLength={ANNOUNCEMENT_TITLE_MAX_LENGTH}
                                aria-invalid={Boolean(titleError)}
                                aria-describedby={fieldDescription(titleId, {
                                    error: Boolean(titleError),
                                })}
                                {...register(`translations.${item}.title`)}
                            />
                        </FormField>
                        {/* 오류는 안내 자리를 대신하고 글자 수는 그대로 — 피드백 창과 같은 도움말 줄 */}
                        <FormField
                            id={contentId}
                            label="본문"
                            help={
                                <span className="nl-admin-form__help-row">
                                    {contentError ? (
                                        <span
                                            className="nl-field__error"
                                            role="alert"
                                        >
                                            {contentError}
                                        </span>
                                    ) : (
                                        <span>
                                            마크다운으로 씁니다 · 이미지는 버튼
                                            · 붙여 넣기 · 끌어다 놓기
                                        </span>
                                    )}
                                    <span>
                                        {length.toLocaleString("ko-KR")} /{" "}
                                        {ANNOUNCEMENT_CONTENT_MAX_LENGTH.toLocaleString(
                                            "ko-KR"
                                        )}
                                    </span>
                                </span>
                            }
                        >
                            <Controller
                                control={control}
                                name={`translations.${item}.content`}
                                render={({ field }) => (
                                    <MarkdownEditor
                                        id={contentId}
                                        name={field.name}
                                        inputRef={field.ref}
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        lang={item}
                                        maxLength={
                                            ANNOUNCEMENT_CONTENT_MAX_LENGTH
                                        }
                                        invalid={Boolean(contentError)}
                                        describedBy={fieldDescription(
                                            contentId,
                                            { help: true }
                                        )}
                                        labels={EDITOR_LABELS}
                                        onUploadImage={uploadAnnouncementImage}
                                        renderPreview={(value) => (
                                            <AnnouncementBody
                                                content={value}
                                                locale={item}
                                                siteUrl={siteUrl}
                                                externalLabel="외부 링크"
                                            />
                                        )}
                                    />
                                )}
                            />
                        </FormField>
                    </div>
                );
            })}

            {!dialog && errors.root?.server?.message ? (
                <p className="nl-body-secondary nl-field__error" role="alert">
                    {errors.root.server.message}
                </p>
            ) : null}

            <div className="nl-admin-form__actions">
                <div>
                    {!isCreate && announcement.id !== undefined ? (
                        <AnnouncementDeleteButton
                            id={announcement.id}
                            title={announcement.translations.ko.title}
                        />
                    ) : null}
                    {!isCreate && wasPublished && announcement.publicSlug ? (
                        <a
                            href={`/announcements/${announcement.publicSlug}`}
                            target="_blank"
                            rel="noreferrer"
                            className={foundationButtonClass({
                                variant: "ghost",
                            })}
                        >
                            공개 페이지
                            <ExternalLink
                                className="nl-icon-small"
                                aria-hidden
                            />
                        </a>
                    ) : null}
                </div>
                <div>
                    <ActionButton
                        variant="secondary"
                        busy={pending !== null && dialog === null}
                        busyLabel="저장 중"
                        onClick={() => save("draft", false)}
                    >
                        {draftLabel}
                    </ActionButton>
                    <ActionButton
                        onClick={() => {
                            clearErrors();
                            setDialog("publish");
                        }}
                    >
                        {publishLabel}
                    </ActionButton>
                </div>
            </div>

            {wide ? (
                <ModalDialog
                    open={dialog !== null}
                    onOpenChange={closeDialog}
                    title={dialogTitle}
                    footer={
                        <>
                            <button
                                type="button"
                                className={foundationButtonClass({
                                    variant: "secondary",
                                })}
                                onClick={() => closeDialog(false)}
                            >
                                취소
                            </button>
                            {confirm}
                        </>
                    }
                >
                    {settings}
                </ModalDialog>
            ) : (
                <FullScreenDialog
                    open={dialog !== null}
                    onOpenChange={closeDialog}
                    title={dialogTitle}
                    footer={confirm}
                >
                    {settings}
                </FullScreenDialog>
            )}
        </form>
    );
}
