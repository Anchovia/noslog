import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import postcss from "postcss";

const directory = "app/styles/tokens";

/** 토큰 파일 전체를 이은 글 */
export const tokenCss = readdirSync(directory)
    .filter((name) => name.endsWith(".css"))
    .sort()
    .map((name) => readFileSync(join(directory, name), "utf8"))
    .join("\n");

/** 선택자가 꼭 `selector` 인 맨 위 규칙들의 선언(`--이름: 값;` 줄) */
export function tokenBlock(selector: string) {
    const lines: string[] = [];
    postcss.parse(tokenCss).each((node) => {
        if (node.type !== "rule" || node.selector !== selector) return;
        node.walkDecls((decl) => {
            lines.push(`${decl.prop}: ${decl.value};`);
        });
    });
    return lines.join("\n");
}

const dark = new Map(
    tokenBlock(".noslog-ui")
        .split("\n")
        .map((line) => {
            const at = line.indexOf(":");
            return [line.slice(0, at), line.slice(at + 2, -1)] as const;
        })
);

/** 다크 기본값. 회색 단계를 가리키는 역할 토큰은 그 단계의 값으로 푼다 */
export function darkToken(name: string) {
    const value = dark.get(`--nl-${name}`);
    const step = value?.match(/^var\((--nl-gray-\d+)\)$/)?.[1];
    return step ? dark.get(step) : value;
}
