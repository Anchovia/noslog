# AGENTS.md

## Product

NosLog is a NOSTALGIA records, ranking, and archive application. `NosLog` is
the service and project name, `NOSTORY` is a legacy design reference, and
`NOSTALGIA` is the game covered by the service.

## Current authority

Use this order when project sources disagree:

1. the user's latest explicit decision;
2. this file for process, scope, and preservation boundaries;
3. `README.md` for the current product, setup, validation, deployment, privacy,
   versioning, and six-block progress baseline;
4. `docs/design/57-design-guide-remaining-work-audit.md` for the completed six-block
   scope and disposition of obsolete work;
5. `docs/design/64-downstream-design-implementation-handoff.md` for downstream
   reading order, screen coverage, mapping, QA, and milestone packaging;
6. `docs/design/24-foundation-v0.1.md` for approved normative Foundation rules;
7. `docs/design/25-foundation-v0.1-provenance.md` for research provenance,
   approvals, rejections, and supersessions;
8. the remaining current English design documents for product evidence, IA,
   flows, page briefs, and cross-cutting requirements.

A later explicit `Approved`, `Rejected`, or `Superseded` decision overrides an
older proposal, status sentence, checklist, specimen, or file number. File count,
document number, commit count, and workflow phase are never progress authority.
Do not recover pending work from Git history or deleted documents unless the user
explicitly asks for historical evidence.

## English-only design documentation

- Keep `docs/design/` documentation in English only.
- Do not create `.ko.md` companions or require bilingual document parity.
- Do not duplicate normative token ledgers or decision tables in `README.md` or
  this file. Link to the current authority instead.
- Korean, Japanese, and English remain required product locales and validation
  inputs. The English-only rule applies to design-guide source documents, not the
  user interface or localization requirements.
- The v0.1 milestone is one English PDF using the approved `ED-03 · GitHub Primer`
  editorial system. Primer accent in that PDF is artifact-only notation, not a
  product primitive, semantic role, component alias, or signature-color decision.

## Legacy design source

Legacy NOSTORY reference:
https://www.figma.com/design/MigCZljcnwEdJF2JhnjKcj/Nostory?node-id=3-3

Frame `3:3`, `NOSTORY 와이어프레임 정리`, records an early wireframe covering
Home, Music list, Music detail, Rankings, Data sync guide, Tiers, Bingo,
Profile, Login, Exams, and a style guide. It predates substantial product work
and the approved NosLog 2.0 decisions.

- Do not treat the legacy file as current layout, hierarchy, content, behavior,
  component, or visual authority.
- Do not use it to resolve an open 2.0 decision or override current code, browser
  evidence, the approved guide, or the decision log.
- Consult it only when historical intent or provenance is materially useful and
  label findings as legacy evidence.
- Before accessing or modifying any Figma file, tell the user which file or
  artifact will be used, exactly what will be inspected or changed, and why.
  Obtain approval when access is not already explicit in the request.

## Absolute chart viewer and editor preservation boundary

The existing chart viewer and chart editor in their entirety are locked
preservation exceptions for NosLog 2.0. Preserve their current:

- pages, DOM shell, controls, labels, accessibility behavior, responsive
  composition, and containment;
- PixiJS/WebGL Falling renderer and Canvas Full-sheet renderer;
- note and left/right-hand palettes, geometry, animation, chart mathematics, and
  editor rendering model.

Do not redesign, recolor, restyle, reorganize, replace, reinterpret, or create a
iconography, data-visualization, component, template, responsive, and
accessibility decisions do not apply to them. Former viewer/editor page briefs,
`S4`, `S6`, and contribution/editor proposals are superseded historical evidence,
not future work. Only a new, explicit user decision reopening the whole exception
or a precisely named sub-scope can authorize a change.

## Implementation rules

- For maintenance outside NosLog 2.0, do not redesign UI unless explicitly asked.
- NosLog 2.0 is an authorized production-level redesign. Treat current UI as a
  functional inventory and usability baseline, not a visual constraint.
- Preserve the approved dark NosLog direction without copying legacy NOSTORY
  surface styling.
- Use the existing stack, components, routing, and styling conventions. Reuse
  existing components before creating new ones.
- Implement mobile-first. Use `390px` as a representative review canvas, not a
  fixed application width or universal breakpoint. Verify accessible reflow down
  to `320 CSS px` and choose transitions from content constraints.
- Keep changes scoped and verifiable. Run the provided lint, typecheck, tests, and
  build in proportion to the change.

## Foundation provenance guardrails

- Tailwind CSS is an implementation and responsive-layout tool only. Its palette,
  starter theme, sample gradients, radii, shadows, and component appearance are
  not NosLog design authority.
- Before recommending a material visual-foundation decision, compare at least
  twelve independent, relevant, authoritative or production references; prefer
  fifteen or more when credible sources are available. Compare equivalent roles
  and actual Light/Dark values.
