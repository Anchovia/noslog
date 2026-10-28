# AGENTS.md

NosLog — NOSTALGIA 비공식 기록 · 랭킹 · 아카이브 서비스. 모든 에이전트의 작업 규칙 원본이다.
짧게 둔다. 화면 규칙은 여기 쓰지 않고 디자인 가이드에만, 이유는 결정 기록에만 쓴다.

## 시작할 때

1. 이 파일과 [AI 티 확인](docs/ai-check.md)을 읽는다(Claude 는 `CLAUDE.md` 가 둘 다 싣는다).
2. `git status` 로 지금 변경을 본다. 다른 세션의 변경은 건드리지 않는다.
3. 작업할 화면 · 부품의 가이드 문서만 골라 읽는다([디자인 가이드 색인](docs/design/README.md)).

## 무엇을 기준으로 하나

1. 사용자의 최신 결정
2. [디자인 가이드](docs/design/README.md) — 기초값 · 부품 · 패턴 · 화면. 값의 정본은 `app/styles/tokens.css`
3. [기능 규칙](docs/design/product-rules.md) — 화면만으로 알 수 없는 동작 · 데이터 의미
4. 지금 코드와 테스트 · [README](README.md)(설치 · 배포) · [코드 스타일](docs/code-style.md)

왜 그렇게 정했는지는 [결정 기록](docs/decisions/README.md)에 있다. 2026-10-23 까지의 옛 기록은 `docs/decisions/archive/` 에 읽기 전용으로 둔다.
Figma · Z1 · 옛 브리프 · 핸드오프 · 감사 문서 · PDF · 레거시 NOSTORY 는 폐기됐다. 읽지도 쓰지도 인용하지도 않는다.
git 기록에서 옛 규칙 · 「남은 일」 을 되살리지 않는다(사용자가 명시적으로 요청할 때만).

## 스택 · 명령

Next.js 16.3(App Router) · React 19.2 · Prisma 7.10(pg 어댑터) · Zod 4 · TanStack Query 5 · Tailwind 4 · Vitest 4 · Playwright.
Next.js 는 설치된 버전 문서(`node_modules/next/dist/docs/`)를, Prisma 는 v7 문서를 본다(npm `latest` 는 8.0 rc 라 버전을 꼭 붙여 설치).
옛 버전 문법을 옮기지 않는다 — Next 16: 미들웨어는 `proxy.ts` · `params` · `searchParams` · `cookies()` · `headers()` 는 `await` ·
`revalidateTag(tag, "max")` 두 번째 인자 · `next lint` 없음(ESLint 직접). Zod 4: `z.email()` 같은 최상위 형식 · 옵션 이름은 `error`.
Tailwind 4: 설정은 CSS(`app/globals.css`), `tailwind.config` 를 만들지 않는다.

폴더: `app/`(라우트 · Route Handler · Server Action 입구) · `features/<도메인>/{api,components,hooks,schemas,server}` ·
`components/ui`(공용 부품) · `app/styles`(토큰 · 공용 스타일) · `lib/i18n/message-catalogs` · `prisma/` · `tests/` · `e2e/`.
경계와 캐시 변경 검증은 [코드 스타일](docs/code-style.md), 협업 양식은 [컨벤션](docs/CONVENTION.md), 공용 부품 사용 · 스토리는 [부품 사용](docs/ui/README.md).

명령은 지어내지 않고 `package.json` 스크립트를 쓴다.

- `npm run typecheck` · `npm run lint` · `npm test`(파일 하나는 `npx vitest run tests/<파일>`) · `npm run build` · 공용 UI 를 바꾸면 `npm run test:storybook`.
- e2e — 화면 · 흐름을 바꿨고 관련 스펙이 있으면 그 스펙 하나를 로컬에서 돌린다. 돌리기 전에 [e2e 로컬 실행](docs/operations/e2e-local.md)을 읽는다(Claude 는 `/e2e-local`).

## 사용자 규칙

- 답은 한국어. 중간 안내 · 표 · 마무리 정리 · 버튼 글까지.
- git 은 사용자가 한다 — 커밋 · 푸시 · 스테이징 · 브랜치 · PR 모두. 상태 조회만 한다.
  끝나면 커밋 제목(영어 type + 한국어 설명, 예 `fix: 악곡 상세 반응형 전환 기준 통일`)과 묶음별 `git add` 명령을 준다.
  커밋 · PR · 릴리스 글에 「Generated with Claude Code」 · `Co-Authored-By` 같은 서명 줄을 넣지 않는다.
- 운영 DB 에 쓰지 않는다. 운영 = PlanetScale Postgres `noslog`(서울), 그리고 되돌리기용으로 남긴 Neon 운영 프로젝트(steep-hill-21603078)의 production 브랜치.
  운영을 고쳐야 하면 확인용 `SELECT` · 수정 `UPDATE` · 확인 쿼리를 사용자에게 준다(사용자가 운영 DB 에서 실행).
