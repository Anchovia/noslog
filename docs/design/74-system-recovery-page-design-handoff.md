# 74 · System-Recovery States Design Handoff — 2026-08-28

This document hands the approved system-recovery high-fidelity design and its Figma
verification evidence to a later implementation session. It does **not** replace
[document 19](./19-system-recovery-states-page-brief.md), which remains the normative
product and behaviour brief. Where this handoff conflicts with document 19, document 19
governs and this document is wrong.

- Status: `Approved high-fidelity Figma design and design validation complete`
- Implementation status: `Not started in this design session`
- Figma file: `NosLog v2.0.0` — `cVbWCxhkfxFfHmAKLCyKrD`
- Product page: `P7 · System Recovery 조립`
- Decision page: `Z1 · 결정 기록` — approved `151`, pending `0`

---

## 1. Figma node map

`12` sections, `78` frames: `320: 12`, `390: 42`, `768: 12`, `1280: 12`.

Six states are drawn at each width, in Light and Dark:

| Frame                     | Shell    | Composition                                                         |
| ------------------------- | -------- | ------------------------------------------------------------------- |
| `Not found`               | Ordinary | `h1` + one sentence + Home, and nothing else                        |
| `페이지 오류`             | Ordinary | `h1` + one sentence + `다시 시도` primary + `홈으로 이동` secondary |
| `페이지 오류 · 재시도 중` | Ordinary | The primary action in its busy label                                |
| `치명적 오류`             | Minimal  | NosLog identity + `h1` + sentence + retry + Home                    |
| `점검 · 종료 예정 있음`   | Minimal  | Adds expected end and last-updated rows + `다시 확인`               |
| `점검 · 종료 예정 없음`   | Minimal  | The same page with the timing rows absent                           |

`390` additionally carries the Korean base set, a representative Skip-link focus frame,
and Japanese and English sections in both modes.

The ordinary shell is `AppHeader` + `main` + `OrdinaryFooter`. The minimal shell is a
`NosLog` wordmark and `main` only: no header, no footer, no More panel, as
`RECOVERY-09` and `RECOVERY-12` require.

### Component created

`SkipLink` — `103×36`, fill `content/default`, label `surface/canvas`,
`radius/control 4`, padding `8 / 12`, `control` type. It carries the focused appearance
only, because the link sits outside the viewport until it receives focus. The height is
derived from the current implementation's `py-2` plus a `control` line, and every value
is inside the approved spacing scale.

---

## 2. Approved decisions

### 2.1 Skip link — draw it as its own component

Document 19 requires a first-focusable Skip link on the ordinary shell and document 15
puts a skip route in the shell contract, yet **no page in this file had ever drawn one**.

The wording needed no invention: `skip.main` already exists in all three locales, and
`components/layout/skipLink.tsx` already fixes the form — an inverted pill at top left
that slides in on focus. The component reproduces that in 2.0 tokens.

Placement follows `SHELL-31`: one representative focused control per shell rather than a
focused variant of every focusable target. The instance therefore appears in a single
Light/Dark pair of frames and is absolutely positioned, so no other frame's render
changes. It does not appear on the minimal shell.

Reusing the `Button` component instead was rejected: document 19 distinguishes native
links from native buttons, and borrowing a button's shape for a link blurs that.

### 2.2 Busy actions — label, not a disabled control

Document 19 requires a busy state that is programmatically determinable, prevents
duplicate activation, and **does not remove the button label**. `Button` has twenty
variants across four styles and five states, and none of them is Busy.

The retry action in its busy state therefore keeps the ordinary Primary appearance and
changes its label to `다시 시도 중`, the `{action} 중` form the repository already uses
in eighteen places including `settings.saving`, `feedback.submitting` and
`sync.regenerating`. Contrast is `8.06:1` in Light and `8.61:1` in Dark.

Drawing busy as `State=Disabled` was **rejected**: the label falls to `1.41:1`, and a
busy control is not an inactive one, so WCAG's inactive-component exemption does not
apply.

**Adding a real `State=Busy` variant is deliberately deferred**, not dismissed. Doing it
properly needs a progress-indicator contract, and document 24 has no such concept; it
would also widen the variant axis from twenty to twenty-four and affect every page. That
is a Foundation decision, not a decision this page family should make alone.

### 2.3 Wide layout

`768` uses a `720` measure and `1280` a `768` measure — `container/reading` — inside the
ordinary margins, left-aligned. This satisfies document 19's requirement that wide
layouts take a larger readable measure without freezing the `390` canvas or adding a
second column. Footers follow the `840` threshold, so only `1280` uses `Layout=Wide`.

