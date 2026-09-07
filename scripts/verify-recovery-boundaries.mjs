import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import {
    access,
    mkdir,
    readFile,
    rmdir,
    unlink,
    writeFile,
} from "node:fs/promises";
import { once } from "node:events";
import { setTimeout as pause } from "node:timers/promises";

// Disposable local-only production verification. No fault-injection route or
// root-layout condition is retained in the application after this command.
const database = new URL(process.env.DATABASE_URL ?? "http://invalid");
if (
    database.hostname !== "127.0.0.1" ||
    database.port !== "55432" ||
    database.pathname !== "/noslog_v2"
) {
    throw new Error(
        "Use the explicit local NosLog E2E database on port 55432."
    );
}
const rootFile = "app/layout.tsx";
const fixtureDirectory = "app/(nevigation)/p7-verification";
const fixtureFile = `${fixtureDirectory}/page.tsx`;
const authFixtureDirectory = "app/(auth)/p9-verification";
const authFixtureFile = `${authFixtureDirectory}/page.tsx`;
const verifyAuth = process.env.NOSLOG_AUTH_FIXTURE === "true";
const verifySettings = process.env.NOSLOG_SETTINGS_FIXTURE === "true";
const verifyAnnouncements = process.env.NOSLOG_ANNOUNCEMENTS_FIXTURE === "true";
const verifyArcades = process.env.NOSLOG_ARCADES_FIXTURE === "true";
const verifyExams = process.env.NOSLOG_EXAMS_FIXTURE === "true";
const verifyBingos = process.env.NOSLOG_BINGOS_FIXTURE === "true";
const verifyShare = process.env.NOSLOG_PROFILE_CARD_FIXTURE === "true";
const verifyPrivacy = process.env.NOSLOG_PRIVACY_VERIFICATION === "true";
if (verifyAuth) {
    try {
        await access(authFixtureDirectory);
        throw new Error("The temporary authentication route already exists.");
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }
}
try {
    await access(fixtureDirectory);
    throw new Error("The temporary recovery route already exists.");
} catch (error) {
    if (error.code !== "ENOENT") throw error;
}
const original = await readFile(rootFile, "utf8");
const anchor = "    const requestHeaders = await headers();";
if (original.split(anchor).length !== 2)
    throw new Error("Root layout changed; inspect the injection point first.");
