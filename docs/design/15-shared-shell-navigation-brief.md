# NosLog 2.0 Shared Shell and Navigation Brief

## Document Control

- Status: `Approved`
- Decision status: `Complete shared-shell contract approved: restrained ordinary
header; signed-out Login or signed-in profile control; one navigation trigger;
ordered two-column product and utility navigation; compact modal and wide popover
adaptations; compact-only scroll hiding; footer-only Privacy and GitHub; minimal
authentication shell; focused chart-viewer shell; system-recovery shell;
accessibility, localization, state, and browser acceptance requirements`
- Evidence status: `Repository and browser inspection at 320, 390, and 1280 CSS px;
approved information architecture and page briefs; more than twenty cited
accessibility, design-system, production-service, and rhythm-game references; and
the user-approved decision record`
- Date started: 2026-08-03
- Last decision update: 2026-08-03
- Canonical language: English
- Korean companion:
  [15-shared-shell-navigation-brief.ko.md](./15-shared-shell-navigation-brief.ko.md)
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Authentication and onboarding contract:
  [17-authentication-onboarding-page-brief.md](./17-authentication-onboarding-page-brief.md)
- Focused-viewer contract:
  [07-chart-viewer-page-brief.md](./07-chart-viewer-page-brief.md)
- System-recovery states contract:
  [19-system-recovery-states-page-brief.md](./19-system-recovery-states-page-brief.md)
- Scope: repeated public-user shells, ordinary header, account and navigation
  controls, opened navigation behavior, footer, skip route, semantic landmarks,
  responsive adaptation, scroll visibility, authentication shell, focused-viewer
  shell boundary, recovery shell, localization, accessibility, states, and future
  implementation acceptance
- Excluded: final visual styling, exact Foundation tokens, precise dimensions and
  transition breakpoint, final localized copy, page-specific content hierarchy,
  administrator-interface redesign, final high-fidelity composition, and production
  implementation in this design-guide session

## Decision Labels

- **Observed:** Verified in the repository, current browser evidence, an approved
  upstream artifact, or a cited source.
- **Approved:** Explicitly agreed with the user and authoritative for downstream design.
- **Proposed:** Evidence-based direction awaiting user approval.
- **Open:** Requires further research, testing, or a user decision.
- **Rejected:** Considered and explicitly not selected.
- **Superseded:** Replaced by a later approved direction.

This brief is authoritative for shell membership, information order, behavior,
responsive adaptation, states, accessibility, and acceptance criteria. Typography,
color, spacing, border, radius, elevation, icon drawing, precise header height,
panel width, and the content-driven compact-to-wide transition remain Foundation and
downstream Claude Design work. Those later decisions may refine expression but must
not alter this contract.

## Purpose

The shared shell answers four questions without competing with page content:

> Which service am I using, how do I reach another major NosLog destination, how do I
> access my account, and how do I recover when the current context is exceptional?

NosLog has enough independent product destinations that the shell must provide reliable
orientation and access, but it must not display every destination as persistent header
buttons. The shell is a stable frame around content, not a dashboard, a site map, or a
replacement for contextual links inside pages.

## Primary Context and Success

- **Approved:** Mobile use around an arcade is the primary context. A representative
  `390px` canvas does not become a fixed application width or universal breakpoint.
- **Approved:** Ordinary pages succeed when users can identify NosLog, reach Home,
  access account state, open the complete global destination set, skip repeated
  navigation, and continue into page content without crowding.
- **Approved:** Wide pages preserve the same destination meaning and order while using
  a persistent sticky header and an anchored popover instead of a modal compact panel.
- **Approved:** Authentication pages reduce navigation distraction without removing
  service identity, Home recovery, or footer trust links.
- **Approved:** The chart viewer uses its own focused shell. The ordinary header and
  footer do not consume chart space or interrupt playback.
- **Approved:** Maintenance and fatal-error surfaces expose only NosLog identity and an
  appropriate recovery action rather than a nonfunctional full navigation system.
- **Approved:** Korean, Japanese, and English layouts preserve destination identity and
  semantic order even when labels occupy different widths.

## Current-Product Evidence

### Repository Evidence

