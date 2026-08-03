# NosLog 2.0 설정 및 계정 관리 페이지 기획서

## 문서 관리

- 상태: `승인`
- 결정 상태: `완전한 설정·계정 관리 계약 승인: 하나의 공개 Locale Prefix
목적지, 반응형 카테고리 내비게이션, 비로그인·로그인 범위, 즉시·명시적 저장
소유권, 언어·테마·번역 제목 동작, 프로필 이미지·NosLog 닉네임·NOSTALGIA
신원·국가/지역·선호 오락실 규칙, 5개의 긍정형 공개 범위 컨트롤, Discord
신원 관리, 로그아웃 및 영구 회원 탈퇴`
- 근거 상태: `저장소·브라우저 점검, 승인된 정보 구조·프로필·공통 셸 기획서,
30개를 넘는 접근성·국제화·디자인 시스템·플랫폼·실제 서비스 레퍼런스 및
사용자 승인 결정 기록`
- 시작일: 2026-08-03
- 마지막 결정 갱신일: 2026-08-03
- 원본 언어: 영어
- 영문 원본:
  [16-settings-account-page-brief.md](./16-settings-account-page-brief.md)
- 상위 정보 구조:
  [02-information-architecture.ko.md](./02-information-architecture.ko.md)
- 공통 셸 계약:
  [15-shared-shell-navigation-brief.ko.md](./15-shared-shell-navigation-brief.ko.md)
- 인증 및 온보딩 계약:
  [17-authentication-onboarding-page-brief.ko.md](./17-authentication-onboarding-page-brief.ko.md)
- 개인정보 및 데이터 처리 계약:
  [18-privacy-data-practices-page-brief.ko.md](./18-privacy-data-practices-page-brief.ko.md)
- 프로필 계약: [09-profile-page-brief.ko.md](./09-profile-page-brief.ko.md)
- 범위: 공개 설정 진입, 카테고리 구조, 설정 소유권과 저장, 비로그인·로그인
  동작, 프로필 편집, 공개 범위, Discord 연동, 로그아웃, 회원 탈퇴, 반응형 적응,
  다국어, 접근성, 상태 및 향후 구현 승인 기준
- 제외: 최종 시각 스타일, 정확한 Foundation Token과 치수, 최종 다국어 문구,
  원시 계정 데이터 내보내기, 관리자 설정 재설계, DB/API 구현 및 이번 디자인
  가이드 세션의 실제 제품 코드 변경

## 결정 라벨

- **관찰:** 저장소, 현재 브라우저 근거, 승인된 상위 산출물 또는 인용 출처에서
  검증한 사실입니다.
- **승인:** 사용자와 명시적으로 합의했으며 후속 디자인에 구속력을 가집니다.
- **제안:** 근거가 있지만 사용자 승인을 기다리는 방향입니다.
- **미결정:** 추가 조사, 시험 또는 사용자 결정이 필요합니다.
- **거절:** 검토 후 명시적으로 선택하지 않은 방향입니다.
- **대체:** 이후 승인된 방향으로 교체된 내용입니다.

이 기획서는 설정 구성, 정보 순서, 동작, 소유권, 상태, 반응형 적응, 접근성 및
승인 기준의 권위 있는 기준입니다. Claude Design은 이후 승인할 Foundation 안에서
최종 시각 구성을 정할 수 있지만 어떤 설정이 존재하는지, 어떻게 저장하는지, 누가
사용할 수 있는지, 민감한 행동이 어떤 결과를 만드는지는 바꿀 수 없습니다.

## 목적

설정은 모든 방문자에게 NosLog 이용 환경을 조정하는 하나의 예측 가능한 장소를
제공하고, 로그인 사용자에게는 신원·공개 범위·연동 상태·계정 생명주기를 안전하게
관리하는 장소를 제공합니다.

이 Surface는 구분되지 않은 하나의 긴 Form이 되지 않으면서 다섯 질문에 답해야
합니다.

1. 이 기기나 계정에서 NosLog를 어떤 모습과 언어로 사용할 것인가?
2. 어떤 신원과 오락실 정보로 나를 나타낼 것인가?
3. 승인된 프로필·활동 필드 중 어떤 것을 다른 사용자에게 공개할 것인가?
4. 어떤 Discord 계정을 로그인 신원으로 사용할 것인가?
5. 충분히 이해한 상태에서 어떻게 로그아웃하거나 NosLog 계정을 영구 삭제할
   것인가?

## 주요 사용 맥락과 성공 조건

- **승인:** 설정은 비로그인·로그인 상태 모두 더보기에서 접근하는 일반 공개 셸
  목적지 `/[locale]/settings`입니다.
- **승인:** 비로그인 사용자는 사용할 수 없는 계정 Form을 마주치지 않고 언어,
  테마 및 번역·읽기 제목 표시를 바꿀 수 있으면 성공합니다.
- **승인:** 로그인 사용자는 카테고리를 찾고, 저장 범위와 공개 결과를 이해하고,
  입력을 잃지 않은 채 저장한 뒤 같은 카테고리에 머물거나 프로필을 볼 수 있으면
  성공합니다.
- **승인:** 민감한 신원·회원 탈퇴 행동은 실행 전에 결과를 설명하고 일부만
  처리되거나 실패한 동작을 성공이라고 알리지 않습니다.
- **승인:** 모바일이 주요 맥락이지만 Wide Layout은 현재의 약 `390px` 열을
  유지하지 않고 공간을 방향 파악과 효율적인 카테고리 전환에 사용해야 합니다.
- **승인:** 한국어·일본어·영어는 동일한 카테고리 의미, 컨트롤 소유권 및 결과
  계층을 보존합니다.

## 현재 제품 근거

### 저장소 근거

- **관찰:** 현재 설정은 로그인 프로필 Route 아래에만 존재하며 비로그인 접근은
  Login으로 Redirect됩니다. 공개 `/[locale]/settings` Route는 아직 없습니다.
- **관찰:** 현재 페이지는 아바타, 테마, Locale, 번역 제목 표시, 오락실,
  Username, 국가, 공개 범위, 편집 가능한 Discord 데이터, 저장·취소 및 회원 탈퇴를
  하나의 긴 Form에 합칩니다.
- **관찰:** 현재 테마는 Dark를 Fallback으로 하는 즉시 `localStorage`
  설정입니다. Locale은 전체 Form 저장 후 적용되는 Staged 설정입니다.
- **관찰:** 현재 저장은 Dirty 상태 구분 없이 항상 사용할 수 있고 성공하면
  프로필로 Redirect합니다. 저장하지 않은 변경 이탈 경고는 검증되지 않았습니다.
- **관찰:** 현재 Username 경로는 입력을 대문자로 바꾸고 고유성 제약을
  적용합니다. 데이터 모델에는 별도의 연동 `nostalgia_name`도 있으며 두 값은 서로
  다른 신원 개념입니다.
- **관찰:** 현재 아바타는 JPG, PNG, WebP와 4MB 이하를 허용하고 공개 Blob에
  저장하지만 승인한 제거·Crop Workflow는 제공하지 않습니다.
- **관찰:** 선호 오락실은 현재 활성 오락실 Native Select를 사용합니다. 이름·지역
  검색, 비활성 선택 유지 및 탐색 이동은 제공하지 않습니다.
- **관찰:** 현재 공개 범위 필드는 부정형 `hide_*` 컨트롤 3개입니다. 승인한 5개의
  긍정형 공개 개념을 다루지 않습니다.
- **관찰:** Discord OAuth가 유일한 인증 신원입니다. 기존 Callback은
  Discord 파생 정보를 갱신하지만 현재 Form은 Discord 값도 편집 가능하게
  제공합니다.
- **관찰:** 현재 회원 탈퇴는 정확한 문구를 요구하고 업로드 Blob을 삭제한 뒤 DB
  데이터를 삭제하고 성공 시 Session을 파기합니다. Blob 삭제 실패 시 DB 삭제를
  막지만 완전한 멱등 재시도와 최근 OAuth 재인증은 현재 검증된 계약이 아닙니다.

### 브라우저 근거

- **관찰:** Compact 너비에서 단일 Form은 관련 없는 행동이 같은 저장 범위를
  공유하는 매우 긴 페이지를 만듭니다.
- **관찰:** Wide Desktop에서도 설정 콘텐츠는 지속적인 카테고리 방향 안내를
  추가하지 않고 동일한 좁은 중앙 셸을 사용합니다.
- **관찰:** 현재 계층은 즉시 표시 설정, Staged 프로필 편집, 읽기 전용 로그인
  신원 및 되돌릴 수 없는 회원 탈퇴를 명확히 구분하지 않습니다.

현재 구현은 기능·데이터 Inventory입니다. NosLog 2.0의 시각·상호작용 권위가
아닙니다.

