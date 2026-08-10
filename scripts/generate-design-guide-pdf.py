#!/usr/bin/env python3
"""Build the versioned NosLog 2.0 design-guide PDF from canonical Markdown."""

from __future__ import annotations

import html
import importlib.util
import math
import os
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Flowable,
    HRFlowable,
    KeepTogether,
    LongTable,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.platypus.frames import Frame
from reportlab.platypus.tableofcontents import TableOfContents


ROOT = Path(__file__).resolve().parents[1]
DESIGN = ROOT / "docs" / "design"
DEFAULT_OUTPUT = ROOT / "output" / "pdf" / "noslog-2.0-design-guide-v0.1.pdf"
VISUAL_GENERATOR = ROOT / "scripts" / "generate-design-guide-visual-core.py"
VISUAL_VALIDATOR = ROOT / "scripts" / "validate-design-guide-visual-core.py"

SOURCE_NAMES = [
    "57-design-guide-remaining-work-audit.md",
    "01-current-product-audit.md",
    "02-information-architecture.md",
    "03-home-page-brief.md",
    "04-shared-discovery-page-brief.md",
    "05-music-detail-page-brief.md",
    "06-tier-list-page-brief.md",
    "07-chart-viewer-editor-preservation.md",
    "08-global-rankings-page-brief.md",
    "09-profile-page-brief.md",
    "10-bingo-page-brief.md",
    "11-exam-page-brief.md",
    "12-arcade-discovery-page-brief.md",
    "13-data-sync-page-brief.md",
    "14-announcements-page-brief.md",
    "15-shared-shell-navigation-brief.md",
    "16-settings-account-page-brief.md",
    "17-authentication-onboarding-page-brief.md",
    "18-privacy-data-practices-page-brief.md",
    "19-system-recovery-states-page-brief.md",
    "22-cross-cutting-reference-matrix.md",
    "24-foundation-v0.1.md",
    "25-foundation-v0.1-provenance.md",
    "63-foundation-v0.1-reusable-ui-regression.md",
    "64-downstream-design-implementation-handoff.md",
]

# ED-03: GitHub Primer light functional colors are the milestone PDF's editorial
# notation only. They are not NosLog product UI tokens and do not override the
# approved Foundation source or aliases in docs/design/24-foundation-v0.1.md.
INK = colors.HexColor("#1F2328")
SUBDUED = colors.HexColor("#59636E")
MUTED = colors.HexColor("#59636E")
LINE = colors.HexColor("#D1D9E0")
SOFT = colors.HexColor("#F6F8FA")
SOFTER = colors.HexColor("#F6F8FA")
ACCENT = colors.HexColor("#0969DA")
WHITE = colors.HexColor("#FFFFFF")

DASH_TRANSLATION = str.maketrans(
    {
        "\u2010": "-",
        "\u2011": "-",
        "\u2012": "-",
        "\u2013": "-",
        "\u2014": "-",
        "\u2015": "-",
        "\u2212": "-",
    }
)


def normalized(value: str) -> str:
    return value.translate(DASH_TRANSLATION)


def slug(value: str) -> str:
    value = normalized(value).lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or "section"


def register_fonts() -> tuple[str, str]:
    body_path = Path("/System/Library/Fonts/Supplemental/AppleGothic.ttf")
    mono_path = Path("/System/Library/Fonts/SFNSMono.ttf")
    if not body_path.exists():
        raise FileNotFoundError(f"Required CJK font not found: {body_path}")
    pdfmetrics.registerFont(TTFont("NosLogSans", str(body_path)))
    pdfmetrics.registerFontFamily(
        "NosLogSans",
        normal="NosLogSans",
        bold="NosLogSans",
        italic="NosLogSans",
        boldItalic="NosLogSans",
    )
    mono_name = "Courier"
    if mono_path.exists():
        try:
            pdfmetrics.registerFont(TTFont("NosLogMono", str(mono_path)))
            mono_name = "NosLogMono"
        except Exception:
            mono_name = "Courier"
    return "NosLogSans", mono_name


