# 커밋 제목 — 공개 저장소 43곳 실측 · 가이드 문서 16곳

- 조사한 날: 2026-11-11
- 왜: 한 제목에 여러 변경을 가운뎃점으로 늘어놓는 NosLog 커밋 제목이 일반적인 모양인지 확인하고, [컨벤션](../CONVENTION.md)에 적을 기준을 찾는다.
- 캡처는 없다. 값은 저장소 기록에서 스크립트로 쟀다.

## 재는 법

- GitHub 공개 저장소의 기본 브랜치에서 최근 400개 커밋을 얕게 받아(`git clone --bare --filter=tree:0 --depth=400`), 병합 커밋을 빼고 최근 300개의 제목과 본문을 봤다.
- 자동 커밋(`Merge` · `Revert` · `Bump` · 의존성 봇)은 뺐다. 제목 끝의 PR 번호 `(#123)` 는 길이에서 뺐다.
- 길이는 글자 수다. 한글은 화면에서 두 칸을 차지하므로 NosLog 는 칸 수도 따로 쟀다.
- 앞머리: `type` 은 `feat:` · `fix(scope):` 꼴, 「영역」 은 `net/http:` · `mm:` 꼴, `[태그]` 는 `[DevTools]` 꼴이다. 제목의 절반 이상이 그 꼴이면 그 칸에 넣었다.
- 「나열」 은 제목 안에 `·` · `;` · `+` · `&` · `, and` 로 변경을 둘 이상 늘어놓은 비율이다.
- 「본문」 은 서명 · 리뷰 · 이슈 줄을 뺀 본문이 있는 커밋의 비율이다.
- 고른 곳: 널리 쓰는 공개 프로젝트 34곳과 한국 회사 공개 저장소 9곳(토스 3 · 당근 2 · 채널톡 · 네이버 · 라인 · 카카오). GitLab 미러(`gitlabhq/gitlabhq`)는 제목이 모두 같은 동기화 문구라 뺐다.

## 저장소별 값

