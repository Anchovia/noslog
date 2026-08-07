# NosLog 2.0 Foundation S4 Chart Viewer Structural Validation

## Document Control

- Status: `Approved — S4 First Review complete`
- Canonical language: English
- Korean companion:
  [30-foundation-s4-chart-viewer-structural-validation.ko.md](./30-foundation-s4-chart-viewer-structural-validation.ko.md)
- Started: 2026-08-07
- Approved: 2026-08-07
- Scope: structural validation of the approved focused-shell, typography, spacing,
  container, player-control, settings-disclosure, two-dimensional-content, target,
  state, and responsive contracts on representative specimen `S4`
- Interactive specimen:
  [s4-chart-viewer-structure.html](./specimens/s4-chart-viewer-structure.html)
- Approval boundary: this document does not approve final color, material, renderer
  art, piano or note geometry, exact production dimensions, final iconography,
  production screen composition, PixiJS/WebGL implementation, chart timing, or
  application code

## Related Authority

- [Chart Viewer page brief](./07-chart-viewer-page-brief.md)
- [Information architecture](./02-information-architecture.md)
- [Music Detail page brief](./05-music-detail-page-brief.md)
- [Foundation v0.1 research brief](./24-foundation-v0.1-research-brief.md)
- [Foundation semantic role map](./25-foundation-semantic-role-map.md)
- [Foundation typography and layout candidates](./26-foundation-typography-layout-candidates.md)
- [Specialized pattern exception register](./23-specialized-pattern-exception-register.md)

The approved Chart Viewer brief owns chart identity, entry and return, Falling and
Full-sheet meaning, playback continuity, renderer capability and recovery, fullscreen,
local-audio privacy, reporting, states, and browser acceptance. Documents `25` and
`26` own the shared Foundation contracts. Document `23` owns the narrow exception for
genuinely two-dimensional chart content. This validation may expose a conflict but may
not silently rewrite any of those authorities.

## Validation Purpose

`S4` tests whether the focused chart-inspection destination can preserve the verified
NOSTALGIA viewer and timing behavior while correcting the current shell and control
hierarchy. It must answer:

1. Can chart identity, Falling/Full-sheet mode, hand legend, visualization, core
   playback, quick settings, detailed settings, and reporting fit at `320 CSS px`
   without document horizontal scrolling?
2. Can the core transport remain visibly attached to the Falling renderer instead of
   falling below the initial viewport or behaving like an unrelated page footer?
3. Can desktop use a centered, geometry-limited player rather than a stretched mobile
   canvas or a permanent right settings rail?
4. Can high-frequency speed and metronome controls stay visible while lower-frequency
   audio, volume, Strict performance, and shortcut help use contextual disclosure?
5. Can detailed settings use a compact bottom panel and a wide anchored popover
   without changing their information order or covering the core transport?
6. Can Full sheet keep four-measure columns, one complete compact column plus a next-
   column cue, multiple wide columns, and local horizontal movement without causing
   document-level two-dimensional scrolling?
7. Can persistent tutorial copy disappear while renderer, fullscreen, audio, and
   overflow guidance remain discoverable only when the corresponding condition exists?
8. Can the same structure survive Korean, Japanese, English, `200%` text, keyboard
   navigation, visible focus, renderer failure, and settings focus restoration?

## Non-goals

- This is not the final page design, final Figma screen, or production implementation.
- It does not redraw or replace the current PixiJS/WebGL Falling renderer, piano,
  notes, hand colors, timing engine, Strict-performance rules, trill, tenuto, or
  glissando behavior.
- It does not approve the specimen's grayscale surface treatment, illustrative chart
  marks, exact `276px` sheet column, or exact renderer height as production tokens.
- It does not add a persistent settings rail, force landscape, auto-hide essential
  controls, upload local audio, or expose a new independent chart catalog.
- It does not finalize browser feature detection, WebGL restoration code, report API,
  fullscreen implementation, or saved preference persistence.
- It does not use the legacy NOSTORY Figma as current layout authority.

## Observed Baseline

