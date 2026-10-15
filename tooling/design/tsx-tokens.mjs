import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";

import ts from "typescript";

const appearanceProperty =
    /^(?:gap|rowGap|columnGap|padding\w*|margin\w*|border\w*Radius|fontSize)$/;
const colorProperty = /^(?:color|.*Color|background|fill|stroke)$/;
const colorValueProperty =
    /^(?:color|.*Color|background(?:Image)?|border(?:Top|Right|Bottom|Left)?|outline|boxShadow|textShadow|fill|stroke)$/;
const rawColor = /#[\da-f]{3,8}\b|\b(?:rgb|hsl)a?\(/i;
const lengths = /(-?\d*\.?\d+)(?:px|rem|em)\b/g;

// Tailwind default scales and arbitrary values: only nl aliases, zero and keyword values pass (2026-10-15).
const classContext = /^(?:cn|clsx|cva|cx|twMerge)$/;
const scaleUtility =
    /^-?(?:p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|space-[xy]|(?:min-|max-)?[wh]|size|inset(?:-[xy])?|top|right|bottom|left|start|end|translate-[xy]|basis|indent|scroll-[mp][xytrblse]?|border(?:-[xytrblse])?|outline(?:-offset)?|ring(?:-offset)?|divide-[xy]|underline-offset|decoration|z|opacity|duration|delay|scale(?:-[xy])?|rotate|skew-[xy]|blur|leading)-(\d+(?:\.\d+)?|px)$/;
const namedUtility =
    /^(?:rounded(?:-[trblse]{1,2})?(?:-(?:xs|sm|md|lg|xl|\dxl|full))?|text-(?:xs|sm|base|lg|xl|\dxl)|font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)|(?:drop-|inset-|text-)?shadow(?:-(?:\dxs|xs|sm|md|lg|xl|\dxl|inner))?|leading-(?:none|tight|snug|normal|relaxed|loose)|tracking-(?:tighter|tight|wide|wider|widest)|blur(?:-(?:xs|sm|md|lg|xl|\dxl))?|ease-(?:linear|in|out|in-out)|max-w-(?:xs|sm|md|lg|xl|\dxl|prose|screen-\w+)|border(?:-[xytrblse])?|ring|outline)$/;

/** The utility part of a class, without variants (`md:`, `data-[x]:`) or importance. */
function utilityOf(token) {
    let depth = 0;
    let start = 0;
    for (let index = 0; index < token.length; index += 1) {
        if (token[index] === "[") depth += 1;
        else if (token[index] === "]") depth -= 1;
        else if (token[index] === ":" && depth === 0) start = index + 1;
    }
    return token.slice(start).replace(/^!|!$/g, "");
}

function tailwindProblem(token) {
    const utility = utilityOf(token);
    if (!utility || utility.startsWith("nl-") || /^[\w-]+-nl-/.test(utility))
        return null;
    if (/^-?[a-z][\w-]*-\[.*\]$|^\[.*\]$/.test(utility))
        return `arbitrary Tailwind value ${token} must use an nl alias`;
    const scale = utility.match(scaleUtility);
    if (scale) {
        const value = Number(scale[1]);
        if (
            value === 0 ||
            (/^(?:opacity|scale(?:-[xy])?)-/.test(utility) && value === 100)
        )
            return null;
        return `Tailwind default scale ${token} must use an nl alias`;
    }
    if (namedUtility.test(utility))
        return `Tailwind default scale ${token} must use an nl alias`;
    return null;
}

