import {
    ClipboardCheck,
    Crown,
    Disc3,
    Flame,
    Gem,
    GraduationCap,
    Grid3x3,
    Hand,
    Link2,
    MessageSquare,
    Music,
    Piano,
    Shapes,
    Sparkles,
    Star,
    ThumbsUp,
    TrendingUp,
    type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/** 업적 그림(2026-09-24 A1) — 사이트가 쓰는 Lucide 아이콘에서 고른다. 새 그림을 그리지 않는다 */
export const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = {
    "s-rank": Star,
    "score-990k": Gem,
    "full-combo": Link2,
    pianist: Crown,
    "real-s-rank": Flame,
    "one-hand": Hand,
    "basic-grade": TrendingUp,
    "category-bm": Disc3,
    "category-org": Sparkles,
    "category-cljz": Piano,
    "category-var": Shapes,
    "exam-basic": GraduationCap,
    "exam-recital": Music,
    bingo: Grid3x3,
    opinion: MessageSquare,
    helpful: ThumbsUp,
    "pattern-evaluation": ClipboardCheck,
};

/**
 * 업적 육각(2026-09-24 I1 · T2) — 테두리 = 검정 명판 금속 사다리(동 · 은 · 금), 못 얻은 것은 흐린 선 · 흐린 그림(K1).
 * `size="row"` 목록 48 + 단계 숫자 알약(색 + 숫자 두 단서), `size="inline"` 머리 · 한 줄 24(색만, 이름은 aria · title),
 * `size="large"` 배지 정보 창 64(2026-09-25 M1 — 단계는 제목의 로마 숫자가 말한다).
 * 글자 · 이름은 부르는 쪽이 붙인다 — 여기는 그림만.
 */
export default function AchievementHex({
    achievementKey,
    tier,
    size = "row",
    label,
    className,
}: {
    achievementKey: string;
    /** 0 = 아직 없음 */
    tier: number;
    size?: "row" | "inline" | "large";
    /** 접근 이름 — 주면 그림으로 읽고(title 도), 없으면 옆 글자가 설명하는 장식 */
    label?: string;
    className?: string;
}) {
    const Icon = ACHIEVEMENT_ICONS[achievementKey] ?? Star;
    return (
        <span
            className={cn("nl-achievement-hex", className)}
            data-size={size}
            data-tier={tier || undefined}
            role={label ? "img" : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : true}
            title={label}
        >
            <Icon aria-hidden className="nl-achievement-hex__icon" />
            {size === "row" && tier ? (
                <span className="nl-achievement-hex__tier nl-metadata">
                    {tier}
                </span>
            ) : null}
        </span>
    );
}
