import { MapPin, Plus } from "lucide-react";

import ArcadeSubmitButton from "@/components/admin/arcadeSubmitButton";
import {
    ARCADE_MACHINE_STATUSES,
    ARCADE_WEEKDAYS,
    normalizeArcadeBusinessHours,
} from "@/lib/arcadeDetails";
import { ARCADE_REGIONS, inferLegacyArcadeRegion } from "@/lib/arcadeRegions";
import db from "@/lib/db";

import { createArcade, updateArcade } from "./actions";

async function createArcadeFormAction(formData: FormData) {
    "use server";
    await createArcade(formData);
}

async function updateArcadeFormAction(formData: FormData) {
    "use server";
    await updateArcade(formData);
}

const inputClass =
    "border-border bg-bg text-input h-10 min-w-0 rounded-md border px-3 outline-none focus:border-focus";
const textareaClass =
    "border-border bg-bg text-body min-h-20 min-w-0 resize-y rounded-md border px-3 py-2 outline-none focus:border-focus";

function BusinessHoursFields({ value }: { value?: unknown }) {
    const businessHours = normalizeArcadeBusinessHours(value);

    return (
        <fieldset className="border-border rounded-card grid gap-2 border p-3">
            <legend className="text-label px-1">영업시간</legend>
            <p className="text-caption">
                자정을 넘겨 영업하면 종료 시간을 다음 날 시간으로 입력합니다.
            </p>
            {ARCADE_WEEKDAYS.map(({ key, label }) => {
                const schedule = businessHours?.weekly[key];
                return (
                    <div
                        key={key}
                        className="grid grid-cols-[auto_1fr_1fr] items-center gap-2"
                    >
                        <label className="text-label flex items-center gap-1.5">
                            <input
                                type="checkbox"
                                name={`hours_${key}_enabled`}
                                defaultChecked={Boolean(schedule)}
                            />
                            {label}
                        </label>
                        <input
                            type="time"
                            name={`hours_${key}_open`}
                            defaultValue={schedule?.open ?? "10:00"}
                            aria-label={`${label}요일 영업 시작`}
                            className={inputClass}
                        />
                        <input
                            type="time"
                            name={`hours_${key}_close`}
                            defaultValue={schedule?.close ?? "00:00"}
                            aria-label={`${label}요일 영업 종료`}
                            className={inputClass}
                        />
                    </div>
                );
            })}
            <label className="text-body-muted mt-1 flex items-center gap-2">
                <input
                    type="checkbox"
                    name="openEveryDay"
                    defaultChecked={businessHours?.openEveryDay ?? false}
                />
                연중무휴
            </label>
            {businessHours?.legacyNote ? (
                <p className="text-caption whitespace-pre-wrap">
                    기존 입력: {businessHours.legacyNote}
                </p>
            ) : null}
        </fieldset>
    );
}

