# NosLog 2.0 Arcade Discovery and Detail Page Brief

## Document Control

- Status: `Approved`
- Decision status: `Complete Arcade-family contract approved: synchronized
list-and-map discovery; explicit nearby and map-area search; stable detail routes;
community-preference visualization; per-machine availability and condition;
scoped verification and correction reports; limited curated photography;
Korea-first but Japan/global-ready location data; responsive behavior;
accessibility; localization; and browser acceptance`
- Evidence status: `Repository, schema, current-interface, and browser inspection;
approved information architecture and related page briefs; cited official locator,
mapping, place-card, cartography, freshness, rhythm-game arcade, accessibility,
privacy, and internationalization references; and the user-approved decision record`
- Date started: 2026-08-03
- Last decision update: 2026-08-03
- Language: English
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Related contracts:
  [03-home-page-brief.md](./03-home-page-brief.md) and
  [09-profile-page-brief.md](./09-profile-page-brief.md)
- Scope: Localized public Arcade discovery and detail routes, map/list coordination,
  user-requested nearby search, NOSTALGIA cabinet availability and condition,
  operating information, community preference aggregation, preferred-arcade action,
  trusted freshness, correction reporting, limited public photos, and future
  country expansion
- Excluded: Administrator Arcade-editor redesign, final moderation-interface
  composition, live occupancy or wait-time tracking, automatic cabinet telemetry,
  user reviews or star ratings, unrestricted photo galleries, final Foundation
  tokens, final high-fidelity composition, and production implementation in this
  design-guide session

## Decision Labels

- **Observed:** Verified in the repository, current browser evidence, an approved
  upstream artifact, or a cited source.
- **Approved:** Explicitly agreed with the user and authoritative for downstream
  design.
- **Proposed:** Evidence-based direction awaiting user approval.
- **Open:** Requires further research, testing, or a user decision.
- **Rejected:** Considered and explicitly not selected.
- **Superseded:** Replaced by a later approved direction.

This brief is authoritative for the Arcade family's product meaning, content,
navigation, data semantics, interaction, privacy, responsive behavior, states, and
acceptance criteria. Exact typography, color, spacing, radius, elevation, map style,
marker artwork, sheet geometry, card treatment, control dimensions, grid tracks, and
content-driven transition values remain Foundation and active high-fidelity design work.
Later visual work may refine expression but must not remove or reinterpret this
product contract.

## Purpose

The Arcade family answers four ordered questions:

> Where can I play NOSTALGIA, which nearby or searched venue is appropriate, what is
> the verified condition of each cabinet, and how can I navigate there or help correct
> stale information?

It is both a location finder and a community-informed NOSTALGIA play-support surface.
It is not a live crowd monitor, a general-purpose business directory, a review site,
an arcade social feed, or an official KONAMI cabinet-status service.

## Primary Context and Success

- **Approved upstream:** Arcades remain an independent NosLog destination in the Play
  support family and a direct Home shortcut. They are not grouped with Music, Tiers,
  Bingo, or Exams under a fabricated label.
- **Approved:** Mobile use while deciding where to play or traveling to an arcade is
  primary. A user must be able to find a suitable venue, assess verified cabinet
  availability, and open directions without navigating a dense dashboard.
- **Approved:** A signed-out visitor succeeds when they can search or browse all public
  venues, use a permission-based nearby search, inspect detail and freshness, and open
  directions without fabricated personal state.
- **Approved:** A signed-in visitor succeeds when they can additionally set one
  preferred arcade and submit a contextual correction or cabinet issue report.
- **Approved:** The locator supports both practical existence discovery and community
  gathering-place discovery. Community preference is factual aggregate context, not
  live busyness and not an automated `sacred place` quality award.
- **Approved:** Desktop remains required. Added width should support a coordinated
  result list and map, not preserve a fixed approximately `390px` product shell.
- **Approved:** The initial public catalog may contain South Korean venues only, but
  the guide and data contract must not require a redesign to add Japan and global
  venues later.
- **Approved:** Current styling and geometry are audit evidence, not NosLog 2.0 visual
  authority.

## Current-Product and Domain Evidence

### Repository and Data Evidence

- **Observed:** The localized public route is currently `/[locale]/gamecenter`; no
  stable public Arcade-detail route exists.
- **Observed:** `Arcade` currently stores one name, region, address, coordinates,
  machine count, price, coin count, weekly hours JSON, one overall machine status,
  status note, general notes, active state, and generic `updated_at`.
- **Observed:** The public query counts users whose `preferred_arcade_id` references
  each Arcade. One user can select one preferred Arcade.
- **Observed:** Current public data has no country, IANA time zone, currency, localized
  names, phone, website, public photo, scoped verification, or per-cabinet record.
- **Observed issue:** One overall `machine_status` conflates whether a cabinet can be
  played with how well a playable cabinet's keys and judgment behave.
- **Observed issue:** `updated_at` is an administrator edit time. It cannot truthfully
  communicate when cabinet count, condition, hours, or price was last verified.
- **Observed:** The existing authenticated Feedback workflow supports private optional
  JPEG/PNG/WebP evidence up to `4 MB`, moderator review, and six-month cleanup of
  resolved material. It currently has no Arcade or cabinet relationship and no
  structured correction type.
- **Observed:** Public Arcade data is currently sorted by stored region and Korean name.
  Search compares name, region, and address in client state.

### Current Interface and Browser Evidence

- **Observed:** The current page exposes a region select, a proportional preference
  bubble map, a search input, region-grouped results, and expandable cards containing
  a second mini-map and the full venue detail.
- **Observed issue:** Text search filters the list but not the map. Selecting a map
  bubble clears the query, opens an accordion, and scrolls the page. The two discovery
  representations therefore do not share one result state.
- **Observed issue:** Every map scope rescales its highest preferred count to the
  largest bubble. A venue with one preference can look like a major hub when it is the
  maximum in a sparse region.
- **Observed issue:** Expanding a card creates a very tall mobile result and duplicates
  map context that already exists above.
- **Observed:** At `390×844`, results use one column. At `1440×900`, the current product
  still remains near a mobile-width shell. At `320×800`, the inspected current route
  did not create document-level horizontal overflow.
- **Observed:** When search has no list result, the unfiltered map can still show
  venues. This visibly confirms the current query/map mismatch.
- **Observed:** The current map fails over to a textual list and exposes zoom controls,
  but selection, filtering, direct linking, and detail restoration require the 2.0
  contract below.

### External Domain Evidence

- **Observed:** Official KONAMI and SEGA locators prioritize area and current-location
  search. SEGA explicitly warns that network installation lists, business hours, and
  actual operating state can differ.
- **Observed:** Google, Apple, and Mapbox locator guidance converges on nearby search,
  distance, coordinated lists and maps, selected-place summaries, directions, and
  responsive detail presentation.
