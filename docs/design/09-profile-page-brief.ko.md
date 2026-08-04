# NosLog 2.0 프로필 페이지 브리프

## 문서 관리

- 상태: `Approved`
- 결정 상태: `프로필 핵심 계약 승인: 공개 성과 신원, 모드 범위 경쟁 요약,
성장과 기록 계층, 공개 범위 그룹, 5개 미리보기와 전체 목록 목적지, 본인
연동 상태, 공개 안전 공유 카드, 런타임 상태, 반응형 구성, 접근성, 다국어 및
브라우저 수용 기준`
- 근거 상태: `저장소·스키마 조사, 넓은 화면·390px·320px에서 한국어·일본어·
영어 로그인 본인 및 공개 브라우저 근거, 승인된 정보 구조와 관련 페이지
브리프, 인용한 리듬게임·활동 프로필·프라이버시·대시보드·반응형·접근성·
국제화 레퍼런스, 사용자 승인 결정 기록`
- 시작일: 2026-08-02
- 마지막 결정 갱신일: 2026-08-03
- 원본 언어: 영어
- 영문 원본: [09-profile-page-brief.md](./09-profile-page-brief.md)
- 상위 정보 구조:
  [02-information-architecture.ko.md](./02-information-architecture.ko.md)
- 관련 계약:
  [05-music-detail-page-brief.ko.md](./05-music-detail-page-brief.ko.md),
  [06-tier-list-page-brief.ko.md](./06-tier-list-page-brief.ko.md),
  [08-global-rankings-page-brief.ko.md](./08-global-rankings-page-brief.ko.md)
- 범위: 다국어 공개 사용자 프로필, 본인 전용 문맥 Action, 공개 성과 요약,
  성장 추이, Best Plays, 기록 개요, Recent Plays 및 전용 전체 목록 목적지
- 제외: 계정 설정 Form 디자인, 데이터 연동 가이드 디자인, Social Follow,
  Comment 또는 Messaging, 프로필 Theme 맞춤 설정, Badge 또는 Brooch 표시,
  상시 NOS 재화 표시, 관리자 화면, 최종 Foundation Token, 최종 High-fidelity
  구성 및 이 세션의 Production 구현

## 결정 라벨

- **Observed:** 저장소, 현재 브라우저 근거 또는 승인된 상위 Artifact에서
  검증한 사실.
- **Approved:** 사용자가 명시적으로 동의했으며 이후 디자인에 권위를 갖는 결정.
- **Proposed:** 사용자 승인을 기다리는 근거 기반 방향.
- **Open:** 추가 조사·테스트 또는 사용자 결정이 필요한 항목.
- **Rejected:** 검토 후 명시적으로 선택하지 않은 항목.
- **Superseded:** 이후 승인된 방향으로 대체된 항목.

이 브리프는 승인된 프로필 동작, 콘텐츠 계층, 프라이버시 의미, 반응형 계약과
상태에 권위를 갖는다. 정확한 타이포그래피, 색상, 간격, Radius, Elevation,
차트 Styling, 아바타 처리, 컨트롤 크기, Grid Track 및 콘텐츠 기반 전환 값은
Foundation과 이후 Claude Design 작업으로 남긴다. 이후 시각 결정은 표현을
다듬을 수 있지만 이 제품 계약을 제거하거나 재해석하면 안 된다.

## 목적

프로필은 다음 세 질문에 순서대로 답한다.

> 이 플레이어는 누구이고, 현재 NOSTALGIA에서 어느 위치에 있으며, 그 사람의
> 기록은 성장과 최근 활동을 어떻게 증명하는가?

프로필은 공개 리듬게임 기록 프로필이며 랭킹·서열·기록 문맥에서 연결되는 근거
목적지다. 계정 관리 대시보드, Social Feed, Inventory 페이지, 채보 단위 악곡
상세의 대체물 또는 연동된 모든 NOSTALGIA 필드의 Dump가 아니다.

## 주요 이용 문맥과 성공 조건

- **승인된 상위 구조:** 프로필은 기록 및 비교 패밀리에 속하고 로그인 Header
  신원 컨트롤, 랭킹의 공개 플레이어 링크, 다른 문맥 기록 링크에서 접근할 수
  있어야 한다.
- **Approved:** 오락실 플레이 전후의 모바일 사용이 주 문맥이다. 데스크톱도
  필수이며 약 `390px` 고정 Shell을 유지하지 않고 추가 너비를 의도적으로
  사용해야 한다.
- **Approved:** 공개 방문 성공은 플레이어를 식별하고, 현재 경쟁 위치를
  전달하고, 성장과 대표 기록을 보여주며, 숨긴 개인정보를 노출하지 않은 채
  근거 악곡 상세로 이동할 수 있는 상태다.
- **Approved:** 본인 방문 성공은 연동 최신 상태도 전달하고, 페이지를 계정
  설정으로 바꾸지 않으면서 간결한 공유·설정·데이터 연동 접근을 제공하는
  상태다.
- **Approved:** 현재 Styling과 Geometry는 감사 근거이며 NosLog 2.0 시각
  Source of Truth가 아니다.

## 현재 제품 근거

### 관찰된 Route와 접근

- 다국어 공개 프로필은 `/[locale]/profile/[id]`에서 열린다.
- 로그아웃 상태에서도 읽을 수 있다. 현재 구현은 본인일 때 Analytics, 공유,
  설정과 로그아웃을 추가한다.
- 현재 페이지는 Client 내부 Basic/Recital 상태 하나를 사용하며 선택값을 URL에
  기록하지 않는다.
- 프로필 데이터는 사용자별 5분 Cache를 사용한다. 본인 전용 판정 Analytics는
  공개 프로필 Cache 밖에서 조회한다.
- 현재 페이지 Metadata는 `noindex`다. 검색 노출 정책은 이 브리프 범위 밖이며
  시각 구현 과정에서 조용히 바꾸면 안 된다.

### 관찰된 공개 데이터

- 신원 데이터에는 NosLog 사용자명, 아바타, 프로필 국가 분류, NOSTALGIA
  플레이어명, Discord 정보, 선호 오락실, Basic·Recital 검정과 NOSTALGIA명·
  Discord·Play count 공개 범위 Flag가 포함된다.
- 경쟁 데이터에는 Basic·Recital 공식 Grd와 각 모드의 전체 및 국가 분류 순위가
  포함된다.
- 승인된 랭킹·서열 계약에 Basic Rating이 존재하지만 현재 프로필은 NosLog
  Rating을 계산하거나 반환하지 않는다.
- 현재 스키마에는 Recital NosLog Rating Source가 없다.
- 현재 페이지는 NosLog 계정 `created_at`을 노출하고, 반환된 최신
  `ChartPlayHistory` 항목에서 마지막 플레이를 계산한다.
- 랭크 분포는 저장된 Pianist, Full Combo, S, A+, A, B+, B, C, D 채보 수를
  사용한다.
- 공개 Best Plays에는 현재 베스트 점수, 랭크, 레벨, 난이도, Max Combo,
  Full Combo/Pianist 상태, 모드별 Grd 기여, 악곡 신원, 자켓과 시간이 포함된다.
  현재 Query는 Basic 10개와 Recital 10개를 반환한다.
- 공개 Recent Plays는 최신 공식 플레이 이력 10개를 반환한다. 현재 Model은 각
  시도가 Basic인지 Recital인지 신뢰할 수 있게 증명하지 못한다.
- 현재 판정 Analytics는 현재 채보 기록의 다섯 판정 전체 대비 S-Just를
  집계하며 본인에게만 노출한다.

### 관찰된 보존과 연동 데이터

- `ChartPlayHistory`는 복합 Unique Key로 가져온 최근 플레이 Event를 보존해
  동일 원본 Event가 반복 삽입되지 않게 한다.
- `ChartRecordSnapshot`은 현재 채보 기록이 실질적으로 바뀔 때만 Snapshot을
  저장한다. 변하지 않은 중복을 쓰지 않으면서 성장 분석을 지원한다.
- `UserBestGrade`는 Basic·Recital 공식 Grd History를 보존한다.
- Player 연동은 NOSTALGIA Play count, NOS, 마지막 플레이 시간과 Brooch를
  저장하지만 저장된 모든 필드가 승인된 공개 프로필에 속하지는 않는다.
- 현재 Schema는 `hide_nostalgia_name`, `hide_discord_name`,
  `hide_play_count`만 지원한다. 승인된 플레이 활동 또는 선호 오락실 공개
  설정은 지원하지 않는다.

### 관찰된 화면과 브라우저 동작

- 현재 Source Order는 신원, Basic/Recital Tab, Grd·순위 요약, Grd 추이,
  랭크 분포와 Play count, 본인 전용 S-Just Analytics, Best Plays, Recent Plays,
  본인 로그아웃 순서다.
- 모드 선택기가 페이지 전체를 지배하는 것처럼 보이지만 랭크 분포, Play count,
  판정과 Recent Plays는 모드별 데이터가 아니다.
- 숨긴 NOSTALGIA·Discord 값은 방문자에게 불필요한 `비공개` Placeholder를 남길
  수 있다.
