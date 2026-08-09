# NosLog 2.0 권위 있는 남은 작업 및 보존 감사

## 문서 관리

- 상태: `Approved scope correction — authoritative remaining-work ledger`
- 정본 언어: 영어
- 영어 정본:
  [57-noslog-2.0-authoritative-remaining-work-audit.md](./57-noslog-2.0-authoritative-remaining-work-audit.md)
- 날짜: 2026-08-10
- 입력: 루트 `AGENTS.md`, 루트 `README.md`, 문서 `01`–`56`, 현재 저장소 근거,
  사용자의 명시적인 viewer/editor 보존 정정
- 목적: 오래된 미래 체크리스트가 완료됐거나 금지된 작업을 되살리지 못하게 함

## 권위 규칙

이 문서와 루트 `README.md` 진행 표가 현재 남은 작업의 권위입니다. 이전 문서는 이미
내린 결정의 근거로 유지되지만, 이 감사가 `Superseded`, downstream, closed 또는
prohibited로 분류한 미래형 체크리스트는 작업을 만들지 않습니다.

## 잠긴 채보 viewer/editor 경계

기존 채보 viewer와 editor 전체를 그대로 보존합니다. 이 잠금에는 page, DOM shell,
control, label, accessibility behavior, responsive composition·containment,
PixiJS/WebGL Falling renderer, Canvas Full-sheet renderer, note·left/right-hand palette,
geometry, animation, chart mathematics 및 editor rendering model이 모두 포함됩니다.

남은 어떤 package도 두 경험을 재설계·재착색·restyle·재배치·교체·reinterpret하거나
NosLog 2.0 변형을 만들 수 없습니다. 과거 viewer/editor Page Brief는 역사적 기능 기록이지
활성 redesign 범위가 아닙니다. 이후 사용자가 다시 여는 범위를 정확히 지목해 명시적으로
결정해야만 이 잠금을 바꿀 수 있습니다.

## 고정 관리 진행률

- 완료 package: `12`
- 진행 중 package: `1`, 허용된 단일 `0.5`로 계산
- 현재 진행률: `12.5 / 18 = 69%`
- 정확한 잔여량: package `13` 완료와 package `14`–`18`, 즉 고정 관리 package `5.5`개

이는 관리 진행률이며 시간이나 노력의 예상치가 아닙니다.

## 정확한 남은 작업

| Package | 정확한 남은 범위                                                                                                                                                                                                                                           | 명시적 제외                                                                                                       | 완료 결과                                                          |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `13`    | 일반 difficulty UI를 neutral로 승인하거나 custom semantic-mapping 예외를 명시적으로 허용하고, 이어서 비교 지역에만 쓰는 score band, FAST/SLOW, series 및 threshold color를 조사·승인합니다.                                                                | Viewer/editor 전체. Basic/Recital, rank/achievement, genre는 별도로 다시 열지 않는 한 neutral입니다.              | `13B`, `13C` 승인 또는 명시적 종료 후 `Complete`.                  |
| `14`    | Icon 문법, icon-only/label 정책, size/stroke와 accessible name 규칙, 일반 UI motion과 reduced-motion 규칙, 일반 data visualization의 axis, legend, tooltip/focus 및 non-color/table fallback을 정의합니다.                                                 | Viewer/editor 전체. Renderer, transport, editor control 또는 editor motion 표본 없음.                             | 승인된 일반 UI iconography, motion, data-visualization 규칙.       |
| `15`    | 완료된 일반 UI fixture `S1`, `S2`, `S3`, `S5`만 사용해 이후 승인 appearance 규칙으로 생긴 drift를 최종 회귀 검증하고 Foundation v0.1을 승격합니다.                                                                                                         | `S4` 없음, `S6` 없음, 새 구조 표본 없음, 완료된 typography/layout/color 입력 재개방 없음.                         | 회귀 기록과 승인된 Foundation v0.1 승격.                           |
| `16`    | 일반 애플리케이션의 component alias, anatomy, state, pattern, template 및 desktop adaptation을 통합합니다. Shell/navigation, action, form, selector, row/card, feedback, table, pagination, overlay, empty/loading/error 및 관련 관리자 흐름을 포함합니다. | Viewer/editor 전체 및 최종 high-fidelity page suite 제외.                                                         | 승인된 재사용 일반 UI system과 template 규칙.                      |
| `17`    | 이미 승인된 Page Brief를 screen requirement, 구현 mapping, 접근성·한국어/일본어/영어 acceptance, browser QA 및 Claude Design handoff package로 통합합니다.                                                                                                 | 완료된 Page Brief를 다시 열지 않고 viewer/editor 변경을 추가하지 않으며 최종 production design을 만들지 않습니다. | Conflict와 acceptance criteria가 명시된 완전한 downstream handoff. |
| `18`    | PDF 언어와 packaging을 결정한 뒤 안정된 editable guide를 날짜와 version이 있는 PDF milestone로 export합니다.                                                                                                                                               | 영어 정본과 완전한 한국어 companion이 일치하기 전에는 export하지 않습니다.                                        | Versioned 배포 artifact와 archive 기록.                            |

