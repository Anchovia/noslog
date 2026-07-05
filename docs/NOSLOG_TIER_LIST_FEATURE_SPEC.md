# NosLog 서열표 기능 기획서

> 상태: 기획 초안  
> 목적: NOSTALGIA 플레이어가 개인 또는 커뮤니티 기준의 난이도 서열표를 만들고, 자신의 플레이 기록과 연결해 다음 목표를 찾을 수 있게 한다.

---

## 1. 기능 정의

서열표 기능은 곡 난이도를 단순히 공식 레벨로만 보는 것이 아니라, 유저 또는 커뮤니티가 체감 난이도를 세분화해서 정리하는 기능이다.

NosLog에서의 서열표는 다음 세 가지 목적을 가진다.

```txt
1. 곡별 체감 난이도 확인
2. 내 기록과 연결한 개인 달성률 확인
3. 다음에 도전할 곡을 고르는 기준 제공
```

즉, 단순 정보 페이지가 아니라 **개인 목표 설정과 성과 확인을 돕는 기능**으로 설계한다.

---

## 2. 참고 레퍼런스

### 2.1 maishift / maimai 성과표 UI

- Reference: https://maimai.shiftpsh.com/
- Guide: https://maimai.shiftpsh.com/en/guide
- User-provided screenshot: maishift profile card / rating table style

차용할 장점:

- 플레이어 프로필과 성과를 한 화면에 압축해서 보여주는 구조
- 카드형 곡 목록 UI
- 점수, 등급, 난이도, 곡 이미지를 한 카드 안에 배치하는 방식
- `NEW`, `OTHERS`처럼 섹션을 나누어 성과를 빠르게 확인하게 하는 구조
- 리듬게임 유저에게 익숙한 시각적 밀도
- 북마클릿 기반 데이터 동기화 흐름

NosLog 적용 방향:

```txt
- 서열표에서도 곡 카드를 작고 밀도 있게 배치
- 곡 이미지, 곡명, 난이도, 내 점수, 달성 상태를 한 카드에 표시
- 최근 갱신곡 또는 목표곡은 강조 표시
- 프로필/성과 페이지와 시각 언어를 맞춘다
```

### 2.2 V-ARCHIVE 서열표 UI

- Reference: https://v-archive.net/grade/4
- User-provided screenshot: V-ARCHIVE DJMAX RESPECT V 서열표

차용할 장점:

- 패턴 버튼: `4B / 5B / 6B / 8B`
- 서열 구간을 `16.1`, `15.3`, `15.2`처럼 세분화해서 보여주는 구조
- 곡 카드를 서열 구간별로 묶어 보여주는 방식
- 이름 on/off, 정렬, 레벨, DLC 필터처럼 직관적인 조작 요소
- 모바일에서도 이해하기 쉬운 큰 버튼과 섹션 구분

NosLog 적용 방향:

```txt
- NOSTALGIA 난이도/모드 기준 탭 제공
- 체감 난이도 구간별 섹션 제공
- 곡 카드 그리드 표시
- 이름 on/off, 정렬, 레벨, 카테고리 필터 제공
- 개인 기록 overlay를 곡 카드 위에 추가
```

### 2.3 solved.ac / 백준 난이도 기여 시스템

- Reference: https://solved.ac/
- Problem level guide: https://help.solved.ac/en/problem/level
- Contribution guideline: https://solved.ac/guideline
- Advanced search reference: https://solved.ac/search

차용할 장점:

- 문제 난이도를 커뮤니티가 기여하는 구조
- 난이도 값, 투표 수, 표준편차 등으로 신뢰도를 보조하는 방식
- 유저 기여를 기반으로 한 난이도 보정
- 고급 검색에서 `voted_by`, `contributed`, `vote_average`, `vote_stdev` 같은 조건을 제공하는 구조

NosLog 적용 방향:

```txt
- 곡별 체감 난이도 투표
- 곡별 토론 / 의견 메모
- 투표 수와 분산을 기반으로 신뢰도 표시
- 최종 서열표는 관리자/큐레이터 승인 또는 커뮤니티 합의 기반으로 반영
```

---

## 3. 핵심 UX 방향

서열표는 많은 정보를 다루지만, 기본 화면은 단순해야 한다.

```txt
처음 보는 화면: 서열표를 빠르게 훑는다.
자세히 보는 화면: 내 기록, 투표, 토론, 목표를 확인한다.
```

따라서 UI는 두 층으로 나눈다.

```txt
기본 보기
- 난이도 구간
- 곡 카드
- 내 달성 상태
- 핵심 필터

상세 보기
- 곡별 내 기록
- 투표 분포
- 토론/메모
- 목표 설정
- 서열 변경 이력
```

---

## 4. 페이지 구조

### 4.1 `/tiers`

서열표 목록 페이지.

역할:

- 공식/커뮤니티/개인 서열표 목록 표시
- 최근 업데이트된 서열표 표시
- 내가 만든 서열표 표시
- 인기 서열표 표시

예상 UI:

```txt
서열표

[공식/추천] [커뮤니티] [내 서열표]

- NOSTALGIA Basic 고레벨 서열표
- NOSTALGIA Recital 서열표
- Lv 12~13 체감 난이도표
- 내가 만든 개인 목표 서열표
```

### 4.2 `/tiers/[tierListId]`

서열표 상세 페이지.

역할:

- 구간별 곡 표시
- 내 기록 overlay
- 필터/정렬
- 투표 및 토론 접근

상단 UI:

```txt
NOSTALGIA Basic 서열표
마지막 업데이트: 2026.07.05
참여자: 42명
내 달성률: S 이상 34/68 · FC 12/68

[Basic] [Recital]
[레벨] [카테고리] [내 기록] [정렬]
[이름 on/off]
```

본문 UI:

```txt
12.9
[곡 카드] [곡 카드] [곡 카드]

12.8
[곡 카드] [곡 카드]

12.7
[곡 카드] [곡 카드] [곡 카드]
```

### 4.3 `/tiers/[tierListId]/edit`

개인 서열표 편집 페이지.

역할:

- 유저가 직접 곡을 구간에 배치
- 드래그 앤 드롭 또는 선택식 편집
- 임시 저장 / 공개 / 비공개 설정

편집 방식:

```txt
왼쪽: 곡 검색 / 필터
오른쪽: 서열 구간

[곡 검색]
[미배치 곡 목록]

12.9: [곡 A] [곡 B]
12.8: [곡 C]
12.7: [곡 D] [곡 E]
```

### 4.4 `/music/[id]/tier`

곡별 서열 정보 페이지 또는 곡 상세 내부 탭.

역할:

- 해당 곡이 여러 서열표에서 어느 위치인지 표시
- 커뮤니티 투표 현황 표시
- 의견/토론 표시

---

## 5. 곡 카드 UI

서열표 곡 카드는 너무 커지면 안 된다. 한 화면에 많은 곡을 볼 수 있어야 한다.

기본 카드 정보:

```txt
- 자켓 이미지
- 곡명
- 난이도 / 레벨
- 서열 구간
- 내 최고 점수
- 내 등급
- FC 여부
- 투표 신뢰도 또는 의견 수
```

예상 카드 형태:

```txt
┌────────────────────┐
│ jacket image        │
│                12.8 │
│ Song Title          │
│ 98.72% · S          │
│ FC 미달성 · 목표곡   │
└────────────────────┘
```

상태 표시:

| 상태         | 표현                   |
| ------------ | ---------------------- |
| 미플레이     | 흐린 카드 / 회색 dot   |
| 플레이함     | 기본 카드              |
| S 달성       | 카드 하단 badge        |
| FC 달성      | 테두리 강조            |
| 목표 설정    | 작은 flag 또는 pin     |
| 최근 갱신    | `NEW` badge            |
| 내 기록 낮음 | 약한 warning indicator |