### Repository and browser evidence — 2026-08-07

| ID          | Observation                                                                                                                                                                                                              | Status     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| `S4-OBS-01` | The public route already validates one published chart and the current viewer already contains Falling, Full sheet, four-measure columns, hand legend, local audio, speed, metronome, Strict performance, and reporting. | `Observed` |
| `S4-OBS-02` | The current application shell still exposes the global header and footer around a destination that the approved IA defines as focused.                                                                                   | `Observed` |
| `S4-OBS-03` | The current rendered document contains nested `main` landmarks in the viewer route.                                                                                                                                      | `Observed` |
| `S4-OBS-04` | At `320 × 720`, the current Falling renderer starts around `309.75px`, ends around `799px`, and places Play around `812px`; core playback is therefore below the initial viewport.                                       | `Observed` |
| `S4-OBS-05` | At `390 × 844`, the same hierarchy still places core playback below the renderer rather than keeping it attached inside the initial task unit.                                                                           | `Observed` |
| `S4-OBS-06` | At `1440 × 900`, the current renderer consumes nearly the visible height and Play begins around `864px`; wide space does not correct the vertical task separation.                                                       | `Observed` |
| `S4-OBS-07` | The current `32px` tabs, `36px` restart control, and approximately `14px` checkbox targets are below the approved ordinary public `44px` effective-target contract.                                                      | `Observed` |
| `S4-OBS-08` | An always-visible explanatory block consumes compact space even when neither error recovery nor local overflow instruction is needed.                                                                                    | `Observed` |
| `S4-OBS-09` | Full sheet already scrolls horizontally inside its own region; one compact column and multiple desktop columns can be preserved without page-wide horizontal scrolling.                                                  | `Observed` |
| `S4-OBS-10` | Current browser support uses a Safari user-agent expression to disable Falling rather than attempting renderer capability and initialization.                                                                            | `Observed` |
| `S4-OBS-11` | Current Falling initialization and WebGL context loss do not yet have the complete loading, recovery, fallback, and retry boundary approved by the page brief.                                                           | `Observed` |

These observations are migration and failure evidence only. The production viewer's
verified chart mathematics and behavior remain a functional baseline, but its current
shell and geometry are not visual authority.

## Approved Contracts Under Test

### Focused shell and chart identity

The viewer excludes ordinary NosLog global navigation and footer. It keeps one clear
return to the source Music Detail context, the original chart title, artist, selected
difficulty, note count, and duration. Original-title identity remains concise; title
translation disclosure stays in Music Detail and is not duplicated in the focused
viewer.

Falling and Full sheet remain one manual tab relationship with connected `tab` and
`tabpanel` semantics. Arrow keys move focus; Enter or Space activates the focused tab.
No mode change silently rewrites the selected chart.

### Falling player and control hierarchy

- The Falling renderer and piano remain unchanged production responsibilities.
- The renderer uses the available task area and preserves its internal aspect and
  lane geometry. Wide layout limits the useful renderer width instead of stretching
  indefinitely.
- Play/Pause, Restart, seek position, elapsed/duration, fullscreen when supported,
  and detailed-settings entry form one core transport attached directly to the
  renderer.
- Note speed and metronome are high-frequency fast controls on a separate supporting
  row. A wider layout may align rows only when full localized labels and targets fit;
  it may not force every control into one permanent line.
- Local audio, metronome volume, Strict performance, and shortcut help are detailed
  settings. They use a bottom panel at compact widths and an anchored popover at wide
  widths. The same labels and order remain across both presentations.
- Desktop does not reserve a permanent right settings rail. That space remains
  available for the primary visualization and balanced centering.

### Full sheet and local two-dimensional movement

- Full sheet keeps the approved four-measure grouping, timing and meter annotations,
  hand distinction, and ordered columns.
- At compact width, one complete column remains readable and part of the next column
  provides a spatial continuation cue. A concise horizontal-movement hint appears
  only while local overflow exists.
- The Full-sheet region—not the document—is the horizontal scroll container. Optional
  `proximity` snap may assist column starts but must not trap oversized content.