- **Observed:** Musecat and Zenius-I-vanisher demonstrate that rhythm-game players need
  game-specific cabinet counts, condition or fault reporting, photos, and recent
  community updates beyond a generic business listing.
- **Observed:** Cartographic guidance distinguishes clustering counts from proportional
  quantitative symbols and requires a stable, explainable visual scale.
- **Observed:** OpenStreetMap freshness conventions distinguish a survey/check date
  from an unrelated edit date, supporting explicit verification semantics.

## Approved Scope and Invariants

1. The public Arcade family contains one discovery entry and stable detail destinations.
2. The list and map always represent the same active query, region, geographic bounds,
   filters, and sort context where the sort is meaningful on both representations.
3. Nearby search is user initiated. NosLog never requests location on load and never
   stores the user's exact current coordinates on the server.
4. Map panning does not silently replace results. An explicit `Search this area`
   action applies the new bounds.
5. Wide/low-zoom maps use Arcade-count clusters. Sufficiently zoomed maps use
   individual venues whose optional proportional size represents preferred-user count.
6. Cluster quantity, preferred-user quantity, and selected state use different visual
   semantics. Selection uses an outline/ring or equivalent non-size cue.
7. Preferred-user size uses one fixed national scale, capped minimum and maximum, so
   the same count has the same size across regions and filters.
8. Exact preferred counts below the approved minimum public sample of `3` are hidden.
   These venues use the base marker and do not disclose a one- or two-person aggregate.
9. Community preference is labeled as preference. It is never described as live
   occupancy, busyness, queue length, quality, or an automatically assigned `hub`.
10. Arcade availability and playable-cabinet condition are separate dimensions and are
    stored per cabinet.
11. User-visible verification time is separate from administrator edit time and names
    the information scope that was actually checked.
12. User reports never directly change public Arcade or cabinet state. An authorized
    moderator verifies and applies the correction.
13. Directions are the primary Arcade-detail action. Setting a preferred Arcade and
    reporting an issue are secondary contextual actions.
14. Public photos are optional and curated. NosLog is not a public photo feed or review
    gallery.
15. UI locale and Arcade country are independent. Native official venue identity,
    local time, local currency, and country-appropriate directions are preserved.

## Approved Information Hierarchy

### Discovery Entry

Use one semantic `main` and the following mobile-first source order:

1. page identity and concise purpose;
2. venue search, region scope, and user-triggered `Near me`;
3. active result summary and compact filter/sort access;
4. accessible result list;
5. map-view entry and synchronized map context;
6. concise empty, permission, stale-data, and failure recovery where applicable.

On wide layouts the list and map may be composed side by side, but source order and
keyboard order must remain understandable without the visual split.

### Arcade Detail

Use the following information priority:

1. official/native venue name and region;
2. NOSTALGIA availability summary and scoped last verification;
3. open-now/today hours and distance where reliable and available;
4. primary Directions action;
5. total and available cabinet counts, per-cabinet state, and play price;
6. address and map context;
7. optional phone and official website;
8. optional curated entrance and cabinet-area photos;
9. full weekly hours;
10. condition notes and useful visit notes;
11. publishable preferred-user aggregate and secondary preferred-Arcade action;
12. contextual correction or cabinet-issue report.

Omit an absent optional field rather than displaying a wall of `Not registered` rows.
Unknown operational facts that materially affect a trip remain explicit as `Unknown`
or `Not recently verified`; they are not silently omitted like optional contact data.

## Discovery, Search, Filter, and Sort Contract

### Shared Result Set

- Search name, reviewed localized name, approved aliases, region, locality, and address.
- Apply the same text query, region, explicit geographic bounds, open-now filter, and
  available-cabinet filter to both list and map.
- A result count describes this shared set. Do not let the list report no results while
  unrelated map markers remain visible.
- Preserve the entered query while the user inspects results or changes filters. Do not
  clear it when a marker is selected.
- Region choice and current map bounds are different concepts. A chosen region may
  establish initial bounds; subsequent map exploration changes results only after
  `Search this area`.

### Default and Optional Sorting

- Without a query or current-location context, sort by region then locale-aware venue
  name for a stable, explainable catalog.
- With a query, prioritize text relevance, then region and name.
- After a successful `Near me` request, default to distance from the user for the
  current session.
- Offer compact optional sorting for Name and Preferred users. Offer Distance only
  when a user location or explicit origin exists.
- Do not default to Preferred-user order. Early and uneven samples would distort
  discovery and make the baseline difficult to explain.
- Sorting is one compact control or part of one `Filter and sort` disclosure. Do not
  create a permanent row of sort buttons.

### Filters

- Primary approved filters are `Open now` and `Available cabinet`.
- `Open now` includes only venues with sufficiently structured, verified hours that
  evaluate as open in the Arcade's local IANA time zone. Unknown hours do not pass.
- `Available cabinet` includes only venues with at least one cabinet explicitly marked
  `available`. Unknown availability does not pass.
- The default catalog does not hide unknown or closed venues. Filters are explicit
  user choices and remain easy to clear.
- Keep filters in one compact disclosure and summarize active filters near the result
  count. Do not accumulate permanent chips for every operational attribute.

### Near Me

- Present `Near me` as an explicit action, never an automatic permission request.
- Explain the immediate purpose before or with the browser prompt when needed.
- Use location only in the active browser context to center/search, compute distance,
  and enable distance sort.
- Do not save exact coordinates in the user profile, analytics payload, URL, report, or
  server log beyond unavoidable infrastructure behavior.
- On denial, timeout, unsupported browser, or insecure context, preserve search and
  manual region controls with concise recovery text.
- Current location and preferred Arcade are different. Do not infer or update one from
  the other.

## Map and List Coordination Contract

### Map Quantity Model

- At country/large-region or otherwise overlapping scale, cluster nearby venue markers.
  Cluster label/size represents number of Arcades, not preferred users.
- At a zoom where individual venues can be distinguished, use one marker per Arcade.
- For individual markers, preferred-user proportional size is optional but approved.
  Use a fixed national data scale, minimum base marker, maximum cap, and area-aware
  proportional encoding rather than rescaling every current filter to its own maximum.
- Counts below `3` and zero/unknown preference use the same base marker and do not
  reveal the hidden count.
- A legend or accessible explanation distinguishes clusters, individual preference
  markers, hidden-small-sample/base markers, and selection.
- Do not use marker size as the only selected state. Do not use color alone for
  availability, condition, preferred status, or selection.

### Selection and Navigation

- Selecting a list result selects and reveals the same marker without discarding the
  current query or filters.
- Selecting a marker selects the same list result or preview. It does not auto-scroll
  the full document unpredictably.
- Mobile marker selection opens a compact preview sheet with venue name, concise
  availability, distance when known, and the route to full detail. Preserve visible
  map context behind the sheet.
- Desktop marker/list selection updates a detail preview panel beside the map.
- Opening full detail navigates to `/[locale]/gamecenter/[arcade-slug]` and updates
  browser history.
