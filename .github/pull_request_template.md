## 변경 사항

-

## 관련 이슈

Closes #

## 배포 영향

- 버전: 변경 없음
- DB 마이그레이션: 없음
- 환경변수 변경: 없음
- 의존성·외부 API 변경: 없음

## 확인

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`

공용 UI 변경 시:

- [ ] 지원 상태·Props 사용 예를 Storybook에 반영
- [ ] 기능 폼 변경 시 실패·재시도·연속 제출·오래된 응답을 로컬 mock 스토리로 확인
- [ ] 공용 스타일/대상 화면 변경 시 같은 Linux 환경에서 `npm run test:visual` 확인
- [ ] `npm run test:storybook` · `npm run build-storybook`
- [ ] 관련 키보드 탐색·포커스·라벨·오류 연결 확인
- [ ] 가이드의 화면 폭·전환 경계·ko/ja/en 및 영향을 받는 페이지 확인
- [ ] 토큰·부품 규칙 변경 시 가이드·결정 기록·테스트 반영

실행하지 못한 검사와 이유:

-

UI 변경이 있다면 확인한 화면이나 스크린샷을 아래에 첨부해주세요.
