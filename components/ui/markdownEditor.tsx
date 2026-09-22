"use client";

import {
    Bold,
    Code,
    Heading,
    ImagePlus,
    Italic,
    Link2,
    List,
    ListOrdered,
    Minus,
    Quote,
    Strikethrough,
    Table,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { ClipboardEvent, DragEvent, ReactNode } from "react";
import { toast } from "sonner";
import ActionButton from "@/components/ui/actionButton";
import ActionMenu from "@/components/ui/actionMenu";
import FullScreenDialog from "@/components/ui/fullScreenDialog";
import IconButton from "@/components/ui/iconButton";
import { IMAGE_ACCEPT, imageFileValidationError } from "@/lib/imageUploadRules";

type Tool =
    | "heading"
    | "subheading"
    | "bold"
    | "italic"
    | "strike"
    | "quote"
    | "code"
    | "table"
    | "rule"
    | "list"
    | "ordered"
    | "link";

/** 머리 줄에 아이콘으로 나오는 도구 — 소제목은 단계 메뉴라 여기 없다(2026-09-23 T-c) */
const TOOLBAR: Exclude<Tool, "heading" | "subheading">[] = [
    "bold",
    "italic",
    "strike",
    "quote",
    "code",
    "table",
    "rule",
    "list",
    "ordered",
    "link",
];

export interface MarkdownEditorLabels {
    write: string;
    preview: string;
    tabs: string;
    tools: string;
    empty: string;
    /** 미리보기 창에서 편집으로 돌아가는 버튼 */
    back: string;
    /** 소제목 단계 메뉴 — 트리거와 두 항목 */
    headings: string;
    heading: string;
    subheading: string;
    bold: string;
    italic: string;
    strike: string;
    quote: string;
    code: string;
    table: string;
    rule: string;
    list: string;
    ordered: string;
    link: string;
    /** 표 버튼이 넣는 틀 — 머리 · 칸 글자가 화면 말이라 부르는 쪽이 준다 */
    tableBlock?: string;
    /** 본문 이미지(2026-09-18) — 올리기를 받을 때만 쓴다 */
    image?: string;
    uploading?: string;
    invalidImage?: string;
    uploadFailed?: string;
}

const TOOL_ICONS: Record<Exclude<Tool, "heading" | "subheading">, ReactNode> = {
    bold: <Bold className="nl-icon" aria-hidden />,
    italic: <Italic className="nl-icon" aria-hidden />,
    strike: <Strikethrough className="nl-icon" aria-hidden />,
    quote: <Quote className="nl-icon" aria-hidden />,
    code: <Code className="nl-icon" aria-hidden />,
    table: <Table className="nl-icon" aria-hidden />,
    rule: <Minus className="nl-icon" aria-hidden />,
    list: <List className="nl-icon" aria-hidden />,
    ordered: <ListOrdered className="nl-icon" aria-hidden />,
    link: <Link2 className="nl-icon" aria-hidden />,
};

// 줄 앞에 기호를 붙이는 도구 — 고른 줄 전부에
const LINE_PREFIX: Partial<Record<Tool, string>> = {
    heading: "## ",
    subheading: "### ",
    quote: "> ",
    list: "- ",
    ordered: "1. ",
};

// 고른 글자를 감싸는 도구 — 감싼 뒤 안쪽 글자를 고른 상태로 둔다
const WRAP: Partial<Record<Tool, string>> = {
    bold: "**",
    italic: "*",
    strike: "~~",
    code: "`",
};

export function applyMarkdownTool(
    value: string,
    start: number,
    end: number,
    tool: Tool,
    /** 표 틀 — 머리 · 칸 글자는 화면 말을 따르므로 부르는 쪽이 준다 */
    tableBlock = "| A | B |\n| --- | --- |\n|  |  |"
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
    const wrap = WRAP[tool];
    if (wrap) {
        return {
            value: `${value.slice(0, start)}${wrap}${selected}${wrap}${value.slice(end)}`,
            start: start + wrap.length,
            end: start + wrap.length + selected.length,
        };
    }
    // 덩이로 넣는 도구(구분선 · 표) — 앞뒤로 빈 줄을 만들어 문단이 붙지 않게 한다
    if (tool === "rule" || tool === "table") {
        const body = tool === "rule" ? "---" : tableBlock;
        const before = value.slice(0, start).replace(/\n*$/u, "");
        const after = value.slice(end).replace(/^\n*/u, "");
        const head = before ? `${before}\n\n` : "";
        const block = `${head}${body}`;
        return {
            value: `${block}${after ? `\n\n${after}` : "\n"}`,
            start: head.length,
            end: head.length + body.length,
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
 * 서식 버튼은 렌더러가 그리는 요소(제목 · 굵게 · 목록 · 번호 · 링크 · 이미지)만. 미리보기는 공개 화면 렌더러를 받아 그린다.
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
    onUploadImage,
    onPrimaryAction,
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
    /** 이미지 한 장을 올리고 공개 주소를 돌려준다. 있으면 「이미지」 버튼 · 붙여 넣기 · 끌어다 놓기가 켜진다 */
    onUploadImage?: (file: File) => Promise<string>;
    /** Ctrl/Cmd + Enter 로 부르는 주 동작(게시 · 게시 요청, 2026-09-23 C) */
    onPrimaryAction?: () => void;
}) {
    const tabsId = useId();
    const [mode, setMode] = useState<"write" | "preview">("write");
    const textarea = useRef<HTMLTextAreaElement | null>(null);
    const fileInput = useRef<HTMLInputElement | null>(null);
    const uploads = useRef(0);
    // 올리는 동안 사용자가 계속 쓰므로 자리 표시를 바꿀 때는 가장 최근 값에서 바꾼다
    const latest = useRef(value);
    useEffect(() => {
        latest.current = value;
    }, [value]);
    const change = (next: string) => {
        latest.current = next;
        onChange(next);
    };

    // 커서 자리에 「![올리는 중… n]()」 → 끝나면 「![](주소)」, 실패하면 자리 표시를 지운다
    function insertImages(files: File[]) {
        if (!onUploadImage) return;
        const node = textarea.current;
        const images = files.filter((file) => {
            const ok = imageFileValidationError(file) === null;
            if (!ok && labels.invalidImage) toast.error(labels.invalidImage);
            return ok;
        });
        let cursor = node?.selectionStart ?? latest.current.length;
        for (const file of images) {
            const marker = `![${labels.uploading ?? "…"} ${(uploads.current += 1)}]()`;
            const current = latest.current;
            const before = current.slice(0, cursor);
            const pad = before && !before.endsWith("\n") ? "\n\n" : "";
            change(`${before}${pad}${marker}\n\n${current.slice(cursor)}`);
            cursor = before.length + pad.length + marker.length + 2;
            onUploadImage(file)
                .then((url) =>
                    change(latest.current.replace(marker, `![](${url})`))
                )
                .catch((error: unknown) => {
                    change(latest.current.replace(`${marker}\n\n`, ""));
                    toast.error(
                        error instanceof Error && error.message
                            ? error.message
                            : (labels.uploadFailed ?? "")
                    );
                });
        }
    }

    function pastedFiles(event: ClipboardEvent<HTMLTextAreaElement>) {
        const files = [...event.clipboardData.files];
        if (!onUploadImage || !files.length) return;
        event.preventDefault();
        insertImages(files);
    }
    function droppedFiles(event: DragEvent<HTMLTextAreaElement>) {
        const files = [...event.dataTransfer.files];
        if (!onUploadImage || !files.length) return;
        event.preventDefault();
        insertImages(files);
    }

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
            tool,
            labels.tableBlock
        );
        if (maxLength && result.value.length > maxLength) return;
        change(result.value);
        requestAnimationFrame(() => {
            node.focus();
            node.setSelectionRange(result.start, result.end);
        });
    }

    return (
        <div className="nl-markdown-editor" data-invalid={invalid || undefined}>
            <div className="nl-markdown-editor__head">
                {/* 「쓰기 / 미리보기」 2단 탭 — 미리보기 탭은 전체 화면 창을 연다(2026-09-23 P2 · 사용자 선택 A) */}
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
                            aria-haspopup={
                                item === "preview" ? "dialog" : undefined
                            }
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
                        {/* 소제목은 단계가 둘이라 그 버튼의 작은 메뉴로 묶는다(2026-09-23 T-c) */}
                        <ActionMenu
                            label={labels.headings}
                            disabled={readOnly}
                            icon={<Heading className="nl-icon" aria-hidden />}
                            items={[
                                {
                                    label: labels.heading,
                                    onSelect: () => apply("heading"),
                                },
                                {
                                    label: labels.subheading,
                                    onSelect: () => apply("subheading"),
                                },
                            ]}
                        />
                        {TOOLBAR.map((tool) => (
                            <IconButton
                                key={tool}
                                label={labels[tool]}
                                disabled={readOnly}
                                // 버튼을 눌러도 입력칸 포커스 · 고른 자리를 지킨다(2026-09-23)
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => apply(tool)}
                            >
                                {TOOL_ICONS[tool]}
                            </IconButton>
                        ))}
                        {onUploadImage && labels.image ? (
                            <>
                                <IconButton
                                    label={labels.image}
                                    disabled={readOnly}
                                    onClick={() => fileInput.current?.click()}
                                >
                                    <ImagePlus
                                        className="nl-icon"
                                        aria-hidden
                                    />
                                </IconButton>
                                <input
                                    ref={fileInput}
                                    type="file"
                                    accept={IMAGE_ACCEPT}
                                    multiple
                                    hidden
                                    onChange={(event) => {
                                        insertImages([
                                            ...(event.target.files ?? []),
                                        ]);
                                        event.target.value = "";
                                    }}
                                />
                            </>
                        ) : null}
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
                    onChange={(event) => change(event.target.value)}
                    // 굵게 · 기울임 단축키 — 확인한 에디터가 모두 쓰는 두 가지만(2026-09-23)
                    onKeyDown={(event) => {
                        if (!(event.metaKey || event.ctrlKey) || event.altKey)
                            return;
                        if (event.key === "Enter" && onPrimaryAction) {
                            event.preventDefault();
                            onPrimaryAction();
                            return;
                        }
                        const key = event.key.toLowerCase();
                        if (key !== "b" && key !== "i") return;
                        event.preventDefault();
                        apply(key === "b" ? "bold" : "italic");
                    }}
                    onBlur={onBlur}
                    onPaste={pastedFiles}
                    onDragOver={(event) => {
                        if (
                            onUploadImage &&
                            event.dataTransfer.types.includes("Files")
                        )
                            event.preventDefault();
                    }}
                    onDrop={droppedFiles}
                />
            </div>
            {/* 미리보기(2026-09-23 P2) = 전체 화면 창에 공개 화면 그대로 — 상자 안에서 글만 바뀌지 않는다 */}
            <FullScreenDialog
                open={mode === "preview"}
                onOpenChange={(open) => setMode(open ? "preview" : "write")}
                title={labels.preview}
                footer={
                    <ActionButton onClick={() => setMode("write")}>
                        {labels.back}
                    </ActionButton>
                }
            >
                <div className="nl-markdown-editor__preview" lang={lang}>
                    {value.trim() ? (
                        renderPreview(value)
                    ) : (
                        <p className="nl-body nl-muted">{labels.empty}</p>
                    )}
                </div>
            </FullScreenDialog>
        </div>
    );
}
