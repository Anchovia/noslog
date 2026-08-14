# 66 · Design Session Handoff (2026-08-14)

> This is an operational handoff. It does not alter the authority order in
> `AGENTS.md`. Document `65` is historical evidence; its statements about work not
> started, unresolved items, or node counts are not current facts. Verify current
> state against the repository, the active Figma file, and the owning Page Brief.

---

## 0. Current stage

The design guide in documents 01–25, 57, 63, and 64 is complete. The active stage is
to finish the final high-fidelity screens in the existing Figma file.

- The existing Figma file is the baseline. Do not restart from scratch.
- Extend only the portions that have not yet been designed.
- Do not change global typography, color, or spacing tokens to solve one screen.
- Do not write implementation code yet. Repository assets were added as described in
  section 4.6.
- Show material changes as an exact Before → After comparison and obtain approval
  before applying them.
- Do not propagate a new pattern across pages before its first representative unit is
  approved.

### Authority order

1. The user's latest explicit decision.
2. `AGENTS.md`.
3. `README.md` and document 57.
4. Document 64.
5. Document 07, the absolute chart viewer/editor preservation contract.
6. Document 24.
7. Document 25.
8. The owning Page Brief.
9. Documents 22 and 63.

`CLAUDE.md` is a working-rules file and must be read before every design task.

---

## 1. Absolute preservation boundaries

- The complete chart viewer and editor are locked by document 07. Do not redesign,
  recolor, rearrange, apply Foundation, or create variants or specimens. Preserve
  PixiJS/WebGL, palettes, geometry, animation, chart mathematics, and the editor
  rendering model. Only the entry link is in scope.
- Do not broadly redesign `/admin/*` or create a user chart-contribution/editor flow.
- Local MP3 files remain in the browser and are never uploaded.
- Never render, copy, or log a raw sync token as standalone text.
- Exam evidence images remain private Blob assets with no public URL.
- Never send a p.eagate password or session cookie to NosLog.
- Legacy NOSTORY Figma is not current authority.
- Do not copy the document 63 regression harness as final page composition.
- Do not disguise document 18 privacy release blockers as resolved UI.

---

## 2. Working environment

**Figma**: `NosLog v2.0.0` · key `cVbWCxhkfxFfHmAKLCyKrD`

| Page                     | ID                         | Current state                                                                                |
| ------------------------ | -------------------------- | -------------------------------------------------------------------------------------------- |
| 01–03 Foundation         | `70:238` and related pages | Complete                                                                                     |
| C1 Icons                 | `86:3`                     | Complete · 36 Lucide icons                                                                   |
| C2 Actions               | `86:4`                     | Complete                                                                                     |
| C3 Markers               | `86:5`                     | Complete                                                                                     |
| C4 Forms & Feedback      | `86:6`                     | Complete                                                                                     |
| C5 Search & Refinement   | `86:7`                     | Complete                                                                                     |
| C6 Entity & Result       | `86:8`                     | Complete                                                                                     |
| C7 Dense Data            | `86:9`                     | Complete · audit violations 0                                                                |
| C8 Overlays & Shell      | `86:10`                    | Shell, focus, modal, and popover assembly complete; footer-link focus intentionally excluded |
| P1 Music Detail assembly | `242:2`                    | Four areas in Light and Dark; Tier & Evaluation remains partially assembled                  |
| Z1 decision record       | `268:2`                    | Approved `268:3`; pending `268:11`; pending items 0                                          |

- Color collection: `VariableCollectionId:70:3`; Light `70:1`; Dark `70:2`.
- Text styles: 45 total = 13 composites × `ko`/`ja`/`latin` (39) plus six
  `nav-fit/*` and `nav-fit-current/*` styles.
- Normative font: `Pretendard JP Variable`. The current renderer uses
  `IBM Plex Sans KR/JP/Latin`. Repointing the three
  `font/family/ko·ja·latin` variables propagates the family change. Revalidate all
  layouts after the replacement.

External state files are reference material only:
`~/.claude/projects/-Users-carol-Desktop-project-noslog/design-state/` contains
`audit.js`, `R2-conflicts.md`, `state.json`, and `brief-contracts-notes.md`. Current
facts must still be verified against this handoff's higher authorities and Figma.

---

## 3. Mandatory working rules

1. Do not create anything before the user explicitly says `시작`.
2. Read the owning Page Brief completely before drawing.
3. Do not guess undocumented padding, alignment, color, structure, columns, or labels.
4. For an unresolved visual decision, draw comparison options in Z1 and ask the user;
   do not ask only in prose.