- Wide space reveals multiple complete columns. It does not enlarge note bars merely
  to fill the viewport.

### Conditional guidance and failure states

There is no persistent tutorial block. Guidance and status are conditional:

- a local overflow hint only when Full sheet actually overflows;
- a concise Falling loading state while the renderer initializes;
- a concise no-notes state when the published chart has no displayable notes;
- a Falling failure status that switches to usable Full sheet and offers Retry;
- a fullscreen rejection status that leaves the current viewer usable;
- a local-audio error inside detailed settings while chart-only playback continues.

Status messages are programmatic and do not move focus merely to announce a change.
Detailed-settings dismissal restores focus to its trigger.

### Foundation and accessibility contract

- Compact uses safe-aware `16px` outer spacing and grows by measured capacity rather
  than device labels.
- Shared user-facing text does not fall below the approved `12px` product minimum.
- Ordinary public effective pointer targets remain at least `44 × 44px`.
- Required content reflows at `320 CSS px`; Full sheet is the documented local
  two-dimensional exception.
- The page does not force device orientation and preserves the task in portrait and
  landscape.
- Hand meaning cannot rely on cyan/red alone in production; labels and non-color
  semantics remain available.
- The renderer has a stable accessible purpose and summary rather than narrating every
  animation frame.
- Visible focus, slider names and values, manual tabs, dialog labeling, Escape close,
  and focus restoration remain required.

## Broad Reference Comparison

