import {
    closeSync,
    existsSync,
    fstatSync,
    openSync,
    readdirSync,
    readFileSync,
    readSync,
} from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

// 기준값은 이 리포 세션 기록으로 정했다 — docs/decisions/2026-10-27-rule-enforcement-hooks.md
export const KOREAN_MIN_RATIO = 0.2;
export const KOREAN_MIN_LETTERS = 40;
// Claude Code 훅 출력 문자열 하나의 한도. 넘으면 2,000자 미리보기만 들어간다(code.claude.com/docs/en/hooks).
export const HOOK_CONTEXT_MAX_CHARS = 10_000;
// Claude Code 터미널판 내장 「new task? /clear」 안내와 같은 기준 — docs/decisions/2026-10-27-session-handoff-hook.md
export const HANDOFF_IDLE_MINUTES = 75;
export const HANDOFF_MIN_TOKENS = 100_000;

/** 코드 블록 · 인라인 코드 · 인용 줄 · URL 처럼 답한 언어와 상관없는 부분을 뺀 글. */
export function stripNonProse(text) {
    return text
        .replace(/^ {0,3}(`{3,}|~{3,})[\s\S]*?(?:^ {0,3}\1|(?![\s\S]))/gm, " ")
        .replace(/(`+)[^\n]*?\1/g, " ")
        .replace(/^ {0,3}>.*$/gm, " ")
        .replace(/\]\([^)\s]*\)/g, "]")
        .replace(/\b[a-z][a-z0-9+.-]*:\/\/\S+/gi, " ");
}

/** 한글 글자 수 · 라틴 글자 수 · 한글 비율(한글 / (한글 + 라틴)). */
export function hangulRatio(text) {
    const prose = stripNonProse(text);
    const hangul = (prose.match(/[가-힣ㄱ-ㆎ]/g) ?? []).length;
    const latin = (prose.match(/[a-z]/gi) ?? []).length;
    const letters = hangul + latin;
    return { hangul, latin, ratio: letters === 0 ? 1 : hangul / letters };
}

/** 막을 이유, 막지 않으면 null. */
export function judgeKorean(text, { stopHookActive = false } = {}) {
    if (stopHookActive || !text) return null;
    const { hangul, latin, ratio } = hangulRatio(text);
    if (hangul + latin < KOREAN_MIN_LETTERS || ratio >= KOREAN_MIN_RATIO)
        return null;
    return [
        `마지막 답의 한글 비율이 ${Math.round(ratio * 100)}% 로 기준 ${KOREAN_MIN_RATIO * 100}% 보다 낮다.`,
        "AGENTS.md 「사용자 규칙」 대로 답은 한국어로 한다.",
        "같은 내용을 한국어로 다시 써서 답한다. 코드 · 명령 · 파일 이름 · 커밋 type 은 그대로 둔다.",
    ].join(" ");
}

/** JSONL 끝부분을 줄 단위로 읽는다. 잘린 첫 줄과 깨진 줄은 버린다. */
export function parseTail(chunk, { truncated }) {
    const lines = chunk.split("\n");
    if (truncated) lines.shift();
    const entries = [];
    for (const line of lines) {
        if (!line.trim()) continue;
        try {
            entries.push(JSON.parse(line));
        } catch {
            // 쓰는 중인 마지막 줄일 수 있다. 다음 판정에서 다시 읽힌다.
        }
    }
    return entries;
}

export function isAssistant(entry) {
    return (
        entry?.type === "assistant" &&
        !entry.isSidechain &&
        entry.message?.model !== "<synthetic>"
    );
}

/** 마지막 assistant 메시지(같은 message.id 줄들)의 글. 마지막 메시지에 글이 없으면 null. */
export function lastAssistantText(entries) {
    const last = entries.findLast(isAssistant);
    if (!last) return null;
    const id = last.message.id;
    const texts = entries
        .filter((entry) => isAssistant(entry) && entry.message.id === id)
        .flatMap((entry) => entry.message.content ?? [])
        .filter((block) => block?.type === "text")
        .map((block) => block.text);
    return texts.length ? texts.join("\n") : null;
}

