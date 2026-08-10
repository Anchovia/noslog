# NosLog 2.0 — Foundation Iconography 출처 비교

> 정본 언어: 영어  
> 영어 정본: [60-foundation-iconography-source-comparison.md](./60-foundation-iconography-source-comparison.md)  
> 상태: `Approved — IC-06 Lucide 일반 UI grammar; 블록 2 완료 — 2026-08-10`  
> 날짜: `2026-08-10`

## 목적

`블록 2 · Iconography`에 필요한 근거 조사와 통제된 시각 비교를 시작하고 완료합니다.
이 문서는 새 top-level 작업을 추가하지 않습니다. 일반 NosLog UI에 사용할 수 있는 저명한
icon system을 비교하고 현재 구현을 감사하며, 사용자에게 속한 material 출처 결정만
분리합니다.

채보 viewer/editor 전체와 최종 NosLog logo drawing은 제외합니다.

## 고정 범위

이 블록은 다음만 다룹니다.

- 일반 product-interface icon의 출처 library
- label과 icon의 관계
- 허용할 icon-only control
- 기본 optical size와 시각 무게
- neutral 및 semantic color 동작
- accessible name, decorative hiding, target size, focus 및 localization 규칙

채보 viewer/editor, game note·hand graphic, renderer control, NOSTALGIA 판정 graphic,
NosLog logo, Discord 같은 brand-service mark, illustration, flag, album jacket 또는
data-visualization mark는 다루지 않습니다.

## 현재 구현 감사

저장소는 잠긴 `components/chart-pattern/`과 `components/admin/chart-pattern/` tree를
제외한 일반 UI source file 73개에서 `lucide-react@1.24.0`을 사용합니다. Global
navigation, search, music, rankings, profile, game-center, bingo, bookmarklet,
feedback, exam 및 admin UI에 분포합니다.

관찰된 일반 UI 크기에는 `12`, `13`, `14`, `15`, `16`, `20px`와 Tailwind
`size-3`, `size-3.5`, `size-4`, `size-5`가 있습니다. 어떤 control은 `aria-label`을
제공하고, 어떤 icon은 decorative로 숨기며, 어떤 경우는 인접한 visible text에
의존합니다. 이는 기능 inventory이지 일관된 승인 2.0 grammar가 아닙니다.

선택 전에는 현재 Lucide를 역사적 대조군 `IC-06`으로 유지했습니다. Tailwind가 설치돼
있다는 이유로 그 palette나 template이 디자인 권위가 되지 않는 것처럼, Lucide가 stack에
있다는 사실도 NosLog 2.0 시각 권위가 되지 않았습니다. 아래의 최종 승인은 폭넓은 비교와
통제 콘텐츠 검토에서 나왔습니다.

Custom brand mark는 계속 별도 asset입니다. 선택한 product icon family처럼 보이도록
다시 그리면 안 됩니다.

## 폭넓은 권위 출처 비교

독립적인 공식 또는 유지 관리 출처 17개를 확인했습니다. 처음 여섯 개는 통제 시편을
구성합니다. 나머지는 대안·제약·제외 근거를 제공하며 좁은 reference pool에서 선택하는
일을 방지합니다.

