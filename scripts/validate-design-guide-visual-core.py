#!/usr/bin/env python3
"""Fail closed when a visual-core claim cannot be traced to approved evidence."""

from __future__ import annotations

import hashlib
import html
import json
import os
import re
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "scripts" / "design-guide-visual-core-manifest.json"
GENERATOR = ROOT / "scripts" / "generate-design-guide-visual-core.py"
FOUNDATION = ROOT / "docs" / "design" / "24-foundation-v0.1.md"
REUSABLE = ROOT / "docs" / "design" / "63-foundation-v0.1-reusable-ui-regression.md"
PACKAGE = ROOT / "node_modules" / "lucide-react" / "package.json"
SOURCE_ROOT = Path(os.environ.get("NOSLOG_GUIDE_SOURCE_DIR", "/private/tmp/noslog-guide-sources"))


def fail(message: str) -> None:
    raise AssertionError(message)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def function_source(source: str, name: str) -> str:
    match = re.search(rf"^def {re.escape(name)}\(.*?(?=^def |\Z)", source, re.M | re.S)
    if not match:
        fail(f"Missing generator function: {name}")
    return match.group(0)


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    foundation = FOUNDATION.read_text(encoding="utf-8")
    reusable = REUSABLE.read_text(encoding="utf-8")
    generator = GENERATOR.read_text(encoding="utf-8")

    for source_name in ("pretendardJP", "spectrumTokens"):
        record = manifest["sources"][source_name]
        archive = SOURCE_ROOT / record["archive"]
        if not archive.exists():
            fail(f"Missing pinned source archive: {archive}")
        actual = sha256(archive)
        if actual != record["sha256"]:
            fail(f"Checksum mismatch for {archive.name}: {actual}")

    for source_name, fields in (
        ("atlassianMotion", (("snapshot", "sha256"), ("applyingSnapshot", "applyingSha256"))),
        ("primerDataVisualization", (("snapshot", "sha256"),)),
    ):
        record = manifest["sources"][source_name]
        for path_key, hash_key in fields:
            snapshot = SOURCE_ROOT / record[path_key]
            if not snapshot.exists():
                fail(f"Missing pinned reference snapshot: {snapshot}")
            actual = sha256(snapshot)
            if actual != record[hash_key]:
                fail(f"Checksum mismatch for {snapshot.name}: {actual}")

    for filename in (
        "PretendardJP-Regular.ttf",
        "PretendardJP-Medium.ttf",
        "PretendardJP-SemiBold.ttf",
        "PretendardJP-Bold.ttf",
    ):
        if not (SOURCE_ROOT / "pretendard-jp" / filename).exists():
            fail(f"Missing official font weight: {filename}")

    spectrum_package = json.loads(
        (SOURCE_ROOT / "spectrum" / "package" / "package.json").read_text(encoding="utf-8")
    )
    if spectrum_package["version"] != manifest["sources"]["spectrumTokens"]["version"]:
        fail("Spectrum package version mismatch")

    variables = json.loads(
        (SOURCE_ROOT / "spectrum" / "package" / "dist" / "json" / "variables.json").read_text(encoding="utf-8")
    )
    shadow_refs = {
        "drop-shadow-emphasized": [
            ("0px", "2px", "8px", "{drop-shadow-ambient-color}"),
            ("0px", "1px", "4px", "{drop-shadow-transition-color}"),
            ("0px", "0px", "1px", "{drop-shadow-emphasized-key-color}"),
        ],
        "drop-shadow-elevated": [
            ("0px", "4px", "12px", "{drop-shadow-ambient-color}"),
            ("0px", "2px", "6px", "{drop-shadow-transition-color}"),
            ("0px", "0px", "2px", "{drop-shadow-elevated-key-color}"),
        ],
        "drop-shadow-dragged": [
            ("0px", "12px", "16px", "{drop-shadow-ambient-color}"),
            ("0px", "6px", "8px", "{drop-shadow-transition-color}"),
            ("0px", "0px", "6px", "{drop-shadow-dragged-key-color}"),
        ],
    }
    for token, expected in shadow_refs.items():
        actual = [(item["x"], item["y"], item["blur"], item["color"]) for item in variables[token]["ref"]]
        if actual != expected:
            fail(f"Spectrum shadow source changed: {token}")

    lucide = json.loads(PACKAGE.read_text(encoding="utf-8"))
    if lucide["version"] != manifest["sources"]["lucideReact"]["version"]:
        fail(f"Lucide version mismatch: {lucide['version']}")
    node_script = (
        "const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');"
        "const L=require('lucide-react');for(const n of ['Search','Info','X','ChevronRight'])"
        "console.log(n+' '+renderToStaticMarkup(React.createElement(L[n],{size:24,strokeWidth:2})))"
    )
    lucide_svg = subprocess.check_output(["node", "-e", node_script], cwd=ROOT, text=True)
    for fragment in (
        'd="m21 21-4.34-4.34"', 'cx="11" cy="11" r="8"',
        'cx="12" cy="12" r="10"', 'd="M12 16v-4"', 'd="M12 8h.01"',
        'd="M18 6 6 18"', 'd="m6 6 12 12"', 'd="m9 18 6-6-6-6"',
    ):
        if fragment not in lucide_svg:
            fail(f"Lucide geometry changed: {fragment}")

    atlassian_motion = (
        SOURCE_ROOT / manifest["sources"]["atlassianMotion"]["applyingSnapshot"]
    ).read_text(encoding="utf-8")
    for fragment in (
        "50ms", "100ms", "150ms", "200ms", "250ms", "400ms",
        "cubic-bezier(.4,1,.6,1)", "cubic-bezier(0.6,0,0.8,0.6)",
        "cubic-bezier(0,.4,0,1)", "cubic-bezier(.4,0,0,1)",
        "prefers-reduced-motion",
    ):
        if fragment not in atlassian_motion:
            fail(f"Atlassian motion snapshot no longer proves: {fragment}")

    primer_chart_raw = (
        SOURCE_ROOT / manifest["sources"]["primerDataVisualization"]["snapshot"]
    ).read_text(encoding="utf-8")
    primer_chart = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", primer_chart_raw)))
    for fragment in (
        "Chart anatomy", "Header", "Subheader", "Legend", "Toolbar Menu",
        "preview the data in a table", "download the data in a CSV",
        "2px width", "solid style", "circle shape",
    ):
        if fragment not in primer_chart:
            fail(f"Primer data-visualization snapshot no longer proves: {fragment}")

    for value in (
        "#FFFFFF", "#111111", "#F8F8F8", "#1B1B1B", "#292929", "#DBDBDB",
        "#0BA45D", "#E86A00", "#F03823", "#A65CE7", "#C2298A", "#FF8DCC",
        "#168EFF", "#3278BE",
    ):
        if value not in foundation or value not in generator:
            fail(f"Visual value is not traceable through Foundation and generator: {value}")

    motion_plate = function_source(generator, "draw_motion") + function_source(generator, "draw_reduced_motion")
    for fragment in ("0ms", "50ms", "100ms", "150ms", "200ms", "250ms", "400ms", "aria-busy"):
        if fragment not in foundation or fragment not in motion_plate:
            fail(f"Motion plate is not traceable through Foundation: {fragment}")
    for fragment in ("static cue", "immediate state"):
        if fragment not in foundation.lower() or fragment not in motion_plate.lower():
            fail(f"Motion plate is not traceable through Foundation: {fragment}")
    for source_curve, plate_curve in (
        ("cubic-bezier(.4,1,.6,1)", "(.4, 1, .6, 1)"),
        ("cubic-bezier(.6,0,.8,.6)", "(.6, 0, .8, .6)"),
        ("cubic-bezier(0,.4,0,1)", "(0, .4, 0, 1)"),
        ("cubic-bezier(.4,0,0,1)", "(.4, 0, 0, 1)"),
    ):
        if source_curve not in foundation or plate_curve not in motion_plate:
            fail(f"Motion curve is not traceable through Foundation: {source_curve}")

    data_plate = function_source(generator, "draw_data_visualization") + function_source(generator, "draw_data_equivalence")
    for fragment in (
        "Visible title", "Subtitle context", "Persistent legend", "Exact value",
        "Same-data semantic table", "CSV optional", "Home / End", "#168EFF", "#C87B00",
    ):
        if fragment not in data_plate:
            fail(f"Data-visualization plate is missing contract: {fragment}")

    responsive_plate = function_source(generator, "draw_scaled_grid") + function_source(generator, "draw_responsive_grid") + function_source(generator, "draw_responsive_recomposition")
    for fragment in ("320px", "390px", "672px", "1056px"):
        if fragment not in foundation or fragment not in responsive_plate:
            fail(f"Responsive plate is not traceable through Foundation: {fragment}")
    for source_value, plate_label in (
        ("`12px`", "12px gutter"), ("`16px`", "16px gutter"),
        ("`16px`", "16px margin"), ("`24px`", "24px margin"),
        ("`32px`", "32px margin"),
    ):
        if source_value not in foundation or plate_label not in responsive_plate:
            fail(f"Responsive spacing is not traceable: {plate_label}")
    for fragment in (
        ', 4, "12px gutter", "16px margin")',
        ', 8, "16px gutter", "24px margin")',
        ', 12, "16px gutter", "32px margin")',
    ):
        if fragment not in responsive_plate:
            fail(f"Responsive track mapping is missing: {fragment}")

    reusable_plate = function_source(generator, "draw_reusable_map") + function_source(generator, "draw_reusable_anatomy")
    for alias in (
        "AppHeader", "SearchField", "ContentScopeSwitch", "FilterSortControl",
        "ViewModeSwitch", "ResultCollection", "MusicEntityHeader", "DifficultySelector",
        "MetricSummary", "DataTable", "Pagination", "StatusMessage", "FormField",
        "Disclosure", "Overlay", "OrdinaryDataChart",
    ):
        if alias not in reusable or alias not in reusable_plate:
            fail(f"Reusable alias is not traceable through document 63: {alias}")

    fragment_source = function_source(generator, "draw_schematic_tag") + "".join(
        function_source(generator, name)
        for name in (
            "draw_fragment_discovery", "draw_fragment_music_detail",
            "draw_fragment_dense_ranking", "draw_fragment_sync_recovery",
        )
    )
    if re.search(r"chart viewer|chart editor|renderer|webgl|pixi", fragment_source, re.I):
        fail("Representative fragments crossed the locked viewer/editor boundary")
    for phrase in ("SCHEMATIC", "NOT FINAL PAGE"):
        if phrase not in fragment_source:
            fail(f"Representative-fragment status is missing: {phrase}")

    chroma = re.findall(r"#[0-9A-Fa-f]{6}", function_source(generator, "draw_cover"))
    if any(value.upper() not in {"#FFFFFF", "#111111", "#1B1B1B", "#444444", "#AFAFAF", "#505050", "#292929", "#C6C6C6", "#717171"} for value in chroma):
        fail("Cover contains non-neutral product chroma")

    guardrails = function_source(generator, "draw_dos_donts")
    if "#A65CE7" in guardrails or "#C9372C" in guardrails:
        fail("Guardrail plate reuses domain/feedback chroma decoratively")
    if "#0BA45D" not in guardrails or "Normal · 12" not in guardrails:
        fail("Difficulty chroma is not bound to its visible role label")

    for fragment in (
        "CSS_PX = 0.75",
        '("Full", 11 * mm, "50%")',
        "draw_size = px * CSS_PX",
        "glyph_size = 20 * CSS_PX",
    ):
        if fragment not in generator:
            fail(f"Missing CSS-pixel-to-PDF scale proof: {fragment}")

    if "Rejected" not in manifest["status"] and "not normative" not in manifest["status"]:
        fail("Review artifact status does not clearly prevent normative use")

    print("visual-core validation: PASS")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"visual-core validation: FAIL - {error}", file=sys.stderr)
        raise
