"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
    createAnnouncement,
    updateAnnouncement,
} from "@/app/admin/announcements/actions";
import AnnouncementDeleteButton from "@/features/announcements/components/announcementDeleteButton";
import {
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
import ActionButton from "@/components/ui/actionButton";
import { Checkbox } from "@/components/ui/checkbox";
import {
    FormField,
    Input,
    TextArea,
    fieldDescription,
} from "@/components/ui/formField";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import { foundationButtonClass } from "@/components/ui/Button";
import { applyFormFieldErrors } from "@/lib/forms/errors";
import type { Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

export interface AnnouncementEditorData {
    id?: number;
    publicSlug: string;
    placement: AnnouncementFormValues["placement"];
    priority: number;
    activeFrom: string;
    expiresAt: string;
    isPublished: boolean;
    translations: Record<Locale, { title: string; content: string }>;
}

export const emptyAnnouncementEditorData: AnnouncementEditorData = {
    publicSlug: "",
    placement: "ROUTINE",
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

// 공지 등록·수정 폼. 번역 세 벌은 탭으로 오가되 입력은 모두 마운트해 값을 유지함
export default function AnnouncementEditor({
    announcement,
}: {
    announcement: AnnouncementEditorData;
}) {
    const router = useRouter();
    const isCreate = announcement.id === undefined;
    const [locale, setLocale] = useState<Locale>("ko");
    const {
        register,
        control,
        handleSubmit,
        getValues,
        setValue,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<AnnouncementFormValues, unknown, AnnouncementValues>({
        resolver: zodResolver(announcementFormSchema),
        defaultValues: {
            publicSlug: announcement.publicSlug,
            placement: announcement.placement,
            priority: announcement.priority,
            activeFrom: announcement.activeFrom,
            expiresAt: announcement.expiresAt,
            isPublished: announcement.isPublished,
            translations: announcement.translations,
        },
    });
    const placement = useWatch({ control, name: "placement" });
    const isPublished = useWatch({ control, name: "isPublished" });
    const publicSlug = useWatch({ control, name: "publicSlug" });

    async function submit(values: AnnouncementValues) {
        clearErrors();
        try {
            const formData = createAnnouncementFormData(
                values,
                announcement.id
            );
            const result = isCreate
                ? await createAnnouncement(formData)
                : await updateAnnouncement(formData);
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
            if (isCreate) router.replace(`/admin/announcements/${result.id}`);
            else router.refresh();
        } catch {
            const message = isCreate
                ? "공지사항을 등록하지 못했습니다."
                : "공지사항을 저장하지 못했습니다.";
            setError("root.server", { type: "server", message });
            toast.error(message);
        }
    }

    function fillSlugFromTitle() {
        const { en, ko } = getValues("translations");
        const suggestion =
            suggestAnnouncementSlug(en.title) ||
            suggestAnnouncementSlug(ko.title);
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

    return (
        <form
            className="nl-admin-form"
            noValidate
            onSubmit={handleSubmit(submit, () =>
                toast.error("공지 입력을 확인해주세요.")
            )}
        >
            <section
                className="nl-admin-form__section"
                aria-labelledby="announcement-translations"
            >
                <h2
                    id="announcement-translations"
                    className="nl-component-title"
                >
                    내용
                </h2>
                <div
                    role="tablist"
                    aria-label="언어"
                    className="nl-admin-form__locale-tabs"
                >
                    {ANNOUNCEMENT_LOCALES.map((item) => (
                        <button
                            key={item}
                            type="button"
                            role="tab"
                            id={`announcement-tab-${item}`}
                            aria-selected={locale === item}
                            aria-controls={`announcement-panel-${item}`}
                            className="nl-admin-form__locale-tab nl-control"
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
                    const titleError =
                        errors.translations?.[item]?.title?.message;
                    const contentError =
                        errors.translations?.[item]?.content?.message;
                    return (
                        <div
                            key={item}
                            role="tabpanel"
                            id={`announcement-panel-${item}`}
                            aria-labelledby={`announcement-tab-${item}`}
                            hidden={locale !== item}
                            className="nl-admin-form__section"
                        >
                            <FormField
                                id={titleId}
                                label="제목"
                                error={titleError}
                            >
                                <Input
                                    id={titleId}
                                    lang={item}
                                    maxLength={ANNOUNCEMENT_TITLE_MAX_LENGTH}
                                    aria-invalid={Boolean(titleError)}
                                    aria-describedby={fieldDescription(
                                        titleId,
                                        { error: Boolean(titleError) }
                                    )}
                                    {...register(`translations.${item}.title`)}
                                />
                            </FormField>
                            <FormField
                                id={contentId}
                                label="본문"
                                help={`마크다운을 쓸 수 있습니다. 최대 ${ANNOUNCEMENT_CONTENT_MAX_LENGTH.toLocaleString("ko-KR")}자.`}
                                error={contentError}
                            >
                                <TextArea
                                    id={contentId}
                                    lang={item}
                                    maxLength={ANNOUNCEMENT_CONTENT_MAX_LENGTH}
                                    aria-invalid={Boolean(contentError)}
                                    aria-describedby={fieldDescription(
                                        contentId,
                                        {
                                            help: true,
                                            error: Boolean(contentError),
                                        }
                                    )}
                                    {...register(
                                        `translations.${item}.content`
                                    )}
                                />
                            </FormField>
                        </div>
                    );
                })}
            </section>

            <section
                className="nl-admin-form__section"
                aria-labelledby="announcement-publishing"
            >
                <h2 id="announcement-publishing" className="nl-component-title">
                    공개 설정
                </h2>
                <div className="nl-admin-form__grid">
                    <FormField
                        id="announcement-slug"
                        label="공개 주소"
                        help={
                            <>
                                <code>/announcements/</code> 뒤에 붙는 주소.
                                영문 소문자·숫자·하이픈만.
                            </>
                        }
                        error={errors.publicSlug?.message}
                        className="nl-admin-form__span"
                    >
                        <div className="nl-inline">
                            <Input
                                id="announcement-slug"
                                lang="en"
                                autoCapitalize="off"
                                autoCorrect="off"
                                spellCheck={false}
                                maxLength={ANNOUNCEMENT_SLUG_MAX_LENGTH}
                                aria-invalid={Boolean(errors.publicSlug)}
                                aria-describedby={fieldDescription(
                                    "announcement-slug",
                                    {
                                        help: true,
                                        error: Boolean(errors.publicSlug),
                                    }
                                )}
                                {...register("publicSlug")}
                            />
                            <button
                                type="button"
                                className={foundationButtonClass({
                                    variant: "secondary",
                                })}
                                onClick={fillSlugFromTitle}
                            >
                                제목에서 만들기
                            </button>
                        </div>
                    </FormField>

                    <FormField
                        id="announcement-placement"
                        label="공지 종류"
                        help="중대 공지는 홈 최상단 배너로 하나만 노출되며 노출 기간이 필요합니다."
                        error={errors.placement?.message}
                        className="nl-admin-form__span"
                    >
                        <Controller
                            control={control}
                            name="placement"
                            render={({ field }) => (
                                <SegmentedControl
                                    label="공지 종류"
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    options={ANNOUNCEMENT_PLACEMENTS.map(
                                        (value) => ({
                                            value,
                                            label: ANNOUNCEMENT_PLACEMENT_LABELS[
                                                value
                                            ],
                                        })
                                    )}
                                />
                            )}
                        />
                    </FormField>

                    {placement === "SERVICE_CRITICAL" ? (
                        <>
                            <FormField
                                id="announcement-active-from"
                                label="노출 시작"
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
                                label="노출 종료"
                                help="비워 두면 비공개로 바꿀 때까지 유지됩니다."
                                error={errors.expiresAt?.message}
                            >
                                <Input
                                    id="announcement-expires-at"
                                    type="datetime-local"
                                    aria-invalid={Boolean(errors.expiresAt)}
                                    aria-describedby={fieldDescription(
                                        "announcement-expires-at",
                                        {
                                            help: true,
                                            error: Boolean(errors.expiresAt),
                                        }
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
                                        {
                                            help: true,
                                            error: Boolean(errors.priority),
                                        }
                                    )}
                                    {...register("priority")}
                                />
                            </FormField>
                        </>
                    ) : null}

                    <div className="nl-field nl-admin-form__span">
                        <Checkbox
                            label="공개"
                            aria-describedby="announcement-published-help"
                            {...register("isPublished")}
                        />
                        <p
                            id="announcement-published-help"
                            className="nl-field__help"
                        >
                            세 언어 번역이 모두 있어야 홈과 공지 목록에
                            나타납니다. 처음 공개한 시각이 공개일로 남습니다.
                        </p>
                    </div>
                </div>
            </section>

            {errors.root?.server?.message ? (
                <p className="nl-body-secondary nl-field__error" role="alert">
                    {errors.root.server.message}
                </p>
            ) : null}

            <div className="nl-admin-form__actions">
                <div>
                    <ActionButton
                        type="submit"
                        busy={isSubmitting}
                        busyLabel={isCreate ? "등록 중" : "저장 중"}
                    >
                        {isCreate ? "등록" : "저장"}
                    </ActionButton>
                    <Link
                        href="/admin/announcements"
                        className={foundationButtonClass({
                            variant: "ghost",
                        })}
                    >
                        목록으로
                    </Link>
                    {!isCreate && isPublished && publicSlug ? (
                        <a
                            href={`/announcements/${announcement.publicSlug}`}
                            target="_blank"
                            rel="noreferrer"
                            className={cn(
                                foundationButtonClass({ variant: "ghost" })
                            )}
                        >
                            공개 페이지
                            <ExternalLink
                                className="nl-icon-small"
                                aria-hidden
                            />
                        </a>
                    ) : null}
                </div>
                {!isCreate && announcement.id !== undefined ? (
                    <AnnouncementDeleteButton
                        id={announcement.id}
                        title={announcement.translations.ko.title}
                    />
                ) : null}
            </div>
        </form>
    );
}
