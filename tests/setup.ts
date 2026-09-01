import { vi } from "vitest";

vi.mock("server-only", () => ({}));

process.env.DATABASE_URL ??=
    "postgresql://noslog_test:noslog_test@localhost:5432/noslog_test";
process.env.COOKIE_PASSWORD ??= "test-cookie-password-at-least-32-chars";
process.env.BOOKMARKLET_SECRET ??= "test-bookmarklet-secret-at-least-32-chars";
