# NosLog 2.0 Signature Color Research

## Document Control

- Status: `Research complete — restrained-use boundary and Spectrum S2 neutral
primitive source approved; signature contract, hue territory, and measured specimens
pending`
- Canonical language: English
- Korean companion:
  [33-foundation-signature-color-research.ko.md](./33-foundation-signature-color-research.ko.md)
- Started: 2026-08-08
- Scope: the relationship between one recognizable NosLog signature color, its
  Light/Dark product-use ramps, the retained N mark, interaction accent roles, and
  existing NOSTALGIA/NosLog domain colors
- Inputs: approved documents `22`, `24`, and `32`; current NosLog logo, browser, and
  color-token evidence; and the focused comparison below
- Excludes: an approved signature hue or its hexadecimal/OKLCH values, a recolored
  logo, final neutral semantic-role mapping beyond the approved Spectrum S2 primitive
  source, data-visualization colors, high-fidelity screens, and application
  implementation

This document narrows C5 without selecting a color by preference. Every candidate
territory and contract remains `Proposed` until the user approves it and then reviews
measured specimens.

The Spectrum S2 grayscale primitive source is now approved upstream in `FCM-12` and
is not reopened by this signature-color research. Its NosLog semantic-role mapping
and measured validation remain pending.

## Related Documents

- [Cross-cutting reference matrix](./22-cross-cutting-reference-matrix.md)
- [Foundation v0.1 research brief](./24-foundation-v0.1-research-brief.md)
- [Foundation color and material candidates](./32-foundation-color-material-candidates.md)
- [S1 discovery validation](./27-foundation-s1-discovery-structural-validation.md)
- [S2 music-detail validation](./28-foundation-s2-music-detail-structural-validation.md)
- [S3 rankings validation](./29-foundation-s3-global-rankings-structural-validation.md)
- [S4 chart-viewer validation](./30-foundation-s4-chart-viewer-structural-validation.md)
- [S5 Home validation](./31-foundation-s5-home-structural-validation.md)

## Governing Constraints

The signature-color decision cannot reopen these approved rules:

1. Dark remains the representative art-direction anchor, while System, Dark, and
   Light provide complete semantic parity.
2. Jacket art, music identity, scores, and NOSTALGIA content provide much of the
   product's expression; the signature color does not flood every surface.
3. A future signature/accent family is separated from keyboard focus, but it does not
   automatically own primary actions, links, selected states, filters, or containers.
   Neutral interaction is the default; each rare colored use requires separate
   evidence and approval.
4. Hand, difficulty, Basic/Recital, rank, achievement, score, feedback, external
   brand, and later data colors retain separate semantic ownership.
5. Color is never the sole cue for meaning or state.
6. The current monochrome N mark is retained. Whether and where a signature-colored
   field may sit behind or beside it is a later specimen decision; this research does
   not recolor or redraw the mark.
7. Adobe Spectrum S2 is the approved exact neutral primitive source. Signature work
   cannot replace it with another neutral system, tint it toward the signature hue,
   or import Adobe accent and component styling.

## Current NosLog Evidence

### Identity and interaction

- `public/logo.png` is a monochrome glowing white N/music-note mark inside a circle.
  It has recognizable form but no owned signature hue.
- Generated metadata art uses a near-black field and a white N mark.
- Dark-theme primary and focus treatments are near-white; Light-theme interaction and
  focus use `#3182f6`. The Light value is functional blue rather than an established
  NosLog identity.
- The approved C2-B contract already separates signature/action accent from keyboard
  focus, so accessibility does not have to depend on the brand hue.

### Existing hue occupancy

The current values are migration evidence, not approved 2.0 values. Their approximate
OKLCH hue positions nevertheless expose the collision problem.

