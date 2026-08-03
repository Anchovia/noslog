# NosLog 2.0 채보 에디터 기여 페이지 기획서

## 문서 관리

- 상태: `승인`
- 승인일: 2026-08-03
- 정본 언어: 영어
- 영어 정본:
  [20-chart-editor-contribution-page-brief.md](./20-chart-editor-contribution-page-brief.md)
- 상위 정보 구조:
  [02-information-architecture.ko.md](./02-information-architecture.ko.md)
- 관련 채보 뷰어 계약:
  [07-chart-viewer-page-brief.ko.md](./07-chart-viewer-page-brief.ko.md)
- 관련 개인정보 계약:
  [18-privacy-data-practices-page-brief.ko.md](./18-privacy-data-practices-page-brief.ko.md)
- 범위: 로그인 사용자의 공식 NosLog 채보 기여, 개인 Draft, 심사 제출, 관리자
  심사, 공개, 기여자 표기, 반응형 편집 및 복구 상태
- 제외: 공개 대체 채보 Catalog, 실시간 다중 사용자 공동 편집, 광범위한 관리자
  재설계 및 Recital 강약 채보 편집

## 목적과 성공 조건

사용자용 에디터는 모든 로그인 사용자가 한 악곡 난이도의 하나뿐인 공식 NosLog
채보 제작·개선에 기여하게 합니다. 검증된 관리자 에디터 Core를 재사용하되 직접
공개 행동은 통제된 심사 흐름으로 교체합니다.

작성자가 작업 손실이나 음원 Upload 없이 채보를 생성·재개·Preview·수정·제출할
수 있고, 관리자는 불변 제출본을 심사하여 이전 Canonical Revision을 파괴하지
않고 공개하며, 뷰어 이용자는 공개 채보가 관리자 승인 공식 NosLog 채보임을
신뢰할 수 있으면 성공입니다.

## 현재 제품 근거

- [`ChartPattern`](../../prisma/schema.prisma)은 현재 고유한 채보 관계를 통해 채보당
  하나의 Canonical Pattern을 허용합니다.
- 현재 에디터 경로는 관리자 전용이고 Server Action도 관리자 역할을 강제합니다.
- [`chartTimingEditor.tsx`](../../components/admin/chart-pattern/chartTimingEditor.tsx)는
  재사용할 가치가 있는 Timing, Note, 로컬 음원, Preview, History, Revision,
  Import 및 Export 동작을 이미 제공합니다.
- 현재 `.noslog-chart.json` 경계에는 음원이 없고 로컬 MP3 재생은 브라우저 안에
  남습니다.
- 공개 뷰어는 사용자 Variant의 공개 Collection에서 선택하는 대신 Canonical
  공개 채보 하나를 사용합니다.

이는 구현 관찰입니다. 아래 승인 계약은 현재 Action의 관리자 검사를 약화하는
대신 작성자 소유 Draft와 제출 Model을 새로 요구합니다.

## 승인된 제품 불변 조건

1. 별도 제작자 신청 없이 모든 로그인 사용자가 작성할 수 있습니다.
2. 기여 대상은 별도 커뮤니티 채보가 아니라 공식 NosLog 채보입니다.
3. 사용자는 채보당 활성 개인 Draft 하나와 활성 심사 제출본 하나를 가질 수
   있습니다. 여러 사용자는 같은 채보에 독립적으로 기여할 수 있습니다.
4. 작성자는 빈 상태 또는 현재 공개 Revision 복사본으로 시작할 수 있습니다.
5. 작성자는 자신의 Draft와 제출본만 읽고 변경할 수 있습니다.
6. 제출은 불변 Snapshot을 만듭니다. 이후 Draft 수정은 제출본을 바꾸지 않습니다.
7. Canonical 채보의 공개·교체는 관리자만 할 수 있습니다.
8. 승인은 이전 Canonical Revision과 Rollback 이력을 보존합니다.
9. 승인된 기여자 표기는 제출 전에 고지한 뒤 공개합니다.
10. 로컬 음원은 브라우저를 벗어나지 않습니다. 검증되고 Version이 있는 채보
    데이터만 NosLog 저장소에 도달합니다.
11. 실시간 다중 사용자 공동 편집은 NosLog 2.0 범위 밖입니다.
12. 현재 에디터·뷰어는 Basic 전용으로 유지하며 Recital 강약은 검정 기획서의
    Future Work 계약을 따릅니다.

## 진입, 접근 및 소유권

