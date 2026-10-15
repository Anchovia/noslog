import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { inflateSync } from "node:zlib";
import { describe, expect, it } from "vitest";

import { BRAND_IMAGE_DARK_HEX } from "@/lib/metadata/brand-image";

/** favicon.ico 의 가장 큰 PNG 판을 RGBA 줄로 푼다(8비트 RGBA 만 — 만든 파일 형식) */
function decodeLargestIcoFrame(file: string) {
    const ico = readFileSync(resolve(file));
    const count = ico.readUInt16LE(4);
    const frames = Array.from({ length: count }, (_, i) => {
        const entry = 6 + 16 * i;
        return {
            size: ico.readUInt8(entry) || 256,
            png: ico.subarray(
                ico.readUInt32LE(entry + 12),
                ico.readUInt32LE(entry + 12) + ico.readUInt32LE(entry + 8)
            ),
        };
    });
    const { png, size } = frames.sort((a, b) => b.size - a.size)[0];
    const chunks: Buffer[] = [];
    for (let at = 8; at < png.length;) {
        const length = png.readUInt32BE(at);
        if (png.toString("ascii", at + 4, at + 8) === "IDAT")
            chunks.push(png.subarray(at + 8, at + 8 + length));
        at += 12 + length;
    }
    const raw = inflateSync(Buffer.concat(chunks));
    const stride = size * 4;
    const rows: Buffer[] = [];
    let previous = Buffer.alloc(stride);
    for (let y = 0; y < size; y++) {
        const filter = raw[y * (stride + 1)];
        const line = Buffer.from(
            raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1))
        );
        for (let x = 0; x < stride; x++) {
            const left = x >= 4 ? line[x - 4] : 0;
            const up = previous[x];
            const upLeft = x >= 4 ? previous[x - 4] : 0;
            const paeth = () => {
                const p = left + up - upLeft;
                const [pa, pb, pc] = [p - left, p - up, p - upLeft].map(
                    Math.abs
                );
                return pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft;
            };
            const add = [0, left, up, (left + up) >> 1, paeth()][filter];
            line[x] = (line[x] + add) & 255;
        }
        rows.push(line);
        previous = line;
    }
    const hex = (x: number, y: number) =>
        `#${[...rows[y].subarray(x * 4, x * 4 + 3)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
    const alpha = (x: number, y: number) => rows[y][x * 4 + 3];
    return { size, hex, alpha };
}

describe("아이콘 · 공유 이미지 색", () => {
    const css = readFileSync(resolve("app/styles/tokens.css"), "utf8");
    // 첫 블록(.noslog-ui) = 다크 값
    const dark = css.slice(0, css.indexOf("}"));
    const token = (name: string) =>
        dark.match(new RegExp(`--nl-${name}:\\s*(#[0-9a-f]{6})`, "i"))?.[1];

    it("tokens.css 의 다크 토큰과 같다(2026-10-01 D13)", () => {
        expect(BRAND_IMAGE_DARK_HEX).toEqual({
            background: token("surface-canvas"),
            surface: token("surface-surface"),
            border: token("border-divider"),
            primary: token("identity-mark"),
            secondary: token("content-subdued"),
        });
    });

    it("탭 아이콘(favicon.ico) = 바탕 없음 · 원 identity-mark · 고양이 surface/canvas(2026-10-15)", () => {
        const { size, hex, alpha } = decodeLargestIcoFrame("app/favicon.ico");
        expect(size).toBe(48);
        expect(alpha(0, 0)).toBe(0);
        // 원 위쪽 가장자리 안 · 고양이 몸통 가운데(512 상자 256,40 · 240,380 을 48 로 줄인 자리)
        expect(hex(24, 4)).toBe(token("identity-mark")?.toLowerCase());
        expect(hex(22, 36)).toBe(token("surface-canvas")?.toLowerCase());
    });
});