/** 하네스가 넣은 메시지(<task-notification> · <side-sessions-event> 같은 태그로 시작). 막거나 안내하면 보고가 묻힌다. */
export function isMachinePrompt(prompt) {
    return /^\s*<[a-z]/i.test(prompt ?? "");
}

/** 마지막 답 시각과 지금 컨텍스트 토큰 수. 답 뒤에 압축됐으면 압축 뒤 크기를 쓴다. */
export function lastTurnState(entries) {
    const index = entries.findLastIndex(isAssistant);
    if (index < 0) return null;
    const last = entries[index];
    const usage = last.message.usage ?? {};
    let tokens =
        (usage.input_tokens ?? 0) +
        (usage.cache_read_input_tokens ?? 0) +
        (usage.cache_creation_input_tokens ?? 0);
    const compacted = entries
        .slice(index + 1)
        .findLast((entry) => entry.subtype === "compact_boundary");
    if (compacted) {
        const after = compacted.compactMetadata?.postTokens;
        if (typeof after !== "number") return null;
        tokens = after;
    }
    return { at: Date.parse(last.timestamp), tokens };
}

/** 오래 쉰 긴 세션이면 에이전트에게 넣을 글, 아니면 null. */
export function judgeHandoff(entries, { prompt = "", now = Date.now() } = {}) {
    if (isMachinePrompt(prompt)) return null;
    const state = lastTurnState(entries);
    if (!state || Number.isNaN(state.at)) return null;
    const minutes = Math.floor((now - state.at) / 60_000);
    if (minutes <= HANDOFF_IDLE_MINUTES || state.tokens < HANDOFF_MIN_TOKENS)
        return null;
    return [
        "===== 세션 넘기기 (훅이 잰 값) =====",
        `마지막 답 뒤 ${minutes}분 쉬었고 컨텍스트는 ${Math.round(state.tokens / 1000)}k 토큰이다(기준 ${HANDOFF_IDLE_MINUTES}분 · ${HANDOFF_MIN_TOKENS / 1000}k).`,
        "AGENTS.md 「일하는 방식」 대로 이 세션에서 이어 가지 않는다.",
        "한 것 · 남은 것을 요약해 새 세션으로 넘기고, 이 메시지에는 넘긴 결과만 답한다.",
    ].join("\n");
}

/** 파일 끝만 읽어 줄과 파일 크기를 돌려준다. assistant 줄이 없으면 더 크게 한 번 더 읽는다. */
export function readTail(path, sizes = [256 * 1024, 8 * 1024 * 1024]) {
    // 새 세션의 첫 프롬프트에서는 기록 파일이 아직 없을 수 있다.
    if (!existsSync(path)) return { entries: [], size: 0 };
    const fd = openSync(path, "r");
    try {
        const size = fstatSync(fd).size;
        let entries = [];
        for (const want of sizes) {
            const length = Math.min(want, size);
            const buffer = Buffer.alloc(length);
            readSync(fd, buffer, 0, length, size - length);
            entries = parseTail(buffer.toString("utf8"), {
                truncated: length < size,
            });
            if (entries.some(isAssistant) || length === size) break;
        }
        return { entries, size };
    } finally {
        closeSync(fd);
    }
}

// 세션 3층 — docs/decisions/2026-11-23-session-tier-hook.md
export const HAND_WORK_WORDS =
    /다시 게시|게시|판 조립|판을 만들|캡처|찍|실측|publish/i;

