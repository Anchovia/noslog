# 임시 저장 초안 삭제

사용자가 자기 초안을 지우는 동작을 실제 서비스와 디자인 시스템에서 확인한 기록이다. 확인 날짜는 모두 2026-11-02. 로그인 없이 공식 도움말 · 공개 문서로 확인했다. 확인하지 못한 칸은 「미확인」 이다.

칸: 진입 위치 / 확인 방식 / 되돌리기 · 기간 / 개수 한도 · 찼을 때.

## 실제 서비스

근거 등급: 소스 = 서비스의 공개 소스 코드, 공식 = 서비스 공식 도움말, 제3자 = 제3자 안내 글(화면이 바뀌었을 수 있음).

### Velog (소스)

- URL: https://github.com/velopert/velog-client/blob/master/src/components/saves/SavedPosts.tsx · SavedPostItem.tsx. 캡처: `~/noslog-research/draft-delete/src/`
- 진입: 임시 글 목록 줄의 글자 버튼 「삭제」(날짜 맞은편).
- 확인: 확인 창. 제목 「임시 글 삭제」, 본문 「임시 저장한 글을 삭제하시겠습니까? 삭제한 글은 복구할 수 없습니다.」. 버튼 「취소」 · 「확인」(공용 `PopupOKCancel`).
- 되돌리기: 불가(본문 문구). 한도: 미확인.

### Bluesky (소스)

- URL: https://github.com/bluesky-social/social-app/blob/main/src/view/com/composer/drafts/DraftItem.tsx · DraftsListDialog.tsx · lexicons/app/bsky/draft/createDraft.json
- 진입: 글쓰기 창의 초안 목록 줄 오른쪽 버튼(접근성 이름 「More options」 이지만 누르면 바로 확인 창). 줄을 누르면 「Open draft」.
- 확인: 확인 창. 제목 「Discard draft?」, 본문 「This draft will be permanently deleted.」, 확인 버튼 「Discard」(negative 색).
- 되돌리기: 불가(본문 문구).
- 한도: API 오류 `DraftLimitReached`(「Trying to insert a new draft when the limit was already reached.」). 수치는 미확인. 저장이 이 오류로 실패하면 글쓰기 창 오류로 「You've reached the maximum number of drafts」 를 띄운다(`src/view/com/composer/Composer.tsx` 의 `getDraftSaveError`). 그 밖의 오류는 「Failed to save draft」.

### Discourse (소스)

- URL: https://github.com/discourse/discourse/blob/main/frontend/discourse/app/components/user-stream.gjs · config/locales/client.en.yml · config/site_settings.yml
- 진입: 사용자 활동 「Drafts」 목록 줄의 빨간 휴지통 아이콘 버튼(`post-list/item/index.gjs`, 제목 「Remove」, 옆에 「Resume」)과 여러 개 선택 「Delete selected」.
- 확인: 확인 창. 한 개 제목 「Are you sure you want to delete this draft?」. 여러 개 제목 「Delete drafts」, 본문 「Are you sure you want to delete these %{count} drafts?」.
- 되돌리기: 미확인.
- 한도: `max_drafts_per_user` 기본 10,000(숨은 설정). `delete_drafts_older_than_n_days` 기본 180일 뒤 자동 삭제. 찼을 때 동작 미확인.

### DEV / Forem (소스)

- URL: https://github.com/forem/forem/blob/main/app/views/articles/delete_confirm.html.erb · config/locales/views/articles/en.yml
- 진입: 대시보드 글 줄에서 별도 확인 페이지로 이동(진입 버튼 자리는 미확인).
- 확인: 확인 페이지(창 아님). 제목 「Are you sure you want to delete this article?」, 본문 「You cannot undo this action, perhaps you just want to edit instead?」. 버튼 「Delete」(danger) · 「Edit」 · 「Dismiss」.
- 되돌리기: 불가(본문 문구). 한도: 미확인.

### WriteFreely (소스)