/** Inspect literal presentation values; runtime geometry/data remains the caller's responsibility. */
export function inspectTsxTokens(filename, source, declaredTokens) {
    const ast = ts.createSourceFile(
        filename,
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX
    );
    const violations = [];
    const constants = new Map();
    const duplicateNames = new Set();
    function collect(node) {
        if (
            ts.isVariableDeclaration(node) &&
            ts.isIdentifier(node.name) &&
            node.initializer &&
            node.parent.flags & ts.NodeFlags.Const
        ) {
            const name = node.name.text;
            if (constants.has(name)) duplicateNames.add(name);
            constants.set(name, node.initializer);
        }
        ts.forEachChild(node, collect);
    }
    collect(ast);
    duplicateNames.forEach((name) => constants.delete(name));
    function report(node, message) {
        const { line } = ast.getLineAndCharacterOfPosition(node.getStart(ast));
        violations.push(`${filename}:${line + 1}: ${message}`);
    }
    function unwrap(node, seen = new Set()) {
        if (
            ts.isAsExpression(node) ||
            ts.isSatisfiesExpression(node) ||
            ts.isParenthesizedExpression(node)
        )
            return unwrap(node.expression, seen);
        if (
            ts.isIdentifier(node) &&
            constants.has(node.text) &&
            !seen.has(node.text)
        )
            return unwrap(
                constants.get(node.text),
                new Set([...seen, node.text])
            );
        return node;
    }
    function bare(value) {
        let previous;
        do {
            previous = value;
            value = value.replace(
                /\b(?:var|calc|min|max|clamp)\([^()]*\)/g,
                ""
            );
        } while (value !== previous);
        return value;
    }
    function inspectStyle(node) {
        node = unwrap(node);
        if (ts.isConditionalExpression(node)) {
            inspectStyle(node.whenTrue);
            inspectStyle(node.whenFalse);
            return;
        }
        if (ts.isBinaryExpression(node)) {
            inspectStyle(node.left);
            inspectStyle(node.right);
            return;
        }
        if (!ts.isObjectLiteralExpression(node)) return;
        for (const property of node.properties) {
            if (ts.isSpreadAssignment(property)) {
                inspectStyle(property.expression);
                continue;
            }
            if (
                !ts.isPropertyAssignment(property) &&
                !ts.isShorthandPropertyAssignment(property)
            )
                continue;
            const name = property.name.getText(ast).replace(/^['"]|['"]$/g, "");
            if (name.startsWith("--")) continue;
            function inspectValue(expression) {
                const value = unwrap(expression);
                if (ts.isConditionalExpression(value)) {
                    inspectValue(value.whenTrue);
                    inspectValue(value.whenFalse);
                    return;
                }
                if (
                    appearanceProperty.test(name) &&
                    (ts.isNumericLiteral(value) ||
                        (ts.isPrefixUnaryExpression(value) &&
                            ts.isNumericLiteral(value.operand))) &&
                    Number(value.getText(ast)) !== 0
                )
                    report(
                        property,
                        `${name} must use a shared token, not ${value.getText(ast)}`
                    );
                if (!ts.isStringLiteralLike(value)) return;
                const text = bare(value.text);
                if (
                    appearanceProperty.test(name) &&
                    [...text.matchAll(lengths)].some(
                        (match) => Number(match[1]) !== 0
                    )
                )
                    report(
                        property,
                        `${name} must use a shared token, not ${value.text}`
                    );
                if (
                    (colorValueProperty.test(name) && rawColor.test(text)) ||
                    (colorProperty.test(name) &&
                        /^[a-z]+$/i.test(text) &&
                        !/^(?:transparent|currentColor|inherit|initial|unset|none)$/i.test(
                            text
                        ))
                )
                    report(
                        property,
                        `${name} must use a shared color token, not ${value.text}`
                    );
            }
            inspectValue(
                ts.isShorthandPropertyAssignment(property)
                    ? property.name
                    : property.initializer
            );
        }
    }
    function inspectText(node, value, dynamic = false) {
        for (const match of value.matchAll(/var\(\s*(--nl-[\w-]+)/g)) {
            const name = match[1];
            const complete =
                !dynamic || match.index + match[0].length < value.length;
            if (
                complete
                    ? !declaredTokens.has(name)
                    : ![...declaredTokens].some((token) =>
                          token.startsWith(name)
                      )
            )
                report(node, `unknown token ${name}${complete ? "" : "…"}`);
        }
        if (classStrings.has(node)) return;
        for (const match of value.matchAll(
            /(?:^|\s)(?:[\w-]+:)*(gap|gap-x|gap-y|p[trblxy]?|m[trblxy]?|rounded(?:-[trbl])?|text|bg|border|fill|stroke)-\[([^\]]+)\]/g
        )) {
            const [, utility, arbitrary] = match;
            const text = bare(arbitrary);
            if (
                rawColor.test(text) ||
                (/^(?:gap|p|m|rounded|text)/.test(utility) &&
                    [...text.matchAll(lengths)].some(
                        (length) => Number(length[1]) !== 0
                    ))
            )
                report(
                    node,
                    `arbitrary ${utility} value must use a shared token: ${arbitrary}`
                );
        }
    }
    // Class strings get the stricter Tailwind check below instead of the arbitrary-value check.
    const classStrings = new Set();
    function inspectClasses(node) {
        if (
            ts.isStringLiteralLike(node) ||
            ts.isTemplateHead(node) ||
            ts.isTemplateMiddle(node) ||
            ts.isTemplateTail(node)
        ) {
            classStrings.add(node);
            for (const token of node.text.split(/\s+/)) {
                const problem = token && tailwindProblem(token);
                if (problem) report(node, problem);
            }
        }
        if (ts.isTemplateExpression(node)) {
            inspectClasses(node.head);
            node.templateSpans.forEach((span) => {
                inspectClasses(span.expression);
                inspectClasses(span.literal);
            });
            return;
        }
        ts.forEachChild(node, inspectClasses);
    }
    function isClassContext(node) {
        const name =
            (ts.isJsxAttribute(node) ||
                ts.isPropertyAssignment(node) ||
                ts.isVariableDeclaration(node)) &&
            node.name.getText(ast).replace(/^['"]|['"]$/g, "");
        if (name && /class(?:name|es)?$/i.test(name)) return true;
        return (
            ts.isCallExpression(node) &&
            ts.isIdentifier(node.expression) &&
            classContext.test(node.expression.text)
        );
    }
    function visit(node) {
        if (isClassContext(node)) {
            inspectClasses(
                ts.isCallExpression(node) ? node : (node.initializer ?? node)
            );
        }
        if (ts.isStringLiteralLike(node)) inspectText(node, node.text);
        if (ts.isTemplateExpression(node)) {
            inspectText(node.head, node.head.text, true);
            node.templateSpans.forEach((span, index) =>
                inspectText(
                    span.literal,
                    span.literal.text,
                    index < node.templateSpans.length - 1
                )
            );
        }
        // Floating overlay offsets come from components/ui/overlay-position, not per-component numbers.
        if (
            ts.isJsxAttribute(node) &&
            /^(?:sideOffset|alignOffset|collisionPadding)$/.test(
                node.name.getText(ast)
            ) &&
            node.initializer &&
            ts.isJsxExpression(node.initializer) &&
            node.initializer.expression &&
            /[1-9]/.test(node.initializer.expression.getText(ast)) &&
            !/[A-Za-z_]/.test(node.initializer.expression.getText(ast))
        )
            report(
                node,
                `${node.name.getText(ast)} must use overlayPosition, not ${node.initializer.expression.getText(ast)}`
            );
        if (
            ts.isJsxAttribute(node) &&
            node.name.getText(ast) === "style" &&
            node.initializer &&
            ts.isJsxExpression(node.initializer) &&
            node.initializer.expression
        )
            inspectStyle(node.initializer.expression);
        ts.forEachChild(node, visit);
    }
    visit(ast);
    return [...new Set(violations)];
}

const sourceExtensions = [".tsx", ".ts", ".jsx", ".js", ".mjs"];

function resolveImport(root, from, specifier) {
    let base;
    if (specifier.startsWith("@/")) base = join(root, specifier.slice(2));
    else if (specifier.startsWith(".")) base = join(dirname(from), specifier);
    else return null;
    const candidates = [
        base,
        ...sourceExtensions.map((extension) => base + extension),
        ...sourceExtensions.map((extension) => join(base, `index${extension}`)),
    ];
    return (
        candidates.find(
            (candidate) => existsSync(candidate) && statSync(candidate).isFile()
        ) ?? null
    );
}

/**
 * TSX files reachable by imports from routes outside `excludedRoutes`.
 * Components that only an excluded route (e.g. /admin) imports are left out on their own.
 */
export function reachableTsxFiles(root, { routes = "app", excludedRoutes }) {
    const entries = [];
    (function walk(directory) {
        for (const entry of readdirSync(directory, { withFileTypes: true })) {
            const path = join(directory, entry.name);
            if (excludedRoutes.test(relative(root, path))) continue;
            if (entry.isDirectory()) walk(path);
            else if (
                sourceExtensions.some((extension) => path.endsWith(extension))
            )
                entries.push(path);
        }
    })(join(root, routes));
    const seen = new Set();
    const queue = [...entries];
    while (queue.length) {
        const file = queue.pop();
        if (seen.has(file)) continue;
        seen.add(file);
        const ast = ts.createSourceFile(
            file,
            readFileSync(file, "utf8"),
            ts.ScriptTarget.Latest,
            false,
            file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
        );
        (function collect(node) {
            const specifier =
                (ts.isImportDeclaration(node) ||
                    ts.isExportDeclaration(node)) &&
                node.moduleSpecifier
                    ? node.moduleSpecifier
                    : ts.isCallExpression(node) &&
                        node.expression.kind === ts.SyntaxKind.ImportKeyword
                      ? node.arguments[0]
                      : null;
            if (specifier && ts.isStringLiteralLike(specifier)) {
                const target = resolveImport(root, file, specifier.text);
                if (target && !seen.has(target)) queue.push(target);
            }
            ts.forEachChild(node, collect);
        })(ast);
    }
    return [...seen]
        .filter((file) => file.endsWith(".tsx"))
        .map((file) => relative(root, file))
        .sort();
}
