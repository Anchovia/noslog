# 앱 호스팅을 Vercel 에서 Lightsail 서울로

- 상태: 유효
- 날짜: 2026-11-17
- 분야: 구조
- 고른 사람: 사용자(추천대로)

## 맥락

Vercel Pro 는 월 $20 인데 한 달 실사용은 $4.48(2026-10-14 ~ 11-14, 크레딧 안)이라 대부분 플랫폼 이용료다. Hobby 는 5분 크론 · 비상업 조건 · Active CPU 한도(4시간, 실사용 3시간 32분) 때문에 쓸 수 없다. 2026-11-14 에 Pro 를 한 달 연장해 그 안에 옮긴다.

## 결정

- 앱은 AWS Lightsail 서울 2GB(월 $12) 한 대에서 `next start`(standalone) 로 돈다. 빌드는 GitHub Actions, 배포는 Kamal 2 로 한다.
- 파일 저장은 Vercel Blob 에서 Cloudflare R2 로, `vercel.json` 크론은 서버의 systemd timer 로 옮긴다.
- 이전은 홈페이지 개선을 배포한 뒤에 시작하고, 연장한 Pro 기간 안에 끝낸다.
- 더 싸고 안정된 방법이 생기면(예: Lambda Web Functions 서울 출시 · OpenNext 어댑터 안정) 그때 다시 본다.

## 고르지 않은 안

- Vercel Pro 유지 — 월 $20, 쓰는 양에 비해 비쌈
- Vercel Hobby — 5분 크론 배포 실패 · 비상업 조건 · CPU 한도에 가까움
- AWS Lambda + OpenNext — 무료 한도 안이라 월 약 $1 이지만, 캐시 무효화 176곳이 후기에서 가장 자주 깨진다는 부분이고, 방문이 적어 콜드 스타트(첫 응답 1–2초)가 잦고, 동적 경로 Server Action 400 이슈(#1358)가 열려 있음
- Amplify Hosting — 문서상 Next.js 15 까지, 요청 시 ISR · 스트리밍 미지원
- 백엔드를 따로 만들고 Next 를 버림 — 페이지 67 · Route Handler 33 · Server Action 34파일을 다시 짜야 하고 아끼는 돈은 월 몇 달러

## 근거

- 조사: [AWS Lambda + OpenNext 호스팅 검토](../research/2026-11-17-hosting-lambda-opennext.md)(출처 190곳). 2026-10-28 Lightsail 조사(출처 353곳)는 리포에 원문이 없고 비교표만 있다(https://claude.ai/artifact/P8VrAJg8XjabtNGNMyMPf3).
- 운영 실측(Vercel Observability): 평균 메모리 325 MB · Active CPU 월 2–3.5시간 · 전송 월 4 GB · 7일 오류 0%. Lightsail 2GB 의 CPU 기준선(2코어의 20%, 월 약 290 vCPU-시간)과 전송 3 TB 에 크게 못 미친다. 뮤즈캣 협업으로 방문이 몇 배 늘어도 한도 안이고, 모자라면 4GB($24)로 올린다.

## 바뀌는 곳 (이전 때)

- 코드: `next.config.mjs`(`output: "standalone"`) · Dockerfile · Kamal 설정 · GitHub Actions 배포 워크플로 · `@vercel/blob` 4파일 · `@vercel/analytics` · `VERCEL_ENV` · `VERCEL_URL` · `vercel.json` 크론 · CSP `img-src`
- 문서: `README.md` 「배포와 릴리스」 · 처리방침 위탁 · 국외 이전 항목(Vercel 대신 AWS · Cloudflare)
