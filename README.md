# NosLog

> **NOSTALGIA 플레이어를 위한 개인 기록·성과 대시보드**  
> 사용자의 플레이 데이터를 수집하고, 곡별 기록·프로필·랭킹·빙고·서열표 기반 목표를 한눈에 확인할 수 있도록 만드는 비공식 팬 프로젝트입니다.

> [!NOTE]
> `NosLog`는 현재 개발 중인 임시 프로젝트명입니다. 추후 서비스명은 변경될 수 있습니다.  
> 이 프로젝트는 KONAMI 및 공식 NOSTALGIA 서비스와 직접적인 관련이 없는 개인/비공식 프로젝트입니다.

---

## 프로젝트 목적

NosLog는 단순한 곡 정보 사이트가 아니라, **유저가 게임을 플레이하면서 자신의 성과와 기록을 빠르게 확인하기 위한 서비스**를 목표로 합니다.

핵심 방향은 다음과 같습니다.

- 내 NOSTALGIA 플레이 기록을 한곳에서 확인한다.
- 곡별 점수, 등급, 랭크, 최근 플레이, 베스트 기록을 정리한다.
- 프로필, 랭킹, 빙고, 서열표 등을 통해 현재 실력과 진행 상황을 파악한다.
- 다음에 어떤 곡을 플레이하면 좋을지 쉽게 판단할 수 있게 한다.
- 플레이 스트릭과 활동 캘린더를 통해 꾸준한 플레이 기록도 확인할 수 있게 한다.
- 기능은 충분히 제공하되, UX는 지나치게 복잡하지 않게 유지한다.

즉, NosLog의 방향은 다음과 같습니다.

```txt
복잡한 분석 서비스 X
성과 확인용 개인 대시보드 O
```

---

## 주요 사용자 흐름

현재 프로젝트의 기본 사용 흐름은 다음과 같습니다.

```txt
1. NosLog 접속
2. Discord 소셜 로그인
3. 프로필 페이지 이동
4. p.eagate / BEMANI 공식 사이트에 로그인
5. 데이터 수집 스크립트 실행
6. NosLog 서버에 플레이 데이터 저장
7. 프로필, 음악 검색, 랭킹, 빙고 등에서 기록 확인
```

향후에는 긴 JavaScript 코드를 직접 복사해 콘솔에 붙여넣는 방식 대신, **북마클릿 기반 동기화 UX**를 우선 도입할 예정입니다.

```txt
NosLog 로그인
→ 북마클릿 등록
→ BEMANI 사이트 로그인
→ 북마클릿 클릭
→ 데이터 자동 수집
→ NosLog 프로필 업데이트
```

---

## 기술 스택

| 영역              | 기술                        |
| ----------------- | --------------------------- |
| Framework         | Next.js 14 App Router       |
| Language          | TypeScript                  |
| UI                | React 18, Tailwind CSS      |
| Database          | Prisma, SQLite              |
| Auth / Session    | Discord OAuth, iron-session |
| Form / Validation | react-hook-form, zod        |
| Chart             | Recharts                    |
| HTTP Client       | fetch, axios                |

---

## 현재 구현된 주요 기능

### 인증 / 세션

> 현재 코드에는 Kakao OAuth 기반 구현이 남아 있으나, 향후 Discord OAuth로 전환하고 Kakao 로그인은 제거할 예정입니다.

- Kakao OAuth 기반 로그인 구현 존재
- Discord OAuth로 전환 예정
- iron-session 기반 사용자 세션 관리
- 로그인 후 프로필 및 개인 기능 접근
- 향후 OAuth provider 확장을 고려한 `User` / `Account` 분리 구조로 전환 예정

### 데이터 수집

- p.eagate / BEMANI 공식 사이트에서 플레이 데이터를 가져오는 JavaScript 수집 스크립트
- 수집된 데이터를 `/api/receivePlayerData`로 전송
- 서버에서 유저 플레이 데이터를 DB에 저장

현재 방식은 개발자도구 콘솔에 스크립트를 붙여넣어 실행하는 형태입니다.  
향후에는 사용자 편의성을 위해 북마클릿 방식으로 개선할 예정입니다.

### 음악 정보

- 음악 목록 조회
- 곡 검색
- 곡 상세 페이지
- 난이도별 정보 표시
- 곡별 플레이 데이터와 연결 가능한 구조

### 프로필

