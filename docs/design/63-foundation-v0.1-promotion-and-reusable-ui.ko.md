# NosLog 2.0 Foundation v0.1 승격과 재사용 일반 UI

## 문서 관리

- 상태: `제안 — 블록 5 최종 승인 대기`
- 정본 언어: 영어
- 영어 정본:
  [63-foundation-v0.1-promotion-and-reusable-ui.md](./63-foundation-v0.1-promotion-and-reusable-ui.md)
- 날짜: 2026-08-10
- 입력: 승인된 문서 `24`–`62`, 문서 `57`의 고정 6블록 권위 및 완료된
  `S1`, `S2`, `S3`, `S5` 구조 fixture
- 통합 specimen:
  [foundation-v0.1-integrated-regression.html](./specimens/foundation-v0.1-integrated-regression.html)
- 범위: 승인된 일반 UI Foundation 승격과 이미 검증된 reusable alias, pattern,
  template 통합
- 제외: `S4`, `S6`, chart viewer/editor 전체, 새 page 구조, 최종 logo drawing,
  최종 high-fidelity design 및 production 구현

## 블록 5 경계

이 블록은 어떤 page도 다시 디자인하지 않고 새 작업 package도 만들지 않습니다. 이미
승인된 Foundation 입력을 이미 승인된 일반 UI fixture에 적용해 충돌을 확인하고, 그 fixture가
이미 검증한 reusable contract만 packaging합니다. 이전 대안은 근거로 남지만 rejected 또는
superseded 후보는 downstream target이 되지 않습니다.

Chart viewer/editor 전체는 계속 잠겨 있습니다. 이 문서의 어떤 내용도 그 shell, control,
accessibility behavior, responsive layout, renderer, note, hand color, geometry, motion
또는 editor model 변경을 허가하지 않습니다.

## 통합 회귀 결과

공통 회귀 layer는 fixture 구조를 교체하지 않고 승인된 Foundation 값을 적용합니다. Wrapper는
`S1`, `S2`, `S3`, `S5`; Dark/Light; Pretendard JP/의도적 fallback; `320`, `390` 및
적용 가능한 wide layout; KO/JA/EN; 100/200% text 조건을 제공합니다.

| Gate                       | 근거                                                                                                                                                   | 결과                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| 포함 구조                  | 승인된 `S1`, `S2`, `S3`, `S5` source fixture만 embed합니다.                                                                                            | `Pass`                          |
| 범위 lock                  | `S4`, `S6`, viewer, editor 또는 renderer file을 참조하거나 변경하지 않았습니다.                                                                        | `Pass`                          |
| Neutral theme              | 승인된 Spectrum S2 Dark/Light neutral role mapping을 그대로 적용했습니다.                                                                              | `Pass`                          |
| 승인 color 예외            | Difficulty, 일반 local-data, feedback 및 judgement color는 좁은 semantic 예외로 남고 hierarchy는 neutral입니다.                                        | `Pass`                          |
| Responsive reflow          | 대표 `320`, `390` 및 적용 가능한 wide 조합에서 fixture-level horizontal overflow가 없습니다.                                                           | `Pass`                          |
| Localization과 text growth | 대표 KO/JA/EN 및 200% text 조합에서 fixture-level horizontal overflow가 없습니다.                                                                      | `Pass`                          |
| S5 exhaustive matrix       | 기존 13 widths × 3 locales × 2 scales × 8 states matrix를 공통 Foundation layer와 실행했습니다. `624` cases, `0` failures입니다.                       | `Pass`                          |
| Font load/fallback         | 공식 version-pinned Pretendard JP dynamic subset이 specimen에서 load되며 의도적 system fallback도 작동합니다.                                          | `Pass — delivery 승인 대기`     |
| Browser console            | 새 page-authored runtime error가 없습니다. 이전 iframe observer error 1건은 browser automation layer에서 발생했고 page 이동에서는 재발하지 않았습니다. | `Pass with noted tool artifact` |

기존 fixture note와 text glyph는 구조 검증 placeholder로 남습니다. Iconography 권위가 아닙니다.
Production과 downstream design은 승인된 `IC-06 · Lucide` 계약을 사용해야 하며, 이 회귀는
기존 fixture를 최종 page로 다시 그리지 않습니다.

## Foundation v0.1 승격 후보

승격은 아래 승인 출처가 일반 UI 기본 계약으로 함께 작동한다는 뜻입니다. Primitive 값을
섞거나 보간하거나 Tailwind default로 교체할 수 있다는 뜻이 아닙니다.