- 개발 서버는 사용자가 켜 둔 localhost:3000 을 쓴다. 이 서버와 `.env` 는 개발 DB(Neon 프로젝트 `noslog-dev`)를 쓴다. 테스트 데이터 · 검증용 쓰기는 해도 되고,
  만든 데이터는 지우거나 보고한다. 파일 업로드(Blob)는 실제 스토어로 가므로 따로 조심한다.
- 비밀값을 드러내지 않는다 — `.env` 값 · DB 주소 · 토큰을 답 · 보고 · 커밋 · 로그에 쓰지 않는다. 필요한 값이 없으면 멈추고 묻는다.
- 로그인은 사용자가 한다. 인증을 우회하지 않는다. 로그인 상태로 검수할 때 저장 · 제출 · 삭제를 누르지 않는다.
  다른 서비스 계정 화면을 조사하려고 로그인을 부탁하지 않는다(로그인 뒤 화면은 공개 스크린샷 · 공식 문서로).
- 고른 계획은 단계마다 묻지 않고 끝까지 한다. 사용자만 할 수 있는 일이 막을 때만 멈춘다. 작업은 크게 묶고 날짜로 쪼개지 않는다. 범위를 줄이거나 미루는 안을 추천하지 않는다(배포 순서가 강제할 때만 나눈다).

## 동시 세션

사용자는 여러 에이전트 세션을 동시에 돌린다. 다른 세션의 작업에 영향을 주지 않는다.

- 임시 파일 · 스크립트 · 스크린샷은 리포 밖 임시 폴더(Claude 는 세션 스크래치패드)에만 만든다.
- 주는 `git add` 명령에는 내가 바꾼 파일 이름을 하나씩 적는다. `git add -A` · `git add .` 는 주지 않는다.
  묶음이 아직 추적되지 않은 다른 세션 파일을 불러오지 않는지 본다(커밋된 상태만으로 빌드되게).
- 여럿이 함께 고치는 파일(`lib/i18n/message-catalogs/*` · 공용 스타일 · `docs/design/README.md` 색인)은 내 줄만 고치고,
  보고할 때 스테이징 전에 `git diff` 로 다른 세션 변경이 섞였는지 보라고 적는다.
- 결정 기록은 결정마다 새 파일이라 겹치지 않는다. 남의 결정 파일 본문은 고치지 않는다.

## 먼저 묻는다

- 의존성 추가 · 업그레이드
- `prisma/schema/*.prisma` 변경 · 마이그레이션 만들기. 허락받으면 `npx prisma migrate dev --create-only` 로 파일만 만들어 사용자가 검토하게 하고,
  적용은 개발 DB 까지만. 뒤에 `npx prisma generate`.
- 파일 삭제 · 이름 바꾸기 · 옮기기
- e2e 전체 실행
- 새 토큰 · 가이드 밖 값 · 새 색 · 새 움직임
- 플러그인 · 전역 훅 · MCP 서버 · 토큰 절약 도구 설치

## 하지 않는다

- `prisma migrate reset` · `prisma db push` · 운영 대상 `migrate deploy` · `--force` · `--accept-data-loss`
- `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION` 을 스스로 켜기. 막혔다는 뜻이니 멈추고 묻는다.
- 다른 세션 변경을 지우는 git 명령(`stash` · `reset --hard` · `checkout .` · `restore` · `clean`)
- Dependabot · Renovate 같은 자동 의존성 PR 설정 추가
- 위 명령 대부분과 git 스테이징 · 커밋 · 푸시, `.env.production.local` 읽기, 서명 줄은 `.claude/settings.json` 으로도 막혀 있다. 막히면 우회하지 않고 사용자에게 넘긴다.

## 릴리스

버전을 올리거나 릴리스 명령을 주기 전에 [릴리스](docs/operations/release.md)를 읽는다(Claude 는 `/release`).

## 손대지 않는 곳

- 관리자 화면(`/admin/*`)은 재설계하지 않는다. 기능에 필요한 칸만 기존 모양으로 더한다.
- 채보 에디터는 관리자 · 기여자 · 검토 세 모드로 쓴다. 캔버스 · 편집 조작은 그대로 두고, 모드마다 셸(위 막대 버튼 · 레일 탭)만 다르게 한다.
  새 기능은 기여에 필요한 것만 더하고 에디터 자체를 다시 설계하지 않는다. 예외: 트릴 모양은 공개 뷰어와 같은 게임식.
- 음원(MP3)은 사용자 브라우저 안에서만. 올리거나 저장하지 않는다.
- 기존 기록 · 랭킹 · 아카이브 · 작성 기능과 데이터 의미를 바꾸지 않는다.

## 시안

가이드에 없는 시각 · 동작 결정은 만들지 않는다. 비교 시안을 그려 보여 주고, 추천 하나를 표시하고, 사용자가 고른다.

