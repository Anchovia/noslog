import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
    HANDOFF_IDLE_MINUTES,
    HANDOFF_MIN_TOKENS,
    HOOK_CONTEXT_MAX_CHARS,
    hangulRatio,
    isMachinePrompt,
    judgeCallerLayer,
    descendantSessionIds,
    judgeReviewGate,
    judgeSendMessage,
    judgeSessionBrief,
    parseReviewRecords,
    readNotes,
    transcriptModel,
    findSelf,
    loadSessionMetas,
    judgeHandoff,
    judgeKorean,
    judgeSessionTier,
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
        // 「75분 넘게」 라 딱 기준 분은 넘기지 않고 1분 더 쉬어야 넣는다
        expect(
            judgeHandoff(longSession, {
                prompt: "이어서",
                now: minutesLater(HANDOFF_IDLE_MINUTES),
            })
        ).toBeNull();
        expect(
            judgeHandoff(longSession, {
                prompt: "이어서",
                now: minutesLater(HANDOFF_IDLE_MINUTES + 1),
            })
        ).not.toBeNull();
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

describe("세션 3층 판정", () => {
    const delegate =
        "실측 · 캡처 찍기 · 판 조립 · 게시는 Sonnet 세션을 띄워 맡긴다.";

    it("model 이 있고 손작업 낱말이 없으면 통과", () => {
        expect(
            judgeSessionTier({
                initiation: "user_asked",
                model: "opus",
                prompt: "숫자를 대조하고 정리한다",
            })
        ).toBeNull();
        expect(
            judgeSessionTier({ model: "sonnet", prompt: "캡처를 찍는다" })
        ).toBeNull();
    });

    it("model 이 없으면 막는다", () => {
        expect(
            judgeSessionTier({ initiation: "user_asked", prompt: "정리" })
        ).toContain("model 을 적으세요");
    });

    it("opus 에 손작업 낱말이 있으면 막는다", () => {
        expect(
            judgeSessionTier({ model: "opus", prompt: "9개를 다시 게시한다" })
        ).toContain("Opus 세션에 손작업이 들어 있습니다");
    });

    it("opus 라도 Sonnet 세션 위임 문장이 있으면 통과", () => {
        expect(
            judgeSessionTier({
                model: "opus",
                prompt: `대조한다. ${delegate}`,
            })
        ).toBeNull();
    });

    it("proposal_id 만 있는 호출은 통과", () => {
        expect(judgeSessionTier({ proposal_id: "p1" })).toBeNull();
    });

    it("proposal_id 가 있으면 prompt · background 가 함께 와도 model 없이 통과", () => {
        expect(
            judgeSessionTier({
                proposal_id: "p1",
                prompt: "9개를 다시 게시한다",
                background: true,
            })
        ).toBeNull();
    });

    it("offer 는 통과", () => {
        expect(
            judgeSessionTier({ initiation: "offer", title: "게시 작업" })
        ).toBeNull();
    });

    it("session-tier 스크립트는 막을 때 exit 2 와 stderr, 통과할 때 exit 0", () => {
        const run = (tool_input: unknown) =>
            spawnSync("node", [".claude/hooks/session-tier.mjs"], {
                input: JSON.stringify({
                    hook_event_name: "PreToolUse",
                    tool_name: "mcp__ccd_session__start_session",
                    tool_input,
                }),
                encoding: "utf8",
            });
        const blocked = run({ initiation: "user_asked", prompt: "정리" });
        expect(blocked.status).toBe(2);
        expect(blocked.stderr).toContain("model 을 적으세요");
        expect(run({ proposal_id: "p1" }).status).toBe(0);
    });

    it("settings.json 은 start_session 에 session-tier 훅을 건다", () => {
        const settings = JSON.parse(
            readFileSync(".claude/settings.json", "utf8")
        );
        const entry = settings.hooks.PreToolUse.find(
            (item: { matcher: string }) =>
                item.matcher === "mcp__ccd_session__start_session"
        );
        expect(entry.hooks[0].command).toMatch(/session-tier\.mjs"$/);
    });
});

const brief = [
    "목적: 대조",
    "출력 형식: 파일 하나",
    "도구와 출처: 기록",
    "범위 경계: 문서만",
    "투입 한도: 세션 하나",
].join("\n");

describe("지시문 다섯 칸", () => {
    it("다섯 칸이 모두 있으면 통과", () => {
        expect(
            judgeSessionBrief({ initiation: "user_asked", prompt: brief })
        ).toBeNull();
    });

    it("칸이 빠지면 빠진 칸 이름을 알리고 막는다", () => {
        const reason = judgeSessionBrief({
            prompt: brief.replace("투입 한도: 세션 하나", ""),
        });
        expect(reason).toContain("투입 한도:");
        expect(reason).not.toContain("「목적:」");
    });

    it("칸 이름이 줄 머리가 아니면 없는 것으로 본다", () => {
        expect(judgeSessionBrief({ prompt: "이 목적: 은 문장 안" })).toContain(
            "목적:"
        );
    });

    it("proposal_id · offer 는 통과", () => {
        expect(judgeSessionBrief({ proposal_id: "p1" })).toBeNull();
        expect(judgeSessionBrief({ initiation: "offer" })).toBeNull();
    });
});

describe("Sonnet 의 세션 개설", () => {
    it("Sonnet 세션이 부르면 막고 조사 취합에 요청하라고 알린다", () => {
        expect(
            judgeCallerLayer({ model: "sonnet" }, "claude-sonnet-5-5")
        ).toContain("조사 취합 세션에 인원 요청");
    });

    it("Opus 세션이거나 모델을 모르면 통과", () => {
        expect(judgeCallerLayer({}, "claude-opus-5-5")).toBeNull();
        expect(judgeCallerLayer({}, null)).toBeNull();
    });

    it("proposal_id · offer 는 Sonnet 이어도 통과", () => {
        expect(
            judgeCallerLayer({ proposal_id: "p1" }, "claude-sonnet-5-5")
        ).toBeNull();
        expect(
            judgeCallerLayer({ initiation: "offer" }, "claude-sonnet-5-5")
        ).toBeNull();
    });

    it("기록의 마지막 assistant 모델을 쓰고, 없으면 시작 model 항목을 쓴다", () => {
        expect(
            transcriptModel([
                assistant("a", [], {
                    message: { id: "a", model: "claude-opus-5-5", content: [] },
                }),
                {
                    type: "assistant",
                    message: {
                        id: "b",
                        model: "claude-sonnet-5-5",
                        content: [],
                    },
                },
            ])
        ).toBe("claude-sonnet-5-5");
        expect(
            transcriptModel([
                {
                    type: "attachment",
                    attachment: {
                        type: "model",
                        identity: { modelId: "claude-sonnet-5-5" },
                    },
                },
            ])
        ).toBe("claude-sonnet-5-5");
        expect(transcriptModel([])).toBeNull();
    });
});

const metas = [
    { sessionId: "local_top", cliSessionId: "c-top", title: "master" },
    {
        sessionId: "local_mid",
        cliSessionId: "c-mid",
        title: "취합",
        spawnedFrom: { sessionId: "local_top", name: "gather" },
    },
    {
        sessionId: "local_low",
        cliSessionId: "c-low",
        title: "조사",
        spawnedFrom: { sessionId: "local_mid", name: "worker" },
    },
];

describe("SendMessage 대상", () => {
    const mid = metas[1];
    const low = metas[2];

    it("바로 위 세션 id · 이름 · parent 는 통과", () => {
        for (const to of ["local_top", "master", "parent", "main"])
            expect(judgeSendMessage({ to, self: mid, metas })).toBeNull();
    });

    it("위 세션을 건너뛰면 막고 바로 위 세션 id 를 알린다", () => {
        expect(
            judgeSendMessage({ to: "local_top", self: low, metas })
        ).toContain("local_mid");
    });

    it("세션 메타에 있는 옆 세션은 막는다", () => {
        const sibling = {
            sessionId: "local_sib",
            title: "형제",
            spawnedFrom: { sessionId: "local_mid" },
        };
        expect(
            judgeSendMessage({
                to: "local_sib",
                self: low,
                metas: [...metas, sibling],
            })
        ).toContain("바로 위 세션");
    });

    it("세션 메타에 없는 이름 · agentId(자기 서브에이전트)는 통과", () => {
        expect(
            judgeSendMessage({ to: "researcher", self: low, metas })
        ).toBeNull();
        expect(
            judgeSendMessage({ to: "a1b2c3-d4e5", self: low, metas })
        ).toBeNull();
    });

    it("이 세션이 띄운 아래 세션에게 보내는 것은 통과", () => {
        expect(
            judgeSendMessage({ to: "local_low", self: mid, metas })
        ).toBeNull();
        expect(judgeSendMessage({ to: "worker", self: mid, metas })).toBeNull();
    });

    it("위 세션이 없는 최상위 · 서브에이전트 · 알 수 없는 세션은 통과", () => {
        expect(
            judgeSendMessage({ to: "anyone", self: metas[0], metas })
        ).toBeNull();
        expect(
            judgeSendMessage({ to: "x", self: low, metas, isSubagent: true })
        ).toBeNull();
        expect(judgeSendMessage({ to: "x", self: null, metas })).toBeNull();
    });

    it("메타 파일에서 cliSessionId 로 자기 세션을 찾는다", () => {
        const dir = mkdtempSync(join(tmpdir(), "sessions-"));
        mkdirSync(join(dir, "a", "b"), { recursive: true });
        writeFileSync(
            join(dir, "a", "b", "local_mid.json"),
            JSON.stringify(mid)
        );
        writeFileSync(join(dir, "a", "b", "local_broken.json"), "{");
        const loaded = loadSessionMetas(dir);
        expect(findSelf(loaded, "c-mid")?.sessionId).toBe("local_mid");
        expect(findSelf(loaded, "nope")).toBeNull();
    });

    it("send-message 스크립트는 막을 때 exit 2, 메타를 못 찾으면 exit 0", () => {
        const dir = mkdtempSync(join(tmpdir(), "sessions-"));
        mkdirSync(join(dir, "a", "b"), { recursive: true });
        for (const m of metas)
            writeFileSync(
                join(dir, "a", "b", `${m.sessionId}.json`),
                JSON.stringify(m)
            );
        const run = (session_id: string, to: string) =>
            spawnSync("node", [".claude/hooks/send-message.mjs"], {
                input: JSON.stringify({
                    hook_event_name: "PreToolUse",
                    tool_name: "SendMessage",
                    session_id,
                    tool_input: { to, message: "m" },
                }),
                encoding: "utf8",
                env: { ...process.env, CLAUDE_SESSIONS_DIR: dir },
            });
        const blocked = run("c-low", "local_top");
        expect(blocked.status).toBe(2);
        expect(blocked.stderr).toContain("local_mid");
        expect(run("c-low", "local_mid").status).toBe(0);
        expect(run("unknown", "local_top").status).toBe(0);
    });
});

const slug = "H5Lu1JRhUy3uAmpctf6RFJ";
function publishEntries(name: string, version: string, text: string) {
    return [
        {
            type: "assistant",
            message: {
                id: "m1",
                content: [
                    {
                        type: "tool_use",
                        id: "t1",
                        name,
                        input: { slug },
                    },
                ],
            },
        },
        {
            type: "user",
            message: {
                content: [
                    {
                        type: "tool_result",
                        tool_use_id: "t1",
                        content: `${text} https://claude.ai/artifact/${slug} (Version 2, version id ${version})`,
                    },
                ],
            },
        },
    ];
}
const report = `판을 올렸습니다. https://claude.ai/artifact/${slug}`;
const record = (version: string, reviewer: string, writer: string) =>
    parseReviewRecords(
        `- review: ${slug} version=${version} 검수=${reviewer} 쓴=${writer}`
    );

describe("검수 기록 Stop 게이트", () => {
    const read = publishEntries(
        "mcp__claude-artifacts__get_artifact",
        "1792852303-06a7",
        "Live"
    );

    it("review 줄을 읽는다", () => {
        expect(record("1792852303-06a7", "local_a", "local_b")).toEqual([
            {
                target: slug,
                version: "1792852303-06a7",
                reviewer: "local_a",
                writer: "local_b",
            },
        ]);
    });

    it("지금 버전의 검수 기록이 있고 검수 ≠ 쓴 세션이면 통과", () => {
        expect(
            judgeReviewGate({
                text: report,
                entries: read,
                records: record("1792852303-06a7", "local_a", "local_b"),
                model: "claude-opus-5-5",
            })
        ).toBeNull();
    });

    it("검수 기록이 없으면 막는다", () => {
        expect(
            judgeReviewGate({
                text: report,
                entries: read,
                records: [],
                model: "claude-opus-5-5",
            })
        ).toContain("검수 기록이 없습니다");
    });

    it("새 버전이 나오면 옛 버전 기록은 무효", () => {
        expect(
            judgeReviewGate({
                text: report,
                entries: read,
                records: record("1792850278-719f", "local_a", "local_b"),
                model: "claude-opus-5-5",
            })
        ).toContain("1792852303-06a7");
    });

    it("검수 세션이 쓴 세션과 같으면 막는다", () => {
        expect(
            judgeReviewGate({
                text: report,
                entries: read,
                records: record("1792852303-06a7", "local_b", "local_b"),
                model: "claude-opus-5-5",
            })
        ).toContain("쓴 세션은 자기 결과를 통과시키지 못합니다");
    });

    it("지금 version id 를 기록에서 못 찾으면 확인하라고 막는다", () => {
        expect(
            judgeReviewGate({
                text: report,
                entries: [],
                records: [],
                model: "claude-opus-5-5",
            })
        ).toContain("get_artifact");
    });

    it("이 세션이 직접 게시한 버전 · Sonnet 세션 · 아티팩트 없는 보고 · 재시도는 통과(교착 방지)", () => {
        const own = publishEntries(
            "mcp__claude-artifacts__publish_version",
            "1792852303-06a7",
            "Published"
        );
        const base = { text: report, records: [] };
        expect(
            judgeReviewGate({ ...base, entries: own, model: "claude-opus-5-5" })
        ).toBeNull();
        expect(
            judgeReviewGate({
                ...base,
                entries: read,
                model: "claude-sonnet-5-5",
            })
        ).toBeNull();
        expect(
            judgeReviewGate({
                text: "끝났습니다",
                entries: read,
                records: [],
                model: "claude-opus-5-5",
            })
        ).toBeNull();
        expect(
            judgeReviewGate({
                ...base,
                entries: read,
                model: "claude-opus-5-5",
                stopHookActive: true,
            })
        ).toBeNull();
    });
});

describe("검수 기록 폴더 고르기", () => {
    const metas = [
        { sessionId: "local_a" },
        { sessionId: "local_b", spawnedFrom: { sessionId: "local_a" } },
        { sessionId: "local_c", spawnedFrom: { sessionId: "local_b" } },
        { sessionId: "local_d", spawnedFrom: { sessionId: "local_x" } },
    ];
    it("자손 세션 id 를 사슬로 모은다", () => {
        expect(descendantSessionIds(metas, "local_a").sort()).toEqual([
            "local_b",
            "local_c",
        ]);
        expect(descendantSessionIds(metas, "local_c")).toEqual([]);
    });
    it("손자 폴더의 검수 기록은 통과하고 없는 version 은 막는다", () => {
        const dir = mkdtempSync(join(tmpdir(), "notes-"));
        mkdirSync(join(dir, "local_c"));
        writeFileSync(
            join(dir, "local_c", "REVIEW.md"),
            "review: SLUG version=v1 검수=local_r 쓴=local_w\n"
        );
        const records = parseReviewRecords(
            readNotes(
                descendantSessionIds(metas, "local_a").map((id) =>
                    join(dir, id)
                )
            )
        );
        expect(
            records.some((r) => r.target === "SLUG" && r.version === "v1")
        ).toBe(true);
        expect(records.some((r) => r.version === "v2")).toBe(false);
    });
});

describe("settings.json 훅 등록", () => {
    it("SendMessage 와 Stop 에 새 훅을 건다", () => {
        const settings = JSON.parse(
            readFileSync(".claude/settings.json", "utf8")
        );
        const send = settings.hooks.PreToolUse.find(
            (item: { matcher: string }) => /SendMessage/.test(item.matcher)
        );
        expect(send.hooks[0].command).toMatch(/send-message\.mjs"$/);
        const stop = JSON.stringify(settings.hooks.Stop);
        expect(stop).toContain("review-gate.mjs");
        expect(stop).toContain("check-korean.mjs");
    });
});