| 곳                                                                      | 표본 | 길이 중앙 | 길이 90% | 72자 이하 | 앞머리      | 나열 | 본문 |
| ----------------------------------------------------------------------- | ---- | --------- | -------- | --------- | ----------- | ---- | ---- |
| [torvalds/linux](https://github.com/torvalds/linux)                     | 298  | 60        | 70       | 96%       | 영역        | 0%   | 100% |
| [git/git](https://github.com/git/git)                                   | 300  | 50        | 63       | 99%       | 영역        | 0%   | 91%  |
| [golang/go](https://github.com/golang/go)                               | 297  | 61        | 75       | 84%       | 영역        | 2%   | 97%  |
| [rust-lang/rust](https://github.com/rust-lang/rust)                     | 298  | 47        | 70       | 93%       | 없음 · 섞임 | 1%   | 26%  |
| [nodejs/node](https://github.com/nodejs/node)                           | 290  | 47        | 60       | 100%      | 영역        | 0%   | 69%  |
| [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes)       | 295  | 54        | 76       | 86%       | 없음 · 섞임 | 0%   | 35%  |
| [microsoft/vscode](https://github.com/microsoft/vscode)                 | 298  | 60        | 78       | 83%       | 영역        | 2%   | 85%  |
| [facebook/react](https://github.com/facebook/react)                     | 298  | 59        | 74       | 88%       | [태그]      | 2%   | 85%  |
| [vercel/next.js](https://github.com/vercel/next.js)                     | 293  | 57        | 75       | 88%       | 없음 · 섞임 | 1%   | 90%  |
| [angular/angular](https://github.com/angular/angular)                   | 299  | 63        | 81       | 72%       | type        | 1%   | 94%  |
| [vuejs/core](https://github.com/vuejs/core)                             | 216  | 60        | 81       | 80%       | type        | 0%   | 44%  |
| [sveltejs/svelte](https://github.com/sveltejs/svelte)                   | 293  | 53        | 75       | 87%       | type        | 1%   | 91%  |
| [vitejs/vite](https://github.com/vitejs/vite)                           | 290  | 51        | 72       | 90%       | type        | 0%   | 0%   |
| [withastro/astro](https://github.com/withastro/astro)                   | 245  | 59        | 89       | 71%       | 없음 · 섞임 | 0%   | 26%  |
| [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) | 291  | 45        | 72       | 90%       | 없음 · 섞임 | 1%   | 79%  |
| [prisma/prisma](https://github.com/prisma/prisma)                       | 300  | 91        | 125      | 30%       | 영역        | 31%  | 100% |
| [supabase/supabase](https://github.com/supabase/supabase)               | 297  | 56        | 71       | 92%       | type        | 3%   | 95%  |
| [django/django](https://github.com/django/django)                       | 300  | 68        | 87       | 63%       | 없음 · 섞임 | 2%   | 55%  |
| [rails/rails](https://github.com/rails/rails)                           | 296  | 55        | 72       | 91%       | 없음 · 섞임 | 2%   | 88%  |
| [laravel/framework](https://github.com/laravel/framework)               | 295  | 50        | 75       | 88%       | 없음 · 섞임 | 1%   | 36%  |
| [electron/electron](https://github.com/electron/electron)               | 290  | 57        | 71       | 92%       | type        | 0%   | 94%  |
| [mastodon/mastodon](https://github.com/mastodon/mastodon)               | 238  | 44        | 64       | 97%       | 없음 · 섞임 | 2%   | 0%   |
| [discourse/discourse](https://github.com/discourse/discourse)           | 300  | 60        | 77       | 83%       | 영역        | 0%   | 82%  |
| [grafana/grafana](https://github.com/grafana/grafana)                   | 288  | 58        | 75       | 86%       | 영역        | 1%   | 69%  |
| [calcom/cal.com](https://github.com/calcom/cal.com)                     | 300  | 61        | 79       | 79%       | type        | 2%   | 61%  |
| [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw)       | 300  | 51        | 75       | 86%       | type        | 7%   | 54%  |
| [PostHog/posthog](https://github.com/PostHog/posthog)                   | 293  | 64        | 75       | 86%       | type        | 0%   | 93%  |
| [home-assistant/core](https://github.com/home-assistant/core)           | 271  | 47        | 64       | 96%       | 없음 · 섞임 | 0%   | 0%   |
| [bitwarden/clients](https://github.com/bitwarden/clients)               | 298  | 54        | 76       | 87%       | [태그]      | 2%   | 52%  |
| [element-hq/element-web](https://github.com/element-hq/element-web)     | 256  | 39        | 68       | 94%       | 없음 · 섞임 | 2%   | 56%  |
| [signalapp/Signal-Android](https://github.com/signalapp/Signal-Android) | 283  | 45        | 66       | 94%       | 없음 · 섞임 | 0%   | 1%   |
| [ppy/osu](https://github.com/ppy/osu)                                   | 295  | 53        | 78       | 86%       | 없음 · 섞임 | 2%   | 81%  |
| [ppy/osu-web](https://github.com/ppy/osu-web)                           | 282  | 32        | 54       | 99%       | 없음 · 섞임 | 0%   | 12%  |
| [twentyhq/twenty](https://github.com/twentyhq/twenty)                   | 298  | 55        | 75       | 88%       | 없음 · 섞임 | 1%   | 100% |
| [toss/es-toolkit](https://github.com/toss/es-toolkit)                   | 268  | 67        | 86       | 62%       | type        | 3%   | 63%  |
| [toss/suspensive](https://github.com/toss/suspensive)                   | 298  | 59        | 91       | 74%       | type        | 2%   | 41%  |
| [toss/slash](https://github.com/toss/slash)                             | 300  | 48        | 77       | 85%       | type        | 2%   | 47%  |
| [daangn/stackflow](https://github.com/daangn/stackflow)                 | 298  | 45        | 82       | 84%       | type        | 0%   | 2%   |
| [daangn/seed-design](https://github.com/daangn/seed-design)             | 267  | 61        | 80       | 79%       | type        | 2%   | 46%  |
| [channel-io/bezier-react](https://github.com/channel-io/bezier-react)   | 182  | 40        | 70       | 93%       | 없음 · 섞임 | 1%   | 100% |
| [naver/billboard.js](https://github.com/naver/billboard.js)             | 219  | 45        | 68       | 94%       | type        | 1%   | 87%  |
| [line/armeria](https://github.com/line/armeria)                         | 173  | 50        | 73       | 89%       | 없음 · 섞임 | 1%   | 92%  |
| [kakao/kakao_flutter_sdk](https://github.com/kakao/kakao_flutter_sdk)   | 279  | 53        | 87       | 81%       | type        | 0%   | 23%  |
| NosLog(비교)                                                            | 299  | 37        | 59       | 97%       | type        | 53%  | 0%   |

NosLog 의 칸 수(한글 두 칸)는 중앙 55칸 · 90% 83칸이다. 나열한 제목 158개(최근 300개)는 변경을 2개 71건 · 3개 43건 · 4개 26건 · 5개 이상 18건 늘어놓았다.

## 43곳 합계

- 제목 길이: 중앙값의 중앙 54자(32–91), 90% 지점의 중앙 75자. 길이 중앙이 50자 이하인 곳 15곳, 60자 이하 35곳. 90% 지점이 72자 이하인 곳 16곳, 80자 이하 34곳.
- 나열: 중앙 1%. 5% 를 넘는 곳은 2곳(Prisma 31% · Excalidraw 7%)이다. NosLog 는 53%.
- 본문: 중앙 69%. 절반 넘는 커밋에 본문이 있는 곳 28곳. Vite · Mastodon · Home Assistant 는 0% 로, 설명을 PR 에 쓴다. NosLog 는 0%.
- 앞머리: `type` 16곳 · 「영역」 8곳 · `[태그]` 2곳 · 없음이거나 섞임 17곳. 한국 회사 9곳 가운데 8곳이 `type` 이다(라인 Armeria 만 없음). `type` 을 쓰는 16곳은 모두 설명을 소문자로 시작한다.
- 끝 마침표: 중앙 0%. 붙이는 곳은 Django · Signal 2곳이다.
- 한글 제목: 토스 slash 의 3% 말고는 없다. 한국어 제목의 말끝(「수정」 · 「고침」 · 「~함」)은 이 표본으로 알 수 없다(미확인).

## 가이드 문서 16곳

서브에이전트가 2026-11-11 에 원문을 열어 확인했다. 쪽을 요약 모델이 읽는 도구라 인용 구절은 원문과 한 번 더 대조하지 않았다.

| 곳                                                                                                       | 제목 길이             | 한 커밋 한 변경                                         | 앞머리            | 본문                  |
| -------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------- | ----------------- | --------------------- |
| [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)                             | 숫자 없음             | 여러 type 에 걸리면 나눔                                | `type(scope): `   | 선택 · 빈 줄 뒤       |
| [Angular](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md)   | 숫자 없음             | 언급 없음                                               | `type(scope): `   | 왜 · docs 밖에는 필수 |
| [Git SubmittingPatches](https://git-scm.com/docs/SubmittingPatches)                                      | 50자                  | 논리적으로 다른 변경은 나눔 · 설명이 길어지면 나눌 신호 | `영역: `          | 문제 · 왜 나은지      |
| [Linux kernel](https://www.kernel.org/doc/html/latest/process/submitting-patches.html)                   | 70–75자               | 패치 하나에 문제 하나                                   | `subsystem: `     | 문제와 영향 · 왜      |
| [Pro Git](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project)                      | 약 50자               | 논리적으로 분리된 묶음                                  | 언급 없음         | 동기 · 72자 폭        |
| [Chris Beams](https://cbea.ms/git-commit/)                                                               | 50자 권장 · 72자 상한 | 요약이 어려우면 변경이 많다는 뜻                        | 언급 없음         | 무엇 · 왜             |
| [Tim Pope](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)                        | 약 50자               | 언급 없음                                               | 언급 없음         | 필요하면 · 빈 줄 뒤   |
| [Google eng-practices](https://google.github.io/eng-practices/review/developer/cl-descriptions.html)     | 숫자 없음             | 언급 없음                                               | 선택              | 무엇 · 왜             |
| [GitLab](https://docs.gitlab.com/development/contributing/merge_request_workflow/)                       | 72자                  | 언급 없음                                               | 선택              | 왜 · 72자 폭          |
| [Go](https://go.dev/doc/contribute)                                                                      | 숫자 없음             | 변경 하나에 커밋 하나                                   | `패키지: `        | 맥락 · 무엇           |
| [Rails](https://guides.rubyonrails.org/contributing_to_ruby_on_rails.html)                               | 50자                  | 하나로 합침                                             | 언급 없음         | 필요하면              |
| [Django](https://docs.djangoproject.com/en/dev/internals/contributing/committing-code/)                  | 72자                  | 가장 잘게                                               | `Fixed #번호 -- ` | 왜                    |
| [Kubernetes](https://www.kubernetes.dev/docs/guide/pull-requests/)                                       | 50자 권장 · 72자 상한 | 논리적으로 다른 생각은 나눔                             | 선택              | 무엇 · 왜             |
| [GitHub 블로그](https://github.blog/developer-skills/github/write-better-commits-build-better-projects/) | 언급 없음             | 작고 한 가지 일만                                       | 언급 없음         | 무엇 · 왜             |
| [네이버 billboard.js](https://github.com/naver/billboard.js/blob/master/CONTRIBUTING.md)                 | 숫자 없음             | 언급 없음                                               | `type(scope): `   | 짧은 설명             |
| [토스 es-toolkit](https://github.com/toss/es-toolkit/blob/main/.github/CONTRIBUTING.md)                  | 언급 없음             | PR 을 하나로 합침                                       | `type[함수]: `    | 언급 없음             |

- 한 커밋에 논리적 변경 하나: 8곳. PR 하나에 커밋 하나로 합치는 쪽 3곳. 언급 없음 5곳.
- 제목에 여러 변경을 나열해도 된다고 한 곳은 없다. 나열을 직접 다룬 곳도 없고, 가까운 말은 Git 과 Chris Beams 2곳이다.
- 제목 길이: 50자 6곳(이 가운데 Chris Beams · Kubernetes 는 72자를 상한으로 함께 둔다) · 72자 2곳 · 70–75자 1곳 · 숫자 없음 7곳.
- 본문에 「왜」 를 쓰라: 10곳. 제목과 본문 사이 빈 줄: 9곳이 명시.
- 막힌 곳: NHN Cloud 「좋은 git 커밋 메시지를 작성하기 위한 7가지 약속」 은 본문이 열리지 않았다. 라인 Armeria · 당근 stackflow · 카카오 SDK 의 기여 문서에는 커밋 규칙이 없다.

## 읽은 것

- 일반적인 제목은 변경 하나를 50–75자 안에 적고, 여러 내용은 커밋을 나누거나 본문에 적는다. NosLog 가 다른 곳은 나열(53% 대 1%)과 본문(0% 대 69%)이다.
- NosLog 제목은 글자 수로는 짧지만(중앙 37자) 한글이 두 칸이라 칸 수로는 다른 곳과 비슷하거나 길다(중앙 55칸 · 90% 83칸).
- `type: ` 앞머리는 표본의 16곳, 한국 회사 9곳 중 8곳이 써서 지금 형식 그대로 둘 근거가 된다.
