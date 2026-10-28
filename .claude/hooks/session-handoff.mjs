// UserPromptSubmit 훅: 오래 쉰 긴 세션이면 새 세션으로 넘기라는 글을 넣는다. 막지는 않는다.
// 훅 입력에는 쉰 시간 · 컨텍스트 크기가 없어 세션 기록 끝에서 잰다.
import { failOpen, judgeHandoff, readStdinJson, readTail } from "./rules.mjs";

try {
    const input = await readStdinJson();
    const additionalContext = judgeHandoff(
        readTail(input.transcript_path).entries,
        { prompt: input.prompt }
    );
    if (additionalContext)
        process.stdout.write(
            JSON.stringify({
                hookSpecificOutput: {
                    hookEventName: "UserPromptSubmit",
                    additionalContext,
                },
            })
        );
} catch (error) {
    failOpen("session-handoff", error);
}
