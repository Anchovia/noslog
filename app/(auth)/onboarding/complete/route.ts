import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { getAuthReturnPath } from "@/lib/authReturnPath";
import { localizePath } from "@/lib/i18n/routing";

// 완료 상태를 세션에 반영한 뒤 검증된 원래 목적지로 이동함
export async function GET(request: NextRequest) {
    const session = await getSession();
    const locale = session.locale ?? "ko";
    if (!session.id) {
        return NextResponse.redirect(
            new URL(localizePath("/login", locale), request.url)
        );
    }

    const user = await db.user.findUnique({
        where: { id: session.id },
        select: { profile_completed_at: true },
    });
    if (!user) {
        session.destroy();
        return NextResponse.redirect(
            new URL(
                `${localizePath("/login", locale)}?error=session_expired`,
                request.url
            )
        );
    }
    if (!user.profile_completed_at) {
        return NextResponse.redirect(
            new URL(localizePath("/onboarding", locale), request.url)
        );
    }

    session.profileCompleted = true;
    const returnTo = getAuthReturnPath(
        session.onboardingReturnTo,
        session.locale ?? "ko"
    );
    delete session.onboardingReturnTo;
    await session.save();
    return NextResponse.redirect(new URL(returnTo, request.url));
}
