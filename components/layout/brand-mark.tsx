import {
    BRAND_MARK_CAT_PATH,
    BRAND_MARK_CIRCLE,
    BRAND_MARK_SIZE,
} from "@/lib/metadata/brand-mark";

/**
 * NosLog 아이콘(2026-10-15 B) — 채운 원 안의 앉은 고양이. 앱 · 탭 아이콘과 같은 마크.
 * 크기는 감싼 칸이 정하고, 원 = 로고 색 · 고양이 = 바탕색(layout.css `nl-brand-mark`). 이름은 곁의 글자 「NosLog」 가 맡아 장식으로 둔다
 */
export default function BrandMark() {
    return (
        <svg
            className="nl-brand-mark"
            viewBox={`0 0 ${BRAND_MARK_SIZE} ${BRAND_MARK_SIZE}`}
            aria-hidden="true"
            focusable="false"
        >
            <circle
                className="nl-brand-mark__circle"
                cx={BRAND_MARK_CIRCLE.cx}
                cy={BRAND_MARK_CIRCLE.cy}
                r={BRAND_MARK_CIRCLE.r}
            />
            <path
                className="nl-brand-mark__cat"
                fillRule="evenodd"
                d={BRAND_MARK_CAT_PATH}
            />
        </svg>
    );
}