BODY_FONT, MONO_FONT = register_fonts()


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "cover_title": ParagraphStyle(
            "CoverTitle",
            parent=base["Title"],
            fontName=BODY_FONT,
            fontSize=31,
            leading=37,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=8 * mm,
        ),
        "cover_subtitle": ParagraphStyle(
            "CoverSubtitle",
            parent=base["Normal"],
            fontName=BODY_FONT,
            fontSize=13,
            leading=20,
            textColor=SUBDUED,
        ),
        "cover_kicker": ParagraphStyle(
            "CoverKicker",
            parent=base["Normal"],
            fontName=BODY_FONT,
            fontSize=8,
            leading=11,
            textColor=ACCENT,
            spaceAfter=5 * mm,
        ),
        "cover_meta": ParagraphStyle(
            "CoverMeta",
            parent=base["Normal"],
            fontName=BODY_FONT,
            fontSize=9,
            leading=14,
            textColor=INK,
        ),
        "doc_title": ParagraphStyle(
            "DocumentTitle",
            parent=base["Heading1"],
            fontName=BODY_FONT,
            fontSize=22,
            leading=28,
            textColor=INK,
            spaceBefore=0,
            spaceAfter=5 * mm,
            keepWithNext=True,
            borderColor=ACCENT,
            borderWidth=0,
            borderPadding=(0, 0, 0, 4 * mm),
            leftIndent=4 * mm,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName=BODY_FONT,
            fontSize=15,
            leading=20,
            textColor=INK,
            spaceBefore=7 * mm,
            spaceAfter=3 * mm,
            keepWithNext=True,
            borderColor=LINE,
            borderWidth=0,
            borderPadding=(0, 0, 1.6 * mm, 0),
        ),
        "h3": ParagraphStyle(
            "H3",
            parent=base["Heading3"],
            fontName=BODY_FONT,
            fontSize=11.5,
            leading=16,
            textColor=INK,
            spaceBefore=5 * mm,
            spaceAfter=2 * mm,
            keepWithNext=True,
        ),
        "h4": ParagraphStyle(
            "H4",
            parent=base["Heading4"],
            fontName=BODY_FONT,
            fontSize=9.5,
            leading=13,
            textColor=SUBDUED,
            spaceBefore=4 * mm,
            spaceAfter=1.5 * mm,
            keepWithNext=True,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName=BODY_FONT,
            fontSize=8.4,
            leading=12.6,
            textColor=INK,
            spaceAfter=2.3 * mm,
            splitLongWords=True,
            wordWrap="CJK",
            allowWidows=0,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["BodyText"],
            fontName=BODY_FONT,
            fontSize=7.2,
            leading=10.3,
            textColor=SUBDUED,
            splitLongWords=True,
            wordWrap="CJK",
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["BodyText"],
            fontName=BODY_FONT,
            fontSize=8.2,
            leading=12.2,
            leftIndent=5 * mm,
            firstLineIndent=-3.5 * mm,
            bulletIndent=1 * mm,
            textColor=INK,
            spaceAfter=1.4 * mm,
            splitLongWords=True,
            wordWrap="CJK",
        ),
        "quote": ParagraphStyle(
            "Quote",
            parent=base["BodyText"],
            fontName=BODY_FONT,
            fontSize=8.2,
            leading=12.2,
            leftIndent=7 * mm,
            rightIndent=3 * mm,
            borderColor=ACCENT,
            borderWidth=1.2,
            borderPadding=(2 * mm, 2 * mm, 2 * mm, 4 * mm),
            backColor=WHITE,
            textColor=SUBDUED,
            spaceAfter=2.5 * mm,
            splitLongWords=True,
            wordWrap="CJK",
        ),
        "code": ParagraphStyle(
            "Code",
            parent=base["Code"],
            fontName=MONO_FONT,
            fontSize=6.4,
            leading=9.2,
            textColor=INK,
            splitLongWords=True,
            wordWrap="CJK",
        ),
        "toc_title": ParagraphStyle(
            "TocTitle",
            parent=base["Heading1"],
            fontName=BODY_FONT,
            fontSize=20,
            leading=26,
            textColor=INK,
            spaceAfter=6 * mm,
        ),
        "source": ParagraphStyle(
            "SourcePath",
            parent=base["Normal"],
            fontName=MONO_FONT,
            fontSize=7,
            leading=10,
            textColor=SUBDUED,
            spaceAfter=5 * mm,
            leftIndent=4 * mm,
        ),
    }


STYLES = make_styles()