5. Run the complete A/B/C audit immediately after creating a unit. A script completing
   without an error is not proof that the result is correct.
6. Report only checks that were actually executed.
7. Produce both Light and Dark appearances.
8. Use only values allowed by document 24. Do not invent approximations or
   intermediate values.
9. Move decided Z1 options to the approved section immediately and mark unselected
   options `폐기 · …`.
10. Put explanatory sentences in dev annotations, not visible product text.
11. Keep rejected and comparison boards in Z1, not C1–C8 or P1.

### Figma API traps encountered in this work

- In an auto-layout parent, `appendChild` changes flow position as well as z-order.
  A P1 header was moved to the end of the flow and disappeared. Use
  `layoutPositioning='ABSOLUTE'` for overlay z-order and preserve flow order.
- Hiding an instance sublayer with `visible=false` removes it from this API's
  `children` collection and can collapse an auto-layout column. For an absent value,
  preserve the slot and clear only its content (`''` text and `strokes = []`).
- Assigning `vectorPaths` repositions paths around the node bounding box. Restore the
  node `x/y` to the intended bounding-box minimum after assignment.
- Absolute focus-border overlays do not follow parent resizing automatically. Use
  `constraints = STRETCH/STRETCH` and recheck after parent-size changes.
- A source cloned from `DARK VERIFICATION` carries effective Dark paints. Inspect its
  effective mode before cloning.
- After cloning, rewrite bound paint raw values to the effective-mode values.
  `surface/scrim` alpha lives in paint opacity: Light `0.4`, Dark `0.6`.
- `createImageAsync` is unavailable in this API, and the plugin cannot read local
  files. Keep bitmap locations as slots and placeholders in Figma.
- Collect node IDs first and delete afterward. Deleting during traversal can crash the
  operation.
- Always call `loadFontAsync` before text writes, including `textAutoResize` changes.

---

## 4. Work completed on 2026-08-14

### 4.1 Locale text-style correction — 268 nodes

`*/ko·ja·latin` is both a font-family switch and a text-width measurement
precondition. Applying `*/ko` to Japanese caused some kanji to measure at half width
(`楽曲` measured 14px instead of 28px), invalidating the previous claim that six
labels needed `12/16` at 320px. All affected nodes were corrected; the recorded
remaining count is 0.

### 4.2 Navigation-label fit — six dedicated styles

The 13 composites do not contain `12/16 · 500`, so the bounded navigation exception
uses dedicated styles rather than raw values:

- `nav-fit/ko·ja·latin` at weight 500.
- `nav-fit-current/ko·ja·latin` at weight 600.

All are bound to `font/family/*`. At 320px, exactly four labels need the fit step:
`데이터 동기화`, `譜面ビューア`, `ご意見・報告`, and `Chart Viewer`. `店舗` and
`Feedback` returned to `14/20` because measurement did not justify reduction. All
labels use `14/20` at 390px and Wide.

### 4.3 C8 shell focus — five `State=Focus` variants

Focus variants were added for AppHeader, Compact and Wide DestinationPanel, and
Compact and Wide AreaSwitcher. They implement FOCUS-1B: one 1px inside boundary on
the control. A resting boundary changes color; a borderless control gains the boundary
only during focus. Each set retains one representative focus variant, and its
description records that the same rule applies to the remaining controls
(`SHELL-30`, `SHELL-31`). Measured contrast ranges were Light 19.77–21.0 and Dark
15.91–18.88. Footer-link focus was explicitly excluded from this work unit.

### 4.4 C8 modal and popover assembly

- Compact modal at 390px and 320px and Wide popover at 1280px were assembled in Light
  and Dark in section `596:1389`.
- Document 24's `Joined overlay edge` rule applies to the compact modal: zero gap to
  the header, zero radius on the joined corners, and no duplicate self-border on the
  joined edge. The non-modal Wide popover retains four rounded corners and an 8px
  anchor offset. These are different usage contracts and do not share one offset.
- The 320px check used 288px available width, 134px cells, and 78px text slots.
- Scroll locking, focus containment, Escape, and outside-click behavior are recorded
  only as dev annotations because static Figma cannot execute them.

### 4.5 Footer copy in three locales (`SHELL-32`)

| Locale | Approved copy                                                                          |
| ------ | -------------------------------------------------------------------------------------- |
| KO     | `© 2026 NosLog · NOSTALGIA 기록·랭킹·아카이브 비공식 팬 서비스`                        |
| JA     | `© 2026 NosLog · NOSTALGIA の記録・ランキング・アーカイブ非公式ファンサービス`         |
| EN     | `© 2026 NosLog · Unofficial fan service for NOSTALGIA records, rankings, and archives` |