- 사용자별 프로필 페이지
- 플레이 기록 기반 통계 표시
- 최근 플레이 기록 표시
- Basic / Recital 베스트 플레이 표시
- 사용자 설정 페이지 구조

### 랭킹

- 사용자 기록 기반 랭킹 페이지
- Basic / Recital 관련 랭킹 데이터 구조

### 빙고

- 빙고 페이지
- 사용자별 빙고 진행 데이터 구조
- 곡, 조건, 달성 여부를 연결할 수 있는 DB 모델

---

## 데이터 모델 개요

Prisma schema 기준으로 주요 모델은 다음과 같습니다.

| Model               | 역할                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------- |
| `User`              | 사용자 기본 프로필, 국가, 랭크, 점수 통계                                                 |
| `Account`           | OAuth provider별 로그인 계정 정보. Discord 우선, 향후 provider 확장 가능 구조로 전환 예정 |
| `Music`             | 곡 정보, 카테고리, 난이도, 배경/자켓 관련 데이터                                          |
| `RecentPlay`        | 최근 플레이 기록                                                                          |
| `PlayData`          | 곡별 전체 플레이 데이터                                                                   |
| `BasicBestPlay`     | Basic 모드 베스트 플레이                                                                  |
| `RecitalBestPlay`   | Recital 모드 베스트 플레이                                                                |
| `UserBestGrade`     | 사용자 최고 grade 기록                                                                    |
| `Bingo`             | 빙고 판 정보                                                                              |
| `BingoCell`         | 빙고 칸 조건                                                                              |
| `userBingoCellData` | 유저별 빙고 달성 여부                                                                     |

현재 DB는 SQLite 기반이며, 추후 PostgreSQL 전환과 배열/정규화 구조 개선을 고려하고 있습니다.

### OAuth 계정 구조 개선 방향

초기 구현에서는 로그인 provider에 직접 종속된 사용자 구조를 사용했지만, 향후에는 `User`와 `Account`를 분리하는 구조를 목표로 합니다.

목표는 다음과 같습니다.

- 서비스 내부 사용자는 `User`로 관리한다.
- Discord, Kakao, Google 등 외부 로그인 provider 정보는 `Account`로 분리한다.
- 현재는 Kakao를 제거하고 Discord를 기본 로그인으로 사용한다.
- 내부 세션과 서비스 로직은 OAuth provider가 아니라 `userId` 기준으로 동작한다.
- 향후 다른 provider를 추가하더라도 기존 User 데이터와 플레이 기록이 흔들리지 않게 한다.

예상 schema 방향은 다음과 같습니다.

```prisma
model User {
  id        Int       @id @default(autoincrement())
  name      String?
  avatar    String?
  country   String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  accounts  Account[]

  // play data relations...
}

model Account {
  id                Int      @id @default(autoincrement())
  provider          String
  providerAccountId String
  userId            Int
  user              User     @relation(fields: [userId], references: [id])

  accessToken       String?
  refreshToken      String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([provider, providerAccountId])
}
```

세션에는 OAuth provider 정보를 직접 많이 저장하지 않고, 내부 `userId`만 저장하는 방향을 우선합니다.

```ts
session.user = {
    id: user.id,
};
```

이 구조를 사용하면 다음과 같은 장점이 있습니다.

- Discord 로그인으로 전환해도 플레이 데이터 구조가 안정적으로 유지됩니다.
- 나중에 다른 로그인 방식을 추가해도 User 모델을 크게 바꾸지 않아도 됩니다.
- 유저 프로필, 플레이 기록, 랭킹, 빙고 데이터가 OAuth provider에 종속되지 않습니다.
- 기존 계정 연결 기능을 추가하기 쉬워집니다.

---

## 프로젝트 구조

```txt
noslog
├─ app
│  ├─ (auth)
│  │  ├─ discord        # 예정
│  │  └─ login
│  ├─ (nevigation)
│  │  ├─ (home)
│  │  ├─ bingo
│  │  ├─ bookmarklet
│  │  ├─ music
│  │  ├─ profile
│  │  └─ rankings
│  ├─ api
│  │  ├─ receivePlayerData
│  │  └─ getPlayerData.js
│  ├─ globals.css
│  └─ layout.tsx
├─ components
│  ├─ bingo
│  ├─ button
│  ├─ input
│  ├─ layout
│  ├─ login
│  ├─ music
│  └─ profile
├─ lib
├─ prisma
├─ public
├─ middleware.ts
├─ next.config.mjs
├─ tailwind.config.ts
└─ tsconfig.json
```

