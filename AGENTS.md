# AGENTS.md

## Product

This project implements NosLog, a NOSTALGIA records/ranking/archive app.

NosLog is the service and project name. NOSTORY is the name of the legacy
design reference, and NOSTALGIA is the game covered by the service.

## Design Source

Legacy NOSTORY reference:
https://www.figma.com/design/MigCZljcnwEdJF2JhnjKcj/Nostory?node-id=3-3

Frame `3:3`, named `NOSTORY 와이어프레임 정리`, records an early wireframe
direction. It predates substantial changes to the implemented product and the
approved NosLog 2.0 decisions.

Sections:

1. Home
2. Music list
3. Music detail
4. Rankings
5. Data sync guide
6. Tiers
7. Bingo
8. Profile
9. Login
10. Exams
11. Style guide

- Do not treat this legacy Figma file as the current NosLog 2.0 layout, visual,
  hierarchy, content, behavior, or component authority.
- Do not use it to resolve an open 2.0 design decision or to override current code,
  browser evidence, approved design-guide documents, or the decision log.
- Consult it only when historical intent or provenance is materially useful, and label
  any finding from it as legacy evidence.
- The approved NosLog 2.0 design guide is the governing product and design authority.
  After the guide is complete, the final Claude Design output becomes the visual and
  layout source within the guide's approved rules.
- Before accessing or modifying any Figma file, tell the user which file or artifact
  will be used, exactly what will be inspected or changed, and why it is necessary.
  Obtain approval before continuing when the access is not already explicit in the
  user's request.

## Implementation Rules

- For maintenance work outside the NosLog 2.0 initiative, do not redesign the UI
  unless the user explicitly requests it.
- NosLog 2.0 is an explicitly authorized, production-level UI/UX redesign. For
  2.0 design work, treat the current UI as a functional inventory and usability
  baseline, not as a visual constraint.
- Preserve the approved dark NosLog visual direction without copying the legacy
  NOSTORY surface treatment.
- Use the existing project stack, components, routing, and styling conventions.
- Do not use the legacy NOSTORY Figma as a source of current layout intent.
- Implement mobile-first, using `390px` as a representative mobile design and
  validation canvas rather than a fixed width or universal breakpoint. Verify
  accessible reflow down to `320 CSS px`, and choose actual layout transitions from
  content and component constraints rather than by copying the legacy wireframe.
- Reuse existing components before creating new ones.
- Keep changes scoped and verifiable.
- Run lint/typecheck/build after implementation if the project provides those commands.
- The existing chart viewer and chart editor in their entirety are locked preservation
  exceptions for NosLog 2.0. Preserve their current pages, DOM shell, controls, labels,
  accessibility behavior, responsive composition and containment, PixiJS/WebGL Falling
  renderer, Canvas Full-sheet renderer, note and left/right-hand palettes, renderer
  geometry, animation, chart mathematics, and editor rendering model exactly. Do not
  redesign, recolor, restyle, reorganize, replace, reinterpret, or create a 2.0 variant
  of any part of either experience. Earlier viewer/editor page briefs and `S4`/`S6`
  specimen plans are historical functional evidence only and do not authorize future
  design or implementation work. Foundation color, material, motion, iconography,
  data-visualization, component, template, responsive, and accessibility decisions do
  not apply to these locked experiences. Only the user's explicit decision to reopen
  the entire exception or a precisely named sub-scope can authorize a change.

## NosLog 2.0 Design-System Provenance

- Tailwind CSS is an implementation and responsive-layout tool only. Its color
  palette, default theme, starter templates, sample gradients, radii, shadows, and
  component appearance are not NosLog 2.0 design authority.
- Do not adopt Tailwind palette values or Tailwind-derived starter styling as NosLog
  Foundation tokens merely because Tailwind is in the project stack. Official
  Tailwind documentation may inform responsive, grid, and container-query
  implementation only where the approved guide has already defined the design rule.
- Before recommending or approving a material visual-foundation decision, compare at
  least twelve independent, relevant, authoritative or production references, with
  fifteen or more preferred when that many credible sources are available. Compare
  equivalent semantic roles and actual Light/Dark values rather than unrelated
  swatches or marketing examples.
