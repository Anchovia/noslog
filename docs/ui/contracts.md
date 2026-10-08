# 공용 UI와 기능 화면의 계약

Props의 타입과 기본값은 각 부품 소스가 원본이다. 여기에는 호출부가 지켜야 할 값·이벤트·상태 연결을 적는다.
디자인 값은 [디자인 가이드](../design/README.md)를 따른다.

## 공통

- 제어하는 부품에는 현재 값과 변경 콜백을 함께 준다. 콜백 호출만으로 저장·권한 확인이 끝난 것은 아니다.
- 입력 ref는 실제 input/textarea 또는 Select 트리거에 연결한다. RHF가 오류 칸에 포커스를 보낼 수 있어야 한다.
- 접근성 이름은 보이는 label을 우선하고, 아이콘 동작은 번역된 이름을 전달한다.
- `className`은 배치용이다. 공용 높이·글자·모서리·상태를 덮어쓰지 않는다.
- 오류·성공·busy·disabled가 함께 주어질 때 소스에 정의된 우선순위를 확인한다. 지원하지 않는 조합은 새로 만들지 않는다.
- 상태 비교·사용 예는 각 부품 Storybook Autodocs에 있다. 새 Props에는 용도·기본값·콜백 값·ref 대상 설명을 붙인다.

## 버튼과 입력

| 부품                                                          | 값·기본값·콜백·ref 계약                                                                                                                                                                                |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Button`                                                      | 네이티브 button Props/ref를 전달한다. `type` 기본은 `button`, variant 기본은 primary, sm은 M. 제출에는 `type="submit"`을 명시한다. `variant={null}`은 변형 클래스를 생략한다.                          |
| `ActionButton`                                                | `busy=false` 기본. busy이면 스피너·aria-busy·aria-disabled를 붙이고 onClick을 막는다. `busyLabel`이 없으면 기존 children을 유지한다. form의 Enter/requestSubmit까지 막는 책임은 form 제출 잠금에 있다. |
| `IconButton`                                                  | 번역된 `label` 필수, children은 장식 아이콘. ghost·L 기본, compact는 M. ref는 button에 전달된다.                                                                                                       |
| `FormField`                                                   | id를 자식 입력 id와 맞춘다. help는 항상 별도 설명이고 error가 success보다 우선한다. Input의 aria-invalid/aria-describedby는 호출부가 설정한다.                                                         |
| `Input`·`TextArea`                                            | 네이티브 Props/ref를 그대로 전달한다. RHF register로 비제어 입력을 연결할 수 있다. FormField가 입력 값을 소유하지 않는다.                                                                              |
| `Checkbox`                                                    | label 필수. 네이티브 checked/onChange 또는 defaultChecked/register를 사용한다. ref는 내부 input에 전달된다. 저장하는 폼에 쓴다.                                                                        |
| `Switch`                                                      | checked와 onCheckedChange 필수. 콜백은 다음 boolean 값이다. 즉시 적용되는 설정용이며 비제어 defaultChecked를 지원하지 않는다. 연결된 label 또는 aria-label이 필요하다.                                 |
| `Select`                                                      | value/onValueChange 필수, 콜백은 option의 string value. 빈 문자열 옵션도 지원한다. 내부 sentinel은 외부로 노출되지 않는다. invalid는 트리거 aria-invalid, triggerRef는 button ref다.                   |
| `SearchField`                                                 | value 필수. 입력 onChange는 네이티브 이벤트, onClear는 인자 없는 삭제 요청이다. busy가 지우기 버튼보다 우선하며 입력 자체를 자동 잠그지 않는다.                                                        |
| `SegmentedControl`·`FilterChips`·`SelectionList`·`RadioGroup` | 값과 선택 콜백을 호출부에서 소유한다. radio/checkbox/탭 의미를 서로 바꾸지 않는다. 비활성 항목·선택 해제·다중 선택 지원은 각 Props와 스토리를 따른다.                                                  |
| `RangeSlider`·`ScalePicker`                                   | 숫자 범위와 현재 값을 받는다. RangeSlider의 변경과 확정 콜백을 구분한다. ScalePicker 기본 범위는 0–4이며 같은 값을 다시 누르는 해제 동작을 보존한다.                                                   |

```tsx
<FormField
    id="nickname"
    label={t("onboarding.nickname")}
    error={error}
    success={success}
>
    <Input
        {...register("username")}
        id="nickname"
        aria-invalid={Boolean(error)}
        aria-describedby={
            [
                fieldDescription("nickname", { error: Boolean(error) }),
                !error && success ? "nickname-success" : null,
            ]
                .filter(Boolean)
                .join(" ") || undefined
        }
    />