- URL: https://github.com/writefreely/writefreely/blob/develop/templates/user/articles.tmpl
- 진입: 초안 목록 줄의 글자 링크 「delete」. 확인 · 되돌리기 · 한도: 미확인.

### Gmail (공식)

- URL: https://support.google.com/mail/answer/7401?hl=en&co=GENIE.Platform%3DDesktop
- 진입 · 확인: 이 문서에는 없음. 미확인.
- 되돌리기: 「When you delete a draft, you can't recover it from Trash.」. 일반 메일은 휴지통 30일이지만 초안은 해당 없음. Workspace Vault 는 관리자만 30일 보존(https://support.google.com/vault/answer/2535539).
- 한도: 미확인.

### YouTube Studio (공식)

- URL: https://support.google.com/youtube/answer/6249768?hl=en
- 진입: Content 목록에서 여러 개 선택 → More actions → 「Delete forever」. 영상 · 영상 초안 모두 같은 방법.
- 확인: 확인 창. 영구 삭제를 인정하는 체크 상자를 켠 뒤 「DELETE FOREVER」.
- 되돌리기: 「If you delete a video, it's permanently deleted」. 한도: 문서에 없음.

### LinkedIn 글 초안 (공식)

- URL: https://www.linkedin.com/help/learning/answer/47541 · https://www.linkedin.com/help/linkedin/answer/85039
- 진입: 글쓰기 도구 Manage → Drafts → 「Articles」 창의 초안 줄. 한 문서는 줄의 Delete 아이콘, 다른 문서는 줄의 More 아이콘 → Delete 라고 적음. 모바일 앱 없음.
- 확인: 확인 단계 있음. 문구 미확인.
- 되돌리기: 불가. 한도: 문서에 없음.

### Slack (공식)

- URL: https://slack.com/help/articles/201457107-Send-and-read-messages
- 진입: Drafts & sent → Drafts 탭. 데스크톱은 줄에 올리면 나오는 동작, 모바일은 길게 누르기. 여러 개는 Edit → 체크 → 삭제.
- 확인 · 되돌리기: 문서에 없음. 미확인. 한도: 미확인.

### Shopify 주문 초안 (공식)

- URL: https://help.shopify.com/en/manual/fulfillment/managing-orders/create-orders/create-draft · https://help.shopify.com/en/manual/shopify-admin/productivity-tools/bulk-actions
- 진입: 초안 상세 화면의 「Delete draft order」. 목록에서 여러 개 선택 → 「Delete draft orders」.
- 확인: 확인 창. 상세에서는 창의 「Delete draft order」 로 확인. 제목 원문 미확인.
- 되돌리기: 미확인.
- 한도: 개수 미확인. 2025-04-01 이후 초안은 1년 활동이 없으면 자동 삭제, 고치면 다시 셈.

### Mailchimp 캠페인 (공식, 초안 전용 문구는 없음)

- URL: https://mailchimp.com/help/delete-campaigns-from-your-account/
- 진입: Campaigns 목록 체크 상자 → 위쪽 「Delete」.
- 확인: 창 제목 「Are you sure?」, 버튼 「Delete」.
- 되돌리기: 「Most deleted campaign types can't be recovered.」, 일반 메일 · 템플릿 · 랜딩 페이지는 지원팀이 복구 시도 가능. 한도: 미확인.

### Notion (공식, 초안이 아닌 페이지)

- URL: https://www.notion.com/help/duplicate-delete-and-restore-content
- 진입: 사이드바 줄의 ••• · 오른쪽 클릭, 페이지 안 오른쪽 위 •••, Trash 로 끌기, 페이지 블록 선택 후 Delete.
- 확인: 문서에 확인 창 언급 없음. 휴지통 방식.
- 되돌리기: Trash 30일(Enterprise 는 조정 가능), 그 안에 복원 가능. 한도: 해당 없음.

### eBay 상품 초안 (공식 + 제3자)

