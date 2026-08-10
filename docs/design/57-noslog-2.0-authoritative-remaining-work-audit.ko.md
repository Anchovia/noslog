# NosLog 2.0 권위 있는 남은 작업 및 보존 감사

## 문서 관리

- 상태: `블록 2 완료 — 근거 있는 남은 작업 4블록`
- 정본 언어: 영어
- 영어 정본:
  [57-noslog-2.0-authoritative-remaining-work-audit.md](./57-noslog-2.0-authoritative-remaining-work-audit.md)
- 날짜: 2026-08-10
- 입력: 루트 `AGENTS.md`, 루트 `README.md`, 문서 `01`–`60`, 현재 저장소 근거,
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

남은 어떤 블록도 두 경험을 재설계·재착색·restyle·재배치·교체·reinterpret하거나
NosLog 2.0 변형을 만들 수 없습니다. 과거 viewer/editor Page Brief는 역사적 기능 기록이지
활성 redesign 범위가 아닙니다. 이후 사용자가 다시 여는 범위를 정확히 지목해 명시적으로
결정해야만 이 잠금을 바꿀 수 있습니다.

## 거절된 진행률 기준선

Git 이력상 고정 18-package 분모는 Material Geometry 문서화 중 commit `1341352`에서
처음 추가됐으며, 이전에 사용자가 승인한 roadmap에서 도출된 값이 아닙니다. 사용자는
2026-08-10 이 부풀려진 계산을 명시적으로 거부했습니다. 따라서 `12.5/18 = 69%`,
fractional package credit 및 18-package 표를 모두 supersede합니다. 사용자가 분모와
계산법을 승인하기 전에는 다른 완료 퍼센트도 보고하지 않습니다.

## 권위 있는 블록 기준선과 정확한 남은 작업

| 블록                                | 정확한 남은 범위                                                                                                                                                                                         | 명시적 제외                                                                                                      | 완료 결과                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `1 · C5 color 마감`                 | `DU-01` difficulty marker, `LD-03` SAP 일반 local-data color와 `JD-02` Radix 판정 domain 보완 승인 완료.                                                                                                 | Viewer/editor 전체. Basic/Recital, rank/achievement, genre는 별도로 다시 열지 않는 한 neutral입니다.             | `Complete — 2026-08-10`.                             |
| `2 · Iconography`                   | `IC-06 · Lucide`의 20px 기본, 16px compact supporting, 공개된 2px outline geometry, label/icon-only, target-size, color, localization 및 accessible-name 규칙을 승인했고 responsive 검증을 완료했습니다. | Viewer/editor 전체와 최종 logo drawing.                                                                          | `Complete — 2026-08-10`.                             |
| `3 · Motion`                        | 일반 UI motion purpose, duration/easing role 및 reduced-motion 대체를 정의합니다.                                                                                                                        | Viewer/editor 전체, renderer timing, transport 및 editor motion.                                                 | 승인된 일반 UI motion 계약.                          |
| `4 · Data visualization`            | 일반 data visualization의 axis, legend, exact value, tooltip/focus 및 non-color/table fallback을 정의합니다.                                                                                             | Viewer/editor 전체와 그 chart rendering.                                                                         | 승인된 일반 data-visualization anatomy.              |
| `5 · Foundation 승격과 reusable UI` | 완료된 `S1`, `S2`, `S3`, `S5` fixture를 최종 회귀 검증하고 Pretendard JP delivery/fallback을 확인한 뒤 Foundation v0.1을 승격하고 검증된 component alias·pattern·template을 통합합니다.                  | `S4` 없음, `S6` 없음, 새 구조 page 작업 없음, 완료된 입력 재개방 없음.                                           | 승인된 Foundation과 재사용 일반 UI guidance.         |
| `6 · Handoff와 milestone export`    | 기존 Page Brief를 screen requirement, 구현 mapping, 접근성·다국어 QA 및 Claude Design handoff로 통합하고 PDF 언어/packaging 결정 뒤 안정된 versioned milestone을 export합니다.                           | Page Brief를 다시 열거나 viewer/editor 변경을 추가하거나 최종 high-fidelity production design을 만들지 않습니다. | 완전한 downstream handoff와 versioned 배포 artifact. |

각 블록 안의 조사, specimen, browser 검증, 이중 언어 갱신 및 export 단계는 하위
작업입니다. 갯수를 늘리기 위해 새 top-level 작업으로 분리하면 안 됩니다.

## 큰 블록 단위 실행 방식

이 고정 여섯 블록 기준선은 완료 이력도 보존합니다. 블록 `1`과 `2` 완료 뒤에는 블록 `3`–`6`만
사용자에게 제시하는 남은 실행 단위로 사용합니다. 한 블록을 시작하면 조사,
후보 비교, specimen, browser 검증, 필요한 material 사용자 결정, 한영 문서 반영과 정리를
모두 같은 블록 안에서 이어서 수행합니다. 사용자에게 속한 material decision, 필요한 권한
부족 또는 블록 완료일 때만 멈춥니다. 블록 안의 승인은 그 블록의 상태만 바꾸며, 승인 뒤
같은 블록을 계속합니다. 새 package나 남은 항목을 만들지 않습니다. 내부 문서, 후보,
Gate와 검증 단계를 “다음 작업”이라고 발표하지 않습니다.

## 완료된 Difficulty UI Gate

완료된 difficulty 비교는 채보 note, hand color 또는 viewer/editor element를 다루지 않습니다.
해당 일반 UI에서는 `Normal/Hard/Expert/Real`을 서로 다른 네 가지 지속 색상으로 보이게
구분하고 이름, numeric level, fixed order 및 명시적 selection을 함께 유지해야 합니다.
이는 승인된 요구사항이며 color와 neutral 중 하나를 다시 고르는 결정이 아닙니다.

