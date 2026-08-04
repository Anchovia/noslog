# NosLog 2.0 Foundation S1 탐색 구조 검증

## 문서 관리

- 상태: `초안 — 관찰된 기준선 및 검증 Protocol만 포함`
- 원본 언어: 영어
- 영어 원본:
  [27-foundation-s1-discovery-structural-validation.md](./27-foundation-s1-discovery-structural-validation.md)
- 시작일: 2026-08-04
- 범위: 대표 Specimen `S1`에서 승인된 Foundation Typography, Spacing, Grid,
  Container, Density 및 Target 계약의 구조 검증
- 승인 경계: 이 문서는 Color, Material, 최종 Component layout, 채보 결과
  Styling, 승인된 탐색 기획서 밖의 최대 Line count, Truncation 변경 또는
  Application 구현을 승인하지 않음

## 관련 권위 문서

- [공용 탐색 페이지 기획서](./04-shared-discovery-page-brief.ko.md)
- [Foundation v0.1 조사 브리프](./24-foundation-v0.1-research-brief.ko.md)
- [Foundation Semantic role map](./25-foundation-semantic-role-map.ko.md)
- [Foundation Typography 및 Layout 후보](./26-foundation-typography-layout-candidates.ko.md)

승인된 탐색 기획서가 제품 동작과 Content 순서를 관리합니다. 문서 `25`와 `26`은
Semantic typography 및 Layout 계약을 관리합니다. 이 검증에서 충돌을 발견할
수는 있지만 해당 권위 문서를 조용히 바꿀 수 없습니다. 중요한 충돌은 명시적인
수정 결정으로 사용자에게 되돌립니다.

## 검증 목적

`S1`은 Appearance와 Material 결정을 위에 얹기 전에 승인된 구조 Foundation이
실제 NosLog 탐색 과업을 지원할 수 있음을 입증해야 합니다. 측정된 근거로 다음
질문에 답합니다.

1. 범위를 인식하는 검색, Commit 상태, 결과 및 점진적 불러오기가 `320 CSS px`와
   대표 `390px`에서 하나의 명확한 세로 과업 흐름을 만들 수 있는가?
2. 긴 한국어·일본어·영어·혼합 Script 악곡 정체성을 가로 Overflow나 새로운
   `12px` 미만 Type 예외 없이 읽을 수 있는가?
3. 승인된 `32/40/48px` Visible-control 어휘와 Effective-target 계약이 Target
   겹침 없이 고밀도 탐색 Control을 지원할 수 있는가?
4. `672px` 및 `1056px` Page-grid 전환이 각 임계점 직전과 직후에서 안정적인가?
5. 탐색 Component 자체가 실패하여 공유 Page-grid 전환과 독립적인 Container-query
   Reflow가 필요한 지점은 어디인가?
6. 목록, Grid, 채보 Grouping, Loading, Empty, Error, Disabled 및 점진적 불러오기
   상태가 같은 위계와 Focus model을 보존할 수 있는가?

## 제외 범위

- 최종 페이지 디자인이나 Production-ready Figma 화면이 아닙니다.
- 현재 NosLog Surface styling을 재현하거나 승인하지 않습니다.
- Foundation Color, Border, Radius, Elevation, Icon 또는 Motion 값을 선택하지
  않습니다.
- 승인된 탐색 기능을 추가·제거·재그룹화하거나 이름을 바꾸지 않습니다.
- NosLog 2.0 Application을 구현하지 않습니다.
- Legacy NOSTORY Figma를 Layout 권위로 사용하지 않습니다.

## 관찰된 기준선

### 저장소 및 브라우저 근거

