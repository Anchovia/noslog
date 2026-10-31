# 개인정보 처리방침 개정 — 법정 항목 순서 · 표 · 번역 동의

- 상태: 유효
- 날짜: 2026-10-30
- 분야: 기능
- 고른 사람: 사용자(판 1 · 2 · 4 · 5 추천대로, 판 3 은 무료 등급을 유지하려고 B)

## 맥락

처리방침은 초안으로 둔 것이었다. 코드와 대조하니 실제와 다른 문장(정밀 위치를 요청하지 않음 · X 위젯 · 공개 설정 5가지 · Discord 아바타 누락)과 빠진 처리(뮤즈캣 제3자 제공 · 대리 요청, 이벤트 · 투표 · 빙고, 서열 투표 변경 기록, 신고된 글 사본 등)가 있었다.
법이 정한 항목 가운데 파기 절차 · 방법, 동의 없이 처리하는 항목과 근거의 구분, 국외 이전 7칸, 보호책임자 성명, 권익침해 구제 기관이 없었다.
무료 Gemini 번역은 Google 이 입력을 학습에 쓸 수 있어 위탁이 아니라 국외 제3자 제공에 가깝다(작성지침 126쪽 구분표).

## 결정

- 판 1 문서 구조: 개인정보보호위원회 자체 처리방침 방식. 요약 6칸(라벨링 칸을 그림 없이 글자로) → 목차 → 법정 항목 순서 15절, 처리 항목 · 제3자 제공 · 위탁 · 국외 이전 · 쿠키 · 구제 기관은 표.
- 판 2 책임자 표기: 실명 + 활동명 + 이메일(전병훈, 계롤 · Anchovia).
- 판 3 번역: 무료 등급을 유지하고, 작성자가 설정 › 공개 설정에서 「의견 · 답글 번역 허용」 을 켠 글만 보낸다. 처음 상태는 꺼짐이고 끄면 저장한 번역도 지운다. 동의 시각은 `users.translation_consent_at`.
- 판 4 변경 알림: 「방침 변경」 절에 개정 전 · 개정 후 대조표.
- 판 5 언어판: 한 문서를 세 언어로, 뜻이 다르면 한국어판을 따른다. 일본 이용자를 위해 운영자 주소는 요청 시 알린다는 줄을 넣는다.
- 함께 바꾼 코드: 탈퇴 전에 뮤즈캣 연결을 폐기하고 해제 알림을 보낸다. 가입 1단계에 「만 14세 이상입니다」 확인. 처리한 신고 · 뮤즈캣 요청 기록 · 끝난 파트너 알림은 6개월, 만료된 OAuth 코드 · 토큰은 하루 뒤 정리.
- 시행일은 공지 뒤 7일인 2026-11-06 으로 적었다. 배포가 늦어지면 시행일과 2026-10-28 판의 적용 끝 날을 함께 옮긴다.

## 고르지 않은 안

- 판 1 B(무신사식 쉽게 보기 · 전문 탭) — 같은 내용을 세 언어 × 두 벌로 맞춰야 한다
- 판 1 C(Discord · Buttondown 식 문장만) — 국외 이전 7칸을 문장으로 풀면 빠뜨리기 쉽고, 한국 서비스 표본에 없었다
- 판 2 B(활동명만) — 법 제30조 제1항 제6호를 채우는지 확인하지 못했다
- 판 3 A(유료 등급으로 바꾸고 위탁으로 적기) — 사용자가 무료 등급 유지를 골랐다
- 판 4 B(이전 판 링크만) — 표준 개인정보 보호지침 제21조의 변경 전후 비교 공개를 채우지 못한다
- 판 5 B(일본 이용자 부칙) — 처리 내용이 나라마다 같아 본문을 되풀이하게 된다(근거 3곳)

## 근거

- 실제 서비스 42곳 처리방침을 headless Playwright 로 열었다. 법정 순서 번호 절 + 목차 + 표 13곳(네이버 · 카카오 · 토스 · 당근 · 쿠팡 · 배민 · 무신사 · 넥슨 · 스마일게이트 · 넷마블 · 크래프톤 · 디시 · 인벤), 라벨링 3곳(카카오 · 배민 · 무신사), 쉬운 판 6곳, 개정 전후 비교 무신사.
- 템플릿 · 공식 9곳: 개보위 자체 처리방침 · 개인정보 포털 · GOV.UK · ICO 2 · Apple · Google · Termly · 일본 개인정보보호위원회.
- 법령: 개인정보 보호법(2026-09-11 시행) 제15 · 17 · 21 · 22의2 · 26 · 28의8 · 30 · 31 · 37의2조, 시행령 제31조, 표준 개인정보 보호지침 제19 – 22조, 개보위 「개인정보 처리방침 작성지침」(2026.4.) 20 · 24 – 28 · 45 – 48 · 72 · 75 · 83 – 85 · 118 – 132쪽, 「생성형 AI 개발·활용 개인정보 처리 안내서」(2025.8.) 24쪽, 일본 APPI 제28 · 32 · 171조와 PPC Q&A 10-25 · 12-4.
- 수탁자 값: Vercel 개인정보 문의 privacy@vercel.com · Pro 런타임 로그 1일, PlanetScale privacy@planetscale.com · Postgres 백업 12시간마다 2일 보관, Gemini API 약관(2026-04-28) 무료 등급 학습 이용 · 사람 검토, 뮤즈캣 운영 테크클립(처리방침 musecat.app/community/privacy) — 각 회사 공식 문서.
- 변호사 검토가 아니어서 「법률 검토 대기」 상자 하나를 남긴다.

## 바뀌는 곳

- 문서: `docs/design/pages/privacy.md` 구성 · `docs/design/pages/settings.md` 공개 설정 · `docs/design/pages/onboarding-login.md` 1단계 · `docs/design/product-rules.md` 의견 번역 · 데이터 보관
- 코드: `features/privacy/content/policyCopy.json` · `versions/2026-10-28.json` · `privacy-content.ts` · `privacy-copy-schema.ts` · `privacy-page.tsx` · `app/styles/announcements.css`, `prisma/schema/users.prisma` · `prisma/migrations/20261030090000_user_translation_consent`, `features/music/server/community-translation.ts` · `community-data.ts` · 의견 · 답글 줄, `features/settings/*`, `features/profile/schemas/profile-settings-schema.ts` · `onboarding-form-view.tsx`, `features/profile/server/account-deletion-service.ts`, `lib/privacy-retention.ts`, 메시지 카탈로그 ko · ja · en
