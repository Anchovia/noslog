import ProfileGradeChart, { type GradeHistoryPoint } from "../chart";
import type { ProfileMode } from "./profileTypes";

// 프로필 그레이드 변화 차트를 한곳에서 표시함
export default function ProfileGradeTrend({
    data,
    mode,
}: {
    data: GradeHistoryPoint[];
    mode: ProfileMode;
}) {
    return (
        <section className="bg-surface rounded-card p-4">
            <div className="mb-2">
                <h2 className="text-section font-bold">그레이드 추이</h2>
            </div>
            <ProfileGradeChart data={data} mode={mode} />
            {data.length > 1 ? (
                <div className="text-text-disabled flex justify-between text-[10px]">
                    <span>{data[0].besttime.replaceAll("-", ".")}</span>
                    <span>{data.at(-1)?.besttime.replaceAll("-", ".")}</span>
                </div>
            ) : null}
        </section>
    );
}
