"use client";

import { Heart } from "lucide-react";
import Link from "next/link";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";

/**
 * 좋아요(2026-09-22 L1) — 의견 · 답글 본문 아래 동작 줄. 윤곽 하트 → 누르면 채운 하트(모양으로도 말한다) + 수,
 * 0 이면 「좋아요」 글자. 이름은 「좋아요」 + 수로 두고 눌림은 aria-pressed 가 말한다(W3C APG).
 * 누를 수 없는 사람(내 글 · 이 채보 기록 없음)은 수만, 로그아웃은 로그인으로
 */
export default function OpinionLike({
    count,
    pressed,
    canReact,
    signedIn,
    loginHref,
    pending,
    onToggle,
}: {
    count: number;
    pressed: boolean;
    canReact: boolean;
    signedIn: boolean;
    loginHref: string;
    pending: boolean;
    onToggle: (next: boolean) => void;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const content = count ? (
        <>
            <span className="sr-only">{t("community.like")} </span>
            <span>{count.toLocaleString(locale)}</span>
        </>
    ) : (
        <span>{t("community.like")}</span>
    );
    const icon = (
        <Heart
            className="nl-icon-small"
            fill={pressed ? "currentColor" : "none"}
            aria-hidden
        />
    );
    if (!signedIn)
        return (
            <Link
                href={loginHref}
                className="nl-opinion-like nl-control"
                title={t("community.likeLogin")}
            >
                {icon}
                {content}
            </Link>
        );
    if (!canReact)
        return count ? (
            <span className="nl-opinion-like nl-control" data-static="">
                {icon}
                {content}
            </span>
        ) : null;
    return (
        <button
            type="button"
            className="nl-opinion-like nl-control"
            aria-pressed={pressed}
            disabled={pending}
            onClick={() => onToggle(!pressed)}
        >
            {icon}
            {content}
        </button>
    );
}
