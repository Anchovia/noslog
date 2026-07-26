import type { GradeHistoryPoint } from "../chart";
import type { ProfileSJustAnalytics } from "@/lib/profile/profileAnalytics";

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

export interface BestPlayItem {
    besttime: string;
    score: number;
    rank: string;
    level: number;
    difficulty: string;
    max_combo: number;
    music_idx: string;
    fc_type: number;
    grade_basic?: number;
    grade_recital?: number;
    music: { title: string; background: string | null };
}

export interface RecentPlayItem {
    id: number;
    play_time: string;
    score: number;
    rank: string;
    grade_basic: number;
    difficulty: string;
    level: number;
    music_idx: string;
    music: { title: string; background: string | null };
}

export interface ProfileDashboardProps {
    user: ProfileUser;
    gradeHistory: GradeHistoryPoint[];
    basicBestPlays: BestPlayItem[];
    recitalBestPlays: BestPlayItem[];
    recentPlays: RecentPlayItem[];
    isOwner: boolean;
    ownerAnalytics: ProfileOwnerAnalytics | null;
}

export interface ProfileRankRow {
    label: string;
    value: number;
}

export interface ProfileOwnerAnalytics {
    judgement: ProfileSJustAnalytics;
}