- **Observed:** `app/(nevigation)/layout.tsx` currently constrains the whole ordinary
  page shell to `max-w-97.5`, approximately `390px`, even at wide viewports.
- **Observed:** `components/layout/header.tsx` currently renders NosLog, three labeled
  destination links, account/profile, and the opened-menu trigger.
- **Observed:** `components/layout/headerNavigation.tsx` currently exposes only Bingo,
  Exams, Arcades, Data Sync, and conditional Admin. It does not expose the complete
  approved global destination set or public Settings and Feedback.
- **Observed:** `components/layout/scrollAwareHeader.tsx` hides the header on downward
  scroll below `1024px` and leaves it persistent at wider widths. The numeric threshold
  is implementation evidence, not an approved 2.0 breakpoint.
- **Observed:** The current opened panel locks body scrolling and closes on Escape, but
  browser inspection did not verify complete focus containment.
- **Observed:** `components/layout/footer.tsx` already provides Privacy, GitHub, and
  copyright content.
- **Observed:** `app/(auth)/layout.tsx` does not currently provide the ordinary header
  or footer. Login contains an inline Privacy link; that placement is current-product
  evidence, not an approved shared-shell requirement.

### Browser Evidence

- **Observed:** At `1280px`, ordinary content remains centered in an approximately
  `390px` column rather than adapting to desktop space.
- **Observed:** At `390px`, the header retains Music, Rankings, and Tiers in addition to
  the account and navigation controls.
- **Observed:** At `320px` in Japanese, the persistent destination labels crowd the
  service identity and controls.
- **Observed:** The current two-column opened panel remains approximately `390px` wide
  and does not become a desktop-anchored popover.
- **Observed:** Browser accessibility inspection exposed duplicate close naming around
  the opened navigation backdrop and trigger. The redesigned shell must expose one
  unambiguous visible close operation and one coherent accessible interaction scope.

## Approved Shell Variants

| Variant                      | Applies to                                                                                                                               | Required repeated content                                                                                        | Explicit exclusions                                                 | Status     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------- |
| Ordinary public shell        | Home, Music, Rankings, Tiers, Bingo, Exams, Arcades, Data Sync, Settings, Profile, announcements, Privacy, and other ordinary user pages | Skip route, responsive header, one `main`, ordinary footer                                                       | Persistent bottom navigation; labeled destination row in the header | `Approved` |
| Minimal authentication shell | Login, onboarding, and authentication recovery                                                                                           | NosLog identity linked to localized Home, one `main`, ordinary trust footer                                      | Profile control, More trigger, global destination panel             | `Approved` |
| Focused chart-viewer shell   | Falling viewer, full-sheet viewer, and their fullscreen states                                                                           | Viewer-specific back/orientation control, chart identity, tabs and playback controls defined by the viewer brief | Ordinary header, More panel, ordinary footer                        | `Approved` |
| System-recovery shell        | Maintenance and fatal application-error states                                                                                           | NosLog identity, clear state message, context-appropriate recovery action                                        | Full global navigation when destinations cannot reliably work       | `Approved` |

The Privacy page may use the ordinary public shell. “Footer-only” describes where the
Privacy destination is globally advertised; it does not forbid the Privacy page itself
from having an ordinary header.

## Ordinary Public Shell Contract

### Semantic Order

The document order is:

1. skip-to-main link;
2. site header;
3. page-level `main` landmark;
4. ordinary footer.

There must be exactly one page-level `main`. Page components must not introduce nested
or competing `main` landmarks. Visual reordering at wider widths must not produce a
different or confusing reading and focus order.

### Header Anatomy

The ordinary header contains only:

1. **Left:** NosLog identity linked to localized Home.
2. **Right account position:** a visible localized Login text control while signed out,
   or the signed-in profile image/control while authenticated.
3. **Right navigation position:** a navigation/hamburger icon control that opens the
   global destination panel.

Music, Chart Viewer, Rankings, Tiers, Bingo, Exams, Arcades, Data Sync, Settings,
Feedback, Privacy, GitHub, and Admin are not persistent labeled header controls.

### Service Identity

- The visible identity is `NosLog`; do not substitute the legacy `NOSTORY` name.
- It links to the Home route for the active locale.
- It remains available in all four shell variants, although fullscreen browser UI may
  temporarily suppress it under the focused-viewer contract.
