# 뮤즈캣 오류 처리와 초안 화면 GET 쓰기

- 상태: 유효
- 날짜: 2026-11-02
- 분야: 기능
- 고른 사람: 사용자(보안 점검 후속 지시, 정할 값이 없는 항목)

## 맥락

보안 점검에서 뮤즈캣 오류 처리 3건을 재현했고, 채보 초안 페이지가 GET 에서 DB 에 쓰고 있었다. 다른 사이트의 링크로 열어도 초안이 생기거나 공개가 끝난 초안이 되돌아갔다.

## 결정

- 뮤즈캣 token 호출이 시간 초과되면 콜백은 500 대신 `error_token_exchange` 로 돌아간다.
- 토큰 갱신 결과는 연결이 아직 `active` 일 때만 저장한다. 갱신 중에 끊었으면 성공 토큰도 실패 상태도 쓰지 않고, 그 요청은 `not_connected` 다.
- 뮤즈캣이 401 을 주면 그 세대의 연결을 `needs_reconnect` 로 바꾼다. 그 사이 다시 연결한 새 세대는 건드리지 않는다.
- 다른 요청이 갱신 중(`busy`)이면 연결 안 됨이 아니라 다시 시도 안내(`failed`)다.
- 초안 페이지 GET 은 읽기만 한다. 고칠 초안이 없으면 화면이 서버 액션으로 열어 에디터를 그린다. 첫 진입에만 그 시간만큼 빈 화면이 낀다.

## 고르지 않은 안

- 첫 저장 때 행 만들기: 곡 상세의 「내 초안」 표시와 초안 댓글이 행을 전제로 해서 보이는 동작이 바뀐다
- 에디터 안에서 행 없이 시작: 에디터 셸을 고쳐야 한다

## 바뀌는 곳

- 문서: [기능 규칙](../design/product-rules.md)의 기여 3단계 · 뮤즈캣 협업 절
- 코드: `features/musecat/server` · `features/contributions/server/chart-draft-service.ts` · `features/contributions/components/chart-draft-editor.tsx` · `app/(site)/music/[index]/[difficulty]/pattern/draft/page.tsx`
