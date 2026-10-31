# 이용약관 신설 — 번호 조문 · 가입 체크 · 이용 허락

- 상태: 유효
- 날짜: 2026-10-31
- 분야: 기능
- 고른 사람: 사용자(판 1 – 7 추천대로)

## 맥락

처리방침은 있지만 이용약관이 없어서, 회원이 올린 의견 · 기여의 권리와 이용 허락, 비공식 고지, 금지 행위를 적은 곳이 없었다. 공개된 채보와 반영된 값은 탈퇴 뒤에도 남는데 이 사실의 동의 근거도 없었다. 가입 동의 기록도 남지 않았다.

## 결정

- 판 1 문서 모양: 처리방침과 같은 레일 목차, 좁으면 접힘(Vercel · Twitch · osu! 식). 요약 표는 두지 않는다.
- 판 2 조문: 「제 N 조」 번호 조문(카카오 · 리디 · Zenn · 메르카리 식).
- 판 3 가입 동의: 온보딩 1단계에 약관 체크를 따로 두고 시각을 `users.terms_accepted_at` 에 저장(벨로그 · Backloggd · 네이버 식). 기존 회원은 비어 있다.
- 판 4 고지: 카카오 식. 보통 15일 전, 불리하면 30일 전. 첫 시행은 이용 허락을 새로 묻는 일이라 불리한 변경으로 치고 공지 뒤 30일로 둔다. 시행일은 2026-12-01 로 적었고, 공지가 2026-11-01 보다 늦으면 시행일을 함께 옮긴다.
- 판 5 이용 허락: 네이버 식 범위 나열(저장 · 복제 · 수정 · 공중 송신 · 전시 · 배포 · 번역, 기한 · 지역 제한 없음, 무상). 당근의 광고 · 연구 개발 목적은 NosLog 에 없어 뺐다.
- 판 6 이전 판: 처리방침과 같은 `/terms/history`(Discord · Twitch · osu! 식).
- 판 7 계정 제한: 약관에 가리기 · 제한 · 해지를 적고, 실행은 운영자가 운영 DB SQL 로 한다. 이번에 기능을 더하지 않았다. 지금 코드에는 계정 정지가 없고 의견 · 답글 숨김 칸을 켜는 코드도 없다.
- 함께 고친 것: 탈퇴 설명에 남는 항목을 더했고, 처리방침 로그인 항목에 약관 동의 시각을 더했다.

## 고르지 않은 안

- 판 1 B(GitHub 식 요약 표) — 요약을 세 언어로 약관과 함께 맞춰야 하고 어긋날 위험이 있다. C(벨로그 · 리디 식 목차 없음) — 13개 조에서 바로 찾아갈 수 없다.
- 판 2 B(Discord · GitHub · 당근 식 번호 없는 제목) — 조를 짚어 말하기 어렵다.
- 판 3 A(Discord · Reddit · Linear 식 문구) — 동의 기록이 남지 않는다. C(Steam 식 나이와 한 칸) — 근거 1곳이다.
- 판 4 B(당근 · 네이버 · 넷마블 · 리디 식 언제나 7일), C(벨로그 · GitHub · Reddit 식 언제나 30일) — 불리한 변경을 구분하지 않는다.
- 판 5 A(벨로그 식 좁은 허락) — 탈퇴 뒤 남는 채보를 설명하지 못한다. C(Wikipedia 식 CC BY-SA) — 채보는 게임 원본을 옮긴 것이라 회원이 내놓을 권리가 없을 수 있다.
- 판 6 B(Qiita · note 식 개정 날짜만) — 그 시점 문장을 보여 줄 수 없다.
- 판 7 B(관리자 화면에 정지 기능) — 로그인 차단 · 세션 무효화까지 들어가는 별도 기능이다.

## 근거

- 실제 서비스 32곳을 headless Playwright 로 390 · 1440 폭에서 열고 캡처를 직접 봤다. 세로 레일 7곳(Vercel · Twitch · GitHub · Wikipedia · osu! · Stripe · Pinterest), 위쪽 펼친 목차 5곳(Discord · 카카오 · 네이버 · Spotify · Steam), 「제 N 조」 9곳(카카오 · 넷마블 · 벨로그 · 리디 · Pixiv · Qiita · Zenn · note · 메르카리, 한국 6곳 중 4 · 일본 7곳 중 5 · 그 밖 19곳 중 0), 본문 앞 요약 2곳(근거 약함), 이전 판 링크 4곳(근거 약함).
- 가입 화면 12곳: 문구 동의 7곳(Discord · Reddit · Notion · Vercel · Linear · Medium · Pinterest), 체크 5곳(벨로그 · Backloggd · Steam · 네이버 · 디시).
- 디자인 시스템 6곳: GOV.UK · USWDS · Carbon · Apple HIG · Atlassian · Material 3. 약관 전용 규칙은 없고 체크박스 · 폼 규칙만 있다.
- 다음 접속 때 다시 동의받는 화면은 로그인 뒤 화면이라 미확인이다. 기존 회원에게 계속 이용만으로 이용 허락 효력이 생기는지는 확인하지 못했다.
- 변호사 검토가 아니어서 「법률 검토 대기」 상자를 남긴다.

## 바뀌는 곳

- 문서: `docs/design/pages/terms.md` · `docs/design/pages/onboarding-login.md` · `docs/design/README.md`
- 코드: `features/terms/*` · `app/(site)/terms/*`, `features/privacy/*`(블록 · 목차 재사용, 동의 시각 항목), `components/layout/footer-links.tsx` · `app-footer.tsx` · `footer.tsx`, `features/arcades/components/arcade-discovery-page.tsx`, `features/auth/components/auth-shell.tsx`, 온보딩 폼 · 스키마 · 서비스, `prisma/schema/users.prisma` · `prisma/migrations/20261031090000_user_terms_accepted`, `app/sitemap.ts` · `lib/analytics-routes.ts` · `lib/auth-return-path.ts`, 메시지 카탈로그 ko · ja · en
