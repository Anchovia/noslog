import { getTierBandForUser } from "@/app/(nevigation)/tiers/data";
import { getUser } from "@/lib/user";
import { NextResponse } from "next/server";

interface TierBandRouteProps {
    params: Promise<{ slug: string; bandId: string }>;
}

export async function GET(_request: Request, { params }: TierBandRouteProps) {
    const { slug, bandId: requestedBandId } = await params;
    const bandId = Number(requestedBandId);
    if (!Number.isSafeInteger(bandId) || bandId <= 0) {
        return NextResponse.json(
            { message: "올바르지 않은 서열 구간입니다." },
            { status: 400 }
        );
    }

    const user = await getUser();
    const band = await getTierBandForUser(slug, bandId, user?.id);
    if (!band) {
        return NextResponse.json(
            { message: "서열 구간을 찾을 수 없습니다." },
            { status: 404 }
        );
    }

    return NextResponse.json(
        { band },
        { headers: { "Cache-Control": "private, no-store" } }
    );
}