def markdown_inline(text: str, local_anchor_map: dict[str, str]) -> str:
    text = normalized(text.strip())
    tokens: list[str] = []

    def stash(fragment: str) -> str:
        marker = f"@@NOSLOGTOKEN{len(tokens)}@@"
        tokens.append(fragment)
        return marker

    def code_repl(match: re.Match[str]) -> str:
        value = html.escape(match.group(1))
        return stash(f'<font name="{MONO_FONT}" color="#1F2328">{value}</font>')

    def link_repl(match: re.Match[str]) -> str:
        label = html.escape(normalized(match.group(1)))
        target = match.group(2).strip("<>")
        target_file = target.split("#", 1)[0]
        target_fragment = target.split("#", 1)[1] if "#" in target else ""
        basename = Path(target_file).name if target_file else ""
        if basename in local_anchor_map:
            href = f"#{local_anchor_map[basename]}"
            if target_fragment:
                href = f"#{local_anchor_map[basename]}-{slug(target_fragment)}"
        elif target.startswith("#"):
            href = f"#{slug(target_fragment)}"
        else:
            href = target
        return stash(
            f'<a href="{html.escape(href, quote=True)}" color="#0969DA">'
            f"<u>{label}</u></a>"
        )

    text = re.sub(r"`([^`]+)`", code_repl, text)
    text = re.sub(r"\[([^\]]+)\]\((<[^>]+>|[^)]+)\)", link_repl, text)
    text = html.escape(text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", text)
    for idx, fragment in enumerate(tokens):
        text = text.replace(f"@@NOSLOGTOKEN{idx}@@", fragment)
    return text


def paragraph(text: str, style: str, anchors: dict[str, str]) -> Paragraph:
    return Paragraph(markdown_inline(text, anchors), STYLES[style])


def table_widths(rows: list[list[str]], available_width: float) -> list[float]:
    count = max(len(row) for row in rows)
    maxima = []
    for col in range(count):
        lengths = [len(re.sub(r"[`*_\[\]()]", "", row[col])) for row in rows if col < len(row)]
        longest = max(lengths or [12])
        maxima.append(max(9.0, min(38.0, 3.2 * math.sqrt(longest))))
    total = sum(maxima)
    return [available_width * value / total for value in maxima]


def markdown_table(
    rows: list[list[str]], anchors: dict[str, str], available_width: float
) -> LongTable:
    col_count = max(len(row) for row in rows)
    normalized_rows = [row + [""] * (col_count - len(row)) for row in rows]
    font_size = 7.4 if col_count <= 2 else 6.8 if col_count == 3 else 6.1
    leading = font_size + 2.3
    cell_style = ParagraphStyle(
        f"TableCell{col_count}",
        parent=STYLES["small"],
        fontName=BODY_FONT,
        fontSize=font_size,
        leading=leading,
        textColor=INK,
        splitLongWords=True,
        wordWrap="CJK",
    )
    header_style = ParagraphStyle(
        f"TableHeader{col_count}",
        parent=cell_style,
        textColor=INK,
        leading=leading,
    )
    data = []
    for row_index, row in enumerate(normalized_rows):
        style = header_style if row_index == 0 else cell_style
        data.append([Paragraph(markdown_inline(cell, anchors), style) for cell in row])
    table = LongTable(
        data,
        colWidths=table_widths(normalized_rows, available_width),
        repeatRows=1,
        hAlign="LEFT",
        splitByRow=1,
        splitInRow=1,
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), SOFT),
                ("TEXTCOLOR", (0, 0), (-1, -1), INK),
                ("GRID", (0, 0), (-1, -1), 0.35, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, WHITE]),
            ]
        )
    )
    return table