- 악곡 상세 또는 승인된 채보 Context에서 채보 단위로 진입합니다. 최종 언어
  Prefix Slug는 구현 단계에서 정할 수 있지만 `/admin` 경로를 노출하면 안 됩니다.
- 비로그인 진입은 검증된 Same-origin 언어, 경로 및 Query를 Login까지 전달하고
  같은 채보 기여 의도로 복귀합니다.
- 온보딩 필드가 부족하면 승인된 완료 Gate와 복귀 계약을 따릅니다.
- UI는 색상에만 의존하지 않고 악곡, 난이도, 공개 Base Revision, Draft 소유자,
  저장 상태 및 심사 상태를 식별합니다.
- 사용할 수 없거나 지원하지 않는 채보는 간결한 Disabled 또는 Not-found 상태를
  사용하며 우연히 빈 Draft를 만들면 안 됩니다.

## Draft 및 Revision 계약

### 생성과 Base

- 공개 채보가 있으면 첫 진입에서 ‘공개 Revision에서 시작’과 ‘빈 채보로 시작’을
  명시적으로 제공합니다. 공개 채보가 없으면 빈 채보만 유효합니다.
- 이후 공개 변경을 조용히 덮어쓰지 않고 비교할 수 있도록 Base Canonical
  Revision 식별자를 저장합니다.
- 이미 Draft가 있을 때 새 Draft 생성 행동은 중복을 만들지 않고 기존 Draft를
  재개합니다.

### 편집

- 현재 Timing, BPM, 박자표, Offset, Note, 손, 폭, 경로, 로컬 음원, 메트로놈,
  Preview, Undo/Redo, Autosave, Revision, Import 및 Export 도구를 보존합니다.
- 공개 기여 셸은 컨트롤을 반응형으로 재구성할 수 있지만 편집 기능을 제거하거나
  채보 의미를 바꾸면 안 됩니다.
- Autosave는 `Saving`, `Saved`, `Offline`, `Conflict`, `Failed`를 구분합니다.
  낙관적 동시성 제어를 사용하고 충돌 시 어느 한 Version도 조용히 버리지 않습니다.
- 수동 Revision 이름과 Restore는 작성자 자신의 Draft에 유지합니다.
- Import는 Schema·Version을 검증하고 파괴적 교체 전에 Preview를 제공합니다.
  Export에는 채보 데이터만 포함합니다.

## 심사 제출 계약

- 최종 주요 행동은 **공개**가 아닌 **심사 제출**입니다.
- 제출 전 Schema, Timing 무결성, 지원 Note Type 및 필수 Metadata를 검증합니다.
  검증 오류는 영향을 받은 위치를 식별하고 Draft를 보존합니다.
- 확인 단계는 제출 Snapshot이 읽기 전용이 되고, 승인된 기여자 표기가 공개되며,
  로컬 음원은 제출되지 않음을 설명합니다.
- 작성자·채보당 활성 제출 하나가 `Submitted` 또는 `Changes requested` 상태일 수
  있습니다. 작성자는 철회할 수 있고 철회해도 개인 Draft는 삭제하지 않습니다.
- 심사 중 별도 작업 Draft를 계속 수정할 수 있지만 대기 Snapshot과 Reviewer
  Context는 바뀌지 않습니다.
- 수정 요청은 Reviewer 안내를 담고 최신 Draft 또는 심사받은 Snapshot에서 다음
  제출본을 만들 수 있게 합니다. 반려는 간결한 사유를 기록하고 해당 심사를 끝냅니다.

## 관리자 심사 및 공개

- 심사는 필요한 관리자 흐름이지 관리자 제품 전체 재설계가 아닙니다. 제출
  Metadata, Base Revision, 검증 결과, 기여자, Preview 및 가능한 범위의 의미 있는
  Diff·비교를 보여줘야 합니다.
- Reviewer 행동은 `수정 요청`, `반려`, `승인 및 공개`입니다.
- 제출 Base 이후 Canonical 채보가 바뀌었다면 명시적인 오래된 Base 경고와 비교를
  요구합니다. Last-write-wins로 공개하면 안 됩니다.
- 승인은 새 Canonical 공개 Revision을 만들고 이전 Canonical Revision과 Rollback
  이력을 보존하며 Reviewer·기여자 Provenance를 기록하고 활성 제출을 원자적으로
  닫습니다.
- Rollback은 감사 가능한 Canonical 전환을 하나 더 만들며 승인 제출본이나 과거
  기여자 표기를 지우지 않습니다.

