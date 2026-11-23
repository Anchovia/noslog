# 세션 운영 — 층 이름 · 지시문 다섯 칸 · 독립 검수 · 바로 위 층 호출 · 훅 강제 · Sonnet 직접 개설 금지

- 상태: 유효
- 날짜: 2026-11-23
- 분야: 구조
- 고른 사람: 사용자(판 1–6 추천 중 판 1 은 C, 나머지는 A 를 고름. 판 7 은 보류)

## 맥락

[세션 3층](./2026-11-23-session-tiers.md)과 [강제 훅](./2026-11-23-session-tier-hook.md)은 모델 칸과 손작업 낱말만 봤다. 지시 양식 · 검수 · 호출 경로 · Sonnet 이 Sonnet 을 여는 일은 글 규칙뿐이었다. 사용자는 「규칙은 강제다」 를 원하고 실제 회사 · 멀티 에이전트 사례를 조사한 판 7개([조사](../research/2026-11-23-team-orchestration.md) · [사내 스킬 조사](../research/2026-11-23-company-skills.md))에서 골랐다. 사이드바 세션에는 서브에이전트 프런트매터가 걸리지 않으므로 층 강제는 훅으로만 한다.

## 결정

1. 층 이름(판 1 C, Anthropic 멀티 에이전트 리서치 글): master = lead, 조사 = worker, 조사 취합 = 검증 전용. 판 설계서는 지금처럼 조사 취합이 쓴다. 훅은 이름과 상관없이 아래 항목으로만 강제한다.
2. 지시문 다섯 칸(판 2 A, 같은 글의 subagent 지시 요소): `start_session` 의 `prompt` 에 `목적:` · `출력 형식:` · `도구와 출처:` · `범위 경계:` · `투입 한도:` 줄 머리가 하나라도 없으면 막는다. 양식은 `.claude/templates/session-brief.md`(판 4 의 `위 세션:` 줄 포함, 이 줄은 검사하지 않는다).
3. 독립 검수(판 3 A, GitLab 핸드북 코드 리뷰): 쓴 세션은 자기 결과를 통과시키지 못한다. 검수 기록은 공유 폴더에 `review: <아티팩트> version=<version id> 검수=<세션 id> 쓴=<세션 id>` 한 줄로 남기고, 새 버전이 나오면 옛 기록은 무효다. Stop 훅이 보고에 아티팩트 링크가 있을 때 지금 version id 의 기록이 없거나 검수 세션이 쓴 세션과 같으면 막는다. 교착을 피하려고 세 경우는 막지 않는다: Sonnet(쓰는 쪽) 세션의 보고, 이 세션이 직접 게시한 버전(master 가 표본으로 사후 검토), 막힌 뒤 다시 멈추는 재시도(`stop_hook_active`). 판 설계서의 「검수 기준 파일은 커밋된 것만 읽음」 은 훅으로 강제하지 않고 글 규칙으로 남긴다. 기준 파일(`AGENTS.md` 등)에는 다른 세션의 커밋 안 한 변경이 늘 섞여 있어 읽기를 막으면 모든 세션이 막히고, 훅은 검수 세션과 일반 세션을 구분하지 못한다.
4. 막힘 · 에스컬레이션(판 4 A, GitLab 사고 관리 「one owner」 · 「next role in the hierarchy」): 막히면 바로 위 층에만 보낸다. `SendMessage` 훅이 받는 이가 바로 위 세션이 아니면 막는다. 위 세션은 데스크톱 앱 세션 메타 파일의 `spawnedFrom.sessionId` 로 알아낸다. 이 세션이 띄운 아래 세션 · `main` · `parent` · 서브에이전트 호출 · 세션 메타에 없는 이름(자기 서브에이전트) · 위 세션이 없는 최상위 세션은 막지 않는다. 형제 세션으로 보내는 것은 막으며 위 세션을 거친다. 투입 한도는 지시문 글로만 남는다.
5. 강제 수단(판 5 A, Claude Code hooks): 위 훅들이 그 수단이다(`start_session` · `SendMessage` PreToolUse, 검수 Stop). 모든 새 훅은 스스로 실패하면 세션을 막지 않는다. `proposal_id` 호출과 `initiation: "offer"` 는 통과한다.
6. Sonnet 직접 개설 금지(판 6 A, Claude Code agent teams 「No nested teams」): 부른 세션의 모델이 Sonnet 이면 `start_session` 을 막고 조사 취합 세션에 인원을 요청하게 한다. 조사 취합이 판단해 새 Sonnet 세션을 띄운다. 부른 세션의 모델은 기록 파일의 마지막 assistant 메시지 `model` 로 읽고, 아직 없으면 시작 때 넣는 `model` 항목, 그것도 없으면 세션 메타 파일 값을 쓴다.
7. 판 7(사내 스킬로 층 역할 두기): 보류. 써 보고 안정되면 다시 조사한다.

## 고르지 않은 안

- 판 1 A(Opus 도구 차단), B(GitLab reviewer · maintainer): 사용자가 C 를 골랐다.
- 판 2 B · C, 판 3 B · C · D, 판 4 B · C · D, 판 5 B · C · D, 판 6 B · C · D: 사용자가 A 를 골랐다. 판 4 의 투입 한도 숫자 강제(B)는 하지 않는다.

## 근거

- 사용자 선택(2026-11-23) 위 항목대로. 판 설계서와 표본은 조사 기록 두 파일에 있다.
- 한계: 검수 기록 줄은 훅이 누가 썼는지 확인하지 못한다. 검수 세션이 거짓으로 적으면 막지 못한다. 보고에 아티팩트 링크가 없으면 Stop 게이트는 보지 않는다. 세션 메타 파일은 앱이 내부적으로 두는 파일이라 앱 업데이트로 꼴이 바뀌면 위 세션 · 모델 판정을 못 해 훅이 막지 않고 넘어간다.

## 바뀌는 곳

- 문서: `AGENTS.md` 「일하는 방식」 의 master 줄 · 훅 줄, 이 결정이 바꾸는 두 결정의 상태 줄
- 설정: `.claude/settings.json`(`PreToolUse` SendMessage, `Stop`)
- 코드: `.claude/hooks/rules.mjs` · `session-tier.mjs` · `send-message.mjs` · `review-gate.mjs`, 양식 `.claude/templates/session-brief.md`, 테스트 `tests/rule-enforcement-hooks.test.ts`