- Browser Back restores useful discovery state: query, region, filters, sort, list/map
  mode, selected venue, and map bounds when feasible.
- Direct links and refreshes reproduce the same public detail without requiring the
  discovery page to be visited first.

### Mobile and Desktop Discovery Composition

- Compact layout is list-first and provides one clear `Map view` action. Do not add a
  bottom navigation or permanent competing List/Map tab bar solely for this page.
- The mobile map is a focused alternate view of the same result state, with an obvious
  return to the list and preserved controls/state.
- Wide layout uses synchronized list and map regions simultaneously when content space
  permits.
- Do not duplicate a full map inside every expanded result. Full venue detail belongs
  to the stable detail route; previews remain concise.

## Arcade Detail Route and Action Contract

### Stable Route

- Keep `/[locale]/gamecenter` as the family entry.
- Add one stable `/[locale]/gamecenter/[arcade-slug]` route per active public Arcade.
- Slugs must remain shareable and must not expose unstable list indexes.
- Unknown, inactive, or removed Arcade destinations return a localized not-found
  state without leaking internal moderation data.
- Where an Arcade has been renamed or merged, preserve an approved redirect or alias
  strategy rather than silently losing shared links.

### Primary and Secondary Actions

- `Directions` is the primary action. It opens a country-appropriate external map or
  directions provider using trusted coordinates and address.
- `Set as preferred Arcade` is secondary and requires authentication. It updates the
  user's single preferred Arcade after clear success or recoverable failure feedback.
- `Report information` is a secondary contextual utility and requires authentication
  under the existing Feedback ownership model.
- Optional phone and official website use their native actions and are omitted when
  absent.
- Do not turn address copy, website, preferred state, and report into several visually
  equal primary buttons.

## Cabinet Availability and Condition Contract

### Two Independent Dimensions

Every active cabinet record has an identifier/label and an availability value:

| Availability  | Meaning                                                                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `unknown`     | The current ability to play has not been verified recently enough.                                                      |
| `available`   | The cabinet is powered/operational and can be played.                                                                   |
| `unavailable` | The cabinet cannot currently be played because it is broken, under maintenance, powered down, or otherwise unavailable. |

Only an `available` cabinet may carry a playable condition value:

| Condition | Meaning                                                                              |
| --------- | ------------------------------------------------------------------------------------ |
| `unknown` | Playable, but no reliable recent key/judgment assessment exists.                     |
| `good`    | No known input or judgment issue.                                                    |
| `normal`  | Minor wear or sensitivity variation exists, but ordinary play is generally possible. |
| `caution` | Playable, but an input or judgment issue can materially affect record-focused play.  |

- `unavailable` is not a condition grade.
- `normal` and `caution` require a concise explanatory condition note.
- `good` must not claim laboratory precision; it means no known issue in the verified
  community/administrator context.
- Derive total and available cabinet counts from active cabinet children. Do not keep
  an independently editable total that can contradict them.
- Deactivate a removed cabinet rather than hard-deleting its report and verification
  history.
- Use deterministic default labels such as `Cabinet 1`, `Cabinet 2`; administrators
  may replace them with useful venue labels such as `Left cabinet` or `Window cabinet`.

### Compact and Detailed Presentation

- Compact list/preview summary example: `2 of 3 available · Includes caution cabinet`.
- Detail exposes every active cabinet separately, for example:
    - `Cabinet 1 · Available · Good`
    - `Cabinet 2 · Available · Caution` plus its input/judgment note
    - `Cabinet 3 · Unavailable · Under maintenance`
- If every cabinet is `unknown`, say that availability is unverified rather than
  showing `0 available`.
- Never reduce cabinet state to color-only dots. Availability, condition, label, and
  note remain available as text.

## Operating Information and Verification Contract

### Operating Facts

- Store structured weekly hours and explicit exceptional closure/holiday information
  when available. Do not parse a free-text note to power `Open now`.
- Evaluate `Open now` using the Arcade's IANA time zone, including overnight hours.
- Store play price with currency code and local credit/coin meaning. Do not convert it
  to Korean won for global venues.
- Preserve address components sufficient for country-appropriate display and search.
- Optional phone and official website are contact facts, not required placeholders.

### Verification Meaning

- Separate `updated_at` from public verification facts.
- Verification records identify what was checked, when, and by which trust class
  without publicly exposing private reporter identity.
- A cabinet verification updates only the cabinet/availability/condition scope that
  was checked. A price edit does not make old cabinet status look newly verified.
- Public copy names the scope, such as `Cabinet information verified 3 days ago` or
  `Hours not recently verified`, rather than one ambiguous `Updated` label.
- Verification may come from an authorized on-site check or another approved trusted
  source. A raw user report is pending evidence, not verification.
- Stale thresholds may vary by information type in future operations policy, but the
  interface must distinguish recent, stale, and unknown without fabricating precision.

## Preferred Arcade and Community Context

- One authenticated user may select one preferred Arcade, consistent with the current
  profile setting.
- Preferred count is an anonymous aggregate. Never expose the member list through the
  public Arcade page.
- Publish the exact count only at `3` or more. Below that threshold, omit the number or
  use concise `Collecting preference data` copy without revealing `1` or `2`.
- The list/detail may show factual `Preferred by N users` when publishable.
- Preference affects the optional individual map bubble size and a user-requested sort,
  not default result order or a quality score.
- Do not infer attendance, current presence, queue length, skill level, or endorsement.
- Do not assign a literal `hub` badge automatically in the initial 2.0 contract.
- Public Profile display of the user's preferred Arcade obeys the separate Profile
  privacy contract. Aggregation eligibility is independent of whether the individual
  profile field is public.

## Curated Photo Contract

- Public photos are optional and use only the following initial slots:
    1. one entrance/exterior representative image; and
    2. up to two NOSTALGIA cabinet or cabinet-area images.
- The Arcade detail remains complete when all slots are empty; omit the media region.
- Photos are administrator-curated public assets, not an unrestricted user gallery.
- Do not add ratings, likes, comments, social ordering, or an infinite photo feed.
- A private Feedback/correction image is evidence for moderation and is not republished
  automatically. Public reuse requires a separate explicit public-photo submission,
  rights confirmation, and consent.
- Reject or appropriately remove/crop images containing identifiable people, private
  information, unrelated copyrighted material, or misleading old cabinet context.
- Preserve meaningful alt text by slot purpose, but do not repeat adjacent venue names
  mechanically. Decorative crops use empty alt text.
- Show the capture/verification context where it materially prevents a stale photo
  from being mistaken for current cabinet evidence.

## Correction and Cabinet-Issue Reporting Contract

### Report Types and Target

Extend the existing authenticated Feedback workflow with Arcade context and structured
types:

- cabinet broken or unavailable;
- cabinet condition/input issue;
- cabinet count change;
- play price/credit change;
- business-hours change;
- location/address change; and
- other Arcade information.

