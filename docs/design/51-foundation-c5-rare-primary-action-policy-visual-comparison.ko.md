# NosLog 2.0 C5 Rare Primary-Action 정책 시각 비교

## 문서 관리

- 상태: `RPA-A achromatic primary 승인; RPA-B와 RPA-C는 측정된 Dark
hover/pressed text-contrast 실패 후 거절; Radix action alias 없음`
- 정본 언어: 영어
- 영어 정본:
  [51-foundation-c5-rare-primary-action-policy-visual-comparison.md](./51-foundation-c5-rare-primary-action-policy-visual-comparison.md)
- 날짜: 2026-08-10
- 조사 입력:
  [50-foundation-c5-rare-primary-action-eligibility-research.ko.md](./50-foundation-c5-rare-primary-action-eligibility-research.ko.md)
- Interactive specimen:
  [c5-rare-primary-action-policy-comparison.html](./specimens/c5-rare-primary-action-policy-comparison.html)
- 범위: 승인된 네 NosLog action context에서 정확한 승인 source value를 사용해
  `RPA-A`, `RPA-B`, `RPA-C`를 비교하고 responsive, state, focus, text-contrast
  behavior 측정
- 제외: production component 구현, 최종 button geometry, destructive action,
  Discord branding, feedback color, 최종 page design, 새로운 action-color source

사용자는 문서 `50` 이후 이 comparison scope를 승인한 뒤 측정 결과와 권고를 검토하고
2026-08-10 `RPA-A`를 승인했다. Specimen은 세 후보 모두를 근거로 보존하지만
downstream 정책은 `RPA-A`뿐이다.

## 고정 Comparison 계약

세 후보는 동일한 content, component geometry, placement, surface, foreground
hierarchy, focus treatment, interaction-state control을 사용한다. Action color
ownership만 다르다.

| 고정 role            | 정확한 mapping                                                                          |
| -------------------- | --------------------------------------------------------------------------------------- |
| Light neutral action | Default `#292929`; hover/pressed `#131313`; text `#FFFFFF`                              |
| Dark neutral action  | Default `#DBDBDB`; hover/pressed `#F2F2F2`; text `#111111`                              |
| Light Radix action   | Default `#3E63DD`; hover/pressed `#3358D4`; text `#FFFFFF`                              |
| Dark Radix action    | Default `#3E63DD`; hover/pressed `#5472E4`; text `#FFFFFF`                              |
| Focus                | 승인된 Fluent `FI-C`: Light black / Dark white `2px` zero-gap pseudo-boundary           |
| Target 및 label      | 최소 `44px`; 지속적으로 보이는 label; loading은 label을 유지하고 busy state 노출        |
| 일반 interaction     | Neutral link, tool, navigation, field, metadata, identity는 action-color gate 밖에 유지 |

측정 결과를 개선하기 위해 후보 값을 이동·보간하거나 Tailwind로 대체하거나 조정하지
않았다.

## 비교한 NosLog Context

| Context                   | 승인된 product 의미                                                             | 표시한 primary action   | Secondary hierarchy                     | 필요한 이유                                                       |
| ------------------------- | ------------------------------------------------------------------------------- | ----------------------- | --------------------------------------- | ----------------------------------------------------------------- |
| Routine Settings Save     | Dirty-state Profile category 하나를 commit하며 success 뒤 현재 context 유지     | `변경사항 저장`         | `내 프로필 보기` text link              | Routine form commit이 signature color를 소비해야 하는지 검증      |
| Dedicated Data Sync state | Returning user가 현재 상태와 정확히 하나의 next sync action 확인                | `NOSTALGIA 페이지 열기` | 최근 동기화 내역 text link              | 가장 강한 low-density essential-transition 후보                   |
| Recoverable page error    | 간결한 오류 의미를 보존하고 명시적 retry 제공                                   | `다시 시도`             | Home text link                          | 명확한 next action 하나가 있는 bounded recovery state 검증        |
| Dense editor contribution | Autosave와 tool을 보존하면서 terminal user action이 불변 review snapshot을 제출 | `심사 제출`             | Neutral `Revision 저장` 및 toolbar tool | 유효한 page primary가 dense operational UI로 색을 퍼뜨리는지 검증 |

Discord Login은 external-brand treatment를 Discord가 소유하므로 제외했다. Destructive
action은 후속 danger/feedback gate 소유이므로 제외했다.

