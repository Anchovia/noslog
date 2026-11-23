# 조사 — 개발 회사의 팀 운영 방식과 멀티 에이전트 오케스트레이션

조사일 2026-11-23. 세션 3층(master · 조사 취합 · 조사)을 실제 회사 방식으로 다듬고 훅 · 템플릿으로 강제하려고 모은 출처 기록이다. 결정은 아직 없다. 지금 구조는 [세션 3층](../decisions/2026-11-23-session-tiers.md) · [세션 3층 강제 훅](../decisions/2026-11-23-session-tier-hook.md). Claude Code 효율 · 스킬 모음은 [조사 G](./2026-10-24-g-claude-efficiency.md) · [조사 F](./2026-10-24-f-claude-skills.md)에 있어 다시 조사하지 않았다.

방법: 공개 문서 본문을 헤드리스로 받아 직접 읽고 문장을 확인했다(캡차 · 로그인 벽 없음). 인용은 15단어 안. 본문을 못 받았거나 읽지 못한 것은 「미확인」. 로그인이 필요한 곳은 쓰지 않았다. 설치 · 실행한 것 없음.

## 표본 수

세는 규칙: 실제 회사 · 조직은 같은 곳의 문서가 여럿이어도 한 곳이다. 프레임워크 · 공식 문서는 서로 다른 문서(URL)를 따로 센다(같은 제품 안 문서는 아래 표 줄 수와 같다).

| 물음                          | 실제 회사 · 조직 | 프레임워크 · 공식 문서 | 판단 |
| ----------------------------- | ---------------- | ---------------------- | ---- |
| Q1 역할 이름 · 층             | 6                | 9                      | 충분 |
| Q2 티켓 · 인수인계 · 보고     | 6                | 7                      | 충분 |
| Q3 리뷰 단계 · 완료 기준      | 7                | 7                      | 충분 |
| Q4 막힘 · 에스컬레이션        | 6                | 7                      | 충분 |
| Q5 강제 수단                  | 6                | 6                      | 충분 |
| Q6 같은 층 세션 추가 · 재분배 | 5                | 7                      | 충분 |

회사 수의 내역: Q1 GitLab · Basecamp · Atlassian · Amazon · Google · PagerDuty. Q2 GitLab · Basecamp · Google · Linear · Atlassian · PagerDuty. Q3 Google · GitLab · Kubernetes · Chromium · Rust · Sentry · GitHub. Q4 GitLab · Google · PagerDuty · Atlassian · Basecamp · Sentry. Q5 GitHub · GitLab · Kubernetes · Chromium · Rust · Linear. Q6 Google · Atlassian · GitLab · PagerDuty · Basecamp(5곳, 사람 쪽 근거는 약간 모자람). 개인 저술(Staff Eng)과 내용을 확인하지 못한 곳(Spotify · GitHub CODEOWNERS 페이지)은 세지 않았다.

----------------------- | -------------------------- | ---------------------- | ----------------------------- |
| Q1 역할 이름 · 층 | 6 | 9 | 충분 |
| Q2 티켓 · 인수인계 · 보고 | 8 | 6 | 충분 |
| Q3 리뷰 단계 · 완료 기준 | 6 | 7 | 충분 |
| Q4 막힘 · 에스컬레이션 | 6 | 6 | 충분 |
| Q5 강제 수단 | 6 | 6 | 충분 |

같은 회사의 문서가 여럿이면 한 곳으로 셌다(GitLab 핸드북 · GitLab 개발 문서는 한 곳). 개인 저술(Staff Eng)과 내용을 확인하지 못한 곳(Spotify · GitHub CODEOWNERS 페이지)은 세지 않았다.

---

## Q1. 역할 이름 · 층

### 실제 회사 · 조직

| #   | 곳                                  | URL                                                                                    | 확인한 사실                                                                                                                                                                        | 옮길 수 있는 꼴                                                                    |
| --- | ----------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | GitLab 핸드북 코드 리뷰             | handbook.gitlab.com/handbook/engineering/workflow/code-review/                         | 「All engineers can review merge requests, but only maintainers can accept them.」 Maintainer 는 하나 이상 프로젝트에서 수락 권한을 가진 전문가이고 프로젝트마다 둘 이상을 둔다.   | 층 둘: 누구나 리뷰하는 reviewer, 수락만 하는 maintainer. 리뷰와 수락 권한을 나눈다 |
| 2   | GitLab 핸드북 DRI                   | handbook.gitlab.com/handbook/people-group/directly-responsible-individuals/            | DRI 는 프로젝트 · 활동의 「ultimately accountable」 한 사람이고 최종 결정권을 갖되 상의한다(Apple 에서 온 용어라고 적음).                                                          | 일마다 책임자 한 명을 이름으로 박는다                                              |
| 3   | GitLab 핸드북 사고 관리             | handbook.gitlab.com/handbook/engineering/infrastructure-platforms/incident-management/ | 역할은 Incident Lead · Incident Responder · Communications Manager 셋이고 「Response Teams」가 그 역할을 채운다. 역할과 사람을 분리해 적는다.                                      | 역할(직무)과 그 역할을 채우는 팀을 따로 정의                                       |
| 4   | Basecamp Shape Up 8장               | basecamp.com/shapeup/2.2-chapter-08                                                    | 프로젝트 팀은 디자이너 1 + 프로그래머 2 또는 1 로 맞추고 한 사이클은 6주. 사이클 동안 팀은 끊김 없는 시간(Uninterrupted time)을 받는다.                                            | 소형 고정 팀(디자이너 1 + 프로그래머 1–2)이 한 일을 한 사이클 동안 끊김 없이 소유  |
| 5   | Atlassian Team Playbook 역할과 책임 | atlassian.com/team-playbook/plays/roles-and-responsibilities                           | 팀이 역할과 책임을 표로 정하고, 겹치면 「primary owner」와 contributor · backup 을 둔다. 맡는 사람이 없으면 「unassigned」 칸으로 옮긴다.                                          | 역할 표에 주인 · 보조 · 무주 칸을 둔다                                             |
| 6   | Google SRE 책 사고 관리             | sre.google/sre-book/managing-incidents/                                                | Incident Command · Ops(운영) · Communication · Planning 네 역할. 「The operations team should be the only group modifying the system」. 지휘자는 위임하지 않은 모든 자리를 겸한다. | 한 명은 지휘(상태 보유 · 배분), 실제 손은 Ops 만 쓴다. 맡기지 않은 칸은 지휘자 몫  |
| 7   | PagerDuty 사고 대응 문서            | response.pagerduty.com/training/incident_commander/                                    | Incident Commander · Deputy · Scribe · Subject Matter Expert · Customer Liaison · Internal Liaison 역할 훈련 문서. 「You don't need to be a senior team member to become an IC」.  | 지휘자는 직급이 아니라 그 순간의 역할. 기록 담당(Scribe)을 따로 둔다               |
| 8   | Amazon(AWS DevOps 백서) 투피자 팀   | docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/two-pizza-teams.html    | 「no larger than can be fed by two pizzas」 규칙. 팀이 작을수록 협업이 쉽다고 적음.                                                                                                | 팀 크기 상한으로 층 수를 줄인다                                                    |

