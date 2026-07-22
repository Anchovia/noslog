"use client";

import { Bookmark, Check, Copy } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface BookmarkletInstallProps {
    href: string;
}

export default function BookmarkletInstall({ href }: BookmarkletInstallProps) {
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
                        alt="PC에서 북마클릿을 등록하는 방법"
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
                        NosLog 동기화
                    </a>
                    <p className="text-body-muted">
                        이 버튼을 북마크바로 드래그하세요
                    </p>
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
                        ? "PC에서 등록하는 방법"
                        : "모바일에서 등록하는 방법"}
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
                        {copied ? "복사됨" : "북마클릿 주소 복사"}
                    </button>
                    <ol className="text-body-muted flex flex-col gap-3">
                        <li className="flex flex-col gap-2">
                            <span>
                                1. 현재 페이지를 브라우저 북마크에 추가합니다.
                            </span>
                            <Image
                                src="/images/guides/mobile-bookmark-add.gif"
                                alt="모바일에서 북마크를 추가하는 방법"
                                width={332}
                                height={430}
                                unoptimized
                                className="border-border h-auto w-full rounded-md border"
                            />
                        </li>
                        <li className="flex flex-col gap-2">
                            <span>
                                2. 추가한 북마크의 주소를 편집하고 저장합니다.
                            </span>
                            <Image
                                src="/images/guides/mobile-bookmark-edit.gif"
                                alt="모바일에서 북마크 주소를 편집하는 방법"
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
