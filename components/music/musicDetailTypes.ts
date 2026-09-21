import type { UnlockStep } from "@/lib/music/unlockCondition";
import type { CommunityData } from "@/features/music/schemas/communitySchema";
import type { PeerScoreComparison } from "@/lib/music/peerScoreComparison";
import type {
    ChartRankingRow,
    ChartScorePlayer,
} from "@/features/music/schemas/chartRankingSchema";

export type Difficulty = "Normal" | "Hard" | "Expert" | "Real";

export type DetailTab = "record" | "detail" | "ranking" | "tier";

export interface MusicInfo {
    index: string;
    background: string | null;
    title: string;
    localizedTitle: string | null;
    artist: string | null;
    category_short: string;
    normal: number;
    hard: number;
    expert: number;
    real: number | null;
    constants?: Partial<Record<Difficulty, number | null>>;
}

export interface UserPlayData {
    user_id: number;
    user: {
        id: number;
        username: string | null;
        avatar: string | null;
        grade_basic: number | null;
    };
    rank: string;
    fc_type: number;
    grade_basic: number;
    grade_recital: number | null;
    level: number;
    score: number;
    max_combo: number;
    play_count: number;
    clear_count: number | null;
    fullcombo_count: number;
    pianistic_count: number;
    judge_sjust: number | null;
    judge_just: number | null;
    judge_good: number | null;
    judge_miss: number | null;
    judge_near: number | null;
    note_rate_standard: number | null;
    note_rate_tenuto: number | null;
    note_rate_glissando: number | null;
    note_rate_trill: number | null;
    besttime: string;
}

export interface RecentChartPlay {
    id: number;
    score: number;
    best_score: number | null;
    max_combo: number;
    rank: string;
    grade_basic: number;
    class_basic: string | null;
    fast_count: number | null;
    slow_count: number | null;
    judge_sjust: number | null;
    judge_just: number | null;
    judge_good: number | null;
    judge_miss: number | null;
    judge_near: number | null;
    play_time: string;
}

export interface ScoreTrendPoint {
    id: number;
    score: number;
    rank: string;
    play_time: string;
}

export interface PerformanceTrendPoint {
    id: number;
    score: number;
    best_score: number | null;
    fast_count: number | null;
    slow_count: number | null;
    judge_sjust: number | null;
    judge_just: number | null;
    judge_good: number | null;
    judge_miss: number | null;
    judge_near: number | null;
    play_time: string;
}

export interface ChartDetail {
    id: number;
    level: number;
    level_constant: number | null;
    bpm_min: number | null;
    bpm_max: number | null;
    note_count: number | null;
    duration_seconds: number | null;
    released_at: string | null;
    unlock_condition: string | null;
    /** 이 난이도의 해금 단계 — 이름은 보는 언어로 번역됨 (2026-09-18) */
    unlockSteps: UnlockStep[];
    play_video_url: string | null;
    chart_preview_url: string | null;
    has_published_pattern: boolean;
    scoreDistribution: {
        key: string;
        label: string;
        count: number;
    }[];
    playerCount: number;
    /** 공개된 서열표의 이 채보 값 — 머리 수치 띠(2026-09-16). 미등재는 value null */
    tierValues: {
        mode: "basic" | "recital";
        goal: "s" | "990k" | "pianist";
        value: number | null;
    }[];
    /** 서열 변경 이력 — 개요 탭(detail)에서만 채움 */
    tierHistory: {
        id: number;
        mode: "basic" | "recital";
        goal: "s" | "990k" | "pianist";
        previousValue: number | null;
        value: number | null;
        effectiveAt: string;
    }[];
    /** 참가자 점수(내림차순) — 랭킹 탭 산점도(2026-09-16) */
    scoreSeries: number[];
}

export interface MusicDetailProps {
    community?: CommunityData;
    accountId?: number;
    music: MusicInfo;
    difficulty: Difficulty;
    activeTab: DetailTab;
    isLoggedIn: boolean;
    userPlayData: UserPlayData | null;
    recentChartPlays: RecentChartPlay[];
    scoreTrend: ScoreTrendPoint[];
    performanceTrend: PerformanceTrendPoint[];
    peerScoreComparison: PeerScoreComparison | null;
    chartDetail: ChartDetail;
    ranking: {
        rows: ChartRankingRow[];
        page: number;
        pageSize: number;
        totalCount: number;
        userRank: number | null;
        /** 점수 분포 곡선 위 사진 — 참가자 30명 이하면 모두, 넘으면 상위 3명 + 나 */
        players: ChartScorePlayer[];
    };
    tier: {
        currentConstant: number | null;
        constantHistory: {
            id: number;
            value: number;
            effectiveAt: string;
        }[];
        community: {
            average: number | null;
            count: number;
            distribution: { value: number; count: number }[];
        };
        currentEvaluation: {
            perceived_constant: number;
            stairs: number;
            chord: number;
            trill: number;
            glissando: number;
            repetition: number;
            comment: string | null;
        } | null;
        opinionCount: number;
        opinions: {
            id: number;
            perceivedConstant: number;
            comment: string;
            updatedAt: string;
            user: { id: number; username: string | null };
            positiveCount: number;
            negativeCount: number;
            viewerReaction: number | null;
            canDelete: boolean;
        }[];
    };
}