- A cabinet report targets a specific active cabinet when known or `Unspecified
cabinet` when the reporter cannot identify it reliably.
- Prefill Arcade identity and current relevant fact; do not require the user to restate
  the entire venue in free text.
- Require a concise description. Preserve the existing optional private JPEG/PNG/WebP
  evidence limit of `4 MB` unless a later security contract supersedes it.
- Reports remain private to the reporter and authorized moderators except for the
  verified public correction applied afterward.

### Moderation and Lifecycle

- Submission never changes availability, condition, count, price, hours, address, or
  verification time automatically.
- An authorized moderator compares the report with trusted evidence, updates only the
  verified scope, and records a concise resolution.
- Multiple reports may support one correction but must not produce duplicate public
  cabinets or contradictory counts.
- Resolved private report material follows the existing six-month cleanup contract;
  the resulting public fact and non-identifying verification history may remain.
- Report failure preserves entered text and selected target where safe. Authentication
  expiry returns a recoverable login path without pretending the report was saved.

## Authentication and Permission Contract

### Signed Out

- Browse, search, map/list switch, `Near me`, filters, detail, directions, contact,
  photos, verification, and publishable preference aggregates remain public.
- Do not show a fabricated preferred state or reporter identity.
- A preferred/report action may explain that login is required, then preserve the
  current Arcade destination across authentication.

### Signed In

- The user can set or change one preferred Arcade.
- The user can submit a contextual correction or cabinet report and inspect only the
  user-facing outcome allowed by the shared Feedback contract.
- Authentication does not grant direct edit access or disclosure of other reporters.

### Administrator Boundary

- Public detail does not expose draft Arcades, inactive cabinets, private report
  evidence, moderator notes, reporter identity, or internal trust scoring.
- Administrator Arcade editing and report queues will receive their own later design
  treatment. This brief defines the public facts and moderation contract they must
  support, not their final UI.

## Loading, Empty, Error, Disabled, and Destructive States

| State                             | Required behavior                                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Initial discovery loading         | Preserve page identity and control geometry; use a concise list/map loading treatment without announcing every marker. |
| Shared results ready              | List count and map markers describe the same set.                                                                      |
| No search results                 | Show concise localized `No arcades found` and preserve query/filter controls and clear recovery.                       |
| No venues in map bounds           | Explain that no registered Arcade is in this area and retain `Reset area`/region recovery.                             |
| Map script/network failure        | Keep the complete accessible list and directions/address facts usable; do not replace the page with a map error.       |
| Location permission denied        | Preserve manual search/region controls and offer a concise retry only when useful.                                     |
| Location unavailable/timeout      | Keep the current catalog and explain that distance sort is unavailable.                                                |
| Unknown hours                     | Do not calculate `Open now`; display unverified hours context.                                                         |
| Unknown cabinet availability      | Do not show `0 available`; state that cabinet availability is unverified.                                              |
| Stale verification                | Keep the fact visible with stale context and a report path; do not silently treat it as current.                       |
| Inactive or unknown detail slug   | Localized not-found state with a path back to discovery.                                                               |
| Preferred save busy/success/error | Disable duplicate submit only for the relevant action, announce the result, and preserve detail state.                 |
| Report choose/submit/review error | Preserve safe input, identify the problem in text, and provide Retry or correction.                                    |
| Directions unavailable            | Keep address and copy/contact fallback; do not render a dead primary button.                                           |
| Optional photo absent             | Omit the photo region; do not render empty skeleton cards after loading completes.                                     |
| Cabinet deactivation              | Remove it from public active count while preserving authorized history; this is not a public destructive control.      |

## Responsive Contract

### Compact Layout

- Treat `390px` as the representative review canvas, not a fixed application width or
  universal breakpoint.
- Reflow to `320 CSS px` without document-level two-dimensional scrolling. The map
  itself may pan in two dimensions because that interaction is intrinsic, but all
  controls, previews, detail facts, and alternatives must reflow normally.
- Use list-first discovery with one `Map view` action and the same preserved result
  state.
- Marker selection uses a compact bottom sheet/preview; full content navigates to the
  stable detail route rather than expanding an entire result in place.
- Keep Directions reachable early in detail. Secondary actions must not crowd the
  primary fact/action area.
- Per-cabinet rows stack or reflow without abbreviating availability/condition into
  unexplained codes.
- Long Korean, Japanese, English, official venue names, addresses, and notes wrap
  without covering map controls or actions.

### Wide Layout

- Use a synchronized result list and map split when container width supports both.
- The selected Arcade may use a side preview while preserving surrounding map context.
- Full detail may use complementary columns for map/address and operational facts, but
  source order and reading order remain coherent.
- Do not simply enlarge mobile cards or retain a fixed phone-width shell.
- Cap line length for notes and reporting guidance while using additional width for
  comparison, cabinet rows, full weekly hours, and map context.

### Content-Driven Transitions

- Choose transitions from the minimum space needed for readable result identity,
  search/filter controls, map interaction, and detail actions—not device names alone.
- Test intermediate widths where the list/map split, preview sheet/panel, cabinet row,
  photo slots, or action composition changes.
- Short viewport height must not trap map/sheet controls or hide sheet dismissal and
  Directions.

## Accessibility Contract

- The list is a complete semantic alternative to the map. No venue or required action
  exists only as a marker.
- Provide one visible page heading, semantic regions for controls/results/map/detail,
  and a programmatic result count/summary that does not become noisy during every map
  movement.
- Search has a persistent label or accessible name; preserving placeholder alone is
  insufficient.
- Native or fully accessible controls operate search, region, filter/sort, `Near me`,
  `Search this area`, map/list switch, marker/list selection, sheet dismissal,
  Directions, preferred state, and report.
- Map markers are keyboard reachable in a logical order when the map library permits.
  The synchronized list remains the guaranteed keyboard path.
- Selection, preferred aggregate, open state, availability, condition, stale state,
  and report result never rely on color, shape, or marker size alone.
- Focus moves into an opened modal sheet/dialog only when it is modal, is trapped
  appropriately, and returns to the invoking marker/control on close. A nonmodal
  desktop panel must not steal focus unexpectedly.
- External directions, phone, and website actions have clear accessible names and
  external-context indication where needed.
- Map zoom/pan controls meet target-size and visible-focus requirements; custom
  gestures are never the only way to browse.
- Images use purpose-appropriate alt text. Repeated thumbnails do not create verbose
  duplicate names.
- Permission, validation, save, and report outcomes are announced concisely without
  excessive assertive live regions.
- Support 200% text zoom, reduced motion, keyboard-only use, high contrast, and screen
  reader reading order.

## Localization and International Location Contract

### Identity and Search

- Keep the official local/native Arcade name as the primary identity.
- When available, show a reviewed Korean, Japanese, or English translation,
  transliteration, or recognized alias as smaller secondary identity.
- Search official name, all reviewed localized names, approved aliases, and localized
  address fields. Do not automatically machine-translate a public venue name and
  present it as verified.
