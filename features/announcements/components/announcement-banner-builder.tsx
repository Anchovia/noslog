"use client";

import { useEffect, useId, useRef, useState } from "react";

import ActionButton from "@/components/ui/action-button";
import Disclosure from "@/components/ui/disclosure";
import { FormField, Input } from "@/components/ui/form-field";
import { StatusMessage } from "@/components/ui/status-message";
import AnnouncementBanner from "@/features/announcements/components/announcement-banner";
import {
    ANNOUNCEMENT_BANNER_HEADING_MAX_LENGTH,
    bannerHeadingFromTitle,
    createAnnouncementBannerImage,
} from "@/features/announcements/lib/announcement-banner-image";
import {
    ANNOUNCEMENT_LOCALE_LABELS,
    ANNOUNCEMENT_LOCALES,
} from "@/features/announcements/schemas/announcement-schema";
import type { Locale } from "@/lib/i18n/routing";

type Preview = { locale: Locale; file: File; url: string };

function today() {
    return new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Asia/Seoul",
    }).format(new Date());
}

export default function AnnouncementBannerBuilder({
    titles,
    bannerUrls,
    upload,
    onChange,
    onBusyChange,
    disabled = false,
}: {
    titles: Record<Locale, string>;
    bannerUrls: Record<Locale, string>;
    upload: (file: File) => Promise<string>;
    onChange: (urls: Record<Locale, string>) => void;
    onBusyChange?: (busy: boolean) => void;
    disabled?: boolean;
}) {
    const id = useId();
    // 고치지 않은 언어는 제목을 따라간다
    const [headings, setHeadings] = useState<Partial<Record<Locale, string>>>(
        {}
    );
    const [date, setDate] = useState(today);
    const [previews, setPreviews] = useState<Preview[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState<"generate" | "upload" | null>(null);
    const previewUrls = useRef<string[]>([]);
    const lock = useRef(false);
    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);
    const heading = (locale: Locale) =>
        headings[locale] ?? bannerHeadingFromTitle(titles[locale] ?? "");
    const hasBanner = ANNOUNCEMENT_LOCALES.some((locale) => bannerUrls[locale]);

    function clearPreviews() {
        previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
        previewUrls.current = [];
        setPreviews([]);
        setError(null);
    }

    async function run(kind: "generate" | "upload") {
        if (lock.current || disabled) return;
        lock.current = true;
        setBusy(kind);
        onBusyChange?.(true);
        setError(null);
        try {
            if (kind === "generate") {
                const missing = ANNOUNCEMENT_LOCALES.find(
                    (locale) => !heading(locale).trim()
                );
                if (missing) {
                    setError(
                        `${ANNOUNCEMENT_LOCALE_LABELS[missing]} 큰 글자를 입력해주세요.`
                    );
                    return;
                }
                if (!date) {
                    setError("날짜를 입력해주세요.");
                    return;
                }
                const next = await Promise.all(
                    ANNOUNCEMENT_LOCALES.map(async (locale) => {
                        const file = await createAnnouncementBannerImage({
                            heading: heading(locale).trim(),
                            date,
                            locale,
                        });
                        return {
                            locale,
                            file,
                            url: URL.createObjectURL(file),
                        };
                    })
                );
                if (!mounted.current) {
                    next.forEach((item) => URL.revokeObjectURL(item.url));
                    return;
                }
                clearPreviews();
                previewUrls.current = next.map((item) => item.url);
                setPreviews(next);
            } else {
                // 세 장이 모두 올라간 뒤에만 글에 넣어 언어마다 판이 달라지지 않게 한다
                const urls = await Promise.all(
                    previews.map((item) => upload(item.file))
                );
                onChange(
                    Object.fromEntries(
                        previews.map((item, index) => [
                            item.locale,
                            urls[index],
                        ])
                    ) as Record<Locale, string>
                );
                if (mounted.current) clearPreviews();
            }
        } catch (failure) {
            if (mounted.current)
                setError(
                    failure instanceof Error && failure.message
                        ? failure.message
                        : "배너를 만들거나 올리지 못했습니다."
                );
        } finally {
            lock.current = false;
            if (mounted.current) setBusy(null);
            onBusyChange?.(false);
        }
    }

    return (
        <Disclosure title="공지 배너" className="nl-admin-form__section">
            <div className="nl-admin-form__section">
                {hasBanner
                    ? ANNOUNCEMENT_LOCALES.map((locale) => (
                          <AnnouncementBanner
                              key={locale}
                              url={bannerUrls[locale]}
                              title={titles[locale] ?? ""}
                          />
                      ))
                    : null}
                <fieldset
                    disabled={disabled || busy !== null}
                    className="nl-admin-form__section m-0 min-w-0 border-0 p-0"
                >
                    <legend className="sr-only">공지 배너 입력</legend>
                    {ANNOUNCEMENT_LOCALES.map((locale) => (
                        <FormField
                            key={locale}
                            id={`${id}-${locale}`}
                            label={`큰 글자 (${ANNOUNCEMENT_LOCALE_LABELS[locale]})`}
                        >
                            <Input
                                id={`${id}-${locale}`}
                                lang={locale}
                                maxLength={
                                    ANNOUNCEMENT_BANNER_HEADING_MAX_LENGTH
                                }
                                value={heading(locale)}
                                onChange={(event) => {
                                    clearPreviews();
                                    setHeadings({
                                        ...headings,
                                        [locale]: event.target.value,
                                    });
                                }}
                            />
                        </FormField>
                    ))}
                    <FormField id={`${id}-date`} label="날짜">
                        <Input
                            id={`${id}-date`}
                            type="date"
                            value={date}
                            onChange={(event) => {
                                clearPreviews();
                                setDate(event.target.value);
                            }}
                        />
                    </FormField>
                </fieldset>
                {error ? (
                    <StatusMessage
                        severity="danger"
                        title={error}
                        role="alert"
                    />
                ) : null}
                <div className="flex flex-wrap gap-nl-8">
                    <ActionButton
                        variant="secondary"
                        disabled={disabled || busy === "upload"}
                        busy={busy === "generate"}
                        busyLabel="배너 만드는 중"
                        onClick={() => run("generate")}
                    >
                        배너 미리보기
                    </ActionButton>
                    {hasBanner ? (
                        <ActionButton
                            variant="secondary"
                            disabled={disabled || busy !== null}
                            onClick={() => onChange({ ko: "", ja: "", en: "" })}
                        >
                            배너 빼기
                        </ActionButton>
                    ) : null}
                </div>
                {previews.length > 0 ? (
                    <div className="nl-admin-form__section">
                        {previews.map((item) => (
                            // eslint-disable-next-line @next/next/no-img-element -- 아직 올리지 않은 브라우저 안 미리보기
                            <img
                                key={item.locale}
                                src={item.url}
                                alt={heading(item.locale)}
                                className="nl-announcement-banner"
                            />
                        ))}
                        <ActionButton
                            disabled={disabled || busy === "generate"}
                            busy={busy === "upload"}
                            busyLabel="배너 올리는 중"
                            onClick={() => run("upload")}
                        >
                            {hasBanner
                                ? "세 언어 배너 바꾸기"
                                : "세 언어 배너 넣기"}
                        </ActionButton>
                    </div>
                ) : null}
            </div>
        </Disclosure>
    );
}
