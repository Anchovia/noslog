# NosLog 2.0 Chart-Editor Contribution Page Brief

## Document Control

- Status: `Approved`
- Date approved: 2026-08-03
- Canonical language: English
- Korean companion:
  [20-chart-editor-contribution-page-brief.ko.md](./20-chart-editor-contribution-page-brief.ko.md)
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Related chart-viewer contract:
  [07-chart-viewer-page-brief.md](./07-chart-viewer-page-brief.md)
- Related privacy contract:
  [18-privacy-data-practices-page-brief.md](./18-privacy-data-practices-page-brief.md)
- Scope: signed-in user contribution to the official NosLog chart, personal drafts,
  review submission, administrator review, publication, credit, responsive authoring,
  and recovery states
- Excluded: a public alternate-chart catalog, real-time multi-user coauthoring, broad
  administrator redesign, and Recital dynamics authoring

## Purpose and Success

The user-facing editor lets any signed-in user help create or improve the one official
NosLog chart for a Music difficulty. It reuses the proven administrator editor core,
but replaces direct publication with a controlled review workflow.

Success means that an author can safely create, resume, preview, revise, and submit a
chart without losing work or uploading audio; an administrator can review an immutable
submission and publish it without destroying the previous canonical revision; and a
viewer can trust that public charts remain administrator-approved NosLog charts.

## Current-Product Evidence

- [`ChartPattern`](../../prisma/schema.prisma) currently allows one canonical pattern
  per chart through a unique chart relationship.
- The current editor route is administrator-only and the server actions enforce the
  administrator role.
- [`chartTimingEditor.tsx`](../../components/admin/chart-pattern/chartTimingEditor.tsx)
  already provides timing, note, local-audio, preview, history, revision, import, and
  export behavior worth reusing.
- The current `.noslog-chart.json` boundary excludes audio, while local MP3 playback
  remains inside the browser.
- The published viewer consumes a canonical published chart rather than choosing from
  a public collection of user variants.

These are implementation observations. The approved contract below requires a new
author-owned draft and submission model rather than weakening administrator checks on
the current actions.

## Approved Product Invariants

1. Every signed-in user may author; no separate creator application is required.
2. The contribution is for the official NosLog chart, not a separate community chart.
3. A user may have one active personal draft per chart and one active review submission
   per chart. Different users may contribute to the same chart independently.
4. Authors may start blank or copy the current published revision as their base.
5. Authors can read and change only their own drafts and submissions.
6. Submission creates an immutable snapshot. Later draft edits do not mutate it.
7. Only an administrator may publish or replace the canonical chart.
8. Approval preserves the previous canonical revision and rollback history.
9. Accepted contributor credit is public after advance disclosure at submission.
10. Local audio never leaves the browser. Only validated, versioned chart data reaches
    NosLog storage.
11. Real-time multi-user coauthoring is outside NosLog 2.0.
12. The current editor and viewer remain Basic-only; Recital dynamics follow the
    Future Work contract in the Exam brief.

## Entry, Access, and Ownership

- Entry is chart-scoped from Music detail or another approved chart context. The final
  locale-prefixed slug may be chosen during implementation, but it must never expose an
  `/admin` route.
- Signed-out entry carries a validated same-origin locale, path, and query through
  Login, then returns to the same chart contribution intent.
- Missing onboarding fields follow the approved completion gate and return contract.
- The UI identifies the Music, difficulty, published base revision, draft owner, save
  state, and review state without relying on color alone.
- An unavailable or unsupported chart uses a concise disabled or Not-found state; it
  must not create an empty draft accidentally.

## Draft and Revision Contract

### Creation and Base

- The first entry offers two explicit choices when a published chart exists: start
  from the published revision or start blank. With no published chart, blank is the
  only valid base.
- Store the base canonical revision identifier so later publication changes can be
  compared instead of silently overwritten.
- Creating a new draft when one already exists resumes that draft rather than making a
  duplicate.

### Editing

- Preserve the current timing, BPM, meter, offset, note, hand, width, path, local
  audio, metronome, preview, undo/redo, autosave, revision, import, and export tools.
