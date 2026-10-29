# 올림 전수 조사 — 가이드대로 고친 곳

- 상태: 유효
- 날짜: 2026-10-29
- 분야: 디자인 · 기초값
- 고른 사람: 사용자(시안의 「가이드대로 고칠 곳」 사용자 화면 목록을 가이드대로 고치기)

## 맥락

올림 · 누름 · 키 포커스 전수 조사(400항목)에서 가이드에 이미 규칙이 있는데 코드가 따르지 않는 사용자 화면 13곳이 나왔다. 새 모양을 정하지 않고 가이드 쪽에 맞췄다.

## 결정

1. 오락실 목록 줄(뮤즈캣 결과)은 공용 올림 면(`nl-hover-layer`, `surface/control-hover`) 대신 폭이 꽉 찬 목록 줄 올림 `interaction/row` 겹침이다. 누름 · 키 포커스도 같다.
2. 오락실 상세 뮤즈캣 공지 줄의 넓힌 올림 면은 서열표 · 빙고 줄처럼 모서리 `radius/control` 이다.
3. 사진 뷰어 닫기 · 넘김(미디어 위 버튼)은 올림 · 누름 · 키 포커스에 면 `surface/control-hover` · 글자 `content/strong` 이다. 썸네일은 누르는 사진이라 [판 3](./2026-10-29-photo-link-hover.md) 대로 반응 없음.
4. 마크다운 입력 읽기 전용은 입력칸 읽기 전용과 같이 경계 투명 · 면 `surface/surface` 이고 올림 경계가 바뀌지 않는다.
5. 단위 입력은 숫자 칸의 브라우저 기본 ▲▼ 를 숨긴다.
6. 푸터 링크는 단독 링크처럼 올림 · 누름 · 키 포커스에 밑줄 · `content/strong` 이다.
7. 검정 급 셀렉트 목록은 다른 셀렉트처럼 마우스로 열면 키보드 위치 표시(면 · 포커스 선)를 그리지 않는다(`lib/input-modality`).
8. 고르기 창 줄(선호 오락실 · 고정 기록)의 키보드 위치 면도 마우스로 연 창에서는 올리기 전까지 칠하지 않는다.
9. 홈 진행 중 이벤트 카드는 누르는 카드라 올림 · 누름 · 키 포커스에 그림자 `--nl-overlay-shadow` 다(제목 밑줄은 그대로).
10. 수치 띠 스토리의 아래 칸을 실제 화면과 같은 `nl-action-group` 칸으로 바꾼다.
11. 오락실 「영업시간」 펼침 줄의 키 포커스 선은 넓힌 면 안쪽(−2)에 긋는다.
12. 홈 공식 소식 이름 링크는 단독 링크(`nl-link`)다. 평소 밑줄이 없고 올림 · 누름 · 키 포커스에 밑줄 · `content/strong` 이다. 글 안 링크는 늘 밑줄 그대로다.

## 고치지 않은 것

- SelectionList(필터 레일 체크 목록) · 고르기 창 줄의 안쪽 여백은 가이드에 값이 없다(filter.md 는 줄 높이 · 줄 사이만, menu.md 의 「안쪽 12」 는 메뉴 행). 실측하면 두 변형 모두 안쪽 0 이고, 12 를 넣으면 레일 제목과 줄 맞춤이 바뀌어 새 시각 결정이 된다. 정하려면 시안이 필요하다.

## 근거

- 조사 400항목 · 빠진 것 0 대조, 항목마다 캡처를 열어 판정했다.
- 가이드: `foundations.md` 「색 규칙」 단독 링크 · 「포커스」(넓힌 줄 · 키보드일 때만) · 「올림 · 누름」 표, `button.md` 미디어 위 버튼, `field.md` 읽기 전용 · 단위 입력, `surface-card.md` 누르는 카드, `stat-strip.md` 동작 칸.

## 바뀌는 곳

- 문서: 없음(가이드에 이미 있는 규칙)
- 코드: `app/styles/arcades.css` · `foundation.css` · `layout.css` · `exams.css` · `home.css`, `components/ui/markdown-editor.tsx` · `stat-strip.stories.tsx`, `features/musecat/components/musecat-list-row.tsx`, `features/exams/components/exam-navigation.tsx`, `features/settings/components/arcade-picker.tsx`, `features/profile/components/pinned-records-picker.tsx`, `features/home/components/official-x-post-article.tsx`
