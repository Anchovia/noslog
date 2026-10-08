# 공용 UI 사용과 검증

디자인 값의 원본은 [디자인 가이드](../design/README.md)와 `app/styles/tokens.css`다.
이 문서는 공용 부품 사용법과 Storybook 검증 방법만 관리한다.

## 실행

```bash
npm run storybook
npm run test:storybook
npm run build-storybook
```

Storybook은 localhost:6006에서 공용 부품만 표시한다. 테스트는 별도 Vite 서버와
Chromium을 사용하며 개발 서버·DB·로그인·외부 저장소를 사용하지 않는다.
브라우저가 없는 환경에서는 먼저 `npx playwright install chromium`을 실행한다.
실행 전 6006이 사용 중이면 다른 세션을 종료하지 말고 포트를 지정한다.

```bash
npm run storybook -- --port 6007
```

기존 `npm test`는 Node 기반 단위 테스트를 그대로 실행한다. 브라우저 부품 검사는
`npm run test:storybook`으로 별도 실행하며 CI에서도 필수 작업으로 실행한다.

## 부품 선택

| 부품               | 사용 기준                                                       |
| ------------------ | --------------------------------------------------------------- |
| `Button`           | 동작용. 화면 이동은 링크. L 기본, M은 `size="sm"`               |
| `IconButton`       | 아이콘만 있는 동작. `label` 필수, 내부 아이콘은 `aria-hidden`   |
| `FormField`        | 라벨·도움말·오류·성공 메시지의 틀. 입력 `id`와 연결             |
| `Input`·`TextArea` | 네이티브 입력. 검증·저장·권한은 호출부 책임                     |
| `Select`           | 배타 선택. `value`·`onValueChange` 제어, 빈 문자열 옵션 지원    |
| `SegmentedControl` | 짧은 배타 선택. 방향키·Home·End로 선택과 포커스 이동            |
| `ModalDialog`      | 보호된 포커스가 필요한 창. 제목 필수, 트리거로 포커스 복귀 연결 |
| `Checkbox`         | 저장하는 폼의 켜기·끄기. 보이는 `label` 필수                    |
| `Switch`           | 즉시 적용하는 켜기·끄기. 접근성 이름 필수                       |
| `AreaTabs`         | 페이지 안 큰 구역 전환. 방향키 탐색 후 Enter/Space로 활성화     |

초기 스토리는 위 부품과 토큰 연결을 다룬다. 나머지 공용 부품도 변경할 때 스토리를
추가한다. 사용하지 않는 부품을 미리 만들거나 제품의 상태·동작을 새로 정의하지 않는다.

## 폼 연결 예시

```tsx
<FormField id="nickname" label={t("onboarding.nickname")} error={error}>
    <Input
        id="nickname"
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={fieldDescription("nickname", {
            error: Boolean(error),
        })}
    />
</FormField>
```

`fieldDescription`은 도움말·오류 ID를 조합한다. 성공 메시지를 설명으로 제공할 때는
`${id}-success`를 직접 연결한다. 공개 화면의 문구는 기존 ko·ja·en 번역을 사용한다.
재사용 가능한 검증과 데이터 저장에는 기존 Zod·RHF·Server Action 규칙을 따른다.

## 토큰과 Tailwind

`app/styles/tailwindTheme.css`는 기존 토큰을 참조하는 별칭만 제공한다.
색·간격·모서리·글꼴·컨트롤 높이에 새 값을 만들지 않는다.

```tsx
<div className="noslog-ui">
    <section className="flex flex-col gap-nl-16 rounded-nl-container bg-nl-surface p-nl-16">
        <p className="nl-body text-nl-content">...</p>
    </section>
</div>
```

- 별칭은 `.noslog-ui` 안에서만 사용한다. 포털에도 기존 래퍼를 유지한다.
- `gap-nl-16`은 16px 토큰을 참조한다. 기존 `gap-16`의 Tailwind 스케일은 바꾸지 않는다.
- 구역 간격은 `gap-nl-section`, 컨트롤 높이는 `h-nl-control`처럼 역할 별칭을 쓴다.
- 글자 조합은 기존 `nl-body`·`nl-control` 등의 클래스를 쓴다. 크기·줄 높이·굵기를 임의로 조합하지 않는다.
- 부품 규격을 호출부 유틸리티로 덮어쓰지 않는다. 공통 변경은 공용 소스에서 한다.
- 관리자·채보 화면을 별칭으로 일괄 전환하지 않는다.

## 스토리 작성

- 부품 옆에 `<부품>.stories.tsx`를 둔다. `Meta`·`StoryObj`로 타입을 검사한다.
- Props 용도는 JSDoc 또는 `parameters.docs.description.component`에 적는다.
- 정상·비활성·오류·성공·로딩 등 부품이 실제 지원하는 상태를 기록한다.
- 크기·variant 비교와 긴 문구를 포함한다. 없는 상태를 스토리를 위해 제품에 추가하지 않는다.
- `play`에서는 역할과 접근성 이름으로 찾고 의미 있는 동작 결과를 검사한다.
- 대화상자는 열기·닫기·Escape·포커스 유지와 복귀, 선택 부품은 키보드·비활성 항목,
  폼은 라벨·오류 설명·오류 복구를 확인한다.
- 테스트는 로컬 상태·mock 함수만 사용한다. 실제 Server Action·업로드·DB 요청을 호출하지 않는다.
- Portal은 `screen`으로 조회하고 일반 부품은 `within(canvasElement)`로 범위를 좁힌다.

## 접근성과 화면 검증

Storybook의 axe 검사는 WCAG 2.0·2.1 A/AA 위반을 테스트 실패로 처리한다.
검사를 통과시키려고 규칙을 끄거나 예외를 늘리지 않는다. 자동 검사는 모든 접근성을
보장하지 않으므로 키보드·보조 기술·텍스트 확대는 관련 변경에서 별도 확인한다.

도구 모음의 언어는 LocaleProvider와 포털의 문서 언어에 적용된다. 부품 문구는
각 스토리의 예제이며 도구 모음이 임의 문자열을 자동 번역하지는 않는다.
반응형 검증은 가이드의 320·390·768·1280 및 전환 경계 양쪽을 따른다.
Storybook은 실제 페이지의 레이아웃·데이터·권한·저장 흐름 검증을 대신하지 않는다.
