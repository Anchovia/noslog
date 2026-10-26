# e2e 로컬 실행

화면 · 흐름을 바꿨고 관련 스펙이 있으면 그 스펙 하나를 이 순서로 돌린다. 전체 실행은 먼저 묻는다.

사용자의 localhost:3000 에는 돌리지 않는다(설정 기본값은 3100). 한 번에 한 세션만 돌리고, 포트 3100 이 쓰이고 있으면 기다린다.

1. 리포를 리포 밖 임시 폴더로 복사한다(`.git` · `.next` · `node_modules` · `.env*` 제외). `node_modules` 는 `cp -c -R` 로 복제한다(링크는 Turbopack 이 거부).
   `.env` 는 e2e 값만 새로 쓴다(`DATABASE_URL=postgresql://<사용자>@localhost:5432/noslog_e2e` · 임시 `COOKIE_PASSWORD` · `BOOKMARKLET_SECRET`).
   실제 `.env*` 를 가져오지 않는다(`.env.production.local` 에 운영 값이 있다).
2. 복사본에서 `npx prisma migrate deploy` → `E2E_SEED=1 npm run db:seed:e2e` → `node prisma/import-music-catalog.mjs --apply`.
3. 복사본에서 `npx next build && npx next start -p 3100`, 리포에서 `DATABASE_URL=<위 e2e 주소> npx playwright test e2e/<스펙>`.
   기본은 모바일 한 폭이고, 두 폭이 필요한 테스트만 `@responsive` · `@desktop` 태그를 단다. 끝나면 3100 서버를 끈다.