---

## 6. 필터와 정렬

V-ARCHIVE처럼 조작 요소는 크고 단순해야 한다.

### 필터

```txt
- 모드: Basic / Recital
- 레벨 범위
- 난이도 구간
- 카테고리
- 미플레이
- S 미달성
- FC 미달성
- 목표 설정됨
- 최근 갱신됨
```

### 정렬

```txt
- 서열표 순
- 레벨 순
- 내 점수 낮은 순
- 다음 등급까지 가까운 순
- 최근 플레이 순
- 투표 많은 순
- 의견 많은 순
```

초기 기본값:

```txt
정렬: 서열표 순
표시: 곡명 on
필터: 전체
```

---

## 7. 개인 달성률 연결

서열표 기능은 NosLog의 개인 기록과 반드시 연결되어야 한다.

상단 요약:

```txt
내 달성률
S 이상: 34 / 68
FC: 12 / 68
미플레이: 5
목표곡: 8
```

구간별 요약:

```txt
12.9
S 이상 2/5 · FC 0/5 · 미플레이 1

12.8
S 이상 7/12 · FC 3/12 · 미플레이 0
```

이렇게 하면 서열표가 단순한 난이도표가 아니라 “내가 어디까지 달성했는지”를 보는 개인 대시보드가 된다.

---

## 8. 투표 및 토론 시스템

백준/solved.ac의 난이도 기여 방식을 참고해, 곡별 체감 난이도 투표와 의견을 제공한다.

### 8.1 난이도 투표

유저는 곡에 대해 체감 난이도 값을 제출할 수 있다.

```txt
곡 A
내 체감 난이도: 12.8
의견: S까지는 무난하지만 FC 난이도가 높음
```

투표 데이터:

```txt
- userId
- musicId
- difficulty
- mode
- votedValue
- comment
- createdAt
- updatedAt
```

투표 결과 표시:

```txt
커뮤니티 체감: 12.78
투표 수: 38
분산: 낮음
의견: 12개
```

### 8.2 신뢰도 표시

단순 평균만 보여주면 소수 투표에 흔들릴 수 있으므로, 신뢰도 표시가 필요하다.

예상 기준:

```txt
투표 1~4개: 참고용
투표 5~14개: 보통
투표 15개 이상: 안정적
표준편차가 큰 경우: 의견 갈림 표시
```

UI 표현:

```txt
체감 12.8 · 투표 21 · 의견 갈림 낮음
체감 12.7 · 투표 6 · 참고용
```

### 8.3 토론 / 의견

토론 기능은 게시판처럼 크게 만들지 않는다. 곡별 짧은 의견 메모 정도로 시작한다.

```txt
- "후반 계단 때문에 12.8은 되어야 함"
- "점수 난이도는 낮은데 FC 난이도가 높음"
- "S 기준으로는 12.6, FC 기준으로는 12.8"
```

초기에는 댓글형 토론보다 다음 구조가 적절하다.

```txt
곡별 체감 의견
- 난이도 투표
- 짧은 코멘트
- 좋아요 또는 동의 버튼
```

운영 부담이 커질 수 있으므로 신고/숨김 기능은 나중에 고려한다.

---

## 9. 공식/커뮤니티/개인 서열표 구분

서열표는 출처와 성격을 명확히 구분한다.

| 유형            | 설명                                 |
| --------------- | ------------------------------------ |
| 추천 서열표     | 운영자가 정리한 기본 서열표          |
| 커뮤니티 서열표 | 투표 데이터를 기반으로 생성된 서열표 |
| 개인 서열표     | 유저가 직접 만든 개인용 서열표       |

UI에서는 라벨을 붙인다.