> [!NOTE]
> 현재 route group 이름 중 `(nevigation)`은 오타로 보이며, 추후 `(navigation)`으로 정리할 수 있습니다.  
> route group이므로 실제 URL에는 영향을 주지 않습니다.

---

## 로컬 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.example`을 참고해 `.env` 파일을 생성합니다.

```bash
cp .env.example .env
```

예상 환경변수 예시는 다음과 같습니다.

```env
DATABASE_URL="file:./dev.db"
COOKIE_PASSWORD="your-secure-cookie-password"
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
DISCORD_REDIRECT_URI="http://localhost:3000/discord/complete"
```

> [!WARNING]
> `COOKIE_PASSWORD`는 충분히 긴 안전한 문자열을 사용해야 합니다.  
> 실제 배포 환경에서는 `.env` 파일을 절대 커밋하지 않습니다.

### 3. Prisma 설정

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 다음 주소로 접속합니다.

```txt
http://localhost:3000
```

---

## 현재 개선이 필요한 부분

### 1. 데이터 수집 API 보안 강화

현재 `/api/receivePlayerData`는 수집된 데이터를 받아 DB에 저장하는 핵심 API입니다.  
이 API는 향후 다음 사항을 보강해야 합니다.

- 유저별 `syncToken` 검증
- 요청 body validation
- 잘못된 payload 차단
- 유저와 수집 데이터의 매칭 검증
- token 재발급 / 폐기 기능
- 저장 실패 시 에러 처리 개선

### 2. 북마클릿 기반 동기화 UX

현재 긴 JavaScript 코드를 복사해 실행하는 방식은 사용자 경험이 좋지 않습니다.  
우선적으로 다음 구조를 목표로 합니다.

```txt
/bookmarklet 페이지
→ 유저별 동기화 북마클릿 제공
→ BEMANI 페이지에서 북마클릿 클릭
→ 진행 상태 overlay 표시
→ NosLog 서버로 데이터 전송
→ 프로필 업데이트
```

### 3. Discord OAuth 전환

현재 프로젝트는 Kakao OAuth 기반으로 시작했지만, 리듬게임/서브컬처 유저층과 커뮤니티 사용성을 고려해 Discord OAuth 중심으로 전환할 예정입니다.

전환 목표는 다음과 같습니다.

- Kakao OAuth 제거
- Discord OAuth 로그인 구현
- OAuth `state` 값 생성 및 검증
- 로그인 실패 / 취소 / 토큰 요청 실패 처리
- Discord display name / avatar를 프로필에 활용
- 내부 서비스 로직은 provider가 아니라 `userId` 기준으로 동작하도록 정리

### 4. Prisma Client singleton 적용

Next.js 개발 환경에서 PrismaClient가 중복 생성되지 않도록 singleton 패턴 적용을 고려합니다.

### 5. DB 업데이트 transaction 처리

플레이 데이터 업데이트는 여러 단계로 이루어지므로, 중간 실패 시 데이터가 일부만 저장되지 않도록 transaction 처리를 고려합니다.

### 6. DB schema 정리

현재 schema에는 추후 개선을 위한 TODO가 포함되어 있습니다.

- SQLite에서 PostgreSQL로 전환 검토
- 문자열로 저장 중인 난이도 배열 구조 개선
- `background` → `jacket` 등 필드명 정리
- 점수 통계 필드 배열/정규화 구조 검토

---

## Future Work

아래 기능들은 향후 NosLog를 단순 기록 조회 사이트에서 **성과 확인용 개인 대시보드**로 발전시키기 위한 아이디어입니다.

### 0. Discord OAuth 전환 및 계정 구조 정리

Kakao OAuth는 제거하고 Discord OAuth를 기본 로그인 방식으로 전환합니다.

전환 이유는 다음과 같습니다.

- 리듬게임/서브컬처 유저층은 Discord 기반 커뮤니티와 잘 맞습니다.
- Discord display name과 avatar를 프로필에 자연스럽게 활용할 수 있습니다.
- 향후 공식 Discord 서버, 피드백 채널, 성과 공유 기능과 연결하기 좋습니다.
- 카카오 로그인보다 게임 커뮤니티형 서비스의 톤에 더 적합합니다.

