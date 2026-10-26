---
name: release
description: NosLog 버전을 올리고 릴리스 PR · 공지 · GitHub 릴리스 글과 명령을 준비한다. 사용자가 「릴리스」 「버전 올려」 「배포 글」 「/release」 라고 할 때 쓴다.
---

# 릴리스

[`docs/operations/release.md`](../../../docs/operations/release.md) 를 읽고 그 순서대로 한다. 절차는 그 문서 한 곳에만 둔다.

- git · 릴리스 명령은 사용자가 실행한다. 명령과 글만 준다.
- 태그를 만드는 명령을 주기 전에 PR 이 `main` 에 합쳐졌는지와 `main` 의 버전을 `gh` 로 확인한다.
