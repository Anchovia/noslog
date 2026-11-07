# 채보 초안 삭제 · 타이밍 순서 검사

- 상태: 유효
- 날짜: 2026-11-02
- 분야: 기능
- 고른 사람: 사용자([시안](https://claude.ai/artifact/FJS6eonT4ejvpyb6w53iPM) 1A · 2A · 3A)

## 맥락

초안을 지울 수 없어 50개가 차면 공개되기 전까지 새 곡을 열 수 없었다. 틱과 시각이 어긋난 초안은 마디 5,000 안에서 저장됐다.

## 결정

- 프로필 내 제안의 「작성 중」 · 「수정 요청」 초안 줄에 「삭제」 를 두고, 확인 창 뒤 지운다. 검토 댓글도 함께 지워지고 복구할 수 없다. 검토 요청 중인 초안은 요청을 취소한 뒤 지운다. 공개된 초안은 지울 수 없다.
- 한도 화면에 보조 버튼 「내 제안 보기」 를 더한다.
- 유저 초안은 틱 순서로 놓았을 때 시각이 거꾸로 가면 저장하지 않는다. 틱 계산값과의 일치는 보지 않는다.

## 근거

삭제 자리와 확인은 Velog 임시 글 목록을 옮겼다. 확정 버튼만 「확인」 대신 「초안 삭제」 로 썼다. 조사는 실제 서비스 30곳 · 디자인 시스템 7곳이다([조사 기록](../research/2026-11-02-draft-delete.md)). 한도 화면의 이동은 같은 화면을 확인한 서비스가 없어 근거가 약하다.

타이밍 문서를 2026-11-02 에 읽기로 쟀다. 일치 검사는 포인트 2개 이상인 문서만 대상이고, 어긋남은 0.01ms 초과다.

| 문서          | 개발 DB 어긋남 | 운영 어긋남 | 운영 최대 | 시각이 거꾸로(개발 · 운영) |
| ------------- | -------------- | ----------- | --------- | -------------------------- |
| 공개 채보     | 417개 중 0     | 420개 중 2  | 60.629ms  | 0 · 0                      |
| 에디터 작업본 | 417개 중 0     | 420개 중 2  | 60.629ms  | 0 · 0                      |
| 리비전        | 889개 중 2     | 880개 중 9  | 500ms     | 0 · 0                      |
| 유저 초안     | 2개 중 0       | 1개 중 0    | 0ms       | 0 · 0                      |

## 고르지 않은 안

- 줄의 ⋯ 뒤 확인 창(Bluesky): 줄에 글자로 보이는 삭제보다 찾기 어렵다
- 여러 개 선택(Discourse): 프로필 구역에 선택 칸이 늘어난다
- 틱과 시각 일치 검사: 운영 공개 채보 2개가 거절되고, 타이밍 포인트 추가 · 「현재 시각 사용」 같은 정상 편집의 저장이 막힌다
- 검사 없음: 시각이 거꾸로인 위조 초안이 저장된다

## 한계

어긋난 값 자체는 마디 5,000 안에서 저장된다. 포인트를 다음 포인트의 시각 너머로 옮기면 자동 저장이 「채보 형식이 올바르지 않습니다.」 로 실패한다.

## 바뀌는 곳

- 문서: [기능 규칙](../design/product-rules.md) · [프로필](../design/pages/profile.md) · [채보 에디터](../design/pages/chart-editor.md)
- 코드: `features/contributions/schemas/chart-draft-schema.ts` · `features/contributions/server/chart-draft-service.ts` · `features/contributions/components/profile-contribution.tsx` · `features/contributions/components/chart-draft-editor.tsx` · `features/music/components/delete-contribution-dialog.tsx` · `app/(site)/profile/[id]/contribution-actions.ts` · `app/(site)/music/[index]/[difficulty]/pattern/draft/page.tsx` · `lib/i18n/message-catalogs`