const injected = original.replace(
    anchor,
    `${anchor}
    if (process.env.NOSLOG_RECOVERY_FIXTURE === "true" && requestHeaders.get("x-noslog-root-fixture-error") === "true") {
        throw new Error("P7_PRIVATE_ROOT_FIXTURE");
    }`
);
const fixture = `import { headers } from "next/headers";
import ProfileOwnerFixture from "@/e2e/fixtures/profileOwner";
import SyncFixture from "@/e2e/fixtures/sync";
import SettingsFixture from "@/e2e/fixtures/settings";
import AnnouncementsFixture from "@/e2e/fixtures/announcements";
import ArcadesFixture from "@/e2e/fixtures/arcades";
import ExamsFixture from "@/e2e/fixtures/exams";
import BingosFixture from "@/e2e/fixtures/bingos";
import BingoLoadingFixture from "@/e2e/fixtures/bingoLoading";
export default async function RecoveryVerification({searchParams}: {searchParams:Promise<Record<string,string|undefined>>}) {
    if ((await headers()).get("x-noslog-page-fixture-error") === "true") throw new Error("P7_PRIVATE_RENDER_FIXTURE");
    const query = await searchParams;
    if (query.fixture === "bingos" && query.state === "loading") return <BingoLoadingFixture />;
    if (query.fixture === "bingos") return <BingosFixture state={query.state} />;
    if (query.fixture === "exams") return <ExamsFixture state={query.state} />;
    if (query.fixture === "arcades") return <ArcadesFixture state={query.state} />;
    if (query.fixture === "announcements") return <AnnouncementsFixture state={query.state} />;
    if (query.fixture === "settings") return <SettingsFixture category={query.category} />;
    if (query.fixture === "sync") return <SyncFixture state={query.state} />;
    if (query.fixture === "profile") return <ProfileOwnerFixture privacy={query.privacy} sync={query.sync} />;
    ${verifyBingos ? "return <BingosFixture state={query.state} />;" : verifyExams ? "return <ExamsFixture state={query.state} />;" : verifyArcades ? "return <ArcadesFixture state={query.state} />;" : "return <h1>P7 recovered</h1>;"}
}
`;
const environment = {
    ...process.env,
    DATABASE_EXPECTED_HOST: "127.0.0.1",
    NEXT_PUBLIC_ENABLE_THEME_SWITCHING: "false",
    MAINTENANCE_MODE: "false",
    NOSLOG_RECOVERY_FIXTURE: "true",
    PLAYWRIGHT_BASE_URL: "http://localhost:3001",
};
const authFixture = `import { OnboardingContent } from "@/features/auth/components/onboardingPage";
import OnboardingForm from "@/features/profile/components/onboardingForm";
import { getServerI18n } from "@/lib/i18n/server";
import { setTimeout as pause } from "node:timers/promises";
export default async function AuthVerification({searchParams}: {searchParams: Promise<Record<string,string|undefined>>}) {
    const state = (await searchParams).state;
    async function submit() {
        "use server";
        const { t } = await getServerI18n();
        await pause(800);
        if (state === "duplicate") return { success: false as const, message: t("onboarding.error.nicknameTaken"), fieldErrors: { username: [t("onboarding.error.nicknameTaken")] } };
        return { success: false as const, message: t("onboarding.error.generic") };
    }
    return <OnboardingContent data={{ avatar: null, displayName: state === "long" ? "NosLog fixture · 長い表示名を持つログインアカウント · Long connected account name" : "NosLog fixture", returnTo: "/bookmarklet" }}><OnboardingForm submitAction={submit} /></OnboardingContent>;
}
`;
async function run(command, args, logPath, env = environment) {
    const output = createWriteStream(logPath);
    const child = spawn(command, args, {
        env,
        stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.pipe(output, { end: false });
    child.stderr.pipe(output, { end: false });
    const [code] = await once(child, "exit");
    output.end();
    if (code !== 0)
        throw new Error(`${command} failed (${code}); see ${logPath}`);
}
let server;
let serverOutput;
let failure;
try {
    await mkdir(fixtureDirectory);
    await writeFile(fixtureFile, fixture);
    await writeFile(rootFile, injected);
    if (verifyAuth) {
        await mkdir(authFixtureDirectory);
        await writeFile(authFixtureFile, authFixture);
    }
    console.log("Building the isolated local recovery fixture.");
    await run("npm", ["run", "build"], "/tmp/noslog-p7-fixture-build.log");
    serverOutput = createWriteStream("/tmp/noslog-p7-fixture-server.log");
    server = spawn(
        process.execPath,
        ["node_modules/next/dist/bin/next", "start", "-p", "3001"],
        { env: environment, stdio: ["ignore", "pipe", "pipe"] }
    );
    server.stdout.pipe(serverOutput, { end: false });
    server.stderr.pipe(serverOutput, { end: false });
    let ready = false;
    for (let attempt = 0; attempt < 60; attempt += 1) {
        if (server.exitCode !== null)
            throw new Error("The local verification server stopped.");
        try {
            const response = await fetch(
                "http://localhost:3001/ko/p7-verification"
            );
            if (response.ok) {
                ready = true;
                break;
            }
        } catch {
            /* Wait for this newly started local server. */
        }
        await pause(500);
    }
    if (!ready)
        throw new Error("The local verification server did not become ready.");
    console.log(
        "Checking real production route and root recovery in three locales."
    );
    await run(
        "npx",
        [
            "playwright",
            "test",
            ...(verifyBingos
                ? ["e2e/noslog-v2-bingos.spec.ts"]
                : verifyExams
                  ? ["e2e/noslog-v2-exams.spec.ts"]
                  : verifyArcades
                    ? ["e2e/noslog-v2-arcades.spec.ts"]
                    : verifyAnnouncements
                      ? ["e2e/noslog-v2-announcements.spec.ts"]
                      : verifySettings
                        ? ["e2e/noslog-v2-settings-profile.spec.ts"]
                        : verifyAuth
                          ? [
                                "e2e/noslog-v2-auth.spec.ts",
                                "e2e/noslog-v2-onboarding-states.spec.ts",
                            ]
                          : process.env.NOSLOG_SYNC_FIXTURE === "true"
                            ? [
                                  "e2e/noslog-v2-sync-states.spec.ts",
                                  "e2e/noslog-v2-recovery-boundaries.spec.ts",
                                  "e2e/noslog-v2-profile-owner.spec.ts",
                              ]
                            : [
                                  "e2e/noslog-v2-recovery-boundaries.spec.ts",
                                  "e2e/noslog-v2-profile-owner.spec.ts",
                              ]),
            "--project=desktop-chromium",
            ...(verifyExams && verifyArcades
                ? ["e2e/noslog-v2-arcades.spec.ts"]
                : []),
            ...(verifySettings && (verifyAnnouncements || verifyBingos)
                ? ["e2e/noslog-v2-settings-profile.spec.ts"]
                : []),
            ...(verifyShare ? ["e2e/noslog-v2-profile-owner.spec.ts"] : []),
            ...(verifyPrivacy ? ["e2e/noslog-v2-privacy.spec.ts"] : []),
            ...(verifyAnnouncements
                ? ["--output=test-results/announcements-chromium"]
                : verifySettings
                  ? ["--output=test-results/settings-chromium"]
                  : verifyAuth
                    ? ["--output=test-results/auth-chromium"]
                    : []),
        ],
        "/tmp/noslog-p7-fixture-browser.log"
    );
    if (
        verifyAuth ||
        verifySettings ||
        verifyAnnouncements ||
        verifyArcades ||
        verifyExams ||
        verifyBingos ||
        verifyShare ||
        verifyPrivacy
    ) {
        await run(
            "npx",
            [
                "playwright",
                "test",
                ...(verifyBingos
                    ? ["e2e/noslog-v2-bingos.spec.ts"]
                    : verifyExams
                      ? ["e2e/noslog-v2-exams.spec.ts"]
                      : verifyArcades
                        ? ["e2e/noslog-v2-arcades.spec.ts"]
                        : verifyAnnouncements
                          ? ["e2e/noslog-v2-announcements.spec.ts"]
                          : verifySettings
                            ? ["e2e/noslog-v2-settings-profile.spec.ts"]
                            : [
                                  "e2e/noslog-v2-auth.spec.ts",
                                  "e2e/noslog-v2-onboarding-states.spec.ts",
                              ]),
                "--config=playwright.cross-browser.config.ts",
                ...(verifyExams && verifyArcades
                    ? ["e2e/noslog-v2-arcades.spec.ts"]
                    : []),
                ...(verifySettings && (verifyAnnouncements || verifyBingos)
                    ? ["e2e/noslog-v2-settings-profile.spec.ts"]
                    : []),
                ...(verifyShare ? ["e2e/noslog-v2-profile-owner.spec.ts"] : []),
                ...(verifyPrivacy ? ["e2e/noslog-v2-privacy.spec.ts"] : []),
                "--project=desktop-firefox",
                "--project=desktop-webkit",
                verifyAnnouncements
                    ? "--output=test-results/announcements-cross"
                    : verifySettings
                      ? "--output=test-results/settings-cross"
                      : "--output=test-results/auth-cross",
            ],
            verifyAnnouncements
                ? "/tmp/noslog-p11-fixture-cross-browser.log"
                : verifySettings
                  ? "/tmp/noslog-p10-fixture-cross-browser.log"
                  : "/tmp/noslog-p9-fixture-cross-browser.log"
        );
    }
} catch (error) {
    failure = error;
} finally {
    if (server && server.exitCode === null) {
        server.kill("SIGTERM");
        await once(server, "exit");
    }
    serverOutput?.end();
    if ((await readFile(rootFile, "utf8")) !== injected) {
        throw new Error(
            "Root layout changed during verification; retained it for manual inspection instead of overwriting user work."
        );
    }
    await writeFile(rootFile, original);
    if ((await readFile(fixtureFile, "utf8")) !== fixture)
        throw new Error(
            "Temporary route changed during verification; inspect before removing it."
        );
    await unlink(fixtureFile);
    await rmdir(fixtureDirectory);
    if (verifyAuth) {
        if ((await readFile(authFixtureFile, "utf8")) !== authFixture)
            throw new Error(
                "Temporary authentication route changed; inspect before removing it."
            );
        await unlink(authFixtureFile);
        await rmdir(authFixtureDirectory);
    }
    console.log(
        "Temporary fault injection removed. Rebuilding the actual application."
    );
    await run("npm", ["run", "build"], "/tmp/noslog-p7-restored-build.log", {
        ...environment,
        NOSLOG_RECOVERY_FIXTURE: "false",
    });
}
if (failure) throw failure;
console.log(
    "Production recovery verification and restored-source build passed."
);
