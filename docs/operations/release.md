# 릴리스

버전을 올리거나 릴리스 명령을 주기 전에 읽는다.

- 순서: 버전 올리기(`package.json` · `package-lock.json` · README) → `dev` 에서 `main` 으로 PR → PR 이 합쳐진 뒤에 그 커밋에 GitHub 릴리스 `vX.Y.Z`(target `main`).
- 이 저장소는 변경 불가 릴리스(immutable)라 한 번 게시한 태그 이름은 지워도 다시 못 쓴다(합치기 전에 만들어 v2.11.0 을 잃은 적이 있다).
  릴리스 명령을 주기 전에 PR 이 `main` 에 합쳐졌는지, `main` 의 `package.json` 버전이 태그와 같은지 먼저 확인한다. `v*` 태그는 규칙으로 삭제 · 변경도 막혀 있다.
- 버전을 올렸으면 한 번에 다 준다. 커밋 제목(`release: NosLog vX.Y.Z`) · PR 제목 · 본문 · 공지(한국어 · 일본어 · 영어) · GitHub 릴리스 제목 · 본문.
  양식은 매번 직전 것을 읽어 그대로 맞춘다. PR = 직전 릴리스 PR(`gh pr view`), 공지 = 직전 업데이트 공지(https://noslog.app/ko/announcements 의 최신 업데이트 글 · ja · en), 릴리스 = 직전 릴리스(`gh release view`).
- PR · 공지 · 릴리스 본문은 복사할 수 있게 채팅에 코드 블록으로 준다.
