# 처리방침 재점검 반영 — 방침과 코드를 서로 맞춤 · 2026-11-25 판

- 상태: 유효
- 날짜: 2026-11-17
- 분야: 기능
- 고른 사람: 사용자(결정 판 15개 모두 추천안, 더할 문구 1 – 10, 문장만 고칠 곳 13개 전부)

## 맥락

2026-11-07 판 처리방침을 코드 · 법령 · 다른 서비스 방침과 다시 대조하니, 방침 문장과 실제 처리가 다른 곳이 15곳, 방침에 적히지 않은 처리가 여럿 있었다.
법이 정한 기재 항목의 틀은 갖추고 있었다. 코드 동작이 바뀌는 곳은 다른 서비스의 구현을 조사한 뒤 안을 정했다.

## 결정

방침 문장만 고치지 않고, 방침의 약속에 코드를 맞춘 곳과 실제 처리에 방침을 맞춘 곳을 판마다 골랐다.

- Discord 프로필 사진: 로그인할 때 받아 NosLog 공개 저장소에 복사한 사본만 쓴다. 주소에 Discord 식별자를 넣지 않는다.
- 가입을 끝내지 않은 계정: 만든 지 7일 뒤 정리 작업이 탈퇴와 같은 순서로 지운다.
- 기존 가입자: 약관은 공지하고 계속 쓰면 동의로 보며(약관에 있던 문구), 나이는 다시 묻지 않는다. 방침 13절에 그 사실을 적는다.
- 뮤즈캣 연결: 끊으면 연결 줄과 그 연결로 보낸 요청 기록을 바로 지우고, 만료된 연결 토큰은 하루 뒤 비운다.
- 요청 횟수 기록: 한도를 셀 때 가장 긴 한도 창이 지난 줄을 회원과 상관없이 지운다.
- 신고: 처리 시각 칸(`resolved_at`)을 두고 그 시각부터 6개월을 센다.
- 채보 수정 이력: 메시지에 닉네임을 쓰지 않는다.
- 의견 · 답글 번역: 쓰거나 고칠 때는 보내지 않고, 로그인한 사람이 「번역 보기」 를 처음 누를 때만 보내 저장한다.
- 번역 동의를 받는 자리: 켜면 동의 창에 표로 알린다. 새 화면이라 조사와 시안을 거쳐 따로 구현한다.
- 뮤즈캣 해제 알림: 뮤즈캣에 알림을 보낸다. 뮤즈캣이 받을 주소를 열 때까지는 보내지 못한 줄을 6개월 뒤 지우고, 방침에는 지금 동작을 적는다.
- 위치: 운영 화면에 없는 문장(마지막 위치 기기 저장 · IP 로 도시 짐작)을 방침에서 뺀다.
- 뮤즈캣에 주는 갱신 시각: 플레이 활동을 숨겼거나 동기화한 적이 없으면 비운다.
- 올린 사진: 검정 증빙 · 문의 · 오락실 제보 · 뮤즈캣 고장 신고 사진의 촬영 정보를 제출할 때 서버가 지운다.
- 방침 변경 공지: 시행 7일 전 공지를 유지한다.
- 권리 요청: 로그인한 문의로 받고 이메일을 함께 둔다.
- 더한 문구: 법령에 따른 제공 예외, 대검찰청, 안전 조치 세 갈래, 브라우저별 쿠키 설정 위치, 수집 방법, 공개 정보가 밖에 남을 수 있다는 고지, 개인정보를 쓰지 말라는 문장의 자리 옮김, 재위탁, 탈퇴 뒤 남는 정보의 근거, 외부 서비스 표.
- 시행일은 공지 뒤 7일을 두어 2026-11-25 로 적었다. 배포가 늦어지면 시행일과 2026-11-07 판의 적용 끝 날을 함께 옮긴다.

## 고른 대로 하지 못한 것

- 폐기된 기록 읽기 허락(`oauth_grants`) 줄 삭제: 지우면 다시 연결할 때 세대 번호가 1 로 돌아가 [보안 선택](./2026-11-02-security-choices.md)의 「가장 큰 세대 + 1」 과 어긋난다. 줄을 남기고 방침에 「탈퇴할 때까지」 로 적었다.
- 뮤즈캣용 고정 식별자(`oauth_subjects`): 다시 연결했을 때 뮤즈캣이 같은 사람으로 알아보도록 탈퇴할 때까지 둔다.
- 움직이는 Discord 사진: 저장소가 받는 형식에 gif 가 없어 첫 장만 저장한다.

## 고르지 않은 안

- Discord 주소를 그대로 쓰고 방침에 적기(12곳) — Discord 비공개 설정이 식별자를 가리지 못한다
- 가입 미완료 계정 3일 · 24시간 삭제, 온보딩을 끝낼 때 회원 줄 만들기(7곳) — 7일이 가장 많은 값이었다
- 기존 가입자에게 다음 로그인 때 다시 받기(3곳 안팎) — 약관 26곳 중 24곳이 공지 방식이다
- 번역을 쓸 때 미리 하기(6곳), 지금처럼 둘 다 하기(0곳)
- 사진 촬영 정보를 브라우저에서 지우기(3곳), 그대로 두기(3곳)
- 요청 횟수를 만료 시간이 있는 저장소로 옮기기(15곳) — 새 저장소와 의존성이 필요하다

## 근거

- [조사 기록](../research/2026-11-17-privacy-policy-audit.md): 코드 대조, 개인정보 보호법 제30조와 시행령 제31조 · 작성지침, 방침 117곳, 기능이 바뀌는 곳의 다른 서비스 구현.
- 변호사 검토가 아니며 방침의 「법률 검토 대기」 상자는 그대로 둔다.

## 바뀌는 곳

- 문서: `docs/design/product-rules.md` 의견 번역 · 데이터 보관 · `docs/design/pages/privacy.md` 구성 · 바뀐 기록
- 방침: `features/privacy/content/policyCopy.json` · `versions/2026-11-07.json` · `privacy-content.ts` · `tests/privacy-history.test.ts`
- 코드: `features/users/server/discord-avatar.ts` · `app/(auth)/discord/complete/route.ts`, `features/privacy/server/privacy-retention.ts` · `features/settings/server/account-deletion-service.ts`, `features/musecat/server/musecat-connection-service.ts` · `musecat-arcade-service.ts`, `lib/upload-rate-limit.ts`, `prisma/schema/community.prisma` · `prisma/migrations/20261117054604_opinion_report_resolved_at`, `features/feedback/server/opinion-report-admin-service.ts`, `lib/chart-pattern/chartSource.ts`, `features/music/server/community-mutation.ts` · `app/(site)/music/community-actions.ts`, `features/partner/server/nostalgia-records*.ts` · `features/partner/schemas/musecat-records-schema.ts`, `lib/uploads/strip-image-metadata.ts` · `lib/blob.ts` · 검정 · 문의 · 오락실 제보 제출 서비스
