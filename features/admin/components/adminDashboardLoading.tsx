import { SkeletonText } from "@/components/ui/skeleton";
import { DASHBOARD_RANGES } from "@/features/admin/dashboardParams";
import type {
    AdminDashboardData,
    DashboardRow,
} from "@/features/admin/server/adminDashboardService";
import { AdminDashboardTrendLoading } from "./adminDashboardMetric";

function CountListLoading({
    rows,
    keepLabels = false,
}: {
    rows: DashboardRow[];
    keepLabels?: boolean;
}) {
    if (!rows.length)
        return <SkeletonText className="nl-body-secondary" width="m" />;

    return (
        <ul className="nl-dashboard__list">
            {rows.map((row) => (
                <li key={row.key}>
                    <span className="nl-dashboard__name">
                        {keepLabels ? (
                            <span className="nl-body-secondary">
                                {row.label}
                            </span>
                        ) : (
                            <SkeletonText
                                className="nl-body-secondary"
                                width="l"
                            />
                        )}
                        {row.detail ? (
                            <SkeletonText className="nl-metadata" width="m" />
                        ) : null}
                    </span>
                    <SkeletonText className="nl-metric-value" sample="0,000" />
                </li>
            ))}
        </ul>
    );
}

function TodoLoading({ data }: { data: AdminDashboardData }) {
    const active = data.todo.filter((item) => item.count > 0);
    const clear = data.todo.filter((item) => item.count === 0);

    return (
        <section className="nl-dashboard__panel nl-dashboard__todo">
            <div className="nl-dashboard__panel-head">
                <h2 className="nl-component-title">처리할 일</h2>
                <SkeletonText className="nl-metric-value" sample="00" />
            </div>
            {active.length ? (
                <ul className="nl-dashboard__todo-list">
                    {active.map((item) => (
                        <li key={item.label}>
                            <span className="nl-dashboard__todo-item">
                                <span
                                    className="nl-dashboard__todo-dot"
                                    aria-hidden
                                />
                                <span className="nl-control">{item.label}</span>
                                <SkeletonText
                                    className="nl-metric-value"
                                    sample="00"
                                />
                            </span>
                        </li>
                    ))}
                </ul>
            ) : null}
            {clear.length ? (
                <p className="nl-dashboard__clear nl-body-secondary">
                    <span className="nl-icon-small nl-skeleton" />
                    <SkeletonText className="nl-body-secondary" width="l" />
                </p>
            ) : null}
        </section>
    );
}

function KpiLoading({ data }: { data: AdminDashboardData }) {
    return (
        <div className="nl-dashboard__kpi-group">
            <div className="nl-dashboard__kpis">
                {data.kpis.map((kpi) => (
                    <div key={kpi.metric} className="nl-dashboard__kpi">
                        <span className="nl-control nl-muted">{kpi.label}</span>
                        <SkeletonText
                            className="nl-metric-display"
                            sample="0,000"
                        />
                        <SkeletonText className="nl-body-secondary" width="m" />
                        <span className="nl-dashboard__kpi-tone nl-skeleton" />
                        {kpi.failed ? (
                            <SkeletonText className="nl-metadata" width="s" />
                        ) : null}
                    </div>
                ))}
            </div>
            <SkeletonText className="nl-metadata" width="l" />
        </div>
    );
}

function AudienceLoading({ data }: { data: AdminDashboardData }) {
    const rangeLabel = DASHBOARD_RANGES[data.range].label;
    const hasAudience =
        data.audience.member.pageviews + data.audience.guest.pageviews > 0;

    return (
        <section className="nl-dashboard__panel">
            <div className="nl-dashboard__panel-head">
                <h2 className="nl-component-title">가입자 · 손님</h2>
            </div>
            {hasAudience ? (
                <>
                    <div className="nl-dashboard__split nl-skeleton" />
                    <ul className="nl-dashboard__legend">
                        {["가입자", "손님"].map((label) => (
                            <li key={label}>
                                <span className="nl-dashboard__legend-dot nl-skeleton" />
                                <span className="nl-body-secondary">
                                    {label}
                                </span>
                                <SkeletonText
                                    className="nl-metric-value"
                                    sample="방문자 0,000"
                                />
                                <SkeletonText
                                    className="nl-metric-value"
                                    sample="페이지뷰 0,000"
                                />
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <SkeletonText className="nl-body-secondary" width="m" />
            )}
            <p className="nl-metadata nl-muted">
                로그인 여부만 셉니다 ·{" "}
                <SkeletonText className="nl-metadata" sample={rangeLabel} />
            </p>
        </section>
    );
}

function ListPanelLoading({
    title,
    rows,
    note,
    keepLabels = false,
}: {
    title: string;
    rows: DashboardRow[];
    note: string;
    keepLabels?: boolean;
}) {
    return (
        <section className="nl-dashboard__panel">
            <div className="nl-dashboard__panel-head">
                <h2 className="nl-component-title">{title}</h2>
            </div>
            <CountListLoading rows={rows} keepLabels={keepLabels} />
            <p className="nl-metadata nl-muted">{note}</p>
        </section>
    );
}

/** 대시보드 값 영역의 로딩 — 실제 패널·행·그래프 틀과 같은 클래스와 현재 행 수를 쓴다. */
export default function AdminDashboardLoading({
    data,
}: {
    data: AdminDashboardData;
}) {
    const rangeLabel = DASHBOARD_RANGES[data.range].label;
    const funnelRows = data.funnel.map((row) => ({
        key: row.label,
        label: row.label,
        detail: "",
        count: row.count,
    }));
    const contributionRows = data.contributions.map((row) => ({
        ...row,
        detail: "",
    }));

    return (
        <div className="nl-dashboard__grid">
            <TodoLoading data={data} />

            <div className="nl-dashboard__main">
                <KpiLoading data={data} />

                <AdminDashboardTrendLoading
                    initialMetric={data.metric}
                    hourly={Boolean(data.hourly)}
                />

                <AudienceLoading data={data} />

                <ListPanelLoading
                    title="전환 흐름"
                    rows={funnelRows}
                    keepLabels
                    note={`${rangeLabel}에 가입한 사람이 어디까지 갔는지`}
                />
                <ListPanelLoading
                    title="기여 활동"
                    rows={contributionRows}
                    keepLabels
                    note={`새로 쓰거나 고친 수 · ${rangeLabel}`}
                />
                <ListPanelLoading
                    title="자주 보는 페이지"
                    rows={data.topPages}
                    note={`페이지뷰 · ${rangeLabel}`}
                />
            </div>

            <section className="nl-dashboard__panel nl-dashboard__api">
                <div className="nl-dashboard__panel-head">
                    <h2 className="nl-component-title">API 호출</h2>
                </div>
                <div>
                    <h3 className="nl-dashboard__group nl-control nl-muted">
                        우리 API
                    </h3>
                    <CountListLoading rows={data.apiCalls} />
                </div>
                <div>
                    <h3 className="nl-dashboard__group nl-control nl-muted">
                        외부 API
                    </h3>
                    <CountListLoading rows={data.externalCalls} />
                </div>
                <p className="nl-metadata nl-muted">요청 수 · {rangeLabel}</p>
            </section>
        </div>
    );
}
