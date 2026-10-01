import type { NextRequest } from "next/server";
import { createProfileShareImageResponse } from "@/features/profile/server/profileCardService";

export const dynamic = "force-dynamic";

// 프로필 공유 이미지(og:image) — 공개 프로필의 Basic 카드, 점수 비공개면 404(2026-10-01 메타데이터 점검 A2)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return createProfileShareImageResponse(request, (await params).id);
}
