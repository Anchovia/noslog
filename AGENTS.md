# AGENTS.md

NosLog — NOSTALGIA 비공식 기록 · 랭킹 · 아카이브 서비스. 이 파일이 모든 에이전트의 작업 규칙 원본이다.
짧게 유지한다. 디자인 규칙은 여기 쓰지 않고 가이드에만 쓴다.

## 무엇을 기준으로 하나

1. 사용자의 최신 결정
2. [디자인 가이드](docs/design/README.md) — 토큰 · 레이아웃 · 부품 · 페이지 규칙 · 확인 방법. 이유는 [결정 기록](docs/design/decisions.md)
3. [기능 규칙](docs/design/product-rules.md) — 화면만으로 알 수 없는 동작 · 데이터 의미
4. 지금 코드와 테스트 · [README](README.md)(설치 · 배포) · [코드 스타일](docs/code-style.md)

**Figma, Z1, 옛 브리프 · 핸드오프 · 감사 문서 · PDF, 레거시 NOSTORY 는 폐기됐다.** 읽지도 쓰지도 인용하지도 않는다.
git 기록에서 옛 문서나 「남은 일」 을 되살리지 않는다(사용자가 명시적으로 요청할 때만).

## 스택 · 명령

Next.js 16.3(App Router) · React 19.2 · Prisma 6.19 · Zod 4 · TanStack Query 5 · Tailwind 4 · Vitest 4 · Playwright.
Next.js 는 기억 대신 설치된 버전 문서(`node_modules/next/dist/docs/`)를, Prisma 는 v6 문서를 본다(웹 문서 기본값은 v7).
옛 버전 문법을 옮기지 않는다 — Next 16: 미들웨어는 `proxy.ts` · `params` · `searchParams` · `cookies()` · `headers()` 는 `await` ·
`revalidateTag(tag, "max")` 두 번째 인자 · `next lint` 없음(ESLint 직접). Zod 4: `z.email()` 같은 최상위 형식 · 옵션 이름은 `error`.
Tailwind 4: 설정은 CSS(`app/globals.css`), `tailwind.config` 를 만들지 않는다.

폴더: `app/`(라우트 · Route Handler · Server Action 입구) · `features/<도메인>/{api,components,hooks,schemas,server}` ·
`components/ui`(공용 부품) · `app/styles`(토큰 · 공용 스타일) · `lib/i18n/messageCatalogs` · `prisma/` · `tests/` · `e2e/`.
자세한 경계는 [코드 스타일](docs/code-style.md).

명령은 지어내지 않고 `package.json` 스크립트를 쓴다.

- `npm run typecheck` · `npm run lint` · `npm test`(파일 하나는 `npx vitest run tests/<파일>`) · `npm run build`
- **e2e** — 화면 · 흐름을 바꿨고 관련 스펙이 있으면 그 스펙 하나를 로컬에서 돌린다(전체는 먼저 묻는다). 사용자의 localhost:3000 에는 돌리지 않는다
  (`PLAYWRIGHT_BASE_URL` 이 없으면 그리로 간다). 한 번에 한 세션 — 포트 3100 이 쓰이고 있으면 기다린다. 확인된 절차(2026-09-22):
    1. 리포를 리포 밖 임시 폴더로 복사(`.git` · `.next` · `node_modules` · `.env*` 제외), `node_modules` 는 `cp -c -R` 로 복제(링크는 Turbopack 이 거부).
       `.env` 는 e2e 값만 새로 쓴다(`DATABASE_URL=postgresql://<사용자>@localhost:5432/noslog_e2e` · 임시 `COOKIE_PASSWORD` · `BOOKMARKLET_SECRET`) —
       실제 `.env*` 를 가져오지 않는다(`.env.production.local` 에 운영 값이 있다).
    2. 복사본에서 `npx prisma migrate deploy` → `E2E_SEED=1 npm run db:seed:e2e` → `node prisma/import-music-catalog.mjs --apply`.
    3. 복사본에서 `npx next dev -p 3100`, `PLAYWRIGHT_BASE_URL=http://localhost:3100 npx playwright test e2e/<스펙>`. 끝나면 3100 서버를 끈다.

## 사용자 규칙

- 답은 한국어.
- **git 은 사용자가 한다** — 커밋 · 푸시 · 스테이징 · 브랜치 · PR 모두. 상태 조회만 한다.
  작업이 끝나면 커밋 제목(영어 type + 한국어 설명, 예 `fix: 악곡 상세 반응형 전환 기준 통일`)과 묶음별 `git add` 명령을 준다.
