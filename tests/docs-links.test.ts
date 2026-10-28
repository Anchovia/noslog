import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

// 문서가 가리키는 파일 · 폴더가 실제로 있는지 본다. 파일을 옮기거나 지우면 여기서 걸린다.
// 보관 폴더(archive)는 그때 모습 그대로 두므로 뺀다. 조사 · 분석 · 결정 기록은 그날의 경로를 적은 기록이라 백틱 경로 검사만 뺀다.

const root = resolve(__dirname, "..");

function markdownFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) {
            return name === "archive" ? [] : markdownFiles(path);
        }
        return name.endsWith(".md") ? [path] : [];
    });
}

const files = [
    join(root, "AGENTS.md"),
    join(root, "CLAUDE.md"),
    join(root, "README.md"),
    ...markdownFiles(join(root, "docs")),
    ...markdownFiles(join(root, ".claude/skills")),
];

// 코드 블록 · 인라인 코드 안의 [..](..) 는 링크가 아니다
function withoutCode(text: string) {
    return text.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
}

function rel(path: string) {
    return relative(root, path);
}

describe("문서 링크", () => {
    it("상대 링크가 가리키는 파일 · 폴더가 있다", () => {
        const broken: string[] = [];
        for (const file of files) {
            const text = withoutCode(readFileSync(file, "utf8"));
            for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
                if (/^(https?:|mailto:|#)/.test(target)) continue;
                const path = decodeURI(
                    target.split("#")[0].replace(/:\d+$/, "")
                );
                if (!existsSync(resolve(dirname(file), path))) {
                    broken.push(`${rel(file)} → ${target}`);
                }
            }
        }
        expect(broken).toEqual([]);
    });

    it("CLAUDE.md 의 @ 임포트 파일이 있다", () => {
        const imports = readFileSync(join(root, "CLAUDE.md"), "utf8")
            .split("\n")
            .filter((line) => line.startsWith("@"))
            .map((line) => line.slice(1).trim());
        expect(imports.length).toBeGreaterThan(0);
        expect(imports.filter((path) => !existsSync(join(root, path)))).toEqual(
            []
        );
    });

    it("백틱 안 리포 경로가 있다", () => {
        const repoPath =
            /^(?:app|components|features|lib|docs|tests|e2e|prisma|scripts|\.claude|\.github)\/[^\s*<>{}[\]…|]+$/;
        const broken: string[] = [];
        for (const file of files) {
            if (/^docs\/(research|analysis|decisions)\//.test(rel(file)))
                continue;
            const text = readFileSync(file, "utf8").replace(
                /```[\s\S]*?```/g,
                ""
            );
            for (const [, code] of text.matchAll(/`([^`\n]+)`/g)) {
                const path = code
                    .replace(/:\d+(-\d+)?$/, "")
                    .replace(/#.*$/, "");
                if (!repoPath.test(path)) continue;
                const candidates = ["", ".ts", ".tsx", ".mjs", "/index.ts"];
                if (
                    !candidates.some((ext) =>
                        existsSync(join(root, path + ext))
                    )
                ) {
                    broken.push(`${rel(file)} → ${code}`);
                }
            }
        }
        expect(broken).toEqual([]);
    });
});

describe("결정 기록 목록", () => {
    const dir = join(root, "docs/decisions");
    const index = readFileSync(join(dir, "README.md"), "utf8");
    const decisionFiles = readdirSync(dir).filter((name) =>
        /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(name)
    );

    it("결정 파일마다 README 표에 한 줄이 있다", () => {
        expect(
            decisionFiles.filter((name) => !index.includes(`(./${name})`))
        ).toEqual([]);
    });

    it("결정 파일마다 상태 · 날짜 줄이 있고 날짜가 파일 이름과 같다", () => {
        const wrong = decisionFiles.filter((name) => {
            const text = readFileSync(join(dir, name), "utf8");
            const date = text.match(/^- 날짜: (\d{4}-\d{2}-\d{2})$/m)?.[1];
            return !/^- 상태: /m.test(text) || date !== name.slice(0, 10);
        });
        expect(wrong).toEqual([]);
    });

    // 새 결정이 옛 결정을 바꾸면 옛 파일 상태 줄과 README 표시를 함께 고친다. 한쪽만 고치면 옛 값이 「유효」 로 읽힌다.
    it("결정 파일 상태 줄과 README 표 표시가 같다", () => {
        const [active, replaced = ""] = index.split("## 대체됨");
        const kindOf = (status: string) =>
            status.startsWith("일부 대체됨")
                ? "일부 대체됨"
                : status.startsWith("대체됨")
                  ? "대체됨"
                  : "유효";
        const wrong = decisionFiles.flatMap((name) => {
            const status =
                readFileSync(join(dir, name), "utf8").match(
                    /^- 상태: (.*)$/m
                )?.[1] ?? "";
            const link = `(./${name})`;
            const row =
                active.split("\n").find((line) => line.includes(link)) ?? "";
            const listed = replaced.includes(link)
                ? "대체됨"
                : row.includes("(일부 대체됨)")
                  ? "일부 대체됨"
                  : "유효";
            const kind = kindOf(status);
            return kind === listed
                ? []
                : [`${name}: 파일 ${kind} · 표 ${listed}`];
        });
        expect(wrong).toEqual([]);
    });
});

describe("가이드 「바뀐 기록」", () => {
    // 링크 제목에 값을 적으면 결정이 바뀐 뒤 옛 값이 가이드 옆에 남는다. 값은 가이드 본문에만 둔다.
    // 「」 안 화면 문구와 「24곳 · 3단계」 같은 개수는 값이 아니다.
    const value =
        /\d+\s*(?:px|%|ms)|#[0-9a-fA-F]{3,8}\b|\d+\s*[:×]\s*\d+|`(?:--|nl-)[^`]*`|`[^`]*\/[^`]*`|(?<![\d.])\d+(?![\d.]|\s*(?:곳|건|단계|개|명|종|칸|단|번째|일|월|년))/;

    it("링크 제목에 크기 · 색 · 토큰 값이 없다", () => {
        const wrong = markdownFiles(join(root, "docs/design")).flatMap(
            (file) => {
                const text = readFileSync(file, "utf8");
                const start = text.indexOf("## 바뀐 기록");
                if (start < 0) return [];
                return text
                    .slice(start)
                    .split("\n")
                    .flatMap((line) => {
                        const title = line.match(
                            /^- \[\d{4}-\d{2}-\d{2} (.+?)\]\(/
                        )?.[1];
                        if (!title) return [];
                        return value.test(title.replace(/「[^」]*」/g, ""))
                            ? [`${rel(file)} → ${title}`]
                            : [];
                    });
            }
        );
        expect(wrong).toEqual([]);
    });
});

describe("조사 원문", () => {
    // 조사는 그것을 쓴 결정의 「근거」 에서 가리킨다(보관 기록은 백틱 경로로 적은 곳도 있다). 아무도 가리키지 않는 조사는 숫자를 다시 확인할 길이 끊긴다.
    it("docs/research 파일마다 다른 문서가 가리킨다", () => {
        const research = join(root, "docs/research");
        const sources = [
            ...files,
            join(root, "docs/decisions/archive/2026-09-10_2026-10-23.md"),
        ].map((file) => ({ file, text: readFileSync(file, "utf8") }));
        const orphans = readdirSync(research)
            .filter((name) => name.endsWith(".md"))
            .filter(
                (name) =>
                    !sources.some(
                        ({ file, text }) =>
                            file !== join(research, name) &&
                            text.includes(`research/${name}`)
                    )
            );
        expect(orphans).toEqual([]);
    });
});
