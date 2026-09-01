# 77 · Settings and Account Management — High-Fidelity Design Handoff

**Page family** P10 · Settings & Account
**Governing brief** [16-settings-account-page-brief.md](16-settings-account-page-brief.md)
**Figma page** `P10 · Settings 조립` (file `NosLog v2.0.0`, `cVbWCxhkfxFfHmAKLCyKrD`)
**Built** 2026-09-01

---

## 1. What is in the file

12 sections, 96 frames, no page-level stray nodes.

| Section                                           | Frames                                                       |
| ------------------------------------------------- | ------------------------------------------------------------ |
| `Settings · Compact 390` / `· Dark`               | 8 + 8                                                        |
| `Settings · Compact 390 · 상태 스위트` / `· Dark` | 20 + 20                                                      |
| `Settings · 검증 320 (KO)` / `· Dark`             | 6 + 6                                                        |
| `Settings · Intermediate 768 (KO)` / `· Dark`     | 2 + 2                                                        |
| `Settings · Wide 1280 (KO)` / `· Dark`            | 4 + 4                                                        |
| `Settings · Compact 390 · JA`, `· EN`             | 8 + 8 (each: seven 390 screens + one 320 overview fit check) |

**Base 390 — 8 screens.** 개요 로그인 · 개요 게스트 · 화면 설정 · 프로필 변경 없음/있음 ·
공개 설정 · 연결 · 계정.

**State suite — 20 screens.** Form states (저장 중 · 저장 성공 · 닉네임 충돌 · 공개 설정
변경 있음 · 오락실 없음 · 오락실 이용 불가 · 연결 새로고침 중 · 세션 만료 · 저장 실패 ·
오프라인 · 프로필 로딩), overlays (이탈 경고 · 국가 변경 확인 · 로그인 계정 변경 확인 ·
선호 오락실 선택 레이어 · 아바타 크롭), and the deletion ladder (확인 초기 · 준비 완료 ·
처리 중 · 실패).

### Shell

Ordinary shell: `AppHeader` + `main` + `OrdinaryFooter`. Compact frames are `FIXED`
height with `main` filling to keep the footer at the 844 floor. Wide frames follow the
P8 shell precedent exactly — `main` padding `24/32/48/32`, 1216 content, footer
`Layout=Wide`, height `max(844, natural)`. Dialogs follow the P8 modal contract —
`surface/scrim` + a 334 card on `surface/overlay`, `border/default`, radius 10,
gap/pad 16, cancel-first actions.

---

## 2. Decisions realised here

| Decision                                                                     | Record                                            |
| ---------------------------------------------------------------------------- | ------------------------------------------------- |
| `SET-39/40/41` — copy set, category naming, overview rows                    | brief § _Korean, Japanese and English Copy_       |
| `SET-42` — back control = `Icon/chevron-left` 16 + label, 44 target          | brief Decision Log                                |
| `SET-43` — filled red delete button                                          | Foundation § _Filled destructive action_ (doc 24) |
| `SET-44` — `내 프로필 보기` link atop the save zone                          | brief Decision Log                                |
| `SET-45` — play-activity coupling helper line                                | brief Decision Log                                |
| `SET-46` — static overview summaries, not current values                     | brief Decision Log                                |
| `SET-47` — Intermediate keeps the drill-in; list-detail only at 1056+        | brief Decision Log                                |
| `SET-48` — Wide rail 292 (3col) + 16 + bounded 640 detail; no back link      | brief Decision Log                                |
| `SET-49` — current rail row = `interaction/menu-set` fill + `emphasis-label` | brief Decision Log                                |
| Second-pass copy (dialog bodies, groups, zoom, offline…)                     | brief § _Second pass — approved 2026-09-01_       |

**New in the design system**: `Button · Style=Destructive Filled` (5 states, C2 set now
25 variants; the outline `Destructive` is untouched, so every existing instance is
unchanged) and three alias tokens with **zero new primitives** —
`feedback/destructive-surface` (L `#C9372C` / D `#AE2E24`),
`feedback/destructive-surface-hover` (`#AE2E24` both modes; also the pressed face),
`feedback/on-destructive` (white both modes). The C2 `DARK VERIFICATION · Button`
plate gained a `Destructive Filled` row.