구현 방향은 다음과 같습니다.

```txt
Kakao OAuth 제거
→ Discord OAuth 추가
→ User / Account 분리
→ session은 내부 userId 기준으로 관리
→ 추후 provider 확장 가능 구조 유지
```

### 1. 최근 성과 요약

프로필 상단에서 최근 동기화 이후 변화한 기록을 요약합니다.

```txt
최근 성과
- 신규 갱신곡 12개
- 최고 점수 갱신 5개
- 새 S 달성 2개
- 새 Full Combo 1개
- 평균 점수 +0.42%
```

목표는 사용자가 사이트에 들어오자마자 “뭐가 올랐는지” 바로 확인하게 하는 것입니다.

### 2. 플레이 스트릭 / 활동 캘린더

마이페이지에서 사용자가 얼마나 꾸준히 게임을 플레이했는지 확인할 수 있는 스트릭 기능을 제공합니다.

기본 지표는 다음과 같습니다.

```txt
현재 연속 플레이: 7일
최대 연속 플레이: 32일
이번 달 플레이한 날: 18일
올해 플레이한 날: 126일
```

기본 기준은 단순하게 유지합니다.

```txt
하루 1곡 이상 플레이 = 플레이한 날
```

캘린더 히트맵은 하루 플레이 수에 따라 농도를 다르게 표시합니다.

```txt
0곡: 회색
1~4곡: 연한 색
5~9곡: 중간 색
10~19곡: 진한 색
20곡 이상: 매우 진한 색
```

또한 “게임한 날”과 “기록을 갱신한 날”은 구분해서 표현합니다.

- 색상 농도: 해당 날짜의 플레이 수
- 별 표시 또는 테두리 강조: 최고 점수 갱신, 새 등급 달성, Full Combo 달성 등 의미 있는 성과가 있었던 날

예상 UI 방향은 다음과 같습니다.

```txt
플레이 캘린더
- 각 칸은 날짜를 의미
- 색상 농도는 플레이 수를 의미
- 별표 또는 강조 테두리는 기록 갱신을 의미
- hover 시 해당 날짜의 플레이 수, 갱신 수, 대표 갱신곡 표시
```

이 기능은 과한 분석 없이도 사용자가 자신의 활동 기록을 직관적으로 볼 수 있게 하며, 서비스 재방문 동기를 만드는 데 도움이 됩니다.

단, 초기 구현에서는 스트릭 랭킹, 출석 보상, 과한 업적 시스템은 넣지 않습니다.
목표는 출석 체크가 아니라 **플레이 기록을 시각적으로 정리하는 것**입니다.

### 3. 다음 목표 추천

사용자의 현재 기록을 기반으로 다음에 도전하기 좋은 곡을 추천합니다.

예시 기준:

- 다음 등급까지 점수 차이가 작은 곡
- S까지 가까운 곡
- Full Combo까지 가까운 곡
- 같은 레벨 평균보다 점수가 낮은 곡
- 최근에 플레이하지 않은 곡
- 미플레이 곡

처음에는 AI 없이 규칙 기반 추천으로 구현할 수 있습니다.

### 4. 목표 설정 기능

사용자가 곡별 또는 범위별 목표를 설정할 수 있게 합니다.

예시:

```txt
- 특정 곡 S 달성
- 특정 곡 99.5% 이상
- 특정 곡 Full Combo
- Lv 12 전체 S
- Basic 10+ 전체 플레이
```

프로필에서는 목표 진행률을 표시합니다.

```txt
Lv 12 전체 S
42 / 68곡 완료
```

### 5. 미플레이 / 미달성 곡 필터

음악 검색 페이지에서 유저가 실제로 자주 볼 만한 필터를 제공합니다.

- 미플레이 곡
- S 미달성 곡
- FC 미달성 곡
- 최근 갱신 곡
- 목표 설정 곡
- 다음 등급까지 가까운 곡

### 6. 곡별 점수 히스토리

곡 상세 페이지에서 사용자의 점수 변화 기록을 보여줍니다.

```txt
2026.07.01  97.82%
2026.07.03  98.21%
2026.07.05  98.76%
```

초기에는 차트보다 최근 기록 5개, 최고 기록, 최근 갱신일 정도만 제공해도 충분합니다.

### 7. 서열표 + 개인 달성률

