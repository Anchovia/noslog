import {
    MUSECAT_NOSTALGIA_GAME_SCHEMA,
    MUSECAT_RECORDS_MAX_BYTES,
    MUSECAT_RECORDS_SPEC,
    type MusecatField,
    type MusecatRecords,
    musecatRecordsSchema,
    type MusecatSelection,
} from "@/features/partner/schemas/musecat-records-schema";

/** 동의 화면에서 사용자가 고른 항목(2026-10-20 결정 — 기본 프로필은 필수라 항목이 아니다) */
export interface NostalgiaRecordsShare {
    summary: boolean;
    ranks: boolean;
    /** 뮤즈캣과 형식을 맞추기 전까지는 골라도 `unsupported` 로 보낸다 */
    songRecords: boolean;
    recentPlays: boolean;
}

type PlayMode = "basic" | "recital";

export interface NostalgiaRecentPlay {
    musicIndex: string;
    title: string;
    artist: string | null;
    /** NosLog 난이도 표기(Normal · Hard · Expert · Real) 그대로 — Real 을 Expert 로 바꾸지 않는다 */
    difficulty: string;
    level: number;
    playedAt: Date;
    score: number;
    /** 채보별 Grd — 저장값(×100)이 아니라 소수 */
    grdBasic: number | null;
    grdRecital: number | null;
}

export interface NostalgiaRecordsInput {
    subject: string;
    playerName: string;
    profileUrl: string;
    /** 마지막으로 성공한 동기화 시각(요청 시각이 아님) */
    updatedAt: Date;
    /** 공개 설정 「플레이 점수」 */
    scoresPublic: boolean;
    /** 공개 설정 「플레이 활동」 — 최근 플레이 공개를 가진다 */
    activityPublic: boolean;
    share: NostalgiaRecordsShare;
    summary: Record<PlayMode, { grade: number | null; rating: number | null }>;
    /** Grade 기준 순위 */
    ranks: { mode: PlayMode; scope: "domestic" | "global"; rank: number }[];
    /** 북마클릿이 가져온 기간 안의 기록뿐 — 전체 기록처럼 쓰지 않는다 */
    recentPlays: { total: number; items: NostalgiaRecentPlay[] };
}

const MODE_LABEL = { basic: "Basic", recital: "Recital" } as const;
const SCOPE_LABEL = {
    domestic: { en: "Domestic rank", ko: "국내 순위", ja: "国内順位" },
    global: { en: "Global rank", ko: "해외 포함 순위", ja: "総合順位" },
} as const;
const MAX_PLAYS = 50;

function label(text: string) {
    return { en: text, ko: text, ja: text };
}

function decimalField(
    key: string,
    text: string,
    value: number | null
): MusecatField[] {
    if (value === null) return [];
    return [
        {
            key,
            label: label(text),
            type: "decimal",
            value: Math.round(value * 100) / 100,
            precision: 2,
        },
    ];
}

function summaryFields(input: NostalgiaRecordsInput): MusecatField[] {
    const { basic, recital } = input.summary;
    return [
        ...decimalField("grade", "Grade (Basic)", basic.grade),
        ...decimalField(
            "noslog.grade_recital",
            "Grade (Recital)",
            recital.grade
        ),
        ...decimalField("rating", "NosLog rating (Basic)", basic.rating),
        ...decimalField(
            "noslog.rating_recital",
            "NosLog rating (Recital)",
            recital.rating
        ),
    ];
}

function rankFields(input: NostalgiaRecordsInput): MusecatField[] {
    return input.ranks.map(({ mode, scope, rank }) => ({
        key: `noslog.rank_${mode}_${scope}`,
        label: {
            en: `${SCOPE_LABEL[scope].en} (${MODE_LABEL[mode]} Grade)`,
            ko: `${SCOPE_LABEL[scope].ko} (${MODE_LABEL[mode]} Grade)`,
            ja: `${SCOPE_LABEL[scope].ja} (${MODE_LABEL[mode]} Grade)`,
        },
        type: "integer",
        value: rank,
    }));
}

function playFields(play: NostalgiaRecentPlay): MusecatField[] {
    return [
        {
            key: "score",
            label: label("Score"),
            type: "integer",
            value: play.score,
        },
        ...decimalField("grd", "Grd (Basic)", play.grdBasic),
        ...decimalField("noslog.grd_recital", "Grd (Recital)", play.grdRecital),
    ];
}

function recentPlays(input: NostalgiaRecordsInput) {
    const items = [...input.recentPlays.items]
        .sort((a, b) => b.playedAt.getTime() - a.playedAt.getTime())
        .slice(0, MAX_PLAYS);
    return {
        plays: items.map((play) => ({
            id: `noslog:play:${play.musicIndex}:${play.difficulty}:${play.playedAt.toISOString()}`,
            played_at: play.playedAt.toISOString(),
            song: {
                id: `noslog:song:${play.musicIndex}`,
                title: play.title,
                ...(play.artist ? { artist: play.artist } : {}),
            },
            chart: {
                id: `noslog:chart:${play.musicIndex}:${play.difficulty}`,
                difficulty: play.difficulty,
                level: String(play.level),
            },
            fields: playFields(play),
        })),
        total: input.recentPlays.total,
    };
}

/**
 * NosLog 기록 → 뮤즈캣 기록 봉투. 사용자가 고른 항목과 NosLog 공개 설정을 먼저 적용하고 만든다(뮤즈캣 spec).
 * 고르지 않았거나 공개 설정으로 막힌 그룹은 데이터 없이 `selection` 에만 적는다.
 * 「플레이 점수」가 비공개면 봉투 전체를 `private` 로 둔다 — 뮤즈캣은 남에게 보여 주지 않는다.
 */
export function buildNostalgiaRecords(
    input: NostalgiaRecordsInput
): MusecatRecords {
    const selection: MusecatSelection[] = [];
    const fields: MusecatField[] = [];
    if (input.share.summary) fields.push(...summaryFields(input));
    if (input.share.ranks) fields.push(...rankFields(input));
    if (!input.share.summary && !input.share.ranks) {
        selection.push({ key: "fields", status: "denied" });
    } else if (!input.share.summary) {
        for (const key of [
            "grade",
            "noslog.grade_recital",
            "rating",
            "noslog.rating_recital",
        ]) {
            selection.push({ key: `fields.${key}`, status: "denied" });
        }
    }
    selection.push({
        key: "sections",
        status: input.share.songRecords ? "unsupported" : "denied",
    });
    const sharePlays = input.share.recentPlays && input.activityPublic;
    if (!sharePlays) selection.push({ key: "recent_plays", status: "denied" });

    const records = musecatRecordsSchema.parse({
        spec: MUSECAT_RECORDS_SPEC,
        service: "nostalgia",
        sub: input.subject,
        visibility: input.scoresPublic ? "public" : "private",
        updated_at: input.updatedAt.toISOString(),
        source: { name: "NosLog", url: input.profileUrl },
        game_schema: MUSECAT_NOSTALGIA_GAME_SCHEMA,
        player: { name: input.playerName },
        fields,
        sections: [],
        ...(sharePlays ? { recent_plays: recentPlays(input) } : {}),
        selection,
    });
    if (
        Buffer.byteLength(JSON.stringify(records), "utf8") >
        MUSECAT_RECORDS_MAX_BYTES
    ) {
        throw new Error("Musecat records envelope exceeds 256 KiB");
    }
    return records;
}