| ID          | 관찰                                                                                                                                                                                                        | 상태       |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `S1-OBS-01` | 현재 `/[locale]/music` Route는 악곡 전용 검색, 필터, 정렬, 목록·Grid 전환 및 Sentinel 자동 불러오기를 제공합니다. 아직 승인된 공용 악곡·채보 범위 모델은 제공하지 않습니다.                                 | `Observed` |
| `S1-OBS-02` | 현재 넓은 Browser 구성은 Desktop 공간을 보이는 필터와 결과 비교에 사용하지 않고 시각적으로 좁은 Mobile형 열에 제한됩니다.                                                                                   | `Observed` |
| `S1-OBS-03` | 현재 목록 Card는 `56px` 재킷과 간결한 후행 난이도 값을 사용하지만, 좁은 구현에서 제목과 아티스트가 일반적으로 일찍 말줄임됩니다.                                                                            | `Observed` |
| `S1-OBS-04` | 현재 정렬 및 보기 Control에는 승인된 공유 `32/40/48px` Visible-control 어휘보다 작은 약 `24px` 높이가 포함됩니다.                                                                                           | `Observed` |
| `S1-OBS-05` | Application은 현재 검증된 Pretendard JP Production delivery가 아니라 `PretendardVariable.woff2`를 제공합니다. 따라서 Pretendard JP delivery, Fallback metric 및 혼합 Script Loading은 아직 검증해야 합니다. | `Observed` |
| `S1-OBS-06` | 현재 구현에는 승인된 2.0 기획서가 대체한 숨은 기본 난이도 제한, 취약순, 즉시 Route 교체 Filter 및 자동 무한 불러오기가 남아 있습니다.                                                                       | `Observed` |

이 관찰은 이관 근거일 뿐 Specimen의 시각·동작 요구사항이 아닙니다.

### 측정된 현재 제품 Compact 기준선

로그인된 `/ko/music` Route를 2026-08-04에 테스트 Browser에서 측정했습니다. 첫
6개 Rendering 결과를 표본으로 하며 현재 구현의 시각적 잘림을 기록한 것이지
접근 가능한 이름의 실패를 뜻하지 않습니다.

| Viewport | 보기 | 측정 Card          | 시각적으로 잘린 제목 | 재킷 비율 | Page 가로 Overflow                    | 해석                                                                        |
| -------- | ---- | ------------------ | -------------------- | --------- | ------------------------------------- | --------------------------------------------------------------------------- |
| `390px`  | 목록 | `343 × 64px`       | `5 / 6`              | 미측정    | 없음 (`375px` Client 및 Scroll width) | 현재의 고정된 Compact 행은 폭을 지키지만 제목을 일상적으로 자릅니다.        |
| `320px`  | 목록 | `273 × 64px`       | `6 / 6`              | 미측정    | 없음 (`305px` Client 및 Scroll width) | 좁은 기준선은 2차원 Overflow 없이 정체성 손실을 늘립니다.                   |
| `390px`  | Grid | `167.5 × 260.75px` | `5 / 6`              | `1:1`     | 없음                                  | 감사에서 확인한 약 `168px` Mobile Grid Card와 정사각형 재킷을 재확인합니다. |
| `320px`  | Grid | `132.5 × 225.75px` | `5 / 6`              | `1:1`     | 없음                                  | 두 열은 Reflow되지만 현재 고정 정보 처리는 긴 정체성에 지나치게 짧습니다.   |

따라서 현재 Route는 두 Compact Grid 열과 정사각형 재킷이 `320px`까지 기계적으로
가능함을 입증하지만, 현재의 고정 Card 높이나 Truncation이 2.0에 적합하다는 뜻은
아닙니다.

### 승인된 Foundation에서의 S1 Compact Geometry

승인된 `16px` Compact Page margin과 `12px` Grid gutter는 Card Border를 빼기 전
다음과 같은 명목 Specimen Geometry를 만듭니다.

| Viewport | 결과 폭 | 목록 구조                                                              | Grid 구조 | 명목 Grid Card |
| -------- | ------- | ---------------------------------------------------------------------- | --------- | -------------- |
| `320px`  | `288px` | 한 열; 정사각형 재킷 = `64–84px` 행 높이 + 유동 정체성 + `92px` 난이도 | 두 열     | `138px`        |
| `390px`  | `358px` | 한 열; 정사각형 재킷 = `64–84px` 행 높이 + 유동 정체성 + `92px` 난이도 | 두 열     | `173px`        |

