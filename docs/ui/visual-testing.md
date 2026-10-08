# Storybook 시각 비교

기존 Playwright로 승인된 화면의 크기·간격·줄바꿈 변화를 검사한다. 외부 계정이나 Chromatic 토큰은 필요 없다.
실제 로그인·Server Action·Blob 업로드·DB 조회는 실행하지 않는다. 기능 스토리의 연결 콜백은 로컬 mock이다.

## 검사 범위

- 버튼 상태/크기, FormField 오류, Select, Dialog의 공용 규격.
- 온보딩과 제보 화면의 한국어·일본어·영어. 390px·1280px 기준 이미지 총 20개.
- 기능 폼은 320·390·671·672·768·1055·1056·1280px에서 가로 넘침, 입력 글자/높이, Dialog 전환 경계를 추가 검사한다.

기준 환경은 Playwright **1.61.1**, 공식 **v1.61.1-noble** 이미지의 **Linux amd64 Chromium**이다.
폰트 로딩을 기다리고 동작 줄이기·애니메이션 정지·커서 숨김·deviceScaleFactor 1을 적용한다. 픽셀 차이를 허용하지 않는다.
Playwright 버전을 바꿀 때 CI 이미지와 Docker 실행 도구 버전도 함께 바꾸고 기준 이미지를 검토한다.

## 로컬 실행

Docker를 실행하고 `npm ci`를 마친 뒤:

```sh
npm run test:visual:docker
```

도구가 Storybook을 임시 폴더에 빌드하고 테스트에 필요한 JS 패키지만 컨테이너에 복사한다.
`.env*`·실제 서버·macOS 네이티브 모듈은 복사하지 않는다. 결과·실패 이미지의 임시 경로를 출력한다.
macOS/ARM에서 `test:visual`을 직접 실행하면 다른 OS 기준이 만들어지지 않도록 오류를 낸다.

승인된 시각 변경으로 기준을 갱신해야 할 때만:

```sh
npm run test:visual:docker -- --update-snapshots
```

검사 성공 후 `visual/snapshots`로 이미지를 복사한다. 변경 이미지를 열어 확인하고 `git diff`를 검토한 다음,
일반 비교 명령을 다시 실행한다. 실패를 없애려고 기준을 갱신하지 않는다.

## CI

독립 `visual` job이 같은 공식 이미지에서 `npm ci` → `npm run build-storybook` → `npm run test:visual`을 실행한다.
실패 시 `storybook-visual-differences` artifact에 예상·실제·차이 이미지를 7일 보관한다.
기준이 없거나 화면이 바뀌면 실패하며 CI에서 기준 이미지를 자동 승인하지 않는다.

시각 비교는 동작·접근성 검사와 함께 쓴다. 현재 Badge/LineChart의 기존 대비 위반 두 건은
Storybook 접근성 검사에서 계속 실패로 표시하며 시각 비교 통과로 해소했다고 보지 않는다.
