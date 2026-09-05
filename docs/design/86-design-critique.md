# 86 · Design critique — NosLog 2.0 Figma file (excluding Z1)

**Date** 2026-09-04 · **Nature** opinion, not compliance. Nothing in the file was changed.
Every item below is a suggestion for the user to accept or reject; the file already passes
the rule audits (docs 84, 85).

**What was looked at** — representative frames of every page rendered at 0.35–0.5×: Home
390/1280 (+Dark), Music Detail 390/1280 (+Dark), Discovery 390/1280, Tier 390/1280, Rankings
390/1280, Profile 390/1280 (+Dark 1280), Data Sync, Login, Settings 390/1280, Exams 390/1280,
Bingo list/detail, Arcades, Announcements, Recovery.

**References** — live today: v-archive.net (home, DB), osu! beatmapset page (cover-led hero,
difficulty row, right stat rail); osu! rankings did not render. Measured earlier in this
project and reused: GitHub · Spotify · Stack Overflow · Notion · Dropbox · Twitch (login
composition), MS Learn · AWS · Coursera · LeetCode · Khan · chess.com (wide layouts), Spotify
tracklist, Osekai · op.gg · osu!sig · github-readme-stats (share cards), Carbon · Spectrum ·
Primer · Atlassian · Material 3 · Polaris · Radix · Mantine · Vercel Geist (system docs),
NN/g skeleton and heuristics, Apple HIG progress indicators. Impeccable / Sailop slop
catalogues (doc 85). Two independent AI reviews (Codex) converged on one point that shapes the
first item below: the product's uniqueness lives in its information structure, and its visual
identity is thin.

---

## 1. Identity — the one thing that would change how the whole product reads

| #   | Observation                                                                                                                                                                                              | Suggestion                                                                                                                                                                                                                                                                                                                     | Evidence                                                                                                                                                                                                                                     |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | The brand is a letter `N` in a 1 px ring plus the word "NosLog" set in the body face. It appears on Home, the header, Login, 404 and the share card, and nowhere does it carry a personality of its own. | Commission or design a **logotype**: the wordmark in a distinctive face (not the UI font), and a mark that survives at 20 px in the header. Keep the ring — it is already the recurring motif — but make it _drawn_, not a default circle.                                                                                     | Codex: "N 링 → 서비스명 → 검색 → 타일 구성은 어느 포털에나 이식 가능"; Impeccable "single font for everything / overused font" fire on brand surfaces; v-archive's home opens with a heavy custom logotype and reads as a product instantly. |
| 1.2 | The share card (P16) now has a gold ring-and-band motif that exists nowhere in the product UI. The product UI is entirely neutral; gold only lives on the avatar ring in the card.                       | Adopt the **gold ring as the product's single brand motif** — used sparingly on empty, sparse and brand surfaces only: Login, 404/recovery, "기록 없음" states, the Home identity block. Never on controls (primary stays neutral, `RPA-A`). Two or three quiet appearances make the card and the product feel like one thing. | Login 390 is ~60 % empty canvas; Recovery 390 is ~70 % empty; both are exactly where GitHub (octocat 404), Spotify (brand-colour login) and Notion place a brand moment.                                                                     |
| 1.3 | Home 1280: the identity block (ring, name, tagline) stacks vertically and pushes search below the first 200 px; on 390 the three-line stack is fine.                                                     | On Wide, set the identity **inline** (mark + wordmark + tagline in one row) so search rises into the first view.                                                                                                                                                                                                               | Home Wide 1280 render: ring 54 + name 32/40 + tagline 14/20 + 24 gaps ≈ 180 px before the field. MS Learn / AWS / Coursera put search at the top edge.                                                                                       |

## 2. Music Detail — let the jacket lead — **REJECTED 2026-09-04 (Z1 ㉑, user: 현행 유지)**

