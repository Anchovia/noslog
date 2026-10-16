import { listAdminArcades } from "@/features/arcades/server/arcade-admin-data";
import ArcadeForm from "@/features/arcades/components/arcade-form";
import { clientEnv } from "@/lib/env/client";

export default async function AdminArcadesPage() {
    const kakaoMapAppKey = clientEnv.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? "";
    const arcades = await listAdminArcades();

    return (
        <div className="flex flex-col gap-nl-16 py-nl-24">
            <section>
                <h1 className="nl-section-title text-nl-content">
                    오락실 관리
                </h1>
                <p className="nl-metadata mt-nl-4 text-nl-subdued">
                    프로필에서 선택할 수 있는 오락실을 관리합니다.
                </p>
            </section>

            <ArcadeForm mode="create" appKey={kakaoMapAppKey} />

            <section className="flex flex-col gap-nl-8">
                {arcades.map((arcade) => (
                    <ArcadeForm
                        key={arcade.id}
                        mode="update"
                        appKey={kakaoMapAppKey}
                        arcade={{
                            id: arcade.id,
                            name: arcade.name,
                            // 지역 · 주소는 공개 정보가 정본(2026-10-16 D6)
                            region:
                                arcade.publicDetails?.administrativeArea ??
                                null,
                            address:
                                arcade.publicDetails?.addressLines.join("\n") ||
                                null,
                            latitude: arcade.latitude,
                            longitude: arcade.longitude,
                            playPrice: arcade.playPrice,
                            coinCount: arcade.coinCount,
                            businessHours: arcade.businessHours,
                            hours: arcade.publicDetails?.hours ?? null,
                            phone: arcade.publicDetails?.phone ?? null,
                            website: arcade.publicDetails?.website ?? null,
                            creditLabel:
                                arcade.publicDetails?.creditLabel ?? null,
                            facilities: arcade.publicDetails?.facilities ?? [],
                            photos: arcade.publicPhotos,
                            cabinets: arcade.cabinets.map((cabinet) => ({
                                ...cabinet,
                                verifiedAt:
                                    cabinet.verifiedAt?.toISOString() ?? null,
                            })),
                            notes: arcade.notes,
                            isActive: arcade.isActive,
                            userCount: arcade._count.users,
                        }}
                    />
                ))}
                {arcades.length === 0 ? (
                    <p className="nl-body-secondary rounded-nl-container bg-nl-surface py-nl-48 text-center text-nl-subdued">
                        등록된 오락실이 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