## Policy Rendering

| 정책                        | Settings | Data Sync | Recovery | Editor submit | 최종 상태                       |
| --------------------------- | -------- | --------- | -------- | ------------- | ------------------------------- |
| `RPA-A` Achromatic primary  | Neutral  | Neutral   | Neutral  | Neutral       | `Approved — 2026-08-10`         |
| `RPA-B` Essential exception | Neutral  | Radix     | Radix    | Neutral       | `측정 실패 후 Rejected`         |
| `RPA-C` Page primary Indigo | Radix    | Radix     | Radix    | Radix         | `측정 실패 및 확산 후 Rejected` |

## 측정된 Text Contrast

비율은 WCAG relative luminance를 사용했다. Specimen의 button label은 일반 text이므로
WCAG 2.2 Success Criterion 1.4.3에 따라 필요한 비율은 `4.5:1`이다.

| Mapping                               |   Default | Hover / pressed | 결과     |
| ------------------------------------- | --------: | --------------: | -------- |
| Light Spectrum neutral, white text    | `14.55:1` |       `18.58:1` | 통과     |
| Dark Spectrum neutral, `#111111` text | `13.64:1` |       `16.87:1` | 통과     |
| Light Radix Indigo, white text        |  `5.21:1` |        `6.02:1` | 통과     |
| Dark Radix Indigo, white text         |  `5.21:1` |    **`4.28:1`** | **실패** |

실패는 정확하다. Dark hover/pressed `#5472E4`와 `#FFFFFF` text는 `4.28:1`로
`4.5:1`보다 낮다. 값을 조용히 어둡게 하거나 state별로 foreground를 바꾸거나
upstream state mapping을 출처 없는 값으로 대체하면 안 된다. 모든 action label을
large-text size로 키우는 것도 component 비교를 왜곡하며 일반 product button의
정당한 해결책이 아니다.

## Candidate 결과

### `RPA-A` — 승인

- 검증한 모든 default, hover, pressed text pairing이 통과한다.
- Routine, dedicated, recovery, dense context에서 같은 neutral action hierarchy가
  읽을 수 있게 유지된다.
- Radix에 filled-action alias를 할당하지 않아 승인된 chromatic budget을 가장 작게
  보존한다.
- 사용자는 2026-08-10 이를 NosLog filled primary-action 정책으로 승인했다.

### `RPA-B` — 거절

- 의도대로 Data Sync와 Recovery에만 hierarchy가 제한된다.
- 두 Radix action 모두 Dark hover/pressed에서 일반 text contrast에 실패한다.
- 필수 interaction state에서 실패하므로 여기서 비교한 정확 mapping으로 정책을
  승인할 수 없다.
- 사용자는 `RPA-A`를 선택했다. `RPA-B`는 rejected evidence로만 보존한다.

### `RPA-C` — 거절

- 네 context 모두 Indigo를 받아 signature color가 routine Settings와 dense Editor
  UI까지 눈에 띄게 전파된다.
- 모든 Radix action도 Dark hover/pressed text contrast에 실패한다.
- 단순한 one-primary-per-page rule은 accessibility failure를 해결하지 못한다.
- 사용자는 `RPA-A`를 선택했다. `RPA-C`는 rejected evidence로만 보존한다.

## Browser 검증

Interactive specimen을 local served URL의 in-app browser에서 검사했다.

| 검사           | 결과                                                                                                                                                                         |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop        | `1280px` browser width에서 `1265px` review shell이 같은 candidate column 세 개를 가로 overflow 없이 표시                                                                     |
| Intermediate   | 제한된 `720px` review width에서 candidate가 쌓이고 각 candidate는 동일한 context column 두 개 사용; shell boundary를 넘는 descendant 없음                                    |
| 대표 mobile    | `390px`에서 candidate와 context content가 1열; shell `scrollWidth`와 `clientWidth`가 같고 측정한 모든 action이 최소 `44px` 유지                                              |
| 최소 compact   | `320px`에서 shell이 정확히 `320px`이고 경계를 넘는 descendant 없음; primary label 12개 모두 완전히 포함되고 높이 `44px`                                                      |
| Policy mapping | 계산된 Light/Dark color가 고정 계약의 모든 정확값과 일치; `RPA-B`는 Sync/Recovery만, `RPA-C`는 네 context 모두 착색                                                          |
| State control  | Default, hover, pressed, focus, loading, disabled control이 primary action 12개를 일관되게 갱신; loading은 busy/duplicate-prevention semantics를 노출하고 visible label 유지 |
| Focus          | Dark focus preview는 white `2px solid` pseudo-boundary로 측정; Light는 같은 `FI-C` mapping의 black 사용                                                                      |
| 실패 고지      | Dark hover/pressed에서 명시적인 `4.28:1` failure notice가 나타나며 영향 없는 state 조합에서는 숨김                                                                           |