## 조사 종합

### 수렴한 발견

1. 모바일 설정은 분류된 Overview에서 하나의 집중된 그룹을 여는 구조가
   효과적이며, Wide 설정은 상세 영역 옆에 카테고리 내비게이션을 지속해서 둘 수
   있습니다.
2. 즉시 설정과 명시적 저장 Form은 저장 경계를 시각적·의미적으로 분명히 하면
   함께 사용할 수 있습니다.
3. 언어는 수동 선택할 수 있고 문서 언어와 URL에 반영되어야 하며, 명시적 선택
   이후 자동 협상이 이를 조용히 덮어쓰면 안 됩니다.
4. 테마는 Light·Dark와 함께 System을 제공해야 하며 색상만으로 상태를 전달하지
   않고 사용할 수 있어야 합니다.
5. 공개 프로필 컨트롤은 보이는 결과를 설명하고 활성화가 공개를 뜻하는 긍정형
   라벨이 부정형 “숨기기” 규칙 묶음보다 명확합니다.
6. 인증 신원은 전용 민감 계정 변경 Flow 밖에서는 읽기 전용이어야 합니다.
7. 이름이 붙은 오락실 집합이 커질 때 검색 가능한 단일 선택이 적합하며, Custom
   비접근 Picker가 아니라 Keyboard가 완전한 Combobox 의미가 필요합니다.
8. 파괴적 회원 탈퇴에는 결과, 최근 인증, 정확한 확인, 명료한 최종 행동, 견고한
   처리 및 진실한 완료 보고로 단계가 높아지는 마찰이 필요합니다.
9. 사람이 읽는 SNS 프로필 카드와 원시 기계 판독 데이터 Archive는 서로 다른
   과업이며 같은 라벨이나 동작을 암시하면 안 됩니다.

### NosLog 적용성

- 오락실 주변의 모바일 이용은 짧은 카테고리 과업과 즉시 표시 설정에 적합합니다.
- 국가/지역은 언어의 대용물이 아닙니다. 사용자의 주 NOSTALGIA 플레이 지역과
  지역 랭킹 모집단을 뜻합니다.
- NOSTALGIA 공식 플레이어명은 게임 연동 신원이며 대문자입니다. NosLog 닉네임은
  더 넓은 문자 체계를 지원하는 별도의 서비스 신원입니다.
- Discord가 유일한 로그인 방식이므로 “연결 해제”는 계정을 고립시킵니다.
  NosLog는 대신 갱신과 별도로 확인하는 로그인 계정 변경을 제공합니다.
- 프로필 카드 공유는 프로필 기능으로 유지합니다. 설정 Backup이나 탈퇴 전제
  조건이 아닙니다.

## 승인된 정보 구조

### 하나의 목적지와 맥락별 범위

- 하나의 다국어 진입점 `/[locale]/settings`를 사용합니다.
- 비로그인 전용 설정 페이지나 더보기의 두 번째 계정 설정 진입점을 만들지
  않습니다.
- 정확한 Child Route와 Query State 명명은 구현 Mapping으로 미루지만 선택한
  카테고리는 브라우저 뒤로·앞으로와 직접 URL로 복구할 수 있어야 합니다.
- 2.0 구현 시 기존 다국어 링크를 `/[locale]/profile/settings` 호환 Redirect로
  보존합니다.

### 카테고리 집합과 순서

| 순서 | 카테고리  | 비로그인 | 로그인 | 필수 내용                                                                    |
| ---- | --------- | -------- | ------ | ---------------------------------------------------------------------------- |
| 1    | 이용 환경 | 가능     | 가능   | 언어, 테마, 번역·읽기 제목 표시                                              |
| 2    | 프로필    | 불가     | 가능   | 아바타, NosLog 닉네임, 읽기 전용 NOSTALGIA 신원 맥락, 국가/지역, 선호 오락실 |
| 3    | 공개 범위 | 불가     | 가능   | 5개의 긍정형 공개 범위 컨트롤                                                |
| 4    | 연동      | 불가     | 가능   | 읽기 전용 Discord 신원, 정보 갱신, 로그인 계정 변경                          |
| 5    | 계정      | 불가     | 가능   | 로그아웃, 맥락형 개인정보처리방침 접근, 영구 회원 탈퇴                       |

- 비로그인 사용자는 이용 환경과, 로그인하면 프로필·계정 설정을 사용할 수 있다는
  간결한 Login 안내만 봅니다.
- 접근할 수 없는 로그인 카테고리를 긴 비활성 목록으로 표시하지 않습니다.
- Layout 적응 사이에도 카테고리 라벨을 안정적으로 유지하며 공간 절약을 위해
  카테고리를 합치지 않습니다.

### 정보 우선순위

1. 현재 카테고리 정체성과 저장하지 않은 상태;
2. 주요 컨트롤과 간결한 결과 설명;
3. 카테고리별 저장 또는 민감 행동;
4. Inline 검증과 상태 Feedback;
5. 맥락형 보조 링크.

긴 일반 설명, 반복 Legal Copy, 원시 내부 식별자 및 중복 내비게이션 링크는
Progressive Disclosure하거나 제거합니다.

## 이용 환경 카테고리 계약

### 언어

- 선택지는 한국어, 일본어, 영어입니다.
- 선택 즉시 적용하고 새 Locale Prefix의 동일한 설정 카테고리로 이동합니다.
- URL, 보이는 UI, 문서 `<html lang>` 및 저장 설정을 하나의 일관된 전환으로
  갱신합니다.
- 로그인 선택은 계정에 저장합니다. 비로그인 선택은 브라우저에만 저장합니다.
- `/ja/music/...` 같은 명시적인 공유 URL은 해당 방문을 일본어로 표시하지만
  기존에 저장한 계정·브라우저 설정을 조용히 덮어쓰지 않습니다.
- 명시적 선택이 없는 첫 비로그인 방문은 한국어 브라우저면 한국어, 일본어면
  일본어, 그 외에는 영어로 초기화합니다.
- 선택한 UI 언어에서 국가/지역을 추론하지 않습니다.

### 테마

- 선택지는 System, Dark, Light입니다.
- 명시적 선택이 없는 새 사용자와 비로그인 사용자의 초기 기본값은 System입니다.
- Migration에서 기존의 명시적 Dark 또는 Light 선택을 보존합니다.
- 테마는 로그인 중에도 기기 단위로 유지하며 기기 간 동기화하지 않습니다.
- System은 현재 운영체제 설정을 따르고 운영체제 설정 변경에 반응합니다.
- 세 선택지는 모두 즉시 적용합니다. 카테고리 저장 행동이 필요하지 않습니다.
- 승인한 NosLog 대표 Art Direction은 Dark를 유지하지만 Dark·Light 모두 완전한
  대비, 상태, 차트, 이미지 및 Focus 검증이 필요합니다.

### 번역·읽기 제목 표시

- 하나의 즉시 Toggle이 승인된 보조 곡명 행을 제어합니다. 승인된 데이터가 있을
  때 한국어 UI는 한국어 번역, 일본어 UI는 공식 일본어 읽기, 영어 UI는 영어
  번역을 표시합니다.
- 일본어 원문 곡명은 항상 Primary 제목으로 남습니다.
- 기본값은 켜짐입니다.
- 로그인 선택은 계정에, 비로그인 선택은 브라우저에 저장합니다.
- 끄면 보조 행만 제거하며 검색 Index나 Canonical 악곡 신원을 바꾸지 않습니다.

## 프로필 카테고리 계약

프로필 필드는 하나의 Staged Form이며 카테고리 저장 행동 하나를 사용합니다.
유효한 변경이 생기기 전에는 저장을 비활성화합니다.

### 아바타

- 현재 아바타, 변경 행동, Custom 아바타가 있을 때 제거 행동을 표시합니다.
- JPG, PNG, WebP와 4MB 이하를 허용합니다.
- 파일 선택 뒤 Local 1:1 Crop·Position 단계와 원형 프로필 Preview를
  제공합니다. Crop 상호작용은 Touch와 Keyboard로 사용할 수 있어야 합니다.
- Staged Preview는 프로필 저장에 성공하기 전까지 공개되지 않습니다.
- Upload나 저장 실패 시 기존 공개 아바타와 사용자의 Staged 편집 맥락을
  보존합니다.
- 제거는 나머지 프로필과 함께 Staged하고 성공한 저장 뒤에만 NosLog 생성
  Fallback 이미지로 바뀝니다.
- Discord 갱신이 사용자가 선택한 NosLog 아바타를 덮어쓰면 안 됩니다.

### NosLog 닉네임

- 편집 필드는 의미상 `NosLog 닉네임`으로 Label하며 “NOSTALGIA 이름”으로
  부르지 않습니다.