- Final wordmark drawing, size, and typography belong to the Foundation. It must remain
  legible and not shrink to make room for excess controls.

### Account Control

- **Signed out:** show a localized visible Login text control. Do not rely on an
  unlabeled avatar placeholder.
- **Signed in:** show the current profile image/control. Its accessible name identifies
  the profile destination or account owner without exposing private Discord data.
- The signed-in profile control opens the user's profile destination directly; it does
  not duplicate Settings or the complete More panel.
- Missing or failed profile images use an accessible fallback without moving adjacent
  controls.

### Navigation Trigger

- Use a familiar navigation/hamburger symbol, not an ellipsis, because it opens the
  primary destination set rather than an item-specific overflow list.
- Provide a localized accessible name, `aria-expanded`, and `aria-controls` or an
  equivalent relationship.
- The trigger must communicate open state without permanently appearing selected on
  every product page.
- The open interaction exposes exactly one unambiguous visible close operation. Do not
  produce duplicate accessible “close navigation” controls for one action.

## Global Destination Panel

### Information Order

The approved visual rows and semantic sequence are:

| Row                   | Left                                      | Right                   |
| --------------------- | ----------------------------------------- | ----------------------- |
| 1                     | Music                                     | Chart Viewer            |
| 2                     | Rankings                                  | Tiers                   |
| 3                     | Bingo                                     | Exams                   |
| 4                     | Arcades                                   | Data Sync               |
| Divider               | Utilities begin; no visible group heading | —                       |
| 5                     | Settings                                  | Feedback / Error Report |
| Conditional final row | Admin, when authorized                    | Empty                   |

The linear DOM, reading, and keyboard order follows each row left-to-right and then
top-to-bottom. If CSS changes the visual tracks, it must not reorder this sequence.

### Content Rules

- Each destination uses an icon and a concise localized text label only.
- Do not add descriptions, counts, badges, promotional copy, or explanatory subtitles
  to the global panel unless a later guide revision establishes a verified need.
- Do not add visible product-group labels. A visual divider separates the eight product
  destinations from the two utilities.
- Tiers, Bingo, and Exams remain independent destinations. Their adjacency does not
  create a combined “challenge” or other umbrella concept.
- Settings is one public route for both authentication states; page contents adapt to
  the user's state.
- Feedback / Error Report retains the approved dialog-based submission flow. It is not
  duplicated on Home or in the footer.
- Admin appears only for authorized administrators and is visually separated as a
  conditional final destination. Its absence must not leave a confusing blank gap.
- Privacy and GitHub never appear in this panel.

### Destination Meaning

- Music opens the shared discovery surface in Music scope.
- Chart Viewer opens that same surface in Chart scope; it is a direct entry into the
  approved chart-discovery flow, not a duplicate catalog.
- Rankings, Tiers, Bingo, Exams, Arcades, and Data Sync open their independent approved
  page families.
- The current destination uses `aria-current="page"` on its link or an equivalent
  route-aware semantic state. A child route may mark its owning destination current.
- Opening the panel must not change the current route, query, scroll position, or form
  state.

## Responsive Panel Behavior

### Compact Modal Adaptation

- The panel spans the available content width directly below the visible header and
  uses two equal semantic columns.
- A scrim separates the open navigation state from page content.
- Page scrolling is locked while the panel is open.
- Keyboard focus is contained within the navigation interaction scope until it closes.
- The header remains visible while the panel is open or focus is within its interaction
  scope.
- Opening moves focus according to the final accessible component contract; closing
  returns focus to the trigger unless navigation moved focus to a new page.
- Escape, the visible close operation, activating a destination, and an intentional
  scrim/outside action close the panel.
- Do not introduce an inner scrolling region while the complete approved navigation
  can reflow in the available viewport. On unusually short viewports, the interaction
  must remain operable at 200% and 400% zoom without hiding the final actions.

### Wide Popover Adaptation

- The panel becomes a right-aligned two-column non-modal popover anchored to the
  navigation trigger.
- The page remains scrollable and does not receive a modal scrim or body lock.
- Outside pointer action, Escape, destination activation, or trigger toggle closes it.
- Focus is not forcibly trapped, but keyboard traversal and focus return remain
  predictable.
