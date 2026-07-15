# NosLog

> **NOSTALGIA 플레이어를 위한 개인 기록·성과 대시보드**

NosLog는 NOSTALGIA 플레이 데이터를 수집하고, 곡별 기록·프로필·랭킹·빙고·서열표 기반 목표를 확인하기 위한 비공식 팬 프로젝트입니다.

> [!NOTE]
> 이 프로젝트는 KONAMI 및 공식 NOSTALGIA 서비스와 직접적인 관련이 없는 개인/비공식 프로젝트입니다.

---

## 프로젝트 방향

NosLog는 단순한 곡 정보 사이트보다, 사용자가 자신의 플레이 기록과 성과를 빠르게 확인하는 개인 대시보드를 목표로 합니다.

- 내 NOSTALGIA 플레이 기록을 한곳에서 확인
- 곡별 점수, 등급, 랭크, 최근 플레이, 베스트 기록 정리
- 프로필, 랭킹, 빙고, 서열표를 통한 진행 상황 확인
- 다음에 도전할 곡을 판단하기 쉬운 UX 제공
- 과한 분석보다 실제 플레이에 도움이 되는 정보 우선

```txt
복잡한 분석 서비스 X
성과 확인용 개인 대시보드 O
```

---

## 디자인 기준

기본 디자인 기준은 Figma 와이어프레임을 따릅니다.

- Figma: https://www.figma.com/design/MigCZljcnwEdJF2JhnjKcj/Nostory?node-id=3-3
- 기준 프레임: `3:3`
- 프레임 이름: `NOSTORY 와이어프레임 정리`
- 구현 명칭: `NosLog`
- 방향: 다크 UI, 모바일 우선, 390px 기준 레이아웃

Figma는 픽셀 단위의 최종 시안이 아니라 레이아웃과 정보 구조의 기준으로 사용합니다.

---

## 기술 스택

| 영역              | 기술                        |
| ----------------- | --------------------------- |
| Framework         | Next.js 16 App Router       |
| Language          | TypeScript 5                |
| UI                | React 19, Tailwind CSS 4    |
| Database          | Prisma 6, PostgreSQL        |
| Auth / Session    | Discord OAuth, iron-session |
| Form / Validation | react-hook-form, zod        |
| UI Primitives     | Radix UI                    |
| State             | Zustand                     |
| Chart             | Recharts                    |
| HTTP Client       | axios, fetch                |
| Tooling           | ESLint, Prettier, Husky     |

---

## 현재 구현된 기능

### 인증 / 세션

- Discord OAuth 기반 로그인 및 기존 계정 연결
- iron-session 기반 세션 관리
- 로그인 후 프로필 및 개인 기능 접근

### 데이터 수집

- p.eagate / BEMANI 사이트에서 플레이 데이터를 수집하는 JavaScript 스크립트
- 수집 데이터를 `/api/receivePlayerData`로 전송
- 서버에서 사용자 플레이 데이터를 DB에 저장
- `/bookmarklet` 페이지를 통한 동기화 UX 개선 예정

### 음악 정보

- 음악 목록 조회
- 곡 검색
- 곡 상세 페이지
- 난이도별 정보 표시
- 곡별 플레이 데이터 연결

### 프로필

- 사용자별 프로필 페이지
- 플레이 기록 기반 통계
- 최근 플레이 기록
- Basic / Recital 베스트 플레이
- 프로필 설정 페이지

### 랭킹 / 빙고 / 검정

- 사용자 기록 기반 랭킹 페이지
- 빙고 목록 및 상세 페이지
- 유저별 빙고 진행 데이터 구조
- 검정 급수, 과제곡, 합격 시뮬레이션
- 검정 합격 증빙 제출 및 승인 데이터 구조

### 관리자

- `admin` 역할 기반 서버 접근 제한
- 검정 목록 검색 및 상태 필터
- 검정 급수, 과제곡, 통과 조건 생성·수정·삭제
- 공개 기간과 합격 보상 설정

---

## 데이터 모델

Prisma schema 기준 주요 모델은 다음과 같습니다.

| Model               | 역할                           |
| ------------------- | ------------------------------ |
| `User`              | 사용자 프로필, 랭크, 점수 통계 |
| `Music`             | 곡 정보, 카테고리, 난이도      |
| `RecentPlay`        | 최근 플레이 기록               |
| `PlayData`          | 곡별 전체 플레이 데이터        |
| `BasicBestPlay`     | Basic 모드 베스트 플레이       |
| `RecitalBestPlay`   | Recital 모드 베스트 플레이     |
| `UserBestGrade`     | 사용자 최고 grade 기록         |
| `Bingo`             | 빙고판 공개 상태, 기간, 보상   |
| `BingoCell`         | 빙고 미션 종류와 달성 조건     |
| `BingoCellProgress` | 유저별 빙고 미션 달성 상태     |
| `Exam`              | 검정 모드별 급수와 응시 조건   |
| `ExamStage`         | 검정 과제곡과 단계별 통과 조건 |
| `ExamSubmission`    | 사용자의 합격 증빙과 심사 상태 |
| `ExamAchievement`   | 승인된 사용자 검정 급수        |

현재 운영 DB는 Neon PostgreSQL을 사용합니다. 기존 SQLite 마이그레이션은 `prisma/migrations-sqlite`에 보관합니다.

