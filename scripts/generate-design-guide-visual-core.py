#!/usr/bin/env python3
"""Generate the proposed NosLog 2.0 visual-core review PDF.

This review artifact visualizes only contracts already approved in documents 24 and
63. It is deliberately separate from the versioned milestone PDF until the user
approves the visual communication system.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "output" / "pdf" / "noslog-2.0-visual-core-review.pdf"
SOURCE_ROOT = Path(os.environ.get("NOSLOG_GUIDE_SOURCE_DIR", "/private/tmp/noslog-guide-sources"))
PAGE_W, PAGE_H = A4
MARGIN = 16 * mm
CONTENT_W = PAGE_W - 2 * MARGIN
CSS_PX = 0.75
ARTIFACT_MODE = "review"
AUTO_SHOW_PAGE = True


def hex_color(value: str) -> colors.Color:
    return colors.HexColor(value)


LIGHT = {
    "canvas": "#FFFFFF",
    "surface": "#F8F8F8",
    "sunken": "#E9E9E9",
    "raised": "#FFFFFF",
    "overlay": "#FFFFFF",
    "content-default": "#292929",
    "content-subdued": "#505050",
    "content-interactive": "#131313",
    "content-disabled": "#C6C6C6",
    "divider": "#E1E1E1",
    "border-subtle": "#DADADA",
    "border-default": "#C6C6C6",
    "border-strong": "#717171",
}

DARK = {
    "canvas": "#111111",
    "surface": "#1B1B1B",
    "sunken": "#111111",
    "raised": "#222222",
    "overlay": "#222222",
    "content-default": "#DBDBDB",
    "content-subdued": "#AFAFAF",
    "content-interactive": "#F2F2F2",
    "content-disabled": "#444444",
    "divider": "#323232",
    "border-subtle": "#393939",
    "border-default": "#444444",
    "border-strong": "#8A8A8A",
}

FEEDBACK = [
    ("Information", "#E9F2FE", "#357DE8", "#1C2B42", "#4688EC"),
    ("Success", "#EFFFD6", "#6A9A23", "#28311B", "#82B536"),
    ("Warning", "#FFF5DB", "#E06C00", "#3A2C1F", "#FBC828"),
    ("Danger", "#FFECEB", "#C9372C", "#42221F", "#F15B50"),
]

DIFFICULTY = [
    ("Normal", "#0BA45D", "#068850"),
    ("Hard", "#E86A00", "#E06400"),
    ("Expert", "#F03823", "#CD2E1D"),
    ("Real", "#A65CE7", "#AD69E9"),
]

JUDGEMENT = [
    ("S-Just", "#C2298A", "#FF8DCC"),
    ("Just", "#AB6400", "#FFCA16"),
    ("Good", "#107D98", "#4CCCE6"),
    ("Near", "#0D74CE", "#70B8FF"),
    ("Miss", "#646464", "#B4B4B4"),
]

LOCAL_LIGHT = ["#62B3FF", "#3FA2FF", "#168EFF", "#0074E2", "#0065C3", "#0055A5"]
LOCAL_DARK = ["#1D456D", "#275E96", "#3278BE", "#5291D1", "#7AABDC", "#A2C4E7"]


def register_fonts() -> tuple[dict[int, str], str]:
    font_dir = SOURCE_ROOT / "pretendard-jp"
    weight_files = {
        400: font_dir / "PretendardJP-Regular.ttf",
        500: font_dir / "PretendardJP-Medium.ttf",
        600: font_dir / "PretendardJP-SemiBold.ttf",
        700: font_dir / "PretendardJP-Bold.ttf",
    }
    mono = Path("/System/Library/Fonts/SFNSMono.ttf")
    missing = [str(path) for path in weight_files.values() if not path.exists()]
    if missing:
        raise FileNotFoundError(
            "Official Pretendard JP 1.3.9 review fonts are missing: " + ", ".join(missing)
        )
    font_names: dict[int, str] = {}
    for weight, path in weight_files.items():
        name = f"PretendardJP{weight}"
        pdfmetrics.registerFont(TTFont(name, str(path)))
        font_names[weight] = name
    mono_name = "Courier"
    if mono.exists():
        try:
            pdfmetrics.registerFont(TTFont("ReviewMono", str(mono)))
            mono_name = "ReviewMono"
        except Exception:
            pass
    return font_names, mono_name


SANS_BY_WEIGHT, MONO = register_fonts()
SANS = SANS_BY_WEIGHT[400]


def set_font(c: canvas.Canvas, size: float, color: str = "#292929", mono: bool = False,
             weight: int = 400) -> None:
    c.setFont(MONO if mono else SANS_BY_WEIGHT[weight], size)
    c.setFillColor(hex_color(color))


def text(c: canvas.Canvas, x: float, y: float, value: str, size: float = 9,
         color: str = "#292929", mono: bool = False, weight: int = 400) -> None:
    set_font(c, size, color, mono, weight)
    c.drawString(x, y, value)


def right_text(c: canvas.Canvas, x: float, y: float, value: str, size: float = 8,
               color: str = "#505050", mono: bool = False, weight: int = 400) -> None:
    set_font(c, size, color, mono, weight)
    c.drawRightString(x, y, value)


def cjk_text(c: canvas.Canvas, x: float, y: float, value: str, size: float = 9,
             color: str = "#292929", weight: int = 400) -> None:
    c.setFont(SANS_BY_WEIGHT[weight], size)
    c.setFillColor(hex_color(color))
    c.drawString(x, y, value)


def wrap_lines(c: canvas.Canvas, value: str, max_width: float, size: float) -> list[str]:
    words = value.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if c.stringWidth(candidate, SANS, size) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def paragraph(c: canvas.Canvas, x: float, y: float, value: str, max_width: float,
              size: float = 9, leading: float = 13, color: str = "#505050") -> float:
    for line in wrap_lines(c, value, max_width, size):
        text(c, x, y, line, size, color)
        y -= leading
    return y


def page_header(c: canvas.Canvas, page: int, section: str, title: str, subtitle: str) -> float:
    c.setFillColor(hex_color("#FFFFFF"))
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    text(c, MARGIN, PAGE_H - 13 * mm, "NOSLOG / DESIGN SYSTEM", 7.2, "#505050")
    header_label = (
        f"APPROVED VISUAL PLATE  /  {c.getPageNumber():03d}"
        if ARTIFACT_MODE == "milestone"
        else f"VISUAL SYSTEM REVIEW  /  {page:02d}"
    )
    right_text(c, PAGE_W - MARGIN, PAGE_H - 13 * mm, header_label, 7.2)
    c.setStrokeColor(hex_color("#E1E1E1"))
    c.setLineWidth(0.6)
    c.line(MARGIN, PAGE_H - 16 * mm, PAGE_W - MARGIN, PAGE_H - 16 * mm)
    text(c, MARGIN, PAGE_H - 27 * mm, section.upper(), 7.5, "#505050")
    text(c, MARGIN, PAGE_H - 39 * mm, title, 24, "#292929")
    y = paragraph(c, MARGIN, PAGE_H - 47 * mm, subtitle, CONTENT_W, 9, 13, "#505050")
    return y - 6 * mm


def footer(c: canvas.Canvas) -> None:
    c.setStrokeColor(hex_color("#E1E1E1"))
    c.setLineWidth(0.5)
    c.line(MARGIN, 12 * mm, PAGE_W - MARGIN, 12 * mm)
    status = (
        "Approved visual communication - Normative values: documents 24 and 63"
        if ARTIFACT_MODE == "milestone"
        else "Proposed visual communication only - Normative values: document 24"
    )
    text(c, MARGIN, 8 * mm, status, 6.7, "#717171")
    right_text(c, PAGE_W - MARGIN, 8 * mm, "Viewer/editor excluded", 6.7, "#717171")


def finish_page(c: canvas.Canvas) -> None:
    if AUTO_SHOW_PAGE:
        c.showPage()


def chip(c: canvas.Canvas, x: float, y: float, label: str, fill: str, foreground: str,
         width: float = 34 * mm) -> None:
    c.setFillColor(hex_color(fill))
    c.roundRect(x, y, width, 8 * mm, 4 * mm, fill=1, stroke=0)
    text(c, x + 4 * mm, y + 2.55 * mm, label, 8, foreground)


def draw_cover(c: canvas.Canvas) -> None:
    c.setFillColor(hex_color("#FFFFFF"))
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(hex_color("#111111"))
    c.rect(0, 0, 54 * mm, PAGE_H, fill=1, stroke=0)
    c.setFillColor(hex_color("#1B1B1B"))
    c.rect(10 * mm, 22 * mm, 34 * mm, PAGE_H - 44 * mm, fill=1, stroke=0)
    for idx, label in enumerate(["TYPE", "COLOR", "MATERIAL", "ICON"]):
        y = PAGE_H - 60 * mm - idx * 14 * mm
        c.setStrokeColor(hex_color("#444444"))
        c.setLineWidth(0.7)
        c.line(16 * mm, y, 22 * mm, y)
        text(c, 26 * mm, y - 1.8 * mm, label, 5.8, "#AFAFAF")
    text(c, 66 * mm, PAGE_H - 44 * mm, "NOSLOG / DESIGN SYSTEM", 8, "#505050")
    text(c, 66 * mm, PAGE_H - 69 * mm, "Visual System", 32, "#292929")
    text(c, 66 * mm, PAGE_H - 83 * mm, "Review 02", 32, "#292929")
    c.setStrokeColor(hex_color("#C6C6C6"))
    c.setLineWidth(0.8)
    c.line(66 * mm, PAGE_H - 94 * mm, PAGE_W - MARGIN, PAGE_H - 94 * mm)
    y = PAGE_H - 108 * mm
    y = paragraph(
        c, 66 * mm, y,
        "A visual reading layer for the approved NosLog 2.0 Foundation. This draft adds specimens, diagrams, and usage boundaries without changing a token or designing final pages.",
        PAGE_W - 82 * mm, 10, 15, "#505050",
    )
    y -= 8 * mm
    for label, value in [
        ("STATUS", "Proposed for review"),
        ("SCOPE", "Foundation · motion · data · responsive · UI anatomy"),
        ("AUTHORITY", "Documents 24 and 63"),
        ("EXCLUDED", "Final screens · chart viewer/editor"),
    ]:
        text(c, 66 * mm, y, label, 7, "#717171")
        text(c, 96 * mm, y, value, 8.5, "#292929")
        y -= 9 * mm
    text(c, 66 * mm, 25 * mm, "2026-08-11  /  English", 8, "#717171")
    finish_page(c)


def draw_typography(c: canvas.Canvas) -> None:
    y = page_header(
        c, 2, "Foundation / Typography", "One family, explicit roles",
        "The visual hierarchy comes from approved size, line-height, weight, and role boundaries - not decorative tracking or page-local invention.",
    )
    roles = [
        ("DISPLAY", "Archive without noise", "40 / 48 · 700", 40, 700),
        ("PAGE TITLE", "Music detail", "24 / 32 · 700", 24, 700),
        ("SECTION TITLE", "Recent records", "20 / 28 · 600", 20, 600),
        ("COMPONENT TITLE", "Judgement breakdown", "16 / 24 · 600", 16, 600),
        ("BODY", "Compare exact values and keep the current context visible.", "16 / 24 · 400", 16, 400),
        ("METADATA", "UPDATED 12 MIN AGO", "12 / 16 · 400", 12, 400),
    ]
    for role, sample, spec, css_px, weight in roles:
        size = css_px * 0.75
        text(c, MARGIN, y, role, 6.5, "#717171")
        text(c, MARGIN + 34 * mm, y - 1, sample, size, "#292929", weight=weight)
        right_text(c, PAGE_W - MARGIN, y, spec, 7.2, "#505050", mono=True)
        y -= max(17 * mm, size * 0.7 * mm)

    box_y = 25 * mm
    c.setFillColor(hex_color("#F8F8F8"))
    c.roundRect(MARGIN, box_y, CONTENT_W, 39 * mm, 8, fill=1, stroke=0)
    cjk_text(c, MARGIN + 6 * mm, box_y + 28 * mm, "KO  그랜드마스터 달성 기록", 12, "#292929", 600)
    cjk_text(c, MARGIN + 6 * mm, box_y + 20 * mm, "JA  グランドマスター達成記録", 12, "#292929", 600)
    text(c, MARGIN + 6 * mm, box_y + 12 * mm, "EN  Grandmaster achievement record", 12, "#292929", weight=600)
    text(c, MARGIN + 6 * mm, box_y + 4 * mm, "Official Pretendard JP 1.3.9 static TTFs · 400/500/600/700 embedded", 6.4, "#717171")
    right_text(c, PAGE_W - MARGIN - 6 * mm, box_y + 4 * mm, "KO ss05 remains a browser-shaping check", 6.4, "#717171")
    footer(c)
    finish_page(c)


def neutral_role_page(c: canvas.Canvas, page: int, mode: str, palette: dict[str, str]) -> None:
    dark = mode == "Dark"
    y = page_header(
        c, page, f"Foundation / Neutral / {mode}", f"Spectrum S2 {mode} roles",
        "These are semantic assignments, not a decorative gray ramp. Quiet boundaries may never become the only necessary cue.",
    )
    panel_fill = palette["canvas"]
    panel_text = palette["content-default"]
    panel_subdued = palette["content-subdued"]
    panel_border = palette["border-subtle"]
    panel_h = 77 * mm
    c.setFillColor(hex_color(panel_fill))
    c.setStrokeColor(hex_color(panel_border))
    c.setLineWidth(0.7)
    c.roundRect(MARGIN, y - panel_h, CONTENT_W, panel_h, 8, fill=1, stroke=1)
    text(c, MARGIN + 7 * mm, y - 13 * mm, "Music archive", 17, panel_text)
    text(c, MARGIN + 7 * mm, y - 23 * mm, "Search records, compare scores, and preserve context.", 9, panel_subdued)
    c.setFillColor(hex_color(palette["surface"]))
    c.roundRect(MARGIN + 7 * mm, y - 65 * mm, CONTENT_W - 14 * mm, 30 * mm, 7, fill=1, stroke=0)
    text(c, MARGIN + 13 * mm, y - 47 * mm, "Recent record", 8, panel_subdued)
    text(c, MARGIN + 13 * mm, y - 58 * mm, "12,987,654", 18, panel_text)
    c.setStrokeColor(hex_color(palette["divider"]))
    c.line(MARGIN + 77 * mm, y - 59 * mm, MARGIN + 77 * mm, y - 42 * mm)
    text(c, MARGIN + 85 * mm, y - 47 * mm, "Updated", 8, panel_subdued)
    text(c, MARGIN + 85 * mm, y - 58 * mm, "12 min ago", 10, panel_text)

    y -= panel_h + 10 * mm
    groups = [
        ("SURFACES", ["canvas", "surface", "sunken", "raised", "overlay"]),
        ("FOREGROUNDS", ["content-default", "content-subdued", "content-interactive", "content-disabled"]),
        ("BOUNDARIES", ["divider", "border-subtle", "border-default", "border-strong"]),
    ]
    for group, names in groups:
        text(c, MARGIN, y, group, 6.7, "#717171")
        y -= 5 * mm
        sw = CONTENT_W / len(names)
        for idx, name in enumerate(names):
            x = MARGIN + idx * sw
            c.setFillColor(hex_color(palette[name]))
            c.setStrokeColor(hex_color("#C6C6C6" if not dark else "#444444"))
            c.roundRect(x, y - 10 * mm, sw - 3 * mm, 10 * mm, 4, fill=1, stroke=1)
            text(c, x, y - 15 * mm, name, 6.4, "#505050")
            text(c, x, y - 20 * mm, palette[name], 6.2, "#717171", mono=True)
        y -= 29 * mm
    footer(c)
    finish_page(c)


SHADOW_LAYERS = {
    "raised": [("Ambient", "0 2 8", ".08 / .24"), ("Transition", "0 1 4", ".04 / .12"), ("Key", "0 0 1", ".08 / .24")],
    "elevated": [("Ambient", "0 4 12", ".08 / .24"), ("Transition", "0 2 6", ".04 / .12"), ("Key", "0 0 2", ".12 / .36")],
    "dragged": [("Ambient", "0 12 16", ".08 / .24"), ("Transition", "0 6 8", ".04 / .12"), ("Key", "0 0 6", ".16 / .48")],
}


def shadow_anatomy(c: canvas.Canvas, x: float, y: float, w: float, h: float,
                   label: str, level: str) -> None:
    c.setFillColor(hex_color("#F8F8F8"))
    c.setStrokeColor(hex_color("#DADADA"))
    c.roundRect(x, y, w, h, 8, fill=1, stroke=1)
    text(c, x + 5 * mm, y + h - 8 * mm, label, 8.5, "#292929", weight=600)
    for idx, (layer, geometry, opacity) in enumerate(SHADOW_LAYERS[level]):
        yy = y + h - (16 + idx * 7) * mm
        text(c, x + 5 * mm, yy, layer, 6.3, "#505050")
        text(c, x + 22 * mm, yy, geometry, 6.1, "#292929", mono=True)
        right_text(c, x + w - 5 * mm, yy, opacity, 6.1, "#717171", mono=True)


def draw_material(c: canvas.Canvas) -> None:
    y = page_header(
        c, 5, "Foundation / Material", "Flat by default, lifted by purpose",
        "Radius communicates object family. Elevation appears only for real lift, movement, overlap, or justified emphasis.",
    )
    text(c, MARGIN, y, "APPROVED GEOMETRY", 6.7, "#717171")
    y -= 10 * mm
    radius_specs = [
        ("Control", 4 * CSS_PX, "4px"),
        ("Container", 8 * CSS_PX, "8px"),
        ("Overlay", 10 * CSS_PX, "10px"),
        ("Full", 11 * mm, "50%"),
    ]
    cell_w = CONTENT_W / 4
    for idx, (name, radius, shown) in enumerate(radius_specs):
        x = MARGIN + idx * cell_w
        c.setFillColor(hex_color("#F8F8F8"))
        c.setStrokeColor(hex_color("#C6C6C6"))
        c.roundRect(x, y - 22 * mm, cell_w - 5 * mm, 22 * mm, radius, fill=1, stroke=1)
        text(c, x, y - 29 * mm, name, 7.5, "#292929")
        text(c, x, y - 35 * mm, shown, 7, "#717171", mono=True)
    y -= 52 * mm
    text(c, MARGIN, y, "ELEVATION IS A STATE, NOT DECORATION", 6.7, "#717171")
    y -= 49 * mm
    card_w = (CONTENT_W - 12 * mm) / 3
    shadow_anatomy(c, MARGIN, y, card_w, 36 * mm, "Raised / emphasized", "raised")
    shadow_anatomy(c, MARGIN + card_w + 6 * mm, y, card_w, 36 * mm, "Overlay / elevated", "elevated")
    shadow_anatomy(c, MARGIN + 2 * (card_w + 6 * mm), y, card_w, 36 * mm, "Dragged", "dragged")
    text(c, MARGIN, y - 10 * mm, "Exact Spectrum layer anatomy · geometry is x y blur · opacity is Light / Dark.", 6.5, "#717171")
    y -= 23 * mm
    c.setFillColor(hex_color("#111111"))
    c.roundRect(MARGIN, 23 * mm, CONTENT_W, 55 * mm, 8, fill=1, stroke=0)
    c.setFillColor(hex_color("#1B1B1B"))
    c.roundRect(MARGIN + 7 * mm, 31 * mm, 72 * mm, 39 * mm, 8, fill=1, stroke=0)
    text(c, MARGIN + 13 * mm, 56 * mm, "Dark flat surface", 10, "#DBDBDB")
    text(c, MARGIN + 13 * mm, 45 * mm, "No persistent white outline", 8, "#AFAFAF")
    c.setFillColor(hex_color("#222222"))
    c.setStrokeColor(hex_color("#444444"))
    c.roundRect(MARGIN + 88 * mm, 31 * mm, CONTENT_W - 95 * mm, 39 * mm, 10, fill=1, stroke=1)
    text(c, MARGIN + 94 * mm, 56 * mm, "Overlay", 10, "#DBDBDB")
    text(c, MARGIN + 94 * mm, 45 * mm, "Surface + justified boundary", 8, "#AFAFAF")
    footer(c)
    finish_page(c)


def draw_semantic_color(c: canvas.Canvas) -> None:
    y = page_header(
        c, 6, "Foundation / Semantic color", "Color names a state; typography stays neutral",
        "Atlassian owns feedback chroma. Spectrum owns message title and body typography. Every state keeps text, symbol, and programmatic meaning.",
    )
    col_w = (CONTENT_W - 7 * mm) / 2
    for idx, mode in enumerate(["LIGHT", "DARK"]):
        x = MARGIN + idx * (col_w + 7 * mm)
        text(c, x, y, mode, 6.7, "#717171")
        yy = y - 8 * mm
        for name, lb, lm, db, dm in FEEDBACK:
            bg, marker = (lb, lm) if mode == "LIGHT" else (db, dm)
            fg = "#292929" if mode == "LIGHT" else "#DBDBDB"
            c.setFillColor(hex_color(bg))
            c.roundRect(x, yy - 20 * mm, col_w, 17 * mm, 7, fill=1, stroke=0)
            c.setFillColor(hex_color(marker))
            c.circle(x + 7 * mm, yy - 11.5 * mm, 2 * mm, fill=1, stroke=0)
            text(c, x + 13 * mm, yy - 9 * mm, name, 8.5, fg)
            text(c, x + 13 * mm, yy - 15 * mm, "Explicit message and recovery", 6.6, fg)
            yy -= 24 * mm
    y -= 112 * mm
    text(c, MARGIN, y, "DIFFICULTY · COMPACT PERSISTENT MARKERS ONLY", 6.7, "#717171")
    y -= 13 * mm
    for idx, (name, light, dark) in enumerate(DIFFICULTY):
        x = MARGIN + idx * (CONTENT_W / 4)
        c.setFillColor(hex_color(light))
        c.circle(x + 2 * mm, y, 2.2 * mm, fill=1, stroke=0)
        text(c, x + 7 * mm, y - 2.2 * mm, name, 8, "#292929")
        text(c, x, y - 10 * mm, f"{light} / {dark}", 6.3, "#717171", mono=True)
    y -= 27 * mm
    paragraph(c, MARGIN, y, "Do not color difficulty text, backgrounds, containers, selection, focus, feedback, or actions.", CONTENT_W, 8.2, 12, "#505050")
    footer(c)
    finish_page(c)


def draw_domain_color(c: canvas.Canvas) -> None:
    y = page_header(
        c, 7, "Foundation / Domain color", "Local data and judgement remain narrow",
        "SAP Fiori Horizon owns local data series. Radix Colors owns only the five judgement markers. Labels, values, order, and patterns carry meaning with color.",
    )
    text(c, MARGIN, y, "SCORE BUCKETS · LOW → HIGH", 6.7, "#717171")
    y -= 10 * mm
    for row, (label, values) in enumerate([("LIGHT", LOCAL_LIGHT), ("DARK", LOCAL_DARK)]):
        text(c, MARGIN, y - row * 22 * mm, label, 6.7, "#717171")
        x0 = MARGIN + 20 * mm
        sw = (CONTENT_W - 20 * mm) / 6
        for idx, value in enumerate(values):
            x = x0 + idx * sw
            c.setFillColor(hex_color(value))
            c.rect(x, y - 8 * mm - row * 22 * mm, sw, 10 * mm, fill=1, stroke=0)
            text(c, x + 1 * mm, y - 14 * mm - row * 22 * mm, str(idx + 1), 6.5, "#717171")
    y -= 55 * mm
    text(c, MARGIN, y, "FAST / SLOW · DIRECT LABEL + SHAPE + LINE PATTERN", 6.7, "#717171")
    y -= 14 * mm
    c.setStrokeColor(hex_color("#168EFF"))
    c.setLineWidth(2)
    c.line(MARGIN, y, MARGIN + 36 * mm, y)
    c.setFillColor(hex_color("#168EFF"))
    c.circle(MARGIN + 18 * mm, y, 2.3 * mm, fill=1, stroke=0)
    text(c, MARGIN + 42 * mm, y - 2.5 * mm, "FAST", 9, "#292929")
    c.setStrokeColor(hex_color("#C87B00"))
    c.setDash(4, 3)
    c.line(MARGIN + 92 * mm, y, MARGIN + 128 * mm, y)
    c.setDash()
    c.setFillColor(hex_color("#C87B00"))
    c.rect(MARGIN + 108 * mm, y - 2.3 * mm, 4.6 * mm, 4.6 * mm, fill=1, stroke=0)
    text(c, MARGIN + 134 * mm, y - 2.5 * mm, "SLOW", 9, "#292929")
    y -= 28 * mm
    text(c, MARGIN, y, "JUDGEMENT · LOCAL MARKERS / BARS ONLY", 6.7, "#717171")
    y -= 13 * mm
    bar_w = CONTENT_W / 5
    for idx, (name, light, dark) in enumerate(JUDGEMENT):
        x = MARGIN + idx * bar_w
        c.setFillColor(hex_color(light))
        c.roundRect(x, y - 17 * mm, bar_w - 4 * mm, 8 * mm, 4, fill=1, stroke=0)
        set_font(c, 7.2, "#292929")
        c.drawCentredString(x + (bar_w - 4 * mm) / 2, y - 24 * mm, name)
        set_font(c, 6.1, "#717171", mono=True)
        c.drawCentredString(x + (bar_w - 4 * mm) / 2, y - 30 * mm, light)
        c.setFillColor(hex_color(dark))
        c.circle(x + 3 * mm, y - 40 * mm, 2.1 * mm, fill=1, stroke=0)
        text(c, x + 8 * mm, y - 42 * mm, dark, 6.3, "#717171", mono=True)
    footer(c)
    finish_page(c)


def icon_stroke(c: canvas.Canvas, x: float, y: float, size: float, color: str = "#292929") -> None:
    c.setStrokeColor(hex_color(color))
    c.setLineWidth(size * 2 / 24)
    c.setLineCap(1)
    c.setLineJoin(1)


def icon_point(x: float, y: float, size: float, px: float, py: float) -> tuple[float, float]:
    scale = size / 24
    return x + px * scale, y + (24 - py) * scale


def icon_search(c: canvas.Canvas, x: float, y: float, size: float, color: str = "#292929") -> None:
    icon_stroke(c, x, y, size, color)
    cx, cy = icon_point(x, y, size, 11, 11)
    c.circle(cx, cy, 8 * size / 24, fill=0, stroke=1)
    x1, y1 = icon_point(x, y, size, 21, 21)
    x2, y2 = icon_point(x, y, size, 16.66, 16.66)
    c.line(x1, y1, x2, y2)


def icon_info(c: canvas.Canvas, x: float, y: float, size: float, color: str = "#292929") -> None:
    icon_stroke(c, x, y, size, color)
    cx, cy = icon_point(x, y, size, 12, 12)
    c.circle(cx, cy, 10 * size / 24, fill=0, stroke=1)
    x1, y1 = icon_point(x, y, size, 12, 16)
    x2, y2 = icon_point(x, y, size, 12, 12)
    c.line(x1, y1, x2, y2)
    x1, y1 = icon_point(x, y, size, 12, 8)
    x2, y2 = icon_point(x, y, size, 12.01, 8)
    c.line(x1, y1, x2, y2)


def icon_x(c: canvas.Canvas, x: float, y: float, size: float, color: str = "#292929") -> None:
    icon_stroke(c, x, y, size, color)
    x1, y1 = icon_point(x, y, size, 18, 6)
    x2, y2 = icon_point(x, y, size, 6, 18)
    c.line(x1, y1, x2, y2)
    x1, y1 = icon_point(x, y, size, 6, 6)
    x2, y2 = icon_point(x, y, size, 18, 18)
    c.line(x1, y1, x2, y2)


def icon_chevron(c: canvas.Canvas, x: float, y: float, size: float, color: str = "#292929") -> None:
    icon_stroke(c, x, y, size, color)
    p1 = icon_point(x, y, size, 9, 18)
    p2 = icon_point(x, y, size, 15, 12)
    p3 = icon_point(x, y, size, 9, 6)
    c.line(*p1, *p2)
    c.line(*p2, *p3)


def draw_iconography(c: canvas.Canvas) -> None:
    y = page_header(
        c, 8, "Foundation / Iconography", "Lucide stays quiet and legible",
        "One outline family, inherited foreground, and a target larger than the glyph. Unfamiliar, destructive, and low-frequency actions keep visible text.",
    )
    text(c, MARGIN, y, "PUBLISHED CONSTRUCTION", 6.7, "#717171")
    y -= 13 * mm
    sizes = [(16, "Supporting beside label"), (20, "Routine action / wayfinding"), (24, "Prominent proven affordance")]
    for idx, (px, desc) in enumerate(sizes):
        x = MARGIN + idx * (CONTENT_W / 3)
        draw_size = px * CSS_PX
        icon_search(c, x, y - draw_size, draw_size)
        text(c, x + 11 * mm, y - 7 * mm, f"{px}px", 10, "#292929", mono=True)
        text(c, x, y - 17 * mm, desc, 7, "#505050")
        text(c, x, y - 23 * mm, "24×24 viewBox · 2px stroke", 6.3, "#717171")
    y -= 45 * mm
    text(c, MARGIN, y, "GLYPH ≠ TARGET", 6.7, "#717171")
    y -= 14 * mm
    target_sizes = [(44, "Mobile", icon_x), (40, "Eligible desktop", icon_info)]
    for idx, (target, label, glyph) in enumerate(target_sizes):
        x = MARGIN + idx * 70 * mm
        side = target * .75
        c.setFillColor(hex_color("#F8F8F8"))
        c.setStrokeColor(hex_color("#C6C6C6"))
        c.roundRect(x, y - side, side, side, 8, fill=1, stroke=1)
        glyph_size = 20 * CSS_PX
        glyph(c, x + (side - glyph_size) / 2, y - side + (side - glyph_size) / 2, glyph_size)
        text(c, x + side + 5 * mm, y - 8 * mm, label, 9, "#292929")
        text(c, x + side + 5 * mm, y - 15 * mm, f"≥ {target}×{target}px target", 7, "#717171", mono=True)
    y -= 47 * mm
    text(c, MARGIN, y, "LABEL CONTRACT", 6.7, "#717171")
    y -= 15 * mm
    c.setFillColor(hex_color("#292929"))
    c.roundRect(MARGIN, y - 11 * mm, 55 * mm, 11 * mm, 4, fill=1, stroke=0)
    icon_search(c, MARGIN + 5 * mm, y - 8.3 * mm, 20 * CSS_PX, "#FFFFFF")
    text(c, MARGIN + 15 * mm, y - 7.5 * mm, "Search records", 8.5, "#FFFFFF")
    text(c, MARGIN + 65 * mm, y - 3 * mm, "Primary / unfamiliar", 8, "#292929")
    text(c, MARGIN + 65 * mm, y - 10 * mm, "Visible label remains", 7, "#717171")
    c.setFillColor(hex_color("#F8F8F8"))
    c.roundRect(MARGIN, y - 32 * mm, 40 * mm, 11 * mm, 4, fill=1, stroke=0)
    icon_chevron(c, MARGIN + 5 * mm, y - 29.3 * mm, 20 * CSS_PX)
    text(c, MARGIN + 15 * mm, y - 28.5 * mm, "Details", 8.5, "#292929")
    text(c, MARGIN + 65 * mm, y - 24 * mm, "Wayfinding", 8, "#292929")
    text(c, MARGIN + 65 * mm, y - 31 * mm, "Icon supports - not replaces - the label", 7, "#717171")
    footer(c)
    finish_page(c)


def draw_dos_donts(c: canvas.Canvas) -> None:
    y = page_header(
        c, 9, "Foundation / Guardrails", "Restraint is visible in the composition",
        "These diagrams illustrate approved prohibitions. They are not reused historical candidates or final component designs.",
    )
    col_w = (CONTENT_W - 8 * mm) / 2
    cards = [
        ("DO", MARGIN),
        ("DON'T", MARGIN + col_w + 8 * mm),
    ]
    for label, x in cards:
        text(c, x, y, label, 7.5, "#505050", weight=600)
        c.setFillColor(hex_color("#111111"))
        c.roundRect(x, y - 65 * mm, col_w, 58 * mm, 8, fill=1, stroke=0)
        if label == "DO":
            c.setFillColor(hex_color("#1B1B1B"))
            c.roundRect(x + 6 * mm, y - 57 * mm, col_w - 12 * mm, 39 * mm, 8, fill=1, stroke=0)
            text(c, x + 11 * mm, y - 31 * mm, "Difficulty", 8, "#AFAFAF")
            c.setFillColor(hex_color("#0BA45D"))
            c.circle(x + 13 * mm, y - 42 * mm, 2.2 * mm, fill=1, stroke=0)
            text(c, x + 19 * mm, y - 44 * mm, "Normal · 12", 11, "#DBDBDB", weight=600)
            text(c, x + 11 * mm, y - 52 * mm, "Named role + compact marker", 7, "#AFAFAF")
        else:
            c.setFillColor(hex_color("#1B1B1B"))
            c.setStrokeColor(hex_color("#FFFFFF"))
            c.setLineWidth(1.8)
            c.roundRect(x + 6 * mm, y - 57 * mm, col_w - 12 * mm, 39 * mm, 8, fill=1, stroke=1)
            c.setFillColor(hex_color("#222222"))
            c.roundRect(x + 10 * mm, y - 52 * mm, col_w - 20 * mm, 27 * mm, 6, fill=1, stroke=0)
            text(c, x + 14 * mm, y - 35 * mm, "Persistent white outline", 9, "#DBDBDB")
            text(c, x + 14 * mm, y - 46 * mm, "Every container appears focused", 7, "#AFAFAF")
    y -= 78 * mm
    rules = [
        ("Neutral surfaces first", "Chroma only for approved semantic or domain roles."),
        ("Persistent non-color cue", "Name, label, order, symbol, shape, or pattern remains."),
        ("Keyboard focus only", "2px black Light / white Dark perimeter; pointer focus does not persist."),
        ("No universal hover fill", "Use the approved component-family interaction recipe."),
    ]
    for idx, (title_value, body) in enumerate(rules):
        yy = y - idx * 28 * mm
        c.setFillColor(hex_color("#F8F8F8"))
        c.roundRect(MARGIN, yy - 20 * mm, CONTENT_W, 18 * mm, 6, fill=1, stroke=0)
        text(c, MARGIN + 6 * mm, yy - 9 * mm, title_value, 8.5, "#292929")
        text(c, MARGIN + 62 * mm, yy - 9 * mm, body, 7.5, "#505050")
    footer(c)
    finish_page(c)


def draw_motion_curve(c: canvas.Canvas, x: float, y: float, w: float, h: float,
                      controls: tuple[float, float, float, float], label: str,
                      token: str) -> None:
    c.setFillColor(hex_color("#F8F8F8"))
    c.setStrokeColor(hex_color("#DADADA"))
    c.roundRect(x, y, w, h, 6, fill=1, stroke=1)
    gx = x + 7 * mm
    gy = y + 10 * mm
    gw = w - 14 * mm
    gh = h - 23 * mm
    c.setStrokeColor(hex_color("#C6C6C6"))
    c.setLineWidth(0.6)
    c.line(gx, gy, gx + gw, gy)
    c.line(gx, gy, gx, gy + gh)
    x1, y1, x2, y2 = controls
    path = c.beginPath()
    path.moveTo(gx, gy)
    path.curveTo(gx + x1 * gw, gy + y1 * gh, gx + x2 * gw, gy + y2 * gh, gx + gw, gy + gh)
    c.setStrokeColor(hex_color("#292929"))
    c.setLineWidth(1.4)
    c.drawPath(path, fill=0, stroke=1)
    text(c, x + 5 * mm, y + h - 7 * mm, label, 7.7, "#292929", weight=600)
    text(c, x + 5 * mm, y + 3.5 * mm, token, 5.8, "#717171", mono=True)


def draw_motion(c: canvas.Canvas) -> None:
    y = page_header(
        c, 10, "Foundation / Motion", "Time communicates role, not spectacle",
        "MO-02 uses the published Atlassian duration ladder and cubic-bezier curves. Immediate semantics are never delayed by animation.",
    )
    text(c, MARGIN, y, "DURATION ROLES - EXACT TOKENS", 6.7, "#717171")
    y -= 17 * mm
    line_x = MARGIN + 5 * mm
    line_w = CONTENT_W - 10 * mm
    c.setStrokeColor(hex_color("#C6C6C6"))
    c.setLineWidth(1)
    c.line(line_x, y, line_x + line_w, y)
    durations = [
        (0, "0ms", "Immediate state"),
        (50, "50ms", "Routine hover"),
        (100, "100ms", "Press / quick exit"),
        (150, "150ms", "Selection / small enter"),
        (200, "200ms", "Modal / large exit"),
        (250, "250ms", "Modal entrance"),
        (400, "400ms", "Proven ceiling"),
    ]
    for idx, (duration, shown, role) in enumerate(durations):
        x = line_x + duration / 400 * line_w
        c.setFillColor(hex_color("#292929"))
        c.circle(x, y, 1.7 * mm, fill=1, stroke=0)
        anchor = x
        if idx == 0:
            anchor = x - 1 * mm
        elif idx == len(durations) - 1:
            anchor = x - 18 * mm
        text(c, anchor, y - 8 * mm, shown, 6.2, "#292929", mono=True, weight=600)
        if idx % 2 == 0:
            text(c, anchor, y - 14 * mm, role, 5.6, "#717171")
        else:
            text(c, anchor, y + 7 * mm, role, 5.6, "#717171")
    y -= 35 * mm
    text(c, MARGIN, y, "EASING CURVES - EXACT NORMALIZED CONTROL POINTS", 6.7, "#717171")
    y -= 55 * mm
    gap = 5 * mm
    card_w = (CONTENT_W - gap) / 2
    draw_motion_curve(c, MARGIN, y, card_w, 45 * mm, (.4, 1, .6, 1),
                      "Out practical", "cubic-bezier(.4,1,.6,1)")
    draw_motion_curve(c, MARGIN + card_w + gap, y, card_w, 45 * mm, (.6, 0, .8, .6),
                      "In practical", "cubic-bezier(.6,0,.8,.6)")
    y -= 51 * mm
    draw_motion_curve(c, MARGIN, y, card_w, 45 * mm, (0, .4, 0, 1),
                      "Out bold", "cubic-bezier(0,.4,0,1)")
    draw_motion_curve(c, MARGIN + card_w + gap, y, card_w, 45 * mm, (.4, 0, 0, 1),
                      "In-out bold", "cubic-bezier(.4,0,0,1)")
    text(c, MARGIN, y - 8 * mm, "Unassigned: 600ms, bounce, stagger, celebration, parallax, and page choreography.", 6.6, "#717171")
    footer(c)
    finish_page(c)


def draw_reduced_motion(c: canvas.Canvas) -> None:
    y = page_header(
        c, 11, "Foundation / Reduced motion", "Remove movement; preserve meaning",
        "Reduced mode is an immediate semantic replacement, not a slower animation. Spatial and continuous motion disappear while state, focus, and recovery remain explicit.",
    )
    text(c, MARGIN, y, "STANDARD MOTION", 6.7, "#717171")
    text(c, MARGIN + 91 * mm, y, "PREFERS-REDUCED-MOTION: REDUCE", 6.7, "#717171")
    rows = [
        ("Popup", "150ms enter from trigger", "0ms placement at destination", "Translate / scale removed"),
        ("Selection and error", "150ms highlight; error is 0ms", "Immediate state and message", "No delayed semantics"),
        ("Busy", "Spinner plus persistent busy text", "Static cue + persistent busy text", "aria-busy remains true"),
    ]
    top = y - 9 * mm
    col_w = (CONTENT_W - 8 * mm) / 2
    for idx, (name, standard, reduced, note) in enumerate(rows):
        yy = top - idx * 55 * mm
        for col, body in enumerate((standard, reduced)):
            x = MARGIN + col * (col_w + 8 * mm)
            c.setFillColor(hex_color("#F8F8F8"))
            c.setStrokeColor(hex_color("#DADADA"))
            c.roundRect(x, yy - 44 * mm, col_w, 42 * mm, 8, fill=1, stroke=1)
            text(c, x + 6 * mm, yy - 11 * mm, name, 8.5, "#292929", weight=600)
            if name == "Popup":
                c.setFillColor(hex_color("#222222" if col == 0 else "#292929"))
                c.roundRect(x + 6 * mm + col * 4 * mm, yy - 31 * mm, 30 * mm, 13 * mm, 6, fill=1, stroke=0)
                text(c, x + 11 * mm + col * 4 * mm, yy - 26 * mm, "Options", 6.6, "#FFFFFF")
            elif name == "Selection and error":
                c.setFillColor(hex_color("#E9E9E9"))
                c.roundRect(x + 6 * mm, yy - 31 * mm, 34 * mm, 12 * mm, 4, fill=1, stroke=0)
                text(c, x + 11 * mm, yy - 26 * mm, "Selected", 6.6, "#292929")
                text(c, x + 45 * mm, yy - 26 * mm, "Error shown", 6.6, "#AE2E24", weight=600)
            else:
                c.setStrokeColor(hex_color("#717171"))
                c.setLineWidth(1.5)
                c.circle(x + 12 * mm, yy - 25 * mm, 4 * mm, fill=0, stroke=1)
                text(c, x + 22 * mm, yy - 27 * mm, "Syncing records...", 7, "#292929")
            text(c, x + 6 * mm, yy - 39 * mm, body, 6.2, "#505050")
        text(c, MARGIN + 91 * mm, yy - 49 * mm, note, 6.1, "#717171")
    c.setFillColor(hex_color("#111111"))
    c.roundRect(MARGIN, 25 * mm, CONTENT_W, 28 * mm, 8, fill=1, stroke=0)
    text(c, MARGIN + 8 * mm, 42 * mm, "IMMEDIATE STATE", 7, "#AFAFAF", weight=600)
    text(c, MARGIN + 8 * mm, 32 * mm, "Focus, error, critical status, completion, and availability never wait for motion.", 9, "#DBDBDB")
    footer(c)
    finish_page(c)


def draw_chart_plot(c: canvas.Canvas, x: float, y: float, w: float, h: float,
                    compact: bool = False) -> None:
    left = x + (11 if compact else 15) * mm
    bottom = y + 10 * mm
    plot_w = w - (17 if compact else 23) * mm
    plot_h = h - 19 * mm
    c.setStrokeColor(hex_color("#DADADA"))
    c.setLineWidth(0.6)
    for step in range(4):
        yy = bottom + step * plot_h / 3
        c.line(left, yy, left + plot_w, yy)
        text(c, x + 2 * mm, yy - 1.7 * mm, f"{11 + step}M", 5.4, "#717171", mono=True)
    c.setStrokeColor(hex_color("#717171"))
    c.line(left, bottom, left, bottom + plot_h)
    c.line(left, bottom, left + plot_w, bottom)
    personal = [.18, .42, .38, .70, .63, .86]
    benchmark = [.28, .34, .47, .55, .60, .68]
    for series, color_value, dashed, filled in (
        (personal, "#168EFF", False, False),
        (benchmark, "#C87B00", True, True),
    ):
        c.setStrokeColor(hex_color(color_value))
        c.setLineWidth(2 * CSS_PX)
        if dashed:
            c.setDash(4, 3)
        points = []
        for idx, value in enumerate(series):
            px = left + idx * plot_w / (len(series) - 1)
            py = bottom + value * plot_h
            points.append((px, py))
        for first, second in zip(points, points[1:]):
            c.line(first[0], first[1], second[0], second[1])
        c.setDash()
        for px, py in points:
            c.setFillColor(hex_color(color_value) if filled else hex_color("#FFFFFF"))
            c.setStrokeColor(hex_color(color_value))
            c.circle(px, py, 1.8 * mm, fill=1, stroke=1)
    focus_x = left + 4 * plot_w / 5
    c.setStrokeColor(hex_color("#717171"))
    c.setDash(2, 2)
    c.line(focus_x, bottom, focus_x, bottom + plot_h)
    c.setDash()
    text(c, focus_x - 12 * mm, bottom + plot_h + 3 * mm, "13,642,180", 6.1, "#292929", mono=True, weight=600)


def draw_data_visualization(c: canvas.Canvas) -> None:
    y = page_header(
        c, 12, "Foundation / Data visualization", "Primer anatomy, NosLog meaning",
        "DV-05 adopts Primer chart anatomy and interaction responsibilities while LD-03, JD-02, and DU-01 retain ownership of product colors.",
    )
    chart_y = y - 122 * mm
    c.setFillColor(hex_color("#FFFFFF"))
    c.setStrokeColor(hex_color("#C6C6C6"))
    c.roundRect(MARGIN, chart_y, CONTENT_W, 118 * mm, 8, fill=1, stroke=1)
    text(c, MARGIN + 8 * mm, chart_y + 105 * mm, "Recent score trend", 13, "#292929", weight=600)
    text(c, MARGIN + 8 * mm, chart_y + 96 * mm, "Basic / Expert - last 6 plays - score", 7.5, "#505050")
    c.setFillColor(hex_color("#F8F8F8"))
    c.roundRect(MARGIN + CONTENT_W - 38 * mm, chart_y + 96 * mm, 30 * mm, 11 * mm, 4, fill=1, stroke=0)
    text(c, MARGIN + CONTENT_W - 32 * mm, chart_y + 100 * mm, "View data", 7, "#292929", weight=500)
    legend_y = chart_y + 84 * mm
    c.setStrokeColor(hex_color("#168EFF"))
    c.setLineWidth(2 * CSS_PX)
    c.line(MARGIN + 8 * mm, legend_y, MARGIN + 23 * mm, legend_y)
    c.setFillColor(hex_color("#FFFFFF"))
    c.circle(MARGIN + 15.5 * mm, legend_y, 1.8 * mm, fill=1, stroke=1)
    text(c, MARGIN + 27 * mm, legend_y - 2 * mm, "Personal", 6.8, "#292929")
    c.setStrokeColor(hex_color("#C87B00"))
    c.setDash(4, 3)
    c.line(MARGIN + 58 * mm, legend_y, MARGIN + 73 * mm, legend_y)
    c.setDash()
    c.setFillColor(hex_color("#C87B00"))
    c.circle(MARGIN + 65.5 * mm, legend_y, 1.8 * mm, fill=1, stroke=0)
    text(c, MARGIN + 77 * mm, legend_y - 2 * mm, "Top 10% benchmark", 6.8, "#292929")
    draw_chart_plot(c, MARGIN + 7 * mm, chart_y + 9 * mm, CONTENT_W - 14 * mm, 68 * mm)
    callouts = [
        ("01", "Visible title", "Measure is identifiable without interaction."),
        ("02", "Subtitle context", "Dimension, range, and unit remain visible."),
        ("03", "Persistent legend", "Plot order, stroke, and marker differ."),
        ("04", "Exact value", "Pointer, keyboard, and touch expose the same value."),
    ]
    y = chart_y - 10 * mm
    for idx, (num, title_value, body) in enumerate(callouts):
        x = MARGIN + (idx % 2) * (CONTENT_W / 2)
        yy = y - (idx // 2) * 19 * mm
        text(c, x, yy, num, 6.4, "#717171", mono=True)
        text(c, x + 10 * mm, yy, title_value, 7.2, "#292929", weight=600)
        text(c, x + 10 * mm, yy - 6 * mm, body, 6.1, "#505050")
    footer(c)
    finish_page(c)


def draw_data_equivalence(c: canvas.Canvas) -> None:
    y = page_header(
        c, 13, "Foundation / Data access", "One dataset, equivalent paths",
        "The chart is never the only source of meaning. Visible conclusions, exact-value interaction, and the active same-data semantic table remain connected.",
    )
    col_w = (CONTENT_W - 8 * mm) / 2
    c.setFillColor(hex_color("#F8F8F8"))
    c.roundRect(MARGIN, y - 92 * mm, col_w, 86 * mm, 8, fill=1, stroke=0)
    text(c, MARGIN + 6 * mm, y - 17 * mm, "Current: 13,642,180 (+118,420)", 8, "#292929", weight=600)
    draw_chart_plot(c, MARGIN + 3 * mm, y - 83 * mm, col_w - 6 * mm, 58 * mm, compact=True)
    tx = MARGIN + col_w + 8 * mm
    c.setFillColor(hex_color("#FFFFFF"))
    c.setStrokeColor(hex_color("#C6C6C6"))
    c.roundRect(tx, y - 92 * mm, col_w, 86 * mm, 8, fill=1, stroke=1)
    text(c, tx + 6 * mm, y - 17 * mm, "Same-data semantic table", 8, "#292929", weight=600)
    rows = [
        ("Play", "Personal", "Benchmark"),
        ("04 Aug", "13,285,220", "12,900,000"),
        ("07 Aug", "13,523,760", "13,100,000"),
        ("10 Aug", "13,642,180", "13,240,000"),
    ]
    for row, values in enumerate(rows):
        yy = y - (29 + row * 12) * mm
        if row == 0:
            c.setFillColor(hex_color("#F8F8F8"))
            c.rect(tx + 5 * mm, yy - 5 * mm, col_w - 10 * mm, 10 * mm, fill=1, stroke=0)
        for col, value in enumerate(values):
            text(c, tx + (6 + col * 24) * mm, yy, value, 5.9, "#292929", mono=col > 0, weight=600 if row == 0 else 400)
        c.setStrokeColor(hex_color("#E1E1E1"))
        c.line(tx + 5 * mm, yy - 6 * mm, tx + col_w - 5 * mm, yy - 6 * mm)
    text(c, tx + 6 * mm, y - 82 * mm, "CSV optional - never replaces the table", 6.2, "#717171")
    y -= 108 * mm
    text(c, MARGIN, y, "INPUT EQUIVALENCE", 6.7, "#717171")
    rules = [
        ("Pointer / touch", "Dimension + series + Exact value + unit"),
        ("Keyboard", "Arrow keys move points; Home / End reach series ends"),
        ("Narrow", "Legend and actions recompose; no page overflow"),
        ("Contained table", "Labeled focusable scroller only when inherently wide"),
    ]
    for idx, (label, body) in enumerate(rules):
        yy = y - 14 * mm - idx * 18 * mm
        c.setFillColor(hex_color("#F8F8F8"))
        c.roundRect(MARGIN, yy - 8 * mm, CONTENT_W, 13 * mm, 5, fill=1, stroke=0)
        text(c, MARGIN + 6 * mm, yy - 2 * mm, label, 7, "#292929", weight=600)
        text(c, MARGIN + 45 * mm, yy - 2 * mm, body, 6.5, "#505050")
    footer(c)
    finish_page(c)


def draw_scaled_grid(c: canvas.Canvas, x: float, y: float, w: float, h: float,
                     label: str, tracks: int, gutter_label: str, margin_label: str) -> None:
    c.setFillColor(hex_color("#F8F8F8"))
    c.setStrokeColor(hex_color("#DADADA"))
    c.roundRect(x, y, w, h, 6, fill=1, stroke=1)
    inner_x = x + 7 * mm
    inner_w = w - 14 * mm
    gap = 1.2 * mm
    track_w = (inner_w - (tracks - 1) * gap) / tracks
    for idx in range(tracks):
        c.setFillColor(hex_color("#E9E9E9"))
        c.rect(inner_x + idx * (track_w + gap), y + 11 * mm, track_w, h - 24 * mm, fill=1, stroke=0)
    text(c, x + 5 * mm, y + h - 7 * mm, label, 7.4, "#292929", weight=600)
    text(c, x + 5 * mm, y + 4 * mm, f"{tracks} tracks - {gutter_label} - {margin_label}", 5.8, "#717171", mono=True)


def draw_responsive_grid(c: canvas.Canvas) -> None:
    y = page_header(
        c, 14, "Foundation / Responsive grid", "Container width chooses the tier",
        "These are scaled diagrams. The numeric labels are normative; the miniature physical widths are editorial notation only.",
    )
    gap = 7 * mm
    col_w = (CONTENT_W - gap) / 2
    draw_scaled_grid(c, MARGIN, y - 63 * mm, col_w, 58 * mm, "320px compact validation", 4, "12px gutter", "16px margin")
    draw_scaled_grid(c, MARGIN + col_w + gap, y - 63 * mm, col_w, 58 * mm, "390px representative", 4, "12px gutter", "16px margin")
    draw_scaled_grid(c, MARGIN, y - 130 * mm, col_w, 58 * mm, "672px intermediate entry", 8, "16px gutter", "24px margin")
    draw_scaled_grid(c, MARGIN + col_w + gap, y - 130 * mm, col_w, 58 * mm, "1056px wide entry", 12, "16px gutter", "32px margin")
    y -= 145 * mm
    rules = [
        ("Compact", "Below 672px - reflow at 320px without page-level horizontal scrolling."),
        ("Intermediate", "672-1055px - use measured content pressure, not a device label."),
        ("Wide", "1056px+ - use space for comparison, analysis, or parallel reading."),
        ("Nested", "Component recomposition uses its own measured failure point and container query."),
    ]
    for idx, (name, body) in enumerate(rules):
        yy = y - idx * 16 * mm
        text(c, MARGIN, yy, name, 7, "#292929", weight=600)
        text(c, MARGIN + 31 * mm, yy, body, 6.5, "#505050")
    footer(c)
    finish_page(c)


def draw_reflow_block(c: canvas.Canvas, x: float, y: float, w: float, label: str,
                      columns: int) -> None:
    c.setFillColor(hex_color("#FFFFFF"))
    c.setStrokeColor(hex_color("#C6C6C6"))
    c.roundRect(x, y, w, 83 * mm, 7, fill=1, stroke=1)
    text(c, x + 5 * mm, y + 73 * mm, label, 7, "#292929", weight=600)
    blocks = [
        ("1", "Search"), ("2", "Result status"), ("3", "Results"), ("4", "Filters"),
    ]
    if columns == 1:
        for idx, (num, name) in enumerate(blocks):
            yy = y + 58 * mm - idx * 13 * mm
            c.setFillColor(hex_color("#F8F8F8"))
            c.roundRect(x + 5 * mm, yy, w - 10 * mm, 9 * mm, 4, fill=1, stroke=0)
            text(c, x + 8 * mm, yy + 2.5 * mm, f"{num}  {name}", 5.8, "#292929")
    else:
        left_w = (w - 15 * mm) * .64
        for idx, (num, name) in enumerate(blocks[:3]):
            yy = y + 58 * mm - idx * 17 * mm
            c.setFillColor(hex_color("#F8F8F8"))
            c.roundRect(x + 5 * mm, yy, left_w, 12 * mm, 4, fill=1, stroke=0)
            text(c, x + 8 * mm, yy + 4 * mm, f"{num}  {name}", 5.8, "#292929")
        c.setFillColor(hex_color("#F8F8F8"))
        c.roundRect(x + 10 * mm + left_w, y + 24 * mm, w - left_w - 15 * mm, 46 * mm, 4, fill=1, stroke=0)
        text(c, x + 13 * mm + left_w, y + 61 * mm, "4  Filters", 5.8, "#292929")
    text(c, x + 5 * mm, y + 5 * mm, "Logical source order stays 1 -> 2 -> 3 -> 4", 5.6, "#717171")


def draw_responsive_recomposition(c: canvas.Canvas) -> None:
    y = page_header(
        c, 15, "Foundation / Responsive adaptation", "Recompose after content fails",
        "One logical source and focus order survives every composition. A layout transition needs a measured content-fit reason, not a framework breakpoint.",
    )
    gap = 6 * mm
    narrow_w = 52 * mm
    wide_w = CONTENT_W - 2 * narrow_w - 2 * gap
    draw_reflow_block(c, MARGIN, y - 93 * mm, narrow_w, "320px", 1)
    draw_reflow_block(c, MARGIN + narrow_w + gap, y - 93 * mm, narrow_w, "390px", 1)
    draw_reflow_block(c, MARGIN + 2 * (narrow_w + gap), y - 93 * mm, wide_w, "Measured wide region", 2)
    y -= 110 * mm
    checks = [
        ("Content-fit trigger", "Longest KO/JA/EN labels, controls, tables, and cards determine transition."),
        ("Text growth", "200% text and 400% zoom keep required content and focus visible."),
        ("Two-dimensional data", "Only inherently wide data receives a labeled contained scroller."),
        ("Extra wide space", "Use for comparison or parallel reading; do not enlarge a phone column."),
    ]
    for idx, (title_value, body) in enumerate(checks):
        yy = y - idx * 21 * mm
        c.setFillColor(hex_color("#F8F8F8"))
        c.roundRect(MARGIN, yy - 12 * mm, CONTENT_W, 16 * mm, 5, fill=1, stroke=0)
        text(c, MARGIN + 6 * mm, yy - 3 * mm, title_value, 7, "#292929", weight=600)
        text(c, MARGIN + 45 * mm, yy - 3 * mm, body, 6.4, "#505050")
    footer(c)
    finish_page(c)


def draw_alias_chip(c: canvas.Canvas, x: float, y: float, value: str, width: float) -> None:
    c.setFillColor(hex_color("#FFFFFF"))
    c.setStrokeColor(hex_color("#C6C6C6"))
    c.roundRect(x, y, width, 8 * mm, 4, fill=1, stroke=1)
    text(c, x + 3 * mm, y + 2.5 * mm, value, 5.9, "#292929", mono=True)


def draw_reusable_map(c: canvas.Canvas) -> None:
    y = page_header(
        c, 16, "Reusable ordinary UI", "Aliases name responsibility, not appearance",
        "FPR-04 stays lean. Each alias reuses behavior only where responsibility is genuinely shared and may not invent color, radius, shadow, or motion.",
    )
    groups = [
        ("Shell and navigation", ["AppHeader", "Overlay", "Disclosure"]),
        ("Search and refinement", ["SearchField", "ContentScopeSwitch", "FilterSortControl", "ViewModeSwitch"]),
        ("Entity and result", ["ResultCollection", "MusicEntityHeader", "DifficultySelector", "MetricSummary"]),
        ("Exact dense data", ["DataTable", "Pagination", "OrdinaryDataChart"]),
        ("Forms and feedback", ["FormField", "StatusMessage"]),
    ]
    for idx, (group, aliases) in enumerate(groups):
        yy = y - idx * 39 * mm
        c.setFillColor(hex_color("#F8F8F8"))
        c.roundRect(MARGIN, yy - 31 * mm, CONTENT_W, 28 * mm, 7, fill=1, stroke=0)
        text(c, MARGIN + 6 * mm, yy - 12 * mm, group, 8, "#292929", weight=600)
        x = MARGIN + 52 * mm
        available = CONTENT_W - 58 * mm
        chip_gap = 3 * mm
        chip_w = (available - (len(aliases) - 1) * chip_gap) / len(aliases)
        for alias in aliases:
            draw_alias_chip(c, x, yy - 20 * mm, alias, chip_w)
            x += chip_w + chip_gap
    footer(c)
    finish_page(c)


def draw_reusable_anatomy(c: canvas.Canvas) -> None:
    y = page_header(
        c, 17, "Reusable ordinary UI", "Anatomy protects the contract",
        "These diagrams identify required parts and semantics. They do not approve one final visual component or a universal polymorphic overlay.",
    )
    col_w = (CONTENT_W - 8 * mm) / 2
    c.setFillColor(hex_color("#F8F8F8"))
    c.roundRect(MARGIN, y - 78 * mm, col_w, 72 * mm, 8, fill=1, stroke=0)
    text(c, MARGIN + 6 * mm, y - 17 * mm, "FormField", 9, "#292929", weight=600)
    text(c, MARGIN + 6 * mm, y - 28 * mm, "Public name", 7, "#292929", weight=500)
    c.setFillColor(hex_color("#FFFFFF"))
    c.setStrokeColor(hex_color("#C9372C"))
    c.roundRect(MARGIN + 6 * mm, y - 47 * mm, col_w - 12 * mm, 13 * mm, 4 * CSS_PX, fill=1, stroke=1)
    text(c, MARGIN + 10 * mm, y - 42 * mm, "A very long public name", 7.3, "#292929")
    text(c, MARGIN + 6 * mm, y - 56 * mm, "Public name must be 20 characters or fewer.", 6.4, "#AE2E24", weight=600)
    text(c, MARGIN + 6 * mm, y - 66 * mm, "Label - value - constraint - error association - preserved input", 5.7, "#717171")

    ox = MARGIN + col_w + 8 * mm
    c.setFillColor(hex_color("#F8F8F8"))
    c.roundRect(ox, y - 78 * mm, col_w, 72 * mm, 8, fill=1, stroke=0)
    text(c, ox + 6 * mm, y - 17 * mm, "Overlay family", 9, "#292929", weight=600)
    overlays = [("Popover", "anchored context"), ("Menu", "action choice"), ("Dialog", "modal task"), ("Navigation", "new destination")]
    for idx, (kind, role) in enumerate(overlays):
        yy = y - (31 + idx * 10) * mm
        text(c, ox + 6 * mm, yy, kind, 6.7, "#292929", weight=600)
        text(c, ox + 30 * mm, yy, role, 6.3, "#505050")
    text(c, ox + 6 * mm, y - 66 * mm, "Choose semantics, focus, dismissal, geometry, and MO-02 by role.", 5.7, "#717171")

    y -= 94 * mm
    c.setFillColor(hex_color("#FFFFFF"))
    c.setStrokeColor(hex_color("#C6C6C6"))
    c.roundRect(MARGIN, y - 76 * mm, CONTENT_W, 70 * mm, 8, fill=1, stroke=1)
    text(c, MARGIN + 7 * mm, y - 18 * mm, "OrdinaryDataChart + DataTable", 9, "#292929", weight=600)
    draw_chart_plot(c, MARGIN + 5 * mm, y - 67 * mm, 75 * mm, 42 * mm, compact=True)
    text(c, MARGIN + 87 * mm, y - 28 * mm, "DataTable", 7, "#292929", weight=600)
    for idx, label in enumerate(["Headers and row identity", "Exact values and units", "Current-user context", "Responsive priority", "Same data as chart"]):
        text(c, MARGIN + 87 * mm, y - (39 + idx * 7) * mm, f"{idx + 1}. {label}", 6.4, "#505050")
    footer(c)
    finish_page(c)


def draw_schematic_tag(c: canvas.Canvas, x: float, y: float) -> None:
    c.setFillColor(hex_color("#292929"))
    c.roundRect(x, y, 38 * mm, 8 * mm, 4, fill=1, stroke=0)
    text(c, x + 4 * mm, y + 2.5 * mm, "SCHEMATIC - NOT FINAL PAGE", 5.6, "#FFFFFF", weight=600)


def draw_mobile_fragment_shell(c: canvas.Canvas, x: float, y: float, w: float, h: float,
                               label: str) -> None:
    c.setFillColor(hex_color("#FFFFFF"))
    c.setStrokeColor(hex_color("#C6C6C6"))
    c.roundRect(x, y, w, h, 9, fill=1, stroke=1)
    c.setFillColor(hex_color("#F8F8F8"))
    c.roundRect(x + 4 * mm, y + h - 15 * mm, w - 8 * mm, 9 * mm, 4, fill=1, stroke=0)
    text(c, x + 7 * mm, y + h - 12 * mm, "NosLog", 6.5, "#292929", weight=700)
    right_text(c, x + w - 7 * mm, y + h - 12 * mm, label, 5.7, "#717171", mono=True)


def draw_fragment_discovery(c: canvas.Canvas) -> None:
    y = page_header(
        c, 18, "Representative fragment / Discovery", "Search, commit status, then scan",
        "A controlled ordinary-UI fragment validates hierarchy and responsibilities. It is not a final Music page composition or a downstream visual target.",
    )
    draw_schematic_tag(c, MARGIN, y - 3 * mm)
    shell_y = 31 * mm
    gap = 9 * mm
    shell_w = (CONTENT_W - gap) / 2
    shell_h = y - 45 * mm
    for idx, width_label in enumerate(("390 CSS px", "scaled 320 CSS px / 200% text")):
        x = MARGIN + idx * (shell_w + gap)
        draw_mobile_fragment_shell(c, x, shell_y, shell_w, shell_h, width_label)
        text(c, x + 7 * mm, shell_y + shell_h - 28 * mm, "Find music", 12 if idx == 0 else 13, "#292929", weight=700)
        c.setFillColor(hex_color("#FFFFFF"))
        c.setStrokeColor(hex_color("#C6C6C6"))
        c.roundRect(x + 7 * mm, shell_y + shell_h - 48 * mm, shell_w - 14 * mm, 13 * mm, 4 * CSS_PX, fill=1, stroke=1)
        text(c, x + 11 * mm, shell_y + shell_h - 43 * mm, "Search title or artist", 6.5 if idx == 0 else 7.5, "#505050")
        text(c, x + 7 * mm, shell_y + shell_h - 59 * mm, "128 results for 'NOSTALGIA'", 6.2 if idx == 0 else 7.2, "#505050")
        c.setFillColor(hex_color("#F8F8F8"))
        c.roundRect(x + shell_w - 29 * mm, shell_y + shell_h - 64 * mm, 22 * mm, 9 * mm, 4, fill=1, stroke=0)
        text(c, x + shell_w - 25 * mm, shell_y + shell_h - 61 * mm, "Filters", 6, "#292929", weight=500)
        for row, (title_value, difficulty, color_value) in enumerate([
            ("Noah's song", "Expert 12", "#F03823"),
            ("ネコノテ・カリタガリ", "Hard 9", "#E86A00"),
            ("그랜드마스터 연습곡", "Normal 6", "#0BA45D"),
        ]):
            yy = shell_y + shell_h - (82 + row * (25 if idx == 0 else 31)) * mm
            c.setStrokeColor(hex_color("#E1E1E1"))
            c.line(x + 7 * mm, yy - 7 * mm, x + shell_w - 7 * mm, yy - 7 * mm)
            text(c, x + 7 * mm, yy, title_value, 6.9 if idx == 0 else 8.1, "#292929", weight=600)
            c.setFillColor(hex_color(color_value))
            c.circle(x + 9 * mm, yy - 8 * mm, 1.4 * mm, fill=1, stroke=0)
            text(c, x + 14 * mm, yy - 10 * mm, difficulty, 5.8 if idx == 0 else 7.0, "#505050")
    footer(c)
    finish_page(c)


def draw_fragment_music_detail(c: canvas.Canvas) -> None:
    y = page_header(
        c, 19, "Representative fragment / Music detail", "Identity first; analysis follows",
        "The fragment exercises MusicEntityHeader, difficulty, neutral metrics, approved judgement markers, and ordinary data-chart anatomy only.",
    )
    draw_schematic_tag(c, MARGIN, y - 3 * mm)
    panel_y = 30 * mm
    panel_h = y - 45 * mm
    c.setFillColor(hex_color("#FFFFFF"))
    c.setStrokeColor(hex_color("#C6C6C6"))
    c.roundRect(MARGIN, panel_y, CONTENT_W, panel_h, 8, fill=1, stroke=1)
    text(c, MARGIN + 8 * mm, panel_y + panel_h - 18 * mm, "Noah's song", 16, "#292929", weight=700)
    text(c, MARGIN + 8 * mm, panel_y + panel_h - 28 * mm, "Canon in the nostalgic rain", 7, "#505050")
    for idx, (name, color_value) in enumerate([(n, l) for n, l, _ in DIFFICULTY]):
        x = MARGIN + 8 * mm + idx * 31 * mm
        c.setFillColor(hex_color("#F8F8F8"))
        c.roundRect(x, panel_y + panel_h - 45 * mm, 27 * mm, 9 * mm, 4, fill=1, stroke=0)
        c.setFillColor(hex_color(color_value))
        c.circle(x + 4 * mm, panel_y + panel_h - 40.5 * mm, 1.3 * mm, fill=1, stroke=0)
        text(c, x + 8 * mm, panel_y + panel_h - 43 * mm, name, 5.7, "#292929")
    metrics = [("Best score", "13,642,180"), ("Grade", "S"), ("Rank", "128 / 8,402")]
    for idx, (label, value) in enumerate(metrics):
        x = MARGIN + 8 * mm + idx * 53 * mm
        c.setFillColor(hex_color("#F8F8F8"))
        c.roundRect(x, panel_y + panel_h - 74 * mm, 48 * mm, 20 * mm, 6, fill=1, stroke=0)
        text(c, x + 5 * mm, panel_y + panel_h - 62 * mm, label, 5.8, "#505050")
        text(c, x + 5 * mm, panel_y + panel_h - 70 * mm, value, 8.5, "#292929", mono=True, weight=600)
    draw_chart_plot(c, MARGIN + 7 * mm, panel_y + 36 * mm, 104 * mm, 67 * mm)
    text(c, MARGIN + 119 * mm, panel_y + 95 * mm, "Judgement breakdown", 7.5, "#292929", weight=600)
    for idx, (name, light, _) in enumerate(JUDGEMENT):
        yy = panel_y + 83 * mm - idx * 11 * mm
        c.setFillColor(hex_color(light))
        c.roundRect(MARGIN + 119 * mm, yy - 3 * mm, (35 - idx * 4) * mm, 4 * mm, 2, fill=1, stroke=0)
        text(c, MARGIN + 158 * mm, yy - 2.5 * mm, name, 5.7, "#292929")
    footer(c)
    finish_page(c)


def draw_fragment_dense_ranking(c: canvas.Canvas) -> None:
    y = page_header(
        c, 20, "Representative fragment / Dense ranking", "Priority changes; relationships remain",
        "The narrow view preserves row identity and exact values. The wide view adds comparison columns without duplicating the current user or flattening table semantics.",
    )
    draw_schematic_tag(c, MARGIN, y - 3 * mm)
    top = y - 18 * mm
    narrow_w = 63 * mm
    wide_x = MARGIN + narrow_w + 9 * mm
    wide_w = CONTENT_W - narrow_w - 9 * mm
    for x, w, label in ((MARGIN, narrow_w, "320px priority"), (wide_x, wide_w, "Wide comparison")):
        c.setFillColor(hex_color("#FFFFFF"))
        c.setStrokeColor(hex_color("#C6C6C6"))
        c.roundRect(x, 35 * mm, w, top - 35 * mm, 8, fill=1, stroke=1)
        text(c, x + 6 * mm, top - 10 * mm, label, 7, "#292929", weight=600)
        headers = ["Rank", "Player", "Rating"] if w == narrow_w else ["Rank", "Player", "Rating", "Best 70", "Region"]
        column_x = [x + 6 * mm, x + 20 * mm, x + 46 * mm] if w == narrow_w else [x + 6 * mm, x + 22 * mm, x + 50 * mm, x + 72 * mm, x + 91 * mm]
        hy = top - 25 * mm
        c.setFillColor(hex_color("#F8F8F8"))
        c.rect(x + 5 * mm, hy - 6 * mm, w - 10 * mm, 12 * mm, fill=1, stroke=0)
        for cx, header in zip(column_x, headers):
            text(c, cx, hy - 1 * mm, header, 5.6, "#505050", weight=600)
        players = [("126", "pianist_a", "1,742"), ("127", "鍵盤奏者", "1,739"), ("128", "You", "1,736"), ("129", "very_long_name", "1,730"), ("130", "연주자", "1,728")]
        for row, values in enumerate(players):
            yy = hy - (18 + row * 17) * mm
            if values[1] == "You":
                c.setFillColor(hex_color("#E9E9E9"))
                c.rect(x + 5 * mm, yy - 6 * mm, w - 10 * mm, 13 * mm, fill=1, stroke=0)
            row_values = list(values) + (["1,704", "KR"] if w != narrow_w else [])
            for cx, value in zip(column_x, row_values):
                text(c, cx, yy, value, 5.8, "#292929", mono=value.replace(",", "").isdigit(), weight=600 if values[1] == "You" else 400)
            c.setStrokeColor(hex_color("#E1E1E1"))
            c.line(x + 5 * mm, yy - 7 * mm, x + w - 5 * mm, yy - 7 * mm)
        text(c, x + 6 * mm, 44 * mm, "Exact values - semantic headers - current context", 5.6, "#717171")
    footer(c)
    finish_page(c)


def draw_fragment_sync_recovery(c: canvas.Canvas) -> None:
    y = page_header(
        c, 21, "Representative fragment / Data sync", "State and recovery stay explicit",
        "This ordinary data-sync fragment tests loading, success, and recoverable failure with neutral message typography and approved Atlassian semantic chroma.",
    )
    draw_schematic_tag(c, MARGIN, y - 3 * mm)
    states = [
        ("Syncing", "#F8F8F8", "#717171", "Connecting local records...", "Static cue + aria-busy in reduced mode"),
        ("128 records connected", "#EFFFD6", "#6A9A23", "Last updated just now", "Review imported records"),
        ("Connection interrupted", "#FFECEB", "#C9372C", "Your existing records are unchanged.", "Try again"),
    ]
    y -= 20 * mm
    for idx, (title_value, bg, marker, body, action) in enumerate(states):
        yy = y - idx * 58 * mm
        c.setFillColor(hex_color(bg))
        c.roundRect(MARGIN, yy - 45 * mm, CONTENT_W, 40 * mm, 8, fill=1, stroke=0)
        c.setFillColor(hex_color(marker))
        c.circle(MARGIN + 10 * mm, yy - 20 * mm, 2.3 * mm, fill=1, stroke=0)
        text(c, MARGIN + 18 * mm, yy - 17 * mm, title_value, 9.5, "#292929", weight=600)
        text(c, MARGIN + 18 * mm, yy - 27 * mm, body, 7, "#292929")
        if idx == 0:
            c.setFillColor(hex_color("#E9E9E9"))
            c.roundRect(MARGIN + CONTENT_W - 63 * mm, yy - 31 * mm, 54 * mm, 12 * mm, 4 * CSS_PX, fill=1, stroke=0)
            text(c, MARGIN + CONTENT_W - 58 * mm, yy - 26.5 * mm, "REDUCED: static cue + aria-busy", 5.8, "#505050", weight=500)
        else:
            c.setFillColor(hex_color("#FFFFFF"))
            c.setStrokeColor(hex_color("#C6C6C6"))
            c.roundRect(MARGIN + CONTENT_W - 56 * mm, yy - 31 * mm, 47 * mm, 12 * mm, 4 * CSS_PX, fill=1, stroke=1)
            text(c, MARGIN + CONTENT_W - 50 * mm, yy - 26.5 * mm, action, 6.4, "#292929", weight=500)
        text(c, MARGIN + 18 * mm, yy - 37 * mm, "Named state - persistent copy - programmatic semantics - one recovery path", 5.8, "#505050")
    footer(c)
    finish_page(c)


def draw_review_gate(c: canvas.Canvas) -> None:
    y = page_header(
        c, 22, "Review gate", "What approval of this draft means",
        "Approval promotes a visual reading layer - not new Foundation values, component appearance, final pages, or production implementation.",
    )
    items = [
        ("01", "Verify exact sources", "Pinned Pretendard, Spectrum, Lucide, Atlassian, and Primer evidence must pass the fail-closed validator."),
        ("02", "Approve the complete reading layer", "Visual core, motion, data access, responsive rules, reusable anatomy, and four controlled fragments are one review artifact."),
        ("03", "Integrate only after approval", "Place approved plates before the detailed specification appendix in the milestone PDF without changing canonical Markdown."),
        ("04", "Render the final milestone again", "Verify every integrated page, bookmarks, links, overflow, searchable text, and metadata before release."),
    ]
    for number, title_value, body in items:
        c.setFillColor(hex_color("#F8F8F8"))
        c.roundRect(MARGIN, y - 35 * mm, CONTENT_W, 30 * mm, 8, fill=1, stroke=0)
        text(c, MARGIN + 7 * mm, y - 18 * mm, number, 14, "#717171", mono=True)
        text(c, MARGIN + 25 * mm, y - 14 * mm, title_value, 11, "#292929")
        paragraph(c, MARGIN + 25 * mm, y - 22 * mm, body, CONTENT_W - 32 * mm, 7.6, 10.5, "#505050")
        y -= 39 * mm
    c.setFillColor(hex_color("#111111"))
    c.roundRect(MARGIN, 29 * mm, CONTENT_W, 31 * mm, 8, fill=1, stroke=0)
    text(c, MARGIN + 8 * mm, 49 * mm, "LOCKED SCOPE", 7, "#AFAFAF")
    text(c, MARGIN + 8 * mm, 39 * mm, "The complete chart viewer and editor remain unchanged and absent.", 10, "#DBDBDB")
    footer(c)
    finish_page(c)


PLATE_SPECS = [
    ("Typography", draw_typography),
    ("Neutral roles - Light", lambda c: neutral_role_page(c, 3, "Light", LIGHT)),
    ("Neutral roles - Dark", lambda c: neutral_role_page(c, 4, "Dark", DARK)),
    ("Material geometry", draw_material),
    ("Semantic color", draw_semantic_color),
    ("Domain color", draw_domain_color),
    ("Iconography", draw_iconography),
    ("Foundation guardrails", draw_dos_donts),
    ("Motion", draw_motion),
    ("Reduced motion", draw_reduced_motion),
    ("Data-visualization anatomy", draw_data_visualization),
    ("Equivalent data access", draw_data_equivalence),
    ("Responsive grid", draw_responsive_grid),
    ("Responsive adaptation", draw_responsive_recomposition),
    ("Reusable UI responsibilities", draw_reusable_map),
    ("Reusable UI anatomy", draw_reusable_anatomy),
    ("Discovery fragment", draw_fragment_discovery),
    ("Music-detail fragment", draw_fragment_music_detail),
    ("Dense-ranking fragment", draw_fragment_dense_ranking),
    ("Data-sync fragment", draw_fragment_sync_recovery),
]


def build(output: Path, mode: str = "review") -> None:
    global ARTIFACT_MODE, AUTO_SHOW_PAGE
    if mode not in {"review", "milestone"}:
        raise ValueError(f"Unsupported visual artifact mode: {mode}")
    ARTIFACT_MODE = mode
    AUTO_SHOW_PAGE = True
    output.parent.mkdir(parents=True, exist_ok=True)
    review = mode == "review"
    title_value = "NosLog 2.0 Visual System Review" if review else "NosLog 2.0 Approved Visual Plates"
    subject_value = (
        "Proposed complete visual reading layer for approved Foundation v0.1"
        if review
        else "Approved visual reading layer for NosLog 2.0 Design Guide v0.1"
    )
    c = canvas.Canvas(
        str(output),
        pagesize=A4,
        pageCompression=1,
        title=title_value,
        author="NosLog",
        subject=subject_value,
        creator="NosLog visual-core review generator",
        keywords="NosLog, design system, visual core, Foundation v0.1",
    )
    c.setTitle(title_value)
    c.setAuthor("NosLog")
    c.setSubject(subject_value)
    c.setCreator("NosLog visual-core review generator")
    c.setKeywords("NosLog, design system, visual core, Foundation v0.1")
    if review:
        draw_cover(c)
    for _, draw_plate in PLATE_SPECS:
        draw_plate(c)
    if review:
        draw_review_gate(c)
    c.save()


if __name__ == "__main__":
    milestone = "--milestone-plates" in sys.argv[1:]
    arguments = [value for value in sys.argv[1:] if value != "--milestone-plates"]
    output_path = Path(arguments[0]).resolve() if arguments else DEFAULT_OUTPUT
    build(output_path, mode="milestone" if milestone else "review")
    print(output_path)