| Foundation role          | 지배하는 승인 출처와 계약                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| Typography               | Pretendard JP Variable, 문서 `24`–`25`의 승인 type role과 한국어 전용 `ss05`                 |
| Neutral primitive와 role | Adobe Spectrum S2 exact Dark/Light neutral ramp와 문서 `32`–`37`의 mapping                   |
| Signature accent         | `SS-08 · Radix Colors Indigo`, 승인된 rare-primary와 signature alias를 통해서만 사용         |
| Identity touchpoint      | `ITA-C · Achromatic`; product identity는 neutral 유지                                        |
| Geometry와 material      | `MG-01 · Adobe Spectrum S2`; 4px control, 8px container, 10px overlay와 flat bounded surface |
| Feedback와 status        | `FS-BN · Atlassian semantic color + neutral message typography`                              |
| Difficulty marker        | `DU-01 · Adobe Spectrum S2`, renderer 밖 네 marker로 제한                                    |
| 일반 local data          | `LD-03 · SAP Fiori Horizon`, semantic/domain 예외는 별도 문서화                              |
| Judgement domain         | `JD-02 · Radix Colors 3.0.0`, judgement marker와 FAST/SLOW 처리로 제한                       |
| Iconography              | `IC-06 · Lucide`, 20px 기본, 16px compact supporting, 공개된 2px outline geometry            |
| Motion                   | `MO-02 · Atlassian`, 0/50/100/150ms role과 instant reduced-motion 대체                       |
| 일반 data visualization  | `DV-05 · GitHub Primer` anatomy, W3C semantic-table floor와 원형 personal/benchmark marker   |

### 승격 금지사항

- Tailwind는 구현 utility일 뿐 palette나 component style 출처가 아닙니다.
- Screen을 더 “NosLog답게” 보이게 하려고 hybrid ramp, 중간 swatch, radius, shadow 또는
  animation을 만들지 않습니다.
- Neutral hierarchy가 기본입니다. Signature, status, difficulty, local-data 및 judgement
  color는 장식이 아닌 좁은 semantic 예외입니다.
- Dark container에 지속적인 outline을 두지 않는 승인 원칙을 유지합니다. Containment,
  interaction 또는 state에 필요할 때만 boundary를 표시합니다.
- 승격은 잠긴 viewer/editor 변경을 허가하지 않습니다.

## Pretendard JP delivery와 fallback 제안

### 저장소 확인 결과

현재 application은 `app/fonts/PretendardVariable.woff2`를 `next/font/local`로 bundle합니다.
이 file은 standard Pretendard `1.20250`이며 승인된 Pretendard JP family가 아닙니다.
Migration 근거일 뿐 Foundation v0.1 준수로 표현하면 안 됩니다.

### 공식 출처 확인 결과

- Pretendard JP는 variable family와 공식 KO/JA/system fallback 순서를 공개합니다. 확인한
  upstream release는 `1.3.9`입니다.
- 전체 upstream `PretendardJPVariable.woff2`는 약 `5.35 MB`이므로 first-view에서 eager
  preload하면 불필요한 전송 비용이 생깁니다.
- 공식 version-pinned variable dynamic-subset CSS는 page에 필요한 Unicode range만
  load합니다. Specimen은 이 공식 asset으로 family와 fallback behavior를 검증합니다.
- Next.js `next/font`는 local font self-host와 명시적 fallback을 지원합니다. Production은
  runtime third-party CDN에 의존하지 말고 pinned Pretendard JP dynamic-subset asset을
  NosLog origin에 vendor해야 합니다.