- URL: https://www.ebay.co.uk/sellercentre/news/2024-february/drafts-retention
- 진입 · 확인: 공식 문서에 없음. 미확인.
- 한도: 빠른 등록 도구 · 모바일 250개, Seller Hub 5,000개. 마지막 변경 뒤 75일 보관. Manage drafts 에 Expiration date 칸. 찼을 때 동작은 문서에 없음.

### X (제3자)

- URL: https://roboin.io/article/en/2026/05/20/how-to-delete-stuck-drafts-and-failed-posts-causing-x-posting-issues/ · https://www.adweek.com/?p=1162396
- 진입: 글쓰기 창 Drafts → Unsent posts 탭 → Edit → 체크 또는 Select all → Delete(여러 개 선택 방식).
- 확인: Adweek(옛 Twitter)은 확인 창의 「Delete」 를 적음. 제목 원문 미확인.
- 되돌리기 · 한도: 미확인.

### Reddit iOS (제3자)

- URL: https://www.adweek.com/media/reddit-how-to-delete-a-draft-post/
- 진입: 프로필 Drafts 에서 줄을 왼쪽으로 밀기 → 휴지통 아이콘. 확인 · 되돌리기 · 한도: 미확인.

### Instagram (제3자, 2024-06)

- URL: https://www.slashgear.com/1603112/how-to-delete-drafts-on-instagram/
- 진입: 게시물 초안은 Manage → Edit → 여러 개 선택 → Done. 릴스 초안은 줄의 ⋯ → Delete.
- 확인: 확인 창. 게시물은 「Discard posts」, 릴스는 「Delete」. 제목 원문 미확인.
- 되돌리기 · 한도: 미확인.

### Archive of Our Own (소스, 사이트는 2026-10-30 보도 기준 장애 중이라 소스만 봄)

- URL: https://github.com/otwcode/otwarchive/blob/master/app/views/works/confirm_delete.html.erb · app/views/works/_work_blurb.html.erb · config/locales/views/en.yml
- 진입: 초안 목록 줄의 글자 링크 「Delete Draft」(옆에 「Post Draft」).
- 확인: 링크의 확인 「Are you sure you want to delete this draft?」 와 확인 페이지. 페이지 제목 「Delete Draft」, 본문 「Are you sure you want to delete "제목" permanently? This cannot be undone.」, 버튼 「Yes, Delete Draft」.
- 되돌리기: 불가. 한도: 개수 미확인. 자동 삭제 「Unposted drafts are only saved for 30 days from the day they are first created」.

### Ghost (소스)

- URL: https://github.com/TryGhost/Ghost/blob/main/apps/admin/src/posts/list/post-bulk-modal-copy.test.ts · components/posts-context-menu.tsx · apps/admin/src/editor/editor-settings-delete.acceptance.test.tsx
- 진입: 글 목록의 컨텍스트 메뉴(여러 개 선택 포함)와 에디터 설정의 삭제. ⋯ 버튼 유무는 미확인.
- 확인: 확인 창. 한 개 제목 「Are you sure you want to delete this post?」, 본문 「You're about to delete "My post". This is permanent! We warned you, k?」. 여러 개 제목 「Are you sure you want to delete these posts?」, 본문 「You're about to delete 12 posts. …」. 버튼 「Delete」.
- 되돌리기: 불가(본문 문구). 한도: 미확인.

### WordPress.com (공식 + 소스)

- URL: https://wordpress.com/support/trash/ · https://github.com/WordPress/WordPress/blob/master/wp-admin/edit.php
- 진입: 목록 줄에 올리면 나오는 「Trash」, 체크 상자 + Bulk actions 「Move to Trash」 + Apply, 에디터 제목 옆 ⋯ 「Move to Trash」.
- 확인: 목록은 확인 창 언급 없음. 에디터는 「Trash」 로 확인. wp-admin 소스는 지운 뒤 「1 post moved to the Trash.」 알림과 링크 「Undo」 를 보여 줌(WordPress.com 공식 문서에는 Undo 언급 없음).
- 되돌리기: 휴지통 30일, 「Restore」 하면 Drafts 탭으로. 「Delete Permanently」 는 되돌릴 수 없음. 한도: 미확인.

