# NosLog 2.0 C5 Feedback/Status Source Visual Comparison

## Document control

- Status: `Approved — FS-BN adopted for 13A on 2026-08-10`
- Canonical language: English
- Korean companion:
  [54-foundation-c5-feedback-status-source-visual-comparison.ko.md](./54-foundation-c5-feedback-status-source-visual-comparison.ko.md)
- Date: 2026-08-10
- Interactive artifact:
  [C5 feedback/status source comparison](./specimens/c5-feedback-status-source-comparison.html)
- Scope: Package `13A` comparison and approval of `FS-BN` in equivalent NosLog
  feedback/status content
- Inputs: document `53`; approved Spectrum surface, foreground, boundary, focus, and
  material mappings; exact official token packages listed below
- Excludes: `13B` domain color, `13C` data color, final iconography, broader component
  promotion, and production implementation

This artifact compares complete semantic recipes in context and records the user's
approval of `FS-BN`. It does not treat a palette strip, a remembered brand color, or
an isolated attractive swatch as design evidence.

## Version-pinned token evidence

| Candidate                | Official artifact                                                 | Roles extracted                                                                                  |
| ------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `FS-A` Adobe Spectrum S2 | `@adobe/spectrum-tokens@14.15.0`                                  | informative, positive, notice, and negative visual plus subtle background aliases for Light/Dark |
| `FS-B` Atlassian         | `@atlaskit/tokens@16.3.0`                                         | information, success, warning, and danger text, icon, and background aliases for Light/Dark      |
| `FS-C` IBM Carbon        | `@carbon/themes@11.78.0` plus current Notification style guidance | support info/success/warning/error and notification background roles for White and `g100`        |

Package archives were inspected in temporary directories only and were not added to
NosLog dependencies.

## Controlled comparison rules

1. All candidates use identical Korean, Japanese, and English NosLog content.
2. All candidates sit on the already approved Spectrum `canvas`, `surface`,
   foreground, and boundary values.
3. Each candidate keeps the exact published status values for the roles it owns.
4. Spectrum and Carbon keep message title and body copy on the approved neutral
   foreground. Atlassian keeps its published semantic status-title color while body
   copy remains the approved neutral foreground.
5. No candidate receives an invented tint, shifted hue, replacement step, gradient,
   glow, or Tailwind value.
6. Every message has an explicit title, body, symbol placeholder, and structural
   marker. The symbol is a non-color-cue test device, not approved iconography.
7. The specimen can remove chromatic cues to verify that text and shape still carry
   the complete meaning.

## Candidate recipes

### `FS-A` — Adobe Spectrum S2

- Light and Dark both use a role-specific semantic background and semantic visual.
- Message title and body remain neutral to avoid turning the entire message into
  colored text.
- Visual/background contrast is consistent across the four roles.

### `FS-B` — Atlassian

- Light and Dark use separate semantic text, icon, and background values.
- The title is visibly chromatic, making status scanning strongest but increasing the
  amount of color in dense content.
- Body copy remains neutral in the compatibility specimen.

### `FS-C` — IBM Carbon

- Light uses four role-specific notification backgrounds.
- Dark `g100` uses the same neutral `#262626` background for all four roles and keeps
  meaning in the support marker/icon plus explicit copy.
- This is the most chromatically restrained Dark recipe in the comparison.
- Carbon's neutral title/body token is mapped to the already approved NosLog neutral
  owner; Carbon still owns its exact notification background and support values.

### `FS-BN` — Atlassian semantic color + neutral message typography

- Status message backgrounds, markers, borders, compact-state markers, invalid-input
  borders, destructive accents, and field-error text retain the exact Atlassian
  Light/Dark semantic values from `FS-B`.
- Message-container titles and body copy use the already approved Spectrum neutral
  foreground for the active appearance.
- IBM Carbon contributes the observed restraint principle only. No Carbon color value
  is imported into `FS-BN`, so this is an approved component-role mapping over one
  chromatic source rather than a new mixed palette.
- Status title, symbol, structural marker, and copy continue to carry redundant
  meaning. The user approved this rendered mapping on 2026-08-10.

## Approved `FS-BN` mapping

| Role        | Light background / marker | Dark background / marker |
| ----------- | ------------------------- | ------------------------ |
| Information | `#E9F2FE / #357DE8`       | `#1C2B42 / #4688EC`      |
| Success     | `#EFFFD6 / #6A9A23`       | `#28311B / #82B536`      |
| Warning     | `#FFF5DB / #E06C00`       | `#3A2C1F / #FBC828`      |
| Danger      | `#FFECEB / #C9372C`       | `#42221F / #F15B50`      |

