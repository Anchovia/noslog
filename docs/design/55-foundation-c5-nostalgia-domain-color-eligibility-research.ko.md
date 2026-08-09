# NosLog 2.0 C5 NOSTALGIA Domain Color 자격 조사

## 문서 관리

- 상태: `Corrected — renderer hand color 보존; UI difficulty mapping 대기`
- 정본 언어: 영어
- 영어 정본:
  [55-foundation-c5-nostalgia-domain-color-eligibility-research.md](./55-foundation-c5-nostalgia-domain-color-eligibility-research.md)
- 날짜: 2026-08-10
- 상위 조사:
  [문서 53](./53-foundation-c5-feedback-domain-data-color-reference-research.ko.md)
- 범위: 잠긴 chart viewer/editor renderer 밖에서 보이는 NOSTALGIA-domain color의
  Package `13B` 자격
- 입력: NOSTALGIA 공식 안내, 6개 rhythm-game production system, 5개
  accessibility/design 권위, 3개 data-color system, 현재 NosLog code 및 승인된
  NosLog 2.0 Foundation 결정
- 제외: 정확한 domain hex 값 승인, `13C` chart/data palette, 최종 iconography,
  production 구현, `13A` feedback·identity·interaction·neutral·focus ownership 재개방,
  기존 PixiJS/WebGL 또는 Canvas chart renderer와 editor rendering model의 재설계·재착색

이 문서는 어떤 domain role이 후속 exact-value 비교에 들어갈 충분한 근거가 있는지
결정한다. 이 문서에 등장하는 것만으로 color가 승인되지 않으며 현재 NosLog 1.x 값은
migration 근거로만 유지된다.

## 고정된 상위 권위

1. Spectrum S2가 모든 neutral surface와 foreground를 소유한다.
2. `FS-BN`이 information, success, warning, danger 및 destructive feedback을
   소유한다.
3. Radix Indigo는 signature identity만 소유하며 generic domain alias가 없다.
4. 별도 role이 color가 인지를 실질적으로 개선함을 입증하지 않으면 일반 label,
   selector, card, link 및 data는 neutral이다.
5. Tailwind color, 현재 custom 값, marketing gradient sampling 및 보간 ramp는 source
   권위가 아니다.
6. Domain color는 보이는 이름, 숫자, symbol, shape, position 또는 pattern을 유지해
   color가 유일한 전달 수단이 되지 않게 한다.
7. 승인된 chart-viewer 결정 `VIEW-07`은 기존 renderer와 chart mathematics를 redesign
   범위 밖에 잠근다. 현재 note 및 hand palette는 보존된 구현 예외이며 Foundation token
   candidate가 아니다.

## 해결할 질문

`13B` Gate는 하나의 decorative palette를 요청하는 것이 아니다. 다음 두 질문을
순서대로 다룬다.

1. 어떤 NOSTALGIA 의미가 NosLog에서 지속적으로 보이는 color를 가질 자격이 있는가?
2. 자격이 있는 의미에만, 값을 발명하지 않고 채택할 수 있는 정확하고 출처가 명시된
   Light/Dark source가 있는가?

이 문서는 첫 번째 질문만 답한다. 두 번째 질문은 후속 source-value 비교와 명시적인
사용자 승인이 필요하다.

## 현재 NosLog migration 감사

| 현재 근거                               | 관찰한 사용                                                                     | 2.0 판단                                                                                                             |
| --------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `app/globals.css` difficulty variable   | 두 appearance에서 custom Normal green, Hard ochre, Expert red, Real purple 사용 | 값에 기록된 NOSTALGIA 또는 maintained-system provenance가 없다. 익숙하다는 이유로 승격할 수 없다.                    |
| `app/globals.css` mode variable         | Custom Basic blue와 Recital pink                                                | 공식 제품은 task와 scoring으로 mode를 구분하지만 안정적인 공식 color 계약은 찾지 못했다.                             |
| `app/globals.css` rank variable         | P gradient, FC green, S gold 및 A-family red                                    | Rank와 achievement를 decorative status color처럼 취급해 `FS-BN` success, warning, danger와 충돌할 수 있다.           |
| `app/globals.css` genre variable        | 6개의 지속적인 category hue                                                     | 보이는 category label보다 genre color가 scanning을 개선한다는 현재 task 근거가 없다.                                 |
| `components/tiers/tierRecordDetail.tsx` | `FAST`가 `text-chart`, `SLOW`가 `text-hard` 재사용                              | Timing direction, data series 및 Hard difficulty의 ownership이 모호하다.                                             |
| Chart viewer/editor renderer            | 기존 PixiJS 및 Canvas note/hand color, geometry, animation 및 mathematics       | `VIEW-07`과 사용자의 2026-08-10 정정으로 잠겼다. Foundation token으로 승격·교체·비교·remap하지 않고 그대로 보존한다. |
| Music list 및 grid card                 | Colored difficulty text/subtle fill과 colored genre label                       | 반복되는 조밀한 color가 title, record, selection 및 feedback hierarchy와 경쟁한다.                                   |

