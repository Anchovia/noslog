import GamecenterExplorer from "@/components/gamecenter/gamecenterExplorer";
import { getGamecenterArcades } from "@/lib/arcades";
import { clientEnv } from "@/lib/env/client";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata/site";
import { getUser } from "@/lib/user";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();

    return createPageMetadata({
        title: t("arcades.title"),
        path: localizePath("/gamecenter", locale),
    });
}

export default async function GamecenterPage() {
    const [user, arcades] = await Promise.all([
        getUser(),
        getGamecenterArcades(),
    ]);

    return (
        <div className="flex flex-col gap-4 py-5">
            <GamecenterExplorer
                appKey={clientEnv.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? ""}
                arcades={arcades.map((arcade) => ({
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
                    preferredCount: arcade._count.users,
                }))}
                isAuthenticated={Boolean(user)}
                initialPreferredArcadeId={user?.preferred_arcade_id ?? null}
            />
        </div>
    );
}
