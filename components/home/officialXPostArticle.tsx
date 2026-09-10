"use client";

import { ExternalLink, Languages } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { foundationButtonClass } from "@/components/ui/Button";
import { buildOfficialXPostSegments } from "@/features/home/officialXPostContent";
import type {
    OfficialXPostContent,
    OfficialXPostLink,
} from "@/features/home/officialXPostContent";
import type { Locale } from "@/lib/i18n/routing";

const OFFICIAL_X_URL = "https://x.com/NOSTALGIA_573";
const AVATAR_SIZE = 32;

function PostText({
    text,
    links,
    lang,
}: {
    text: string;
    links: OfficialXPostLink[];
    lang: Locale;
}) {
    return (
        <p className="nl-official-post__text nl-body" lang={lang}>
            {buildOfficialXPostSegments(text, links).map((segment, index) =>
                segment.type === "link" ? (
                    <a
                        key={index}
                        href={segment.href}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {segment.label}
                    </a>
                ) : (
                    <span key={index}>{segment.value}</span>
                )
            )}
        </p>
    );
}

// 카드 본문. 번역이 있으면 번역을 기본으로 두고 작성자 행 오른쪽 토글로 원문과 제자리에서 바꾼다 (2026-09-10 사용자 결정)
export default function OfficialXPostArticle({
    post,
    locale,
    translated,
    dateText,
    labels,
}: {
    post: OfficialXPostContent;
    locale: Locale;
    /** Translation for `locale`; null shows the original only. */
    translated: string | null;
    dateText: string;
    labels: { original: string; translation: string; postLink: string };
}) {
    const [showOriginal, setShowOriginal] = useState(false);
    const showingTranslation = translated !== null && !showOriginal;
    return (
        <article className="nl-official-post" lang="ja">
            <header className="nl-official-post__author">
                {post.author.avatarUrl ? (
                    <Image
                        className="nl-official-post__avatar"
                        src={post.author.avatarUrl}
                        alt=""
                        width={AVATAR_SIZE}
                        height={AVATAR_SIZE}
                        unoptimized
                    />
                ) : (
                    <span className="nl-official-post__avatar" aria-hidden />
                )}
                <div className="nl-official-post__identity">
                    <a
                        href={OFFICIAL_X_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="nl-entity-title"
                    >
                        {post.author.name}
                    </a>
                    <p
                        className="nl-official-post__meta nl-body-secondary nl-muted"
                        lang={locale}
                    >
                        <span className="nl-official-post__handle">
                            @{post.author.username}
                        </span>
                        <span aria-hidden> · </span>
                        <time dateTime={post.createdAt}>{dateText}</time>
                    </p>
                </div>
                {translated !== null ? (
                    <button
                        type="button"
                        className={`${foundationButtonClass({ variant: "ghost", size: "sm" })} nl-official-post__toggle`}
                        aria-pressed={showOriginal}
                        lang={locale}
                        onClick={() => setShowOriginal((value) => !value)}
                    >
                        <Languages className="nl-icon-small" aria-hidden />
                        {showOriginal ? labels.translation : labels.original}
                    </button>
                ) : null}
            </header>
            <PostText
                text={showingTranslation ? translated : post.text}
                links={post.links}
                lang={showingTranslation ? locale : "ja"}
            />
            {post.image ? (
                <a
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={labels.postLink}
                    className="nl-official-post__media"
                    style={{
                        aspectRatio: `${post.image.width} / ${post.image.height}`,
                    }}
                >
                    <Image
                        src={post.image.url}
                        alt={post.image.alt ?? ""}
                        width={post.image.width}
                        height={post.image.height}
                        sizes="(min-width: 672px) 608px, 100vw"
                    />
                </a>
            ) : null}
            <footer className="nl-official-post__footer" lang={locale}>
                <a
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    className="nl-control"
                >
                    {labels.postLink}
                    <ExternalLink aria-hidden />
                </a>
            </footer>
        </article>
    );
}
