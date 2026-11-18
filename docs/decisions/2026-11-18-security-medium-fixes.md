# 웹 취약점 점검 중간 항목 — 사진 픽셀 상한 · 동기화 토큰 먼저 확인 · 설정 저장 한도

- 상태: 유효
- 날짜: 2026-11-18
- 분야: 기능
- 고른 사람: 사용자(점검 보고의 중간 항목을 고치라는 지시)

## 맥락

CSRF · XSS · SQL 주입 · 명령 주입 · SSRF · 클릭재킹 · 세션 고정 · 경로 탐색 · 업로드 · IDOR · 오픈 리다이렉트 · DoS 열두 항목을 지금 코드에 대어 봤다. 치명 · 높음은 없었고 중간 넷 가운데 코드로 고칠 수 있는 셋을 고쳤다.

## 결정

1. 서버가 촬영 정보를 지우는 사진은 가로 × 세로가 4096 × 4096 픽셀을 넘으면 풀지 않고 거절한다. 4MB 안쪽 파일로도 아주 큰 그림을 만들 수 있어, 풀다가 함수가 메모리 초과로 죽을 수 있었다.
2. 동기화 · 자켓 수신은 토큰 서명을 먼저 보고, 맞을 때만 본문 전체를 검사한다. 전에는 `Origin` 헤더만 맞으면 로그인 없이 보낸 8MB 본문에도 스키마 검사를 돌렸다.
3. 프로필 · 공개 설정 저장과 선호 오락실 설정 · 해제는 합쳐서 사람당 5분 300회다. 이 저장들은 랭킹 · 오락실 공용 캐시를 비우는데 한도가 없어, 한 계정이 반복하면 공개 화면이 계속 캐시 없이 그려졌다.

## 고르지 않은 안

- 1번에서 sharp 기본 상한(약 2.68억 픽셀)을 그대로 두기: 한 장에 1GB 가까이 쓸 수 있다
- 2번에서 토큰을 요청 헤더로 옮겨 본문을 읽기 전에 거절하기: 북마클릿과 CORS 허용 헤더를 함께 바꿔야 한다. 본문 읽기와 JSON 해석 비용은 그대로 남는다
- 3번에서 값이 바뀔 때만 캐시를 비우게 하기: 이미 그렇게 한다. 켰다 껐다 하면 매번 바뀐다

## 근거

- 1번: 값은 공유 카드 아바타의 `MAX_AVATAR_INPUT_PIXELS` 와 같다. 브라우저는 올리기 전에 긴 변 2048 로 줄이므로(`lib/uploads/client-image-upload.ts`) 정상 업로드는 닿지 않는다. 휴대폰 12MP 사진(4032 × 3024)도 안쪽이다
- 3번: 5분 300회는 [2026-11-02 결정](./2026-11-02-security-choices.md)의 이벤트 저장 한도, 넘을 때 문구는 `common.tooManyRequests` 다. 새 값 · 새 문구를 만들지 않았다
- 남긴 것: 네 번째 중간 항목(DB 문장 시간 제한 · 함수 실행 시간)은 고치지 않았다. 연결 옵션으로 `statement_timeout` 을 넘기면 개발 DB 풀러가 연결을 거절한다(`unsupported startup parameter in options: statement_timeout`). 운영도 PgBouncer 주소를 쓴다

## 바뀌는 곳

- [기능 규칙](../design/product-rules.md)
- `lib/uploads/strip-image-metadata.ts` · `app/api/receivePlayerData/route.ts` · `app/api/receiveJacket/route.ts` · `features/sync/schemas/sync-request-schema.ts` · `lib/upload-rate-limit.ts` · `features/settings/server/settings-save-service.ts` · `features/arcades/server/preferred-arcade-service.ts`