## 정보 및 행동 계층

1. 채보 정체성과 기여·심사 상태
2. 주 채보 Canvas와 시간 탐색 Context
3. 고빈도 편집 도구
4. 선택 항목 전용 속성
5. 재생, 로컬 음원, Preview 및 검증
6. 저장·Revision 이력과 Import·Export
7. 제출 행동과 고지

모든 도구를 영구 상위 Button으로 만들지 않습니다. 기존 작업 공간 Logic을
보존하면서 보조 및 선택 의존 컨트롤을 Context에 맞게 묶습니다.

## 반응형 및 작업 공간 계약

- 문서 셸은 `320 CSS px`에서 페이지 단위 가로 Scroll 없이 Reflow합니다. 시간·
  음높이 Canvas는 실제 2차원 작업 공간이므로 명확히 경계 지은 내부 Scroll을
  사용할 수 있습니다.
- `390px`은 고정 에디터 폭이 아니라 대표 Compact 검토 Canvas입니다.
- 좌·우·하단 도구 영역은 검증된 최소·최대 범위 안에서 접기, Dock, 내부 Scroll,
  크기 조절이 가능합니다. Drag Handle은 Keyboard 또는 명시적인 비 Pointer 대안과
  접근 가능한 Reset을 제공해야 합니다.
- Panel 크기나 Viewport가 바뀌어도 작업 위치, 선택, 재생 시간 및 열린 도구
  Context를 보존합니다.
- Wide Layout은 컨트롤만 키우지 않고 Canvas, 동시 속성, History 및 비교에 추가
  공간을 사용합니다.
- 전체 편집 기능은 유지하되 Compact Layout에서 정밀도가 좋아지는 Landscape나
  넓은 화면을 권장할 수 있습니다. 이 권장은 복구, Export 또는 제출 상태 확인을
  막으면 안 됩니다.

## 접근성 및 다국어

- Canvas Interaction은 Keyboard 동등 행동, 보이는 Focus, Text 선택 피드백 및
  색상 이외의 Note·손 식별을 제공해야 합니다.
- Resizer는 Role, 현재 값, 한계 및 Keyboard 증분을 노출합니다. Touch Target과
  겹치는 Handle은 WCAG 2.2 Target·Focus 요구사항을 충족합니다.
- 재생·Autosave 안내는 간결하고 보조기술을 계속 방해하지 않습니다.
- Dialog는 Focus를 올바르게 가두고 반환합니다. 파괴적 Import 교체와 제출 철회는
  결과를 명확히 설명합니다.
- 한국어·일본어·영어 라벨은 상태, 검증 및 Reviewer 안내를 자르지 않고 Wrap·
  Reflow합니다. Domain 식별자와 채보 JSON Key는 안정적인 기술 용어로 유지합니다.

## 상태 계약

| 상태               | 필수 동작                                                                              |
| ------------------ | -------------------------------------------------------------------------------------- |
| 최초 Loading       | Skeleton 또는 진행 표시가 채보 정체성을 보존하며 편집 가능한 빈 Canvas가 깜빡이지 않음 |
| 새 Draft·재개      | 빈 상태, 공개 기반 및 재개 작업을 명확히 구분                                          |
| Saving·Offline     | 안전한 범위에서 로컬 Interaction을 유지하고 Retry·재연결 상태 노출                     |
| Conflict           | 두 Version을 보존하고 명시적인 해결 경로 요구                                          |
| 검증 실패          | Draft를 보존하고 실행 가능한 오류로 이동                                               |
| Submitted          | Snapshot 잠금, 상태 표시, 안전한 철회 허용, 작업 Draft 분리                            |
| Changes requested  | 안내와 명확한 수정·재제출 경로 표시                                                    |
| Rejected           | 간결한 사유 표시 및 개인 작업 보존                                                     |
| Approved·Published | Canonical Viewer Link와 승인된 기여자 표기 표시                                        |
| 권한 상실          | 변경 중지, 복구 가능한 로컬 작업 보존 및 안전한 이탈 제공                              |
| 누락·삭제 채보     | 다른 작성자 Draft를 노출하지 않고 공통 복구 계약 사용                                  |

## 데이터 및 보안 요구사항

- 작성자 소유 Draft, Draft Revision, 불변 제출 Snapshot, 심사 Event 및 공개
  Provenance Entity를 추가합니다. 동시 개인 상태를 하나의 Canonical
  `ChartPattern` Row에 과적재하지 않습니다.
