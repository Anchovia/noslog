import { defineConfig, devices } from "@playwright/test";

// e2e 는 운영 빌드(next start)를 3100 포트에서 검사한다. 사용자가 켜 둔 localhost:3000 개발 서버로는 가지 않는다.
// 로컬은 AGENTS.md 절차대로 리포 밖 복사본에서 3100 서버를 먼저 띄운다. CI 는 아래 webServer 가 띄운다.
const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3100";

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    // 재시도로 통과하면 리포트에 flaky 로 남는다. 흔들림을 숨기는 장치로 쓰지 않는다.
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 3 : undefined,
    reporter: process.env.CI
        ? [["list"], ["github"], ["html", { open: "never" }]]
        : [["list"], ["html", { open: "never" }]],
    use: {
        baseURL: baseUrl,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        locale: "ko-KR",
        timezoneId: "Asia/Seoul",
    },
    expect: {
        timeout: 10_000,
    },
    // 기본은 모바일 한 폭. 스펙 대부분이 setViewportSize 로 폭을 스스로 바꾼다.
    // 데스크톱 프로젝트는 @desktop(데스크톱 전용) · @responsive(두 폭 모두) 태그만 돈다.
    projects: [
        {
            name: "mobile-chromium",
            grepInvert: /@desktop/,
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 390, height: 844 },
            },
        },
        {
            name: "desktop-chromium",
            grep: /@desktop|@responsive/,
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 1280, height: 900 },
            },
        },
    ],
    webServer: process.env.CI
        ? {
              command: "npm run start -- -p 3100",
              url: baseUrl,
              reuseExistingServer: false,
              timeout: 120_000,
          }
        : undefined,
});
