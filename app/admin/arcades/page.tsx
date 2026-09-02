import ArcadeForm from "@/features/arcades/components/arcadeForm";
import db from "@/lib/db";
import { clientEnv } from "@/lib/env/client";

export default async function AdminArcadesPage() {
    const kakaoMapAppKey = clientEnv.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? "";
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

            <ArcadeForm mode="create" appKey={kakaoMapAppKey} />

            <section className="flex flex-col gap-2">
                {arcades.map((arcade) => (
                    <ArcadeForm
                        key={arcade.id}
                        mode="update"
                        appKey={kakaoMapAppKey}
                        arcade={{
                            id: arcade.id,
                            name: arcade.name,
                            region: arcade.region,
                            address: arcade.address,
                            latitude: arcade.latitude,
                            longitude: arcade.longitude,
                            machineCount: arcade.machine_count,
                            playPrice: arcade.play_price,
                            coinCount: arcade.coin_count,
                            businessHours: arcade.business_hours,
                            machineStatus: arcade.machine_status,
                            statusNote: arcade.status_note,
                            notes: arcade.notes,
                            isActive: arcade.is_active,
                            userCount: arcade._count.users,
                        }}
                    />
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