No trademark-attribution sentence is approved in any locale. Adding one requires one
coordinated three-locale decision.

### 4.6 Self-hosted grade images — repository assets added

Eight official 40×40 grade images are tracked in `public/grade/`:
`grade_p·s·a2·a·b2·b·c·d.png`. The current implementation hot-links p.eagate, so a
third-party outage can blank the grade column.

Not yet implemented: `components/music/ranking/rankImage.tsx` still uses the remote
URL. Change it to `public/grade/` only during the later implementation stage. No
implementation code was changed in this design session.

### 4.7 Achievement color roles — document 24 `AC-01`

`achievement/full-combo` uses green and `achievement/pianist` uses amber. Both alias
the already approved SAP Fiori Horizon primitives from LD-03. Always pair the colors
with the labels `FC` and `P`. The existing Tailwind lime `#a3e635` has no approved
source and is not adopted.

### 4.8 Leaderboard row reconstruction — document 05 `MDET-89`

All 68 rows use one fixed one-line column pattern:

```text
rank 0:28 | profile 36:24 | name 68:130 | grade 206:18 | score 232:68 | achievement 308:26   (gap 8)
```

- Only the name column fills available width. Empty values preserve their columns, so
  a missing achievement never shifts the score.
- The score column fits the widest `1,000,000`-family value, and the visible `점수`
  header is centered over that column.
- Only rank, player, and score have visible headers. Profile, grade, and achievement
  have accessible names only.
- Grade uses an 18px image slot. Figma uses placeholder text; implementation uses
  `public/grade/`.
- The three `MyRankSummary` states use the same coordinates and mark grammar. Their
  container matches the table recipe: `surface/surface`, `radius/container`, 12px
  padding, and no boundary.
- Player-name locale style follows the writing system of the name itself because one
  ranking mixes Korean, Japanese, and Latin names.

### 4.9 P1 four-area assembly and Dark appearance

Information, My Record, Ranking, Tier & Evaluation, and the open DestinationPanel are
assembled as five Light and five Dark shells. Blocks inside an area panel use a 32px
gap, and AreaSwitcher changes to the matching area variant.

### 4.10 User-reported defects corrected

- Music Grid dead space: a fixed 297px card held 277px of content. Card and body now
  hug content.
- Music Grid double gap: card gap 8 plus body top padding 12 created 20px above and
  12px below. Card gap and padding are 0; body padding is 12px on every side.
- A focus border extended 20px beyond its card. It now stretches to the parent.
- The jacket category badge was obscured by the music-note icon. `category` is now at
  the highest z-position in 12 C6 and 6 Z1 cases.
- The P1 header disappeared after an auto-layout flow reorder. Flow order was restored.
- Empty achievement slots collapsed the score column. Slots now remain while only
  their content is cleared.
- Visible explanatory sentences in C2, C6, and C7 were moved to dev annotations.

---

## 5. Current repository state

- Branch `dev` is synchronized with `origin/dev` at commit `e029ead`:
  `docs: 랭킹 행 열 계약과 성취 색 역할 확정`.
- The working tree was clean when this handoff was reconciled on 2026-08-14.
- The eight `public/grade/` assets are committed.
- `components/music/ranking/rankImage.tsx` still references the remote p.eagate URL;
  the local-asset code change remains implementation-stage work.

---

## 6. Remaining work, in order

### Stage 1 · Complete P1 Tier & Evaluation

The current shell contains only units 1–3. Units 4 and 5 are absent and the shell dev
annotation marks it as partial.

#### 4. Current-user vote and evaluation forms

- Six vote scopes: Basic/Recital × S/Full Combo/Pianist.
- Values `1.0`–`14.5` in `0.1` increments.
- One vote per user, chart, mode, and goal; independent edit and deletion per scope.
- Five eligibility states: signed out, no verified record for the exact chart, no
  Recital participation, eligible, and already voted. Every unavailable action needs
  an accessible reason; an unexplained disabled control is prohibited.
- Basic predicates: S score ≥950,000; Full Combo `fc_type >= 2` or score 1,000,000;
  Pianist `fc_type === 3` or score 1,000,000.
- Recital requires the same goal predicate plus `grade_recital > 0`.
- Five pattern axes: Stairs, Repetition, Polyrhythm, Offset, and Chords.
  `Not rated` is missing data and remains distinct from valid `0 · None`. Never
  prefill an omitted axis as 0.
- Three independent deletion scopes: opinion only, complete general evaluation, and
  one exact vote scope.

