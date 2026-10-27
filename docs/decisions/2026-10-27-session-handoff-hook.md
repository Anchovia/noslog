# 세션 넘기기 — 오래 쉰 긴 세션은 훅이 알리고, 애매하면 새 세션

- 상태: 유효
- 날짜: 2026-10-27
- 분야: 구조
- 고른 사람: 사용자(시안 판 1 · 2 추천대로)

## 맥락

문서 중복 정리 세션이 사용량 한도로 멈춘 뒤 한 시간 넘게 쉬었다가 그대로 이어졌고, 뒤이은 요청도 모두 「같은 작업」 으로 판단돼 세션이 길어졌다. 「작업이 바뀌면」 에 기준이 없었고, 데스크톱 앱이 에이전트에게 「애매하면 이어지는 작업」 으로 하라고 지시해 그쪽으로 기울었다. 쉰 시간도 에이전트가 직접 따져야 걸렸다.

## 결정

1. UserPromptSubmit 훅 `.claude/hooks/session-handoff.mjs` 가 세션 기록 끝에서 마지막 답 시각과 그 답의 컨텍스트 크기(input · 캐시 읽기 · 캐시 쓰기 합)를 읽는다. 답 뒤에 압축됐으면 압축 뒤 크기를 쓴다. 75분 넘게 쉬었고 10만 토큰을 넘으면 쉰 시간 · 크기와 「이어 가지 않고 요약을 넘겨 새 세션으로 연다」 는 글을 `additionalContext` 로 넣는다. 막지는 않는다.
2. 태그로 시작하는 하네스 메시지(`<task-notification>` · `<side-sessions-event>` 등)에는 넣지 않는다. 기록이 없거나 읽지 못하면 넣지 않고, 실패는 [규칙 강제 훅](./2026-10-27-rule-enforcement-hooks.md) 결정 4 대로 stderr 와 exit 1 로 알린다.
3. 「작업이 바뀌면」 의 기준은 `AGENTS.md` 「일하는 방식」 한 곳에 둔다. 다른 기능 · 화면으로 옮길 때, 같은 실수를 되풀이할 때, 앞 내용을 무시하라고 해야 할 때는 새 세션. 방금 끝낸 일을 이어 짓기, 같은 파일을 거듭 고치기, 마지막 결과 다듬기는 이어 간다. 애매하면 새 세션이고, 앱 지시보다 이 줄이 앞선다.

## 고르지 않은 안

- 글만 두기 — 이미 `AGENTS.md` 와 [Claude 효율 결정](./2026-10-24-claude-efficiency.md)에 있었는데도 어겼다.
- 훅이 한 번 막고 사용자에게 알리기(super-token-saver block 모드) — 쉬고 돌아올 때마다 한 번 더 보내야 하고, 데스크톱 앱에서 막힌 메시지가 어떻게 보이는지 확인하지 못했다.
- 공식 문서 문장 그대로(「관련 없는 작업이면 새 세션」) — 「관련 없는」 이 지금 문제인 애매함 그대로다.
- Cursor 블로그 기준 — 애매할 때 어느 쪽인지 정하지 않아 앱 지시가 그대로 이긴다.
- LLM 훅(`type: "prompt"`)으로 작업 전환 판정 — 쓰는 공개 사례를 찾지 못했고, 대화 기록을 못 보며, 걸리면 턴을 끝내고 경고만 띄운다. 매 메시지 최대 30초 늦어진다.

## 근거

- 내장 기능: Claude Code 터미널판은 75분 넘게 쉬었고 지금 컨텍스트가 10만 토큰을 넘으면 「new task? /clear」 를 띄운다(changelog 2.1.84 idle-return, 설치된 2.1.308 번들의 `CLAUDE_CODE_IDLE_THRESHOLD_MINUTES` 기본 75 · `CLAUDE_CODE_IDLE_TOKEN_THRESHOLD` 기본 1e5). 데스크톱 앱에서 보이는지는 미확인. 기준값은 이것을 그대로 썼다.
- 공개 훅: super-token-saver `hooks/cache-expiry-check.sh`(★35)가 기록의 마지막 assistant 시각으로 쉰 시간을 재 warn 모드에서 `additionalContext` 를 넣고, 태그로 시작하는 기계 메시지는 건너뛴다. cc-sessions(★1,545)도 기록의 `message.usage` 세 값을 더해 컨텍스트 크기를 잰다.
- 기준 문장: Cline 문서 task-management 의 상황 표 6줄과 「If you're unsure, err on the side of starting fresh」 를 옮겼다.
- 공식 문서: 훅 입력에는 쉰 시간 · 컨텍스트 크기가 없고, 훅은 /clear · 새 세션을 직접 실행하지 못한다(code.claude.com/docs/en/hooks). 기록 형식은 내부용이라 버전마다 바뀔 수 있다(code.claude.com/docs/en/sessions). 그래서 읽지 못하면 넣지 않는다.
- 측정(이 리포 세션 기록 55개, 2026-10-27): 33개 세션이 1시간 넘게 쉰 뒤 이어졌다(메시지 277개). 75분 · 10만 토큰 조건이면 31개 세션 · 메시지 239개.

## 바뀌는 곳

- 문서: `AGENTS.md` 「일하는 방식」 세션 줄
- 설정: `.claude/settings.json` UserPromptSubmit 훅 한 줄
- 코드: `.claude/hooks/rules.mjs`(`judgeHandoff` · `lastTurnState` · `isMachinePrompt`) · `.claude/hooks/session-handoff.mjs`, 테스트 `tests/rule-enforcement-hooks.test.ts`
