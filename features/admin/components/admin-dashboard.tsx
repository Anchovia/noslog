import Link from "next/link";

import {
    AdminCard,
    AdminCardHead,
    AdminTable,
} from "@/components/admin/admin-card";
import AdminLinkRow from "@/components/admin/admin-link-row";
import AdminDashboardLoading, {
    dashboardPeriod,
} from "@/features/admin/components/admin-dashboard-loading";
import {
    AdminDashboardMetricLink,
    AdminDashboardRangeLink,
    AdminDashboardTodoMenu,
    AdminDashboardTrend,
} from "@/features/admin/components/admin-dashboard-metric";
import {
    AdminDashboardLinkStatus,
    AdminDashboardPending,
    AdminDashboardPendingRegion,
} from "@/features/admin/components/admin-dashboard-pending";
import {
    DASHBOARD_RANGES,
    type DashboardMetric,
    type DashboardRange,
} from "@/features/admin/dashboard-params";
import type {
    AdminDashboardData,
    DashboardRow,
} from "@/features/admin/server/admin-dashboard-service";

const DAY_MS = 24 * 60 * 60 * 1000;

function shortDate(key: string) {
    return `${Number(key.slice(5, 7))}/${Number(key.slice(8, 10))}`;
}

function shiftKey(key: string, days: number) {
    return new Date(Date.parse(`${key}T00:00:00Z`) + days * DAY_MS)
        .toISOString()
        .slice(0, 10);
}

const UNITS: Record<DashboardMetric, string> = {
    visitors: "명",
    pageviews: "회",
    signups: "명",
    syncs: "명",
};

// 앞 같은 길이 기간 대비 증감 — 「많음 · 적음」 글자로 말한다(색만으로 말하지 않는다).
// 비교할 기록이 없으면(오늘 방문자 · 수집 전 · 보관 기간 밖) 빈 값 「-」 (2026-10-17 K2)
function Delta({
    value,
    previous,
    unit,
    base,
}: {
    value: number;
    previous: number | null;
    unit: string;
    base: string;
}) {
    if (previous === null)
        return (
            <span className="nl-body-secondary nl-muted" aria-label="비교 없음">
                -
            </span>
        );
    const diff = value - previous;
    return (
        <span className="nl-body-secondary nl-muted">
            {diff === 0
                ? `${base}과 같음`
                : `${base}보다 ${Math.abs(diff).toLocaleString("ko-KR")}${unit} ${diff > 0 ? "많음" : "적음"}`}
        </span>
    );
}

function CountList({ rows, empty }: { rows: DashboardRow[]; empty: string }) {
    if (!rows.length)
        return <p className="nl-body-secondary nl-muted">{empty}</p>;
    const max = Math.max(...rows.map((row) => row.count));
    return (
        <ul className="nl-dashboard__list">
            {rows.map((row) => (
                <li key={row.key}>
                    <span
                        className="nl-dashboard__bar nl-chart-reveal nl-chart-bar"
                        style={{ width: `${(row.count / max) * 100}%` }}
                        aria-hidden
                    />
                    <span className="nl-dashboard__name">
                        <span className="nl-body-secondary">{row.label}</span>
                        {row.detail ? (
                            <span className="nl-metadata nl-muted">
                                {row.detail}
                            </span>
                        ) : null}
                    </span>
                    <span className="nl-metric-value">
                        {row.count.toLocaleString("ko-KR")}
                    </span>
                </li>
            ))}
        </ul>
    );
}