- **운영 DB 에 쓰지 않는다.** 운영 = Neon 운영 프로젝트(steep-hill-21603078)의 production 브랜치.
  운영을 고쳐야 하면 확인용 `SELECT` · 수정 `UPDATE` · 확인 쿼리를 사용자에게 준다(사용자가 Neon 에서 실행).
- 사용자가 켜 둔 localhost:3000 과 `.env` 는 **개발 DB**(Neon 프로젝트 `noslog-dev`)를 쓴다. 테스트 데이터 · 검증용 쓰기는 해도 되고,
  만든 데이터는 지우거나 보고한다. 파일 업로드(Blob)는 실제 스토어로 가므로 따로 조심한다.
- **비밀값을 드러내지 않는다** — `.env` 값 · DB 주소 · 토큰을 답 · 보고 · 커밋 · 로그에 쓰지 않는다. 필요한 값이 없으면 멈추고 묻는다.
- 로그인은 사용자가 한다. 인증을 우회하지 않는다. 로그인 상태로 검수할 때 저장 · 제출 · 삭제를 누르지 않는다.
- 개발 서버는 사용자가 켜 둔 localhost:3000 을 쓴다.
- 커밋되지 않은 사용자 작업과 관계없는 파일을 건드리지 않는다.

## 동시 세션

사용자는 여러 에이전트 세션을 동시에 돌린다. 다른 세션의 작업에 영향을 주지 않는다.

- 임시 파일 · 스크립트 · 스크린샷은 리포 밖 임시 폴더(Claude 는 세션 스크래치패드)에만 만든다. 프로젝트 안에 두지 않는다.
- 주는 `git add` 명령에는 내가 바꾼 파일 이름을 하나씩 적는다. `git add -A` · `git add .` 는 주지 않는다.
- 여럿이 함께 고치는 파일(`docs/design/decisions.md` · `lib/i18n/messageCatalogs/*` · 공용 스타일)은 내 줄만 고치고,
  보고할 때 스테이징 전에 `git diff` 로 다른 세션 변경이 섞였는지 보라고 적는다.

## 먼저 묻는다 · 하지 않는다

- **먼저 묻는다:** 의존성 추가 · 업그레이드, `prisma/schema.prisma` 변경 · 마이그레이션 만들기, 파일 삭제 · 이름 바꾸기, e2e 전체 실행.
- 스키마 변경을 허락받으면 `npx prisma migrate dev --create-only` 로 파일만 만들어 사용자가 검토하게 하고, 적용은 개발 DB 까지만. 뒤에 `npx prisma generate`.
- **하지 않는다:** `prisma migrate reset` · `prisma db push` · 운영 대상 `migrate deploy` · `--force` · `--accept-data-loss`.
  `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION` 을 스스로 켜지 않는다 — 막혔다는 뜻이니 멈추고 묻는다.

## 릴리스

- 순서: 버전 올리기(`package.json` · `package-lock.json` · README) → `dev` 에서 `main` 으로 PR → **PR 이 합쳐진 뒤에** 그 커밋에 GitHub 릴리스 `vX.Y.Z`(target `main`).
- 이 저장소는 변경 불가 릴리스(immutable)라 **한 번 게시한 태그 이름은 지워도 다시 못 쓴다**(2026-09-22 합치기 전에 만들어 v2.11.0 을 잃음).
  릴리스 명령을 주기 전에 PR 이 `main` 에 합쳐졌는지, `main` 의 `package.json` 버전이 태그와 같은지 먼저 확인한다. `v*` 태그는 규칙으로 삭제 · 변경도 막혀 있다.
