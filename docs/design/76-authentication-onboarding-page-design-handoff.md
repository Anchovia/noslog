# 76 · Authentication and Onboarding — High-Fidelity Design Handoff

**Page family** P9 · Authentication and Onboarding
**Governing brief** [17-authentication-onboarding-page-brief.md](17-authentication-onboarding-page-brief.md)
**Figma page** `P9 · Auth & Onboarding 조립` (file `NosLog v2.0.0`, `cVbWCxhkfxFfHmAKLCyKrD`)
**Built** 2026-08-30 – 2026-09-01

---

## 1. What is in the file

12 sections, 74 frames, no page-level stray nodes.

| Section                                             | Frames  |
| --------------------------------------------------- | ------- |
| `Auth · Compact 390` / `· Dark`                     | 17 + 17 |
| `Auth · 320` / `768` / `1280`, each `· Dark`        | 4 × 6   |
| `Auth · 390 · JA · Light/Dark`, `· EN · Light/Dark` | 4 × 4   |

**Login — 9 states.** 기본 · 목적지 있음 · Discord 진행 중 · and six recovery states
(사용자 취소 · 요청 만료 · Discord 응답 실패 · 서비스 실패 · 세션 만료 · 목적지 거부).

**Onboarding — 8 states.** 기본 · 목적지 사유 · 입력됨 · 닉네임 중복 · 지역 미선택 ·
저장 실패 · 제출 중 · 긴 이름·아바타 없음.

### Shell

Both screens share one shell: `surface/canvas`, a vertically centred column of fixed
width (`358`, `288` at `320`), and a bottom area. No card, no split panel, no ordinary
footer, no header — `AUTH-24` restricts this family to identity plus trust content, and
`app/(auth)/layout.tsx` renders only the skip link.

---

## 2. Decisions realised here

| Decision                                                                         | Record                                                               |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `AUTH-29` — the Korean/Japanese/English copy set                                 | brief § _Korean, Japanese and English Copy_                          |
| `AUTH-30` — Discord brand surface (`brand/discord` + `brand/on-discord`)         | brief § _Discord action surface_; Foundation `BR-A`, `IC-06` amended |
| **`AUTH-31`** — centred column composition, measured against nine references     | brief § _Composition, measured_                                      |
| **`AUTH-32`** — the Login purpose line is removed                                | same                                                                 |
| **`AUTH-33`** — explicit language control; country/region never changes language | same                                                                 |
| **`AUTH-34`** — recovery states are one line above the action                    | same                                                                 |

New components created for this family: `Radio` (C4, 6 variants — dot `8` inside a `20`
box, mirroring `Checkbox` in every other respect).

---

## 3. Corrections made during the build

| What                                                       | Why it happened                                                                                                                                                                                             |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The first build used a **left-aligned, full-width** column | It was derived from P7's minimal recovery shell without measuring how login pages are actually composed. Nine references later showed a narrow centred column in every case                                 |
| `Icon/discord` instances were **squashed** to `20×15`      | The component is a `24×24` box holding a `23.75×18` mark; the `4:3` ratio is handled inside it. Resizing the instance non-uniformly distorted a brand mark, breaking `IC-06`. **Check: `width === height`** |
| The column collapsed to `10` tall on the first attempt     | `resize()` resets `primaryAxisSizingMode` to `FIXED`; the sizing mode must be set again afterwards                                                                                                          |
| The language control used `6` vertical padding             | Outside the approved spacing scale. Corrected to `12`, which also brings the control to `110×44`                                                                                                            |
| The copy carried three explanatory sentences               | Measured against GitHub (`200` chars, zero explanatory sentences), Dropbox (`64`), and Spotify (`225`, one legal line). Reduced to the subtitle plus one privacy sentence                                   |

---

## 4. Validation

```
A 레이아웃  spacing 위반 0 · 가로 넘침 0 · 섹션 이탈 0 · stray 0
            비정사각 아이콘 0 · 언어 컨트롤 110×44
B 타이포    Text Style 미적용 0 · JA/EN 잔여 한국어 0
C 색        하드코딩 0
            Light 402건 · 최저 4.61:1 · 실패 0
            Dark  402건 · 최저 4.61:1 · 실패 0
시각        1x 렌더 확인 — 390 Light/Dark · 320 온보딩 · 1280 로그인
```

The `4.61:1` minimum in both modes is white on Discord blurple. It is Discord's colour,
fixed by `BR-A`, and is not ours to adjust.

**Not executed — not a pass:**

- 200% and 400% text zoom reflow
- Keyboard order and focus behaviour through the onboarding form
- Screen-reader announcement of the recovery line and the busy state
- The seeded incomplete-profile browser specimen that `AUTH-27` requires
- Intermediate widths between `390` and `768`

---

## 5. Open items

1. **The onboarding avatar is a placeholder slot.** The Discord avatar is an external
   image; the frames show `Icon/user` in a `40` circle, which is also the documented
   fallback when the avatar is absent.
2. ~~The language control had only a trigger.~~ **Resolved 2026-09-01** — `Login · 390 ·
언어 메뉴 열림` (+ `· Dark`) adds the open listbox: the `DestinationPanel` overlay
   contract (`surface/overlay`, `border/default` 1px, radius 10, gap 4, pad 8,
   `elevation/overlay-light`/`-dark`), min-width equal to the 110 trigger, three
   options in their own scripts and locale styles, and the current option marked with
   `interaction/menu-set` plus `emphasis-label` — the same current-item language as
   the P10 rail (`SET-49`).
3. **`AUTH-32` removes a line the brief had required.** The brief is amended, but the
   localisation catalogue still has no key for the removed sentence, so nothing needs
   deleting downstream.
4. **Japanese and English copy for the new strings** — the connected-account label, the
   nickname and region explanations, and the six recovery lines — was written for this
   build and has not had a native review.