목록 정체성 영역은 행 높이에 맞춘 정사각형 재킷에 따라 달라집니다. `320px`에서
Caption이 없으면 약 `132px`, `84px` Caption 행이면 약 `112px`이며, `390px`에서는
각각 약 `202px`와 `182px`입니다. 승인된 한 줄 정체성 제한은 Type을 축소하거나
난이도 Group을 숨기지 않고 이 압력을 흡수해야 합니다. Grid Card는 측정된 현재
Card보다 약 `5.5px` 넓습니다.

### 검토할 Grid 수용량 규칙 제안

승인된 탐색 기획서는 약 `168px`을 감사된 일반 Mobile Grid Card로 확인하고,
`390px`에서 두 열을 요구하며, 더 넓은 결과 영역에서 세 열부터 다섯 열까지를
의도합니다. Foundation Compact geometry는 독립적으로 `320px` 두 열을 요구합니다.
따라서 다음 수용량 규칙은 **제안**이며 아직 승인되지 않았습니다.

| 결과 영역 수용량 | 열 수    | 결과 규칙                                                                                      |
| ---------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `288–535px`      | `2`      | `320px` 계약에서 Compact `138px` 하한을 허용하고 Card는 선호 범위까지 유동적으로 늘어납니다.   |
| `536–719px`      | `3`      | `3 × 168px + 2 × 16px`; 모든 Card가 감사된 일반 너비를 유지하기 전에는 열을 추가하지 않습니다. |
| `720–903px`      | `4`      | `4 × 168px + 3 × 16px`.                                                                        |
| `904px` 이상     | 최대 `5` | `5 × 168px + 4 × 16px`; 더 조밀한 Artwork 열을 추가하는 대신 승인된 최대 다섯 열을 지킵니다.   |

이 후보는 기기 이름이나 공유 `672/1056px` Page-grid 전환이 아니라 결과 Container
수용량을 사용합니다. 승인 전에는 여전히 사용자가 `138px` 및 `173px` Specimen을
검토해야 합니다. `200%` Text resize에서는 현재 Specimen이 Grid를 한 열로
바꾸며, 이 Reflow는 별도의 미해결 검토 항목으로 남습니다.

### Catalog 압력 근거

승인된 탐색 감사에서는 긴 정체성 Content가 예외가 아니라 Import Catalog의
일반적인 상황임을 확인했습니다.

- 원문 제목: 중앙값 `11`, 90백분위 `25`, 최댓값 `54`자;
- 아티스트 Credit: 중앙값 `10`, 90백분위 `34`, 최댓값 `67`자;
- 제목 `178`개가 `15`자 이상;
- 아티스트 Credit `218`개가 `15`자 이상.

따라서 Specimen은 짧은 Latin 제목만 검증하지 않고 일반, 장문 및 최대 압력
정체성 Fixture를 포함해야 합니다.

## 검증할 승인 계약

### 구조 및 동작

- 악곡과 공개 채보 범위를 사용하는 하나의 공용 탐색 Surface;
- 펼쳤을 때 보이는 Text를 제공하는 간결한 선행 범위 선택기;
- 두 번째 필수 검색 Action 없이 `300ms` 뒤 IME-safe 결과 갱신;
- 임시 상태와 하나의 **결과 보기** Commit Action을 사용하는 모바일 통합
  Filter/Sort Layer;
- 결과를 계속 보이는 Desktop 노출 Filter 및 Sort Control;
- Commit된 결과 요약, 제거 가능한 적용 조건 및 명시적인 초기화;
- 악곡 목록 기본과 재킷 중심 Grid, 채보 범위의 하나의 Grouping 목록 표현;
- 목록과 Grid 모두 번역·읽기 Caption, 원문 제목 및 아티스트를 각각 말줄임과 함께
  보이는 한 줄로 제한하고 전체 접근 가능 값을 보존하며, 목록 재킷은 Card 높이에
  맞춘 변 길이의 정사각형으로 유지;
