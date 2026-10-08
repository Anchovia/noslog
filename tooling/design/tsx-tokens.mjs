import ts from "typescript";

const appearanceProperty =
    /^(?:gap|rowGap|columnGap|padding\w*|margin\w*|border\w*Radius|fontSize)$/;
const colorProperty = /^(?:color|.*Color|background|fill|stroke)$/;
const colorValueProperty =
    /^(?:color|.*Color|background(?:Image)?|border(?:Top|Right|Bottom|Left)?|outline|boxShadow|textShadow|fill|stroke)$/;
const rawColor = /#[\da-f]{3,8}\b|\b(?:rgb|hsl)a?\(/i;
const lengths = /(-?\d*\.?\d+)(?:px|rem|em)\b/g;

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
    function visit(node) {
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