- The popover must remain within the viewport and must not obscure its trigger or the
  focused element.

### Transition Rule

The switch between modal and popover is content-driven. The current `1024px` logic is
not a prescribed breakpoint. Foundation and downstream layout testing must choose the
transition where the complete header and panel fit without crowding, clipping, or
unusable pointer and keyboard targets. The taxonomy, row order, and destination meaning
do not change across the transition.

## Scroll-Aware Header Contract

- On compact layouts, downward document scrolling may hide the header to preserve
  content space; upward scrolling reveals it.
- On wider desktop layouts, the header remains persistently visible and sticky.
- The header begins visible on first load and after every route change.
- It remains visible while the destination panel is open, while focus is within header
  or panel controls, and while a skip-link target transition is occurring.
- It must reveal before keyboard focus would otherwise become obscured.
- Small scroll jitter around a fixed point must not repeatedly hide and reveal it.
- Scrolling near the document top always reveals it.
- Under `prefers-reduced-motion: reduce`, remove the sliding transition; visibility may
  change without motion.
- Exact thresholds, hysteresis distance, duration, easing, header height, and compact
  transition width remain Foundation and prototype measurements, not arbitrary values
  inherited from the current implementation.

## Footer Contract

The ordinary footer contains only the stable trust and project layer required here:

1. Privacy;
2. GitHub, identified as an external destination;
3. NosLog copyright/service notice.

- Privacy and GitHub are footer destinations and are not duplicated in the header or
  More panel.
- Privacy is reachable while signed out.
- The account-deletion context may include an additional contextual Privacy link when
  needed for informed consent; that does not make Privacy a global header destination.
- The exact question of an additional inline Privacy link in Login body content is
  deferred to the authentication page brief. The current inline link is not itself an
  approved 2.0 requirement.
- The footer must not become a second full site map.

## Minimal Authentication Shell

- Login, onboarding, and authentication recovery use the NosLog identity linked to the
  localized Home route.
- Do not render profile or More controls before authentication context is established.
- Preserve the skip route, exactly one `main`, and the ordinary trust footer.
- The shell must allow users to leave authentication and return Home without relying on
  browser Back.
- Login methods, Discord disclosure, the inline contextual Privacy link, onboarding
  content, incomplete-profile gating, safe return, and authentication recovery follow
  [17-authentication-onboarding-page-brief.md](./17-authentication-onboarding-page-brief.md).

## Focused Chart-Viewer Shell Boundary

- The focused chart viewer does not render the ordinary header, More panel, or footer.
- It provides its own reliable return path and visible music/chart identity.
- Viewer tabs, falling-view fullscreen, playback, local audio, metronome, strict
  performance, responsive rendering, and state preservation follow
  [07-chart-viewer-page-brief.md](./07-chart-viewer-page-brief.md).
- Entering or leaving fullscreen must not create a second ordinary shell or nested
  `main` landmark.
- Feedback access inside the focused viewer remains governed by the viewer brief and
  must not be inferred from the ordinary More panel.

## System-Recovery Shell

- Maintenance and fatal application errors show NosLog identity, concise state meaning,
  and the most useful available recovery action.
- Do not show global destinations that are known to be unavailable.
- A recoverable page-level error inside an otherwise functioning ordinary page may keep
  the ordinary shell; the page brief determines its recovery action.
- Not-found pages should preserve enough shell context to reach Home or another valid
  destination unless the application itself cannot initialize.
- The complete approved distinction between Not found, recoverable page error, fatal
  global error, and planned Maintenance—including content, actions, HTTP semantics,
  timing, locale, diagnostics, and acceptance—follows
  [19-system-recovery-states-page-brief.md](./19-system-recovery-states-page-brief.md).

## Accessibility Contract

- Provide a first-focusable skip link that targets the page-level `main`.
- Use `header`, `nav`, `main`, and `footer` landmarks with non-duplicated accessible
  names where multiple navigation regions exist.
- The opened destination collection is link navigation. Do not use ARIA `menu` or
  `menuitem` roles, which would impose desktop-menu keyboard semantics inappropriate
  for ordinary page links.
