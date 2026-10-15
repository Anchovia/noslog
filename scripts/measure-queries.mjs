// 화면 요청 한 번에 DB 쿼리가 몇 개 나가는지 잰다(2026-10-16 DB 재설계 P0).
//
// 1. 개발 서버를 쿼리 기록을 켜고 띄운다(운영 빌드에서는 켜지지 않는다):
//      NOSLOG_QUERY_LOG=/tmp/noslog-queries.jsonl npm run dev
// 2. 다른 터미널에서 같은 파일을 넘겨 잰다:
//      node scripts/measure-queries.mjs --log /tmp/noslog-queries.jsonl
//      node scripts/measure-queries.mjs --log … --url /ko/music/<index>/<난이도> --url /ko/profile/<id>
// 로그인 화면은 브라우저의 세션 쿠키를 NOSLOG_MEASURE_COOKIE 로 넘긴다(화면 · 파일에 쓰지 않는다).
//
// URL 하나를 --runs 번 차례로 부르고, 응답 뒤 기록 파일이 --settle 밀리초 동안 늘지 않을 때까지 기다려
// 늘어난 줄을 센다. 첫 번은 컴파일 · 캐시 미스가 섞이고, 나머지는 캐시가 찬 상태다.
// 같은 서버에 다른 요청(브라우저 · 다른 세션)이 오면 그 쿼리도 섞이니 재는 동안은 서버를 혼자 쓴다.

import { readFileSync, statSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";

const DEFAULT_URLS = [
    "/ko",
    "/ko/music",
    "/ko/rankings",
    "/ko/tiers",
    "/ko/gamecenter",
    "/ko/announcements",
    "/ko/events",
    "/ko/exams",
    "/ko/bingo",
];

const { values } = parseArgs({
    options: {
        log: { type: "string" },
        base: { type: "string", default: "http://localhost:3000" },
        url: { type: "string", multiple: true },
        runs: { type: "string", default: "3" },
        settle: { type: "string", default: "1500" },
        json: { type: "string" },
        top: { type: "string", default: "3" },
    },
});

if (!values.log) {
    console.error(
        "--log 에 개발 서버의 NOSLOG_QUERY_LOG 와 같은 파일을 주세요."
    );
    process.exit(1);
}

const logFile = values.log;
const runs = Math.max(1, Number(values.runs));
const settleMs = Math.max(200, Number(values.settle));
const topCount = Math.max(0, Number(values.top));
const urls = values.url?.length ? values.url : DEFAULT_URLS;
const cookie = process.env.NOSLOG_MEASURE_COOKIE;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sizeOf = () => {
    try {
        return statSync(logFile).size;
    } catch {
        return 0;
    }
};

async function waitForQuiet() {
    let last = sizeOf();
    let quietSince = Date.now();
    const deadline = Date.now() + 60_000;
    while (Date.now() < deadline) {
        await sleep(200);
        const now = sizeOf();
        if (now !== last) {
            last = now;
            quietSince = Date.now();
        } else if (Date.now() - quietSince >= settleMs) {
            return now;
        }
    }
    return last;
}

function readSince(offset) {
    const text = readFileSync(logFile).subarray(offset).toString("utf8");
    return text
        .split("\n")
        .filter(Boolean)
        .map((line) => {
            try {
                return JSON.parse(line);
            } catch {
                return null;
            }
        })
        .filter(Boolean);
}

// 같은 모양의 쿼리를 묶어 N+1 을 찾는다 — 값 자리표시($1)와 IN 목록 길이를 지운다
const shapeOf = (sql) =>
    sql
        .replace(/\$\d+/g, "?")
        .replace(/\((\?,?\s*)+\)/g, "(…)")
        .replace(/\s+/g, " ")
        .trim();

const kindOf = (sql) => {
    const word = sql.trim().split(/\s+/)[0]?.toUpperCase() ?? "";
    return [
        "SELECT",
        "INSERT",
        "UPDATE",
        "DELETE",
        "BEGIN",
        "COMMIT",
        "ROLLBACK",
    ].includes(word)
        ? word
        : "OTHER";
};

function summarize(queries) {
    const kinds = {};
    const shapes = new Map();
    let ms = 0;
    for (const query of queries) {
        const kind = kindOf(query.sql);
        kinds[kind] = (kinds[kind] ?? 0) + 1;
        ms += Number(query.ms) || 0;
        const shape = shapeOf(query.sql);
        shapes.set(shape, (shapes.get(shape) ?? 0) + 1);
    }
    const repeated = [...shapes.entries()]
        .filter(([, count]) => count > 1)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topCount)
        .map(([shape, count]) => ({ count, shape: shape.slice(0, 160) }));
    return { total: queries.length, kinds, dbMs: Math.round(ms), repeated };
}

async function measure(path) {
    const target = new URL(path, values.base);
    const results = [];
    for (let run = 1; run <= runs; run += 1) {
        await waitForQuiet();
        const before = sizeOf();
        const started = Date.now();
        let status = 0;
        try {
            const response = await fetch(target, {
                headers: cookie ? { cookie } : {},
                redirect: "follow",
            });
            status = response.status;
            await response.arrayBuffer();
        } catch (error) {
            console.error(`${path}: 요청 실패 — ${error.message}`);
        }
        const elapsed = Date.now() - started;
        await waitForQuiet();
        results.push({ run, status, elapsed, ...summarize(readSince(before)) });
    }
    return { path, results };
}

const report = [];
console.log(
    `기록 파일 ${logFile} · ${values.base} · ${runs}번씩 · ${cookie ? "로그인 쿠키 있음" : "로그인 안 함"}\n`
);
for (const path of urls) {
    const { results } = await measure(path);
    report.push({ path, results });
    const first = results[0];
    const warm = results.slice(1);
    const warmTotals = warm.map((r) => r.total).sort((a, b) => a - b);
    const warmMedian = warmTotals.length
        ? warmTotals[Math.floor(warmTotals.length / 2)]
        : null;
    console.log(
        `${path}  상태 ${first.status}  첫 번 ${first.total}개(${first.dbMs}ms)` +
            (warmMedian === null ? "" : `  · 캐시 찬 뒤 ${warmMedian}개`) +
            `  ${JSON.stringify(results.at(-1).kinds)}`
    );
    for (const item of results.at(-1).repeated) {
        console.log(`    ×${item.count}  ${item.shape}`);
    }
}

if (values.json) {
    writeFileSync(
        values.json,
        JSON.stringify(
            {
                base: values.base,
                runs,
                measuredAt: new Date().toISOString(),
                report,
            },
            null,
            2
        )
    );
    console.log(`\n자세한 결과: ${values.json}`);
}