### 2.4 Copy

Almost everything came from the repository in all three locales: `common.notFoundTitle`,
`common.notFoundDescription`, `common.pageError`, `common.retryLater`, `common.retry`,
`common.goHome`, `common.login`, `skip.main`, `maintenance.heading`,
`maintenance.description`.

Five strings are **new and need three-locale approval**. Each follows an existing
pattern rather than inventing a voice:

| Korean                          | Japanese                         | English                 | Basis                                                          |
| ------------------------------- | -------------------------------- | ----------------------- | -------------------------------------------------------------- |
| `NosLog을 불러오지 못했습니다.` | `NosLogを読み込めませんでした。` | `Could Not Load NosLog` | Document 19's `Could not load NosLog`; `common.pageError` form |
| `다시 확인`                     | `再確認`                         | `Check Again`           | Document 19 separates this from `Try again`                    |
| `다시 시도 중`                  | `再試行中`                       | `Retrying`              | The `{action} 중` form used across the repository              |
| `점검 종료 예정`                | `メンテナンス終了予定`           | `Expected end`          | Document 19's optional expected-end field                      |
| `최종 업데이트`                 | `最終更新`                       | `Last updated`          | `tiers.updated` uses `업데이트` / `更新` / `Updated`           |

---

## 3. Final Figma validation

| Check                       | Result                                         |
| --------------------------- | ---------------------------------------------- |
| Frames by width             | `320: 12`, `390: 42`, `768: 12`, `1280: 12`    |
| Spacing outside the scale   | `0`                                            |
| Text without a style        | `0`                                            |
| Hardcoded fills and strokes | `0`                                            |
| Horizontal overflow         | `0`                                            |
| Section escape              | `0`                                            |
| Nodes loose on the page     | `0`                                            |
| Light contrast              | `273` measured, minimum `8.06:1`, failures `0` |
| Dark contrast               | `273` measured, minimum `8.61:1`, failures `0` |
| Korean left in JA/EN frames | `0`                                            |

### Not executed — not a pass

- `360`, `430`, `1024` and `1440` widths. Document 19 asks for `320`, `390`, a
  representative intermediate, and `1280`; `768` is that intermediate.
- Japanese and English exist at `390` only.
- Short viewport heights, safe areas, `200%` and `400%` zoom.
- The Skip link is drawn in its focused state only; its off-screen resting position and
  the slide-in are behaviour, not a static frame.

---

## 4. Runtime checks deferred to implementation

Everything in document 19's browser and automated acceptance contract remains
unverified here, and in particular:

- real `404` status and `noindex` for unmatched routes and safe missing resources;
- `503`, `no-store`, and a truthful `Retry-After` for maintenance, plus the
  locale-consistent API payload that replaces today's Korean-only JSON;
- first-paint locale correctness in the fatal boundary, with no English flash;
- retry busy semantics, duplicate-activation prevention, and result announcement;
- context preservation on successful retry, and the rule never to claim unverified
  persistence;
- one `main` and one `h1` per state, skip-link focus order, and descriptive localized
  document titles;
- the absence of any digest, payload, private route, or fabricated reference code.

---

## 5. Scope boundary and open items

This handoff completes the system-recovery design stage only.

1. **Five new strings** need three-locale approval — section 2.4.
2. **`Button State=Busy`** is deferred and needs a progress-indicator contract in
   document 24 before it can be added.
3. **Maintenance timing data** is drawn with representative values. Document 19 requires
   the fields to come from maintained operational data and to be omitted when unknown;
   the design shows both the known and unknown cases and decides nothing about storage.
4. **Skip link on P1–P6.** The component now exists, but the earlier page families were
   built without it. Whether to add a representative focused frame to each of them, or to
   treat P7's as the file's single representative, was not decided.

## Post-handoff correction — 2026-09-01

The forty-two ordinary-shell frames (`Not found` · `페이지 오류` · `재시도 중` at every
width, mode, and locale) had no viewport floor — the footer sat directly under the
short recovery copy at heights of 352–440. This document is silent on floors and its
validation never claimed one, so the frames were judged against the shell they share
with every other page family (which now holds the floor on P1/P2/P5/P6/P8/P10): all
forty-two now hold the 844 floor with `main` filling the remainder. The minimal-shell
frames (`치명적 오류` · `점검`) have no footer, so a floor changes nothing visually and
they were deliberately left untouched.