- 악곡 난이도 값은 고정된 `Normal → Hard → Expert → Real` 칸 순서를 유지하고,
  각 결과에서 반복되는 보이는 `N/H/E/R` Label은 생략하며, Real이 없으면 해당
  칸을 `–`로 유지하고 전체 난이도명과 값은 접근 가능한 이름으로 제공;
- Viewport가 자동 Trigger하지 않는 명시적인 `20`개 결과 묶음;
- 승인된 Loading, Empty, Error, Retry, Disabled, Permission 및 완료 상태.

### Typography

| Semantic role      | 승인된 Composite                              | S1 사용                                         |
| ------------------ | --------------------------------------------- | ----------------------------------------------- |
| `page-title`       | `24/32 · 700`, 또는 관리된 Wide `32/40 · 700` | 탐색 Page identity                              |
| `entity-title`     | `16/24 · 600`                                 | 반복 결과의 악곡 원문 제목                      |
| `entity-companion` | `14/20 · 400`                                 | 활성화된 번역 또는 일본어 읽기                  |
| `body`             | `16/24 · 400`                                 | Body 처리가 필요한 완전한 보이는 System message |
| `body-secondary`   | `14/20 · 400`                                 | 아티스트 및 간결한 결과 Context                 |
| `control-label`    | 승인된 Role map Composite                     | 범위, Filter, Sort, 보기 및 불러오기 Action     |
| `metadata`         | `12/16 · 400`                                 | 실제로 3차적인 짧은 Fact만 사용                 |
| `metric-value`     | `14/20 · 500`, Tabular figures                | 결과 수, 레벨 및 비교 가능한 간결한 값          |

새 공유 사용자 Text를 `12px` 미만으로 도입할 수 없습니다. 관리된 Wide
`page-title` 전환을 제외하면 모든 Role은 폭에 따라 고정됩니다.

### Layout 및 Target

- Compact: `16px` Safe-aware Page margin, 4개 Logical track, `12px` Gutter;
- Intermediate: `672 CSS px` Page-layout query container부터 8개 Logical track;
- Wide: `1056 CSS px` Page-layout query container부터 12개 Logical track;
- `standard` Content 최대 너비: `1280px`;
- Visible control: `32px` Compact, `40px` Standard, `48px` Comfortable;
- 일반 Public Effective target: 최소 `44 × 44px`;
- Component Reflow는 자동으로 `672px`이나 `1056px`을 따르지 않고 측정된
  Component-container 실패 지점에서 발생.

## Fixture Matrix

### 정체성 Fixture

| Fixture | 목적                    | 대표 Source content                                                   |
| ------- | ----------------------- | --------------------------------------------------------------------- |
| `ID-01` | 짧은 혼합 Script 기준선 | `Altale` / `削除`                                                     |
| `ID-02` | 긴 원문 제목            | `Lachryma《Re:Queen’M》 (BEMANI SYMPHONY NOSTALGIA mix)`              |
| `ID-03` | 긴 일본어·Latin 제목    | `50th Memorial Songs -二人の時 ～under the cherry blossoms～-`        |
| `ID-04` | 최대 압력 아티스트      | `MAX MAXIMIZER VS DJ TOTTO (Arr.by BEMANI Sound Team "Akhuta Works")` |
| `ID-05` | 긴 혼합 Script 아티스트 | `Toby Fox (Arranged by BEMANI Sound Team "Sacha × Sota F.")`          |
| `ID-06` | 선택 Data 없음          | 번역·읽기 없음, 아티스트 없음, Real 채보 없음                         |

승인된 한국어·영어 번역 제목 Fixture는 사용할 수 있을 때 승인된 번역 Data에서
가져와야 합니다. 그 전까지 합성 Stress string은 `Fixture only`로 표시하고
Production Content에 복사하면 안 됩니다.