---

## 3. Corrections made during the build

The page was started by a previous session from a partial brief read; a full re-review
against the complete brief found and fixed:

| What                                                              | Why it mattered                                                                  |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `View my profile` link was missing                                | `SET-12` requires it; added per `SET-44`                                         |
| Nickname helper said `한글·영문·숫자` only                        | `SET-16` allows Japanese and internal spaces — the helper mis-stated the rule    |
| Remove-avatar button shown with the fallback avatar               | Brief: Remove exists only when a custom avatar exists                            |
| The dirty fixture had no changed field                            | Impossible state (dirty with identical values); nickname now differs             |
| `gap=2` at 9 text stacks                                          | `2` is optical-correction-only; C6 `identity` precedent is `4`                   |
| Back control was a literal `←` glyph, 20px target                 | Outside the icon system; replaced per `SET-42`                                   |
| The copy note claimed 55 keys and an en `Country or region` value | Actual: 68 keys per locale; en reads `Country` and is itself a correction target |

Traps hit in this session (recorded in the working log): frames grew after placement
and overlapped (reflow last, after content is complete); `resize`-style edits collapsed
the 844 floor once; `findAll` did not descend into instances during localisation
(manual recursion required); the `SearchField` component embeds an `악곡` scope chip
and `StatusMessage` embeds an action slot — both hidden by instance override where the
context has no use for them (see Open items 1).

---

## 4. Validation

```
A 레이아웃  spacing 위반 0 · 가로 넘침 0 · 섹션 이탈 0 · 프레임 겹침 0 · stray 0
            비정사각 아이콘 0 · 뒤로가기·레일 행 타겟 44
B 타이포    Text Style 미적용 0 · 로케일 스타일 스위치 적용(의도 유지분 제외 잔여 한국어 0)
C 색        하드코딩 0 · 신설 토큰 대비: 탈퇴 면 위 흰 글자 Light 5.16 / Dark 6.53
            focus 극성 대 탈퇴 면 Light 4.07 / Dark 6.53
시각        1x 렌더 확인 — 390 전 상태 · 320/768/1280 · Dark 5장 · JA/EN 계정
```

**Not executed — not a pass:**

- Full-page WCAG contrast sweep in both modes (only the new tokens were computed) —
  the user has scheduled a dedicated deep-verification phase
- Alignment (centerY) and padding-role audits beyond the compact mechanical audit
- 200–400% zoom reflow; keyboard order; screen-reader announcements (`aria-busy`,
  combobox live region, dialog focus containment)
- Intermediate widths between 390 and 768 other than the two built
- Wide-frame states (the state suite is compact-only; see Open items 4)

---

## 5. Open items

1. **Three instance-children are hidden by `visible=false` overrides** — the
   StatusMessage action slot (저장 성공 · 탈퇴 실패) and the SearchField scope chip
   (오락실 레이어). The better fix is boolean component properties, the `PROF-48`
   pattern; that touches C4/C5 components and other pages, so it was left as a
   Foundation-level follow-up. The overrides are annotated on the frames.
2. **The ja/en translations approved for this build have not had a native review**
   (the P9 handoff carries the same caveat).
3. **Deletion consequence counts are representative data**; the public-presence group
   is omitted because it has no reliable count. `settings.deleteWarning` (the prose
   enumeration) is superseded by the grouped rows and will need catalogue cleanup at
   implementation.
4. **The state suite exists at 390 only.** Wide should reuse the same states inside the
   detail column; no separate Wide state frames were drawn.
5. **Avatar crop position control** is drag + arrow keys per the frame annotation; only
   zoom has visible controls. The crop image is a placeholder slot.
6. **Legacy `/[locale]/profile/settings` redirect, URL-restorable category state, and
   the staged-save/discard mechanics** are behavior contracts in the brief, not drawn
   states — implementation must take them from document 16 directly.
