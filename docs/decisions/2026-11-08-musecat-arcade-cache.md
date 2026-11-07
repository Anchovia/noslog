# 뮤즈캣 오락실 상세 캐시

- 상태: 유효
- 날짜: 2026-11-08
- 분야: 기능
- 고른 사람: 사용자(캐시부터 하자는 지시)

## 맥락

live 모드 오락실 상세는 열 때마다 뮤즈캣에 두 번(오락실 정보 · 공지) 요청했고, 모든 요청이 `no-store` 였다. 뮤즈캣 API 에는 요청 한도(429)가 있고, 오락실 응답에 공지를 함께 받는 `expand` 값이 없어 요청 수를 하나로 줄일 수 없다.

## 결정

- 오락실 정보와 공지를 오락실(뮤즈캣 id · NosLog 주소)마다 5분 동안 서버 캐시(`unstable_cache`)에 둔다. 토큰은 키에서 빼서 연결한 사람 모두가 같은 값을 쓴다.
- 태그는 `musecat-arcade-<뮤즈캣 id>`. NosLog 에서 그 오락실에 고장 제보 · 반응 · 캠페인 응답이 성공하면 `updateTag` 로 바로 비운다.
- 오락실 정보가 실패한 응답(401 포함)과 공지만 실패한 응답은 담지 않는다.

## 고르지 않은 안

- 공지를 펼칠 때만 부르기: 공지 유무 · 미리보기를 처음에 알 수 없어 상세 화면 모양이 바뀐다. 시안으로 따로 고른다
- 사용자마다 따로 캐시: 오락실 응답은 연결한 누구에게나 같아 같은 오락실을 여러 사람이 열 때 요청이 줄지 않는다

## 근거

- 뮤즈캣 OpenAPI(`db-pr-99.musecat.app/developer/openapi.yaml`): `ArcadeValueResponse` 의 칸은 `admin · basic · hour · sns · gtk · game · photo` 뿐이고, 공지는 `/developer/v1/account/arcade/notice` 로 따로 받는다. 경로마다 429 응답이 있다.
- NosLog 가 쓰는 오락실 응답 칸에는 보는 사람마다 다른 값(`canManageReports` 등)이 없다.

## 바뀌는 곳

- 문서: [기능 규칙](../design/product-rules.md)의 뮤즈캣 협업 절
- 코드: `features/musecat/server/musecat-arcade-service.ts` · `lib/cache-tags.ts` · `tests/musecat-connection-errors.test.ts`
