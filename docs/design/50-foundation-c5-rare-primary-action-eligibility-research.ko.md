# NosLog 2.0 C5 Rare Primary-Action 적격성 조사

## 문서 관리

- 상태: `조사 완료; 문서 51 이후 RPA-A 승인; RPA-B와 RPA-C 거절; Radix filled-action
alias 없음`
- 정본 언어: 영어
- 영어 정본:
  [50-foundation-c5-rare-primary-action-eligibility-research.md](./50-foundation-c5-rare-primary-action-eligibility-research.md)
- 날짜: 2026-08-10
- 범위: 승인된 `SS-08` Radix Colors Indigo source가 filled primary-action alias를
  받을 수 있는지, 가능하다면 어느 action hierarchy까지 허용할지 결정
- 입력: 승인된 page brief `03`–`20`, 문서 `32`–`49`, migration evidence로서의
  현재 action styling, 아래 열네 개의 독립적인 공식 reference
- 제외: external-brand action, destructive 및 feedback color, 최종 button geometry나
  radius, motion duration, 최종 component 구현, 광범위한 page design

문서 `49`에서 `ITA-C`를 승인했으므로 NosLog mark와 wordmark는 무채색으로
유지한다. 그 결정은 입증된 task action이 승인된 Radix source를 받을 수 있는지에
답하지 않는다. 이 문서는 identity, routine interaction, domain value, content를
재착색하지 않은 채 별도 `IAV-07` / `FNC-07` gate를 연다.

**결과 갱신 — 2026-08-10:** 문서 `51`이 승인된 비교를 완료했다. `RPA-B`와
`RPA-C`는 정확한 Dark hover/pressed text contrast가 `4.28:1`로 실패한다.
사용자는 이후 `RPA-A`를 승인했다. `RPA-B`, `RPA-C`는 거절되었고 Radix에는 action
alias가 없다.

## 결정 경계

이 조사는 하나의 질문에 답한다.

> Filled primary action을 무채색으로 유지할 것인가, dedicated essential-action
> context에서만 Radix Indigo를 사용할 것인가, 아니면 정당한 모든 page-level
> primary action에 Radix를 사용할 것인가?

모든 page에 primary button이 필요하다고 가정하지 않는다. 또한 navigation,
persistent selection, branded OAuth action, destructive confirmation, editor toolbar
command가 `<button>` 또는 button과 유사한 link로 구현될 수 있다는 이유만으로
동등한 것으로 취급하지 않는다.

## 고정된 출처 및 접근성 제약

1. Adobe Spectrum S2는 exclusive neutral primitive source로 유지한다.
2. Radix Colors Indigo는 exclusive signature identity source로 유지하며, action
   alias가 나중에 승인되는 경우 정확한 Light/Dark solid mapping을 그대로 보존한다.
3. `ITA-C`를 고정한다. Indigo logo, Indigo logo field, 기본 white logo outline을
   사용하지 않는다.
4. Fluent `FI-C`를 focus indicator로 유지한다. Filled action은 focus를 재착색하지
   않는다.
5. 일반 link, search control, filter, selection, pagination, editor tool, chart data,
   difficulty, mode, hand, score, external-brand color는 이 gate 밖에 둔다.
6. Filled action 후보는 visible text label, 최소 `44px` target, busy/duplicate-
   submission 방지, non-color state cue를 유지해야 하며 default, hover, pressed,
   focus-visible, disabled, forced-colors state의 contrast를 측정해야 한다.
7. `FCM-11`과 `SIG-07`은 `Rejected`로 유지하며 comparison target으로 사용하지 않는다.

## 현재 NosLog Action 인벤토리

아래 인벤토리는 승인된 brief와 현재 code에서 관찰한 사실이다. Action color 승인이
아니다.

