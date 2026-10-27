# 문서 중복 정리 — 결정 본문은 그대로 · 규칙은 정본 한 곳

- 상태: 유효
- 날짜: 2026-10-27
- 분야: 구조
- 고른 사람: 사용자(시안 판 1–5 모두 추천대로)

## 맥락

결정 기록이 쌓이면서 옛 값이 지금 규칙처럼 읽히는 자리가 생겼다. 「유효」 로 표시된 결정 6곳이 지금과 다른 값을 말했고, 10-23 까지의 보관 파일 머리말은 「지금도 유효한 결정만」 이라고 적혀 있었다. 가이드 「바뀐 기록」 링크 제목에도 옛 값이 남았고, 같은 규칙이 `AGENTS.md` · `ai-check.md` · 스킬에 두세 번씩 적혀 있었다. `docs/research` 16개 중 8개는 어디서도 링크되지 않았다.

## 결정

1. 결정 본문은 고치지 않는다. 일부만 바뀌면 상태 줄에 바뀐 항목 번호와 이름을 모두 적는다.
2. 보관 파일은 그 자리에 두고 머리말만 「역사 기록 · 다르면 가이드가 맞다」 로 바꾼다. 본문은 그대로다.
3. 가이드 「바뀐 기록」 링크 제목에는 무엇을 정했는지만 쓰고 값은 쓰지 않는다.
4. 규칙은 정본 한 곳에만 두고 나머지는 링크한다. 스킬은 절차 문서와 `ai-check.md` 를 가리키기만 한다.
5. 결정에 쓴 조사 원문은 그 결정의 「근거」 에 링크한다. 9월 조사는 보관 파일 머리말에서 링크한다.
6. 다시 생기지 않게 `AGENTS.md` 결정 작업 순서에 「바꾼 옛 결정의 상태 줄 · 색인 표시」 를 넣고, `tests/docs-links.test.ts` 가 세 가지를 막는다. 상태 줄과 색인 표시가 다르면, 「바뀐 기록」 링크 제목에 크기 · 색 · 토큰 값이 있으면, 어디서도 가리키지 않는 조사 파일이 있으면 실패한다.

## 고르지 않은 안

- 대체된 결정 파일 지우기(Google docguide) — 「왜 반려했나」 근거가 사라지고, 결정 기록을 지우는 곳은 조사에서 0곳이었다.
- 결정 본문을 지금 값으로 고쳐 쓰기(React RFCs) — 가이드와 결정 두 곳을 늘 같이 고쳐야 한다. AWS · Azure 는 반대로 적는다.
- 보관 파일을 리포 밖으로(MDN Museum) · 지우기(Google docguide) — 가이드 10곳 넘는 링크가 바뀌거나 9–10월 결정 이유를 리포에서 못 찾는다.
- 스킬은 겹쳐도 혼자 읽히게(GitLab docs) — 예외 목록처럼 이미 한 줄 어긋난 곳이 또 생긴다.
- 링크 없는 조사 파일 지우기 — 결정 숫자를 다시 확인할 원본이 사라진다.

## 근거

- 결정 기록: 그 자리에 두고 상태만 바꾸는 곳 실제 6(PEP · Rust RFCs · Kubernetes KEP · Swift Evolution · Ember RFCs · Backstage) · 가이드 6(Nygard · MADR · AWS · Azure · UK GDS Way · joelparkerhenderson). 옮기거나 지우는 곳 0. PEP 1 · Backstage · Azure 원문은 직접 확인했다.
- 일반 문서: 정본 하나 + 링크 실제 4(GitLab handbook · GitLab docs · Kubernetes · MDN) · 가이드 2(Google docguide · Diátaxis). Google docguide 「Duplication is Evil」 · MDN 「Retiring content」 원문 확인.
- 리포 실측: 결정 「결정」 절 193문장 중 가이드와 거의 같은 문장 16(8%) · 대체된 값이 본문에 남은 곳 17 · 보관 파일의 디자인 값 줄 중 옛 값 약 45%(표본 추정).
- 비교 시안: https://claude.ai/artifact/NRGLeCZRJ1niusrRE8NaXu

## 바뀌는 곳

- 문서: `docs/decisions/README.md` 「쓰는 법」 · 결정 상태 줄 5곳 · 보관 파일 머리말 · 가이드 「바뀐 기록」 · `AGENTS.md` 릴리스 · e2e · 확인 · 보고 줄 · `docs/ai-check.md` 예외 목록 · `docs/design/README.md` 「확인」 한 줄 · `docs/operations/e2e-local.md` 한 줄 · 스킬 3개(`noslog-check` · `e2e-local` · `release`) · 조사 링크(결정 2곳).
- 코드: `tests/docs-links.test.ts`(검사 세 개).
