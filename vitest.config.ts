import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vitest/config";

// unit(노드) · db(로컬 Postgres, TEST_DATABASE_URL 이 있을 때만) 두 프로젝트. npm test 는 둘 다 돈다.
// 스토리북은 vitest.storybook.config.ts 로 따로 둔다 — 그 플러그인이 Next 의 .env 를 프로세스에 읽어 들인다.
const databaseTests = "tests/**/*-database.test.ts";

export default defineConfig({
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./", import.meta.url)),
        },
    },
    test: {
        environment: "node",
        setupFiles: ["./tests/setup.ts"],
        clearMocks: true,
        projects: [
            {
                extends: true,
                test: {
                    name: "unit",
                    include: ["tests/**/*.test.ts"],
                    exclude: [databaseTests],
                },
            },
            {
                extends: true,
                test: {
                    name: "db",
                    include: [databaseTests],
                    // 같은 DB 를 나눠 쓰므로 파일을 차례로 돌린다.
                    fileParallelism: false,
                },
            },
        ],
    },
});