| 출처                                                                                                                                                                                                    | 차용 가능한 근거                                                                                 | NosLog 적합성 / 한계                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| [Adobe Spectrum iconography](https://spectrum.adobe.com/page/iconography/) 및 [Spectrum Web Components workflow icons](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/) | Desktop/mobile 전용 icon size, weight variant, 단순한 단색 product glyph.                        | 승인된 Spectrum neutral foundation과 시각 연속성이 강하지만 icon 출처는 별도 승인 gate입니다.                                |
| [Microsoft Fluent 2 iconography](https://fluent2.microsoft.design/iconography)                                                                                                                          | Optical-size set, action·wayfinding의 Regular, 선택·강조 상태에 제한한 Filled, 단일 solid color. | 정교한 20px product UI set이며 React package에 직접 맞습니다. Regular/Filled 상태 규칙은 좁게 유지해야 합니다.               |
| [Atlassian iconography](https://atlassian.design/foundations/iconography)                                                                                                                               | 기본 16px, 절제된 detail, 가능한 한 label 사용, compact product density.                         | Compact 가독성과 명시적 label-first 정책이 강합니다. 작은 native size는 고정 hit target이 필요합니다.                        |
| [IBM Carbon icon usage](https://carbondesignsystem.com/elements/icons/usage/)                                                                                                                           | Component 기본 16px와 유지 관리되는 20/24/32 size, 일관된 source geometry.                       | 명확한 기술적 geometry이지만 Settings 같은 복잡한 glyph는 16px에서 조밀합니다.                                               |
| [GitHub Primer Octicons guidelines](https://primer.style/octicons/design-guidelines/)                                                                                                                   | 별도 16px·24px drawing, 1.5px geometry, 특수 상황에만 12px.                                      | Compact action은 매우 선명하지만 일부 glyph는 더 무겁고 developer-tool 성격이 강합니다.                                      |
| [Lucide](https://lucide.dev/)                                                                                                                                                                           | 유지 관리되는 넓은 24-unit, 2px rounded-stroke set과 tree-shakable React delivery.               | 현재 구현 대조군일 뿐이며 generic outline 성격이 재검토 대상입니다.                                                          |
| [Google Material Symbols](https://developers.google.com/fonts/docs/material_symbols)                                                                                                                    | 20–48 범위의 Fill, weight, grade, optical-size axis.                                             | 광범위하고 접근 가능하지만 variable-font loading/subsetting은 첫 NosLog system에 불필요한 delivery·일관성 결정을 추가합니다. |
| [SAP Fiori Horizon iconography](https://experience.sap.com/fiori-design-web/iconography/)                                                                                                               | 단순 metaphor, 일관된 size/stroke/balance, 보편적인 의미일 때만 icon button 사용.                | 정책 근거는 강하지만 web asset 채택 경로가 finalist React package보다 직접적이지 않습니다.                                   |
| [Radix Icons](https://www.radix-ui.com/icons)                                                                                                                                                           | 선명한 고정 15×15 product glyph.                                                                 | Compact control anatomy에는 뛰어나지만 custom 작업 없이 모든 일반 NosLog role을 소유하기에는 범위가 좁습니다.                |
| [Phosphor Icons](https://phosphoricons.com/)                                                                                                                                                            | 여러 weight, Fill, Duotone variant를 가진 대형 family.                                           | 유연하지만 그 유연성 때문에 weight와 surface treatment를 섞을 위험이 불필요하게 커집니다.                                    |
| [Tabler Icons](https://tabler.io/icons)                                                                                                                                                                 | 광범위한 MIT 24-unit, 2px outline family.                                                        | 유지 관리되고 완전하지만 Lucide가 대표하는 generic rounded-outline 성격과 가깝습니다.                                        |
| [Shopify Polaris React repository](https://github.com/Shopify/polaris-react)                                                                                                                            | 성숙한 commerce icon semantics와 product component 통합.                                         | Repository가 Polaris asset을 Shopify 연동 app에 제한하므로 NosLog 채택 출처가 될 수 없습니다.                                |
| [GitLab Pajamas](https://handbook.gitlab.com/handbook/product/ux/pajamas-design-system/)                                                                                                                | 유지 관리되는 product design-system governance와 icon 일관성.                                    | Governance 근거로 유용하지만 공개 icon 채택 경로가 finalist보다 self-contained하지 않습니다.                                 |
| [Heroicons](https://heroicons.com/)                                                                                                                                                                     | 별도의 16 Solid, 20 Solid, 24 Outline/Solid set.                                                 | Optical set은 명확하지만 강한 Tailwind starter-template 연관성이 요청한 독립 시각 provenance와 맞지 않습니다.                |
| [Apple SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols)                                                                                                            | Platform-adaptive weight, localization, variable rendering.                                      | Apple-platform reference로 훌륭하지만 SF와 Apple distribution에 결합돼 있어 NosLog web 출처가 아닙니다.                      |
| [WAI-ARIA naming and description practices](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/)                                                                                          | Shape(`X`)가 아니라 action(`Close`)으로 control에 짧은 이름을 부여합니다.                        | 시각 출처와 무관하게 모든 icon-only control을 지배합니다.                                                                    |
| [W3C Design System SVG icons](https://design-system.w3.org/styles/svg-icons.html)                                                                                                                       | Icon-only control에는 accessible name이 필요하고 decorative SVG path는 숨겨야 합니다.            | 시편과 downstream accessibility 계약을 정합니다.                                                                             |

시편 SVG를 추출한 공식 package version은 다음과 같습니다.

| 후보    | Package                                   |   Version | License    |
| ------- | ----------------------------------------- | --------: | ---------- |
| `IC-01` | `@spectrum-web-components/icons-workflow` |  `1.12.2` | Apache-2.0 |
| `IC-02` | `@fluentui/react-icons`                   | `2.0.335` | MIT        |
| `IC-03` | `@atlaskit/icon`                          |  `37.3.0` | Apache-2.0 |
| `IC-04` | `@carbon/icons-react`                     | `11.85.0` | Apache-2.0 |
| `IC-05` | `@primer/octicons-react`                  | `19.33.0` | MIT        |
| `IC-06` | `lucide-react`                            |  `1.24.0` | ISC        |

어떤 후보도 screenshot에서 재구성하거나 손으로 근사하거나 유사품으로 교체하지 않았습니다.
시편 data file은 이 정확한 설치 package version에서 추출한 SVG output을 담습니다. Package는
임시 research directory에서만 확인했으며 repository dependency는 추가·변경하지 않았습니다.

## 통제 역할과 시편

통제 비교는 해당 일반 NosLog UI에서 발견한 여덟 의미를 사용합니다.

1. Search
2. Location
3. Sync/refresh
4. Settings
5. Upload/import
6. Navigate/chevron-right
7. Close
8. Delete

[일반 UI iconography 출처 비교 열기](./specimens/foundation-iconography-source-comparison.html).
모든 후보에 같은 한국어 search field, label action, game-center row, 44px icon-only control
두 개, neutral Light/Dark surface 및 glyph 순서를 적용합니다.

`Native size` mode는 각 system의 compact product-UI 권고를 유지합니다. Spectrum
`18px`, Fluent `20px`, Atlassian `16px`, Carbon `16px`, Primer `16px`, 현재 Lucide
대조군의 일반 구현 `20px`입니다. `Normalize 20px`는 이 변수를 제거해 glyph 형태와
시각 무게를 따로 비교합니다. Source viewBox와 path data는 바뀌지 않습니다.

## 후보 평가

| ID      | 후보               | 강점                                                                                                                       | 위험 / 한계                                                                                                                                       |
| ------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IC-01` | Adobe Spectrum S2  | 차분한 단색 silhouette, 넉넉한 내부 공간, neutral source와 같은 유지 관리 생태계.                                          | 18px에서 일부 action이 dense product tooling보다 부드럽습니다. Spectrum이 neutral을 소유한다는 이유만으로 선택하면 두 approval gate가 합쳐집니다. |
| `IC-02` | Microsoft Fluent 2 | 가장 균형 잡힌 20px detail, 정교한 curve, search/location/settings의 명확한 구분, 직접적인 Regular optical set.            | 명시적 selected-navigation 규칙 밖에서 Filled variant를 쓰면 혼합 styling이 시끄러워질 수 있습니다.                                               |
| `IC-03` | Atlassian          | 가장 선명한 compact 16px family, 직접적인 label-first guidance, 효율적인 dense row.                                        | 시각 무게가 더 강하며 20px로 normalize하면 작은 한국어 label을 압도할 수 있습니다.                                                                |
| `IC-04` | IBM Carbon         | 일관된 기술 geometry와 강한 단순 action glyph.                                                                             | 복잡한 icon은 native 16px에서 시각적으로 조밀하고 일반 content row에서 덜 차분합니다.                                                             |
| `IC-05` | Primer Octicons    | 매우 명확한 action silhouette와 성숙한 compact tooling vocabulary.                                                         | Settings와 다른 복잡한 glyph가 무겁고 전체 목소리가 developer tooling에 가깝습니다.                                                               |
| `IC-06` | 현재 Lucide 대조군 | 넓은 coverage, 차분한 20px outline 무게, 명확한 Light/Dark rendering, 통제 콘텐츠에서 한국어 label과 가장 적게 경쟁합니다. | 기존 size/label 규칙이 일관되지 않으므로 승인은 현재 임의 사용을 보존하는 대신 grammar를 표준화합니다.                                            |

## 승인 결과

사용자는 통제된 NosLog 콘텐츠를 검토한 뒤 `IC-06 · Lucide`를 선택했습니다. 이 결정은
초기 `IC-02 · Microsoft Fluent 2 Regular` 권고를 supersede합니다.

선택 근거는 설치 편의가 아니라 실제 비교입니다. NosLog 한국어 콘텐츠에서 Lucide의 20px
outline은 label과 경쟁하지 않으면서도 명확합니다. Fluent는 더 가늘고 Atlassian, Carbon,
Primer는 compact row에서 더 무겁습니다. Spectrum은 차분하지만 일부 utility action의
즉시 구분이 약합니다. Lucide는 독립적으로 유지 관리되는 icon system이며 Tailwind palette,
theme 또는 starter-template 출처가 아닙니다.

`IC-01`–`IC-05`는 비교 근거로만 남고 일반 UI downstream target이 아닙니다.

## 승인된 일반 UI grammar

다음 규칙은 해당 NosLog 2.0 일반 UI에 권위를 가집니다.

1. `lucide-react`를 단일 일반 UI product icon family로 사용합니다. 통제 승인은 설치된
   `1.24.0` package output을 기준으로 합니다. 이후 dependency upgrade에서 glyph geometry가
   바뀌면 기계적 update로 취급하기 전에 검토합니다. 다른 system의 개별 workflow glyph를
   섞지 않습니다.
2. Primary, unfamiliar, destructive 및 low-frequency action에는 visible text label을
   사용합니다. Icon은 label을 보조하며 대체하지 않습니다.
3. Icon-only control은 close, previous/next, overflow, 반복 compact row action처럼
   context가 계속 보이는 보편적 compact action으로 제한합니다. 모두 명시적 accessible
   action name이 필요합니다.
4. Visible label 옆 decorative icon은 `aria-hidden="true"`를 사용합니다. Accessibility
   tree에서 visible label을 중복하지 않습니다.
5. 공개된 Lucide `24×24` source viewBox, `2px` stroke, round linecap과 round linejoin을
   그대로 사용합니다. 일반 product icon은 outline-only로 유지합니다. Selection은 glyph를
   채우지 않고 승인된 container, label, boundary 또는 state treatment로 전달합니다.
6. 기본 action과 wayfinding glyph는 `20px`로 render합니다. 인접한 visible label이 있는
   compact supporting 또는 metadata icon에만 `16px`를 사용합니다. 일반 UI Lucide glyph를
   `16px`보다 작게 쓰거나 label에 맞춰 복잡한 glyph를 축소하지 않습니다. `24px`는 실제로
   prominent한 standalone affordance 또는 empty state에만 사용하며 일상 button·row에는
   사용하지 않습니다.
7. Interactive icon은 control foreground role을 상속합니다. 단순 강조를 위해 signature,
   feedback, difficulty, judgement 또는 data color를 받지 않습니다. Destructive color는
   trash glyph 자체가 아니라 승인된 semantic control state에 속합니다.
8. Glyph size와 pointer target size를 분리합니다. Mobile icon-only target은 최소
   `44×44px`, 해당 desktop icon-only target은 최소 `40×40px`를 사용합니다. Visible-label
   control은 승인된 component height를 따르며 glyph size가 control size를 정하지 않습니다.
9. 한국어·일본어·영어 label과 container가 glyph 축소나 2차원 page scrolling 없이
   reflow하게 합니다.
10. Keyboard focus는 승인된 `FI-C` treatment를 사용합니다. Light에서는 검정, Dark에서는
    흰색인 `2px` zero-gap boundary를 control 바깥 `2px`에 표시합니다. Focus를 Lucide glyph,
    signature Indigo 또는 다른 accent로 다시 칠하지 않습니다.
11. Tooltip은 hover/focus에서 익숙하지 않은 icon-only control을 보조하지만 accessible
    name이나 primary action의 persistent label을 대체하지 않습니다.
12. 개별 glyph를 “더 NosLog답게” 만들려고 source path, stroke width, corner language 또는
    fill treatment를 수정하지 않습니다. 필요한 role이 없으면 source 실패를 보고하고 결정을
    다시 엽니다.
13. 잠긴 viewer/editor와 별도 brand mark는 선택한 일반 UI family와 함께 migrate하지
    않습니다.

## 완료된 검증

승인된 Lucide 시편을 다음과 같이 확인했습니다.

[Responsive 및 localization 검증 harness 열기](./specimens/foundation-iconography-responsive-validation.html).

- Light와 Dark 모두 새 accent 없이 neutral `currentColor` rendering을 유지합니다.
- 기본 `20px`와 compact `16px`에서 공개된 `2px` stroke geometry를 유지합니다.
- 시편은 `320px`와 `390px`에서 가로 page overflow 없이 reflow합니다. Action label은 glyph를
  축소하지 않고 control 단위로 wrap합니다.
- Desktop은 같은 label hierarchy와 승인된 2-column 출처 비교 layout을 유지합니다.
- 비교의 icon-only control 12개는 모두 명시적 action name을 노출하며 인접 decorative SVG는
  accessibility tree에서 숨깁니다.
- 실제 keyboard traversal에서 승인된 `FI-C` focus boundary를 확인했습니다. Light는 검정
  `2px`, Dark는 흰색 `2px`이며 바깥 extent는 `-2px`입니다.
- 전용 forced-colors 규칙이 structural control boundary를 보존하며 icon은 `currentColor`
  동작을 유지합니다.
- 이 design-guide 블록에서는 repository dependency, production component, viewer/editor file
  또는 logo asset을 변경하지 않았습니다.

이로써 `블록 2 · Iconography`가 완료됩니다. 남은 top-level 작업은 블록 `3`–`6`이며
내부 icon migration pass를 다른 블록으로 추가하지 않습니다.

## Decision log

| ID       | Entry                                                                                                      | 상태                           |
| -------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `ICO-01` | 블록 2를 해당 일반 UI로 제한하고 viewer/editor 전체와 최종 logo boundary를 보존합니다.                     | `Locked scope`                 |
| `ICO-02` | 비교 전 현재 Lucide를 자동 디자인 권위가 아닌 구현 근거와 역사적 대조군으로 취급합니다.                    | `Observed basis`               |
| `ICO-03` | 채택 가능한 권위 system 5개와 현재 대조군을 NosLog의 동등한 8개 role로 비교합니다.                         | `Completed evidence`           |
| `ICO-04` | 유사품을 다시 그리지 않고 package에서 추출한 SVG와 source geometry를 유지합니다.                           | `Completed evidence`           |
| `ICO-05` | Fluent 2 Regular를 초기 권고로, Atlassian을 compact 대안으로 올립니다.                                     | `Superseded by user selection` |
| `ICO-06` | 해당 일반 UI에 Lucide와 문서화된 label, size, stroke, color, target 및 accessibility grammar를 채택합니다. | `Approved — 2026-08-10`        |
| `ICO-07` | Viewer/editor 전체와 최종 logo drawing을 Lucide migration boundary 밖에 유지합니다.                        | `Approved boundary`            |
| `ICO-08` | Responsive, Light/Dark, interaction 및 accessibility 검증 뒤 블록 2를 종료합니다.                          | `Complete — 2026-08-10`        |
