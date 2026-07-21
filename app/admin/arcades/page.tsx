import { MapPin, Plus, Save } from "lucide-react";

import db from "@/lib/db";

import { createArcade, updateArcade } from "./actions";

const inputClass =
    "border-border bg-bg text-input h-10 min-w-0 rounded-md border px-3 outline-none focus:border-focus";

export default async function AdminArcadesPage() {
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
                action={createArcade}
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
                <div className="grid grid-cols-2 gap-2">
                    <input
                        name="region"
                        maxLength={40}
                        placeholder="지역"
                        className={inputClass}
                    />
                    <input
                        name="address"
                        maxLength={160}
                        placeholder="주소"
                        className={inputClass}
                    />
                </div>
                <button className="bg-text-primary text-bg h-10 cursor-pointer rounded-md text-sm font-bold">
                    추가
                </button>
            </form>

            <section className="flex flex-col gap-2">
                {arcades.map((arcade) => (
                    <form
                        key={arcade.id}
                        action={updateArcade}
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
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                name="region"
                                maxLength={40}
                                defaultValue={arcade.region ?? ""}
                                placeholder="지역"
                                className={inputClass}
                            />
                            <input
                                name="address"
                                maxLength={160}
                                defaultValue={arcade.address ?? ""}
                                placeholder="주소"
                                className={inputClass}
                            />
                        </div>
                        <div className="flex items-center justify-between">
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
                            <button className="border-border hover:bg-surface-muted flex h-9 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-sm font-bold transition-colors">
                                <Save className="size-4" /> 저장
                            </button>
                        </div>
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