- 한국어·일본어·Latin 문자의 Unicode 글자·숫자 1~20자, 내부 Space 및 `.`,
  `_`, `-`를 허용합니다.
- 바깥 공백을 Trim하고 공백만 있는 값, Control 문자 및 초기 2.0의 Emoji를
  거절합니다.
- 입력한 표시 대소문자와 허용된 전각·반각 표현을 보존합니다.
- 대소문자와 전각·반각을 구분하지 않는 Normalized 비교 Key로 고유성을
  강제합니다.
- 기존 숫자 Profile URL을 Canonical로 유지하며 닉네임 변경이 공유 링크를
  깨뜨리면 안 됩니다.
- 고유성 오류를 입력한 닉네임을 지우지 않고 Inline으로 설명합니다.

### NOSTALGIA 공식 플레이어명 경계

- NOSTALGIA 플레이어명은 게임 데이터에서 제공하는 별도의 연동 신원입니다.
- 게임 규칙에 따라 대문자를 유지하고 NosLog 설정에서 절대 편집할 수 없습니다.
- 맥락이 필요하면 두 번째 편집 이름 필드가 아니라 간결한 읽기 전용 보조 신원으로
  표시합니다.
- 공개 여부는 공개 범위에서 제어합니다.

### 국가 또는 지역

- 선택지는 한국, 일본, 기타입니다.
- 이 값은 주 NOSTALGIA 플레이 지역과 지역 랭킹 모집단을 뜻합니다. 언어를
  선택하지 않고 언어에서 추론하지 않습니다.
- 기존 값을 바꾸면 Staged 변경을 수락하기 전 랭킹·프로필 결과를 설명하는 짧은
  확인을 엽니다.
- 증명을 요구하거나 긴 Cooldown을 적용하거나 국적을 나타낸다고 암시하지
  않습니다.

### 선호 오락실

- 닫힌 필드는 선택 장소를 `이름 · 지역`으로 요약하고 변경 또는 지우기를
  제공합니다.
- 변경은 장소 이름·지역 검색을 지원하는 Keyboard가 완전한 검색형 단일 선택
  목록을 엽니다.
- 오락실 탐색으로 가는 맥락형 Route를 제공합니다. 설정 안에 지도를 중복
  삽입하지 않습니다.
- 설정에서 선택한 장소는 프로필 저장 전까지 Staged합니다.
- 오락실 상세의 맥락형 “선호 오락실로 설정” 행동은 장소와 결과가 이미 명확하므로
  동일한 필드를 즉시 갱신할 수 있습니다.
- 선택 장소가 이후 비활성화되면 “이용 불가”로 유지하고 변경·지우기를 제공합니다.
  조용히 삭제하지 않습니다.

### 프로필 저장과 완료

- 저장은 유효한 모든 Staged 프로필 변경을 하나의 카테고리 작업으로 반영합니다.
- 성공하면 프로필 카테고리에 머물고 간결한 성공 상태를 알립니다.
- 별도의 `내 프로필 보기` 링크를 제공합니다. 저장 뒤 강제 이동하지 않습니다.
- 저장 실패 시 모든 유효 입력을 보존하고 필드 오류를 표시합니다.
- Staged 변경이 있을 때 이탈하려 하면 버리기 전 경고합니다.

## 공개 범위 카테고리 계약

긍정형 라벨을 사용합니다. 켜짐은 승인된 공개 Surface에 데이터가 보인다는 뜻이며,
꺼짐은 NosLog가 다른 사용자에게 해당 값을 숨긴다는 뜻입니다. 프로필 전체 비공개
Switch를 추가하지 않습니다.

| 순서 | 컨트롤               | 켜짐일 때 공개 의미                                   | 결합 규칙                                                 |
| ---- | -------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| 1    | NOSTALGIA 플레이어명 | 프로필 계약이 허용하는 곳에 연동 공식 플레이어명 표시 | NosLog 닉네임에 영향 없음                                 |
| 2    | Discord 신원         | 공개 프로필에 승인된 Discord 표시 신원 제공           | 연결을 끊거나 로그인 신원을 바꾸지 않음                   |
| 3    | 선호 오락실          | 선택한 선호 오락실 표시                               | 저장한 선택을 삭제하지 않음                               |
| 4    | 총 플레이 횟수       | 누적 플레이 횟수 표시                                 | 다른 계약이 정하지 않는 한 점수·랭킹 데이터를 숨기지 않음 |
| 5    | 플레이 활동          | 마지막 플레이와 최근 플레이를 함께 표시               | 모순되는 부분 공개를 피하도록 하나의 컨트롤이 둘 다 소유  |

- 공개 범위는 하나의 명시적 저장 카테고리입니다. Dirty 전에는 저장을
  비활성화합니다.
- Toggle 변경이 기반 데이터를 삭제하지 않습니다.
- 라벨과 짧은 설명은 내부 `hide_*` 이름을 노출하지 않고 공개 결과를 설명합니다.
- 저장 실패 시 Pending 선택을 유지하고 실패를 알리며 가능하면 영향을 받은
  컨트롤을 식별합니다.
- 공개 Surface는 같은 공개 범위 정책을 일관되게 사용해야 합니다. 프로필 카드,
  프로필 페이지, 랭킹 신원 및 승인된 다른 Consumer가 서로 양립하지 않는 공개
  의미를 임의로 만들면 안 됩니다.

## 연동 카테고리 계약

### Discord 신원

- Discord는 NosLog의 유일한 로그인 방식으로 유지합니다.
- 현재 Discord 파생 표시 신원을 읽기 전용으로 표시합니다. Discord Username이나
  표시 이름을 수동으로 편집하는 필드를 제공하지 않습니다.
- `Discord 정보 갱신`은 OAuth를 통해 현재 승인된 신원 데이터를 요청하고
  Discord 파생 필드만 갱신합니다.
- 갱신은 NosLog 닉네임, Custom 아바타, 국가, 오락실 또는 공개 범위 설정을
  덮어쓰면 안 됩니다.
- Discord 공개 여부는 공개 범위에서만 제어합니다.

### 로그인 계정 변경

- 별도의 민감 행동 `로그인 계정 변경`을 제공합니다.
- OAuth를 시작하기 전에 이후 로그인 신원과 계정 연결이 바뀐다는 점을
  확인합니다. 가벼운 정보 갱신처럼 제시하지 않습니다.
- Callback이 새 Discord 신원을 증명하고 서버가 고유성·계정 연결 규칙을
  안전하게 해결한 뒤에만 변경을 완료합니다.
- Discord가 유일한 인증 방식인 동안 연결 해제를 제공하지 않습니다.
- 취소나 OAuth 실패는 기존 로그인 신원을 유지한 채 연동 카테고리로 돌아가고
  조치 가능한 상태를 알립니다.

## 계정 카테고리 계약

### 로그아웃

- 로그아웃은 영구 회원 탈퇴와 분리한 직접 계정 행동입니다.
- 인증 Session을 지우지만 기기 단위 테마와 저장된 비로그인 브라우저 언어·제목
  설정은 보존합니다.
- 로그아웃 뒤 다국어 Home으로 이동하고 간결한 완료 상태를 제공합니다.

### 맥락형 개인정보처리방침 접근

- 일반 푸터가 개인정보처리방침과 GitHub 링크의 전역 소유자로 남습니다.
- 계정은 정책이 직접 관련된 회원 탈퇴 결과 근처에 맥락형 개인정보처리방침 링크를
  제공할 수 있습니다. 새로운 헤더·더보기 항목이 아닙니다.

### 영구 회원 탈퇴

회원 탈퇴는 즉시 처리되고 되돌릴 수 없습니다. 승인한 2.0 계약에는 유예 기간이나
복구 기간이 없습니다.

#### 진입과 결과 요약

1. 파괴적 영역을 로그아웃과 시각적·의미적으로 분리합니다.
2. Inline으로 삭제하지 않고 접근 가능한 확인 Dialog를 엽니다.
3. NosLog 계정은 삭제되지만 Discord와 공식 NOSTALGIA 계정에는 영향을 주지
   않는다고 설명합니다.
4. 신뢰할 수 있을 때 정확한 개수를 사용하여 간결한 사용자 중심 결과 요약을
   표시합니다. 약 4~5개의 그룹 행을 넘기지 않고 명확해진다면 0개 행은 생략하며,
   원시 DB Table 이름을 절대 노출하지 않습니다.

승인된 결과 그룹은 다음과 같습니다.

- 플레이·연동·최근 플레이 기록;
- 성장·그레이드 이력;
- 서열 투표·커뮤니티 활동;
- 빙고·검정 진행 또는 제출;
- 사용자 Upload·증빙 파일;
- 공개 프로필·랭킹 노출.

