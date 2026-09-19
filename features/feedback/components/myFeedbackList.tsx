"use client";

import { LoadingStatus, SkeletonText } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

import { listMyFeedback } from "@/app/(nevigation)/(home)/feedbackActions";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import { StatusMessage } from "@/components/ui/statusMessage";
import type { MyFeedbackItem } from "@/features/feedback/server/myFeedbackService";

function formatDate(value: string, locale: string) {
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: locale === "en" ? "short" : "numeric",
        day: "numeric",
        timeZone: "Asia/Seoul",
    }).format(new Date(value));
}

// 피드백 창 「내 제보」 (2026-09-18 F1) — 상태 태그(T3 색 점) · 날짜 · 종류 →4→ 내용 →8→ 답변 상자
export default function MyFeedbackList({
    onLoaded,
}: {
    /** 불러오면서 새 답변을 읽음으로 바꿨을 때 — 헤더 점을 끈다 */
    onLoaded?: () => void;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const [items, setItems] = useState<MyFeedbackItem[] | null>(null);
    const [failed, setFailed] = useState(false);
    useEffect(() => {
        let active = true;
        listMyFeedback()
            .then((result) => {
                if (!active) return;
                setItems(result ?? []);
                onLoaded?.();
            })
            .catch(() => active && setFailed(true));
        return () => {
            active = false;
        };
        // 탭을 열 때 한 번만 불러온다
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (failed)
        return (
            <StatusMessage
                severity="danger"
                title={t("feedback.mine.failed")}
            />
        );
    if (!items)
        // 불러오는 동안 — 같은 목록 줄 틀(상태 · 날짜 줄 →4→ 내용)의 스켈레톤, 안내는 화면 읽기에만
        return (
            <div aria-busy="true">
                <LoadingStatus label={t("feedback.mine.loading")} />
                <ul className="nl-feedback-mine" aria-hidden="true">
                    {[0, 1, 2].map((index) => (
                        <li key={index} className="nl-feedback-mine__row">
                            <SkeletonText className="nl-metadata" width="m" />
                            <SkeletonText
                                className="nl-body-secondary"
                                width="l"
                            />
                        </li>
                    ))}
                </ul>
            </div>
        );
    if (!items.length)
        return (
            <p className="nl-body-secondary nl-muted">
                {t("feedback.mine.empty")}
            </p>
        );
    return (
        <ul className="nl-feedback-mine">
            {items.map((item) => (
                <li key={item.id} className="nl-feedback-mine__row">
                    <div className="nl-announcement-meta">
                        <span
                            className="nl-tag nl-tag--status nl-metadata"
                            data-tone={
                                item.status === "resolved"
                                    ? "success"
                                    : "warning"
                            }
                        >
                            {t(`feedback.status.${item.status}`)}
                        </span>
                        <span className="nl-metadata nl-muted">
                            {[
                                formatDate(item.createdAt, locale),
                                item.arcade
                                    ? t("feedback.mine.arcade")
                                    : item.category === "idea" ||
                                        item.category === "bug"
                                      ? t(`feedback.category.${item.category}`)
                                      : null,
                            ]
                                .filter(Boolean)
                                .join(" · ")}
                        </span>
                    </div>
                    <p className="nl-body-secondary nl-feedback-mine__content">
                        {item.content}
                    </p>
                    {item.reply ? (
                        <div className="nl-feedback-mine__reply">
                            <p className="nl-metadata nl-muted">
                                {t("feedback.mine.replyLabel")}
                                {item.repliedAt
                                    ? ` · ${formatDate(item.repliedAt, locale)}`
                                    : ""}
                                {item.unread ? (
                                    <span
                                        className="nl-unread-dot"
                                        role="img"
                                        aria-label={t("feedback.newReply")}
                                    />
                                ) : null}
                            </p>
                            <p className="nl-body-secondary">{item.reply}</p>
                        </div>
                    ) : null}
                </li>
            ))}
        </ul>
    );
}