Primary source:
[Pretendard JP 공식 문서](https://github.com/orioncactus/pretendard/tree/main/packages/pretendard-jp/docs/en),
[공식 version-pinned variable dynamic-subset CSS](https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-jp-dynamic-subset.min.css),
[Next.js Font API](https://nextjs.org/docs/app/api-reference/components/font).

### 제안 production 계약

1. 공식 Pretendard JP `1.3.9` variable dynamic-subset CSS와 참조 WOFF2 subset file을
   NosLog origin에 vendor합니다.
2. Upstream version을 고정하고 license/provenance를 기록하며 unversioned CDN URL을 쓰지
   않습니다.
3. `Pretendard JP Variable`, `Pretendard JP`, `Pretendard`, platform UI font,
   일본어·한국어 system font, generic sans-serif 순서의 공식 family order를 사용합니다.
4. `ss05`는 `lang="ko"` 내부에만 적용하고 일본어나 영어에 강제하지 않습니다.
5. `font-display: swap`을 유지하고 usable fallback metric을 보존하며, 현재 standard
   Pretendard asset 제거 전 KO/JA/EN을 검증합니다.
6. 전체 5.35 MB variable file을 preload하지 않습니다. 이후 성능 측정으로 근거가 생긴
   critical subset만 preload합니다.
7. 이후 구현 session에서 application font를 migration하며, 이 design-guide session은
   production font asset이나 layout code를 변경하지 않습니다.

이 delivery 계약이 블록 5에서 남은 유일한 material user decision입니다. 승인하면 다른
visual-source comparison 없이 Foundation v0.1과 아래 reusable contract를 함께 승격할 수
있습니다.

## Reusable component alias

아래 항목은 구현 중립 alias이며 지금 큰 component library를 만들자는 요청이 아닙니다. 이후
작업은 semantic과 state가 맞을 때 기존 project component에 mapping할 수 있습니다.

| Alias                | 검증된 책임                                                                                 | 검증 fixture   |
| -------------------- | ------------------------------------------------------------------------------------------- | -------------- |
| `AppHeader`          | Achromatic identity, navigation context, label 또는 accessible name이 있는 secondary action | S1, S2, S3, S5 |
| `SearchField`        | Accessible query input, submit action 및 필요한 loading/empty/error/results state           | S1, S5         |
| `ContentScopeSwitch` | Page navigation인 척하지 않고 search/comparison content kind 전환                           | S1, S5         |
| `FilterSortControl`  | Option clutter 없이 secondary filtering/sorting 열기                                        | S1, S3         |
| `ViewModeSwitch`     | 같은 result set presentation 변경과 programmatic selected state                             | S1             |
| `ResultCollection`   | 안정된 identity, metadata, domain marker를 가진 flat linked result                          | S1, S5         |
| `EntityHeader`       | Music identity, 번역/원문 metadata, supporting fact, contextual action                      | S2             |
| `DifficultySelector` | Renderer 밖 승인된 네 marker를 쓰는 neutral control                                         | S2             |
| `MetricSummary`      | 장식 color 없이 label, exact value, unit/basis, comparison context 표시                     | S2, S3         |
| `DataTable`          | Semantic header, row identity, exact value, current-user 처리, responsive priority          | S3             |
| `Pagination`         | Current/adjacent page, ellipsis semantic, previous/next action                              | S3             |
| `StatusMessage`      | Neutral title/body와 승인된 Atlassian semantic marker/icon/boundary role                    | S1, S2, S3, S5 |
| `Disclosure`         | Keyboard로 동작하는 secondary explanation/control reveal                                    | S2, S3         |
| `Overlay`            | 승인된 geometry, focus, dismissal, motion을 쓰는 contextual popover/list/dialog             | S2, S5         |
| `OrdinaryDataChart`  | Primer anatomy, exact-value interaction, non-color 구분, 동일 semantic table                | S2와 문서 62   |

Visible icon control은 Lucide를 사용합니다. Icon-only control에는 accessible name과 승인된
target size가 필요합니다. 기존 fixture의 text glyph는 component asset이 아닙니다.

## Reusable pattern

| Pattern                       | 계약                                                                                                                          | Template 근거  |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Discovery와 result refinement | Search 우선, committed result status 노출, filter disclose, loading/empty/error recovery 보존                                 | `S1`           |
| Focused entity detail         | Music identity와 현재 task 우선, comparison/record/explanatory data progressive disclosure                                    | `S2`           |
| Dense comparison data         | 2차원 page scrolling 없이 table 관계, scan order, current-user context, exact value, narrow-screen priority 보존              | `S3`           |
| Home task routing             | 명확한 search entry, 절제된 destination, routine 우선, service/search failure 정의                                            | `S5`           |
| Feedback와 recovery           | Neutral typography로 설명하고 승인 severity role을 붙이며 가능한 하나의 clear recovery action 제공                            | S1, S2, S3, S5 |
| Responsive adaptation         | Content 필요에 따라 재구성, `390px` review canvas, `320 CSS px` reflow floor, wide space는 comparison/parallel reading에 사용 | S1, S2, S3, S5 |

## Template 상태

`S1`, `S2`, `S3`, `S5`는 downstream design requirement용 승인 구조 template입니다. Content
priority, responsive relationship, required state 및 component responsibility를 정합니다.
최종 page나 visual comp가 아니며 placeholder glyph와 specimen control 복사를 허가하지
않습니다. 잠긴 viewer/editor 경계에서는 새 `S4` 또는 `S6` template이 존재하지도 필요하지도
않습니다.

## 제안 decision log

| ID       | Entry                                                                                                         | 상태               |
| -------- | ------------------------------------------------------------------------------------------------------------- | ------------------ |
| `FPR-01` | 통합 specimen을 승인된 일반 UI의 최종 collision/regression harness로만 사용합니다.                            | `제안`             |
| `FPR-02` | Version-pinned, self-hosted Pretendard JP variable dynamic-subset delivery와 공식 fallback 순서를 채택합니다. | `사용자 승인 대기` |
| `FPR-03` | 나열한 승인 출처를 source decision 재개방 없이 Foundation v0.1로 함께 승격합니다.                             | `사용자 승인 대기` |
| `FPR-04` | 나열한 reusable alias, pattern 및 네 구조 template을 블록 5 package로 채택합니다.                             | `사용자 승인 대기` |
| `FPR-05` | Viewer/editor 전체와 `S4`/`S6`를 회귀, reusable UI 및 downstream template 작업에서 제외합니다.                | `잠긴 승인 경계`   |

## 블록 5 완료 gate

사용자가 `FPR-02`–`FPR-04`를 승인해야 블록 5가 완료됩니다. 승인하면 이 문서와 한국어
companion을 `Approved`로 변경하고 문서 `57`과 README에서 블록 5를 완료로 표시하며 블록 6이
유일하게 남은 큰 블록이 됩니다. 완료 percentage나 새 work-package count는 만들지 않습니다.
