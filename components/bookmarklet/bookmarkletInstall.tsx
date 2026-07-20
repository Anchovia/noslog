"use client";

import { Bookmark, Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import GuideMediaPlaceholder from "./guideMediaPlaceholder";

interface BookmarkletInstallProps {
    href: string;
}

export default function BookmarkletInstall({ href }: BookmarkletInstallProps) {
    const [copied, setCopied] = useState(false);
    const bookmarkletRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        bookmarkletRef.current?.setAttribute("href", href);
    }, [href]);

    const copyBookmarklet = async () => {
        await navigator.clipboard.writeText(href);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <GuideMediaPlaceholder label="북마클릿 등록" />
            <a
                ref={bookmarkletRef}
                onClick={(event) => {
                    event.preventDefault();
                    void copyBookmarklet();
                }}
                draggable
                className="border-text-secondary hover:border-text-primary rounded-card text-text-primary flex h-11 items-center gap-2 border border-dashed px-5 text-sm font-bold transition-colors"
            >
                <Bookmark size={17} aria-hidden />
                NosLog 동기화
            </a>
            <p className="text-caption">이 버튼을 북마크바로 드래그하세요</p>

            <details className="group w-full">
                <summary className="text-text-disabled hover:text-text-secondary cursor-pointer list-none text-center text-xs underline transition-colors">
                    모바일에서 등록하는 방법
                </summary>
                <div className="border-divider mt-3 flex flex-col gap-3 border-t pt-3">
                    <ol className="text-caption flex flex-col gap-3">
                        <li className="flex flex-col gap-2">
                            <GuideMediaPlaceholder label="모바일 북마크 추가" />
                            <span>
                                1. 현재 페이지를 브라우저 북마크에 추가합니다.
                            </span>
                        </li>
                        <li className="flex flex-col gap-2">
                            <GuideMediaPlaceholder label="모바일 북마크 주소 편집" />
                            <span>2. 추가한 북마크의 주소를 편집합니다.</span>
                        </li>
                        <li className="flex flex-col gap-2">
                            <GuideMediaPlaceholder label="모바일 북마클릿 주소 저장" />
                            <span>3. 복사한 주소로 교체하고 저장합니다.</span>
                        </li>
                    </ol>
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
                </div>
            </details>
        </div>
    );
}