// 가입자 · 손님 — 페이지뷰 비율 막대 한 줄과 방문자 · 페이지뷰 수. 누가 왔는지는 세지 않는다 (2026-09-20)
function AudienceSplit({
    audience,
}: {
    audience: AdminDashboardData["audience"];
}) {
    const total = audience.member.pageviews + audience.guest.pageviews;
    if (!total)
        return (
            <p className="nl-body-secondary nl-muted">
                아직 방문 기록이 없습니다.
            </p>
        );
    // 색은 admin.css 의 data-side 규칙(데이터 색 토큰) — 인라인으로 칠하지 않는다
    const sides = [
        { key: "member" as const, label: "가입자" },
        { key: "guest" as const, label: "손님" },
    ];
    return (
        <>
            <div className="nl-dashboard__split nl-chart-reveal" aria-hidden>
                {sides.map((side) => (
                    <span
                        key={side.key}
                        className="nl-chart-bar"
                        data-side={side.key}
                        style={{
                            width: `${(audience[side.key].pageviews / total) * 100}%`,
                        }}
                    />
                ))}
            </div>
            <ul className="nl-dashboard__legend">
                {sides.map((side) => (
                    <li key={side.key}>
                        <span
                            className="nl-dashboard__legend-dot"
                            data-side={side.key}
                            aria-hidden
                        />
                        <span className="nl-body-secondary">{side.label}</span>
                        <span className="nl-metric-value">
                            방문자{" "}
                            {audience[side.key].visitors.toLocaleString(
                                "ko-KR"
                            )}
                        </span>
                        <span className="nl-metric-value nl-muted">
                            페이지뷰{" "}
                            {audience[side.key].pageviews.toLocaleString(
                                "ko-KR"
                            )}
                        </span>
                    </li>
                ))}
            </ul>
        </>
    );
}

// 활성 사용자 — 7일 · 28일 · 그 비율. 비율은 28일 활성이 없으면 「-」
function ActiveUsers({ active }: { active: AdminDashboardData["active"] }) {
    const stats = [
        {
            key: "week",
            label: "7일",
            value: active.week.toLocaleString("ko-KR"),
        },
        {
            key: "month",
            label: "28일",
            value: active.month.toLocaleString("ko-KR"),
        },
        {
            key: "ratio",
            label: "7일 ÷ 28일",
            value: active.ratio === null ? "-" : `${active.ratio}%`,
        },
    ];
    return (
        <dl className="nl-dashboard__stats">
            {stats.map((stat) => (
                <div key={stat.key}>
                    <dt className="nl-control nl-muted">{stat.label}</dt>
                    <dd className="nl-metric-display">{stat.value}</dd>
                </div>
            ))}
        </dl>
    );
}

// 처리할 일(판 5 Nova) — 종류 · 대기 건수 · ⋯. 이름을 누르면 그 탭 목록으로
function TodoTable({ todo }: { todo: AdminDashboardData["todo"] }) {
    const rows = [
        ...todo.filter((item) => item.count > 0),
        ...todo.filter((item) => item.count === 0),
    ];
    return (
        <AdminCard>
            <AdminCardHead level="h2" title="처리할 일" />
            <AdminTable>
                <thead>
                    <tr>
                        <th scope="col">종류</th>
                        <th scope="col">대기</th>
                        <th scope="col">
                            <span className="sr-only">메뉴</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((item) => (
                        <AdminLinkRow key={item.label} href={item.href}>
                            <td>
                                <Link href={item.href}>{item.label}</Link>
                            </td>
                            <td>{item.count.toLocaleString("ko-KR")}건</td>
                            <td className="nl-admin-table__menu">
                                <AdminDashboardTodoMenu
                                    label={item.label}
                                    href={item.href}
                                />
                            </td>
                        </AdminLinkRow>
                    ))}
                </tbody>
            </AdminTable>
        </AdminCard>
    );
}

/**
 * 관리자 대시보드 — 판 5(Laravel Nova 배치): 지표 4칸 → 그래프 카드(기간 고르기는 머리 줄 오른쪽) → 처리할 일 표.
 * 나머지 패널은 자리를 정하기 전까지 그 아래에 옛 C안 틀(본문 8 : 레일 4) 그대로 둔다.
 * 기간·그래프 지표는 주소(?range=·?metric=)로 바꾼다
 */
