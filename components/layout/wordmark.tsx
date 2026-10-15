import { WORDMARK_VIEWBOX } from "@/lib/metadata/wordmark";

const viewBox = `${WORDMARK_VIEWBOX.x} ${WORDMARK_VIEWBOX.y} ${WORDMARK_VIEWBOX.width} ${WORDMARK_VIEWBOX.height}`;

/**
 * NosLog 워드마크(2026-10-14) — 헤더 · 홈 · 로그인 · 복구 화면의 글자 「NosLog」 자리.
 * 모양은 캐시되는 파일 하나를 불러 쓰고, 색은 로고 색(identity-mark), 높이는 그 자리 글자 크기 × 17/16(layout.css `nl-logo`).
 * 감싼 링크에 이미 이름(aria-label)이 있으면 `decorative` 로 읽지 않게 한다
 */
export default function Wordmark({
    decorative = false,
}: {
    decorative?: boolean;
}) {
    return (
        <svg
            className="nl-logo"
            viewBox={viewBox}
            focusable="false"
            {...(decorative
                ? { "aria-hidden": true }
                : { role: "img", "aria-label": "NosLog" })}
        >
            <use href="/brand/noslog-wordmark.svg#wordmark" />
        </svg>
    );
}
