import type { ChartNote, ChartTimingPoint } from "@/lib/chart-pattern/schema";
import {
    activeTimingPoint,
    beatTicksOf,
    sortTimingPoints,
} from "@/lib/chart-pattern/timing";
import type { Vid2bmapWarning } from "@/lib/chart-pattern/vid2bmapConvert";
import {
    beatLengthLabel,
    chartPositionLabel,
    type Vid2bmapMergeItem,
} from "@/lib/chart-pattern/vid2bmapMerge";
import type { Vid2bmapTempoChange } from "@/lib/chart-pattern/vid2bmapTempo";

export function formatFileSize(bytes: number) {
    return bytes >= 1024 * 1024
        ? `${(bytes / 1024 / 1024).toFixed(1)}MB`
        : `${Math.max(1, Math.round(bytes / 1024))}KB`;
}

function laneRange(note: ChartNote) {
    return note.width === 1
        ? `${note.lane}`
        : `${note.lane}~${note.lane + note.width - 1}`;
}

const TYPE_LABEL: Record<ChartNote["type"], string> = {
    standard: "일반",
    tenuto: "테누토",
    glissando: "글리산도",
    trill: "트릴",
};

export function beatTicksAt(tick: number, timingPoints: ChartTimingPoint[]) {
    return beatTicksOf(activeTimingPoint(sortTimingPoints(timingPoints), tick));
}

export function describeItem(
    item: Vid2bmapMergeItem,
    timingPoints: ChartTimingPoint[]
) {
    if (item.kind === "changed") {
        const [current] = item.current;
        const [incoming] = item.incoming;
        const beatTicks = beatTicksAt(item.tick, timingPoints);
        return item.fields
            .map((field) => {
                if (field === "lane" || field === "width") {
                    return `칸 ${laneRange(current)} → ${laneRange(incoming)}`;
                }
                if (field === "type") {
                    return `${TYPE_LABEL[current.type]} → ${TYPE_LABEL[incoming.type]}`;
                }
                if (field === "duration") {
                    return `길이 ${beatLengthLabel(current.durationTicks, beatTicks)} → ${beatLengthLabel(incoming.durationTicks, beatTicks)}`;
                }
                if (field === "pair") return "트릴 두 번째 위치";
                if (field === "path") return "글리산도 경로 · 가로대";
                if (field === "tick") {
                    return `→ ${chartPositionLabel(incoming.tick, timingPoints)}`;
                }
                return "손";
            })
            .filter((text, index, all) => all.indexOf(text) === index)
            .join(" · ");
    }
    const ranges = (notes: ChartNote[]) => notes.map(laneRange).join(", ");
    if (item.kind === "moved") {
        return `칸 ${ranges(item.current)} → ${ranges(item.incoming)}`;
    }
    if (item.kind === "onlyCurrent")
        return `내 초안에만 · 칸 ${ranges(item.current)}${item.blocksIncoming ? " · 가져올 노트와 겹침" : ""}`;
    return `가져온 것에만 · 칸 ${ranges(item.incoming)}`;
}

/** 정수가 아닌 BPM 을 고른 이유(2026-09-25 B′) — 정수로 두면 구간 끝에서 몇 프레임 어긋나는지 */
export function bpmPrecisionText(
    bpm: number,
    measuredBpm: number,
    integerDriftFrames: number
) {
    if (Number.isInteger(bpm)) return "";
    const unit = Number.isInteger(bpm * 2)
        ? "0.5 단위로"
        : Number.isInteger(Math.round(bpm * 100) / 10)
          ? "소수 첫째 자리로"
          : "소수 둘째 자리로";
    return ` · 정수 ${Math.round(measuredBpm)} 는 끝에서 ${integerDriftFrames.toFixed(1)}프레임 어긋나 ${unit}`;
}

/** 템포 제안 카드 제목(2026-09-25 B) — 한 번 바뀜 · 몇 박만 바뀌고 돌아옴 · 박마다 바뀜 */
export function tempoTitle(
    change: Vid2bmapTempoChange,
    timingPoints: ChartTimingPoint[]
) {
    const start = chartPositionLabel(change.tick, timingPoints);
    if (change.bpm !== change.fromBpm) {
        return `${start}부터 ${change.bpm < change.fromBpm ? "느려짐" : "빨라짐"}`;
    }
    if (change.points.length === 2) {
        return `${start} — ${change.beats}박 ${change.points[0].bpm < change.fromBpm ? "느려짐" : "빨라짐"}`;
    }
    const last = change.points[change.points.length - 1];
    return `${start} ~ ${chartPositionLabel(last.tick, timingPoints)} — 박마다 바뀜`;
}