- Prefer the published values and semantic mapping of one approved maintained
  system intact. Do not create an unsourced hybrid, interpolate steps, shift hues,
  or silently repair a failed upstream mapping.
- Primitive approval, semantic-role mapping, component-alias mapping, and
  production implementation are separate gates.
- Adobe Spectrum S2 is the exclusive approved Dark/Light neutral primitive source.
  Preserve its published grayscale values exactly.
- The exact approved color, material, iconography, motion, and data-visualization
  contracts are centralized in document `24`; their sources and rejected options
  are centralized in document `25`.
- The over-accented `FCM-11` and `SIG-07` examples are `Rejected` and must not be
  reused as evidence or implementation targets.

## Requirement clarity and approval gates

The user is the final decision-maker for NosLog 2.0 product and design direction.

- Do not make ambiguous product, design, behavior, responsive, accessibility, or
  localization decisions from assumptions.
- First inspect the relevant code, current UI, tests, current authority documents,
  and official references. Do not ask the user for facts the repository can answer.
- Before implementation, identify every unresolved requirement that could
  materially change the result, discuss evidence and tradeoffs, and agree on a
  concrete plan.
- Observations, audits, and cited research may be recorded without approval. Mark
  proposals as `Proposed` until the user explicitly approves them.
- Review every material decision with the user. Approval to research or draft is
  not approval to finalize or implement.
- Maintain decision states such as `Observed`, `Proposed`, `Approved`, `Rejected`,
  and `Superseded`, with rationale and sources.
- If an approved upstream mapping fails NosLog content, accessibility, or state
  requirements, report the failure and reopen the decision instead of silently
  altering it.

## Working process

- Before responding to any project task, reopen and read this root `AGENTS.md`
  completely. Do not rely on memory or a session summary.
- Before planning or editing, read the root `README.md` completely.
- Before editing, inspect repository status and existing changes. Preserve user
  work and do not modify unrelated files.
- When freshness matters, inspect branch and upstream state without pulling,
  merging, rebasing, resetting, or otherwise changing history.
- Implement UI work in small reviewable units and verify each meaningful unit in
  the test browser. Check narrow mobile and appropriate desktop widths.
- Prefer an already-running `http://localhost:3000` server. If authentication is
  required, ask the user to sign in rather than bypassing it.
- Do not treat lint or typechecking as a substitute for browser interaction checks.
- Investigate failures and distinguish pre-existing failures from regressions.
  Own debugging through final verification.

## Progress integrity

The only user-facing design-guide work units are the six blocks in `README.md` and
document `57`. Blocks 1–6 are complete; no top-level design-guide block remains.
Update both sources in the same task if a later explicit decision reopens a precise
scope.

- Do not report a completion percentage unless the user first approves a
  denominator and counting method.
- Before naming work as pending, check the current authority order above. Never use
  an older checklist to reopen completed, rejected, downstream, or prohibited work.
- Do not split research, candidates, specimens, approval gates, validation passes,
  documentation, or exports into additional top-level work.
- Once a block starts, continue it as one block. Pause only for a material user
  decision, missing authority, or block completion.
- Do not announce an internal subtask as a new remaining task. When reporting
  status, name completed decisions and the exact remaining blocks.
- Block 5 is complete. `FPR-02` Pretendard JP delivery/fallback, `FPR-03`
  Foundation v0.1 promotion, and `FPR-04` reusable aliases and patterns are
  approved. Do not reopen it from an older proposal, specimen, or checklist. There
  is no unresolved primitive, Foundation, or reusable ordinary-UI decision.
- There is no pending viewer/editor slice or `S6`.

## Git ownership

- The user owns commits, pushes, branch creation or switching, and pull requests.
- Do not perform those operations unless the user explicitly authorizes the exact
  task.
- Recommended and user-authorized commit titles use Conventional Commits with an
  English type and Korean description, for example
  `docs: 2.0 정보 구조 초안 추가`.
- At completion, report changed scope, verification, remaining caveats, and a
  recommended commit title.

## Product and audio boundaries

- Keep audio files local to the user's browser; never upload MP3 files to the
  NosLog server or database.
- Preserve NosLog's records, rankings, archive, chart editor, and chart viewer
  product focus.
- Ordinary non-viewer data visualizations must remain readable from their actual
  display area rather than fixed pixel assumptions. This does not authorize any
  viewer/editor change.

## NosLog 2.0 design-session scope

This session produces the complete authoritative NosLog 2.0 design guide. It does
not produce the final high-fidelity page suite or implement the redesigned app.

Use this delivery pipeline:

1. this Codex session completes and packages the guide;
2. Claude Design creates the final high-fidelity website and Figma design within
   the guide's approved rules;
3. a later Codex implementation session uses both sources to implement and verify
   NosLog 2.0.

The guide governs product behavior, hierarchy, accessibility, localization,
responsive rules, states, and implementation constraints. Claude Design becomes
the visual and layout source only within those rules. If a downstream design
conflicts with the guide or exposes an unresolved material decision, report it and
obtain approval instead of inventing an interpretation.