- The public contribution shell may reorganize controls responsively, but it must not
  remove authoring capability or change chart semantics.
- Autosave reports `Saving`, `Saved`, `Offline`, `Conflict`, and `Failed` distinctly.
  Use optimistic concurrency; never resolve a conflict by silently discarding either
  version.
- Manual revision labels and restore remain available for the author's own draft.
- Import validates schema/version and previews destructive replacement before apply.
  Export contains chart data only.

## Review Submission Contract

- The primary terminal action is **Submit for review**, never **Publish**.
- Before submission, validate schema, timing integrity, supported note types, and
  required metadata. Validation errors identify the affected location and preserve the
  draft.
- The confirmation explains that the submitted snapshot becomes read-only, accepted
  contribution credit is public, and local audio is not submitted.
- One active submission per author and chart may be `Submitted` or `Changes requested`.
  The author may withdraw it; withdrawal does not delete the personal draft.
- The author may continue a separate working draft while review is pending, but the
  pending snapshot and reviewer context do not change.
- A change request contains reviewer guidance and lets the author create the next
  submission from their latest draft or the reviewed snapshot. Rejection records a
  concise reason and ends that review attempt.

## Administrator Review and Publication

- Review is a necessary administrator workflow, not a broad redesign of the admin
  product. It must show submission metadata, base revision, validation results,
  contributor, preview, and a meaningful diff or comparison where possible.
- Reviewer actions are `Request changes`, `Reject`, and `Approve and publish`.
- If the canonical chart changed after the submission base, require an explicit stale
  base warning and comparison. Never publish through last-write-wins behavior.
- Approval creates a new canonical published revision, preserves the previous
  canonical revision and rollback history, records reviewer and contributor
  provenance, and closes the active submission atomically.
- Rollback creates another auditable canonical transition; it does not erase the
  accepted submission or historical credit.

## Information and Action Hierarchy

1. Chart identity and contribution/review state.
2. Main chart canvas and time-navigation context.
3. High-frequency authoring tools.
4. Selection-specific properties.
5. Playback, local audio, preview, and validation.
6. Save/revision history and import/export.
7. Submission action and disclosure.

Do not turn every tool into a persistent top-level button. Preserve the existing
workspace logic while grouping secondary and selection-dependent controls
contextually.

## Responsive and Workspace Contract

- The document shell reflows without page-level horizontal scrolling at `320 CSS px`.
  The time/pitch canvas is a genuine two-dimensional workspace and may use clearly
  bounded local scrolling.
- Use `390px` as a representative compact review canvas, not a fixed editor width.
- Left, right, and bottom tool regions may collapse, dock, scroll internally, and be
  resized within tested minimum and maximum bounds. Drag handles require keyboard or
  explicit non-pointer alternatives and an accessible reset.
- Preserve the user's working position, selection, playback time, and open tool context
  when panels resize or the viewport changes.
- Wide layouts should use added space for the canvas, simultaneous properties, history,
  and comparison—not merely enlarge controls.
- Full authoring remains available, but compact layouts may recommend landscape or a
  wider screen when precision improves; the recommendation must not block recovery,
  export, or submission-state inspection.

## Accessibility and Localization

- Canvas interactions require keyboard-operable equivalents, visible focus, textual
  selection feedback, and non-color note/hand identification.
- Resizers expose role, current value, limits, and keyboard increments. Touch targets
  and overlapping handles meet WCAG 2.2 target and focus requirements.
- Playback and autosave announcements are concise and do not continuously interrupt
  assistive technology.
- Dialogs trap and return focus correctly; destructive import replacement and
  submission withdrawal require clear consequences.
- Korean, Japanese, and English labels may wrap or reflow without truncating state,
  validation, or reviewer guidance. Domain identifiers and chart JSON keys remain
  stable technical terms.

## State Contract

