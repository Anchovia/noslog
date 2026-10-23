/**
 * client_secret_basic(RFC 6749 §2.3.1) — Basic 헤더의 id · secret 은 base64 를 푼 뒤
 * application/x-www-form-urlencoded 로 한 번 더 디코딩한다. 형식이 틀리면 null(→ 401 invalid_client).
 */
export function parseBasicClientCredentials(header: string | null) {
    if (!header) return null;
    const match = /^basic\s+([A-Za-z0-9+/]+={0,2})\s*$/i.exec(header);
    if (!match) return null;
    const decoded = Buffer.from(match[1], "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator < 0) return null;
    try {
        const clientId = decodeFormComponent(decoded.slice(0, separator));
        const clientSecret = decodeFormComponent(decoded.slice(separator + 1));
        if (!clientId || !clientSecret) return null;
        return { clientId, clientSecret };
    } catch {
        return null;
    }
}

function decodeFormComponent(value: string) {
    return decodeURIComponent(value.replaceAll("+", " "));
}
