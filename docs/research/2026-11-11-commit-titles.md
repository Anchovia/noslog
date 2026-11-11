# 커밋 제목 — 공개 저장소 43곳 · 한국어 커밋 24곳 실측 · 가이드 문서 16곳

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
- 한글 제목: 토스 slash 의 3% 말고는 없다. 한국어 제목의 말끝은 아래 「한국어 커밋 제목 24곳」 에서 따로 쟀다.

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

## 한국어 커밋 제목 24곳 (2026-11-11 추가)

앞 조사 표본에 한글 제목이 없어 말끝과 기호를 따로 쟀다. 한국 회사의 공개 저장소는 영어로 커밋해서, 한국어로 커밋하는 팀 프로젝트(우아한테크코스 · 디프만 · 넥스터즈 · SOPT 메이커스 · 네이버 부스트캠프 · 매시업)에서 별이 많은 저장소를 골랐다. 유명 서비스가 아니라 교육 · 동아리 팀 프로젝트라는 점이 한계다.

- 재는 법은 위와 같다. 한글이 든 제목만 셌고, 한글 제목이 절반 아래인 `sopt-makers/sopt-android`(39%)는 뺐다.
- 「명사로 끝남」 은 설명이 추가 · 수정 · 변경 같은 동작 명사나 명사로 끝나는 제목의 비율이다. 기호는 앞머리를 뺀 설명 부분에서 셌다.

