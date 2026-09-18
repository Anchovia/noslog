import Markdown from "react-markdown";
import { ExternalLink } from "lucide-react";
import { getLocalizedHref } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/routing";

export function announcementLink(
    href: string,
    locale: Locale,
    siteUrl: string
) {
    if (!href || /[\u0000-\u0020\\]/u.test(href)) return null;
    try {
        const url = new URL(href, siteUrl);
        if (url.protocol !== "http:" && url.protocol !== "https:") return null;
        const external = url.origin !== new URL(siteUrl).origin;
        return {
            href: external
                ? url.href
                : href.startsWith("#")
                  ? href
                  : getLocalizedHref(
                        `${url.pathname}${url.search}${url.hash}`,
                        locale
                    ),
            external,
        };
    } catch {
        return null;
    }
}

// 본문 이미지(2026-09-18) — 우리 공개 이미지 저장소에 공지 · 이벤트 글쓰기로 올린 것만 그린다.
// 다른 사이트 주소 · 쿼리 붙은 주소는 그리지 않는다(추적 픽셀 · 외부 요청 차단)
const BODY_IMAGE_PATHS = ["/announcements/", "/events/"];
export function announcementImage(src: string) {
    try {
        const url = new URL(src);
        return url.protocol === "https:" &&
            url.hostname.endsWith(".public.blob.vercel-storage.com") &&
            !url.search &&
            !url.hash &&
            BODY_IMAGE_PATHS.some((path) => url.pathname.startsWith(path))
            ? url.href
            : null;
    } catch {
        return null;
    }
}

export default function AnnouncementBody({
    content,
    locale,
    siteUrl,
    externalLabel,
}: {
    content: string;
    locale: Locale;
    siteUrl: string;
    externalLabel: string;
}) {
    return (
        <div className="nl-announcement-body nl-body">
            <Markdown
                skipHtml
                // 허용 목록 밖 요소(`code` · `em` · 제목 h1 등)는 태그만 벗기고 글자는 남긴다 —
                // 백틱으로 감싼 글자가 통째로 사라지던 문제(v2.9.2 공지, 2026-09-18)
                unwrapDisallowed
                allowedElements={[
                    "p",
                    "h2",
                    "h3",
                    "ul",
                    "ol",
                    "li",
                    "strong",
                    "a",
                    "img",
                ]}
                urlTransform={(url, key) =>
                    key === "src"
                        ? (announcementImage(url) ?? "")
                        : (announcementLink(url, locale, siteUrl)?.href ?? "")
                }
                components={{
                    h2: ({ children }) => (
                        <h2 className="nl-section-title">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="nl-component-title">{children}</h3>
                    ),
                    // 본문 폭 · 모서리 8 · 원래 비율. 설명([ ] 글)은 화면 읽기용으로만 (시안 I1)
                    img: ({ src, alt }) => {
                        const image =
                            typeof src === "string"
                                ? announcementImage(src)
                                : null;
                        return image ? (
                            // eslint-disable-next-line @next/next/no-img-element -- 글쓴이가 올린 크기 모르는 이미지 · 저장소 주소 그대로
                            <img
                                src={image}
                                alt={alt ?? ""}
                                loading="lazy"
                                decoding="async"
                                className="nl-announcement-body__image"
                            />
                        ) : null;
                    },
                    a: ({ href, children }) => {
                        const link = announcementLink(
                            href ?? "",
                            locale,
                            siteUrl
                        );
                        if (!link) return <>{children}</>;
                        return (
                            <a href={link.href}>
                                {children}
                                {link.external ? (
                                    <>
                                        <ExternalLink aria-hidden />
                                        <span className="sr-only">
                                            {" "}
                                            ({externalLabel})
                                        </span>
                                    </>
                                ) : null}
                            </a>
                        );
                    },
                }}
            >
                {content}
            </Markdown>
        </div>
    );
}
