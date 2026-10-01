/**
 * HTML 태그를 한 글자씩 읽어 건너뛴다. 정규식으로 여러 글자를 한 번에 지우면 「<scr<script>ipt>」 처럼
 * 겹친 태그가 지운 뒤 다시 생긴다(CodeQL js/incomplete-multi-character-sanitization).
 * 결과에는 < · > 가 하나도 남지 않는다 — 닫히지 않은 「<」 뒤 글자는 살리고 꺾쇠만 버린다
 */
export function stripTags(text: string): string {
    let out = "";
    let tag: string | null = null;
    for (const char of text) {
        if (tag === null) {
            if (char === "<") tag = "";
            else if (char !== ">") out += char;
        } else if (char === ">") {
            tag = null;
        } else if (char === "<") {
            out += tag;
            tag = "";
        } else {
            tag += char;
        }
    }
    return tag === null ? out : out + tag;
}

/**
 * 글 본문(마크다운)의 첫 문단을 메타 설명으로(2026-10-01 메타데이터 점검 B — 설명 = 제목 반복을 바꿈).
 * 제목 줄 · 이미지 · 코드 · 표 · 인용 표시와 링크 주소를 빼고 글자만 남겨 `max` 자 안으로, 넘치면 낱말 경계에서 자르고 「…」.
 * 글자가 없으면 null(호출하는 쪽이 제목 등으로 대신한다)
 */
export function markdownExcerpt(markdown: string, max = 120): string | null {
    const paragraphs = markdown
        .replace(/```[\s\S]*?```/g, "\n\n")
        .split(/\n\s*\n/)
        // 제목 줄만 있는 문단은 건너뛴다 — 「## 바뀐 점」 은 설명이 아니다
        .filter((block) => !/^\s*#{1,6}\s[^\n]*$/.test(block.trim()))
        .map((block) =>
            stripTags(
                block
                    .split("\n")
                    .filter((line) => !/^\s*(\|.*\||[-*_]{3,}\s*)$/.test(line))
                    .join(" ")
                    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
                    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
            )
                .replace(/^\s*(#{1,6}|[-*+]|\d+\.)\s+/g, "")
                .replace(/(\*\*|__|\*|_|~~|`)/g, "")
                .replace(/\s+/g, " ")
                .trim()
        )
        .filter(Boolean);
    const first = paragraphs[0];
    if (!first) return null;
    if (first.length <= max) return first;
    const cut = first.slice(0, max - 1);
    const space = cut.lastIndexOf(" ");
    return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trimEnd()}…`;
}