| #   | Observation                                                                                                                                                       | Suggestion                                                                                                                                                                                           | Evidence                                                                                                                                                                                               |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1 | The hero is text-led: a 96 px jacket beside title/artist/actions. On Wide the jacket is a small grey square in a 1216 px row.                                     | At Wide, make the jacket the hero: 160–200 px art, or a blurred full-bleed art band behind the title (the share-card "media blur" device rejected for the card fits here). Keep the 96 compact rule. | osu! beatmapset (today): cover art fills the header, title on top, difficulty row and a stat rail at right. v-archive song pages: large jacket first. Doc 05's 96 was a compact decision (2026-08-12). |
| 2.2 | Wide 1280 two-column: the left column (chart info + radar + judgement + records) runs far below the right rail (기본 정보 only), leaving a tall empty right side. | Move 내 기록 요약 / 서열 위치 / 기본 정보 into the right rail and make it sticky, so both columns end near each other.                                                                               | Impeccable quality rule "one column stretches the first viewport"; osu!'s right rail carries stats + status for the whole page height.                                                                 |

## 3. Difficulty language — one grammar instead of two

| #   | Observation                                                                                                                                                                                                                                                     | Suggestion                                                                                                                                                                                            | Evidence                                                                                                                                                               |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | Result rows (C6) show four difficulty numbers with 12×2 colour bars — at 1× the bars read as hairlines and the numbers are 12 px `metadata`. Exams (P13) show difficulty as **coloured text** (`difficulty/text-*`, `EXAM-32`). Two grammars for the same fact. | Bring the C6 row cells to the P13 grammar: level numbers in the difficulty text ramp (14 `metric-value`), bar removed or kept as the 2 px top accent only. Same for Tier cards and Profile play rows. | User's own rejection of "AI chip" markers in P13; NOSTALGIA in-game shows difficulty as coloured type; discovery rows in the render show the bars as almost invisible. |

## 4. Empty placeholders make finished pages look unfinished

| #   | Observation                                                                                                                                                                          | Suggestion                                                                                                                                                                                                                | Evidence                                                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | Tier 390 (compact view) is a column of grey squares — cards show only the empty-jacket icon, no title. With real art it becomes a jacket wall; without it, the page reads as broken. | Nothing to change in the contract, but **populate 3–5 jackets with real art in one representative frame per page** for review/handoff, so reviewers see the intended texture. The file has flag and grade images already. | v-archive tier pages are jacket grids; the empty-slot convention (2026-08-13) was made for Dark visibility, not for review. |
| 4.2 | Bingo list covers use warm grey placeholders (deliberate). Same effect.                                                                                                              | Same.                                                                                                                                                                                                                     | —                                                                                                                           |

## 5. Smaller, page-local improvements

| #   | Page          | Observation → suggestion                                                                                                                                                                                                                                                         |
| --- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5.1 | Rankings 390  | Rows are uniform; the top three carry no emphasis at all (podium was rejected for shared-rank reasons, `RANK-22`). A **bold rank number for 1–3** costs nothing and keeps the list semantics.                                                                                    |
| 5.2 | Profile 390   | The identity block packs avatar 64, name, four badges, three meta rows and sync line into ~150 px; it is the densest region in the product. Consider dropping the exam badges into the summary strip (they are already implied by grade) or giving the meta rows 8 → 12 spacing. |
| 5.3 | Announcements | 15 dated rows with no grouping; a month/year separator (GitHub releases, Notion changelog) would give the list rhythm without new components — the `section-title` band header from P4 already exists.                                                                           |
| 5.4 | Settings 1280 | The category rail + one form leaves ~60 % of the width empty; acceptable (GitHub settings does the same) but the form could sit in a 640 reading column rather than 768 to shorten radio rows.                                                                                   |
| 5.5 | Login         | See 1.2 — also, the language selector at the very bottom is the only control besides the Discord button; GitHub and Spotify keep it in the footer too, so no change beyond the brand moment.                                                                                     |
| 5.6 | Data Sync     | Text-led by contract (doc 13) and the GIF placeholders are grey boxes; when the real GIFs exist, cap them at 320 wide with a thin `border/default` frame so they don't read as screenshots of the page itself.                                                                   |
| 5.7 | Arcades       | The map placeholder is Kakao-styled; the list below repeats name / count / distance nicely. Consider showing the **selected arcade's photo** in the list row (P12 detail has a photo grid) — rows with a 64 thumbnail would match the music rows' grammar.                       |

