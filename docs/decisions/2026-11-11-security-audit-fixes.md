# 알려진 웹 취약점 점검 수정 — 캐시 키 · 제외 풀기 · 계정 변경 재확인 · 로그아웃 · 기록 값 · 업로드 · 기체 확인

- 상태: 유효
- 날짜: 2026-11-11
- 분야: 기능
- 고른 사람: 사용자(점검 보고의 1–7번을 고치라는 지시)

## 맥락

알려진 웹 취약점 목록(인젝션 · XSS · 인증 · 접근 제어 · 업로드 · 서버 측 요청 · 로직 · 설정)을 지금 코드에 대어 봤다. 치명 · 높음은 없었고, 코드로 직접 확인한 일곱 가지를 고쳤다.

## 결정

1. 뮤즈캣 live 오락실 상세 캐시는 사람마다 따로 담는다(키에 사용자 id). 응답의 고장 제보에 「내 제보」(`canWithdraw`) · 「내 투표」(`myVote`)가 들어 있어, 함께 쓰면 다른 사람의 것이 내 것으로 보인다.
2. 운영자가 제외한 패턴 평가와 목표 투표는 본인이 지우지 못한다. 지우고 다시 쓰면 제외가 풀리기 때문이다. 저장과 같은 오류(`evaluation_excluded` · `vote_excluded`)로 답한다.
3. 로그인 Discord 계정을 다른 계정으로 바꾸려면 지금 연결된 계정으로 먼저 인증해야 한다. 「로그인 계정 변경」 에서 지금 계정으로 인증하면 재확인이 10분 동안 남고, 그 안에 다시 선택해 새 계정으로 인증하면 바뀐다. 재확인은 한 번 쓰면 지운다.
4. 로그아웃하면 `User.sessionVersion` 을 올려 그 사용자의 모든 기기를 함께 로그아웃한다. 탈퇴로 사용자가 없어진 쿠키도 `getSession` 이 로그아웃으로 돌려준다.
5. 동기화 값에서 점수와 등급이 어긋난 줄은 저장하지 않는다. 1,000,000 은 P, 950,000 이상은 S 여야 하고, 그 아래 점수에 P · S 는 올 수 없다.
6. 업로드한 이미지는 저장 전에 파일 머리가 선언한 형식(JPEG · PNG · WebP)인지 본다. 올리고 제출하지 않은 비공개 저장소 파일(`feedback/` · `exam-proofs/`)도 24시간 뒤 정리한다.
7. 기체 「가동 확인」 은 사람 · 기체 키로 잠근 뒤 조회하고 넣는다.

## 고르지 않은 안

- 1번에서 캐시는 함께 쓰고 사람마다 다른 칸만 따로 받기 — 그 칸만 주는 뮤즈캣 경로가 없다
- 3번에서 관리자처럼 변경을 아예 막기 — 일반 사용자가 Discord 계정을 옮길 길이 없어진다
- 4번에서 기기마다 따로 끊기 — 세션이 봉인 쿠키라 서버에 기기별 기록이 없다. 표를 새로 만들어야 한다
- 5번에서 등급을 정해진 목록으로만 받기, 점수를 판정 수에서 역산하기 — 등급 전체 목록과 점수 식이 리포에 없다
- 6번에서 서버가 다시 인코딩하기 — 주소가 바뀌어 올린 쪽 흐름을 모두 고쳐야 한다. EXIF 는 지금처럼 브라우저 자르기에서만 빠진다

## 근거

- 1번: `features/musecat/server/musecat-live-client.ts` 의 `toFlag` 가 `canWithdraw` · `myVote` 를 옮긴다. [2026-11-08 결정](./2026-11-08-musecat-arcade-cache.md)의 「보는 사람마다 다른 값이 없다」 는 이 칸을 빠뜨렸다.
- 5번: 개발 DB 기록 1,737건에서 P 7건은 모두 1,000,000, S 687건은 950,031–999,611, A2 이하는 모두 950,000 미만이었다. 운영 DB 는 배포 전에 사용자가 확인한다.
- 3번의 유효 시간은 탈퇴 · 관리자 재확인과 같은 `DISCORD_VERIFICATION_WINDOW_MS`(10분).

## 바뀌는 곳

- [기능 규칙](../design/product-rules.md)
- `features/musecat/server/musecat-arcade-service.ts` · `features/music/server/community-mutation.ts` · `app/(auth)/discord` · `lib/session.ts` · `features/users/server/user-session-service.ts` · `features/sync/server/chart-limits.ts` · `lib/blob.ts` · `features/privacy/server/privacy-retention.ts` · `features/arcades/server/cabinet-check-service.ts`
- 화면 문구 `settings.discordChangeVerified` · `settings.discordChangeVerificationRequired`(ko · en · ja)