export default async function AdminArcadesPage() {
    const kakaoMapAppKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? "";
    const arcades = await db.arcade.findMany({
        include: { _count: { select: { users: true } } },
        orderBy: [{ is_active: "desc" }, { name: "asc" }],
    });

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">오락실 관리</h1>
                <p className="text-caption mt-1">
                    프로필에서 선택할 수 있는 오락실을 관리합니다.
                </p>
            </section>

            <form
                action={createArcadeFormAction}
                className="bg-surface rounded-card grid gap-2 p-3"
            >
                <h2 className="text-section flex items-center gap-2">
                    <Plus className="size-4" /> 오락실 추가
                </h2>
                <input
                    name="name"
                    required
                    maxLength={80}
                    placeholder="오락실 이름"
                    className={inputClass}
                />
                <select
                    name="region"
                    required
                    defaultValue=""
                    className={inputClass}
                >
                    <option value="" disabled>
                        지역 선택
                    </option>
                    {ARCADE_REGIONS.map((region) => (
                        <option key={region} value={region}>
                            {region}
                        </option>
                    ))}
                </select>
                <input
                    name="address"
                    required
                    maxLength={160}
                    placeholder="주소"
                    className={inputClass}
                />
                <input type="hidden" name="latitude" />
                <input type="hidden" name="longitude" />
                <div className="grid grid-cols-2 gap-2">
                    <label className="text-caption flex min-w-0 flex-col gap-1">
                        기체 수
                        <input
                            type="number"
                            name="machineCount"
                            min={1}
                            max={20}
                            placeholder="예: 2"
                            className={inputClass}
                        />
                    </label>
                    <label className="text-caption flex min-w-0 flex-col gap-1">
                        플레이 요금 (원)
                        <input
                            type="number"
                            name="playPrice"
                            min={1}
                            max={100000}
                            placeholder="예: 500"
                            className={inputClass}
                        />
                    </label>
                </div>
                <label className="text-caption flex flex-col gap-1">
                    1회 플레이 코인 수
                    <input
                        type="number"
                        name="coinCount"
                        min={1}
                        max={100}
                        placeholder="예: 1"
                        className={inputClass}
                    />
                </label>
                <BusinessHoursFields />
                <label className="text-caption flex flex-col gap-1">
                    기체 상태
                    <select name="machineStatus" className={inputClass}>
                        {ARCADE_MACHINE_STATUSES.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </label>
                <input
                    name="statusNote"
                    maxLength={200}
                    placeholder="상태 사유 · 예: 일부 건반 반응이 약함"
                    className={inputClass}
                />
                <label className="text-caption flex flex-col gap-1">
                    비고
                    <textarea
                        name="notes"
                        maxLength={500}
                        placeholder="예: 이벤트 기체, 이어폰 단자 지원"
                        className={textareaClass}
                    />
                </label>
                <ArcadeSubmitButton appKey={kakaoMapAppKey} mode="create" />
            </form>

            <section className="flex flex-col gap-2">
                {arcades.map((arcade) => (
                    <form
                        key={arcade.id}
                        action={updateArcadeFormAction}
                        className="bg-surface rounded-card grid gap-2 p-3"
                    >
                        <input type="hidden" name="id" value={arcade.id} />
                        <div className="flex items-center gap-2">
                            <MapPin className="text-chart size-4 shrink-0" />
                            <input
                                name="name"
                                required
                                maxLength={80}
                                defaultValue={arcade.name}
                                className={`${inputClass} flex-1`}
                            />
                        </div>
                        <select
                            name="region"
                            required
                            defaultValue={inferLegacyArcadeRegion(
                                arcade.region,
                                arcade.address
                            )}
                            className={inputClass}
                        >
                            {ARCADE_REGIONS.map((region) => (
                                <option key={region} value={region}>
                                    {region}
                                </option>
                            ))}
                        </select>
                        <input
                            name="address"
                            required
                            maxLength={160}
                            defaultValue={arcade.address ?? ""}
                            placeholder="주소"
                            className={inputClass}
                        />
                        <input
                            type="hidden"
                            name="latitude"
                            defaultValue={arcade.latitude ?? ""}
                        />
                        <input
                            type="hidden"
                            name="longitude"
                            defaultValue={arcade.longitude ?? ""}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <label className="text-caption flex min-w-0 flex-col gap-1">
                                기체 수
                                <input
                                    type="number"
                                    name="machineCount"
                                    min={1}
                                    max={20}
                                    defaultValue={arcade.machine_count ?? ""}
                                    placeholder="예: 2"
                                    className={inputClass}
                                />
                            </label>
                            <label className="text-caption flex min-w-0 flex-col gap-1">
                                플레이 요금 (원)
                                <input
                                    type="number"
                                    name="playPrice"
                                    min={1}
                                    max={100000}
                                    defaultValue={arcade.play_price ?? ""}
                                    placeholder="예: 500"
                                    className={inputClass}
                                />
                            </label>
                        </div>
                        <label className="text-caption flex flex-col gap-1">
                            1회 플레이 코인 수
                            <input
                                type="number"
                                name="coinCount"
                                min={1}
                                max={100}
                                defaultValue={arcade.coin_count ?? ""}
                                placeholder="예: 1"
                                className={inputClass}
                            />
                        </label>
                        <BusinessHoursFields value={arcade.business_hours} />
                        <label className="text-caption flex flex-col gap-1">
                            기체 상태
                            <select
                                name="machineStatus"
                                defaultValue={arcade.machine_status}
                                className={inputClass}
                            >
                                {ARCADE_MACHINE_STATUSES.map((status) => (
                                    <option
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <input
                            name="statusNote"
                            maxLength={200}
                            defaultValue={arcade.status_note ?? ""}
                            placeholder="상태 사유 · 예: 일부 건반 반응이 약함"
                            className={inputClass}
                        />
                        <label className="text-caption flex flex-col gap-1">
                            비고
                            <textarea
                                name="notes"
                                maxLength={500}
                                defaultValue={arcade.notes ?? ""}
                                placeholder="예: 이벤트 기체, 이어폰 단자 지원"
                                className={textareaClass}
                            />
                        </label>
                        <div className="flex items-start justify-between gap-2">
                            <label className="text-body-muted flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    defaultChecked={arcade.is_active}
                                />
                                선택 목록에 표시
                            </label>
                            <span className="text-caption">
                                선택 {arcade._count.users}명
                            </span>
                        </div>
                        <ArcadeSubmitButton
                            appKey={kakaoMapAppKey}
                            mode="update"
                            originalAddress={arcade.address ?? undefined}
                        />
                    </form>
                ))}
                {arcades.length === 0 ? (
                    <p className="bg-surface text-body-muted rounded-card py-12 text-center">
                        등록된 오락실이 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