- 모든 Server Action과 Query에서 소유권·역할을 검사합니다. 컨트롤을 숨기는 것은
  권한 검사가 아닙니다.
- Server에서 채보 JSON을 검증·정규화하고 Payload 크기와 제출 빈도를 제한하며
  심사·Canonical 전환 Audit Trail을 유지합니다.
- MP3, 원격 음원 URL, 실행 콘텐츠 또는 임의 HTML을 채보 Payload로 받지 않습니다.
- Cache와 Viewer 무효화는 원자적인 Canonical 공개 뒤에만 일어납니다.

## 출시 차단 조건

| ID       | 해결되지 않은 출시 요구사항                                                  | 상태        |
| -------- | ---------------------------------------------------------------------------- | ----------- |
| EDIT-B01 | 권리, 보증, Moderation 및 공개 기여자 표기를 다루는 법률 검토 완료 기여 약관 | `출시 차단` |
| EDIT-B02 | 개인 Draft·제출과 보존되는 Canonical 채보 이력·기여자 표기의 탈퇴 처리 정책  | `출시 차단` |
| EDIT-B03 | 운영상 Abuse 제한, 신고·Escalation 경로 및 관리자 심사 Queue 정책            | `출시 차단` |

후속 흐름에는 이 차단 조건을 명시적인 미해결 요구사항으로 표현할 수 있습니다.
자의적으로 만든 법률·Moderation 문구로 채우면 안 됩니다.

## 레퍼런스 Matrix