### Medium (공식)

- URL: https://help.medium.com/hc/en-us/articles/214874698. 캡처: `~/noslog-research/draft-delete/medium.png`
- 진입: Stories 목록 줄의 아래 화살표 메뉴 → 「Delete story」. 글 페이지는 ⋯ → More settings → 「Delete story」.
- 확인: 「and confirm」 까지만 적힘. 문구 미확인. 되돌리기: 「This deletion is permanent」. 한도: 미확인.

### GitHub 릴리스 초안 (공식, 초안 전용 안내는 아님)

- URL: https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository
- 진입: Releases 목록의 릴리스 옆 휴지통 아이콘(접근성 이름 「Delete」).
- 확인: 「Delete this release」. CLI 는 확인 프롬프트, `-y` 로 생략. 되돌리기 · 한도: 미확인.
- PR 초안: 공식 문서 https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/changing-the-stage-of-a-pull-request 에 삭제 내용 없음. 미확인.

### Outlook (공식)

- URL: https://support.microsoft.com/en-us/office/save-or-delete-drafts-of-unsent-messages-05072f23-3f0a-4ec3-80bd-95ab60fb5b15 · https://support.microsoft.com/en-us/outlook/create-reply-to-or-forward-email-messages-in-outlook-on-the-web
- 진입: Drafts 폴더에서 선택 후 Delete, 또는 오른쪽 클릭 → Delete. 작성 창 아래 「Discard」.
- 확인: 문서에 없음. 미확인. 되돌리기: 초안 전용 내용 없음, 미확인. 한도: 미확인.

### Buffer (공식)

- URL: https://support.buffer.com/articles/how-to-delete-posts-and-drafts-in-bulk-gcXAijaRj9
- 진입: 채널 톱니 → General → 「Delete Drafts」(채널 초안 전체). 한 개 삭제는 이 문서에 없음.
- 확인: 칸에 「Delete」 를 입력한 뒤 「Delete Drafts」. 되돌리기 · 한도: 미확인.

### Front (공식)

- URL: https://help.front.com/t/3624vl
- 진입: Drafts 폴더 또는 작성 중 화면의 회색 휴지통 「Delete」.
- 확인: 확인 창, 「once you delete your draft, the action cannot be undone」, 버튼 「Delete」. 한도: 미확인.

### Publer (공식)

- URL: https://publer.com/help/en/article/how-to-delete-draft-posts-9poqvu
- 진입: Calendar 목록 보기에서 여러 개 선택 → 「Delete selected」, 또는 필터 옆 설정 → 「Delete All」.
- 확인: 「Delete」 로 확인. 되돌리기: 「cannot be undone」. 한도: 미확인.

### 네이버웍스 (공식)

- URL: https://help.worksmobile.com/ko/use-guides/mail/sending-email/draft-mail/ · https://help.worksmobile.com/ko/use-guides/board/post/draft-post/. 캡처: `~/noslog-research/draft-delete/naverworks.png` · `naverworks2.png`
- 진입: 메일은 앱에서 줄을 왼쪽으로 밀어 「삭제」, PC 웹은 메일 쓰기 창 「더보기 > 임시저장 메일 삭제」. 게시글은 글을 연 뒤 메뉴 「삭제」.
- 확인: 문서에 없음. 미확인. 되돌리기: 게시글은 「삭제한 게시글은 복구할 수 없습니다.」. 한도: 미확인.

### osu! 비트맵 (공식 + 포럼)