- Mark mixed-language strings with appropriate `lang` metadata where pronunciation or
  screen-reader behavior benefits.

### Country-Aware Data

Preserve at least:

- stable Arcade identifier and slug/redirect aliases;
- ISO country/region code;
- administrative area, locality, and country-appropriate address lines;
- coordinates and IANA time zone;
- currency code, amount, and local credit/coin semantics;
- official/native name and reviewed localized names/aliases;
- country-appropriate external map/directions provider identifiers; and
- optional phone and official website.

- UI locale does not rewrite country truth. A Japanese Arcade remains Japanese while
  surrounding labels may be Korean or English.
- Format times and dates for the UI locale while calculating them in the Arcade's time
  zone.
- Format price with its stored currency; do not silently convert exchange rates.
- Korea may use Kakao Maps first. Provider abstraction must allow Japan/global
  destinations without embedding `Kakao` in the product meaning or stable action label.
- Address order and line breaks adapt by country and locale. Do not store one
  Korea-shaped `region` string as the only international address structure.

## Runtime State Contract

| State group          | Values                                                                                    | Scope                    |
| -------------------- | ----------------------------------------------------------------------------------------- | ------------------------ |
| Authentication       | signed out, signed in, expired during action                                              | preferred/report actions |
| Discovery request    | initial loading, ready, empty query result, empty bounds, error                           | list and map             |
| Geographic context   | default country/region, chosen region, explicit map bounds, nearby origin                 | query and restoration    |
| Location permission  | idle, requesting, allowed, denied, unavailable, timeout                                   | nearby/distance          |
| Display composition  | compact list, compact map, wide synchronized split                                        | responsive UI            |
| Selection            | none, preview selected, full detail                                                       | map/list/history         |
| Sorting              | region/name default, relevance, distance, name, preferred count                           | list/result state        |
| Filters              | none, open now, available cabinet, combined                                               | shared result set        |
| Hours                | structured open, structured closed, exceptional closure, stale, unknown                   | Arcade detail/filter     |
| Cabinet availability | unknown, available, unavailable, inactive                                                 | each cabinet             |
| Cabinet condition    | unknown, good, normal, caution, not applicable                                            | available cabinet        |
| Verification         | recent, stale, unknown, pending report, moderator-applied                                 | fact scope               |
| Preferred state      | hidden-small-sample, publishable aggregate, current user's preferred, save busy/error     | marker/list/detail       |
| Photo state          | absent, entrance present, cabinet photo(s), load error, removed                           | detail                   |
| Report               | idle, composing, attachment selected, submitting, submitted, validation error, auth error | contextual feedback      |
| Localization         | native name only, reviewed localized name, native fallback, localized address             | identity/content         |
| External action      | directions available, provider fallback, address-only fallback                            | detail                   |

Do not collapse result loading, map loading, location permission, cabinet availability,
verification, preferred save, and report submission into one page-wide `status`.

## Implementation Mapping

| Concern            | Current source                                                                                                                                               | Downstream requirement                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Public entry       | [`app/(nevigation)/gamecenter/page.tsx`](<../../app/(nevigation)/gamecenter/page.tsx>)                                                                       | Preserve localized entry and add stable localized Arcade-detail routes and metadata                                                          |
| Discovery UI       | [`components/gamecenter/gamecenterExplorer.tsx`](../../components/gamecenter/gamecenterExplorer.tsx)                                                         | Replace accordion-only detail with shared list/map result state, nearby, explicit area search, compact filter/sort, and route restoration    |
| Distribution map   | [`components/gamecenter/arcadeBubbleMap.tsx`](../../components/gamecenter/arcadeBubbleMap.tsx)                                                               | Separate count clusters from fixed-scale preferred bubbles; add accessible selection, legend, preview, and synchronized filtering            |
| Duplicate mini-map | [`components/gamecenter/arcadeMiniMap.tsx`](../../components/gamecenter/arcadeMiniMap.tsx)                                                                   | Use map context in stable detail where useful; do not duplicate a full map in every discovery result                                         |
| Hours              | [`components/gamecenter/arcadeBusinessHours.tsx`](../../components/gamecenter/arcadeBusinessHours.tsx), [`lib/arcadeDetails.ts`](../../lib/arcadeDetails.ts) | Add local-time evaluation, exceptional closures, verification scope, overnight handling, filters, and KO/JA/EN states                        |
| Region model       | [`lib/arcadeRegions.ts`](../../lib/arcadeRegions.ts)                                                                                                         | Replace Korea-only label assumptions with country/admin-area/locality data while preserving Korean launch values                             |
| Public queries     | [`lib/arcades.ts`](../../lib/arcades.ts)                                                                                                                     | Support shared query/filter/sort/detail data, publishable preference threshold, and per-scope freshness without leaking private state        |
| Arcade schema      | [`prisma/schema.prisma`](../../prisma/schema.prisma) `Arcade`                                                                                                | Normalize country, address, timezone, currency, contact, localized identity, photo slots, scoped verification, and stable slug/aliases       |
| Cabinets           | Current single `machine_count`, `machine_status`, and `status_note`                                                                                          | Add active per-cabinet children or an equivalent normalized model with label, availability, condition, note, and verification; derive counts |
| Preferred Arcade   | `User.preferred_arcade_id` and [`app/(nevigation)/gamecenter/actions.ts`](<../../app/(nevigation)/gamecenter/actions.ts>)                                    | Preserve one preference, apply privacy-safe aggregation threshold, recoverable auth, and profile privacy separation                          |
| Reports            | Current Feedback models/actions and private image flow                                                                                                       | Add Arcade ID, optional cabinet ID, structured type, scoped moderation, no auto-publish, and existing private retention/security guarantees  |
| Public photos      | Current public Blob infrastructure; no Arcade photo model                                                                                                    | Add only curated entrance plus up-to-two cabinet slots, rights/consent, alt text, removal, and no private-evidence republishing              |
| Localization       | [`lib/i18n/messageCatalogs`](../../lib/i18n/messageCatalogs)                                                                                                 | Add complete KO/JA/EN discovery, permission, filter, detail, cabinet, verification, photo, report, and error copy plus native-name handling  |
| Directions         | Current Kakao link construction in `gamecenterExplorer.tsx`                                                                                                  | Use a stable generic Directions action and country/provider adapter with coordinate/address fallback                                         |
| Browser tests      | Current Playwright locale/responsive coverage                                                                                                                | Add list/map sync, permissions, route restoration, cabinet states, small-sample privacy, stale data, map failure, and multi-country fixtures |

## Representative Fixtures

Validate at least:

1. South Korean launch catalog with Seoul, regional city, and sparse-region venues;
2. future Japanese venue with long native Japanese name, reviewed Korean/English alias,
   Japanese address order, JPY price, and `Asia/Tokyo` time zone;