| State                 | Required behavior                                                                  |
| --------------------- | ---------------------------------------------------------------------------------- |
| Initial load          | Skeleton or progress preserves chart identity; no editable empty canvas flashes    |
| New/resumed draft     | Clearly distinguish blank, based-on-published, and resumed work                    |
| Saving/offline        | Keep local interaction available where safe and expose retry/reconnect status      |
| Conflict              | Preserve both versions and require an explicit resolution path                     |
| Validation failure    | Keep draft and navigate to actionable errors                                       |
| Submitted             | Lock the snapshot, show status, allow safe withdrawal, keep working draft separate |
| Changes requested     | Show guidance and a clear revise/resubmit path                                     |
| Rejected              | Show concise reason and preserve personal work                                     |
| Approved/published    | Link the canonical viewer and show accepted contributor credit                     |
| Permission lost       | Stop mutation, preserve recoverable local work, and provide a safe exit            |
| Missing/deleted chart | Use the shared recovery contract without leaking another author's draft            |

## Data and Security Requirements

- Add author-owned draft, draft revision, immutable submission snapshot, review event,
  and publication provenance entities. Do not overload the single canonical
  `ChartPattern` row with concurrent personal state.
- Enforce ownership and role checks in every server action and query; hiding controls
  is not authorization.
- Validate and normalize chart JSON server-side, limit payload size and submission
  frequency, and keep an audit trail for review and canonical transitions.
- Do not accept MP3, remote audio URL, executable content, or arbitrary HTML in chart
  payloads.
- Cache and viewer invalidation occurs only after an atomic canonical publication.

## Release Blockers

| ID       | Unresolved release requirement                                                                                   | Status            |
| -------- | ---------------------------------------------------------------------------------------------------------------- | ----------------- |
| EDIT-B01 | Legally reviewed contributor terms covering rights, warranties, moderation, and public credit                    | `Release blocker` |
| EDIT-B02 | Account-deletion policy for personal drafts/submissions versus preserved canonical chart history and attribution | `Release blocker` |
| EDIT-B03 | Operational abuse limits, report/escalation path, and administrator review-queue policy                          | `Release blocker` |

These blockers may be represented in downstream flows as explicitly marked pending
requirements. They must not be filled with invented legal or moderation copy.

## Reference Matrix