- Use native links for route destinations and native buttons for open/close actions.
- Preserve a logical DOM and focus order at every width and locale.
- Meet WCAG 2.2 target-size or spacing requirements; high-frequency compact controls
  should exceed the minimum when Foundation proportions allow it.
- Focus indicators meet contrast and are not clipped by sticky headers, popovers,
  panels, or viewport edges.
- Reflow at `320 CSS px` without page-level two-dimensional scrolling. At 200% and
  400% zoom, all destinations remain available and the close action remains operable.
- Icon meaning never stands alone when the destination panel is open; each link keeps a
  visible text label.
- Opening, closing, route change, and account-image failure are announced through native
  semantics without noisy custom live regions.

## Localization Contract

- Preserve the same destination identity and relative order in Korean, Japanese, and
  English.
- Final labels are validated as part of the localization phase; this brief approves
  destination meanings, not an unreviewed translation string set.
- Test representative long labels, including Chart Viewer, Feedback / Error Report,
  Data Sync, localized Login, and administrator wording.
- Do not abbreviate a translation until it changes meaning merely to preserve one line.
  Links may wrap within their cell while the two-column row remains readable.
- The NosLog service name remains untranslated.
- Every Home, destination, Settings, Privacy, Login, and profile route preserves the
  active `/ko`, `/ja`, or `/en` locale unless the user explicitly changes language.
- The signed-out browser preference and signed-in account preference behavior remains
  governed by the approved information architecture and later Settings brief.

## Runtime State Contract

| State                       | Required presentation and behavior                                                      | Status     |
| --------------------------- | --------------------------------------------------------------------------------------- | ---------- |
| Signed out                  | Login text and navigation trigger; complete public destination panel                    | `Approved` |
| Signed in                   | Profile image/control and navigation trigger; complete public destination panel         | `Approved` |
| Administrator               | Signed-in state plus conditional final Admin destination                                | `Approved` |
| Profile image missing/error | Stable accessible fallback; no layout shift                                             | `Approved` |
| Compact panel closed        | Page scroll enabled; trigger reports collapsed                                          | `Approved` |
| Compact panel open          | Two columns under header, scrim, body lock, focus containment, visible close operation  | `Approved` |
| Wide popover open           | Right-anchored two columns, no scrim or body lock, predictable outside/Escape close     | `Approved` |
| Current child route         | Owning destination receives semantic current state                                      | `Approved` |
| Route transition            | Shell starts visible; opened navigation closes; focus follows route-navigation contract | `Approved` |
| Reduced motion              | No header slide; no essential meaning depends on animation                              | `Approved` |
| 320 CSS px                  | No horizontal page scroll; labels and targets remain operable                           | `Approved` |
| Long localized copy         | Wrap or adapt without clipping, semantic reorder, or hidden destination                 | `Approved` |
| Focused viewer              | Viewer-specific shell only                                                              | `Approved` |
| Maintenance/fatal error     | Minimal identity and recovery action                                                    | `Approved` |

## Rejected and Superseded Alternatives

- **Persistent mobile bottom navigation — Rejected:** it creates a mobile-only global
  taxonomy and consumes chart and arcade-use viewport space. NosLog keeps one
  responsive top-shell model.
- **Persistent labeled product links in the header — Rejected:** current evidence at
  `320px` shows crowding, and the approved panel already provides complete access.
- **Ellipsis as the global navigation trigger — Rejected:** an overflow metaphor is
  weaker for the service's primary destination set than a navigation/hamburger symbol.
- **Different mobile and desktop destination taxonomies — Rejected:** layout changes,
  meaning and relative order do not.
- **Descriptions under every destination — Rejected:** the panel is frequent navigation,
  not onboarding documentation; descriptions would increase density without an
  approved need.
- **Visible utility group heading — Rejected:** Settings and Feedback remain evident
  after a divider without introducing an unapproved umbrella label.
- **Combine Tiers, Bingo, and Exams — Rejected:** the concepts have different
  NOSTALGIA meanings and user tasks.
- **Privacy, GitHub, or Language as separate More entries — Rejected:** Privacy and
  GitHub belong to the footer; language belongs inside the one public Settings route.
