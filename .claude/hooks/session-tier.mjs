// PreToolUse 훅(start_session): 세션 3층 · 지시문 다섯 칸 · Sonnet 직접 개설 금지를 어기면 막고 이유를 stderr 로 알린다(exit 2).
import {
    failOpen,
    findSelf,
    judgeCallerLayer,
    judgeSessionBrief,
    judgeSessionTier,
    loadSessionMetas,
    readStdinJson,
    readTail,
    transcriptModel,
} from "./rules.mjs";

try {
    const input = await readStdinJson();
    let reason =
        judgeSessionTier(input.tool_input) ??
        judgeSessionBrief(input.tool_input);
    if (!reason) {
        let model = null;
        if (input.transcript_path)
            model = transcriptModel(
                readTail(input.transcript_path, [8 * 1024 * 1024]).entries
            );
        model ??= findSelf(loadSessionMetas(), input.session_id)?.model ?? null;
        reason = judgeCallerLayer(input.tool_input, model);
    }
    if (reason) {
        process.stderr.write(`${reason}\n`);
        process.exit(2);
    }
} catch (error) {
    failOpen("session-tier", error);
}