#### 5. Community opinions

Include Helpful, exactly two sorts, explicit Load more, the approved deletion scopes,
and an overflow menu rather than permanent row actions. Do not repeat all five pattern
values in each opinion; the aggregate radar owns that information.

### Stage 2 · Remaining Page Briefs

The remaining downstream page families are:

- 03 Home.
- 04 Shared Discovery.
- 06 Tier List.
- 08 Global Rankings.
- 09 Profile.
- 10 Bingo.
- 11 Exam.
- 12 Arcade Discovery.
- 13 Data Sync.
- 14 Announcements.
- 16 Settings & Account.
- 17 Authentication & Onboarding.
- 19 System Recovery States.

Document 07 is a preservation contract, not a design target. Document 18 contains
release blockers that must not be disguised as completed UI.

### Stage 3 · Deferred shared follow-ups

- Propagate pressed `scale(0.98)` to remaining eligible small controls such as icon
  buttons and page-number controls.
- Complete desktop ranking-column separation (`05:757`) and general Wide layouts.
- Add C8 footer-link focus only if that explicitly excluded unit is reopened.
- Revalidate every layout after the eventual Pretendard replacement.

---

## 7. Unresolved or unapproved items

### Unapproved copy

- Ranking: `순위`, `플레이어`, and `점수` are temporary Korean strings.
- Tier: `평균`, `투표 N명`, and `Basic 풀콤보 분포`.
- Radar: `패턴 성향`, `패턴 성향 기준`, and `평가 N명`.
- Zero-participant ScoreDistribution copy.
- Japanese and English remain unapproved for all of the above. Only the footer copy
  in section 4.5 is approved in all three locales.

### Remaining conflict records

- 11: visual-core PDF representation.
- 12: evidence for 19 C5 `A2_padSym` findings.
- 15 follow-up: Japanese label for `채보 보기`.
- 16: localized-title popover locale labels.
- Reference 25: unavailable-state copy.
- Reference 26: missing user-record fixture.

### Resolved segmented-selection status

There is no pending segmented-selection decision. Document 24 contains an approved,
named exception: only the selected segment of `ViewModeSwitch` and
`DifficultySelector` uses a 1px inside `border/strong` boundary as the persistent
non-fill cue. It is not an automatic rule for any other segmented family.

### Intentionally not created

- Translucent radar fill: no approved opacity exists.
- Four-level distribution ranking by color: the approved ramp spans only about
  3.31:1, so it cannot carry four reliable ranks.
- Error/Loading variants for Tier subcomponents: failure copy appears once at the
  section level.
- Separate Primary/Destructive pressed colors: the approved ramps have insufficient
  visual range; motion scale carries pressed feedback.
- Custom grade icons: official images are the approved source.

### Known audit false positives

- `A1_spacing2` uses a path-based regular expression and can misclassify new Korean
  paths.
- The NI-A classifier recognizes `State=Hover` but can miss paths such as
  `cells / Hover / Button`.

---

## 8. Last recorded audit (2026-08-14)

```text
C6 (1401 nodes · Dark 642)   findings: 6 asymmetric-padding cases = Music List 0/12, intentional jacket-bleed structure
C7 (2025 nodes · Dark 878)   findings: 0
P1 (2035 nodes · Dark 1017)  findings: 10 asymmetric-padding cases = AppHeader 16/8, approved optical padding
C8 (3253 nodes · Dark 1271)  findings: 24 asymmetric-padding cases = same approved reason
All pages: hardcoded 0 · raw mismatch 0 · RAW text 0 · locale mismatch 0 ·
           dead space 0 · overlap 0 · section escape 0 · focus-border mismatch 0
Leaderboard column pattern: all 68 rows use one pattern
Z1 pending section: 0 items
```

Every `A2_padSym` finding above is intentional. AppHeader 16/8 follows document 24's
edge icon optical-padding rule; Music List 0/12 allows the jacket to bleed to the left
boundary.

---

## 9. First actions in a new session

1. Read `AGENTS.md`, `README.md`, document 64, document 24, and the owning Page Brief
   directly.
2. Read `CLAUDE.md`.
3. Inspect `git status`; never reset, check out, or overwrite user work.
4. In Figma, inspect P1 `242:2`, its Tier & Evaluation shell, and its partial-assembly
   dev annotation.
5. Read the full relevant contracts in document 05, especially the Tier & Evaluation,
   voting, general evaluation, and community-opinion sections.
6. Present the intended change as an exact Before → After proposal.
7. Create only after the user says `시작`, then run and report every completed audit
   item immediately after the unit is built.
