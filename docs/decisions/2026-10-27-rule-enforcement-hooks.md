# 규칙 강제 훅 — 한국어 답 · 매 메시지 규칙 파일 원문

- 상태: 유효
- 날짜: 2026-10-27
- 분야: 구조
- 고른 사람: 사용자(사용자 지시 — 매 메시지 규칙 파일 원문 · 한국어 설정 · 한국어 검사)

## 맥락

[에이전트 지시 파일 정비](./2026-10-27-agents-md-review.md) 세션이 길어지자 에이전트가 「답은 한국어」 와 「작업 하나 = 세션 하나」 를 어기고 영어로 답했다. 글로 쓴 규칙은 긴 세션에서 결국 무시되므로, 설정과 훅으로 강제한다.

## 결정

1. `.claude/settings.json` 에 `"language": "korean"` 을 둔다.
2. Stop 훅 `.claude/hooks/check-korean.mjs` 가 마지막 답에서 코드 블록 · 인라인 코드 · 인용 줄 · URL 을 뺀 글자 중 한글 비율이 20% 아래이고 글자가 40자 이상이면 막고, 한국어로 다시 쓰게 한다. 이미 한 번 막은 뒤(`stop_hook_active`)에는 막지 않는다.
3. UserPromptSubmit 훅 `.claude/hooks/turn-context.mjs` 를 `AGENTS.md` 와 `docs/ai-check.md` 에 하나씩 건다. 훅마다 그 파일 원문 전체를 `additionalContext` 로 넣는다. Claude Code 는 훅 출력 문자열 하나가 10,000자를 넘으면 2,000자 미리보기만 넣고, 이 한도는 훅마다 따로 잰다. 그래서 파일마다 나누고, 파일이 한도를 넘으면 훅이 결정 4 대로 실패해 알린다. 훅에 규칙 문장을 따로 적지 않는다. 정본은 그 파일들이다.
4. 두 훅은 리포에 아무것도 쓰지 않는다. 실패하면 stderr 로 알리고 exit 1 로 끝내 세션은 막지 않는다. 판정 함수는 `.claude/hooks/rules.mjs` 에 두고 `tests/rule-enforcement-hooks.test.ts` 가 검사한다.

## 고르지 않은 안

- 글 규칙만 더 세게 쓰기 — 이미 `AGENTS.md` 첫머리에 있었는데도 어겼다.
- 요약한 핵심 네 줄만 매 턴 넣기 — 원문이 아니라 정본이 둘이 되고, 네 줄만 강조돼 나머지 규칙이 가벼워진다. 사용자가 원문 전체를 매번 읽게 하라고 했다.
- 훅 하나로 원문 전체 주입 — `CLAUDE.md` 를 `@` 임포트까지 펼치면 13,000자 남짓(22KB)이라 10,000자 한도에 걸려 2,000자 미리보기(앞 25줄)만 들어갔다.
- 매 메시지 「Read 로 두 파일을 읽어라」 지시 — 같은 세션에서 바뀌지 않은 파일을 다시 Read 하면 Claude Code 가 내용 대신 「Wasted call — file unchanged since your last Read」 만 돌려줘 원문이 다시 들어가지 않는다. 훅으로는 도구 호출을 강제할 수도 없다.
- 긴 세션이면 새 세션 제안 줄 넣기 — 사용자가 매 메시지 원문 주입 하나만 하라고 했다.
- 중간 안내까지 Stop 훅으로 판정 — 이미 보인 글은 고칠 수 없다. 중간 안내는 매 턴 규칙 줄과 `language` 설정에 맡긴다.

## 근거

- 측정: 이 리포 세션 기록 45개, 글자 40자 이상인 assistant 메시지 8,322개.
    - 한글 비율 분포가 둘로 갈린다. 영어 답은 1,127개 중 1,126개가 0.18 이하, 한국어 답은 가장 낮은 것이 0.24(영어 인용 · 번역 표가 많은 답). 기준 0.2 에서 한국어 답을 막은 경우 0개, 놓친 영어 답 1개(한국어 결과 값을 많이 옮긴 답).
    - 영어 비율은 같은 컨텍스트 안에서는 토큰과 상관이 없다(압축 전 0–300k 7.8% · 300–500k 3.0% · 500–700k 6.9% · 700k 넘음 8.1%). 압축 횟수와는 함께 오른다(0회 6.5% · 1회 10.7% · 2회 29.4%).
    - 기록 파일 크기로 보면 10MB 아래 5.2–5.6%, 10–15MB 11.4%, 15–30MB 18.7–22.1%. 토큰 500k 또는 10MB 를 기준으로 하면 넘지 않은 메시지 1,241개의 영어 비율 5.1%, 넘은 메시지 7,081개 15.0%.
    - 턴당 컨텍스트 중앙값 571k(4,493턴). [Claude 효율 결정](./2026-10-24-claude-efficiency.md) 측정의 515k 와 같은 구간이다.
- 연구: McMillan(arXiv 2605.10039, Claude Code 1,650세션)은 준수율을 가장 크게 떨어뜨린 것이 세션 길이라고 한다.
- 공식 문서: Claude Code 메모리 문서는 CLAUDE.md 를 권고로 보고, 반드시 막을 것은 훅 · 권한으로 하라고 한다(code.claude.com/docs/en/memory). Stop 훅 입력의 `last_assistant_message` · `stop_hook_active` 는 설치된 Claude Code 2.1.308 의 입력 스키마에서 확인했다.
- 공식 문서: 훅 문서는 `additionalContext` 한도를 10,000자로 두고, 같은 이벤트에 훅이 여럿이어도 문자열마다 따로 재며 모든 값이 Claude 에게 간다고 한다(code.claude.com/docs/en/hooks).
- 실측: 샘플 입력으로 영어 답 막음 · `stop_hook_active` 일 때 통과 · 한국어 답 통과 · 433MB 기록에서 0.04초 · 깨진 입력에서 stderr 와 exit 1. turn-context 출력은 `AGENTS.md` 6,854자 · `docs/ai-check.md` 6,473자.

## 바뀌는 곳

- 문서: `AGENTS.md` 「일하는 방식」 한 줄
- 설정: `.claude/settings.json`(`language` · `hooks`)
- 코드: `.claude/hooks/rules.mjs` · `.claude/hooks/check-korean.mjs` · `.claude/hooks/turn-context.mjs`, 테스트 `tests/rule-enforcement-hooks.test.ts`
