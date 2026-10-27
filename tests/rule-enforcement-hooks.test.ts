import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
    HANDOFF_IDLE_MINUTES,
    HANDOFF_MIN_TOKENS,
    HOOK_CONTEXT_MAX_CHARS,
    hangulRatio,
    isMachinePrompt,
    judgeHandoff,
    judgeKorean,
    lastAssistantText,
    lastTurnState,
    parseTail,
} from "../.claude/hooks/rules.mjs";

const english =
    "Checks pass. Now I'll look at the screen with mocked responses in two states and update the guide.";
const korean =
    "검사를 모두 통과했어요. 이제 두 상태의 화면을 확인하고 가이드를 고치겠습니다. 바꾼 파일은 세 개입니다.";

function assistant(
    id: string,
    content: unknown[],
    extra: Record<string, unknown> = {}
) {
    return {
        type: "assistant",
        isSidechain: false,
        message: {
            id,
            model: "claude-opus-5-5",
            content,
            usage: {
                input_tokens: 2,
                cache_read_input_tokens: 600_000,
                cache_creation_input_tokens: 500,
            },
        },
        ...extra,
    };
}

describe("한국어 답 판정", () => {
    it("코드 블록 · 인라인 코드 · 인용 줄 · URL 은 글자 수에서 뺀다", () => {
        const text = [
            "아래 명령으로 확인합니다.",
            "```bash\nnpm run typecheck && npm run lint\n```",
            "`app/styles/tokens.css` 를 고쳤어요.",
            '> "Do not create an empty desktop dashboard"',
            "[결정](https://example.com/very/long/english/path) 참고.",
        ].join("\n");
        expect(hangulRatio(text)).toMatchObject({ latin: 0, ratio: 1 });
    });

    it("영어 답은 막고 한국어로 다시 쓰라는 이유를 준다", () => {
        expect(judgeKorean(english)).toContain("한국어로 다시 써서");
    });

    it("한국어 답 · 코드가 많은 한국어 답은 막지 않는다", () => {
        expect(judgeKorean(korean)).toBeNull();
        expect(
            judgeKorean(
                `${korean}\n\`\`\`ts\nexport const value = computeSomethingLong(input);\n\`\`\``
            )
        ).toBeNull();
    });

    it("짧은 답 · 빈 답 · 이미 한 번 막은 뒤에는 막지 않는다", () => {
        expect(judgeKorean("Done.")).toBeNull();
        expect(judgeKorean("")).toBeNull();
        expect(judgeKorean(null)).toBeNull();
        expect(judgeKorean(english, { stopHookActive: true })).toBeNull();
    });
});

describe("세션 기록 읽기", () => {
    it("잘린 첫 줄과 쓰는 중인 마지막 줄을 버린다", () => {
        const chunk = `ial":1}\n${JSON.stringify({ type: "user" })}\n{"type":"assis`;
        expect(parseTail(chunk, { truncated: true })).toEqual([
            { type: "user" },
        ]);
    });

    it("마지막 assistant 메시지의 글 조각을 모은다", () => {
        const entries = [
            assistant("a", [{ type: "text", text: "이전 답" }]),
            assistant("b", [{ type: "thinking", thinking: "..." }]),
            assistant("b", [{ type: "text", text: "첫 줄" }]),
            assistant("b", [{ type: "text", text: "둘째 줄" }]),
            assistant("c", [{ type: "text", text: "API Error" }], {
                message: { id: "c", model: "<synthetic>", content: [] },
            }),
            { type: "system", subtype: "stop_hook_summary" },
        ];
        expect(lastAssistantText(entries)).toBe("첫 줄\n둘째 줄");
    });

    it("마지막 메시지가 도구 호출뿐이면 글이 없다고 본다", () => {
        const entries = [
            assistant("a", [{ type: "text", text: "이전 답" }]),
            assistant("b", [{ type: "tool_use", name: "Bash", input: {} }]),
        ];
        expect(lastAssistantText(entries)).toBeNull();
    });
});

describe("세션 넘기기 판정", () => {
    const answeredAt = "2026-10-27T01:00:00.000Z";
    const minutesLater = (minutes: number) =>
        Date.parse(answeredAt) + minutes * 60_000;
    const longSession = [
        { type: "user", timestamp: "2026-10-27T00:59:00.000Z" },
        assistant("a", [{ type: "text", text: "이전 답" }], {
            timestamp: answeredAt,
        }),
    ];

    it("마지막 답 시각과 input · 캐시 읽기 · 캐시 쓰기를 더한 컨텍스트 크기를 읽는다", () => {
        expect(lastTurnState(longSession)).toEqual({
            at: Date.parse(answeredAt),
            tokens: 600_502,
        });
    });

    it("기준보다 오래 쉰 긴 세션이면 쉰 시간 · 크기와 넘기라는 글을 준다", () => {
        const context = judgeHandoff(longSession, {
            prompt: "다음 작업 해 줘",
            now: minutesLater(83),
        });
        expect(context).toContain("83분 쉬었고 컨텍스트는 601k 토큰");
        expect(context).toContain("새 세션으로 넘기고");
    });

    it("기준보다 덜 쉬었거나 짧은 세션이면 넣지 않는다", () => {
        expect(
            judgeHandoff(longSession, {
                prompt: "이어서",
                now: minutesLater(HANDOFF_IDLE_MINUTES - 1),
            })
        ).toBeNull();
        const shortSession = [
            assistant("a", [{ type: "text", text: "이전 답" }], {
                timestamp: answeredAt,
                message: {
                    id: "a",
                    model: "claude-opus-5-5",
                    content: [],
                    usage: { input_tokens: HANDOFF_MIN_TOKENS - 1 },
                },
            }),
        ];
        expect(
            judgeHandoff(shortSession, {
                prompt: "이어서",
                now: minutesLater(200),
            })
        ).toBeNull();
    });

    it("답 뒤에 압축됐으면 압축 뒤 크기로 판정한다", () => {
        const compacted = [
            ...longSession,
            {
                type: "system",
                subtype: "compact_boundary",
                compactMetadata: { preTokens: 600_502, postTokens: 26_650 },
            },
        ];
        expect(lastTurnState(compacted)?.tokens).toBe(26_650);
        expect(
            judgeHandoff(compacted, {
                prompt: "이어서",
                now: minutesLater(200),
            })
        ).toBeNull();
    });

    it("하네스가 넣은 메시지 · 답이 없는 새 세션에는 넣지 않는다", () => {
        expect(isMachinePrompt("<task-notification>\n<task-id>")).toBe(true);
        expect(isMachinePrompt("<side-sessions-event>")).toBe(true);
        expect(isMachinePrompt("다음 작업 해 줘")).toBe(false);
        expect(
            judgeHandoff(longSession, {
                prompt: "<task-notification>",
                now: minutesLater(200),
            })
        ).toBeNull();
        expect(
            judgeHandoff([{ type: "user" }], {
                prompt: "첫 메시지",
                now: minutesLater(200),
            })
        ).toBeNull();
    });
});

