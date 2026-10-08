import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import ts from "typescript";

// Existing type contracts and application adapters; no general upward-import exemption.
const retainedImports = new Map([
    ["lib/music/max-grade.ts", "components/music/music-detail-types"],
    ["lib/music/unlock-condition.ts", "components/music/music-detail-types"],
    ["lib/music/score-tone.ts", "components/ui/stat-strip"],
    ["components/ui/exam-badge.tsx", "features/exams/exam-grades"],
    [
        "components/ui/app-toaster.tsx",
        "features/settings/hooks/use-account-result-notice",
    ],
]);

function resolveImport(source, filename, root) {
    const absolute = source.startsWith("@/")
        ? path.resolve(root, source.slice(2))
        : source.startsWith(".")
          ? path.resolve(path.dirname(filename), source)
          : null;
    if (!absolute) return null;
    return path.relative(root, absolute).split(path.sep).join("/");
}

function moduleInfo(root, target) {
    for (const suffix of [
        "",
        ".ts",
        ".tsx",
        ".js",
        ".mjs",
        "/index.ts",
        "/index.tsx",
    ]) {
        const candidate = path.resolve(root, target + suffix);
        if (existsSync(candidate) && /\.[cm]?[jt]sx?$/.test(candidate)) {
            const ast = ts.createSourceFile(
                candidate,
                readFileSync(candidate, "utf8"),
                ts.ScriptTarget.Latest
            );
            const directives = [];
            for (const statement of ast.statements) {
                if (
                    !ts.isExpressionStatement(statement) ||
                    !ts.isStringLiteral(statement.expression)
                )
                    break;
                directives.push(statement.expression.text);
            }
            return {
                action: directives.includes("use server"),
                serverOnly: ast.statements.some(
                    (statement) =>
                        ts.isImportDeclaration(statement) &&
                        ts.isStringLiteral(statement.moduleSpecifier) &&
                        statement.moduleSpecifier.text === "server-only"
                ),
            };
        }
    }
    return { action: false, serverOnly: false };
}

const boundaries = {
    meta: {
        type: "problem",
        schema: [],
        messages: {
            upward: "하위 기반 코드에서 상위 레이어를 참조할 수 없습니다: {{target}}",
            route: "라우트 밖에서는 app의 화면 구현을 참조할 수 없습니다. 공개 Server Action만 허용합니다: {{target}}",
            private:
                "다른 라우트의 private 폴더를 참조할 수 없습니다: {{target}}",
            server: "Client Component에서 서버 구현을 직접 참조할 수 없습니다. Server Action 또는 브라우저 API를 사용하세요: {{target}}",
        },
    },
    create(context) {
        const root = context.cwd;
        const filename = context.filename;
        const owner = path.relative(root, filename).split(path.sep).join("/");
        const client = context.sourceCode.ast.body.some(
            (node) =>
                node.type === "ExpressionStatement" &&
                node.directive === "use client"
        );

        function check(node) {
            const source = node.source?.value;
            if (typeof source !== "string") return;
            const target = resolveImport(source, filename, root);
            if (!target) return;
            const typeOnly =
                node.importKind === "type" ||
                node.exportKind === "type" ||
                (node.type === "ImportDeclaration" &&
                    node.specifiers.length > 0 &&
                    node.specifiers.every(
                        (specifier) => specifier.importKind === "type"
                    ));
            const retained = retainedImports.get(owner) === target;
            if (retained && (!owner.startsWith("lib/") || typeOnly)) return;

            const privateIndex = target
                .split("/")
                .findIndex((part, index) => index > 0 && part.startsWith("_"));
            if (target.startsWith("app/") && privateIndex > 0) {
                const route =
                    target.split("/").slice(0, privateIndex).join("/") + "/";
                if (!owner.startsWith(route)) {
                    context.report({
                        node,
                        messageId: "private",
                        data: { target },
                    });
                    return;
                }
            }

            if (
                (owner.startsWith("lib/") &&
                    /^(app|features|components)\//.test(target)) ||
                (owner.startsWith("components/ui/") &&
                    /^(app|features)\//.test(target))
            ) {
                context.report({ node, messageId: "upward", data: { target } });
                return;
            }

            const { action, serverOnly } = moduleInfo(root, target);
            if (
                owner.startsWith("features/") &&
                target.startsWith("app/") &&
                !action
            ) {
                context.report({ node, messageId: "route", data: { target } });
                return;
            }
            if (
                client &&
                !typeOnly &&
                !action &&
                (/^features\/[^/]+\/server\//.test(target) ||
                    /^lib\/(db|session|env\/server)(\.|$|\/)/.test(target) ||
                    serverOnly)
            ) {
                context.report({ node, messageId: "server", data: { target } });
            }
        }

        return {
            ImportDeclaration: check,
            ExportNamedDeclaration: check,
            ExportAllDeclaration: check,
            ImportExpression: check,
        };
    },
};

const filenames = {
    meta: {
        type: "suggestion",
        schema: [],
        messages: {
            filename: "코드 파일명은 kebab-case를 사용하세요: {{name}}",
            directory: "내부 폴더명은 kebab-case를 사용하세요: {{name}}",
        },
    },
    create(context) {
        const owner = path
            .relative(context.cwd, context.filename)
            .split(path.sep)
            .join("/");
        // Public App Router segments and the preserved editor/viewer keep their names.
        if (owner.startsWith("../") || owner.includes("/chart-pattern/"))
            return {};
        const parts = owner.split("/");
        const valid = (part) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(part);
        return {
            Program(node) {
                const filename = parts.at(-1);
                if (!filename.split(".").every(valid)) {
                    context.report({
                        node,
                        messageId: "filename",
                        data: { name: filename },
                    });
                }
                for (const part of parts.slice(1, -1)) {
                    if (
                        parts[0] === "app" &&
                        !part.startsWith("(") &&
                        !part.startsWith("_")
                    )
                        continue;
                    const name = part.startsWith("(")
                        ? part.slice(1, -1)
                        : part.replace(/^_+|_+$/g, "");
                    if (!valid(name)) {
                        context.report({
                            node,
                            messageId: "directory",
                            data: { name: part },
                        });
                    }
                }
            },
        };
    },
};

const architecture = { rules: { boundaries, filenames } };
export default architecture;
