# NosLog 2.0 C5 Information-Service Color Audit and Non-Blue Expansion

## Document Control

- Status: `Research and specimen validation preserved — SS-08 selected as the NosLog
identity source after document 47; expanded evidence retained`
- Canonical language: English
- Korean companion:
  [46-foundation-c5-information-service-color-expansion.ko.md](./46-foundation-c5-information-service-color-expansion.ko.md)
- Date: 2026-08-10
- Scope: preserve the ten exact-system candidates in document `45`, audit how
  information-delivery services assign color by role, and add ten non-blue or
  role-split references without inventing missing Dark values
- Inputs: documents `32`–`45`, official guidance listed below, and current
  production-page browser observations recorded on 2026-08-10
- Excludes: a recolored logo, final identity/action component aliases, and production
  implementation

This document does not discard or replace the ten candidates in document `45`.
It explains why that set converged on blue, then widens the evidence so the user
can compare blue's operational safety against non-blue identity strategies.

## Questions Kept Separate

The comparison previously collapsed three different questions into one. They
must remain separate:

1. **Reading field:** which colors occupy most of an information page?
2. **Interaction:** which colors communicate links, progression, and primary
   action?
3. **Identity:** which colors make the service recognizable?

A source is not a complete NosLog signature candidate merely because it has a
memorable logo color. Conversely, a common interaction blue is not automatically
the best identity color.

## Fixed NosLog Contract

1. Adobe Spectrum S2 remains the exclusive neutral primitive source for every
   approved Dark/Light surface, foreground, and boundary role.
2. Fluent remains the approved focus-visible source. No reference below recolors
   focus.
3. A signature color may appear at stable, small identity touchpoints and, only
   when an intact source mapping supports it, one rare primary action.
4. Ordinary links, filters, selected rows, difficulty, mode, hand, score, status,
   external-brand, and visualization roles do not inherit the signature color.
5. A missing Dark value, foreground, hover, or pressed state remains missing. It
   is never inferred from another scale or source.
6. `FCM-11`, `SIG-07`, and the rejected over-accented examples remain excluded.

## Method

The audit uses eighteen independent organizations or production services. The
set covers public services, reference and standards sites, news and data
publishing, developer knowledge, and maintained product systems. Official design
guidance is preferred. When no current public token authority was available,
the row is explicitly marked as a production observation and is ineligible for
direct token adoption.

For the Financial Times, Reuters, The Guardian, and Our World in Data, the local
browser inspected current computed styles on 2026-08-10. This was a visual and
role observation only; it did not inspect private state. Exact observed values
from those pages are not treated as published reusable token contracts.

## Information-Delivery Reference Matrix