export default function AdminDashboard({ data }: { data: AdminDashboardData }) {
    const rangeLabel = DASHBOARD_RANGES[data.range].label;
    const period = dashboardPeriod(data);
    const previousFrom = shiftKey(data.from, -data.days);
    const previousTo = shiftKey(data.from, -1);
    const deltaBase =
        data.comparison.untilHour !== null
            ? "어제 같은 시각"
            : `직전 ${data.days}일`;
    // 오늘은 어제 같은 시각까지(T1), 방문 합계가 없는 직전 기간은 비교하지 않는다(K2).
    // 여러 날 방문자는 하루 방문자의 합 — 다른 날 다시 오면 다시 센다는 정의를 보이는 줄로 둔다(2026-10-17 V1)
    const comparison = [
        data.days > 1
            ? "방문자는 하루 방문자의 합 · 다른 날 다시 오면 다시 셉니다"
            : null,
        data.comparison.untilHour !== null
            ? `증감은 어제(${shortDate(previousTo)}) ${data.comparison.untilHour}시 59분까지 대비`
            : `증감은 지난 ${data.days}일(${shortDate(previousFrom)}–${shortDate(previousTo)}) 대비`,
        data.days === 1
            ? data.comparison.visitsComparable
                ? "방문자는 시간대별로 모으지 않아 비교하지 않음"
                : "방문자 · 페이지뷰는 어제 기록이 없어 비교하지 않음"
            : data.comparison.visitsComparable
              ? null
              : "방문자 · 페이지뷰는 직전 기간 기록이 없어 비교하지 않음",
    ]
        .filter(Boolean)
        .join(" · ");

    const ranges = (
        <nav className="nl-segments nl-dashboard__ranges" aria-label="기간">
            {(Object.keys(DASHBOARD_RANGES) as DashboardRange[]).map((key) => (
                <AdminDashboardRangeLink
                    key={key}
                    range={key}
                    currentRange={data.range}
                    initialMetric={data.metric}
                >
                    {DASHBOARD_RANGES[key].label}
                    <AdminDashboardLinkStatus statusKey={`range-${key}`} />
                </AdminDashboardRangeLink>
            ))}
        </nav>
    );

    return (
        <AdminDashboardPending>
            <h1 className="sr-only">대시보드</h1>
            <AdminDashboardPendingRegion
                loading={<AdminDashboardLoading data={data} />}
            >
                <div className="nl-admin-stack">
                    <div className="nl-dashboard__kpi-group">
                        <div className="nl-dashboard__kpis">
                            {data.kpis.map((kpi) => (
                                <AdminDashboardMetricLink
                                    key={kpi.metric}
                                    range={data.range}
                                    metric={kpi.metric}
                                    initialMetric={data.metric}
                                >
                                    <span className="nl-control nl-muted">
                                        {kpi.label}
                                    </span>
                                    <span className="nl-metric-display">
                                        {kpi.value.toLocaleString("ko-KR")}
                                    </span>
                                    <Delta
                                        value={kpi.value}
                                        previous={kpi.previous}
                                        unit={UNITS[kpi.metric]}
                                        base={deltaBase}
                                    />
                                    <span
                                        className="nl-dashboard__kpi-tone"
                                        data-metric={kpi.metric}
                                        aria-hidden
                                    />
                                    {kpi.attempts ? (
                                        <span className="nl-metadata nl-muted">
                                            시도{" "}
                                            {kpi.attempts.toLocaleString(
                                                "ko-KR"
                                            )}{" "}
                                            · 실패{" "}
                                            {(kpi.failed ?? 0).toLocaleString(
                                                "ko-KR"
                                            )}
                                        </span>
                                    ) : null}
                                </AdminDashboardMetricLink>
                            ))}
                        </div>
                        <p className="nl-metadata nl-muted">{comparison}</p>
                    </div>

                    <AdminDashboardTrend
                        range={data.range}
                        initialMetric={data.metric}
                        hourly={data.hourly}
                        series={data.series}
                        period={period}
                        actions={ranges}
                    />

                    <TodoTable todo={data.todo} />

                    <div className="nl-dashboard__grid">
                        <section
                            className="nl-dashboard__panel"
                            aria-labelledby="dashboard-active"
                        >
                            <div className="nl-dashboard__panel-head">
                                <h2
                                    id="dashboard-active"
                                    className="nl-component-title"
                                >
                                    활성 사용자
                                </h2>
                            </div>
                            <ActiveUsers active={data.active} />
                            <p className="nl-metadata nl-muted">
                                동기화를 끝냈거나 새로 기여한 사람 · 오늘까지 ·
                                방문 기록은 쓰지 않습니다
                            </p>
                        </section>
                        <section
                            className="nl-dashboard__panel"
                            aria-labelledby="dashboard-funnel"
                        >
                            <div className="nl-dashboard__panel-head">
                                <h2
                                    id="dashboard-funnel"
                                    className="nl-component-title"
                                >
                                    전환 흐름
                                </h2>
                            </div>
                            <CountList
                                rows={data.funnel.map((step) => ({
                                    key: step.label,
                                    label: step.label,
                                    detail: "",
                                    count: step.count,
                                }))}
                                empty="기간에 가입한 사람이 없습니다."
                            />
                            <p className="nl-metadata nl-muted">
                                {rangeLabel}에 가입한 사람이 어디까지 갔는지 ·
                                지금 남아 있는 계정 기준
                            </p>
                        </section>

                        <section
                            className="nl-dashboard__panel"
                            aria-labelledby="dashboard-contributions"
                        >
                            <div className="nl-dashboard__panel-head">
                                <h2
                                    id="dashboard-contributions"
                                    className="nl-component-title"
                                >
                                    기여 활동
                                </h2>
                            </div>
                            <p className="nl-dashboard__stat-line nl-body-secondary">
                                <span className="nl-muted">새 기여자</span>
                                <span className="nl-metric-value">
                                    {data.newContributors.toLocaleString(
                                        "ko-KR"
                                    )}
                                </span>
                            </p>
                            <CountList
                                rows={data.contributions.map((row) => ({
                                    ...row,
                                    detail: "",
                                }))}
                                empty="기록 없음"
                            />
                            <p className="nl-metadata nl-muted">
                                새로 쓴 수 · 새 기여자는 처음 기여한 사람 ·{" "}
                                {rangeLabel}
                            </p>
                        </section>

                        <section
                            className="nl-dashboard__panel"
                            aria-labelledby="dashboard-audience"
                        >
                            <div className="nl-dashboard__panel-head">
                                <h2
                                    id="dashboard-audience"
                                    className="nl-component-title"
                                >
                                    가입자 · 손님
                                </h2>
                            </div>
                            <AudienceSplit audience={data.audience} />
                            <p className="nl-metadata nl-muted">
                                로그인 여부만 셉니다 · {rangeLabel}
                            </p>
                        </section>

                        <section
                            className="nl-dashboard__panel"
                            aria-labelledby="dashboard-pages"
                        >
                            <div className="nl-dashboard__panel-head">
                                <h2
                                    id="dashboard-pages"
                                    className="nl-component-title"
                                >
                                    자주 보는 페이지
                                </h2>
                            </div>
                            <CountList
                                rows={data.topPages}
                                empty="아직 방문 기록이 없습니다."
                            />
                            <p className="nl-metadata nl-muted">
                                페이지뷰 · {rangeLabel}
                            </p>
                        </section>

                        <section
                            className="nl-dashboard__panel"
                            aria-labelledby="dashboard-sync"
                        >
                            <div className="nl-dashboard__panel-head">
                                <h2
                                    id="dashboard-sync"
                                    className="nl-component-title"
                                >
                                    동기화 상태
                                </h2>
                            </div>
                            <CountList
                                rows={data.syncHealth.rows}
                                empty="기간에 동기화 시도가 없습니다."
                            />
                            {data.syncHealth.reasons.length ? (
                                <div>
                                    <h3 className="nl-dashboard__group nl-control nl-muted">
                                        실패 사유
                                    </h3>
                                    <CountList
                                        rows={data.syncHealth.reasons}
                                        empty="기록 없음"
                                    />
                                </div>
                            ) : null}
                            <p className="nl-metadata nl-muted">
                                시도 수 · 관리자 제외 · {rangeLabel}
                            </p>
                        </section>

                        <section
                            className="nl-dashboard__panel"
                            aria-labelledby="dashboard-api"
                        >
                            <div className="nl-dashboard__panel-head">
                                <h2
                                    id="dashboard-api"
                                    className="nl-component-title"
                                >
                                    API 호출
                                </h2>
                            </div>
                            <div>
                                <h3 className="nl-dashboard__group nl-control nl-muted">
                                    우리 API
                                </h3>
                                <CountList
                                    rows={data.apiCalls}
                                    empty="기록 없음"
                                />
                            </div>
                            <div>
                                <h3 className="nl-dashboard__group nl-control nl-muted">
                                    외부 API
                                </h3>
                                <CountList
                                    rows={data.externalCalls}
                                    empty="기록 없음"
                                />
                            </div>
                            <p className="nl-metadata nl-muted">
                                요청 수 · {rangeLabel}
                            </p>
                        </section>
                    </div>
                </div>
            </AdminDashboardPendingRegion>
        </AdminDashboardPending>
    );
}