각 package 완료 뒤의 고정 milestone은 `13/18 = 72%`, `14/18 = 78%`, `15/18 =
83%`, `16/18 = 89%`, `17/18 = 94%`, `18/18 = 100%`입니다.

## Difficulty UI Gate 설명

열린 difficulty 비교는 채보 note, hand color 또는 viewer/editor element를 다루지 않습니다.
현재 일반 NosLog UI는 music card, music-detail selector, profile row, exam UI 및
tier/admin UI에서 `Normal/Hard/Expert/Real`을 반복해서 다른 색으로 표시합니다. 따라서
Package `13B`는 NosLog 2.0에서 다음 중 무엇을 할지 결정해야 합니다.

1. 절제된 중복 color cue를 작은 marker로 유지합니다(`DU-D1`).
2. 지속적인 difficulty color를 제거하고 보이는 이름, numeric level, fixed order,
   pattern 및 명시적 selection에 의존합니다(`DU-D0`).

제안된 Spectrum 값은 공개된 adaptive color 값이지만 Adobe가 이를 NOSTALGIA difficulty
semantic으로 정의한 것은 아닙니다. Green/orange/red/purple을
Normal/Hard/Expert/Real에 배정하는 것은 invented NosLog mapping이며 공개 value와
semantic mapping을 함께 그대로 채택해야 한다는 현재 규칙을 통과하지 못합니다. 따라서
현재 provenance 규칙에서 승인 가능한 후보는 `DU-D0`뿐입니다. `DU-D1`을 선택하려면 먼저
사용자가 custom semantic-mapping 예외를 명시적으로 허용해야 합니다.

## Superseded, downstream 및 closed 항목

| 이전 항목                                                                  | 현재 처리                                                                                     |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 문서 `24` `FBR-05` 및 `S6` editor 표본                                     | `Superseded`; 실행하지 않습니다.                                                              |
| 문서 `24`/`26` 미래 통합 `S1`–`S6` 검증                                    | `Superseded`; package `15`는 일반 fixture `S1`, `S2`, `S3`, `S5`만 사용합니다.                |
| 문서 `52` 미래 `S4` viewer 또는 `S6` editor material 회귀                  | `Superseded`; 실행하지 않습니다.                                                              |
| Viewer/editor DOM shell, control, responsive 또는 accessibility adaptation | 보존 잠금으로 `Prohibited`; 남은 작업이 아닙니다.                                             |
| 최종 NosLog mark drawing                                                   | `ITA-C` 제약 아래의 `Downstream Claude Design deliverable`; Codex Foundation Gate가 아닙니다. |
| Radix shell 배치 찾기                                                      | `Closed`; 승인된 배치가 없고 사용자가 다시 열기 전에는 탐색하지 않습니다.                     |
| 완전한 최종 high-fidelity page 또는 Figma screen suite                     | `Downstream Claude Design deliverable`; 이 session 범위 밖입니다.                             |
| NosLog 2.0 production 구현                                                 | 미래 Codex 구현 session; 이 session 범위 밖입니다.                                            |

## 남은 작업이 아닌 것

완료된 package `1`–`12`, `S1`–`S5` 구조 설계, 승인된 neutral/focus/identity/action/material
결정, 거절된 `FCM-11` 또는 `SIG-07`, legacy NOSTORY Figma, viewer/editor redesign,
신규 `S6`, 최종 mark drawing, 최종 high-fidelity screen 또는 application 구현을 다시
세거나 시작하지 않습니다.

## 열린 사용자 결정

1. Package `13B`: `DU-D0` 완전 neutral difficulty UI를 승인하거나 custom NosLog
   difficulty-color mapping을 허용하도록 provenance 규칙을 명시적으로 다시 엽니다.
2. Package `13C`: 이후 일반 local data color의 exact-source 비교를 승인합니다.
3. Package `14`–`18`: 근거가 제시될 때 각 material design 또는 packaging Gate를
   승인합니다. 이 roadmap은 그 디자인 선택을 미리 승인하지 않습니다.

## Decision log

| ID       | Entry                                                                            | 상태                                     |
| -------- | -------------------------------------------------------------------------------- | ---------------------------------------- |
| `RWA-01` | 이 감사와 README 표를 현재 남은 작업 권위로 지정합니다.                          | `Approved scope correction — 2026-08-10` |
| `RWA-02` | 기존 viewer/editor 전체를 보존하고 활성 `S4`/`S6` 디자인 작업을 모두 취소합니다. | `Approved correction — 2026-08-10`       |
| `RWA-03` | 고정 18-package 분모와 현재 `12.5/18 = 69%` 진행률을 유지합니다.                 | `Confirmed`                              |
| `RWA-04` | 최종 mark drawing을 downstream으로, Radix 배치 탐색을 closed로 분류합니다.       | `Scope classification`                   |
| `RWA-05` | 일반 difficulty UI 선택을 열어 두고 명시적 사용자 승인을 요구합니다.             | `사용자 검토 대기`                       |
