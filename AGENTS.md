# AGENTS.md

## Product and current stage

NosLog is an unofficial NOSTALGIA records, ranking and archive application.
The user has authorized production implementation and verification of NosLog 2.0.
The previous design-guide stage is complete; do not restore its research gates,
PDF milestones, old checklists or design-only implementation prohibition.

## Authority

1. The user's latest explicit decision.
2. This file for process, scope and preservation boundaries.
3. `docs/design/README.md` for the common layout, responsive modes, visual-source
   precedence, fonts, shared implementation and verification contract.
4. Current Figma `NosLog v2.0.0` (`cVbWCxhkfxFfHmAKLCyKrD`), pages P1–P16 and
   components C1–C8, for visuals within that common-layout contract.
5. `docs/design/product-rules.md` for the retained behavioral/data baseline.
6. `README.md` for setup, product, deployment and privacy; `docs/code-style.md`
   for the existing Jeongbiseo/Fit-again-based code conventions.

Z1 is decision history, not a page to implement. Old numbered briefs, handoffs,
Foundation/provenance records, audits, specimens and PDF are retired. Their old
Approved labels, frame widths and pending items cannot override current rules.
Do not recover pending work or visual authority from Git history/deleted documents
unless the user explicitly asks for historical evidence. Legacy NOSTORY is not
current authority. Keep the two current design documents in English; KO/JA/EN
remain required product locales.

## Preservation boundaries

The existing chart viewer and chart editor in their entirety are locked exceptions:

- pages, DOM shells, controls, labels, accessibility, responsive containment;
- PixiJS/WebGL Falling renderer and Canvas Full-sheet renderer;
- notes, left/right-hand palettes, geometry, animation, audio synchronization;
- chart mathematics, editor rendering model, histories, import/export and snapshots.

Do not redesign, recolor, restyle, reorganize, replace, migrate or create a 2.0
variant of any part of these experiences. Ordinary Foundation, layout, icon,
motion and accessibility redesign rules do not apply inside them. Only an explicit
user decision reopening the whole exception or a precisely named sub-scope permits
changes. Preserve `/admin/*` as well. Ordinary music/chart discovery and Music
Detail remain in scope; their presence does not reopen the actual viewer/editor.

Keep MP3/audio files local to the user's browser, never uploaded to NosLog storage
or database. Preserve existing records, rankings, archive and authoring functions.

## Working process

- Before responding to a project task, reopen this root AGENTS.md completely.
- Before planning/editing, read root README.md. Before UI work, read the current
  implementation contract. Inspect repository status and existing changes before
  editing; preserve user work and unrelated files.
- Use the existing stack, routes, global styles and shared components. Establish
  common behavior at its shared source before page-specific composition. Do not
  create another competing layout system or copy raw per-page Figma export CSS.
- Follow the latest dark-only and unsplit Pretendard JP decisions in the contract.
  Do not infer light-theme work from old documentation.
- Inspect current code, tests, Figma and the actual browser before deciding a
  missing requirement. Do not ask the user for facts the repository can answer.
  Existing authorization persists; routine repairs do not require repeated approval.
- The user decides material product/design changes. Do not invent behavior or
  silently resolve an unresolved material conflict. Complete the concrete reviewable
  proposal before asking. Research/observations are not approval to change behavior.
- Update the one current contract in place when an approved common rule changes,
  then align code and regression expectations. Never append conflicting normative
  rules to another document.
- Prefer the already running localhost:3000 server. Ask the user to sign in when
  needed; do not bypass authentication. Keep test data confined to the local test DB.
- Implement small reviewable units and verify each meaningful UI unit in the browser.
  Check 320 CSS px reflow, representative mobile/intermediate/desktop, affected
  boundaries, resizing and KO/JA/EN. Use actual viewport/DOM measurements; do not
  infer CSS pixels from Retina screenshots. Follow the full validation contract.
- Run relevant lint, typecheck, tests and build. Static checks do not substitute for
  browser interaction or visual comparison. Investigate failures, distinguish
  pre-existing failures from regressions, and own debugging through verification.
- Report actual scope, evidence and caveats. Do not call a page suite complete from
  isolated checks or claim a percentage without an approved denominator. Historical
  verification logs are dated evidence, not current work or layout authority.

## Git ownership

The user owns commits, pushes, branch creation/switching and pull requests. Do not
perform them without explicit authorization for that exact operation. Inspect branch
and upstream state read-only when needed; do not pull, merge, rebase or reset history.

After the relevant checks pass, report scope, verification, caveats and a Conventional
Commit title with an English type and Korean description, e.g.
`fix: 악곡 상세 반응형 전환 기준 통일`. Do not imply unrelated unverified changes are
ready to commit. Preserve current uncommitted work during documentation cleanup.
