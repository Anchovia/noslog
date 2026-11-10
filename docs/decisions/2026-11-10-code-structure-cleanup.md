# 코드 구조 정리 30항목

- 상태: 유효
- 날짜: 2026-11-10
- 분야: 구조
- 고른 사람: 사용자(추천대로)

## 맥락

코드 전체를 여섯 영역으로 나눠 읽고 구조 개선 후보 50개를 뽑았다. 같은 로직이 여러 파일에 따로 있었고, 한 파일이 여러 책임을 지는 곳과 [코드 스타일](../code-style.md)의 폴더 책임과 어긋난 자리가 있었다.

## 결정

동작 · 화면 · 데이터 의미 · 외부 계약을 바꾸지 않는 항목 가운데 테스트나 타입 검사가 받쳐 주는 30개를 했다. 테스트 기대값은 고치지 않았다.

- 지움: 테스트만 쓰던 옛 악곡 검색 · 랭킹 · 빙고 목록 모듈과 그 테스트, 쓰는 곳 없는 CSS 클래스 10개, 안 쓰는 export.
- 모음: 메트로놈 예약, 난이도 목록, 이미지 공유, 하루 한도 판정, 봉투 라우트 응답, 요청 로캘 번역기, 관리자 버튼의 실패 토스트, 승인된 번역 select, 뮤즈캣 HTTP 호출, 북마클릿 수신 라우트의 CORS, 채보 상수, DB 테스트 연결.
- 나눔: 동기화 라우트, 기여 초안 서비스, OAuth 서비스, 관리자 대시보드 집계, 서열표 · 번역 관리 서비스, `vid2bmap`, 악보 그리기, 뮤즈캣 CSS.
- 옮김: `components/{music,profile,bingo,exams}` 의 타입 · 순수 함수와 `lib` 에 남아 있던 DB 쓰는 도메인 코드를 `features/<도메인>` 으로.
- 규칙: 서버 파일에 `server-only`, cron 라우트 실패 로그, 뮤즈캣 스키마 자리, ESLint 경계 규칙을 `components` 까지.

## 고르지 않은 안

- 나머지 20개를 같이 하기 — 채보 에디터처럼 테스트가 없는 파일, 디자인 결정이 따라오는 공용 부품, 방침을 먼저 정해야 하는 항목이라 따로 고른다

## 근거

- 측정: 고치기 전 `npm test` 224파일 · 1,815개 통과, 고친 뒤 222파일 · 1,784개 통과(줄어든 31개는 지운 모듈의 테스트 30개와 없어진 lint 예외의 테스트 1개). `npm run lint` 경고 282개로 같음. `npm run build` · `npm run test:storybook` 통과.

## 바뀌는 곳

- 문서: [코드 스타일](../code-style.md)의 「Dependency boundaries」 · 「API contracts」 · 「Server Actions」 · 「Database changes」
- 코드: `app/api` · `features/*/server` · `lib/api` · `lib/hooks` · `lib/music/difficulty.ts` · `lib/daily-limit.ts` · `app/styles/musecat.css` · `eslint.config.mjs`