| Source                                                                                                                        | Transferable finding                                                                                    | NosLog application                                                        | Limitation                                                       |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [Current public route](<../../app/(nevigation)/music/[index]/[difficulty]/pattern/page.tsx>)                                  | One selected published chart is validated before rendering.                                             | Preserve exact chart identity and return boundary.                        | Current shell and states are not 2.0 layout authority.           |
| [Current viewer shell](../../components/chart-pattern/chartSheetViewer.tsx)                                                   | Falling, Full sheet, four-measure columns, legend, and local sheet scrolling exist.                     | Preserve verified functions while replacing the shell hierarchy.          | Fixed geometry and UA fallback are migration evidence.           |
| [Current Falling viewer](../../components/chart-pattern/fallingChartViewer.tsx)                                               | Player, audio, speed, metronome, Strict performance, piano, and PixiJS drawing exist.                   | Keeps renderer redesign outside S4.                                       | Current controls do not yet satisfy the complete state contract. |
| [Approved Chart Viewer brief](./07-chart-viewer-page-brief.md)                                                                | Owns domain behavior, state, privacy, fallback, and accessibility requirements.                         | Governs S4 meaning and acceptance.                                        | It intentionally leaves exact appearance open.                   |
| [W3C APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)                                                                | Tabs need connected roles, selected state, and predictable keyboard activation.                         | Supports manual Falling/Full-sheet tabs.                                  | It does not choose renderer fallback.                            |
| [W3C APG Slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)                                                            | Sliders require names, values, and keyboard behavior.                                                   | Governs seek and metronome-volume controls.                               | Touch assistive-technology testing remains necessary.            |
| [W3C APG Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)                                   | Composite controls require visible, predictable focus movement.                                         | Informs tabs, settings, Escape, and focus restoration.                    | Exact shortcut keys remain a product decision.                   |
| [WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                        | Required content works at `320 CSS px`; genuine diagrams may use a local 2D exception.                  | Restricts horizontal scrolling to Full sheet.                             | It does not prescribe chart column width.                        |
| [WCAG Orientation](https://www.w3.org/WAI/WCAG21/Understanding/orientation)                                                   | Content should not require one orientation unless essential.                                            | Rejects forced landscape and rotate gates.                                | It does not size the piano.                                      |
| [WCAG Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)                             | Author-positioned layers must not fully hide focused controls.                                          | Constrains attached transport and settings panels.                        | Exact scroll padding requires production testing.                |
| [WCAG Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)                                      | Compact controls need sufficient size or spacing.                                                       | Supports the stricter NosLog `44px` public target.                        | WCAG's minimum is not the product token.                         |
| [WCAG Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content)                                         | Visual information needs an equivalent purpose or description.                                          | Requires stable renderer and sheet summaries.                             | It does not require frame-by-frame narration.                    |
| [WCAG Status Messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)                                      | Important status can be announced without moving focus.                                                 | Supports renderer, fullscreen, audio, and report status.                  | Excess announcements remain harmful.                             |
| [MDN Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide)                                   | Fullscreen is user-initiated, capability-dependent, asynchronous, and rejectable.                       | Treats fullscreen as a Falling-unit enhancement.                          | Browser and embedding policy varies.                             |
| [MDN Screen Orientation lock](https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock)                        | Orientation lock has capability and fullscreen restrictions.                                            | Supports keeping both orientations usable.                                | NosLog does not need to request a lock.                          |
| [MDN UA sniffing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent)                   | Feature detection is more reliable than browser-name assumptions.                                       | Replaces blanket Safari exclusion.                                        | Actual PixiJS initialization must still be tested.               |
| [MDN WebGL context lost](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event)           | WebGL context loss requires deliberate pause and recovery behavior.                                     | Establishes fallback and Retry requirements.                              | Restoration remains device-dependent.                            |
| [MDN CSS Scroll Snap](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap/Basic_concepts)                     | `proximity` can assist while mandatory snapping can make oversized content unreachable.                 | Supports optional Full-sheet column alignment.                            | Real touch and trackpad behavior still needs device tests.       |
| [MDN Viewport lengths](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length)                              | Dynamic viewport units reflect browser UI but can change while scrolling.                               | Supports visible-area testing rather than one fixed `100vh`.              | It does not select a final sizing formula.                       |
| [PixiJS Renderers](https://pixijs.com/8.x/guides/components/renderers)                                                        | PixiJS 8 recommends WebGL while WebGPU remains maturing.                                                | Preserves WebGL for the approved production strategy.                     | Framework guidance does not define UI hierarchy.                 |
| [PixiJS Application](https://pixijs.com/8.x/guides/components/application)                                                    | Renderer initialization is asynchronous and configurable.                                               | Requires an explicit initialization boundary before controls are enabled. | NosLog still owns teardown and recovery.                         |
| [WebKit Safari 15 features](https://webkit.org/blog/11989/new-webkit-features-in-safari-15/)                                  | Safari supports WebGL2 rather than categorically lacking WebGL.                                         | Refutes browser-brand-only Falling exclusion.                             | Device and GPU failure can still occur.                          |
| [web.dev Progressive enhancement](https://web.dev/articles/progressively-enhance-your-pwa)                                    | Core capability remains usable when an enhancement is unavailable.                                      | Keeps Full sheet usable without Falling or fullscreen.                    | PWA installation guidance is not adopted.                        |
| [Soundslice player overview](https://www.soundslice.com/help/en/player/basic/99/overview/)                                    | Notation, playback, tempo, audio, and visual instruments coexist across devices.                        | Supports one focused inspection/practice context.                         | Conventional notation differs from NOSTALGIA's 28 lanes.         |
| [Soundslice features](https://www.soundslice.com/features/)                                                                   | Fullscreen, shortcuts, metronome, keyboard, and configurable layout support practice.                   | Supports persistent core controls plus disclosed settings.                | Its feature breadth does not authorize new NosLog features.      |
| [Soundslice resizing notation](https://www.soundslice.com/help/en/player/basic/101/resizing-notation/)                        | Fit and zoom respond to available area rather than a fixed canvas.                                      | Supports area-based renderer sizing.                                      | NosLog does not re-engrave conventional notation.                |
| [Flat Playback](https://help.flat.io/en/music-notation-software/playback/)                                                    | Playback remains attached to the score-reading task.                                                    | Supports the renderer-plus-transport unit.                                | Flat's editor and notation differ.                               |
| [BBC GEL Video controls](https://bbc.github.io/gel/components/video-controls/)                                                | Custom players need obvious Play/Pause, robust range inputs, responsive controls, and accessible names. | Grounds core transport and control reflow.                                | NosLog is not an entertainment video player.                     |
| [YouTube screen-reader support](https://support.google.com/youtube/answer/189278?hl=en)                                       | Player controls and shortcuts need names, focus, and predictable keyboard operation.                    | Supports visible player-scoped commands.                                  | Auto-hide entertainment patterns are not adopted.                |
| [Vimeo player keyboard shortcuts](https://help.vimeo.com/hc/en-us/articles/12425998125073-What-are-player-keyboard-shortcuts) | Documented shortcuts improve expert playback control.                                                   | Supports contextual shortcut help.                                        | Vimeo's keys do not dictate NosLog keys.                         |
| [osu! keyboard shortcuts](https://osu.ppy.sh/wiki/en/Client/Keyboard_shortcuts)                                               | Rhythm-game users benefit from explicit, context-aware shortcuts.                                       | Supports a concise viewer-scoped shortcut set.                            | osu! gameplay and editor commands are out of scope.              |

### Evidence convergence

- Accessibility and responsive sources converge on one semantic task hierarchy,
  predictable controls, `320 CSS px` reflow, and local—not page-wide—scroll for
  genuine two-dimensional content.
- Music-player and score-viewer references converge on binding notation, transport,
  tempo, visual instrument, settings, and fullscreen to one focused practice context.
  They do not support placing core playback below an unrelated page region.
- Player-control references converge on always-available core playback, responsive
  reflow, labeled ranges, and contextual lower-frequency settings. They do not support
  one permanently crowded row or a desktop settings rail unrelated to task frequency.
- Browser and renderer sources converge on capability checks, progressive
  enhancement, and explicit recovery rather than browser-brand exclusion.
- No external source defines NOSTALGIA's 28 lanes, hand semantics, four-measure Full
  sheet, Strict performance, note-width interpretation, trill, tenuto, or glissando.
  Those remain verified NosLog logic and approved product decisions.

## Representative Fixture and State Matrix

| ID         | Purpose                        | Specimen content                                                                 |
| ---------- | ------------------------------ | -------------------------------------------------------------------------------- |
| `CV-ID-01` | Long Korean chart identity     | `교향곡 제9번 호단조 작품 95 ‘신세계로부터’` with mixed Latin metadata           |
| `CV-ID-02` | Long Japanese chart identity   | `交響曲第9番ホ短調作品95『新世界より』` with Japanese control labels             |
| `CV-ID-03` | Long English chart identity    | `Symphony No. 9 in E Minor, Op. 95, From the New World`                          |
| `CV-ID-04` | Falling visualization boundary | geometry placeholder, piano, attached core transport, and separate fast controls |
| `CV-ID-05` | Full-sheet spatial boundary    | four `276px` representative columns grouped as four measures                     |
| `CV-ID-06` | Compact detailed settings      | bottom panel with local audio, volume, Strict performance, and shortcuts         |
| `CV-ID-07` | Wide detailed settings         | the same information order in an anchored popover                                |
| `CV-ID-08` | Conditional recovery           | loading, no notes, Falling error, fullscreen error, and local-audio error        |

The specimen exposes eight component widths (`320`, `360`, `390`, `430`, `672`,
`1056`, `1280`, and `1440px`), three locales, default and `200%` text, six runtime
states, both view modes where valid, and detailed-settings disclosure. Production
tests must additionally cover zero/one/many notes, long real chart durations,
fullscreen enter/exit/rejection, local-audio cancellation and invalid files, WebGL
loss/restoration, reduced motion, text-spacing overrides, both orientations, real
touch devices, and all supported desktop/mobile browser engines.

## S4 Structural Slices

1. `S4-A` — one focused shell with explicit Music Detail return and concise chart
   identity;
2. `S4-B` — manual Falling/Full-sheet tabs with connected panels;
3. `S4-C` — persistent hand legend and chart summary;
4. `S4-D` — geometry-limited Falling renderer plus attached core transport;
5. `S4-E` — separate high-frequency speed and metronome controls;
6. `S4-F` — compact bottom settings and wide anchored settings popover;
7. `S4-G` — locally scrollable four-measure Full-sheet columns;
8. `S4-H` — conditional overflow guidance and runtime recovery status;
9. `S4-I` — compact-to-wide transformation without a persistent settings rail.

## Measured Structural Candidate

The user approved the following structural behavior after reviewing the interactive
specimen. Exact visual geometry remains for the later appearance and final design
stage.

### Focused player composition

- One `main` contains return, chart identity, view tabs, status, visualization,
  controls, and reporting. General global navigation and footer are absent.
- The centered Falling unit has an area-dependent height and a measured wide maximum.
  The specimen uses `1024px` only to validate that wide space stops stretching the
  renderer; it is not yet a Foundation width token.
- At the measured browser viewport, the representative `390px` frame produced a
  `356 × 345.59px` renderer with an attached `356 × 88px` transport. The `1280px`
  frame produced a `1024 × 345.59px` renderer with an attached `1024 × 62px`
  transport.
- Fast controls begin after an `8px` structural separation in the specimen and remain
  distinct from the core transport. Exact production spacing remains governed by the
  later component stage.

### Detailed settings disclosure

- Compact settings occupy the available inline width inside a modal bottom panel and
  preserve the renderer context behind a scrim.
- Wide settings use the same content in an anchored popover rather than reserving a
  persistent side column.
- At `320px + 200%` text, the measured panel remained inside the frame
  (`485.5–779.5px` inside `472.5–792.5px` in the review stage) with no frame-level
  horizontal overflow.
- Escape closes the panel, `aria-expanded` returns to `false`, and focus returns to
  the detailed-settings trigger.

### Full-sheet local movement

- At `390px`, the representative sheet scrollport measured `356px` while the
  four-column track measured `1140px`; the first `276px` column remains complete and
  part of the next column remains visible.
- At `1280px`, the region measured `1214px`, so all four representative columns fit
  without local overflow.
- These measurements validate the approved one-column-plus-cue and multi-column-wide
  behavior. They do not approve `276px` as the final production column token.

## Measurement Matrix

| Group                | Required measurements                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Compact              | `320`, `360`, `390`, `430px`                                                                      |
| Foundation changes   | `672` and `1056px`                                                                                |
| Wide                 | `1280`, `1440px`, and centered maximum-renderer behavior                                          |
| Text                 | default and `200%`; production also requires WCAG text-spacing and browser zoom checks            |
| Language             | Korean, Japanese, and English long chart identity and control labels                              |
| View                 | Falling and Full sheet                                                                            |
| State                | ready, loading, no notes, Falling error, fullscreen error, and local-audio error                  |
| Detailed settings    | compact bottom panel and wide anchored popover                                                    |
| Input                | keyboard tabs, Enter/Space activation, Escape dismissal, restored focus, pointer, and touch later |
| Two-dimensional rule | no frame overflow; compact local sheet overflow; wide multiple-column fit                         |

## Browser Validation Record — 2026-08-07

The structural specimen was served locally and measured in the test browser. Its
review controls change the component inline size rather than scaling an image. Values
validate structure and reflow only.

### Core matrix result

| Matrix            | Combination                                                                                  |   Cases | Failures |
| ----------------- | -------------------------------------------------------------------------------------------- | ------: | -------: |
| Falling views     | eight widths × three locales × two text scales × five valid Falling states                   |     240 |        0 |
| Full-sheet views  | eight widths × three locales × two text scales × six states                                  |     288 |        0 |
| Detailed settings | eight widths × three locales × two text scales                                               |      48 |        0 |
| Total             | frame overflow, attached transport, target, panel containment, and sheet-overflow assertions | **576** |    **0** |

Every passing result kept the core transport attached, prevented viewer-frame
horizontal overflow, retained at least `44px` for measured buttons and Selects, kept
detailed settings within the viewer, used local Full-sheet overflow at compact widths,
and fit the representative sheet without local overflow at `1280/1440px`.

### Interaction and state checks

| Check                                                                                | Result |
| ------------------------------------------------------------------------------------ | ------ |
| Right Arrow moves focus from Falling to Full sheet; Enter activates the focused tab  | `Pass` |
| Compact and wide tabs expose one selected panel and one connected inactive panel     | `Pass` |
| Core transport touches the renderer boundary at `390` and `1280px`                   | `Pass` |
| Settings open from the trigger, Escape closes them, and focus returns to the trigger | `Pass` |
| Falling failure selects usable Full sheet, exposes Retry, and Retry restores Falling | `Pass` |
| Ready state removes prior error messages rather than leaving stale visible status    | `Pass` |
| `320px + 200%` text retains `318px` client and scroll widths with no frame overflow  | `Pass` |
| `390px` Full sheet scrolls locally (`356/1140px`); `1280px` fits (`1214/1214px`)     | `Pass` |

### Demonstrated corrections

1. The first specimen used a `40px` Note-speed Select. Matrix testing found the target
   below the approved public contract; it was increased to a measured `44px` minimum.
2. The first compact detailed-settings panel inherited intrinsic file/range-input
   width and escaped at `320px`, especially under `200%` text. Explicit shrink and
   containment rules removed the frame overflow.
3. Author `display` rules initially overrode the HTML `hidden` state for status
   messages. Visual review caught a stale fullscreen error after the numeric matrix
   passed; a global explicit hidden contract corrected it, and state transition was
   re-tested.
4. The automated sheet assertion distinguishes intentional local overflow from a
   viewer-frame failure: compact sheet overflow is required, while `1280/1440px` must
   fit the representative four-column track.

## Decision and Validation Status Log

| ID       | Entry                                                                                                                                                              | Status     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| `S4V-01` | Treat the current global shell, nested landmark, below-fold transport, undersized controls, persistent help, and Safari UA block as migration evidence only.       | `Observed` |
| `S4V-02` | Preserve the approved focused viewer, exact chart identity, verified renderer behavior, two views, playback continuity, privacy, report, and return contract.      | `Approved` |
| `S4V-03` | Use a centered, geometry-limited wide renderer and do not add a persistent desktop settings rail.                                                                  | `Approved` |
| `S4V-04` | Remove always-visible tutorial copy; show only condition-dependent runtime status and local Full-sheet overflow guidance.                                          | `Approved` |
| `S4V-05` | Attach the core transport directly to Falling and keep speed/metronome in a separate fast-control row; align rows only when complete content fits.                 | `Approved` |
| `S4V-06` | Present detailed settings as a compact bottom panel and a wide anchored popover with one stable content order and restored trigger focus.                          | `Approved` |
| `S4V-07` | Keep Full sheet as the sole local two-dimensional scroll exception, with one complete compact column plus a continuation cue and multiple wide columns.            | `Approved` |
| `S4V-08` | Preserve explicit loading, empty, Falling fallback/Retry, fullscreen rejection, and local-audio continuation states without moving focus for status announcements. | `Approved` |
| `S4V-09` | The final measured `576` structural combinations and direct keyboard/state checks pass with zero failures.                                                         | `Observed` |
| `S4V-10` | Keep exact renderer, sheet-column, control, color, material, icon, and motion appearance plus all production code outside this gate.                               | `Approved` |

## Approved First Review Gate — 2026-08-07

After reviewing the interactive example, the user approved:

1. a centered, geometry-limited desktop renderer without a persistent settings rail;
2. removal of the always-on help block, retaining only conditional runtime status and
   Full-sheet overflow guidance;
3. an attached core transport and separate fast-control row, with wider alignment only
   when localized content and targets fit;
4. compact bottom-panel and wide anchored-popover presentations for one detailed-
   settings content model;
5. local Full-sheet horizontal movement with one complete compact column plus a next-
   column cue and multiple complete wide columns.

This approval validates content hierarchy, interaction grouping, responsive behavior,
state placement, and local-scroll ownership only. It does not approve final visual
design, exact production dimensions, renderer art, PixiJS/WebGL implementation, chart
logic, or application code.
