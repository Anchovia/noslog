# NosLog 2.0 C5 Spectrum Surface Validation

## 문서 관리

- 상태: `측정된 초기 대표 specimen — 승인된 M-A surface mapping 유지;
foreground 및 boundary 검토는 계속 열림`
- 정본 언어: 영어
- 영어 정본:
  [35-foundation-c5-spectrum-surface-validation.md](./35-foundation-c5-spectrum-surface-validation.md)
- 시작일: 2026-08-08
- 범위: 승인된 `C5M-03` Spectrum S2 surface mapping을 actual content 기반의 경계가
  명확한 NosLog guide fragment 네 개에 적용하고 초기 Light/Dark surface 동작 기록
- 입력: 승인된 문서 `27`–`30`, 문서 `34`의 승인된 surface 결정, 정확한 Spectrum S2
  surface alias 및 승인된 compact 구조 결과
- 제외: high-fidelity page design, production component geometry, foreground 또는
  boundary 승인, focus/signature/feedback/domain/data-visualization 색조, 최종
  shadow/radius/elevation recipe, 애플리케이션 구현

이 문서는 승인된 surface 관계를 검증한다. 시험 foreground, boundary, radius 또는
component geometry를 Foundation 권위로 승격하지 않는다.

## 관련 문서

- [S1 Discovery 구조 검증](./27-foundation-s1-discovery-structural-validation.ko.md)
- [S2 Music Detail 구조 검증](./28-foundation-s2-music-detail-structural-validation.ko.md)
- [S3 Global Rankings 구조 검증](./29-foundation-s3-global-rankings-structural-validation.ko.md)
- [S4 Chart Viewer 구조 검증](./30-foundation-s4-chart-viewer-structural-validation.ko.md)
- [C5 Spectrum S2 semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.ko.md)
- [C5 neutral foreground 레퍼런스 비교](./36-foundation-c5-neutral-foreground-reference-comparison.ko.md)
- [C5 foreground specimen 검증](./37-foundation-c5-foreground-specimen-validation.ko.md)

## 권위 경계

Specimen은 승인된 `M-A` surface 값만 사용한다.

| Role      | Light       | Dark        | 승인된 책임                                     |
| --------- | ----------- | ----------- | ----------------------------------------------- |
| `canvas`  | `#ffffff`   | `#111111`   | page와 shell 기준면                             |
| `surface` | `#f8f8f8`   | `#1b1b1b`   | flat grouped content 및 app-framing layer       |
| `sunken`  | `#e9e9e9`   | `#111111`   | 안쪽으로 물러나는 viewer, editor 및 data well   |
| `raised`  | `#ffffff`   | `#222222`   | 정당화된 lift 또는 부착된 강조를 가진 content   |
| `overlay` | `#ffffff`   | `#222222`   | 억제된 base 위의 불투명 transient content       |
| `scrim`   | black `40%` | black `60%` | background 억제 전용이며 content surface가 아님 |

보이는 content와 boundary alias는 측정 instrument로 사용한 문서 `34`의 제안안이다.
Specimen에 나타난다고 해서 `C5M-04` 또는 `C5M-05`가 승인되는 것은 아니다.

## 대표 Fragment Matrix

| Fragment        | 승인된 구조 출처      | Locale/content 압력                                                          | Surface 질문                                                                  |
| --------------- | --------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Music Discovery | S1-A부터 S1-D         | 한국어 control, 일반 및 긴 mixed-script Music identity, 반복 difficulty 정보 | 모든 row를 raised card로 만들지 않고 flat grouped result를 읽을 수 있는가?    |
| Music Detail    | S2 persistent context | 긴 일본어 제목, metric 세 개, record trend, translated-title disclosure      | flat record, sunken trend 및 overlay stacking이 두 appearance에서 구분되는가? |
| Global Rankings | S3 dense dataset      | 영어 control, 일본어 player, 긴 username, current-user row                   | dense surface dataset이 row rhythm과 neutral current-row 단서를 보존하는가?   |
| Chart Viewer    | S4 focused player     | 한국어 renderer 실패, fallback copy, attached transport, modal suppression   | sunken renderer, raised transport, scrim 및 opaque overlay가 함께 구성되는가? |

