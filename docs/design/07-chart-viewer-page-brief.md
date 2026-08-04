# NosLog 2.0 Chart-Viewer Page Brief

## Document Control

- Status: `Approved`
- Decision status: `Core focused-viewer contract approved: entry and return,
public and administrator identity, Falling and Full sheet modes, URL and playback
state, controls, fullscreen, feature-detected fallback, failure recovery,
responsive composition, accessibility, localization, and browser acceptance`
- Evidence status: `Repository inspection, current browser evidence, approved
information architecture, approved Music-detail contract, cited music-player and
rhythm-game comparables, rendering-platform documentation, responsive guidance,
accessibility standards, and the user-approved decision record`
- Date started: 2026-08-02
- Last decision update: 2026-08-03
- Canonical language: English
- Korean companion:
  [07-chart-viewer-page-brief.ko.md](./07-chart-viewer-page-brief.ko.md)
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Upstream entry and return contract:
  [05-music-detail-page-brief.md](./05-music-detail-page-brief.md)
- Recital dynamics Future Work:
  [11-exam-page-brief.md#future-work-recital-chart-authoring-and-viewing](./11-exam-page-brief.md#future-work-recital-chart-authoring-and-viewing)
- Scope: Public localized focused viewer for one published NosLog chart and the
  equivalent administrator preview shell where explicitly noted
- Excluded: Rewriting the PixiJS renderer or chart-timing engine, redesigning the
  chart editor, final Foundation tokens, final high-fidelity composition, and
  production implementation in this design-guide session

The approved 2.0 renderer and chart-data contract is Basic-only. Recital blue/red
background dynamics for strong and soft key pressure are separately approved Future
Work; Claude Design and implementation must not imply that current viewers already
encode or render those dynamics.

## Decision Labels

- **Observed:** Verified in the repository, current browser evidence, or an approved
  upstream artifact.
- **Approved:** Explicitly agreed with the user and authoritative for downstream
  design.
- **Proposed:** Evidence-based direction awaiting user approval.
- **Open:** Requires further research, testing, or a user decision.
- **Rejected:** Considered and explicitly not selected.
- **Superseded:** Replaced by a later approved direction.

This brief is authoritative for the approved Chart-viewer page behavior, information
hierarchy, fallback, and responsive contract. Exact typography, color, spacing,
radius, icon drawing, control dimensions, renderer maximum width, and final
content-driven transition values remain Foundation and downstream Claude Design work.
Those later decisions may refine expression but must not remove or reinterpret the
approved product contract.

## Purpose

The Chart viewer answers one primary question:

> How does this exact NOSTALGIA chart move, time, and assign its notes to the hands?

It is a focused chart-reading and playback workspace. It is not a playable scoring
game, a second Music-detail page, an editor, a general media player, or a separate
chart catalog. Users may inspect the animated Falling view, study the complete chart
in four-measure columns, optionally align a local audio file, and return to the exact
Music context without losing their place.

## Primary Context and Success

- **Approved upstream:** The viewer is a child destination of one Music and selected
  difficulty. It is also reachable through shared discovery when Chart scope is
  selected; discovery still resolves an exact published difficulty before entry.
- **Approved:** Mobile use around arcade play is the primary context. Desktop remains
  required and uses additional width and height intentionally for chart inspection.
- **Approved:** A successful visit lets the user understand note timing, path, hand,
  and keyboard behavior in Falling or Full sheet view, then return to the exact Music
  and difficulty context.
- **Approved:** The public viewer does not require authentication. Authentication is
  required only when a signed-out user deliberately starts the chart-error-report
  action.
- **Approved:** Audio selected by the user remains local to the browser and is never
  uploaded, persisted on the NosLog server, attached to a report, or exposed by name.
- **Approved:** Current visual styling and fixed pixel geometry are audit evidence,
  not NosLog 2.0 visual authority.

## Current-Product Evidence

### Observed Route and Published Data

- The public route resolves one Music index and case-insensitive difficulty at
  `/[locale]/music/[index]/[difficulty]/pattern`.
- The server exposes only a valid `publishedContent` document with a non-null
  `publishedRevision`; missing, unpublished, or schema-invalid content currently
  becomes Not Found.
- The public payload includes original title, artist, difficulty, official
  level, jacket, note count, duration, and published revision.
- The current explicit return target is the same localized Music and difficulty. The
  approved upstream contract additionally requires restoration of a known source
  content area when one exists.
- Administrator preview uses the same viewer component with preview identity and a
  saved revision rather than the public published snapshot.

### Observed View and Playback Implementation

- `ChartSheetViewer` owns a local `falling | sheet` mode. It currently defaults to
  Falling and does not expose the selection in the URL.
- The current Safari user-agent check forces Full sheet and disables Falling before
  attempting renderer initialization.
- Switching away from Falling unmounts `FallingChartViewer`; current time, selected
  local audio, playback speed, and metronome enabled state are therefore reset.
- Metronome volume and Strict performance are persisted separately in browser local
  storage.
- Falling playback provides play/pause, restart, seek and time, local audio, note
  speed, metronome and its volume, and Strict performance.
- No fullscreen control, player-scoped keyboard-shortcut contract, shortcut help, or
  renderer-initialization error surface currently exists.
- The rendered canvas currently uses `role="img"` and changes its accessible name with
  playback time. Full sheet exposes a focusable horizontal scroll region and one
  canvas image per four-measure column.

### Observed Chart Semantics to Preserve

- The chart has `28` lanes and distinguishes left- and right-hand guidance.
- Normal and tenuto notes use their note width and duration; glissando follows its
  path; trill alternates its approved lane pair at the stored interval and uses the
  approved fallback interval only when the chart omits one.
- Strict performance is optional rather than the default. For normal and tenuto it
  lights one representative lane; for an even width it biases toward the right side
  for a left-hand note and the left side for a right-hand note. Glissando continues
  to light the full path width. Trill continues to alternate the approved two
  representative lanes.
- Full sheet derives real measures from timing points, completes the last visible
  four-measure column, and shows measure numbers plus BPM or time-signature changes.
- These are product and domain behaviors to preserve. This page brief does not reopen
  their playback mathematics or canvas drawing style.

### Observed Responsive and Browser Evidence

- At `390×844`, the current Falling renderer reflows without document-level
  horizontal overflow, but the transport and secondary controls begin below the
  initial viewport.
- At `320×720`, the renderer narrows correctly, while the control group wraps and the
  user must scroll to reach essential playback actions.
- At `1440×900`, the current renderer nearly consumes the available height and the
  primary play control sits at or below the viewport edge despite ample horizontal
  space.
- At `390px`, Full sheet correctly needs horizontal scrolling: its intrinsic content
  is substantially wider than its viewport. At `1440px`, several columns fit without
  document-level horizontal overflow.
- The current viewer produces two `main` landmarks because it is mounted over the
  general application shell.
- Current tabs expose `tablist`, `tab`, and `aria-selected`, but do not connect tabs to
  `tabpanel` elements or implement the approved manual keyboard-activation model.
- The tested in-app browser did not expose the Fullscreen API. This is a valid
  capability state, not a reason for the page to fail.
- No browser console error was observed in the tested published administrator preview;
  runtime failure paths remain unimplemented rather than disproven.

## Approved Scope and Invariants

- Keep two semantic views: **Falling** and **Full sheet**.
- Do not rewrite, replace, or visually redesign the approved PixiJS Falling renderer,
  piano, note ribbons, note-type behavior, or Full-sheet drawing engine in this page
  brief.
- Improve the focused shell, entry and return, view state, control hierarchy,
  fullscreen, responsive sizing, semantics, and recovery around those renderers.
- Do not add scoring, judgement input, playable-game results, external charts, or
  server-hosted audio.
- Do not add the general NosLog header, More panel, footer, or persistent global
  navigation inside the focused viewer.
- Do not convert Full sheet into a Falling fullscreen variant or merge both renderers
  into one ambiguous mode.

## Entry, Deep Link, and Return Contract

### Entry

- Music detail opens the selected difficulty's viewer only when a valid NosLog
  published chart exists.
- Home and More Chart-viewer entry points open shared discovery in Chart scope; the
  user selects a published difficulty before entering this route.
- A shared or direct viewer URL must resolve locale, Music index, difficulty, and the
  requested view where valid.
- The default view is Falling when its required renderer capability initializes.
  Full sheet is the deterministic fallback, not a separate catalog destination.

### Return

- Provide one explicit Back action in the focused header.
- When entry carries a known Music-detail source, Back restores the exact locale,
  Music, difficulty, content area, valid area state, and practical scroll context.
- Browser Back and the visible Back action must agree rather than creating two
  competing return models.
- A direct or shared viewer entry with no source state returns to the selected
  difficulty's default Chart Info area. It must not infer a previous personal area.
- Leaving the viewer pauses playback. Returning to Music detail never starts audio or
  animation automatically.

## Approved Focused-Shell Hierarchy

Use one semantic `main` and this mobile-first source order:

1. explicit Back action and compact chart identity;
2. Falling and Full sheet view tabs;
3. active-view help or status only when it is useful;
4. hand legend and concise chart summary;
5. the active renderer or its scoped state;
6. renderer-attached core transport for Falling;
7. fast controls and detailed settings entry for Falling; and
8. low-emphasis chart-error-report action.

Wider layouts may align chart identity, tabs, renderer, and controls differently, but
must preserve this semantic order and the same focused task. The shell must not become
a second Music-detail dashboard.

## Focused Header and Chart-Error Reporting

### Public Identity

Show only the information needed to remain oriented:

- Back;
- original Music title;
- artist;
- difficulty and official level;
- note count and chart duration; and
- one low-emphasis chart-error-report action.

Do not expose the public published revision as ordinary visible metadata. Do not add
jacket, category, ranking, personal record, Tier placement, or play-video actions to
the focused header.

### Administrator Preview Identity

- Keep a clearly visible **Administrator draft preview** identity.
- Show the saved revision in preview because it is operationally meaningful there.
- Do not make the administrator preview look like an already published public chart.
- Otherwise preserve the same viewer behavior and responsive contract so preview
  remains representative.

### Chart-Error Report

- Reuse the existing feedback/error-report dialog rather than inventing a second
  reporting system.
- Automatically attach chart identity, difficulty, active view, current playback
  time, snapshot or saved revision, page URL, and a renderer or fullscreen failure
  category when one exists.
- Never attach the local audio file, file bytes, file name, local path, browser media
  metadata, or another private browser-selected value.
- A signed-out user who activates the action receives the approved concise
  login-required flow with an exact safe return to the viewer.
- Keep the action available in both views without competing with playback controls.

## View Switching, URL State, and Restoration

- Implement Falling and Full sheet as an accessible tab set with connected tabs and
  panels.
- Use manual keyboard activation because Falling initialization and view replacement
  can have meaningful latency. Arrow keys move focus; Enter or Space activates.
- Encode a shareable `view=falling|sheet` state. Replace the current history entry for
  ordinary tab changes so repeated comparison does not fill Browser Back with every
  view toggle.
- Invalid or omitted view values resolve to Falling, subject to successful capability
  initialization.
- Switching views pauses playback but preserves current time, selected local audio,
  note speed, metronome state and volume, Strict performance, and other valid
  viewer-session settings.
- Returning from Full sheet to Falling restores the preserved position in a paused
  state. It never resumes automatically.
- Fullscreen entry and exit preserve the same state and do not create route history.
- A reload may restore shareable view selection and persisted user preferences; it
  need not restore a browser-local audio file that the browser no longer grants.

## Falling Viewer Contract

### Renderer

- Keep the approved projected 28-lane piano, judgement line, note ribbons, hand
  colors, note-type paths, and responsive visual-thickness logic.
- Size the renderer from its actual available inline and block space. Do not use one
  width-only breakpoint or stretch the scene indefinitely across a wide desktop.
- Preserve a stable drawing surface while loading, switching fullscreen, or resizing.
- Pause on tab visibility loss, renderer context loss, route exit, and view switch.
  Do not resume without a new user action.

### Always-Visible Core Transport

Keep these controls visibly attached immediately below the renderer:

1. Play/Pause;
2. Restart;
3. seek slider;
4. current and total time;
5. fullscreen entry or exit when supported; and
6. playback-settings entry.

The core transport stays visible in normal and fullscreen modes. It does not auto-hide
like an entertainment-video overlay, and it must not cover the piano, judgement line,
notes, or a keyboard-focused element.

### Fast Controls

Keep these high-frequency controls directly available without opening detailed
settings:

- note speed; and
- metronome on/off.

They may reflow around the core transport at constrained widths, but their meaning and
state must remain immediately discoverable.

### Detailed Settings

Place these in one playback-settings surface:

- browser-local audio selection and replacement;
- metronome volume;
- Strict performance on/off; and
- keyboard-shortcut help.

On compact layouts, use a user-opened constrained settings panel. On wide layouts,
use an anchored popover or small adjacent panel. Closing it returns focus to the
settings trigger and does not reset a value.

### Local Audio

- Playback without audio remains fully supported.
- Selecting audio is an explicit user action and never starts playback by itself.
- The selected file stays in browser memory and is never sent to NosLog.
- Replacement or decoding failure appears inside settings while chart-only playback
  remains available.
- Leaving the route releases object URLs and media resources appropriately.

### Player-Scoped Keyboard Shortcuts

Use this approved set while the focused viewer is active:

| Key          | Action                                       |
| ------------ | -------------------------------------------- |
| `Space`      | Play or pause                                |
| `Home`       | Restart from the beginning                   |
| `ArrowLeft`  | Seek backward `5` seconds                    |
| `ArrowRight` | Seek forward `5` seconds                     |
| `F`          | Enter or exit fullscreen when supported      |
| `Escape`     | Exit fullscreen or close an open sub-surface |
| `?`          | Open keyboard-shortcut help                  |

- Do not intercept these keys while focus is in an input, textarea, Select,
  content-editable element, range slider, or another control that owns the key.
- Do not make shortcuts the only way to perform an action.
- Shortcut help exposes the localized command name and exact key.

## Fullscreen Contract

- Fullscreen applies only to the Falling player unit: renderer plus essential
  controls. It does not fullscreen the entire page shell or Full sheet.
- Preserve current time, local audio, playback state, speed, metronome settings, and
  Strict performance across entry and exit.
- Keep the transport in a dedicated bottom region that does not overlay the judgement
  line or piano.
- Keep essential controls visible; do not auto-hide them after inactivity.
- Provide an explicit exit control and support `Escape` through browser convention.
- Do not request or require landscape orientation. Both portrait and landscape remain
  operable, and the user's operating-system orientation lock is respected.
- If the Fullscreen API is unavailable, omit the control. Do not show a disabled
  button that implies a broken feature.
- If a fullscreen request is rejected, keep the current viewer usable and expose one
  concise status near the initiating control. Do not reset or navigate away.

## Full-Sheet Contract

- Preserve real BPM and time-signature calculation and exactly four actual measures
  per logical column.
- Complete the final visible column according to the current approved timing rule as
  more notes extend the chart.
- Preserve measure numbers, BPM and time-signature changes, concise column range, lane
  grid, note types, hand colors, and the left/right text legend.
- Remove duplicate or decorative timing copy that does not help identify a column or
  timing change.
- Treat the chart as genuinely two-dimensional content. Horizontal scrolling is
  allowed only inside the labelled Full-sheet region, never at the page level.
- On compact widths, keep one column readable and let the user move horizontally to
  later columns. Use optional `proximity` snapping at column starts; do not use
  mandatory snapping or block precise free scrolling.
- On wide layouts, show as many complete readable columns as fit. Do not shrink an
  entire long song until notes, borders, or timing labels become illegible.
- Keep native touch, trackpad, mouse-wheel/shift, and keyboard scrolling operable.
  Do not replace scrolling with tiny previous/next targets as the only navigation.
- Give the scroll region an accessible name. Give each column structured start and end
  information and its four-measure range without requiring canvas pixels to be read.

## Browser Capability and Rendering Fallback

- Attempt Falling on Safari and other supported browsers. Remove the blanket
  Safari user-agent block.
- Decide capability from required feature availability and actual PixiJS/WebGL
  initialization, not browser brand or user-agent string.
- Preserve PixiJS WebGL as the approved production renderer. This brief does not
  require a WebGPU migration or an experimental Canvas fallback.
- Handle asynchronous application initialization, renderer creation failure,
  `webglcontextlost`, restoration where safe, and unrecoverable context loss.
- On initialization or unrecoverable rendering failure:
    1. pause playback;
    2. preserve current time and settings where possible;
    3. activate Full sheet;
    4. show one concise viewer-scoped failure message; and
    5. provide one Retry action.
- Retry only the Falling renderer. It must not reset Music identity, view settings,
  local audio selection, or the Full-sheet scroll context unnecessarily.
- Full sheet remains the functional fallback even when fullscreen is unavailable.
- Do not expose WebGL error codes, stack traces, GPU names, or a generic instruction
  to replace the user's browser in the ordinary interface.

## Loading, Empty, Error, Permission, and Disabled States

- **Renderer checking/loading:** Keep a neutral stable viewer surface and concise
  loading state. Disable renderer-dependent controls until ready without shifting the
  page geometry.
- **No notes:** Keep identity and tabs, then show the concise localized equivalent of
  **No notes to display** in the active content region.
- **Falling initialization failure:** Activate Full sheet, show concise failure and
  Retry, and preserve usable state.
- **Runtime context loss:** Pause, attempt safe recovery, otherwise use the same
  Full-sheet fallback. Never continue time against a frozen renderer.
- **Local audio failure:** Keep chart-only playback available and show the error near
  local-audio settings.
- **Fullscreen unsupported:** Omit fullscreen entry.
- **Fullscreen request failure:** Remain in the current view and show concise status
  near the action.
- **Unpublished, invalid, removed, or stale direct link:** Use a focused localized
  absence state equivalent to **No published chart** with one return to the exact
  Music difficulty. Do not expose the general shell underneath it.
- **Report signed out:** Preserve the public viewer and show only the report action's
  login requirement; do not replace or obscure the chart.
- **Report submission failure:** Preserve entered report text and attachment metadata,
  show scoped retry, and keep playback independently usable.
- **Administrator unsaved change:** Preview continues to identify the saved revision;
  editor-specific unsaved-change handling belongs to the editor contract.

No state should recommend uploading audio, entering a technical diagnostic code, or
switching browsers as its primary recovery.

## Responsive Contract

### Compact Layout

- `390px` is the representative mobile review canvas, not a fixed application width,
  standard, breakpoint, or minimum.
- Verify complete reflow at `320 CSS px` and intermediate compact widths.
- At `390×844` and `320×720`, compact chart identity, view switch, renderer, and core
  transport must be reachable in the initial focused composition without requiring
  the user to scroll past the renderer to find Play.
- Compress or progressively disclose secondary header explanation before making the
  renderer or core transport unusably small.
- Use the remaining visible block space for the renderer while accounting for browser
  chrome and safe-area insets. Do not rely solely on fixed `100vh` assumptions.
- The attached transport occupies layout space rather than covering the judgement
  line or piano.
- Detailed settings may open above the player as a user-controlled surface, but must
  not permanently reduce the renderer or obscure keyboard focus.

### Wide Layout

- Use available width and height together. Choose the largest readable renderer that
  fits chart identity and core transport in the initial viewport at common desktop
  heights.
- Do not stretch the 28-lane scene indefinitely across a wide monitor. Center the
  height- and geometry-constrained player and use remaining space intentionally.
- At `1280×720` and `1440×900`, the renderer and core transport must both be visible
  without initial vertical scrolling.
- Full sheet may show multiple complete columns and retain local horizontal overflow
  for additional columns.
- Exact maximum renderer width, compact control dimensions, and transition thresholds
  are Foundation specimen measurements, not arbitrary values in this brief.

### Orientation and Two-Dimensional Exceptions

- Support portrait and landscape without forcing rotation or showing a rotate-device
  gate.
- Only the Full-sheet chart region receives the legitimate two-dimensional Reflow
  exception. Header, tabs, status, settings, transport, and report action must reflow
  normally.
- Sticky or attached controls must not fully cover a focused item. Use appropriate
  scroll padding and panel sizing where necessary.

## Accessibility Contract

- Render exactly one `main` landmark for the focused viewer.
- Use one correctly labelled tab list, two tabs, and two associated tab panels with
  the approved manual activation model.
- Group the Falling renderer and custom transport semantically as one player.
- Use native buttons and a native range input where possible. Expose slider minimum,
  maximum, current value, and a localized readable time.
- Give every icon-only control an accessible name that changes with state, such as
  Play/Pause and Enter/Exit fullscreen.
- Provide visible focus indicators and at least the approved WCAG target-size and
  target-spacing behavior at every responsive variation.
- Keep the canvas description stable. Do not rewrite an image accessible name every
  animation frame or announce playback time continuously.
- Expose current and total time through visible text and the seek slider. Announce
  only user-requested state changes and concise errors through a suitable polite
  status region.
- Provide a structured text summary of `28` lanes, note count, duration, and the
  meaning of left- and right-hand guidance.
- Do not attempt to narrate every falling note in real time. The Full-sheet structured
  column descriptions and chart summary provide the non-visual overview.
- Distinguish hands using text plus color. Do not rely only on cyan/red color.
- Ensure Full sheet has a keyboard-focusable labelled scroll region and meaningful
  per-column accessible text.
- Do not autoplay audio or animation on route entry, view return, fullscreen exit, or
  renderer recovery.
- `prefers-reduced-motion` does not force Full sheet or remove the core chart
  visualization. It should reduce nonessential shell motion and transitions without
  changing chart timing semantics.
- Settings panels, shortcut help, error report, and failure messages manage initial
  focus, containment where modal, `Escape`, closing, and trigger-focus restoration.
- Browser zoom to `200%` and Reflow at `320 CSS px` must preserve labels, controls,
  and operation.

## Localization and Content

- Support Korean, Japanese, and English without fixed-width assumptions for labels,
  error messages, settings, or title metadata.
- Preserve the original Music title as the only visible Music title in the focused
  viewer. Translation/read-title disclosure belongs to Music Detail.
- Long titles may wrap within the focused header. Do not truncate the only visible
  title or let it displace Back and core playback controls.
- Preserve domain terms such as `Basic`, `Recital`, difficulty names, `Lv`, `BPM`,
  `Full Combo`, `Pianist`, and `NosLog` where translation would weaken game or data
  mapping.
- Format time, note count, and numeric settings with locale-appropriate visible text
  while preserving machine values.
- Keep state copy concise. The approved meanings are:

| Meaning                         | Required concise content                                       |
| ------------------------------- | -------------------------------------------------------------- |
| Empty chart                     | No notes to display                                            |
| Missing or unpublished snapshot | No published chart                                             |
| Falling failure                 | Falling view could not be displayed; Full sheet remains usable |
| Fullscreen failure              | Fullscreen could not be opened; current viewer remains usable  |
| Local audio failure             | Local audio could not be used; chart-only playback continues   |

Final Korean, Japanese, and English microcopy must be reviewed together in the shared
content and localization phase. It may shorten these phrases but must not merge their
distinct meanings or add technical prose.

## Runtime State Contract

Treat the following as distinct state domains:

| State                            | URL | Viewer session | Persistent browser preference | Server |
| -------------------------------- | --- | -------------- | ----------------------------- | ------ |
| Music, difficulty, locale        | Yes | Yes            | No                            | Source |
| Falling or Full sheet            | Yes | Yes            | No                            | No     |
| current playback time            | No  | Yes            | No                            | No     |
| playing/paused                   | No  | Yes            | No                            | No     |
| local audio object               | No  | Yes            | No                            | Never  |
| note speed                       | No  | Yes            | No                            | No     |
| metronome enabled                | No  | Yes            | No                            | No     |
| metronome volume                 | No  | Yes            | Yes                           | No     |
| Strict performance               | No  | Yes            | Yes                           | No     |
| fullscreen                       | No  | Yes            | No                            | No     |
| Full-sheet local scroll position | No  | Yes            | No                            | No     |
| renderer capability/error        | No  | Yes            | No                            | No     |

- Do not put transient playback, fullscreen, local-file, or error state into the
  shareable URL.
- Do not persist or transmit local-file identity.
- View changes use history replacement; entry and return remain real history events.
- Preserve session state across renderer resize, view switch, fullscreen, and safe
  Retry according to the contracts above.

## Implementation Mapping

This mapping guides the future implementation session; it does not authorize code
changes in the current design-guide session.

- Preserve the current public route and published-snapshot schema validation.
- Replace the fixed overlay relationship with a true focused route shell so only one
  `main` landmark exists and the general header/footer are absent.
- Extend `ChartSheetViewer` with validated `view` query state, connected manual tabs,
  session-level viewer state, and source-aware return restoration.
- Keep `FallingChartViewer`'s renderer and playback math, but lift state that must
  survive unmount, fullscreen, and fallback to the viewer-session owner.
- Add a renderer lifecycle boundary covering asynchronous PixiJS initialization,
  WebGL feature failure, context loss, Retry, and Full-sheet fallback.
- Replace Safari user-agent gating in `lib/browserSupport.ts` with feature and actual
  initialization checks.
- Add Fullscreen API capability detection around the Falling player unit only.
- Refactor controls into core transport, fast controls, and detailed settings without
  changing approved playback behavior.
- Keep local audio in browser memory and exclude it from feedback payloads, logging,
  analytics, and persistence.
- Stabilize canvas accessible description and expose chart summary, current time, and
  Full-sheet columns through DOM text.
- Keep `getMeasurePanels(..., 4, { completeLastPanel: true })` behavior and the
  approved BPM/time-signature markers.
- Add route-level focused absence handling for stale or unpublished direct links
  rather than revealing the normal application shell.
- Extend tests for public/admin identity, view URL state, restoration, fullscreen,
  feature failure, context loss, local audio, responsive geometry, accessibility,
  and report privacy.

## Representative Fixtures

Validation must include:

- a typical published chart, a dense chart, a sparse chart, and a zero-note chart;
- Normal, Hard, Expert, and Real, including long and short durations;
- normal, tenuto, glissando, and trill notes, with odd and even widths and both hands;
- a chart with multiple BPM and time-signature changes and a partial final group that
  becomes one complete four-measure column;
- Falling loading, success, initialization failure, context loss, successful Retry,
  and repeated failure;
- fullscreen supported, unsupported, rejected, entered, exited, and resized;
- no audio, valid local audio, decode failure, replacement, and route exit;
- metronome off/on, volume extremes, note-speed extremes, and Strict performance
  off/on;
- Falling-to-sheet and sheet-to-Falling switching at non-zero time;
- public viewer, administrator draft preview, signed-out report entry, successful
  report, and failed report;
- direct shared URL, Music-detail entry, browser Back, explicit Back, and return to a
  non-default Music-detail content area;
- long original Japanese title, missing artist, and entry from a translated/read-title
  search followed through Music Detail to the viewer;
- `320×720`, `360px`, `390×844`, compact landscape, tablet portrait/landscape,
  `1280×720`, `1440×900`, and a wider desktop viewport;
- keyboard-only, `200%` zoom, reduced motion, screen-reader smoke, touch, and pointer.

## Browser Acceptance Contract

- The focused route renders one `main` and no general NosLog header, footer, or
  document-level horizontal overflow.
- At `320×720` and `390×844`, identity, view selection, renderer, and core transport
  remain operable without requiring a search for Play below the renderer.
- At `1280×720` and `1440×900`, renderer and core transport fit the initial viewport
  and the scene does not stretch merely to fill all width.
- Full sheet is the only local two-dimensional scrolling exception. One column stays
  readable on compact layouts and multiple complete columns can appear when wide.
- Tab arrow navigation, manual activation, focus relationship, URL replacement, and
  panel semantics work in all three languages.
- View switching, fullscreen entry/exit, renderer resize, fallback, and Retry preserve
  the approved session state and never autoplay on return.
- Core transport, fast controls, detailed settings, and shortcuts remain operable by
  touch, pointer, and keyboard. Player shortcuts do not steal keys from controls.
- Safari receives a real Falling initialization attempt. Browser brand alone never
  forces Full sheet.
- Fullscreen unsupported and request rejection are progressive-enhancement states,
  not route failures.
- Renderer initialization failure and unrecoverable context loss pause playback,
  activate Full sheet, expose concise status, and offer exact Retry.
- Local audio never appears in network requests, report payloads, persistent server
  state, logs, or visible error diagnostics.
- Public and administrator preview identity remain distinct; public revision is not
  ordinary visible metadata.
- Long Korean, Japanese, and English content wraps without clipping controls or
  reducing the renderer below its approved usable geometry.
- Browser zoom, keyboard focus, range-slider values, focus restoration, target size,
  color-independent hand meaning, and non-live canvas description satisfy the
  approved accessibility contract.
- Verify desktop Chrome, Safari, Firefox, and Edge; mobile Safari and Chrome; and at
  least one real touch-device smoke test in each major mobile engine where available.

## Reference Matrix

The decision set uses a broad comparison instead of treating one player, rhythm game,
browser, or framework as a template.

| Source                                                                                                                         | Transferable finding                                                                                                   | NosLog application                                                                | Limitation                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [Current public route](<../../app/(nevigation)/music/[index]/[difficulty]/pattern/page.tsx>)                                   | One selected published chart is schema-validated before rendering.                                                     | Preserve exact chart identity and published-snapshot boundary.                    | Current Not Found and visible revision presentation are not the complete 2.0 state contract. |
| [Current viewer shell](../../components/chart-pattern/chartSheetViewer.tsx)                                                    | Falling, Full sheet, four-measure panels, legend, and horizontal sheet scrolling already exist.                        | Preserve verified functions while replacing shell, state, and semantics.          | Current fixed geometry and UA fallback are migration evidence only.                          |
| [Current Falling viewer](../../components/chart-pattern/fallingChartViewer.tsx)                                                | Playback, local audio, speed, metronome, Strict performance, piano, and PixiJS drawing are implemented.                | Keeps the renderer rewrite explicitly out of scope.                               | Local component ownership currently loses state on unmount.                                  |
| [Current browser support](../../lib/browserSupport.ts)                                                                         | Safari is identified through a UA regular expression and forced to Full sheet.                                         | Identifies the exact implementation to replace with capability detection.         | It does not prove Safari cannot initialize WebGL.                                            |
| [Approved IA](./02-information-architecture.md)                                                                                | Chart viewer is a focused child destination with Falling, Full sheet, fullscreen, and reliable return.                 | Establishes page role and removes global navigation.                              | It does not define control hierarchy or failure recovery.                                    |
| [Approved Music-detail brief](./05-music-detail-page-brief.md)                                                                 | View chart opens the exact selected difficulty and return restores known detail context.                               | Establishes entry, disabled availability, and return semantics.                   | Detail layout does not govern the focused player.                                            |
| [W3C APG: Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)                                                                | Tabs require connected roles, state, keyboard navigation, and predictable activation.                                  | Supports manual Falling/Full-sheet tabs.                                          | APG does not decide the renderer fallback.                                                   |
| [W3C APG: Slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)                                                            | A slider needs keyboard behavior and understandable value semantics.                                                   | Governs seek and volume controls.                                                 | Touch assistive-technology testing remains necessary.                                        |
| [W3C APG: Keyboard interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)                                   | Focus must remain visible and move predictably within composite controls.                                              | Informs tabs, settings, dialogs, and restoration.                                 | Exact shortcut choices remain product decisions.                                             |
| [W3C WCAG: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                    | Content must work at 320 CSS px; genuine diagrams and games may use a local two-dimensional exception.                 | Limits horizontal scrolling to Full sheet.                                        | It does not prescribe chart column width.                                                    |
| [W3C WCAG: Orientation](https://www.w3.org/WAI/WCAG21/Understanding/orientation)                                               | Content should not require one device orientation unless essential.                                                    | Rejects forced landscape and rotate gates.                                        | Piano is cited as a possible exception, but NosLog can support both orientations.            |
| [W3C WCAG: Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)                         | Author-positioned sticky content must not fully hide the focused control.                                              | Constrains attached transport and settings panels.                                | Exact scroll padding requires implementation testing.                                        |
| [W3C WCAG: Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)                                       | Compact controls still need sufficient target size or spacing.                                                         | Constrains dense transport and mobile settings.                                   | Foundation decides the stronger NosLog target token.                                         |
| [W3C WCAG: Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content)                                     | Visual non-text information needs an equivalent purpose or description.                                                | Requires stable canvas summary and structured Full-sheet text.                    | It does not require real-time narration of every animation frame.                            |
| [W3C WCAG: Status Messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)                                  | Important status can be announced without moving focus.                                                                | Supports concise renderer, fullscreen, and report status.                         | Over-announcement must still be avoided.                                                     |
| [MDN: Fullscreen API guide](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide)                             | Fullscreen is user-initiated, capability-dependent, asynchronous, and can reject.                                      | Makes fullscreen progressive enhancement around the Falling unit.                 | Browser and embedding policies vary.                                                         |
| [MDN: Screen Orientation lock](https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock)                        | Orientation lock has capability and fullscreen restrictions.                                                           | Supports not forcing rotation.                                                    | It documents an API NosLog does not need to call.                                            |
| [MDN: UA sniffing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent)                   | Feature detection is more reliable than browser-name assumptions.                                                      | Replaces the Safari blanket block.                                                | Actual Pixi initialization must still be tested.                                             |
| [MDN: WebGL context lost](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event)           | A WebGL context can be lost and requires deliberate recovery behavior.                                                 | Establishes pause, fallback, and Retry.                                           | Successful restoration is renderer- and device-dependent.                                    |
| [MDN: CSS scroll snap](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap/Basic_concepts)                     | `proximity` may assist alignment while mandatory snapping can make oversized content unreachable.                      | Supports optional column-start assistance without trapping Full-sheet navigation. | Real touch and trackpad behavior needs testing.                                              |
| [MDN: Viewport lengths](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length)                              | Dynamic viewport units reflect browser UI but can resize during scroll and affect performance.                         | Requires visible-area and safe-inset testing instead of one fixed `100vh`.        | It does not prescribe the final sizing algorithm.                                            |
| [PixiJS: Renderers](https://pixijs.com/8.x/guides/components/renderers)                                                        | PixiJS 8 recommends WebGL while WebGPU remains maturing.                                                               | Preserves the current WebGL renderer for 2.0.                                     | Renderer documentation does not define product fallback copy.                                |
| [PixiJS: Application](https://pixijs.com/8.x/guides/components/application)                                                    | Application initialization is asynchronous and configurable.                                                           | Requires a real initialization boundary before enabling controls.                 | NosLog still owns teardown and recovery.                                                     |
| [WebKit: Safari 15 features](https://webkit.org/blog/11989/new-webkit-features-in-safari-15/)                                  | Safari supports WebGL2 features rather than categorically lacking WebGL.                                               | Refutes browser-brand-only exclusion.                                             | Device/GPU failures can still occur.                                                         |
| [web.dev: Progressively enhance your PWA](https://web.dev/articles/progressively-enhance-your-pwa)                             | Core capability should remain usable when an enhancement is unavailable.                                               | Full sheet remains usable without Falling or fullscreen.                          | PWA installation guidance is not adopted.                                                    |
| [Soundslice player overview](https://www.soundslice.com/help/en/player/basic/99/overview/)                                     | A browser music-practice player combines notation, playback, tempo, audio, and visual instruments across devices.      | Confirms integrated chart inspection and practice controls.                       | Conventional notation is not NOSTALGIA's 28-lane chart.                                      |
| [Soundslice features](https://www.soundslice.com/features/)                                                                    | Fullscreen, shortcuts, metronome, visual keyboard, configurable layout, and multi-device use support focused practice. | Supports fullscreen plus visible practice controls and settings.                  | Its feature breadth does not authorize new NosLog features.                                  |
| [Soundslice: Resizing notation](https://www.soundslice.com/help/en/player/basic/101/resizing-notation/)                        | Fit and zoom respond to available screen rather than assuming one fixed canvas.                                        | Supports area-based renderer and readable sheet sizing.                           | NosLog does not re-engrave conventional notation.                                            |
| [Flat: Playback](https://help.flat.io/en/music-notation-software/playback/)                                                    | Playback controls remain tied to the score-reading task.                                                               | Supports attaching transport to the renderer rather than the page footer.         | Flat's notation and editor workflows differ.                                                 |
| [BBC GEL: Video controls](https://bbc.github.io/gel/components/video-controls/)                                                | Custom players need obvious Play/Pause, robust range inputs, responsive control layout, and accessible names.          | Grounds the core transport and responsive flex behavior.                          | NosLog is not a video player and keeps practice controls visible.                            |
| [YouTube: Screen-reader support](https://support.google.com/youtube/answer/189278?hl=en)                                       | Player controls and shortcuts require names, focus, and predictable keyboard operation.                                | Supports discoverable, player-scoped commands.                                    | Entertainment-video auto-hide behavior is not adopted.                                       |
| [Vimeo: Player keyboard shortcuts](https://help.vimeo.com/hc/en-us/articles/12425998125073-What-are-player-keyboard-shortcuts) | A documented shortcut set improves expert playback control.                                                            | Supports shortcut help and visible equivalents.                                   | Vimeo's commands do not dictate NosLog keys.                                                 |
| [osu! keyboard shortcuts](https://osu.ppy.sh/wiki/en/Client/Keyboard_shortcuts)                                                | Rhythm-game users benefit from explicit, documented, context-aware shortcuts.                                          | Supports a concise player-scoped set.                                             | osu! gameplay and editor commands are out of scope.                                          |

### Evidence Convergence

- Accessibility and responsive sources converge on one semantic task hierarchy,
  visible and predictable controls, 320 CSS px Reflow, and local—not page-wide—scroll
  exceptions for genuinely two-dimensional content.
- Music-player and score-viewer references converge on keeping notation, playback,
  tempo, visual instrument, settings, and fullscreen within one focused practice
  context. They do not support hiding the primary transport below the renderer.
- Browser and renderer documentation converges on asynchronous capability checks,
  progressive enhancement, and explicit context-loss recovery rather than a browser
  brand block.
- Scroll guidance supports optional proximity alignment but warns against mandatory
  snapping when a content item can exceed the scrollport.
- No external source defines NOSTALGIA's 28 lanes, hand semantics, four-measure Full
  sheet, Strict performance, note-width interpretation, or trill behavior. Those come
  from verified NosLog chart logic and explicit user decisions.

## Rejected and Superseded Alternatives

- **Rewrite the PixiJS/WebGL renderer during page redesign — Rejected:** the current
  renderer and chart mathematics remain the functional baseline.
- **Keep the general NosLog header and footer — Rejected:** the viewer uses a focused
  shell with one explicit return.
- **Treat the viewer as another Music-detail panel — Rejected:** it is a focused child
  destination and may be shared directly.
- **Add an independent chart catalog — Rejected:** shared discovery in Chart scope
  resolves exact published difficulties.
- **Force Safari to Full sheet by UA string — Superseded:** attempt Falling and fall
  back only after capability or initialization failure.
- **Migrate to WebGPU or experimental Canvas fallback now — Rejected:** WebGL plus
  Full sheet is the approved production strategy.
- **Fullscreen the whole page or Full sheet — Rejected:** fullscreen applies only to
  the Falling player unit.
- **Force landscape in fullscreen — Rejected:** both orientations remain operable.
- **Auto-hide essential fullscreen controls — Rejected:** practice playback requires
  persistent quick access and predictable focus.
- **Put every control in one permanent row — Rejected:** core transport, fast
  controls, and detailed settings have distinct frequency and hierarchy.
- **Move note speed or metronome behind settings — Rejected:** both remain fast
  controls.
- **Persist local audio or attach it to reports — Rejected:** it remains private
  browser state.
- **Autoplay when entering, returning, recovering, or exiting fullscreen — Rejected:**
  playback resumes only after explicit user action.
- **Use mandatory Full-sheet snap — Rejected:** proximity assistance preserves free
  inspection.
- **Scale an entire long Full sheet to one viewport — Rejected:** readable columns and
  local scrolling take priority.
- **Continuously announce canvas time or every note — Rejected:** stable summary and
  user-requested status avoid assistive-technology noise.
- **Expose public revision metadata — Superseded:** revision remains visible only in
  administrator preview and attached diagnostic context.
- **Show technical errors or tell users to replace browsers — Rejected:** concise
  scoped recovery and Full sheet remain available.

## Decision Log

| ID      | Decision                                                                                                  | Status     |
| ------- | --------------------------------------------------------------------------------------------------------- | ---------- |
| VIEW-01 | Chart viewer remains a focused child destination of exact Music difficulty                                | `Approved` |
| VIEW-02 | Shared discovery may enter through Chart scope without creating a second catalog                          | `Approved` |
| VIEW-03 | Use one focused `main` without general header, footer, or global navigation                               | `Approved` |
| VIEW-04 | Preserve Falling and Full sheet as separate accessible tabs                                               | `Approved` |
| VIEW-05 | Encode shareable view state and replace history on ordinary tab changes                                   | `Approved` |
| VIEW-06 | Switching views pauses but preserves time, local audio, and viewer settings                               | `Approved` |
| VIEW-07 | Keep the existing renderers and chart mathematics out of redesign scope                                   | `Approved` |
| VIEW-08 | Core transport is always visible and attached below the Falling renderer                                  | `Approved` |
| VIEW-09 | Note speed and metronome remain fast controls                                                             | `Approved` |
| VIEW-10 | Local audio, metronome volume, Strict performance, and shortcuts use detailed settings                    | `Approved` |
| VIEW-11 | Use the approved player-scoped Space, Home, arrows, F, Escape, and ? shortcuts                            | `Approved` |
| VIEW-12 | Fullscreen applies only to Falling renderer plus essential controls                                       | `Approved` |
| VIEW-13 | Do not force device orientation or auto-hide essential fullscreen controls                                | `Approved` |
| VIEW-14 | Omit fullscreen entry when unsupported and contain request failure locally                                | `Approved` |
| VIEW-15 | Attempt Falling on Safari and use feature/initialization evidence, not UA exclusion                       | `Approved` |
| VIEW-16 | Falling failure pauses and falls back to Full sheet with concise status and Retry                         | `Approved` |
| VIEW-17 | Preserve four actual measures per Full-sheet column and timing-change context                             | `Approved` |
| VIEW-18 | Confine Full-sheet horizontal scrolling to its labelled region                                            | `Approved` |
| VIEW-19 | Use optional proximity column snapping and reject mandatory snapping                                      | `Approved` |
| VIEW-20 | Public header omits visible revision; administrator preview keeps identity and saved revision             | `Approved` |
| VIEW-21 | Reuse chart-error reporting with automatic non-audio diagnostic context                                   | `Approved` |
| VIEW-22 | Signed-out reporting requires Login without replacing the public viewer                                   | `Approved` |
| VIEW-23 | Use concise, distinct loading, empty, rendering, fullscreen, audio, and stale-link states                 | `Approved` |
| VIEW-24 | Use a stable canvas description and structured Full-sheet text without live frame narration               | `Approved` |
| VIEW-25 | Distinguish hand guidance with text plus color                                                            | `Approved` |
| VIEW-26 | `390px` is representative; require 320 CSS px Reflow and intermediate validation                          | `Approved` |
| VIEW-27 | Keep renderer and core transport in the initial focused composition at compact and common desktop heights | `Approved` |
| VIEW-28 | Size Falling from available width and height; do not stretch it indefinitely on desktop                   | `Approved` |
| VIEW-29 | Preserve exact source-aware Music-detail return; direct entry returns to Chart Info                       | `Approved` |
| VIEW-30 | Local audio remains browser-only and is excluded from persistence, logs, reports, and server transfer     | `Approved` |
| VIEW-31 | The 2.0 viewer remains Basic-only; Recital strong/soft dynamics stay in the linked Future Work contract   | `Approved` |

## Handoff Boundary

Claude Design may decide final typography, color, spacing, surface hierarchy,
iconography, control shape, settings-panel treatment, exact renderer maximum width,
and content-driven transition points after Foundation approval. It must preserve every
decision and acceptance requirement above and must not redraw the chart renderers as
new visual systems without a separately approved guide revision.

A later Codex implementation session must compare the Claude output with this brief
and request a guide or design revision if the output introduces global navigation,
hides primary controls, forces orientation, loses state, uploads audio, blocks Safari
by name, removes Full-sheet fallback, weakens the exact return path, or conflicts with
the approved accessibility and responsive behavior.
