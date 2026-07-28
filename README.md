# NosLog

NOSTALGIA 플레이 기록을 모아 보고, 악곡별 성과·서열·랭킹과 채보를 확인하는 비공식 팬 프로젝트입니다.

현재 버전: **v1.5.0**

> NosLog는 KONAMI 및 공식 NOSTALGIA 서비스와 관련이 없습니다.

## 주요 기능

- **홈**: 공지사항과 주요 메뉴를 간결하게 제공
- **악곡**: 검색, 난이도 필터, 개인 기록 기반 정렬과 악곡별 상세 기록
- **기록 분석**: 점수·콤보·판정·FAST/SLOW·음표별 성공률과 최근 기록 추이
- **랭킹**: Basic·Recital 공식 Grd 및 Basic 서열 레이팅 순위
- **서열표**: S·Full Combo·Pianist 목표별 서열과 상위 70곡 기준 가중치 안내
- **빙고**: 수동 판정 방식의 미션과 달성 현황
- **검정**: 과제곡, 합격 조건, 응시 정보와 선택형 플레이 조언
- **프로필**: 베스트 성과, 최근 플레이, 랭크 분포와 판정 상세
- **데이터 연동**: 북마클릿을 이용한 NOSTALGIA 기록 동기화와 결과 확인
- **개인정보 관리**: 개인정보처리방침, 회원 탈퇴, 비공개 증빙 이미지와 보관 기간 관리
- **관리자**: 운영 현황, 사용자, 악곡 변경 후보, 서열표, 빙고, 검정과 동기화 데이터 관리

### 채보 편집기와 뷰어

- 관리자용 28칸 채보 편집기
- 일반·테누토·글리산도·트릴 4종 노트
- BPM, 박자표, 오프셋과 다중 타이밍 포인트
- 노트 위치·폭·연주 안내 손·경로 제어점 편집
- 실행 취소·다시 실행, 수정 이력과 공개 스냅샷
- 음원을 포함하지 않는 `.noslog-chart.json` 가져오기·내보내기
- 전체 악보형 뷰어와 PixiJS 기반 낙하형 재생 뷰어
- 서버에 전송하지 않는 브라우저 로컬 음원 불러오기

편집 화면은 데스크톱과 가로형 태블릿을 기준으로 하며, 공개 뷰어는 모바일에서도 이용할 수 있습니다.

## 기술 스택

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4, Radix UI
- PixiJS 8
- Prisma 6, Neon PostgreSQL
- Discord OAuth, iron-session
- Vercel, Vercel Blob, Vercel Cron
- Vitest, Playwright, ESLint, Prettier, Husky

## 로컬 개발

### 준비 사항

- Node.js 24 권장
- npm
- PostgreSQL 또는 Neon 데이터베이스

### 1. 저장소와 의존성 준비

```bash
git clone https://github.com/Anchovia/noslog.git
cd noslog
npm install
```

`npm install` 과정에서 Prisma Client가 자동으로 생성됩니다.

### 2. 환경변수 설정

`.env.example`을 복사해 `.env`를 만들고 개발 환경의 실제 값을 입력합니다.

```powershell
Copy-Item .env.example .env
```

주요 환경변수는 다음과 같습니다.

| 구분               | 환경변수                                                             |
| ------------------ | -------------------------------------------------------------------- |
| 데이터베이스       | `DATABASE_URL`                                                       |
| 로그인 세션        | `COOKIE_PASSWORD`                                                    |
| 북마클릿 서명      | `BOOKMARKLET_SECRET`                                                 |
| 서비스 주소        | `APP_URL`                                                            |
| Discord OAuth      | `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI` |
| Kakao Maps         | `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`                                      |
| 공개 이미지 Blob   | `BLOB_READ_WRITE_TOKEN`, `BLOB_STORE_ID`, `BLOB_WEBHOOK_PUBLIC_KEY`  |
| 비공개 증빙 Blob   | `PRIVATE_BLOB_READ_WRITE_TOKEN`                                      |
| 개인정보 정리 Cron | `CRON_SECRET`                                                        |

`COOKIE_PASSWORD`, `BOOKMARKLET_SECRET`, `CRON_SECRET`에는 충분히 긴 서로 다른 임의 문자열을 사용합니다. 실제 환경변수와 토큰은 Git에 커밋하지 않습니다.

선택 환경변수:

