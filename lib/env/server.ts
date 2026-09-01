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
        VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
        VERCEL_AUTOMATION_BYPASS_SECRET: optionalSecret,
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
        VERCEL_ENV: process.env.VERCEL_ENV,
        VERCEL_AUTOMATION_BYPASS_SECRET:
            process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
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
