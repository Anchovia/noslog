// Stop 훅: 위 층에 올리는 보고의 아티팩트마다 지금 version id 의 검수 기록(검수 세션 ≠ 쓴 세션)이 없으면 막는다.
import { join } from "node:path";

import {
    descendantSessionIds,
    failOpen,
    findSelf,
    judgeReviewGate,
    lastAssistantText,
    loadSessionMetas,
    notesDir,
    parseReviewRecords,
    readNotes,
    readStdinJson,
    readTail,
    transcriptModel,
} from "./rules.mjs";

try {
    const input = await readStdinJson();
    const { entries } = readTail(input.transcript_path, [8 * 1024 * 1024]);
    const text = input.last_assistant_message ?? lastAssistantText(entries);
    const metas = loadSessionMetas();
    const self = findSelf(metas, input.session_id);
    const folders = [
        ...new Set(
            [
                self?.startChain?.firstSessionId,
                self?.spawnedFrom?.sessionId,
                self?.sessionId,
                ...(self ? descendantSessionIds(metas, self.sessionId) : []),
            ]
                .filter(Boolean)
                .map((id) => join(notesDir(), id))
        ),
    ];
    const reason = judgeReviewGate({
        text,
        entries,
        records: parseReviewRecords(readNotes(folders)),
        model: transcriptModel(entries) ?? self?.model,
        stopHookActive: input.stop_hook_active,
    });
    if (reason) {
        process.stderr.write(`${reason}\n`);
        process.exit(2);
    }
} catch (error) {
    failOpen("review-gate", error);
}
