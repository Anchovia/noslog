import type { NextRequest } from "next/server";
import { createProfileCardResponse } from "@/features/profile/server/profileCardService";

export const dynamic = "force-dynamic";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return createProfileCardResponse(request, (await params).id);
}
