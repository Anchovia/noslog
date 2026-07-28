import getSession from "@/lib/session";
import { NextResponse } from "next/server";
import {
    loadMusicDetail,
    normalizeMusicDetailTab,
    normalizeMusicDifficulty,
} from "@/app/(nevigation)/music/[index]/[difficulty]/loadMusicDetail";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMusicTitleDisplayPreference } from "@/lib/i18n/musicTitle";
import { isLocale } from "@/lib/i18n/routing";

export async function GET(request: Request) {
    const params = new URL(request.url).searchParams;
    const index = params.get("index") ?? "";
    const difficulty = normalizeMusicDifficulty(params.get("difficulty") ?? "");
    const tab = normalizeMusicDetailTab(params.get("tab") ?? undefined);
    const requestedPage = Number.parseInt(params.get("page") ?? "1", 10);
    const page =
        Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

    if (!index || !difficulty) {
        return NextResponse.json(
            { message: "잘못된 요청입니다." },
            { status: 400 }
        );
    }

    const [session, requestLocale] = await Promise.all([
        getSession(),
        getRequestLocale(),
    ]);
    const localeParam = params.get("locale");
    const locale = isLocale(localeParam) ? localeParam : requestLocale;
    const showLocalizedTitle = await getMusicTitleDisplayPreference(session.id);
    const data = await loadMusicDetail(
        index,
        difficulty,
        tab,
        page,
        session.id,
        locale,
        showLocalizedTitle
    );
    if (!data) {
        return NextResponse.json(
            { message: "악곡 정보를 찾을 수 없습니다." },
            { status: 404 }
        );
    }

    return NextResponse.json(data, {
        headers: { "Cache-Control": "private, no-store" },
    });
}
