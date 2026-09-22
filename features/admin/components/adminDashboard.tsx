import {
    ArrowDownRight,
    ArrowUpRight,
    ChevronRight,
    CircleCheck,
} from "lucide-react";
import Link from "next/link";

import {
    AdminDashboardMetricLink,
    AdminDashboardRangeLink,
    AdminDashboardTrend,
} from "@/features/admin/components/adminDashboardMetric";
import AdminDashboardLoading from "@/features/admin/components/adminDashboardLoading";
import {
    AdminDashboardLinkStatus,
    AdminDashboardPending,
    AdminDashboardPendingRegion,
} from "@/features/admin/components/adminDashboardPending";
import {
    DASHBOARD_RANGES,
    type DashboardRange,
} from "@/features/admin/dashboardParams";
import type {
    AdminDashboardData,
    DashboardRow,
} from "@/features/admin/server/adminDashboardService";

const DAY_MS = 24 * 60 * 60 * 1000;

function shortDate(key: string) {
    return `${Number(key.slice(5, 7))}/${Number(key.slice(8, 10))}`;
}

function shiftKey(key: string, days: number) {
    return new Date(Date.parse(`${key}T00:00:00Z`) + days * DAY_MS)
        .toISOString()
        .slice(0, 10);
}

// 앞 같은 길이 기간 대비 증감 — 화살표 모양과 「증가·감소」 글자가 함께 말한다(색만으로 말하지 않는다).
// 비교 기간은 카드마다 반복하지 않고 카드 묶음 아래 한 줄로 적는다(좁은 카드에서 줄바꿈 방지)
function Delta({ value, previous }: { value: number; previous: number }) {
    if (value === previous)
        return <span className="nl-body-secondary nl-muted">변화 없음</span>;
    const up = value > previous;
    const Icon = up ? ArrowUpRight : ArrowDownRight;
    const amount =
        previous === 0
            ? `+${value.toLocaleString("ko-KR")}`
            : `${Math.abs(Math.round(((value - previous) / previous) * 100))}% ${up ? "증가" : "감소"}`;
    return (
        <span className="nl-dashboard__delta nl-body-secondary">
            <Icon
                className="nl-icon-small"
                data-trend={up ? "up" : "down"}
                aria-hidden
            />
            <span className="nl-muted">{amount}</span>
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

/**
 * 관리자 대시보드 — C안(2026-09-13 사용자 결정). 넓은 화면은 본문 8(숫자·그래프·자주 보는 페이지) : 레일 4(처리할 일·API),
 * 좁은 화면은 처리할 일 → 지표 → API 순서로 쌓는다. 기간·그래프 지표는 주소(?range=·?metric=)로 바꾼다
 */
export default function AdminDashboard({ data }: { data: AdminDashboardData }) {
    const rangeLabel = DASHBOARD_RANGES[data.range].label;
    const period =
        data.days === 1
            ? `오늘 ${shortDate(data.to)}`
            : `최근 ${data.days}일 · ${shortDate(data.from)}–${shortDate(data.to)}`;
    const previousFrom = shiftKey(data.from, -data.days);
    const previousTo = shiftKey(data.from, -1);
    const comparison =
        data.days === 1
            ? `증감은 어제(${shortDate(previousTo)}) 대비`
            : `증감은 지난 ${data.days}일(${shortDate(previousFrom)}–${shortDate(previousTo)}) 대비`;
    const active = data.todo.filter((item) => item.count > 0);
    const clear = data.todo.filter((item) => item.count === 0);
    const todoTotal = active.reduce((total, item) => total + item.count, 0);

    return (
        <AdminDashboardPending>
            <div className="nl-dashboard">
                <header className="nl-dashboard__head">
                    <div>
                        <h1 className="nl-page-title">대시보드</h1>
                        <p className="nl-body-secondary nl-muted">
                            {period} · 서울 기준
                        </p>
                    </div>
                    <nav
                        className="nl-segments nl-dashboard__ranges"
                        aria-label="기간"
                    >
                        {(
                            Object.keys(DASHBOARD_RANGES) as DashboardRange[]
                        ).map((key) => (
                            <AdminDashboardRangeLink
                                key={key}
                                range={key}
                                currentRange={data.range}
                                initialMetric={data.metric}
                            >
                                {DASHBOARD_RANGES[key].label}
                                <AdminDashboardLinkStatus
                                    statusKey={`range-${key}`}
                                />
                            </AdminDashboardRangeLink>
                        ))}
                    </nav>
                </header>

                <AdminDashboardPendingRegion
                    loading={<AdminDashboardLoading data={data} />}
                >
                    <div className="nl-dashboard__grid">
                        <section
                            className="nl-dashboard__panel nl-dashboard__todo"
                            aria-labelledby="dashboard-todo"
                        >
                            <div className="nl-dashboard__panel-head">
                                <h2
                                    id="dashboard-todo"
                                    className="nl-component-title"
                                >
                                    처리할 일
                                </h2>
                                <span className="nl-metric-value nl-muted">
                                    {todoTotal}
                                </span>
                            </div>
                            {active.length ? (
                                <ul className="nl-dashboard__todo-list">
                                    {active.map((item) => (
                                        <li key={item.label}>
                                            <Link
                                                href={item.href}
                                                className="nl-dashboard__todo-item"
                                            >
                                                <span
                                                    className="nl-dashboard__todo-dot"
                                                    aria-hidden
                                                />
                                                <span className="nl-control">
                                                    {item.label}
                                                </span>
                                                <span className="nl-metric-value">
                                                    {item.count}
                                                </span>
                                                <ChevronRight
                                                    className="nl-icon-small"
                                                    aria-hidden
                                                />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                            {clear.length ? (
                                <p className="nl-dashboard__clear nl-body-secondary nl-muted">
                                    <CircleCheck
                                        className="nl-icon-small"
                                        aria-hidden
                                    />
                                    <span>
                                        {active.length
                                            ? `나머지 없음 — ${clear.map((item) => item.label).join(" · ")}`
                                            : "처리할 일이 없습니다."}
                                    </span>
                                </p>
                            ) : null}
                        </section>

                        <div className="nl-dashboard__main">
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
                                                {kpi.value.toLocaleString(
                                                    "ko-KR"
                                                )}
                                            </span>
                                            <Delta
                                                value={kpi.value}
                                                previous={kpi.previous}
                                            />
                                            <span
                                                className="nl-dashboard__kpi-tone"
                                                data-metric={kpi.metric}
                                                aria-hidden
                                            />
                                            {kpi.failed ? (
                                                <span className="nl-metadata nl-muted">
                                                    실패 {kpi.failed}
                                                </span>
                                            ) : null}
                                        </AdminDashboardMetricLink>
                                    ))}
                                </div>
                                <p className="nl-metadata nl-muted">
                                    {comparison}
                                </p>
                            </div>

                            <AdminDashboardTrend
                                range={data.range}
                                initialMetric={data.metric}
                                hourly={data.hourly}
                                series={data.series}
                            />

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
                                    {rangeLabel}에 가입한 사람이 어디까지 갔는지
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
                                <CountList
                                    rows={data.contributions.map((row) => ({
                                        ...row,
                                        detail: "",
                                    }))}
                                    empty="기록 없음"
                                />
                                <p className="nl-metadata nl-muted">
                                    새로 쓰거나 고친 수 · {rangeLabel}
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
                        </div>

                        <section
                            className="nl-dashboard__panel nl-dashboard__api"
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
                </AdminDashboardPendingRegion>
            </div>
        </AdminDashboardPending>
    );
}