서열표 기능은 아직 구체 구현이 시작되지 않은 기획 단계입니다.  
단순한 난이도표가 아니라, 사용자의 플레이 기록과 연결된 **개인 목표 확인용 서열표**로 설계합니다.

초기 구현 방향은 다음과 같습니다.

```txt
정적/추천 서열표
→ 구간별 곡 카드 UI
→ 내 기록 overlay
→ 개인 달성률 표시
→ 미달성/목표곡 필터
```

서열표 상단에는 개인 진행률을 표시합니다.

```txt
Lv 12 서열표 진행률
S 이상: 34 / 68
FC: 12 / 68
미플레이: 5
목표곡: 8
```

구간별로도 달성률을 보여줄 수 있습니다.

```txt
12.9
S 이상 2/5 · FC 0/5 · 미플레이 1

12.8
S 이상 7/12 · FC 3/12 · 미플레이 0
```

UI/UX 참고 방향은 다음과 같습니다.

- maishift처럼 프로필·성과·곡 카드 정보를 시각적으로 밀도 있게 보여줍니다.
- V-ARCHIVE처럼 서열 구간, 큰 필터 버튼, 곡 카드 그리드를 직관적으로 제공합니다.
- solved.ac처럼 커뮤니티 난이도 투표와 의견을 받을 수 있는 구조를 장기적으로 고려합니다.

장기적으로는 세 가지 유형의 서열표를 구분합니다.

| 유형            | 설명                                        |
| --------------- | ------------------------------------------- |
| 추천 서열표     | 운영자 또는 기본 데이터로 제공하는 서열표   |
| 커뮤니티 서열표 | 유저 투표 데이터를 기반으로 생성되는 서열표 |
| 개인 서열표     | 유저가 직접 만들고 수정하는 서열표          |

투표/토론 기능은 처음부터 크게 만들지 않고, 곡별 체감 난이도 투표와 짧은 의견 메모부터 시작합니다.

```txt
곡 A
내 체감 난이도: 12.8
의견: S까지는 무난하지만 FC 난이도가 높음
```

투표 데이터는 평균만 보여주지 않고, 투표 수와 의견 갈림 정도도 함께 표시합니다.

```txt
체감 12.8 · 투표 21 · 의견 갈림 낮음
체감 12.7 · 투표 6 · 참고용
```

서열표 기능의 별도 상세 기획은 `NOSLOG_TIER_LIST_FEATURE_SPEC.md`에서 관리합니다.

### 8. 라이벌 / 친구 비교

친구나 라이벌과 기록을 비교합니다.  
다만 UX가 복잡해지지 않도록 전체 비교표보다는 의미 있는 차이만 보여주는 방향이 좋습니다.

예시:

- 내가 앞선 곡 TOP 10
- 상대가 앞선 곡 TOP 10
- 점수 차이가 작은 곡 TOP 10
- 둘 다 S를 달성하지 못한 곡

### 9. 공유용 프로필 카드

유저가 자신의 성과를 이미지로 저장하거나 공유할 수 있게 합니다.

포함할 수 있는 정보:

- 닉네임
- 총 플레이 수
- 랭크
- 평균 점수
- S / FC / Pianistic 개수
- 대표 성과곡 3개

### 10. 빙고 개선

빙고 기능을 단순 재미 요소가 아니라 목표 체크리스트처럼 활용합니다.

- 내 빙고 진행률
- 달성한 칸 강조
- 거의 달성 가능한 칸 추천
- 빙고 공유 이미지 생성
- 커스텀 빙고 생성

### 11. 내 주변 랭킹

전체 랭킹만 보여주는 대신, 사용자의 주변 순위를 함께 보여줍니다.

```txt
142위 userA
143위 나
144위 userB
```

전체 경쟁보다 “내 위치”를 확인하는 데 초점을 둡니다.

### 12. Chrome Extension

북마클릿 방식이 안정화되고 실제 사용자가 늘어나면 Chrome Extension 전환을 검토합니다.

초기 로드맵:

```txt
긴 JS 복사 방식
→ 한 줄 loader
→ 북마클릿
→ 동기화 overlay 개선
→ Chrome Extension
```

---

## UX 원칙

NosLog는 많은 기능을 제공하더라도, 기본 화면은 단순해야 합니다.

핵심 원칙은 다음과 같습니다.

```txt
기본 화면은 단순하게,
자세한 분석은 접어두고,
유저가 다음에 할 곡을 바로 찾게 만들기.
```

