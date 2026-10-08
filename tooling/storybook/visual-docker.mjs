import { spawn } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

// CI와 같은 브라우저·OS·CPU 기준. Playwright 업데이트 시 CI 이미지도 함께 검토한다.
const version = "1.61.1";
const image = `mcr.microsoft.com/playwright:v${version}-noble`;
const root = resolve(import.meta.dirname, "../..");
const temporary = await mkdtemp(resolve(tmpdir(), "noslog-visual-"));
const work = resolve(temporary, "work");
const built = resolve(temporary, "storybook");
const args = process.argv.slice(2);

function run(command, arguments_, cwd = root) {
    return new Promise((resolveRun, reject) => {
        const child = spawn(command, arguments_, { cwd, stdio: "inherit" });
        child.once("error", reject);
        child.once("exit", (code, signal) => {
            if (code === 0) resolveRun();
            else reject(new Error(`${command}: ${signal ?? code}`));
        });
    });
}

try {
    const installed = JSON.parse(
        await readFile(
            resolve(root, "node_modules/@playwright/test/package.json"),
            "utf8"
        )
    );
    if (installed.version !== version) {
        throw new Error(
            `Playwright ${installed.version}: CI 이미지와 기준 이미지 버전을 함께 갱신하세요.`
        );
    }
    await run("docker", ["info", "--format", "{{.ServerVersion}}"]);
    await run("npm", ["run", "build-storybook", "--", "--output-dir", built]);
    await mkdir(work, { recursive: true });
    for (const path of [
        "package.json",
        "tsconfig.json",
        "playwright.storybook.config.ts",
        "visual",
        "lib/i18n",
        "tooling/storybook/serve.mjs",
        // 이 세 패키지는 JS만 포함한다. macOS의 네이티브 의존성은 컨테이너로 옮기지 않는다.
        "node_modules/@playwright/test",
        "node_modules/playwright",
        "node_modules/playwright-core",
    ]) {
        await cp(resolve(root, path), resolve(work, path), { recursive: true });
    }
    process.stdout.write(`시각 검사 결과: ${temporary}/results\n`);
    await run("docker", [
        "run",
        "--rm",
        "--platform",
        "linux/amd64",
        "--ipc=host",
        "--mount",
        `type=bind,source=${work},target=/work`,
        "--mount",
        `type=bind,source=${built},target=/storybook,readonly`,
        "--mount",
        `type=bind,source=${temporary},target=/results`,
        "--workdir",
        "/work",
        "--env",
        "STORYBOOK_STATIC_DIR=/storybook",
        "--env",
        "STORYBOOK_VISUAL_RESULTS=/results/results",
        image,
        "node",
        "node_modules/playwright/cli.js",
        "test",
        "--config",
        "playwright.storybook.config.ts",
        ...args,
    ]);
    if (
        args.some(
            (arg) =>
                arg === "--update-snapshots" ||
                arg.startsWith("--update-snapshots=")
        )
    ) {
        await cp(
            resolve(work, "visual/snapshots"),
            resolve(root, "visual/snapshots"),
            { recursive: true }
        );
        process.stdout.write(
            "기준 이미지를 갱신했습니다. git diff와 이미지를 검토하세요.\n"
        );
    }
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    console.error(`검사 파일·결과 보존: ${temporary}`);
    process.exitCode = 1;
}
