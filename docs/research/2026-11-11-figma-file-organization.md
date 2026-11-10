# Figma 파일 정리 방식 조사 (2026-11-11)

실무 웹 디자인 팀이 Figma 파일 · 페이지 · 섹션을 어떻게 나누는지 모은 기록이다. 목적은 데스크톱 재설계 시안 파일(여러 세션이 나눠 그린 파일)의 정리 안을 만드는 것이다. 관련 페이지 묶기, 페이지 하나에 여러 씬 묶기, 파운데이션(색 · 글자 · 간격 · 부품) 정리를 본다.

확인 날짜는 모두 2026-11-11. WebSearch · WebFetch 로 공식 문서 · 공개 글 · Community 파일 설명을 읽었다. Figma 파일 자체는 열지 않았으므로 Community 파일의 페이지 목록은 공개 글 · 파일 설명 · 저장소에 적힌 것만 옮겼다. 거기 없는 것은 「미확인」 이다.

표본: 실제 팀 · 공개 파일 17곳, 공식 · 가이드 글 14곳(공식 9 · 가이드 5). 막혀 세지 않은 곳은 「막힘」 표에 있다.

종류 표기: 「공식」 은 Figma 자체 문서, 「실제 팀」 은 자기 팀 · 자기 디자인 시스템 파일을 설명한 글이나 공개 파일, 「가이드」 는 특정 팀이 아닌 일반 권장 글 · 템플릿이다.

## 공식 · 가이드 글

### Figma Best practices — Team, project, and file structure

- URL: https://www.figma.com/best-practices/team-file-organization/
- 종류: 공식
- 파일 나누기: 제품 면(Account · Cart · Homepage) 또는 흐름 단위 파일. 처음부터 끝까지 이어 보는 「Full flow」 파일을 따로 둔다. 본 흐름은 파일 하나, 반복 작업은 다른 파일 · 브랜치에서 하고 출시 주기에 맞춰 합친 뒤 작은 파일은 아카이브. 플랫폼은 같은 개발자가 만들면 한 파일, 다르면 나눈다. 플랫폼 하나가 프레임 수백 개가 되면 페이지 · 파일로 나눈다. 그림이 많은 리서치는 성능 때문에 따로.
- 폴더(프로젝트) 첫 층: 제품 면 · 작업 상태(Production · In progress · Archive) · 디자인 단계(WIP · Review · Shipped) 중 하나로 정하고 가지마다 같은 논리를 쓴다. 디자인 시스템은 자기 팀을 따로 둔다.
- 페이지 구성(순서대로): Cover · Visual research · User research(선택) · Discovery · Flow · Prototype(선택) · Local components(선택) · Ready for development. 단계 사이는 하이픈 구분 페이지.
- 표지: 최소한 파일 이름 · 짧은 설명. 작업 스크린샷 · 상태 · 팀 사진을 더할 수 있다. 표지 프리셋으로 만들고 파일마다 같은 구조.
- 이름 규칙: 검색 결과에서 홀로 읽히게(「Auth」 대신 「Account auth」). 진행 중 파일 · 브랜치는 티켓 번호(「TWIG-813 - Button A/B test」 · 「TWIG-812 → Form fields」). 리서치 파일은 본 파일 이름 + 「- Research」. 큰 변경은 이름 붙은 버전(「January - Full profile user flow」).
- 파운데이션: 공유 라이브러리는 전용 팀에. 파일 전용 부품은 「Local components」 페이지. 긴 부품 문서는 별도 파일로 두어 문서와 부품 버전을 따로 낸다.
- 아카이브: 은퇴한 작업은 활성 폴더 밖으로. 큰 팀은 제품 면마다 Archive 하위 폴더, 작은 팀은 팀 전체 Archive 하나. Archive 전용 팀은 과하다고 적음.

### Figma Help — Create and manage pages

