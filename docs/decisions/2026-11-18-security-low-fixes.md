# 웹 취약점 점검 낮은 항목 — 끼워 넣기 금지 · 콜백 state · 저장소 호스트 · 본문 이미지 · 쓰기 한도

- 상태: 유효
- 날짜: 2026-11-18
- 분야: 기능
- 고른 사람: 사용자(낮은 항목 가운데 권한 일곱 가지를 고치라는 지시)

## 맥락

[중간 항목](./2026-11-18-security-medium-fixes.md)에 이어 같은 점검의 낮은 항목을 봤다. 실제로 뚫리는 곳은 없었고, 방어 한 겹이 빠졌거나 한도가 없는 자리 일곱 곳을 고쳤다.

## 결정

1. 페이지 응답의 강제 스크립트 정책에 `frame-ancestors 'none'` 을 넣는다. 파트너 동의 화면에만 따로 걸어 둔 강제 정책이 같은 이름의 헤더에 덮여 빠져 있었다.
2. 점검 중에도 로그인 · 관리자 화면은 스크립트 정책을 받는다.
3. Discord 인증과 뮤즈캣 연결 콜백은 state 가 맞을 때만 진행 값을 지운다. 전에는 비교하기 전에 지워, 다른 사이트가 콜백 주소를 열게 하면 진행 중인 인증이 끊겼다.
4. 공유 카드가 프로필 사진을 받을 때 10초 · 4MB 상한을 둔다.
5. 이미지 주소는 우리 저장소 호스트와 정확히 같을 때만 받는다. 전에는 `blob.vercel-storage.com` 접미사만 봤다.
6. 이벤트 · 공지 글을 저장할 때 본문에 새로 들어온 이미지의 파일 머리를 본다. 올리기 토큰은 형식 선언만 확인한다.
7. 투표 표 내기, 빙고 칸 저장 · 초기화는 각각 사람당 5분 300회다. 동기화 토큰 재발급과 뮤즈캣에 보낼 항목 변경은 설정 저장 한도에 함께 센다.

## 고르지 않은 안

- Discord 로그인에 PKCE 붙이기: state 가 세션에 묶여 있어 공격 경로를 찾지 못했다
- 비로그인 입구(이미지 최적화 · 방문 통계 · CSP 보고 · 상태 확인 · 공유 이미지)에 앱 코드로 한도 걸기: 사람을 가릴 수 없어 IP 기준 한도가 필요하다. [2026-10-29 결정](./2026-10-29-security-hardening.md)대로 Vercel Firewall 이 맡는다
- 6번에서 작성자 폴더의 이미지만 받기: 화면은 공지 · 이벤트 폴더의 이미지를 모두 그린다. 그리는 범위와 같게 두고 파일 머리만 본다
- 7번에서 로그아웃에도 한도 걸기: 로그아웃을 막게 된다

## 근거

- 1번: 개발 서버에서 `/ko/authorize` 응답의 강제 정책에 `frame-ancestors` 가 없는 것을 확인했다. `X-Frame-Options: DENY` 가 모든 경로에 있어 끼워 넣기는 그동안에도 막혔다
- 4번의 값은 Discord 사진 복사와 같다(`features/users/server/discord-avatar.ts`)
- 5번: 호스트는 읽기 · 쓰기 토큰의 저장소 id 로 만든다(`next.config.mjs` 와 같은 규칙). 개발 DB 의 비공개 이미지 주소가 이 규칙으로 만든 호스트와 같은 것을 확인했다
- 7번의 값과 넘을 때 문구(`common.tooManyRequests`)는 [2026-11-02 결정](./2026-11-02-security-choices.md)의 것이다. 새 값 · 새 문구를 만들지 않았다

## 바뀌는 곳

- [기능 규칙](../design/product-rules.md)
- `proxy.ts` · `app/(auth)/discord/complete/route.ts` · `features/musecat/server/musecat-connection-service.ts` · `features/profile/server/profile-card-service.tsx` · `lib/blob.ts` · `features/events/server/event-service.ts` · `features/announcements/server/announcement-admin-service.ts` · `lib/upload-rate-limit.ts` · `features/polls/server/poll-actions.ts` · `features/bingos/server/bingo-progress-service.ts` · `features/settings/server/sync-token-service.ts` · `app/(site)/settings/partner-actions.ts`