3. future global venue with a long Latin-script name, non-KRW currency, overnight
   hours, and country-appropriate Directions provider;
4. empty query, partial name, localized alias, full address, no result, and search
   punctuation/whitespace;
5. default region/name order, query relevance, successful distance order, name order,
   and preferred-user order;
6. `Open now` and `Available cabinet` separately and together, with unknown facts not
   passing the filters;
7. location idle, allowed, denied, timeout, unsupported, and retry/manual fallback;
8. map pan before and after explicit `Search this area`, plus restored bounds on Back;
9. zero, one, two, three, medium, and high preferred counts proving the threshold and
   fixed national scale across two regions;
10. overlapping low-zoom clusters and separated individual markers without semantic
    confusion;
11. one good available cabinet; three cabinets with good, caution, and unavailable;
    all availability unknown; and a deactivated historical cabinet;
12. required notes for normal/caution, missing note validation, and unavailable without
    a condition grade;
13. recent cabinet verification, stale hours, unknown price verification, and an
    unrelated administrator edit that does not refresh public facts;
14. structured weekly hours, overnight close, holiday closure, unknown hours, optional
    phone/website, and address-only Directions fallback;
15. no photos, entrance only, all three approved slots, image load failure, and rejected
    private-evidence reuse;
16. signed-out preferred/report actions, signed-in preference change, report against a
    known cabinet, unspecified-cabinet report, attachment failure, moderator-applied
    correction, and six-month private evidence cleanup;
17. map script failure while the complete list and external Directions remain usable;
18. inactive/renamed Arcade slug, redirect alias, unknown slug, and direct refresh;
19. Korean, Japanese, and English UI around the same native Arcade identity;
20. `320px`, representative `390px`, intermediate widths, wide desktop, short
    viewport, 200% text zoom, reduced motion, keyboard-only, and screen-reader use.

## Browser Acceptance Contract

- `/ko/gamecenter`, `/ja/gamecenter`, and `/en/gamecenter` expose equivalent public
  discovery behavior and localized metadata.
- Every active Arcade has a stable localized detail path; direct links, refresh, detail
  round trips, and browser Back preserve or restore useful discovery state.
- Text query, region, explicit bounds, `Open now`, and `Available cabinet` produce the
  same list and map result set. No unrelated marker remains when the list is empty.
- `Near me` never prompts on load, works only after user action, does not persist exact
  coordinates server-side, and recovers to manual controls after denial or failure.
- Panning alone does not replace results; `Search this area` does so explicitly and
  exposes a recoverable previous/region context.
- Low-zoom clusters encode Arcade count; individual bubbles encode publishable
  preferred count on one fixed scale; selection does not depend on size.
- Counts `1` and `2` are not exposed or distinguishable from the base small-sample
  marker. Count `3` and above may be shown exactly.
- Mobile is list-first with a synchronized focused map view and compact marker preview;
  wide layouts use meaningful list/map comparison space.
- Detail communicates official/native identity, NOSTALGIA availability, verification,
  local hours/distance, Directions, cabinet count/state, price, address, and optional
  supporting facts in the approved order.
- Total and available counts equal active per-cabinet data. `unavailable` is never
  rendered as a playable condition grade, and normal/caution always retain text notes.
- All-unknown availability does not appear as zero available. Stale and unknown facts
  do not appear recently verified or pass explicit filters.
- User reports do not alter public facts before moderation, preserve private evidence
  authorization, and update only the verified fact scope after approval.
- Private Feedback evidence never appears in a public photo slot without separate
  rights and consent. Missing public photos leave no empty media shell.
- Native names, reviewed aliases, address order, local time zone, currency, and
  country-appropriate Directions remain correct across Korean, Japanese, and English UI.
- A map failure leaves the full list, address, operational facts, and external
  Directions usable.
- At `320 CSS px`, no search/filter control, result, sheet, long name/address, cabinet
  row, action, photo, note, report field, or error creates document-level horizontal
  overflow, clipping, or overlap.
- Wide layouts do not retain a fixed phone-width shell and do not duplicate a full map
  inside every result.
- All primary controls and actions work with keyboard alone, expose visible Focus, and
  retain a coherent reading order. State never depends on color, marker size, or map
  position alone.
- Tested normal and failure flows produce no unexpected console error, hydration issue,
  stale cross-route selection, precise-location leak, private reporter leak, duplicate
  preference/report submit, or contradictory cabinet count.

## Reference Matrix

