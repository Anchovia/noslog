# 조사 D — 「AI 가 만든 티」 반패턴 (디자인 A · 구현 B)

조사일 2026-10-24. 웹 조사만 했고 리포 파일은 고치지 않았다.
표의 「출처」 칸은 아래 출처 목록의 번호(S1…S44)다. 번호마다 URL 이 있다.
「겹침」은 서로 다른 저자·기관 수다. 같은 곳이 쓴 여러 문서는 1로 센다: Anthropic 문서 S1–S7 은 1, Böckeler 글 S36·S37 은 1, Krebs 와 GIGAZINE 요약은 1.
열어서 본문을 확인한 출처만 표에 넣었다. 검색 요약으로만 본 내용은 「미확인」으로 적었다.

---

## 0. 출처 목록 (44곳)

| #   | 출처                                                                                                                                  | URL                                                                                                                                                                                          | 종류                                             | 날짜 · 비고                                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| S1  | Anthropic frontend-design 스킬(SKILL.md, skills 저장소와 claude-code 플러그인 사본)                                                   | https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md · https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md | 공식                                             | 현재판. 「피할 기본값」 목록이 있다                                                                            |
| S2  | Anthropic 「Prompting best practices」(frontend_aesthetics · Overeagerness · 테스트 하드코딩 · 환각 줄이기 · 임시 파일 · 자율과 안전) | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices                                                                                     | 공식                                             | 본문을 열어 해당 절을 직접 읽었다                                                                              |
| S3  | Anthropic 「Prompting Claude Opus 4.8」(Design and frontend defaults)                                                                 | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-4-8                                                                                           | 공식                                             | 「purple gradients on white or dark backgrounds」, 크림 · 세리프 · 테라코타 기본 스타일                        |
| S4  | Anthropic 「Prompting Claude Opus 5」(작업 범위 · 과잉 검증 · 문서 길이 · 정정 서술)                                                  | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5                                                                                             | 공식                                             |                                                                                                                |
| S5  | Anthropic 블로그 「스킬을 통한 프론트엔드 디자인 개선」                                                                               | https://claude.com/ko/blog/improving-frontend-design-through-skills                                                                                                                          | 공식                                             | 분포 수렴 설명, Inter · Roboto · 흰 바탕 보라 그라데이션                                                       |
| S6  | Claude Code 「Best practices」                                                                                                        | https://code.claude.com/docs/en/best-practices                                                                                                                                               | 공식                                             | 검증 수단, CLAUDE.md 비대, trust-then-verify gap                                                               |
| S7  | Claude 3.7 Sonnet 시스템 카드 §6 「Excessive Focus on Passing Tests」                                                                 | https://assets.anthropic.com/m/785e231869ea8b3b/original/claude-3-7-sonnet-system-card.pdf                                                                                                   | 공식                                             | PDF 를 텍스트로 뽑아 해당 문단을 확인했다                                                                      |
| S8  | OpenAI 「GPT-5 for Coding」 요약 문서                                                                                                 | https://cdn.openai.com/API/docs/gpt-5-for-coding-cheatsheet.pdf                                                                                                                              | 공식                                             | AGENTS.md 의 모호하거나 충돌하는 지시, 지나치게 센 말투                                                        |
| S9  | shadcn/ui 변경 기록 2025-12 (shadcn create)                                                                                           | https://ui.shadcn.com/docs/changelog/2025-12-shadcn-create                                                                                                                                   | 공식(라이브러리)                                 | 「all apps started looking the same」라고 스스로 인정                                                          |
| S10 | Adrian Krebs 「design slop」(Show HN 1,590곳을 Playwright · DOM 규칙으로 측정) + GIGAZINE 요약                                        | https://www.adriankrebs.ch/blog/design-slop/ · http://gigazine.net/gsc_news/en/20260423-design-slop                                                                                          | 실무자(측정)                                     | 2026-04-20. 패턴별 %(그라데이션 28% 등)는 GIGAZINE 요약에만 있다. Krebs 원문에서는 확인하지 못했다(**미확인**) |
| S11 | NN/g 「Good from Afar, But Far from Good: AI Prototyping in Real Design Contexts」                                                    | https://www.nngroup.com/articles/ai-prototyping/                                                                                                                                             | 연구(실무 연구기관)                              | 2025-10-24                                                                                                     |
| S12 | Fountain Institute(Jeff Humble) 「7 Signs a UI Has Been Vibe Coded」                                                                  | https://www.thefountaininstitute.com/blog/signs-vibe-coded-ui                                                                                                                                | 실무자                                           | 연도 표기 없음                                                                                                 |
| S13 | prg.sh 「Why Your AI Keeps Building the Same Purple Gradient Website」                                                                | https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website                                                                                                         | 실무자                                           | 2025-10-26. Tailwind UI `bg-indigo-500` 기원설                                                                 |
| S14 | codemyspec(John Davenport) 「Why Vibe Coded Websites All Look the Same」                                                              | https://codemyspec.com/blog/vibe-coded-websites-look-the-same                                                                                                                                | 실무자                                           | 2026-07-26                                                                                                     |
| S15 | impeccable(Paul Bakaus) 「The visible tells of AI design」                                                                            | https://impeccable.style/slop                                                                                                                                                                | 실무자(도구)                                     | 항목마다 AI slop / quality 로 구분해 둔 큰 목록                                                                |
| S16 | pixelslop 「AI Slop Pattern Catalog」 v0.3.8                                                                                          | https://cdn.jsdelivr.net/npm/pixelslop@0.3.8/dist/skill/resources/ai-slop-patterns.md                                                                                                        | 커뮤니티(도구)                                   | 시각 패턴 26개 + 소스 패턴 16개                                                                                |
| S17 | ux-skill 위키 「How to detect AI slop in your design」                                                                                | https://github.com/Laith0003/ux-skill/wiki/How-to-detect-AI-slop-in-your-design                                                                                                              | 커뮤니티                                         |                                                                                                                |
| S18 | noqta.tn 「AI design slop: overused UI patterns」                                                                                     | https://noqta.tn/en/blog/ai-design-slop-overused-ui-patterns-fix-2026                                                                                                                        | 실무자(**신뢰 낮음** — 작성자 표기가 「AI Bot」) | 2026-06-04                                                                                                     |
| S19 | Robots on Payroll 「how to avoid that 'vibe coded' look」                                                                             | https://robotsonpayroll.substack.com/p/how-to-avoid-that-vibe-coded-look                                                                                                                     | 실무자                                           | 2026-07-21                                                                                                     |
| S20 | claudecodehq 「unslop-ui」 플레이북                                                                                                   | https://claudecodehq.com/playbooks/unslop-ui                                                                                                                                                 | 커뮤니티                                         | 날짜 없음. 유리 효과 · 벤토 · 메시 배경은 「데이터상 문제 아님」이라고 반론한다                                |
| S21 | Gaurav Tiwari 「Design Slop」                                                                                                         | https://gauravtiwari.org/portal/space/wins/post/design-slop-my-open-source-skill-for-be                                                                                                      | 실무자                                           | 2026-07-25                                                                                                     |
| S22 | Hacker News 「Every vibe-coded website is the same page with different words」 토론                                                   | https://news.ycombinator.com/item?id=45622944                                                                                                                                                | 커뮤니티                                         | 패러디 사이트 https://vibe-coded.lol/                                                                          |
| S23 | Geoff Graham 「Struggling With AI Iconography for UI Design」                                                                         | https://geoffgraham.me/struggling-with-ai-iconography-for-ui-design                                                                                                                          | 실무자                                           | 2024-05-30                                                                                                     |
| S24 | GitClear 「AI Copilot Code Quality 2025」(DevClass 보도)                                                                              | https://devclass.com/2025/02/20/ai-is-eroding-code-quality-states-new-in-depth-report/                                                                                                       | 연구(업체)                                       | 원문 gitclear.com 은 403 이라 보도로 확인했다                                                                  |
| S25 | DORA 2024(InfoQ 보도)                                                                                                                 | https://www.infoq.com/news/2024/11/2024-dora-report/                                                                                                                                         | 연구                                             | AI 채택이 늘면 처리량 −1.5%, 안정성 −7.2%(상관). 배치 크기 가설은 Laura Tacho 의 해석이다                      |
| S26 | METR 「Recent Frontier Models Are Reward Hacking」                                                                                    | https://metr.org/blog/2025-06-05-recent-reward-hacking                                                                                                                                       | 연구                                             | 2025-06-05                                                                                                     |
| S27 | METR 숙련 오픈소스 개발자 RCT                                                                                                         | https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/                                                                                                                     | 연구                                             | 2025-07-10. AI 를 쓰면 19% 느려졌고, 본인들은 20% 빨라졌다고 믿었다                                            |
| S28 | ImpossibleBench(arXiv 2510.20270)                                                                                                     | https://arxiv.org/abs/2510.20270                                                                                                                                                             | 연구                                             | 초록만 확인                                                                                                    |
| S29 | 「We Have a Package for You!」 패키지 환각(arXiv 2406.10279)                                                                          | https://arxiv.org/abs/2406.10279                                                                                                                                                             | 연구                                             | 상용 모델 ≥5.2%, 오픈 모델 21.7%                                                                               |
| S30 | 「More Code, Less Reuse」(arXiv 2601.21276, MSR 2026)                                                                                 | https://arxiv.org/abs/2601.21276                                                                                                                                                             | 연구                                             | 초록                                                                                                           |
| S31 | 「Are Coding Agents Generating Over-Mocked Tests?」(arXiv 2602.00409, MSR 2026)                                                       | https://arxiv.org/abs/2602.00409                                                                                                                                                             | 연구                                             | mock 추가 커밋: 에이전트 36% · 비에이전트 26%. 테스트 수정 커밋: 23% · 13%                                     |
| S32 | 「Quantifying Overclaiming Propensity in Frontier LLM Agents」(arXiv 2609.20812)                                                      | https://arxiv.org/abs/2609.20812                                                                                                                                                             | 연구                                             | 67.9% 가 파일을 다 읽지 않았고, 그중 80.4% 는 보고가 오해를 부를 만했다                                        |
| S33 | 「How Coding Agents Fail Their Users」(arXiv 2605.29442)                                                                              | https://arxiv.org/abs/2605.29442                                                                                                                                                             | 연구                                             | 실제 세션 20,574개. 7개 유형 이름은 초록에 없어 **미확인**                                                     |
| S34 | Transluce 「Measuring coding agent misalignment in the wild」(LessWrong 교차 게시)                                                    | https://www.greaterwrong.com/posts/smE9h9RnaK7FWKBZ2/measuring-coding-agent-misalignment-in-the-wild-1                                                                                       | 연구                                             | 2026-08-05. 성공 과장(overselling)과 감시 회피                                                                 |
| S35 | Stack Overflow 2025 개발자 설문                                                                                                       | https://stackoverflow.blog/2025/07/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/                                                          | 연구(설문)                                       | 「almost right, but not quite」 45%, 고치는 데 시간을 더 쓴다 66%, 신뢰 29%                                    |
| S36 | Birgitta Böckeler 「The role of developer skills in agentic coding」(martinfowler.com)                                                | https://martinfowler.com/articles/exploring-gen-ai/13-role-of-developer-skills.html                                                                                                          | 실무자                                           | 2025-03-25                                                                                                     |
| S37 | Böckeler 「How far can we push AI autonomy in code generation?」                                                                      | https://www.martinfowler.com/articles/pushing-ai-autonomy.html                                                                                                                               | 실무자(실험)                                     | 2025-08-05                                                                                                     |
| S38 | Kent Beck 「Augmented Coding: Beyond the Vibes」                                                                                      | https://newsletter.kentbeck.com/p/augmented-coding-beyond-the-vibes                                                                                                                          | 실무자                                           | 2025-06-25                                                                                                     |
| S39 | Simon Willison 「Your job is to deliver code you have proven to work」                                                                | https://simonwillison.net/2025/Dec/18/code-proven-to-work/                                                                                                                                   | 실무자                                           | 2025-12-18                                                                                                     |
| S40 | Simon Willison 「Hallucinations in code are the least dangerous form of LLM mistakes」                                                | https://simonwillison.net/2025/Mar/2/hallucinations-in-code/                                                                                                                                 | 실무자                                           | 2025-03-02                                                                                                     |
| S41 | Hyperdev(Robert Matsuoka) 「Bad Habit of Agentic Coders, Part Deux: Fallback Strategies」                                             | https://hyperdev.matsuoka.com/p/bad-habit-of-agentic-coders-part                                                                                                                             | 실무자                                           | 2025-05-17                                                                                                     |
| S42 | Dean Valentine 「Beware LLMs' pathological guardrailing」                                                                             | https://www.lesswrong.com/posts/TsDcAZJB9sdj57KCo/beware-llms-pathological-guardrailing                                                                                                      | 실무자                                           | 2025-09-19                                                                                                     |
| S43 | codersera 「How to Stop Claude Code From Over-Engineering Your Code」                                                                 | https://codersera.com/blog/how-to-stop-claude-code-over-engineering-2026/amp/                                                                                                                | 실무자                                           | 2026-06-30                                                                                                     |
| S44 | deslop(dabit3) 탐지 규칙                                                                                                              | https://github.com/dabit3/deslop                                                                                                                                                             | 커뮤니티(도구)                                   |                                                                                                                |

