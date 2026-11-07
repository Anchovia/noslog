# 설정 글자 계층 — 값 · 닉네임 라벨 · 목록 요약

- 상태: 유효
- 날짜: 2026-11-01
- 분야: 디자인 · 화면
- 고른 사람: 사용자(추천대로)
- 시안: https://claude.ai/artifact/DstYZpKJb8xgReYMPJmnT8

## 맥락

프로필 플레이어명 값이 16 인데 라벨은 14 라 값이 더 컸고, 셀렉트 값 14 · 뮤즈캣 값 12 로 값 크기가 제각각이었다. 10-28 에 본문을 16 으로 정한 뒤에도 값이 본문 클래스를 그대로 쓴 탓이다.
닉네임 라벨만 다른 줄 라벨과 달리 흐렸고, 첫 목록은 이름 · 요약이 모두 16 이라 구분이 약했다.

## 결정

- 설정 줄의 값과 저장 상태는 `control` 흐림(14, `content/subdued`)이다. 뮤즈캣의 「보냄」 만 `control` 에 `content/default` 다.
- 설정 줄 목록 안의 닉네임 라벨은 `content/default` 다. 공용 `FormField` 와 창 안 폼은 그대로다.
- 1056 미만 첫 목록의 요약은 `metadata` 흐림이다. 이름은 `entity-title` 그대로다.

입력칸 글자 16 은 iOS 확대 방지값이라 유지한다. 버튼 · 셀렉트 · 쪽 제목 · 줄 라벨과 설명은 바꾸지 않는다.

## 고르지 않은 안

- 값을 라벨보다 작은 `metadata` 흐림으로(velog · Android 방식) — 셀렉트 값 14 와 크기가 벌어진다.
- 닉네임 라벨을 흐린 채 두기(Spectrum · Carbon 방식) — 같은 목록의 다른 줄 라벨과 색이 달라진다.
- 요약을 이름과 같은 16 으로 두기(Canva · Mastodon 방식) — 상세 줄의 14 / 12 와 단계가 달라진다.

## 근거

- 실제 서비스 15곳을 판정했다. 값 = 라벨 8곳(Google 검색 설정 · Bluesky · Steam · Mastodon · osu! · GitHub · Canva · Linear), 값 < 라벨 4곳(velog · DuckDuckGo · Brave Search · Android), 값 > 라벨 2곳(Misskey · Gitea, 둘 다 입력칸 글자)이다. 15곳 중 1곳은 판정 표에 넣지 않았다(Signal, 값 글자를 확인하지 못함).
- 디자인 시스템 4곳은 값 = 라벨 2곳(Primer · Polaris), 값 > 라벨 2곳(Carbon · Spectrum, 입력칸 글자)이다.
- 고른 안의 직접 근거는 판마다 3곳 안팎이라 근거 약함이다. Discord · Slack · Notion · 네이버 · 카카오 · 당근은 미확인이다.