Codex may create guide specimens, diagrams, or annotated examples only when they
are needed to explain or validate a rule. Do not expand them into a final page suite.

## Design working principles

- Begin with product and reference research, not component drawing.
- Before offering a design recommendation, research relevant authoritative
  guidance, production references, current NosLog evidence, and domain behavior.
  Explain sources, transferable principles, fit, limits, and tradeoffs.
- Do not generalize from a small or duplicated reference set. Continue until new
  credible sources no longer materially change the patterns, risks, or exceptions.
- Do not introduce speculative features or navigation patterns because they are
  common elsewhere. Establish an approved NosLog user need first.
- The current feature set is not a ceiling. Evidence-backed new capabilities may be
  proposed and, after explicit approval, added to the guide.
- Extract proportion, hierarchy, rhythm, density, grid, and interaction principles;
  do not copy surface styling without a NosLog-specific reason.
- Keep the initial system lean and revisable. Validate typography, color, spacing,
  grid, and component proportions together with representative content.
- Avoid persistent controls that flatten hierarchy. Use progressive disclosure for
  secondary or mode-dependent actions without hiding genuinely primary actions.
- Record materially rejected alternatives and rationale.

## Device strategy

- Mobile is primary because NosLog is commonly used around arcade play.
- Use `390px` for representative mobile review and require one-dimensional reflow
  down to `320 CSS px`, except content whose meaning genuinely requires two axes.
- Test intermediate widths instead of assuming `390px` covers all compact layouts.
- Desktop remains required. Use extra space for comparison, dense analysis,
  visualization, editor, and administrative workflows rather than enlarging mobile.
  The locked editor itself remains outside redesign scope.
- Choose viewport breakpoints and container queries from content needs.

## Page brief requirement

Before designing a page family, agree on a brief covering:

1. purpose and primary context;
2. primary task and success condition;
3. information priority and progressive disclosure;
4. main and secondary actions;
5. real data and representative content lengths;
6. loading, empty, error, disabled, permission, and destructive states;
7. mobile and desktop behavior;
8. keyboard, focus, contrast, semantics, and accessibility;
9. Korean, Japanese, and English localization constraints;
10. acceptance criteria and browser targets.

The chart viewer and editor preservation boundary overrides this requirement: do
not create redesign briefs for those locked experiences.

## Design guide workflow

Each phase must produce reviewable evidence and receive user approval before the
next phase:

1. audit routes, states, features, data, permissions, responsive behavior,
   components, and usability problems;
2. group page families and define IA, navigation, and important flows;
3. agree on page briefs;
4. research references by role and record applicability and limits;
5. agree on principles and product hierarchy;
6. define a lean Foundation covering typography, color, spacing, grid, layout,
   borders, radius, elevation, iconography, motion, and data visualization;
7. validate representative ordinary-UI fragments at `390px`, `320px`,
   intermediate widths, and Korean/Japanese/English content;
8. refine and promote validated elements into components, patterns, and templates;
9. define desktop adaptations;
10. define remaining page-family requirements without removing verified functions;
11. produce screen requirements, implementation mappings, accessibility and
    localization checks, browser criteria, and the downstream handoff;
12. export a versioned milestone PDF after editable sources and decisions are stable.

Representative guide examples should cover music discovery, music detail, a dense
record or ranking view, and a data-sync or administrative workflow. Do not add
viewer/editor specimens.

## Design guide artifacts

- Keep product audits, IA, flows, page briefs, research, decisions, accessibility,
  localization, screen requirements, mappings, and QA under `docs/design/`.
- Keep only current authority and the minimum normative specimens needed to make a
  rule unambiguous. Git history preserves superseded comparisons; do not keep stale
  copies in the active guide tree.
- Use Figma for variables, components, patterns, templates, or annotated examples
  only when necessary. Leave the final page suite to Claude Design.
- The PDF is a versioned distribution artifact, not the editable source of truth.
- Do not create empty placeholder documents or components.

## Reference roles

Keep reference classes distinct:

- principles and evaluation: Figma UI principles, WCAG, and authoritative
  usability/accessibility guidance;
- typography and editorial hierarchy: MUSINSA, Plus X, and comparable Korean
  production work;
- art direction and layout exploration: TURN.STUDIO and curated Behance work;
- responsive implementation: official Tailwind responsive, grid, and container
  query documentation after design rules are approved;
- secondary learning: practitioner material verified against primary sources.

Starting references:

- https://www.figma.com/ko-kr/resource-library/ui-design-principles/
- https://www.behance.net/gallery/252216015/Creative-Agency-Website-TURNSTUDIO
- https://www.behance.net/search/projects/Responsive%20web?field=ui/ux
- https://dx.plusx.kr/
- https://medium.com/@canon.minjoo/풀스택-개발자를-위한-반응형-웹디자인-가이드-44967d967bdf
- https://tailwindcss.com/docs/grid-template-columns
- https://tailwindcss.com/docs/responsive-design
