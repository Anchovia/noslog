// UserPromptSubmit 훅: 매 메시지마다 인자로 받은 규칙 파일 하나의 원문을 그대로 넣는다.
// Claude Code 는 훅 출력 문자열 하나가 10,000자를 넘으면 2,000자 미리보기만 넣으므로 파일마다 훅을 따로 건다.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { failOpen, HOOK_CONTEXT_MAX_CHARS } from "./rules.mjs";

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const file = process.argv[2];

try {
    if (!file) throw new Error("규칙 파일 인자 없음");
    const additionalContext = `===== ${file} (매 메시지마다 다시 읽은 원문) =====\n${readFileSync(join(root, file), "utf8")}`;
    if (additionalContext.length > HOOK_CONTEXT_MAX_CHARS)
        throw new Error(
            `${file} 가 ${additionalContext.length}자로 훅 출력 한도 ${HOOK_CONTEXT_MAX_CHARS}자를 넘는다. 파일을 줄이거나 나눈다.`
        );
    process.stdout.write(
        JSON.stringify({
            hookSpecificOutput: {
                hookEventName: "UserPromptSubmit",
                additionalContext,
            },
        })
    );
} catch (error) {
    failOpen("turn-context", error);
}
