// PreToolUse 훅(start_session): 세션 3층 규칙을 어기면 막고 이유를 stderr 로 알린다(exit 2).
import { failOpen, judgeSessionTier, readStdinJson } from "./rules.mjs";

try {
    const input = await readStdinJson();
    const reason = judgeSessionTier(input.tool_input);
    if (reason) {
        process.stderr.write(`${reason}\n`);
        process.exit(2);
    }
} catch (error) {
    failOpen("session-tier", error);
}
