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
});
