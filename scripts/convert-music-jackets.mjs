import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

// 로컬 자켓 PNG → WebP(긴 변 512px · 품질 80) — 2026-09-22 사용자 결정(162MB → 약 14.5MB).
// 가장 크게 보이는 곳이 악곡 상세 머리(272px)라 고해상도 화면에서도 512px 면 충분하다.
// 새 PNG 자켓을 public/bg 에 넣은 뒤 이 스크립트를 돌리면 WebP 로 바꾸고 원본 PNG 는 지운다
const MAX_SIZE = 512;
const QUALITY = 80;
const directory = path.join(process.cwd(), "public", "bg");

let before = 0;
let after = 0;
const pngs = (await readdir(directory)).filter((name) =>
    name.toLowerCase().endsWith(".png")
);
for (const name of pngs) {
    const source = path.join(directory, name);
    const target = path.join(directory, `${path.parse(name).name}.webp`);
    before += (await stat(source)).size;
    const output = await sharp(source)
        .resize({
            width: MAX_SIZE,
            height: MAX_SIZE,
            fit: "inside",
            withoutEnlargement: true,
        })
        .webp({ quality: QUALITY })
        .toBuffer();
    await writeFile(target, output);
    after += output.length;
    await unlink(source);
}

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);
console.info(
    `Converted ${pngs.length} jackets: ${mb(before)}MB → ${mb(after)}MB`
);

// 작은 칸용 축소판(2026-10-15 S11) — 목록 · 카드(44~111px)는 512px 원본 대신 이것을 받는다(img srcset · sizes="auto").
// public/bg/{128,256}/{index}.webp, 없는 것만 만든다
const THUMB_SIZES = [128, 256];
const webps = (await readdir(directory)).filter((name) =>
    name.toLowerCase().endsWith(".webp")
);
let thumbs = 0;
for (const size of THUMB_SIZES) {
    const thumbDirectory = path.join(directory, String(size));
    await mkdir(thumbDirectory, { recursive: true });
    const existing = new Set(await readdir(thumbDirectory));
    for (const name of webps) {
        if (existing.has(name)) continue;
        await sharp(path.join(directory, name))
            .resize({
                width: size,
                height: size,
                fit: "inside",
                withoutEnlargement: true,
            })
            .webp({ quality: QUALITY })
            .toFile(path.join(thumbDirectory, name));
        thumbs += 1;
    }
}
console.info(`Created ${thumbs} jacket thumbnails`);