## 6. What already works and should not be touched

- Information density and structure on Profile 1280 and Exams 1280 (grade rail) are the most
  product-specific screens in the file; both reviews named them as where NosLog's identity lives.
- Dark mode is consistent across every page rendered (surface ramp, overlay borders, data colours).
- The neutral primary and restrained colour use are deliberate (`RPA-A`, `NI-A`) and pass every
  slop rule; do not add colour to controls to "add personality" — put it in the brand instead (§1).

## 7. Priority

1. **1.1 + 1.2** (logotype + gold motif on sparse surfaces) — the only change that alters
   the product's overall impression; everything else is refinement.
2. **2.1** (jacket-led Music Detail hero at Wide) — the biggest single-screen upgrade.
3. **3.1** (one difficulty grammar) — consistency; touches C6, P3, P4, P6.
4. **4.1** (real art in representative frames) — costs an afternoon, changes how every page is judged.
5. §5 items as time allows.

## User disposition — 2026-09-05

This explicit user decision supersedes the proposal status and priority order
above. Original critique text remains intact as evidence.

| User ID                            | Original item                                                             | Decision              | Scope                                                                                                                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-1                                | 5.1 Rankings                                                              | Approved              | Bold the published rank numeral for ranks 1–3, including all players sharing an eligible rank. Preserve the existing single ranked list.                                                        |
| D-3                                | 5.3 Announcements                                                         | Approved              | Add localized year/month headings to chronological archive groups while retaining every title/date, order, and existing pagination.                                                             |
| D-7                                | 5.7 Arcade thumbnail                                                      | Approved in principle | Use a 64px venue-photo thumbnail. Ordinary result rows versus selected-venue preview scope is awaiting the user's clarification; no thumbnail mutation is authorized beyond the resolved scope. |
| All other critique recommendations | Other items in this document and all improvement proposals in document 87 | Rejected              | The user retained only D-1, D-3, and D-7. Do not recover the remaining suggestions or former priority orders as pending work.                                                                   |

This decision is for downstream Figma design. Application implementation is a
separate stage. The six completed design-guide blocks remain complete.

### Delivery status for the adopted items — 2026-09-05

- D-1: Applied and verified in Figma P5. See document 71 for the 231 rank-text
  changes across 77 frames and the complete rank-condition preservation check.
- D-3: Applied and verified in Figma P11. See document 78 for 54 month headings
  across 14 non-empty archives and preservation of all 174 existing rows.
- D-7: No Figma mutation yet; the user has been asked whether thumbnails belong
  in all photo-bearing result rows or only the selected-venue preview.

### User disposition update — 2026-09-06

- **4.1 (C · representative art) — Approved** on the Z1 ㉒ specimen (b). This
  supersedes the 2026-09-05 rejection of the "representative-artwork" proposals in
  document 87. Applied to the default Light + Dark frames of P1, P3, P4, P6, P13
  (`DISC-46` and the page handoffs). 4.2 (bingo covers) stays as drawn — no bingo
  cover art exists in the repository.
- **D-1** — implementation corrected to the `emphasis-label` Text Style (document 24
  correction); the emphasis rule itself stands.
- **D-3** — stands as applied on 2026-09-05 (`section-title` group headings, brief 14).
  The Z1 ㉒ specimen had drawn the heading at `emphasis-label` 14/20; that is outside
  the composite's two approved roles, so the applied form is the one that stands.
- **D-7 scope resolved** — all discovery result rows (`ARC-DV-02`), applied.
