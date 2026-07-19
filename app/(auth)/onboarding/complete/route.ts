import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/db";
import getSession from "@/lib/session";

// 완료된 프로필 상태를 세션 쿠키에 반영한 뒤 홈으로 이동함
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session.id) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const user = await db.user.findUnique({
        where: { id: session.id },
        select: { profile_completed_at: true },
    });
    if (!user?.profile_completed_at) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    session.profileCompleted = true;
    await session.save();
    return NextResponse.redirect(new URL("/", request.url));
}