| 곳                                                                                              | 표본 | 칸 중앙 | 칸 90% | 앞머리            | 명사로 끝남 | 가운뎃점 | 줄표 | 「및」 |
| ----------------------------------------------------------------------------------------------- | ---- | ------- | ------ | ----------------- | ----------- | -------- | ---- | ------ |
| [woowacourse-teams/2020-6rinkers](https://github.com/woowacourse-teams/2020-6rinkers)           | 221  | 40      | 58     | type: 소문자 69%  | 64%         | 0%       | 0%   | 5%     |
| [woowacourse-teams/2023-hang-log](https://github.com/woowacourse-teams/2023-hang-log)           | 294  | 34      | 54     | type: 소문자 71%  | 88%         | 0%       | 0%   | 5%     |
| [woowacourse-teams/2021-zzimkkong](https://github.com/woowacourse-teams/2021-zzimkkong)         | 277  | 45      | 72     | type: 소문자 98%  | 77%         | 0%       | 0%   | 7%     |
| [woowacourse-teams/2023-team-by-team](https://github.com/woowacourse-teams/2023-team-by-team)   | 287  | 37      | 57     | [태그] 95%        | 84%         | 0%       | 0%   | 4%     |
| [woowacourse-teams/2022-pickpick](https://github.com/woowacourse-teams/2022-pickpick)           | 298  | 41      | 64     | type: 소문자 97%  | 87%         | 0%       | 0%   | 14%    |
| [depromeet/na-lab-client](https://github.com/depromeet/na-lab-client)                           | 242  | 29      | 44     | 없음 78%          | 68%         | 0%       | 0%   | 12%    |
| [depromeet/ygtang-client](https://github.com/depromeet/ygtang-client)                           | 271  | 35      | 55     | 없음 75%          | 66%         | 0%       | 0%   | 11%    |
| [depromeet/SPOT-server](https://github.com/depromeet/SPOT-server)                               | 158  | 43      | 69     | [태그] 74%        | 80%         | 0%       | 0%   | 3%     |
| [Nexters/boolti-web](https://github.com/Nexters/boolti-web)                                     | 289  | 46      | 69     | type: 소문자 98%  | 80%         | 1%       | 0%   | 13%    |
| [Nexters/BandalArt-KMP](https://github.com/Nexters/BandalArt-KMP)                               | 283  | 37      | 46     | type: 소문자 96%  | 59%         | 1%       | 0%   | 4%     |
| [Nexters/Boolti](https://github.com/Nexters/Boolti)                                             | 289  | 45      | 68     | type: 소문자 69%  | 67%         | 7%       | 0%   | 6%     |
| [sopt-makers/SOPT-iOS](https://github.com/sopt-makers/SOPT-iOS)                                 | 299  | 42      | 69     | [태그] 100%       | 78%         | 0%       | 0%   | 4%     |
| [sopt-makers/sopt-playground-frontend](https://github.com/sopt-makers/sopt-playground-frontend) | 282  | 36      | 57     | type: 소문자 99%  | 87%         | 0%       | 0%   | 8%     |
| [sopt-makers/sopt-crew-backend](https://github.com/sopt-makers/sopt-crew-backend)               | 277  | 45      | 64     | type: 소문자 97%  | 79%         | 3%       | 0%   | 13%    |
| [boostcampwm-2022/web18-PRV](https://github.com/boostcampwm-2022/web18-PRV)                     | 130  | 49      | 85     | 없음 37%          | 69%         | 0%       | 0%   | 3%     |
| [boostcampwm-2022/web37-ZelloDraw](https://github.com/boostcampwm-2022/web37-ZelloDraw)         | 289  | 50      | 96     | type: 소문자 96%  | 76%         | 0%       | 0%   | 8%     |
| [boostcampwm-2022/iOS02-Trinap](https://github.com/boostcampwm-2022/iOS02-Trinap)               | 290  | 38      | 61     | type: 소문자 100% | 87%         | 0%       | 0%   | 4%     |
| [boostcampwm-2022/android04-BEEP](https://github.com/boostcampwm-2022/android04-BEEP)           | 292  | 50      | 71     | 없음 97%          | 75%         | 0%       | 0%   | 5%     |
| [boostcampwm2023/web01-GitChallenge](https://github.com/boostcampwm2023/web01-GitChallenge)     | 286  | 38      | 60     | type: 소문자 95%  | 79%         | 0%       | 0%   | 8%     |
| [boostcampwm2023/web07-GBS](https://github.com/boostcampwm2023/web07-GBS)                       | 114  | 32      | 49     | [태그] 95%        | 85%         | 0%       | 0%   | 7%     |
| [boostcampwm2023/web18_Dandi](https://github.com/boostcampwm2023/web18_Dandi)                   | 290  | 39      | 54     | type: 소문자 99%  | 10%         | 0%       | 0%   | 1%     |
| [mash-up-kr/SeeYouAgain_iOS](https://github.com/mash-up-kr/SeeYouAgain_iOS)                     | 132  | 31      | 55     | 없음 100%         | 90%         | 0%       | 0%   | 20%    |
| [mash-up-kr/mashup-server](https://github.com/mash-up-kr/mashup-server)                         | 225  | 32      | 53     | type: 소문자 88%  | 88%         | 0%       | 0%   | 4%     |
| [mash-up-kr/MOIT-iOS](https://github.com/mash-up-kr/MOIT-iOS)                                   | 90   | 26      | 48     | type: 소문자 78%  | 84%         | 0%       | 0%   | 2%     |
| NosLog(비교)                                                                                    | 290  | 54      | 83     | type: 소문자 100% | 40%         | 53%      | 12%  | 0%     |

24곳 합계:

- 말끝: 명사로 끝나는 제목이 중앙 79%, 24곳 중 23곳에서 절반을 넘는다. 「~기」(막기 · 하기)는 중앙 1%, 「~함 · ~음」 은 0%, 문장(「~다」)은 0% 이고 10% 를 넘는 곳이 3곳이다.
- 끝 낱말(제목 5,905개): 추가 14.5% · 수정 13.8% · 변경 8.3% · 구현 7.0% · 제거 3.7% · 적용 3.2% · 해결 2.7% · 삭제 1.8% · 반영 1.7% · 설정 1.5%. 이 열 낱말이 58% 다. 그 뒤는 분리 · 작성 · 개선 · 정리 · 처리 · 생성 순이다.
- 꼴: 설명은 낱말 5개(중앙)이고 「대상 + 동작 명사」 다(`chore: 스토리북 주소 변경` · `fix: 회식 등록 알림 제거`). 「을 · 를」 이 든 제목은 중앙 6%(0–34%)다. NosLog 는 낱말 9개 · 「을 · 를」 29% 다.
- 기호: 가운뎃점과 줄표(—)는 24곳 모두 0–1% 다. 앞 조사의 43곳도 가운뎃점 0%, 줄표 최대 1% 다. NosLog 는 가운뎃점 53% · 줄표 12% 다.
- 「및」 은 중앙 5.5%, 쉼표는 6.5% 다. 「및」 은 대개 두 변경을 잇는다(`추가 및 수정`).
- 길이: 칸 수 중앙 38.5칸 · 90% 지점 59칸. NosLog 는 54칸 · 83칸이다.
- 앞머리: 소문자 `type:` 이 절반을 넘는 곳 15곳, `[태그]` 4곳, 없음 4곳, 섞임 1곳.
- 본문: 본문이 있는 커밋은 중앙 40.5% 이고 그 가운데 81% 가 글머리표 목록이다. 열어 보니 GitHub 가 PR 을 하나로 합칠 때 넣는 커밋 제목 목록(`* feat: …`)이 대부분이라, 사람이 쓴 본문 꼴의 근거로 쓸 수 없다. 43곳에서는 본문이 글머리표 목록인 비율이 중앙 6% 이고 절반을 넘는 곳은 5곳(Laravel · Cal.com · Element Web · 토스 slash · 카카오 SDK)이다.

## AI 가 쓴 커밋 메시지의 표지 (2026-11-11 추가)

일반 글의 AI 표지(줄표 · 가운뎃점 · 글머리표 · 과장 어휘)는 [AI 글 조사](./2026-10-24-e-ai-writing.md)에 있어 다시 조사하지 않았다. 여기는 커밋 메시지 · PR 제목에 한정한 자료다. 서브에이전트가 원문을 열어 확인했고, 논문 수치는 모두 AIDev 한 데이터셋(2025년 PR)에서 나와 서로 독립된 근거가 아니다.

| 곳                                                                                                                  | 종류                                      | 내용                                                                                               |
| ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [Ghaleb, Fingerprinting AI Coding Agents on GitHub](https://arxiv.org/html/2601.17406)                              | 논문 · PR 33,580개                        | 에이전트를 가르는 가장 센 신호가 여러 줄 커밋 메시지 비율(중요도 44.7%). 사람과 대조한 값은 아니다 |
| [Pham · Ghaleb, Agentic versus Human Pull Requests](https://arxiv.org/html/2601.17627)                              | 논문 · 에이전트 PR 33,596 · 사람 PR 6,618 | 에이전트 커밋 메시지가 diff 내용에 더 붙어 있다(유사도 중앙 0.72 대 0.68)                          |
| [Rahman 외, Task-Level Evaluation of AI Agents](https://arxiv.org/html/2602.02345)                                  | 논문 · PR 33,549개                        | 무엇과 왜를 둘 다 담은 커밋 비율이 에이전트에 따라 0.32–0.68(Claude 0.68). 사람 대조군 없음        |
| [Implicator.ai(Louis Abraham 분석)](https://www.implicator.ai/github-pr-ai-linked-vocabulary-1-to-45-percent.md)    | 데이터 블로그 · PR 설명 47,464개          | 줄표가 1만 낱말당 0.2 → 132.4. 커밋 메시지가 아니라 PR 설명 수치                                   |
| [Hacker News](https://hn.nuxt.dev/item/46018165)                                                                    | 의견                                      | 너무 길다 · 패치를 되풀이한다 · 왜가 없다 · enhances 같은 채움말                                   |
| [Simon Willison 의 Kenton Varda 인용](https://simonwillison.net/2026/Jul/8/kenton-varda/)                           | 의견                                      | 코드를 보면 아는 세부를 늘어놓고 큰 맥락이 없다                                                    |
| [NixOS Discourse](https://discourse.nixos.org/t/can-we-explicitly-ban-llm-generated-pr-descriptions-commits/79736)  | 의견                                      | 글 벽(설명 · 커밋 하나가 660–1,027 낱말)                                                           |
| [DEV shibayu36](https://dev.to/shibayu36/creating-project-specific-commit-messages-with-claude-code-subagents-514f) | 의견                                      | 구현 세부를 글머리표로 과하게 적고 세션 대화가 섞인다                                              |
| [munilive 커밋 메시지 스타일 가이드](https://blog.munilive.com/posts/my-git-commit-guide.html)                      | 한국어 컨벤션(개인 블로그)                | 「회원 생성 서비스 추가」 같은 구문형이나 「~를 추가함」 중 하나로 통일 · 끝 마침표 없음 · 50자    |

- 수치가 있는 표지: 본문이 diff 를 되풀이한다 · 왜가 빠진다 · 여러 줄 본문이 늘 붙는다.
- 의견으로만 있는 표지: 길다 · 글머리표로 구현 세부를 늘어놓는다(1곳, 근거 약함) · 채움말.
- 출처를 찾지 못한 것: 제목에 여러 변경을 잇는 것 · 과장 동사 · 이모지를 커밋 메시지의 AI 표지로 센 자료, 한국어 커밋 메시지의 AI 말투를 다룬 글.
- 한국어 말끝을 정한 회사 문서는 찾지 못했다. 개인 블로그 3곳뿐이라 말끝의 근거는 위 실측 24곳이다.

## 읽은 것

- 일반적인 제목은 변경 하나를 50–75자 안에 적고, 여러 내용은 커밋을 나누거나 본문에 적는다. NosLog 가 다른 곳은 나열(53% 대 1%)과 본문(0% 대 69%)이다.
- NosLog 제목은 글자 수로는 짧지만(중앙 37자) 한글이 두 칸이라 칸 수로는 다른 곳과 비슷하거나 길다(중앙 55칸 · 90% 83칸).
- `type: ` 앞머리는 표본의 16곳, 한국 회사 9곳 중 8곳이 써서 지금 형식 그대로 둘 근거가 된다.
- 한국어 제목은 「대상 + 동작 명사」 로 끝나고(24곳 중 23곳) 가운뎃점과 줄표를 쓰지 않는다(67곳 모두 0–1%). NosLog 제목의 가운뎃점 53% · 줄표 12% 는 어느 표본에도 없는 모양이다.
