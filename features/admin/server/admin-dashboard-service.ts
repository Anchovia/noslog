import "server-only";

import type {
    DashboardMetric,
    DashboardRange,
} from "@/features/admin/dashboard-params";
import {
    DASHBOARD_METRICS,
    DASHBOARD_RANGES,
} from "@/features/admin/dashboard-params";
import { requireAdmin } from "@/lib/admin";
import { STALE_SYNC_THRESHOLD_MS } from "@/lib/admin/sync-health";
import {
    ANALYTICS_RETENTION_DAYS,
    ANALYTICS_START_DATE,
    analyticsDateKey,
    analyticsHourKey,
} from "@/lib/analytics";
import {
    API_ROUTES,
    EXTERNAL_EVENTS,
    isExternalEvent,
    PAGE_ROUTES,
    routeLabel,
} from "@/lib/analytics-routes";
import db from "@/lib/db";

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const NOT_ADMIN = { role: { not: "admin" as const } };

function shiftKey(key: string, days: number) {
    return new Date(Date.parse(`${key}T00:00:00Z`) + days * DAY_MS)
        .toISOString()
        .slice(0, 10);
}

// endKey 까지 거꾸로 days 칸 — 오래된 날부터
function dayKeys(endKey: string, days: number) {
    return Array.from({ length: days }, (_, index) =>
        shiftKey(endKey, index - days + 1)
    );
}

function seoulStart(key: string) {
    return new Date(`${key}T00:00:00+09:00`);
}

// 실패 사유는 첫 줄 앞부분으로 묶는다 — 오류 문장 뒤의 값이 달라도 같은 사유로 센다
function failureReason(message: string | null) {
    const line = (message ?? "").split("\n")[0].trim();
    return line ? line.slice(0, 80) : "사유 없음";
}

export interface DashboardRow {
    key: string;
    label: string;
    detail: string;
    count: number;
}

function sortedRows(
    counts: Map<string, number>,
    describe: (key: string) => { label: string; detail: string }
): DashboardRow[] {
    return [...counts]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([key, count]) => ({ key, count, ...describe(key) }));
}

function addCount(counts: Map<string, number>, key: string, by = 1) {
    counts.set(key, (counts.get(key) ?? 0) + by);
}

function addUser(sets: Map<string, Set<number>>, key: string, userId: number) {
    let set = sets.get(key);
    if (!set) {
        set = new Set();
        sets.set(key, set);
    }
    set.add(userId);
}

/**
 * 대시보드 한 화면 — 기간의 하루별 합계와 바로 앞 같은 길이 기간(증감 비교),
 * 자주 보는 페이지·API·외부 호출(기간 합계), 처리할 일(지금 개수), 활성 사용자 · 동기화 상태(2026-10-17)
 */