이들은 완성 화면이 아니라 guide fragment다. 승인된 content 관계를 보존하면서 page-suite
polish와 관련 없는 기능은 의도적으로 제외한다.

## 초기 Surface 배정

### Music Discovery

- `canvas`가 page body를 소유한다.
- `surface`가 shell bar, search field 및 하나의 flat result group을 소유한다.
- 반복 result row는 shared surface 안에 남고 각자 `raised` card가 되는 대신
  rhythm/boundary를 사용한다.
- jacket placeholder는 경계가 있는 test well로 `sunken`을 사용한다. 향후 artwork
  treatment 승인이 아니다.

### Music Detail

- Identity는 `canvas`에 남는다.
- Record summary는 하나의 flat `surface` 영역이다.
- Recent-record trend는 중첩된 `sunken` data well이다.
- Translated-title disclosure는 underlying identity 위의 transparent text가 아니라
  불투명 `overlay`다.

### Global Rankings

- Dense semantic dataset은 하나의 `surface` 영역이다.
- Row는 peer card가 되는 대신 그 영역을 공유한다.
- Current-user row는 승인된 구조적 inline-start marker를 유지한다. selected color
  fill은 추가하지 않았다.

### Chart Viewer

- Renderer는 `sunken` well이다.
- Attached transport는 renderer에 묶인 별도 control layer이므로 `raised`를 사용한다.
  이는 specimen 배정이며 universal player rule이 아니다.
- 실패 억제는 renderer 위에 승인된 scrim을 사용한 다음 recovery message와 Retry
  control을 불투명 `overlay`에 둔다.

## 브라우저 측정 기록 — 2026-08-08

Interactive specimen은 fragment 네 개, appearance 두 개 및 host width 여섯 개를
실행했다. Host wrapper는 inline padding `32px`를 추가하므로 browser width `352px`와
`422px`가 각각 정확한 `320px`, `390px` specimen frame을 만들었다.

| Browser width | Inner visual width | Specimen frame | 목적                                      |
| ------------: | -----------------: | -------------: | ----------------------------------------- |
|       `320px` |            `288px` |        `288px` | 요구 product minimum 아래의 압력          |
|       `352px` |            `320px` |        `320px` | 정확한 필수 compact reflow width          |
|       `360px` |            `328px` |        `328px` | 중간 compact 압력                         |
|       `422px` |            `390px` |        `390px` | 대표 mobile review canvas                 |
|       `736px` |            `704px` |        `430px` | 일반 host surface 안의 contained fragment |
|      `1024px` |            `992px` |        `430px` | wide host surface 안의 contained fragment |

`6 widths × 4 fragments × 2 appearances`로 자동 측정 조합 `48`개를 만들었다.

| Assertion                                                         | 결과          |
| ----------------------------------------------------------------- | ------------- |
| Document-level horizontal overflow                                | 실패 `0 / 48` |
| Specimen-frame horizontal overflow                                | 실패 `0 / 48` |
| Rendered content의 specimen inline boundary 이탈                  | 실패 `0 / 48` |
| Visible specimen button 또는 input의 effective height `44px` 미만 | 실패 `0 / 48` |
| Scenario 또는 appearance control state 불일치                     | 실패 `0 / 48` |
| 처리되지 않은 browser runtime error                               | `0`           |

주변 conversation surface가 specimen boundary를 숨기지 않는지 host Light와 Dark
appearance에서도 확인했다. Product fragment 자체는 명시적으로 선택한 NosLog
appearance를 유지했다.

## 관찰된 Surface 동작

### 수렴

1. `M-A`는 sparse identity, 반복 discovery row, dense ranking row 및 Viewer recovery
   state에서 절제되고 형광색이 없는 hierarchy를 보존했다.
2. Dark `surface #1b1b1b`는 모든 row를 card로 만들지 않고 grouped content를
   `canvas #111111`에서 분리했다. Dark `raised/overlay #222222`는 로컬 neutral을
   추가하지 않고 더 높은 한 단계를 제공했다.
