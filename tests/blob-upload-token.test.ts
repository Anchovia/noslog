import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    generateClientTokenFromReadWriteToken: vi.fn(async () => "client-token"),
    head: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
}));

vi.mock("@vercel/blob", () => ({
    head: mocks.head,
    get: mocks.get,
    put: mocks.put,
    del: vi.fn(),
}));

vi.mock("@/lib/env/server", () => ({
    serverEnv: { PRIVATE_BLOB_READ_WRITE_TOKEN: "private-token" },
}));
vi.mock("@vercel/blob/client", () => ({
    generateClientTokenFromReadWriteToken:
        mocks.generateClientTokenFromReadWriteToken,
}));

import {
    createImageUploadToken,
    createPrivateImageUploadToken,
    isValidImageBlob,
    isValidPrivateImageBlob,
    stripPrivateImageBlobMetadata,
} from "@/lib/blob";

const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

// 클라이언트 토큰은 만료(30초) 전까지 여러 번 쓸 수 있어, 경로를 서버가 정하고 덮어쓰기를 막아 한 번만 올라가게 한다
describe("이미지 업로드 토큰", () => {
    it.each([
        ["공개", createImageUploadToken],
        ["비공개", createPrivateImageUploadToken],
    ] as const)(
        "%s 토큰은 발급마다 다른 경로 하나에만 쓴다",
        async (_, create) => {
            const first = await create("avatars/2/profile", "image/webp");
            const second = await create("avatars/2/profile", "image/webp");

            expect(first?.pathname).toMatch(
                new RegExp(`^avatars/2/profile-${UUID}\\.webp$`)
            );
            expect(second?.pathname).not.toBe(first?.pathname);
            for (const [options] of mocks.generateClientTokenFromReadWriteToken
                .mock.calls as unknown as [Record<string, unknown>][]) {
                expect(options).toMatchObject({
                    addRandomSuffix: false,
                    allowedContentTypes: ["image/webp"],
                });
                expect(options.allowOverwrite).toBeUndefined();
            }
        }
    );
});

// 올릴 때의 Content-Type 은 보내는 쪽이 정한다 — 저장 전에 파일 머리가 그 형식인지 본다
describe("저장 전 이미지 확인", () => {
    const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13];
    const stored = (bytes: number[], contentType = "image/png") => {
        mocks.head.mockResolvedValue({
            pathname: "avatars/2/profile-a.png",
            contentType,
            size: 100,
        });
        mocks.get.mockResolvedValue({
            stream: new Blob([new Uint8Array(bytes)]).stream(),
        });
    };

    it.each([
        ["공개", isValidImageBlob, "public"],
        ["비공개", isValidPrivateImageBlob, "private"],
    ] as const)(
        "%s 파일은 머리가 선언한 형식일 때만 받는다",
        async (_, isValid, access) => {
            const url = `https://store.${access}.blob.vercel-storage.com/avatars/2/profile-a.png`;

            stored(PNG);
            expect(await isValid(url, "avatars/2/profile")).toBe(true);

            stored([...new TextEncoder().encode("<html><script>")]);
            expect(await isValid(url, "avatars/2/profile")).toBe(false);

            stored(PNG, "image/jpeg");
            expect(await isValid(url, "avatars/2/profile")).toBe(false);
        }
    );
});

// 브라우저가 저장소에 바로 올린 원본은 서버가 촬영 정보를 뺀 파일로 같은 경로에 덮어쓴다
describe("비공개 이미지의 촬영 정보 지우기", () => {
    const pathname = "exam-proofs/2/30/proof-a.jpg";
    const url = `https://store.private.blob.vercel-storage.com/${pathname}`;
    const stored = (bytes: Uint8Array<ArrayBuffer>) =>
        mocks.get.mockResolvedValue({
            statusCode: 200,
            stream: new Blob([bytes]).stream(),
            blob: { pathname },
        });
    const photo = async () =>
        new Uint8Array(
            await sharp({
                create: {
                    width: 40,
                    height: 20,
                    channels: 3,
                    background: { r: 200, g: 120, b: 60 },
                },
            })
                .withMetadata({ orientation: 6 })
                .withExif({ IFD0: { Model: "Phone 1" } })
                .jpeg()
                .toBuffer()
        );

    it("같은 경로에 촬영 정보가 없는 같은 형식 파일을 덮어쓴다", async () => {
        stored(await photo());

        await stripPrivateImageBlobMetadata(url);

        expect(mocks.get).toHaveBeenCalledWith(url, {
            access: "private",
            token: "private-token",
            useCache: false,
        });
        expect(mocks.put).toHaveBeenCalledTimes(1);
        const [target, body, options] = mocks.put.mock.calls[0];
        expect(target).toBe(pathname);
        expect(options).toEqual({
            access: "private",
            token: "private-token",
            contentType: "image/jpeg",
            allowOverwrite: true,
        });
        const meta = await sharp(body).metadata();
        expect([meta.format, meta.exif, meta.orientation]).toEqual([
            "jpeg",
            undefined,
            undefined,
        ]);
        expect(Buffer.from(body).includes("Phone 1")).toBe(false);
    });

    it("읽지 못하는 사진은 덮어쓰지 않고 실패한다", async () => {
        stored((await photo()).slice(0, 200));

        await expect(stripPrivateImageBlobMetadata(url)).rejects.toThrow();
        expect(mocks.put).not.toHaveBeenCalled();
    });

    it("저장소에 파일이 없으면 실패한다", async () => {
        mocks.get.mockResolvedValue(null);

        await expect(stripPrivateImageBlobMetadata(url)).rejects.toThrow(
            "private image blob is not readable"
        );
        expect(mocks.put).not.toHaveBeenCalled();
    });

    it("덮어쓰지 못하면 실패한다", async () => {
        stored(await photo());
        mocks.put.mockRejectedValueOnce(new Error("blob store unavailable"));

        await expect(stripPrivateImageBlobMetadata(url)).rejects.toThrow(
            "blob store unavailable"
        );
    });
});