### 결과 Fixture

- 네 난이도가 모두 있는 악곡;
- Real이 없는 악곡;
- 일치하는 공개 채보 Target이 하나 또는 여러 개인 악곡;
- 일치하는 공개 채보 Target이 없는 악곡;
- 로그아웃 공개 결과;
- 플레이 기록이 없는 로그인 결과;
- 일치 기록이 하나 또는 여러 개인 로그인 결과;
- `20`개보다 작은 마지막 일부 점진적 묶음.

### 상태 Fixture

- 초기, 능동 Query, 적용 Filter 및 선택 Sort;
- 보이는 상태 Threshold 전후의 초기 Loading;
- 오래된 결과를 유지하는 느린 교체;
- Text 불일치, Filter 불일치, 공개 채보 없음 및 빈 Catalog;
- 초기 조회 Error, 교체 Error, 증분 Error, Retry 및 복구;
- 미플레이 활성 상태에서 사용할 수 없는 최근 플레이순;
- Keyboard Focus 미리보기, Fine-pointer Hover 미리보기 및 직접 Touch 이동;
- Reduced motion, `200%` Text resize 및 Safe-area inset.

## 측정 Matrix

| Group             | 필수 측정                                                       |
| ----------------- | --------------------------------------------------------------- |
| Compact           | `320px`, `390px`, 낮은 높이 Mobile, Safe-area inset 변형        |
| 첫 Page 전환      | `671px`, `672px`, `673px` Page-layout query container           |
| 두 번째 Page 전환 | `1055px`, `1056px`, `1057px` Page-layout query container        |
| Wide              | `1280 × 720`, `1440 × 900` 및 `standard` Container ceiling 동작 |
| Text              | 기본, `200%` Text resize, WCAG Text-spacing override            |
| Input             | Touch/Coarse pointer, Fine pointer, Hybrid input, Keyboard-only |
| Language          | 한국어 UI, 일본어 UI, 영어 UI 및 혼합 Script 악곡 정체성        |

Viewport 폭과 Page-layout query-container 폭을 따로 기록해야 합니다. Component
container 실패 지점은 Browser 폭으로 추론하지 않고 해당 Component의 사용 가능한
Inline size로 보고합니다.

## S1 구조 Slice

Specimen을 연결된 Slice로 검토하여 최종 화면 Suite로 확장하지 않으면서 실패
원인을 분리합니다.

1. `S1-A` — Page identity, 범위 선택기 및 검색 Field;
2. `S1-B` — Commit 결과 요약, Filter/Sort 진입, 보기 전환 및 적용 조건;
3. `S1-C` — 일반·장문·선택 정체성 누락을 포함한 악곡 목록 결과;
4. `S1-D` — 정사각형 재킷과 늘어나는 정보 영역이 있는 악곡 Grid 결과;
5. `S1-E` — 공개 Target이 하나 또는 여러 개인 Grouping 채보 결과;
6. `S1-F` — Loading, Empty, Error, Retry, Incremental, Disabled 및 완료 상태;
7. `S1-G` — 결과 옆 Desktop 노출 Filter와 Component-container Reflow.

## 측정 기록 Template

| Field                          | Record        |
| ------------------------------ | ------------- |
| Slice 및 State                 |               |
| Locale 및 Fixture              |               |
| Viewport                       |               |
| Page query-container width     |               |
| Component container width      |               |
| Logical track tier             |               |
| Text resize / spacing override |               |
| Pointer / Keyboard mode        |               |
| Horizontal overflow            | `Pass / Fail` |
| Text clipping 또는 Collision   | `Pass / Fail` |
| Target overlap 또는 Ambiguity  | `Pass / Fail` |
| Reading 및 Focus order         | `Pass / Fail` |
| 안정적인 State change          | `Pass / Fail` |
| 관찰된 실패                    |               |
| Candidate correction           |               |
| 영향을 받는 권위 문서          |               |
| 사용자 결정 필요               | `Yes / No`    |