- URL: https://osu.ppy.sh/wiki/en/Beatmapping/Beatmap_submission · https://osu.ppy.sh/community/forums/topics/1111343 · https://github.com/ppy/osu-web/blob/master/app/Jobs/BeatmapsetDelete.php
- 진입 · 확인: 삭제 화면은 위키에 없음. 미확인. 서버에 삭제 작업은 있고 화면에 「This beatmap has been deleted.」 배너가 있음.
- 한도: 공개 전(pending) 비트맵 수 제한. 일반 4 + 랭크된 맵당 1(위키는 최대 4개 추가, 포럼 인용은 2로 서로 다름). 서포터 8 + 최대 12, 합계 20. 제출 창에 남은 수를 보여 줌.
- 찼을 때: 묘지 맵 되살리기 실패 문구 「Beatmap is in the graveyard and you don't have enough remaining upload quota to resurrect!」(포럼 인용). 운영자 답글은 갱신 없는 맵이 약 한 달 뒤 pending 에서 빠지면 칸이 빈다고 함. 지우면 칸이 비는지는 미확인.

### Wikipedia 사용자 샌드박스 · 초안 (공식 지침)

- URL: https://en.wikipedia.org/wiki/Wikipedia:Criteria_for_speedy_deletion. 캡처: `~/noslog-research/draft-delete/wikipedia-u1.png`
- 진입: 일반 사용자에게 삭제 버튼이 없고, 자기 사용자 문서에 `{{Db-u1}}` 를 달아 관리자에게 요청(U1). 작성자 요청은 G7.
- 확인: 관리자 처리. 되돌리기: U1 은 요청하면 복원 가능(지침 문서). G13(6개월 미편집 초안)은 「may be restored upon request」. 개수 한도: 미확인.

### Super Mario Maker 2 (제3자, 초안이 아닌 업로드 코스)

- URL: https://attackofthefanboy.com/guides/super-mario-maker-2-how-to-delete-uploaded-levels/. 캡처: `~/noslog-research/draft-delete/smm2.png`
- 진입: Maker Profile → Uploaded Courses → 코스 상세 창 왼쪽 아래 삭제 버튼.
- 확인: 경고 「This course will be deleted from the server. Once deleted, courses cannot be restored」, Yes.
- 찼을 때: 안내 글은 칸을 비우려면 프로필에서 지운다고 적음. 업로드 시도 때 화면 문구는 미확인. 수치는 2019–2020 보도(32 → 64 → 100, 검색 발췌)로 원문은 열지 못함.

### Scratch (포럼 사용자 글, 초안이 아닌 프로젝트)

- URL: https://scratch.mit.edu/discuss/post/4714265
- 진입: 미확인(My Stuff 안). 방식: 휴지통. Trash 에서 되돌림, 비우면 복구 불가라고 사용자들이 적음. 공식 문서는 못 찾음. 한도: 미확인.

## 디자인 시스템

표본 7곳. 캡처는 `~/noslog-research/draft-delete/` 의 같은 이름 `.png` · `.txt`.