| Action class                                        | 대표 NosLog 근거                                                                                                    | 빈도 및 context                                                                          | 적격성 시사점                                                                                        |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Search, filter, view, pagination, selection control | Home Music/Chart search, discovery filter commit, ranking mode 및 page control, chart-viewer control                | Content-rich page 안에서 반복                                                            | 일반 interaction이며 자주 사용된다는 이유로 Radix를 받지 않음                                        |
| Navigation 및 external destination                  | Home destination, Music detail link, Arcade `Directions`, Home/not-found link                                       | 시각적으로 중요할 수 있지만 product state를 commit하지 않고 location을 변경              | Link semantics와 neutral hierarchy 유지; generic filled-action alias가 아님                          |
| External identity action                            | `Continue with Discord`                                                                                             | 하나의 dedicated authentication action                                                   | External-brand treatment는 Discord가 소유; Radix와 Spectrum primary 후보가 재착색하지 않음           |
| Routine form 및 administrative commit               | Profile Settings Save, admin Save/Create/Edit, chart draft Save, bingo Save                                         | Form과 운영 도구 전반에서 반복                                                           | Universal Radix primary recipe는 accent를 광범위하게 전파함; neutral primary 근거 필요               |
| Dedicated task transition 또는 recovery             | Onboarding 완료, 현재 Data Sync state action, recoverable/fatal `Try again`, 제공되는 경우 planned-maintenance exit | 사용자를 앞으로 이동시키기 위해 존재하는 bounded low-density state의 한 action           | 조사 단계의 가장 강한 accent 후보; 문서 `51`이 이후 accent mapping을 거절하고 neutral `RPA-A`를 승인 |
| High-consequence workflow commit                    | Exam evidence submission, chart `Submit for review`, reviewer `Approve and publish`                                 | 드물지만 validation, permission, stale-base, irreversible publication consequence를 수반 | Color만 사용하면 안 되며 confirmation과 semantic state가 필수; 별도 실제 context 측정 필요           |
| Destructive action                                  | Account deletion, reject/delete admin action, token invalidation                                                    | 드물지만 negative consequence                                                            | 후속 danger/feedback gate가 소유하며 Radix primary-action 적격성 대상이 아님                         |

현재 구현은 Settings Save와 administrator Save action에 `bg-text-primary text-bg`
같은 무채색 inverse fill을 이미 사용한다. 이는 migration evidence이며 최종 component
alias의 증명이 아니다. 문서 `47` specimen의 Home `기록 동기화`와 Rankings
`내 위치 보기`에 사용한 candidate color는 source coexistence를 측정하기 위한
comparison scaffolding일 뿐이며 승인된 rare action 배치가 아니다.

## 권위 있는 Reference Matrix