---

## 프로젝트 구조

```txt
noslog
├─ app
│  ├─ (auth)
│  │  ├─ discord
│  │  └─ login
│  ├─ (nevigation)
│  │  ├─ (home)
│  │  ├─ bingo
│  │  ├─ bookmarklet
│  │  ├─ exams
│  │  ├─ music
│  │  ├─ profile
│  │  └─ rankings
│  ├─ admin
│  │  └─ exams
│  ├─ api
│  │  ├─ receivePlayerData
│  │  └─ getPlayerData.js
│  ├─ fonts
│  ├─ globals.css
│  └─ layout.tsx
├─ components
│  ├─ admin
│  ├─ bingo
│  ├─ exams
│  ├─ button
│  ├─ input
│  ├─ layout
│  ├─ login
│  ├─ music
│  └─ profile
├─ lib
│  ├─ generated/prisma
│  ├─ services
│  ├─ db.ts
│  ├─ session.ts
│  └─ utils.ts
├─ prisma
├─ public
├─ proxy.ts
├─ next.config.mjs
├─ postcss.config.mjs
└─ tsconfig.json
```

> [!NOTE]
> `(nevigation)`은 route group 이름 오타입니다. 실제 URL에는 영향을 주지 않으므로, 화면 구현을 진행하면서 `(navigation)`으로 정리할 수 있습니다.

---

## 로컬 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.example`을 참고해 `.env` 파일을 생성합니다.

```bash
cp .env.example .env
```

주요 환경변수:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
COOKIE_PASSWORD="iron_session_password"

DISCORD_CLIENT_ID="discord_client_id"
DISCORD_CLIENT_SECRET="discord_client_secret"
DISCORD_REDIRECT_URI="http://localhost:3000/discord/complete"

CLOUDFLARE_API_KEY="cloudflare_api_key"
CLOUDFLARE_ACCOUNT_ID="cloudflare_account_id"
CLOUDFLARE_IMAGES_DELIVERY_HASH="cloudflare_images_delivery_hash"
```

> [!WARNING]
> `.env`는 커밋하지 않습니다. `COOKIE_PASSWORD`는 실제 환경에서 충분히 긴 안전한 문자열을 사용해야 합니다.

### 3. Prisma Client 생성

```bash
npx prisma generate
```

필요하면 로컬 DB 마이그레이션을 실행합니다.

```bash
npx prisma migrate dev
```

### 4. 개발 서버 실행

```bash
npm run dev
```

```txt
http://localhost:3000
```

---

## 주요 스크립트

| 명령어                 | 설명            |
| ---------------------- | --------------- |
| `npm run dev`          | 개발 서버 실행  |
| `npm run build`        | 프로덕션 빌드   |
| `npm run start`        | 빌드 결과 실행  |
| `npm run lint`         | ESLint 검사     |
| `npm run format`       | Prettier 포맷   |
| `npm run format:check` | Prettier 검사   |
| `npx tsc --noEmit`     | TypeScript 검사 |

---

## 현재 개선 과제

### P0. 안정성 / 보안

- `/api/receivePlayerData` 인증 및 요청 검증 강화
- 유저별 동기화 토큰 검토
- 플레이 데이터 저장 로직 transaction 처리
- Prisma Client 사용 방식 점검
- 기존 lint 오류 정리

### P1. 디자인 구현

- Figma 기준 공통 레이아웃 정리
- 공통 UI 컴포넌트 구성
- 홈 화면 와이어프레임 반영
- `/music`, `/rankings`, `/profile`, `/bingo` 순차 개선
- `/tiers`, `/exams` 신규 페이지 검토

### P2. UX 개선

- 북마클릿 기반 동기화 UX 개선
- 동기화 성공/실패 피드백
- 최근 동기화 시간 표시
- 미플레이 / 미달성 곡 필터
- 곡별 점수 히스토리
- 서열표 개인 달성률

### P3. 확장

- 카카오 레거시 식별자 제거
- 목표 설정 기능
- 라이벌 / 친구 비교
- 공유용 프로필 카드
- Chrome Extension 검토

---

## 개발 원칙

- 현재 코드와 실제 구현 상태를 우선한다.
- Figma는 레이아웃 기준으로 사용하되, 기존 기능을 깨지 않게 점진적으로 반영한다.
- 모바일 390px 화면을 우선 고려한다.
- 공통 UI와 도메인 구조는 구현하면서 필요한 만큼 정리한다.
- 큰 구조 변경은 기능 구현과 분리해 작게 커밋한다.

---

## Reference

| Reference                             | 참고할 점                                                      |
| ------------------------------------- | -------------------------------------------------------------- |
| maishift / maimai performance tracker | 프로필 카드, 곡 카드, 성과 요약, 기록 동기화 UX                |
| V-ARCHIVE DJMAX RESPECT V 서열표      | 서열 구간별 곡 카드 그리드, 필터 버튼, 모바일 친화적 레이아웃  |
| solved.ac                             | 커뮤니티 기반 난이도 기여, 투표 수/분산 기반 신뢰도, 검색 구조 |

- maishift: https://maimai.shiftpsh.com/
- V-ARCHIVE 4B 서열표: https://v-archive.net/grade/4
- solved.ac: https://solved.ac/

---

## License

현재 라이선스는 명시되어 있지 않습니다.