- Prefer adopting the published values and semantic mapping of one approved,
  maintained design system intact. Do not create an unsourced hybrid by mixing values
  from several systems, interpolating new steps, shifting hues, or making a role look
  more "NosLog-like." If the upstream mapping fails measured NosLog content,
  accessibility, or state requirements, report the failure and reopen the decision
  with the user instead of silently modifying the source.
- Adobe Spectrum S2 is the approved and exclusive Dark/Light neutral primitive source
  for NosLog 2.0. Preserve its published grayscale values exactly. Do not replace
  them with Tailwind colors or mix them with the current custom Dark ramp, TDS-based
  Light values, or another system's gray steps.
- `SS-08` Radix Colors Indigo is the approved and exclusive signature identity source
  for NosLog 2.0. Preserve its published Light/Dark mapping as one intact source set;
  do not interpolate it, shift its hue, or replace one appearance or state with values
  from another system. This source approval does not itself approve an identity
  component alias, ordinary interaction color, logo recoloring, or broad accent use.
  The separately approved `RPA-A` policy below governs filled primary actions and
  assigns no action alias to Radix.
- `ITA-C` is the approved shell identity alias. Render the graphical NosLog mark and
  visible `NosLog` wordmark with the approved adaptive Spectrum S2 neutral foreground;
  do not apply Indigo to the mark, place it on an Indigo field, or add a default white
  outline. `ITA-A` and `ITA-B` are `Rejected`. The approved Fluent focus indicator is
  the only white/black boundary allowed around the identity when focus is actually
  triggered. Radix remains the approved identity source, but it currently has no
  approved shell identity alias; do not invent another placement without a separate
  user-approved gate.
- `RPA-A · Achromatic primary` is the approved filled primary-action policy. A page,
  bounded region, or temporary flow may have at most one proven non-destructive
  internal primary action, and not every view needs one. Use the exact Spectrum S2
  neutral mapping: Light default `#292929`, hover/pressed `#131313`, foreground
  `#FFFFFF`; Dark default `#DBDBDB`, hover/pressed `#F2F2F2`, foreground `#111111`.
  Keep ordinary actions, navigation, links, tools, and equal-priority choices neutral
  and lower-emphasis. External-brand and destructive actions remain outside this
  alias. Radix has no filled-action alias. `RPA-B` and `RPA-C` are `Rejected`; their
  exact Dark hover/pressed `#5472E4` with `#FFFFFF` text measured `4.28:1`, below the
  required `4.5:1`. Do not modify or revive those mappings without a new user-approved
  research gate.
- `MG-A · Adobe Spectrum S2` is the approved Material Geometry source and component
  alias mapping. Preserve the exact published mapping recorded by `MGR-08` in document
  `52`: control/container/overlay/full radius `4px/8px/10px/50%`;
  `drop-shadow-emphasized` for justified raised content, `drop-shadow-elevated` for
  temporary overlays, `drop-shadow-dragged` for actively moved content; and Spectrum
  overlay opacity `0.4` in Light and `0.6` in Dark. Flat canvas, surface, and sunken
  content keep no default shadow. The scroll-boundary alias adds no shadow and keeps
  the approved `1px` directional boundary. Do not substitute Tailwind geometry,
  interpolate new values, or revive the rejected `MG-B` Fluent and `MG-C` Atlassian
  mappings without a new user-approved gate.
- `FS-BN · Atlassian semantic color + neutral message typography` is the approved
  universal feedback/status mapping for NosLog 2.0. Preserve the exact Atlassian
  Light background/marker pairs: information `#E9F2FE/#357DE8`, success
  `#EFFFD6/#6A9A23`, warning `#FFF5DB/#E06C00`, and danger
  `#FFECEB/#C9372C`; preserve the exact Dark pairs: information
  `#1C2B42/#4688EC`, success `#28311B/#82B536`, warning
  `#3A2C1F/#FBC828`, and danger `#42221F/#F15B50`. Message-container titles and
  body copy use the approved Spectrum S2 neutral foreground (`#292929` Light,
  `#DBDBDB` Dark). Field-error text and destructive text use Atlassian danger text
  `#AE2E24` Light and `#FD9891` Dark; invalid-input borders, destructive borders,
  icons, structural markers, and compact-status markers use the relevant Atlassian
  marker. Keep explicit status text, symbol/shape, and programmatic semantics so color
  is never the sole cue. IBM Carbon informed the neutral-typography restraint only;
  do not import Carbon values, Tailwind values, interpolated steps, or the rejected
  `FS-A`, original `FS-B`, or `FS-C` component mappings into this alias without a new
  user-approved gate. This approval completes package gate `13A` only; NOSTALGIA
  domain color (`13B`) and comparison-local data color (`13C`) remain separate.
