// Stop 훅: 마지막 답이 한국어가 아니면 막고 한국어로 다시 쓰게 한다.
import {
    failOpen,
    judgeKorean,
    lastAssistantText,
    readStdinJson,
    readTail,
} from "./rules.mjs";

try {
    const input = await readStdinJson();
    if (!input.stop_hook_active) {
        const text =
            typeof input.last_assistant_message === "string"
                ? input.last_assistant_message
                : lastAssistantText(readTail(input.transcript_path).entries);
        const reason = judgeKorean(text);
        if (reason)
            process.stdout.write(JSON.stringify({ decision: "block", reason }));
    }
} catch (error) {
    failOpen("check-korean", error);
}
