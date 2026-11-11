# 웹 취약점 점검 남은 항목 — 커뮤니티 쓰기 한도 · 개수 상한 · 숨긴 의견

- 상태: 유효
- 날짜: 2026-11-11
- 분야: 기능
- 고른 사람: 사용자(판 1 A · 판 2 A · 판 3 A · 판 4 A)

## 맥락

[점검 수정](./2026-11-11-security-audit-fixes.md)에서 일곱 가지만 고치고 남긴 항목이다. 모두 중간 이하이고, 값을 새로 정해야 하는 것은 시안으로 골랐다.

## 결정

1. 평가 · 목표 투표 · 좋아요는 사람당 5분 300회다. 이벤트 저장과 같은 표로 세고 넘으면 같은 문구로 답한다. 답글 쓰기와 신고는 하루 한도가 따로 있어 세지 않는다.
2. 공개 전 이벤트 글은 사람당 50개까지 만든다(반려된 글 제외). 자기 초안 댓글은 24시간 50개이고 공개 채보 의견과 따로 센다. 운영자의 검토 댓글은 세지 않는다.
3. 운영자가 숨긴 의견은 쓴 사람이 평가를 지워도 줄을 남기고 내용만 비운다. 숨긴 의견의 답글에는 좋아요와 신고를 받지 않는다.
4. 온보딩 전 계정의 쓰기는 그대로 둔다.

값을 고를 일이 없어 함께 고친 것: 북마클릿 주소는 `APP_URL` 을 먼저 쓴다. Discord 인증 시작은 같은 출처 요청만 받는다. 관리자 채보 URL 칸은 http · https 만 받는다. 의견 · 초안의 id 와 offset 에 상한을 둔다. 곡 후보 전체 상한은 세기와 넣기를 한 잠금 안에서 한다. OAuth 갱신 토큰의 재시도는 하나만 새 토큰을 받는다.

## 고르지 않은 안

- 1 · 2 를 그대로 두기: 목표 투표 감사 기록과 공개 전 글이 한 계정의 반복 요청으로 계속 늘 수 있다
- 숨긴 의견이 있으면 삭제를 거절하기: 숨겨진 자기 글을 본인이 지울 수 없게 된다
- 쓰기 서비스마다 온보딩 완료를 확인하기: 스무 곳 안팎을 고쳐야 하고 확인된 문제가 없다

## 근거

- 5분 300회는 [2026-11-02 결정](./2026-11-02-security-choices.md)의 이벤트 저장 한도, 50개는 [초안 수 한도](./2026-11-02-draft-open-measure-limits.md), 24시간 50개는 공개 채보 의견 한도다. 새 값을 조사하지 않고 있는 규칙 값을 썼다.
- 4번: 빌드 기록(`server-reference-manifest.json`)에서 온보딩 화면에 묶인 서버 액션은 피드백 4개 · 언어 바꾸기 · 로그아웃 · 온보딩 2개뿐이다. Next 가 다른 쪽의 액션을 넘겨 실행할 때도 넘긴 요청이 `proxy.ts` 를 지난다. 직접 재현하지는 않았다.
- 3번은 [2026-11-02 결정](./2026-11-02-security-choices.md)의 「한계」 에 적혀 있던 것이다.

## 바뀌는 곳

- [기능 규칙](../design/product-rules.md)
- `features/music/server/community-mutation.ts` · `lib/upload-rate-limit.ts` · `features/events/server/event-service.ts` · `features/contributions/server/chart-comment-service.ts` · `features/music/server/catalog-sync.ts` · `features/partner/server/oauth-token-service.ts` · `app/(auth)/discord/start/route.ts` · `app/(site)/bookmarklet/page.tsx` · 스키마 3개
- 화면 문구 `events.limit`(ko · en · ja)
