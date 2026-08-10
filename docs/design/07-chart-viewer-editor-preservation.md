# NosLog 2.0 Chart Viewer and Editor Preservation Contract

## Document control

- Status: `Approved — absolute preservation boundary`
- Language: English
- Last updated: 2026-08-10
- Scope: the existing public chart viewer and administrator chart editor in their
  entirety
- Authority: the user's explicit correction, root `AGENTS.md`, and the remaining-work
  audit in document `57`

## Purpose

This is a preservation contract, not a redesign Page Brief. It replaces every former
viewer/editor redesign, Foundation migration, responsive adaptation, accessibility
reinterpretation, specimen, `S4`, `S6`, and user-contribution proposal.

The viewer and editor remain important NosLog product functions. Their current
reachability and behavior may be recorded as product inventory, but their presentation
and implementation are not inputs to the NosLog 2.0 ordinary-UI design system.

## Locked experiences

The preservation boundary includes the complete current:

- public chart-viewer page and administrator chart-editor page;
- page and DOM shell, landmarks, labels, controls, control order, focus behavior,
  keyboard behavior, announcements, and recovery behavior;
- responsive composition, containment, panel sizing, scrolling, and fullscreen
  behavior;
- PixiJS/WebGL Falling renderer and Canvas Full-sheet renderer;
- note types, paths, left/right-hand palettes and legends, timing marks, geometry,
  chart mathematics, animation, audio synchronization, and rendering model;
- editor tools, property panels, histories, import/export, snapshots, and editor
  rendering model.

Preserve all of those elements exactly as implemented when NosLog 2.0 is designed and
implemented. Do not redesign, recolor, restyle, restructure, rename, replace, migrate,
or create a parallel 2.0 variant.

## Foundation exclusion

The ordinary-UI contracts in document `24` do not apply inside either locked
experience. In particular, do not apply or retrofit:

- Spectrum neutral surfaces, foregrounds, boundaries, focus, radius, elevation, or
  primary-action aliases;
- signature, feedback, difficulty, local-data, judgement, or visualization colors;
- Lucide iconography or Atlassian motion;
- ordinary page grids, containers, reusable components, patterns, or templates;
- a new accessibility model justified only by the 2.0 guide.

This exclusion does not claim that the current experiences are universally ideal. It
records the user's deliberate product boundary that NosLog 2.0 must not change them.

## Allowed surrounding work

Ordinary pages may continue to:

- expose the existing viewer destination and published-chart availability;
- link to the current viewer route for the exact Music and difficulty;
- preserve the current return destination and unavailable/not-found messaging; and
- document that local audio remains in the browser.

Those surrounding links must not require a change inside the target viewer or editor.
If a proposed shell, navigation, route, or component change would alter either locked
page, stop and ask the user to reopen that exact sub-scope.

## Downstream handoff

- Claude Design must not redesign, recreate, annotate as a new visual target, or use
  either locked experience as an ordinary-UI Foundation specimen.
- The future implementation session must leave the relevant viewer/editor files and
  runtime behavior unchanged except for an independently authorized maintenance fix.
- Regression and milestone examples must omit the viewer/editor rather than embedding
  a historical `S4` or inventing an `S6`.
- A precisely named maintenance defect may be diagnosed without reopening the design
  boundary. Implementing a change still requires the user's explicit authorization
  for that defect.

## Decision log

| ID        | Decision                                                                                              | Status                  |
| --------- | ----------------------------------------------------------------------------------------------------- | ----------------------- |
| `PRES-01` | Preserve the entire existing viewer and editor, not only their renderers.                             | `Approved — 2026-08-10` |
| `PRES-02` | Cancel active `S4`, `S6`, viewer/editor redesign, Foundation migration, and contribution/editor work. | `Approved — 2026-08-10` |
| `PRES-03` | Permit ordinary pages to retain current reachability without changing the target experience.          | `Approved boundary`     |
| `PRES-04` | Require a new explicit user decision before changing the whole exception or an exact sub-scope.       | `Approved boundary`     |