## 첫 검토 Gate

첫 검토 묶음은 한국어·일본어·영어 및 혼합 Script 정체성 Fixture를 사용해
`320px`과 `390px`에서 `S1-A`부터 `S1-D`까지 비교합니다.

Commit된 결과 요약과 Action은 두 Compact 검증 폭의 기본 Text size에서 같은
시각 행을 공유하도록 승인했습니다. 읽기 순서에서는 요약이 먼저이고 Filter/Sort
및 보기 Action이 두 번째입니다. 항상 분리된 기본 Layout은 과업 위계를 개선하지
않으면서 세로 분리만 늘리므로 거절했습니다. `200%` Text resize나 Localization
Fixture에서 충돌이 발생하면 다른 Layout을 조용히 승인하지 않고 검증 실패로
보고해야 합니다.

남은 검토 질문은 다음과 같습니다.

1. Compact Filter/Sort Layer가 보이는 Desktop Filter 및 Sort Control로 바뀌는
   측정된 Component 폭;
2. 측정된 악곡 Grid 최소 Card 폭과 그에 따른 Intermediate/Wide 열 수;
3. 승인된 Line limit 또는 위계가 승인된 Type 및 Target 계약에서 실패하는지.

위의 남은 항목은 사용자가 측정된 Specimen을 검토하기 전까지 승인되지 않습니다.
후보가
새 Type size, 임의 Spacing 값, 숨겨진 주요 Action 또는 승인된 탐색 Content 순서
변경을 요구하면 Local 예외가 되는 대신 실패로 판정합니다.

## 초안 상태 기록

| ID       | 항목                                                                                                           | 상태         |
| -------- | -------------------------------------------------------------------------------------------------------------- | ------------ |
| `S1V-01` | 이 문서를 제한된 S1 구조 검증 Protocol로 사용합니다.                                                           | `Draft`      |
| `S1V-02` | 위의 `S1-A`–`S1-G` 및 Fixture·측정 Matrix를 사용합니다.                                                        | `Draft`      |
| `S1V-03` | 현재 UI와 현재 Font delivery를 이관 근거로만 취급합니다.                                                       | `Observed`   |
| `S1V-04` | 이전 초안은 첫 검토 Gate의 네 결과를 모두 보류했지만 Compact 행 결과는 이제 승인되었습니다.                    | `Superseded` |
| `S1V-05` | 고정된 칸 순서와 접근 가능한 전체 이름을 보존하면서 반복되는 보이는 `N/H/E/R` Label을 생략합니다.              | `Approved`   |
| `S1V-06` | `320px` 및 `390px` 기본 Text size에서 Commit 결과 요약과 Action을 같은 시각 행에 둡니다.                       | `Approved`   |
| `S1V-07` | 항상 분리된 기본 Compact 결과 Context Layout을 거절합니다.                                                     | `Rejected`   |
| `S1V-08` | 측정된 현재 `320px/390px` 목록 및 Grid 기준선을 이관 근거로 기록합니다.                                        | `Observed`   |
| `S1V-09` | `138px` Compact 하한, `168px` 선호 Grid 너비, `536/720/904px` 수용량 임계점 및 최대 다섯 열을 사용합니다.      | `Proposed`   |
| `S1V-10` | 목록과 Grid 모두 Caption, 원문 제목 및 아티스트를 각각 보이는 한 줄로 제한하고 전체 접근 가능 값을 보존합니다. | `Approved`   |
| `S1V-11` | 이전 초안은 정사각형 목록 재킷을 행 높이와 독립된 `56 × 56px`로 고정했습니다.                                  | `Superseded` |
| `S1V-12` | 목록 재킷을 정사각형으로 유지하고 그 변을 콘텐츠 기반 `64–84px` 목록 행 높이와 같게 만듭니다.                  | `Approved`   |