- Package `13B` domain-color research must preserve the locked chart viewer/editor
  exception above. Existing renderer note and left/right-hand colors are implementation
  constants, not open Foundation tokens, and must not enter an exact-source comparison.
  Outside the entire viewer/editor experience, proven repeated-scanning difficulty UI
  must distinguish Normal, Hard, Expert, and Real with four different persistent
  colors. This product requirement is approved and must not be reopened as a
  color-versus-neutral choice. The exact authoritative Light/Dark source values and
  four-role mapping remain the open `13B` decision. Basic/Recital,
  rank/achievement, and genre remain neutral by default; score bands and FAST/SLOW
  visualization belong to `13C`. This boundary does not approve current non-renderer
  NosLog values, sampled imagery, another rhythm game's palette, or any new exact
  Light/Dark mapping. Keep the difficulty name, level, order, and selection visible so
  color is never the sole cue. If research does not produce an acceptable sourced
  mapping, report the failure to the user; do not silently neutralize the roles or
  invent replacement values.
- Shopify Polaris and the `EXP-01` Polaris Light / Radix Dark split were measured and
  not selected as the identity source. Preserve their evidence in document `47`, but
  do not use them as downstream design or implementation targets unless the user
  explicitly reopens the identity-source decision.
- Primitive-source approval, semantic-role mapping, component-alias mapping, and
  production implementation are separate approval gates. Approval of Adobe Spectrum
  S2 primitives does not by itself approve a proposed foreground, boundary,
  interaction, or component assignment.
- Documents `32`–`37` under `docs/design/` record the current color authority and
  evidence. The over-accented `FCM-11` and `SIG-07` examples are `Rejected` and must
  not be reused as design evidence, downstream references, or implementation targets.

## Requirement Clarity and Planning

This is the most important working rule for this project:

- Do not make ambiguous product, design, or behavior decisions based on assumptions.
- Before implementation, inspect the relevant code and current UI and identify every
  unresolved requirement that could materially change the result.
- Ask the user all necessary questions and continue the discussion until there are no
  meaningful uncertainties left.
- Do not start implementation while important requirements or expected behavior remain
  unclear.
- Agree with the user on a concrete implementation plan before making code changes.
- First investigate questions that can be answered from the repository, current UI,
  existing tests, or project documentation. Do not make the user answer facts that can
  be discovered directly.
- Actively find relevant references, including existing project patterns, current
  browser evidence, approved design-guide documents, official documentation, and
  suitable comparable examples. Use the legacy Figma only under the limited conditions
  defined in `Design Source`.
- Share useful reference findings, possible approaches, and meaningful tradeoffs with
  the user so the direction can be decided together before implementation.
- References should inform the implementation without overriding the existing NosLog
  design direction or established project conventions.
- Once the requirements and plan are clear, proceed with the implementation and handle
  debugging autonomously through verification.

## Working Process

- Before responding to any project task, reopen and read the root `AGENTS.md`
  completely. Do not rely only on memory, prior-turn context, or a session summary for
  project instructions.
- Before planning or editing project work, read the root `README.md` completely and
  use its current product, setup, validation, deployment, privacy, and versioning
  guidance as the repository baseline.
- Before editing, check the repository status and inspect existing changes.
- Preserve the user's existing changes and do not modify or revert unrelated files.
- When repository freshness matters, inspect the current branch and upstream state
  without performing pull, merge, rebase, reset, or other history-changing operations.
- Implement UI work in small, reviewable units.
- After changing one meaningful UI unit, verify it in the test browser before moving to
  the next unit.
- Prefer the user's already running `http://localhost:3000` development server instead
  of starting a duplicate server.
- If authentication is required for testing, ask the user to sign in instead of trying
  to bypass authentication.
- For responsive UI, verify both narrow mobile layouts and appropriate desktop widths.
- Do not treat lint or typechecking as a substitute for testing the actual UI and
  interaction in the browser.
- Investigate test failures and distinguish pre-existing failures from failures caused
  by the current change.