export async function getAdminDashboard(
    { range, metric }: { range: DashboardRange; metric: DashboardMetric },
    now = new Date()
) {
    await requireAdmin();
    const days = DASHBOARD_RANGES[range].days;
    const todayKey = analyticsDateKey(now);
    const current = dayKeys(todayKey, days);
    const previous = dayKeys(shiftKey(current[0], -1), days);
    const since = seoulStart(previous[0]);
    const currentStart = seoulStart(current[0]);
    const hourNow = analyticsHourKey(now);
    // 오늘 보기는 어제 같은 시각대(지금 시각의 59분)까지와 비교한다 — 오전에 늘 「감소」 로 보이지 않게(2026-10-17 T1)
    const previousEnd =
        days === 1
            ? new Date(since.getTime() + (Number(hourNow) + 1) * HOUR_MS)
            : currentStart;
    // 방문 합계는 수집 시작일부터 있고 보관 기간이 지나면 지워진다 — 직전 기간이 그 밖에 걸치면 비교하지 않는다(K2)
    const retainedFrom = analyticsDateKey(
        new Date(now.getTime() - ANALYTICS_RETENTION_DAYS * DAY_MS)
    );
    const visitsComparable =
        previous[0] >= ANALYTICS_START_DATE && previous[0] >= retainedFrom;
    // 활성 사용자는 기간 선택과 관계없이 오늘까지 7일 · 28일(서울 날짜 기준 롤링)
    const active7Start = seoulStart(shiftKey(todayKey, -6));
    const active28Start = seoulStart(shiftKey(todayKey, -27));

    const [
        counts,
        users,
        syncs,
        pendingSubmissions,
        openFeedback,
        openArcadeReports,
        failedSyncs,
        staleSyncs,
        pendingCatalog,
        pendingProposals,
        pendingDrafts,
        cohort,
        patternVotes,
        opinions,
        goalVotes,
        eventPosts,
        arcadeReports,
        activeSyncers,
        evaluationAuthors,
        goalVoters,
        eventAuthors,
        arcadeReporters,
    ] = await Promise.all([
        db.$queryRaw<
            { date: string; kind: string; key: string; count: number }[]
        >`
            SELECT to_char("date", 'YYYY-MM-DD') AS "date", "kind", "key", "count"
            FROM "analytics_daily_counts"
            WHERE "date" >= ${previous[0]}::date`,
        db.user.findMany({
            where: { ...NOT_ADMIN, createdAt: { gte: since } },
            select: { createdAt: true },
        }),
        db.dataSync.findMany({
            where: { user: NOT_ADMIN, startedAt: { gte: since } },
            select: {
                userId: true,
                startedAt: true,
                status: true,
                errorMessage: true,
            },
        }),
        db.examSubmission.count({ where: { status: "pending" } }),
        db.feedbackReport.count({ where: { status: "open", arcadeId: null } }),
        db.feedbackReport.count({
            where: { status: "open", arcadeId: { not: null } },
        }),
        db.dataSync.count({
            where: {
                status: "failed",
                startedAt: { gte: new Date(now.getTime() - DAY_MS) },
            },
        }),
        db.dataSync.count({
            where: {
                status: "processing",
                startedAt: {
                    lte: new Date(now.getTime() - STALE_SYNC_THRESHOLD_MS),
                },
            },
        }),
        db.musicCatalogCandidate.count({ where: { status: "pending" } }),
        db.chartFieldProposal.count({ where: { status: "pending" } }),
        db.chartDraft.count({ where: { status: "pending" } }),
        // 전환 흐름 — 기간에 가입한 사람이 온보딩 · 연동(성공한 동기화) · 기록까지 갔는지(2026-10-17 S3)
        db.user.findMany({
            where: { ...NOT_ADMIN, createdAt: { gte: currentStart } },
            select: {
                id: true,
                profileCompletedAt: true,
                dataSyncs: {
                    where: { status: "completed" },
                    select: { id: true },
                    take: 1,
                },
                playData: { select: { id: true }, take: 1 },
            },
        }),
        // 기여 활동 — 기간에 새로 쓴 것만(2026-10-17 E1). 고치기 · 번역 저장 · 숨김은 updated_at 만 바꿔 세지 않는다.
        // 패턴 평가는 패턴 값이 있는 평가 — 의견만 쓴 줄은 의견으로 센다
        db.communityChartEvaluation.count({
            where: {
                user: NOT_ADMIN,
                createdAt: { gte: currentStart },
                OR: [
                    { stairs: { not: null } },
                    { repetition: { not: null } },
                    { polyrhythm: { not: null } },
                    { offset: { not: null } },
                    { chords: { not: null } },
                ],
            },
        }),
        db.communityChartEvaluation.count({
            where: {
                user: NOT_ADMIN,
                opinionCreatedAt: { gte: currentStart },
            },
        }),
        db.chartGoalVote.count({
            where: { user: NOT_ADMIN, createdAt: { gte: currentStart } },
        }),
        db.communityEvent.count({
            where: { author: NOT_ADMIN, submittedAt: { gte: currentStart } },
        }),
        db.feedbackReport.count({
            where: {
                user: NOT_ADMIN,
                arcadeId: { not: null },
                createdAt: { gte: currentStart },
            },
        }),
        // 활성 사용자 — 28일 안에 동기화를 끝낸 사람의 마지막 동기화
        db.dataSync.groupBy({
            by: ["userId"],
            where: {
                user: NOT_ADMIN,
                status: "completed",
                startedAt: { gte: active28Start },
            },
            _max: { startedAt: true },
        }),
        // 기여한 사람마다 처음 · 마지막 기여 — 새 기여자와 활성 사용자에 함께 쓴다
        db.communityChartEvaluation.groupBy({
            by: ["userId"],
            where: { user: NOT_ADMIN },
            _min: { createdAt: true },
            _max: { createdAt: true, opinionCreatedAt: true },
        }),
        db.chartGoalVote.groupBy({
            by: ["userId"],
            where: { user: NOT_ADMIN },
            _min: { createdAt: true },
            _max: { createdAt: true },
        }),
        db.communityEvent.groupBy({
            by: ["authorId"],
            where: { author: NOT_ADMIN, submittedAt: { not: null } },
            _min: { submittedAt: true },
            _max: { submittedAt: true },
        }),
        db.feedbackReport.groupBy({
            by: ["userId"],
            where: { user: NOT_ADMIN, arcadeId: { not: null } },
            _min: { createdAt: true },
            _max: { createdAt: true },
        }),
    ]);

    const inRange = new Set(current);
    const visitorsByDay = new Map<string, number>();
    const pageviewsByDay = new Map<string, number>();
    const hours = new Map<string, number>();
    let previousTodayPageviews = 0;
    const audience = {
        member: { visitors: 0, pageviews: 0 },
        guest: { visitors: 0, pageviews: 0 },
    };
    const pages = new Map<string, number>();
    const apis = new Map<string, number>();
    const externals = new Map<string, number>();
    for (const row of counts) {
        const count = Number(row.count);
        if (row.kind === "visitors") addCount(visitorsByDay, row.date, count);
        else if (row.kind === "pageviews")
            addCount(pageviewsByDay, row.date, count);
        else if (row.kind === "hour") {
            if (days !== 1) continue;
            if (inRange.has(row.date)) addCount(hours, row.key, count);
            else if (row.key <= hourNow) previousTodayPageviews += count;
        } else if (!inRange.has(row.date)) continue;
        else if (row.kind === "audience" || row.kind === "audienceVisitor") {
            const side =
                row.key === "member" ? audience.member : audience.guest;
            if (row.kind === "audience") side.pageviews += count;
            else side.visitors += count;
        } else {
            const target =
                row.kind === "page"
                    ? pages
                    : row.kind === "api"
                      ? apis
                      : row.kind === "external"
                        ? externals
                        : null;
            if (target) addCount(target, row.key, count);
        }
    }

    // 가입 — 하루별 · 오늘 시각별, 직전 기간은 previousEnd 앞까지
    const signupsByDay = new Map<string, number>();
    const hourlySignups = new Map<string, number>();
    let currentSignups = 0;
    let previousSignups = 0;
    for (const user of users) {
        const key = analyticsDateKey(user.createdAt);
        addCount(signupsByDay, key, 1);
        if (user.createdAt >= currentStart) {
            currentSignups += 1;
            if (days === 1)
                addCount(hourlySignups, analyticsHourKey(user.createdAt));
        } else if (user.createdAt < previousEnd) previousSignups += 1;
    }

    // 동기화 — 큰 숫자는 동기화를 끝낸 사람 수(여러 번 해도 1, 2026-10-17 Y2), 시도 · 실패 · 처리 중은 따로
    const syncersByDay = new Map<string, Set<number>>();
    const hourlySyncers = new Map<string, Set<number>>();
    const currentSyncers = new Set<number>();
    const previousSyncers = new Set<number>();
    const syncStatus = { completed: 0, failed: 0, processing: 0 };
    const failureReasons = new Map<string, number>();
    for (const sync of syncs) {
        const isCurrent = sync.startedAt >= currentStart;
        if (isCurrent) {
            if (sync.status === "completed") syncStatus.completed += 1;
            else if (sync.status === "failed") {
                syncStatus.failed += 1;
                addCount(failureReasons, failureReason(sync.errorMessage));
            } else syncStatus.processing += 1;
        }
        if (sync.status !== "completed") continue;
        addUser(syncersByDay, analyticsDateKey(sync.startedAt), sync.userId);
        if (isCurrent) {
            currentSyncers.add(sync.userId);
            if (days === 1)
                addUser(
                    hourlySyncers,
                    analyticsHourKey(sync.startedAt),
                    sync.userId
                );
        } else if (sync.startedAt < previousEnd)
            previousSyncers.add(sync.userId);
    }

    const sumDays = (map: Map<string, number>, keys: string[]) =>
        keys.reduce((total, key) => total + (map.get(key) ?? 0), 0);
    const visitPrevious = (map: Map<string, number>) =>
        visitsComparable ? sumDays(map, previous) : null;
    const syncAttempts =
        syncStatus.completed + syncStatus.failed + syncStatus.processing;
    const kpiValues: Record<
        DashboardMetric,
        { value: number; previous: number | null }
    > = {
        visitors: {
            value: sumDays(visitorsByDay, current),
            // 방문자는 시각별로 세지 않아 오늘은 어제 같은 시각까지를 낼 수 없다
            previous: days === 1 ? null : visitPrevious(visitorsByDay),
        },
        pageviews: {
            value: sumDays(pageviewsByDay, current),
            previous:
                days === 1
                    ? visitsComparable
                        ? previousTodayPageviews
                        : null
                    : visitPrevious(pageviewsByDay),
        },
        signups: { value: currentSignups, previous: previousSignups },
        syncs: { value: currentSyncers.size, previous: previousSyncers.size },
    };
    const kpis = (Object.keys(DASHBOARD_METRICS) as DashboardMetric[]).map(
        (key) => ({
            metric: key,
            label: DASHBOARD_METRICS[key],
            ...kpiValues[key],
            attempts: key === "syncs" ? syncAttempts : null,
            failed: key === "syncs" ? syncStatus.failed : null,
        })
    );

    // 활성 사용자 · 새 기여자 — 동기화를 끝냈거나 무언가 새로 쓴 사람. 방문 기록은 쓰지 않는다
    const firstContribution = new Map<number, number>();
    const lastActive = new Map<number, number>();
    const noteActivity = (
        userId: number,
        first: Date | null | undefined,
        ...lasts: (Date | null | undefined)[]
    ) => {
        if (first) {
            const time = first.getTime();
            const known = firstContribution.get(userId);
            if (known === undefined || time < known)
                firstContribution.set(userId, time);
        }
        for (const last of lasts) {
            if (!last) continue;
            const time = last.getTime();
            if (time > (lastActive.get(userId) ?? -Infinity))
                lastActive.set(userId, time);
        }
    };
    for (const row of evaluationAuthors)
        noteActivity(
            row.userId,
            row._min.createdAt,
            row._max.createdAt,
            row._max.opinionCreatedAt
        );
    for (const row of goalVoters)
        noteActivity(row.userId, row._min.createdAt, row._max.createdAt);
    for (const row of eventAuthors)
        noteActivity(row.authorId, row._min.submittedAt, row._max.submittedAt);
    for (const row of arcadeReporters)
        noteActivity(row.userId, row._min.createdAt, row._max.createdAt);
    for (const row of activeSyncers)
        noteActivity(row.userId, null, row._max.startedAt);
    const activeSince = (start: Date) =>
        [...lastActive.values()].filter((time) => time >= start.getTime())
            .length;
    const active7 = activeSince(active7Start);
    const active28 = activeSince(active28Start);
    const newContributors = [...firstContribution.values()].filter(
        (time) => time >= currentStart.getTime()
    ).length;

    return {
        range,
        metric,
        days,
        // 오늘은 날짜 하나뿐이라 시각별로 — 아직 오지 않은 시각은 빈 칸으로 둔다 (2026-09-20).
        // 방문자는 하루 단위로만 세므로 시각별 값이 없다 (2026-09-22)
        hourly:
            days === 1
                ? Array.from({ length: 24 }, (_, hour) => {
                      const key = String(hour).padStart(2, "0");
                      return {
                          hour: key,
                          label: `${hour}시`,
                          values: {
                              pageviews: hours.get(key) ?? 0,
                              signups: hourlySignups.get(key) ?? 0,
                              syncs: hourlySyncers.get(key)?.size ?? 0,
                          },
                          future: key > hourNow,
                      };
                  })
                : null,
        // 오늘 보기의 증감 기준 시각(어제 이 시각의 59분까지), 방문 합계를 비교할 수 있는지(2026-10-17 T1 · K2)
        comparison: {
            untilHour: days === 1 ? Number(hourNow) : null,
            visitsComparable,
        },
        audience,
        funnel: [
            { label: "가입", count: cohort.length },
            {
                label: "온보딩 완료",
                count: cohort.filter((user) => user.profileCompletedAt).length,
            },
            {
                label: "기록 연동",
                count: cohort.filter((user) => user.dataSyncs.length).length,
            },
            {
                label: "기록 등록",
                count: cohort.filter((user) => user.playData.length).length,
            },
        ],
        contributions: [
            { key: "goalVotes", label: "서열 투표", count: goalVotes },
            { key: "patternVotes", label: "패턴 평가", count: patternVotes },
            { key: "opinions", label: "의견", count: opinions },
            { key: "eventPosts", label: "이벤트 글", count: eventPosts },
            {
                key: "arcadeReports",
                label: "오락실 제보",
                count: arcadeReports,
            },
        ],
        newContributors,
        active: {
            week: active7,
            month: active28,
            // 28일 활성 중 7일 안에도 온 비율 — 없으면 null
            ratio: active28 ? Math.round((active7 / active28) * 100) : null,
        },
        syncHealth: {
            rows: [
                {
                    key: "completed",
                    label: "완료",
                    detail: "",
                    count: syncStatus.completed,
                },
                {
                    key: "failed",
                    label: "실패",
                    detail: "",
                    count: syncStatus.failed,
                },
                {
                    key: "processing",
                    label: "처리 중",
                    detail: "",
                    count: syncStatus.processing,
                },
            ].filter((row) => row.count > 0),
            reasons: sortedRows(failureReasons, (key) => ({
                label: key,
                detail: "",
            })).slice(0, 3),
        },
        from: current[0],
        to: current[current.length - 1],
        kpis,
        // 수집 시작 전 날짜의 방문 값은 0 이 아니라 빈 칸(null)으로 — 그래프 선이 끊긴다(K2)
        series: current.map((key) => {
            const counted = key >= ANALYTICS_START_DATE;
            return {
                date: key,
                label: `${Number(key.slice(5, 7))}/${Number(key.slice(8, 10))}`,
                values: {
                    visitors: counted ? (visitorsByDay.get(key) ?? 0) : null,
                    pageviews: counted ? (pageviewsByDay.get(key) ?? 0) : null,
                    signups: signupsByDay.get(key) ?? 0,
                    syncs: syncersByDay.get(key)?.size ?? 0,
                },
            };
        }),
        topPages: sortedRows(pages, (key) => ({
            label: routeLabel(PAGE_ROUTES, key),
            detail: key,
        })).slice(0, 8),
        apiCalls: sortedRows(apis, (key) => ({
            label: routeLabel(API_ROUTES, key),
            detail: key,
        })),
        externalCalls: sortedRows(externals, (key) =>
            isExternalEvent(key)
                ? EXTERNAL_EVENTS[key]
                : { label: key, detail: "" }
        ),
        // 누르면 그 탭 목록으로. 0 인 일은 화면에서 한 줄(「나머지 없음」)로 접는다.
        // 동기화 실패 · 지연은 운영 감시라 관리자 시도도 센다 — 위 지표(관리자 제외)와 숫자가 다를 수 있어 이름에 적는다
        todo: [
            {
                label: "인증 심사 대기",
                count: pendingSubmissions,
                href: "/admin/submissions?status=pending",
            },
            {
                label: "피드백 접수",
                count: openFeedback,
                href: "/admin/feedback?status=open",
            },
            {
                label: "오락실 제보",
                count: openArcadeReports,
                href: "/admin/feedback?status=open",
            },
            {
                label: "동기화 실패(24시간 · 관리자 포함)",
                count: failedSyncs,
                href: "/admin/syncs?status=failed",
            },
            {
                label: "동기화 지연(관리자 포함)",
                count: staleSyncs,
                href: "/admin/syncs?status=processing",
            },
            {
                label: "업데이트 대기",
                count: pendingCatalog,
                href: "/admin/catalog",
            },
            {
                label: "기여 제안",
                count: pendingProposals,
                href: "/admin/contributions",
            },
            {
                label: "채보 검토",
                count: pendingDrafts,
                href: "/admin/contributions?kind=chart",
            },
        ],
    };
}

export type AdminDashboardData = Awaited<ReturnType<typeof getAdminDashboard>>;
