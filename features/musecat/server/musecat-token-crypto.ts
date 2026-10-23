import "server-only";

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

import { serverEnv } from "@/lib/env/server";

/** 뮤즈캣 토큰 보관 — AES-256-GCM, 무작위 96비트 IV, AAD 로 다른 줄 · 칸에 옮겨 붙이지 못하게 한다(OWASP · coder dbcrypt 방식) */
export const MUSECAT_TOKEN_KEY_ID = "k1";

function key() {
    const value = serverEnv.MUSECAT_TOKEN_KEY;
    const bytes = value ? Buffer.from(value, "base64") : null;
    if (!bytes || bytes.length !== 32) {
        throw new Error("MUSECAT_TOKEN_KEY must be 32 bytes in base64");
    }
    return bytes;
}

export function encryptMusecatToken(value: string, aad: string) {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key(), iv);
    cipher.setAAD(Buffer.from(aad, "utf8"));
    const body = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
    return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64");
}

export function decryptMusecatToken(stored: string, aad: string) {
    const data = Buffer.from(stored, "base64");
    const decipher = createDecipheriv(
        "aes-256-gcm",
        key(),
        data.subarray(0, 12)
    );
    decipher.setAAD(Buffer.from(aad, "utf8"));
    decipher.setAuthTag(data.subarray(12, 28));
    return Buffer.concat([
        decipher.update(data.subarray(28)),
        decipher.final(),
    ]).toString("utf8");
}
