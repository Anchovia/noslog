# NosLog 2.0 implementation contract

Status: current implementation authority, consolidated on 2026-09-08 at the
user's request. This replaces the retired design-stage briefs and handoffs as
layout authority. Update rules here in place; do not append a competing rule.

## Authority and scope

1. The user's latest explicit decision.
2. Root `AGENTS.md` for process and preservation boundaries.
3. This contract for the common shell and responsive page composition.
4. Current Figma `NosLog v2.0.0` (`cVbWCxhkfxFfHmAKLCyKrD`), pages P1–P16 and
   components C1–C8, for page/component visuals, variables and Text Styles.
5. [Product rules](./product-rules.md) for behavior and data meaning that cannot
   be inferred from a picture. Existing domain code/tests supply implementation detail.

Z1 is decision history, not an implementation page. A representative Figma frame
width is not a CSS breakpoint. Raw exported container widths must not override
this common-shell decision. If Figma lacks a state, inspect existing functionality
and the product references; do not invent or remove product behavior.

The chart viewer/editor in their entirety and `/admin/*` are preserved. The
ordinary music/chart discovery catalogue and Music Detail remain in scope.

## Common layout: the approved osu!-inspired approach

The adopted principle is a bounded, centered content area. The numbers below are
NosLog's approved choices, not a claim about osu!'s current CSS.

- Header contents, ordinary main shell and footer contents share `width: 100%`,
  `max-width: 1000px` and automatic inline margins.
- Header/footer backgrounds and separators span the viewport.
- One global wrapper owns inline padding: 16px below 672px, 24px from 672px.
  Page roots must not add another copy of that padding.
- Widths are CSS pixels. Retina screenshot pixels and physical display dimensions
  are not layout inputs. Test the actual viewport, including scrollbar behavior.
- At a 1440px layout viewport the outer shell starts at 220px and its content at
  244px; usable content width is 952px. The ceiling does not expand on larger screens.
- Home search, destination grid, official news and NosLog announcements share a
  centered inner maximum of 640px. An inner reading measure can be narrower while
  retaining the common outer shell; it must not establish another page tier.

## Page modes

| Mode         | Viewport width       | Page behavior                                  |
| ------------ | -------------------- | ---------------------------------------------- |
| Compact      | below 672px          | Mobile composition; 16px global inline padding |
| Intermediate | 672px through 1055px | 24px global padding; intermediate composition  |
| Wide         | 1056px and above     | Wide composition within the same bounded shell |

Use viewport media queries for page modes, in both CSS and JavaScript. Never test
these thresholds against the padded content width or the 1000px-capped container.
CSS and JavaScript controlling the same composition must use the same query.
Do not invent separate transitions from Figma's 390/768/1024/1280 review canvases.

- **Music Detail:** Compact has a full-width area select and a separate equal-width
  action row. From Intermediate, the manual-activation tab list and identity-side
  actions switch together. Wide adds the existing 2:1 Chart Info, My Record and
  Tier/Evaluation columns. Ranking stays full-width. Selection and URL state survive
  every resize; CSS resizing must not reload data or reset forms.
- **Music/chart discovery and tiers:** Wide has the persistent left filter rail.
  Below Wide, preserve the staged full-screen filter flow. Do not replace it with
  a popover based on the earlier withdrawn proposal.
  Music/chart discovery's Wide sort trigger displays only the selected criterion
  beside the sort icon; its localized accessible name includes both the sort
  label and selected criterion. This user-approved exception replaces Figma's
  visible `Sort:` prefix.
  In Wide tiers, keep the Detailed view checkbox at the right end of the result
  count row, with the count on the left. This approved addition to the Figma Wide
  frame preserves the existing toggle and narrower-screen placement.
- **Bingo:** preserve the filter popover from Intermediate (672px), including Wide,
  and the full-screen filter in Compact. Current P14 includes explicit 768px popover
  frames (`3362:31976`, Dark); this control does not turn the page into Wide.
  The catalogue changes to four columns and detail to two columns at Wide (1056px).
  Preserve existing filter contents. It is not the discovery-rail contract.
  The detail-page reset trigger retains the full mission-column width in every
  mode, including Wide. This user-approved exception replaces the content-width
  reset trigger in P14 (`2914:9231`); preserve the outlined appearance and the
  confirmation dialog.
  Completed mission rows retain a concise localized completion label without the
  repeated instruction to press again to undo. Checkbox behavior is unchanged.
  Catalogue cards retain the divider across the full inner body width, and the
  Load more button spans the catalogue width. These user-approved exceptions
  replace the shorter divider and content-width button in P14 `2914:8419`.