- **Privacy as a header destination — Rejected:** footer access is stable and does not
  compete with task navigation. Contextual consent links remain page-specific.
- **Modal desktop navigation — Rejected:** wide layouts can preserve page context with
  an anchored non-modal popover.
- **Non-modal compact panel without focus containment — Rejected:** scrim and body lock
  create a modal interaction and must have coherent keyboard containment.
- **Auto-hide on every viewport — Superseded:** compact layouts may auto-hide; wider
  desktop keeps a persistent sticky header.
- **Ordinary shell inside the chart viewer — Rejected:** the focused viewer needs the
  available canvas and its own orientation controls.

## Implementation Mapping

Future implementation should evaluate and reuse the existing shell files rather than
blindly preserve their current geometry:

| Current area                              | Required 2.0 responsibility                                                                                              |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `app/(nevigation)/layout.tsx`             | Remove fixed-wide-page behavior; compose skip link, shell variant, one `main`, and footer according to route family      |
| `components/layout/header.tsx`            | Restrict ordinary anatomy to identity, account control, and navigation trigger                                           |
| `components/layout/headerNavigation.tsx`  | Implement complete ordered destinations, compact modal and wide popover adaptations, authorization, semantics, and state |
| `components/layout/scrollAwareHeader.tsx` | Implement compact-only hide/reveal safeguards and persistent wide behavior with reduced-motion handling                  |
| `components/layout/footer.tsx`            | Preserve Privacy, external GitHub identification, and copyright without becoming a site map                              |
| `app/(auth)/layout.tsx`                   | Add the minimal authentication shell and trust footer without ordinary global navigation                                 |
| Chart viewer layouts/components           | Preserve the focused viewer contract and prevent nested ordinary shells                                                  |

Exact component names may change during implementation. The semantic responsibilities
and approved behavior must remain traceable in tests.

## Browser Acceptance Contract

Future downstream design and implementation must verify at minimum:

1. `320px` Korean, Japanese, and English ordinary pages with signed-out controls,
   longest representative labels, open panel, last utility, and close action visible;
2. representative `390px` signed-in ordinary pages, including failed profile image and
   Admin present/absent states;
3. intermediate widths around the actual content-driven panel transition;
4. a wide desktop viewport such as `1280px`, with a persistent sticky header and
   right-anchored non-modal popover;
5. downward/upward scroll, near-top jitter, route changes, open-panel scrolling, focus
   inside the header/panel, and reduced-motion behavior;
6. keyboard-only opening, all links in semantic order, Escape, outside close, visible
   focus, focus return, and skip-to-main;
7. 200% and 400% zoom, short viewport height, and no inaccessible final destinations;
8. signed-out Login, signed-in Profile, conditional Admin, current route, and settings
   availability without authentication;
9. ordinary footer Privacy and GitHub, absence of both in header and More, and minimal
   authentication footer presence;
10. focused chart viewer with no ordinary header/footer and one page-level `main`;
11. maintenance, fatal error, recoverable page error, and not-found recovery behavior;
12. no unexpected horizontal page scroll, clipped focus, duplicate close action, body
    scroll leak in compact modal state, or body lock in wide popover state.

Automated tests should cover semantics, route order, permission conditions, body-lock
state, focus return, reduced motion, and responsive overflow. Browser inspection must
still validate actual visual fit and interaction; lint, typecheck, and component tests
are not substitutes.

## Reference Matrix