| ID      | Source and class                                                                                                                                                                         | Large-area reading field                                 | Identity model                                                      | Standard interaction or action                                                              | Transferable finding                                                                                | Adoption limit                                                                                  |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `IS-01` | [Wikimedia Codex](https://doc.wikimedia.org/codex/latest/style-guide/colors.html) — encyclopedia/reference                                                                               | Gray and white foundations                               | Predominantly neutral                                               | Progressive blue `#3366CC`, with separate status colors                                     | Neutral content plus blue progression is a mature reference-product baseline                        | Codex tokens cannot replace approved Spectrum neutrals                                          |
| `IS-02` | [W3C Design System](https://design-system.w3.org/settings/) — standards/documentation                                                                                                    | Off-white/white with `#111111` text                      | W3C blue `#005A9C`                                                  | Link blue `#005A9C`; yellow focus; semantic status colors                                   | Blue carries both institutional recognition and link predictability                                 | Light-only public mapping; focus is already owned by Fluent                                     |
| `IS-03` | [GOV.UK colour](https://design-system.service.gov.uk/styles/colour/) and [Button](https://design-system.service.gov.uk/components/button/) — public service                              | White and near-neutral surfaces                          | Brand blue `#1D70B8`                                                | Link blue `#1A65A6`; default task button green `#0F7A52`                                    | Brand, navigation, and transaction action may use different colors without losing trust             | No published site-wide Dark mapping; green is not identity evidence                             |
| `IS-04` | [NHS colour](https://service-manual.nhs.uk/design-system/styles/colour) and [Buttons](https://service-manual.nhs.uk/design-system/components/buttons) — health information/service       | Tinted neutral `#F0F4F5` with dark text                  | NHS blue `#005EB8`                                                  | Link blue `#005EB8`; primary action green `#007F3B`                                         | A highly trusted information service separates blue ownership from green completion/action          | Light-only mapping; green also owns success and collides with NosLog success/Normal             |
| `IS-05` | [USWDS theme color tokens](https://designsystem.digital.gov/design-tokens/color/theme-tokens/) — government service system                                                               | Neutral base is usually predominant                      | Project-specific within a governed role model                       | Default primary blue `#005EA2`, secondary red `#D83933`                                     | The neutral base can dominate even when several named color families exist                          | USWDS is customizable and does not publish one NosLog-ready Dark identity set                   |
| `IS-06` | [Canada.ca colours](https://design.canada.ca/styles/colours.html) — government information                                                                                               | Majority white `#FFFFFF`, dark-gray text `#333333`       | Government signature remains separate from page styling             | Links `#284162`; main accent `#26374A`; red reserved for error                              | National red does not need to flood the information UI; stable dark blue supports findability       | Guidance is Light-only and not a signature action mapping                                       |
| `IS-07` | [UK Parliament colour](https://designsystem.parliament.uk/foundations/colour/) — civic information                                                                                       | Near-neutral `#EBE9E8`, white containers, gray body text | Deep purple `#373151`; House-specific green/red                     | Standard interaction blue `#3569CC`                                                         | Strong non-blue identity can coexist with conventional blue interaction                             | No complete Dark system; House colors are domain ownership, not general signature candidates    |
| `IS-08` | [BBC GEL](https://bbc.github.io/gel/) and [Buttons and CTAs](https://bbc.github.io/gel/components/buttons-and-ctas/) — news/public media                                                 | Content-led neutral fields with service-local treatments | Global BBC mark and shell are highly achromatic                     | GEL requires each service's established link color rather than one universal BBC action hue | An information network can keep global identity achromatic and let local services own limited color | GEL is principles/component evidence, not one exact cross-service palette                       |
| `IS-09` | [Stack Overflow brand color](https://stackoverflow.design/brand/color) and [logo](https://stackoverflow.design/brand/logo) — Q&A/knowledge                                               | Product UI is neutral and theme-aware                    | Stack Orange `#FF5E00`; preferred logo is Off-Black or Off-White    | Product theme tokens adapt separately from brand colors                                     | Orange can be memorable without becoming every link or control                                      | Brand guidance is not a complete Light/Dark action recipe                                       |
| `IS-10` | [Mozilla Protocol brand themes](https://protocol.mozilla.org/docs/fundamentals/brand-themes) and [color](https://protocol.mozilla.org/docs/fundamentals/color) — documentation/editorial | Mozilla theme is mostly black and white                  | `#161616` / `#FAFAFA` achromatic identity                           | Broad named colors are optional supporting material                                         | Distinctive typography and composition can carry identity with almost no chromatic dependence       | Color page is marked Draft; optional swatches are not one signature mapping                     |
| `IS-11` | [Ubuntu Vanilla color](https://vanillaframework.io/docs/settings/color-settings) and [Buttons](https://vanillaframework.io/docs/patterns/buttons) — product documentation                | Explicitly neutral palette                               | Ubuntu orange `#E95420`                                             | Link blue `#0066CC`; positive action is separate; brand buttons are deprecated              | Orange identity remains viable precisely because routine interaction does not need to be orange     | No complete current orange action mapping; deprecated brand button must not be revived          |
| `IS-12` | [GitLab Pajamas color](https://design.gitlab.com/product-foundations/color/) and [design tokens](https://design.gitlab.com/product-foundations/design-tokens/) — developer platform/docs | Neutral UI in Light and Dark                             | Purple is explicitly associated with GitLab; brand also owns orange | Orange communicates warning in product semantics                                            | Product semantics protect brand purple while preventing orange from becoming a generic accent       | Multi-color brand system and static brand colors are not one NosLog dual-theme set              |
| `IS-13` | [Our World in Data](https://ourworldindata.org/) and [official Grapher repository](https://github.com/owid/owid-grapher) — data publishing                                               | Observed white field and dark blue text `#1D3D63`        | Restrained wordmark/editorial identity                              | Brighter blue `#1059E5` appears in interaction; data colors remain separate                 | Even a data-rich publisher keeps the shell blue-neutral so chart color can carry meaning            | Production observation only; no reusable signature token contract was identified                |
| `IS-14` | [Reuters Agency](https://reutersagency.com/about/) — news/archive                                                                                                                        | Observed white, black, and dark-gray editorial field     | Restrained orange `#AB3300` appears with black/white                | Orange marks selected links and CTAs without recoloring all article content                 | Orange can work as a sparse editorial identity cue                                                  | Production observation only; exact Light/Dark token authority was not public                    |
| `IS-15` | [Financial Times](https://www.ft.com/) — financial news                                                                                                                                  | Observed warm paper field `#FFF1E5` and text `#33302E`   | The page field itself is a recognizable identity device             | Observed teal interaction `#0D7680`                                                         | Identity can come from a controlled field color while action uses a separate hue                    | Spectrum S2 already owns NosLog surfaces; this is reference-only, not a surface candidate       |
| `IS-16` | [The Guardian](https://www.theguardian.com/international) — news                                                                                                                         | Observed white field and dark text `#121212`             | Dark navy `#052962`, yellow `#FFE500`, and section-specific colors  | Multiple editorial section colors coexist under a stable shell                              | A news hierarchy can use several bounded category colors without making the reading field colorful  | This multi-accent model conflicts with the lean C5 signature gate and is not directly adoptable |
| `IS-17` | [GitHub Primer color primitives](https://primer.style/product/primitives/color/) — developer knowledge/product                                                                           | Neutral Light/Dark shells                                | GitHub identity remains largely achromatic                          | Accent/progressive blue carries interaction                                                 | Familiar blue remains predictable in a dense technical information product                          | Exact generic filled-action states remain incomplete in document `45`                           |
| `IS-18` | [IBM Carbon color tokens](https://carbondesignsystem.com/elements/color/tokens/) — enterprise/data UI                                                                                    | Neutral themes organize dense content                    | IBM identity is separate from most component surfaces               | Primary action blue `#0F62FE`                                                               | One clear blue interaction family scales through dense analytical UI                                | Strong IBM association and high salience remain NosLog risks                                    |

## Measured Convergence

The following counts describe this audit only; they are not universal web
statistics.

1. **Neutral area dominates.** Seventeen of eighteen sources keep the main
   reading field neutral or near-neutral. Financial Times is the clear outlier,
   using a warm paper field as identity.
2. **Blue is the safest interaction convention.** Ten sources explicitly publish
   or currently use blue as a standard link, progressive, or primary-interaction
   family: Wikimedia, W3C, GOV.UK, NHS, USWDS, Canada.ca, UK Parliament, Our
   World in Data, GitHub Primer, and IBM Carbon.
3. **Non-blue identity is common but bounded.** UK Parliament, Ubuntu, Stack
   Overflow, GitLab, Reuters, Financial Times, and The Guardian all demonstrate
   a recognizable non-blue identity device while keeping most reading content
   neutral.
4. **Green in public-service examples means task/action, not general identity.**
   GOV.UK and NHS both use green primary buttons while retaining blue brand and
   link ownership.
5. **A memorable color does not need to own every role.** The strongest non-blue
   references separate identity from links, feedback, data, and ordinary UI.

This supports the user's intuition: blue is the least surprising operational
choice for an information product. It does not prove that blue must be NosLog's
identity color. A restrained non-blue identity can remain just as stable if the
routine interface stays neutral and its missing theme behavior is not invented.

## Ten Added Non-Blue or Role-Split References

These references are added to the visual comparison beside, not in place of,
the ten exact systems from document `45`.

| ID      | Source role shown                        | Exact published or observed values                                                      | What the comparison may establish                                                       | Gate status                                                     |
| ------- | ---------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `NB-01` | Material 3 baseline purple primary       | Light `primary #6750A4 / onPrimary #FFFFFF`; Dark `primary #D0BCFF / onPrimary #381E72` | A real non-blue, theme-aware default pair exists                                        | `Exact dual default role; hover/pressed action gate incomplete` |
| `NB-02` | UK Parliament identity/interaction split | Brand `#373151`; standard interaction `#3569CC`                                         | Purple can own identity while blue owns predictable interaction                         | `Identity reference only; no complete Dark mapping`             |
| `NB-03` | GitLab brand family                      | Purple `#7759C2`; orange `#FC6D26`; product brand-status background `#E1D8F9`           | Brand color can be semantically fenced from warning and routine UI                      | `Reference only; not one single-color dual set`                 |
| `NB-04` | Ubuntu identity/interaction split        | Brand orange `#E95420`; link blue `#0066CC`                                             | Orange identity does not require orange links or buttons                                | `Identity reference only; orange brand button deprecated`       |
| `NB-05` | Stack Overflow identity                  | Stack Orange `#FF5E00`; preferred mark colors Off-Black `#201C1D` / Off-White `#F0EFEE` | A vivid orange can remain sparse while the mark stays achromatic                        | `Identity reference only`                                       |
| `NB-06` | Reuters production identity              | Observed orange `#AB3300` with white/black editorial field                              | A warm identity cue can survive next to dense news content when area is constrained     | `Production observation only`                                   |
| `NB-07` | GOV.UK task action                       | Brand `#1D70B8`; link `#1A65A6`; button `#0F7A52`                                       | Green may clearly identify a rare transaction while blue carries information navigation | `Action-role reference only; no Dark set`                       |
| `NB-08` | NHS task action                          | Brand/link `#005EB8`; button `#007F3B`                                                  | A second trusted service repeats the blue-information/green-action split                | `Action-role reference only; no Dark set`                       |
| `NB-09` | Financial Times editorial field          | Page `#FFF1E5`; text `#33302E`; interaction `#0D7680`                                   | A field color can be identity rather than an action accent                              | `Reference only; Spectrum neutral surfaces stay fixed`          |
| `NB-10` | Mozilla achromatic identity              | Mozilla Black `#161616`; Mozilla White `#FAFAFA`                                        | Typography, mark, and composition can carry identity without a chromatic master         | `Achromatic control; color page is Draft`                       |

Material 3 is the only added source that publishes an exact Light/Dark primary
and on-primary pair in the audited evidence. It still does not enter the rare
action gate because this comparison has not yet resolved its intact hover and
pressed state-layer behavior for the web. The other nine references answer role
and art-direction questions only. Their missing Dark or state values are shown as
missing in the specimen.

## NosLog Tradeoffs by Family

### Blue

- Strongest evidence for predictable information navigation and professional
  action.
- Lowest learning cost, but highest risk of looking generic or indistinguishable
  from enterprise templates.
- Existing document `45` provides ten exact systems for source-level comparison.

### Purple

- Supported by Material 3's exact dual default pair, UK Parliament's restrained
  civic identity, and GitLab's brand ownership.
- Risks collision with Discord, Twitch, Real, and other existing NosLog purple
  domain or external-brand roles.

### Orange

- Supported as restrained identity by Ubuntu, Stack Overflow, GitLab, and Reuters.
- Stronger distinctiveness than blue, but collides with Hard, warning, score, and
  right-hand territory. None of the added orange sources supplies a complete
  NosLog-ready Light/Dark action recipe.

### Green

- Strong public-service evidence for a rare primary transaction.
- Weak identity fit for NosLog because success and Normal already own the family.
  The audited examples are Light-only and retain blue for information navigation.

### Warm pink paper / teal interaction

- Financial Times proves a highly recognizable editorial field can be stable.
- NosLog cannot copy that surface model because Spectrum S2 neutrals are already
  approved and Recital/pink plus chart/teal ownership would collide.

### Achromatic

- Mozilla and Polaris show the lowest semantic collision and the strongest
  dependence on mark, typography, rhythm, and composition.
- This remains a valid control but does not answer a desire for a chromatic
  signature by itself.

## Browser Validation

The expanded specimen was verified in the in-app test browser on 2026-08-10.
This validation confirms presentation and regression behavior only; it does not
approve a source, color family, or semantic assignment.

| Target            | Result                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `1440 × 1000`     | Ten preserved exact-system cards and ten added role-reference cards render in two columns with no horizontal overflow.                                  |
| `320 × 900`       | Both card groups reflow to one `289px` content column with no horizontal overflow; all images load.                                                     |
| Existing controls | `Blue 7개` filters the exact-system set to seven while leaving all ten role references intact; compare pin/unpin still updates the live selection tray. |
| Target size       | All filter and compare controls retain a minimum `44px` height at both tested widths.                                                                   |
| Runtime           | The specimen reports ten exact candidates, ten references, twenty displayed sources, and no console warnings or errors.                                 |

## Research Paths Considered and Outcome

This research did not itself approve a color family. It presented these paths:

1. advance one or more exact blue systems from document `45` to real NosLog
   content testing;
2. advance a non-blue **identity direction** from `NB-01`–`NB-06` for additional
   intact Dark/state-source research before any action color is proposed;
3. retain an achromatic control from Polaris/Mozilla; or
4. compare one blue system, one non-blue identity direction, and the achromatic
   control in the same measured NosLog context.

`NB-07` and `NB-08` are action-role evidence, not identity candidates. `NB-09`
is editorial surface evidence and cannot replace the approved Spectrum neutral
system.

On 2026-08-10 the user advanced `SS-08` Radix Colors Indigo and `SS-09`
Shopify Polaris to the identical actual-content comparison in
[document `47`](./47-foundation-c5-finalist-noslog-context-comparison.md). This
progresses the comparison gate without selecting either source or discarding
the expanded evidence above.

After the document `47` comparison, the user selected intact `SS-08` Radix Colors
Indigo as the NosLog identity source on 2026-08-10. The non-blue, role-split, and
achromatic evidence remains preserved; it is not the active identity direction.

## Decision Log

| ID       | Item                                                                                                    | Status                                                           |
| -------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `ISC-01` | Preserve all ten exact-system candidates and their prior validation.                                    | `Required`                                                       |
| `ISC-02` | Separate reading field, standard interaction, and identity before comparing colors.                     | `Research rule`                                                  |
| `ISC-03` | Record the eighteen-source information-service audit and its measured sample counts.                    | `Research complete`                                              |
| `ISC-04` | Add ten non-blue or role-split references without completing missing Dark/state values.                 | `Research and specimen validation complete; pending user review` |
| `ISC-05` | Treat blue as the safest observed interaction convention, not an automatically approved identity color. | `Observed`                                                       |
| `ISC-06` | Select which blue, non-blue identity, and/or achromatic directions advance to measured NosLog content.  | `SS-08 and SS-09 measured in document 47; SS-08 selected`        |
| `ISC-07` | Preserve the expanded evidence while adopting intact SS-08 Radix Colors Indigo as the identity source.  | `Approved — 2026-08-10`                                          |

## Sources

- [Android Developers: Dynamic Color token example](https://developer.android.com/develop/ui/views/theming/dynamic-colors)
- [BBC GEL](https://bbc.github.io/gel/)
- [Canada.ca colours](https://design.canada.ca/styles/colours.html)
- [Financial Times](https://www.ft.com/)
- [GitLab Pajamas color](https://design.gitlab.com/product-foundations/color/)
- [GOV.UK colour](https://design-system.service.gov.uk/styles/colour/)
- [IBM Carbon color tokens](https://carbondesignsystem.com/elements/color/tokens/)
- [Mozilla Protocol brand themes](https://protocol.mozilla.org/docs/fundamentals/brand-themes)
- [NHS colour](https://service-manual.nhs.uk/design-system/styles/colour)
- [Our World in Data](https://ourworldindata.org/)
- [Reuters Agency](https://reutersagency.com/about/)
- [Stack Overflow brand color](https://stackoverflow.design/brand/color)
- [The Guardian](https://www.theguardian.com/international)
- [UK Parliament colour](https://designsystem.parliament.uk/foundations/colour/)
- [Ubuntu Vanilla color](https://vanillaframework.io/docs/settings/color-settings)
- [USWDS theme color tokens](https://designsystem.digital.gov/design-tokens/color/theme-tokens/)
- [W3C Design System settings](https://design-system.w3.org/settings/)
- [Wikimedia Codex colors](https://doc.wikimedia.org/codex/latest/style-guide/colors.html)
