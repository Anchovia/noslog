# 관리자 재설계가 남긴 코드 정리

- 상태: 유효
- 날짜: 2026-11-18
- 분야: 구조
- 고른 사람: 사용자(추천대로)

## 맥락

[규모에 비해 없어도 되는 코드 정리](./2026-11-18-scale-cleanup.md)에서 2026-11-17 관리자 재설계가 남긴 코드는 일부러 남겼는지 몰라 추천 없이 두었다. 같은 재설계 커밋에서 줄 부품(`*-row.tsx`)과 쪽 이동으로 대신 구현됐고 쓰는 곳이 0이라, 다시 보고 지우기로 했다.

## 결정

- 지움: 관리자 카드 7개(`exam-submission-card` · `feedback-report-card` · `feedback-status-button` · `opinion-report-card` · `opinion-report-hide-button` · `opinion-report-status-button` · `admin-user-card`).
- 지움: `Badge` 부품과 스토리. 관리자 화면도 공용 태그 `nl-tag` 를 바로 쓴다.
- 지움: 관리자 악곡 목록 무한 스크롤용 Server Action `listAdminMusic` 과 `getAdminMusicPage` · 쪽 크기 상수 · 응답 타입, 쓰는 곳 없는 `AdminSubmitButton`.
- 검색 조건 테스트는 화면이 쓰는 `getAdminMusicList` 로 옮겼다. 기대값은 그대로다.

## 고르지 않은 안

- 그대로 두기 — 재설계를 되돌릴 자리로 남긴 기록이 없고, 고아 코드가 검색 · 정리 대상에 계속 걸린다

## 근거

- 측정: 지운 파일의 import · 테스트 · e2e 참조가 0이다. 카드 쓰임은 `33b36d6b`(대기열 건수 탭) · `ac4bdca7`(목록 카드 표), `AdminSubmitButton` 은 `010f9bf9`(악곡 관리 상세 서랍)에서 사라졌다.

## 바뀌는 곳

- 문서: [태그](../design/components/tag.md) 머리 줄 · 기본 태그 절, [부품 사용](../ui/README.md)의 부품 표 · 검사 줄
- 코드: `app/admin/music/actions.ts` · `features/music/server/admin-music-list-service.ts` · `features/music/types/music-admin.ts` · `components/admin/admin-form.tsx`