- 버전을 올렸으면 한 번에 다 준다 — 커밋 제목(`release: NosLog vX.Y.Z`) · PR 제목 · 본문 · 공지(한국어 · 일본어 · 영어) · GitHub 릴리스 제목 · 본문.
  양식은 매번 직전 것을 읽어 그대로 맞춘다: PR = 직전 릴리스 PR(예 [#96](https://github.com/Anchovia/noslog/pull/96), `gh pr view`),
  공지 = 직전 업데이트 공지(예 https://noslog.app/ko/announcements/v2-11-0 · ja · en), 릴리스 = 직전 릴리스(`gh release view`).
- PR · 공지 · 릴리스 본문은 복사할 수 있게 채팅에 코드 블록으로 준다(스크래치패드 파일은 세션이 바뀌면 사라진다).

## 손대지 않는 곳

- 관리자 화면(`/admin/*`)은 재설계하지 않는다. 기능에 필요한 칸만 기존 모양으로 더한다.
- 채보 에디터는 관리자 · 기여자 · 검토 세 모드로 쓴다(2026-09-24 유저 기여 3단계). 캔버스 · 편집 조작은 그대로 두고,
  모드마다 셸(위 막대 버튼 · 레일 탭)만 다르게 한다. 새 기능은 기여에 필요한 것만 더하고 에디터 자체를 다시 설계하지 않는다.
  예외: 트릴 모양은 공개 뷰어와 같은 게임식 B′(2026-09-24).
- 공개 채보 뷰어(`/music/*/*/pattern`)는 셸과 조작부만 일반 규칙을 따른다(2026-09-10).
  캔버스 — 낙하형 스테이지 · 피아노 · 악보 열 · 손 색 · 채보 계산 · 오디오 동기화 — 는 그대로 둔다(트릴 모양만 게임식 B′, 2026-09-24).
- 음원(MP3)은 사용자 브라우저 안에서만. 올리거나 저장하지 않는다.
- 기존 기록 · 랭킹 · 아카이브 · 작성 기능과 데이터 의미를 바꾸지 않는다.

## 일하는 방식

- 시작할 때 이 파일과 디자인 가이드를 읽고, `git status` 로 현재 변경을 확인한다.
- 리포지토리로 알 수 있는 사실은 묻지 않고 코드 · 테스트 · 실제 브라우저로 확인한다.
- **가이드에 없는 시각 · 동작 결정은 만들지 않는다.** 비교 시안을 그려 보여 주고, 추천 하나를 표시하고, 사용자가 고른다.
  근거는 실측과 공식 문서로 대고, 확인하지 못한 것은 「미확인」 이라고 쓴다. 인용을 결론에 끼워 맞추지 않는다.
- 사용자가 고른 안을 임의로 절충하지 않는다. 사용자가 지적한 범위만 고치고, 넓힐 때는 먼저 묻는다.
- **새 토큰을 만들지 않는다** — 있는 토큰을 불러와 쓴다. 새 토큰 · 가이드 값 밖 숫자 · 새 색 · 새 움직임이 필요해 보이면
  멈추고, 비교 시안을 그려 사용자 허락을 받은 뒤에만 더한다.
- 로딩 · 움직임은 가이드 「로딩」 · 「움직임」 절의 기존 스켈레톤 · 공용 클래스를 따른다. 새로 만들지 않는다.
- 공통 규칙은 공용 소스(`app/styles/tokens.css` · `foundation.css` · `components/ui`)에서 고친다. 페이지에서 공용 부품 규격을 덮어쓰지 않는다.
- 결정이 나면 같은 작업에서 코드 → 가이드 해당 절 → `decisions.md` 한 줄 → 테스트 기대값을 맞춘다.
- 작게 나눠 구현하고, 바꾼 화면은 [가이드 「확인」 절](docs/design/README.md)대로 잰다.
  실패는 원래 있던 것과 이번에 생긴 것을 구분한다.
- **끝내기 전 검사** — 바꾼 것에 따라 더한다.
    - 코드(ts · tsx · css): `npm run typecheck` · `npm run lint` · `npm test` 전체(합쳐 30초 남짓 — 관련 파일만 고르지 않는다).
    - 화면 · CSS · 토큰: + 가이드 「확인」 실측. Prisma 스키마: + `npx prisma generate` 먼저.
    - `next.config` · 의존성 · 라우트 구조 · 환경 변수: + `npm run build`.
    - 문서만(md): `npx prettier --check <파일>`.
- **끝내기 전 정리** — 결정이 났으면 가이드 · `decisions.md` · 테스트 기대값 → 공개 화면의 새 문구는 `lib/i18n/messageCatalogs` 의
  ko · en · ja 세 곳 모두 → 커밋 제목 · 파일별 `git add`.
- 보고에는 실제로 한 것만 쓴다. 안 한 검사는 「안 함」, 남은 한계는 그대로 적는다.
- 이 파일은 짧게 둔다 — 같은 실수가 두 번 나오면 한 줄 더하고, 이미 지켜져 필요 없어진 줄은 뺀다.