- Own debugging from root-cause investigation through the fix and final verification.

## NosLog 2.0 Progress and Decision Integrity

The `NosLog 2.0 design-guide progress baseline` section in `README.md` is the
authoritative package-state ledger, and document `57` is the authoritative
remaining-scope and preservation audit. Read both before naming the next task. They
exist to prevent completed, downstream, closed, or prohibited work from being
rediscovered as pending when older documents contain stale future checklists.

- Use the fixed eighteen-work-package denominator in the README for every design-guide
  progress percentage. Do not switch between document count, workflow-phase count,
  commit count, elapsed time, or estimated effort and still call the result the same
  percentage.
- Before describing any work as pending, search later-numbered documents, their decision
  logs, and relevant Git history for an explicit completion, approval, rejection, or
  supersession. A later explicit decision overrides an older plan, status sentence, or
  unchecked checklist item covering the same scope.
- Treat a work package marked `Complete` in the README as locked. Do not research,
  redesign, revalidate, or count it as incomplete unless the user explicitly reopens
  that exact decision or new evidence proves a recorded acceptance requirement failed.
- Do not interpret a later integrated regression check as permission to redo its locked
  inputs. `S1`–`S5` structural validation is complete. There is no missing `S6` slice:
  the former editor proposal is superseded by the full viewer/editor preservation lock.
  The future final Foundation regression must reuse only ordinary-UI fixtures `S1`,
  `S2`, `S3`, and `S5`, check regressions caused by subsequently approved appearance
  rules, and exclude the locked `S4` viewer and all viewer/editor work entirely.
- Update the README ledger in the same task whenever a work package changes state. A
  progress percentage must not decrease unless the user explicitly approves new scope
  or reopens a completed package; record and explain either event beside the ledger.
- Report both the package count and the percentage, and label the value as management
  progress rather than a calendar or remaining-time estimate. Do not invent fractional
  credit other than the explicit `0.5` used for the single package currently marked
  `In progress`.
- Historical documents remain valid evidence for the decisions they recorded, but their
  stale status summaries and future checklists are not the current progress authority.
- If an older document names `S4`, `S6`, viewer/editor adaptation, final mark drawing,
  or Radix placement as future work, apply document `57`'s disposition instead of
  repeating or executing that item.

## Git Ownership

- The user owns commits, pushes, branch creation or switching, and pull requests.
- Do not commit, push, create or switch branches, or create pull requests unless the
  user explicitly changes this rule for a specific task.
- Write every recommended commit title and every commit title created on the user's
  behalf in Conventional Commits form: an appropriate English type such as `feat`,
  `fix`, `docs`, `refactor`, `test`, or `chore`, followed by `: ` and a Korean
  description. Keep product names and code identifiers in their original form when
  necessary. Example: `docs: 2.0 정보 구조 초안 추가`.
- At completion, report the changed scope, verification results, remaining caveats, and
  a recommended commit title.

## Product and Audio Boundaries

- Keep audio files local to the user's browser; do not upload MP3 files to the NosLog
  server or database.
- Preserve NosLog's records, rankings, archive, chart editor, and chart viewer focus.
- Keep ordinary non-viewer data visualizations readable based on their actual display
  area rather than relying only on fixed pixel sizes. This rule does not authorize any
  change to the locked chart viewer/editor.

## NosLog 2.0 Design Initiative

NosLog 2.0 is the planned production-complete release for the service's new
interface. It is not a cosmetic refresh. The work may redefine information
architecture, navigation, typography, hierarchy, layout, component patterns,
responsive behavior, and the visual system while preserving the verified product
features, data, and domain logic.

The design guide must be completed before broad screen-by-screen implementation.
Do not reduce its scope to an arbitrary page or frame limit. It may become a long
document if that detail is necessary to make decisions explicit and reusable.

### Session Scope and Downstream Design

The objective of this Codex design session is to produce the complete, authoritative
NosLog 2.0 design guide. It is not to create the final production website design,
the complete high-fidelity Figma screen set, or the redesigned application itself.

Use the following three-stage delivery pipeline:

1. This Codex design session completes and packages the authoritative NosLog 2.0
   design guide.
2. Claude Design reads the approved guide and creates the final high-fidelity website
   and Figma design in accordance with it.
3. A separate future Codex implementation session reads both the approved guide and
   the final Claude Design output, then implements and verifies NosLog 2.0 in the
   application.

