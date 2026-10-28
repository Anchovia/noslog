# 운영자 태그 「Admin」 없앰

- 상태: 유효
- 날짜: 2026-10-27
- 분야: 디자인 · 부품
- 고른 사람: 사용자(사용자 지시)

## 맥락

관리자 이름 옆에 기본 태그 「Admin」 이 붙고, 태그에 마우스를 올리면 용어 도움말 창(「NosLog 운영자입니다. 기여 제안을 확인하고 반영합니다.」)이 떴다. 이 창은 사용자가 고른 적이 없고, 2026-09-24 기여 2단계 구현 때 가이드 문장과 함께 들어왔다. 사용자가 태그를 지우라고 했다.

## 결정

1. 관리자도 이름 옆 라벨 규칙이 다른 사람과 같다. 역할로 붙는 태그는 없고, 기여 점수가 기준 등급 이상일 때만 「기여 Lv.N」 이 붙는다.
2. 랭킹 · 의견 · 답글 · 프로필 머리 · 채보 뷰어 작성자 줄 모두 「Admin」 을 보이지 않는다. 관리자 채보 검토 목록의 「· 운영자」 도 뺀다.
3. 이름 라벨 데이터(`NameLabel`)에서 `operator` 종류를 없앤다. 문구 `contribution.label.operator` · `operatorHelp` 도 ko · en · ja 에서 지운다.

[2026-09-25 운영자 태그 = 기본 태그 「Admin」(B3)](./archive/2026-09-10_2026-10-23.md#2026-09-25)을 대체한다.

## 고르지 않은 안

- 태그는 두고 도움말 창만 빼기 — 사용자가 태그 자체를 지우라고 했다.

## 근거

- 사용자 지시(2026-10-27).

## 바뀌는 곳

- 문서: [기능 규칙](../design/product-rules.md) 기여 · 채보 절, [태그](../design/components/tag.md), [프로필](../design/pages/profile.md), [채보 뷰어](../design/pages/chart-viewer.md)
- 코드: `features/contributions/{contribution-level.ts,schemas/contribution-label-schema.ts,server/contribution-point-service.ts,components/contribution-label.tsx,components/admin/chart-draft-review-list.tsx}` · `features/profile/components/profile-identity.tsx` · `features/music/server/chart-pattern-data.ts` · `app/(site)/music/[index]/[difficulty]/pattern/page.tsx` · `lib/i18n/message-catalogs/{ko,en,ja}.ts`
- 테스트: `tests/contribution-level.test.ts` · `tests/chart-pattern-public-page.test.ts`