- 현재 Header는 NOSTALGIA 프로필 사실로 의미가 낮은 NosLog 가입일을 표시한다.
- 넓은 데스크톱에서도 프로필은 좁은 가운데 Column에 남아 양쪽 Margin을 크게
  낭비한다.
- `320px`에서 현재 페이지에 문서 수준 가로 스크롤이 생긴다.
- 긴 일본어 원문 제목은 반복 번역 Caption이 없어도 한 언어를 전제로 한 고정
  행 높이가 안전하지 않음을 보여준다.

## 승인된 범위와 불변 조건

- 공개 랭킹과 기록 링크에서 유용하도록 프로필을 공개 상태로 유지한다.
- NosLog 신원과 선택 공개 NOSTALGIA·Discord 신원 필드를 구분한다.
- Basic과 Recital을 서로 다른 NOSTALGIA 성과 모드로 보존한다.
- 승인된 Basic NosLog Rating을 프로필에 추가하고, Source가 구현되기 전에 값을
  만들어내지 않으면서 조건부 Recital Rating 위치를 구조적으로 수용한다.
- 아래 계층과 프라이버시 계약에 따라 공식 Grd, 전체·국가 분류 순위, 모드 검정,
  Grade History, 랭크 분포, 판정 요약, Best Plays, Recent Plays와 프로필 전체
  Play count를 보존한다.
- NosLog 계정 가입일을 표시하지 않는다.
- Brooch, 상시 NOS 잔액, 임의 Achievement, Social Follower 수, 상태 글 또는
  만들어낸 도전 상태를 추가하지 않는다.
- 임의의 30개 저장 제한 없이 의미 있는 전체 이력을 유지하고, 동일 Record
  Snapshot이나 중복 플레이 Event를 쓰지 않는다.
- 미리보기 제한은 개요 표시만 제한하며 보존 데이터는 제한하지 않는다.
- 저장된 `global` 국가 분류를 특정 국가로 추측하지 않는다.
- 숨긴 필드를 HTML, Metadata, 공유 카드, Client Payload, Analytics Label 또는
  접근 가능한 이름으로 노출하지 않는다.

## 승인된 정보 계층

하나의 Semantic `main`과 다음 Mobile-first Source Order를 사용한다.

1. 플레이어 신원과 공개된 보조 Metadata
2. 모드 범위 경쟁 요약
3. 성장 추이
4. Best Plays 미리보기
5. 기록 개요: 랭크 분포, 판정 요약, 선택 공개 Play count
6. 플레이 활동 공개 시 Recent Plays 미리보기

이 순서는 신원에서 현재 실력, 성장 근거, 대표 베스트 기록, 더 넓은 기록 특성,
마지막 최근 활동으로 이동한다. 계정 컨트롤, 연동 상세, 재화 또는 Inventory를
성과보다 위에 올리지 않는다.

## 신원과 Header 계약

### 공개 신원

- 아바타 또는 승인된 Fallback, NosLog 사용자명, 국가 분류 Marker를 하나의 신원
  Group으로 표시한다.
- 국가 Marker는 아바타 옆이나 앞이 아니라 사용자명 바로 옆에 둔다. 대한민국과
  일본은 승인된 국기를 사용할 수 있다. 기타 지역은 다국어 접근 가능한 이름이
  있는 지구본 Marker를 사용한다.
- 존재하는 Basic·Recital 검정 Label을 사용자명 아래에 표시한다. 없는 검정은
  빈 Badge 없이 생략한다.
- NosLog 계정 가입일을 표시하지 않는다.
- 플레이 활동이 공개이고 데이터가 있을 때만 마지막 플레이를 표시한다. 지역화된
  정확한 날짜를 사용하며 상대 시간은 정확한 값을 대체하지 않고 보조만 할 수 있다.
- 공개된 NOSTALGIA명, Discord, 선호 오락실을 간결한 보조 Metadata로 표현한다.
  없거나 숨긴 필드는 Placeholder 없이 생략한다.

### 본인 문맥

- 공유와 설정을 신원 영역에 연결된 간결한 본인 전용 Action으로 유지한다. 이름이나
  성과 요약과 경쟁하면 안 된다.
- `마지막 연동 7월 28일 · 최신` 또는 `연동 필요`처럼 본인 전용 연동 최신 상태
  한 줄과 문맥 데이터 연동 Action을 추가한다.
- 연동 상태는 신뢰·유지보수 문맥이지 공개 성과 Metric이나 큰 Dashboard Card가
  아니다.
- 프로필 본문에서 로그아웃을 제거한다. 로그아웃은 승인된 계정/더보기 또는 설정
  문맥에 속한다.
- 본인이 자신의 공개 프로필을 볼 때 숨긴 필드나 활동 Group을 간결하게 확인하고
  설정으로 이동할 수 있다. 방문자는 해당 값이나 `비공개` Placeholder를 절대
  확인하지 못한다.

## 프라이버시와 공개 데이터 계약

### 항상 공개되는 성과

데이터가 있으면 공개 프로필은 항상 다음을 포함한다.

- NosLog 사용자명, 아바타와 국가 분류;
- Basic·Recital 검정 Label;
- 공식 Grd, 사용 가능한 NosLog Rating, 전체 순위와 국가 분류 순위;
- 성장 추이;
- Best Plays;
- 랭크 분포;
- 판정 요약.

이 필드는 공개 경쟁 기록 프로필의 목적을 만든다. 공개 랭킹과 기록 링크가 유용한
근거 문맥으로 연결돼야 하므로 프로필 전체 비공개 Mode는 제공하지 않는다.

### 사용자가 제어하는 공개 범위

다음 다섯 개의 명시적 공개 설정을 제공한다.

1. NOSTALGIA 플레이어명;
2. Discord 신원;
3. 선호 오락실;
4. 프로필 전체 Play count;
5. 마지막 플레이와 Recent Plays를 함께 제어하는 플레이 활동.

- 한 Surface가 다른 Surface에서 숨긴 날짜나 활동을 다시 노출하지 않도록 마지막
  플레이와 Recent Plays를 하나의 플레이 활동 설정으로 묶는다.
- 선호 오락실은 위치와 가까운 정보이므로 별도 설정으로 유지한다.
- 공개 범위를 바꾸면 관련 공개 Cache를 무효화하고 이후 공개 Payload와 생성된
  공유 Artifact에서 보호 데이터를 제거해야 한다.
- 설정은 각 Control을 쉬운 말로 설명하고 Preview 또는 이에 준하는 방법으로 공개
  결과를 이해할 수 있게 해야 한다.
- 승인 계약에서는 판정 요약 전용 공개 설정을 추가하지 않는다.

## Basic과 Recital 성과 계약

### 모드 선택기 범위

- 하나의 간결한 Basic/Recital 배타 선택기를 신원 Header 위나 페이지 전역 Tab이
  아니라 경쟁 성과 영역 시작에 둔다.
- 선택기는 다음만 제어한다.
    - 모드 검정 문맥;
    - 공식 Grd;
    - 사용 가능한 NosLog Rating;
    - 전체 및 국가 분류 순위;
    - 성장 추이;
    - Best Plays.
- Play count, 마지막 플레이, Recent Plays, 랭크 분포 또는 판정 요약은 바꾸지
  않는다.
- 선택된 모드와 제어 영역을 Programmatic하게 연결해 제한된 범위를 보는 사용자와
  보조 기술 사용자 모두 이해할 수 있게 한다.

### 경쟁 요약

- 공식 Grd, 사용 가능한 NosLog Rating, 전체 순위와 국가 분류 순위를 서로
  무관한 대형 Card 네 개가 아니라 하나의 일관된 요약으로 보여준다.
- 공식 Grd는 주 공식 Metric이다. NosLog Rating은 승인된 서열·랭킹 계약에 따르는
  NosLog 파생 Metric임을 분명히 Label한다.
- Basic은 공식 Grd와 NosLog Rating을 모두 제공한다.
- Recital은 공식 Grd와 순위를 제공한다. 승인된 Recital Source와 계산이 생길
  때까지 NosLog Rating 항목을 생략한다. 대칭을 맞추려고 0, `준비 중` 또는
  비활성 빈 Metric을 보여주지 않는다.
- 자격 있는 Grd나 순위가 없으면 간결한 사용 불가 값을 사용하고 백분위나 예상
  결과를 만들어내지 않는다.

## 성장 추이 계약

- Section Label은 **성장 추이**를 사용한다.
- 기본 기간은 최근 `90일`이다.
- `30일`, `90일`, `1년`, `전체`를 하나의 간결한 기간 선택기로 제공한다. 좁은
  공간에서 동급 상시 버튼 네 개를 노출하지 않는다.
- 하나의 간결한 Metric 선택기를 통해 다음 중 하나만 표시한다.
    - `공식 Grd`;
    - 활성 모드에서 사용할 수 있는 `NosLog Rating`.
