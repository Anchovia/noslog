import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { getCachedProfileData } from "@/app/(nevigation)/profile/[id]/data";
import { getProfileCountryCode } from "@/components/profile/dashboard/profileUtils";
import ProfileCardImage from "@/features/profile/components/profileCardImage";
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
async function getAvatar(avatar: string | null) {
    if (!avatar || avatar.startsWith("data:")) return avatar;
    try {
        const response = await fetch(avatar, { cache: "force-cache" });
        if (!response.ok) return null;
        const type = response.headers.get("content-type") || "image/png";
        return `data:${type};base64,${Buffer.from(await response.arrayBuffer()).toString("base64")}`;
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
    const requestedLocale = request.headers.get(LOCALE_REQUEST_HEADER);
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const mode =
        request.nextUrl.searchParams.get("mode") === "recital"
            ? "recital"
            : "basic";
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
            headers: {
                "Cache-Control": "no-store",
                "Content-Disposition": `inline; filename="noslog-profile-${id}-${mode}.png"`,
            },
        }
    );
}
