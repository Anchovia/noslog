import { closeSync, existsSync, fstatSync, openSync, readSync } from "node:fs";

// 기준값은 이 리포 세션 기록으로 정했다 — docs/decisions/2026-10-27-rule-enforcement-hooks.md
export const KOREAN_MIN_RATIO = 0.2;
export const KOREAN_MIN_LETTERS = 40;
// Claude Code 훅 출력 문자열 하나의 한도. 넘으면 2,000자 미리보기만 들어간다(code.claude.com/docs/en/hooks).
export const HOOK_CONTEXT_MAX_CHARS = 10_000;

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