| Source                                                                                                                                              | Transferable principle                                                                      | NosLog application                                         | Limitation                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------- |
| [Current Arcade entry](<../../app/(nevigation)/gamecenter/page.tsx>)                                                                                | Establishes public/auth boundaries and current data flow                                    | Grounds observed implementation                            | Current layout and route set are not 2.0 authority                        |
| [Current Arcade explorer](../../components/gamecenter/gamecenterExplorer.tsx)                                                                       | Shows region, map, text search, list, preference, and detail expansion                      | Preserves useful functions and identifies state divergence | Client-only accordion and query-clearing behavior are superseded          |
| [Current Arcade schema](../../prisma/schema.prisma)                                                                                                 | Establishes current aggregate status and preferred relation                                 | Grounds migration requirements                             | Cannot represent per-cabinet truth or global location data                |
| [Approved IA](./02-information-architecture.md)                                                                                                     | Keeps Arcades an independent Play-support destination                                       | Preserves navigation meaning                               | Does not define locator anatomy                                           |
| [Approved Home brief](./03-home-page-brief.md)                                                                                                      | Keeps a direct Arcade shortcut after higher-priority product tasks                          | Preserves discoverability                                  | Does not define Arcade search defaults                                    |
| [Approved Profile brief](./09-profile-page-brief.md)                                                                                                | Treats preferred Arcade as user-controlled public profile metadata                          | Aligns preference/privacy result                           | Does not define aggregate map encoding                                    |
| [Google Locator Plus best practices](https://developers.google.com/maps/solutions/store-locator/best-practices)                                     | Nearby stores, distance, details, and directions form a locator core                        | Supports nearby, distance, and primary Directions          | Retail conversion goals differ from play-support needs                    |
| [Google Store Finder architecture](https://developers.google.com/maps/architecture/ui-kit-store-finder)                                             | Coordinates own location data, map viewport, list, and place detail                         | Supports synchronized shared result state                  | Google UI Kit is not mandatory implementation                             |
| [Google Product Locator](https://developers.google.com/maps/solutions/product-locator/best-practices)                                               | Availability filtering, nearest locations, and marker differentiation aid trip planning     | Supports available-cabinet filter and directions           | Product stock is not cabinet condition                                    |
| [Mapbox React store locator](https://docs.mapbox.com/help/tutorials/building-a-store-locator-react/)                                                | A list and map can share selection and geographic search state                              | Supports explicit result coordination                      | Tutorial styling is not NosLog authority                                  |
| [Apple Maps HIG](https://developer.apple.com/design/human-interface-guidelines/maps)                                                                | Compact/full place cards adapt to context, preserve map context, and avoid duplicate detail | Supports mobile preview sheet and desktop panel            | Apple platform components are not copied literally                        |
| [Material bottom sheets](https://m2.material.io/components/sheets-bottom)                                                                           | A sheet can expose contextual map detail without replacing spatial context                  | Supports compact marker preview                            | Older Material guidance does not define final NosLog styling              |
| [Kakao marker clustering](https://apis.map.kakao.com/web/sample/basicClusterer/)                                                                    | Dense nearby markers need clustering                                                        | Supports low-zoom Arcade-count clusters                    | Sample does not define accessibility or preference encoding               |
| [ArcGIS proportional symbology](https://pro.arcgis.com/en/pro-app/latest/help/mapping/layer-properties/proportional-symbology.htm)                  | Quantitative symbols require consistent scales and correct area perception                  | Supports fixed national preferred-user scale               | GIS desktop guidance needs web simplification                             |
| [Mapbox data-driven styling](https://docs.mapbox.com/help/glossary/data-driven-styling/)                                                            | Feature values can drive bounded symbol properties                                          | Supports capped preference encoding                        | Capability alone does not justify a metric                                |
| [KONAMI NOSTALGIA locator](https://p.eagate.573.jp/game/facility/search/p/list.html?area=AR-03&finder=area&gkey=NOSTALGIA&paselif=false&pref=JP-24) | Official discovery starts from game, area, and venue facts                                  | Preserves game-specific existence context                  | Official list does not provide key condition or community preference      |
| [SEGA CHUNITHM locator](https://location.am-all.net/alm/location?gm=104)                                                                            | Region and current-location search are useful; installation and hours may be stale          | Supports explicit freshness and nearby fallback            | CHUNITHM network state does not map to NOSTALGIA cabinet condition        |
| [Bandai Namco facility search](https://bandainamco-am.co.jp/spot/search/)                                                                           | Venue and installed-game discovery are separate but related tasks                           | Supports Arcade identity plus NOSTALGIA-specific facts     | Operator taxonomy is broader than NosLog scope                            |
| [Musecat](https://musecat.app/en)                                                                                                                   | Rhythm-game users need game filters, cabinet counts, edits, and fault reports               | Supports per-cabinet/report direction                      | Multi-game community scope is broader than NosLog                         |
| [Musecat Arcade detail](https://musecat.app/en/arcade/iylk7rpc99fcklb)                                                                              | Photos, units, price, faults, hours, contact, and history coexist in one venue record       | Supports detail facts and limited photos                   | Community completeness and trust vary by venue                            |
| [Zenius-I-vanisher](https://zenius-i-vanisher.com/v5.2/arcade_machine.php)                                                                          | Long-lived community databases preserve venue/game-machine context                          | Supports global-ready Arcade/machine relationships         | Legacy density and moderation are not visual authority                    |
| [OpenStreetMap `check_date`](https://wiki.openstreetmap.org/wiki/Key:check_date)                                                                    | A checked date is distinct from an arbitrary edit date                                      | Supports scoped public verification                        | OSM tag conventions do not define NosLog trust policy                     |
| [OpenStreetMap `survey:date`](https://wiki.openstreetmap.org/wiki/Key:survey%3Adate)                                                                | On-site survey provenance can communicate freshness                                         | Supports on-site verification class                        | Publicly exposing contributor identity is not adopted                     |
| [Google Suggest an edit](https://blog.google/products-and-platforms/products/maps/support-small-business-with-google-maps/)                         | Community corrections benefit from review before public place facts change                  | Supports moderated reports                                 | Google's moderation system is not available to NosLog                     |
| [MDN Geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)                                                                 | Geolocation is permission-gated and secure-context dependent                                | Supports explicit nearby action and failure states         | API behavior does not define product retention policy                     |
| [Google Maps localization](https://developers.google.com/maps/documentation/javascript/localization)                                                | Map language and region are independent, and region affects local behavior                  | Supports UI-locale/country separation                      | NosLog may retain Kakao in Korea rather than adopting Google globally now |
| [MDN `Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)                   | Dates/times can be formatted by locale and explicit time zone                               | Supports local `Open now` and localized presentation       | Structured hours and time zone data are still required                    |
| [MDN `Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)                       | Currency values can preserve currency while adapting locale formatting                      | Supports local price display without conversion            | It does not supply exchange rates or arcade credit meaning                |
| [Apple Place Card cover photo](https://support.apple.com/guide/business/about-the-cover-photo-abcb139fcd45/web)                                     | A curated representative place image aids identification                                    | Supports one optional entrance image                       | Business-managed imagery differs from community evidence                  |
| [WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                                              | Required content reflows at 320 CSS px without two-dimensional page scrolling               | Grounds compact layout acceptance                          | The intrinsic map remains a justified two-dimensional region              |
| [Minnesota accessible interactive maps](https://mn.gov/mnit/assets/Accessibility%20Guide%20for%20Interactive%20Web%20Maps_tcm38-403564.pdf)         | Interactive maps require text alternatives, keyboard access, and nonvisual meaning          | Grounds complete list alternative and map controls         | Local government examples are not product styling authority               |
| [USWDS Search](https://designsystem.digital.gov/components/search/)                                                                                 | Search requires clear labeling, predictable submission, and accessible state                | Supports persistent query and clear results                | General site search does not define geographic bounds                     |

### Evidence Convergence

- Official and production locator sources converge on area/text/current-location
  discovery, distance, coordinated list/map context, compact selected-place detail,
  and Directions. None supports clearing the query or leaving unrelated markers when
  the list filters.
- Cartographic sources converge on separating count clusters from proportional data
  symbols and keeping a stable interpretable scale. They do not justify rescaling every
  sparse region so its maximum looks nationally important.
- Rhythm-game community sources converge on cabinet-level counts/issues, recent
  community maintenance, and venue photos as meaningful trip-planning data. They do
  not justify live occupancy claims, unrestricted social galleries, or replacing
  administrator verification with raw reports.
- Freshness and official-locator warnings converge on separating a check/survey from
  generic edit time and exposing uncertainty. They do not choose NosLog's operational
  stale thresholds.
- Place-card and photo references converge on compact previews and representative
  identification imagery. Privacy and scope require NosLog to limit public slots and
  keep report evidence private unless separately consented.
- Localization references converge on independent language, region, local time zone,
  and currency data. A Korea-shaped name/address/price model cannot support approved
  Japan/global expansion safely.
- Accessibility references converge on a complete list alternative, keyboard paths,
  non-color state, reflow, and recoverable permission/map failures.
- Preferred-user threshold `3`, one-user-one-preference meaning, fixed national scale,
  no automatic hub badge, per-cabinet condition vocabulary, public photo slot count,
  and report lifecycle are approved NosLog product decisions; external sources inform
  but do not dictate them.

## Rejected and Superseded Alternatives

- **Map-first mobile with persistent List/Map tabs — Rejected:** mobile is list-first
  with one map action and preserved shared state; no new bottom navigation is added.
- **Fixed narrow mobile shell on desktop — Rejected:** wide layouts use synchronized
  list/map comparison space.
- **List search independent from map — Superseded:** both represent one active result
  set.
- **Automatically refresh results on every map pan — Rejected:** explicit `Search this
area` preserves control and prevents unexpected churn.
- **Request location on page load — Rejected:** nearby is user initiated with manual
  fallback and no exact-location persistence.
- **Default sort by preferred users — Rejected:** uneven early aggregates must not
  control baseline discovery.
- **Permanent rows of sort/filter chips — Rejected:** one compact disclosure preserves
  hierarchy while primary search/region/nearby remain visible.
- **Scope-relative bubble scaling — Superseded:** one fixed national scale prevents one
  sparse-region preference from looking like a national hub.
- **Use bubble size for selection — Rejected:** selection and quantity require
  different visual semantics.
- **Expose preferred counts `1` and `2` — Rejected:** exact aggregates below `3` remain
  hidden.
- **Automatic `hub`/`sacred place` badge — Rejected:** preference count is context, not
  a quality or live-attendance award.
- **One aggregate machine status — Superseded:** availability and playable condition
  are per-cabinet independent dimensions.
- **Treat unavailable as a condition grade — Rejected:** it is availability; only
  available cabinets can have good/normal/caution/unknown condition.
- **Delete removed cabinets — Rejected:** deactivation preserves report and verification
  history.
- **Show generic `Updated` as freshness — Rejected:** only scoped verification
  communicates checked operational facts.
- **Raw report instantly changes public state — Rejected:** moderator verification is
  required.
- **Expanded full detail and second map inside every result — Superseded:** preview
  remains compact and full detail uses a stable route.
- **Equal visual priority for every detail action — Rejected:** Directions is primary;
  preference and reporting are secondary.
- **Unrestricted user photo gallery/reviews — Rejected:** 2.0 uses one entrance and up
  to two cabinet-area curated slots, without ratings or social feed.
- **Republish private report evidence automatically — Rejected:** separate rights and
  public consent are required.
- **Korea-only region/name/currency schema — Rejected:** launch data may be Korean, but
  the contract is Japan/global-ready.
- **Calculate open state in the viewer's time zone — Rejected:** use the Arcade's IANA
  time zone and local structured hours.
- **Convert all prices to KRW — Rejected:** preserve local currency and credit meaning.

## Decision Log

| ID        | Decision                                                                                                                     | Status     |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------- |
| ARCADE-01 | Keep Arcades an independent Play-support destination and Home shortcut                                                       | `Approved` |
| ARCADE-02 | Serve a shared public discovery entry plus stable localized detail routes                                                    | `Approved` |
| ARCADE-03 | Use one synchronized list/map result state for query, region, bounds, and filters                                            | `Approved` |
| ARCADE-04 | Make mobile list-first with one map action and wide layouts a list/map split                                                 | `Approved` |
| ARCADE-05 | Require explicit `Search this area` after map movement                                                                       | `Approved` |
| ARCADE-06 | Make `Near me` user initiated, session-scoped, and nonpersistent                                                             | `Approved` |
| ARCADE-07 | Use stable region/name, query relevance, and nearby distance defaults with compact optional sorts                            | `Approved` |
| ARCADE-08 | Provide `Open now` and `Available cabinet` in one compact filter/sort disclosure                                             | `Approved` |
| ARCADE-09 | Use Arcade-count clusters at broad scale and individual preferred-user bubbles at sufficient zoom                            | `Approved` |
| ARCADE-10 | Use one fixed national preferred scale; never rescale every region to its own maximum                                        | `Approved` |
| ARCADE-11 | Hide exact preferred aggregates below `3`, distinguish selection from size, and omit automatic hub badges                    | `Approved` |
| ARCADE-12 | Keep one user-selected preferred Arcade and treat its aggregate as preference, not live busyness                             | `Approved` |
| ARCADE-13 | Give each active cabinet an availability value independent from playable condition                                           | `Approved` |
| ARCADE-14 | Use condition values unknown/good/normal/caution only for available cabinets and require notes for normal/caution            | `Approved` |
| ARCADE-15 | Derive total/available count from active cabinet records and deactivate removed cabinets                                     | `Approved` |
| ARCADE-16 | Separate scoped public verification from administrator edit time and raw reports                                             | `Approved` |
| ARCADE-17 | Prioritize native identity, availability/freshness, hours/distance, Directions, cabinets, price, and address                 | `Approved` |
| ARCADE-18 | Make Directions primary; keep preferred Arcade and report as secondary contextual actions                                    | `Approved` |
| ARCADE-19 | Add optional phone and official website and omit absent optional fields                                                      | `Approved` |
| ARCADE-20 | Extend authenticated Feedback with Arcade/cabinet context and structured correction types without auto-publish               | `Approved` |
| ARCADE-21 | Preserve optional private evidence and six-month resolved cleanup; never expose reporter identity publicly                   | `Approved` |
| ARCADE-22 | Allow one curated entrance photo and up to two curated cabinet-area photos, with no public gallery or review feed            | `Approved` |
| ARCADE-23 | Never republish private correction evidence without separate public rights and consent                                       | `Approved` |
| ARCADE-24 | Launch with Korean data while preserving country, address, timezone, currency, native/localized name, and provider expansion | `Approved` |
| ARCADE-25 | Keep native official name primary, reviewed localized identity secondary, and search both                                    | `Approved` |
| ARCADE-26 | Calculate open state in the venue's time zone and format local currency without exchange conversion                          | `Approved` |
| ARCADE-27 | Preserve a complete accessible list alternative, 320 CSS px reflow, keyboard paths, and non-color state                      | `Approved` |

## Handoff Boundary

The active high-fidelity design stage may determine final type scale, visual hierarchy, surfaces, map style,
cluster and marker artwork, preference legend, sheet/panel geometry, list-card anatomy,
action styling, cabinet-row composition, photo crops, spacing, grid tracks, responsive
transition values, and motion after Foundation approval. It must preserve the shared
result state, explicit location/area actions, fixed-scale and privacy-safe preference
meaning, stable detail navigation, approved information order, per-cabinet state
semantics, verification/report lifecycle, limited photo policy, international data
meaning, accessibility, and acceptance criteria.

The future Codex implementation session must compare the final approved Figma output with this brief.
It must request a guide or design revision before implementing any result that splits
map/list truth, auto-prompts location, defaults to popularity, exposes small preference
counts, uses region-relative bubbles, implies live occupancy, collapses cabinet
availability and condition, treats edit time as verification, lets reports auto-publish,
hides Directions, expands full detail inside every result, publishes private evidence,
adds an unrestricted review/gallery surface, assumes Korean location formats globally,
or leaves required information accessible only through the map.