- **Footer exception:** the approved content-driven single-line threshold remains
  840px; below it, center the stacked text. This does not change the page mode.
- **Profile:** Wide uses a 2:1 body grid within the same 1000px shell: Progress
  beside Record overview, then Best performances beside Recent plays. Its identity
  uses a 108px avatar and 32/40 name, with activity metadata below the name/badges.
  Below Wide, retain the 64px avatar and one-column section order. Private recent
  activity remains hidden; resizing must preserve selections and loaded records.
  The Wide Progress heading and metric/range controls share one vertically
  centered row. Narrower modes keep the controls below the heading.
- Component-local charts, labels and text may measure their actual available width
  to fit content. That measurement must not independently switch the page mode.

The retired 90% layout, 1440px maximum, proposed 1200/1280px stepping, unreachable
1216px inner query, 768px header query and 672px padded-area tab query are obsolete.

## Styling and behavior boundaries

Shared single-line text inputs retain a 44px minimum height in every page mode,
including Wide (P9 `2689:1465`, P10 `2734:88338`). Keep their height independent
of the responsive button/control height. Multiline fields retain their larger
minimum height; this correction does not resize buttons or icon controls.

The Rankings personal-position notice retains the existing 8px container radius.
The user approved this rounded form over the square corners in the Figma Wide
frame; do not flatten this notice when reconciling that frame.

Use the existing global styles, shared components and code-style conventions.
Use Figma variables and Text Styles with the approved exact semantic values;
do not hand-copy per-page colors, spacing or font stacks. The shared
[token file](../../app/styles/tokens.css) and
[foundation styles](../../app/styles/foundation.css) are the implementation mapping,
not an independent visual authority. Fix a verified mapping mismatch at its shared
source instead of overriding each page. Preserve exact Adobe Spectrum S2 neutrals;
Tailwind's default palette and legacy NOSTORY are not design sources.

Self-host the single unmodified `PretendardJPVariable.woff2` from Pretendard JP 1.3.9.
Keep its license, variable weights, official fallback stack and `font-display: swap`.
Use no `unicode-range`, split/subset generation or global font preload. Apply `ss05`
only in Korean. Keep natural tracking and existing semantic text roles; do not invent
per-page font weights. The standard Pretendard loader for preserved viewer/editor
and administrator routes remains unchanged. Do not replace licensed Lucide geometry
with approximate custom icons. Shared control/focus/disabled styles and ordinary
data-chart semantics remain in their existing components and mapped tokens.

Implement dark only while `NEXT_PUBLIC_ENABLE_THEME_SWITCHING=false`. Preserve
existing light styles and disabled theme controls; add no new light design.
Preserve KO/JA/EN, keyboard interaction, focus order, authentication, data meaning,
privacy boundaries and existing functionality while adjusting presentation.

## Verification and documentation discipline

- Measure compositions together: shell padding, header actions, select/tabs,
  filter rails and panel columns. A no-overflow check alone cannot certify layout.
- Test 320px, representative mobile, intermediate and desktop widths, plus both
  sides of every affected threshold. For reported resize instability, sweep the
  affected interval in both directions and record actual state transitions.
- Exercise the affected controls and preserve state through resizing in KO/JA/EN.
  Check Chromium, Firefox and WebKit where supported. Browser emulation is not a
  claim of testing physical devices.
- Compare the affected Figma nodes and rendered browser composition. Distinguish
  fixture/content differences from layout differences and from approved overrides.
- Run relevant automated tests, lint, typecheck and build. Report exact coverage
  and remaining failures; never call a page-suite audit complete from isolated checks.
- [Implementation evidence](../noslog-v2-implementation-verification.md) is a dated
  test log, not a layout authority or a source of new pending work.
- [Product rules](./product-rules.md) preserve the necessary behavioral baseline.
  Old briefs, audits, handoffs, Foundation/provenance documents and specimens are
  retired and removed after explicit approval of the 50-file deletion scope.
  Do not restore them as active rules. Committed history and the verified local
  backup preserve their original contents, including uncommitted documentation.
- The design-guide's six historical blocks are complete. This is implementation,
  not a new design-guide/PDF phase. The old PDF is historical, not current authority.

Historical design-guide PDF generators require the historical source package; they
are not part of current application validation and must not regenerate a supposed
current design authority from these two implementation documents.

Change this contract when the user changes the common layout, then update the code
and its regression expectations in the same work unit. Do not leave contradictory
normative text in another brief or handoff. The user owns all Git operations.