| 곳         | URL                                                                                                                                                             | 확인한 내용                                                                                                                                                                                                                                                                                           |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Apple HIG  | https://developer.apple.com/design/human-interface-guidelines/alerts (`apple-alerts`) · /action-sheets (`apple-menus`)                                          | 되돌릴 수 있는 흔한 동작에는 경고를 띄우지 말고, 되돌릴 수 없는 드문 파괴 동작에는 띄운다. 취소 버튼 제목은 늘 「Cancel」, 기본 버튼으로 두지 않는다. 사용자가 일부러 고른 파괴 동작의 버튼에는 destructive 스타일을 쓰지 않는다(예 Empty Trash). 작성 취소에는 경고 대신 액션 시트(초안 삭제 · 저장) |
| Material 3 | https://m3.material.io/components/dialogs/guidelines (`m3-dialogs`)                                                                                             | 사과 · 경고조 · 모호함(「Are you sure?」)을 피한다. 확인 버튼이 가장자리, 닫기 버튼은 그 왼쪽                                                                                                                                                                                                         |
| Primer     | https://primer.style/product/components/confirmation-dialog/guidelines/ (`primer-confirm`)                                                                      | 파괴적 · 되돌릴 수 없는 동작에 쓴다. 쉽게 되돌리는 동작 · 자주 하는 동작에는 쓰지 않는다. 예시 제목 「Delete repository?」, 버튼 「Delete repository」(danger)                                                                                                                                        |
| Carbon     | https://carbondesignsystem.com/components/modal/usage/ (`carbon-modal`)                                                                                         | 제목과 버튼이 일어날 동작을 나타낸다. 파괴적 · 되돌릴 수 없으면 danger 모달                                                                                                                                                                                                                           |
| Polaris    | https://shopify.dev/docs/api/app-home/polaris-web-components/overlays/modal (`polaris-modal`)                                                                   | 예시: 제목 「Delete product?」, 본문 「Are you sure you want to delete "Winter jacket"?」 · 「This action cannot be undone.」, 버튼 「Delete product」(critical)                                                                                                                                      |
| Fluent 2   | https://fluent2.microsoft.design/components/web/react/core/dialog/usage (`fluent`)                                                                              | 경고 창은 손실 가능성이 있을 때만. 버튼은 제목에 대한 구체적 답, 예 「Delete」 · 「Cancel」                                                                                                                                                                                                           |
| Atlassian  | https://atlassian.design/foundations/content/designing-messages/warning-messages (`atlassian-writing`) · https://atlassian.design/components/modal-dialog/usage | 진행 여부를 묻고, 멈출 이유를 설명하고, 쉽게 되돌릴 수 있는지 알린다. 주 버튼은 창 제목과 맞춘다                                                                                                                                                                                                      |

GOV.UK Design System 은 확인한 쪽(`gov-exit`)에 해당 지침이 없고 `patterns/confirm-an-action` 은 404 라 세지 않았다.

## 디자인 시스템이 아닌 지침

표본 1곳(NN/g, 글 2개).

- https://www.nngroup.com/articles/confirmation-dialog/ — 되돌리기가 있으면 그쪽을 권함. 잦은 확인은 습관적으로 넘기게 함. 지울 대상을 이름으로 적고, 버튼은 「Delete file」 · 「Keep file」 처럼 결과로.
- https://www.nngroup.com/articles/proximity-consequential-options/ — 위험한 선택지는 평범한 선택지 옆에 붙이지 않고, 조금 더 멀리 둔다.

## 막혔거나 세지 않은 곳