개인 저술(표본 밖): Will Larson 의 Staff Eng(staffeng.com/guides/staff-archetypes)은 Staff 이상을 Tech Lead · Architect · Solver · Right Hand 네 유형으로 나눈다. Tech Lead 는 한 팀의 접근과 실행을 이끌고 매니저와 짝을 이룬다. 회사 문서가 아니라 저자 관찰이다. Spotify 엔지니어링 문화 글(engineering.atspotify.com)은 본문이 영상이라 squad · tribe 정의는 「미확인」.

### 프레임워크 · 공식 문서

| #   | 곳                                    | URL                                                                                  | 확인한 사실                                                                                                                                                                           | 옮길 수 있는 꼴                                                           |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 9   | Anthropic 멀티 에이전트 리서치 시스템 | anthropic.com/engineering/multi-agent-research-system                                | 「orchestrator-worker pattern」: lead agent 가 쪼개 맡기고 subagent 가 병렬로 일한다. 끝에 CitationAgent 가 출처를 붙인다.                                                            | lead(조율) + 병렬 worker + 마지막 검증 전용 에이전트 한 역할              |
| 10  | Claude Code subagents 문서            | code.claude.com/docs/en/sub-agents                                                   | 프런트매터 `description` · `tools` · `disallowedTools` · `model` · `permissionMode` · `hooks` 등. name · description 만 필수. 설명이 위임 판단에 쓰이고 합계 15,000 토큰 넘으면 경고. | 역할 하나 = 파일 하나(이름 · 설명 · 도구 · 모델). 모델 층을 정의에 박는다 |
| 11  | Claude Code agent teams 문서          | code.claude.com/docs/en/agent-teams                                                  | 「One session acts as the team lead」. 팀원은 각자 컨텍스트에서 일하고 서로 직접 메시지를 보낸다. 공유 작업 목록을 두고, 토큰 비용은 서브에이전트보다 높다고 적음.                    | lead 1 + 팀원 N, 공유 작업 목록                                           |
| 12  | OpenAI Agents SDK 핸드오프            | openai.github.io/openai-agents-python/handoffs/                                      | 「Handoffs allow an agent to delegate tasks to another agent.」 에이전트마다 `handoff_description` 으로 언제 넘길지 힌트.                                                             | 전문 에이전트마다 한 줄 설명을 달고 분류 에이전트가 넘긴다                |
| 13  | CrewAI 계층 프로세스                  | docs.crewai.com/en/learn/hierarchical-process                                        | `Process.hierarchical` 는 manager 가 작업을 배분하고 결과를 검증한다. 에이전트는 role · goal · backstory 를 가진다. 「Emulates corporate structures」.                                | manager 1 + role/goal 가진 worker. 배분과 검증을 manager 가 한다          |
| 14  | MetaGPT                               | docs.deepwisdom.ai/main/en/guide/get_started/introduction.html                       | 내부에 제품 매니저 · 아키텍트 · 프로젝트 매니저 · 엔지니어. 「Code = SOP(Team)」. 튜토리얼은 coder · tester · reviewer 를 더한다.                                                     | 회사 직군 이름을 에이전트 역할로 쓰고 SOP 로 묶는다                       |
| 15  | ChatDev 1.0                           | github.com/OpenBMB/ChatDev                                                           | 「Virtual Software Company」. CEO · CTO · Programmer 등이 기능별 「seminars」에 참여. 사람이 reviewer 역할로 programmer 에게 제안하는 모드도 있다.                                    | 가상 회사 직함. 사람을 reviewer 한 자리로 넣는다                          |
| 16  | AutoGen Magentic-One                  | microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/magentic-one.html | Orchestrator(`MagenticOneGroupChat`)가 WebSurfer · FileSurfer · Coder 같은 전문 에이전트를 이끈다.                                                                                    | 조율자 1 + 도구별 전문가                                                  |
| 17  | Scrum Guide                           | scrumguides.org/scrum-guide.html                                                     | 책임 셋: Developers · Product Owner · Scrum Master. Developers 는 「adhering to a Definition of Done」로 품질을 맡는다. Scrum Master 는 걸림돌 제거(impediments)를 맡는다.            | 계획 · 가치(PO), 실행 · 품질(Developers), 막힘 제거(SM)의 3분할           |

LangChain 멀티 에이전트 문서(docs.langchain.com/oss/python/langchain/multi-agent)는 받았으나 supervisor 용어 문장을 확인하지 못해 「미확인」(표본 밖). LangGraph 옛 supervisor 페이지는 받지 못했다.

### 옮길 수 있는 안 후보 (Q1)

- 안 1. GitLab reviewer / maintainer 분리: 누구나 리뷰하고 수락(공개 · 승인)만 한 층이 한다. 곳: GitLab 핸드북.
- 안 2. Anthropic lead + worker + 검증 전용 한 역할(CitationAgent 꼴). 곳: Anthropic 리서치 시스템.
- 안 3. Google SRE 사고 지휘 4역: 지휘 · Ops · Communication · Planning. 손은 Ops 만 쓴다. 곳: Google SRE 책.
- 안 4. Basecamp 소형 고정 팀과 중간 층 없음. 곳: Shape Up.

---

## Q2. 티켓 · 인수인계 · 보고 형식

### 실제 회사 · 조직