- URL: https://help.figma.com/hc/en-us/articles/360038511293
- 종류: 공식
- 페이지 쓰임 예: 디자인 단계별 페이지, 「ready for development」 전용 페이지, 마일스톤 · 크리틱용 고정 페이지, 메인 부품 · 스타일 정의 전용 페이지, 사용자 흐름마다 페이지(한 페이지에 프로토타입 여럿 가능, 미리보기는 한 번에 흐름 하나), 페이지 복제로 스냅샷 · 변형 만들기, 큰 파일은 레이어를 다른 페이지로 옮겨 나누기(댓글 유지).
- 구분 페이지: 빈 페이지 이름 맨 앞에 「-」 를 넣으면 구분선. 내용 있는 페이지는 구분선이 될 수 없다. 구분선에는 이름을 붙일 수 없다(포럼 기능 요청 https://forum.figma.com/t/add-a-name-for-each-divider/72080).
- 이름 규칙: 「spacer」 페이지 · 이모지로 목적과 상태를 알린다.
- 제한: Starter 팀 파일은 페이지 3개까지, 유료 요금제는 제한 없음. 페이지 캔버스는 축마다 약 ±130,000.

### Figma Help — Organize your canvas with sections

- URL: https://help.figma.com/hc/en-us/articles/9771500257687
- 종류: 공식
- 섹션은 캔버스의 이름 붙은 구역이다. 협업 · 아이디어 구역 지정, 탐색, 묶음 링크 공유, 개발 넘김 표시에 쓴다.
- 섹션은 캔버스 맨 위 층에 놓이고 섹션 안에 섹션을 넣을 수 있다. 프레임 · 그룹 안에는 못 넣는다. 레이어 패널에서 섹션 아이콘을 두 번 눌러 이동, 섹션 링크 공유 가능.
- 상태: 내용이 끝나면 섹션을 골라 「Mark as ready for dev」. 표시 뒤 고치면 자동으로 「Changed」 가 되고, 다시 Ready 로 돌리려면 이유를 적는다. 흐름별 · 상태별 묶기는 이 글에 없음(미확인).

### Figma Help — Dev Mode statuses and notifications

- URL: https://help.figma.com/hc/en-us/articles/26781702258583
- 종류: 공식
- 상태는 「Ready for dev」(Dev Mode 있는 모든 요금제)와 「Completed」(Organization · Enterprise)뿐이다. 표시 뒤 고치면 「Changed」. 그 밖의 상태(검토 중 · 승인 · 아카이브)는 기본 기능에 없고 포럼에서 요청 중이다(https://forum.figma.com/suggest-a-feature-11/section-statuses-besides-ready-for-dev-approved-in-progress-archived-etc-16717/index1.html). 그래서 팀들은 이모지 · 접두사 · 상태 배지 부품으로 대신한다(아래 곳들 참고).

### Figma Best practices — Guide to developer handoff

- URL: https://www.figma.com/best-practices/guide-to-developer-handoff/
- 종류: 공식(여러 회사 사례를 인용)
- 페이지로 「작업 중 · 피드백 준비 · 만들 준비」 를 나눈다. 상태 이모지 예 🏗️ · 💭 · 🚢.
- 인용 사례: Cash App 은 공유할 프레임마다 전용 페이지를 만들고 거기에 인스턴스를 두어, 지저분한 작업 페이지의 원본을 고치면 따라 바뀌게 한다. Dropbox 는 큰 프로젝트 하나에 파일 하나, 페이지에 반복 · 버전을 모두 두고 개발자에게 링크 하나만 준다. 결정은 따로 쓴 디자인 명세 문서에서 반복안 · 문제 정의 · 리서치로 링크한다. Expedia 는 부품 세트마다 이름 · 설명 · 사용법 · 변형 · 상태를 한 프레임에 둔다.
- 섹션 · 아카이브는 이 글에 없음.

### Figma Best practices — Components, styles, and shared libraries

- URL: https://www.figma.com/best-practices/components-styles-and-shared-libraries/
- 종류: 공식
- 라이브러리는 대상 · 플랫폼으로 나눠 필요한 것만 켜게 한다. 색 · 글자 스타일도 공유 라이브러리에.
- 라이브러리 파일 안: 페이지 = 큰 묶음, 프레임 = 관련 부품(예 Buttons 페이지 안에 버튼 종류마다 프레임). 페이지 이름은 부품 패널의 최상위 제목, 프레임 이름은 접히는 하위 제목이 된다. 슬래시 이름(「buttons/primary/default」)은 빠르지만 큰 시스템에선 이름이 길어진다.
- 이름 규칙: 발행하지 않을 도우미 부품은 이름 앞에 「_」 · 「.」.
- 문서는 라이브러리 파일 안 메인 부품 옆에 둔다.

## 실제 팀 · 공개 파일

### GitLab — Pajamas UI Kit

- URL: https://design.gitlab.com/get-started/uik-file-structure · https://design.gitlab.com/get-started/uik-contributing
- 종류: 실제 팀(디자인 시스템 공개)
- 파일 구성(라이브러리 7개, 파일마다 따로 발행): Design tokens(토큰을 Figma 변수로, 색 스타일 포함) · 📙 Component library · GitLab Product Icons · GitLab Product Illustrations · Patterns and Page Templates(기능 팀 소유 자산, 다수는 복사해 쓰는 「sticker sheet」) · Data Visualization · Annotations and utilities(주석 · 발표 도구).
- 파운데이션 위치: 토큰 · 색은 부품 파일과 다른 파일(Design tokens)에 둔다.
- 변경 흐름: 브랜치에서 고치고 디자인 시스템 팀에 브랜치 검토를 요청한다. 브랜치 설명이 릴리스 노트가 되며 줄마다 「-」 와 동사(Adds · Enhances · Changes · Removes · Fixes · Deprecates)로 시작한다.
- 파일 안 페이지 이름 · 순서 · 부품 배치: 공개 문서에 없음(미확인). 현행 구조 문서로 안내되는 gitlab-design 저장소의 CONTRIBUTING-Figma.md 는 404 였다.
- 아카이브: 미확인.

### Kiwi.com — 제품 화면 파일 · Orbit 라이브러리

- URL: https://www.figma.com/blog/how-kiwi-com-handles-project-structure-versioning-and-components-in-figma/ · 후속 글 https://medium.com/designing-kiwi-com/versioning-design-system-with-figma-take-two-124295a91268(403, 검색 요약만)
- 종류: 실제 팀
- 파일 나누기: 프로젝트 · 흐름마다 파일 하나(place picker · date picker · search 같은 단위). 흐름을 한 파일에 많이 넣으면 느리다는 이유. 대가로 파일을 넘는 프로토타입은 못 잇는다. Figma 팀은 도메인(App · Web)으로, 프로젝트는 Booking 처럼 기능으로 묶는다(Orbit 안내 검색 요약).
- 페이지 구성: 버전마다 페이지 하나, 이름은 「XY」(X 큰 버전 · Y 작은 반복), 최신을 맨 위에. 라이브러리로 옮길 후보를 모은 components 페이지가 따로 있다.
- 표지: 프로젝트마다 표지 그림(파일 제목만으로는 훑기 어려워서).
- 파운데이션 위치: 토큰 파일을 따로 두고 페이지 셋(colors · typography · shadows, 그림자 4단계). 아이콘은 자기 페이지에 섹션으로 나누고 24×24 프레임마다 하나. 일러스트는 한 캔버스에 같은 크기로. 부품은 iOS · Android 를 합친 Orbit Mobile 라이브러리.
- 이후: 1년 뒤 글에서 페이지 = 버전 방식이 원본 파일을 어지럽혔다고 돌아보고 흐름 · 바뀌는 부품을 따로 버전 관리하도록 바꿨다(세부는 403 으로 미확인).
- 아카이브: 미확인.

### Hygraph(옛 GraphCMS)

- URL: https://hygraph.com/blog/how-we-organize-our-files-and-projects-in-figma
- 종류: 실제 팀(작은 팀)
- 팀 · 프로젝트: Figma 팀 하나. 큰 프로젝트 셋 「⚡️ Feature」(새 기능 · 개선) · 「🎨 Baukasten」(스타일 가이드 · 부품 = 디자인 시스템) · 「🔥 Marketing」(웹사이트 · 문서 · 블로그). 필요할 때 「Feedback」 같은 임시 프로젝트.
- 기능 파일 페이지(순서대로): Cover · 🔍 Research · 📝 Scratchpad · ✅ UI · ▶️ Prototype(선택) · 👌 QA.
- 페이지 안 배치: UI 페이지가 엔지니어의 정본이고 프레임을 사용자 흐름별로 묶는다. 프레임 제목은 기본 프레임 이름표를 써 확대해도 읽히게. 상태 · 화면 폭별 배치는 글에 없음(미확인).
- 표지: 첫 페이지에 같은 배경으로 따로 만든다(프레임 썸네일은 크기가 안 맞아서). 협업자 · 일정 · 상태, Discovery 에서 Live 까지 이어지는 진행 막대.
- 템플릿: 위 페이지와 기본 프레임을 넣은 템플릿 파일을 Feature 프로젝트 맨 위에 고정.
- 파운데이션 위치: 디자인 시스템은 Baukasten 프로젝트에 따로. 캡처에 「Get Started」 · 「Foundation」 · 「Components」 묶음이 보인다고만 적힘(세부 미확인).
- 이름 규칙: 페이지 이름 앞에 이모지. 상태 이모지 체계는 따로 없음.
- 아카이브: 글에 없음(미확인). QA 페이지에는 개발 뒤 미리보기 환경 스크린샷과 어긋난 곳을 붙인다.

### Akvo

- URL: https://wiki.cloud.akvo.org/books/design/page/figma-content-organization
- 종류: 실제 팀(작은 팀, 공개 위키)
- 팀 · 프로젝트: 「The Akvo Design Team」 팀 하나, 프로젝트는 고객 이름 → 개별 프로젝트.
- 파일 이름: 「ClientName - Project Name」(예 「UNICEF - RTMIS」). 프로젝트마다 파일 셋 Designs(디자인 · 프로토타입) · Assets(그림 자산) · Documentation(FigJam 브레인스토밍).
- 페이지(순서대로): Sandbox · Final Designs. 두 페이지로 탐색과 결정본만 나눈다.
- 표지 · 섹션 · 상태 · 아카이브 · 디자인 시스템: 미확인.

### Phoenix Group — Compound 디자인 시스템

- URL: https://compound.thephoenixgroup.com/latest/figma/overview/setup-and-structure-tqFJ515r
- 종류: 실제 팀(디자인 시스템 공개 문서)
- 팀: 업무 기능마다 팀(브랜드 · 부품 라이브러리 · 탐색). 브랜드 팀은 FigJam 협업 파일과 프로젝트 파일, 프로젝트는 작업별 파일을 묶는다.
- 페이지: 이름을 정해진 꼴로 붙인다. 「Cover」 와 「Graveyard」 는 파일에 하나씩, 나머지는 같은 종류가 여럿 있어도 된다(Graveyard = 버린 것 모으는 페이지로 보이나 설명 없음).
- 부품 파일: 「Overview」 표지 파일이 썸네일을 가진다. 부품마다 페이지 하나, 이름은 메인 부품 이름과 같다. 웹 부품은 부품마다 파일 하나(관리 · 부품 단위 브랜치를 쉽게), React Native 부품은 덜 바뀌어서 파일 하나에 모두.
- 브랜치: 모든 파일에서 브랜치로 본 파일과 따로 작업.
- 파운데이션 위치 · 순서 · 상태: 미확인.

### Figma Blog — 5 ways to structure your workflow with Pages

- URL: https://www.figma.com/blog/five-ways-to-structure-your-workflow-with-pages-in-figma/
- 종류: 공식(사용자 사례 모음)
- 다섯 방식: 플랫폼 · 화면 폭마다 페이지(페이지마다 프로토타입) · 앱 기능마다 페이지 · 디자인 단계마다 페이지 · 아토믹(atoms · molecules · organisms) · 섞어 쓰기(디자인 시스템 파일은 아토믹, 앱 파일은 OS 별 페이지).
- 이름 붙은 단계 예: Cameron McNab 「Thumbnail · wireframes · designs · archive」, Nick McVey 「Docs · staging · ready for review」, Michael Robson 「Sitemap · wireframes · mockups · QA · screenshots for marketing」. 개인 사례라 실제 팀 표본에는 세지 않는다.

### WordPress 디자인 팀

- URL: https://make.wordpress.org/design/handbook/get-involved/tools-figma/
- 종류: 실제 팀(공개 핸드북)
- 프로젝트: 프로젝트로 파일을 묶고 하위 폴더는 없다. 프로젝트 이름은 문장형 대소문자 · 띄어쓰기.
- 페이지(순서대로): Cover(늘 맨 위) · Iterations(최신이 위, 내림차순) · Current UI(작업 전 지금 화면 스크린샷, 변화 기록용) · Explorations(다른 접근 시험, 버린 안 포함). 필요하면 플랫폼 · 기기별, 부품 · 스타일 정리, 단계 추적, 프로토타입 흐름별 페이지를 더한다.
- 표지: 첫 페이지 「Cover」 에 「figma-cover」 자산을 넣는다. 상태마다 표지 색이 정해져 있다: Archived (do not use) #D94F4F · In design #F0B849 · In development #4AB866 · Shipped #00669B · Design resource/library #23282D. 파일 배경도 표지에 맞춘다(2021 사본 기준 검색 요약).
- 파운데이션 위치: 부품 · 스타일 · 아이콘을 하나로 합친 「WordPress Design Library」(읽기 전용, 복제해 편집). 웹사이트용 「WordPress.org Design Library」, 작업 중 라이브러리 「System」 은 따로.
- 이름 규칙: 제목 25자 이하 · 명령형, 설명 140자 이하로 무엇 · 왜.
- 아카이브: 표지 상태 「Archived (do not use)」 로만 표시. 따로 옮기는 곳은 없음.

### GitHub — Primer

- URL: https://primer.style/guides/figma
- 종류: 실제 팀(디자인 시스템 공개)
- 파일 구성: Primer Primitives(토큰: 색 · 글자 · 간격. 색 · 크기는 변수, 글자 · 그림자는 스타일) · Primer Web(웹 부품, 라이트 · 다크 모드를 변수로) · Primer Mobile(내부) · Octicons(아이콘) · Primer Interfaces(GitHub 공통 화면 템플릿) · Primer Email(메일 템플릿). 핵심 라이브러리는 내부 「Core libraries」 프로젝트에.
- 파운데이션 위치: 토큰 파일과 부품 파일을 나눈다. 변수는 다른 변수를 참조한다(예 `fgColor/danger` → `base/color/red/4`). 변수 범위를 칠 · 글자 · 선으로 묶는다.
- 브랜치: Primer Web 기여는 `@username/changes-being-made` 꼴 브랜치(예 `@lukasoppermann/update-button-radius`).
- 파일 안 페이지 이름 · 순서 · 아카이브: 미확인(CONTRIBUTION.md 원문 404).

### IBM — Carbon

- URL: https://carbondesignsystem.com/designing/kits/figma/ · https://medium.com/carbondesign/introducing-figma-variables-and-a-consolidated-all-themes-library-d4893d1b8920(403, 검색 요약만)
- 종류: 실제 팀(디자인 시스템 공개)
- 파일 구성: 함께 켜는 기본 라이브러리 다섯 「(v11) Carbon Design System」(테마 · 부품) · 「(v11) Carbon Type Sets」 · 「IBM® Color Library」 · 「IBM® UI Icon Library」 · 「IBM® Pictogram Library」, 그리고 확장 라이브러리(차트 · 네이티브 모바일 · 접근성 · 중간 충실도 키트).
- 파운데이션 위치: 글자 · 색 · 아이콘을 부품 파일과 다른 파일로. 테마 넷(White · Gray 10 · Gray 90 · Gray 100)은 변수 모드로 「(v11) All themes」 파일 하나에 합쳤다(검색 요약).
- 이름 규칙: 파일 이름 앞에 버전 · 성숙도 괄호 「(v11)」 · 「(Alpha)」 · 「(Beta)」.
- 아카이브: 옛 테마 파일(Gray 10 · 90 · 100)은 지우지 않고 「deprecated」 로 두고 갱신만 멈춘다(검색 요약).
- 파일 안 페이지: 미확인.

### Atlassian Design System

- URL: https://atlassian.design/get-started/design/figma-libraries/atlassians · https://atlassian.design/resources/figma-library
- 종류: 실제 팀(디자인 시스템 공개)
- 파일 구성: 공개 라이브러리는 「ADS Foundations」 와 「ADS Components」 를 함께 켠다. 커뮤니티 질문 글에는 ADS Components · ADS Tokens · ADS Foundations 세 파일로 내려받았다고 적힘(https://community.atlassian.com/forums/Jira-questions/Figma-Atlassian-Design-System-Files-Questions/qaq-p/2563634). 내부용은 토큰 플러그인 · 접근성 주석 라이브러리가 따로.
- 파운데이션 위치: 부품과 다른 파일.
- 파일 안 페이지 · 아카이브: 미확인(내부 전용).

### British Red Cross 디자인 시스템

- URL: https://design.redcross.org.uk/design-system/designers-get-started-guide
- 종류: 실제 팀
- 라이브러리 하나에 세 구역 Foundations(색 · 글자 · 간격 · 그리드 · 아이콘) · Components · Patterns.
- 제품 파일 · 페이지 · 아카이브: 미확인(문의하라고만 적힘).

### Government of Alberta 디자인 시스템

- URL: https://design.alberta.ca/get-started/designers/
- 종류: 실제 팀
- 디지털 서비스 프로젝트 폴더마다 시작 Figma 템플릿이 들어 있다(파일 정리 · 개발 넘김 · 탐색용). 도우미 부품도 있다.
- 이름 규칙: 코드에도 있는 부품은 「goa-」 접두사(예 `goa-input`).
- 템플릿 안 페이지 이름 · 순서: 미확인.

### Shopify — 프로젝트 파일 템플릿

- URL: https://www.figma.com/blog/how-shopify-facilitates-collaboration-in-figma/
- 종류: 실제 팀(Shopify 팀이 Figma 블로그에 쓴 글)
- 페이지 구성: 글의 묶음은 Cover · Project overview · Think · Explore · Build · Archive. 페이지 순서는 작업 과정의 거꾸로라 만들 준비가 된 것(Build)이 맨 위에 온다고 적혀 있어 실제 순서는 Cover · Project overview · Build · Explore · Think · Archive 로 읽힌다. Cover · Project overview 와 Build 의 앞뒤는 글에 정확히 없음(미확인).
- 표지: 프로젝트 이름 · 소유 팀 · 상태 표시. 진행에 따라 상태 표시를 바꾼다.
- Project overview: 맥락 · 자료 링크 · 문의할 사람(문서 · Slack 프로필 링크).
- Think: 문제 이해. 사용자 흐름 · 여정 지도 · 문서 링크 · 옛 화면 스크린샷. 가장 먼저 채운다.
- Explore: 여러 안을 펼치는 곳. 기기 · 폼팩터마다 페이지, 탐색안 · 흐름마다 제목, 탐색안마다 상태 배지, 새 페이지마다 날짜, 사용자 테스트용 프로토타입은 페이지 따로, 메모는 스티키 부품.
- Build: 구현할 것만, 페이지 수는 적게. 마일스톤 · 기기(iPhone · iPad)마다 페이지, 마지막 수정 날짜, 티켓에서 이 페이지로 링크, 거쳐야 할 검토 체크리스트.
- 결정 기록: 따로 된 결정 로그는 없음. 상태 표시 · 배지 · 날짜 · 댓글 · Build 체크리스트로 대신.
- 파운데이션 위치: 템플릿 밖. 디자인 시스템(Polaris for Retail)은 Retail Foundations 팀이 따로 낸다.
- 아카이브: 마지막 페이지 「Archive」 에 채택되지 않은 디자인 · 페이지를 남긴다.

### CMS(미국 메디케어 · 메디케이드 센터) 디자인 시스템

- URL: https://design.cms.gov/getting-started/for-designers/
- 종류: 실제 팀
- 파일: 시스템 전체가 주 파일 하나에 있고 공유 라이브러리로 낸다. 원본 편집 권한은 막혀 있다.
- 파운데이션 위치: 같은 파일. 테마 넷(Core · Healthcare.gov · Medicare.gov · CMS.gov)을 모드로 한 파일에 담는다. 제품 테마는 페이지 · 프레임 단위로 걸고 부품은 「auto」 로 두어 부모 테마를 따르게 한다. 레이아웃 그리드도 라이브러리에.
- 페이지: 이름이 드러난 것은 테마 · 하위 시스템 설정 안내 페이지 「Figma Setup」 하나. 나머지 페이지 · 순서는 미확인.

### 영국 법무부(MOJ) 디자인 시스템

- URL: https://design-patterns.service.justice.gov.uk/prototyping/setting-up-figma-prototypes
- 종류: 실제 팀
- 라이브러리: Figma Kit 다섯 개가 모든 MOJ 파일에 자동으로 켜진다. MOJ Figma Kit 는 「GOV.UK & MOJ Styles」 와 「GOV.UK Figma Kit」 가 함께 있어야 한다. 스타일(파운데이션)과 부품 키트가 다른 파일이다.
- 제품 파일 · 페이지 · 아카이브: 미확인.

### Equinor — EDS

- URL: https://eds.equinor.com/docs/about/getting-started/design/figma
- 종류: 실제 팀
- 팀: 프로젝트 하나에 팀 하나.
- 표지: 첫 페이지 이름은 「Cover」, 「Default File Cover」 부품에 프로젝트 정보 · 담당자 · 연락처. 진행에 따라 표지의 상태 배지와 배경색을 바꾼다.
- 페이지: 앱의 구역마다 페이지, 파일 전용 부품 · 스케치도 페이지 따로. 순서는 Cover 말고 미확인.
- 페이지 안 배치: 프레임은 가로로 늘어놓고 위를 맞추고 간격을 같게. 한 화면의 변형은 그 화면 아래로 세로로 쌓는다.
- 탐색: 디자이너끼리 안을 나누는 「EDS Designer Sandbox」 공간이 따로 있다.
- 파운데이션 위치 · 아카이브: 미확인.

### The Interactive Studio(OKB Interactive Studio, 에이전시)

- URL: https://blog---jekyll-static-site.pages.dev/how-we-organize-our-projects-at-figma
- 종류: 실제 팀(에이전시)
- 팀 · 프로젝트: 스튜디오 전체가 팀 하나, Figma 프로젝트 = 고객, 파일 = 고객이 요청한 작업 하나(웹사이트 · 웹앱 · 랜딩 페이지).
- 파일 안 구성(세 묶음 여섯 칸, 모든 프로젝트 같게, 비어도 만든다): Kick-off(The Cover · Client Documentation · Visual Research) → Development(Wireframes · Design System) → Delivery(Prototypes). 페이지 이름 그대로인지 묶음 상자인지는 글에 정확히 없음.
- 파운데이션 위치: 프로젝트 파일 안 「Design System」 칸(최종 색 · 글자 · 그리드 · 재사용 부품). 시안과 따로 고객에게 공유할 수 있게 상자를 나눈다.
- 프로토타입: 첫 프레임 이름을 「Start」 로 하고 사용법 · 버전 링크를 둔다.
- 아카이브 · 상태: 미확인.

### SSW(호주 컨설팅사) — Rules to Better Figma

- URL: https://www.ssw.com.au/rules/outdated-figma · https://www.ssw.com.au/rules/done-tasks-figma · https://www.ssw.com.au/rules/figma-dev-mode
- 종류: 실제 팀(회사 규칙 공개)
- 낡은 디자인 표시: 낡은 작업을 Archive 구역으로 옮긴다. 구분 페이지를 쓰거나 이름 앞에 「zz」 를 붙여 목록 맨 아래로 가라앉힌다. 프레임 맨 위에 잠근 경고 배너(「Out of date — refer to production {{ LINK }}」 또는 「Deprecated」 배지)와 운영 화면 링크, 「Maintainers: {{ DESIGNER }}」 메모.
- 구현 끝 표시: 개발이 구현하면 디자이너가 확인한 뒤 「✅ Done」 댓글을 단다(앞의 「TODO」 댓글과 짝).
- 파일 · 페이지 구성 · 파운데이션: 미확인.

## 공식 · 가이드 글 (이어서)

### Figma Help — Guide to Dev Mode

- URL: https://help.figma.com/hc/en-us/articles/15023124644247
- 종류: 공식
- Dev Mode 는 섹션 안 내용을 먼저 보여 주고 섹션 밖 내용은 사이드바에서 접어 둔다. 페이지 목록에 Ready 표시가 있는 페이지를 아이콘으로 알린다. 상태는 섹션 · 프레임 · 부품에 건다.
- 프레임마다 마지막 수정 날짜가 보이고, 바뀐 디자인은 「Compare changes」 로 이전과 비교한다.

### Figma Help — View a file's version history

- URL: https://help.figma.com/hc/en-us/articles/360038006754
- 종류: 공식
- 이름 붙은 버전: 제목(25자 넘으면 잘림) · 설명(140자 이하 권장)으로 마일스톤을 남긴다. 자동 체크포인트는 약 30분마다. 버전을 새 파일로 복제할 수 있다(댓글 · 기록은 안 따라감). Starter · 초안은 30일, 유료는 전체 기록.

### LogRocket Blog — Organizing Figma files for team collaboration

- URL: https://blog.logrocket.com/ux-design/organizing-figma-files-team-collaboration/
- 종류: 가이드
- 프로젝트 예: Design system · In progress · Approved · Not approved · Archive · Illustrations · Inspiration.
- 파일 한 개 페이지(순서대로): Cover · Production(빈 구분 페이지) · 사용자 스토리 페이지들 · 프로토타입 페이지 · 부품 페이지 · Archive(빈 구분 페이지) · 낡은 탐색안 페이지들. 구분 페이지에 이름을 붙여 묶음 제목처럼 쓴다.
- 이름 규칙: 끝나 넘긴 페이지 이름에 체크 이모지. 아카이브 페이지 이름에 날짜.
- 페이지 안 배치: 흐름은 화면을 차례로 놓고 화살표. 부품 상태는 본 프레임 옆에. 프레임 제목은 큰 제목이나 섹션으로 확대해도 읽히게. 화면 폭 배치는 글에 없음.
- 파운데이션 위치: 라이브러리는 작업 파일과 다른 파일. 큰 시스템은 스타일 라이브러리(색 · 글자 · 그림자) · 플랫폼 라이브러리(iOS · Android · Web) · 테마 라이브러리(라이트 · 다크)로 나눈다.
- 아카이브: 지우지 않고 Archive 아래로, 제목에 날짜.

### Bounteous(에이전시) — Figma full-cycle workflows Part 2

- URL: https://www.bounteous.com/insights/2024/02/28/revolutionizing-web-design-how-figma-streamlines-full-cycle-workflows-part-2/
- 종류: 가이드(에이전시 권장, 고객 사례 포함)
- 부품 라이브러리와 작업 파일을 다른 프로젝트에 둔다. 큰 라이브러리는 쓰임(global · cards · interactive)으로 파일을 나누고, 작으면 한 파일 안 페이지로 같은 분류.
- 표지에 핵심 내용과 상태 깃발. 캔버스 섹션에 「Ready for dev」 라벨. 고객 사례에서 브랜치 이름은 스프린트 번호 · 출시일 · 기능.

### Half Thoughts(Dean Harrison) — Using Figma to highlight progress and process

- URL: https://halfthought.substack.com/p/using-figma-to-highlight-progress
- 종류: 가이드(디자이너 개인 실무)
- 파일: 흐름 · 기능마다 파일 하나(예 공유 모달), 마스터 템플릿을 복제해 시작. 표지에 제목 · 담당 제품 · 기여자 · 상태(「ready for dev」) 또는 버전(「Version 1.0.1」).
- 페이지 묶음(위에서부터, 비디자이너가 많이 보는 것이 위): For dev · In review · Exploration · Archive. 탐색은 Exploration 에서만 하고, 검토할 때 새 페이지를 만들어 In review 로(이름 「V0.1」 · 「V1」, PRD · Loom 링크). 디자인 리드와 PM 이 승인하면 For dev 로. 출시 뒤 그대로 두거나 실제 제품을 비추는 마스터 파일로 옮긴다.
- 상태: 새 페이지마다 준비 상태 아이콘. 빨간 점이면 의견을 받는 중이고, 색이 바뀌면 의견은 다음 반복에만 반영.

### Jobins 블로그 — From chaos to order: how to organize Figma like a pro

- URL: https://blog.jobins.jp/from-chaos-to-order-how-to-organize-figma-like-a-pro
- 종류: 가이드
- 표지 프레임 1920×960 을 썸네일로. 프로젝트 이름 · 시작 날짜.
- 페이지는 분류마다, 이름 앞에 이모지. 구분 페이지는 하이픈 여럿. 시험용 「Playground」 페이지에서 해 본 뒤 본 페이지로 옮긴다.

### Solid Digital(에이전시) — 3 ways to organize Figma

- URL: https://www.soliddigital.com/blog/3-ways-figma-organization
- 종류: 가이드
- 표지 모양을 달리해 「Support」 파일과 고객용 파일을 한눈에 구분. 버전 · 「Last updated」 칸은 표지에 넣지 말라고 권한다(작성자 경험). 내비 · 푸터 · 버튼은 일찍 부품으로.
- 페이지 이름 · 순서 · 아카이브: 글에 없음.

## 막힘 · 세지 않은 곳

| 곳                                                                                       | 이유                                                                                      |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Doctolib · Oda · IDAGIO · Zeelo · Deliveroo · Digital AG Solutions · SpatialChat(Medium) | 403. 검색 요약에 일부만 보여(Oda 「Figma 팀 하나 = 실제 팀 하나」 등) 구성을 옮길 수 없음 |
| UX Collective · Prototypr 글(Medium)                                                     | 403. 검색 요약의 페이지 목록(Ticket info · Master …)은 원문 미확인                        |
| Viget                                                                                    | 429 두 번. 프로젝트 이름 「[고객 약자] 고객 이름」 만 검색 요약으로 봄                    |
| Ataccama Flamingo                                                                        | 본문이 스크립트로 그려져 비어 옴                                                          |
| Liferay 핸드북                                                                           | 404. 검색 요약에 「표지는 늘 1쪽, 이름 cover」 만                                         |
| Sourcegraph 핸드북                                                                       | Notion 으로 옮겨져 비어 옴. 옛 저장소 원문은 프로젝트 = 제품 영역만 적힘                  |
| Joystream(Notion) · Kiwi.com Orbit 안내                                                  | 비어 옴 · 404                                                                             |
| GitLab CONTRIBUTING-Figma.md · Primer CONTRIBUTION.md                                    | 404                                                                                       |
| Material 3 · GOV.UK · Fluent 2 · Polaris · Salesforce SLDS · SAP Fiori · Uber Base       | 공개 문서에 파일 안 페이지 목록이 없고 Figma Community 쪽은 403. SAP 웹 문서도 403        |
| Design Shack · Mantlr                                                                    | 403 · 402                                                                                 |

## 표본

- 실제 팀 · 공개 파일 17곳(파일을 열어 본 곳 없음, 공개 글 · 문서로 확인): GitLab · Kiwi.com · Hygraph · Akvo · Phoenix Group(Compound) · WordPress · GitHub(Primer) · IBM(Carbon) · Atlassian · British Red Cross · Government of Alberta · Shopify · CMS · 영국 법무부(MOJ) · Equinor · The Interactive Studio · SSW. 이 가운데 페이지 목록까지 확인한 곳은 6곳(Hygraph · Akvo · WordPress · Shopify · Kiwi.com · The Interactive Studio)뿐이다. 디자인 시스템 팀 다수는 파일 나누기만 공개한다.
- 공식 · 가이드 글 14곳: Figma 공식 9(Best practices 셋 · Help 다섯 · 블로그 하나), 가이드 5(LogRocket · Bounteous · Half Thoughts · Jobins · Solid Digital).
- Figma 공식 글이 인용한 Cash App · Dropbox · Expedia 는 실제 팀이지만 직접 쓴 글이 아니라 따로 세지 않았다.

## 공통 패턴

「팀」 은 실제 팀 17곳, 「글」 은 공식 · 가이드 14곳에서 센 수다. 팀 수가 3곳 안팎이면 「근거 약함」.

| 패턴                                                                                        | 팀  | 글  | 곳                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------- | --- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 디자인 시스템 라이브러리를 제품 작업 파일과 다른 파일 · 프로젝트 · 팀에 둔다                | 14  | 3   | GitLab · Kiwi.com · Hygraph · Compound · WordPress · Primer · Carbon · Atlassian · Red Cross · Alberta · Shopify · CMS · MOJ · Equinor / Figma BP · Bounteous · LogRocket |
| 첫 페이지는 표지(Cover)                                                                     | 7   | 6   | Hygraph · Shopify · WordPress · Kiwi.com · Equinor · Compound · Interactive Studio / Figma BP · LogRocket · Half Thoughts · Jobins · Solid Digital · Bounteous            |
| 탐색(Explore · Scratchpad · Sandbox · Playground)과 확정본(Build · UI · Final · Ready) 분리 | 5   | 5   | Hygraph · Shopify · WordPress · Akvo · Equinor / Figma BP · Figma Help 페이지 · Figma 넘김 가이드 · Half Thoughts · Jobins                                                |
| 템플릿 파일 · 표지 부품으로 모든 파일을 같은 구조로 시작                                    | 6   | 2   | Hygraph · Shopify · Alberta · Interactive Studio · Equinor · WordPress / Figma BP · Half Thoughts                                                                         |
| 표지에 상태(색 · 배지 · 진행 막대)                                                          | 4   | 3   | Hygraph · Shopify · WordPress · Equinor / Figma BP · Half Thoughts · Bounteous                                                                                            |
| 파운데이션(토큰 · 변수 · 스타일)을 부품과 다른 라이브러리 파일로                            | 6   | 1   | GitLab · Primer · Carbon · Atlassian · MOJ · Kiwi.com / LogRocket                                                                                                         |
| 파운데이션과 부품을 한 라이브러리 파일에(위와 반대)                                         | 4   | 1   | CMS · Red Cross · WordPress · Interactive Studio(프로젝트 파일 안) / Figma 라이브러리 BP(페이지 = 묶음)                                                                   |
| 버린 안을 파일 안 맨 아래 Archive · Graveyard 페이지로(근거 약함)                           | 3   | 2   | Shopify · Compound · SSW / LogRocket · Half Thoughts                                                                                                                      |
| 페이지 이름 앞 이모지로 목적 · 상태(팀 근거 약함)                                           | 1   | 4   | Hygraph / Figma Help · Figma 넘김 가이드 · LogRocket · Jobins                                                                                                             |
| 하이픈 구분 페이지(팀 근거 약함)                                                            | 1   | 4   | SSW / Figma Help · Figma BP · LogRocket · Jobins                                                                                                                          |
| 섹션에 Ready for dev 상태(팀 미확인)                                                        | 0   | 4   | Figma Help 섹션 · Dev Mode 안내 · Dev Mode 상태 · Bounteous                                                                                                               |
| 기기 · 화면 폭마다 페이지 따로(근거 약함)                                                   | 2   | 2   | Shopify · WordPress / Figma BP · Figma 블로그 5 ways                                                                                                                      |
| 버전 · 반복을 페이지로, 최신이 위(근거 약함)                                                | 2   | 1   | Kiwi.com(XY) · WordPress(Iterations) / Half Thoughts(V0.1)                                                                                                                |
| 제품 파일 안 파일 전용 부품 페이지(근거 약함)                                               | 2   | 2   | Kiwi.com · Equinor / Figma BP(Local components) · LogRocket                                                                                                               |
| 페이지 안: 흐름은 가로 한 줄, 변형 · 상태는 옆이나 아래(근거 약함)                          | 2   | 1   | Equinor(변형은 아래로) · Hygraph(흐름별 묶음) / LogRocket(상태는 옆)                                                                                                      |
| 결정 기록을 따로 된 페이지로                                                                | 0   | 0   | 미확인. Dropbox 는 Figma 밖 명세 문서, Shopify 는 배지 · 날짜 · 체크리스트, Half Thoughts 는 페이지에 PRD 링크로 대신                                                     |

판(결정 기록)과 시안을 한 파일에 둘지: 결정 로그 페이지를 둔 곳은 찾지 못했다(미확인). 확인한 방식은 셋이다. 확정본 페이지로 옮겨 결정을 드러낸다(Shopify Build · Hygraph UI · Half Thoughts For dev). 버전 페이지를 쌓는다(Kiwi.com · WordPress). 결정 문서를 Figma 밖에 두고 페이지로 링크한다(Dropbox). 버전 표시는 Figma 이름 붙은 버전(공식)과 표지 상태 색 · 배지(WordPress · Equinor · Hygraph)가 쓰인다.

## 그대로 옮길 수 있는 구성 후보

모두 한 곳의 구성을 이름과 순서 그대로 적었다. 「NosLog 로 옮기면」 은 페이지 자리에 NosLog 화면 묶음을 넣기만 한 예다.

### 후보 1 — Shopify 프로젝트 템플릿

- 원래 페이지(위에서부터, 글에서 읽은 순서): Cover · Project overview · Build · Explore · Think · Archive. 만들 준비가 된 것이 맨 위(Cover · Project overview 와 Build 의 앞뒤는 미확인).
- 페이지 안 배치: Build 는 마일스톤 · 기기마다 페이지, 마지막 수정 날짜와 검토 체크리스트. Explore 는 기기마다 페이지, 탐색안마다 제목 · 상태 배지, 새 페이지마다 날짜.
- 파운데이션 위치: 파일 밖, 다른 팀이 내는 라이브러리.
- NosLog 로 옮기면: Cover · Project overview · Build(페이지마다 화면 묶음: 홈 · 악곡 · 랭킹 …) · Explore(판 · 시안) · Think(조사 · 지금 화면 캡처) · Archive.

### 후보 2 — Hygraph 기능 파일

- 원래 페이지(순서대로): Cover · 🔍 Research · 📝 Scratchpad · ✅ UI · ▶️ Prototype(선택) · 👌 QA. 기능마다 파일 하나, 템플릿 파일을 프로젝트 맨 위에 고정.
- 페이지 안 배치: UI 페이지가 정본이고 프레임을 사용자 흐름별로 묶는다. 프레임 이름표로 제목.
- 파운데이션 위치: 다른 프로젝트(🎨 Baukasten)의 디자인 시스템 파일, 묶음은 Get Started · Foundation · Components(캡처 설명만).
- NosLog 로 옮기면: 화면 묶음마다 파일 하나(예 「악곡」 파일: Cover · 🔍 Research · 📝 Scratchpad · ✅ UI · 👌 QA), 파운데이션은 별도 파일.

### 후보 3 — WordPress 디자인 팀

- 원래 페이지(순서대로): Cover(상태 색: Archived · In design · In development · Shipped · Design resource/library) · Iterations(최신이 위) · Current UI(작업 전 지금 화면) · Explorations(버린 안 포함).
- 페이지 안 배치: 공개된 규칙 없음(미확인). 필요하면 플랫폼 · 기기별 페이지를 더한다.
- 파운데이션 위치: 부품 · 스타일 · 아이콘을 하나로 합친 「WordPress Design Library」 파일 하나.
- NosLog 로 옮기면: Cover · Iterations(결정본이 위) · Current UI(지금 운영 화면) · Explorations(판 · 버린 안), 파운데이션은 라이브러리 파일 하나.

### 후보 4 — Figma 공식 Best practices

- 원래 페이지(순서대로): Cover · Visual research · User research(선택) · Discovery · Flow · Prototype(선택) · Local components(선택) · Ready for development. 단계 사이에 하이픈 구분 페이지.
- 페이지 안 배치: 페이지 수준 규칙만 있음. 플랫폼 하나가 프레임 수백 개면 페이지 · 파일로 나눈다. 섹션에 Ready for dev 를 걸면 Changed · Completed 로 이어진다(Help).
- 파운데이션 위치: 공유 라이브러리는 디자인 시스템 전용 팀에. 파일 전용 부품만 Local components 페이지.
- NosLog 로 옮기면: Cover · Visual research · Discovery · Flow · Local components · Ready for development, 구분 페이지로 단계를 나눈다.

파운데이션 파일 자체를 정리할 때 옮길 수 있는 구성: GitLab(Design tokens · 📙 Component library · Product Icons · Product Illustrations · Patterns and Page Templates · Data Visualization · Annotations and utilities 파일 일곱), Kiwi.com(토큰 파일 하나에 colors · typography · shadows 세 페이지, 아이콘은 섹션으로 나눈 페이지), CMS(파일 하나에 모드로 테마, 맨 앞 「Figma Setup」 안내 페이지), Compound(부품마다 페이지 하나, 이름은 부품 이름, 「Cover」 · 「Graveyard」 는 하나씩).
