"use client";

import { Bookmark, Check, Copy } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/components/i18n/localeProvider";

interface BookmarkletInstallProps {
    href: string;
}

export default function BookmarkletInstall({ href }: BookmarkletInstallProps) {
    const t = useTranslations();
    const [copied, setCopied] = useState(false);
    const [isMobileGuideOpen, setIsMobileGuideOpen] = useState(false);
    const bookmarkletRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        bookmarkletRef.current?.setAttribute("href", href);
    }, [href, isMobileGuideOpen]);

    const copyBookmarklet = async () => {
        await navigator.clipboard.writeText(href);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col items-center gap-3">
            {!isMobileGuideOpen ? (
                <>
                    <Image
                        src="/images/guides/bookmarklet-install.gif"
                        alt={t("sync.installDesktopAlt")}
                        width={640}
                        height={360}
                        unoptimized
                        className="border-border h-auto w-full rounded-md border"
                    />
                    <a
                        ref={bookmarkletRef}
                        onClick={(event) => event.preventDefault()}
                        draggable
                        className="border-text-secondary hover:border-text-primary rounded-card text-text-primary flex h-11 items-center gap-2 border border-dashed px-5 text-sm font-bold transition-colors"
                    >
                        <Bookmark size={17} aria-hidden />
                        {t("sync.bookmarklet")}
                    </a>
                    <p className="text-body-muted">{t("sync.drag")}</p>
                </>
            ) : null}

            <details
                className="group w-full"
                onToggle={(event) =>
                    setIsMobileGuideOpen(event.currentTarget.open)
                }
            >
                <summary className="text-body-muted hover:text-text-primary cursor-pointer list-none text-center underline transition-colors">
                    {isMobileGuideOpen
                        ? t("sync.desktopGuide")
                        : t("sync.mobileGuide")}
                </summary>
                <div className="border-divider mt-3 flex flex-col gap-3 border-t pt-3">
                    <button
                        type="button"
                        onClick={() => void copyBookmarklet()}
                        className="border-border bg-surface-muted text-text-primary rounded-card flex h-9 items-center justify-center gap-2 border text-xs font-semibold"
                    >
                        {copied ? (
                            <Check size={15} aria-hidden />
                        ) : (
                            <Copy size={15} aria-hidden />
                        )}
                        {copied ? t("sync.copied") : t("sync.copyAddress")}
                    </button>
                    <ol className="text-body-muted flex flex-col gap-3">
                        <li className="flex flex-col gap-2">
                            <span>{t("sync.mobileAdd")}</span>
                            <Image
                                src="/images/guides/mobile-bookmark-add.gif"
                                alt={t("sync.mobileAddAlt")}
                                width={332}
                                height={430}
                                unoptimized
                                className="border-border h-auto w-full rounded-md border"
                            />
                        </li>
                        <li className="flex flex-col gap-2">
                            <span>{t("sync.mobileEdit")}</span>
                            <Image
                                src="/images/guides/mobile-bookmark-edit.gif"
                                alt={t("sync.mobileEditAlt")}
                                width={332}
                                height={669}
                                unoptimized
                                className="border-border h-auto w-full rounded-md border"
                            />
                        </li>
                    </ol>
                </div>
            </details>
        </div>
    );
}
