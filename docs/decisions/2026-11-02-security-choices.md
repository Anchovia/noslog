# 쓰기 한도 · OAuth 토큰 한도 · 신고 글 가리기 · 활성 연결 하나 · COOP

- 상태: 유효
- 날짜: 2026-11-02
- 분야: 기능
- 고른 사람: 사용자([시안](https://claude.ai/artifact/5xYtpNRPNX2S9qnu3KVxoo) 다섯 판 모두 추천안)

## 맥락

보안 점검에서 값이나 동작을 정해야 해서 남겨 둔 항목이다.

## 결정

- 이벤트 저장 · 자기 초안 댓글은 사람당 5분 300회다(Mastodon 계정당 한도). 기존 `upload_token_grants` 표로 센다.
- 채보 초안 저장은 같은 빠르기(초당 1회)로 막는다. 앞 저장에서 1초가 안 지났으면 거절하지 않고 남은 시간을 기다린다. 자동 저장 바로 뒤의 검토 요청이 실패하지 않고, 저장마다 행이 늘지 않는다.
- OAuth 토큰 발급은 클라이언트당 시간당 2,000개다(GitHub OAuth 토큰 요청 한도). 넘으면 429 다. 이미 있는 토큰 행을 센다.
- 운영자는 신고 카드에서 의견 · 답글을 가리고 되돌린다(Discourse 운영자 판단). 자동 숨김은 두지 않는다.
- 다시 연결한 grant 는 같은 사용자 · 클라이언트의 가장 큰 세대 + 1 이다. 활성 grant 는 부분 유일 인덱스로 하나만 둔다. 만료만 된 줄은 새 연결 때 이유 없이 닫는다.
- `Cross-Origin-Opener-Policy: same-origin-allow-popups` 를 넣는다.

## 고르지 않은 안

- GitHub 쓰기 한도(시간당 500): 자동 저장이 13분쯤 뒤 막힌다
- OAuth 를 사용자당 초당 4회(Okta)로: 전체 부하가 줄지 않는다. 전 경로 5분 300회(Mastodon): 새 표가 필요하다
- 신고 점수 자동 숨김(Discourse): NosLog 에는 신고자 신뢰 등급이 없어 계정 몇 개로 남의 글을 가릴 수 있다
- `pg_advisory_xact_lock` 으로 연결 하나: 그 함수를 지나는 경로만 막는다
- HSTS preload: 빠지는 데 수개월이 걸리고 하위 도메인 현황을 리포로 볼 수 없다. 표본 9곳 중 6곳이 쓴다
- `__Host-` 쿠키: 전원 로그아웃에 비해 막는 것이 하위 도메인 쿠키뿐이다. 표본 9곳 중 3곳이 쓴다

## 한계

OAuth 한도는 발급에 성공한 토큰만 센다. 실패한 요청과 authorize · 기록 API 는 세지 않는다. 가린 의견은 작성자가 지운 뒤 다시 쓰면 풀린다는 앞선 점검 메모가 있다.

## 바뀌는 곳

- 문서: [기능 규칙](../design/product-rules.md)의 의견 신고 절
- 코드: `lib/upload-rate-limit.ts` · `features/events/server/event-service.ts` · `features/contributions/server/chart-draft-service.ts` · `features/partner/server/oauth-service.ts` · `app/oauth/token/route.ts` · `features/feedback` · `next.config.mjs` · `prisma/migrations/20261102120000_oauth_grant_one_active`