블록 `1`은 먼저 정확한 authoritative Light/Dark 값과 네 role mapping을 결정했습니다.
문서 `56`은 정확히 공개된 후보 11개를 비교하며 사용자는 2026-08-10 일반 UI의 작은
difficulty marker에만 `DU-01 · Adobe Spectrum S2`를 승인했습니다. Difficulty text,
background, container, selection, focus, feedback, action 및 viewer/editor 전체는 이 승인
밖입니다. Neutral `DU-D0`는 Rejected이며 후보가 아닙니다. 어떤
후보도 provenance, contrast 및 content 요구를 통과하지 못하면 필요한 색상 구분을 임의로
제거하지 않고 exact-value 실패를 사용자에게 다시 보고합니다.

## Superseded, downstream 및 closed 항목

| 이전 항목                                                                  | 현재 처리                                                                                     |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 문서 `24` `FBR-05` 및 `S6` editor 표본                                     | `Superseded`; 실행하지 않습니다.                                                              |
| 문서 `24`/`26` 미래 통합 `S1`–`S6` 검증                                    | `Superseded`; 블록 `5`는 일반 fixture `S1`, `S2`, `S3`, `S5`만 사용합니다.                    |
| 문서 `52` 미래 `S4` viewer 또는 `S6` editor material 회귀                  | `Superseded`; 실행하지 않습니다.                                                              |
| Viewer/editor DOM shell, control, responsive 또는 accessibility adaptation | 보존 잠금으로 `Prohibited`; 남은 작업이 아닙니다.                                             |
| 최종 NosLog mark drawing                                                   | `ITA-C` 제약 아래의 `Downstream Claude Design deliverable`; Codex Foundation Gate가 아닙니다. |
| Radix shell 배치 찾기                                                      | `Closed`; 승인된 배치가 없고 사용자가 다시 열기 전에는 탐색하지 않습니다.                     |
| 완전한 최종 high-fidelity page 또는 Figma screen suite                     | `Downstream Claude Design deliverable`; 이 session 범위 밖입니다.                             |
| NosLog 2.0 production 구현                                                 | 미래 Codex 구현 session; 이 session 범위 밖입니다.                                            |

## 남은 작업이 아닌 것

완료된 제품·IA·Page Brief·Foundation 범위, `S1`–`S5` 구조 설계, 승인된 neutral/focus/identity/action/material
결정, 거절된 `FCM-11` 또는 `SIG-07`, legacy NOSTORY Figma, viewer/editor redesign,
신규 `S6`, 최종 mark drawing, 최종 high-fidelity screen 또는 application 구현을 다시
세거나 시작하지 않습니다.

## 현재 material decision

정확한 Normal/Hard/Expert/Real marker mapping, `LD-03 · SAP Fiori Horizon` 일반
local-data mapping, `JD-02 · Radix Colors 3.0.0` 판정 domain mapping과 `IC-06 · Lucide`
일반 UI icon grammar가 승인됐습니다. 블록 `1`과 `2`는 계속 완료 상태입니다. 다음 남은
블록은 `3 · Motion`입니다. Icon migration은 별도 남은 항목이 되지 않으며 잠긴
viewer/editor는 계속 제외합니다.

## Decision log

| ID       | Entry                                                                                                      | 상태                                      |
| -------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `RWA-01` | 이 감사와 README 표를 현재 남은 작업 권위로 지정합니다.                                                    | `Approved scope correction — 2026-08-10`  |
| `RWA-02` | 기존 viewer/editor 전체를 보존하고 활성 `S4`/`S6` 디자인 작업을 모두 취소합니다.                           | `Approved correction — 2026-08-10`        |
| `RWA-03` | 고정 18-package 분모와 `12.5/18 = 69%` 진행률을 유지합니다.                                                | `Rejected 및 superseded — 근거 없는 계산` |
| `RWA-04` | 최종 mark drawing을 downstream으로, Radix 배치 탐색을 closed로 분류합니다.                                 | `Scope classification`                    |
| `RWA-05` | 일반 UI의 작은 difficulty marker 네 색에 정확한 Spectrum S2 값을 사용합니다.                               | `Approved — 2026-08-10`                   |
| `RWA-06` | 완료 상태를 포함한 고정 6블록 기준선을 완료 퍼센트나 fractional credit 없이 추적합니다.                    | `Git 이력 감사 후 정정 — 2026-08-10`      |
| `RWA-07` | 문서 `58`에서 Carbon, GitLab Pajamas, SAP Horizon을 세 exact local-data finalist로 올립니다.               | `Completed evidence`                      |
| `RWA-08` | `LD-03 · SAP Fiori Horizon`을 채택하고 남은 블록 `1`을 종료합니다.                                         | `Approved — 2026-08-10`                   |
| `RWA-09` | `JD-02 · Radix Colors 3.0.0`을 판정 marker에 제한적으로 채택하며 블록 `1`을 다시 열지 않습니다.            | `Approved amendment — 2026-08-10`         |
| `RWA-10` | 문서 `60`의 권위 출처 감사와 통제된 일반 UI icon 시편으로 블록 `2`를 시작합니다.                           | `Completed evidence`                      |
| `RWA-11` | `IC-06 · Lucide`를 채택하고 일반 UI grammar와 responsive/localized fixture를 검증해 블록 `2`를 종료합니다. | `Approved and complete — 2026-08-10`      |
