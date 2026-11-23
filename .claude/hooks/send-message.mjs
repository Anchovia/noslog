// PreToolUse 훅(SendMessage): 바로 위 세션이 아닌 곳으로 보내면 막는다(exit 2). 서브에이전트 호출은 통과.
import {
    failOpen,
    findSelf,
    judgeSendMessage,
    loadSessionMetas,
    readStdinJson,
} from "./rules.mjs";

try {
    const input = await readStdinJson();
    const metas = loadSessionMetas();
    const reason = judgeSendMessage({
        to: input.tool_input?.to ?? input.tool_input?.session_id,
        self: findSelf(metas, input.session_id),
        metas,
        isSubagent: Boolean(input.agent_id),
    });
    if (reason) {
        process.stderr.write(`${reason}\n`);
        process.exit(2);
    }
} catch (error) {
    failOpen("send-message", error);
}