이를 위해 다음 방향을 유지합니다.

- 프로필 상단에는 핵심 요약만 배치한다.
- 스트릭과 활동 캘린더는 꾸준함을 보여주는 보조 지표로 사용하되, 출석 체크처럼 과도하게 강조하지 않는다.
- 상세 통계는 접을 수 있는 영역이나 별도 탭으로 분리한다.
- 필터는 강력하게 제공하되, 기본값은 단순하게 유지한다.
- 랭킹은 경쟁보다 위치 확인에 초점을 둔다.
- AI나 과한 분석보다 실제 플레이에 도움 되는 규칙 기반 추천을 우선한다.

---

## 구현 우선순위

### P0. 안정성 / 보안

- `/api/receivePlayerData` 인증 및 검증 강화
- 유저별 syncToken 도입
- 요청 body validation
- Discord OAuth state 검증
- Kakao OAuth 제거
- Prisma singleton 적용
- DB transaction 처리

### P1. 핵심 UX 개선

- 북마클릿 동기화 페이지 개선
- 실행 중 overlay 표시
- 동기화 성공/실패 로그 저장
- 최근 동기화 시간 표시
- 프로필 대시보드 상단 요약 개선

### P2. 기록 확인 기능 강화

- 최근 성과 요약
- 플레이 스트릭 / 활동 캘린더
- 미플레이 / 미달성 필터
- 다음 등급까지 가까운 곡
- 곡별 점수 히스토리
- 서열표 개인 달성률
- 서열표 기본 뷰 / 곡 카드 UI

### P3. 사용자 재방문 요소

- 목표 설정
- 개인 서열표 생성/편집
- 곡별 체감 난이도 투표 / 짧은 의견 메모
- 스트릭 캘린더 상세 tooltip / 기록 갱신 표시 고도화
- 빙고 개선
- 내 주변 랭킹
- 라이벌 비교
- 공유용 프로필 카드

### P4. 확장

- PostgreSQL 전환 검토
- Chrome Extension
- 커뮤니티 투표 기반 서열표 자동 생성
- 고급 통계 / 추가 시각화
- 디자인 시스템 정리

---

## 개발 메모

현재 프로젝트는 개인 개발 단계이므로, 기능을 빠르게 붙이는 것보다 다음 사항을 우선합니다.

- Discord OAuth 전환과 `User` / `Account` 분리 구조를 통해 데이터 구조를 오래 유지할 수 있게 정리한다.
- 보안과 검증을 먼저 보강한다.
- 사용자가 실제로 자주 볼 화면을 우선 개선한다.
- 복잡한 기능보다 자주 쓰는 기능을 먼저 완성한다.
- README, 이슈, 로드맵을 통해 개발 방향을 명확히 유지한다.

---

## Reference / Inspiration

NosLog는 기존 리듬게임 기록 서비스와 커뮤니티 기반 난이도 시스템의 장점을 참고하되, NOSTALGIA 유저의 개인 기록 확인에 맞게 단순화합니다.

| Reference                             | 참고할 점                                                           |
| ------------------------------------- | ------------------------------------------------------------------- |
| maishift / maimai performance tracker | 프로필 카드, 곡 카드, 성과 요약, 북마클릿 기반 기록 동기화          |
| V-ARCHIVE DJMAX RESPECT V 서열표      | 서열 구간별 곡 카드 그리드, 큰 필터 버튼, 모바일 친화적 레이아웃    |
| solved.ac                             | 커뮤니티 기반 난이도 기여, 투표 수/분산 기반 신뢰도, 고급 검색 구조 |

관련 링크:

- maishift: https://maimai.shiftpsh.com/
- maishift guide: https://maimai.shiftpsh.com/en/guide
- V-ARCHIVE 4B 서열표: https://v-archive.net/grade/4
- solved.ac: https://solved.ac/
- solved.ac problem level guide: https://help.solved.ac/en/problem/level
- solved.ac contribution guideline: https://solved.ac/guideline

> 위 레퍼런스들은 UI/UX와 기능 구조의 참고용이며, NosLog는 KONAMI 및 공식 NOSTALGIA 서비스와 무관한 개인/비공식 팬 프로젝트입니다.

---

## License

현재 라이선스는 명시되어 있지 않습니다.  
공개 배포 전 프로젝트 성격에 맞는 라이선스를 선택하는 것을 권장합니다.
