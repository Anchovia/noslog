import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink } from "lucide-react";
import type { Element, ElementContent, Root } from "hast";
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
function announcementImage(src: string) {
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

// 라벨 항목(2026-09-26 L2) — 「**채보 뷰어:** 설명」 처럼 굵은 라벨로 시작해 「:」 로 끝나는 문단이 둘 이상 이어지면
// 라벨 한 줄(dt) + 설명(dd) 목록으로 그린다. 글 쓰는 방식은 그대로, 한 개뿐이면 문단 그대로 둔다
function labelParts(node: ElementContent) {
    if (node.type !== "element" || node.tagName !== "p") return null;
    const [first, ...rest] = node.children;
    if (first?.type !== "element" || first.tagName !== "strong") return null;
    const last = first.children.at(-1);
    if (last?.type !== "text" || !/[:：]\s*$/u.test(last.value)) return null;
    const label: ElementContent[] = [
        ...first.children.slice(0, -1),
        { ...last, value: last.value.replace(/\s*[:：]\s*$/u, "") },
    ];
    const body = [...rest];
    const lead = body[0];
    if (lead?.type === "text")
        body[0] = { ...lead, value: lead.value.trimStart() };
    const hasBody = body.some(
        (child) => child.type !== "text" || child.value.trim()
    );
    return hasBody ? { label, body } : null;
}
function rehypeLabelItems() {
    return (tree: Root) => {
        const children: Root["children"] = [];
        let run: { label: ElementContent[]; body: ElementContent[] }[] = [];
        const flush = (pending: Root["children"]) => {
            if (run.length > 1) {
                children.push({
                    type: "element",
                    tagName: "dl",
                    properties: { className: ["nl-announcement-body__items"] },
                    children: run.flatMap(({ label, body }): Element[] => [
                        {
                            type: "element",
                            tagName: "dt",
                            properties: { className: ["nl-component-title"] },
                            children: label,
                        },
                        {
                            type: "element",
                            tagName: "dd",
                            properties: {},
                            children: body,
                        },
                    ]),
                });
            } else children.push(...pending);
            run = [];
        };
        let pending: Root["children"] = [];
        for (const node of tree.children) {
            const parts = node.type === "element" ? labelParts(node) : null;
            if (parts) {
                run.push(parts);
                pending.push(node);
                continue;
            }
            // 문단 사이 줄바꿈 글자는 묶음을 끊지 않는다
            if (node.type === "text" && !node.value.trim() && run.length) {
                continue;
            }
            flush(pending);
            pending = [];
            children.push(node);
        }
        flush(pending);
        tree.children = children;
    };
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
        <div className="nl-announcement-body nl-body-reading">
            <Markdown
                skipHtml
                // 표 · 취소선은 GFM 문법(2026-09-23 T-c)
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeLabelItems]}
                // 허용 목록 밖 요소(제목 h1 등)는 태그만 벗기고 글자는 남긴다 —
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
                    "em",
                    "del",
                    "blockquote",
                    "hr",
                    "code",
                    "pre",
                    "table",
                    "thead",
                    "tbody",
                    "tr",
                    "th",
                    "td",
                    "a",
                    "img",
                    "dl",
                    "dt",
                    "dd",
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
                    // 표는 열을 줄이면 뜻이 망가지므로 접지 않고 표만 가로로 민다(TB1, 2026-09-23)
                    table: ({ children }) => (
                        <div className="nl-announcement-body__table">
                            <table>{children}</table>
                        </div>
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