| 레퍼런스                                                                                                                                                            | 전용 원칙                                                | NosLog 적용                              | 한계                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------- | ------------------------------------------ |
| [osu! Beatmap submission](https://osu.ppy.sh/wiki/en/Beatmapping/Beatmap_submission)                                                                                | 편집과 공개는 서로 다른 단계                             | 개인 작업과 공식 공개 분리               | osu! Category·Ranking 정책은 복사하지 않음 |
| [osu! Beatmap categories](https://osu.ppy.sh/wiki/en/Beatmap/Category)                                                                                              | 공개 상태는 심사 의미를 전달                             | 신뢰 가능한 Canonical 채보 하나 유지     | NosLog에는 공개 대체 Catalog가 없음        |
| [osu! Modding](https://osu.ppy.sh/wiki/en/Modding)                                                                                                                  | 심사 피드백은 실행 가능한 채보 Context를 가리켜야 함     | 수정 요청·재제출 지원                    | 커뮤니티 Moderation 규모가 다름            |
| [GitHub PR reviews](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews)        | 승인·수정 요청·Comment는 별도 결과                       | 명시적 심사 결과 Model                   | Source Code Review는 채보 편집과 다름      |
| [GitHub branches](https://docs.github.com/en/pull-requests/reference/branches)                                                                                      | 독립 작업은 공개 Base를 변경하지 않음                    | 개인 Draft가 Canonical Revision에서 분기 | Git 원리는 사용자에게 노출하지 않음        |
| [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges/managing-protected-branches/about-protected-branches)           | 권한 있는 승인이 Canonical 상태를 보호                   | 관리자 전용 공개                         | NosLog는 더 단순한 역할이 필요             |
| [Sanity roles](https://www.sanity.io/docs/user-guides/roles)                                                                                                        | 작성자와 Publisher 권한이 다름                           | Server 역할 경계 강제                    | Sanity 역할 전체를 채택하지 않음           |
| [Sanity drafts](https://www.sanity.io/docs/content-lake/drafts)                                                                                                     | Draft와 공개 문서는 별도 Identity 필요                   | 개인 작업과 Canonical 채보 분리          | 저장 Model이 다름                          |
| [Contentful roles](https://www.contentful.com/developers/docs/references/content-management-api/roles/)                                                             | 공개는 명시적인 권한 행동                                | 사용자 제출을 공개로 표기하지 않음       | Enterprise CMS 권한은 더 광범위함          |
| [Contentful environments](https://www.contentful.com/developers/docs/tutorials/general/managing-access-to-environments/)                                            | 격리된 변경은 의도적으로 승격                            | Canonical 교체 전 심사                   | Environment 복제는 불필요                  |
| [CKEditor collaboration](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/collaboration.html)                                                      | 실시간 공동 편집은 Presence·Conflict·History 복잡성 추가 | 2.0에서 연기                             | Text와 채보 Timing은 다름                  |
| [Notion permissions](https://www.notion.com/help/sharing-and-permissions)                                                                                           | 소유권·접근은 이해 가능해야 함                           | 작성자는 자기 작업만 확인                | Workspace 공유는 범위 밖                   |
| [SharePoint coauthoring](https://support.microsoft.com/en-us/office/collaborate-on-sharepoint-pages-and-news-with-coauthoring-91d7dc25-37c3-44a4-99da-f552e0f9cfe9) | 동시 편집은 Save·Conflict 동작 필요                      | 낙관적 동시성 근거                       | Microsoft 공개 역할은 복사하지 않음        |
| [Confluence collaborative editing](https://developer.atlassian.com/cloud/confluence/collaborative-editing/)                                                         | Draft 복구·Conflict 처리가 핵심                          | 충돌 시 두 Version 보존                  | 해당 동기화 Stack은 불필요                 |
| [Figma file organization](https://www.figma.com/best-practices/team-file-organization/)                                                                             | 현재 작업과 승인 Asset 상태를 구분                       | 채보·심사 상태 명확화                    | File 조직은 비유일 뿐임                    |
| [Google Docs version history](https://support.google.com/docs/answer/190843?hl=en_)                                                                                 | 이름 있는 History가 복구·책임 지원                       | 작성자·Canonical Revision 보존           | 공동 Text 편집과 다름                      |
| [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)                                                                | Default Deny와 요청별 권한 검사                          | 작성자·관리자 경계 Server 강제           | 제품 계층은 정의하지 않음                  |

## 거절한 대안

- **관리자 에디터 직접 공개 — 거절:** Canonical 공개 권한을 부여하고 개인 작업을
  격리하지 못합니다.
- **공개 사용자 채보 Catalog — 거절:** 승인 목적은 공식 채보 기여이고 뷰어는
  신뢰 가능한 Canonical 채보 하나를 유지합니다.
- **투표·제출 자동 공개 — 거절:** 관리자 심사가 책임성과 Domain 품질을 지킵니다.
- **대기 제출본 수정 — 거절:** 심사는 안정적인 Snapshot을 가리켜야 합니다.
- **2.0 실시간 다중 사용자 편집 — 연기:** 기여에 필수적이지 않으면서 Presence,
  Merge, 소유권 및 Moderation 복잡성을 추가합니다.
- **작성자 음원 Upload — 거절:** 제품 음원 경계를 위반합니다.

## 결정 기록

| ID      | 결정                                                    | 상태   |
| ------- | ------------------------------------------------------- | ------ |
| EDIT-01 | 로그인 공식 채보 기여에 기존 에디터 Core 재사용         | `승인` |
| EDIT-02 | 모든 로그인 사용자에게 채보당 활성 개인 Draft 하나 허용 | `승인` |
| EDIT-03 | 빈 상태 또는 현재 공개 Base 허용 및 Base Revision 기록  | `승인` |
| EDIT-04 | 현재 편집·Preview·Revision·Import·Export 기능 보존      | `승인` |
| EDIT-05 | 사용자 공개를 불변 심사 제출로 교체                     | `승인` |
| EDIT-06 | 작성자·채보당 활성 제출 하나 및 독립 기여자 허용        | `승인` |
| EDIT-07 | Canonical 공개를 관리자로 제한하고 Rollback 이력 보존   | `승인` |
| EDIT-08 | 사전 고지 뒤 승인된 기여자 표기 공개                    | `승인` |
| EDIT-09 | 로컬 음원은 브라우저에 두고 채보 JSON만 저장            | `승인` |
| EDIT-10 | 공개 대체 채보 Catalog와 실시간 공동 편집 제외          | `승인` |
| EDIT-11 | 2.0 에디터는 Basic 전용, Recital 강약은 연기            | `승인` |
| EDIT-12 | 반응형 Dock·크기 조절 도구와 경계 내부 2D Scroll 요구   | `승인` |

## Handoff 경계

Claude Design은 계층, Dock, 도구 묶음, 상태 표현 및 반응형 구성을 다듬을 수
있지만 위의 모든 소유권, 불변 Snapshot, 공개, 음원, 접근성 및 상태 규칙을
보존해야 합니다. 커뮤니티 Catalog를 그리거나 작성자에게 관리자 공개 권한을
노출하거나 출시 차단 조건을 해결된 것처럼 표현하면 안 됩니다. 이후 Codex 구현
세션은 에디터 Component·Action을 재사용하기 전에 데이터 Migration과 권한
Model을 설계해야 합니다.
