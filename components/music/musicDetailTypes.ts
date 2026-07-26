import type { RankingRow } from "./ranking/musicRankingTypes";

export type Difficulty = "Normal" | "Hard" | "Expert" | "Real";

export type DetailTab = "record" | "detail" | "ranking" | "tier";

export interface MusicInfo {
    index: string;
    background: string | null;
    title: string;
    artist: string | null;
    category_short: string;
    normal: number;
    hard: number;
    expert: number;
    real: number | null;
}

export interface UserPlayData {
    user_id: number;
    user: {
        id: number;
        username: string | null;
        avatar: string | null;
    };
    rank: string;
    fc_type: number;
    grade_basic: number;
    grade_recital: number;
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
    play_video_url: string | null;
    chart_preview_url: string | null;
    evaluationCount: number;
    patternAverages: {
        stairs: number;
        chord: number;
        trill: number;
        glissando: number;
        repetition: number;
    };
    scoreDistribution: {
        key: string;
        label: string;
        count: number;
    }[];
    playerCount: number;
    userTopPercent: number | null;
}

export interface MusicDetailProps {
    music: MusicInfo;
    difficulty: Difficulty;
    activeTab: DetailTab;
    isLoggedIn: boolean;
    userPlayData: UserPlayData | null;
    recentChartPlays: RecentChartPlay[];
    scoreTrend: ScoreTrendPoint[];
    chartDetail: ChartDetail;
    ranking: {
        rows: RankingRow[];
        page: number;
        pageSize: number;
        totalCount: number;
        userRank: number | null;
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