</FormField>
```

## 창·이동·표시

- `ModalDialog`·`FullScreenDialog`·`ResponsiveDialog`는 open/onOpenChange로 제어한다. onOpenChange는 변경 요청이며 외부 상태를 직접 바꾸지 않는다.
  ResponsiveDialog는 672 미만 전체 화면이고 modalFooter/fullScreenFooter가 공통 footer보다 우선한다.
  트리거가 없는 외부 제어 창은 onCloseAutoFocus로 실제 열었던 동작에 포커스를 돌려준다.
- 메뉴·필터·탭은 현재 값/위치와 실행 콜백만 제공한다. `AreaTabs`는 방향키로 포커스 후 Enter/Space로 적용한다.
  `AreaTabLinks`·`FilterChipLinks`·`BackLink`는 주소 이동이다. 저장 콜백과 혼용하지 않는다.
- `Pagination`은 현재 page와 이동 콜백 또는 href를 사용한다. busy는 새 이동을 막는다. 한 페이지이면 기본으로 숨고 showSingle일 때 표시한다.
- `MarkdownEditor`는 value/onChange 제어 입력이다. 에디터 라벨·서식 라벨·첨부 콜백을 현재 언어로 제공한다.
  readOnly 상태의 입력·서식 동작과 서버 저장을 구분한다. 실제 업로드는 호출부 책임이다.
- `FileRow`는 선택된 File을 표시하고 onRemove로 제거를 요청한다. 파일 업로드나 스토어 삭제를 직접 하지 않는다.
  `PhotoViewer`는 사진 목록과 선택 인덱스·닫기 콜백을 표시한다. 음원이나 서버 저장을 추가하지 않는다.
- `Avatar`·국가·검정·판정 표식은 표시용이다. 이미 주변 텍스트가 의미를 전달하면 장식으로 처리한다.
- `LineChart`·`BarList`·`StackedBar`·`StatStrip`은 전달된 데이터 의미를 바꾸지 않는다. 빈 값·0·비공개를 호출부 계약대로 구분하고 정확한 텍스트/표를 유지한다.
- `StatusMessage`·`ResultState`·`LoginPrompt`는 상태와 이미 번역된 안내를 받는다. `SkeletonText`·LoadingStatus는 같은 부품의 로딩 틀이다.
  `AppToaster`가 있다고 모든 칸 오류를 토스트로 바꾸지 않는다.

## 기능 화면

### 제보

`FeedbackDialog`는 실제 Server Action·Blob·읽음 상태를 연결하고 `FeedbackDialogView`는 같은 폼/창을 표시한다.

- View의 submitReport는 Zod 검증 후 값과 File|null을 받는다. 파일은 콜백에만 전달하고 View가 업로드하지 않는다.
- 실패는 내용·선택 파일을 보존한다. 성공은 기존 완료 안내를 표시하고 내용을 초기화한다.
- 같은 이벤트 루프의 반복 submit과 제출 중 Enter를 한 요청으로 제한한다. 제출 중 닫기는 기존 정책대로 무시한다.
- 외부 open 변경/해제로 수명이 바뀌면 이전 제출 결과가 새 창을 변경하지 않는다. 이미 실행된 서버 저장을 취소한다는 뜻은 아니다.
- feedbackList는 내 제보 탭에서만 렌더한다. 실제 조회·읽음 처리는 연결 컴포넌트의 책임이다.
- trigger 생략은 기본 버튼, null은 트리거 없는 외부 제어다. open 생략은 내부 제어다.

### 온보딩

`OnboardingForm`은 실제 저장/닉네임 확인을 기본으로 연결한다. `OnboardingFormView`는 두 콜백을 반드시 받는다.

- 1단계는 닉네임·국가 확인, 2단계만 최종 저장이다. 1단계 값과 공개 설정을 뒤로 가기·실패에서 보존한다.
- 같은 값의 진행 중 닉네임 확인을 공유한다. 값 변경의 순서를 추적해 A→B→A에서도 이전 A 응답을 반영하지 않는다.
- 닉네임 확인 장애는 기존처럼 최종 서버 검증으로 넘긴다. 저장 서버의 고유성/권한 검사는 생략하지 않는다.
- 최종 저장은 FormData를 받으며 실제 성공은 서버 redirect다. Storybook은 성공 redirect를 흉내 내어 새 제품 상태를 만들지 않는다.
- 서버가 닉네임/국가 오류를 돌려주면 1단계 해당 칸에 포커스한다. 그 밖의 실패는 현재 입력과 함께 표시한다.