/** start_session 입력을 3층 규칙에 대어 막을 이유, 막지 않으면 null. */
export function judgeSessionTier(toolInput) {
    const input = toolInput ?? {};
    if (input.initiation === "offer") return null;
    if (input.proposal_id) return null;
    const model = typeof input.model === "string" ? input.model.trim() : "";
    if (!model)
        return "세션 층을 정해 model 을 적으세요. 실측 · 캡처 찍기 · 판 조립 · 게시 = Sonnet, 대조 · 정리 · 검수 = Opus 중간–낮음 (AGENTS.md 3층)";
    const prompt = typeof input.prompt === "string" ? input.prompt : "";
    if (
        /opus/i.test(model) &&
        HAND_WORK_WORDS.test(prompt) &&
        !prompt.includes("Sonnet 세션")
    )
        return "Opus 세션에 손작업이 들어 있습니다. 손작업은 Sonnet 세션으로 열거나, 지시문에 '실측 · 캡처 찍기 · 판 조립 · 게시는 Sonnet 세션을 띄워 맡긴다' 를 넣으세요 (AGENTS.md 3층)";
    return null;
}

// 세션 운영 — docs/decisions/2026-11-23-session-orchestration.md
export const BRIEF_HEADINGS = [
    "목적",
    "출력 형식",
    "도구와 출처",
    "범위 경계",
    "투입 한도",
];

/** start_session 지시문에 다섯 칸 머리가 모두 있는지. 빠진 칸이 있으면 막을 이유, 없으면 null. */
export function judgeSessionBrief(toolInput) {
    const input = toolInput ?? {};
    if (input.initiation === "offer" || input.proposal_id) return null;
    const prompt = typeof input.prompt === "string" ? input.prompt : "";
    const missing = BRIEF_HEADINGS.filter(
        (heading) => !new RegExp(`^[\\s#>*-]*${heading}\\s*:`, "m").test(prompt)
    );
    if (!missing.length) return null;
    return `지시문에 칸 머리가 빠졌습니다: ${missing.map((h) => `「${h}:」`).join(" ")}. .claude/templates/session-brief.md 양식대로 다섯 칸(목적 · 출력 형식 · 도구와 출처 · 범위 경계 · 투입 한도)을 줄 머리로 적으세요 (AGENTS.md 세션 운영)`;
}

/** 부른 세션이 조사(Sonnet) 층이면 막을 이유. Sonnet 은 세션을 직접 열지 않고 조사 취합 세션에 인원을 요청한다. */
export function judgeCallerLayer(toolInput, callerModel) {
    const input = toolInput ?? {};
    if (input.initiation === "offer" || input.proposal_id) return null;
    if (!/sonnet/i.test(callerModel ?? "")) return null;
    return "조사(Sonnet) 세션은 세션을 직접 열 수 없습니다. 바로 위 조사 취합 세션에 인원 요청을 SendMessage 로 보내세요(조사 취합이 판단해 새 Sonnet 세션을 띄웁니다) (AGENTS.md 세션 운영)";
}

export function sessionsDir() {
    return (
        process.env.CLAUDE_SESSIONS_DIR ??
        join(
            homedir(),
            "Library/Application Support/Claude/claude-code-sessions"
        )
    );
}

export function notesDir() {
    return (
        process.env.CLAUDE_NOTES_DIR ??
        join(homedir(), "Library/Application Support/Claude/side-session-notes")
    );
}

/** 데스크톱 앱이 세션마다 두는 메타 파일(local_*.json: sessionId · cliSessionId · model · spawnedFrom)을 모두 읽는다. */
export function loadSessionMetas(dir = sessionsDir()) {
    const metas = [];
    if (!existsSync(dir)) return metas;
    for (const a of readdirSync(dir)) {
        const aDir = join(dir, a);
        let bs = [];
        try {
            bs = readdirSync(aDir);
        } catch {
            continue;
        }
        for (const b of bs) {
            let files = [];
            try {
                files = readdirSync(join(aDir, b));
            } catch {
                continue;
            }
            for (const file of files) {
                if (!/^local_.*\.json$/.test(file)) continue;
                try {
                    metas.push(
                        JSON.parse(readFileSync(join(aDir, b, file), "utf8"))
                    );
                } catch {
                    // 쓰는 중인 파일일 수 있다.
                }
            }
        }
    }
    return metas;
}

