import { getTierBandForUser } from "@/app/(nevigation)/tiers/data";
import { getUser } from "@/lib/user";
import {
    isTierDifficulty,
    isTierLevelFilter,
    type TierDifficulty,
} from "@/lib/tiers";
import { NextResponse } from "next/server";

interface TierBandRouteProps {
    params: Promise<{ slug: string; bandId: string }>;
}

export async function GET(request: Request, { params }: TierBandRouteProps) {
    const { slug, bandId: requestedBandId } = await params;
    const bandId = Number(requestedBandId);
    if (!Number.isSafeInteger(bandId) || bandId <= 0) {
        return NextResponse.json(
            { message: "올바르지 않은 서열 구간입니다." },
            { status: 400 }
        );
    }

    const searchParams = new URL(request.url).searchParams;
    const difficulties = (searchParams.get("difficulty") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(isTierDifficulty) as TierDifficulty[];
    const levels = (searchParams.get("level") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(isTierLevelFilter);
    const user = await getUser();
    const band = await getTierBandForUser(
        slug,
        bandId,
        user?.id,
        difficulties,
        levels
    );
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
