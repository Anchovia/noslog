import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { stripImageMetadata } from "@/lib/uploads/strip-image-metadata";

const EXIF = {
    IFD0: { Make: "TestCam", Model: "Phone 1" },
    IFD3: {
        GPSLatitudeRef: "N",
        GPSLatitude: "37/1 33/1 59/1",
        GPSLongitudeRef: "E",
        GPSLongitude: "126/1 58/1 40/1",
    },
};

// 왼쪽 절반은 빨강, 오른쪽 절반은 파랑인 가로 40 · 세로 20 사진
function halves() {
    const width = 40;
    const height = 20;
    const raw = Buffer.alloc(width * height * 3);
    for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++)
            raw[(y * width + x) * 3 + (x < width / 2 ? 0 : 2)] = 255;
    return sharp(raw, { raw: { width, height, channels: 3 } });
}

async function sample(
    format: "jpeg" | "png" | "webp",
    orientation: number,
    options: Record<string, unknown> = {}
) {
    return new Uint8Array(
        await halves()
            .withMetadata({ orientation })
            .withExif(EXIF)
            [format](options)
            .toBuffer()
    );
}

async function pixel(bytes: Uint8Array, x: number, y: number) {
    const { data, info } = await sharp(bytes)
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
    const start = (y * info.width + x) * 3;
    return [...data.subarray(start, start + 3)];
}

describe("올린 사진의 촬영 정보 지우기", () => {
    it.each([
        ["jpeg", "image/jpeg"],
        ["png", "image/png"],
        ["webp", "image/webp"],
    ] as const)(
        "%s 사진은 같은 형식으로 두고 촬영 정보만 뺀다",
        async (format, contentType) => {
            const source = await sample(format, 1);
            const before = await sharp(source).metadata();
            expect(before.exif).toBeDefined();
            expect(Buffer.from(source).includes("TestCam")).toBe(true);

            const stripped = await stripImageMetadata(source);

            expect(stripped.contentType).toBe(contentType);
            const after = await sharp(stripped.data).metadata();
            expect([after.format, after.width, after.height]).toEqual([
                format,
                40,
                20,
            ]);
            expect([after.exif, after.icc, after.xmp, after.iptc]).toEqual([
                undefined,
                undefined,
                undefined,
                undefined,
            ]);
            expect(stripped.data.includes("TestCam")).toBe(false);
            expect(stripped.data.includes("Phone 1")).toBe(false);
        }
    );

    it.each(["jpeg", "png", "webp"] as const)(
        "%s 사진의 회전 값은 픽셀에 반영한 뒤 버린다",
        async (format) => {
            // 방향 6 — 볼 때 시계 방향으로 90도 돌려야 하는 사진. 왼쪽(빨강)이 위로 간다
            const source = await sample(
                format,
                6,
                format === "png" ? {} : { quality: 100 }
            );
            expect((await sharp(source).metadata()).orientation).toBe(6);

            const { data } = await stripImageMetadata(source);

            const after = await sharp(data).metadata();
            expect([after.width, after.height, after.orientation]).toEqual([
                20,
                40,
                undefined,
            ]);
            const [topRed, , topBlue] = await pixel(data, 10, 5);
            const [bottomRed, , bottomBlue] = await pixel(data, 10, 35);
            expect(topRed).toBeGreaterThan(200);
            expect(topBlue).toBeLessThan(50);
            expect(bottomBlue).toBeGreaterThan(200);
            expect(bottomRed).toBeLessThan(50);
        }
    );

    it("PNG 와 무손실 WebP 는 픽셀이 그대로다", async () => {
        const original = await halves().raw().toBuffer();
        for (const source of [
            await sample("png", 1),
            await sample("webp", 1, { lossless: true }),
        ]) {
            const { data } = await stripImageMetadata(source);
            expect(
                (await sharp(data).removeAlpha().raw().toBuffer()).equals(
                    original
                )
            ).toBe(true);
        }
    });

    it("색을 줄이지 않은 JPEG 는 다시 만들 때도 줄이지 않는다", async () => {
        const full = await stripImageMetadata(
            await sample("jpeg", 1, { chromaSubsampling: "4:4:4" })
        );
        const reduced = await stripImageMetadata(await sample("jpeg", 1));

        expect((await sharp(full.data).metadata()).chromaSubsampling).toBe(
            "4:4:4"
        );
        expect((await sharp(reduced.data).metadata()).chromaSubsampling).toBe(
            "4:2:0"
        );
    });

    it("움직이는 WebP 는 모든 장을 남긴다", async () => {
        const frames = await Promise.all(
            ["#f00", "#0f0", "#00f"].map((background) =>
                sharp({
                    create: { width: 16, height: 12, channels: 3, background },
                })
                    .png()
                    .toBuffer()
            )
        );
        const source = new Uint8Array(
            await sharp(frames, { join: { animated: true } })
                .withExif(EXIF)
                .webp({ delay: [100, 200, 300], loop: 0 })
                .toBuffer()
        );

        const { data } = await stripImageMetadata(source);

        const after = await sharp(data, { animated: true }).metadata();
        expect([after.pages, after.delay, after.exif]).toEqual([
            3,
            [100, 200, 300],
            undefined,
        ]);
    });

    it.each([
        ["GIF", new TextEncoder().encode("GIF89a")],
        [
            "SVG",
            new TextEncoder().encode(
                "<svg xmlns='http://www.w3.org/2000/svg'/>"
            ),
        ],
        ["빈 파일", new Uint8Array()],
    ])(
        "받지 않는 형식(%s)은 sharp 에 넘기지 않고 실패한다",
        async (_, bytes) => {
            await expect(stripImageMetadata(bytes)).rejects.toThrow(
                "unsupported image format"
            );
        }
    );

    it("읽지 못하는 사진은 원본을 돌려주지 않고 실패한다", async () => {
        const source = await sample("jpeg", 1);

        await expect(
            stripImageMetadata(source.slice(0, source.length / 2))
        ).rejects.toThrow();
    });
});
