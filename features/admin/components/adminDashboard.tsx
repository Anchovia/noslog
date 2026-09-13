import {
    ArrowDownRight,
    ArrowUpRight,
    ChevronRight,
    CircleCheck,
} from "lucide-react";
import Link from "next/link";

import AdminDashboardChart from "@/features/admin/components/adminDashboardChart";
import {
    DASHBOARD_METRICS,
    DASHBOARD_RANGES,
    type AdminDashboardData,
    type DashboardMetric,
    type DashboardRange,
    type DashboardRow,
} from "@/features/admin/server/adminDashboardService";

const DAY_MS = 24 * 60 * 60 * 1000;

function dashboardHref(range: DashboardRange, metric: DashboardMetric) {
    return `/admin?range=${range}&metric=${metric}`;
}

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
                        className="nl-dashboard__bar"
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
    const metricLabel = DASHBOARD_METRICS[data.metric];

    return (
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
                    {(Object.keys(DASHBOARD_RANGES) as DashboardRange[]).map(
                        (key) => (
                            <Link
                                key={key}
                                href={dashboardHref(key, data.metric)}
                                className="nl-segments__item nl-control"
                                aria-current={
                                    key === data.range ? "true" : undefined
                                }
                            >
                                {DASHBOARD_RANGES[key].label}
                            </Link>
                        )
                    )}
                </nav>
            </header>

            <div className="nl-dashboard__grid">
                <section
                    className="nl-dashboard__panel nl-dashboard__todo"
                    aria-labelledby="dashboard-todo"
                >
                    <div className="nl-dashboard__panel-head">
                        <h2 id="dashboard-todo" className="nl-component-title">
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
                                <Link
                                    key={kpi.metric}
                                    href={dashboardHref(data.range, kpi.metric)}
                                    className="nl-dashboard__kpi"
                                    aria-current={
                                        kpi.metric === data.metric
                                            ? "true"
                                            : undefined
                                    }
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
                                    />
                                    {kpi.failed ? (
                                        <span className="nl-metadata nl-muted">
                                            실패 {kpi.failed}
                                        </span>
                                    ) : null}
                                </Link>
                            ))}
                        </div>
                        <p className="nl-metadata nl-muted">{comparison}</p>
                    </div>

                    <section
                        className="nl-dashboard__panel"
                        aria-labelledby="dashboard-trend"
                    >
                        <div className="nl-dashboard__panel-head">
                            <h2
                                id="dashboard-trend"
                                className="nl-component-title"
                            >
                                {metricLabel}
                            </h2>
                        </div>
                        {data.days === 1 ? (
                            <p className="nl-body-secondary nl-muted">
                                날짜별 그래프는 7일 이상에서 보입니다.
                            </p>
                        ) : (
                            <AdminDashboardChart
                                data={data.series}
                                label={metricLabel}
                            />
                        )}
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
                        <h2 id="dashboard-api" className="nl-component-title">
                            API 호출
                        </h2>
                    </div>
                    <div>
                        <h3 className="nl-dashboard__group nl-control nl-muted">
                            우리 API
                        </h3>
                        <CountList rows={data.apiCalls} empty="기록 없음" />
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
    );
}
