import { createElement } from "react";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { toCardAvatar } from "@/features/profile/server/profile-card-avatar";

const PNG_SIGNATURE = "89504e470d0a1a0a";

async function sample(format: "webp" | "png" | "jpeg" | "gif") {
    const image = sharp({
        create: {
            width: 300,
            height: 200,
            channels: 3,
            background: { r: 200, g: 120, b: 60 },
        },
    });
    return new Uint8Array(await image[format]().toBuffer());
}

async function render(avatar: string) {
    const response = new ImageResponse(
        createElement(
            "div",
            { style: { display: "flex", width: 200, height: 200 } },
            createElement("img", {
                src: avatar,
                width: 122,
                height: 122,
                style: { width: 122, height: 122, objectFit: "cover" },
            })
        ),
        { width: 200, height: 200 }
    );
    return Buffer.from(await response.arrayBuffer());
}

describe("프로필 카드 사진(2026-09-30 — 직접 올린 webp 사진이면 카드가 만들어지지 않던 문제)", () => {
    it.each(["webp", "png", "jpeg", "gif"] as const)(
        "%s 사진을 카드 엔진이 읽는 244 정사각 PNG 로 바꾼다",
        async (format) => {
            const avatar = await toCardAvatar(await sample(format));
            expect(avatar).toMatch(/^data:image\/png;base64,/);
            const meta = await sharp(
                Buffer.from(avatar!.split(",")[1], "base64")
            ).metadata();
            expect([meta.format, meta.width, meta.height]).toEqual([
                "png",
                244,
                244,
            ]);
        }
    );

    it("바꾼 사진은 카드 엔진에서 PNG 로 그려진다(webp 그대로는 엔진이 오류를 낸다)", async () => {
        const webp = await sample("webp");
        const raw = `data:image/webp;base64,${Buffer.from(webp).toString("base64")}`;
        await expect(render(raw)).rejects.toThrow();
        const image = await render((await toCardAvatar(webp))!);
        expect(image.subarray(0, 8).toString("hex")).toBe(PNG_SIGNATURE);
    });

    it("읽지 못하는 파일이면 null — 카드는 이름 첫 글자로 그린다", async () => {
        expect(
            await toCardAvatar(new TextEncoder().encode("not an image"))
        ).toBeNull();
    });
});