export function tempoDetail(change: Vid2bmapTempoChange) {
    if (change.beatFrames.length === 0) {
        return `영상 박자선 ${change.beats}박으로 잰 BPM ${change.measuredBpm} — 지금 타이밍 ${change.fromBpm}${bpmPrecisionText(change.bpm, change.measuredBpm, change.integerDriftFrames)}`;
    }
    const after =
        change.bpm !== change.fromBpm
            ? ` — 뒤는 ${change.bpm}`
            : change.points.length === 2
              ? ` — 앞뒤는 ${change.fromBpm}`
              : "";
    return `영상 박 간격 ${change.beatFrames.join(" · ")}프레임${after}`;
}

export function warningText(
    warning: Vid2bmapWarning,
    timingPoints: ChartTimingPoint[]
) {
    switch (warning.kind) {
        case "barRepaired":
            return `AI 가 ${[warning.inserted > 0 ? `놓친 박자선 ${warning.inserted}곳을 메우고` : "", warning.removed > 0 ? `두 번 잡은 박자선 ${warning.removed}곳을 빼고` : ""].filter(Boolean).join(" ")} 넣어요(${warning.ticks
                .slice(0, 3)
                .map((tick) => chartPositionLabel(tick, timingPoints))
                .join(
                    " · "
                )}${warning.ticks.length > 3 ? " …" : ""}) — 그 근처 확인`;
        case "missingBar":
            return `${chartPositionLabel(warning.tick, timingPoints)} 근처 박자선을 놓쳤을 수 있어요 — 뒤 노트가 한 박 밀렸는지 확인`;
        case "extraBar":
            return `${chartPositionLabel(warning.tick, timingPoints)} 근처 박자선을 하나 더 잡았을 수 있어요 — 뒤 노트가 한 박 당겨졌는지 확인`;
        case "bpmMismatch":
            return `${chartPositionLabel(warning.tick, timingPoints)} ~ ${chartPositionLabel(warning.endTick, timingPoints)} 박자선 간격으로 본 BPM ${warning.estimatedBpm} ≠ 타이밍 ${warning.chartBpm} — 곡이 실제로 바뀌는지 타이밍 포인트 확인`;
        case "endCheck":
            return `마지막 박자선(${chartPositionLabel(warning.lastBarTick, timingPoints)}) 뒤 노트는 추출이 지웁니다 — 끝부분 확인`;
        case "glissandoJoined":
            return `글리산도 조각을 이어 ${warning.count}개로 만들었어요${warning.dropped > 0 ? `(이어지지 않은 조각 ${warning.dropped}개는 뺌)` : ""}${warning.rungNotes > 0 ? ` · 경로와 겹친 일반 노트 ${warning.rungNotes}개는 가로대를 두 번 읽은 것으로 보고 뺌` : ""} — 경로 확인 필요`;
        case "offGrid":
            return `${warning.count}개는 어느 격자에도 맞지 않아 영상 위치 그대로 넣었어요(${chartPositionLabel(warning.tick, timingPoints)}부터) — 넣은 뒤 「스냅 확인」 에서 확인`;
        case "localGrid":
            return `${warning.count}박은 곡 전체 격자와 맞지 않아 그 박만 ${warning.divisors.map((divisor) => `1/${divisor}`).join(" · ")}박 격자로 맞췄어요(${chartPositionLabel(warning.tick, timingPoints)}부터) — 확인 필요`;
        case "denseSnap":
            return `빠른 구간 노트 ${warning.count}개는 한 자리로 뭉치지 않게 더 촘촘한 격자로 맞췄어요(${chartPositionLabel(warning.tick, timingPoints)}부터)`;
        case "tenutoTrimmed":
            return `같은 건반의 다음 노트를 가로지르는 테누토 ${warning.ticks.length}개를 그 노트 한 칸 앞에서 끝냈어요(${positionList(warning.ticks, timingPoints)}) — 길이를 영상과 확인`;
        case "shortTenuto":
            return `아주 짧은 테누토 ${warning.count}개를 한 칸 길이로 늘렸어요`;
        case "trillSplit":
            return `트릴 ${warning.count}개는 가운데로 나눠 두 위치를 정했어요 — 확인 필요`;
        case "phantomDropped":
            return `손을 읽지 못해 영상에 없던 것으로 보이는 ${[
                warning.tenutoTicks.length > 0
                    ? `긴 테누토 ${warning.tenutoTicks.length}개(${positionList(warning.tenutoTicks, timingPoints)})`
                    : "",
                warning.headTicks.length > 0
                    ? `테누토 안 머리 ${warning.headTicks.length}개(${positionList(warning.headTicks, timingPoints)})`
                    : "",
            ]
                .filter(Boolean)
                .join(" · ")}를 뺐어요 — 영상과 확인`;
    }
}

/** 자리 목록 — 앞 3곳과 나머지 수 */
export function positionList(
    ticks: number[],
    timingPoints: ChartTimingPoint[]
) {
    const shown = ticks
        .slice(0, 3)
        .map((tick) => chartPositionLabel(tick, timingPoints))
        .join(" · ");
    return ticks.length > 3 ? `${shown} 외 ${ticks.length - 3}곳` : shown;
}
