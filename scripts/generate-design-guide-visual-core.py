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
    right_text(c, PAGE_W - MARGIN, PAGE_H - 13 * mm, f"VISUAL CORE REVIEW  /  {page:02d}", 7.2)
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
    text(c, MARGIN, 8 * mm, "Proposed visual communication only · Normative values: document 24", 6.7, "#717171")
    right_text(c, PAGE_W - MARGIN, 8 * mm, "Viewer/editor excluded", 6.7, "#717171")


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
    text(c, 66 * mm, PAGE_H - 69 * mm, "Visual Core", 32, "#292929")
    text(c, 66 * mm, PAGE_H - 83 * mm, "Review 01", 32, "#292929")
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
        ("SCOPE", "Typography · color · material · iconography"),
        ("AUTHORITY", "Documents 24 and 63"),
        ("EXCLUDED", "Final screens · chart viewer/editor"),
    ]:
        text(c, 66 * mm, y, label, 7, "#717171")
        text(c, 96 * mm, y, value, 8.5, "#292929")
        y -= 9 * mm
    text(c, 66 * mm, 25 * mm, "2026-08-11  /  English", 8, "#717171")
    c.showPage()


def draw_typography(c: canvas.Canvas) -> None:
    y = page_header(
        c, 2, "Foundation / Typography", "One family, explicit roles",
        "The visual hierarchy comes from approved size, line-height, weight, and role boundaries—not decorative tracking or page-local invention.",
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
    c.showPage()


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
    c.showPage()


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
    c.showPage()


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
    c.showPage()


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
    c.showPage()


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
    text(c, MARGIN + 65 * mm, y - 31 * mm, "Icon supports—not replaces—the label", 7, "#717171")
    footer(c)
    c.showPage()


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
    c.showPage()


def draw_review_gate(c: canvas.Canvas) -> None:
    y = page_header(
        c, 10, "Review gate", "What approval of this draft means",
        "Approval promotes a visual reading layer—not new Foundation values, component appearance, final pages, or production implementation.",
    )
    items = [
        ("01", "Keep the editorial system", "White reading canvas, restrained dividers, compact metadata, and source-forward notation."),
        ("02", "Integrate the visual core", "Place approved plates before the detailed specification appendix in the milestone PDF."),
        ("03", "Build the remaining plates", "Motion, data-visualization anatomy, responsive diagrams, reusable UI anatomy, and representative page fragments."),
        ("04", "Render and inspect", "Verify every page, bookmarks, links, overflow, multilingual text, and PDF metadata before release."),
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
    c.showPage()


def build(output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(
        str(output),
        pagesize=A4,
        pageCompression=1,
        title="NosLog 2.0 Visual Core Review",
        author="NosLog",
        subject="Proposed visual reading layer for approved Foundation v0.1",
        creator="NosLog visual-core review generator",
        keywords="NosLog, design system, visual core, Foundation v0.1",
    )
    c.setTitle("NosLog 2.0 Visual Core Review")
    c.setAuthor("NosLog")
    c.setSubject("Proposed visual reading layer for approved Foundation v0.1")
    c.setCreator("NosLog visual-core review generator")
    c.setKeywords("NosLog, design system, visual core, Foundation v0.1")
    draw_cover(c)
    draw_typography(c)
    neutral_role_page(c, 3, "Light", LIGHT)
    neutral_role_page(c, 4, "Dark", DARK)
    draw_material(c)
    draw_semantic_color(c)
    draw_domain_color(c)
    draw_iconography(c)
    draw_dos_donts(c)
    draw_review_gate(c)
    c.save()


if __name__ == "__main__":
    output_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else DEFAULT_OUTPUT
    build(output_path)
    print(output_path)