Specimen에는 forced-colors override가 있지만 이번 browser pass는 전용 forced-colors
emulation을 제공하지 않았다. Runtime forced-colors rendering은 후속 acceptance check로
남으며 여기서 검증했다고 주장하지 않는다.

## 승인된 정책

`RPA-A · Achromatic primary`를 다음 제약과 함께 승인한다.

1. Page, bounded region, temporary flow는 입증된 non-destructive internal primary
   action을 최대 하나만 노출할 수 있다. 모든 view에 필요한 것은 아니다.
2. 자격을 충족하는 모든 filled primary는 위 고정 계약의 정확한 Spectrum neutral
   mapping을 사용한다.
3. 동급 action은 filled primary를 늘리지 않고 neutral secondary treatment로 낮춘다.
4. Navigation, 일반 link, tool, filter, selection, routine lower-priority action은
   filled-primary alias를 받지 않는다.
5. External-brand 및 destructive action은 별도 gate 소유로 유지한다.
6. Radix Indigo에는 filled-action alias를 부여하지 않는다. `RPA-B`, `RPA-C`는
   rejected evidence로 유지하며 새 사용자 승인 research gate로만 다시 열 수 있다.

최종 component token 이름과 production 구현은 후속 gate지만 정책과 정확한 semantic
mapping은 이제 권위 있는 결정이다.

## 결정 로그

| ID       | 항목                                                                               | 상태                                 |
| -------- | ---------------------------------------------------------------------------------- | ------------------------------------ |
| `RPV-01` | 승인된 네 NosLog context에서 `RPA-A`, `RPA-B`, `RPA-C` 비교                        | `Completed — 2026-08-10`             |
| `RPV-02` | 정확한 Spectrum 및 Radix Light/Dark default, hover, pressed, foreground value 보존 | `Completed — 2026-08-10`             |
| `RPV-03` | Desktop, `720px`, `390px`, `320 CSS px` reflow와 최소 target 검증                  | `Completed — 2026-08-10`             |
| `RPV-04` | Default, hover, pressed, focus, loading, disabled specimen state 검증              | `Completed — 2026-08-10`             |
| `RPV-05` | 정확한 Radix Dark hover/pressed mapping으로 `RPA-B` 허용                           | `Rejected — 2026-08-10; 4.28:1 측정` |
| `RPV-06` | 정확한 Radix Dark hover/pressed mapping으로 `RPA-C` 허용                           | `Rejected — 2026-08-10; 4.28:1 측정` |
| `RPV-07` | `RPA-A`를 NosLog filled primary-action 정책으로 승인                               | `Approved — 2026-08-10`              |
| `RPV-08` | Radix filled primary-action alias 승인                                             | `Rejected; Radix action alias 없음`  |
| `RPV-09` | 승인된 filled primary를 bounded context당 입증된 action 최대 하나로 제한           | `RPA-A 필수 조건`                    |

## 출처

- [Rare primary-action 적격성 조사](./50-foundation-c5-rare-primary-action-eligibility-research.ko.md)
- [Settings 및 account page brief](./16-settings-account-page-brief.ko.md)
- [Data Sync page brief](./13-data-sync-page-brief.ko.md)
- [System recovery states page brief](./19-system-recovery-states-page-brief.ko.md)
- [Chart editor 및 contribution page brief](./20-chart-editor-contribution-page-brief.ko.md)
- [C5 finalist 실제 content 비교](./47-foundation-c5-finalist-noslog-context-comparison.ko.md)
- [Adobe Spectrum Button](https://spectrum.adobe.com/page/button/)
- [Radix Themes Button](https://www.radix-ui.com/themes/docs/components/button)
- [WCAG 2.2: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