개수는 결과를 구체화하지만 빽빽한 DB Inventory가 되면 안 됩니다.

#### 검증과 확인

1. 최종 삭제 전에 최근 Discord OAuth 인증을 요구합니다.
2. Discord 인증을 사용할 수 없을 때 검증을 약화하지 말고 승인된 개인정보
   문의·복구 경로를 제공합니다.
3. Interface가 제공하는 하나의 다국어 정확한 확인 문구를 입력하게 합니다.
4. 최근 인증과 정확한 문구가 모두 유효해질 때까지 최종 파괴적 버튼을
   비활성화합니다.
5. 탈퇴 이유를 묻지 않습니다.

정확한 최종 다국어 문장은 Localization Copy 단계에서 확정하지만 “이 NosLog
계정을 영구 삭제한다”는 의미를 유지해야 하며 `확인` 같은 모호한 일반 표현을
사용하면 안 됩니다.

#### 처리와 결과

- 최종 제출 뒤 중복 요청을 막고 되돌릴 수 없는 서버 작업 중 Dialog를 닫지
  못하게 합니다.
- 서버 작업은 멱등이거나 안전하게 재시도할 수 있어야 합니다.
- 계정 데이터나 Upload가 일부만 삭제됐을 때 성공을 표시하지 않습니다.
- 재시도 가능한 실패는 안전한 복구 맥락을 보존하고, 계정이 완료된 것처럼 보이지
  않게 재시도와 오류 제보 경로를 제공합니다.
- 완전한 성공 뒤 Session을 파기하고 계정 민감 Client Cache를 지우며 다국어
  Home으로 이동해 1회성 완료 상태를 표시합니다.
- 기기 단위 비로그인 테마·언어·번역 제목 설정은 유지합니다.
- 나중에 같은 Discord 신원으로 로그인하면 삭제 데이터를 복구하지 않고 새
  NosLog 계정을 만듭니다.

### 원시 계정 데이터 내보내기 경계

- **NosLog 2.0 범위에서 거절:** 이 설정 기획서에 원시 `내 데이터 내보내기`
  컨트롤을 추가하지 않습니다.
- 승인된 프로필 카드 공유는 X, Discord 및 다른 SNS를 위한 시각적으로 구성한
  프로필 요약을 만듭니다. Backup, Archive, Portability Package 또는 탈퇴 전제
  조건이 아닙니다.
- 원시 기계 판독 Archive가 향후 검증된 요구가 되면 데이터 범위, 개인정보,
  생성, 만료, 다국어 및 운영 비용을 별도의 제품 기능으로 조사합니다. 프로필 카드
  공유를 데이터 내보내기로 바꾸어 부르지 않습니다.

## 저장 및 소유권

| 컨트롤 또는 행동     | 소유권                               | 반영 시점                        | 실패 동작                                                |
| -------------------- | ------------------------------------ | -------------------------------- | -------------------------------------------------------- |
| 언어                 | 로그인 시 계정, 비로그인 시 브라우저 | 즉시                             | 사용할 수 있는 Locale·맥락 유지, 재시도 가능한 상태 표시 |
| 테마                 | 기기·브라우저                        | 즉시                             | 마지막으로 사용할 수 있는 테마 유지                      |
| 번역·읽기 제목 표시  | 로그인 시 계정, 비로그인 시 브라우저 | 즉시                             | 이전 저장 값 유지와 실패 알림                            |
| 아바타·프로필 필드   | 계정                                 | 명시적 프로필 저장               | 입력·Staged Preview 유지, 기존 공개 아바타 보존          |
| 5개 공개 범위 컨트롤 | 계정                                 | 명시적 공개 범위 저장            | Pending 컨트롤 유지와 오류 표시                          |
| Discord 정보 갱신    | 계정 연동                            | 명시적 OAuth 행동                | 기존 신원 보존                                           |
| 로그인 계정 변경     | 계정 연동                            | 확인한 OAuth 행동                | 기존 신원 보존                                           |
| 로그아웃             | Session                              | 명시적 직접 행동                 | Session 무효화 성공 전 로그아웃 완료라고 알리지 않음     |
| 회원 탈퇴            | 계정 생명주기                        | 재인증 + 정확한 문구 + 최종 행동 | 일부·재시도 상태를 진실하게 표시하고 거짓 성공 금지      |

### 명시적 저장 카테고리 규칙

- 유효한 변경 전과 저장 중에는 저장을 비활성화합니다.
- 보이는 Dirty 상태는 버튼 색상에만 의존하면 안 됩니다.
- 저장하지 않은 변경이 있을 때 이탈, 카테고리 변경, 브라우저 History 이동 또는
  페이지 닫기는 하나의 일관된 버리기 경고를 Trigger합니다.
- 서버 검증 실패 뒤 Error Summary가 있으면 먼저 Focus하고 첫 Invalid 필드를
  예측 가능하게 접근할 수 있게 합니다.
- 성공·오류 Feedback은 불필요하게 Focus를 빼앗지 않는 Programmatic Status로
  알립니다.
- 모바일은 명시적 저장 카테고리에서만 카테고리 전용 Sticky 저장 영역을 사용할
  수 있습니다. 전역 내비게이션이 아닙니다.
- Wide Layout은 Detail 영역 안에 카테고리 행동을 유지합니다.

## 상태 계약

| 상태                           | 필수 동작                                                                |
| ------------------------------ | ------------------------------------------------------------------------ |
| 비로그인                       | 이용 환경 사용 가능, 간결한 Login 안내, 비활성 로그인 카테고리 목록 없음 |
| 로그인 Overview                | 유용한 경우 간결한 현재 Summary와 승인 순서의 5개 카테고리               |
| 카테고리 Loading               | 카테고리 방향과 안정적 Geometry 유지, 전체 셸 교체 금지                  |
| 설정 적용 중                   | 필요한 범위에서만 충돌 반복 입력 차단, 읽을 수 있는 현재 값 유지         |
| 변경 없는 명시적 저장 카테고리 | 저장 비활성, 이탈 경고 없음                                              |
| Dirty·유효 카테고리            | 저장 활성, Dirty 상태를 Text나 의미로 노출                               |
| Dirty·유효하지 않은 카테고리   | 저장 비활성 또는 제출 차단, Inline 안내로 Invalid 필드 식별              |
| 저장 중                        | 저장 Busy와 중복 제출 차단, 다른 파괴적 행동 사용 불가                   |
| 저장 성공                      | 카테고리 유지, 간결한 결과 알림, Dirty 해제                              |
| 저장 실패                      | 입력 보존, Error Summary와 Inline 오류, 강제 이동 없음                   |
| 저장하지 않은 이탈             | 버리거나 머무르기 확인, 취소 시 상태 보존                                |
| 아바타 Local Preview           | 저장 성공 전 공개 아바타 변경 없음                                       |
| 아바타 Upload 실패             | 기존 아바타 유지, 재시도 또는 다른 파일 선택 가능                        |
| 닉네임 충돌                    | 입력 표시 보존, 고유성 충돌 Inline 설명                                  |
| 선호 오락실 없음               | 명확한 빈 값과 변경·선택 행동                                            |
| 선호 오락실 이용 불가          | 이용 불가 Label 유지, 변경·지우기 제공                                   |
| Discord 갱신 중                | 기존 로그인 신원 표시 유지, 반복 갱신 차단                               |
| Discord 변경 취소·실패         | 기존 계정 연결 유지, 조치 가능한 상태로 복귀                             |
| 공개 범위 저장 실패            | 기반 데이터와 이전 공개 상태 유지, Pending 선택 재시도 가능              |
| 탈퇴 Dialog 초기               | 가장 덜 파괴적인 초기 Focus, 명확한 제목·결과, 최종 행동 비활성          |
| 탈퇴 재인증 필요               | 요구 설명, 안전하게 유지할 수 있는 Dialog 진행 보존                      |
| 탈퇴 처리 중                   | Dialog 닫기 불가, 최종 행동 중복 차단                                    |
| 탈퇴 재시도 가능 실패          | 성공 주장 없음, 재시도·오류 제보 경로                                    |
| 탈퇴 완료                      | Session·민감 Cache 삭제, 다국어 Home과 1회성 완료 상태                   |
| Offline·요청 중단              | 미반영 Local 입력과 불확실한 서버 결과 구분, 민감 재요청 전 조정         |
| 권한·Session 만료              | 안전한 범위의 비민감 Staged 입력 보존, Login 요구와 복귀 경로 설명       |

## 반응형 Layout 계약

### Compact·모바일

- 현재 인증 상태에서 사용할 수 있는 카테고리만 나열하는 설정 Overview로
  시작합니다.
