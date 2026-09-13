import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    verifySyncToken: vi.fn(),
    userFindUnique: vi.fn(),
    musicFindMany: vi.fn(),
    musicFindUnique: vi.fn(),
    musicUpdateMany: vi.fn(),
    put: vi.fn(),
    deleteBlobIfOwned: vi.fn(),
    revalidateTag: vi.fn(),
}));

vi.mock("@/lib/bookmarklet", () => ({
    verifySyncToken: mocks.verifySyncToken,
}));
vi.mock("@/lib/db", () => ({
    default: {
        user: { findUnique: mocks.userFindUnique },
        music: {
            findMany: mocks.musicFindMany,
            findUnique: mocks.musicFindUnique,
            updateMany: mocks.musicUpdateMany,
        },
    },
}));
vi.mock("@vercel/blob", () => ({ put: mocks.put }));
vi.mock("@/lib/blob", () => ({ deleteBlobIfOwned: mocks.deleteBlobIfOwned }));
vi.mock("next/cache", () => ({ revalidateTag: mocks.revalidateTag }));

import { OPTIONS, POST } from "@/app/api/receiveJacket/route";
import {
    detectJacketFormat,
    getMissingJacketIndexes,
} from "@/features/music/server/jacketCollectionService";

const origin = "https://p.eagate.573.jp";
// 로컬 /bg 에 파일이 있는 곡(tests/tiers.test.ts 와 같은 곡)
const localIndex = "818b48940c2d17325904fbab68689046";
const png = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13,
]);
const blobUrl =
    "https://store.public.blob.vercel-storage.com/jackets/missing-a-abc.png";

function createRequest(body: unknown, requestOrigin = origin) {
    return new NextRequest("http://localhost/api/receiveJacket", {
        method: "POST",
        headers: { Origin: requestOrigin, "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

function jacketBody(bytes: Buffer = png, index = "missing-a") {
    return { token: "valid-token", index, data: bytes.toString("base64") };
}

describe("getMissingJacketIndexes", () => {
    it("DB 자켓이 없는 곡 중 로컬 파일이 없는 곡만 돌려준다", async () => {
        mocks.musicFindMany.mockResolvedValue([
            { index: "missing-a" },
            { index: localIndex },
            { index: "bad index/.." },
        ]);

        await expect(getMissingJacketIndexes()).resolves.toEqual(["missing-a"]);
        expect(mocks.musicFindMany).toHaveBeenCalledWith(
            expect.objectContaining({ where: { background: null } })
        );
    });
});

describe("detectJacketFormat", () => {
    it("파일 머리 바이트로 이미지 형식을 판별한다", () => {
        expect(detectJacketFormat(png)?.contentType).toBe("image/png");
        expect(
            detectJacketFormat(Buffer.from([0xff, 0xd8, 0xff, 0xe0]))
        ).toEqual({ contentType: "image/jpeg", extension: "jpg" });
        expect(
            detectJacketFormat(Buffer.from("RIFF\0\0\0\0WEBPVP8 ", "latin1"))
                ?.contentType
        ).toBe("image/webp");
        expect(
            detectJacketFormat(Buffer.from("GIF89a", "latin1"))?.contentType
        ).toBe("image/gif");
        expect(
            detectJacketFormat(Buffer.from("<!DOCTYPE html>", "latin1"))
        ).toBeNull();
    });
});

describe("POST /api/receiveJacket", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.verifySyncToken.mockReturnValue({ userId: 1, version: 0 });
        mocks.userFindUnique.mockResolvedValue({
            sync_token_version: 0,
            role: "admin",
        });
        mocks.musicFindUnique.mockResolvedValue({ background: null });
        mocks.put.mockResolvedValue({ url: blobUrl });
        mocks.musicUpdateMany.mockResolvedValue({ count: 1 });
    });

    it("공식 사이트가 아닌 Origin 요청을 거부한다", async () => {
        const response = await POST(
            createRequest(jacketBody(), "https://example.com")
        );

        expect(response.status).toBe(403);
        expect(mocks.verifySyncToken).not.toHaveBeenCalled();
    });

    it("관리자가 아니면 저장하지 않는다", async () => {
        mocks.userFindUnique.mockResolvedValue({
            sync_token_version: 0,
            role: "user",
        });

        const response = await POST(createRequest(jacketBody()));

        expect(response.status).toBe(403);
        expect(mocks.put).not.toHaveBeenCalled();
    });

    it("재발급으로 무효가 된 토큰은 거부한다", async () => {
        mocks.userFindUnique.mockResolvedValue({
            sync_token_version: 1,
            role: "admin",
        });

        const response = await POST(createRequest(jacketBody()));

        expect(response.status).toBe(403);
        expect(mocks.put).not.toHaveBeenCalled();
    });

    it("자켓 없는 곡의 이미지를 공개 Blob 에 올리고 DB 에 기록한다", async () => {
        const response = await POST(createRequest(jacketBody()));

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ saved: true });
        expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
            origin
        );
        expect(mocks.put).toHaveBeenCalledWith(
            "jackets/missing-a.png",
            expect.any(Buffer),
            {
                access: "public",
                contentType: "image/png",
                addRandomSuffix: true,
            }
        );
        expect(mocks.musicUpdateMany).toHaveBeenCalledWith({
            where: { index: "missing-a", background: null },
            data: { background: blobUrl },
        });
        for (const tag of ["music-catalog", "music-details", "bingos"]) {
            expect(mocks.revalidateTag).toHaveBeenCalledWith(tag, "max");
        }
    });

    it("이미 자켓이 있거나 로컬 파일이 있는 곡은 다시 받지 않는다", async () => {
        mocks.musicFindUnique.mockResolvedValue({ background: blobUrl });
        const stored = await POST(createRequest(jacketBody()));
        const local = await POST(createRequest(jacketBody(png, localIndex)));

        expect(await stored.json()).toEqual({ saved: false });
        expect(await local.json()).toEqual({ saved: false });
        expect(mocks.put).not.toHaveBeenCalled();
    });

    it("이미지가 아닌 응답(로그인 페이지 등)은 저장하지 않는다", async () => {
        const response = await POST(
            createRequest(jacketBody(Buffer.from("<html>login</html>")))
        );

        expect(response.status).toBe(400);
        expect(mocks.put).not.toHaveBeenCalled();
    });

    it("동시에 다른 요청이 먼저 채웠으면 올린 파일을 지운다", async () => {
        mocks.musicUpdateMany.mockResolvedValue({ count: 0 });

        const response = await POST(createRequest(jacketBody()));

        expect(await response.json()).toEqual({ saved: false });
        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(blobUrl);
        expect(mocks.revalidateTag).not.toHaveBeenCalled();
    });

    it("공식 사이트의 사전 요청만 허용한다", async () => {
        const allowed = await OPTIONS(
            new NextRequest("http://localhost/api/receiveJacket", {
                method: "OPTIONS",
                headers: { Origin: origin },
            })
        );
        const blocked = await OPTIONS(
            new NextRequest("http://localhost/api/receiveJacket", {
                method: "OPTIONS",
                headers: { Origin: "https://example.com" },
            })
        );

        expect(allowed.status).toBe(204);
        expect(blocked.status).toBe(403);
    });
});