- The approved guide becomes the governing product and design direction for all
  NosLog 2.0 implementation.
- Claude Design is the downstream designer that will use the completed guide as its
  authoritative input and create the final website design.
- In the later implementation session, treat the approved guide as the authority for
  product behavior, hierarchy, accessibility, localization, responsive rules, states,
  and implementation constraints. Treat the final Claude Design output as the visual
  and layout source within those approved rules.
- If the downstream design conflicts with the guide, omits a required state, or
  requires a material decision that the guide did not resolve, do not silently choose
  or implement an interpretation. Report the conflict to the user and obtain approval
  for the necessary guide or design revision first.
- Do not begin the downstream high-fidelity design or application implementation in
  this design-guide session unless the user explicitly changes the session scope.
- Codex may use Figma or another visual tool only when the guide itself needs visual
  evidence or a normative example. Appropriate artifacts include color and typography
  specimens, spacing and grid diagrams, component anatomy, interaction and state
  examples, mandatory layout schematics, and representative examples needed to explain
  or validate a rule.
- Export or embed those guide visuals as PNG, PDF, or another suitable format when
  needed so the written guide and its distributed artifacts remain understandable.
- Guide examples may be visually detailed when precision is necessary, but do not
  expand them into a complete final page suite or silently treat them as the final
  production design.
- The guide should be sufficiently explicit that the downstream designer does not need
  to invent product behavior, content hierarchy, accessibility requirements,
  responsive rules, states, or implementation-critical constraints.

### Design Working Principles

- Begin with product and reference research, not typography or component drawing.
- Before offering any product or design opinion, direction, alternative, or
  recommendation, first research and compare the relevant authoritative guidance,
  production references, current NosLog evidence, and domain behavior. Present the
  sources, transferable principles, NosLog fit, limitations, and tradeoffs before the
  recommendation. If the evidence is not yet sufficient, state that clearly and
  continue research instead of recommending from personal preference.
- Do not generalize from a small reference set. For a material product or design
  decision, build a broad and diverse comparison set of at least twelve independent,
  relevant sources, with fifteen or more recommended when that many credible sources
  are available. Cover authoritative guidance, production services, domain
  comparables, and current NosLog evidence. Continue until additional sources no
  longer materially change the identified patterns, alternatives, risks, or
  exceptions. Cite the sources, distinguish convergence from disagreement, and
  explain applicability and limitations; never inflate the count with weak, duplicate,
  or irrelevant examples merely to meet the numeric threshold.
- Do not introduce speculative features, content modules, grouping labels, or
  navigation patterns merely because they are common elsewhere. First establish that
  they solve an approved NosLog user need and do not distort NOSTALGIA domain meaning.
- Do not treat the current NosLog feature set as the ceiling for the 2.0 experience.
  Actively identify, research, and propose capabilities that NosLog does not yet have
  when they would materially improve user effectiveness, efficiency, accessibility,
  clarity, or task completion.
- After the user explicitly approves a well-supported new capability, include it in
  the authoritative guide and downstream design and implementation scope even when it
  increases development work. The absence of an existing implementation is not a
  reason to omit a necessary 2.0 requirement.
- This permission to add capabilities does not permit speculative feature growth.
  Every addition must still be grounded in verified user needs, domain behavior,
  current-product evidence, broad reference research, discussed tradeoffs, and the
  existing approval gates.
- Base decisions on cited references, observed user context, current UI evidence,
  product requirements, and accessibility guidance. Do not present personal taste
  or unverified assumptions as design rationale.
- Discuss findings, open questions, alternatives, and tradeoffs with the user.
  Resolve meaningful uncertainty before fixing a guideline or starting implementation.
- Use references to extract transferable principles such as proportion, hierarchy,
  rhythm, density, grid behavior, and interaction patterns. Do not copy a reference's
  surface styling without a NosLog-specific reason.
- Keep the initial design system deliberately lean and revisable. Establish enough
  foundations and components to test representative screens, then refine the system
  using those results instead of over-investing in an unvalidated library.
- Treat typography, color, spacing, grid, and component proportions as one system;
  do not finalize them independently without representative content.
