---
name: noslog-check
description: NosLog 에서 바뀐 화면 · CSS · 화면 문구 · 공지 · 보고 글 · 코드를 AI 티 목록과 디자인 가이드에 대어 검사한다. 사용자가 「검수」 「AI 티」 「점검」 「AI 같다」 「/noslog-check」 라고 하거나, 화면 · 문구 작업을 끝내기 전에 쓴다. 고치지 않고 보고만 한다.
context: fork
---

# NosLog AI 티 검사

바뀐 것을 [`docs/ai-check.md`](../../../docs/ai-check.md) 32항목과 아래 참조 목록에 대어 보고, 걸린 것을 보고한다. 파일을 고치지 않는다.

## 순서

1. `git status --short` 와 `git diff --stat` 으로 바뀐 파일을 모은다. 이번 작업이 바꾸지 않은 파일(다른 세션 변경)은 따로 적고 검사하지 않는다.
2. `npx vitest run tests/ai-tells.test.ts` 를 돌려 결과를 그대로 적는다.
3. 바뀐 파일마다 해당 참조를 하나씩 대어 본다.
    - 화면 · CSS · 공용 부품 → [references/screen.md](./references/screen.md) 와 [디자인 가이드](../../../docs/design/README.md)의 해당 부품 · 화면 문서
    - 메시지 카탈로그(`lib/i18n/message-catalogs/*`) · 공지 · PR · 보고 글 · 문서 → [references/copy.md](./references/copy.md)
    - ts · tsx · 테스트 → [references/code.md](./references/code.md)
4. 걸린 것마다 한 줄: `파일:줄 · 항목 번호 · 보이는 것 · 고칠 방향`.
    - 패턴 하나만 걸린 글은 「약함」 으로 따로 둔다. 표지 하나로 AI 글이라 판정하지 않는다.
    - 인용한 화면 문구 · 고유명사 · 사용자가 쓴 문장은 고치라고 하지 않는다.
5. 아래 「NosLog 예외」 와 사용자 결정([결정 기록](../../../docs/decisions/README.md))이 참조 항목과 부딪히면 결정을 따른다.

## NosLog 예외

[AI 티 확인 — NosLog 에서 정한 예외](../../../docs/ai-check.md#noslog-에서-정한-예외)를 따른다.

## 보고 양식

```
검사한 파일 N개 (다른 세션 변경 M개는 뺌)
기계 검사: 통과 / 실패 n건
걸린 것
- app/styles/x.css:12 · A4 · 카드에 색 box-shadow · 그림자 빼고 면 단계로
약함
- …
걸린 것 없음 — 해당 항목: …
```

맺음 요약 · 칭찬 · 다짐을 쓰지 않는다.