| Source                                                                                                               | Transferable principle                                                                     | NosLog application                                                                        | Limitation                                                                               |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [W3C Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                | Content reflows at 320 CSS px without two-dimensional page scrolling                       | Compact header, wrapping labels, and complete panel access                                | Does not prescribe NosLog layout or breakpoints                                          |
| [W3C Consistent Navigation](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html)                  | Repeated navigation preserves relative order                                               | Same destination sequence across locale and viewport                                      | Focused contexts may deliberately use a documented reduced shell                         |
| [W3C Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html)                                  | Repeated blocks need a bypass mechanism                                                    | First-focusable skip-to-main link                                                         | Does not determine visual treatment                                                      |
| [W3C Consistent Help](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help)                                   | Repeated help access remains predictably located                                           | Feedback stays in one ordinary More-panel utility position                                | Feedback is a product dialog, not a complete support center                              |
| [W3C Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)                | Sticky layers must not hide keyboard focus                                                 | Reveal header and constrain panel/popover geometry around focus                           | Does not choose header height                                                            |
| [W3C Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)                              | Pointer targets need minimum size or spacing                                               | Header and panel targets remain operable at compact widths                                | Minimum compliance is not a visual token system                                          |
| [WAI APG Disclosure Navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) | Ordinary link navigation can use a disclosure button without ARIA menu roles               | Button controls a link collection with Escape and focus return                            | Example is not a modal compact-panel specification                                       |
| [GOV.UK Navigate a Service](https://design-system.service.gov.uk/patterns/navigate-a-service/)                       | Global navigation should expose useful top-level areas rather than become a site map       | Keep a bounded product set and contextual page links                                      | Government content hierarchy is not NosLog art direction                                 |
| [GOV.UK Service Navigation](https://design-system.service.gov.uk/components/service-navigation/)                     | Service identity and responsive navigation can share one top system                        | Stable NosLog identity and responsive opened panel                                        | Exact component styling does not transfer                                                |
| [USWDS Header](https://designsystem.digital.gov/components/header/)                                                  | Simple and expanded header variants respond to information depth and width                 | Compact modal and wide popover share one taxonomy                                         | Federal visual styling does not transfer                                                 |
| [Carbon UI Shell Header](https://carbondesignsystem.com/components/UI-shell-header/usage/)                           | A stable product shell separates global controls from page content                         | Restrained identity/account/navigation anatomy                                            | Enterprise density and left rails are not NosLog requirements                            |
| [Carbon Global Header](https://carbondesignsystem.com/patterns/global-header/)                                       | Global header configuration should match product depth                                     | One top shell with a complete on-demand destination set                                   | Carbon taxonomy is not copied                                                            |
| [Adobe Spectrum Headers](https://spectrum.adobe.com/page/headers/)                                                   | Header hierarchy should protect product identity and essential actions                     | Do not shrink NosLog around persistent product labels                                     | Spectrum tokens are not NosLog tokens                                                    |
| [Material Top App Bar](https://m2.material.io/components/app-bars-top)                                               | Top bars provide navigation, identity, and actions and may respond to scroll               | Supports compact scroll-aware behavior                                                    | Material visual and motion values are not adopted automatically                          |
| [Radix Navigation Menu](https://www.radix-ui.com/primitives/docs/components/navigation-menu)                         | Navigation components require keyboard, focus, and collision behavior                      | Informs future component evaluation and tests                                             | Its default anatomy does not cover the approved compact modal state                      |
| [Radix Popover](https://www.radix-ui.com/primitives/docs/components/popover)                                         | Anchored content can handle collision, focus, and outside dismissal                        | Candidate basis for the wide non-modal adaptation                                         | Does not determine mobile semantics or visual styling                                    |
| [Shopify Polaris Top Bar](https://polaris-react.shopify.com/components/internal-only/top-bar)                        | Account and global actions can remain compact while navigation is disclosed                | Supports separating profile and navigation controls                                       | Commerce administration is not NosLog's user context                                     |
| [osu!](https://osu.ppy.sh/)                                                                                          | A rhythm-game service uses a compact mobile navigation trigger for a broad destination set | Domain evidence that persistent destination labels are unnecessary on compact widths      | osu!'s taxonomy and visual system do not transfer                                        |
| [Taiko.wiki](https://taiko.wiki/?lang=ko)                                                                            | Rhythm-game utilities require visible locale-aware navigation and compact controls         | Reinforces testing long multilingual control combinations                                 | Its persistent icon set is not adopted because NosLog has a different approved hierarchy |
| [V-ARCHIVE](https://v-archive.net/)                                                                                  | A rhythm-game archive uses logo, search, and a disclosed mobile destination surface        | Domain evidence for a dedicated navigation trigger and two-dimensional destination layout | Its modal drawer and content taxonomy are not copied                                     |
| [KONAMI NOSTALGIA](https://www.konami.com/arcadegames/products/am_nostalgia/)                                        | Official game identity and terminology contextualize NosLog destinations                   | Prevents generic grouping from distorting Tiers, Bingo, and Exams                         | Official promotional navigation is not a service-shell model                             |

### Evidence Convergence

- Accessibility sources converge on stable order, bypass, reflow, focus visibility,
  target operability, and link-navigation semantics.
- Design systems converge on protecting service identity and adapting the opened
  navigation to available space rather than forcing every destination into a narrow
  header.
- Rhythm-game references confirm compact disclosed navigation is familiar in the
  domain, but disagree in exact panel form. NosLog therefore uses its approved needs:
  a complete two-column compact modal and a wide anchored popover.
- No credible source supports adding Privacy, GitHub, or a speculative umbrella group
  to NosLog's frequent product navigation. Their approved footer and independent
  product meanings remain stronger product evidence.

## Decision Log

| ID       | Decision                                                                                                      | Status     |
| -------- | ------------------------------------------------------------------------------------------------------------- | ---------- |
| SHELL-01 | Use one responsive top-shell taxonomy; do not add persistent bottom navigation                                | `Approved` |
| SHELL-02 | Ordinary header contains NosLog, account state, and one navigation trigger only                               | `Approved` |
| SHELL-03 | Signed-out account position uses a visible Login text control                                                 | `Approved` |
| SHELL-04 | Use a navigation/hamburger trigger rather than an ellipsis                                                    | `Approved` |
| SHELL-05 | Keep eight product destinations in the approved row and semantic order                                        | `Approved` |
| SHELL-06 | Put Settings and Feedback / Error Report after a divider with no group heading                                | `Approved` |
| SHELL-07 | Keep Admin conditional and separate after ordinary utilities                                                  | `Approved` |
| SHELL-08 | Use icon plus concise text label; do not add descriptions                                                     | `Approved` |
| SHELL-09 | Compact navigation is a full-width two-column modal below the header                                          | `Approved` |
| SHELL-10 | Compact open state uses scrim, body lock, focus containment, and reliable close/focus return                  | `Approved` |
| SHELL-11 | Wide navigation is a right-anchored two-column non-modal popover without body lock                            | `Approved` |
| SHELL-12 | Choose the modal/popover transition from content fit, not the current `1024px` implementation                 | `Approved` |
| SHELL-13 | Compact header hides downward and reveals upward; wide desktop header remains sticky and visible              | `Approved` |
| SHELL-14 | Keep the header visible during open navigation, header/panel focus, and route entry                           | `Approved` |
| SHELL-15 | Reduced motion removes header sliding                                                                         | `Approved` |
| SHELL-16 | Ordinary footer owns Privacy, GitHub, and copyright                                                           | `Approved` |
| SHELL-17 | Privacy and GitHub do not appear in the header or More panel                                                  | `Approved` |
| SHELL-18 | Login and onboarding use a minimal identity-plus-footer shell without More/profile                            | `Approved` |
| SHELL-19 | Login body includes concise Discord-data disclosure and an inline Privacy link under the authentication brief | `Approved` |
| SHELL-20 | Focused chart viewer omits ordinary header and footer                                                         | `Approved` |
| SHELL-21 | Maintenance and fatal errors use a minimal identity and recovery shell; exact state behavior follows Brief 19 | `Approved` |
| SHELL-22 | Opened destinations remain native link navigation, not ARIA menu semantics                                    | `Approved` |
| SHELL-23 | Preserve identical destination identity and semantic order across ko, ja, and en                              | `Approved` |
| SHELL-24 | Exact Foundation tokens, dimensions, breakpoint, and final localized strings remain downstream work           | `Approved` |

## Handoff Boundary

Claude Design must preserve the approved shell variants, anatomy, destination order,
compact and wide behaviors, scroll rules, footer ownership, semantics, and states. It
may determine visual composition within the later approved Foundation. It must not
reintroduce persistent header destination labels, bottom navigation, descriptive menu
cards, Privacy in More, a universal auto-hiding desktop header, or the ordinary shell
inside the focused viewer.

The future Codex implementation session must map these requirements to code and
automated/browser tests. If Foundation testing shows that two columns cannot remain
usable at `320 CSS px`, or if one visible close-control anatomy cannot satisfy modal
focus containment, report the conflict and obtain a guide revision rather than
silently changing taxonomy or behavior.