describe("훅 스크립트", () => {
    const directory = mkdtempSync(join(tmpdir(), "noslog-hooks-"));
    const run = (script: string, input: unknown) =>
        execFileSync("node", [`.claude/hooks/${script}`], {
            input: JSON.stringify(input),
            encoding: "utf8",
        });

    it("check-korean 은 영어 답을 막는다", () => {
        const transcript = join(directory, "english.jsonl");
        writeFileSync(
            transcript,
            `${JSON.stringify(assistant("a", [{ type: "text", text: english }]))}\n`
        );
        const output = JSON.parse(
            run("check-korean.mjs", {
                hook_event_name: "Stop",
                stop_hook_active: false,
                transcript_path: transcript,
            })
        );
        expect(output.decision).toBe("block");
    });

    it("session-handoff 는 오래 쉰 긴 세션에 넘기기 글을 넣고, 기록이 없으면 아무것도 쓰지 않는다", () => {
        const transcript = join(directory, "idle.jsonl");
        writeFileSync(
            transcript,
            `${JSON.stringify(
                assistant("a", [{ type: "text", text: korean }], {
                    timestamp: "2026-10-27T01:00:00.000Z",
                })
            )}\n`
        );
        const output = JSON.parse(
            run("session-handoff.mjs", {
                hook_event_name: "UserPromptSubmit",
                prompt: "다음 작업 해 줘",
                transcript_path: transcript,
            })
        );
        expect(output.hookSpecificOutput.additionalContext).toContain(
            "새 세션으로 넘기고"
        );
        expect(
            run("session-handoff.mjs", {
                hook_event_name: "UserPromptSubmit",
                prompt: "첫 메시지",
                transcript_path: join(directory, "missing.jsonl"),
            })
        ).toBe("");
    });

    it("settings.json 은 UserPromptSubmit 에 session-handoff 훅을 건다", () => {
        const settings = JSON.parse(
            readFileSync(".claude/settings.json", "utf8")
        );
        const commands = settings.hooks.UserPromptSubmit.flatMap(
            (entry: { hooks: { command: string }[] }) =>
                entry.hooks.map((hook) => hook.command)
        );
        expect(commands).toContainEqual(
            expect.stringMatching(/session-handoff\.mjs"$/)
        );
    });

    const ruleFiles = ["AGENTS.md", "docs/ai-check.md"];
    const turnContext = (file: string, projectDir = process.cwd()) =>
        execFileSync(
            "node",
            [join(process.cwd(), ".claude/hooks/turn-context.mjs"), file],
            {
                input: "{}",
                encoding: "utf8",
                stdio: "pipe",
                env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
            }
        );

    it("settings.json 은 규칙 파일마다 turn-context 훅을 하나씩 건다", () => {
        const settings = JSON.parse(
            readFileSync(".claude/settings.json", "utf8")
        );
        const commands = settings.hooks.UserPromptSubmit.flatMap(
            (entry: { hooks: { command: string }[] }) =>
                entry.hooks.map((hook) => hook.command)
        );
        for (const file of ruleFiles)
            expect(commands).toContainEqual(
                expect.stringMatching(
                    new RegExp(`turn-context\\.mjs" ${file}$`)
                )
            );
    });

    it.each(ruleFiles)(
        "turn-context 는 %s 원문 전체를 훅 출력 한도 안에서 넣는다",
        (file) => {
            const context = JSON.parse(turnContext(file)).hookSpecificOutput
                .additionalContext;
            expect(context.length).toBeLessThanOrEqual(HOOK_CONTEXT_MAX_CHARS);
            expect(context).toContain(readFileSync(file, "utf8"));
        }
    );

    it("turn-context 는 한도를 넘는 파일이면 stderr 로 알리고 exit 1", () => {
        writeFileSync(
            join(directory, "big.md"),
            "가".repeat(HOOK_CONTEXT_MAX_CHARS)
        );
        expect(() => turnContext("big.md", directory)).toThrow(/한도/);
    });

    it("turn-context 는 규칙 파일이 없으면 stderr 로 알리고 exit 1", () => {
        expect(() => turnContext("AGENTS.md", directory)).toThrow(/ENOENT/);
    });
});
