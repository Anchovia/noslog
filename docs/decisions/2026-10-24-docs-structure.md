# 문서 체계 재정비 — 가이드 나누기 · 결정 파일 · 쓰는 법

- 상태: 일부 대체됨(5번 `docs/archive/`) → [새 파일](./2026-10-27-docs-archive-removal.md)
- 날짜: 2026-10-24
- 분야: 구조
- 고른 사람: 사용자(시안 판 1 · 2 · 4 모두 추천대로)

## 맥락

디자인 가이드(616줄 · 160KB)와 결정 기록(599줄 · 200KB)이 한 파일씩이었고 여러 세션이 동시에 고쳤다. 가이드 안에서 규칙끼리 부딪히는 곳 20, 가이드와 코드가 다른 곳 41, 문서끼리 다른 곳 15, 뒤집혔는데 결정 기록에 남은 결정 17건이 나왔다. 가이드 본문에 날짜 · 결정 코드가 섞였고, 같은 코드 이름(K1 등)이 여러 결정을 가리켰다. 사용자는 「문서 초기화 수준」 이라고 했다.

## 결정

1. 가이드를 나눈다: `docs/design/README.md`(색인) · `foundations.md` · `components/`(부품마다 한 파일) · `patterns.md` · `pages/`(화면마다 한 파일). 값의 정본은 `app/styles/tokens.css` 하나.
2. 결정 기록은 결정 하나에 파일 하나(`docs/decisions/YYYY-MM-DD-이름.md`). 바뀌면 새 파일 + 옛 파일 상태만 「대체됨」. 2026-10-23 까지의 `decisions.md` 는 원문 그대로 `docs/decisions/archive/` 에 보관.
3. 문서 쓰는 법: 본문에는 지금 규칙만, 날짜 · 결정 코드 · 근거는 결정 파일로. 부품 · 화면 문서는 양식 고정. 값은 토큰 이름.
4. 기능 규칙(`product-rules.md`)은 한국어로 옮긴다.
5. 역사로만 남은 문서(9월 감사 기록 · 다른 리포 비교 · 로딩 시안)는 `docs/archive/` 로. 다른 에이전트용 지시문 · 옛 가이드 PDF 스크립트는 지운다.
6. Claude 메모리에만 있던 사용자 규칙은 리포 문서(`AGENTS.md` · `docs/ai-check.md`)로 옮긴다.

## 고르지 않은 안

- 세 파일로만 나누기 — 화면 파일이 다시 커지고 동시 수정 문제가 남는다.
- 한 파일 유지 · 내용만 정리 — 원인(한 파일에 모든 세션)이 남는다.
- 결정 기록 한 파일 + 상태 칸 — 동시 세션이 같은 파일 끝에 덧붙이는 문제가 남는다(옛 파일의 맨 위 · 맨 아래 형식 다른 줄이 그 결과).
- 부품 문서 끝 변경 표만 — 「왜」 를 적을 자리가 좁다.

## 근거

- 디자인 시스템 53곳(headless 로 메뉴 · 부품 페이지를 열어 확인): 최상위에 Components 50 · Foundations 45 · Patterns 19. 큰 결정 기록 파일 하나를 두는 곳 0. 공개 결정 기록 4곳(Primer ADR · Fluent RFC · GOV.UK · USWDS)은 결정마다 문서 하나. 버튼 페이지 42곳 중 변형 38 · 사용 지침 34 · 접근성 22 · 상태 20 · 문구 17. 원문: [조사](../research/2026-10-24-a-design-systems.md).
- 문서 방법: Nygard 「Documenting Architecture Decisions」(2011) · MADR · adr-tools · AWS · Azure(덧붙이기만 하는 기록, 결정 기록을 가이드로 쓰지 말 것) · PEP Superseded-By · IETF Obsoletes · Diátaxis(종류별로 나눔) · Google docguide(정본 한 곳) · Nogueira 2026(ADR 양식 비교 — 짧은 Nygard 양식이 가장 높음).
- 동시 수정: towncrier(조각 파일) · Primer 저장소 ADR 022 중복(연번 충돌 실례) · Microsoft Engineering Playbook(작업 ID 로 번호).
- 에이전트 지침: Claude 문서 CLAUDE.md 200줄 미만 · Gloaguen 2026(긴 저장소 개요는 성공률은 그대로, 비용만 20% 넘게).
- 문서 방법 · 동시 수정 · 에이전트 지침 원문: [조사](../research/2026-10-24-c-papers-methods.md).

## 바뀌는 곳

- 문서: `docs/design/` 전부 · `docs/decisions/` 새로 · `docs/archive/` 새로 · `AGENTS.md` · `CLAUDE.md` · 루트 `README.md` 문서 목록.