| Existing ownership  | Current example       | Approximate hue | Collision implication                                                                   |
| ------------------- | --------------------- | --------------: | --------------------------------------------------------------------------------------- |
| Left hand           | `#62d4e8`             |          `211°` | Cyan/teal cannot be treated as a generic NosLog action color without strong separation. |
| Generic chart       | `#38bdf8`             |          `233°` | Bright sky blue is already analytical.                                                  |
| Basic               | `#7c9cc6`             |          `255°` | Muted blue is already a play-mode identity.                                             |
| Discord             | `#5865f2`             |          `274°` | Blurple is an external brand role and must remain recognizable where used.              |
| Real                | `#8f7fb8`             |          `297°` | Purple is already a difficulty role.                                                    |
| Recital             | `#c98fb0`             |          `344°` | Rose is already a play-mode role.                                                       |
| Right hand / danger | `#f06b68` / `#ef4444` |   `24°` / `25°` | Red/coral already carries domain and feedback meanings.                                 |
| Hard                | `#b08a5e`             |           `70°` | Warm brown/amber is already a difficulty role.                                          |
| Score               | `#facc15`             |           `92°` | Yellow/gold already carries score emphasis.                                             |
| Success / Normal    | `#22c55e` / `#6e9a7c` | `150°` / `154°` | Green already carries feedback and difficulty meanings.                                 |

There is therefore no genuinely unused hue sector. Selection cannot be based on
finding an empty place on a color wheel. A successful signature family needs:

- separate semantic ownership;
- a recognizable master color;
- controlled Light/Dark UI values in the same perceptual family;
- sufficiently different lightness, chroma, area, position, label, and context when a
  nearby domain color appears; and
- permission to refine current migration values later without changing their domain
  meaning.

## Focused Reference Matrix

The focused comparison covers sixteen independent external organizations or standards
communities plus current NosLog evidence. Additional credible references no longer
changed the principal alternatives: fixed master color, theme-aware product ramp,
content-led expression, and semantic collision control.

