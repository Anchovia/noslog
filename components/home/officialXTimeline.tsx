"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

const OFFICIAL_X_URL = "https://x.com/NOSTALGIA_573";

type XWidgetsWindow = Window & {
    twttr?: {
        widgets?: {
            load: (element?: HTMLElement) => Promise<unknown>;
        };
    };
};

// NOSTALGIA 공식 계정의 최신 게시물을 X 공식 위젯으로 표시함
export default function OfficialXTimeline() {
    const timelineRef = useRef<HTMLDivElement>(null);

    const loadTimeline = useCallback(() => {
        const container = timelineRef.current;
        if (!container) return;

        void (window as XWidgetsWindow).twttr?.widgets?.load(container);
    }, []);

    useEffect(() => {
        loadTimeline();
    }, [loadTimeline]);

    return (
        <section className="bg-surface rounded-card overflow-hidden">
            <div className="bg-surface-muted flex h-10 items-center justify-between px-3">
                <h2 className="text-section">NOSTALGIA 공식 소식</h2>
                <a
                    href={OFFICIAL_X_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-caption hover:text-text-primary transition-colors"
                >
                    공식 X →
                </a>
            </div>

            <div ref={timelineRef} className="min-h-52 overflow-hidden">
                <a
                    className="twitter-timeline text-caption flex min-h-52 items-center justify-center px-4 text-center"
                    data-theme="dark"
                    data-lang="ko"
                    data-tweet-limit="2"
                    data-chrome="noheader nofooter noborders transparent"
                    data-dnt="true"
                    href={OFFICIAL_X_URL}
                >
                    NOSTALGIA 공식 X에서 최신 소식 보기
                </a>
            </div>

            <Script
                id="x-widgets"
                src="https://platform.twitter.com/widgets.js"
                strategy="lazyOnload"
                onLoad={loadTimeline}
                onReady={loadTimeline}
            />
        </section>
    );
}