- Avoid accumulating persistent buttons, tabs, and filter controls merely to expose
  every available action at once. Preserve visual hierarchy through contextual
  controls, compact selectors, menus, and progressive disclosure when the action is
  secondary or mode-dependent; do not hide genuinely primary or high-frequency
  actions without evidence.
- Document rejected alternatives and the reason for the final choice when the
  decision materially affects the product.

### Design Decision Authority and Approval Gates

The user is the final decision-maker for NosLog 2.0 product and design direction.
Do not autonomously add or finalize product requirements, information hierarchy,
content, interaction behavior, visual rules, or responsive behavior.

- Repository and UI observations, route and feature inventories, test results, and
  cited reference findings may be researched and recorded without prior approval.
  Clearly distinguish observed facts from proposals and unresolved assumptions.
- Design drafts and alternatives may be prepared to support discussion, but keep them
  marked as draft or proposed until the user explicitly approves them.
- Review every material decision with the user. This includes information architecture,
  page contents and functions, content removal or progressive disclosure, navigation,
  visual direction, foundation tokens, component behavior, responsive adaptation,
  localization behavior, accessibility tradeoffs, and domain-specific visualization.
- Present related decisions in small, clearly enumerated groups with evidence,
  alternatives, tradeoffs, and a recommendation. Do not infer approval for one item
  from approval of another item in the same phase.
- Continue asking questions until the user confirms that the relevant requirements
  and expected behavior are clear. Do not move a disputed or unresolved decision into
  a downstream design artifact or implementation.
- Maintain a decision log using statuses such as `Observed`, `Proposed`, `Approved`,
  `Rejected`, and `Superseded`, including the rationale and relevant references.
- Obtain explicit user agreement at the end of each major phase before beginning the
  next phase. Approval to research or draft is not approval to finalize or implement.

### Device Strategy

- Mobile is the primary context because NosLog is commonly used around arcade play.
- Design the mobile experience first and use `390px` as its representative review
  canvas because it maps to a common current phone viewport. It is not an industry
  standard, fixed application width, minimum supported width, or breakpoint.
- Require information and functionality to reflow without two-dimensional scrolling
  at `320 CSS px` except for content whose meaning genuinely requires two dimensions.
  Test intermediate widths instead of assuming that a successful `390px` specimen
  represents every compact viewport.
- Desktop support remains required even if current traffic is small. Use the extra
  space intentionally for comparison, dense record analysis, ordinary data
  visualization, and administrative workflows rather than merely enlarging the mobile
  canvas. Do not reinterpret this as viewer/editor redesign authority.
- Decide responsive changes from content needs and component space, not device names
  alone. Use viewport breakpoints and container queries where each is appropriate.

### Page Brief Requirement

Before designing a page family, create and agree on a page brief that covers:

1. page purpose and primary user context;
2. primary task and success condition;
3. information priority and content that can be removed or progressively disclosed;
4. main and secondary actions;
5. real data requirements and representative content lengths;
6. loading, empty, error, disabled, permission, and destructive states;
7. mobile and desktop layout behavior;
8. keyboard, focus, contrast, semantics, and other accessibility needs;
9. Korean, Japanese, and English localization constraints;
10. acceptance criteria and browser verification targets.

### Design Guide Workflow

Follow this sequence. Each phase should produce reviewable evidence and receive user
approval before the next phase begins:

1. Audit the current product: routes, page states, features, data, permissions,
   responsive behavior, existing components, and known usability problems.
2. Group pages into page families and document the information architecture,
   navigation model, and important user flows.
3. Create and agree on page briefs that define the required content, elements,
   functions, priorities, actions, states, and success criteria.
4. Research references by role and create a reference matrix recording the transferable
   principle, NosLog applicability, limitations, and source.
5. Agree on NosLog design principles and the intended product hierarchy.
6. Create a lean `v0.1` foundation covering typography, color, spacing, grid, layout,
   borders, radius, elevation, iconography, motion, and data visualization.
7. Test the foundation on several representative `390px` guide examples or screen
   fragments with real, long, empty, error, and Korean/Japanese/English content, then
   verify `320 CSS px` reflow and the intermediate widths where content changes the
   composition.
8. Refine the foundations from those screens, then promote validated elements into
   documented components, patterns, and templates.
9. Define desktop adaptations using the extra space for comparison, analysis,
   ordinary visualization, and administrative tasks, adding guide examples only where
   necessary to make the rules unambiguous and excluding the locked viewer/editor.
