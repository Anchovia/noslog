import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const postgresUrl = z.url().refine(
    (value) => {
        const protocol = new URL(value).protocol;
        return protocol === "postgres:" || protocol === "postgresql:";
    },
    { message: "DATABASE_URL must use the postgres or postgresql protocol" }
);

const optionalSecret = z.string().trim().min(1).optional();

export const serverEnv = createEnv({
    server: {
        DATABASE_URL: postgresUrl,
        DATABASE_EXPECTED_HOST: z.string().trim().min(1).optional(),
        COOKIE_PASSWORD: z.string().min(32),
        BOOKMARKLET_SECRET: z.string().min(32),
        APP_URL: z.url().optional(),
        DISCORD_CLIENT_ID: optionalSecret,
        DISCORD_CLIENT_SECRET: optionalSecret,
        DISCORD_REDIRECT_URI: z.url().optional(),
        BLOB_READ_WRITE_TOKEN: optionalSecret,
        BLOB_STORE_ID: optionalSecret,
        BLOB_WEBHOOK_PUBLIC_KEY: optionalSecret,
        PRIVATE_BLOB_READ_WRITE_TOKEN: optionalSecret,
        CRON_SECRET: z.string().min(32).optional(),
        GOOGLE_SITE_VERIFICATION: optionalSecret,
        X_BEARER_TOKEN: optionalSecret,
        OFFICIAL_X_SYNC_SECRET: z.string().min(32).optional(),
        GEMINI_API_KEY: optionalSecret,
        VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
        VERCEL_AUTOMATION_BYPASS_SECRET: optionalSecret,
        // 뮤즈캣 연동(2026-10-20) — 없으면 지금 오락실 화면, mock 은 흉내 데이터, live 는 실제 뮤즈캣
        MUSECAT_MODE: z.enum(["mock", "live"]).optional(),
        MUSECAT_API_ORIGIN: z.url().optional(),
        MUSECAT_WEB_ORIGIN: z.url().optional(),
        // 뮤즈캣이 발급한 기록 무효화 키(PARTNER_TO_MUSECAT_KEY)
        MUSECAT_PARTNER_KEY: optionalSecret,
        // NosLog 가 뮤즈캣 앱으로 등록돼 받은 값(A 방향 · live) — 토큰 암호화 키는 32바이트 base64
        MUSECAT_CLIENT_ID: optionalSecret,
        MUSECAT_CLIENT_SECRET: optionalSecret,
        MUSECAT_REDIRECT_URI: z.url().optional(),
        MUSECAT_TOKEN_KEY: optionalSecret,
    },
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        DATABASE_EXPECTED_HOST: process.env.DATABASE_EXPECTED_HOST,
        COOKIE_PASSWORD: process.env.COOKIE_PASSWORD,
        BOOKMARKLET_SECRET: process.env.BOOKMARKLET_SECRET,
        APP_URL: process.env.APP_URL,
        DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
        DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
        DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI,
        BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
        BLOB_STORE_ID: process.env.BLOB_STORE_ID,
        BLOB_WEBHOOK_PUBLIC_KEY: process.env.BLOB_WEBHOOK_PUBLIC_KEY,
        PRIVATE_BLOB_READ_WRITE_TOKEN:
            process.env.PRIVATE_BLOB_READ_WRITE_TOKEN,
        CRON_SECRET: process.env.CRON_SECRET,
        GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION,
        X_BEARER_TOKEN: process.env.X_BEARER_TOKEN,
        OFFICIAL_X_SYNC_SECRET: process.env.OFFICIAL_X_SYNC_SECRET,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        VERCEL_ENV: process.env.VERCEL_ENV,
        VERCEL_AUTOMATION_BYPASS_SECRET:
            process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
        MUSECAT_MODE: process.env.MUSECAT_MODE,
        MUSECAT_API_ORIGIN: process.env.MUSECAT_API_ORIGIN,
        MUSECAT_WEB_ORIGIN: process.env.MUSECAT_WEB_ORIGIN,
        MUSECAT_PARTNER_KEY: process.env.MUSECAT_PARTNER_KEY,
        MUSECAT_CLIENT_ID: process.env.MUSECAT_CLIENT_ID,
        MUSECAT_CLIENT_SECRET: process.env.MUSECAT_CLIENT_SECRET,
        MUSECAT_REDIRECT_URI: process.env.MUSECAT_REDIRECT_URI,
        MUSECAT_TOKEN_KEY: process.env.MUSECAT_TOKEN_KEY,
    },
    emptyStringAsUndefined: true,
});

const discordValues = [
    serverEnv.DISCORD_CLIENT_ID,
    serverEnv.DISCORD_CLIENT_SECRET,
    serverEnv.DISCORD_REDIRECT_URI,
];

if (discordValues.some(Boolean) && !discordValues.every(Boolean)) {
    throw new Error(
        "DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, and DISCORD_REDIRECT_URI must be configured together"
    );
}

if (serverEnv.DATABASE_EXPECTED_HOST) {
    const actualHost = new URL(serverEnv.DATABASE_URL).hostname;
    if (actualHost !== serverEnv.DATABASE_EXPECTED_HOST) {
        throw new Error(
            `DATABASE_URL host mismatch: expected ${serverEnv.DATABASE_EXPECTED_HOST}, received ${actualHost}`
        );
    }
}