| 곳                                              | 사유                                                                                                          |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Tistory                                         | 삭제 안내 글(https://ng-insight.com/entry/Tistory…, `ng-tistory`)이 절차를 이미지로만 담음. 공식 문서 못 찾음 |
| 네이버 블로그                                   | 공식 도움말 못 찾음. blog.naver.com 은 검색 도구가 막음                                                       |
| Brunch                                          | 카카오 고객센터(https://cs.kakao.com/helps_html/1073184005)는 작가의 서랍 설명뿐, 삭제 내용 없음              |
| Substack                                        | 공식 문서 없음. 경쟁사 블로그의 검색 발췌만 봄(Posts → Drafts → ⋯ → Delete → 확인)                            |
| Hashnode                                        | 공식 문서 도메인이 이 환경에서 열리지 않음. 검색 발췌만 봄(줄의 「Delete」 → 팝업 「Ok」)                     |
| TikTok                                          | 지원 페이지 본문을 못 읽음. 검색 발췌만 봄(Settings → Free up space → Drafts Manage → Select → Delete)        |
| Facebook · Tumblr                               | 공식 문서 없음. 제3자 글끼리 어긋나거나 품질이 낮음                                                           |
| Discord                                         | 초안 목록 기능을 확인하지 못함                                                                                |
| SoundCloud                                      | 초안 대신 3일 안에 곡으로 만드는 업로드 기한 문서만 있음(`soundcloud`). 삭제 내용 없음                        |
| Mastodon                                        | 초안 삭제 자리를 확인하지 못해 세지 않음                                                                      |
| wordpress.com/support 직접 캡처 · Tumblr 도움말 | headless 에서 「Checking your browser」 벽. WordPress.com 은 WebFetch 로 읽음                                 |

## 집계

실제 서비스 30곳(소스 7 · 공식 18 · 제3자 또는 포럼 5). 이 가운데 Notion · Scratch · Super Mario Maker 2 · osu! · Wikipedia 는 대상이나 방식이 초안 삭제와 다르다. 한 곳이 여러 칸에 들어간다.

| 진입 위치                                             | 곳 수 | 곳                                                                                                                              |
| ----------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------- |
| 목록 줄의 버튼 · 아이콘 · 링크(올리면 나오는 것 포함) | 10    | Velog · Bluesky · Discourse · WriteFreely · AO3 · GitHub 릴리스 · WordPress.com · Slack · Front · LinkedIn(문서 하나)           |
| 목록 줄의 ⋯ · 화살표 메뉴                             | 4     | Medium · Instagram 릴스 · LinkedIn(다른 문서) · Notion                                                                          |
| 오른쪽 클릭 메뉴                                      | 3     | Ghost · Outlook · Notion                                                                                                        |
| 모바일 줄 밀기                                        | 2     | Reddit · 네이버웍스 메일                                                                                                        |
| 에디터 · 상세 화면 안                                 | 10    | Shopify · WordPress.com · Ghost · Medium · Notion · Front · 네이버웍스 메일 · 네이버웍스 게시글 · Super Mario Maker 2 · Outlook |
| 여러 개 선택                                          | 10    | YouTube Studio · Mailchimp · X · Instagram 게시물 · Discourse · Shopify · WordPress.com · Slack · Publer · Ghost                |
| 전체 일괄만                                           | 1     | Buffer                                                                                                                          |
| 미확인                                                | 6     | Gmail · eBay · DEV(확인 페이지만 확인) · osu! · Scratch · Wikipedia(버튼 없이 요청)                                             |

| 확인 방식                       | 곳 수 | 곳                                                                                                                                                                                                    |
| ------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 확인 단계(창 또는 팝업)         | 17    | Velog · Bluesky · Discourse · Ghost · YouTube Studio · LinkedIn · Shopify · Mailchimp · X · Instagram · Medium · Front · Publer · Super Mario Maker 2 · GitHub 릴리스 · Buffer · WordPress.com 에디터 |
| 그중 추가 조작                  | 2     | YouTube Studio(체크 상자) · Buffer(단어 입력)                                                                                                                                                         |
| 별도 확인 페이지                | 2     | DEV · AO3                                                                                                                                                                                             |
| 휴지통                          | 3     | WordPress.com · Notion · Scratch                                                                                                                                                                      |
| 되돌리기 알림                   | 1     | WordPress(wp-admin 소스의 「Undo」)                                                                                                                                                                   |
| 미확인                          | 7     | Gmail · Slack · Outlook · 네이버웍스 · Reddit · WriteFreely · eBay                                                                                                                                    |
| 해당 없음 또는 삭제 화면 미확인 | 2     | osu! · Wikipedia                                                                                                                                                                                      |

지운 뒤 복구 불가를 문구나 문서로 밝힌 곳은 13곳이다(Velog · Bluesky · DEV · AO3 · Ghost · Gmail · YouTube Studio · LinkedIn · Medium · Front · Publer · 네이버웍스 게시글 · Super Mario Maker 2). 초안 삭제 뒤 되돌림을 확인한 곳은 WordPress.com(30일) · Notion(30일) · Scratch(비우기 전) 3곳이다.

개수 한도와 찼을 때: Bluesky(문구 확인, 수치 미확인) · osu!(수치와 되살리기 실패 문구) · Super Mario Maker 2(지워서 비움, 화면 문구 미확인) · eBay(250 · 5,000, 찼을 때 미확인) · Discourse(10,000, 찼을 때 미확인). 근거 약함(곳 수 5). 한도가 찼을 때 새 작업을 여는 화면 자체를 확인한 곳은 없다.

기간 자동 삭제: AO3 30일 · eBay 75일 · Discourse 180일 · Shopify 1년.
