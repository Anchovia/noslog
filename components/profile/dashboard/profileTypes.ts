export type ProfileMode = "basic" | "recital";

export interface ProfileUser {
    id: number;
    username: string | null;
    nostalgia_name: string | null;
    discord_name: string | null;
    discord_username: string | null;
    avatar: string | null;
    country: string;
    rank_basic: number | null;
    rank_basic_country: number | null;
    rank_recital: number | null;
    rank_recital_country: number | null;
    grade_basic: number | null;
    grade_recital: number | null;
    exam_basic: number | null;
    exam_recital: number | null;
    play_count: number | null;
    hide_nostalgia_name: boolean;
    hide_discord_name: boolean;
    hide_play_count: boolean;
    hide_preferred_arcade: boolean;
    hide_play_activity: boolean;
    hide_play_scores: boolean;
    score_p: number | null;
    score_f: number | null;
    score_s: number | null;
    score_a2: number | null;
    score_a: number | null;
    score_b2: number | null;
    score_b: number | null;
    score_c: number | null;
    score_d: number | null;
    created_at: string;
    last_played_at: string | null;
    preferredArcade: { name: string } | null;
}

export interface ProfileRankRow {
    label: string;
    value: number;
}
