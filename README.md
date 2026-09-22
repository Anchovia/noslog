# NosLog

[![CI](https://github.com/Anchovia/noslog/actions/workflows/ci.yml/badge.svg)](https://github.com/Anchovia/noslog/actions/workflows/ci.yml)
[![Latest release](https://img.shields.io/github/v/release/Anchovia/noslog?label=release)](https://github.com/Anchovia/noslog/releases)

> NOSTALGIA 플레이 기록을 모아 악곡별 성과, 서열, 랭킹과 채보를 확인하는 비공식 팬 프로젝트입니다.

[서비스 바로가기](https://noslog.app/ko) · [이슈 제보](https://github.com/Anchovia/noslog/issues) · [최신 Release](https://github.com/Anchovia/noslog/releases/latest)

NosLog는 NOSTALGIA 플레이 데이터를 한곳에서 확인하고 기록을 돌아볼 수 있도록 만든 웹 서비스입니다. 한국어·일본어·영어 화면을 제공하며, 현재 서비스 버전은 **v2.12.0**입니다.

> NosLog는 KONAMI 및 공식 NOSTALGIA 서비스와 관련이 없습니다.

## 주요 기능

### 플레이 기록과 분석

- 북마클릿으로 NOSTALGIA 플레이 기록 동기화
- 악곡 검색, 난이도 필터, 개인 기록 기반 정렬
- 점수, 콤보, 판정, FAST/SLOW, 음표별 성공률과 최근 기록 추이
- Basic·Recital 공식 Grd 및 Basic 서열 레이팅 랭킹
- S·Full Combo·Pianist 목표별 서열표
- 프로필의 베스트 성과, 최근 플레이, 랭크 분포와 판정 상세

### 커뮤니티와 아카이브

- 공지사항, 이벤트, 빙고, 검정 정보
- 지역별 오락실 목록과 지도, 오락실 정보 제보
- 악곡 번역 제안과 승인된 번역 제목
- 화면에서 바로 보내는 오류 제보와 의견
- NOSTALGIA 공식 소식 아카이브

### 채보 도구

- 관리자용 28칸 채보 편집기
- 일반·테누토·글리산도·트릴 노트와 BPM·박자표·오프셋 편집
- `.noslog-chart.json` 채보 가져오기·내보내기
- 전체 악보 뷰어와 PixiJS 기반 낙하형 뷰어
- 메트로놈, 볼륨 조절, 브라우저에서만 사용하는 로컬 음원

채보 편집 화면은 데스크톱과 가로형 태블릿을 기준으로 하며, 공개 뷰어는 모바일에서도 사용할 수 있습니다. 로컬 음원은 서버로 전송하거나 저장하지 않습니다.

## 로컬 개발

### 준비 사항

- Node.js 24
- npm
- PostgreSQL 또는 Neon PostgreSQL

### 설치

```bash
git clone https://github.com/Anchovia/noslog.git
cd noslog
npm install
cp .env.example .env
```

`npm install`이 Prisma Client를 생성합니다. `.env`에는 개발용 값만 입력하세요. 운영 DB 주소와 운영 Secret을 로컬 검증에 복사하지 않습니다.

### 환경변수

`.env.example`이 현재 설정의 기준입니다. 최소 실행에는 다음 값이 필요합니다.

| 용도               | 환경변수                                                             |
| ------------------ | -------------------------------------------------------------------- |
| 데이터베이스       | `DATABASE_URL`                                                       |
| 세션·북마클릿 서명 | `COOKIE_PASSWORD`, `BOOKMARKLET_SECRET`                              |
| 서비스 주소        | `APP_URL`                                                            |
| Discord 로그인     | `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI` |
| 지도               | `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`                                      |

이미지 업로드, 개인정보 정리 Cron, 공식 소식 수집을 로컬에서 확인하려면 `.env.example`의 관련 선택 환경변수를 추가로 설정합니다. 모든 Secret은 Git에 커밋하지 않습니다.

### 데이터베이스와 개발 서버

```bash
npm run db:migrate:deploy
npm run dev
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

E2E 테스트는 공유 DB가 아닌 로컬 PostgreSQL에서만 실행합니다.

```bash
npm run db:migrate:deploy
npm run db:seed:e2e
npm run test:e2e
```

## 자주 쓰는 명령

| 명령                         | 용도                  |
| ---------------------------- | --------------------- |
| `npm run dev`                | 개발 서버 실행        |
| `npm run lint`               | ESLint 검사           |
| `npm run typecheck`          | TypeScript 타입 검사  |
| `npm test`                   | Vitest 테스트         |
| `npm run build`              | 프로덕션 빌드         |
| `npm run test:e2e`           | Playwright E2E 테스트 |
| `npm run test:a11y`          | 접근성 E2E 테스트     |
| `npm run check:dependencies` | 사용 중인 의존성 검사 |
| `npx prisma generate`        | Prisma Client 재생성  |

카탈로그·서열표·빙고·검정 데이터를 가져오는 명령은 운영 데이터에 영향을 줄 수 있으므로 실행 전에 해당 스크립트와 운영 문서를 확인하세요.

## 프로젝트 구조

```text
app/                  Next.js 라우트, 레이아웃, Route Handler, Server Action 진입점
features/<domain>/    도메인별 API, 컴포넌트, 훅, 스키마, 서버 코드
components/           공용 UI와 채보 뷰어·편집기
lib/                  인증, DB, i18n, 분석, 캐시와 공통 도메인 로직
prisma/               스키마, 마이그레이션, 카탈로그 데이터와 import 스크립트
tests/                Vitest 테스트
e2e/                  Playwright 테스트와 픽스처
docs/                 디자인, 기능, 운영, 코드 스타일 문서
```

새 도메인 코드는 가능한 한 `features/<domain>/` 아래에 두고, 공용 UI는 `components/ui/`를 사용합니다. 자세한 기준은 [코드 스타일](docs/code-style.md)을 참고하세요.

## 문서 안내

- [디자인 가이드](docs/design/README.md): 토큰, 레이아웃, 공용 부품, 로딩과 화면 확인 기준
- [기능 규칙](docs/design/product-rules.md): 기록·동기화·투표·개인정보 동작
- [코드 스타일](docs/code-style.md): 디렉터리, API 응답, Server Action, 폼과 스키마 규칙
- [공식 X 소식 수집 운영](docs/operations/official-x-sync.md): GitHub Actions와 관련 Secret 설정
- [이슈 템플릿](.github/ISSUE_TEMPLATE): 버그, 기능 제안, 데이터 수정 요청
- [Pull Request 템플릿](.github/pull_request_template.md): 변경 사항과 확인 항목

README에는 프로젝트를 시작하는 데 필요한 내용만 두고, 화면 규격·운영 절차·변경 결정은 위 문서에서 관리합니다.

## 테스트와 CI

로컬에서 변경을 확인할 때 다음 명령을 순서대로 실행합니다.

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Actions의 `verify` 작업은 의존성 설치, 린트, Vitest, 타입 검사와 프로덕션 빌드를 확인합니다. E2E 작업은 저장소 변수 `RUN_E2E=true`일 때 로컬 PostgreSQL 16과 Playwright Chromium으로 실행됩니다.

## 배포와 릴리스

NosLog는 Vercel에서 운영하며 데이터베이스는 Neon PostgreSQL을 사용합니다. Production 배포에는 Production DB, 공개·비공개 Blob 저장소, Cron Secret과 서비스 인증 환경변수가 필요합니다.

일반적인 배포 흐름은 다음과 같습니다.

1. `dev`에서 기능을 개발하고 검증합니다.
2. 변경 범위와 DB 마이그레이션·환경변수 변경 여부를 확인합니다.
3. `dev`에서 `main`으로 Release PR을 엽니다.
4. CI 통과 후 PR을 병합하고 Vercel Production 배포를 확인합니다.
5. 같은 버전의 `vMAJOR.MINOR.PATCH` 태그와 GitHub Release를 생성합니다.

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