10. Define the content, layout, interaction, and state requirements for the remaining
    page families without silently removing verified product functionality or
    producing the final high-fidelity page suite.
11. Produce screen requirements, implementation mappings, accessibility checks,
    localization checks, browser acceptance criteria, and the downstream design
    handoff.
12. Assemble and export a versioned design guide PDF only after the editable sources
    and decisions for that milestone are stable.

Representative guide examples should cover different product demands, including music
discovery/listing, music detail, a dense record or ranking view, and a standard
data-sync or administrative workflow. They validate and communicate the guide; they
are not the final production screen set. Do not add viewer/editor specimens.

### Design Guide Artifacts and Source of Truth

The PDF is a versioned reading and distribution artifact, not the only editable source
of truth.

- Keep research, product audits, page inventories, page briefs, reference analysis,
  decision records, accessibility rules, localization rules, screen specifications,
  and QA checklists as version-controlled documentation under `docs/design/`.
- Keep visual foundations, variables, component variants, patterns, templates,
  required mobile and desktop examples, and annotated specifications in Figma when
  those artifacts are necessary to communicate the guide.
- Leave the complete final high-fidelity page design and production screen suite to
  Claude Design after the guide is complete.
- Later implementation should map approved Figma variables and components to code
  tokens and reusable application components.
- Export a PDF snapshot at agreed milestones. The PDF should identify its version and
  date so it is not mistaken for newer Figma, documentation, or code.
- Do not create every possible document or component as an empty placeholder. Add
  artifacts as their corresponding research or design phase begins.

#### Bilingual Design Documentation

- Write the canonical design documentation in English so it remains precise and
  machine-readable.
- For every canonical English document, maintain a complete Korean companion for the
  user. Use the same base name with a `.ko.md` suffix, for example
  `01-current-product-audit.md` and `01-current-product-audit.ko.md`.
- The Korean companion must contain the same substantive information as the English
  source. Do not replace it with a summary or omit tables, statuses, evidence,
  unresolved questions, decisions, or acceptance criteria.
- Link the two versions to each other and identify which file is canonical.
- Update both language versions in the same task whenever content changes. If a
  temporary synchronization gap is unavoidable, mark it clearly and do not treat the
  affected phase as approved until both documents match.
- Preserve code identifiers, routes, token names, decision statuses, and other
  technical terms when translating them would make implementation mapping ambiguous.
- Decide the language and packaging of exported milestone PDFs with the user before
  export; do not assume that the English and Korean PDFs must use the same layout.

Recommended version-controlled document groups:

- product context and current-product audit;
- page and feature inventory;
- information architecture and user flows;
- reference research and decision log;
- page briefs grouped by page family;
- foundations, components, patterns, and templates guidance;
- accessibility and Korean/Japanese/English localization guidance;
- screen specifications, implementation mapping, and QA checklists.

Recommended Figma pages:

1. Cover and index
2. Research
3. Product and information architecture
4. Foundations
5. Component specimens and anatomy
6. Patterns, interactions, and states
7. Templates and mandatory layout diagrams
8. Required mobile guide examples
9. Required desktop guide examples
10. Specifications, exports, and archive

### Reference Roles

Use multiple reference classes and keep their roles distinct:

- **Principles and evaluation:** Figma UI design principles, WCAG, and other
  authoritative usability/accessibility guidance.
- **Typography and editorial hierarchy:** MUSINSA brand pages, Plus X portfolio and
  comparable Korean production work.
- **Art direction and layout exploration:** TURN.STUDIO and curated Behance projects.
- **Responsive implementation:** official Tailwind CSS responsive, grid, and container
  query documentation.
- **Secondary learning material:** practitioner articles such as the supplied
  responsive web design guide; verify important claims against primary sources.

Starting reference set:

- https://www.figma.com/ko-kr/resource-library/ui-design-principles/
- https://www.behance.net/gallery/252216015/Creative-Agency-Website-TURNSTUDIO
- https://www.behance.net/search/projects/Responsive%20web?field=ui/ux
- https://dx.plusx.kr/
- https://medium.com/@canon.minjoo/풀스택-개발자를-위한-반응형-웹디자인-가이드-44967d967bdf
- https://tailwindcss.com/docs/grid-template-columns
- https://tailwindcss.com/docs/responsive-design
