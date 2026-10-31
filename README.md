# NosLog

[![CI](https://github.com/Anchovia/noslog/actions/workflows/ci.yml/badge.svg)](https://github.com/Anchovia/noslog/actions/workflows/ci.yml)
[![Latest release](https://img.shields.io/github/v/release/Anchovia/noslog?label=release)](https://github.com/Anchovia/noslog/releases)

> NOSTALGIA 플레이 기록을 모아 악곡별 성과, 서열, 랭킹과 채보를 확인하는 비공식 팬 프로젝트입니다.

[서비스 바로가기](https://noslog.app/ko) · [이슈 제보](https://github.com/Anchovia/noslog/issues) · [최신 Release](https://github.com/Anchovia/noslog/releases/latest)

NosLog는 NOSTALGIA 플레이 데이터를 한곳에서 확인하고 기록을 돌아볼 수 있도록 만든 웹 서비스입니다. 한국어·일본어·영어 화면을 제공하며, 현재 서비스 버전은 **v2.17.2**입니다.

> NosLog는 KONAMI 및 공식 NOSTALGIA 서비스와 관련이 없습니다.

## 주요 기능

### 플레이 기록과 분석

- 북마클릿으로 NOSTALGIA 플레이 기록 동기화(전체 · 최근 플레이)
- 악곡 검색, 카테고리 · 난이도별 레벨 · 내 기록(FC 등) · MISS 수 필터, 개인 기록 기반 정렬
- 점수, 콤보, 판정, FAST/SLOW, 음표별 성공률과 기록 추이
- Basic · Recital 공식 Grd와 Basic 서열 레이팅 랭킹
- S · Full Combo · Pianist 목표별 서열표
- 프로필 개요 · 기록 · 통계(성장 추이 · 레벨별 달성 · 판정 · 랭크 분포) · 업적 · 활동(1년 달력 · 최근 플레이) 탭, 고정 기록, 공유용 프로필 카드 이미지

### 커뮤니티와 기여

- 채보 평가(계단 · 연타 · 폴리리듬 · 즈레 · 변박)와 의견 · 답글 · 좋아요, 의견 자동 번역(한 · 일 · 영)
- 체감 난이도 목표 투표
- 유저 기여 — 채보 초안 작성 · 곡 정보 수정 제안 · 채보 의견, 운영자 검토 뒤 반영, 기여 점수와 레벨
- 업적(동 · 은 · 금 · 플래티넘 · 다이아)과 프로필 대표 업적
- 공지사항, 커뮤니티 이벤트, 투표
- 빙고 진행 체크, 검정 정보와 합격 인증 제출
- 지역별 오락실 목록 · 지도, 기체 상태 · 가동 확인 · 오락실 정보 제보
- 악곡 번역 제목, NOSTALGIA 공식 소식 아카이브
- 화면에서 바로 보내는 피드백 · 오류 제보와 답변 확인

### 채보 도구

- 28칸 채보 편집기 — 관리자 · 기여자 · 검토 모드
- 일반 · 테누토 · 글리산도 · 트릴 노트와 BPM · 박자표 · 오프셋 편집
- `.noslog-chart.json` 채보 가져오기 · 내보내기, 버전 기록
- 전체 악보 뷰어와 PixiJS 기반 낙하형 뷰어
- 메트로놈, 볼륨 조절, 브라우저에서만 사용하는 로컬 음원

채보 편집 화면은 데스크톱과 가로형 태블릿을 기준으로 하며, 공개 뷰어는 모바일에서도 사용할 수 있습니다. 로컬 음원은 서버로 전송하거나 저장하지 않습니다.

## 기술 스택

| 영역   | 사용                                                                            |
| ------ | ------------------------------------------------------------------------------- |
| 앱     | Next.js 16.3(App Router) · React 19.2 · TypeScript 5.9                          |
| 데이터 | PostgreSQL 17(PlanetScale) · Prisma 7.10(pg 어댑터) · Zod 4                     |
| 화면   | Tailwind CSS 4 · TanStack Query 5 · React Hook Form · PixiJS 8                  |
| 로그인 | Discord OAuth · iron-session                                                    |
| 운영   | Vercel(Fluid compute, icn1) · Vercel Blob · Vercel Cron · Gemini API(번역)      |
| 검사   | Vitest 4 · Playwright · Storybook 10 · ESLint · Prettier · prisma-lint · Squawk |

## 로컬 개발

### 준비 사항

- Node.js 24.x(`.node-version`, `engines`), npm 11.16.0(`packageManager` 는 버전 기록일 뿐 자동으로 바꾸지 않음)
- PostgreSQL 16 이상

### 설치

```bash
git clone https://github.com/Anchovia/noslog.git
cd noslog
npm install
cp .env.example .env
```

`npm install`이 Prisma Client를 생성합니다(`postinstall`). `.env`에는 개발용 값만 입력하세요. 운영 DB 주소와 운영 Secret을 로컬 검증에 복사하지 않습니다. `DATABASE_EXPECTED_HOST`를 넣어 두면 다른 DB 주소로 잘못 연결됐을 때 앱이 시작하지 않습니다.

### 환경변수

`.env.example`이 현재 설정의 기준입니다. 최소 실행에는 다음 값이 필요합니다.

| 용도               | 환경변수                                                             |
| ------------------ | -------------------------------------------------------------------- |
| 데이터베이스       | `DATABASE_URL`                                                       |
| 세션·북마클릿 서명 | `COOKIE_PASSWORD`, `BOOKMARKLET_SECRET`                              |
| 서비스 주소        | `APP_URL`                                                            |
| Discord 로그인     | `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI` |
| 지도               | `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`                                      |

이미지 업로드(Blob), 개인정보 정리 Cron, 공식 소식 수집(X), 의견 번역(Gemini), 점검 화면(`MAINTENANCE_MODE`)을 로컬에서 확인하려면 `.env.example`의 관련 선택 환경변수를 추가로 설정합니다. 모든 Secret은 Git에 커밋하지 않습니다.

### 데이터베이스와 개발 서버

```bash
npm run db:migrate:deploy
npm run dev
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

DB 설정은 `prisma.config.ts`, 스키마는 `prisma/schema/` 아래 영역별 파일(사용자 · 기록 · 악곡 · 기여 · 서열 · 커뮤니티 · 콘텐츠 · 제보 · 오락실 · 빙고 · 검정 · 통계)입니다. DB 이름은 snake_case, 표는 복수형입니다. Prisma 7은 마이그레이션 파일을 한 트랜잭션으로 묶지 않으므로 새 마이그레이션은 직접 `BEGIN;` … `COMMIT;` 으로 감쌉니다(`npm run lint:migrations` 가 확인).

E2E 테스트는 공유 DB가 아닌 로컬 PostgreSQL에서, 운영 빌드(`next start`)를 3100 포트에 띄워 실행합니다.
개발 서버(3000)와 겹치지 않게 리포 밖 복사본에서 서버를 띄우는 절차는 [AGENTS.md](AGENTS.md)의 e2e 항목을 따릅니다.

```bash
npm run db:migrate:deploy
npm run db:seed:e2e
npm run test:e2e
```

## 자주 쓰는 명령

| 명령                         | 용도                                       |
| ---------------------------- | ------------------------------------------ |
| `npm run dev`                | 개발 서버 실행                             |
| `npm run lint`               | ESLint 검사                                |
| `npm run format:check`       | Prettier 검사                              |
| `npm run typecheck`          | TypeScript 타입 검사                       |
| `npm test`                   | Vitest 테스트                              |
| `npm run build`              | 프로덕션 빌드                              |
| `npm run test:e2e`           | Playwright E2E 테스트                      |
| `npm run test:a11y`          | 접근성 E2E 테스트                          |
| `npm run storybook`          | 공용 UI 개발·문서                          |
| `npm run test:storybook`     | 부품 동작·접근성 검사                      |
| `npm run build-storybook`    | 공용 UI 문서 빌드                          |
| `npm run check:dependencies` | 사용 중인 의존성 검사                      |
| `npm run audit:production`   | 운영 의존성 보안 검사                      |
| `npm run lint:schema`        | Prisma 스키마 검사(외래 키 인덱스)         |
| `npm run lint:migrations`    | 새 마이그레이션 검사(트랜잭션 · 잠금 위험) |
| `npx prisma generate`        | Prisma Client 재생성                       |

카탈로그·서열표·빙고·검정 데이터를 가져오는 명령은 운영 데이터에 영향을 줄 수 있으므로 실행 전에 해당 스크립트와 운영 문서를 확인하세요.

## 프로젝트 구조

```text
app/                  Next.js 라우트, 레이아웃, Route Handler, Server Action 진입점
features/<domain>/    도메인별 API, 컴포넌트, 훅, 스키마, 서버 코드
components/           공용 UI와 채보 뷰어·편집기
lib/                  인증, DB, i18n, 분석, 캐시와 공통 도메인 로직
prisma/               영역별 스키마(schema/), 마이그레이션, 카탈로그 데이터와 import 스크립트
scripts/              검사 · 생성 · 측정 스크립트
tests/                Vitest 테스트
e2e/                  Playwright 테스트와 픽스처
docs/                 디자인, 기능, 운영, 코드 스타일 문서
```

새 도메인 코드는 가능한 한 `features/<domain>/` 아래에 두고, 공용 UI는 `components/ui/`를 사용합니다. 자세한 기준은 [코드 스타일](docs/code-style.md)을 참고하세요.

## 문서 안내

- [디자인 가이드](docs/design/README.md): 기초값 · 공용 부품 · 패턴 · 화면별 규칙과 화면 확인 기준
- [기능 규칙](docs/design/product-rules.md): 기록·동기화·투표·개인정보 동작
- [결정 기록](docs/decisions/README.md): 화면 · 동작 · 구조 결정과 이유
- [AI 티 확인](docs/ai-check.md): 작업마다 보는 확인 목록
- [코드 스타일](docs/code-style.md): 디렉터리, API 응답, Server Action, 폼과 스키마 · 마이그레이션 규칙
- [공용 UI 가이드](docs/ui/README.md): 부품 선택과 스토리 작성
- [협업 컨벤션](docs/CONVENTION.md): 브랜치 · 커밋 · PR 규칙
- [공식 X 소식 수집 운영](docs/operations/official-x-sync.md): GitHub Actions와 관련 Secret 설정
- [운영 DB 이전](docs/operations/db-migration-planetscale.md): Neon → PlanetScale 서울 이전 순서 · 되돌리기
- [이슈 템플릿](.github/ISSUE_TEMPLATE): 버그, 기능 제안, 데이터 수정 요청
- [Pull Request 템플릿](.github/pull_request_template.md): 변경 사항과 확인 항목

README에는 프로젝트를 시작하는 데 필요한 내용만 두고, 화면 규격·운영 절차·변경 결정은 위 문서에서 관리합니다.

## 테스트와 CI

로컬에서 변경을 확인할 때 다음 명령을 실행합니다.

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm test`는 단위 테스트와 DB 통합 테스트를 함께 돌립니다. DB 통합 테스트는 `TEST_DATABASE_URL`(로컬 PostgreSQL)이 있을 때만 실행되고 없으면 건너뜁니다.

GitHub Actions `CI`는 `dev`·`main` 푸시마다 다음 잡을 나란히 실행하고, 마지막 `ci-ok`가 그 결과를 모읍니다. `main` 병합에는 `ci-ok`만 필수입니다.

| 잡          | 내용                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------ |
| `lint`      | ESLint · Prettier · 의존성 선언 · Prisma 스키마 · prisma-lint · Squawk                     |
| `unit`      | 마이그레이션 적용 뒤 스키마와 차이 없는지 확인, Vitest 단위 + PostgreSQL 16 DB 통합 테스트 |
| `build`     | 프로덕션 빌드(프로젝트 전체 타입 검사 포함)                                                |
| `storybook` | 공용 UI 동작·접근성·폭 계약 검사와 Storybook 빌드                                          |
| `e2e`       | 운영 빌드 대상 Playwright(PostgreSQL 16, 모바일 기본 + 두 폭)                              |

의존성 보안은 `Dependencies` 워크플로가 PR의 새 의존성 검토와 주 1회 운영 의존성 감사로 따로 확인합니다. 버전 갱신 PR(Dependabot)은 쓰지 않습니다.

주간 운영 의존성 감사는 moderate 이상 권고가 있으면 실패합니다. 전체 개발 의존성까지
확인할 때는 `npm audit`를 실행합니다. 2026-10-29 기준 운영 권고는 0건이며(`@vercel/cli-config` 가
고정한 zod 는 `overrides` 로 루트 zod 를 따릅니다), 전체 감사에는 prisma-lint 가 쓰는 zod 3.25.76 의
[high 권고](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) 2건이 남습니다. prisma-lint 는 리포의
스키마 파일만 읽는 개발 도구라 이 권고를 미해결로 기록합니다.

## 배포와 릴리스

NosLog는 Vercel(함수 지역 icn1)에서 운영하며 데이터베이스는 PlanetScale Postgres(서울)를 사용합니다. 앱은 `DATABASE_URL`(PgBouncer 6432)로, 배포 때 마이그레이션은 `DATABASE_MIGRATION_URL`(직접 연결 5432)로 붙습니다. Production 배포에는 Production DB, 공개·비공개 Blob 저장소, Cron Secret과 서비스 인증 환경변수가 필요합니다.

- 자동 배포는 `main` 브랜치만 합니다(`vercel.json`). 다른 브랜치는 미리보기 빌드를 만들지 않습니다.
- 배포 빌드(`vercel-build`)는 `prisma migrate deploy`를 먼저 실행하므로, 마이그레이션은 `main` 병합과 함께 운영 DB에 적용됩니다. 이어서 공개 채보의 패턴 경향 값을 다시 채우므로 배포 뒤에 따로 돌릴 명령은 없습니다. DB 이름을 바꾸는 등 옛 코드와 같이 돌 수 없는 변경은 `MAINTENANCE_MODE`로 점검 화면을 켜고 배포합니다.

일반적인 배포 흐름은 다음과 같습니다.

1. `dev`에서 기능을 개발하고 검증합니다.
2. 변경 범위와 DB 마이그레이션·환경변수 변경 여부를 확인합니다.
3. `dev`에서 `main`으로 Release PR을 엽니다.
4. CI 통과 후 PR을 병합하고 Vercel Production 배포를 확인합니다.
5. PR이 병합된 커밋에 같은 버전의 `vMAJOR.MINOR.PATCH` 태그와 GitHub Release를 생성합니다(병합 전에 만들지 않습니다).

현재 `main`은 PR과 CI 통과가 필요하며, `v*` 태그는 발행 후 수정·삭제할 수 없도록 보호됩니다. 릴리스 변경 내역은 [GitHub Releases](https://github.com/Anchovia/noslog/releases)에서 확인할 수 있습니다.

## 개인정보와 데이터

- 공개 아바타와 비공개 증빙 이미지는 용도가 나뉜 Blob 저장소에 보관합니다.
- 채보 편집용 로컬 음원은 브라우저 안에서만 사용합니다.
- 회원 탈퇴, 증빙 자료 보관 기간, 분석 데이터 처리 기준은 서비스의 [개인정보처리방침](https://noslog.app/ko/privacy)을 따릅니다.
- 운영 DB에는 E2E 시드나 개발용 import 명령을 실행하지 않습니다.

## 기여하기

버그, 데이터 오류, 기능 제안은 [Issues](https://github.com/Anchovia/noslog/issues)에 남겨 주세요. 코드 변경은 작은 단위로 작성하고, 관련 테스트와 화면 확인 결과를 Pull Request에 함께 적습니다.

새로운 동작이나 화면 규칙을 추가할 때는 먼저 [디자인 가이드](docs/design/README.md)와 [기능 규칙](docs/design/product-rules.md)을 확인합니다. 가이드에 없는 토큰·색·움직임을 추가하거나 기존 기록의 의미를 바꾸는 변경은 사전 논의가 필요합니다.

## 버전

NosLog는 Semantic Versioning을 따릅니다.

- `PATCH`: 버그 수정, 문서·UI 개선
- `MINOR`: 기존 사용법과 호환되는 기능 추가
- `MAJOR`: 호환되지 않는 데이터·인증·사용 방식 변경

## 라이선스와 상표

현재 저장소에는 별도의 `LICENSE` 파일이 없습니다. 라이선스가 공표되기 전까지 코드를 재배포하거나 2차 프로젝트에 포함하려면 저장소 관리자에게 문의하세요.

NOSTALGIA와 관련 상표·콘텐츠의 권리는 각 권리자에게 있습니다. NosLog는 팬 제작 비공식 서비스입니다.