def code_block(lines: list[str]) -> Table:
    safe = []
    for raw in lines or [""]:
        line = html.escape(normalized(raw)).replace(" ", "&#160;")
        line = line.replace("/", "/&#8203;").replace(".", ".&#8203;")
        safe.append(line)
    content = Paragraph("<br/>".join(safe), STYLES["code"])
    box = Table([[content]], colWidths=[A4[0] - 36 * mm])
    box.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), SOFTER),
                ("BOX", (0, 0), (-1, -1), 0.5, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return box


def is_table_separator(line: str) -> bool:
    cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
    # Prettier emits `--:` for a narrow right-aligned column such as `#`.
    # Accept that normalized GFM delimiter as well as the three-dash form.
    return bool(cells) and all(re.fullmatch(r":?-{2,}:?", cell) for cell in cells)


def parse_table(lines: list[str], start: int) -> tuple[list[list[str]], int] | None:
    if start + 1 >= len(lines) or "|" not in lines[start]:
        return None
    if not is_table_separator(lines[start + 1]):
        return None
    rows: list[list[str]] = []
    index = start
    while index < len(lines) and lines[index].strip() and "|" in lines[index]:
        if index != start + 1:
            rows.append([cell.strip() for cell in lines[index].strip().strip("|").split("|")])
        index += 1
    return rows, index


class GuideDocTemplate(BaseDocTemplate):
    def __init__(self, filename: str):
        super().__init__(
            filename,
            pagesize=A4,
            leftMargin=18 * mm,
            rightMargin=18 * mm,
            topMargin=19 * mm,
            bottomMargin=18 * mm,
            title="NosLog 2.0 Design Guide v0.1",
            author="NosLog",
            subject="Authoritative NosLog 2.0 design-guide milestone",
            creator="NosLog design-guide source generator",
            keywords="NosLog, NOSTALGIA, design guide, accessibility, handoff",
        )
        frame = Frame(
            self.leftMargin,
            self.bottomMargin,
            self.width,
            self.height,
            id="normal",
        )
        plate_frame = Frame(
            self.leftMargin,
            self.bottomMargin,
            self.width,
            self.height,
            id="plate",
        )
        self.addPageTemplates(
            [
                PageTemplate(id="guide", frames=[frame], onPage=draw_page),
                PageTemplate(id="plate", frames=[plate_frame]),
            ]
        )

    def afterFlowable(self, flowable):
        level = getattr(flowable, "_outlineLevel", None)
        title = getattr(flowable, "_outlineTitle", None)
        anchor = getattr(flowable, "_bookmarkName", None)
        if level is None or not title or not anchor:
            return
        self.canv.bookmarkPage(anchor)
        self.canv.addOutlineEntry(title, anchor, level=level, closed=level > 0)
        if level <= 1:
            self.notify("TOCEntry", (level, title, self.page, anchor))


class ApprovedVisualPlate(Flowable):
    def __init__(self, visual_module, title: str, draw_plate, index: int):
        super().__init__()
        self.visual_module = visual_module
        self.draw_plate = draw_plate
        self.width = 1
        self.height = 1
        self._outlineLevel = 1
        self._outlineTitle = title
        self._bookmarkName = f"approved-plate-{slug(title)}"

    def wrap(self, available_width, available_height):
        return 1, 1

    def drawOn(self, canvas, x, y, _sW=0):
        self.visual_module.ARTIFACT_MODE = "milestone"
        self.visual_module.AUTO_SHOW_PAGE = False
        self.draw_plate(canvas)


class ApprovedVisualSectionStart(Flowable):
    def __init__(self):
        super().__init__()
        self.width = 1
        self.height = 0.1
        self._outlineLevel = 0
        self._outlineTitle = "Approved visual system plates"
        self._bookmarkName = "approved-visual-system-plates"

    def wrap(self, available_width, available_height):
        return 1, 0.1

    def draw(self):
        return None


def load_visual_module():
    spec = importlib.util.spec_from_file_location("noslog_visual_plates", VISUAL_GENERATOR)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot load visual generator: {VISUAL_GENERATOR}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def visual_plate_story() -> list:
    environment = os.environ.copy()
    subprocess.run(
        [sys.executable, str(VISUAL_VALIDATOR)],
        cwd=ROOT,
        env=environment,
        check=True,
    )
    visual_module = load_visual_module()
    flows: list = [NextPageTemplate("plate"), PageBreak(), ApprovedVisualSectionStart()]
    for index, (title, draw_plate) in enumerate(visual_module.PLATE_SPECS):
        flows.append(ApprovedVisualPlate(visual_module, title, draw_plate, index))
        if index < len(visual_module.PLATE_SPECS) - 1:
            flows.append(PageBreak())
    flows.append(NextPageTemplate("guide"))
    return flows


def draw_page(canvas, doc):
    canvas.saveState()
    page = canvas.getPageNumber()
    if page > 1:
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(0.4)
        canvas.line(doc.leftMargin, A4[1] - 13 * mm, A4[0] - doc.rightMargin, A4[1] - 13 * mm)
        canvas.setFont(BODY_FONT, 6.8)
        canvas.setFillColor(MUTED)
        canvas.drawString(doc.leftMargin, A4[1] - 10.2 * mm, "NosLog 2.0 / Design system")
        canvas.setFillColor(ACCENT)
        canvas.circle(A4[0] - doc.rightMargin - 3 * mm, A4[1] - 10.6 * mm, 1.1 * mm, fill=1, stroke=0)
        canvas.setFillColor(MUTED)
        canvas.drawRightString(
            A4[0] - doc.rightMargin,
            9.5 * mm,
            f"{page}",
        )
    canvas.restoreState()


def heading_flowable(
    text: str, level: int, anchor: str, style_name: str, anchors: dict[str, str]
) -> Paragraph:
    flowable = Paragraph(
        f'<a name="{anchor}"/>{markdown_inline(text, anchors)}', STYLES[style_name]
    )
    flowable._outlineLevel = level
    flowable._outlineTitle = normalized(re.sub(r"[`*_]", "", text))
    flowable._bookmarkName = anchor
    return flowable


def parse_document(
    source: Path,
    source_index: int,
    anchors: dict[str, str],
    available_width: float,
) -> list:
    lines = source.read_text(encoding="utf-8").splitlines()
    flows: list = [PageBreak()]
    in_code = False
    code_lines: list[str] = []
    paragraph_lines: list[str] = []
    heading_counts: dict[str, int] = {}
    document_anchor = anchors[source.name]

    def flush_paragraph(*, keep_together: bool = False):
        if paragraph_lines:
            flow = paragraph(
                " ".join(part.strip() for part in paragraph_lines), "body", anchors
            )
            flows.append(KeepTogether([flow]) if keep_together else flow)
            paragraph_lines.clear()

    index = 0
    while index < len(lines):
        line = lines[index]
        stripped = line.strip()

        if stripped.startswith("```"):
            flush_paragraph()
            if in_code:
                flows.append(code_block(code_lines))
                flows.append(Spacer(1, 2.5 * mm))
                code_lines = []
                in_code = False
            else:
                in_code = True
            index += 1
            continue

        if in_code:
            code_lines.append(line)
            index += 1
            continue

        table_result = parse_table(lines, index)
        if table_result:
            flush_paragraph()
            rows, index = table_result
            flows.append(markdown_table(rows, anchors, available_width))
            flows.append(Spacer(1, 3 * mm))
            continue

        heading_match = re.match(r"^(#{1,4})\s+(.+)$", stripped)
        if heading_match:
            flush_paragraph()
            hashes, title = heading_match.groups()
            markdown_level = len(hashes)
            if markdown_level == 1:
                anchor = document_anchor
                flows.append(HRFlowable(width="100%", thickness=2.2, color=ACCENT, spaceAfter=7 * mm))
                flow = heading_flowable(title, 0, anchor, "doc_title", anchors)
                flows.append(flow)
                flows.append(Paragraph(f"docs/design/{source.name}", STYLES["source"]))
            else:
                base = f"{document_anchor}-{slug(title)}"
                count = heading_counts.get(base, 0)
                heading_counts[base] = count + 1
                anchor = base if count == 0 else f"{base}-{count + 1}"
                style_name = "h2" if markdown_level == 2 else "h3" if markdown_level == 3 else "h4"
                outline_level = min(markdown_level - 1, 2)
                flows.append(heading_flowable(title, outline_level, anchor, style_name, anchors))
            index += 1
            continue

        if not stripped:
            flush_paragraph()
            index += 1
            continue

        if re.fullmatch(r"-{3,}", stripped):
            flush_paragraph()
            flows.append(HRFlowable(width="100%", thickness=0.6, color=LINE, spaceBefore=3 * mm, spaceAfter=3 * mm))
            index += 1
            continue

        quote_match = re.match(r"^>\s?(.*)$", stripped)
        if quote_match:
            flush_paragraph()
            quote_parts = [quote_match.group(1)]
            index += 1
            while index < len(lines) and lines[index].strip().startswith(">"):
                quote_parts.append(re.sub(r"^>\s?", "", lines[index].strip()))
                index += 1
            flows.append(paragraph(" ".join(quote_parts), "quote", anchors))
            continue

        unordered = re.match(r"^\s*[-*+]\s+(.+)$", line)
        ordered = re.match(r"^\s*(\d+)\.\s+(.+)$", line)
        if unordered or ordered:
            flush_paragraph()
            if unordered:
                flows.append(Paragraph(markdown_inline(unordered.group(1), anchors), STYLES["bullet"], bulletText="-"))
            else:
                flows.append(Paragraph(markdown_inline(ordered.group(2), anchors), STYLES["bullet"], bulletText=f"{ordered.group(1)}."))
            index += 1
            continue

        paragraph_lines.append(stripped)
        index += 1

    # Keep a document's concluding prose as one editorial unit when it fits. This
    # prevents a final line from being stranded on its own page without changing
    # the canonical Markdown or forcing ordinary body paragraphs to stay whole.
    flush_paragraph(keep_together=True)
    if in_code:
        flows.append(code_block(code_lines))
    return flows


def cover_story(anchors: dict[str, str]) -> list:
    toc = TableOfContents()
    toc.levelStyles = [
        ParagraphStyle(
            "TOCLevel0",
            fontName=BODY_FONT,
            fontSize=9.2,
            leading=13.5,
            leftIndent=0,
            firstLineIndent=0,
            textColor=INK,
            spaceBefore=1.4 * mm,
        ),
        ParagraphStyle(
            "TOCLevel1",
            fontName=BODY_FONT,
            fontSize=7.5,
            leading=11,
            leftIndent=7 * mm,
            firstLineIndent=0,
            textColor=SUBDUED,
        ),
    ]
    return [
        Spacer(1, 22 * mm),
        Paragraph("NOSLOG / DESIGN SYSTEM", STYLES["cover_kicker"]),
        Paragraph("NosLog 2.0", STYLES["cover_title"]),
        Paragraph("Authoritative Design Guide", STYLES["cover_title"]),
        Spacer(1, 6 * mm),
        HRFlowable(width="100%", thickness=2.2, color=ACCENT, hAlign="LEFT"),
        Spacer(1, 8 * mm),
        Table(
            [[
                Paragraph("<b>VERSION</b><br/>0.1", STYLES["cover_meta"]),
                Paragraph("<b>DATE</b><br/>2026-08-11", STYLES["cover_meta"]),
                Paragraph("<b>LANGUAGE</b><br/>English", STYLES["cover_meta"]),
            ]],
            colWidths=[55 * mm, 55 * mm, 55 * mm],
            style=TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), SOFT),
                ("BOX", (0, 0), (-1, -1), 0.6, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.6, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]),
        ),
        Spacer(1, 11 * mm),
        Paragraph(
            "This PDF packages the current approved product, page-family, Foundation, reusable UI, and downstream handoff sources. The editable Markdown remains authoritative. The complete existing chart viewer and editor are locked preservation exceptions and are not redesign targets.",
            STYLES["cover_subtitle"],
        ),
        Spacer(1, 37 * mm),
        HRFlowable(width="100%", thickness=0.6, color=LINE, hAlign="LEFT"),
        Spacer(1, 5 * mm),
        Paragraph("NosLog / NOSTALGIA records, ranking, and archive", STYLES["small"]),
        PageBreak(),
        Paragraph("Contents", STYLES["toc_title"]),
        Paragraph(
            "Document titles and major sections are linked. PDF bookmarks provide the same hierarchy.",
            STYLES["small"],
        ),
        Spacer(1, 4 * mm),
        toc,
    ]


def build(output: Path) -> None:
    missing = [name for name in SOURCE_NAMES if not (DESIGN / name).exists()]
    if missing:
        raise FileNotFoundError(f"Missing canonical sources: {missing}")
    output.parent.mkdir(parents=True, exist_ok=True)

    anchors = {name: f"doc-{slug(Path(name).stem)}" for name in SOURCE_NAMES}
    doc = GuideDocTemplate(str(output))
    story = cover_story(anchors)
    story.extend(visual_plate_story())
    for source_index, name in enumerate(SOURCE_NAMES):
        story.extend(parse_document(DESIGN / name, source_index, anchors, doc.width))
    doc.multiBuild(story)


if __name__ == "__main__":
    output_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else DEFAULT_OUTPUT
    build(output_path)
    print(output_path)
