# AI 문서 운영 — 임포트 · 메모리 정리 · deny · 링크 검사

- 상태: 유효
- 날짜: 2026-10-24
- 분야: 구조
- 고른 사람: 사용자(시안 판 1–6 추천대로)

## 맥락

다른 서비스가 AI 를 잘 쓰려고 AGENTS.md · CLAUDE.md · 문서 · 폴더를 어떻게 관리하는지 조사했다. 우리 뼈대(AGENTS.md 정본 + CLAUDE.md 는 `@AGENTS.md` + 화면 규칙은 가이드 · 이유는 결정 기록)는 공식 예시 · 이름 있는 저장소 다수와 같았다. 어긋난 곳은 넷이었다. ai-check 를 글로만 불렀고, Claude 메모리가 AGENTS.md 와 절반쯤 겹쳤고, 「하지 않는다」 를 글로만 막았고, 낡은 문서를 잡는 장치가 없었다.

## 결정

1. `CLAUDE.md` 에 `@docs/ai-check.md` 를 더해 매 세션 싣는다. AGENTS.md 의 「읽는다」 줄은 다른 도구용으로 둔다.
2. Claude 메모리에서 리포 문서에 이미 있는 규칙 22개를 지운다. 메모리에는 리포에 없는 것(진행 상태 · 시안 링크 · 외부 도구 사용법 · 반려 기록)만 둔다. 메모리에만 있던 세부 셋(한국어 범위 · Renovate · 범위 줄이는 안 금지)은 AGENTS.md 해당 줄로 옮겼다.
3. 여러 단계 절차(e2e · 릴리스 · 시안)는 AGENTS.md 에 그대로 둔다.
4. git 에 올리는 `.claude/settings.json` 의 `permissions.deny` 로 에이전트의 `git add` · `git commit` · `git push`, `prisma migrate reset` · `prisma db push` · `--accept-data-loss`, `.env.production.local` 읽기를 막는다.
5. `tests/docs-links.test.ts` 가 문서의 상대 링크 · `CLAUDE.md` 임포트 · 백틱 안 리포 경로 · 결정 목록과 결정 파일의 짝을 `npm test` 에서 검사한다. 조사 · 분석 · 결정 기록은 그날의 경로를 적은 것이라 백틱 경로 검사에서 뺀다.
6. 동시 세션은 같은 체크아웃에서 돌린다. 커밋 묶음을 줄 때 아직 추적되지 않은 다른 세션 파일을 불러오지 않는지 본다.

## 고르지 않은 안

- ai-check 를 경로 규칙(`.claude/rules` 의 `paths`)으로 — 보고 글 · 시안 · 공지 문구에는 안 걸리고 정본이 둘이 된다.
- 메모리 그대로 — AGENTS.md 를 고쳐도 메모리의 옛 문장이 남아 부딪힌다.
- 릴리스 · e2e 를 스킬로 — 스킬이 불리지 않는 경우가 측정됐고(Vercel) 다른 도구는 Claude 스킬을 모른다.
- PreToolUse 훅 — 스크립트 관리 부담, 우회 · 오탐 보고.
- 세션마다 worktree — worktree 변경은 사용자의 localhost:3000 에 안 보여 화면 실측이 막히고, 브랜치 합치는 일이 사용자에게 는다.

## 근거

- 저장소 63개(2026-10-24 gh api): AGENTS.md + CLAUDE.md 둘 다 28 · AGENTS.md 만 17 · CLAUDE.md 만 8 · 없음 9. 둘 다 가진 28곳 중 24곳이 정본 하나로 묶음(`@AGENTS.md` 10 · 심볼릭 링크 11). 루트 파일 중앙값 137줄(최소 4 · 최대 545). 명령 89% · 다른 문서로 넘김 83% · 하지 말 것 80% · `.claude/settings` 32%.
- 공식 문서: Claude 는 CLAUDE.md 를 「강제 설정이 아니라 맥락」 이라 하고 꼭 막을 것은 `permissions.deny` · 훅으로 하라고 한다. 글로 가리킨 파일은 Claude 가 열기로 정할 때만 읽힌다. @import 는 4단계까지. 권장 200줄.
- 측정: Vercel(Next.js 16 API) 문서 없음 53% · 스킬 기본 53%(56% 사례에서 안 불림) · 스킬 + 지시 79% · 항상 실리는 AGENTS.md 색인 100%. ETH Zürich 2602.11988 사람이 쓴 파일 +2.4%(p=21%) · LLM 파일 −0.5 ~ −2% · 비용 +20%대 · 적은 도구는 과제당 1.6회 쓰임. McMillan 2605.10039(Claude Code 1,650세션 · 16,050관찰) 파일 크기 · 위치 · 나누기 · 모순은 준수율에 효과 없음, 세션이 길수록 단계마다 준수 승산 약 5.6% 하락. ZOZO 「관련 기억이 있다」 알림만 0%(110건) · 「답하기 전에 떠올려라」 65.4%(208건).
- 회사 사례 51개: 규칙을 훅 · 린터 · CI 로 강제 약 13곳, 지시 파일은 짧게 · 세부는 가리키기 약 15곳. Cloudflare 「낡은 AGENTS.md 는 없느니만 못하다」.
- 조사 원문: [`docs/research/2026-10-24-h-ai-docs-ops.md`](../research/2026-10-24-h-ai-docs-ops.md)

## 바뀌는 곳

- 문서: `CLAUDE.md` · `AGENTS.md`(시작할 때 · 사용자 규칙 · 동시 세션 · 하지 않는다 · 끝내기 전 검사) · `docs/ui/tier-change-images.md` · `docs/research/research-control-heights.md`(낡은 경로)
- 설정: `.claude/settings.json` · `.gitignore`
- 코드: `tests/docs-links.test.ts`
- Claude 메모리(리포 밖): 22개 파일 삭제