| Reference                                                                                                                                                              | Transferable principle                                                | NosLog use                                       | Limitation                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------- |
| [osu! Beatmap submission](https://osu.ppy.sh/wiki/en/Beatmapping/Beatmap_submission)                                                                                   | Authoring and publication are distinct stages                         | Separate personal work from official publication | osu! categories and ranking policy are not copied |
| [osu! Beatmap categories](https://osu.ppy.sh/wiki/en/Beatmap/Category)                                                                                                 | Published status conveys review meaning                               | Keep one trusted canonical chart                 | NosLog has no public alternate catalog            |
| [osu! Modding](https://osu.ppy.sh/wiki/en/Modding)                                                                                                                     | Review feedback must point to actionable chart context                | Support change requests and resubmission         | Community moderation scale differs                |
| [GitHub pull-request reviews](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews) | Approve, request changes, and comment are separate outcomes           | Model explicit review results                    | Source code review is not chart authorship        |
| [GitHub branches](https://docs.github.com/en/pull-requests/reference/branches)                                                                                         | Independent work should not mutate the published base                 | Personal drafts branch from a canonical revision | Git mechanics are not exposed to users            |
| [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges/managing-protected-branches/about-protected-branches)              | Privileged approval protects canonical state                          | Administrator-only publication                   | NosLog needs simpler roles                        |
| [Sanity roles](https://www.sanity.io/docs/user-guides/roles)                                                                                                           | Author and publisher permissions differ                               | Enforce server-side role boundaries              | Sanity role granularity is not adopted wholesale  |
| [Sanity drafts](https://www.sanity.io/docs/content-lake/drafts)                                                                                                        | Draft and published documents need distinct identities                | Keep personal work separate from canonical chart | Sanity's storage model differs                    |
| [Contentful roles](https://www.contentful.com/developers/docs/references/content-management-api/roles/)                                                                | Publishing is an explicit privileged action                           | Do not relabel user submit as Publish            | Enterprise CMS permissions are broader            |
| [Contentful environments](https://www.contentful.com/developers/docs/tutorials/general/managing-access-to-environments/)                                               | Isolated changes require deliberate promotion                         | Review before canonical replacement              | Environment cloning is not required               |
| [CKEditor collaboration](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/collaboration.html)                                                         | Real-time coauthoring adds presence, conflict, and history complexity | Defer it from 2.0                                | Text collaboration differs from chart timing      |
| [Notion sharing and permissions](https://www.notion.com/help/sharing-and-permissions)                                                                                  | Ownership and access must remain understandable                       | Authors see only their own work                  | Workspace sharing is out of scope                 |
| [SharePoint coauthoring](https://support.microsoft.com/en-us/office/collaborate-on-sharepoint-pages-and-news-with-coauthoring-91d7dc25-37c3-44a4-99da-f552e0f9cfe9)    | Concurrent editing needs explicit save/conflict behavior              | Justifies optimistic concurrency                 | Microsoft publishing roles are not copied         |
| [Confluence collaborative editing](https://developer.atlassian.com/cloud/confluence/collaborative-editing/)                                                            | Draft recovery and conflict handling are first-class                  | Preserve both versions on conflict               | Its synchronization stack is unnecessary          |
| [Figma team file organization](https://www.figma.com/best-practices/team-file-organization/)                                                                           | Current work and approved assets need clear status                    | Make chart/review state visible                  | File organization is only an analogy              |
| [Google Docs version history](https://support.google.com/docs/answer/190843?hl=en_)                                                                                    | Named history supports recovery and accountability                    | Preserve author and canonical revisions          | Collaborative text editing differs                |
| [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)                                                                   | Deny by default and check authorization on every request              | Enforce author/admin boundaries server-side      | It does not define product hierarchy              |

## Rejected Alternatives

- **Expose the administrator editor directly — Rejected:** its actions grant canonical
  publication authority and do not isolate personal work.
- **Create a public user-chart catalog — Rejected:** the approved purpose is official
  chart contribution and the viewer retains one trusted canonical chart.
- **Let votes or submissions auto-publish — Rejected:** administrator review remains
  accountable and preserves domain quality.
- **Mutable pending submission — Rejected:** review must refer to a stable snapshot.
- **Real-time multi-user editing in 2.0 — Deferred:** it adds unresolved presence,
  merge, ownership, and moderation complexity without being necessary for contribution.
- **Upload author audio — Rejected:** it violates the product audio boundary.

## Decision Log

| ID      | Decision                                                                     | Status     |
| ------- | ---------------------------------------------------------------------------- | ---------- |
| EDIT-01 | Reuse the existing editor core for signed-in official-chart contribution     | `Approved` |
| EDIT-02 | Allow every signed-in user one active personal draft per chart               | `Approved` |
| EDIT-03 | Permit blank or current-published bases and record the base revision         | `Approved` |
| EDIT-04 | Preserve current authoring, preview, revision, import, and export capability | `Approved` |
| EDIT-05 | Replace user Publish with immutable Submit for review                        | `Approved` |
| EDIT-06 | Allow one active submission per author/chart and independent contributors    | `Approved` |
| EDIT-07 | Limit canonical publication to administrators and preserve rollback history  | `Approved` |
| EDIT-08 | Make accepted contributor credit public after advance disclosure             | `Approved` |
| EDIT-09 | Keep local audio in the browser and store chart JSON only                    | `Approved` |
| EDIT-10 | Exclude a public alternate-chart catalog and real-time coauthoring           | `Approved` |
| EDIT-11 | Keep the 2.0 editor Basic-only and defer Recital dynamics                    | `Approved` |
| EDIT-12 | Require responsive docked/resizable tools and bounded local 2D scrolling     | `Approved` |

## Handoff Boundary

Claude Design may refine hierarchy, docking, tool grouping, status presentation, and
responsive composition, but must preserve every ownership, immutable-snapshot,
publication, audio, accessibility, and state rule above. It must not draw a community
catalog, expose administrator publication to authors, or present a release blocker as
resolved. The later Codex implementation session must design the data migration and
authorization model before reusing editor components or actions.