- 카테고리 선택은 명확한 설정 Back 관계를 가진 집중 Detail Surface를 엽니다.
- 뒤로·앞으로 이동에 카테고리와 Form 상태를 보존합니다.
- 단일 열은 2차원 페이지 Scroll 없이 `320 CSS px`까지 Reflow합니다.
- 명시적 저장 카테고리는 Safe Area 위 Bottom Sticky 행동 영역을 사용할 수
  있습니다. 마지막 필드, Validation, Focus 콘텐츠 또는 Software Keyboard를
  가리면 안 됩니다.
- Dialog, Combobox, 아바타 Crop 및 정확한 문구 확인은 짧은 Viewport 높이와
  200~400% Zoom에서도 사용할 수 있어야 합니다.

### Wide Layout

- 콘텐츠 Fit이 허용할 때 왼쪽 Persistent 카테고리 목록과 오른쪽 하나의 Detail
  영역을 사용합니다.
- Compact 화면을 단순 중앙 정렬·확대하지 않습니다.
- 카테고리 선택은 방향 감각을 잃지 않고 Detail과 History State를 갱신합니다.
- 파괴적 계정 콘텐츠는 Detail 열 안에 두며 탈퇴를 Persistent Navigation으로
  승격하지 않습니다.
- 정확한 전환 너비는 현재 `1024px` 구현이 아니라 실제 한국어·일본어·영어
  라벨과 Detail 콘텐츠 Fit으로 이후 결정합니다.

## 접근성 계약

- 하나의 페이지 `main`과 설명적인 `h1`을 사용하고 카테고리 제목은 일관된
  Heading 순서를 따릅니다.
- 카테고리 내비게이션은 현재 상태를 가진 일반 Link나 Button을 사용하며 ARIA
  `menu` 의미를 사용하지 않습니다.
- 모든 Form 컨트롤에 지속되는 Programmatic Label을 제공합니다. Placeholder만
  Label로 사용하지 않습니다.
- Toggle 이름과 상태는 긍정형 공개 결과를 드러내고 색상만으로 상태를 표시하지
  않습니다.
- 동등한 Composite가 완전한 Keyboard·Screen Reader 검증을 통과하지 않는 한
  언어·테마는 Native Radio 의미를 사용합니다.
- 선호 오락실은 WAI-ARIA Combobox Pattern을 따릅니다. Text Input, 결과 수·상태
  알림, 화살표 이동, Enter 선택, Escape 동작 및 보이는 Focus가 필요합니다.
- 아바타 Crop은 Position·Zoom의 Non-pointer 컨트롤과 의미 있는 Preview 설명을
  제공합니다.
- Validation은 오류 식별, 알 수 있을 때 제안, 계정 삭제의 오류 방지를
  충족합니다.
- 저장·설정 결과는 적합한 Live Status 의미를 사용합니다. 모든 Keystroke나 Crop
  이동을 알리지 않습니다.
- 확인·탈퇴는 상황에 맞는 Modal Dialog·Alert Dialog 동작을 사용합니다. 의미적
  제목·설명, Focus Trap, 처리 전 Escape, 가장 덜 파괴적인 초기 Focus 및 취소 후
  Focus 복귀가 필요합니다.
- 탈퇴 처리 중 닫기는 막지만 Busy 상태는 인지할 수 있어야 합니다.
- Foundation Token 확정 후 승인된 대비, Target Size, Focus Visible, Reflow,
  Zoom, Reduced Motion 및 Focus Not Obscured 요구를 충족합니다.

## 다국어 및 콘텐츠 계약

- 완전한 한국어·일본어·영어 라벨, 안내, Validation, 상태, 확인 문구, 결과 문구 및
  복구 행동을 제공합니다.
- Runtime에서 한국어를 의미적 원본으로 삼아 Locale 라벨을 음차하지 않습니다.
- 일본어·영어 카테고리·행동 라벨은 설정 의미를 자르지 않고 Wrap할 수 있게
  합니다.
- 필요한 곳에서 Code Identifier와 사용자가 입력한 닉네임 표시 형태를
  보존합니다.
- 닉네임 고유성 Normalization은 표시 형태와 분리하고 한국어, 일본어, Latin,
  전각, 반각, Space, Punctuation 및 결합 문자를 시험합니다.
- Locale 변경은 새 카테고리 내용을 알리기 전에 문서 언어를 갱신합니다.
- 국가 값은 다국어 표시 이름을 사용하고 저장 Identifier는 안정적으로
  유지합니다.
- 파괴적 확인 문구는 언어별로 만들고 Input 가까이 표시합니다. 사용자가 문구를
  추측하거나 번역하게 하지 않습니다.
- 탈퇴 결과의 날짜·개수는 Locale 인식 Format을 사용합니다.

## 데이터 및 대표 콘텐츠 요구

향후 디자인 Specimen과 Test에는 다음을 포함합니다.

- 20자의 혼합 Script NosLog 닉네임과 고유성 충돌;
- 서로 다른 NosLog 닉네임과 대문자 NOSTALGIA 플레이어명;
- 현실적인 최장 길이의 한국어·일본어·영어 카테고리·행동 라벨;
- 긴 일본어 장소명과 지역을 가진 선호 오락실;
- 비활성 선호 오락실;
- 아바타 없음, Custom, 실패 및 Staged 상태;
- Discord 표시 이름 변경과 갱신 실패;
- 0, 작은 값, 큰 값의 탈퇴 결과 개수;
- 플레이 활동, Discord 공개 및 선호 오락실이 있거나 없는 프로필;
- 비로그인 브라우저 설정, 기존 로그인 계정 설정 및 비로그인 설정에서 초기화한
  새 계정;
- 설정을 연 상태의 System Theme 변경;
- 만료 Session, Offline 저장, 서버 Validation, OAuth 취소 및 일부 삭제 재시도
  상태.

Layout 판단에 이상적인 짧은 한국어 콘텐츠만 사용하지 않습니다.

## 구현 Mapping

향후 구현은 현재 Form Geometry를 복사하지 말고 현재 코드를 평가하여 데이터를
안전하게 보존해야 합니다.

| 현재 또는 필수 영역                     | 필수 2.0 책임                                                                                            |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 현재 `/[locale]/profile/settings` Route | Locale과 가능한 경우 카테고리 의도를 보존하는 호환 Redirect                                              |
| 새 `/[locale]/settings` 패밀리          | 공개 Overview, 로그인 카테고리, URL 복원 Detail State, 일반 셸                                           |
| 현재 Settings Form·Action               | 즉시 이용 환경 컨트롤과 명시적 프로필·공개 범위 작업으로 저장 소유권 분리                                |
| 사용자 설정 모델                        | System Theme Migration, 계정·브라우저 언어·제목 우선순위, 5개 긍정형 공개 개념                           |
| 사용자 신원 모델                        | 별도의 NosLog 닉네임과 연동 대문자 NOSTALGIA 이름 보존                                                   |
| 닉네임 저장                             | Canonical 숫자 Profile URL을 바꾸지 않고 Normalized 고유 Key 추가                                        |
| 아바타 Storage·Action                   | Staged Crop·Remove, 안전한 Blob 교체, 실패 Rollback, Discord보다 사용자 아바타 우선                      |
| 오락실 Selector·API                     | 검색형 활성 장소 선택, 이용 불가 값 유지, 맥락형 상세 행동                                               |
| Discord OAuth                           | 읽기 전용 표시, 갱신 전용 필드 Update, 확인된 계정 변경, 탈퇴 Recent Reauth                              |
| 탈퇴 Action·Storage                     | 결과 개수, 안전한 Upload·Data 삭제, 멱등성, 일부 실패 진실성, Session·Cache 삭제                         |
| 프로필·공개 범위 Consumer               | 공개 프로필·카드·랭킹·승인된 Surface 전체에 동일한 긍정형 공개 계약 적용                                 |
| 자동·브라우저 Test                      | 저장, History, Dirty 경고, Validation, OAuth, 탈퇴, Reflow, Locale, Theme, Semantics 및 공개 범위 일관성 |

정확한 DB Migration, Endpoint 이름, 카테고리 Route Syntax 및 최종 Component
이름은 향후 구현 계획에 속합니다. 이 동작 계약을 약화할 수 없습니다.

## 브라우저 승인 계약

향후 디자인과 구현은 최소한 다음을 검증해야 합니다.

1. 비로그인·로그인 `/ko/settings`, `/ja/settings`, `/en/settings` 진입, 더보기
   내비게이션 및 Legacy Route Redirect;
2. 비활성 계정 카테고리 Inventory 없이 동작하는 비로그인 이용 환경 컨트롤;
3. 로그인 카테고리 Overview와 Link·Reload·Back·Forward를 통한 프로필·공개
   범위·연동·계정 카테고리 직접·복원 State;