| Source                                                                                                                                                                                                                                                                | Transferable evidence                                                                                                                                | NosLog use                                                                                                     | Limitation                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [W3C Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), [Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), and [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | Color cannot be the only cue; normal text needs `4.5:1`, while required non-text boundaries and state indicators need `3:1` against adjacent colors. | Governs every signature/action pair and its non-color reinforcement.                                           | Does not choose a hue or identity.                                                                         |
| [Apple Color](https://developer.apple.com/design/human-interface-guidelines/color)                                                                                                                                                                                    | Adaptive semantic color should preserve hierarchy and legibility across appearances rather than mechanically invert one swatch.                      | Supports appearance-specific product values.                                                                   | Native platform styling is not NosLog art direction.                                                       |
| [Material 3 color system](https://m3.material.io/styles/color/system/overview)                                                                                                                                                                                        | One source color can generate role-based tonal palettes and foreground/container pairs.                                                              | Supports a master family mapped to product roles.                                                              | Dynamic user personalization and Material's component look are not adopted.                                |
| [Carbon Color](https://carbondesignsystem.com/elements/color/overview/)                                                                                                                                                                                               | Neutral gray dominates; blue is reserved for primary action; role names remain stable while theme values change.                                     | Supports sparse signature usage and invariant semantic tokens.                                                 | IBM blue and layer values are not NosLog candidates.                                                       |
| [Radix Colors use cases](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)                                                                                                                                                            | A hue scale contains separate background, interaction, border, solid, and text steps rather than one hex reused everywhere.                          | Directly supports the existing Radix stack and a bounded accent ramp.                                          | The twelve-step implementation is evidence, not a required token count.                                    |
| [Toss Brand Resources](https://brand.toss.im/)                                                                                                                                                                                                                        | Toss Blue `#0064FF` is a fixed representative color intended to be recognizable on white and black.                                                  | Demonstrates the identity value of one explicit master color.                                                  | NosLog cannot copy a common finance/technology blue or assume one hex solves all UI contrast.              |
| [NAVER Brand Resources](https://www.navercorp.com/en/company/brandGuide)                                                                                                                                                                                              | NAVER Green `#03C75A` is applied consistently across touchpoints, with supplied monochrome logo exceptions.                                          | Supports a named signature master and controlled logo variants.                                                | Green strongly collides with NosLog success and Normal roles.                                              |
| [Kakao Talk Calendar Design Guide](https://developers.kakao.com/docs/en/talkcalendar/design-guide)                                                                                                                                                                    | Kakao Yellow `#FAE100` works with specified black/white logo treatments and background rules.                                                        | Shows that signature color requires foreground and placement contracts, not a swatch alone.                    | Yellow strongly collides with NosLog score and warning territory.                                          |
| [Spotify Design and Branding](https://developer.spotify.com/documentation/design)                                                                                                                                                                                     | Spotify Green is a recognizable “resting color,” while artwork and a broader palette can remain expressive; logo color depends on the background.    | Strong evidence for content-led music identity plus one restrained signature family.                           | Spotify is playback-first and its green conflicts with NosLog success/Normal.                              |
| [SoundCloud Media Kit](https://soundcloud.com/company/media-kit)                                                                                                                                                                                                      | SoundCloud owns Orange `#FF5500` strongly, pairs it with black/white, and uses a purposeful secondary palette.                                       | Shows a music product can remain recognizable through one master plus controlled supporting colors.            | Orange/red conflicts with right-hand, danger, Hard, and score territory.                                   |
| [Discord Brand](https://discord.com/branding?lang=en), [Dark/Light rebrand note](https://support.discord.com/hc/en-us/articles/1500009438682-A-Fresh-New-Look-to-Celebrate-Our-6th-Birthday)                                                                          | Discord owns Blurple `#5865F2`, but explicitly adjusts in-app colors from marketing values to remain readable in Dark and Light.                     | Direct support for a stable brand master plus theme-tested product values.                                     | The current NosLog Discord role already uses this exact external brand color, so NosLog cannot imitate it. |
| [Twitch: Beyond Purple](https://blog.twitch.tv/en/2019/12/03/beyond-purple/)                                                                                                                                                                                          | Twitch begins gray and purple ramps from its brand purple, then changes lightness by theme hierarchy and tests AA combinations in Light and Dark.    | Strongest production precedent for one family with separate semantic product steps.                            | Twitch purple is already recognizable and sits near NosLog Real/Discord territory.                         |
| [osu! Brand Identity](https://osu.ppy.sh/wiki/en/Brand_identity_guidelines)                                                                                                                                                                                           | The full-color pink cookie is fixed, while the single-color mark can adapt to varied compositions with required contrast.                            | Rhythm-game evidence for separating a canonical full-color identity from a versatile monochrome mark.          | osu! pink and circular identity must not be imitated; pink also approaches Recital.                        |
| [NOSTALGIA official product description](https://www.konami.com/amusement/corporate/ja/topics/20210201/)                                                                                                                                                              | NOSTALGIA is explicitly piano-motif, performance-oriented, and fairy-tale themed, with classical and BEMANI content.                                 | Supplies domain tone and warns against a generic esports-only palette.                                         | Official game marketing is not NosLog's service identity or UI color authority.                            |
| [beatmania IIDX 33](https://www.konami.com/arcadegames/products/am_bmiidx33/)                                                                                                                                                                                         | Edition art direction is highly expressive and changes with each release concept.                                                                    | Supports keeping game/version art as content expression rather than treating it as a stable service signature. | It does not provide a reusable archive-product palette.                                                    |
| [maimai official](https://maimai.sega.jp/)                                                                                                                                                                                                                            | Current rhythm-game presentation uses dense, version-specific character and event color.                                                             | Confirms the need for a quiet service shell when varied game content must coexist.                             | Surface styling and character art are not transferable to NosLog.                                          |
| Current NosLog code, browser, and approved documents                                                                                                                                                                                                                  | The N mark is recognizable but achromatic; all major hue sectors already have domain, status, score, or external-brand ownership.                    | Supplies the real collision map and approved content-led direction.                                            | Existing values are migration evidence, not 2.0 palette authority.                                         |

## Research Convergence

1. Recognizable products usually define one canonical master color or colorway rather
   than letting every screen choose an unrelated accent.
2. A canonical brand master does not require one literal hex in every UI role. Mature
   products map the family to theme- and state-specific values for readability.
3. Logo rules and UI color rules are related but not identical. A monochrome mark can
   remain stable while a signature-colored field or adjacent accent supplies identity.
4. Music and creator products keep room for artwork. For NosLog, the signature color
   begins at stable identity touchpoints. It is not a universal card background,
   generic link color, filter-state tint, selected-container fill, or automatic
   difficulty treatment. A rare primary-action use remains an exception to prove.
5. Exact hue alone cannot prevent collision. Semantic ownership, relative lightness
   and chroma, area, placement, labels, shapes, and context all participate.
6. NosLog must test Dark and Light together. Choosing a swatch that looks attractive
   only on the Dark canvas would contradict the approved appearance model.

## Signature Contract Candidates

### `SC-A` — One literal hex everywhere

- One approved value appears in logo fields, buttons, links, selected states, and
  both appearances.
- Advantage: simplest literal consistency.
- Risk: one value is unlikely to provide equally good contrast, state separation, and
  perceived weight on Dark and Light. It also couples brand identity to component
  accessibility.

### `SC-B` — One master color plus controlled product ramps

- One canonical `brand-master` represents NosLog in identity and distribution
  artifacts.
- A bounded same-family ramp may supply only the identity and rare action treatments
  that are separately approved. Defining a ramp does not authorize spreading it to
  every hover, selected, border, link, or text role.
- Light and Dark may map those roles to different lightness and chroma. Any hue shift
  must be minimal, measured, and documented rather than improvised per component.
- The monochrome N mark remains available. Signature-colored logo fields or adjacent
  treatments are tested separately before approval.
- Advantage: strongest balance of recognition, accessibility, and theme parity.
- Risk: requires governance so product values do not drift into unrelated colors.

### `SC-C` — Multicolor or gradient signature

- A gradient or changing spectrum becomes the main identity.
- Advantage: energetic and expressive.
- Risk: weakens one-color recall, increases collisions with jacket and domain colors,
  complicates contrast, and can make a content-led interface visually noisy.

**Proposed recommendation:** retain `SC-B` only as the candidate technical model for
a future master color and its measured appearance variants, reject `SC-A` as a
universal UI rule, and keep `SC-C` out of Foundation v0.1. The approved restrained-use
boundary applies to every option. A later campaign or illustration may use a
controlled gradient only if it does not become the semantic interaction color.

## Hue Territory Shortlist

These are directional families for measured comparison, not approved colors. Exact
anchors will be generated only after the user approves the shortlist.

| Territory                          | Why it deserves a specimen                                                                                                                                                                        | Main risks to measure                                                                                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `H1` Ultramarine / blue-violet     | Reads clearly on a dark anchor, supports analytical and musical contexts, and can bridge calm archive utility with controlled rhythm-game energy.                                                 | Can look generic for technology products and approach Basic, Real, Twitch, or Discord. It must stay perceptually separate from external Discord branding and current mode/difficulty roles. |
| `H2` Warm amber / piano gold       | Connects to stage light, acoustic instrument warmth, and classical-performance context without copying NOSTALGIA art literally. It can create a distinctive warm contrast against the dark shell. | Directly approaches score, warning, Hard, and Kakao-like territory. Large filled surfaces may feel promotional or premium rather than task-focused.                                         |
| `H3` Rose-magenta / musical accent | Carries expressive rhythm and performance energy and can stand out against both dark and light neutrals.                                                                                          | Approaches Recital, Real, right-hand/danger, osu!, and Twitch territory; saturation can overpower jacket art and dense analysis.                                                            |
| `H0` Achromatic control            | Keeps the current white/black identity as a comparison baseline.                                                                                                                                  | Does not answer the user's goal of a memorable signature color and may leave NosLog visually generic.                                                                                       |

### Territories not advanced initially

- Green/lime is not advanced because success and Normal already own the family and
  NAVER/Spotify make it especially familiar as someone else's signature.
- Cyan/teal is not advanced because left-hand and chart roles already need high
  salience in the viewer and analysis surfaces.
- Red/orange is not advanced because right-hand, danger, Hard/score-adjacent meanings,
  YouTube-like video associations, and SoundCloud ownership create excessive cost.

Not advancing a territory does not prove that every value in it is unusable. It means
the first specimen round should spend time on candidates with a more plausible
identity-to-collision balance.

## Required Specimen Matrix After Shortlist Approval

The first color specimen must compare the exact same structure and content across all
candidate territories. It is a guide artifact, not a final page design.

1. Retained white N mark on neutral, candidate field, and representative jacket edge;
2. Dark and Light `canvas`, `surface`, `sunken`, `raised`, and `overlay` contexts;
3. a neutral interaction baseline, one separately justified rare primary-action
   candidate, hover, pressed, disabled, and independent focus-visible treatment;
4. Home search and destination region without recoloring all destination cards;
5. Music list/grid beside bright, dark, warm, cool, and highly saturated jackets;
6. Music Detail identity beside Normal/Hard/Expert/Real and Basic/Recital colors;
7. Ranking/record analysis beside score bands, achievement, feedback, and chart color;
8. Chart viewer beside left/right hand notes without weakening their domain priority;
9. Discord link next to the signature accent so the external brand remains distinct;
10. Korean, Japanese, and English text at normal and `200%` text size;
11. `320`, `390`, intermediate, and wide content regions;
12. measured text, non-text, state-to-state, and adjacent-color contrast report plus
    representative color-vision-deficiency simulation.

## Next Review Questions

The next visual work requires two explicit approvals:

1. After separately approving and validating the Spectrum S2 → NosLog semantic-role
   mapping, should NosLog use `SC-B`: one canonical signature master plus a tightly
   bounded set of Light/Dark identity and rare-action values, while keeping ordinary
   interaction and keyboard focus neutral or independently governed?
2. Should the first equal-condition specimen compare `H1` ultramarine/blue-violet,
   `H2` warm amber/piano gold, `H3` rose-magenta, and the `H0` achromatic baseline?

Approval of these questions authorizes comparison specimens only. It does not approve
a hue, value, logo recoloring, gradient, or component styling.

## Decision Log

| ID       | Entry                                                                                                                                                                                                        | Status                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| `SIG-01` | Retain the current N mark form and treat its monochrome use as a valid identity asset.                                                                                                                       | `Approved upstream`                                    |
| `SIG-02` | Treat the current `#3182f6` Light interaction blue and all current domain values as migration evidence, not an approved signature.                                                                           | `Observed`                                             |
| `SIG-03` | Use one canonical master plus controlled Light/Dark product ramps through `SC-B`.                                                                                                                            | `Proposed`                                             |
| `SIG-04` | Keep signature color identity-first and prevent automatic use on ordinary links, filters, selection, containers, difficulty text, focus, feedback, hand, mode, rank, score, external brand, or data meaning. | `Approved usage boundary / value pending — 2026-08-08` |
| `SIG-05` | Compare H1, H2, H3, and H0 under one measured specimen matrix before selecting a hue.                                                                                                                        | `Proposed`                                             |
| `SIG-06` | Do not advance green/lime, cyan/teal, or red/orange in the first specimen round because of current semantic and external-brand collision cost.                                                               | `Proposed`                                             |
| `SIG-07` | The over-accented interactive comparison that colored links, filter state, selected containers, difficulty text, and several competing elements is rejected and has no design authority.                     | `Rejected — 2026-08-08`                                |
| `SIG-08` | Use the exact published Adobe Spectrum S2 grayscale as the neutral primitive source; signature work cannot recolor or replace it, while semantic-role mapping remains pending in C5.                         | `Approved upstream — 2026-08-08`                       |

## Rejected Specimen Record — 2026-08-08

The interactive signature-color comparison created during this phase spread each
candidate across too many repeated interface elements. It contradicted the approved
quiet, content-led direction and demonstrated the failure mode rather than a valid
NosLog proposal. It must not be handed to Claude Design or used as an implementation
reference. A replacement comparison may be made only after the Spectrum neutral
semantic-role mapping is set, and it must limit color to identity plus at most one
explicitly justified rare action case.