```txt
[추천] Basic Lv 12+ 서열표
[커뮤니티] 투표 기반 Basic 서열표
[개인] Carol의 목표 서열표
```

---

## 10. 데이터 모델 초안

### TierList

```prisma
model TierList {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  ownerId     Int?
  visibility  String   // public, private, unlisted
  type        String   // official, community, personal
  mode        String   // basic, recital
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  items       TierListItem[]
}
```

### TierListItem

```prisma
model TierListItem {
  id         Int      @id @default(autoincrement())
  tierListId Int
  musicId    Int
  difficulty String
  tierLabel  String   // e.g. "12.8"
  sortOrder  Int
  note       String?

  tierList   TierList @relation(fields: [tierListId], references: [id])
  music      Music    @relation(fields: [musicId], references: [id])

  @@unique([tierListId, musicId, difficulty])
}
```

### DifficultyVote

```prisma
model DifficultyVote {
  id          Int      @id @default(autoincrement())
  userId      Int
  musicId     Int
  difficulty  String
  mode        String
  value       Float
  comment     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([userId, musicId, difficulty, mode])
}
```

### TierDiscussionComment

```prisma
model TierDiscussionComment {
  id          Int      @id @default(autoincrement())
  userId      Int
  musicId     Int
  difficulty  String
  mode        String
  content     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 11. 구현 단계

### Phase 1. 읽기 전용 서열표

목표: 먼저 예쁘고 직관적인 서열표 뷰를 만든다.

```txt
- 정적 서열표 데이터 seed
- `/tiers` 목록 페이지
- `/tiers/[id]` 상세 페이지
- 구간별 곡 카드 표시
- 기본 필터/정렬
- 내 기록 overlay
```

### Phase 2. 개인 달성률 연결

목표: 서열표와 유저 기록을 연결한다.

```txt
- S 이상 달성률
- FC 달성률
- 미플레이 수
- 목표곡 표시
- 다음 등급까지 가까운 곡 정렬
```

### Phase 3. 개인 서열표 편집

목표: 유저가 직접 서열표를 만들 수 있게 한다.

```txt
- 개인 서열표 생성
- 구간 추가/삭제
- 곡 배치
- 공개/비공개 설정
- 복제해서 내 서열표 만들기
```

### Phase 4. 투표와 의견

목표: 커뮤니티 체감 난이도를 수집한다.

```txt
- 곡별 난이도 투표
- 짧은 코멘트
- 투표 수 / 평균 / 표준편차 표시
- 의견 갈림 표시
```

### Phase 5. 커뮤니티 서열표 자동 생성

목표: 투표 데이터를 기반으로 커뮤니티 서열표를 생성한다.

```txt
- 평균값 기반 구간 분류
- 투표 수 부족 곡 제외 또는 참고 표시
- 관리자 승인/고정 기능
- 변경 이력 표시
```

---

## 12. UX에서 피해야 할 것

```txt
- 처음부터 토론 게시판처럼 크게 만들기
- 필터를 너무 많이 노출하기
- 투표 값을 곧바로 공식 서열로 확정하기
- 카드에 정보를 과도하게 넣기
- 개인 기록보다 커뮤니티 논쟁을 더 앞세우기
```

NosLog의 핵심은 논쟁이 아니라 개인 기록 확인이다. 서열표는 어디까지나 다음 목표를 찾기 위한 보조 도구로 둔다.

---

## 13. 최종 방향

서열표 기능의 최종 방향은 다음과 같다.

```txt
V-ARCHIVE처럼 직관적으로 보고,
maishift처럼 개인 성과와 연결하고,
solved.ac처럼 커뮤니티 기여를 받을 수 있게 한다.
```

단, 초기 구현은 단순해야 한다.

```txt
정적 서열표 + 내 기록 overlay + 달성률 요약
```

이후 사용자가 실제로 쓰는 흐름이 확인되면 개인 편집, 투표, 토론 기능을 단계적으로 추가한다.