감사한 비-renderer literal이나 CSS variable 어느 것도 2.0으로 자동 승계되지 않는다.
Chart viewer/editor renderer constant는 자동 승계 Foundation 값이 아니라 그대로 유지하는
별도의 잠긴 구현 예외다.

## 조사 방법

Source는 page 수가 아니라 독립 product 또는 guidance system 기준으로 계산했다. 한
product의 여러 page는 reference 하나다. 비교 set은 다음을 포함한다.

- 직접적인 NOSTALGIA 권위
- production rhythm-game 관습
- game 및 web accessibility requirement
- UI/domain/data ownership 분리
- 현재 NosLog task 근거

추가 source가 role 자격 pattern을 바꾸지 않을 때까지 조사했다. 직접 gameplay cue는
중복된 단서와 함께 color를 사용할 수 있고, difficulty는 반복 chart scanning을 개선할 때
절제된 color를 사용할 수 있으며, 다른 domain label은 더 강한 product-specific 계약이
없으면 text-first로 유지한다.

## 15개 source group에 걸친 14개 독립 system

|   # | Source group                                                                                                                                                                                                                 | 이전 가능한 근거                                                                                                                                    | NosLog 적용성                                                                                               | 한계                                                                                                             |
| --: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
|   1 | [NOSTALGIA Op.3 공식 how-to](https://p.eagate.573.jp/game/nostalgia/op3/howto/entrance.html)                                                                                                                                 | 파란 note가 왼손, 빨간 note가 오른손을 안내한다고 명시하고 Normal, Hard, Expert, optional Real, Basic, Recital, Grade 및 검정을 text로 이름 붙인다. | Hand semantic과 완전한 domain vocabulary의 직접 권위다.                                                     | 접근 가능한 web token 값을 공개하지 않으며 이름 붙은 모든 domain role이 지속적 color를 소유한다고 말하지 않는다. |
|   2 | [NOSTALGIA 공식 KAC](https://p.eagate.573.jp/game/kac/kac9th/nostalgia/index.html)                                                                                                                                           | Basic과 Recital은 별도 경기 부문이며 조밀한 table에서 difficulty와 score를 명시적인 text와 number로 표시한다.                                       | Mode, difficulty, rank 및 score가 hue에 의존하지 않고 정보 밀도가 높은 맥락에서 이해됨을 보여 준다.         | Tournament presentation은 cabinet UI가 아니며 Light/Dark palette를 정의하지 않는다.                              |
|   3 | [beatmania IIDX 공식 difficulty 안내](https://p.eagate.573.jp/game/2dx/26/howto/play/tenkey.html) 및 [play-data state](https://p.eagate.573.jp/game/2dx/26/howto/epass/play_data.html)                                       | Normal blue, Hyper yellow, Another red를 명시적으로 mapping하면서 이름, 순서, level 및 별도 clear-state label을 유지한다.                           | 고빈도 rhythm-game scanning에서 중복된 difficulty color를 쓰는 강한 production 선례다.                      | 다른 게임이며 Real 대응 role이 없고 그 palette를 NOSTALGIA 권위로 복사할 수 없다.                                |
|   4 | [DanceDanceRevolution 공식 play 안내](https://p.eagate.573.jp/game/ddr/ddra/p/howto/how_basic.html)                                                                                                                          | Beginner, Basic, Difficult, Expert, Challenge를 ordered set으로 항상 이름 붙이고 설명한다.                                                          | Label, order 및 level을 durable difficulty 계약으로 지지한다.                                               | Adoptable Light/Dark web palette를 공개하지 않는다.                                                              |
|   5 | [SOUND VOLTEX 공식 play 안내](https://p.eagate.573.jp/game/sdvx/vii/howto/play.html)                                                                                                                                         | Novice, Advanced, Exhaust, Maximum이 지속적인 이름과 progression 설명을 사용한다.                                                                   | Difficulty comprehension이 hue에만 의존할 수 없음을 확인한다.                                               | Surface artwork와 game-specific hue는 NosLog token으로 이전할 수 없다.                                           |
|   6 | [CHUNITHM 공식 play 안내](https://chunithm.sega.jp/play/)                                                                                                                                                                    | Note type은 서로 다른 action과 여러 color를 사용하며 difficulty는 명시적인 Advanced/Expert 이름과 level 맥락을 유지한다.                            | Gameplay-object color를 difficulty 및 일반 UI label과 분리한다.                                             | Control과 note semantic이 다르며 NosLog role 값을 제공하지 않는다.                                               |
|   7 | [osu! difficulty 안내](https://osu.ppy.sh/wiki/en/Beatmap/Difficulty) 및 [grade 안내](https://osu.ppy.sh/wiki/en/Gameplay/Grade)                                                                                             | Difficulty color는 continuous star-rating spectrum을 따르며 이름과 numeric rating은 계속 보인다. Grade는 score와 함께 ordered letter로 표시한다.    | 임의 named swatch가 아니라 numeric model에 묶인 절제 color를 보여 주며 결과는 label-first다.                | Continuous star model은 NOSTALGIA의 네 named chart type과 맞지 않는다.                                           |
|   8 | [W3C WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) 및 [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)                                                  | Color는 의미를 보강할 수 있지만 유일한 visual carrier가 될 수 없고 의미 있는 graphical cue는 충분한 adjacent contrast가 필요하다.                   | 모든 hand, difficulty, result 및 timing treatment를 지배한다.                                               | Domain ownership이나 값을 고르지 않는다.                                                                         |
|   9 | [Xbox Accessibility Guidelines 102](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/102) 및 [103](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103) | Gameplay cue에는 contrast와 추가 sensory/visual channel이 필요하며 color-dependent element는 alternate cue 또는 configurable color를 지원해야 한다. | Left/right chart guidance와 color-vision-deficiency test에 직접 관련된다.                                   | Game guidance는 NOSTALGIA default 값을 제공하지 않는다.                                                          |
|  10 | [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility/)                                                                                                                 | Color와 함께 shape/icon/text를 사용하고 두 appearance를 test한다.                                                                                   | Accessibility 근거일 뿐이며 잠긴 renderer를 다시 열거나 hand-color override를 승인하지 않는다.              | Apple system color는 NOSTALGIA source 값이 아니다.                                                               |
|  11 | [GitLab Pajamas color](https://design.gitlab.com/product-foundations/color/)                                                                                                                                                 | UI와 data-visualization palette는 분리되고 Dark UI에는 일반적으로 더 적은 color가 필요하다.                                                         | Domain label을 절제하고 chart 또는 status color가 새어 들어오는 것을 막는다.                                | Game-domain palette가 아니다.                                                                                    |
|  12 | [SAP Fiori data visualization](https://experience.sap.com/fiori-design-web/explore_group/data-visualization/)                                                                                                                | Qualitative, sequential, semantic palette의 역할이 다르고 chart당 하나의 palette를 사용하며 label/pattern을 유지한다.                               | Score band와 FAST/SLOW chart를 global domain color가 아니라 `13C`로 이동한다.                               | Business semantic과 값은 NOSTALGIA 권위가 아니다.                                                                |
|  13 | [Atlassian data-visualization color](https://atlassian.design/foundations/color/data-visualization-color)                                                                                                                    | Chart는 color 하나를 기본으로 하고 differentiation이 필요할 때만 category를 추가하며 border, spacing 및 alternate format을 제공한다.                | 승인된 `FS-BN` feedback color가 임의 game/data color가 되는 것을 막는다.                                    | `13A` 채택은 Atlassian chart color를 `13B`에 승인하지 않는다.                                                    |
|  14 | [IBM Carbon data-visualization palette](https://carbondesignsystem.com/data-visualization/color-palettes/)                                                                                                                   | Categorical color는 adjacent differentiation을 위한 별도 ordered visualization subset이다.                                                          | Genre, score band 및 timing chart에는 global label color가 아니라 local data ownership이 필요함을 강화한다. | Palette는 `13B` source가 아니라 `13C` candidate다.                                                               |
|  15 | [Adobe Spectrum S2 token](https://opensource.adobe.com/spectrum-design-data/tokens/)                                                                                                                                         | 모든 label을 chromatic하게 만들지 않고 adaptive neutral 및 semantic role family를 유지한다.                                                         | 향후 domain marker 주변의 승인된 neutral ownership을 보존한다.                                              | Spectrum primitive는 NOSTALGIA domain alias를 자동 승인하지 않는다.                                              |

## Source 간 수렴

Source는 다음 일곱 판단으로 수렴한다.

1. Gameplay-critical cue는 다른 보이는 cue가 같은 의미를 전달할 때 color를 사용할 수 있다.
2. Rhythm-game difficulty는 반복 scanning을 위해 color를 자주 사용하지만 이름, level,
   order 또는 icon을 항상 유지한다.
3. 다른 게임의 difficulty color는 pattern 근거이지 NOSTALGIA에 복사할 값이 아니다.
4. Mode는 task/scoring 구분이며 지속적인 Basic/Recital hue를 요구하는 안정적인
   cross-product pattern이 없다.
5. Rank와 achievement는 명시적인 이름, 숫자, symbol, order 및 authentic result
   artwork로 이해할 수 있다.
6. Score band와 FAST/SLOW trend는 threshold 또는 diverging data이므로 color는 local
   `13C` visualization 계약에 속한다.
7. Genre color는 실제 scanning test가 반대 결과를 입증하기 전까지 optional
   decoration이다.

## 제안된 role 자격

다음은 승인된 자격 정책이며 exact value 승인은 포함하지 않는다.

| Domain family              | 제안된 visible-color 자격                                         | 필수 비색상 계약                                                                                                  | Exact-source 상태                                                                               |
| -------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Renderer hand guidance     | `Excluded — 현재 구현 보존`                                       | 기존 renderer와 paired legend가 현재 text/color 계약을 유지                                                       | Exact-source Gate 없음; 현재 PixiJS/Canvas 값을 그대로 유지                                     |
| Difficulty                 | Renderer 밖의 repeated-scanning UI에서만 `Conditionally eligible` | 전체 Normal/Hard/Expert/Real 이름 또는 명확한 abbreviation, numeric level, fixed order 및 독립적인 selected state | 공식 vocabulary는 있지만 exact web 값은 공개되지 않아 미해결                                    |
| Basic/Recital mode         | 기본 persistent hue `Not eligible`                                | 전체 mode label과 neutral exclusive-selection state                                                               | 안정적인 공식 color ownership을 찾지 못함                                                       |
| Rank 및 achievement        | Generated global palette `Not eligible`                           | Rank/achievement name, score/criterion, order 및 optional authentic asset/icon                                    | 기존 공식 artwork는 literal artwork color를 유지할 수 있지만 generated service palette는 미승인 |
| Score band                 | `13C로 이동`                                                      | Numeric threshold, named band, ordered axis 또는 table                                                            | Global domain token이 아니라 sequential/threshold data 조사 필요                                |
| Genre                      | 기본 `Not eligible`                                               | 보이는 category label                                                                                             | 측정된 scanning 이점이나 공식 ownership을 찾지 못함                                             |
| FAST/SLOW timing direction | Chart에서는 `13C로 이동`, ordinary copy에서는 neutral             | 명시적인 FAST/SLOW label, signed magnitude, midpoint 및 direction                                                 | Diverging local-data 비교가 필요하며 chart, Hard, info 또는 danger color를 재사용할 수 없음     |

## 검토할 정책 대안

| Candidate                                | 보이는 domain color                                                                             | 장점                                                                  | 비용/위험                                                               | 상태                               |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------- |
| `DE-A · Official minimum`                | 신규 non-renderer domain color 없음                                                             | 최대 절제이며 신규 mapping 없음                                       | 가능한 difficulty scanning 이점을 포기                                  | `Not selected`                     |
| `DE-BR · Renderer-preserving task limit` | 입증된 repeated-scanning UI의 difficulty marker만 사용하고 기존 renderer hand color는 그대로 둠 | 잠긴 viewer/editor를 보존하면서 유일한 미해결 UI scanning case를 유지 | Difficulty-only exact-source Gate와 세밀한 context 경계 필요            | `Approved correction — 2026-08-10` |
| `DE-C · Broad legacy-like`               | Difficulty, mode, rank, achievement, score 및 genre                                             | 최대한 많은 visible categorization                                    | 현재 충돌을 재현하고 content hierarchy와 경쟁하며 source ownership 없음 | `승인된 DE-BR 경계로 Rejected`     |

`DE-BR`은 이전 `DE-B` 문구를 supersede한다. 이전 문구는 잠긴 renderer hand palette가
새 exact-source 비교에 들어가도록 잘못 허용했다. 사용자의 2026-08-10 정정은 이 충돌을
`VIEW-07` 우선으로 해결한다. Renderer 밖의 difficulty marker만 열린 상태이며 exact
color는 승인하지 않는다.

## 정정된 `DE-BR`의 다음 exact-source Gate

1. NOSTALGIA 공식 difficulty 근거를 모으고 관찰 가능한 것과 token으로 공개된 것을
   분리해 기록한다.
2. Screenshot sampling을 published design token으로 취급하지 않는다. Visual-fidelity
   candidate에 sampling을 사용하면 불확실성을 표시하고 neutral fallback과 비교한다.
3. Renderer 밖의 repeated difficulty scanning 실제 NosLog content 비교를 Light/Dark,
   desktop, `390px`, `320px`로 만든다.
4. Text, marker, boundary 및 adjacent-color contrast를 측정하고 color-disabled,
   forced-colors, protanopia, deuteranopia, tritanopia view를 test한다.
5. Difficulty mapping 사용자 승인을 받는다. Hand-color Gate는 열지 않는다.

정확하고 출처가 명시된 mapping이 이 검사를 통과하지 못하면 NosLog palette를 발명하지
않고 해당 role을 neutral로 유지한다.

## Decision log

| ID       | Entry                                                                                                   | Status                             |
| -------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `DCE-01` | 현재 1.x domain 값을 전부 2.0 권위가 아닌 migration 근거로 취급한다.                                    | `Observed`                         |
| `DCE-02` | 기존 renderer hand palette를 그대로 보존하고 Foundation token 또는 exact-source Gate로 취급하지 않는다. | `Approved correction — 2026-08-10` |
| `DCE-03` | Difficulty 이름, level, order 및 selection을 color와 독립적으로 유지한다.                               | `Approved — DE-BR`                 |
| `DCE-04` | Basic/Recital, rank/achievement 및 genre를 기본적으로 neutral로 유지한다.                               | `Approved — DE-BR`                 |
| `DCE-05` | Score-band와 FAST/SLOW visualization color를 `13C`로 이동한다.                                          | `Approved — DE-BR`                 |
| `DCE-06` | `DE-B`를 renderer-preserving `DE-BR`로 supersede하고 UI difficulty 값만 비교한다.                       | `Approved correction — 2026-08-10` |

## 승인 기록과 경계

2026-08-10 사용자는 Package `13B` 경계를 정정했다. 기존 chart viewer/editor
renderer와 note·left/right-hand palette는 구현된 그대로 유지하며 NosLog 2.0 Foundation
redesign에 들어가지 않는다. `DE-BR`은 이전 `DE-B` 문구를 supersede한다. Renderer 밖의
repeated-scanning UI difficulty marker만 exact-source 비교로 진행할 수 있다.
Basic/Recital, rank/achievement 및 genre는 기본 neutral을 유지하고 score band와
FAST/SLOW는 `13C`로 이동한다. Exact difficulty 값과 production 구현은 승인되지 않았다.
