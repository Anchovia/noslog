import ArcadeAdminList from "@/features/arcades/components/arcade-admin-list";
import { listAdminArcades } from "@/features/arcades/server/arcade-admin-data";
import { requireAdmin } from "@/lib/admin";
import { parseAdminPage } from "@/lib/admin/page";
import { clientEnv } from "@/lib/env/client";

export default async function AdminArcadesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    await requireAdmin();
    const kakaoMapAppKey = clientEnv.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? "";
    const page = parseAdminPage((await searchParams).page);
    const { arcades, total } = await listAdminArcades(page);

    return (
        <ArcadeAdminList
            appKey={kakaoMapAppKey}
            page={page}
            total={total}
            arcades={arcades.map((arcade) => ({
                id: arcade.id,
                name: arcade.name,
                // 지역 · 주소는 공개 정보가 정본(2026-10-16 D6)
                region: arcade.publicDetails?.administrativeArea ?? null,
                address: arcade.publicDetails?.addressLines.join("\n") || null,
                latitude: arcade.latitude,
                longitude: arcade.longitude,
                playPrice: arcade.playPrice,
                coinCount: arcade.coinCount,
                businessHours: arcade.businessHours,
                hours: arcade.publicDetails?.hours ?? null,
                phone: arcade.publicDetails?.phone ?? null,
                website: arcade.publicDetails?.website ?? null,
                creditLabel: arcade.publicDetails?.creditLabel ?? null,
                facilities: arcade.publicDetails?.facilities ?? [],
                photos: arcade.publicPhotos,
                cabinets: arcade.cabinets.map((cabinet) => ({
                    ...cabinet,
                    verifiedAt: cabinet.verifiedAt?.toISOString() ?? null,
                })),
                notes: arcade.notes,
                isActive: arcade.isActive,
                userCount: arcade._count.users,
            }))}
        />
    );
}
