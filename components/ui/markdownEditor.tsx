"use client";

import { Bold, Heading2, Link2, List, ListOrdered } from "lucide-react";
import { useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import IconButton from "@/components/ui/iconButton";

type Tool = "heading" | "bold" | "list" | "ordered" | "link";

export interface MarkdownEditorLabels {
    write: string;
    preview: string;
    tabs: string;
    tools: string;
    empty: string;
    heading: string;
    bold: string;
    list: string;
    ordered: string;
    link: string;
}

const TOOL_ICONS: Record<Tool, ReactNode> = {
    heading: <Heading2 className="nl-icon" aria-hidden />,
    bold: <Bold className="nl-icon" aria-hidden />,
    list: <List className="nl-icon" aria-hidden />,
    ordered: <ListOrdered className="nl-icon" aria-hidden />,
    link: <Link2 className="nl-icon" aria-hidden />,
};

// 줄 앞에 기호를 붙이는 도구 — 고른 줄 전부에
const LINE_PREFIX: Partial<Record<Tool, string>> = {
    heading: "## ",
    list: "- ",
    ordered: "1. ",
};

export function applyMarkdownTool(
    value: string,
    start: number,
    end: number,
    tool: Tool
) {
    const prefix = LINE_PREFIX[tool];
    if (prefix) {
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        const block = value.slice(lineStart, end);
        const next = block
            .split("\n")
            .map((line) => `${prefix}${line}`)
            .join("\n");
        return {
            value: value.slice(0, lineStart) + next + value.slice(end),
            start: start + prefix.length,
            end: lineStart + next.length,
        };
    }
    const selected = value.slice(start, end);
    if (tool === "bold") {
        const inner = selected || "";
        return {
            value: `${value.slice(0, start)}**${inner}**${value.slice(end)}`,
            start: start + 2,
            end: start + 2 + inner.length,
        };
    }
    // 링크 — 고른 글자를 링크 글자로, 주소 자리를 고른 상태로 둔다
    const text = `[${selected}](https://)`;
    const urlStart = start + selected.length + 3;
    return {
        value: value.slice(0, start) + text + value.slice(end),
        start: urlStart,
        end: urlStart + "https://".length,
    };
}

/**
 * 마크다운 입력 — 「쓰기 / 미리보기」 탭 + 서식 버튼(GitHub 구조, 2026-09-18 E2).
 * 상자 = 입력칸 경계 · 모서리 8, 머리 줄 = 컨트롤 높이(탭 · 서식 버튼 모두 L), 입력 = 16/24 · 안쪽 8/12 · 처음 16줄 · 글 따라 늘어남.
 * 서식 버튼은 렌더러가 그리는 요소(제목 · 굵게 · 목록 · 번호 · 링크)만. 미리보기는 공개 화면 렌더러를 받아 그린다.
 */
export default function MarkdownEditor({
    id,
    value,
    onChange,
    onBlur,
    name,
    inputRef,
    lang,
    maxLength,
    invalid,
    describedBy,
    readOnly,
    labels,
    renderPreview,
}: {
    id: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    name?: string;
    /** react-hook-form `field.ref` 같은 콜백 ref — 오류 때 포커스를 받는다 */
    inputRef?: (node: HTMLTextAreaElement | null) => void;
    lang?: string;
    maxLength?: number;
    invalid?: boolean;
    describedBy?: string;
    readOnly?: boolean;
    labels: MarkdownEditorLabels;
    renderPreview: (value: string) => ReactNode;
}) {
    const tabsId = useId();
    const [mode, setMode] = useState<"write" | "preview">("write");
    const textarea = useRef<HTMLTextAreaElement | null>(null);

    function setRefs(node: HTMLTextAreaElement | null) {
        textarea.current = node;
        inputRef?.(node);
    }

    function apply(tool: Tool) {
        const node = textarea.current;
        if (!node) return;
        const result = applyMarkdownTool(
            value,
            node.selectionStart,
            node.selectionEnd,
            tool
        );
        if (maxLength && result.value.length > maxLength) return;
        onChange(result.value);
        requestAnimationFrame(() => {
            node.focus();
            node.setSelectionRange(result.start, result.end);
        });
    }

    return (
        <div className="nl-markdown-editor" data-invalid={invalid || undefined}>
            <div className="nl-markdown-editor__head">
                <div
                    role="tablist"
                    aria-label={labels.tabs}
                    className="nl-tabs"
                >
                    {(["write", "preview"] as const).map((item) => (
                        <button
                            key={item}
                            type="button"
                            role="tab"
                            id={`${tabsId}-${item}`}
                            aria-selected={mode === item}
                            aria-controls={`${tabsId}-panel`}
                            data-state={mode === item ? "active" : "inactive"}
                            className="nl-tabs__item nl-control"
                            onClick={() => setMode(item)}
                        >
                            {labels[item]}
                        </button>
                    ))}
                </div>
                {mode === "write" ? (
                    <div
                        role="toolbar"
                        aria-label={labels.tools}
                        aria-controls={id}
                        className="nl-markdown-editor__tools"
                    >
                        {(Object.keys(TOOL_ICONS) as Tool[]).map((tool) => (
                            <IconButton
                                key={tool}
                                label={labels[tool]}
                                disabled={readOnly}
                                onClick={() => apply(tool)}
                            >
                                {TOOL_ICONS[tool]}
                            </IconButton>
                        ))}
                    </div>
                ) : null}
            </div>
            <div
                id={`${tabsId}-panel`}
                role="tabpanel"
                aria-labelledby={`${tabsId}-${mode}`}
            >
                {/* 쓰기 칸은 미리보기 중에도 마운트해 둔다 — 폼 값 · 선택 위치 · 되돌리기 기록 유지 */}
                <textarea
                    ref={setRefs}
                    id={id}
                    name={name}
                    lang={lang}
                    value={value}
                    maxLength={maxLength}
                    readOnly={readOnly}
                    hidden={mode !== "write"}
                    aria-invalid={invalid || undefined}
                    aria-describedby={describedBy}
                    className="nl-markdown-editor__input"
                    onChange={(event) => onChange(event.target.value)}
                    onBlur={onBlur}
                />
                {mode === "preview" ? (
                    <div className="nl-markdown-editor__preview" lang={lang}>
                        {value.trim() ? (
                            renderPreview(value)
                        ) : (
                            <p className="nl-body nl-muted">{labels.empty}</p>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