- `MAINTENANCE_MODE=true`: 일반 페이지와 API에 점검 안내 표시
- `GOOGLE_SITE_VERIFICATION`: Google Search Console 인증값

### 3. 데이터베이스 적용

```bash
npm run db:migrate:deploy
```

스키마를 변경한 뒤 Prisma Client만 다시 생성하려면 다음 명령을 사용합니다.

```bash
npx prisma generate
```

팀원이 같은 Neon 개발 DB를 사용한다면 데이터는 별도로 복사할 필요가 없습니다. 각 컴퓨터의 `DATABASE_URL`이 같은 개발 DB를 가리키도록 설정하면 됩니다.

> `npm run db:seed:e2e`는 로컬 E2E 전용 PostgreSQL에서만 실행해야 합니다. 공유 Neon 개발 DB나 Production DB에는 실행하지 마세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

기본 주소는 `http://localhost:3000`입니다.

## 검증

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Playwright E2E는 로컬 테스트 DB에 마이그레이션과 E2E 시드를 적용하고 개발 서버를 실행한 상태에서 사용할 수 있습니다.

```bash
npm run test:e2e
```

GitHub Actions에서는 다음 항목을 자동으로 확인합니다.

1. 의존성 설치
2. ESLint
3. Vitest 단위 테스트
4. TypeScript
5. 프로덕션 빌드
6. PostgreSQL 16에 전체 마이그레이션 적용
7. E2E 시드 및 Playwright 모바일 테스트

## 배포

Vercel Production 환경에는 `.env.example`에 명시된 서비스 환경변수와 다음 구성이 필요합니다.

- 공개 아바타용 Blob Store
- 검정·피드백 증빙용 비공개 Blob Store
- `CRON_SECRET`
- Neon Production `DATABASE_URL`

`vercel.json`의 빌드 명령은 배포 시 `prisma migrate deploy`를 먼저 실행한 뒤 Next.js 프로덕션 빌드를 실행합니다.

개인정보 보관 기간 정리 Cron은 매일 `18:00 UTC`에 실행됩니다. 한국 시간 기준 다음 날 오전 3시입니다.

DB 마이그레이션이 포함된 배포는 Production DB 백업을 확인한 뒤 진행합니다.

## 개인정보 처리 원칙

- 아바타는 공개 Blob에 저장합니다.
- 검정 증빙과 피드백 이미지는 비공개 Blob에 저장하고 권한이 확인된 API를 통해서만 제공합니다.
- 승인된 검정은 심사 완료 6개월 후 증빙 이미지와 심사 메모를 정리하고 합격 이력은 유지합니다.
- 반려된 검정과 처리 완료된 피드백 자료는 6개월 후 정리합니다.
- 회원 탈퇴 시 계정과 연결된 기록 및 업로드 자료를 영구 삭제합니다.
- 채보 편집용 로컬 음원은 브라우저에서만 사용하며 서버로 전송하거나 저장하지 않습니다.

자세한 내용은 서비스의 `/privacy` 페이지에서 확인할 수 있습니다.

## 버전 관리

NosLog는 `vMAJOR.MINOR.PATCH` 형식의 Semantic Versioning을 사용합니다.

| 구분    | 변경 기준                                | 예시                |
| ------- | ---------------------------------------- | ------------------- |
| `PATCH` | 버그 수정, UI 개선, 데이터 정정          | `v1.0.1` → `v1.0.2` |
| `MINOR` | 기존 기능과 호환되는 신규 기능 추가      | `v1.4.0` → `v1.5.0` |
| `MAJOR` | 호환되지 않는 구조·인증·데이터 규격 변경 | `v1.5.0` → `v2.0.0` |

### 배포 절차

1. 기능 개발과 검증은 `dev` 브랜치에서 진행합니다.
2. 배포할 변경에 맞춰 `package.json`과 `package-lock.json`의 버전을 올립니다.
3. 타입 검사, 린트, 테스트, 빌드와 E2E를 통과시킵니다.
4. `dev`에서 `main`으로 `release: NosLog v1.5.0` 형식의 PR을 생성합니다.
5. PR 본문에 주요 변경, DB 마이그레이션과 환경변수 변경 여부를 기록합니다.
6. `Create a merge commit`으로 병합하고 Production 배포를 확인합니다.
7. 병합된 `main` 커밋에 같은 버전의 Git 태그와 GitHub Release를 생성합니다.