4. 카테고리를 유지하는 즉시 언어 전환, 정확한 URL·`<html lang>`, 저장 설정
   우선순위 및 명시적 공유 Locale URL 동작;
5. System·Dark·Light 적용, 기존 선택 Migration, 운영체제 변경, Reload 유지 및
   두 시각 테마;
6. 번역 제목 Toggle 기본값, 계정·브라우저 소유권 및 원문 제목 보존;
7. 아바타 Format·Size 거절, Touch·Keyboard Crop, Preview, Remove, 저장 성공,
   Upload 실패 및 Discord 갱신 비간섭;
8. 닉네임 Unicode 규칙, Normalization 충돌, 표시 보존, Validation 복구 및
   바뀌지 않는 숫자 Profile URL;
9. 별도의 읽기 전용 대문자 NOSTALGIA 이름과 공개 범위 동작;
10. 언어와 독립적인 국가 확인, 선호 오락실 검색·지우기·이용 불가 유지·탐색
    링크·상세 페이지 즉시 행동;
11. 모든 공개 Consumer의 각 긍정형 공개 컨트롤과 기반 데이터를 잃지 않는 저장
    실패;
12. Discord 읽기 전용 신원, 갱신, 취소·실패, 계정 변경, 연결 해제 부재 및 관련
    없는 프로필 필드 비덮어쓰기;
13. 명시적 저장의 Clean, Dirty, Invalid, Saving, Success, Failure, 버리기 경고,
    카테고리 변경 및 Session 만료;
14. 탈퇴 결과 개수, 최근 OAuth 재인증, 정확한 다국어 문구, 버튼 Gating,
    Keyboard Focus, 처리 Lock, 재시도·일부 실패, 완전 삭제, Cache·Session 삭제 및
    이후 새 계정 동작;
15. 세 언어의 `320px`, 대표 `390px`, 콘텐츠 기반 중간 전환 및 `1280px` 같은
    Wide Viewport, 짧은 높이와 200~400% Zoom;
16. Keyboard 전용 이동, 보이는 Focus, Label, Announcement, Combobox, 확인
    Dialog, Reduced Motion, Target Size, 가려진 Focus 없음 및 예기치 않은 가로
    Page Scroll 없음.

Lint, Typecheck 및 Component Test는 실제 다국어 반응형 상호작용의 브라우저
점검을 대체하지 않습니다.

## 레퍼런스 매트릭스