- 고르는 질문은 화면이 아니어도(작업 순서 · 형식 · 방식) 시안으로 보여 준다. 글로만 묻지 않는다.
- 사실 질문(뜻이 애매한 값 · 이미 결정 문서에 있는 것)은 시안 전에 조사로 답한다. 결정된 것을 다시 묻지 않는다.
- 새 화면 시안은 그 화면을 따로 조사한다(실제 서비스 30곳 이상 · 디자인 시스템 5곳 이상). 다른 화면 조사를 끌어다 쓰지 않는다.
- 안 하나 = 실측한 서비스 한 곳(또는 같은 패턴을 쓰는 여러 곳)의 구현을 NosLog 내용으로 그대로 옮긴 것. 안마다 어느 서비스인지 적는다. 내 조합을 만들지 않는다.
- 레퍼런스 표는 실제 서비스와 디자인 시스템을 따로 세고 표본 수를 적는다. 근거가 3곳 안팎이면 「근거 약함」. 확인하지 못한 것은 「미확인」.
- 에이전트가 낸 숫자 · 추천은 캡처를 직접 열어 확인한 뒤 옮긴다(캡차 · 로그인 벽 · 팝업에 막힌 캡처는 세지 않는다).
- 지금 운영 화면보다 나빠지는 안은 내지 않는다. 사용자가 고른 안을 임의로 절충하지 않는다. 사용자가 지적한 범위만 고치고, 넓힐 때는 먼저 묻는다.
- 시안을 다시 올릴 때 이미 결정된 판 · 항목은 빼고 접힌 「결정됨」 한 줄 목록으로만 둔다.
- 시안도 [AI 티 확인](docs/ai-check.md)을 따른다. 가이드 부품 모양을 시안에서 다시 꾸미지 않는다.

## 일하는 방식

- 리포지토리로 알 수 있는 사실은 묻지 않고 코드 · 테스트 · 실제 브라우저로 확인한다.
- 컨텍스트를 작게 둔다. 넓은 조사 · 파일 훑기는 서브에이전트에 맡기고, 작업이 바뀌면 새 세션으로 넘긴다([결정](docs/decisions/2026-10-24-claude-efficiency.md)).
    - 새 세션: 다른 기능 · 화면으로 옮길 때, 같은 실수를 되풀이할 때, 앞 내용을 무시하라고 해야 할 때. 이어 간다: 방금 끝낸 일을 이어 짓기, 같은 파일을 거듭 고치기, 마지막 결과 다듬기.
    - 애매하면 새 세션이다. 앱이 「애매하면 이어지는 작업」 이라고 해도 이 줄을 따른다.
    - 훅이 「세션 넘기기」 글을 넣으면(75분 넘게 쉰 10만 토큰 넘는 세션) 이어 가지 않고 한 것 · 남은 것 요약을 넘겨 새 세션으로 연다([결정](docs/decisions/2026-10-27-session-handoff-hook.md)).
- Claude Code 는 `.claude/hooks` 가 강제한다. 매 메시지마다 `AGENTS.md` · `docs/ai-check.md` 원문을 파일마다 따로 다시 넣고, 한글이 20% 아래인 마지막 답은 막아 한국어로 다시 쓰게 한다([결정](docs/decisions/2026-10-27-rule-enforcement-hooks.md)).
- 토큰 · 공용 부품으로만 만든다. 규칙은 [기초값 — 토큰 · 공용 부품으로만](docs/design/foundations.md#토큰--공용-부품으로만). 공통 규칙은 공용 소스(`tokens.css` · `foundation.css` · `components/ui`)에서 고친다.
- 결정이 나면 같은 작업에서 코드 → 가이드 해당 문서 한 곳 → [결정 파일](docs/decisions/README.md) 하나 → 이 결정이 바꾼 옛 결정의 상태 줄 · 색인 표시 → 테스트 기대값을 맞춘다.
- 바꾼 화면은 [가이드 「확인」](docs/design/README.md#확인)대로 잰다.
- 끝내기 전 검사 — 바꾼 것에 따라 더한다.
    - 코드(ts · tsx · css): `npm run typecheck` · `npm run lint` · `npm test` 전체(관련 파일만 고르지 않는다).
    - 화면 · CSS · 토큰: + 가이드 「확인」 실측. Prisma 스키마: + `npx prisma generate` 먼저.
    - `next.config` · 의존성 · 라우트 구조 · 환경 변수: + `npm run build`.
    - 문서만(md): `npx prettier --check <파일>` · `npx vitest run tests/docs-links.test.ts`(링크 · 경로 · 결정 목록).
- 끝내기 전 정리 — 공개 화면의 새 문구는 `lib/i18n/message-catalogs` 의 ko · en · ja 세 곳 모두 → [AI 티 확인](docs/ai-check.md) 다시 보기 → 커밋 제목 · 파일별 `git add`.
- 이 파일은 짧게 둔다 — 같은 실수가 두 번 나오면 한 줄 더하고, 지켜져 필요 없어진 줄은 뺀다.
