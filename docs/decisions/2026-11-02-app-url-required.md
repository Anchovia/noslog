# 운영 배포는 APP_URL 필수

- 상태: 유효
- 날짜: 2026-11-02
- 분야: 기능
- 고른 사람: 사용자(운영 값이 있음을 대시보드에서 확인)

## 맥락

`APP_URL` 이 없으면 OAuth issuer 를 요청 헤더에서 만든다. [보안 낮음 정리](./2026-11-02-security-low-cleanup.md)에서는 운영 값을 볼 수 없어 넣지 않았다. 사용자가 Vercel Production 에 값이 있음을 확인했다.

## 결정

- `VERCEL_ENV=production` 이고 배포 주소(`VERCEL_URL`)가 있으면 `APP_URL` 이 없을 때 시작하지 않는다.

## 고르지 않은 안

- 모든 환경에서 필수: 값이 dev 브랜치 Preview 에만 있어 다른 프리뷰 배포가 멈추고, 로컬 빌드도 값을 요구하게 된다

## 바뀌는 곳

- 문서: [기능 규칙](../design/product-rules.md)의 뮤즈캣 협업 절
- 코드: `lib/env/server.ts`
