# 에이전트 지시 파일 정비 — 금지는 설정으로, 가끔 쓰는 절차는 문서와 스킬로

- 상태: 유효
- 날짜: 2026-10-27
- 분야: 구조
- 고른 사람: 사용자(시안 판 1–3 추천대로, 판 2 는 문서와 스킬 둘 다)

## 맥락

`AGENTS.md` · `CLAUDE.md` 를 다른 프로젝트 설정 · 공식 가이드 · 연구와 견주어 고칠 곳을 찾았다. 동시 세션 규칙은 「git 은 상태 조회만」 이지만 다른 세션 변경을 지우는 git 명령은 막혀 있지 않았고, 서명 줄 금지는 글로만 있어 하네스 안내와 부딪혔다. e2e · 릴리스 절차는 해당 작업 때만 쓰는데 매 세션 실렸다.

## 결정

1. `.claude/settings.json` 에 `attribution`(커밋 · PR 서명 줄 끔)을 두고, deny 에 `git stash` · `reset --hard` · `checkout .` · `checkout --` · `restore` · `clean` · `--force` · `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION` · `.env.production.local` 이 든 명령을 더한다.
2. e2e 실행 절차는 `docs/operations/e2e-local.md`, 릴리스 절차는 `docs/operations/release.md` 가 정본이다. `AGENTS.md` 에는 언제 읽는지 한 줄씩만 두고, Claude 용 스킬 `/e2e-local` · `/release` 는 그 문서를 읽으라고만 한다.
3. 「먼저 묻는다」 와 「하지 않는다」 를 따로 목록 절로 나눈다.

## 고르지 않은 안

- PreToolUse 훅 스크립트 — 운영 대상 `migrate deploy` 처럼 패턴으로 못 가리는 것까지 막지만, 명령마다 스크립트가 돌고 조사한 리포 37곳에서 쓰는 곳을 확인하지 못했다.
- 절차를 `AGENTS.md` 에 그대로 두기 — 크기 효과는 측정이 엇갈리지만 공식 가이드 9곳이 절차를 빼라고 한다.
- 절차를 스킬에만 두기 — 다른 에이전트가 못 읽고, 스킬이 불리지 않는 사례가 측정됐다. 그래서 문서를 정본으로 두고 스킬은 가리키기만 한다.
- `ai-check.md` 를 경로 한정 rules 로 옮기기 — 2026-10-24 결정을 뒤집을 만큼 근거가 세지 않다.

## 근거

- 조사 151곳(겹친 것 빼면 약 130곳): 실제 프로젝트 AGENTS.md 38 · CLAUDE.md · `.claude` 설정 37 · 공식 가이드 34 · 연구 · 글 42.
- 공식 문서: Claude Code 메모리 문서는 파일당 200줄 아래, @import 는 컨텍스트를 줄이지 않음, 꼭 막을 것은 훅 · 권한으로(code.claude.com/docs/en/memory). `attribution` 이 서명 줄 설정이고 `includeCoAuthoredBy` 는 폐기(settings-reference).
- 실제 프로젝트: badlogic/pi-mono 가 동시 세션 이유로 `git stash` · `reset --hard` · `checkout .` · `clean` 을 금지. harperreed/dotfiles · getsentry/sentry 가 서명 줄을 설정으로 끔. calcom/cal.com · apache/airflow 가 「먼저 묻기 · 절대 안 함」 을 따로 절로 둠(cal.com 의 먼저 묻기 항목은 의존성 · 스키마 · 파일 삭제 · 전체 E2E). kentcdodds.com · storybook · sentry 가 절차를 문서로 빼고 언제 읽는지 적음.
- 측정: McMillan(arXiv 2605.10039, Claude Code 1,650세션)은 파일 크기 · 위치 · 구조 · 충돌의 효과가 없고 세션이 길어지는 효과가 가장 크다고 함. Vercel 실험(2026-01)에서 스킬은 기준과 같은 53%(불리지 않은 사례 56%), AGENTS.md 색인은 100%.
- 조사 시안: https://claude.ai/artifact/NDW9G9qh4UbKmUhGof78aB (비공개, 핵심 숫자는 위에 옮김)

## 바뀌는 곳

- 문서: `AGENTS.md` 「스택 · 명령」 의 e2e 줄 · 「사용자 규칙」 개발 서버 줄 · 「먼저 묻는다」 · 「하지 않는다」 · 「릴리스」, 새 문서 `docs/operations/e2e-local.md` · `docs/operations/release.md`
- 설정: `.claude/settings.json`, 새 스킬 `.claude/skills/e2e-local` · `.claude/skills/release`