export function findSelf(metas, cliSessionId) {
    return metas.find((meta) => meta.cliSessionId === cliSessionId) ?? null;
}

/** 이 세션이 띄운 하위 세션과 그 아래 층(spawnedFrom.sessionId 사슬)의 세션 id. */
export function descendantSessionIds(metas, sessionId) {
    const found = new Set();
    const queue = [sessionId];
    while (queue.length) {
        const parent = queue.shift();
        for (const meta of metas) {
            if (meta.spawnedFrom?.sessionId !== parent) continue;
            if (!meta.sessionId || found.has(meta.sessionId)) continue;
            found.add(meta.sessionId);
            queue.push(meta.sessionId);
        }
    }
    return [...found];
}

/** 기록 파일에서 부른 세션의 모델. 마지막 assistant 메시지, 없으면 시작 때 넣는 model 항목. */
export function transcriptModel(entries) {
    const last = entries.findLast(isAssistant);
    if (last?.message?.model) return last.message.model;
    const first = entries.find(
        (entry) =>
            entry?.type === "attachment" && entry.attachment?.type === "model"
    );
    return first?.attachment?.identity?.modelId ?? null;
}

/** SendMessage 가 바로 위 세션(또는 이 세션이 띄운 아래 세션 · 세션이 아닌 서브에이전트)이 아닌 세션으로 가면 막을 이유. */
export function judgeSendMessage({ to, self, metas, isSubagent = false }) {
    if (isSubagent || !self) return null;
    const parent = self.spawnedFrom?.sessionId;
    if (!parent) return null;
    const target = typeof to === "string" ? to.trim() : "";
    if (!target) return null;
    if (target === parent || target === "parent" || target === "main")
        return null;
    const parentMeta = metas.find((meta) => meta.sessionId === parent);
    const parentNames = [parentMeta?.title, parentMeta?.spawnedFrom?.name];
    if (parentNames.includes(target)) return null;
    const isChild = metas.some(
        (meta) =>
            meta.spawnedFrom?.sessionId === self.sessionId &&
            [meta.sessionId, meta.title, meta.spawnedFrom?.name].includes(
                target
            )
    );
    if (isChild) return null;
    const isSession = metas.some((meta) =>
        [meta.sessionId, meta.title, meta.spawnedFrom?.name].includes(target)
    );
    if (!isSession) return null;
    return `이 세션의 바로 위 세션은 ${parent} 입니다. 막힘 · 질문 · 요청은 바로 위 층에만 보내고 층을 건너뛰지 않습니다(조사 → 조사 취합 → master → 사용자). to 를 ${parent} 로 하세요 (AGENTS.md 세션 운영)`;
}

const ARTIFACT_URL = /claude\.ai\/(?:code\/)?artifact\/([A-Za-z0-9_-]+)/g;
const VERSION_ID = /\b\d{9,}-[0-9a-f]{3,}\b/g;

export function artifactSlugs(text) {
    return [
        ...new Set([...(text ?? "").matchAll(ARTIFACT_URL)].map((m) => m[1])),
    ];
}

/** 기록의 도구 결과에서 이 아티팩트의 마지막 version id 와, 이 세션이 직접 게시한 버전인지. */
export function currentArtifactVersion(entries, slug) {
    const uses = new Map();
    let version = null;
    let published = false;
    for (const entry of entries) {
        const content = entry?.message?.content;
        if (!Array.isArray(content)) continue;
        for (const block of content) {
            if (block?.type === "tool_use") {
                uses.set(block.id, {
                    name: block.name ?? "",
                    input: JSON.stringify(block.input ?? {}),
                });
            } else if (block?.type === "tool_result") {
                const use = uses.get(block.tool_use_id);
                const text = JSON.stringify(block.content ?? "");
                if (!text.includes(slug) && !use?.input.includes(slug))
                    continue;
                const ids = text.match(VERSION_ID);
                if (!ids) continue;
                version = ids[ids.length - 1];
                published =
                    /publish|edit_version|^Artifact$/.test(use?.name ?? "") &&
                    /Published|published/.test(text);
            }
        }
    }
    return { version, published };
}