| #   | 곳                               | URL                                                                  | 확인한 사실                                                                                                                                                                                         | 옮길 수 있는 꼴                                                              |
| --- | -------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | Basecamp Shape Up 6장 피치       | basecamp.com/shapeup/1.5-chapter-06                                  | 피치 재료 다섯: Problem · Appetite · Solution · Rabbit Holes · No Gos.                                                                                                                              | 일감 브리프를 문제 · 투입 한도 · 해법 · 함정 · 안 할 것 다섯 칸으로          |
| 2   | Basecamp Shape Up 13장 진행 보고 | basecamp.com/shapeup/3.4-chapter-13                                  | 일을 hill chart(오르막 · 내리막)로 보인다. 소절 제목 「Status without asking」: 팀원이 점을 끌어 상태를 갱신하고 관리자는 묻지 않아도 본다. 「Nobody says I don't know」도 한 절.                   | 상태 보고를 묻지 않고 보게 한다. 불확실한 일은 오르막으로 표시               |
| 3   | GitLab 설명 템플릿               | docs.gitlab.com/user/project/description_templates/                  | `.gitlab/issue_templates/` · `.gitlab/merge_request_templates/` 아래 `.md` 로 두고 기본 브랜치에 있어야 한다. 프로젝트가 그룹 · 인스턴스 템플릿을 물려받는다.                                       | 템플릿 파일을 리포에 두고 일감을 열 때 자동으로 채운다                       |
| 4   | GitLab 핸드북 휴가 인수인계      | handbook.gitlab.com/handbook/engineering/ (PTO 절)                   | 긴 휴가 전에 coverage 이슈를 만들어 DRI 를 정하고 「work impact estimates · mitigations · coverage alternatives」를 적는다.                                                                         | 자리를 비울 때 영향 · 완화 · 대체안 세 칸 인수인계 이슈                      |
| 5   | Google 엔지니어링 관행 CL 설명   | google.github.io/eng-practices/review/developer/cl-descriptions.html | 첫 줄은 「Short summary of what is being done」, 명령형 완전한 문장, 빈 줄 뒤 본문. 미래 엔지니어가 이유를 알도록 쓴다.                                                                             | 한 줄 요약 + 본문으로 바뀐 이유를 남긴다                                     |
| 6   | Linear 이슈 템플릿               | linear.app/docs/issue-templates                                      | 템플릿이 속성을 미리 채우고 팀 기본으로 지정하면 새 이슈가 그 템플릿으로 만들어진다.                                                                                                                | 팀 기본 템플릿으로 필수 속성을 강제로 채운다                                 |
| 7   | Atlassian 사고 대응              | atlassian.com/incident-management/handbook/incident-response         | Jira 사고 티켓이 「source of truth」, 사고 전용 채팅방 · 공유 상태 문서를 쓰고 10단계로 진행한다. 담당은 incident manager.                                                                          | 한 곳의 티켓을 진실의 원천으로 두고 채널은 그 이름을 따른다                  |
| 8   | Google SRE 사고 인계 · PagerDuty | sre.google/sre-book/managing-incidents/ · response.pagerduty.com     | Google: 「Clear, Live Handoff」 지휘를 넘길 때 나가는 지휘자는 확인 응답을 받을 때까지 통화를 끊지 않는다. PagerDuty: 「A, please perform B, I'll come back to you in X minutes.」 식으로 지시한다. | 인계는 구두로 명시하고 확인받는다. 지시는 담당 · 할 일 · 돌아올 시각 세 요소 |

Amazon PR/FAQ: aboutamazon.com 발췌에서 PR/FAQ 를 「narrative」 문서라고 부르고 길게 쓰는 것이 흔한 실수라고 적은 것까지 확인했다. 6-pager 의 쪽 수 · 형식은 이 페이지에서 확인하지 못해 「미확인」(표본 밖). Basecamp 자동 체크인 페이지(basecamp.com/features/automatic-check-ins)는 본문을 받지 못해 「미확인」. GitLab 비동기 스탠드업 페이지도 짧은 응답만 받아 「미확인」.

### 프레임워크 · 공식 문서