- 공식 Grd와 NosLog Rating은 Scale과 의미가 다르므로 하나의 차트에 겹치지 않는다.
- Basic/Recital 선택기가 사용 가능한 Series를 제어한다. 데이터 계약이 구현되기
  전에는 Recital Rating을 생략한다.
- 시작값, 현재값과 변화량을 차트 밖의 구조화된 Text로 보여준다.
- 승인된 기간에 필요한 의미 있는 일별 History를 유지한다. 정보를 추가하지 않는
  동일 값 Point는 축약할 수 있지만 날짜 경계를 보존하고 보간값을 만들어내면 안 된다.
- 접근 가능한 Text Summary와 원본 날짜·값 접근을 제공한다. 그래픽 차트만으로
  추이를 알게 하면 안 된다.
- Point가 하나뿐이면 정확한 현재값과 더 많은 이력이 필요하다는 간결한 설명을
  보여주고 오해를 부르는 추이를 그리지 않는다.

## Best Plays 계약

- 프로필 개요에서 활성 Basic/Recital 모드의 Best Plays 5개를 보여준다.
- 승인된 모드별 기여도 및 점수 계약으로 정렬한다. Basic·Recital 기여 정렬을
  조용히 섞지 않는다.
- 각 미리보기 항목은 다음을 포함한다.
    - 자켓 또는 승인된 Fallback;
    - 원문 악곡 제목;
    - 난이도와 레벨;
    - 점수;
    - 랭크 및 해당하는 Full Combo 또는 Pianist 상태;
    - 정렬 이유 설명에 필요할 때 활성 모드의 기여 값.
- 주 항목 전체는 해당 다국어 악곡 상세와 선택 난이도를 연다. 보조 Label을 별도의
  경쟁 Link로 만들지 않는다.
- 자격 있는 항목이 5개보다 많으면 **전체 보기**를 제공한다.
- Best Plays 전체 목적지는 Basic/Recital, 페이지네이션 또는 사용자가 실행하는
  더 보기의 명시적 제한 Loading, 선택 모드와 위치의 직접 복원, 무한 스크롤 금지를
  지원한다.
- 개요 미리보기 제한은 보존하거나 Query할 수 있는 베스트 기록을 제한하지 않는다.

## 기록 개요 계약

### 랭크 분포

- 프로필 전체 Pianist, Full Combo, S, A+, A, B+, B, C, D 분포를 보여준다.
- 클리어 상태 분포라고 Label하지 않는다. NOSTALGIA에서 클리어는 이 목적에 유효한
  구분이 아니다.
- 미래에 검증된 데이터 Source가 의미를 바꾸지 않고 모드별 채보 성과를 구분할 수
  있을 때까지 전체 분포를 모드 중립으로 유지한다.
- 모든 시각 Encoding에 정확한 수와 구조화된 Text Equivalent를 제공한다.

### 판정 요약

- 승인된 집계 판정 요약을 공개 성과 정보로 만든다.
- 판정 집계 기준과 유효 채보 표본 수를 포함한다. 판정 데이터가 없는 채보도 측정한
  것처럼 표현하지 않는다.
- 간결한 S-Just 강조가 요약을 이끌 수 있지만, 이후 디자인은 문맥 없는 비율만
  보여주지 말고 정확한 S-Just, Just, Good, Miss, Near 기준에 접근할 수 있게 한다.
- 프로필 개요에 음표 종류 성공 Filter나 Tenuto·Glissando 성공 요약을 추가하지
  않는다.
- 악곡 상세의 커뮤니티 패턴 Radar를 플레이어 판정 데이터에 사용하지 않는다. 두
  시각화는 서로 다른 질문에 답한다.

### 프로필 전체 Play count

- 사용자가 공개를 켜고 연동 데이터가 있을 때만 NOSTALGIA 프로필 전체 Play count를
  보여준다.
- Clear count로 대체하지 않는다.
- Play count는 신원 Header나 경쟁 Metric Group이 아니라 기록 개요에 속한다.

## Recent Plays 계약

- 플레이 활동이 공개일 때만 개요에서 Recent Plays 5개를 보여준다.
- 가져온 데이터가 각 시도를 Basic 또는 Recital로 증명할 수 있을 때까지 Recent
  Plays를 모드 중립으로 유지한다.
- 각 항목은 자켓 또는 Fallback, 번역·원문 제목 계층, 난이도와 레벨, 점수, 랭크,
  지역화된 정확한 플레이 시간을 포함한다.
- 항목은 해당 다국어 악곡 상세와 선택 난이도를 연다.
- 공개 History가 5개보다 많으면 **전체 보기**를 제공한다.
- Recent Plays 전체 목적지는 명시적 페이지네이션 또는 사용자가 실행하는 더 보기를
  사용하고, 돌아올 때 위치를 복원하며, 자동 무한 스크롤을 사용하지 않는다.
- 플레이 활동을 숨기면 공개 접근에서 마지막 플레이, 개요 Recent Plays와 전체
  Recent Plays를 제거한다. 명확한 본인 인증 후에는 본인이 자신의 비공개 활동을
  계속 확인할 수 있다.

## 전체 목록 목적지 계약

- `/[locale]/profile/[id]/best` 및 `/[locale]/profile/[id]/recent`와 동등한
  구현 Mapping을 가진 전용 다국어 프로필 하위 목적지를 사용한다.
- 전체 개요를 복제하지 않으면서 플레이어 신원과 간결한 복귀 경로를 보존한다.
- Best Plays는 활성 모드를 유지한다. Recent Plays는 모드 중립으로 유지한다.
- 목록 범위, Page/Cursor와 해당하는 모드는 직접 URL, 새로고침, 브라우저 뒤로·
  앞으로로 복원할 수 있어야 한다.
- 방문자가 숨겨진 Recent Plays URL을 직접 열면 개요와 같은 프라이버시 안전 결과를
  받고 숨겨진 개수나 시간을 알 수 없어야 한다.
- Empty, Loading, Error와 목록 끝 동작은 아래 상태 계약을 따른다.

## URL, History와 복원 계약

- 모든 프로필과 전체 목록 URL을 다국어·공유 가능 상태로 유지한다.
- Best 또는 Recent에서 악곡 상세로 왕복하면 출발 프로필 Surface, 해당하는 활성
  모드, 목록 위치와 실용적인 스크롤 문맥을 복원한다.
- 전체 목록 페이지네이션 또는 더 보기 상태는 결정적이고 복원 가능해야 한다.
- 정확한 개요 모드 Query 문법은 구현 Mapping으로 남기지만, 한 프로필 방문 중
  새로고침과 브라우저 뒤로·앞으로가 활성 성과 모드를 예기치 않게 바꾸면 안 된다.
- 비공개 필드나 숨긴 활동 값을 URL에 저장하지 않는다.

## 프로필 공유 카드 계약

### 목적과 콘텐츠

- 공유는 본인 전용 행동이며 외부 행동 전에 Preview를 제공합니다.
- 본인이 선택한 `Basic` 또는 `Recital` 모드 하나에 대한 `1200×630` PNG를
  생성합니다. 카드는 원본 Export나 두 번째 프로필 페이지가 아니라 간결한 공개
  프로필 요약입니다.
- 아바타, NosLog 사용자명, 국가 분류, 선택 모드, 사용 가능한 공식 Grd와 승인된
  NosLog Rating, 전체·국가 순위, 선택 모드 검정, NosLog 정체성 및 다국어 공개
  프로필 URL을 항상 포함합니다.
- 기존 공개 설정이 각각 켜져 있고 값이 있을 때만 NOSTALGIA 플레이어명, 프로필
  전체 Play count 및 선호 오락실 이름을 포함합니다.
- Discord, 마지막 플레이, Recent Plays, NOS, 연동 시각, 오락실 주소, 기체 상세 및
  운영 Metadata는 제외합니다.
- 숨기거나 없는 필드는 이미지, 접근 가능한 요약, Metadata, Payload 및 Layout에서
  생략합니다. `비공개`, `미설정`, Placeholder 또는 빈 예약 자리를 만들지 않습니다.

### 공유, Open Graph 및 실패 동작

- 주요 **공유** 행동은 기능 확인 결과 해당 Payload를 공유할 수 있을 때만 이미지,
  다국어 Text 및 URL을 System Share Sheet에 전달합니다.
- 보조 행동은 **이미지 저장**과 지원되는 경우 **이미지 복사**입니다.
- 취소는 Error가 아닙니다. 미지원, 거부, 생성 및 Network 실패를 구분하고 해당하는
  Retry, 저장 또는 Link Fallback을 제공합니다.
- X는 공식 Web Intent의 명시적 Link 공유 Fallback을 사용합니다. Platform이
  지원하지 않는데 이미지가 자동 첨부되었다고 표현하면 안 됩니다.
- 공개 다국어 프로필 Metadata는 공개 안전 Open Graph 이미지를 제공하여 X,
  Discord 및 호환 Crawler가 본인 인증 없이 Preview를 Render하게 합니다.
- 공개 설정 변경은 카드 Cache를 무효화하고 Open Graph 이미지 URL을 Versioning하여
  이전 공개 이미지가 현재 상태로 표현되지 않게 합니다.