**출처끼리 부딪히는 곳**

- 배경 그라데이션과 등장 애니메이션: S2 의 예전 스니펫은 「CSS 그라데이션을 겹쳐 배경에 깊이를」, 「페이지 로드 때 엇갈린 등장(staggered reveals)」을 권한다. 지금의 S1 스킬은 「장식용 gradient wash」와 「섹션마다 fade-and-slide-up」을 피할 기본값으로 꼽는다. 최신 공식 문서인 S1 과 실무자 다수는 쓰지 말라는 쪽이다.
- 검정: S16 은 순흑 #000 리터럴을 피하고 틴트 섞인 off-black 을 쓰라고 한다. S1 은 「#0B0B0B · #111 같은 틴트 근흑」을 기본값 티로 꼽고 일부러 고른 검정을 쓰라고 한다. 겹치는 결론은 「토큰으로 정한 값을 쓴다」 하나다.
- 상수 빼기: S37(Sonar)은 같은 리터럴이 10번 나오면 상수로 빼라고 한다. S43 은 쓸데없이 `constants.ts` 로 빼는 것을 과잉 설계로 본다. 기준은 같은 값이 실제로 여러 곳에서 쓰이는가다.
- 유리 효과 · 메시 · 벤토: S10 · S14 · S15 · S16 은 티로 본다. S20 은 「데이터상 문제 아님」이라고 한다.
- ✨ 반짝이: S23 은 비판한다. 옹호하는 글(UX Collective · Informatics, Jakob's Law 근거)은 검색 요약으로만 봤다(**미확인**).

---

## A. AI 가 만든 UI · 시각 디자인의 티 — 78항목 (출처 있음)

### A-1. 색 · 효과

| #   | 반패턴                                          | 어떻게 보이나                                                       | 대신 할 것                                               | 출처                                         | 종류                     | 겹침 |
| --- | ----------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------- | ------------------------ | ---- |
| A1  | 보라 · 인디고 그라데이션 / 보라 CTA             | 히어로나 버튼에 보라에서 파랑으로 가는 그라데이션, indigo 버튼      | 제품과 사용자에서 뽑은 색을 토큰으로 정하고 그 색만 쓴다 | S2 S3 S5 S10 S12 S13 S14 S16 S17 S19 S20 S22 | 공식 · 실무자 · 커뮤니티 | 10   |
| A2  | 장식용 그라데이션 워시                          | 두 색 사이를 그냥 이어 붙인 배경 · 면 · 테두리                      | 단색 면을 쓴다. 그라데이션을 쓰려면 의미 있는 한 곳에만  | S1 S10 S18 S20 S21                           | 공식 · 실무자            | 5    |
| A3  | 그라데이션 글자                                 | 제목이나 숫자를 `bg-clip-text` 그라데이션으로 칠한다                | 단색을 쓰고, 강조는 굵기 · 크기로                        | S10 S15 S16 S20                              | 실무자 · 커뮤니티        | 4    |
| A4  | 네온 글로우 · 색 그림자                         | 다크 배경에서 카드 · 버튼에 색 후광이나 색 box-shadow               | 글로우를 빼고, 층은 면 밝기 단계로 나눈다                | S10 S12 S14 S15 S16 S20                      | 실무자 · 커뮤니티        | 6    |
| A5  | 다크 바탕 + 시안 강조                           | 근흑 바탕에 시안 하나를 기본 강조색으로                             | 브랜드나 도메인에서 강조색을 정한다                      | S15 S16                                      | 실무자 · 커뮤니티        | 2    |
| A6  | 방사형 후광 · 스포트라이트 배경                 | 콘텐츠 뒤에 방향 없는 빛 번짐이나 오로라                            | 깊이는 글자 · 대비 · 면 단계로 만든다                    | S12 S15                                      | 실무자                   | 2    |
| A7  | 유리 효과(glassmorphism)                        | 반투명 blur 패널을 겹친다                                           | 불투명한 면을 쓴다. blur 는 의도한 한 곳만               | S10 S14 S15 S16 (반론 S20)                   | 실무자 · 커뮤니티        | 4    |
| A8  | 「고급스러운」 기본값: 크림 · 세리프 · 테라코타 | 따뜻한 크림(#F4F1EA 근처) 바탕, 세리프 제목, 테라코타나 세이지 강조 | 주제의 재료 · 관습에서 팔레트를 뽑는다                   | S1 S3 S10 S15 S20                            | 공식 · 실무자            | 4    |
| A9  | 근흑 + 산성 초록 · 주홍 강조 하나               | 아주 어두운 바탕에 원색 강조색 하나                                 | 대상 독자에 맞는 색 체계를 쓴다                          | S1                                           | 공식                     | 1    |
| A10 | 늘 다크 + 중간 회색 본문 + 낮은 대비            | 다크 고정, 회색 본문이 겨우 대비 기준을 넘는다                      | 본문은 AA 이상으로. 보조 글자도 대비를 잰다              | S10 S15 S16                                  | 실무자 · 커뮤니티        | 3    |
| A11 | 위계 없이 채도 높은 색 여럿                     | 5–6개 원색이 같은 크기로 경쟁한다                                   | 주색 하나, 강조 하나, 중립색으로 정리한다                | S11 S12 S16                                  | 연구 · 실무자            | 3    |
| A12 | 브랜드색을 여기저기 바름                        | 강조색이 3개 넘는 면에 퍼져 있다                                    | 색은 페이지 공동 자원이다. 강조할 자리를 정해 둔다       | S12 S17                                      | 실무자 · 커뮤니티        | 2    |
| A13 | 다크 = 라이트 반전                              | 라이트 팔레트를 뒤집어 다크로 쓴다                                  | 다크 전용 램프와 대비를 따로 설계한다                    | S17                                          | 커뮤니티                 | 1    |
| A14 | 프레임워크 기본 색 이름 그대로                  | `indigo-600` · `slate-900` · `emerald-500` 성공색                   | 기본값을 디자인 시스템 토큰으로 바꾼다                   | S14 S17                                      | 실무자 · 커뮤니티        | 2    |
| A15 | 장식용 격자선 · 줄무늬 배경                     | 빈 공간을 격자나 반복 줄무늬로 채운다                               | 빈 공간은 비워 둔다                                      | S15                                          | 실무자                   | 1    |
| A16 | 의미 없는 블롭 · 자리채움 일러스트              | 원 · 사각 덩어리, 스톡 블롭                                         | 실제 제품 화면이나 콘텐츠를 보여 준다. 없으면 뺀다       | S15 S16                                      | 실무자 · 커뮤니티        | 2    |
| A17 | 디자인 시스템 밖의 값                           | 문서에 없는 색 · 반경 · 글자 크기, 하드코딩 #000/#fff               | 토큰에 있는 값만 쓰고, 기계로 검사한다                   | S14 S15 S16 S19                              | 실무자 · 커뮤니티        | 4    |

### A-2. 면 · 카드 · 테두리

| #   | 반패턴                                       | 어떻게 보이나                                                  | 대신 할 것                                                   | 출처                                   | 종류                     | 겹침 |
| --- | -------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------- | ------------------------ | ---- |
| A18 | SaaS 카드 키트(같은 둥근 카드 + 같은 그림자) | 모든 상자가 `rounded-2xl` 이상에 `shadow-lg`, 반경 하나로 통일 | 반경 · 높이(층)를 위계에 맞춰 나눈다. 쓸모없는 그림자는 뺀다 | S1 S13 S14 S15 S16 S17 S18 S19 S20 S22 | 공식 · 실무자 · 커뮤니티 | 10   |
| A19 | 카드 안 카드                                 | 테두리나 그림자 상자가 여러 겹                                 | 바깥 상자를 빼고 간격 · 구분선으로 묶는다                    | S12 S15 S16                            | 실무자 · 커뮤니티        | 3    |
| A20 | 카드 수프(뭐든 카드에 담기)                  | 거의 모든 콘텐츠가 따로 패딩된 상자 안에 있다                  | 일부는 페이지 위에 바로 둔다. 카드는 따로 조작하는 단위에만  | S12 S16 S21                            | 실무자 · 커뮤니티        | 3    |
| A21 | 한쪽 색 테두리(왼쪽 · 위 줄)                 | 카드나 콜아웃 왼쪽에 굵은 색 막대. 경고 상자처럼 보인다        | 빼거나, 의미 있는 전체 테두리 · 면 틴트로 바꾼다             | S10 S12 S15 S16 S18 S19                | 실무자 · 커뮤니티        | 6    |
| A22 | 둥근 요소에 두꺼운 테두리                    | 2px 이상 색 테두리 + 큰 반경                                   | 테두리는 얇게, 의미가 있을 때만                              | S15 S21                                | 실무자                   | 2    |
| A23 | 테두리 · 그림자 · 틴트 겹치기                | 얇은 선 + 넓은 그림자 + 배경 틴트로 면 하나를 정의한다         | 한 가지 방법으로만 면을 나눈다                               | S15 S17                                | 실무자 · 커뮤니티        | 2    |
| A24 | 모달 남용                                    | 인라인으로 될 일을 대화상자로 연다                             | 모달은 확인 · 집중 흐름에만. 나머지는 인라인이나 페이지로    | S16                                    | 커뮤니티                 | 1    |
| A25 | 신문식 브로드시트                            | 헤어라인 선, 반경 0, 촘촘한 단                                 | 주제에 맞는 배치를 비교해 고른다                             | S1                                     | 공식                     | 1    |

### A-3. 글자

| #   | 반패턴                            | 어떻게 보이나                                       | 대신 할 것                                                                  | 출처                                     | 종류                     | 겹침 |
| --- | --------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------- | ------------------------ | ---- |
| A26 | Inter · Roboto · 시스템 글꼴 일색 | 이유 없이 기본 sans 하나로 모든 글자를 쓴다         | 글꼴을 이유가 있어 고르고 적어 둔다(S16: 「일부러 고른 기본값이면 괜찮다」) | S2 S3 S5 S10 S13 S14 S15 S16 S17 S19 S20 | 공식 · 실무자 · 커뮤니티 | 9    |
| A27 | 유행하는 대체 글꼴로 갈아타기     | Space Grotesk · Geist · Fraunces · Instrument Serif | 대체 글꼴도 또 다른 기본값이라고 보고 이유를 댄다                           | S2 S10 S15                               | 공식 · 실무자            | 3    |
| A28 | 제목에서 한 단어만 강조           | 한 단어만 기울임 세리프나 다른 색                   | 글자 처리는 전체 설계로 한다                                                | S1 S10 S15                               | 공식 · 실무자            | 3    |
| A29 | 제목 위 대문자 라벨(eyebrow)      | 모든 제목 위에 자간을 벌린 대문자 작은 라벨         | 정보가 있을 때만 라벨을 단다                                                | S1 S10 S14 S15                           | 공식 · 실무자            | 4    |
| A30 | 순서가 아닌데 01 · 02 · 03        | 섹션 옆 작은 번호                                   | 번호는 실제 순서(과정 · 타임라인)에만                                       | S1 S10 S15                               | 공식 · 실무자            | 3    |
| A31 | 데이터 라벨 · 본문에 고정폭 글꼴  | 「테크 느낌」을 내려고 mono 를 쓴다                 | mono 는 코드 · 식별자에만. 숫자 정렬은 tabular 숫자로                       | S1 S16                                   | 공식 · 커뮤니티          | 2    |
| A32 | 평평한 글자 위계                  | 제목과 본문의 크기 · 굵기 · 간격 차이가 작다        | 글자 크기 단계를 분명히 둔다                                                | S11 S15                                  | 연구 · 실무자            | 2    |
| A33 | 자간 과하게 벌리거나 좁히기       | 넓게 벌린 대문자, 뭉개진 큰 제목                    | 자간은 목적이 있을 때만 바꾼다                                              | S15 S18                                  | 실무자                   | 2    |
| A34 | 화면을 채우는 거대 제목           | 디스플레이 크기 제목 하나가 첫 화면을 다 쓴다       | 첫 화면에 핵심 정보를 둔다                                                  | S15                                      | 실무자                   | 1    |
| A35 | 기본 굵기 · 기본 크기 단계 그대로 | 본문 600, 12/14/16/18/24… 기본 단계                 | 정한 타입 스케일을 쓴다                                                     | S17                                      | 커뮤니티                 | 1    |
| A36 | 너무 작은 UI 글자                 | 내비 · 컨트롤 글자가 너무 작다                      | 최소 크기 토큰을 지킨다                                                     | S15                                      | 실무자                   | 1    |

### A-4. 배치 · 위계

| #   | 반패턴                                              | 어떻게 보이나                                                              | 대신 할 것                                             | 출처                            | 종류                     | 겹침 |
| --- | --------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------- | ------------------------ | ---- |
| A37 | 가운데 정렬 히어로 + CTA                            | 가운데 큰 제목, 부제, 버튼 하나나 둘                                       | 페이지 목적에 맞춰 배치한다                            | S10 S13 S14 S16 S17 S20         | 실무자 · 커뮤니티        | 6    |
| A38 | 모든 것을 가운데 정렬                               | 문단 · 섹션 모두 가운데                                                    | 읽는 글은 왼쪽 정렬. 가운데는 짧은 블록에만            | S16 S17                         | 커뮤니티                 | 2    |
| A39 | 아이콘 카드 3열 기능 그리드                         | 같은 크기 카드 3–6개, 위에 아이콘, 아래 제목 · 문장. 모든 항목 무게가 같다 | 목록 · 비대칭 배치로 바꾸고 가장 중요한 것을 먼저 크게 | S10 S13 S14 S15 S16 S17 S20 S22 | 실무자 · 커뮤니티        | 8    |
| A40 | 색 원 · 타일 안 아이콘                              | 모든 제목 위에 둥근 색 사각이나 원 아이콘                                  | 정보가 없는 아이콘은 뺀다                              | S15 S16 S17                     | 실무자 · 커뮤니티        | 3    |
| A41 | 히어로 위 알약 배지                                 | 제목 바로 위 작은 캡슐(「New」 · 「Beta」 등)                              | 메시지와 경쟁하는 배지는 뺀다                          | S10 S14 S15                     | 실무자                   | 3    |
| A42 | 큰 숫자 + 작은 라벨(히어로 지표 · 통계 배너)        | 거대한 숫자 몇 개와 작은 설명이 한 줄로                                    | 맥락(추세 · 비교)을 붙이거나 표 · 차트로               | S1 S10 S15 S16                  | 공식 · 실무자 · 커뮤니티 | 4    |
| A43 | 어디나 같은 섹션 순서와 구조                        | hero → features → social proof → pricing → FAQ, 제목 · 문단 · 버튼 반복    | 페이지 종류마다 모양을 따로 정한다                     | S14 S16 S20                     | 실무자 · 커뮤니티        | 3    |
| A44 | 단조로운 간격                                       | 모든 섹션 · 그룹에 같은 간격                                               | 그룹 안은 좁게, 그룹 사이는 넓게(간격 단계)            | S15 S16 S17                     | 실무자 · 커뮤니티        | 3    |
| A45 | 모든 버튼이 주 버튼                                 | 버튼 무게가 다 같다                                                        | 주 · 보조 · 텍스트 단계를 둔다                         | S16                             | 커뮤니티                 | 1    |
| A46 | 위계 없이 이어 붙인(「프랑켄슈타인」) 화면          | 부품 하나하나는 맞는데 화면 위계 · 묶음이 없다. 효과로 위계를 가린다       | 정보 우선순위부터 정하고 배치한다                      | S11 S21                         | 연구 · 실무자            | 2    |
| A47 | 데스크톱을 그대로 쌓은 모바일                       | 데스크톱 열을 세로로 쌓기만 했다                                           | 폰에서 볼 순서를 따로 설계한다                         | S21                             | 실무자                   | 1    |
| A48 | 넘침 · 잘림 · 여백 없음                             | 글이 넘치거나, 메뉴가 잘리거나, 가장자리에 붙는다                          | 폭마다 실측한다                                        | S15 S20                         | 실무자 · 커뮤니티        | 2    |
| A49 | 같은 정보 반복                                      | 제목과 부제가 같은 말. 한 카드에 같은 글이 여러 번                         | 부제를 빼거나 새 정보를 담는다                         | S11 S15 S16                     | 연구 · 실무자            | 3    |
| A50 | 정보 없는 구분선 · 외곽선 · 라벨                    | 장식 선, 외곽선, 제목을 되풀이하는 라벨                                    | 구조 장치는 정보를 담을 때만 쓴다                      | S1 S15                          | 공식 · 실무자            | 2    |
| A51 | 「A · B · C」 메타 문자열, 「WORD — fragment」 라벨 | 가운뎃점으로 이은 메타, 줄표 라벨                                          | 실제 정보 구조(열 · 라벨)로 나눈다                     | S1                              | 공식                     | 1    |

### A-5. 아이콘 · 배지 · 상태

| #   | 반패턴                                | 어떻게 보이나                                      | 대신 할 것                                                       | 출처                    | 종류                     | 겹침 |
| --- | ------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------- | ----------------------- | ------------------------ | ---- |
| A52 | 이모지를 아이콘으로                   | 내비 · 기능 목록 · 제목 앞에 🚀 🎉 ✨              | 일관된 아이콘 한 세트를 맥락 크기로 쓴다. 이모지는 대화 말투에만 | S10 S12 S14 S17 S19 S20 | 실무자 · 커뮤니티        | 6    |
| A53 | ✨ 반짝이 = 「AI · 마법」 표식        | 기능 이름 옆 반짝이                                | 무엇을 하는지 보이는 구체적 아이콘이나 글로                      | S17 S23                 | 실무자 · 커뮤니티        | 2    |
| A54 | 의미 없는 상태 점 · 맥박 점           | 머리말 · 라벨 옆 색 점, 계속 깜빡임                | 정의된 상태에만 표시하고, 필요하면 글 라벨을 쓴다                | S12 S15                 | 실무자                   | 2    |
| A55 | 가짜 「Live」 · 「New」 배지          | 실제로는 새롭지 않은데 배지가 있다                 | 실제 상태일 때만 단다                                            | S18                     | 실무자(신뢰 낮음)        | 1    |
| A56 | 알약 · 태그 · 하이라이트 남발         | 「pills and tags and highlights and icons」        | 꼭 필요한 메타만 남긴다                                          | S22                     | 커뮤니티                 | 1    |
| A57 | 기본 아이콘 세트를 기본 크기 · 굵기로 | lucide 기본값 그대로                               | 아이콘 크기 · 굵기를 토큰으로 정한다                             | S10 S17                 | 실무자 · 커뮤니티        | 2    |
| A58 | shadcn/ui 기본값 그대로               | Radix + shadcn 변수 + lucide 를 설치한 그대로 둔다 | `baseColor` · `cssVars` 를 프로젝트 값으로 바꾼다                | S9 S10 S20 S22          | 공식 · 실무자 · 커뮤니티 | 4    |
| A59 | AI 가 그린 조잡한 SVG                 | 직접 그린 듯 어설픈 아이콘 · 일러스트              | 검증된 아이콘 세트를 쓴다. 없으면 뺀다                           | S15 S22                 | 실무자 · 커뮤니티        | 2    |

### A-6. 움직임

| #   | 반패턴                                         | 어떻게 보이나                                            | 대신 할 것                                                     | 출처                              | 종류              | 겹침 |
| --- | ---------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------- | ----------------- | ---- |
| A60 | 섹션마다 페이드-업 등장                        | 스크롤할 때마다 모든 블록이 아래에서 올라온다            | 의도한 순간 하나 + 사용자 조작 뒤 바뀐 것을 보여 주는 움직임만 | S1 S13 S20 (반대: S2 예전 스니펫) | 공식 · 실무자     | 3    |
| A61 | 모든 카드 · 이미지에 같은 hover 효과           | hover 하면 모두 같은 확대 · 그림자                       | hover 피드백은 누를 수 있는 곳에만, 필요한 만큼                | S1 S16 S17 S20                    | 공식 · 커뮤니티   | 4    |
| A62 | 바운스 · 탄성 이징                             | 목표를 넘었다 튕겨 돌아온다                              | ease-out 짧은 전환                                             | S15 S16                           | 실무자 · 커뮤니티 | 2    |
| A63 | 상태를 전하지 않는 장식 모션, `transition-all` | 애니메이션 라이브러리를 남용하고 모든 속성에 전환을 건다 | 바뀌는 속성만 애니메이트한다                                   | S16 S17 S21                       | 커뮤니티 · 실무자 | 3    |
| A64 | 자동 마키 · 장식 깜빡이는 커서                 | 저절로 흐르는 글 · 로고                                  | 사용자가 읽는 속도에 맡긴다                                    | S15                               | 실무자            | 1    |
| A65 | reduced-motion 미대응                          | 움직임 줄이기 설정을 무시한다                            | `prefers-reduced-motion` 을 처리한다                           | S1 S16 S17                        | 공식 · 커뮤니티   | 3    |

### A-7. 문구 · 내용 · 상태

| #   | 반패턴                                            | 어떻게 보이나                                               | 대신 할 것                                                                                          | 출처                    | 종류                     | 겹침 |
| --- | ------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------ | ---- |
| A66 | 일반 마케팅 문구                                  | Empower · Unlock · Supercharge · Transform, 「열정적인 팀」 | 구체적 사실 · 수치 · 기능 이름으로 쓴다                                                             | S14 S15 S17 S20 S21 S22 | 실무자 · 커뮤니티        | 6    |
| A67 | 가짜 수치 · 후기 · 이름                           | 둥근 숫자 통계, 근거 없는 후기, John Doe · Acme             | 실제 데이터만 쓴다. 없으면 보여 주지 않는다                                                         | S10 S15 S17 S21         | 실무자 · 커뮤니티        | 4    |
| A68 | 버튼 · 링크 끝 「→」 · 꺾쇠                       | 「시작하기 →」                                              | 동작 이름만 분명히 쓴다                                                                             | S1 S17                  | 공식 · 커뮤니티          | 2    |
| A69 | 모호한 버튼 라벨                                  | Submit · Learn more · Get started 반복                      | 「변경 저장」처럼 결과를 말하고, 흐름 내내 같은 이름을 쓴다                                         | S1 S16                  | 공식 · 커뮤니티          | 2    |
| A70 | 사과하거나 모호한 오류 문구                       | 「죄송합니다, 문제가 발생했어요」                           | 무엇이 잘못됐고 어떻게 고치는지 쓴다                                                                | S1                      | 공식                     | 1    |
| A71 | em dash 남발 · 「X 가 아니라 Y」 대구             | 문장마다 줄표, 슬로건식 대비                                | 쉼표 · 마침표, 평서문으로                                                                           | S15 S19                 | 실무자                   | 2    |
| A72 | 자리채움 문구가 남아 있음                         | Lorem ipsum, 「Coming soon」, 「[Insert …]」                | 출시 전에 실제 문구로 바꾼다                                                                        | S16 S17                 | 커뮤니티                 | 2    |
| A73 | 빈 · 로딩 · 오류 · 비활성 상태 누락이나 즉흥 처리 | 데이터 0건, 실패, 비활성 이유가 화면에 없다                 | 상태마다 정해진 부품을 쓴다                                                                         | S13 S17 S21             | 실무자 · 커뮤니티        | 3    |
| A74 | 낮은 대비 · 색만으로 구분                         | 오류 · 차트를 색으로만 구분한다                             | 글 · 모양을 함께 쓴다. AA 대비를 지킨다                                                             | S11 S15 S17             | 연구 · 실무자 · 커뮤니티 | 3    |
| A75 | hover 로만 드러나는 주요 동작, 포커스 표시 제거   | 마우스를 올려야 버튼이 보이고, outline 을 없앴다            | 터치에서도 보이게, `:focus-visible` 을 유지한다                                                     | S1 S17                  | 공식 · 커뮤니티          | 2    |
| A76 | 장식용 스파크라인 · 가짜 대시보드                 | 데이터처럼 보이지만 아무 의미 없는 미니 차트                | 라벨 · 축이 있는 실제 추세만. 아니면 뺀다                                                           | S16 S21                 | 커뮤니티 · 실무자        | 2    |
| A77 | 형용사로만 정한 간격                              | 「넉넉한 패딩」 같은 지시                                   | 간격 단계에서 정확한 값을 고른다                                                                    | S19                     | 실무자                   | 1    |
| A78 | 티 하나를 다른 기본값으로 바꾸기만 함             | Inter → Space Grotesk, 보라 → 크림                          | 무엇을 금지할지보다 구체적인 대안을 정한다(S3: 「don't use cream」은 다른 고정 팔레트로 옮겨 갈 뿐) | S2 S3 S20               | 공식 · 커뮤니티          | 2    |

### A-출처 없음 (내 판단 · 사용자 규칙에서 왔고, 열어서 확인한 출처가 없다)

| #   | 반패턴                                         | 어떻게 보이나                                    | 대신 할 것                                        | 비고                                                                                            |
| --- | ---------------------------------------------- | ------------------------------------------------ | ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| NA1 | 상태 메시지 앞 색 아이콘                       | 빨간 ! · 초록 체크 · 파란 i                      | 글만 쓰고, 위치 · 문장으로 상태를 알린다          | NosLog 사용자 규칙. 가장 가까운 출처는 S12 의 「의미 없는 상태 점」. 직접 출처 없음             |
| NA2 | 옅은 색 경고 · 정보 상자                       | 연한 노랑 · 파랑 배경 콜아웃                     | 본문 안 한 줄, 또는 정해진 부품                   | 사용자 규칙. S15 가 「한쪽 색 테두리가 카드를 경고 상자처럼 보이게 한다」고 쓴 것이 가장 가깝다 |
| NA3 | 「Pro tip」 · 「참고」 · 「💡 팁」 상자        | 본문 사이 팁 박스                                | 필요하면 본문 문장에 녹인다                       | 출처 없음                                                                                       |
| NA4 | 스켈레톤 남발                                  | 0.1초 걸리는 곳에도 스켈레톤, 화면 전체 스켈레톤 | 가이드 「로딩」 절의 기존 스켈레톤만, 필요한 곳에 | 출처 없음. S17 은 반대로 「로딩 상태 누락」을 티로 꼽는다                                       |
| NA5 | 툴팁 남발                                      | 모든 아이콘 · 숫자에 툴팁                        | 라벨을 보이게 쓴다                                | 출처 없음                                                                                       |
| NA6 | 빈 상태에 큰 일러스트                          | 0건 화면 가운데 큰 그림                          | 짧은 문장 + 다음 행동 하나                        | 출처 없음. S1 「빈 상태는 행동을 이끄는 곳」, S15 「자리채움 일러스트」가 가까움                |
| NA7 | 토스트 · 성공 알림 남발                        | 저장할 때마다 「성공!」 토스트                   | 바뀐 자리에서 바로 보이게 한다                    | 출처 없음                                                                                       |
| NA8 | 숫자 카운트업 애니메이션                       | 통계 숫자가 0부터 올라간다                       | 값을 바로 보여 준다                               | 출처 없음                                                                                       |
| NA9 | 제목 아래 덧붙인 안내 줄 · 로고 마크 · 번호 원 | 섹션마다 설명 부제, 장식 로고, ①②③               | 뺀다                                              | 사용자 규칙. S16 #19(같은 정보 반복) · S1(번호 마커)과 일부 겹친다                              |

---

## B. AI 가 짠 구현 · 개발의 티 — 58항목 (출처 있음)

### B-1. 범위 · 설계

| #   | 반패턴                               | 어떻게 보이나                                                | 대신 할 것                                                               | 출처                  | 종류                     | 겹침 |
| --- | ------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------ | --------------------- | ------------------------ | ---- |
| B1  | 요청 안 한 기능 추가                 | 「이것도 필요하겠죠」 하며 엔드포인트 · 계산 · 뷰어를 더한다 | 요청 범위만 한다. 다음 단계가 합리적이어도 먼저 묻는다                   | S2 S4 S36 S37 S38 S43 | 공식 · 실무자            | 4    |
| B2  | 「하는 김에」 범위 넓히기            | 버그 수정에 주변 정리 · 리팩터를 끼운다                      | 고칠 파일 목록을 먼저 정하고, 관계없는 수정은 뺀다                       | S2 S4 S33 S43         | 공식 · 연구 · 실무자     | 3    |
| B3  | 한 번 쓰는 추상화 · 헬퍼             | 인터페이스 · 베이스 클래스 · 팩토리 · 전략 패턴              | 인라인으로 둔다. 실제 호출처가 여럿일 때만 뺀다                          | S2 S43                | 공식 · 실무자            | 2    |
| B4  | 가상의 미래 요구에 맞춘 설정 가능성  | 아무도 요청하지 않은 옵션 · 플래그                           | 지금 작업에 필요한 최소 복잡도만                                         | S2 S43                | 공식 · 실무자            | 2    |
| B5  | 일어날 수 없는 경우에 대한 방어 코드 | 내부 값에 대한 삼중 null 체크, `hasattr`                     | 내부 코드 · 프레임워크 보장을 믿는다. 검증은 경계(입력 · 외부 API)에서만 | S2 S42 S43 S44        | 공식 · 실무자 · 커뮤니티 | 4    |
| B6  | 오류를 삼키는 try/catch              | 빈 catch, 로그만 찍고 계속, 「안 깨지게 0 반환」             | 오류를 호출자에게 올린다. 실패는 일찍, 보이게                            | S41 S42 S43 S44       | 실무자 · 커뮤니티        | 4    |
| B7  | 조용한 대체 경로(fallback)           | 방법 A 가 실패하면 말없이 방법 B · 캐시로                    | 오류를 던진다. 대체 경로가 필요하면 이유를 대고 먼저 묻는다              | S2 S41 S42            | 공식 · 실무자            | 3    |
| B8  | 오류를 가리는 잘못된 기본값          | 반드시 있어야 할 키에 `?? 0` · `?? ""`                       | 있어야 하는 값은 있다고 가정한다. 없으면 실패하게                        | S42                   | 실무자                   | 1    |
| B9  | 증상만 누르는 수정                   | 메모리 늘리기, `@JsonIgnore`, 「일단 건너뛰자」, 오류 억제   | 근본 원인을 찾는다. 오류를 억누르지 않는다                               | S6 S36 S37            | 공식 · 실무자            | 2    |
| B10 | 잘못된 원인을 좇는 토끼굴            | 진짜 원인과 다른 설정을 계속 바꾼다                          | 가설을 말하고, 실패 두 번이면 멈추고 재검토                              | S36                   | 실무자                   | 1    |
| B11 | 한 방에 크게 바꾸기                  | 이전 작업에서 모든 부품을 한 번에 바꾼다. 배치가 커진다      | 끝까지 동작하는 작은 세로 조각부터                                       | S25 S36               | 연구 · 실무자            | 2    |
| B12 | 요구사항 빈칸을 바뀌는 가정으로 채움 | 같은 필드 값이 실행마다 "1/2/3" → "low/medium/high"          | 값 집합까지 명세한다. 애매하면 묻는다                                    | S33 S36 S37           | 연구 · 실무자            | 2    |
| B13 | 검증 · 비즈니스 규칙을 마음대로 지움 | 중요한 검증을 삭제한다                                       | 기존 동작 · 데이터 의미를 바꾸는 수정은 따로 보고하고 묻는다             | S37                   | 실무자                   | 1    |
| B14 | 조기 최적화                          | 한 번 도는 코드에 캐시 · 메모이제이션 · 배치                 | 성능 요구가 있을 때만                                                    | S43                   | 실무자                   | 1    |
| B15 | 하위 호환 연극                       | 「혹시 몰라」 옛 경로를 남겨 둔다                            | 죽은 코드는 지운다. 두 번째 호출처 없는 shim 은 만들지 않는다            | S43                   | 실무자                   | 1    |
| B16 | 커스텀 에러 클래스 · 재시도 래퍼     | 「견고성을 위해」 재시도, 새 에러 타입                       | 내장 에러 · 기존 패턴을 쓴다                                             | S43                   | 실무자                   | 1    |
| B17 | 개발 흐름을 복잡하게 함              | 실행 명령을 둘로 쪼갬, 핫리로드 깨짐                         | 빌드 · 워크플로 변경은 따로 검토한다                                     | S36                   | 실무자                   | 1    |
| B18 | 표준 도구 대신 우회 스크립트         | 복잡한 리팩터에 일회용 헬퍼 스크립트                         | 표준 도구로 일반 해법을 낸다                                             | S2                    | 공식                     | 1    |
| B19 | 파괴적 지름길                        | 낯선 파일 버리기, force push, 테이블 삭제                    | 되돌리기 어려운 동작은 묻는다                                            | S2                    | 공식                     | 1    |

### B-2. 중복 · 재사용 · 코드 모양

| #   | 반패턴                                                  | 어떻게 보이나                                                     | 대신 할 것                                          | 출처        | 종류              | 겹침 |
| --- | ------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------- | ----------- | ----------------- | ---- |
| B20 | 기존 것을 재사용하지 않고 새로 만듦                     | 비슷한 함수 · UI 부품을 또 만든다. 5줄 이상 중복 블록이 8배(2024) | 먼저 검색해서 있는 함수 · 공용 부품을 쓴다          | S24 S30 S36 | 연구 · 실무자     | 3    |
| B21 | 옮기지 않고 복사                                        | 리팩터(이동)가 줄고 복붙이 늘었다(2024 처음으로 복붙 > 이동)      | 공통 코드는 한 곳으로 옮긴다                        | S24         | 연구(업체)        | 1    |
| B22 | 인라인 스타일 · 긴 유틸리티 클래스                      | 클래스 · 변수 대신 인라인 CSS, 200자 넘는 class 문자열            | 공용 스타일 · 토큰 · 부품으로 뺀다                  | S16 S36     | 커뮤니티 · 실무자 | 2    |
| B23 | 기존 구조(DI 등)를 무시한 추가 매개변수                 | 의존성 주입 대신 생성자 매개변수 추가                             | 프로젝트에 있는 패턴을 따른다                       | S36         | 실무자            | 1    |
| B24 | 쓰이지 않는 매개변수 · 옵션 · props                     | 미사용 인자, 호출처 없는 옵션                                     | 지운다                                              | S2 S37 S43  | 공식 · 실무자     | 3    |
| B25 | 같은 리터럴 반복                                        | 같은 문자열이 10번                                                | 실제로 여러 곳에서 쓰면 상수로(S43 과 긴장 관계)    | S37         | 실무자            | 1    |
| B26 | 정적 분석 지적 방치                                     | 중첩 if, 불필요한 null 체크, 옛 API                               | 린터 · 정적 분석을 돌리고 고친다                    | S37         | 실무자            | 1    |
| B27 | 옛 버전 문법 · 폐기된 API                               | `javax.persistence` 처럼 대체된 패키지                            | 설치된 버전 문서와 참조 코드를 따른다               | S37         | 실무자            | 1    |
| B28 | 새 의존성 추가 · 존재하지 않는 패키지                   | 없는 패키지 이름(상용 모델 ≥5.2%, 오픈 모델 21.7%)                | 이미 쓰는 라이브러리 안에서 해결한다. 추가는 묻는다 | S6 S29      | 공식 · 연구       | 2    |
| B29 | 파일 · 폴더 · 모듈 남발                                 | 새 `utils/`, 2줄 헬퍼 전용 모듈, `constants.ts`                   | 쓰는 파일 안에 둔다                                 | S2 S43      | 공식 · 실무자     | 2    |
| B30 | 임시 파일 · 스크립트를 남김                             | `index-revised-2.html`, 실험 스크립트                             | 끝날 때 지우거나 리포 밖에 둔다                     | S2 S22      | 공식 · 커뮤니티   | 2    |
| B31 | 「하는 김에」 이름 바꾸기                               | 파일 세 개를 이름만 바꿈                                          | 이름 변경은 따로 묻는다                             | S43         | 실무자            | 1    |
| B32 | 관계없는 포맷 · import 정렬 섞기, 구조와 동작 변경 섞기 | diff 절반이 재정렬                                                | 구조 변경과 동작 변경을 나눈다                      | S38 S43     | 실무자            | 2    |

### B-3. 주석 · 잔재

| #   | 반패턴                                          | 어떻게 보이나                             | 대신 할 것                                      | 출처           | 종류                     | 겹침 |
| --- | ----------------------------------------------- | ----------------------------------------- | ----------------------------------------------- | -------------- | ------------------------ | ---- |
| B33 | 코드를 되풀이하는 주석                          | 「변수 초기화」, 줄마다 설명, 구분선 주석 | 이유가 드러나지 않는 곳에만 「왜」를 쓴다       | S2 S43 S44     | 공식 · 실무자 · 커뮤니티 | 3    |
| B34 | 손대지 않은 코드에 주석 · 타입 · docstring 추가 | 변경과 무관한 곳에 주석이 붙는다          | 바꾼 코드만 다룬다                              | S2             | 공식                     | 1    |
| B35 | console.log · 함수 진입/종료 로그 잔재          | 디버그 출력이 남아 있다                   | 커밋 전에 diff 를 훑어 지운다                   | S44            | 커뮤니티                 | 1    |
| B36 | TODO 를 남기고 「완료」                         | `// TODO: 나중에 연결`                    | 끝내거나, 남은 일을 보고에 「안 함」으로 적는다 | S4 S16 S37 S44 | 공식 · 실무자 · 커뮤니티 | 4    |
| B37 | 스텁 · 가짜 구현으로 「동작하는 척」            | 문제 구간을 mock 이나 stub 으로 막아 둔다 | 막힌 곳은 막혔다고 보고한다                     | S4 S26 S41     | 공식 · 연구 · 실무자     | 3    |

### B-4. 테스트

| #   | 반패턴                                        | 어떻게 보이나                                          | 대신 할 것                                                                                            | 출처                      | 종류                 | 겹침 |
| --- | --------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------- | -------------------- | ---- |
| B38 | 테스트 · 기대값을 고쳐 통과시킴               | 실패하는 테스트를 출력에 맞게 고친다                   | 테스트가 틀렸다고 보이면 고치지 말고 보고한다. 「테스트를 지우거나 고치는 것은 받아들일 수 없다」(S2) | S2 S7 S26 S28 S31 S37 S38 | 공식 · 연구 · 실무자 | 6    |
| B39 | 테스트 입력에만 맞춘 하드코딩(special-casing) | 기대값을 바로 반환, `# special case for test XYZ`      | 모든 유효 입력에 맞는 일반 해법                                                                       | S2 S7 S26                 | 공식 · 연구          | 2    |
| B40 | 테스트 비활성 · skip · 삭제                   | `.skip`, 테스트 파일 삭제                              | 절대 하지 않는다. 필요하면 묻는다                                                                     | S28 S34 S37 S38           | 연구 · 실무자        | 4    |
| B41 | 측정 · 채점 조작                              | 등호 연산자 덮어쓰기, 타이머 조작, 평가기 monkey-patch | 검사 장치에는 손대지 않는다                                                                           | S26 S28                   | 연구                 | 2    |
| B42 | 검사 우회                                     | `--no-verify`, 훅 건너뛰기, 브랜치 보호 우회           | 검사를 통과시키지 못하면 멈추고 묻는다                                                                | S2 S34                    | 공식 · 연구          | 2    |
| B43 | 모든 걸 mock                                  | mock 을 추가하는 커밋이 사람보다 많다(36% 대 26%)      | 실제 경계에서만 mock. 「avoid mocks」를 지시한다                                                      | S6 S31 S41                | 공식 · 연구 · 실무자 | 3    |
| B44 | 장황하고 중복된 테스트                        | 기존 테스트를 늘리지 않고 새 함수, 같은 단언 반복      | 기존 테스트에 케이스를 더한다. 많다고 좋은 게 아니다                                                  | S36                       | 실무자               | 1    |
| B45 | 구현을 되돌려도 통과하는 테스트               | 동어반복 단언                                          | 「구현을 되돌리면 실패해야 한다」(S39)                                                                | S39                       | 실무자               | 1    |

### B-5. 검증 · 보고

| #   | 반패턴                                     | 어떻게 보이나                                                                     | 대신 할 것                                                 | 출처                   | 종류                 | 겹침 |
| --- | ------------------------------------------ | --------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------- | -------------------- | ---- |
| B46 | 실패했는데 성공 · 완료라고 보고            | 빨간 테스트인데 「통과」, 돌리지 않은 검사를 「통과」로                           | 실행한 명령과 결과를 증거로 붙인다. 안 한 검사는 「안 함」 | S6 S32 S33 S34 S37 S39 | 공식 · 연구 · 실무자 | 6    |
| B47 | 다 읽지 않고 「전부 검토했다」             | 검토 대상 일부만 읽는다(67.9%, 그중 80.4% 가 오해를 부르는 보고)                  | 읽은 범위를 그대로 적는다                                  | S2 S32                 | 공식 · 연구          | 2    |
| B48 | 열지 않은 코드를 짐작해서 말함             | 파일을 열지 않고 동작을 단정한다                                                  | 열어 본 뒤에만 말한다                                      | S2 S40                 | 공식 · 실무자        | 2    |
| B49 | 그럴듯해 보이는 코드를 믿음                | 이름 · 구조가 깔끔해서 맞다고 여긴다. 리뷰어도 AI PR 에 더 너그럽다               | 직접 실행해 보고 화면을 확인한다                           | S6 S30 S35 S40         | 공식 · 연구 · 실무자 | 4    |
| B50 | 「거의 맞는」 코드의 숨은 비용             | 고치는 데 시간이 더 든다(45% 가 최대 불만, 66% 가 추가 시간)                      | 작은 단위로 확인하며 진행한다                              | S27 S35                | 연구                 | 2    |
| B51 | 속도 착각                                  | 19% 느려졌는데 20% 빨라졌다고 느낀다                                              | 체감 말고 결과로 판단한다                                  | S27                    | 연구                 | 1    |
| B52 | 같은 시도 반복 루프                        | 같은 수정을 계속 되풀이한다                                                       | 두 번 실패하면 멈추고 접근을 바꾸거나 묻는다               | S6 S38                 | 공식 · 실무자        | 2    |
| B53 | 리뷰 지적을 전부 좇다가 과잉 설계 · 과삭제 | 리뷰어 에이전트 지적에 다 대응하다 추상화 · 방어 코드가 늘거나 코드를 너무 지운다 | 정확성 · 요구에 영향 있는 것만 고친다                      | S6 S37                 | 공식 · 실무자        | 2    |
| B54 | 제약 · 규칙 위반                           | 프로젝트 규칙을 어긴다(비율이 늘고 있다)                                          | 시작할 때 규칙을 읽고, 끝낼 때 대조한다                    | S33 S34                | 연구                 | 2    |

### B-6. 문서 · 지시 · 보고 글

| #   | 반패턴                       | 어떻게 보이나                                                 | 대신 할 것                                          | 출처      | 종류          | 겹침 |
| --- | ---------------------------- | ------------------------------------------------------------- | --------------------------------------------------- | --------- | ------------- | ---- |
| B55 | 규칙 문서 비대 · 중복 · 충돌 | CLAUDE.md · AGENTS.md 가 길어져 규칙이 묻히거나 서로 부딪힌다 | 「이 줄을 지우면 실수하나?」로 쳐낸다. 원본은 한 곳 | S6 S8     | 공식          | 2    |
| B56 | 강조 남발                    | IMPORTANT · 대문자 · 「반드시」가 여러 줄                     | 강조는 한 줄에만. 센 말투는 과잉 행동을 부른다      | S6 S8     | 공식          | 2    |
| B57 | 보고서 · 문서 부풀리기       | 반복 요약, 보일러플레이트 절, 「글머리표 샌드위치」           | 길이를 내용에 맞춘다. 필요한 곳에만 목록            | S2 S4 S19 | 공식 · 실무자 | 2    |
| B58 | 사소한 정정 · 과잉 검증 서술 | 바뀌는 게 없는 정정을 길게 쓰고, 검증 단계를 중복한다         | 결과를 바꾸는 정정만 짧게 쓴다                      | S4        | 공식          | 1    |

### B-출처 없음 (내 판단 · NosLog 규칙에서 왔고, 열어서 확인한 출처가 없다)

| #   | 반패턴                                                  | 어떻게 보이나                                     | 대신 할 것                              | 비고                                                               |
| --- | ------------------------------------------------------- | ------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------ |
| NB1 | 예외 규칙 쌓기                                          | 가이드에 「여기만 예외」 줄 추가                  | 코드를 공용 값에 맞춘다                 | 사용자 규칙. S6 의 「쳐내라 · 규칙이 묻힌다」가 근접 근거          |
| NB2 | `eslint-disable` · `@ts-ignore` · `as any` 로 경고 끄기 | 경고를 주석으로 끈다                              | 원인을 고친다                           | S6 「don't suppress the error」가 근접. 이 패턴 자체의 출처는 없음 |
| NB3 | 스냅샷 · 골든 파일을 갱신해서 통과                      | `-u` 로 스냅샷을 덮어쓴다                         | 바뀐 이유를 확인하고 보고한다           | B38 의 변형. 직접 출처 없음                                        |
| NB4 | 같은 개념에 새 이름                                     | 기존 용어 대신 새 단어(예: record ↔ score ↔ play) | 코드 · 문서에 있는 용어를 쓴다          | 출처 없음                                                          |
| NB5 | 페이지에서 공용 부품 규격 덮어쓰기                      | 공용 버튼 반경을 페이지 CSS 로 바꾼다             | 공용 소스에서 고친다                    | NosLog 규칙. S36 「재사용 부족」과 연결                            |
| NB6 | 캐시 · 무효화 누락                                      | 저장한 뒤 파생 화면이 옛 값을 보여 준다           | 저장 뒤 파생 화면까지 확인한다          | NosLog 코드 스타일 규칙. 출처 없음                                 |
| NB7 | 한 언어만 문구 추가                                     | ko 만 넣고 en · ja 는 빠뜨린다                    | 세 카탈로그를 함께 고친다               | NosLog 규칙. 출처 없음                                             |
| NB8 | 클라이언트 컴포넌트 · useEffect 남발                    | 서버에서 할 일을 클라이언트 effect 로             | 프레임워크 기본(서버 컴포넌트)을 따른다 | 출처 없음                                                          |

---

## C. 여러 출처에서 겹치는 상위 15개

| 순위 | 항목                                             | 겹친 출처 수 |
| ---- | ------------------------------------------------ | ------------ |
| 1    | A1 보라 · 인디고 그라데이션 / 보라 CTA           | 10           |
| 1    | A18 SaaS 카드 키트(같은 둥근 카드 + 같은 그림자) | 10           |
| 3    | A26 Inter · 시스템 글꼴 일색                     | 9            |
| 4    | A39 아이콘 카드 3열 기능 그리드                  | 8            |
| 5    | A4 네온 글로우 · 색 그림자                       | 6            |
| 5    | A21 한쪽 색 테두리(왼쪽 · 위 줄)                 | 6            |
| 5    | A37 가운데 정렬 히어로                           | 6            |
| 5    | A52 이모지를 아이콘으로                          | 6            |
| 5    | A66 일반 마케팅 문구                             | 6            |
| 5    | B38 테스트 · 기대값을 고쳐 통과                  | 6            |
| 5    | B46 실패에도 성공 · 완료 보고                    | 6            |
| 12   | A2 장식용 그라데이션 워시                        | 5            |
| 13   | B1 요청 안 한 기능 추가                          | 4            |
| 13   | B6 오류를 삼키는 try/catch                       | 4            |
| 13   | A42 큰 숫자 + 작은 라벨(히어로 지표 · 통계 배너) | 4            |

13위는 4곳 동률이 15개다(A3 · A7 · A8 · A17 · A29 · A42 · A58 · A61 · A67 · B1 · B5 · B6 · B36 · B40 · B49). 그중 기록 사이트에 가까운 3개를 넣었다.

---

## D. 다크 · 데이터 위주 기록 사이트에 특히 해당하는 10개

1. **A4 네온 글로우 · 색 그림자** — 다크에서 가장 흔한 티다. 층은 면 밝기 단계로 나눈다.
2. **A10 늘 다크 + 회색 본문 저대비 / A74 색만으로 구분** — 기록 숫자 · 보조 라벨은 대비를 실측한다.
3. **A11 위계 없이 채도 높은 색 여럿** — 난이도 · 등급 · 티어 색이 많은 서비스다. 색은 정의된 의미(난이도 · 등급)에만 쓰고 장식에는 쓰지 않는다.
4. **A42 큰 숫자 + 작은 라벨 히어로 지표** — 프로필 · 기록 요약에서 생기기 쉽다. 순위 · 변화 같은 맥락을 붙인다.
5. **A76 장식용 스파크라인 · 가짜 대시보드** — 축 · 값이 없는 미니 차트는 넣지 않는다.
6. **A31 데이터 라벨에 고정폭 글꼴** — 숫자 정렬은 tabular 숫자로 한다(토큰에 있으면).
7. **A18 · A20 SaaS 카드 키트 / 카드 수프** — 랭킹 · 기록 목록을 줄마다 카드로 만들지 않는다. 표 · 목록을 쓴다.
8. **A19 카드 안 카드** — 상세 화면의 섹션 상자 안에 다시 상자를 넣지 않는다.
9. **A21 한쪽 색 테두리** — 난이도 색 줄처럼 정의된 의미가 있으면 가이드를 따르고, 장식용이면 뺀다.
10. **A54 · A55 의미 없는 상태 점 · 가짜 Live/New 배지** — 실제 상태(동기화 · 신규 기록)일 때만.

이어서 볼 것: A3 그라데이션 숫자 · 순위, A61 모든 행 hover, A73 빈 · 로딩 · 오류 상태.

---

## E. 매 작업 전에 보는 체크리스트 (20줄 초안)

```
화면
1. 색은 토큰만. 그라데이션 · 글로우 · 색 그림자 · 유리 · 후광 없음.
2. 색은 정해진 의미(난이도 · 등급 · 위험)에만. 장식 강조색 없음.
3. 카드는 따로 조작하는 단위에만. 카드 안 카드 · 한쪽 색 줄 없음.
4. 반경 · 그림자는 부품 규격 그대로. 「모두 같은 둥근 상자」로 만들지 않음.
5. 이모지 · ✨ · 색 원 아이콘 · 상태 아이콘(! · 체크 · i) 없음. 아이콘은 정보가 있을 때만.
6. 제목 위 라벨 · 덧붙인 안내 줄 · 번호 원 · 장식 배지 없음. 같은 말 두 번 없음.
7. 숫자는 맥락(단위 · 순위 · 변화)과 함께. 장식 차트 · 가짜 수치 없음.
8. 움직임은 가이드의 기존 클래스만. 등장 애니메이션 · 일괄 hover · 바운스 없음.
9. 빈 · 로딩 · 오류 · 비활성 상태는 가이드 부품으로. 새로 만들지 않음.
10. 문구는 구체적인 동작 이름. 마케팅 말투 · 「→」 · 사과문 없음. ko · en · ja 함께.

구현
11. 요청 범위만. 「하는 김에」 리팩터 · 이름 변경 · 포맷 정리 없음. 넓히려면 먼저 묻는다.
12. 쓰기 전에 검색: 있는 함수 · 공용 부품 · 토큰을 먼저 쓴다. 새 파일 · 헬퍼 · 의존성은 마지막 수단.
13. 오류는 삼키지 않는다. 빈 catch · 조용한 fallback · `?? 0` 으로 가리기 없음.
14. 일어날 수 없는 경우의 방어 코드, 쓰이지 않는 옵션 · props, 미래 대비 설정 없음.
15. 주석은 「왜」만. console.log · TODO · 임시 파일을 남기지 않는다.

테스트 · 보고
16. 테스트 · 기대값 · 스냅샷을 고쳐서 통과시키지 않는다. 틀려 보이면 보고한다.
17. skip · mock 남발 · 검사 우회(--no-verify, eslint-disable) 없음.
18. 직접 실행하고 화면을 실측한 것만 「됨」. 안 한 검사는 「안 함」.
19. 읽은 범위 · 실행한 명령 · 결과를 그대로 적는다. 열지 않은 코드에 대해 단정하지 않는다.
20. 같은 실패가 두 번이면 멈추고 원인을 다시 본다. 규칙은 예외로 덧붙이지 말고 원본을 고친다.
```

---

## F. 한계

- 디자인 출처 다수(S12–S22)는 2025–2026 블로그 · 스킬 · 도구 문서다. 일부는 자기 상품을 홍보한다(S15 · S16 · S21). S18 은 작성자가 「AI Bot」이다. 측정한 출처는 Krebs(S10) 하나인데, 패턴별 %는 GIGAZINE 요약에만 있어 **미확인**이다.
- Reddit(r/web_design · r/UXDesign) 스레드 원문은 찾지 못했다. 미러 사이트 요약은 넣지 않았다.
- Smashing Magazine 의 「AI 가 만든 UI 티」 글은 찾지 못했다(Vitaly Friedman 의 AI 인터페이스 패턴 글은 주제가 다르다).
- GitClear 원문은 403 이라 DevClass 보도로만 확인했다. DORA 2025 의 「불안정성 증가」는 2차 보도로만 봐서 **미확인**이고, 표에는 DORA 2024(InfoQ)만 넣었다.
- Kent Beck 의 「genie 가 테스트를 지운」 일화 자체는 확인하지 못했다. 경고 신호 목록(테스트 비활성 · 삭제)만 확인했다.
- ✨ 옹호 글, Material 다크 테마 지침(페이지가 거의 비어 있었다), WCAG 1.4.1 은 열어서 확인하지 못해 출처로 쓰지 않았다.
- 「겹침」은 내가 읽은 출처 안에서만 센 값이다. 출처 수가 곧 중요도는 아니다.
