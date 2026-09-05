# 87 · Reference-led design review — NosLog 2.0

Date: 2026-09-05  
Status: **Observed evidence and Proposed improvements; visual audit incomplete**  
Artifact: [NosLog v2.0.0](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD)

## Scope and limits

The user requested a read-only review of all components and designs except Z.
The review inventoried all 28 content pages: 00–03, C1–C8, and P1–P16.
The empty component divider is not a content page. Z was not inspected.
The chart viewer and editor remain outside the review.

All page families were represented in visual review, but this is **not a
pixel-level review of every frame, variant, locale, or state**. Component and
supporting-page reviewers received the Figma MCP Education-plan call-limit error.
They stopped further calls; no alternative endpoint was used to evade that limit.
A complete structure inventory does not establish complete visual coverage.

IBM Plex in Figma is the accepted environment substitution. It is not a finding.
Pretendard fit, browser reflow, keyboard interaction, assistive technology,
and real sharing-client behavior were not tested.

No Figma design or application code was changed. This report does not approve
implementation, change normative Foundation values, or reopen the completed
six-block guide. Documents 84–86 were cross-checked against newer explicit
decisions. Document 86 is an opinion document, not an approval ledger.

## Assessment

The inspected design has a coherent restrained system. Field hierarchy,
non-color selection cues, named busy actions, and task-specific desktop
compositions are meaningful strengths. There is no evidence here to justify
replacing the component library or adding decoration throughout the product.

The best next visual comparison uses real domain content: jackets with different
brightness, long original titles, and genuine image-unavailable cases. A field
of identical placeholders cannot show the intended visual rhythm of a music
archive. This supports document 86 section 4 as a **review specimen proposal**;
it does not establish that production artwork is absent or authorize importing it.

## Improvement candidates

All changes below remain **Proposed**. Priorities describe review order, not
new design-guide work blocks.

### A · Recognizable music identity when artwork is unavailable

Evidence: [Compact Tier 390](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=1291-4),
[signed-in Wide](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=1348-372),
and [Detailed comparison](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=1323-191).

**Observed:** compact cells with unavailable artwork have the same note symbol;
personal score alone does not identify a song. Detailed view retains titles.
The all-placeholder specimen is not proof of a production-wide image failure.

**Proposed:** compare a conditional visible original-title fallback for
image-unavailable compact cells, together with a mixed real-art specimen.
Choose a known song without switching view as the test task. Keep ordinary
image-present cells dense. Test several adjacent missing images and long titles.

**Tradeoff / decision:** a readable fallback can reduce density. Document 06
deliberately permits visible-title omission in Compact and forbids forcing long
titles into a fixed-height jacket. A conditional exception requires explicit
review of that contract; do not silently squeeze text into existing squares.

