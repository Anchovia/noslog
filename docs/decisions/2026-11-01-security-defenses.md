# 코드 방어 다섯 가지 — 제보 창구 · 사고 대응 · 관리자 2단계 · 세션 폐기 · 작업 기록

- 상태: 유효
- 날짜: 2026-11-01
- 분야: 기능
- 고른 사람: 사용자(추천대로)

## 맥락

방어 기법 조사의 추천 가운데 코드로 할 다섯 가지를 구현했다. 대시보드 설정은 사용자 몫이다. iron-session 은 상태가 없어 쿠키를 서버에서 끊을 수 없었고, 관리자 계정은 Discord 로그인 하나에만 기대고 있었다.

## 결정

- 제보는 GitHub 비공개 제보로 받는다. 첫 답 기한은 7일이고, 선의의 제보자에게 법적 조치를 하지 않는다. `security.txt` 는 점검 중에도 열리게 `proxy.ts` 에서 뺀다.
- 사고 순서는 점검 켜기 · 로그 내보내기 · 비밀값 교체 · 세션 끊기 · 복원 · 공지다([사고 대응](../operations/incident-response.md)).
- Discord `mfa_enabled` 가 true 인 로그인에만 관리자 권한을 준다. 판정은 `getSessionUser` 에서 역할을 낮추는 한 곳에서 한다. 기존 쿠키에는 값이 없으므로 다시 로그인해야 한다.
- 역할 변경과 동기화 토큰 초기화는 Discord 재확인을 거친다. 탈퇴 재확인과 칸을 나누고 유효 시간 10분은 같다.
- 관리자 계정은 연결된 Discord 계정을 바꾸지 못한다.
- `User.sessionVersion` 을 `getSession` 에서 쿠키와 비교한다. 세션을 읽는 모든 기능이 함께 끊긴다. 로그인 요청마다 이 값을 한 번 더 읽는다. 권한을 보지 않는 `proxy.ts` 는 비교하지 않는다. 값이 없는 쿠키는 0 으로 봐서 배포 때 아무도 로그아웃되지 않는다. 끊는 함수만 두고 화면은 만들지 않는다.
- 역할 변경 · 동기화 토큰 초기화 · 사용자 삭제 · Discord 인증 성공과 실패를 구조화 로그로 남긴다. 칸을 정해 토큰과 세션 값이 들어갈 자리를 두지 않는다. IP 는 남기지 않는다.

## 고르지 않은 안

- 관리자 Discord 변경에 재확인만 걸기 — 재확인 값을 변경 시작 때 지우는 흐름을 바꿔야 한다. 쓸 일이 드물고 운영 DB 로 바꿀 수 있다
- 2단계가 꺼진 관리자의 로그인 자체를 막기 — 일반 기능까지 막을 이유가 없다
- 세션 비교를 `proxy.ts` 에 넣기 — 세션을 읽지 않는 요청까지 DB 를 읽는다
- 세션 비교를 `getSessionUser` 에만 두기 — `session.id` 를 바로 읽는 52개 파일이 끊기지 않는다
- 작업 기록을 새 표에 저장 — 표와 보관 기준이 새로 생긴다
- 공개 전환 기록 — 공개 상태를 쓰는 코드가 23곳으로 흩어져 있어 이번에는 뺐다

## 근거

- 법령: 국가법령정보센터 원문, 「개인정보 보호법」 제34조 · 제75조, 시행령 제39조 · 제39조의2 · 제39조의3 · 제40조(2026-09-11 시행본, 2026-11-01 확인)
- 문서: [security.txt 표준 RFC 9116](https://www.rfc-editor.org/rfc/rfc9116), [Discord User 객체](https://discord.com/developers/docs/resources/user)의 `mfa_enabled`(identify 범위)

## 바뀌는 곳

- 문서: [기능 규칙](../design/product-rules.md)의 인증 절, [사고 대응](../operations/incident-response.md), `SECURITY.md`
- 코드: `lib/session.ts` · `lib/user.ts` · `app/(auth)/discord` · `features/users/server` · `lib/observability/server.ts` · `proxy.ts` · `prisma/schema/users.prisma`
