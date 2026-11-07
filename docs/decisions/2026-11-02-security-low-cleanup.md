# 보안 낮음 · 참고 항목 중 동작을 바꾸지 않는 것을 정리

- 상태: 유효
- 날짜: 2026-11-02
- 분야: 기능
- 고른 사람: 사용자(정식 배포 전 보안 마무리 지시. 동작이나 데이터 의미가 바뀌는 항목은 고치지 않고 보고)

## 맥락

앞선 보안 보고서의 낮음 · 참고 항목을 현재 코드와 대조하니 정상 요청의 결과를 바꾸지 않고 고칠 수 있는 항목이 남아 있었다.

## 결정

- 채보 댓글 목록 · 초안 · 댓글 액션의 id 인자는 양의 정수만 받는다.
- 공개 프로필 응답에서 쓰지 않는 역할을 뺀다.
- OAuth token · revoke 는 같은 파라미터가 반복되거나 본문이 8KB 를 넘으면 `invalid_request` 다.
- 파트너 알림 잠금은 한 번 처리의 최악 시간보다 긴 300초다.
- 뮤즈캣 `/me` 는 2xx 와 문자열 `sub` 만 받는다. 고장 신고 사진은 업로드와 같은 세 형식만, 기체 편집 인자는 스키마로 검사한다.
- 다른 사이트의 링크로 Discord 인증을 시작하지 않는다. Discord 호출은 10초에서 끊는다.
- 동기화가 반려 · 반영된 곡 후보를 대기로 되돌리지 않는다.
- 옛 서열표 주소는 공개된 표의 범위만 따른다. CSP 보고의 지시 이름은 64자까지 남긴다. CSV 수식 접두에 탭 · CR 을 더한다.
- 메타 referrer 를 헤더와 같은 `strict-origin-when-cross-origin` 으로, `p.eagate.573.jp` 이미지 최적화를 `/game/` 아래로 좁힌다.

## 고르지 않은 안

- HSTS preload · `__Host-` · COOP: 되돌리기 어렵거나 전원 로그아웃 · 팝업 영향이 있어 이번에 넣지 않았다
- `APP_URL` 필수화: 운영 값을 볼 수 없어 배포 실패 위험이 있다

## 바뀌는 곳

- 문서: [기능 규칙](../design/product-rules.md)의 인증 절
- 코드: `features/contributions` · `features/partner/server` · `features/musecat/server` · `app/(auth)/discord` · `lib/services/music/catalog-sync.ts` · `next.config.mjs`