| Component role                   | Light                           | Dark                            |
| -------------------------------- | ------------------------------- | ------------------------------- |
| Message title and body           | Spectrum neutral `#292929`      | Spectrum neutral `#DBDBDB`      |
| Field-error and destructive text | Atlassian danger text `#AE2E24` | Atlassian danger text `#FD9891` |
| Invalid/destructive boundary     | Danger marker `#C9372C`         | Danger marker `#F15B50`         |
| Compact status symbol            | Matching role marker            | Matching role marker            |

Do not substitute Atlassian semantic text for message-container typography, import
Carbon notification values, or derive additional steps. The exact boundary above is
part of the approval.

## Exact Carbon extraction

| Role        | White marker              | White background                          | `g100` marker             | `g100` background                         |
| ----------- | ------------------------- | ----------------------------------------- | ------------------------- | ----------------------------------------- |
| Information | `support-info #0043CE`    | `notification-background-info #EDF5FF`    | `support-info #4589FF`    | `notification-background-info #262626`    |
| Success     | `support-success #24A148` | `notification-background-success #DEFBE6` | `support-success #42BE65` | `notification-background-success #262626` |
| Warning     | `support-warning #F1C21B` | `notification-background-warning #FCF4D6` | `support-warning #F1C21B` | `notification-background-warning #262626` |
| Error       | `support-error #DA1E28`   | `notification-background-error #FFF1F1`   | `support-error #FA4D56`   | `notification-background-error #262626`   |

## Measured contrast

Ratios use the exact sRGB values rendered in the specimen. `Title` is measured
against the candidate notification background. `Marker` measures the semantic
visual against that background.

| Candidate   | Appearance | Information title / marker | Success title / marker | Warning title / marker | Danger title / marker |
| ----------- | ---------- | -------------------------: | ---------------------: | ---------------------: | --------------------: |
| Spectrum S2 | Light      |             `12.63 / 3.45` |         `12.66 / 3.44` |         `12.57 / 3.43` |        `12.68 / 3.46` |
| Spectrum S2 | Dark       |             `10.18 / 4.01` |         `10.10 / 3.98` |         `10.13 / 4.00` |        `10.19 / 4.02` |
| Atlassian   | Light      |              `5.90 / 3.54` |          `5.81 / 3.19` |          `5.54 / 3.06` |         `5.74 / 4.54` |
| Atlassian   | Dark       |              `7.03 / 4.07` |          `8.87 / 5.57` |          `8.59 / 8.59` |         `6.81 / 4.29` |
| `FS-BN`     | Light      |             `12.88 / 3.54` |         `13.82 / 3.19` |         `13.40 / 3.06` |        `12.78 / 4.54` |
| `FS-BN`     | Dark       |             `10.29 / 4.07` |          `9.81 / 5.57` |          `9.72 / 8.59` |        `10.25 / 4.29` |
| Carbon      | Light      |             `13.24 / 7.09` |         `13.20 / 3.04` |         `13.20 / 1.53` |        `13.23 / 4.55` |
| Carbon      | Dark       |             `10.93 / 4.52` |         `10.93 / 6.33` |         `10.93 / 8.99` |        `10.93 / 4.51` |

All title pairs exceed `4.5:1`. All Spectrum and Atlassian marker/background pairs
exceed `3:1`. Carbon Light warning is `1.53:1`; its marker cannot be treated as a
standalone necessary graphical status cue. The exact Carbon recipe remains viable
only when the explicit warning title, symbol shape, and programmatic semantics carry
the meaning. Because the source values may not be modified, a requirement for a
standalone `3:1` warning icon would disqualify `FS-C` rather than authorize a darker
yellow.

`FS-BN` retains every Atlassian marker/background ratio and raises message-title
contrast by assigning title typography to the approved neutral foreground. Its field
error remains exact Atlassian danger text: Light `#AE2E24`, Dark `#FD9891`.

## Representative content in the specimen

- non-blocking data-sync information;
- successful sync with new and updated record counts;
- partial mismatch warning that excluded three songs;
- expired-session failure with recovery instruction;
- invalid public-name field with visible error association;
- compact information, healthy, review-needed, and error states;
- destructive consequence with an outlined danger action;
- Light and Dark appearances, Korean/Japanese/English content, and a color-disabled
  mode.