**Reference fit:** [NN/g recognition and recall](https://www.nngroup.com/articles/recognition-and-recall/)
supports identifiable choices. [MUSINSA magazine](https://www.musinsa.com/main/musinsa/magazine?gf=A)
and [Plus X](https://dx.plusx.kr/) show imagery accompanied by identifiable
content and an intentional title hierarchy. Their large editorial image sizes
are not appropriate defaults for a dense tier grid.

### B · Put existing rating criteria within reach of the rating task

Evidence: [Compact contribution form](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=622-1602)
and [Wide contribution form](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=2543-23481).

**Observed:** the form presents five pattern axes with 0–4 choices; the shared
pattern-profile criteria entry is in Chart Info, outside this contribution point.

**Proposed:** compare one contextual access point to the existing shared criteria
near the form heading. Reuse approved content. Do not duplicate the radar,
add a helper button beside every axis, or invent new interpretations of zero.

**Tradeoff / decision:** a new entry can clutter a focused contribution area.
Check document 05's shared-help ownership and approved form composition before
adoption. Test whether a player can consult the existing scale and return with
their draft intact.

**Reference fit:** [W3C labels and instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
calls for enough input guidance without unnecessary clutter. This supports
contextual access, not a new scoring model or a claimed WCAG failure.

### C · Make the compact map's numbers interpretable

Evidence: [Compact discovery preview](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=2767-18940)
and [Wide map](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=2784-741).

**Observed:** circles marked 12, 3, and 40 appear above a result total of 32 venues,
without a visible unit/key in the captured compact preview. The wide map explains
the symbol system. A first-time reader could confuse preferred-user counts with
venue counts.

**Important scope qualification:** document 79 explicitly calls the map a
placeholder and defers legend-layer behavior to Kakao SDK implementation.
This is a visual-contract clarity opportunity, not a proven production defect.

**Proposed:** demonstrate a concise visible meaning for numbered circles and an
explicit map-opening affordance in one compact specimen. Keep the approved
180px preview, current symbol mapping, and full-map legend.

**Reference fit:** [Google Maps legends](https://developers.google.com/maps/documentation/javascript/adding-a-legend)
links custom symbols to labels. [NN/g progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/)
supports withholding secondary detail while retaining what is needed to interpret
the initial view. Neither source supplies NosLog's map palette.

### D · Align onboarding nickname guidance with Settings

Evidence: [Onboarding](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=2685-29),
[second specimen](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=2685-160),
[Settings](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=2698-118).

**Observed inconsistency:** onboarding lists Korean, Latin, digits and punctuation;
Settings includes the approved Japanese scripts and spaces. AUTH-12 explicitly
reuses SET-16. Document 77 records correction of this omission in Settings.

**Proposed:** reuse the already-approved Settings helper across onboarding states
and locales. This is content consistency within the existing form hierarchy;
it is not a proposal to expand or narrow the nickname policy.

**Reference fit:** [W3C personal names](https://www.w3.org/International/questions/qa-personal-names)
and [GOV.UK text input](https://design-system.service.gov.uk/components/text-input/)
support accurate character expectations and persistent field guidance. Product
authority, rather than these references, determines permitted nickname characters.

### E · Verify the share card at actual preview size

Evidence: [Share card](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=2986-5).

**Observed:** the GRD-centered hierarchy is clear at the source size; tertiary
labels are much less prominent. An 18px label in a 1200px image becomes about
5.85px when the image is displayed at 390px width. This is a scaling calculation,
not a screenshot from a sharing client.

**Proposed:** compare realistic feed-size previews and decide which metadata must
remain readable without enlargement. Then consider reallocating existing space
or emphasis to those items.

**Tradeoff / decision:** the card has its own approved poster treatment.
Document 83 already records contrast/accessibility-basis and long-name questions.
This review does not classify the card as a newly discovered WCAG failure or
authorize importing ordinary-UI styling into it.

### F · Give the Profile growth plot a visible reading scale

Evidence: [Wide Profile](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=2268-13102),
[390px](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=2283-406),
and [320px](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=2296-537).

**Observed:** the large plot shows a curve and first/last dates. The start/current/
change summary is useful, but the plotted region has no visible numeric scale,
intermediate date reference, or selected-point reading state in these captures.
The plot uses substantial desktop space without making intermediate growth
readable from the resting visual.

**Proposed:** show minimal value/date references and one selected-date/value
specimen using the existing C7/document 24 analytical-chart contract. Preserve
PROF-50's height, the single-series choice, and the approved summary.

**Limit:** underlying-data access and hover behavior were not inspected; their
absence is not asserted. This proposal makes the visual reading contract explicit.
[Primer chart anatomy](https://primer.style/ui-patterns/data-visualization/) and
[USWDS data visualizations](https://designsystem.digital.gov/components/data-visualizations/)
support complementing a trend with interpretable values, without importing
a new palette or automatically adding features.

## Verification and handoff observations

- **Onboarding error expansion:** in [2685:248](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=2685-248),
  the save-error message pushes the escape-action label under the language area.
  Document 17 permits vertical scrolling. The frame's scroll/prototype behavior
  was not retrieved before quota exhaustion, so action unreachability is unverified.
  Check bottom clearance and focus visibility; close the observation if normal
  scrolling fully reveals the action. Relevant principles:
  [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) and
  [Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html).
- **TextArea specimen realism:** [Invalid 721:93](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=721-93)
  shows the same short sample as Filled while reporting 124/120. Use genuinely
  over-limit sample content in a future specimen revision to exercise wrapping,
  height, error, and counter together. This is not evidence of a broken production
  counter. [GOV.UK error guidance](https://design-system.service.gov.uk/components/error-message/)
  supports clear, internally consistent explanation.
- **Foundation reference-board freshness:** the overview capture of Guardrails
  [80:2](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=80-2)
  still describes a 2px focus perimeter; document 24 now specifies the approved
  1px inside-border treatment. Reconcile the reference annotation in a separately
  approved cleanup; this is not permission to change the controls or reopen focus.
- **Selected focus variants:** Checkbox and Radio Default/Focus looked similar
  in set captures. Raw paints and close-up verification are absent. No contrast
  failure is asserted, and no new focus geometry is proposed.

## Proposals not promoted by this review

- Home horizontal navigation tiles and ranking row dividers are already present
  in current captures and decisions HOME-22 / RANK-33. Earlier complaints about
  vertical tiles and unseparated wide ranking rows are closed.
- The latest overlay-boundary and input-border decisions supersede the earlier
  candidates in document 85. No duplicate overlay proposal is made.
- Document 86's gold motif across ordinary UI would expand a card-local treatment
  into a new brand role. Its blurred jacket hero, larger jacket values, rail
  reorganization, and unified colored difficulty grammar also require separate
  evidence and decisions. None is adopted here.
- More decoration, larger headings everywhere, extra thumbnails in every list,
  and narrower desktop containers are not justified merely by comparison with
  portfolio or commerce sites.
- No revision is proposed for the accepted Figma font substitution, 320px
  DifficultySelector fit exception, or locked viewer/editor.

## Reference comparison

References were evaluated by role rather than counted as votes for a style.
Independent sources below include official systems, production sites, and one
explicitly identified art-direction template. Several pages from one organization
are one source family. This is not a new Light/Dark palette comparison or a
Foundation primitive-selection exercise.

| Source                                                                                                      | Useful comparison                                                         | Fit and limit                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Figma UI principles](https://www.figma.com/ko-kr/resource-library/ui-design-principles/)                   | Hierarchy, proximity, consistency, progressive disclosure                 | Evaluate which decision is supported at each point; not a prescribed visual theme.                                                                                                  |
| [W3C WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)                     | Input guidance, reflow, control/state cues                                | Helps distinguish visual observations from tested conformance. Screenshots cannot pass browser behavior.                                                                            |
| [NN/g recognition and recall](https://www.nngroup.com/articles/recognition-and-recall/)                     | Recognizable entities and contextual help                                 | Relevant to missing-art identity and rating criteria; does not mandate permanent explanatory text.                                                                                  |
| [Adobe Spectrum S2](https://react-spectrum.adobe.com/ActionButton)                                          | Action emphasis and pending state                                         | Maintained-system comparison; NosLog's already-approved label-preserving Busy behavior wins.                                                                                        |
| [GOV.UK forms](https://design-system.service.gov.uk/components/text-input/)                                 | Label, hint, value, error relationships                                   | Strong fit for identity/setup tasks; no adoption of government-service appearance.                                                                                                  |
| [Spotify design guidance](https://developer.spotify.com/documentation/design)                               | Readable music identity alongside artwork                                 | Relevant to missing-art comparisons; Spotify licensing/branding rules do not govern NosLog.                                                                                         |
| [Atlassian Form](https://atlassian.design/components/form/)                                                 | Relationship of instructions, inputs, and actions                         | Supports contextual guidance; existing NosLog type and space roles remain authoritative.                                                                                            |
| [USWDS tables](https://designsystem.digital.gov/components/table/)                                          | Compact, stacked, scrollable representations                              | Supports deliberate dense-data presentation; no arbitrary restyling of rankings.                                                                                                    |
| [Radix Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group)                        | Checked state, labeling, keyboard contract                                | Matches the implementation stack; visual review does not validate keyboard behavior.                                                                                                |
| [IBM Carbon data tables](https://carbondesignsystem.com/components/data-table/usage/)                       | Row tracking and secondary controls                                       | Relevant to rankings and records; enterprise batch-action complexity is unnecessary without a user need.                                                                            |
| [GitHub Primer charts](https://primer.style/ui-patterns/data-visualization/)                                | Axes, units, exact values, chart anatomy                                  | Supports analytical readability; Primer colors are not imported.                                                                                                                    |
| [Google Maps legends](https://developers.google.com/maps/documentation/javascript/adding-a-legend)          | Custom marker-to-label association                                        | Useful for compact map meaning; Kakao implementation and existing media mapping remain authoritative.                                                                               |
| [Stripe Dashboard](https://docs.stripe.com/dashboard/basics)                                                | Task-oriented settings organization                                       | Supports current settings grouping; financial workflows are not a NosLog feature inventory.                                                                                         |
| [Linear 2026 refresh](https://linear.app/now/behind-the-latest-design-refresh)                              | Supporting chrome recedes; content keeps emphasis; selective separators   | Supports NosLog's restrained direction. Linear's own color/token changes are not transferable authority.                                                                            |
| [Plus X project index](https://dx.plusx.kr/)                                                                | Large category heading, quiet navigation, content-led image rhythm        | Visually inspected in browser. Useful for evaluating identity/content contrast, not for enlarging a mobile data interface.                                                          |
| [MUSINSA magazine](https://www.musinsa.com/main/musinsa/magazine?gf=A)                                      | Image, category, title, description, and metadata have different emphasis | Visually inspected in browser. Supports realistic content review; promotional navigation density is not a model for NosLog.                                                         |
| [TURN.STUDIO Behance project](https://www.behance.net/gallery/252216015/Creative-Agency-Website-TURNSTUDIO) | Expressive wordmark and strong scale contrast                             | Visually inspected; explicitly a creative-agency website template, not verified production usability evidence. Its giant wordmark and decorations do not fit repeated arcade tasks. |

The strongest convergence is task identity, readable meaning, and restrained
supporting UI. The editorial references add a useful check on real imagery and
hierarchy, but do not establish that NosLog needs a marketing-style makeover.

## Coverage ledger

Fresh structural inventory: **943 direct screen/state-board frames** in P1–P16
(563 + 380), plus component inventories. Nested state cells and instances are
not separately counted in this total. There were **93 unique screenshot targets**
in this expanded review: four Foundation overview boards, 19 component targets,
42 P1–P8 targets, and 28 P9–P16 targets. Long targets were sometimes scaled down;
93 is neither a quality score nor a claim that every text node was inspected.

### Foundation

| Page           | Target | Review depth                                             |
| -------------- | ------ | -------------------------------------------------------- |
| 00 README      | 72:2   | Overview and authority/font notes                        |
| 01 Tokens      | 73:2   | Whole-board overview, not every swatch at full scale     |
| 02 Type & Grid | 78:2   | Whole-board overview, not multilingual fit certification |
| 03 Guardrails  | 80:2   | Overview cross-checked with current document 24          |

### Components

All 44 sets, 210 variants, and 54 standalone components were inventoried.
The standalone count includes 42 icons. An explicitly deprecated CommunityTierVote
set remains included in inventory, not recommended for current use.

| Family                 | Sets / variants / standalone | Visual targets and limit                                                     |
| ---------------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| C1 Icons               | 0 / 0 / 42                   | 274:256 — all icons in section                                               |
| C2 Actions             | 1 / 30 / 0                   | 88:46 — Button set                                                           |
| C3 Markers             | 2 / 9 / 0                    | 90:18, 90:34                                                                 |
| C4 Forms & Feedback    | 6 / 32 / 0                   | 92:48, 100:41, 721:77, 1300:103, 1305:102, 2622:148                          |
| C5 Search & Refinement | 7 / 30 / 0                   | 107:70, 108:46, 108:117, 108:128, 108:146, 1307:277, 1624:295                |
| C6 Entity & Result     | 6 / 23 / 1                   | 176:46, 210:434 only; remaining sets not visually checked                    |
| C7 Dense Data          | 16 / 62 / 2                  | Dedicated library screenshots unavailable; some consumers visible in P pages |
| C8 Overlays & Shell    | 6 / 24 / 9                   | Dedicated library screenshots unavailable; some consumers visible in P pages |

C7/C8 consumer appearances do not certify their complete component variants.
Dark plates and close-up focus paint checks remain unverified.

### Page families

| Family            | Sections / direct frames | Screenshot targets | Assessment within inspected scope                                       |
| ----------------- | ------------------------ | ------------------ | ----------------------------------------------------------------------- |
| P1 Music Detail   | 16 / 110                 | 7                  | Purpose-specific areas; contextual criteria candidate B                 |
| P2 Home           | 7 / 57                   | 4                  | Current horizontal tiles confirmed; old finding closed                  |
| P3 Discovery      | 7 / 34                   | 7                  | Clear original-title, composer, difficulty and grouped-chart hierarchy  |
| P4 Tier           | 11 / 74                  | 4                  | Compact/Detailed serve different density needs; conditional candidate A |
| P5 Rankings       | 15 / 102                 | 5                  | Current row dividers confirmed; old finding closed                      |
| P6 Profile        | 8 / 46                   | 5                  | Strong domain comparison; analytical reading candidate F                |
| P7 Recovery       | 12 / 78                  | 6                  | Cause and recovery action are clear; no decorative filler needed        |
| P8 Sync           | 12 / 62                  | 4                  | Recent receipt and total holdings are correctly distinguished           |
| P9 Auth           | 12 / 76                  | 8                  | Focused action; helper inconsistency D and scroll verification question |
| P10 Settings      | 12 / 96                  | 4                  | Coherent categories and bounded forms; no additional justified change   |
| P11 Announcements | 10 / 30                  | 3                  | Useful date/title separation and reading width                          |
| P12 Arcades       | 12 / 54                  | 4                  | Purposeful mobile/desktop adaptation; preview contract candidate C      |
| P13 Exams         | 12 / 54                  | 3                  | Tracklist, cumulative conditions and desktop rail fit the domain        |
| P14 Bingo         | 12 / 46                  | 3                  | Board/mission relationship and repeated rows are functional             |
| P15 Privacy       | 11 / 21                  | 2                  | Appropriate summaries, hierarchy and TOC; long text not fully inspected |
| P16 Share Card    | 2 / 3                    | 1                  | Clear GRD hierarchy; preview-scale candidate E                          |

### Exact page screenshot targets

- P1: 613:496, 613:516, 622:1386, 622:1602, 2543:23377, 2543:23455, 2543:23481.
- P2: 1134:984, 1161:15947, 1134:1109, 1134:1377.
- P3: 1193:4, 1194:262, 1201:268, 1204:525, 1207:659, 1212:860, 1213:983.
- P4: 1291:4, 1323:191, 1348:372, 1344:360.
- P5: 1801:2978, 1602:4, 1693:1981, 1704:33715, 1721:2212.
- P6: 2268:13102, 2283:406, 2296:537, 2390:3715, 2391:4398.
- P7: 2584:3, 2584:40, 2584:71, 2584:102, 2584:112, 2585:442.
- P8: 2601:83490, 2601:83557, 2601:82961, 2601:83038.
- P9: 2684:30, 2684:47, 2684:66, 2684:83, 2685:29, 2685:160, 2685:248, 2689:462.
- P10: 2697:4, 2698:118, 2698:267, 2733:1358.
- P11: 2753:4, 2755:132, 2756:650.
- P12: 2767:18940, 2772:159, 2784:741, 2800:820.
- P13: 2824:18, 2825:49, 2852:1211.
- P14: 2897:19418, 2899:614, 2905:1056.
- P15: 2923:19, 2926:640.
- P16: 2986:5.

### Evidence still needed for the requested exhaustive visual review

Remaining evidence includes C6's unviewed families, C7/C8 library variants,
Foundation detail-scale checks, most intermediate/locale repeats, detailed
permission/edit/error suites, ranking tie and pagination fixtures, Profile
privacy/update/error states, and Sync timeout/token/server/invalidation states.
P9–P16 Dark, locale, intermediate and state variants were inventoried but mostly
not rendered in this review. Their existence is not a visual pass.

The two quota-limited reviewers stopped when errors arrived. The P1–P8 reviewer's
same-endpoint calls continued to succeed and were stopped after the inventory and
42 targets; it did not switch endpoints. No runtime tests were performed.

## Suggested review order

1. Review Profile chart reading (F), missing-art identity (A), and contextual
   rating criteria (B) as the strongest task-facing design candidates.
2. Align approved nickname guidance (D) and clarify the compact map specimen (C).
3. Compare representative real content and feed-size share output (E).
4. Resolve the explicitly unverified scroll and specimen-annotation observations.

This is a proposal order, not approval or a list of reopened guide blocks.