3. Light `surface #f8f8f8`는 white `canvas` 위에서 조용한 framing/grouping layer로
   읽혔다. Light `sunken #e9e9e9`는 data 및 renderer well에서 명확히 물러났다.
4. 긴 일본어 및 mixed-script identity는 다른 surface map을 요구하지 않았다.
5. Dense current-user ranking row는 승인된 구조 marker로 식별 가능했다. Surface
   color가 selection을 단독으로 운반할 필요가 없었다.

### 예상된 동일 값 pair

- Dark `canvas`와 `sunken`은 모두 `#111111`이다. 따라서 recession에는 enclosure,
  adjacency, geometry 또는 boundary가 필요하며 fill 차이를 가정할 수 없다.
- Light `canvas`, `raised`, `overlay`는 모두 `#ffffff`다. 따라서 stacking에는
  position, boundary, scrim 및 정당화된 경우 이후 측정할 shadow rule이 필요하다.
- Dark `raised`와 `overlay`는 모두 `#222222`다. Overlay는 고유 fill을 보장하는 것이
  아니라 semantic 및 stacking role이다.

이 동일성은 누락된 palette step이 아니라 승인된 upstream alias 동작이다. Specimen은
모든 role을 다르게 보이게 만들기 위해 다른 gray를 합성하지 않았다.

## 육안 검토에서 발견한 교정

첫 Chart Viewer 오류 specimen은 renderer 위 scrim에 recovery text를 직접 배치했다.
육안 검토에서 semantic 오류가 드러났다. Scrim은 background를 억제하지만 불투명
content surface가 아니다. 교정된 구성은 message와 Retry control을 소유하는
`overlay` 뒤에 scrim을 유지한다.

이 교정은 승인된 color를 바꾸지 않았다. `C5M-03`에서 이미 승인된 `scrim` 및
`overlay` 책임을 집행한다.

## 다음 C5 검토에 대한 함의

1. Surface color만으로 selection, focus, error 또는 다른 필수 state를 식별하면 안
   된다.
2. Semantic ownership, enclosure, stacking 및 이후 승인할 boundary/elevation 계약이
   명확하다면 같은 값을 가진 surface pair를 허용할 수 있다.
3. Foreground 검토는 모든 실제 `M-A` surface와 불투명 overlay 위의 text를 시험해야
   한다. Scrim 위에 직접 둔 text는 무효다.
4. Boundary 검토는 decorative grouping과 필수 component/state 단서가 되는 boundary를
   구분해야 한다.
5. 이제 문서 `36`이 필수 broad foreground comparison을 제공한다. 다음 unit은 제안된
   `F-A` foreground specimen 및 adjacency record다. `C5M-04`는 그 근거를 검토할
   때까지 열려 있으며 `C5M-05` boundary mapping은 그 다음에 진행한다.

## 결정 및 검증 상태 로그

| ID       | 항목                                                                                                           | 상태                           |
| -------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `C5S-01` | 초기 대표 fragment에서 로컬 hue shift 또는 neutral step 추가 없이 승인된 `M-A` 값을 사용한다.                  | `Approved via C5M-03`          |
| `C5S-02` | 48개 조합 초기 browser matrix가 기록된 overflow, containment, target-height, state 및 runtime 검사를 통과한다. | `Observed`                     |
| `C5S-03` | Dark canvas/sunken 및 Light canvas/raised/overlay 동일성을 의도된 alias 동작으로 취급한다.                     | `Observed`                     |
| `C5S-04` | Scrim은 background만 억제하며 recovery content에는 그 위의 불투명 overlay가 필요하다.                          | `Approved contract enforced`   |
| `C5S-05` | Current ranking row의 neutral 구조 식별을 보존하고 surface 검증 중 selected hue를 추가하지 않는다.             | `Observed — prior S3 approval` |
| `C5S-06` | Specimen에 보이는 foreground, boundary, radius, shadow 및 component geometry는 계속 비권위 상태로 둔다.        | `Proposed governance`          |
| `C5S-07` | 문서 `36`이 제안한 `F-A` foreground ownership 및 adjacency 측정을 다음 C5 evidence unit으로 진행한다.          | `Proposed — next review`       |