| 출처                                                                                                                                                        | 전용 원칙                                                   | NosLog 적용                               | 한계                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------- |
| [Android Settings](https://developer.android.com/design/ui/mobile/guides/patterns/settings)                                                                 | 관련 설정을 예측 가능한 카테고리로 묶음                     | Compact Overview와 집중 카테고리 Detail   | Android 시각 Pattern이 NosLog Web Styling을 정하지 않음 |
| [SAP Fiori Profile and Settings](https://www.sap.com/design-system/fiori-design-android/v26-1/patterns/profile-and-settings/usage)                          | 프로필, 앱 설정, 계정 행동 분리                             | 5개의 명시적 카테고리                     | Enterprise Mobile 범위가 NosLog와 다름                  |
| [Primer Layout](https://primer.style/product/getting-started/foundations/layout/)                                                                           | 반응형 구성은 가용 공간을 의도적으로 사용                   | Compact Drill-in과 Wide List-detail       | 설정 내용을 정하지 않음                                 |
| [Grafana Save pattern](https://grafana.com/developers/saga/patterns/save/)                                                                                  | 저장 소유권과 Feedback은 예측 가능해야 함                   | 카테고리 단위 Staged 저장                 | Grafana는 더 밀도 높은 관리자 Form                      |
| [GitLab Saving and Feedback](https://design.gitlab.com/patterns/saving-and-feedback/)                                                                       | 즉시·명시적·Loading·성공·실패 상태 구분                     | 경계가 명확한 혼합 저장 모델              | GitLab Component Styling은 채택하지 않음                |
| [Agriculture Warn before leaving](https://design-system.agriculture.gov.au/patterns/warn-before-leaving)                                                    | 이동이 의미 있는 미저장 작업을 버리면 경고                  | 프로필·공개 범위 Dirty 보호               | 정확한 Browser 통합은 구현 작업                         |
| [W3C Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)                                                           | 오류를 Text로 식별하고 컨트롤과 연결                        | Error Summary와 Inline Validation         | 제품 문구는 정하지 않음                                 |
| [W3C Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)                                                                          | 불필요한 Focus 이동 없이 결과 알림                          | 즉시 설정·저장 Feedback                   | Live Region은 검증 필요                                 |
| [W3C Form Labels](https://www.w3.org/WAI/tutorials/forms/labels/)                                                                                           | 지속적인 Programmatic Label 필요                            | 모든 설정·확인·Crop 컨트롤                | NosLog 계층은 정하지 않음                               |
| [Android Dark Theme](https://developer.android.com/develop/ui/views/theming/darktheme)                                                                      | System 설정과 완전한 Theme Coverage 지원                    | System·Dark·Light                         | Android Token은 전용하지 않음                           |
| [Apple Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)                                                                  | Appearance 사이 가독성·대비·이미지 보존                     | 두 테마 모두 완전한 시각 검증             | Apple Platform Styling은 채택하지 않음                  |
| [web.dev prefers-color-scheme](https://web.dev/articles/prefers-color-scheme)                                                                               | 운영체제 Appearance 설정 존중·반응                          | System Theme                              | Browser Support 상세는 변할 수 있음                     |
| [web.dev Theme switch](https://web.dev/articles/building/a-theme-switch-component)                                                                          | Theme 컨트롤에 명시적 상태·유지·접근 가능한 상호작용 필요   | 즉시 3개 선택지 Theme                     | 예시 Code는 구현 권위가 아님                            |
| [W3C Language Negotiation](https://www.w3.org/International/questions/qa-when-lang-neg)                                                                     | 자동 협상은 초기 선택이며 사용자 컨트롤 대체 아님           | 첫 방문 Locale 기본값                     | URL Routing은 정하지 않음                               |
| [W3C Site Language Navigation](https://www.w3.org/International/questions/qa-site-conneg.en.html)                                                           | 보이는 언어 선택과 명시적 선택 기억                         | 공개 설정 언어 컨트롤                     | 콘텐츠 전략은 NosLog 고유                               |
| [W3C Language Selector](https://www.w3.org/International/questions/qa-navigation-select)                                                                    | 이해 가능한 언어명을 쓰고 국기만 쓰는 언어 컨트롤 회피      | 한국어·일본어·영어 선택                   | 카테고리 Layout은 정하지 않음                           |
| [W3C Declaring Language](https://www.w3.org/International/questions/qa-html-language-declarations.html)                                                     | 문서 언어 Metadata는 Rendering 언어와 일치                  | Locale과 `<html lang>` 갱신               | 저장 방식은 정하지 않음                                 |
| [Google Search settings](https://www.google.com/preferences)                                                                                                | 비로그인도 Browser 단위 언어·표시 설정 가능                 | 공개 이용 환경 카테고리                   | Google 설정 집합은 다름                                 |
| [YouTube Language or Location](https://support.google.com/youtube/answer/87604)                                                                             | 언어와 위치는 결과가 다른 별도 설정                         | Locale과 플레이 지역 분리                 | YouTube 위치 의미는 다름                                |
| [osu! Account Help](https://osu.ppy.sh/wiki/en/Help_centre/Account)                                                                                         | 리듬게임 신원·국가 변경에 명시적 계정 의미 필요             | 국가 결과와 신원 분리                     | osu! 정책이 NosLog 검증을 정하지 않음                   |
| [osu! Ranking](https://osu.ppy.sh/wiki/en/Ranking)                                                                                                          | 국가 Grouping은 경쟁 랭킹 맥락에 영향                       | 지역 랭킹 모집단 설명                     | NOSTALGIA 랭킹 규칙이 권위                              |
| [Unicode CLDR Territory Names](https://cldr.unicode.org/translation/displaynames/countryregion-territory-names)                                             | 안정적 Identifier에 다국어 표시 이름 사용 가능              | 한국·일본·기타 표시                       | “기타”는 NosLog 제품 Grouping                           |
| [Discord OAuth2](https://docs.discord.com/developers/platform/oauth2-and-permissions)                                                                       | OAuth 신원 행동에 명시적 권한 경계 필요                     | 갱신·계정 변경·Recent Reauth              | 계정 연결 정책은 NosLog 소유                            |
| [Discord User Resource](https://docs.discord.com/developers/resources/user)                                                                                 | Discord 필드는 원격 신원 Record에서 유래                    | 읽기 전용 Discord 파생 정보               | 제공 필드는 Scope에 의존                                |
| [Discord Usernames](https://support.discord.com/hc/en-us/articles/12620128861463-New-Usernames-Display-Names)                                               | Username과 Display Name은 다른 Discord 개념                 | 수동 Discord 편집 회피                    | Discord 용어는 변할 수 있음                             |
| [Discord Connections FAQ](https://support.discord.com/hc/en-us/articles/32330173689623-Account-Connections-on-Discord-FAQ)                                  | 공개 범위와 계정 연결은 별개                                | 공개 Toggle은 Login 연결을 끊지 않음      | Discord Native Profile 연결은 다름                      |
| [Google Profile Picture](https://support.google.com/accounts/answer/27442)                                                                                  | Profile Image에 Preview·변경·제거 기대                      | 아바타 Workflow                           | Google Crop 동작은 복사하지 않음                        |
| [GitHub Profile Personalization](https://docs.github.com/en/account-and-profile/tutorials/personalize-your-profile)                                         | 서비스 신원 필드를 명확히 이름 붙이고 독립 편집             | NosLog 닉네임 경계                        | GitHub Naming 규칙은 다름                               |
| [GOV.UK File Upload](https://design-system.service.gov.uk/components/file-upload/)                                                                          | 허용 Type·Size·오류·복구 명시                               | JPG/PNG/WebP·4MB 아바타 검증              | Crop은 Component 범위 밖                                |
| [W3C Images Tutorial](https://www.w3.org/WAI/tutorials/images/)                                                                                             | 목적에 맞는 Image Alternative 필요                          | 아바타·Preview Semantics                  | Interactive Crop은 추가 컨트롤 필요                     |
| [W3C Personal Names](https://www.w3.org/International/questions/qa-personal-names.en)                                                                       | 이름을 한 문자 체계·서구 구조로 제한하지 않음               | Unicode NosLog 닉네임                     | 안전한 문장부호·고유성은 NosLog 결정                    |
| [osu! Registration](https://osu.ppy.sh/wiki/en/Registration)                                                                                                | 리듬게임 커뮤니티 신원에 고유성·Naming Rule 존재            | 비교 가능한 닉네임 검증 맥락              | NosLog는 다른 Script·URL 지원                           |
| [WAI-ARIA Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)                                                                                     | 검색 선택에 정의된 Keyboard·Focus·Popup 동작 필요           | 선호 오락실 검색                          | 최종 시각 구성은 후속 작업                              |
| [USWDS Combo Box](https://designsystem.digital.gov/components/combo-box/)                                                                                   | 긴 Option 집합은 Filtering과 견고한 상태에 적합             | 장소명·지역 Filtering                     | Federal Token은 전용하지 않음                           |
| [Primer Autocomplete](https://primer.style/product/components/autocomplete/)                                                                                | Autocomplete는 결과·선택을 명확히 전달                      | 단일 선호 오락실 결과                     | GitHub Use Case에는 Multi-select 포함                   |
| [Carbon Dropdown](https://carbondesignsystem.com/components/dropdown/usage/)                                                                                | Option 규모·과업에 따라 Dropdown·Combobox·Autocomplete 선택 | 성장하는 장소에 Map·긴 Native Select 회피 | Carbon 용어는 최종 Component 명이 아님                  |
| [Steam Privacy](https://help.steampowered.com/en/faqs/view/588C-C67D-0251-C276)                                                                             | 공개 신원·활동 필드는 서로 다른 공개 컨트롤 가능            | 5개 Field-level 공개 개념                 | Steam 전체 비공개 Mode는 채택하지 않음                  |
| [Google Profile Visibility](https://support.google.com/accounts/answer/6304920)                                                                             | 다른 사람이 볼 개인정보 설명                                | 긍정형 결과 Label                         | Google은 더 넓은 계정 생태계                            |
| [GitHub Delete Account](https://docs.github.com/en/enterprise-cloud%40latest/account-and-profile/how-tos/account-management/deleting-your-personal-account) | 탈퇴 결과 열거와 의도적 확인                                | 구조화된 NosLog 결과 Dialog               | GitHub 소유권 이전 규칙은 적용 안 됨                    |
| [Google Delete Account](https://support.google.com/accounts/answer/32046)                                                                                   | 데이터 손실과 영향 없는 외부 서비스 설명                    | NosLog와 Discord·NOSTALGIA 경계           | Google Export는 NosLog 2.0에서 승인 안 됨               |
| [Discord Delete Account](https://support.discord.com/hc/en-us/articles/212500837-How-to-Delete-your-Discord-Account)                                        | 인증 플랫폼 계정 생명주기와 연결 서비스 삭제는 다름         | Discord 계정 유지 설명                    | Discord 자체 탈퇴는 NosLog 범위 밖                      |
| [Mozilla Delete Account](https://support.mozilla.org/en-US/kb/firefox-accounts-managing-account-data)                                                       | 영구 삭제에 명확한 범위·완료 상태 필요                      | NosLog 데이터 그룹과 비가역 결과          | Mozilla 데이터 분류는 다름                              |
| [Steam Account Deletion](https://help.steampowered.com/ms/faqs/view/21A6-7C93-6CFE-100B)                                                                    | 영향 큰 삭제는 확인·안전장치 사용                           | 단계가 높아지는 마찰                      | Steam 유예 정책은 채택하지 않음                         |
| [Microsoft Close Account](https://support.microsoft.com/en-US/accounts-billing/manage/how-to-close-your-microsoft-account)                                  | 외부 구독·서비스와 계정 영향 구분                           | 영향 없는 NOSTALGIA·Discord 설명          | Microsoft 생태계 복잡성은 NosLog와 다름                 |
| [Atlassian Delete Account](https://support.atlassian.com/atlassian-account/docs/delete-your-atlassian-account/)                                             | 분산 데이터의 삭제 상태·재시도 고려                         | 진실한 완료·일부 실패                     | 조직 소유권은 적용 안 됨                                |
| [W3C Error Prevention](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html)                                              | 사용자 제어 데이터 삭제에 검토·확인·복구 중 하나 필요       | 결과 검토·재인증·정확한 문구              | NosLog는 삭제가 비가역이므로 확인 선택                  |
| [WAI-ARIA Alert Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)                                                                              | 긴급 확인에 의미적 제목·설명·제어된 Focus 필요              | 최종 탈퇴 경고                            | 모든 설정 Dialog가 Alertdialog는 아님                   |
| [WAI-ARIA Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)                                                                             | Modal에 Focus Trap·Escape·복귀 필요                         | 계정 변경·탈퇴 Dialog                     | 처리 Lock은 제품 고유                                   |
| [USWDS Modal](https://designsystem.digital.gov/components/modal/)                                                                                           | Modal은 집중되고 간결하며 좁은 너비에서 사용 가능해야 함    | 제한된 결과 요약                          | USWDS Styling은 전용하지 않음                           |
| [Google Download Data](https://support.google.com/accounts/answer/3024190)                                                                                  | 원시 데이터 Archive는 별도 Portability Workflow             | Export와 SNS 공유 분리 근거               | NosLog 2.0은 명시적으로 제외                            |
| [Discord Data Package](https://support.discord.com/hc/en-us/articles/360004957991-Your-Discord-Data-Package)                                                | 데이터 Package는 생성·범위·Download·Privacy 규칙 필요       | 미래 Export를 별도 제품으로 취급          | Discord Package 범위는 NosLog를 정하지 않음             |

## 거절·대체한 대안

- **로그인 전용 설정 — 거절:** 비로그인 사용자도 인증 없이 언어, 테마, 제목
  설정을 실제로 사용할 필요가 있습니다.
- **별도 비로그인 설정 Route — 거절:** 하나의 예측 가능한 목적지가 더 명확하고
  인증 상태로 범위를 드러낼 수 있습니다.
- **하나의 긴 로그인 Form — 거절:** 관련 없는 저장·결과 경계가 특히 모바일에서
  불명확해집니다.
- **비로그인에게 비활성 로그인 카테고리 표시 — 거절:** 과업을 가능하게 하지 않고
  길이만 늘립니다. 간결한 Login 안내면 충분합니다.
- **모바일 전용 하단 설정 내비게이션 — 거절:** 승인한 반응형 상단 셸 모델과
  충돌하고 Wide Layout으로 전용되지 않습니다.
- **계정에 테마 동기화 — 거절:** 기기 환경이 더 강한 소유자입니다. 언어·제목
  표시는 계정 인식 설정으로 유지합니다.
- **Dark를 보편 기본값으로 사용 — 대체:** 기존 명시적 Dark·Light 선택은
  보존하고 초기 기본값은 System입니다.
- **국가/지역에서 언어 결정 — 거절:** UI 언어와 플레이·랭킹 지역은 다른 사용자
  개념입니다.
- **자동 Locale 협상이 명시적 설정 덮어쓰기 — 거절:** 직접 링크는 저장 선택을
  조용히 바꾸지 않고 해당 Locale을 표시할 수 있습니다.
- **모든 카테고리의 전역 저장 하나 — 거절:** 즉시 표시 설정과 Staged
  프로필·공개 범위는 다른 반영 시점이 필요합니다.
- **저장 후 프로필 강제 이동 — 거절:** 성공은 맥락에 머물며 프로필 보기는 별도
  행동입니다.
- **편집 가능한 NOSTALGIA 이름 — 거절:** 연동 공식 게임 신원입니다.
- **NosLog 닉네임 강제 대문자 — 대체:** 표시 형태를 보존하면서 Normalized
  고유성을 적용합니다.
- **초기 닉네임 Emoji — 2.0에서 거절:** Normalization, Moderation, Rendering,
  검색 동작을 의도적으로 정할 때까지 미룹니다.
- **선호 오락실 설정에 Map 삽입 — 거절:** 검색형 단일 선택이 편집을 해결하며 전체
  탐색은 오락실 패밀리에 남습니다.
- **비활성 선호 오락실 조용히 삭제 — 거절:** 사용자 맥락을 보존하고 이용 불가
  상태를 명시합니다.
- **프로필 전체 비공개 Mode — 거절:** 승인된 5개 필드 개념을 사용합니다.
- **부정형 `hide_*` Label — 대체:** 긍정형 라벨로 켜짐이 항상 공개를 뜻합니다.
- **마지막 플레이·최근 플레이를 별도 컨트롤 — 거절:** 플레이 활동 하나가 모순되는
  부분 공개를 막습니다.
- **수동 편집 Discord 이름 — 거절:** Discord가 신원 데이터를 소유합니다.
- **Discord 연결 해제 — 거절:** 유일한 로그인 방식입니다.
- **Discord 갱신이 NosLog 프로필 선택 변경 — 거절:** 원격 신원 필드만
  갱신합니다.
- **탈퇴 유예 기간 — 거절:** 강한 정보 기반 확인 뒤 즉시 삭제합니다.
- **탈퇴 이유 설문 — 거절:** 안전과 관련 없는 마찰을 추가합니다.
- **탈퇴 Dialog의 원시 DB Table Inventory — 거절:** 간결한 사용자 중심 그룹과
  신뢰 가능한 개수가 결과를 더 잘 전달합니다.
- **2.0 원시 계정 데이터 내보내기 — 거절:** 검증된 즉각적 요구가 없으며 향후
  Portability는 별도 조사 기능입니다.
- **프로필 카드 공유를 데이터 내보내기로 취급 — 거절:** SNS Presentation과 기계
  판독 Backup은 사용자·콘텐츠·위험이 다릅니다.

## 결정 기록

| ID     | 결정                                                                           | 상태   |
| ------ | ------------------------------------------------------------------------------ | ------ |
| SET-01 | 비로그인·로그인 사용자에게 하나의 공개 Locale Prefix `/[locale]/settings` 사용 | `승인` |
| SET-02 | 직접 URL·Browser History에 선택 카테고리 보존, 정확한 Syntax는 구현 Mapping    | `승인` |
| SET-03 | 이용 환경, 프로필, 공개 범위, 연동, 계정 순서 사용                             | `승인` |
| SET-04 | 비로그인은 비활성 계정 컨트롤이 아니라 실제 이용 환경과 간결한 Login 안내 확인 | `승인` |
| SET-05 | Compact는 Overview→카테고리, Wide는 Persistent List-detail                     | `승인` |
| SET-06 | 언어는 즉시·Locale Prefix, 로그인 시 계정 소유, 비로그인 시 Browser 소유       | `승인` |
| SET-07 | 직접 Locale URL은 저장된 명시적 설정을 덮어쓰지 않고 해당 Locale 표시          | `승인` |
| SET-08 | 테마는 System·Dark·Light이며 기기 단위 유지                                    | `승인` |
| SET-09 | 새 사용자는 System 기본, 기존 명시적 Dark·Light 선택 Migration                 | `승인` |
| SET-10 | 번역·읽기 제목 표시는 기본 켜짐이며 즉시 적용                                  | `승인` |
| SET-11 | 프로필·공개 범위는 각각 Dirty 보호가 있는 명시적 카테고리 저장                 | `승인` |
| SET-12 | 저장 뒤 카테고리에 머물고 별도의 내 프로필 보기 행동 제공                      | `승인` |
| SET-13 | 아바타 JPG/PNG/WebP·4MB, Staged 1:1 Crop, 원형 Preview, 변경·제거              | `승인` |
| SET-14 | 아바타 저장 실패 시 기존 공개 아바타 보존                                      | `승인` |
| SET-15 | NosLog 닉네임과 NOSTALGIA 공식 플레이어명 분리                                 | `승인` |
| SET-16 | 승인 Unicode·문장부호, 표시 보존 및 Normalized 고유성 적용                     | `승인` |
| SET-17 | 닉네임 변경에도 숫자 Profile URL Canonical 유지                                | `승인` |
| SET-18 | NOSTALGIA 공식 플레이어명은 연동·대문자·읽기 전용·공개 범위 제어               | `승인` |
| SET-19 | 국가/지역은 언어와 독립된 주 플레이·지역 랭킹 지역                             | `승인` |
| SET-20 | 국가 변경은 증명·긴 Cooldown 없이 짧은 결과 확인 사용                          | `승인` |
| SET-21 | 선호 오락실은 검색형 단일 선택, 지우기, 탐색 링크, 이용 불가 값 유지           | `승인` |
| SET-22 | 설정 장소 편집은 Staged, 오락실 상세 맥락형 설정은 즉시 가능                   | `승인` |
| SET-23 | 5개 긍정형 공개 컨트롤 사용, 켜짐은 항상 공개                                  | `승인` |
| SET-24 | 플레이 활동 하나가 마지막 플레이와 최근 플레이를 함께 소유                     | `승인` |
| SET-25 | Discord 신원은 읽기 전용이며 OAuth 갱신은 NosLog 프로필을 덮어쓰지 않음        | `승인` |
| SET-26 | 로그인 계정 변경은 별도로 확인하는 민감 OAuth 행동                             | `승인` |
| SET-27 | Discord가 유일한 로그인 방식인 동안 연결 해제 미제공                           | `승인` |
| SET-28 | 로그아웃은 기기·비로그인 Browser 설정 보존                                     | `승인` |
| SET-29 | Privacy는 전역 푸터에 유지하며 탈퇴 맥락 접근 허용                             | `승인` |
| SET-30 | 탈퇴는 즉시·영구적이며 그룹 결과와 신뢰할 수 있는 개수를 먼저 표시             | `승인` |
| SET-31 | 탈퇴 전 최근 Discord 재인증과 정확한 다국어 문구 요구                          | `승인` |
| SET-32 | 탈퇴 처리 중 중복·닫기 차단, 일부 실패를 진실하게 보고                         | `승인` |
| SET-33 | 완전 탈퇴는 Session·민감 Cache 삭제, 다국어 Home 복귀, 이후 복원 없음          | `승인` |
| SET-34 | NosLog 탈퇴는 Discord·공식 NOSTALGIA 계정에 영향 없음                          | `승인` |
| SET-35 | NosLog 2.0 설정에서 원시 계정 데이터 내보내기 제외                             | `거절` |
| SET-36 | 프로필 카드 공유는 별도 SNS 기능이며 내보내기로 바꾸어 부르지 않음             | `승인` |
| SET-37 | 향후 원시 Export가 필요하면 별도의 제품·개인정보·운영 기획서 요구              | `승인` |

## Handoff 경계

Claude Design은 승인한 카테고리, 순서, 인증 범위, 즉시·명시적 저장 경계, 프로필
개념, 긍정형 공개 의미, Discord 제약 및 탈퇴 안전장치를 보존해야 합니다. 이후
승인할 Foundation 안에서 최종 타이포, 간격, Component Styling 및 콘텐츠 기반
전환을 정할 수 있습니다. 설정을 하나의 긴 Form으로 되돌리거나, 비로그인에게
계정 컨트롤을 비활성 Clutter로 노출하거나, NOSTALGIA 신원을 편집 가능하게
만들거나, Discord 연결 해제를 추가하거나, 탈퇴 검증을 약화하거나, 프로필 카드
공유를 Backup으로 제시하면 안 됩니다.

향후 Codex 구현 세션은 Coding 전 Schema, Migration, OAuth, Storage, Route 및
Test 영향을 조정해야 합니다. 구현 제약이 저장 경계를 합치거나 기존 설정을 잃거나
탈퇴를 비멱등으로 만들거나 승인한 다국어 반응형 동작을 막는다면 이 계약을 조용히
약화하지 말고 충돌을 보고하여 가이드 개정을 승인받아야 합니다.
