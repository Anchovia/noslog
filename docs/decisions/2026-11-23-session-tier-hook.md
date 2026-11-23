# 세션 3층 강제 훅 — start_session 호출을 검사해 막음

- 상태: 유효
- 날짜: 2026-11-23
- 분야: 구조
- 고른 사람: 사용자(사용자 지시 「규칙은 강제다, 강제를 하라」 · 「만들어」)

## 맥락

[세션 3층](./2026-11-23-session-tiers.md)이 `AGENTS.md` 에 있는데도 master 가 Opus 세션 하나에 판 대조와 9개 재게시를 통째로 맡겨 토큰을 낭비했다. 글로 쓴 규칙은 어겨졌으므로 [규칙 강제 훅](./2026-10-27-rule-enforcement-hooks.md)과 같이 훅으로 막는다.

## 결정

1. `.claude/settings.json` 의 `PreToolUse` 에 matcher `mcp__ccd_session__start_session` 으로 `.claude/hooks/session-tier.mjs` 를 건다.
2. `proposal_id` 가 있는 호출(이미 만든 제안을 「New session」 카드로 시작)과 `initiation: "offer"` 는 통과시킨다. `prompt` · `background` 가 함께 와도 같다. 카드에서 사용자가 model 을 고르므로 호출에 넣을 수 없다.
3. 그 밖의 호출에서 `model` 이 비어 있으면 막는다.
4. `model` 에 `opus` 가 있고 `prompt` 에 손작업 낱말(게시 · 다시 게시 · 판 조립 · 판을 만들 · 캡처 · 찍 · 실측 · publish)이 있는데 `prompt` 에 「Sonnet 세션」 이 없으면 막는다.
5. 막을 때는 종료 코드 2 와 한국어 stderr 로 이유를 알린다. 훅이 스스로 실패하면 기존 훅처럼 exit 1 로 세션을 막지 않는다. 판정 함수 `judgeSessionTier` 는 `.claude/hooks/rules.mjs` 에 두고 `tests/rule-enforcement-hooks.test.ts` 가 검사한다.

## 고르지 않은 안

- 규칙 문장만 더 세게 쓰기: 이미 `AGENTS.md` 에 있었는데도 어겼다.

## 근거

- 사용자 지시(2026-11-23): 「규칙은 강제다, 강제를 하라」.
- 낱말 검사라 오탐이 있을 수 있다(예: 「찍」). 막히면 지시문에 위임 문장을 넣거나 model 을 Sonnet 으로 하면 된다.

## 바뀌는 곳

- 문서: `AGENTS.md` 「일하는 방식」 의 훅 줄
- 설정: `.claude/settings.json`(`hooks.PreToolUse`)
- 코드: `.claude/hooks/session-tier.mjs` · `.claude/hooks/rules.mjs`, 테스트 `tests/rule-enforcement-hooks.test.ts`