### 접근성, 다국어 및 레퍼런스 근거

- 보이는 카드 콘텐츠와 동등한 다국어 Text 및 접근 가능한 Preview 이름을
  제공합니다. 장식 Artwork는 그 이름에서 제외합니다.
- 현재 `ko`, `ja`, `en` 프로필 Locale을 따르며 사용자명과 공식 게임명 원문을
  보존합니다. 긴 이름, 아바타·검정·Rating 없음 및 독립적으로 숨긴 모든 조건부
  필드를 검증합니다.
- 이 계약은 [MDN Web Share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share),
  [W3C Web Share](https://www.w3.org/TR/web-share/),
  [Apple Activity Views](https://developer.apple.com/design/human-interface-guidelines/activity-views),
  [Android Sharesheet](https://developer.android.com/training/sharing/send),
  [MDN ClipboardItem](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem),
  [X Web Intents](https://docs.x.com/x-for-websites/web-intents/overview),
  [Open Graph](https://ogp.me/),
  [WCAG Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content),
  [WCAG 2.2](https://www.w3.org/TR/WCAG22/),
  [EDPB Privacy by Design and Default](https://www.edpb.europa.eu/topics/ai-and-technology/privacy-by-design-and-by-default_en),
  및 [ICO Data Minimisation](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/data-minimisation/)의
  점진적 기능 지원과 개인정보 원칙을 적용합니다. Platform 지원과 Crawler 동작이
  다르므로 기능 감지와 공개 안전 Fallback은 가정이 아니라 요구사항입니다.

## Loading, Empty, Error, Privacy와 사용 불가 상태

### 최초 Loading

- 안정적인 신원과 주요 Section 영역을 확보하고 하나의 간결한 Loading 상태를
  노출한다.
- Skeleton 콘텐츠에서 순위, 점수, 차트 또는 활동을 만들어내지 않는다.

### Section 갱신

- 모드, Metric, 기간 또는 전체 목록을 갱신할 때 마지막으로 확정된 콘텐츠를
  유지하고 제어되는 영역만 Busy로 표시하며 오래된 Response를 무시한다.
- 한 Section만 바뀔 때 전체 프로필을 비우지 않는다.

### 연동 기록 없음

- 공개 신원과 공개 Metadata를 유지한다.
- 성과 영역에 하나의 간결한 기록 없음 결과만 표시하고 본인에게만 데이터 연동
  Action 하나를 제공한다.
- Grd, Rating, 추이, Best Plays, 분포, 판정과 Recent Plays마다 별도 Empty
  Card를 반복하지 않는다.

### 부분 데이터

- 플레이어는 Basic만 있고 Recital이 없거나, 현재값은 있지만 History가 없거나,
  Best Plays는 있지만 가져온 Recent Plays가 없거나, 일부 채보에만 판정 Coverage가
  있을 수 있다.
- 사용 가능한 Section을 정확히 표시하고 간결한 지역 사용 불가·불충분 상태를
  사용한다. 부분 데이터를 전체 페이지 실패로 처리하지 않는다.

### 프라이버시

- 방문자는 숨긴 Module, Placeholder 행, 숨긴 Total 또는 보호 값을 Markup이나
  생성 Artifact에서 확인하지 못한다.
- 본인은 보호 데이터를 공개 Cache에 노출하지 않으면서 간결한 비공개 상태 설명과
  설정 접근을 확인한다.
- 플레이 활동을 숨기면 마지막 플레이와 Recent Plays를 함께 제거한다.

### Error

- 이전 성공 뒤 한 Section이 실패하면 마지막으로 확정된 Section 콘텐츠를 유지하고
  해당 Section에 Inline 재시도를 제공한다.
- 최초 프로필 요청이 실패하면 일반 Shell을 유지하고 경계가 분명한 Error 하나와
  재시도를 제공한다. Error를 기록 없음이나 비공개 상태로 바꾸지 않는다.
- 존재하지 않는 사용자는 빈 프로필이 아니라 다국어 Not-found 계약을 사용한다.

### 연동 상태

- `최신`, `연동 필요`, `연동 중`, `일부 반영`, `실패`는 본인 전용 신뢰 상태이며
  공개 기록 Loading·Error와 구분한다.
- 연동 상태는 기존 데이터 연동 Flow로 연결하며 Token, 내부 Error 또는 관리자
  Health 데이터를 노출하지 않는다.

## 반응형 계약

### Compact Layout

- `390px`은 대표 검토 Canvas이며 고정 제품 너비나 Breakpoint가 아니다.
- `320 CSS px`까지 문서 수준 2차원 스크롤 없이 Reflow한다.
- 읽을 수 있는 Source Column 하나를 사용한다. 사용자명, 국가 Marker, 본인 Action,
  검정 Label을 Viewport 밖으로 밀지 않도록 신원 Metadata가 Wrap 또는 Stack된다.
- Basic/Recital 선택기를 제어하는 성과 영역 바로 옆에 유지한다.
- 요약 Metric은 더 적은 Column이나 Stack Group으로 Reflow할 수 있다. 한 행을
  유지하려고 Label을 설명 없는 Icon으로 줄이지 않는다.
- 플레이 항목은 세로로 훑기 쉬워야 합니다. 자켓 비율은 `1:1`을 유지하고 긴 원문
  제목은 Metadata와 겹치면 안 됩니다.
- 필수 값은 Hover에 의존하지 않는다. 모바일에 장식적 Hover 상세를 대체하는 첫
  Tap 전용 상태를 추가하지 않는다.
- 차트는 실제 Container 너비를 사용하고 Plot 밖 Text Summary를 유지한다.

### Wide Layout

- 고정 Compact Shell 제약을 제거하고 의도적인 프로필 읽기 너비를 만든다.
- 신원과 경쟁 요약은 시작 문맥으로 유지한다. 승인된 Source 계층과 논리 Keyboard
  순서를 보존한다면 추가 너비에서 주 기록 Column과 보조 분석 Column을 나란히
  배치할 수 있다.
- 추가 공간은 추이, Best Plays, 분포, 판정과 Recent Plays 비교를 개선하는 데
  사용한다. NOS, Brooch, Social Module 또는 과도하게 큰 장식 Surface로 채우지
  않는다.
- Best·Recent 목록은 Compact 행보다 더 정렬된 Metadata를 노출할 수 있지만 같은
  정보 의미와 주 악곡 상세 목적지를 유지한다.
- 모바일 Column만 크게 늘리거나 Viewport를 채우려고 무관한 Dashboard Card를
  만들지 않는다.

### Layout 간 구현 의미 구조

- Compact와 Wide Presentation은 동등한 프로필 Dataset과 Source Order를 노출한다.
- 별도 시각 구조를 Render한다면 활성 구조만 접근성 Tree에 남긴다. Heading, 기록
  Link 또는 비공개 데이터를 중복하면 안 된다.
- 콘텐츠 제약에서 Viewport 또는 Container 전환을 선택하고 중간 너비, 긴 이름과
  세 언어 제목을 검증한다.

## 접근성 계약

- 플레이어의 전체 NosLog 사용자명 또는 다국어 이름 없음 Fallback을 포함한 페이지
  `h1` 하나를 사용한다.
- Basic/Recital 선택기가 제어하는 Label 있는 성과 영역 하나를 제공한다.
- 배타 선택기는 Keyboard로 조작할 수 있고 선택 상태와 보이는 Focus를 노출한다.
  선택 변화가 Focus를 예기치 않게 옮기면 안 된다.
- 국가 Marker와 검정 Label은 다국어 접근 가능한 이름을 가지며 색, 국기 Image
  Rendering 또는 Badge 모양에만 의존하지 않는다.
- 공유, 설정, 데이터 연동, 전체 보기, 악곡 상세 항목, 기간·Metric 선택기, 재시도와
  전체 목록 Navigation은 설명적인 접근 가능한 이름과 보이는 Focus를 가진다.
- 모든 차트는 접근 가능한 이름, 정확한 Text Summary, 데이터 기준과 원본 값을
  얻는 방법을 가진다. 색만으로 Series 또는 상태를 구분하지 않는다.
- Loading과 확정된 Section 갱신은 절제된 Live Status를 사용한다. 모든 기록 항목이나
  차트 Point를 안내하지 않는다.
- 목록은 Semantic List 구조를 사용한다. Wide Table 비교가 필요하면 Native Table
  의미 구조와 연결된 Heading을 사용한다.
- 날짜는 Semantic Time 값을 사용한다. Grd, FC, S-Just 같은 약어는 필요한 곳에
  분명한 문맥 Label 또는 접근 가능한 확장을 제공한다.
- 숨긴 콘텐츠는 시각적으로만 감추지 않고 접근성 Tree와 공개 Payload에서 제거한다.
- Pointer Target은 승인될 Foundation 목표 크기를 충족하고 `320px`에서 겹치지
  않는다.
- Reduced-motion 선호를 존중한다. 추이 또는 Section 전환에서 Motion이 상태 전달에
  필수여서는 안 된다.

## 다국어와 콘텐츠

### 안정된 도메인 Label

- `Basic`, `Recital`, `Grd`, `NosLog Rating`, `S-Just`, `Just`, `Good`, `Miss`,
  `Near`, `Full Combo`, `Pianist`를 승인된 제품 용어로 유지한다.
- 이 안정 용어를 페이지마다 다르게 번역하지 말고 다국어 설명 Label을 주변에 둔다.
- 승인된 국가 분류 의미인 대한민국, 일본, 기타 지역을 사용한다. 기타 지역을 하나의
  특정 국가로 Label하지 않는다.

### 제목과 신원

- 프로필 플레이 항목에는 원문 악곡 제목만 표시합니다. 승인된 번역·읽기 제목은
  검색 가능하게 유지하고 연결된 악곡 상세에서 확인합니다.
- 유효한 한국어, 일본어, Latin, 혼합 Script 사용자명은 전체 접근 가능한 이름을
  유지할 때만 Wrap 또는 시각적 Truncate할 수 있다.
- 긴 일본어 원문 제목과 아티스트를 고정된 단일 언어 높이 가정으로 잘라내지 않습니다.
- Discord Handle, NOSTALGIA명과 오락실명은 원본 표기를 보존한다.

### 날짜와 수

- 날짜를 Locale에 따라 Format하고 Machine-readable Date/Time 값을 노출한다.
- Locale 문맥 없이 모호한 숫자 전용 날짜를 사용하지 않는다.
- 정렬이 비교에 도움이 되는 점수, Grd, Rating, 순위, Play count, 판정 값과 추이
  요약에 Tabular Figure를 사용한다.
- Empty, 본인 비공개, Loading, Error, 재시도, 전체 보기, 연동과 History 불충분
  Label을 한국어·일본어·영어에서 같은 의미로 번역한다.

## 런타임 상태 계약

| 상태               | 필수로 보이는 결과                                                                  | 상호작용 결과                                     |
| ------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------- |
| 공개 Basic         | 신원, Basic 경쟁 요약, Basic 추이·Best, 공개 기록 개요·활동                         | Basic/Recital과 공개 기록 Link 사용 가능          |
| 공개 Recital       | 신원, Recital 공식 Grd·순위, Recital 추이·Best, 만들어낸 Rating 없음                | Basic을 직접 선택 가능                            |
| 본인               | 공개 프로필과 공유, 설정, 연동 상태, 비공개 상태 문맥                               | 본인 Action이 확립된 목적지로 이동                |
| 비로그인           | 본인 Action이 없는 동일 공개 기록 계약                                              | 공개 Link 사용 가능, 읽기에 로그인 불필요         |
| 플레이 활동 비공개 | 마지막 플레이, Recent 미리보기, Count, Timestamp 또는 공개 Recent Route 데이터 없음 | 본인은 설정 가능, 방문자에게 Placeholder 없음     |
| 선택 필드 비공개   | 공개 신원·성과 유지, 보호 Metadata 생략                                             | 공유나 Payload로 보호 값 누출 없음                |
| 공유 Preview       | 공개 안전 선택 모드 카드와 다국어 Text 동등물                                       | 본인이 공유, 저장 또는 지원되는 복사 사용         |
| 공유 미지원        | Preview와 저장·명시적 Link Fallback 유지                                            | 거짓 성공이나 이미지 첨부 주장 없음               |
| 공유 생성 Error    | 제한된 Retry Error, 프로필 계속 사용 가능                                           | 오래되거나 일부 생성된 이미지를 공유하지 않음     |
| 기록 없음          | 신원과 간결한 기록 없음 상태 하나                                                   | 본인은 문맥 데이터 연동, 방문자는 Navigation 유지 |
| 부분 기록          | 신뢰할 수 있는 Section과 지역 불충분 상태만 표시                                    | 다른 Section 계속 사용 가능                       |
| 추이 Point 하나    | 정확한 현재값과 간결한 History 불충분 Text                                          | 기간·Metric 컨트롤은 정확하게 유지                |
| Section 갱신 중    | 마지막 확정 Section과 Busy 상태                                                     | 오래된 Response가 최신 선택을 덮지 못함           |
| 최초 Error         | 경계가 분명한 프로필 Error와 재시도                                                 | 일반 다국어 Shell 사용 가능                       |
| Section Error      | 마지막 확정 Section과 지역 재시도                                                   | 영향 없는 Section 계속 사용 가능                  |
| 연동 필요·실패     | 본인 전용 간결한 연동 상태                                                          | 데이터 연동 복구로 이동, 내부 정보 미노출         |
| 사용자 없음        | 다국어 Not-found 결과                                                               | 빈 프로필이나 비공개 프로필을 만들지 않음         |

## 구현 Mapping

| 승인 요구사항                 | 현재 Source                                                                                                                                                                                                                                                                                                  | 이후 변경                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| 공개 다국어 Route와 본인 확인 | [`app/(nevigation)/profile/[id]/page.tsx`](<../../app/(nevigation)/profile/[id]/page.tsx>)                                                                                                                                                                                                                   | 공개 접근 보존, 승인된 본인·공개 상태와 전체 목록 Link 구성                                              |
| 공개 데이터 Query와 Cache     | [`app/(nevigation)/profile/[id]/data.ts`](<../../app/(nevigation)/profile/[id]/data.ts>)                                                                                                                                                                                                                     | Rating·추이·공개 Analytics, 프라이버시 안전 Payload, 5개 Preview·Total·전체 목록 Query 추가              |
| 프로필 구성과 모드 상태       | [`components/profile/profile.tsx`](../../components/profile/profile.tsx)                                                                                                                                                                                                                                     | Basic/Recital을 성과로 제한, 승인된 Section 재정렬, Inline 목록 확장과 로그아웃 제거                     |
| 신원과 본인 Action            | [`components/profile/dashboard/profileHeader.tsx`](../../components/profile/dashboard/profileHeader.tsx)                                                                                                                                                                                                     | 가입일·Placeholder 제거, 승인 Metadata 공개 범위·마지막 플레이·연동 상태 적용                            |
| 공유 Preview와 행동           | [`components/profile/dashboard/profileShareDialog.tsx`](../../components/profile/dashboard/profileShareDialog.tsx)                                                                                                                                                                                           | 선택 모드 Preview, 기능 감지, 저장·복사 Fallback, 정확한 X Link 공유 및 접근 가능한 Text 추가            |
| 공유 이미지와 Open Graph      | [`app/(nevigation)/profile/[id]/card/route.tsx`](<../../app/(nevigation)/profile/[id]/card/route.tsx>) 및 다국어 프로필 Metadata                                                                                                                                                                             | 공개 안전·프라이버시 인식·Versioned 1200×630 OG 출력, 마지막 플레이·비공개 Placeholder 제거              |
| 경쟁 요약                     | [`components/profile/dashboard/profileSummary.tsx`](../../components/profile/dashboard/profileSummary.tsx)                                                                                                                                                                                                   | 공식 Grd, 조건부 Rating, 전체·국가 순위와 사용 불가 상태 통합                                            |
| 모드 선택기                   | [`components/profile/dashboard/profileModeTabs.tsx`](../../components/profile/dashboard/profileModeTabs.tsx)                                                                                                                                                                                                 | 선택기를 제어 성과 영역에 의미상·시각적으로 연결                                                         |
| Grade 추이                    | [`components/profile/dashboard/profileGradeTrend.tsx`](../../components/profile/dashboard/profileGradeTrend.tsx)                                                                                                                                                                                             | 기간·Metric 선택, Rating Series, 정확한 요약과 접근 가능한 데이터 계약 추가                              |
| Best 미리보기                 | [`components/profile/dashboard/profileBestPlays.tsx`](../../components/profile/dashboard/profileBestPlays.tsx)                                                                                                                                                                                               | 5개 Preview, 활성 모드 정렬, 전체 보기, 다국어 및 악곡 상세 복귀 문맥 사용                               |
| Recent 미리보기               | [`components/profile/dashboard/profileRecentPlays.tsx`](../../components/profile/dashboard/profileRecentPlays.tsx)                                                                                                                                                                                           | 프라이버시 제어 5개 Preview와 전체 보기, 모드 중립 유지                                                  |
| 랭크 분포                     | [`components/profile/dashboard/profileRankDistribution.tsx`](../../components/profile/dashboard/profileRankDistribution.tsx)                                                                                                                                                                                 | 승인 랭크 분류 보존, Inline 확장 의존 제거, 선택 공개 Play count 통합                                    |
| 판정 요약                     | [`components/profile/dashboard/profileJudgementSummary.tsx`](../../components/profile/dashboard/profileJudgementSummary.tsx) 및 [`lib/profile/profileAnalytics.ts`](../../lib/profile/profileAnalytics.ts)                                                                                                   | 전체 기준·유효 채보 수가 있는 프라이버시 안전 공개 성과 요약으로 변경                                    |
| 프로필 설정                   | [`components/profile/profileSettingCard.tsx`](../../components/profile/profileSettingCard.tsx), [`app/(nevigation)/profile/settings/schema.ts`](<../../app/(nevigation)/profile/settings/schema.ts>), [`app/(nevigation)/profile/settings/actions.ts`](<../../app/(nevigation)/profile/settings/actions.ts>) | 선호 오락실·그룹 플레이 활동 공개 설정 추가, 공개 결과 설명, Cache 무효화                                |
| 공개 범위 저장                | [`prisma/schema.prisma`](../../prisma/schema.prisma)                                                                                                                                                                                                                                                         | 기존 Control을 보존하고 명시적 선호 오락실·플레이 활동 공개 필드 추가                                    |
| 공식 플레이 이력              | [`prisma/schema.prisma`](../../prisma/schema.prisma)의 `ChartPlayHistory`                                                                                                                                                                                                                                    | Preview 제한을 넘는 중복 제거 History 보존과 비공개·공개 전체 목록 지원                                  |
| Record Snapshot               | [`prisma/schema.prisma`](../../prisma/schema.prisma)의 `ChartRecordSnapshot`, `UserBestGrade`                                                                                                                                                                                                                | 중복 없는 변경 History 보존과 Grd·Rating 추이 기간 지원                                                  |
| 연동 수집                     | [`lib/services/user/updatePlayData.ts`](../../lib/services/user/updatePlayData.ts), [`lib/services/user/updatePlayerProfile.ts`](../../lib/services/user/updatePlayerProfile.ts)                                                                                                                             | 중복 억제 유지, 본인 안전 최신 상태 노출, 의미 있는 전체 History 보존                                    |
| Basic Rating 계산             | [`lib/tiers/basicRating.ts`](../../lib/tiers/basicRating.ts), [`lib/rankings.ts`](../../lib/rankings.ts)                                                                                                                                                                                                     | 승인된 공개 Basic Rating 계약 재사용, 프로필 전용 별도 Formula 금지                                      |
| 전체 목록 목적지              | 새 다국어 프로필 하위 Route                                                                                                                                                                                                                                                                                  | 복원 가능한 명시적 경계·악곡 상세 복귀 문맥을 가진 프라이버시 안전 Best·Recent 목록 추가                 |
| 다국어 Label                  | [`lib/i18n/messageCatalogs`](../../lib/i18n/messageCatalogs)                                                                                                                                                                                                                                                 | 한국어·일본어·영어 프로필, 공개 범위, 기간, Metric, 목록, 연동과 상태 String 완성                        |
| 기존 자동화 근거              | [`tests/profile.test.ts`](../../tests/profile.test.ts), [`tests/profile-analytics.test.ts`](../../tests/profile-analytics.test.ts) 및 프로필·연동 Test                                                                                                                                                       | 프라이버시 누출, 모드 범위, Rating, Preview·전체 목록, History, 다국어, 320px Reflow, 상태 Coverage 추가 |

## 대표 Fixture

최소한 다음을 검증한다.

1. 같은 완전 공개 프로필을 보는 본인과 비로그인 방문자;
2. 아바타·검정이 있거나 없는 대한민국·일본·기타 지역 신원;
3. 공식 Grd, Rating, 순위, 긴 History와 5개보다 많은 Best Plays가 있는 Basic;
4. 공식 Grd와 Best Plays는 있지만 Rating Source는 없는 Recital;
5. 기록 없음, Basic 전용 기록, 추이 Point 하나, 부분 판정 Coverage와 Recent Plays
   없음;
6. 각 선택 공개 필드를 독립적으로 숨긴 상태;
7. 마지막 플레이와 Recent Plays가 함께 사라지는 플레이 활동 비공개;
8. 방문자와 인증된 본인이 숨긴 Recent 하위 Route를 직접 연 상태;
9. Best·Recent History가 한 경계보다 많고 악곡 상세에서 정확히 복귀하는 상태;
10. 본인의 최신, 오래됨, 연동 중, 일부 반영, 실패 연동;
11. 유효 최대 길이 사용자명과 긴 NOSTALGIA명·Discord·오락실명;
12. 긴 일본어 원문 제목, 번역·읽기 검색으로 진입해도 원문만 표시되는 프로필 악곡
    항목 및 자켓 없음 악곡;
13. 희소·동일·변화 값이 있는 `30일`, `90일`, `1년`, `전체` 추이;
14. 최초 Loading, Section 갱신, 최초 Error, Section Error, 재시도, 사용자 없음과
    오래된 Response 순서;
15. `320px`, 대표 `390px`, 중간 너비, 넓은 데스크톱, 200% Text Zoom,
    Reduced Motion, Keyboard-only 및 Screen Reader 구조.

## 브라우저 수용 계약

- `/ko/profile/[id]`, `/ja/profile/[id]`, `/en/profile/[id]`는 같은 의미와
  다국어 Metadata로 열린다.
- 공개 방문자는 인증 없이 플레이어를 식별하고, 현재 위치를 비교하고, 공개 성장과
  기록을 확인하고, 근거 악곡 상세를 열 수 있다.
- 신원 영역은 사용자명 옆 국가 Marker와 검정 문맥을 포함하지만 NosLog 가입일은
  포함하지 않는다.
- Basic/Recital은 경쟁 요약, 추이와 Best Plays만 바꾼다. 모드 중립 Section은
  조용히 바뀌지 않는다.
- Basic은 공식 Grd와 사용 가능한 NosLog Rating을 표시한다. Recital은 Rating을
  만들어내거나 빈 자리를 확보하지 않는다.
- 성장 추이는 90일이 기본이고, 선택한 Metric 하나를 표시하고, 정확한 시작·현재·
  변화 Text와 접근 가능한 원본 값을 제공한다.
- 프로필 개요는 Best 5개와 Recent 5개 이하를 Render하고 더 공개할 항목이 있을
  때만 전체 보기를 노출한다.
- 전체 목록 상태와 악곡 상세에서 복귀 시 실용적인 위치와 모드 문맥을 복원한다.
- NOSTALGIA명, Discord, 선호 오락실, Play count와 플레이 활동은 Content,
  Payload, 접근 가능한 이름과 공유 Artifact에서 승인 공개 설정을 따른다.
- 플레이 활동을 숨기면 방문자에게 마지막 플레이와 Recent Plays가 함께 사라진다.
- 숨긴 또는 없는 Metadata는 방문자에게 `비공개`, `미설정`, 빈 Badge 또는 빈 Layout
  자리를 남기지 않는다.
- 공개 판정은 유효 표본 기준을 노출하고 판정 데이터가 없는 채보까지 포함한 것처럼
  표현하지 않는다.
- 본인 전용 공유, 설정과 연동 상태는 유지하지만 프로필 본문 로그아웃 Action은 없다.
- `320 CSS px`에서 Header, Metadata, 선택기, Metric, 플레이 항목, 차트 또는
  Action이 문서 가로 Overflow, Clipping 또는 Overlap을 일으키지 않는다.
- Wide Layout은 무관한 Dashboard가 되거나 제외 필드를 노출하지 않고 추가 읽기·
  비교 공간을 사용한다.
- 한국어 UI Copy, 일본어 원문 제목과 긴 영어 UI 콘텐츠가 의미 손실 Truncate나 고정 높이
  충돌 없이 Reflow한다.
- Loading, Empty, 부분, 프라이버시, 사용 불가, Error, 연동 및 Not-found 상태가
  구분되고 복구 가능한 곳에서 복구할 수 있다.
- 모든 선택기, Action, 목록, 재시도와 기록 Link가 Keyboard만으로 작동하고 보이는
  Focus를 가진다.
- 차트는 색이나 그래픽 없이 이해할 수 있고 Reduced Motion을 존중한다.
- 테스트한 정상·실패 Flow에서 예상하지 못한 브라우저 Console Error나 공개
  비공개 데이터 누출이 없다.

## 레퍼런스 Matrix

| 출처                                                                                                                     | 전용할 수 있는 원칙                                                                   | NosLog 적용                                              | 한계                                                          |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| [현재 프로필 데이터](<../../app/(nevigation)/profile/[id]/data.ts>)                                                      | 구현된 필드, Cache 경계, 목록 제한, 모드 순위와 본인 전용 Analytics를 확정            | 관찰된 동작과 승인된 이후 변경을 구분                    | 현재 표시·프라이버시는 2.0 권위가 아님                        |
| [현재 프로필 구성](../../components/profile/profile.tsx)                                                                 | 현재 Source Order와 전역 모드 상태 결합을 보여줌                                      | 보존·재범위화할 Section을 식별                           | 현재 고정 Compact 구성은 대체됨                               |
| [현재 프로필 Schema](../../prisma/schema.prisma)                                                                         | 사용 가능한 신원, History, Snapshot, 연동과 공개 범위 데이터를 확정                   | 보존과 Migration 요구를 근거화                           | 승인 공개 필드와 Recital Rating이 없음                        |
| [승인 IA](./02-information-architecture.ko.md)                                                                           | 프로필을 공개 기록·비교 문맥과 Header 신원 목적지로 정의                              | 접근, 목적, 설정 관계 보존                               | 프로필 Anatomy를 정의하지 않음                                |
| [승인 악곡 상세 브리프](./05-music-detail-page-brief.ko.md)                                                              | 프로필 전체 Play count를 미루고 프로필↔악곡 기록 Link 보존                            | 미뤄둔 데이터 의미와 왕복 동작 해결                      | 채보 단위 Metric은 분리 유지                                  |
| [승인 서열 브리프](./06-tier-list-page-brief.ko.md)                                                                      | 목표별 서열과 Rating Source 동작 정의                                                 | 프로필 Rating을 동일 승인 계약에서 파생                  | 프로필 Layout을 정의하지 않음                                 |
| [승인 글로벌 랭킹 브리프](./08-global-rankings-page-brief.ko.md)                                                         | 공개 플레이어 Link, 모드 Metric, 국가 분류와 공동 순위 의미 보존                      | 신원, 순위와 Rating Label 정렬                           | 랭킹 행은 전체 프로필이 아님                                  |
| [NOSTALGIA 공식 Play Data](https://p.eagate.573.jp/game/nostalgia/op3/playdata/entrance.html)                            | 플레이어 신원, Play count, Basic·Recital Grd, 채보 Best, 판정 상세와 최근 플레이 공개 | 핵심 NOSTALGIA 기록 용어와 데이터 출처 검증              | 공식 포함이 NOS나 Brooch를 NosLog 우선순위로 만들지 않음      |
| [NOSTALGIA 공식 모드 안내](https://p.eagate.573.jp/game/nostalgia/op2/howto/entrance.html)                               | Basic과 Recital은 서로 다른 게임 성과 문맥                                            | 범위가 제한된 모드 비교 지지                             | NosLog Rating이나 공개 범위를 정의하지 않음                   |
| [osu! 공개 프로필](https://osu.ppy.sh/users/11839754/osu)                                                                | 신원과 위치를 먼저, 이후 Best, History, Most-played, 최근 성과를 배치                 | 성과 우선 계층과 전체 근거 목록 지지                     | osu! PP·Medal·Social 문맥은 직접 대응하지 않음                |
| [osu! API 프로필 Section](https://osu.ppy.sh/docs/index.html)                                                            | 공개 프로필 Section이 독립적으로 주소화 가능한 데이터 Group                           | 경계 있는 Best·Recent 목적지와 명시 상태 지지            | API 구조가 시각 구성을 결정하지 않음                          |
| [ScoreSaber 초보자 가이드](https://wiki.scoresaber.com/beginners-guide.html)                                             | 프로필 신원, 전체 성과 값, 전체·지역 순위와 점수 통계를 함께 Group                    | 일관된 경쟁 요약 지지                                    | Beat Saber PP는 Grd·NosLog Rating과 다름                      |
| [ScoreSaber 랭킹 시스템](https://wiki.scoresaber.com/ranking-system.html)                                                | 가중 Best 성과가 공개 순위와 국가 위치를 설명                                         | 파생 Rating 근거로 Best Plays 지지                       | 정확한 가중치는 NosLog 정책이 아님                            |
| [BeatLeader Server와 API](https://github.com/BeatLeader/beatleader-server)                                               | 성과 프로필이 순위 점수, History와 Replay 근거를 연결                                 | 공개 기록 근거와 구조화된 전체 목록 지지                 | Replay·Anti-cheat는 범위 밖                                   |
| [LIFE4 DDR](https://life4ddr.com/)                                                                                       | 경쟁 Rank가 장식 상태가 아니라 성장 Roadmap이 될 수 있음                              | 현재 위치 다음 성장 근거 배치 지지                       | LIFE4 Achievement 규칙은 NOSTALGIA 규칙이 아님                |
| [Strava 프로필](https://support.strava.com/en-us/articles/15402175-your-strava-profile-page)                             | 신원, 활동 History, 기간 성장과 최근 항목을 서로 다른 우선순위로 공존                 | 성장 요약과 경계 있는 최근 활동 지지                     | 운동 Metric·Social Module은 채택하지 않음                     |
| [Last.fm 공개 사용자 프로필](https://www.last.fm/user/fm-bot)                                                            | 최근 활동과 장기 Listening Report를 다른 Layer로 구분                                 | 개요 Preview와 전체 History 지지                         | Listening 활동은 경쟁 게임 성과가 아님                        |
| [GitHub 개인 프로필](https://docs.github.com/en/account-and-profile/concepts/personal-profile)                           | 공개 신원, 활동 시각화와 선택 Highlight 공존                                          | 설정 Dashboard 없이 신원·성장·Best 근거 지지             | Contribution Graph Styling을 복사하지 않음                    |
| [GitHub Contribution 레퍼런스](https://docs.github.com/en/account-and-profile/reference/profile-contributions-reference) | 활동 History에는 명확한 포함 규칙과 공개·비공개 의미가 필요                           | 추이 데이터 기준과 숨긴 활동의 명시 의미 지지            | Contribution Event는 NOSTALGIA 연동 Event와 다름              |
| [Google Play Games 프로필 공개 범위](https://support.google.com/googleplay/answer/16562063?hl=en)                        | 공개·비공개 프로필 결과에 명확한 Preview와 공개 의미 필요                             | 명시적 프로필 공개 설정과 본인 이해 지지                 | Native App 공개 Group을 그대로 복사하지 않음                  |
| [Steam 프로필 공개 범위](https://help.steampowered.com/en/faqs/view/588C-C67D-0251-C276)                                 | 게임 상세·플레이 시간을 기본 신원과 별도로 제어 가능                                  | 선택 공개 Play count와 활동 지지                         | Steam 전체 프로필 단계는 의도적으로 채택하지 않음             |
| [Apple Game Center 프라이버시](https://www.apple.com/ca/legal/privacy/data/en/game-center/)                              | 신원과 게임 활동을 사용자가 선택한 공개에 따라 공유                                   | 명시적 활동 공개와 조용한 누출 방지 지지                 | Platform 계정 관계는 NosLog와 다름                            |
| [PlayStation 프라이버시 설정](https://www.playstation.com/en-us/support/account/privacy-settings/)                       | 최근 활동과 프로필 공개에는 이해 가능한 Audience Control 필요                         | 위치 인접·플레이 활동 공개 범위 분리 지지                | Console Audience Preset은 필요 없음                           |
| [Carbon Dashboard](https://carbondesignsystem.com/data-visualization/dashboards/)                                        | Dashboard는 명확한 계층, 최소 방해와 집중된 분석 질문 필요                            | 무관한 Metric Card 없는 성과 프로필 지지                 | Carbon Surface Styling은 NosLog 권위가 아님                   |
| [USWDS 데이터 시각화](https://designsystem.digital.gov/components/data-visualizations/)                                  | 차트에는 원본 데이터와 쉬운 말 Summary가 필요                                         | 접근 가능한 Grd·Rating 추이와 판정 기준 요구             | 리듬게임 Metric을 정의하지 않음                               |
| [GOV.UK Accordion](https://design-system.service.gov.uk/components/accordion/)                                           | 모두에게 필요한 내용은 숨기지 말고 Disclosure 전에 단순화                             | 핵심 성과를 계속 보이고 중첩 프로필 Accordion 방지       | 정부 콘텐츠 밀도는 NosLog와 다름                              |
| [W3C WCAG: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                              | 일반 세로 콘텐츠는 320 CSS px에서 2차원 스크롤 없이 정보·기능 보존                    | 현재 Overflow와 고정 Compact Desktop Shell 거부          | 정확한 Layout Token을 정하지 않음                             |
| [W3C Table 튜토리얼](https://www.w3.org/WAI/tutorials/tables/)                                                           | 표 관계에는 명확한 Heading과 연결 필요                                                | Wide 전체 목록과 Metric 비교 의미 구조 안내              | Compact 기록은 Semantic List 사용 가능                        |
| [WAI-ARIA APG: Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)                                                     | Tab형 배타 Control에는 명확한 제어 관계와 Keyboard 동작 필요                          | Tab 의미 구조를 선택할 때 범위 Basic/Recital 선택기 안내 | 시각 Styling과 Tab·Segmented Control 선택은 Foundation에 남음 |
| [W3C 국제화 기법](https://www.w3.org/International/techniques/authoring-html.en)                                         | 다국어 Text에는 Language Metadata와 Script-aware Wrapping 필요                        | 한국어·일본어·영어 Label과 제목 Reflow 지지              | 정확한 Typography는 Foundation Test 필요                      |
| [한국어 조판 요구사항](https://w3c.github.io/klreq/)                                                                     | 한국어 줄바꿈과 Typographic Composition에는 언어별 제약이 있음                        | Script-aware 이름·제목·Metadata 지지                     | NosLog 시각 정체성을 정하지 않음                              |

### 근거의 수렴

- 리듬게임 프로필 레퍼런스는 신원과 현재 경쟁 위치를 먼저, Best 성과와 더 넓은
  활동을 이후에 두는 방향으로 수렴한다. 재화, Inventory 또는 계정 관리를 먼저
  두는 사례는 이 목적을 지지하지 않는다.
- 활동 프로필은 모든 Event를 개요에 넣지 않고 상위 성장, 선택 Highlight와 최근
  History를 분리하는 방향으로 수렴한다.
- 프라이버시 레퍼런스는 활동, 플레이 시간과 위치 인접 필드의 명시적 공개 설정으로
  수렴한다. Placeholder나 생성 Artifact로 숨긴 데이터를 누출하는 근거는 없다.
- Dashboard·접근성 출처는 시각화마다 질문 하나, 정확한 Text Summary, 안정된 상태와
  동등한 Card의 벽이 아닌 반응형 계층으로 수렴한다.
- 반응형·국제화 지침은 고정 390px 제품 Shell이 아니라 콘텐츠 기반 Reflow, 320px
  지원과 가변 높이 다국어 행으로 수렴한다.
- 어떤 외부 출처도 정확한 NosLog 공개·비공개 Group, Basic/Recital 범위, Rating
  Source, 5개 Preview 수 또는 Brooch·NOS 제외를 정의하지 않는다. 이는 검증된
  NosLog/NOSTALGIA 동작과 사용자 명시 승인에서 나온다.

## 기각 및 대체된 대안

- **Basic/Recital을 페이지 전역 Tab으로 사용 — Superseded:** 경쟁 요약, 성장 추이,
  Best Plays만 제어한다.
- **Compact에서 Basic·Recital 요약을 동시에 표시 — Rejected:** 시작 밀도를 높이고
  활성 성과 문맥을 약화한다.
- **빈 또는 비활성 Recital Rating 자리 표시 — Rejected:** 승인 Source·계산이 생길
  때까지 Metric을 생략한다.
- **공식 Grd와 Rating을 차트 하나에 겹침 — Rejected:** Scale과 의미가 달라 오해를
  부른다.
- **기간 네 개를 모두 상시 버튼으로 사용 — Rejected:** 간결한 선택기 하나로 계층을
  보존한다.
- **NosLog 가입일 유지 — Superseded:** 마지막 플레이가 관련 NOSTALGIA 활동 문맥이며
  공개 범위로 제어한다.
- **마지막 플레이와 Recent Plays를 독립 제어 — Rejected:** 별도 Control은 서로
  모순되고 숨긴 활동 시간을 누출할 수 있다.
- **방문자에게 `비공개` Placeholder 표시 — Rejected:** 숨긴 필드와 Module을 완전히
  생략한다.
- **판정을 본인 전용으로 유지 — Superseded:** 명시적 유효 데이터 기준이 있는 공개
  경쟁 성과 정보로 만든다.
- **Best·Recent 10개 또는 무제한 Inline 표시 — Superseded:** 5개 Preview와 전용
  전체 목록 목적지를 사용한다.
- **전체 목록 자동 무한 스크롤 — Rejected:** 명시적 제한 Loading이 위치, History와
  복귀 동작을 보존한다.
- **프로필 끝에 로그아웃 유지 — Rejected:** 계정 종료는 계정/더보기 또는 설정
  문맥에 속한다.
- **Brooch 또는 NOS를 상시 프로필 Metric으로 표시 — Rejected:** 승인된 공개 실력,
  성장과 기록 목적을 수행하지 않는다.
- **Social Follower, Messaging 또는 상태 Feed 추가 — Rejected:** 승인된 NosLog
  필요가 없다.
- **데스크톱을 고정 390px Column에 유지 — Rejected:** `390px`은 대표 모바일
  Canvas이지 데스크톱 제품 너비가 아니다.

## 결정 기록

| ID      | 결정                                                                            | 상태       |
| ------- | ------------------------------------------------------------------------------- | ---------- |
| PROF-01 | 프로필은 신원, 실력, 성장과 기록 근거 중심의 공개 기록·비교 목적지              | `Approved` |
| PROF-02 | Source Order는 신원, 경쟁 요약, 성장, Best Plays, 기록 개요, Recent Plays       | `Approved` |
| PROF-03 | 국가 Marker는 사용자명 옆, 모드 검정은 신원 아래 배치                           | `Approved` |
| PROF-04 | NosLog 계정 가입일 제거                                                         | `Approved` |
| PROF-05 | 본인은 간결한 공유·설정 Action을 유지하고 문맥 연동 최신 상태 추가              | `Approved` |
| PROF-06 | 프로필 본문 로그아웃 제거                                                       | `Approved` |
| PROF-07 | Basic/Recital 선택기는 경쟁 요약, 성장과 Best Plays만 제어                      | `Approved` |
| PROF-08 | 공식 Grd는 공식 주 Metric, Basic에는 승인 NosLog Rating 추가                    | `Approved` |
| PROF-09 | Recital Rating을 구조적으로 수용하되 승인 Source 전에는 생략                    | `Approved` |
| PROF-10 | 경쟁 요약은 모드 Grd, 조건부 Rating, 전체·국가 분류 순위를 통합                 | `Approved` |
| PROF-11 | 성장 기본 90일, 하나의 선택기에서 30일·90일·1년·전체 사용                       | `Approved` |
| PROF-12 | 성장에는 선택 Metric 하나를 표시하고 정확한 시작·현재·변화 Text 제공            | `Approved` |
| PROF-13 | 개요에 활성 모드 Best Plays 5개와 전체 목록 목적지 제공                         | `Approved` |
| PROF-14 | 랭크 분포와 판정은 모드 중립 공개 기록 개요 데이터                              | `Approved` |
| PROF-15 | 프로필 전체 Play count는 선택 공개 정보이며 Clear count가 아님                  | `Approved` |
| PROF-16 | 플레이 활동 공개 시 모드 중립 Recent Plays 5개 표시                             | `Approved` |
| PROF-17 | Best·Recent 전체 목록은 명시적 제한 Loading과 무한 스크롤 금지                  | `Approved` |
| PROF-18 | 항상 공개 성과는 신원, 검정, Metric, 순위, 성장, Best, 분포와 판정              | `Approved` |
| PROF-19 | NOSTALGIA명, Discord, 선호 오락실, Play count, 그룹 플레이 활동을 사용자가 제어 | `Approved` |
| PROF-20 | 마지막 플레이와 Recent Plays는 플레이 활동 설정 하나를 공유                     | `Approved` |
| PROF-21 | 방문자에게 숨긴 콘텐츠는 `비공개` Placeholder 없이 생략                         | `Approved` |
| PROF-22 | 30개 제한 없이 의미 있는 일별 History를 보존하고 동일 Event·Snapshot 중복 금지  | `Approved` |
| PROF-23 | Brooch, 상시 NOS, 임의 Achievement와 Social Module 제외                         | `Approved` |
| PROF-24 | Compact Layout은 320 CSS px까지 문서 가로 스크롤 없이 Reflow                    | `Approved` |
| PROF-25 | Wide Layout은 무관한 Dashboard가 되지 않으면서 추가 비교 공간 사용              | `Approved` |
| PROF-26 | 선택 모드 하나에 범위가 정해진 본인 Preview 1200×630 카드 사용                  | `Approved` |
| PROF-27 | 공개 신원과 사용 가능한 선택 모드 경쟁 문맥 포함                                | `Approved` |
| PROF-28 | 공개된 NOSTALGIA명, Play count 및 선호 오락실명만 조건부 포함                   | `Approved` |
| PROF-29 | 숨김·누락 필드 생략 및 Discord, 활동, NOS, 연동, 주소, 운영 데이터 제외         | `Approved` |
| PROF-30 | System Share 기능 감지 및 저장, 지원되는 복사, 정확한 Link Fallback 제공        | `Approved` |
| PROF-31 | 공개 안전 다국어 Open Graph 카드 제공 및 공개 설정 변경 뒤 무효화               | `Approved` |
| PROF-32 | 다국어 접근 가능 동등물과 명시적 Loading·취소·미지원·Error 동작 제공            | `Approved` |

## 인계 경계

Claude Design은 Foundation 승인 후 최종 Type Scale, 시각 강조, Surface, 차트 외형,
Column 비율, Grid Track, 간격, 아바타 Fallback, 국가 Marker 처리, 컨트롤 Styling,
반응형 전환 지점과 Motion을 정할 수 있다. 그러나 승인 Source 계층, 범위가 제한된
Basic/Recital 동작, Metric 의미, 프라이버시 Group, 5개 Preview, 전체 목록 접근,
연동 신뢰 문맥, 상태, 접근성, 다국어와 수용 기준을 보존해야 한다.

이후 Codex 구현 세션은 Claude 결과를 이 브리프와 비교해야 한다. NosLog 가입일을
다시 넣거나, 숨긴 콘텐츠를 노출하거나, Basic/Recital을 페이지 전역 Mode로 다루거나,
Recital Rating을 만들어내거나, Grd와 Rating을 겹치거나, 보존 History를 개요 수로
제한하거나, 무한 스크롤을 사용하거나, 로그아웃·Brooch·NOS를 프로필 우선순위로
되돌리거나, 고정 휴대폰 너비 데스크톱 Shell을 유지하거나, 그 밖의 승인 계약 충돌이
있다면 구현 전에 가이드 또는 디자인 수정을 요청해야 한다.
