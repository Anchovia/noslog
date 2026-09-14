@AGENTS.md

# Claude 전용 메모

규칙 원본은 위의 `AGENTS.md` 하나다. 여기에 규칙을 겹쳐 쓰지 않는다 — 바꿀 규칙이 있으면 `AGENTS.md` 나
[디자인 가이드](docs/design/README.md)를 고친다.

- 외부 사이트 실측은 headless Playwright 로 한다. Browser pane 은 사이트마다 권한 요청이 떠서 쓰지 않는다.
- 비교 시안 · 검수 결과는 아티팩트로 보여 준다.
- 로그인한 화면을 볼 때는 사용자가 연결한 크롬(Claude in Chrome)을 쓰고, 끝나면 만든 탭을 닫는다.