| #   | 곳                             | URL                                                             | 확인한 사실                                                                                                                                                                                                                            | 옮길 수 있는 꼴                                                           |
| --- | ------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 9   | Anthropic 멀티 에이전트 리서치 | anthropic.com/engineering/multi-agent-research-system           | 「Each subagent needs an objective, an output format, guidance on the tools and sources to use, and clear task boundaries.」 모호한 지시는 중복과 공백을 낳는다. 복잡도에 맞춰 투입량을 정한다(단순 조사 1 에이전트 · 3–10 도구 호출). | 하위 세션 지시문 = 목적 · 출력 형식 · 도구와 출처 · 범위 경계 · 투입 한도 |
| 10  | OpenAI Agents SDK 핸드오프     | openai.github.io/openai-agents-python/handoffs/                 | 핸드오프 호출에 `input_type`(인자 스키마) · `on_handoff` 콜백 · `input_filter`(다음 에이전트가 받는 입력 걸러내기).                                                                                                                    | 넘길 때 구조화된 인자와 받는 입력 필터를 지정                             |
| 11  | MetaGPT SOP                    | docs.deepwisdom.ai/main/en/guide/tutorials/multi_agent_101.html | 각 역할이 상류 산출물을 「observe」하고 자기 산출물을 하류로 「publish」한다.                                                                                                                                                          | 역할 사이 산출물을 파일로 주고받는 파이프라인                             |
| 12  | Claude Code subagents          | code.claude.com/docs/en/sub-agents                              | 서브에이전트는 자기 컨텍스트에서 일하고 결과를 호출자에게 돌려준다. 프런트매터 `initialPrompt` · `maxTurns` · `memory` · `effort` 로 시작 조건을 박는다.                                                                               | 결과만 요약해 돌려받는 반환 형식 + 시작 지시를 정의 파일에 둔다           |
| 13  | Claude Code 모범 사례          | code.claude.com/docs/en/best-practices                          | 끝났다는 말 대신 증거(실행한 명령과 출력, 스크린샷)를 요구하라고 안내한다.                                                                                                                                                             | 보고에 명령 · 출력 · 사진 같은 증거를 필수 칸으로                         |
| 14  | Claude Code agent teams        | code.claude.com/docs/en/agent-teams                             | 팀원이 공유 작업 목록에서 일을 가져가고 메시지는 구조화된 프로토콜(계획 승인 요청 · 종료 요청)로도 간다.                                                                                                                               | 작업 목록 한 곳을 두고 계획 승인 · 종료 메시지를 형식으로 정한다          |
| 15  | CrewAI 작업(Task) 속성         | docs.crewai.com/en/concepts/tasks                               | 작업 속성에 `description` · `expected_output`(「what the task's completion looks like」) · `agent` · `human_input`(사람이 최종 답을 검토) · `guardrail`(다음 작업 전 출력 검증).                                                       | 일감 하나에 설명 + 기대 산출물 + 담당 + 검증 함수 칸                      |

### 옮길 수 있는 안 후보 (Q2)

- 안 1. Basecamp 피치 5칸 브리프(문제 · 투입 한도 · 해법 · 함정 · 안 할 것). 곳: Shape Up 6장.
- 안 2. Anthropic subagent 지시 5요소(목적 · 출력 형식 · 도구 · 경계 · 투입 한도). 곳: Anthropic 멀티 에이전트 리서치.
- 안 3. GitLab 이슈 · MR 템플릿 파일을 리포에 두는 방식(`.gitlab/*_templates/`)과 coverage 이슈 인수인계 3칸. 곳: GitLab.
- 안 4. Basecamp hill chart 식 묻지 않고 보는 진행 표시. 곳: Shape Up 13장.

---

## Q3. 리뷰 단계 · 완료 기준

### 실제 회사 · 조직

| #   | 곳                                 | URL                                                                             | 확인한 사실                                                                                                                                                                                                                                                                                                                                                               | 옮길 수 있는 꼴                                          |
| --- | ---------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 1   | Google 엔지니어링 관행 리뷰 기준   | google.github.io/eng-practices/review/reviewer/standard.html                    | 「favor approving a CL once it … definitely improves the overall code health」, 완벽하지 않아도. 「the senior principle」이라 부른다. 속도: 응답은 「One business day is the maximum」.                                                                                                                                                                                   | 합격선은 완벽이 아니라 개선. 응답 상한 시간을 정한다     |
| 2   | Google 리뷰 점검 항목              | google.github.io/eng-practices/review/reviewer/looking-for.html                 | 점검 항목: Design(가장 중요) · Functionality · Complexity · Tests · Naming · Comments · Style · Documentation.                                                                                                                                                                                                                                                            | 리뷰 체크리스트 8항목, 설계부터 본다                     |
| 3   | GitLab 핸드북 리뷰 · 에이전트 승인 | handbook.gitlab.com/handbook/engineering/workflow/code-review/                  | 「Code reviews are mandatory for every merge request」. maintainer 는 승인을 독립 리뷰 에이전트에 위임할 수 있다. 「Nobody may approve a change they wrote or directed an agent to write.」 작성자는 평가 기준 · 에이전트 설정을 통제하지 못한다. 새 커밋은 적격 판정을 무효로 한다. 에이전트가 쓰고 에이전트가 승인한 변경은 책임 maintainer 가 기한 안에 사후 리뷰한다. | 쓴 쪽과 승인하는 쪽 분리. 승인 근거를 현재 커밋에 묶는다 |
| 4   | GitLab 개발 문서 완료 기준         | docs.gitlab.com/development/contributing/merge_request_workflow/                | 「Definition of done」: 회귀 없이 모든 항목 충족. 「Verified as working in production on GitLab.com」 같은 검증 · 문서화 · 성능 · 보안 항목. 회귀가 나면 되돌리기를 권한다. 작고 쉬운 변경은 reviewer 단계를 건너뛰고 maintainer 로 간다.                                                                                                                                 | 완료 = 항목 전부 충족 + 검증. 변경 크기별 단계 생략      |
| 5   | Kubernetes OWNERS · Chromium       | kubernetes.dev/docs/guide/owners/ · chromium.googlesource.com/…/code_reviews.md | Kubernetes 는 reviewer · approver 「two-phase code review」(LGTM 과 /approve). Chromium: 「Any committer can review code, but an owner must provide a review for each directory」.                                                                                                                                                                                        | 코드 검토(LGTM)와 승인(approve)을 두 번에 나눈다         |
| 6   | Rust 컴파일러 리뷰 정책            | forge.rust-lang.org/compiler/reviews.html                                       | 리뷰 목적: 버그 · 회귀 위험을 줄이고, 유지보수성을 지키고, 큰 그림을 확인한다. 작성자는 변경의 고수준 설명과 이유를 적어야 한다. 리뷰어는 코드를 충분히 이해해야 한다.                                                                                                                                                                                                    | 작성자가 설명 · 이유를 제출 의무. 리뷰어 자격 요건       |
| 8   | Sentry 코드 리뷰 가이드            | develop.sentry.dev/engineering-practices/code-review/                           | 리뷰 목적: 버그 · 설계 · 테스트 포함 여부 · 기대 동작 재확인. 큰 리팩터 · DB 스키마 변경 · 새 프레임워크 도입 같은 장기 영향 변경은 「senior engineer's acknowledgment」를 받아야 한다.                                                                                                                                                                                   | 변경 종류에 따라 상위 승인이 필요한 항목을 정해 둔다     |
| 7   | GitHub 보호 브랜치 설정(운영 도구) | docs.github.com/…/managing-a-branch-protection-rule                             | 「Require approvals」로 승인 수를 정하고, 새 커밋이 올라오면 승인을 무효로 하는 옵션이 있다. 코드 소유자 리뷰 요구 옵션.                                                                                                                                                                                                                                                  | 승인 수 · 커밋 시 승인 무효화를 설정으로 건다            |

Scrum Guide 의 Definition of Done(scrumguides.org): 「a formal description of the state of the Increment when it meets the quality measures」. 이 기준을 만족하지 않으면 Increment 로 치지 않는다. 회사 문서가 아니라 표준 문서라 프레임워크 쪽에 센다. Microsoft 엔지니어링 플레이북 코드 리뷰 · DoD 페이지는 본문을 거의 받지 못해 「미확인」.

### 프레임워크 · 공식 문서

| #   | 곳                                  | URL                                                             | 확인한 사실                                                                                                                                                                                      | 옮길 수 있는 꼴                                          |
| --- | ----------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| 8   | Anthropic Building effective agents | anthropic.com/engineering/building-effective-agents             | evaluator-optimizer: 한 LLM 이 만들고 다른 LLM 이 평가 · 피드백을 주는 반복. 평가 기준이 분명하고 반복 개선이 가치 있을 때 쓴다.                                                                 | 생성자와 평가자를 분리한 루프                            |
| 9   | Anthropic 멀티 에이전트 리서치      | anthropic.com/engineering/multi-agent-research-system           | 「Using an LLM as a judge allowed us to scalably evaluate hundreds of outputs.」 「Human evaluation catches what automation misses.」                                                            | LLM 판정 + 사람 표본 검사 병행                           |
| 10  | Claude Code 모범 사례               | code.claude.com/docs/en/best-practices                          | `/code-review` 는 대화를 본 적 없는 새 서브에이전트로 diff 를 검토한다. 「It isn't swayed by the reasoning that produced the code.」 명세 대조 리뷰는 「skip style」을 프롬프트에 넣으라고 안내. | 쓴 세션과 다른 새 컨텍스트 리뷰어 · 범위(명세 대조) 한정 |
| 11  | CrewAI 계층 프로세스 · 작업 속성    | docs.crewai.com/en/learn/hierarchical-process · /concepts/tasks | manager 가 「Result Validation」: 결과가 기준을 충족하는지 평가한다. 작업 속성 `guardrail` 은 다음 작업 전에 출력을 검증하고 `human_input` 은 사람이 최종 답을 검토한다.                         | 조율자가 결과를 기준과 대조하는 단계                     |
| 12  | OpenAI Agents SDK 가드레일          | openai.github.io/openai-agents-python/guardrails/               | 입력 · 출력 가드레일이 「checks and validations」. 값싼 모델로 먼저 검사하고 걸리면 즉시 오류를 내 비싼 모델 실행을 막는다(tripwire).                                                            | 싼 검사기가 비싼 실행 앞에서 차단                        |
| 13  | Claude Code hooks                   | code.claude.com/docs/en/hooks                                   | `Stop` · `SubagentStop` · `TaskCompleted` 이벤트가 있다. 훅 종류는 command · prompt(모델 1회 평가) · agent(서브에이전트가 Read · Grep 으로 조건 확인).                                           | 끝내기 직전 훅이 검사해 통과해야 완료 처리               |
| 14  | Scrum Guide                         | scrumguides.org/scrum-guide.html                                | DoD 는 팀 공통의 완료 정의이고 Developers 가 지킨다. 충족 못 하면 Increment 가 아니다.                                                                                                           | 완료 정의를 문서 한 곳에 두고 모두가 같은 기준을 쓴다    |

### 옮길 수 있는 안 후보 (Q3)

- 안 1. Google 기준: 개선이면 승인, 완벽을 요구하지 않고 응답 상한 하루. 곳: Google 엔지니어링 관행.
- 안 2. GitLab 독립 리뷰 에이전트: 쓴 쪽이 승인하지 못하고 새 커밋마다 판정 무효, 에이전트 승인분은 책임자가 사후 리뷰. 곳: GitLab 핸드북.
- 안 3. Kubernetes 두 단계: LGTM(검토)와 approve(승인)를 다른 사람이. 곳: Kubernetes OWNERS.
- 안 4. Claude Code 새 서브에이전트 리뷰 + 증거 요구. 곳: Claude Code 모범 사례.

---

## Q4. 막힘 · 에스컬레이션

### 실제 회사 · 조직

| #   | 곳                         | URL                                                          | 확인한 사실                                                                                                                                                               | 옮길 수 있는 꼴                                             |
| --- | -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | GitLab 핸드북 CI 장애 담당 | handbook.gitlab.com/handbook/engineering/workflow/           | 장애가 소유 그룹에 귀속되고 그 그룹이 DRI. 귀속이 없으면 「anyone who is blocked can pick it up」. 고치기 전에 이미 되돌리기 · 수정이 열렸는지 확인해 병행 작업을 피한다. | 막힌 사람이 자기 배정 가능. 먼저 중복 작업을 확인           |
| 2   | Google SRE 사고 관리       | sre.google/sre-book/managing-incidents/                      | 한 사람이 기술 문제에 빠져 소통 · 큰 그림을 놓친 사례를 들고 역할 분리(지휘 · Ops · 소통 · 계획)를 처방한다. 지휘자가 걸림돌을 치운다.                                    | 손 쓰는 사람과 막힘을 푸는 사람을 나눈다                    |
| 3   | PagerDuty 사고 대응        | response.pagerduty.com/training/incident_commander/          | 「Making the "wrong" decision is better than making no decision.」 반대 의견이 있는지 물어 합의를 얻고, 지시마다 돌아올 시각을 정한다.                                    | 결정을 미루지 않는다. 이견 확인 한 번, 돌아올 시각을 박는다 |
| 4   | Atlassian 사고 대응        | atlassian.com/incident-management/handbook/incident-response | 10단계 중 escalate: 당직 로스터 도구(OpsGenie 등)로 해당 팀을 호출한다. 로스터가 있어 특정 개인에 의존하지 않는다.                                                        | 개인이 아니라 당직 로스터로 호출                            |
| 5   | Basecamp Shape Up          | basecamp.com/shapeup/2.2-chapter-08 · 3.4-chapter-13         | 「circuit breaker」: 6주 안에 못 끝내면 자동 연장 없이 멈추고 다시 피치를 쓴다. 13장 「Nobody says "I don't know"」: 불확실을 말하기 어려워서 hill chart 로 드러낸다.     | 한도 초과는 자동 연장 없이 멈춤. 막힘을 표시 장치로 드러냄  |
| 7   | Sentry 코드 리뷰 가이드    | develop.sentry.dev/engineering-practices/code-review/        | 큰 리팩터 · 스키마 변경 · 새 도구 도입처럼 장기 영향이 큰 변경은 시니어 엔지니어의 확인을 받아야 한다.                                                                    | 범위가 큰 결정은 위 층에 올려 확인받는 목록을 정한다        |
| 6   | GitLab 핸드북 휴가 DRI     | handbook.gitlab.com/handbook/engineering/                    | 5일 넘는 휴가는 DRI 를 정해 결정 권한을 넘기고, 일이 기다리는지 대리 DRI 가 있는지를 명시 · 문서화한다.                                                                   | 부재 전에 결정권을 누구에게 넘기는지 명시                   |

### 프레임워크 · 공식 문서

| #   | 곳                                  | URL                                                       | 확인한 사실                                                                                                                                                    | 옮길 수 있는 꼴                                 |
| --- | ----------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 7   | Anthropic Building effective agents | anthropic.com/engineering/building-effective-agents       | 에이전트는 「pause for human feedback at checkpoints or when encountering blockers」. 최대 반복 횟수 같은 「stopping conditions」로 통제를 유지.               | 체크포인트와 막힘 때 사람에게 멈춘다. 반복 상한 |
| 8   | OpenAI Agents SDK HITL              | openai.github.io/openai-agents-python/human_in_the_loop/  | 도구가 승인 필요 여부를 선언하고 대기 중 승인은 interruption 으로 나온다. `RunState` 로 멈춘 실행을 저장했다가 결정 뒤 재개.                                   | 위험 도구만 승인 대기, 상태 저장 후 재개        |
| 9   | LangGraph interrupts                | docs.langchain.com/oss/python/langgraph/interrupts        | 「Interrupts allow you to pause graph execution at specific points and wait for external input」. 상태를 저장하고 무기한 대기, 같은 그래프를 다시 호출해 재개. | 임의 지점에 멈춤 호출 + 상태 저장               |
| 10  | Anthropic 멀티 에이전트 리서치      | anthropic.com/engineering/multi-agent-research-system     | 오류가 나도 처음부터 다시 하지 않고 중단 지점에서 재개하는 시스템. 도구 실패를 에이전트에게 알려 적응시킨다.                                                   | 실패 시 중단 지점 재개, 실패를 에이전트에 알림  |
| 11  | Claude Code 권한 설정               | code.claude.com/docs/en/permissions                       | 규칙 평가 순서 deny → ask → allow, 첫 일치가 결과. `permissions.denyInsteadOfPrompting` 은 무인 세션에서 권한 대기 호출을 거부로 처리.                         | 위험은 ask(사람에게), 무인이면 거부로 돌린다    |
| 12  | Claude Code agent teams             | code.claude.com/docs/en/agent-teams                       | 팀원이 계획을 세우면 lead 에게 계획 승인 요청을 보낸다. 팀원 권한 모드를 바꾸지 않았으면 도착 즉시 자동 승인될 수 있다고 적는다.                               | 계획 승인 요청 단계(주의: 기본 자동 승인)       |
| 13  | LangChain HITL 미들웨어             | docs.langchain.com/oss/python/langchain/human-in-the-loop | 도구 호출을 정책에 따라 검사하고 필요하면 interrupt 로 멈춘다. 사람 결정은 approve · edit · reject(피드백 포함) 중 하나.                                       | 승인 · 수정 · 거부(사유 포함) 세 가지 결정 꼴   |

### 옮길 수 있는 안 후보 (Q4)

- 안 1. Basecamp circuit breaker: 한도 안에 못 끝나면 자동 연장 없이 멈추고 다시 브리프. 곳: Shape Up.
- 안 2. GitLab DRI + 「막힌 사람이 집어도 된다」 규칙(귀속 그룹 없을 때) 및 중복 작업 확인. 곳: GitLab 핸드북.
- 안 3. PagerDuty 식: 이견 확인 한 번 뒤 결정, 지시마다 돌아올 시각. 곳: PagerDuty 사고 대응.
- 안 4. Anthropic 체크포인트 · 막힘에서 사람에게 멈춤 + 반복 상한. 곳: Building effective agents.

---

## Q5. 강제 수단

### 실제 회사 · 조직(운영 도구 포함)

| #   | 곳                           | URL                                                                    | 확인한 사실                                                                                                                                                                 | 옮길 수 있는 꼴                                     |
| --- | ---------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 1   | GitHub 보호 브랜치           | docs.github.com/…/about-protected-branches                             | 설정 목록: PR 리뷰 요구 · 상태 검사 통과 요구 · 대화 해결 요구 · 서명 커밋 · 선형 기록 · 병합 큐 · 우회 금지 · 푸시 제한. 상태 검사 이름은 워크플로 사이에서 유일해야 한다. | 필수 검사 통과 + 승인 수를 병합 조건으로            |
| 2   | GitHub rulesets              | docs.github.com/…/managing-rulesets/about-rulesets                     | 브랜치 · 태그 상호작용을 규칙 묶음으로 통제하고 읽기 권한자는 규칙을 볼 수 있다.                                                                                            | 규칙 묶음을 설정으로 관리                           |
| 3   | GitHub PR 템플릿             | docs.github.com/…/creating-a-pull-request-template-for-your-repository | `pull_request_template.md` 를 두면 PR 본문에 자동으로 채워진다. `PULL_REQUEST_TEMPLATE/` 폴더에 여럿 두고 `template` 쿼리로 고른다.                                         | PR 본문 양식 자동 삽입                              |
| 4   | GitLab 승인 · 코드 소유자    | docs.gitlab.com/user/project/merge_requests/approvals/ · codeowners/   | 승인 규칙으로 필요한 승인 수 · 유형을 정한다. 코드 소유자 승인을 강제하려면 대상 브랜치를 보호하고 소유자 승인을 켜야 한다.                                                 | 파일별 소유자 승인 + 보호 브랜치                    |
| 5   | GitLab 핸드북 에이전트 승인  | handbook.gitlab.com/handbook/engineering/workflow/code-review/         | 에이전트 지시를 보호된 기본 브랜치에서 불러온다. 평가 기준 · 규칙 · 에이전트 설정 · CODEOWNERS · 승인 규칙의 변경은 사람이 승인한다. 평가마다 기준 · 설정 버전을 기록한다.  | 규칙 파일 자체 변경은 사람 승인. 판정에 버전을 남김 |
| 6   | Kubernetes · Chromium OWNERS | kubernetes.dev/docs/guide/owners/ · chromium…/code_reviews.md          | OWNERS 파일이 리뷰어 · 승인자 지정의 구현 수단. Kubernetes 는 자기 OWNERS 가 Chromium OWNERS 에서 왔고 그것이 GitHub CODEOWNERS 의 영감이 됐다고 적는다.                    | 디렉터리별 OWNERS 파일로 승인 책임 배분             |
| 7   | Rust 인프라 bors             | forge.rust-lang.org/infra/docs/bors.html                               | 인프라팀이 병합 큐 봇 「Bors」를 rust-lang/rust 용으로 운영하고 Terraform 으로 구성 · 자동 배포한다.                                                                        | 병합을 봇 큐로 통과시킨다                           |
| 8   | Linear 팀 기본 템플릿        | linear.app/docs/issue-templates                                        | 템플릿을 팀 기본으로 지정하면 새 이슈가 그 템플릿으로 만들어진다.                                                                                                           | 필수 속성이 채워진 상태로 일감이 열린다             |

GitHub CODEOWNERS 소개 페이지(docs.github.com 「about code owners」)는 본문을 받지 못해 「미확인」이다. 대신 보호 브랜치 설정 문서에서 「Require review from Code Owners」 옵션과 「any of the code owners will be sufficient」 문장을 확인했다. Linear 팀 기본 템플릿(Q2)도 템플릿 강제 사례다.

### 프레임워크 · 공식 문서

| #   | 곳                                  | URL                                             | 확인한 사실                                                                                                                                                                                                                                       | 옮길 수 있는 꼴                                     |
| --- | ----------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 9   | Claude Code hooks 레퍼런스          | code.claude.com/docs/en/hooks                   | 이벤트: PreToolUse(「Can block it」) · PostToolUse · SubagentStart · SubagentStop · TaskCreated · TaskCompleted · Stop · TeammateIdle 등. 훅 종류 command · prompt · agent · mcp_tool. PreToolUse 는 JSON `permissionDecision: "deny"` 로 막는다. | 도구 호출 전 차단, 서브에이전트 · 작업 종료 시 검사 |
| 10  | Claude Code hooks 가이드            | code.claude.com/docs/en/hooks-guide             | 종료 코드 2 + stderr 가 차단과 사유 전달. 연속으로 막으면 무시한다는 보호 장치(`stop_hook_active` 확인).(조사 F 에서 같은 문장 확인)                                                                                                              | 사유를 stderr 로 돌려 에이전트가 고치게 한다        |
| 11  | Claude Code 서브에이전트 프런트매터 | code.claude.com/docs/en/sub-agents              | 서브에이전트 정의에 `hooks` · `tools` · `disallowedTools` · `permissionMode` 를 둘 수 있고 PreToolUse · PostToolUse · Stop 이 SubagentStop 으로 바뀌어 동작한다.                                                                                  | 역할별 정의 파일에 도구 제한과 훅을 묶는다          |
| 12  | Claude Code 권한                    | code.claude.com/docs/en/permissions             | deny → ask → allow 평가, 좁은 allow 가 넓은 deny 를 못 이긴다. 관리 설정에서 `disableBypassPermissionsMode` 를 걸면 사용자가 못 끈다.                                                                                                             | 위험 명령 deny 를 관리 설정에 둔다                  |
| 13  | Claude Code 메모리 문서             | code.claude.com/docs/en/memory                  | 「Claude treats CLAUDE.md files and auto memory as context. They aren't enforced configuration.」 행동을 막으려면 PreToolUse 훅.                                                                                                                  | 문장 규칙은 맥락, 강제는 훅                         |
| 14  | Claude Code 스킬 · 모범 사례        | code.claude.com/docs/en/skills · best-practices | `disable-model-invocation: true` 로 모델이 스스로 부르지 못하게 한다. 규칙 문서는 길수록 묻힌다.                                                                                                                                                  | 위험한 절차는 사용자 호출 전용으로                  |

### 옮길 수 있는 안 후보 (Q5)

- 안 1. GitHub 보호 브랜치: 필수 상태 검사 + 승인 수 + 새 커밋 시 승인 무효화. 곳: GitHub.
- 안 2. OWNERS 파일: 디렉터리별 reviewer · approver 지정. 곳: Kubernetes · Chromium.
- 안 3. GitLab 에이전트 승인 통제: 규칙 · 에이전트 설정 변경은 사람 승인, 지시는 보호 브랜치에서 로드. 곳: GitLab 핸드북.
- 안 4. Claude Code PreToolUse · SubagentStop 훅 + 서브에이전트 프런트매터로 도구와 모델 제한. 곳: Claude Code hooks · subagents.

---

## Q6. 일하는 층이 같은 층 세션을 더 띄워 일을 다시 나눠도 되는가

### 실제 회사 · 조직

| #   | 곳                       | URL                                                                                    | 확인한 사실                                                                                                                                                                                                                           | 옮길 수 있는 꼴                                                   |
| --- | ------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | Google SRE 책 사고 관리  | sre.google/sre-book/managing-incidents/                                                | 한 사람의 부하가 과해지면 「needs to ask the planning lead for more staff」, 그다음 그 사람이 일을 맡기고 하위 사고(subincidents)를 만들 수도 있다. 역할 리더가 시스템 구성요소를 동료에게 맡기고 상위 정보만 보고받는 방식도 적는다. | 사람은 계획 담당에게 요청해 인원을 받고, 받은 뒤에는 직접 나눈다  |
| 2   | Atlassian 사고 대응      | atlassian.com/incident-management/handbook/incident-response                           | 역할 위임은 incident manager 가 한다. 호출로 들어온 사람에게 IM 이 역할(Tech Lead · Communications Manager)을 맡기고, 필요하면 새 역할도 만들어 위임한다. Tech Lead 는 기술 팀을 운영한다.                                            | 인원 추가와 역할 배정은 조율자(IM) 몫, 일하는 사람은 호출을 요청  |
| 3   | GitLab 핸드북 사고 관리  | handbook.gitlab.com/handbook/engineering/infrastructure-platforms/incident-management/ | 「There is only ever one owner of an incident」. Incident Lead 는 소유권을 다른 엔지니어에게 넘기거나 IM 에게 올릴 수 있고, 「engage the next role in the hierarchy for support」 도 할 수 있다.                                      | 책임자는 늘 한 명. 도움이 필요하면 바로 위 단계를 부른다          |
| 4   | PagerDuty 사고 대응 문서 | response.pagerduty.com/training/incident_commander/                                    | IC 는 직접 조치 · 로그 조사를 하지 말고 「Those tasks should be delegated.」 작업은 개인에게 맡기고 시간 제한을 두며 확인 응답을 받는다.                                                                                              | 지휘자는 손을 쓰지 않고 맡기며, 맡길 때 담당 · 시한 · 확인이 있다 |
| 5   | GitLab 핸드북 DRI        | handbook.gitlab.com/handbook/people-group/directly-responsible-individuals/            | DRI 는 최종 결정권을 가지되 관련자와 상의해 「divide tasks effectively」 한다.                                                                                                                                                        | 책임자가 상의 뒤 직접 일을 나눈다(요청 단계가 따로 없다)          |
| 6   | Basecamp Shape Up 13장   | basecamp.com/shapeup/3.4-chapter-13                                                    | 과제 목록은 미리 정해지지 않고 일하며 발견된다. 「to-do lists actually grow as the team makes progress」. 팀이 범위(scope)를 스스로 정의하고 나눈다(8장 쿨다운에는 「The team can self-organize」).                                   | 담당 팀이 일의 쪼개기를 스스로 한다. 사전 배정 없음               |

### 프레임워크 · 공식 문서

| #   | 곳                                 | URL                                                                  | 확인한 사실                                                                                                                                                                                                                                                                                                                   | 옮길 수 있는 꼴                                             |
| --- | ---------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 7   | Claude Code subagents 문서         | code.claude.com/docs/en/sub-agents                                   | 「Nested subagents」 절이 있다. 한 단계 아래 서브에이전트가 병렬 하위 과제를 다시 띄울 수 있고(예: reviewer 가 finding 마다 verifier), 맡은 서브에이전트는 결과를 기다린다. 깊이 상한을 넘으면 Agent 도구가 빠진다. 동시 실행 기본 20개이고 넘으면 「Concurrent subagent limit reached」 로 거부.                             | 허용하되 깊이 · 동시 개수 상한을 둔다                       |
| 8   | Claude Agent SDK 서브에이전트 문서 | code.claude.com/docs/en/agent-sdk/subagents                          | 「a subagent can spawn subagents of its own, so one prompt can grow into a tree of agents」. 상한 셋: 깊이(`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`, 기본 3층, 1 이면 서브에이전트가 못 띄움) · 동시(`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`, 기본 20) · 지출(`maxBudgetUsd`, 기본 상한 없음). 상한에 닿으면 새로 띄우기를 거부. | 깊이 · 동시 · 지출 세 가지 상한을 환경 변수로               |
| 9   | Claude Code agent teams 문서       | code.claude.com/docs/en/agent-teams                                  | 「No nested teams: teammates cannot spawn their own teammates. Only the lead can manage the team.」 세션당 팀 하나.                                                                                                                                                                                                           | 인원을 늘리는 권한은 lead 한 곳만                           |
| 10  | Anthropic 멀티 에이전트 리서치     | anthropic.com/engineering/multi-agent-research-system                | lead 가 복잡도에 따라 서브에이전트 수를 정한다(단순 1 · 비교 2–4 · 복잡 10+). 「the lead agent spins up 3-5 subagents in parallel」. 규칙을 박은 이유는 단순 질의에 과다 투입하던 초기 실패. 하위 에이전트가 다시 나누는지는 글에 없어 「미확인」.                                                                            | 나누는 권한은 lead 에 두고 투입 규모 규칙을 지시문에 박는다 |
| 11  | OpenAI Agents SDK                  | openai.github.io/openai-agents-python/multi_agent/ · running_agents/ | 두 패턴: agents as tools(manager 가 제어를 쥐고 전문 에이전트를 도구로 호출), handoffs(대화를 넘김). 실행 루프는 `max_turns` 를 넘으면 `MaxTurnsExceeded`.                                                                                                                                                                    | 관리자만 호출하는 패턴과 넘기는 패턴을 나누고 턴 상한       |
| 12  | CrewAI 에이전트 · 계층 프로세스    | docs.crewai.com/en/concepts/agents · /learn/hierarchical-process     | `allow_delegation`: 「Allow the agent to delegate tasks to other agents. Default is False.」 계층 프로세스 문서는 위임이 「disabled by default to give users explicit control」. `max_iter` 기본 20.                                                                                                                          | 위임은 기본 금지, 필요한 에이전트에만 켠다                  |
| 13  | LangChain 멀티 에이전트 문서       | docs.langchain.com/oss/python/langchain/multi-agent                  | Subagents 패턴: 「A main agent coordinates subagents as tools. All routing passes through the main agent」. Handoffs 는 에이전트끼리 직접 넘긴다.                                                                                                                                                                             | 모든 배분이 main 을 거치는 구조                             |

AutoGen: Magentic-One 문서에서 Orchestrator 가 계획을 세우고 다른 에이전트에 위임하며 진행을 추적한다는 것까지만 확인했다. 중첩(nested) 허용 · 깊이 · 동시 상한은 해당 문서를 못 받아 「미확인」(표본 밖).

### 옮길 수 있는 안 후보 (Q6)

- 안 1. 금지: 하위는 다시 나누지 않고, 나눌 일이 보이면 위에 요청. 곳: Claude Code agent teams(팀원은 팀원을 못 띄움) · GitLab 핸드북(owner 한 명, 위 단계 호출) · LangChain Subagents(모든 배분이 main 경유).
- 안 2. 위 세션에 인원 요청 후 받은 뒤 직접 나눔. 곳: Google SRE 책(계획 담당에게 인원 요청, 이후 맡기기) · Atlassian(IM 이 역할 위임).
- 안 3. 허용하되 상한: 깊이 · 동시 개수 · 지출 상한. 곳: Claude Agent SDK(깊이 기본 3 · 동시 기본 20 · 지출 상한).
- 안 4. 기본 금지, 필요한 에이전트에만 켬. 곳: CrewAI `allow_delegation` 기본 False.

회사 문서에서 「직접 나눈다」(안 3 · 안 4의 사람 쪽 선례)는 GitLab DRI · PagerDuty IC · Shape Up 팀, 「요청한다」(안 1 · 안 2)는 Google SRE · Atlassian · GitLab 사고 관리에서 확인했다.

---

## 한계

- 본문을 받아 읽었지만 문서가 계속 바뀐다(2026-11-23 기준). 특히 Claude Code 문서의 이벤트 · 필드 목록.
- GitLab 핸드북 에이전트 승인 규정은 2026-11 현재 문구이고 시행 범위는 확인하지 못했다.
- 「미확인」으로 남긴 곳은 표본에 넣지 않았다: GitHub CODEOWNERS 소개, Microsoft 플레이북 코드 리뷰 · DoD, Basecamp 자동 체크인, GitLab 비동기 스탠드업, LangGraph supervisor 용어, Amazon 6-pager 형식, Spotify squad 정의.
- 실제 회사에서 AI 에이전트 위임을 문서화한 곳은 GitLab 뿐이라 3층 세션 구조의 직접 선례는 근거 약함. 나머지는 사람 팀 방식을 에이전트로 옮기는 유추다.
