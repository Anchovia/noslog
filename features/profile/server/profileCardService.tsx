import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { getCachedProfileData } from "@/app/(nevigation)/profile/[id]/data";
import { getProfileCountryCode } from "@/components/profile/dashboard/profileUtils";
import ProfileCardImage from "@/features/profile/components/profileCardImage";
import { toCardAvatar } from "@/features/profile/server/profileCardAvatar";
import getSession from "@/lib/session";
import {
    isLocale,
    localizePath,
    LOCALE_REQUEST_HEADER,
} from "@/lib/i18n/routing";

let fonts:
    | Promise<
          {
              name: string;
              data: ArrayBuffer;
              weight: 400 | 700;
              style: "normal";
          }[]
      >
    | undefined;
function getFonts() {
    fonts ??= Promise.all(
        (
            [
                { file: "Regular", weight: 400 },
                { file: "Bold", weight: 700 },
            ] as const
        ).map(async ({ file, weight }) => {
            const buffer = await readFile(
                path.join(
                    process.cwd(),
                    "assets/fonts/pretendard-jp/1.3.9",
                    `PretendardJP-${file}.ttf`
                )
            );
            return {
                name: "Pretendard JP",
                data: buffer.buffer.slice(
                    buffer.byteOffset,
                    buffer.byteOffset + buffer.byteLength
                ) as ArrayBuffer,
                weight,
                style: "normal" as const,
            };
        })
    ).catch((error) => {
        fonts = undefined;
        throw error;
    });
    return fonts;
}
const flags = new Map<string, Promise<string | null>>();
function getFlag(country: string) {
    const file =
        country === "KR" ? "kr.png" : country === "JP" ? "jp.png" : null;
    if (!file) return Promise.resolve(null);
    if (!flags.has(file))
        flags.set(
            file,
            readFile(path.join(process.cwd(), "public/flags", file))
                .then(
                    (bytes) =>
                        `data:image/png;base64,${bytes.toString("base64")}`
                )
                .catch(() => null)
        );
    return flags.get(file)!;
}
// 사진은 형식과 상관없이 PNG 로 바꿔서 넣는다 — 엔진이 webp 를 못 읽어 카드가 통째로 실패했다(2026-09-30)
async function getAvatar(avatar: string | null) {
    if (!avatar) return null;
    try {
        const response = await fetch(avatar, { cache: "force-cache" });
        if (!response.ok) return null;
        return toCardAvatar(new Uint8Array(await response.arrayBuffer()));
    } catch {
        return null;
    }
}

export async function createProfileCardResponse(
    request: NextRequest,
    rawId: string
) {
    const id = Number(rawId);
    if (!Number.isInteger(id) || id < 1)
        return new Response("Not found", { status: 404 });
    const session = await getSession();
    if (session.id !== id) return new Response("Forbidden", { status: 403 });
    const profile = await getCachedProfileData(id);
    if (!profile) return new Response("Not found", { status: 404 });
    const mode =
        request.nextUrl.searchParams.get("mode") === "recital"
            ? "recital"
            : "basic";
    return renderProfileCard(request, id, profile, mode, {
        "Cache-Control": "no-store",
        "Content-Disposition": `inline; filename="noslog-profile-${id}-${mode}.png"`,
    });
}

/**
 * 공유 이미지(og:image, 2026-10-01 메타데이터 점검 A2) — 누구나 받는 Basic 카드.
 * 점수 비공개 프로필은 404 — 메타데이터는 사이트 기본 이미지를 건다(기능 규칙: 비공개 값은 생성 이미지로도 내보내지 않는다)
 */
export async function createProfileShareImageResponse(
    request: NextRequest,
    rawId: string
) {
    const id = Number(rawId);
    if (!Number.isInteger(id) || id < 1)
        return new Response("Not found", { status: 404 });
    const profile = await getCachedProfileData(id);
    if (!profile || profile.user.hide_play_scores)
        return new Response("Not found", { status: 404 });
    return renderProfileCard(request, id, profile, "basic", {
        "Cache-Control":
            "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    });
}

async function renderProfileCard(
    request: NextRequest,
    id: number,
    profile: NonNullable<Awaited<ReturnType<typeof getCachedProfileData>>>,
    mode: "basic" | "recital",
    headers: Record<string, string>
) {
    const requestedLocale = request.headers.get(LOCALE_REQUEST_HEADER);
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const [fontData, avatar, flag] = await Promise.all([
        getFonts(),
        getAvatar(profile.user.avatar),
        getFlag(getProfileCountryCode(profile.user.country)),
    ]);
    return new ImageResponse(
        <ProfileCardImage
            user={profile.user}
            mode={mode}
            locale={locale}
            avatar={avatar}
            flag={flag}
            profileUrl={`${request.nextUrl.origin}${localizePath(`/profile/${id}`, locale)}`}
        />,
        {
            width: 1200,
            height: 630,
            fonts: fontData,
            headers,
        }
    );
}