## Review result

The comparison resolved these review questions:

1. Which candidate keeps Dark NosLog calm without making status too easy to miss?
2. Which Light treatment distinguishes four states without producing tinted-card
   clutter?
3. Is Atlassian's colored title useful for scanning or unnecessarily chromatic?
4. Is Carbon's single neutral Dark background preferable, and is its weak Light
   warning marker acceptable because the warning is explicitly named?
5. Does Spectrum's uniform visual/background contrast offer the most stable balance?
6. Does `FS-BN` preserve the preferred Atlassian color identity while making dense
   message copy calmer than `FS-B`?

The user selected `FS-BN`. The decisive fit was Atlassian's preferred semantic color
character and explicit danger-colored field validation combined with neutral,
high-contrast message-container typography in both appearances. Carbon's neutral-copy
precedent informed the role boundary, but no Carbon value was adopted.

## Acceptance checks

- no horizontal overflow at `320px`, `390px`, and desktop;
- equivalent candidate content and component order;
- Light/Dark switching and locale switching preserve layout and meaning;
- color-disabled mode preserves every status through title, symbol, copy, and structure;
- invalid input remains visibly associated with its text error;
- keyboard focus remains visible on every control;
- exact value and measured-ratio records match the source packages;
- explicit user approval is recorded before promotion.

## Browser verification — 2026-08-10

The interactive artifact was exercised in the in-app Chromium browser at actual
`1440px`, `390px`, and `320px` CSS viewport widths.

| Check                                  | Observed result                                                                                    |
| -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Document horizontal overflow           | None at all three widths                                                                           |
| Candidate fragment horizontal overflow | `0 / 8` fragments at each width                                                                    |
| Candidate layout                       | `FS-BN` Light/Dark pair plus three source columns at `1440px`; one column at `390px` and `320px`   |
| Appearance control                     | Both, Light-only, and Dark-only states expose the expected fragments                               |
| Locale control                         | Korean, Japanese, and English copy updates without duplicate IDs or layout loss                    |
| Color-cue control                      | Color-disabled mode retains title, symbol, copy, boundary, and structure                           |
| Console                                | No warning or error entries in the completed run                                                   |
| Keyboard focus                         | Approved `FI-C` mapping preserved: Light `#000000`, Dark `#FFFFFF`, `2px`, zero gap, no extra halo |

The only elements whose intrinsic text width exceeded their visible box at `320px`
were the deliberately long single-line invalid-name inputs. Their boxes and the page
still had no horizontal overflow; the visible error copy supplied the full constraint.
This is the intended input-value pressure test, not a layout failure.

## Decision log

| ID       | Entry                                                                                                                                           | Status                         |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `FSV-01` | Compare Spectrum, Atlassian, and Carbon with identical real NosLog feedback content rather than swatch strips.                                  | `Completed evidence`           |
| `FSV-02` | Pin Carbon to `@carbon/themes@11.78.0` and preserve its White/`g100` notification background and support values exactly.                        | `Observed source evidence`     |
| `FSV-03` | Keep approved Spectrum neutrals as the shared surface and ordinary-copy owner while each candidate owns only its published status roles.        | `Enforced upstream constraint` |
| `FSV-04` | Treat Carbon Light warning marker `1.53:1` as non-standalone; do not darken or replace the source yellow.                                       | `Measured limitation`          |
| `FSV-05` | Select one `13A` source after user review.                                                                                                      | `Approved — FS-BN, 2026-08-10` |
| `FSV-06` | Verify the controlled artifact at actual desktop, `390px`, and `320px` browser widths with theme, locale, color-cue, and keyboard-focus checks. | `Completed — 2026-08-10`       |
| `FSV-07` | Add one user-requested `FS-BN` example that keeps Atlassian chromatic roles but assigns message typography to the approved neutral owner.       | `Approved — 2026-08-10`        |
| `FSV-08` | Preserve `FS-A` and `FS-C` as not-selected evidence and supersede the original colored-title `FS-B` component mapping with `FS-BN`.             | `Approved disposition`         |

## Approval record

On 2026-08-10 the user approved `FS-BN · Atlassian semantic color + neutral message
typography` as the NosLog 2.0 universal feedback/status mapping for gate `13A`.
Atlassian owns the exact feedback chromatics; approved Spectrum S2 neutrals own
message-container title/body typography. This approval does not authorize `13B`
NOSTALGIA-domain colors, `13C` comparison-local data colors, final iconography, or
production implementation.
