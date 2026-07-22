import GamecenterExplorer from "@/components/gamecenter/gamecenterExplorer";
import { getGamecenterArcades } from "@/lib/arcades";
import { createPageMetadata } from "@/lib/metadata/site";
import { getUser } from "@/lib/user";

export const metadata = createPageMetadata({
    title: "NOSTALGIA 오락실",
    description:
        "NOSTALGIA 기기가 설치된 오락실의 위치와 선호 이용자 수를 확인합니다.",
    path: "/gamecenter",
});

export default async function GamecenterPage() {
    const [user, arcades] = await Promise.all([
        getUser(),
        getGamecenterArcades(),
    ]);

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">NOSTALGIA 오락실</h1>
            </section>

            <GamecenterExplorer
                appKey={process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? ""}
                arcades={arcades.map((arcade) => ({
                    id: arcade.id,
                    name: arcade.name,
                    region: arcade.region,
                    address: arcade.address,
                    latitude: arcade.latitude,
                    longitude: arcade.longitude,
                    machineCount: arcade.machine_count,
                    priceInfo: arcade.price_info,
                    businessHours: arcade.business_hours,
                    machineStatus: arcade.machine_status,
                    statusNote: arcade.status_note,
                    notes: arcade.notes,
                    preferredCount: arcade._count.users,
                }))}
                isAuthenticated={Boolean(user)}
                initialPreferredArcadeId={user?.preferred_arcade_id ?? null}
            />
        </div>
    );
}
