import { ExternalLink } from "lucide-react";
import Image from "next/image";

import { buildOfficialXPostSegments } from "@/features/home/officialXPostContent";
import type { OfficialXPost as OfficialXPostData } from "@/features/home/server/officialXPostService";
import { getServerI18n } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/routing";

const OFFICIAL_X_URL = "https://x.com/NOSTALGIA_573";
const AVATAR_SIZE = 32;

function postDateTime(value: string, locale: Locale) {
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: locale === "en" ? "short" : locale === "ja" ? "long" : "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Seoul",
    }).format(new Date(value));
}

export default async function OfficialXPost({
    post,
}: {
    post: OfficialXPostData;
}) {
    const { locale, t } = await getServerI18n();
    return (
        <section className="nl-home-update">
            <div className="nl-home-update__heading">
                <h2 className="nl-component-title">{t("home.officialNews")}</h2>
                <a
                    href={OFFICIAL_X_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="nl-control"
                >
                    {t("home.officialLink")}
                    <ExternalLink aria-hidden />
                </a>
            </div>
            {post.status === "ready" ? (
                <article className="nl-official-post" lang="ja">
                    <header className="nl-official-post__author">
                        {post.post.author.avatarUrl ? (
                            <Image
                                className="nl-official-post__avatar"
                                src={post.post.author.avatarUrl}
                                alt=""
                                width={AVATAR_SIZE}
                                height={AVATAR_SIZE}
                                unoptimized
                            />
                        ) : (
                            <span
                                className="nl-official-post__avatar"
                                aria-hidden
                            />
                        )}
                        <div className="nl-official-post__identity">
                            <a
                                href={OFFICIAL_X_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="nl-entity-title"
                            >
                                {post.post.author.name}
                            </a>
                            <p
                                className="nl-body-secondary nl-muted"
                                lang={locale}
                            >
                                @{post.post.author.username} ·{" "}
                                <time dateTime={post.post.createdAt}>
                                    {postDateTime(post.post.createdAt, locale)}
                                </time>
                            </p>
                        </div>
                    </header>
                    <p className="nl-official-post__text nl-body">
                        {buildOfficialXPostSegments(
                            post.post.text,
                            post.post.links
                        ).map((segment, index) =>
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
                    {post.post.image ? (
                        <a
                            href={post.post.url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={t("home.officialPostLink")}
                            className="nl-official-post__media"
                            style={{
                                aspectRatio: `${post.post.image.width} / ${post.post.image.height}`,
                            }}
                        >
                            <Image
                                src={post.post.image.url}
                                alt={post.post.image.alt ?? ""}
                                width={post.post.image.width}
                                height={post.post.image.height}
                                sizes="(min-width: 672px) 608px, 100vw"
                            />
                        </a>
                    ) : null}
                    <footer className="nl-official-post__footer" lang={locale}>
                        <a
                            href={post.post.url}
                            target="_blank"
                            rel="noreferrer"
                            className="nl-control"
                        >
                            {t("home.officialPostLink")}
                            <ExternalLink aria-hidden />
                        </a>
                    </footer>
                </article>
            ) : (
                <p className="nl-home-news-state nl-body-secondary nl-muted">
                    {t(
                        post.status === "empty"
                            ? "home.newsEmpty"
                            : "home.newsError"
                    )}
                </p>
            )}
        </section>
    );
}