|   # | 공식 source                                                                                                                                                                                                                                            | 동등한 primary-action rule 및 appearance                                                                                                                                                             | NosLog에 이전할 원칙                                                                                      | 한계                                                                                                                                |
| --: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
|   1 | [Adobe Spectrum Button](https://spectrum.adobe.com/page/button/) 및 [Button Group](https://spectrum.adobe.com/page/button-group/)                                                                                                                      | 강한 `accent`와 medium-emphasis neutral `primary`를 분리한다. Accent는 essential action에 제한하며 primary fill은 `gray-800`, 관련 secondary action은 outline을 사용한다.                            | Spectrum neutral과 별도로 승인된 signature source에 호환되는 출처가 있는 two-tier model을 제공한다.       | Spectrum은 view당 accent button을 최대 세 개 허용하므로 더 엄격한 측정 예산 없이 NosLog에 그대로 복사하기에는 너무 넓다.            |
|   2 | [Radix Themes color](https://www.radix-ui.com/themes/docs/theme/color), [Button](https://www.radix-ui.com/themes/docs/components/button), [Radix Colors scale usage](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) | Theme accent가 primary button과 link에 적용되며 solid component는 step `9`, hover는 step `10`, foreground는 contrast color를 사용한다.                                                               | 정확한 Radix `9/10` 값이 유효한 solid-component input임을 확인한다.                                       | Radix Themes의 광범위한 accent 전파는 승인된 neutral link, selection, focus와 충돌하므로 default theme model 전체를 도입할 수 없다. |
|   3 | [Microsoft Fluent 2 Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)                                                                                                                                                   | Layout당 primary button은 하나뿐이다. 동등한 우선순위 action이 둘보다 많으면 모두 neutral background를 사용하며 많은 minor action은 outline, subtle, transparent treatment를 사용한다.               | Primary는 hierarchy 결정이지 color entitlement가 아니며 모호하면 색을 늘리지 말고 emphasis를 낮춰야 한다. | Fluent role guidance가 NosLog에서 Fluent color value를 허가하지는 않는다.                                                           |
|   4 | [Atlassian Button](https://atlassian.design/guidelines/product/components/buttons)                                                                                                                                                                     | 가장 중요한 CTA를 위해 area당 primary를 한 번 사용하며 모든 screen에 필요한 것은 아니다. 나머지 대부분은 default를 사용한다.                                                                         | 하나의 bounded high-emphasis action과 neutral ordinary action을 지지한다.                                 | Atlassian brand token과 discovery/Rovo appearance는 제품에 특화되어 있다.                                                           |
|   5 | [IBM Carbon Button](https://carbondesignsystem.com/components/button/usage/)                                                                                                                                                                           | Page당 primary 하나를 사용하며 temporary nested-flow exception이 있다. 모든 page에 primary button이 필요하지 않다고 명시한다.                                                                        | Dense record, table, reading page는 hierarchy를 채우기 위해 filled action을 추가하지 않아야 한다.         | Carbon의 secondary-button pairing rule은 모든 NosLog workflow에 필요한 것보다 엄격하다.                                             |
|   6 | [GitHub Primer Button](https://primer.style/product/components/button/)                                                                                                                                                                                | Primary는 가장 높은 우선순위이며 절제해 사용하고 button group당 하나를 넘기지 않으며 page당 하나를 넘기는 경우도 드물다.                                                                             | Dense technical interface에서 절제된 commit emphasis를 지지한다.                                          | GitHub의 green primary surface는 NosLog color source가 아니다.                                                                      |
|   7 | [Shopify Button](https://shopify.dev/docs/api/app-home/web-components/actions/button)                                                                                                                                                                  | Primary는 절제해 사용하는 high-emphasis page action이며 예시는 Save, Create, Apply다. Loading은 duplicate submission을 막고 hierarchy를 보존한다.                                                    | 명시적인 loading behavior를 포함해 Settings와 administrative commit에 관련된다.                           | Merchant administration에는 public NosLog browsing보다 transactional Save/Create action이 많다.                                     |
|   8 | [GOV.UK Button](https://design-system.service.gov.uk/components/button/)                                                                                                                                                                               | Default button은 service task를 진행시키고 start button은 main service-entry CTA에 제한하며 destructive warning은 별도로 드물게 사용한다.                                                            | 모든 navigation link를 button으로 꾸미지 않고 task progression, service entry, destruction을 구분한다.    | GOV.UK에는 Dark theme가 없으며 green value도 이식할 수 없다.                                                                        |
|   9 | [NHS Buttons](https://service-manual.nhs.uk/design-system/components/buttons)                                                                                                                                                                          | Main CTA에 page당 primary 하나를 사용하고 여러 button을 피하며 mobile에서 확장하고 검증된 dark background에서만 reverse treatment를 사용한다.                                                        | 명확한 compact/mobile action 하나와 명시적인 background contrast 검사를 강하게 뒷받침한다.                | NHS brand와 healthcare transaction pattern은 NosLog visual authority가 아니다.                                                      |
|  10 | [Canada.ca Buttons](https://design.canada.ca/common-design-patterns/buttons.html)                                                                                                                                                                      | 가능성이 가장 높은 page action에 primary 하나를 사용한다. `supertask`는 근거가 있는 top task에만 사용하며 일반 page link는 link로 유지한다.                                                          | Rare strong action에는 promotional importance가 아니라 검증된 top-task 근거가 필요하다.                   | Guide가 Light-first이며 supertask style은 정부 서비스에 특화되어 있다.                                                              |
|  11 | [U.S. Web Design System Button](https://designsystem.digital.gov/components/button/)                                                                                                                                                                   | Button은 중요한 action에 주의를 끌며 덜 중요한 action은 link가 될 수 있다. Button을 너무 많이 쓰지 않고 가장 가능성 높은 next step을 구분한다.                                                       | Importance 기반 적격성과 neutral downgrade path를 지지한다.                                               | USWDS는 하나의 엄격한 Light/Dark product mapping 대신 여러 accent variant를 제공한다.                                               |
|  12 | [SAP Fiori Action Placement](https://experience.sap.com/fiori-design-web/action-placement/) 및 [Action/Button guidance](https://experience.sap.com/fiori-design-web/explore_group/action/)                                                             | Page당 emphasized primary 하나를 사용한다. Page primary가 있으면 content-toolbar action은 ghost/transparent로 유지한다. Workflow, business, content, layout, negative-path action을 별도로 분류한다. | 하나의 workflow commit이 강조될 때 editor/tool action을 neutral로 유지하는 것을 직접 뒷받침한다.          | Enterprise toolbar density와 SAP semantic color는 직접적인 NosLog 값이 아니다.                                                      |
|  13 | [Ant Design Button](https://ant.design/components/button/)                                                                                                                                                                                             | Section당 primary는 최대 하나다. 여러 action은 primary 하나와 secondary action을 사용하며 여러 operation 뒤에는 overflow를 사용한다.                                                                 | Composition과 분리된 global count가 아니라 bounded region당 하나를 지지한다.                              | Ant는 `colorPrimary`에서 palette를 자동 파생하므로 no-interpolation rule을 위반한다.                                                |
|  14 | [Android Material 3 Button](https://developer.android.com/develop/ui/compose/quick-guides/content/create-button)                                                                                                                                       | Filled button은 primary action에 높은 emphasis를 전달하고 outlined/text button은 secondary와 low emphasis를 전달한다.                                                                                | Solid fill의 일반적인 high-emphasis 의미를 확인한다.                                                      | Mobile application guidance와 생성형 Material color scheme은 NosLog web color authority가 아니다.                                   |

Matrix에는 독립적인 maintained 또는 governmental source 열네 개가 포함된다. Radix와
Spectrum은 정확한 source behavior를 위해 포함했으며 나머지 열두 개는 role과 frequency
근거로만 사용한다.

## 수렴점, 차이, NosLog 적합성

### 강한 수렴점

1. Primary treatment는 bounded page, area, temporary flow에서 가장 중요한 next
   action을 나타내며 기본 button style이 아니다.
2. 하나가 일반적인 최대치다. 동등한 action이 여러 개라면 모두 primary로 만들지 말고
   neutral 또는 secondary treatment로 낮춰야 한다.
3. 모든 page에 filled primary action이 필요하지 않다. Reading, comparison,
   filtering, navigation, dense tool page는 흔히 neutral로 유지한다.
4. Destructive action에는 자체 semantic treatment와 confirmation이 필요하다.
5. Loading/busy behavior는 action의 accessible meaning을 지우지 않고 duplicate
   submission을 막아야 한다.
6. Button label, placement, state semantics가 계속 필요하며 color가 유일한 cue가
   되어서는 안 된다.

### 중요한 차이

- Radix Themes, Material, Atlassian, Carbon, Primer, Shopify, public-service system,
  SAP, Ant는 흔히 chromatic 또는 brand-associated high-emphasis surface를 사용한다.
- Spectrum은 같은 component family 안에서 essential colored `accent` action과
  neutral `primary` action을 구분하는 독특한 방식을 사용한다.
- Fluent는 여러 action의 priority가 같다면 neutral background를 사용하도록
  명시적으로 권고한다.

NosLog의 승인된 `ITA-C`, neutral ordinary-interaction rule, dense record/editor
context, 강한 jacket/domain color 때문에 Spectrum의 two-tier 구분은 Radix Themes의
자동 accent 전파보다 더 적합하다. 그러나 이것만으로 NosLog에 colored tier가
필요하다고 입증되지는 않는다.

## 정확한 NosLog Candidate Input

조사 단계에서 아래 값은 action alias로 승인되지 않았다. 문서 `51`은 이후 `RPA-A`를
통해 Spectrum neutral row를 승인했으며 Radix row는 action 사용에서 거절된 상태다.
값은 계속 고정하며 더 NosLog답게 보이도록 조정해서는 안 된다.

| Input                         | Light default / hover / pressed                                                      | Light foreground                | Dark default / hover / pressed                                                       | Dark foreground                 | 출처                                                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------ | ------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Spectrum neutral-primary 후보 | `#292929 / #131313 / #131313`                                                        | `#FFFFFF`                       | `#DBDBDB / #F2F2F2 / #F2F2F2`                                                        | `#111111`                       | Spectrum primary는 `gray-800` 사용; 승인된 `F-A` interactive strengthening은 `gray-900` 사용; 문서 `34`, `37`의 정확한 S2 값 |
| Radix Indigo solid 후보       | `#3E63DD / #3358D4 / #3358D4`                                                        | `#FFFFFF`                       | `#3E63DD / #5472E4 / #5472E4`                                                        | `#FFFFFF`                       | 문서 `47`의 승인된 intact `SS-08` source; Radix solid step `9/10` 사용법                                                     |
| No-filled control             | 필요한 경우에만 승인된 neutral content와 측정된 `NB-A` boundary를 사용한 transparent | 승인된 adaptive neutral content | 필요한 경우에만 승인된 neutral content와 측정된 `NB-A` boundary를 사용한 transparent | 승인된 adaptive neutral content | 승인된 `F-A`, `NB-A`, `NI-A`; 새 palette value 없음                                                                          |

Spectrum row는 published component-to-scale relationship과 승인된 S2 value에
근거한 비교 후보였다. 문서 `51`이 `RPA-A`를 통해 semantic mapping을 검증하고
승인했다. 최종 production token 이름은 후속 작업이다. Specimen은 label이나 state
value를 바꾸지 않고 contrast와 source fidelity를 검증했다.

## Candidate Policy Bundle

| ID      | 정책                                                                                                                                                                                                                                   | Filled-action 소유권                                                                                                                                               | 강점                                                                                   | 위험                                                                                                                                                | Gate 상태                                                     |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `RPA-A` | **Achromatic primary.** 입증된 task action 하나에 Spectrum neutral-primary 후보를 사용하고 Radix에는 action alias를 부여하지 않는다.                                                                                                   | Spectrum neutral만                                                                                                                                                 | Chromatic action ownership을 도입하지 않고 강한 hierarchy를 만들며 `ITA-C`와 정렬된다. | Placement와 scale만으로 충분한 prominence를 만들지 못하면 dedicated recovery 또는 first-run state에서 부족하게 느껴질 수 있다.                      | `문서 51에서 승인 — 2026-08-10`                               |
| `RPA-B` | **Dedicated essential-action exception.** 일반 page/form commit에는 Spectrum neutral-primary를 사용하고, 전체 low-density view가 하나의 essential transition을 통해 사용자를 진행시키기 위해 존재할 때만 정확한 Radix fill을 사용한다. | Dedicated onboarding, sync-state, recovery-style context에서만 Radix 사용; routine Save, toolbar, navigation, external brand, destructive action에는 사용하지 않음 | 매우 작은 color budget을 보존하고 Spectrum의 accent-versus-primary hierarchy를 따른다. | Eligibility 문구가 주관적이 될 수 있다. Mixed role ownership은 실제 context 전반에서 입증하고 명시적 whitelist로 문서화해야 한다.                   | `문서 51에서 거절; 4.28:1 측정`                               |
| `RPA-C` | **정당한 모든 page primary.** 진짜 primary가 있는 모든 page 또는 temporary flow에서 가장 우선순위 높은 action 하나에 정확한 Radix fill을 사용한다.                                                                                     | Radix page-primary alias                                                                                                                                           | 간단한 component rule과 강한 next-step recognition                                     | Settings, admin, editor, recovery, contribution workflow 전반으로 Indigo가 퍼져 signature color가 routine UI chrome으로 변할 위험                   | `문서 51에서 거절; 4.28:1 및 확산 측정`                       |
| `RPA-D` | **Filled primary 없음.** 모든 non-destructive internal action에 neutral outline/text/placement를 사용한다.                                                                                                                             | Solid fill 없음                                                                                                                                                    | 최대 절제와 chromatic 전파 없음                                                        | Form, onboarding, sync, recovery에서 충분히 명확한 next action이 없을 수 있고, 하나의 high-emphasis task action에 관한 넓은 reference 수렴과 어긋남 | `Control; 사용자가 zero-fill hierarchy 검증을 원할 때만 진행` |

## 제안한 Visual-Comparison Gate — 문서 `51`에서 완료

다음 specimen은 action geometry, label, layout, neutral surface, focus, state behavior를
동일하게 고정한 채 `RPA-A`, `RPA-B`, `RPA-C`를 비교해야 한다. `RPA-D`는 사용자가
zero-fill control을 명시적으로 원할 때만 추가한다. 그렇지 않으면 핵심 color-
eligibility 질문을 해결하지 않은 채 네 번째 정책만 추가한다.

다음 대표 fragment를 사용한다.

1. **Routine Settings Save:** secondary navigation과 success/failure messaging이
   있는 content-dense form.
2. **Dedicated Data Sync state:** install, open NOSTALGIA, reinstall, retry 같은
   정확히 하나의 current-state action.
3. **Recoverable system error:** 하나의 `Try again` action과 secondary Home link.
4. **Dense editor/contribution footer:** routine Save와 더 드문 `Submit for review`
   transition, validation 및 permission state 포함.

External-brand ownership이 비교를 흐리므로 Discord Login은 제외한다. Danger color와
confirmation semantics는 다른 gate이므로 destructive confirmation도 제외한다.

필수 측정 항목:

- 정확한 Light/Dark default, hover, pressed, focus-visible, loading, disabled,
  forced-colors behavior
- Bounded fragment당 high-emphasis action 정확히 하나
- 한국어, 일본어, 영어 label을 사용한 `320 CSS px`, `390px`, intermediate, desktop
  reflow
- 모든 action 최소 `44px` target 및 outcome을 숨기는 label truncation 금지
- Ordinary action과 essential action을 color만으로 구분하지 않음
- 모든 승인 surface에 대한 contrast 및 대표 jacket/domain color와의 공존
- Home navigation, search, filter, selection, routine editor tool, `ITA-C` identity에
  Indigo 사용 금지

## 조사 결과 및 권고

근거는 Radix를 즉시 `primary-action`에 할당하는 대신 `RPA-A`, `RPA-B`, `RPA-C`를
측정해 비교하는 것을 지지한다. 가장 중요한 질문은 `RPA-B`의 dedicated essential-
action exception이 주관적이거나 확장되는 whitelist가 되지 않으면서 achromatic
`RPA-A`보다 유용한 hierarchy를 만드는지다.

대부분 reference가 brand-colored primary button을 제공한다는 이유만으로 `RPA-C`를
승인해서는 안 된다. NosLog는 이미 더 엄격한 neutral ordinary-interaction budget과
achromatic identity를 승인했다. 반대로 실제 sync, recovery, editor 비교에서 next
action이 명확하게 유지되는지 보기 전에는 `RPA-A`가 충분하다고 가정해서도 안 된다.

이는 다음 comparison scope에 대한 당시 권고였다. 문서 `51`이 해당 작업을 완료했고
사용자는 `RPA-A`를 승인했다. Production 구현은 후속 gate로 유지한다.

## 결정 로그

| ID       | 항목                                                                                          | 상태                             |
| -------- | --------------------------------------------------------------------------------------------- | -------------------------------- |
| `RPA-01` | Color alias를 정의하기 전에 실제 NosLog action class를 조사한다.                              | `Observed — 2026-08-10`          |
| `RPA-02` | 동등한 primary-action role과 frequency를 기준으로 독립적인 공식 system 열네 개를 비교한다.    | `Research complete — 2026-08-10` |
| `RPA-03` | Discord, destructive action, routine interaction, navigation, identity를 이 gate 밖에 둔다.   | `Required`                       |
| `RPA-04` | Interpolation이나 Tailwind 대체 없이 정확한 Spectrum neutral과 Radix Indigo input을 보존한다. | `Required`                       |
| `RPA-05` | 네 개의 실제 NosLog action context에서 `RPA-A`, `RPA-B`, `RPA-C`를 비교한다.                  | `문서 51에서 완료 — 2026-08-10`  |
| `RPA-06` | `RPA-D` zero-fill control을 추가한다.                                                         | `진행하지 않음; RPA-A 승인`      |
| `RPA-07` | Radix filled primary-action alias를 승인한다.                                                 | `미승인; RPA-B/C 측정 실패`      |
| `RPA-08` | `RPA-A`를 achromatic filled primary-action 정책으로 승인한다.                                 | `Approved — 2026-08-10`          |

## 출처

- [C5 finalist actual-content comparison](./47-foundation-c5-finalist-noslog-context-comparison.ko.md)
- [C5 identity alias visual comparison](./49-foundation-c5-identity-touchpoint-alias-visual-comparison.ko.md)
- [Rare primary-action 정책 시각 비교](./51-foundation-c5-rare-primary-action-policy-visual-comparison.ko.md)
- [Foundation semantic role map](./25-foundation-semantic-role-map.ko.md)
- [Spectrum semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.ko.md)
- [Spectrum foreground validation](./37-foundation-c5-foreground-specimen-validation.ko.md)
- [Spectrum Button](https://spectrum.adobe.com/page/button/)
- [Radix Themes Color](https://www.radix-ui.com/themes/docs/theme/color)
- [Microsoft Fluent 2 Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)
- [Atlassian Button](https://atlassian.design/guidelines/product/components/buttons)
- [IBM Carbon Button](https://carbondesignsystem.com/components/button/usage/)
- [GitHub Primer Button](https://primer.style/product/components/button/)
- [Shopify Button](https://shopify.dev/docs/api/app-home/web-components/actions/button)
- [GOV.UK Button](https://design-system.service.gov.uk/components/button/)
- [NHS Buttons](https://service-manual.nhs.uk/design-system/components/buttons)
- [Canada.ca Buttons](https://design.canada.ca/common-design-patterns/buttons.html)
- [USWDS Button](https://designsystem.digital.gov/components/button/)
- [SAP Fiori Action Placement](https://experience.sap.com/fiori-design-web/action-placement/)
- [Ant Design Button](https://ant.design/components/button/)
- [Android Material 3 Button](https://developer.android.com/develop/ui/compose/quick-guides/content/create-button)
