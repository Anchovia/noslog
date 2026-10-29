export type JsonBodyResult =
    { tooLarge: true } | { tooLarge: false; body: unknown };

// Content-Length 는 빠지거나 실제와 다를 수 있어, 읽은 바이트를 세다가 상한을 넘으면 끊는다.
// JSON 이 아니면 body 는 null — 호출하는 쪽 스키마가 400 으로 돌려보낸다
export async function readJsonBody(
    request: Request,
    maxBytes: number
): Promise<JsonBodyResult> {
    const declared = Number(request.headers.get("content-length"));
    if (Number.isFinite(declared) && declared > maxBytes)
        return { tooLarge: true };
    if (!request.body) return { tooLarge: false, body: null };

    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.byteLength;
        if (received > maxBytes) {
            await reader.cancel();
            return { tooLarge: true };
        }
        chunks.push(value);
    }

    try {
        return {
            tooLarge: false,
            body: JSON.parse(Buffer.concat(chunks).toString("utf8")),
        };
    } catch {
        return { tooLarge: false, body: null };
    }
}