/** 공유 폴더 글에서 「review: <아티팩트> version=<id> 검수=<세션> 쓴=<세션>」 줄을 모은다. */
export function parseReviewRecords(text) {
    const records = [];
    for (const line of (text ?? "").split("\n")) {
        const m = line.match(
            /^\s*(?:[-*]\s*)?review:\s*(\S+)\s+version=(\S+)\s+검수=(\S+)\s+쓴=(\S+)/
        );
        if (m)
            records.push({
                target: m[1],
                version: m[2],
                reviewer: m[3],
                writer: m[4],
            });
    }
    return records;
}

/** 위 층에 올리는 보고에 담긴 아티팩트마다 지금 버전의 검수 기록(검수 ≠ 쓴 세션)이 있는지. 없으면 막을 이유. */
export function judgeReviewGate({
    text,
    entries,
    records,
    model,
    stopHookActive = false,
}) {
    if (stopHookActive || /sonnet/i.test(model ?? "")) return null;
    for (const slug of artifactSlugs(text)) {
        const { version, published } = currentArtifactVersion(entries, slug);
        if (!version)
            return `보고한 아티팩트 ${slug} 의 지금 version id 를 기록에서 찾지 못했습니다. get_artifact 로 version id 를 확인한 뒤 검수 기록과 맞춰 다시 보고하세요 (AGENTS.md 세션 운영)`;
        if (published) continue;
        const forVersion = records.filter(
            (r) => r.version === version && r.target.includes(slug)
        );
        if (!forVersion.length)
            return `아티팩트 ${slug} 의 지금 version id ${version} 에 검수 기록이 없습니다. 쓴 세션과 다른 검수 세션이 공유 폴더에 「review: ${slug} version=${version} 검수=<세션 id> 쓴=<세션 id>」 줄을 남겨야 위 층에 올릴 수 있습니다. 새 버전이 나왔으면 다시 검수해야 합니다 (AGENTS.md 세션 운영)`;
        if (!forVersion.some((r) => r.reviewer !== r.writer))
            return `아티팩트 ${slug} 의 검수 기록에서 검수 세션이 쓴 세션과 같습니다. 쓴 세션은 자기 결과를 통과시키지 못합니다. 다른 세션이 검수하게 하세요 (AGENTS.md 세션 운영)`;
    }
    return null;
}

/** 공유 폴더들의 .md · .txt 글을 이어 붙인다. */
export function readNotes(folders) {
    let out = "";
    for (const folder of folders) {
        let files = [];
        try {
            files = readdirSync(folder);
        } catch {
            continue;
        }
        for (const file of files) {
            if (!/\.(md|txt)$/.test(file)) continue;
            try {
                out += `${readFileSync(join(folder, file), "utf8")}\n`;
            } catch {
                // 읽을 수 없는 파일은 건너뛴다.
            }
        }
    }
    return out;
}

export async function readStdinJson() {
    let raw = "";
    for await (const chunk of process.stdin) raw += chunk;
    return JSON.parse(raw);
}

/** 훅이 실패해도 세션은 막지 않는다. stderr 로 알리고 exit 1(막지 않는 오류). */
export function failOpen(hook, error) {
    process.stderr.write(
        `[${hook}] 훅 실패, 이번 턴은 검사 없이 넘어간다: ${error?.stack ?? error}\n`
    );
    process.exit(1);
}
